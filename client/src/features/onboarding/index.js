// features/onboarding/onboardingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  applications: [],
  error: null,
  loading: false,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setApplications: (state, action) => {
      state.applications = action.payload;
    },
    clearApplications: (state) => {
      state.applications = null;
    },
  },
});

export const { setApplications, clearApplications } = onboardingSlice.actions;
export const onboardingReducer = onboardingSlice.reducer;
