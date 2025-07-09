import { configureStore } from "@reduxjs/toolkit";
import flowersReducer from "./slices/flowersSlice";
import polotnoReducer from "./slices/polotnoSlice";

export const store = configureStore({
  reducer: {
    flowers: flowersReducer,
    polotno: polotnoReducer,
  },
});

export default store;
