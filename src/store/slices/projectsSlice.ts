import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Project } from '@/types/project';
import { apiFetch, updateProjectIndex as apiUpdateProjectIndex, deleteProject as apiDeleteProject, updateProject as apiUpdateProject } from '@/lib/api';

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async () => {
    return apiFetch<Project[]>('/projects', { requireAuth: false });
  }
);

export const updateProjectIndex = createAsyncThunk(
  'projects/updateProjectIndex',
  async ({ uuid, index }: { uuid: string; index: number }) => {
    await apiUpdateProjectIndex(uuid, index);
    return { uuid, index };
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (uuid: string) => {
    await apiDeleteProject(uuid);
    return uuid;
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ uuid, data }: { uuid: string; data: { name?: string; description?: string } }) => {
    await apiUpdateProject(uuid, data);
    return { uuid, data };
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearProjects: (state) => {
      state.projects = [];
      state.error = null;
    },
    reorderProjectsOptimistically: (state, action) => {
      state.projects = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.sort((a, b) => a.index - b.index);
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      })
      .addCase(updateProjectIndex.fulfilled, (state, action) => {
        const project = state.projects.find(p => p.uuid === action.payload.uuid);
        if (project) {
          project.index = action.payload.index;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p.uuid !== action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const project = state.projects.find(p => p.uuid === action.payload.uuid);
        if (project) {
          Object.assign(project, action.payload.data);
        }
      });
  },
});

export const { clearProjects, reorderProjectsOptimistically } = projectsSlice.actions;
export default projectsSlice.reducer;
