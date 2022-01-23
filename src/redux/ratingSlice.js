import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ratingVisibility: false,
};

export const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    onSetModalRatingVisibility: (state, action) => {
      state.ratingVisibility = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { onSetModalRatingVisibility } = ratingSlice.actions;

export default ratingSlice.reducer;
