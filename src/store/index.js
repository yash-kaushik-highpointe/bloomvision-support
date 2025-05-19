import { configureStore } from "@reduxjs/toolkit";
import flowersReducer from "./slices/flowersSlice";

export const store = configureStore({
  reducer: {
    flowers: flowersReducer,
  },
});

export default store;
