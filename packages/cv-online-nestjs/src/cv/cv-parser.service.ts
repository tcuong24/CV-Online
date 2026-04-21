import { Injectable, Logger } from '@nestjs/common';
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
      IMPORTANT: You MUST return a JSON object that matches the following EXACT structure:
      {
        "personal": { "name": "", "role": "", "email": "", "phone": "", "address": "", "links": [], "summary": "" },
        "summary": "",
        "experiences": [{ "title": "", "company": "", "location": "", "from": "", "to": "", "desc": "" }],
        "educations": [{ "degree": "", "school": "", "location": "", "from": "", "to": "", "desc": "" }],
        "skills": [],
        "projects": [{ "name": "", "from": "", "to": "", "desc": "", "link": "", "tech": "" }],
        "certifications": [],
        "languages": [{ "lang": "", "level": 1-5 }]
      }
      
      Instructions:
      - Split any time periods into "from" and "to" (e.g., "Jan 2020 - Now" becomes from: "Jan 2020", to: "Now").
      - For projects, "tech" should be a comma-separated string of technologies used (e.g., "React, Node.js, MongoDB").
      - For skills, return a simple array of strings.
      - For languages, "level" should be a number from 1 to 5.

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

      return JSON.parse(jsonString);
    } catch (error) {
      this.logger.error('Error parsing text with AI', error);
      throw new Error('AI parsing failed');
    }
  }

  private async parseImageWithAI(buffer: Buffer, mimetype: string): Promise<any> {
    const prompt = `
      You are a world-class CV parsing assistant. Below is an image of a resume/CV. 
      Analyze the image and extract all relevant information.
      IMPORTANT: You MUST return a JSON object that matches the following EXACT structure:
      {
        "personal": { "name": "","role":"", "email": "", "phone": "", "address": "", "links": [], "summary": "" },
        "summary": "",
        "experiences": [{ "title": "", "company": "", "location": "", "from": "", "to": "", "desc": "" }],
        "educations": [{ "degree": "", "school": "", "location": "", "from": "", "to": "", "desc": "" }],
        "skills": [],
        "projects": [{ "name": "", "from": "", "to": "", "desc": "", "link": "", "tech": "" }],
        "certifications": [],
        "languages": [{ "lang": "", "level": 1-5 }]
      }
      
      Instructions:
      - Split any time periods into "from" and "to" (e.g., "Jan 2020 - Now" becomes from: "Jan 2020", to: "Now").
      - For projects, "tech" should be a comma-separated string of technologies used (e.g., "React, Node.js, MongoDB").
      - For skills, return a simple array of strings.
      - For languages, "level" should be a number from 1 to 5.
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

      return JSON.parse(jsonString);
    } catch (error) {
      this.logger.error('Error parsing image with AI', error);
      throw new Error('AI Image parsing failed');
    }
  }
}
