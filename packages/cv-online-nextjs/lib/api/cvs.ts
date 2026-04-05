import axios from 'axios';
import type {
  CV,
  CVWithRelations,
  CreateCVDto,
  UpdateCVDto,
  UpdateCustomStylesDto,
  ReorderSectionsDto,
  CVPersonalInfo,
  CVExperience,
  CVEducation,
  CVSkill,
  CVProject,
  CVCertification,
  CVLanguage,
  CVAward,
  CVReference,
} from '@/types/cv';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const cvApi = {
  // =============================================================================
  // CV CORE
  // =============================================================================

  /**
   * Create new CV
   */
  async createCV(data: CreateCVDto): Promise<CV> {
    const response = await api.post('/cvs', data);
    return response.data;
  },

  /**
   * Get all CVs for current user
   */
  async getCVs(): Promise<CV[]> {
    const response = await api.get('/cvs');
    return response.data;
  },

  /**
   * Get CV by ID with all relations
   */
  async getCV(id: string): Promise<CVWithRelations> {
    const response = await api.get(`/cvs/${id}`);
    return response.data;
  },

  /**
   * Get public CV by token
   */
  async getPublicCV(token: string): Promise<CVWithRelations> {
    const response = await api.get(`/cvs/public/${token}`);
    return response.data;
  },

  /**
   * Update CV
   */
  async updateCV(id: string, data: UpdateCVDto): Promise<CV> {
    const response = await api.put(`/cvs/${id}`, data);
    return response.data;
  },

  /**
   * Delete CV
   */
  async deleteCV(id: string): Promise<void> {
    await api.delete(`/cvs/${id}`);
  },

  /**
   * Publish CV (make public)
   */
  async publishCV(id: string): Promise<CV> {
    const response = await api.post(`/cvs/${id}/publish`);
    return response.data;
  },

  /**
   * Unpublish CV
   */
  async unpublishCV(id: string): Promise<CV> {
    const response = await api.post(`/cvs/${id}/unpublish`);
    return response.data;
  },

  /**
   * Update custom styles
   */
  async updateCustomStyles(id: string, data: UpdateCustomStylesDto): Promise<CV> {
    const response = await api.put(`/cvs/${id}/custom-styles`, data);
    return response.data;
  },

  /**
   * Reorder sections
   */
  async reorderSections(id: string, data: ReorderSectionsDto): Promise<CV> {
    const response = await api.put(`/cvs/${id}/reorder-sections`, data);
    return response.data;
  },

  /**
   * Update sections visibility
   */
  async updateSectionsVisibility(
    id: string,
    sectionsVisibility: Record<string, boolean>
  ): Promise<CV> {
    const response = await api.put(`/cvs/${id}/sections-visibility`, {
      sectionsVisibility,
    });
    return response.data;
  },

  // =============================================================================
  // PERSONAL INFO
  // =============================================================================

  async updatePersonalInfo(cvId: string, data: Partial<CVPersonalInfo>): Promise<CVPersonalInfo> {
    const response = await api.put(`/cvs/${cvId}/personal-info`, data);
    return response.data;
  },

  // =============================================================================
  // EXPERIENCES
  // =============================================================================

  async createExperience(cvId: string, data: Partial<CVExperience>): Promise<CVExperience> {
    const response = await api.post(`/cvs/${cvId}/experiences`, data);
    return response.data;
  },

  async updateExperience(cvId: string, id: string, data: Partial<CVExperience>): Promise<CVExperience> {
    const response = await api.put(`/cvs/${cvId}/experiences/${id}`, data);
    return response.data;
  },

  async deleteExperience(cvId: string, id: string): Promise<void> {
    await api.delete(`/cvs/${cvId}/experiences/${id}`);
  },

  // =============================================================================
  // EDUCATION
  // =============================================================================

  async createEducation(cvId: string, data: Partial<CVEducation>): Promise<CVEducation> {
    const response = await api.post(`/cvs/${cvId}/education`, data);
    return response.data;
  },

  async updateEducation(cvId: string, id: string, data: Partial<CVEducation>): Promise<CVEducation> {
    const response = await api.put(`/cvs/${cvId}/education/${id}`, data);
    return response.data;
  },

  async deleteEducation(cvId: string, id: string): Promise<void> {
    await api.delete(`/cvs/${cvId}/education/${id}`);
  },

  // =============================================================================
  // SKILLS
  // =============================================================================

  async createSkill(cvId: string, data: Partial<CVSkill>): Promise<CVSkill> {
    const response = await api.post(`/cvs/${cvId}/skills`, data);
    return response.data;
  },

  async updateSkill(cvId: string, id: string, data: Partial<CVSkill>): Promise<CVSkill> {
    const response = await api.put(`/cvs/${cvId}/skills/${id}`, data);
    return response.data;
  },

  async deleteSkill(cvId: string, id: string): Promise<void> {
    await api.delete(`/cvs/${cvId}/skills/${id}`);
  },

  // =============================================================================
  // PROJECTS
  // =============================================================================

  async createProject(cvId: string, data: Partial<CVProject>): Promise<CVProject> {
    const response = await api.post(`/cvs/${cvId}/projects`, data);
    return response.data;
  },

  async updateProject(cvId: string, id: string, data: Partial<CVProject>): Promise<CVProject> {
    const response = await api.put(`/cvs/${cvId}/projects/${id}`, data);
    return response.data;
  },

  async deleteProject(cvId: string, id: string): Promise<void> {
    await api.delete(`/cvs/${cvId}/projects/${id}`);
  },

  // =============================================================================
  // CERTIFICATIONS
  // =============================================================================

  async createCertification(cvId: string, data: Partial<CVCertification>): Promise<CVCertification> {
    const response = await api.post(`/cvs/${cvId}/certifications`, data);
    return response.data;
  },

  async updateCertification(cvId: string, id: string, data: Partial<CVCertification>): Promise<CVCertification> {
    const response = await api.put(`/cvs/${cvId}/certifications/${id}`, data);
    return response.data;
  },

  async deleteCertification(cvId: string, id: string): Promise<void> {
    await api.delete(`/cvs/${cvId}/certifications/${id}`);
  },

  // =============================================================================
  // LANGUAGES
  // =============================================================================

  async createLanguage(cvId: string, data: Partial<CVLanguage>): Promise<CVLanguage> {
    const response = await api.post(`/cvs/${cvId}/languages`, data);
    return response.data;
  },

  async updateLanguage(cvId: string, id: string, data: Partial<CVLanguage>): Promise<CVLanguage> {
    const response = await api.put(`/cvs/${cvId}/languages/${id}`, data);
    return response.data;
  },

  async deleteLanguage(cvId: string, id: string): Promise<void> {
    await api.delete(`/cvs/${cvId}/languages/${id}`);
  },

  // =============================================================================
  // AWARDS
  // =============================================================================

  async createAward(cvId: string, data: Partial<CVAward>): Promise<CVAward> {
    const response = await api.post(`/cvs/${cvId}/awards`, data);
    return response.data;
  },

  async updateAward(cvId: string, id: string, data: Partial<CVAward>): Promise<CVAward> {
    const response = await api.put(`/cvs/${cvId}/awards/${id}`, data);
    return response.data;
  },

  async deleteAward(cvId: string, id: string): Promise<void> {
    await api.delete(`/cvs/${cvId}/awards/${id}`);
  },

  // =============================================================================
  // REFERENCES
  // =============================================================================

  async createReference(cvId: string, data: Partial<CVReference>): Promise<CVReference> {
    const response = await api.post(`/cvs/${cvId}/references`, data);
    return response.data;
  },

  async updateReference(cvId: string, id: string, data: Partial<CVReference>): Promise<CVReference> {
    const response = await api.put(`/cvs/${cvId}/references/${id}`, data);
    return response.data;
  },

  async deleteReference(cvId: string, id: string): Promise<void> {
    await api.delete(`/cvs/${cvId}/references/${id}`);
  },

  // =============================================================================
  // EXPORT
  // =============================================================================

  async exportToPdf(cvId: string, options: any = {}): Promise<Blob> {
    const response = await api.post(`/export/cv/${cvId}/pdf`, options, {
      responseType: 'blob',
    });
    return response.data;
  },

  async exportToHtml(cvId: string): Promise<string> {
    const response = await api.post(`/export/cv/${cvId}/html`);
    return response.data;
  },
};
