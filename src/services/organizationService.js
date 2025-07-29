import api from "./api";

const OrganizationService = (baseURL) => ({
  getOrganizationUsers: async () => {
    try {
      const response = await api.get(`${baseURL}organisations/owners/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching organization users:", error);
      throw error;
    }
  },
  updateTrialEndDate: async (ownerId, newDate, skeletons) => {
    try {
      const response = await api.post(`${baseURL}users/update/trial/`, {
        skeletons,
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
      const response = await api.delete(
        `${baseURL}organisations/${organizationId}/`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting organization:", error);
      throw error;
    }
  },
  updateTemplateAccess: async (ownerId, skeletons, trial_ends) => {
    try {
      const response = await api.post(`${baseURL}users/update/trial/`, {
        skeletons,
        trial_ends,
        owner_id: ownerId,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating trial end date:", error);
      throw error;
    }
  },
  impersonateUser: async (email) => {
    try {
      const response = await api.post(`${baseURL}users/impersonate/code/`, {
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Error impersonating user:", error);
      throw error;
    }
  },
});

export default OrganizationService;
