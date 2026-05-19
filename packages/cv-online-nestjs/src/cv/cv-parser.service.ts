import { Injectable, Logger, BadRequestException, HttpException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import * as mammoth from 'mammoth';
const pdfParse = require('pdf-parse');

@Injectable()
export class CvParserService {
  private readonly logger = new Logger(CvParserService.name);
  private client: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      this.logger.error('GEMINI_API_KEY is not defined in environment variables');
    }
    // New SDK uses GoogleGenAI class with apiKey in config
    this.client = new GoogleGenAI({
      apiKey,
      apiVersion: 'v1beta',
    });
  }

  async parseFile(file: Express.Multer.File): Promise<any> {
    const { mimetype, buffer } = file;
    let text = '';

    if (mimetype === 'application/pdf') {
      text = await this.extractTextFromPdf(buffer);
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      text = await this.extractTextFromDocx(buffer);
    } else if (mimetype.startsWith('image/')) {
      return this.parseImageWithAI(buffer, mimetype);
    } else {
      throw new Error('Unsupported file type');
    }

    return this.parseTextWithAI(text);
  }

  private async extractTextFromPdf(buffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      this.logger.error('Error extracting text from PDF', error);
      throw new Error('Failed to parse PDF file');
    }
  }

  private async extractTextFromDocx(buffer: Buffer): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (error) {
      this.logger.error('Error extracting text from DOCX', error);
      throw new Error('Failed to parse Word file');
    }
  }

  private async parseTextWithAI(text: string): Promise<any> {
    const prompt = `
      You are a world-class CV parsing assistant. Your task is to extract structured information from the following raw text of a resume/CV.
      
      CRITICAL VALIDATION RULE:
      Evaluate if the provided content is actually a CV, Resume, or Professional Candidate Profile. 
      If it is not a CV/Resume (e.g. it is programming code, a generic tutorial/guide, a food recipe, a general book chapter, a product description, random chatter, or any document unrelated to a person's professional history and contact details), you MUST return a JSON object with this exact format:
      {
        "error": "INVALID_CV",
        "message": "Nội dung tài liệu không giống một CV hoặc Lý lịch ứng viên. Vui lòng kiểm tra lại file của bạn."
      }

      IMPORTANT: If the content is indeed a CV/Resume, you MUST return a JSON object that matches the following EXACT structure:
      {
        "metadata": {
          "language": "en", // Output "en" for English or "vi" for Vietnamese based on the CV content
          "skillStyle": "tags", // Determine the visual style for skills based on the CV layout. Output "grouped" if skills are categorized into groups, "bars" if they have percentage/proficiency levels, or "tags" if it's a simple list.
          "languageStyle": "bars", // Determine the visual style for languages. Output "bars" for horizontal rating bars, "dots" for dot ratings, "stars" for star ratings, or "text" for simple text list.
          "sectionTitles": { // Translate these to the detected language. e.g. "Học vấn" for vi, "Education" for en
            "personal": "Liên hệ",
            "contact": "Liên hệ",
            "summary": "Giới thiệu",
            "experiences": "Kinh nghiệm",
            "education": "Học vấn",
            "skills": "Kỹ năng",
            "projects": "Dự án",
            "certifications": "Chứng chỉ",
            "languages": "Ngoại ngữ",
            "awards": "Giải thưởng"
          }
        },
        "personal": { "name": "", "role": "", "email": "", "phone": "", "address": "", "links": [], "summary": "" },
        "experiences": [{ "title": "", "company": "", "location": "", "from": "", "to": "", "desc": "" }],
        "education": [{ "degree": "", "school": "", "location": "", "from": "", "to": "", "desc": "" }],
        "skills": [{ "name": "", "category": "" }],
        "projects": [{ "name": "", "from": "", "to": "", "desc": "", "link": "", "tech": "" }],
        "certifications": [{ "name": "", "issuingOrganization": "", "issueDate": "", "expiryDate": "", "credentialId": "", "credentialUrl": "", "description": "" }],
        "languages": [{ "lang": "", "level": 1 }]
      }
      
      Instructions:
      - Split any time periods into "from" and "to" (e.g., "Jan 2020 - Now" becomes from: "Jan 2020", to: "Now").
      - For projects, "tech" should be a comma-separated string of technologies used (e.g., "React, Node.js, MongoDB").
      - For skills, return an array of objects. Each object has "name" (skill name) and "category" (the group it belongs to, e.g. "Languages", "Frameworks", "Tools", "Databases"). If the CV groups skills by category, preserve that grouping. If no grouping is present, leave "category" as empty string.
      - For languages, "level" should be a number from 1 to 5.
      - For certifications, return an array of objects matching the schema. Extract and split the certificate name, issuing organization (if any), and date/year of issue. For example, "English: TOEIC 650+ (certificate available May 22, 2026)" should be parsed as name: "TOEIC 650+", issuingOrganization: "ETS" (or appropriate issuer), issueDate: "2026", and description: "English: TOEIC 650+ (certificate available May 22, 2026)".
      - Standardized language certificates or tests (e.g., TOEIC, IELTS, TOEFL, HSK, JLPT, DELF, TestDAF, etc.) listed in the CV (even if they are written under education, experience, or languages in the raw text) MUST only be put into the "certifications" array. They MUST NOT be included in the "languages" array or "education" array.
      - CRITICAL: DO NOT automatically infer or generate a language entry (e.g., adding "English" or "Tiếng Anh" to the "languages" array) just because the candidate has a language certificate (e.g., TOEIC, IELTS) mentioned in their education or certificates. Only include languages in the "languages" array if they are EXPLICITLY and SEPARATELY listed as a spoken/written language in a designated languages section of the CV raw text. If the CV only mentions "TOEIC" or "IELTS" in the education or achievements section without separately listing "English" as a language, the "languages" array MUST NOT contain "English" (it should remain empty).

      RAW TEXT:
      ${text}
    `;

    try {
      const result = await this.client.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const jsonString = result.text;
      if (!jsonString) {
        throw new Error('Empty AI response');
      }

      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.error === 'INVALID_CV') {
        throw new BadRequestException(parsed.message);
      }

      return parsed;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Error parsing text with AI', error);
      throw new Error('AI parsing failed');
    }
  }

  private async parseImageWithAI(buffer: Buffer, mimetype: string): Promise<any> {
    const prompt = `
      You are a world-class CV parsing assistant. Below is an image of a resume/CV. 
      Analyze the image and extract all relevant information.

      CRITICAL VALIDATION RULE:
      Evaluate if the provided image content is actually a CV, Resume, or Professional Candidate Profile. 
      If it is not a CV/Resume (e.g. it is programming code, a generic tutorial/guide, a food recipe, a general book chapter, a product description, random chatter, or any document unrelated to a person's professional history and contact details), you MUST return a JSON object with this exact format:
      {
        "error": "INVALID_CV",
        "message": "Nội dung tài liệu không giống một CV hoặc Lý lịch ứng viên. Vui lòng kiểm tra lại file của bạn."
      }

      IMPORTANT: If the image content is indeed a CV/Resume, you MUST return a JSON object that matches the following EXACT structure:
      {
        "metadata": {
          "language": "en", // Output "en" for English or "vi" for Vietnamese based on the CV content
          "skillStyle": "tags", // Determine the visual style for skills based on the CV layout. Output "grouped" if skills are categorized into groups, "bars" if they have percentage/proficiency levels, or "tags" if it's a simple list.
          "languageStyle": "bars", // Determine the visual style for languages. Output "bars" for horizontal rating bars, "dots" for dot ratings, "stars" for star ratings, or "text" for simple text list.
          "sectionTitles": { // Translate these to the detected language. e.g. "Học vấn" for vi, "Education" for en
            "personal": "Liên hệ",
            "contact": "Liên hệ",
            "summary": "Giới thiệu",
            "experiences": "Kinh nghiệm",
            "education": "Học vấn",
            "skills": "Kỹ năng",
            "projects": "Dự án",
            "certifications": "Chứng chỉ",
            "languages": "Ngoại ngữ",
            "awards": "Giải thưởng"
          }
        },
        "personal": { "name": "","role":"", "email": "", "phone": "", "address": "", "links": [], "summary": "" },
        "experiences": [{ "title": "", "company": "", "location": "", "from": "", "to": "", "desc": "" }],
        "education": [{ "degree": "", "school": "", "location": "", "from": "", "to": "", "desc": "" }],
        "skills": [{ "name": "", "category": "" }],
        "projects": [{ "name": "", "from": "", "to": "", "desc": "", "link": "", "tech": "" }],
        "certifications": [{ "name": "", "issuingOrganization": "", "issueDate": "", "expiryDate": "", "credentialId": "", "credentialUrl": "", "description": "" }],
        "languages": [{ "lang": "", "level": 1 }]
      }
      
      Instructions:
      - Split any time periods into "from" and "to" (e.g., "Jan 2020 - Now" becomes from: "Jan 2020", to: "Now").
      - For projects, "tech" should be a comma-separated string of technologies used (e.g., "React, Node.js, MongoDB").
      - For skills, return an array of objects. Each object has "name" (skill name) and "category" (the group it belongs to, e.g. "Languages", "Frameworks", "Tools", "Databases"). If the CV groups skills by category, preserve that grouping. If no grouping is present, leave "category" as empty string.
      - For languages, "level" should be a number from 1 to 5.
      - For certifications, return an array of objects matching the schema. Extract and split the certificate name, issuing organization (if any), and date/year of issue. For example, "English: TOEIC 650+ (certificate available May 22, 2026)" should be parsed as name: "TOEIC 650+", issuingOrganization: "ETS" (or appropriate issuer), issueDate: "2026", and description: "English: TOEIC 650+ (certificate available May 22, 2026)".
      - Standardized language certificates or tests (e.g., TOEIC, IELTS, TOEFL, HSK, JLPT, DELF, TestDAF, etc.) listed in the CV (even if they are written under education, experience, or languages in the raw text) MUST only be put into the "certifications" array. They MUST NOT be included in the "languages" array or "education" array.
      - CRITICAL: DO NOT automatically infer or generate a language entry (e.g., adding "English" or "Tiếng Anh" to the "languages" array) just because the candidate has a language certificate (e.g., TOEIC, IELTS) mentioned in their education or certificates. Only include languages in the "languages" array if they are EXPLICITLY and SEPARATELY listed as a spoken/written language in a designated languages section of the CV raw text. If the CV only mentions "TOEIC" or "IELTS" in the education or achievements section without separately listing "English" as a language, the "languages" array MUST NOT contain "English" (it should remain empty).
    `;

    try {
      const result = await this.client.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: buffer.toString('base64'),
                  mimeType: mimetype,
                },
              },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const jsonString = result.text;
      if (!jsonString) {
        throw new Error('Empty AI response');
      }

      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.error === 'INVALID_CV') {
        throw new BadRequestException(parsed.message);
      }

      return parsed;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Error parsing image with AI', error);
      throw new Error('AI Image parsing failed');
    }
  }
}
