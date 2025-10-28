import { configureStore } from "@reduxjs/toolkit";
import flowersReducer from "./slices/flowersSlice";
import polotnoReducer from "./slices/polotnoSlice";
import customerReducer from "./slices/customerSlice";

export const store = configureStore({
  reducer: {
    flowers: flowersReducer,
    polotno: polotnoReducer,
    customer: customerReducer,
  },
});

export default store;
