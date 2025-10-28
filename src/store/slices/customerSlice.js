import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import OrganizationService from "../../services/organizationService";

// Async thunks
export const fetchOrganizationUsers = createAsyncThunk(
  "customer/fetchOrganizationUsers",
  async ({ env, config }) => {
    const response = await OrganizationService(
      config[env]
    ).getOrganizationUsers();
    return response;
  }
);

export const updateTrialEndDate = createAsyncThunk(
  "customer/updateTrialEndDate",
  async ({ env, config, ownerId, newTrialDate, skeletons }) => {
    await OrganizationService(config[env]).updateTrialEndDate(
      ownerId,
      newTrialDate,
      skeletons
    );
    return { ownerId, newTrialDate };
  }
);

export const updateTemplateAccess = createAsyncThunk(
  "customer/updateTemplateAccess",
  async ({ env, config, ownerId, selectedTemplateIds, trialEnds }) => {
    await OrganizationService(config[env]).updateTemplateAccess(
      ownerId,
      selectedTemplateIds,
      trialEnds
    );
    return { ownerId, selectedTemplateIds };
  }
);

export const impersonateUser = createAsyncThunk(
  "customer/impersonateUser",
  async ({ env, config, email }) => {
    const response = await OrganizationService(config[env]).impersonateUser(
      email
    );
    return response;
  }
);

const initialState = {
  users: [],
  loading: false,
  error: null,
  isUpdating: false,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUsers: (state) => {
      state.users = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch organization users
      .addCase(fetchOrganizationUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchOrganizationUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update trial end date
      .addCase(updateTrialEndDate.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateTrialEndDate.fulfilled, (state, action) => {
        state.isUpdating = false;
        const { ownerId, newTrialDate } = action.payload;
        state.users = state.users.map((org) => {
          if (org.owner.id === ownerId) {
            return {
              ...org,
              trial_ends: newTrialDate,
            };
          }
          return org;
        });
      })
      .addCase(updateTrialEndDate.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message;
      })
      // Update template access
      .addCase(updateTemplateAccess.fulfilled, (state, action) => {
        const { ownerId, selectedTemplateIds } = action.payload;
        state.users = state.users.map((org) => {
          if (org.owner.id === ownerId) {
            return {
              ...org,
              skeletons: selectedTemplateIds,
            };
          }
          return org;
        });
      })
      .addCase(updateTemplateAccess.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Impersonate user
      .addCase(impersonateUser.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { setUsers, clearError, clearUsers } = customerSlice.actions;

export default customerSlice.reducer;
