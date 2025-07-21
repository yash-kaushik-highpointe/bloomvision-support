import api from "./api";

const BetaTestService = (baseURL) => ({
  getBetaTestUsers: async () => {
    try {
      const response = await api.get(`${baseURL}users/beta/`);
      return response.data.beta_users.map((email) => {
        return { email, id: email };
      });
    } catch (error) {
      throw error;
    }
  },

  addBetaTestUser: async (email) => {
    try {
      await api.post(`${baseURL}users/beta/`, {
        email,
      });
      return { email, id: email };
    } catch (error) {
      console.error("Error adding beta test user:", error);
      throw error;
    }
  },

  updateBetaTestUser: async (old_email, new_email) => {
    try {
      await api.put(`${baseURL}users/beta/`, {
        old_email,
        new_email,
      });
      return { id: new_email, email: new_email };
    } catch (error) {
      console.error("Error updating beta test user:", error);
      throw error;
    }
  },

  removeBetaTestUser: async (email) => {
    try {
      await api.delete(`${baseURL}users/beta/?email=${email}`);
    } catch (error) {
      throw error;
    }
  },
});

export default BetaTestService;
