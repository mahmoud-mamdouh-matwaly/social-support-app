import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    // Add reducers here when slices are created
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
