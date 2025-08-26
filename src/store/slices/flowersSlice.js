import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import GalleryService from "../../services/flowerService";

// Async thunks
export const fetchFlowersByCategory = createAsyncThunk(
  "flowers/fetchByCategory",
  async ({ category, baseUrl }) => {
    const response = await GalleryService(baseUrl).getImagesByCategory(
      category
    );
    return { category, flowers: response };
  }
);

const initialState = {
  flowersByCategory: {},
  loading: false,
  error: null,
};

const flowersSlice = createSlice({
  name: "flowers",
  initialState,
  reducers: {
    clearFlowers: (state) => {
      state.flowersByCategory = {};
    },
    addFlower: (state, action) => {
      const { category, ...flower } = action.payload;
      if (!state.flowersByCategory[category])
        state.flowersByCategory[category] = [flower];
      else state.flowersByCategory[category].push(flower);
    },
    addVariant: (state, action) => {
      const { category, flowerId, image, id, view } = action.payload;
      const images = state.flowersByCategory[category];
      const flower = images.find(
        (flower) => flower.flowerId === flowerId && flower.view === view
      );
      if (flower) flower.variants.push({ image, id });
    },
    deleteFlower: (state, action) => {
      const { category, id, flowerId } = action.payload;
      const images = state.flowersByCategory[category];

      if (!images) return;

      const index = images.findIndex((flower) => flower.id === id);
      if (index === -1) return;

      // Remove the deleted flower
      images.splice(index, 1);

      // Update dirtyMessage for related flowers
      images.forEach((flower) => {
        if (flower.flowerId === flowerId) {
          if (flower.view === "view_1") {
            flower.dirtyMessage = "View 2 missing";
          } else if (flower.view === "view_2") {
            flower.dirtyMessage = "View 1 missing";
          }
        }
      });
    },
    updateFlower: (state, action) => {
      const { category, flowerId, id, isNewView, view } = action.payload;
      const searchKey = isNewView ? "flowerId" : "id";
      const searchValue = isNewView ? flowerId : id;

      const images = state.flowersByCategory[category];

      if (!images) return;

      const index = images.findIndex(
        (flower) => flower[searchKey] === searchValue
      );

      if (index === -1) return;

      if (isNewView) {
        images[index].dirtyMessage = "";

        if (view === "view_1") {
          images.splice(index, 0, action.payload);
        } else if (view === "view_2") {
          images.splice(index + 1, 0, action.payload);
        }
      } else {
        images[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch flowers by category
      .addCase(fetchFlowersByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlowersByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.flowersByCategory[action.payload.category] =
          action.payload.flowers;
      })
      .addCase(fetchFlowersByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  addFlower,
  addVariant,
  clearFlowers,
  deleteFlower,
  updateFlower,
} = flowersSlice.actions;

export default flowersSlice.reducer;
