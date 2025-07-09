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
});

export default TemplateService;
