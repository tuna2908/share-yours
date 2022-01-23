import { configureStore } from "@reduxjs/toolkit";
import ratingReducer from "./ratingSlice";

export const store = configureStore({
  reducer: { rating: ratingReducer },
});
