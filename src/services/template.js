import axios from "axios";

const TemplateService = (baseURL) => ({
  getTemplates: async () => {
    try {
      const response = await axios.get(`${baseURL}items/drafts/list/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching templates:", error);
      throw error;
    }
  },
  createTemplate: async (data) => {
    try {
      const response = await axios.post(`${baseURL}items/drafts/`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating template:", error);
      throw error;
    }
  },
  updateTemplate: async (id, data) => {
    try {
      const response = await axios.put(`${baseURL}items/drafts/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating template:", error);
      throw error;
    }
  },
  deleteTemplate: async (id) => {
    try {
      await axios.delete(`${baseURL}items/drafts/${id}/`);
    } catch (error) {
      console.error("Error deleting template:", error);
      throw error;
    }
  },
  getTemplateDetails: async (id) => {
    try {
      const response = await axios.get(`${baseURL}items/drafts/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching template details:", error);
      throw error;
    }
  },
});

export default TemplateService;
