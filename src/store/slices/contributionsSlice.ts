import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Contribution } from '@/types/contribution';
import { apiFetch } from '@/lib/api';

interface ContributionsState {
  contributions: Contribution[];
  loading: boolean;
  error: string | null;
}

const initialState: ContributionsState = {
  contributions: [],
  loading: false,
  error: null,
};

export const fetchUnassignedContributions = createAsyncThunk(
  'contributions/fetchUnassigned',
  async () => {
    return apiFetch<Contribution[]>('/contributions/unassigned', {
      requireAuth: false,
    });
  }
);

const contributionsSlice = createSlice({
  name: 'contributions',
  initialState,
  reducers: {
    clearContributions: (state) => {
      state.contributions = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnassignedContributions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnassignedContributions.fulfilled, (state, action) => {
        state.loading = false;
        state.contributions = action.payload;
      })
      .addCase(fetchUnassignedContributions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch unassigned contributions';
      });
  },
});

export const { clearContributions } = contributionsSlice.actions;
export default contributionsSlice.reducer;
