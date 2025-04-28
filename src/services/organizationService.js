import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const organizationService = {
  getOrganizationUsers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}organisations/owners/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching organization users:", error);
      throw error;
    }
  },
  updateTrialEndDate: async (ownerId, newDate) => {
    try {
      const response = await axios.post(`${API_BASE_URL}users/update/trial/`, {
        trial_ends: newDate,
        owner_id: ownerId,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating trial end date:", error);
      throw error;
    }
  },
  deleteOrganization: async (organizationId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}organisations/${organizationId}/`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting organization:", error);
      throw error;
    }
  },
};

export default organizationService;
