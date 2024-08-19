import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import setupReducer from "./reducers/setupReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    setup: setupReducer,
  },
  // preloadedState: initialState,
});

export default store;
