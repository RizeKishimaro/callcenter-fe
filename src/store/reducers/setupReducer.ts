import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentStep: 2,
  sipProvider: null,
  ivr: null,
  ivrTree: null,
  ivrFileLists: []
};

const setupSlice = createSlice({
  name: "setup",
  initialState,
  reducers: {
    nextStep: (state) => {
      if (state.currentStep < 4) {
        // Assuming you have 3 steps
        state.currentStep += 1;
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    setSipProvider: (state, { payload }) => {
      state.sipProvider = payload;
    },
    setIvrTree: (state, { payload }) => {
      state.ivrTree = payload;
    },
    setIvr: (state, { payload }) => {
      state.ivr = payload;
    },
    setIvrFileLists: (state , {payload}) => {
      state.ivrFileLists = payload;
    }
  },
});

export const { nextStep, previousStep, setSipProvider, setIvr, setIvrTree, setIvrFileLists } =
  setupSlice.actions;

export default setupSlice.reducer;
