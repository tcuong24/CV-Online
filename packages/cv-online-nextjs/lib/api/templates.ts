import axios from 'axios';
import type { Template, TemplateWithSampleData } from '@/types/cv';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const templateApi = {
  /**
   * Get all templates with optional filters
   */
  async getTemplates(filters?: {
    category?: string;
    isPremium?: boolean;
    isPublished?: boolean;
  }): Promise<Template[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.isPremium !== undefined) params.append('isPremium', String(filters.isPremium));
    if (filters?.isPublished !== undefined) params.append('isPublished', String(filters.isPublished));

    const response = await api.get(`/templates?${params.toString()}`);
    return response.data;
  },

  /**
   * Get template by ID
   */
  async getTemplate(id: string): Promise<TemplateWithSampleData> {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  },

  /**
   * Get template preview with sample data
   */
  async getTemplatePreview(id: string): Promise<{
    template: {
      id: string;
      name: string;
      designConfig: any;
      sectionsConfig: any;
      layoutType: string;
    };
    sampleData: any;
  }> {
    const response = await api.get(`/templates/${id}/preview`);
    return response.data;
  },

  /**
   * Get all template categories
   */
  async getCategories(): Promise<string[]> {
    const response = await api.get('/templates/categories');
    return response.data;
  },

  /**
   * Increment template usage count
   */
  async incrementUsage(id: string): Promise<void> {
    await api.post(`/templates/${id}/increment-usage`);
  },
};
