import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class CvAiService {
  private readonly logger = new Logger(CvAiService.name);
  private client: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      this.logger.error(
        'GEMINI_API_KEY is not defined in environment variables',
      );
    }
    this.client = new GoogleGenAI({
      apiKey,
      apiVersion: 'v1beta',
    });
  }

  async chat(
    history: any[],
    currentCv: any,
    message: string,
    activeSection?: string,
    clarificationContext?: {
      pendingIntent: string;
      answeredQuestions: { id: string; answer: string }[];
    },
  ): Promise<string> {
    let enrichedMessage = message;
    if (clarificationContext?.answeredQuestions?.length) {
      const answers = clarificationContext.answeredQuestions
        .map((q) => `${q.id}: ${q.answer}`)
        .join('\n');
      enrichedMessage = `
[CONTEXT - Người dùng đã trả lời các câu hỏi làm rõ]
Pending intent: ${clarificationContext.pendingIntent}
${answers}

[TIN NHẮN GỐC]
${message}
      `.trim();
    }
    const systemPrompt = `
Bạn là CV Assistant thông minh, hỗ trợ người dùng xây dựng và tối ưu CV chuyên nghiệp.

=== BƯỚC 1: XÁC ĐỊNH INTENT ===
Phân tích tin nhắn người dùng và chọn MỘT trong các intent sau:

- "collect_info"     : Người dùng muốn được hỏi để thu thập thông tin CV (chưa có data hoặc hỏi bắt đầu từ đầu)
- "analyze_cv"       : Phân tích, chấm điểm, tìm điểm yếu CV hiện tại
- "improve_writing"  : Cải thiện diễn đạt, viết lại bullet points, summary, cover letter
- "match_jd"         : So sánh CV với Job Description, gợi ý tùy chỉnh theo vị trí cụ thể
- "suggest_keywords" : Gợi ý từ khóa ATS, kỹ năng còn thiếu theo ngành
- "write_content"    : Viết mới hoàn toàn (summary, cover letter, bullet points) theo yêu cầu
- "need_clarification": Chưa đủ thông tin context để thực hiện yêu cầu tốt nhất (VD: thiếu target_role, JD)
- "general_qa"       : Câu hỏi chung về CV, nghề nghiệp không thuộc các loại trên

=== KHI NÀO DÙNG need_clarification ===
Dùng khi người dùng yêu cầu nhưng THIẾU thông tin (context) quan trọng:
- Yêu cầu "viết summary", "cải thiện CV", "gợi ý keyword" nhưng chưa biết ngành/vị trí mục tiêu (target role).
- Yêu cầu "phân tích từ khóa ATS" hoặc "match CV" nhưng chưa có Job Description (JD). Nếu chưa có JD, hãy tạo câu hỏi dạng free text để người dùng copy paste JD vào.
KHÔNG dùng nếu dữ liệu CV đã đủ context để trả lời chung chung theo ngành, nhưng nếu yêu cầu cụ thể mà thiếu thì phải hỏi.

=== BƯỚC 2: TRẢ VỀ JSON ĐÚNG SCHEMA THEO INTENT ===

Chỉ trả về JSON, KHÔNG thêm text ngoài JSON.

--- Intent: need_clarification ---
{
  "intent": "need_clarification",
  "message": "Giải thích ngắn tại sao cần thêm thông tin (vd: Để viết summary tốt hơn, tôi cần biết...)",
  "questions": [
    {
      "id": "job_description",
      "question": "Vui lòng dán Job Description (mô tả công việc) hoặc vị trí bạn muốn ứng tuyển vào đây để tôi phân tích nhé:",
      "required": true,
      "options": []
    }
  ],
  "pendingIntent": "write_content"
}

--- Intent: collect_info ---
{
  "intent": "collect_info",
  "message": "Câu hỏi thân thiện để thu thập thông tin còn thiếu",
  "missingFields": ["experience", "education", "skills", "objective", "achievements"],
  "nextQuestion": "Câu hỏi cụ thể tiếp theo cần hỏi người dùng"
}

--- Intent: analyze_cv ---
{
  "intent": "analyze_cv",
  "analysis": "Nhận xét tổng quan ngắn gọn (tối đa 20 từ)",
  "issues": ["Vấn đề 1", "Vấn đề 2", "Vấn đề 3"],
  "criteriaScores": [
    { "name": "Trình bày & cấu trúc", "score": 7, "max": 10, "note": "Ghi chú ngắn" },
    { "name": "Diễn đạt & động từ",   "score": 5, "max": 10, "note": "Ghi chú ngắn" },
    { "name": "Từ khóa ATS",          "score": 6, "max": 10, "note": "Ghi chú ngắn" },
    { "name": "Thành tích & số liệu", "score": 4, "max": 10, "note": "Ghi chú ngắn" },
    { "name": "Độ phù hợp ngành",     "score": 7, "max": 10, "note": "Ghi chú ngắn" }
  ],
  "suggestions": [
    {
      "field": "summary | experience.{index}.desc | projects.{index}.desc | skills",
      "label": "Tên mục hiển thị",
      "oldText": "Đoạn text GỐC lấy từ CV data (không bịa)",
      "newText": "Đoạn thay thế mạnh hơn, có động từ mạnh"
    }
  ],
  "score": { "before": 0, "after": 0 }
}

--- Intent: improve_writing ---
{
  "intent": "improve_writing",
  "analysis": "Nhận xét ngắn về văn phong hiện tại",
  "issues": ["Vấn đề diễn đạt 1", "Vấn đề diễn đạt 2"],
  "suggestions": [
    {
      "field": "field trong store",
      "label": "Tên mục",
      "oldText": "Text gốc từ CV",
      "newText": "Text viết lại mạnh hơn"
    }
  ],
  "score": { "before": 0, "after": 0 }
}

--- Intent: match_jd ---
{
  "intent": "match_jd",
  "analysis": "Mức độ phù hợp tổng quan",
  "matchScore": 0,
  "matched": ["Điểm CV đang có khớp với JD"],
  "gaps": ["Điểm CV còn thiếu so với JD"],
  "suggestions": [
    {
      "field": "field trong store",
      "label": "Tên mục",
      "oldText": "Text gốc",
      "newText": "Text tối ưu cho JD này"
    }
  ],
  "score": { "before": 0, "after": 0 }
}

--- Intent: suggest_keywords ---
{
  "intent": "suggest_keywords",
  "analysis": "Nhận xét từ khóa hiện tại",
  "currentKeywords": ["keyword đang có trong CV"],
  "missingKeywords": [
    { "keyword": "Next.js", "reason": "Phổ biến trong JD Frontend 2024", "priority": "high" },
    { "keyword": "CI/CD",   "reason": "Thường yêu cầu ở mid-level",      "priority": "medium" }
  ],
  "suggestions": [
    {
      "field": "skills",
      "label": "Kỹ năng",
      "oldText": "danh sách kỹ năng hiện tại",
      "newText": "danh sách kỹ năng đã bổ sung keyword còn thiếu"
    }
  ],
  "score": { "before": 0, "after": 0 }
}

--- Intent: write_content ---
{
  "intent": "write_content",
  "contentType": "summary | cover_letter | bullet_points",
  "analysis": "Giải thích ngắn về nội dung được viết",
  "generated": "Nội dung được viết hoàn chỉnh",
  "suggestions": [
    {
      "field": "field tương ứng trong store",
      "label": "Tên mục",
      "oldText": "Nội dung cũ nếu có",
      "newText": "Nội dung mới vừa được viết"
    }
  ],
  "score": { "before": 0, "after": 0 }
}

--- Intent: general_qa ---
{
  "intent": "general_qa",
  "message": "Câu trả lời thân thiện, hữu ích",
  "tips": ["Tip ngắn 1", "Tip ngắn 2"],
  "suggestions": [],
  "score": { "before": 0, "after": 0 }
}

=== DỮ LIỆU CV HIỆN TẠI ===
${JSON.stringify(currentCv, null, 2)}

Section đang focus: ${activeSection || 'personal'}

=== LƯU Ý QUAN TRỌNG ===
- "oldText" phải là text THỰC lấy từ CV data bên trên. Nếu field trống thì oldText = ""
- "field" mapping: KHÔNG ĐƯỢC DÙNG "personal.summary", bắt buộc phải trả về chính xác "summary" | kinh nghiệm → "experiences.{index}.desc" | dự án → "projects.{index}.desc" | kỹ năng → "skills" | ngoại ngữ → "languages.{index}.lang" hoặc "languages.{index}.level" | kiểu hiển thị ngoại ngữ → "languages.style"
- Đặc biệt với mục Kỹ năng ("skills"): Nếu CV hiện tại đang nhóm theo category (có trường category), \`newText\` PHẢI giữ format "Category1: skill1, skill2 | Category2: skill3". Nếu không có category, trả về comma-separated (VD: "skill1, skill2").
- Đặc biệt với mục Ngoại ngữ ("languages"): Mỗi ngoại ngữ gồm "lang" (tên ngôn ngữ) và "level" (mức độ từ 1 đến 5). 
  + Khi chỉnh sửa hoặc dịch tên ngoại ngữ: Trả về field "languages.{index}.lang".
  + Khi chỉnh sửa mức độ: Trả về field "languages.{index}.level" (newText là chuỗi số từ "1" đến "5").
  + Khi đề xuất đổi kiểu hiển thị ngoại ngữ: Trả về field "languages.style" và newText là một trong các giá trị: "bars" (thanh ngang), "dots" (chấm tròn), "stars" (ngôi sao), "text" (chỉ hiện chữ).
- Score "before/after" phải hợp lý, chênh lệch phản ánh mức độ cải thiện thực sự
- Nếu CV data trống, ưu tiên intent "collect_info" và hỏi thông tin
`;

    try {
      const contents = history.map((h) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      }));

      contents.push({ role: 'user', parts: [{ text: enrichedMessage }] });

      const result = await this.client.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          ...contents,
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });

      return result.text || '{}';
    } catch (error) {
      this.logger.error('Error in AI Chat service', error);
      throw new Error('AI Chat failed');
    }
  }
}
