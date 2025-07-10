import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import TemplateService from "../../services/template";

// Async thunk for fetching template details
export const fetchTemplateDetails = createAsyncThunk(
  "polotno/fetchTemplateDetails",
  async ({ templateId, baseURL }) => {
    const response = await TemplateService(baseURL).getTemplateDetails(
      templateId
    );
    return { templateId, data: response };
  }
);

const initialState = {
  templates: {}, // Store templates by templateId
  loading: false,
  error: null,
};

const polotnoSlice = createSlice({
  name: "polotno",
  initialState,
  reducers: {
    clearTemplate: (state, action) => {
      const { templateId } = action.payload;
      delete state.templates[templateId];
    },
    clearAllTemplates: (state) => {
      state.templates = {};
    },
    updateTemplateData: (state, action) => {
      const { templateId, data } = action.payload;
      if (state.templates[templateId]) {
        state.templates[templateId] = {
          ...state.templates[templateId],
          ...data,
        };
      }
    },
    addMetadataEntry: (state, action) => {
      const { templateId, elementId, metadata } = action.payload;
      if (!state.templates[templateId]) {
        state.templates[templateId] = { data: {}, metadata: {} };
      }
      if (!state.templates[templateId].metadata) {
        state.templates[templateId].metadata = {};
      }
      state.templates[templateId].metadata[elementId] = metadata;
    },
    deleteMetadataEntry: (state, action) => {
      const { templateId, elementId } = action.payload;
      if (state.templates[templateId]?.metadata?.[elementId]) {
        delete state.templates[templateId].metadata[elementId];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch template details
      .addCase(fetchTemplateDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplateDetails.fulfilled, (state, action) => {
        state.loading = false;
        const { templateId, data } = action.payload;
        state.templates[templateId] = data;
      })
      .addCase(fetchTemplateDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  clearTemplate,
  clearAllTemplates,
  updateTemplateData,
  addMetadataEntry,
  deleteMetadataEntry,
} = polotnoSlice.actions;

export default polotnoSlice.reducer;
