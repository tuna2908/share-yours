import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ratingVisibility: false,
  currentPin: null,
};

export const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    onSetModalRatingVisibility: (state, action) => {
      const { visibility } = action.payload;
      if (visibility != undefined) state.ratingVisibility = visibility;
    },
    onResetPin: (state) => {
      state.currentPin = null;
    },
    onSetPin: (state, action) => {
      const { pin } = action.payload;
      if (pin) state.currentPin = pin;
    },
  },
});

// Action creators are generated for each case reducer function
export const { onSetModalRatingVisibility, onResetPin, onSetPin } =
  ratingSlice.actions;

export default ratingSlice.reducer;
