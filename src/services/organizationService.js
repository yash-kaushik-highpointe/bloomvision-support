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
  updateTrialEndDate: async (organizationId, newDate) => {
    try {
      const response = await api.post(`${baseURL}users/update/trial/`, {
        organisation_id: organizationId,
        trial_ends: newDate,
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
  updateTemplateAccess: async (organizationId, skeletons) => {
    try {
      const response = await api.post(`${baseURL}users/update/trial/`, {
        skeletons,
        organisation_id: organizationId,
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
  bulkUpdateTemplates: async (data) => {
    try {
      const response = await api.put(
        `${baseURL}organisations/skeletons/`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error bulk updating templates:", error);
      throw error;
    }
  },
  suspendAccount: async (organizationId, reason, notes) => {
    try {
      const response = await api.post(
        `${baseURL}organisations/${organizationId}/suspend/`,
        {
          reason,
          notes,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error suspending account:", error);
      throw error;
    }
  },
  reactivateAccount: async (organizationId) => {
    try {
      const response = await api.post(
        `${baseURL}organisations/${organizationId}/reactivate/`
      );
      return response.data;
    } catch (error) {
      console.error("Error reactivating account:", error);
      throw error;
    }
  },
});

export default OrganizationService;
