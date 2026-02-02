import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './slices/projectsSlice';
import contributionsReducer from './slices/contributionsSlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    contributions: contributionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
