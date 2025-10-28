import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import OrganizationService from "../../services/organizationService";
import { CONFIG } from "../../App";

// Async thunks
export const fetchOrganizationUsers = createAsyncThunk(
  "customer/fetchOrganizationUsers",
  async ({ env }) => {
    const response = await OrganizationService(
      CONFIG[env]
    ).getOrganizationUsers();
    return response;
  }
);

export const updateTrialEndDate = createAsyncThunk(
  "customer/updateTrialEndDate",
  async ({ env, organizationId, newTrialDate, callback }) => {
    let data = await OrganizationService(CONFIG[env]).updateTrialEndDate(
      organizationId,
      newTrialDate
    );
    callback?.();
    return { data, organizationId };
  }
);

export const updateTemplateAccess = createAsyncThunk(
  "customer/updateTemplateAccess",
  async ({ env, ownerId, selectedTemplateIds, trialEnds }) => {
    await OrganizationService(CONFIG[env]).updateTemplateAccess(
      ownerId,
      selectedTemplateIds,
      trialEnds
    );
    return { ownerId, selectedTemplateIds };
  }
);

export const impersonateUser = createAsyncThunk(
  "customer/impersonateUser",
  async ({ env, email }) => {
    const response = await OrganizationService(CONFIG[env]).impersonateUser(
      email
    );
    return response;
  }
);

export const bulkUpdateTemplates = createAsyncThunk(
  "customer/bulkUpdateTemplates",
  async ({ env, organisationIds, templateIds }) => {
    await OrganizationService(CONFIG[env]).bulkUpdateTemplates({
      organisation_ids: organisationIds,
      template_ids: templateIds,
    });
    return { organisationIds, templateIds };
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
        const { organizationId, data } = action.payload;
        state.users = state.users.map((org) => {
          if (org.id === organizationId) {
            return data;
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
      })
      // Bulk update templates
      .addCase(bulkUpdateTemplates.fulfilled, (state, action) => {
        const { organisationIds, templateIds } = action.payload;
        state.users = state.users.map((org) => {
          if (organisationIds.includes(org.id)) {
            return {
              ...org,
              skeletons: templateIds,
            };
          }
          return org;
        });
      })
      .addCase(bulkUpdateTemplates.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { setUsers, clearError, clearUsers } = customerSlice.actions;

export default customerSlice.reducer;
