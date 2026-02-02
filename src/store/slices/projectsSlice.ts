import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Project } from '@/types/project';
import { apiFetch, createProject as apiCreateProject, updateProjectIndex as apiUpdateProjectIndex, deleteProject as apiDeleteProject, updateProject as apiUpdateProject, toggleProjectVisibility as apiToggleProjectVisibility } from '@/lib/api';

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

export const fetchAllProjects = createAsyncThunk(
  'projects/fetchAllProjects',
  async () => {
    return apiFetch<Project[]>('/admin/projects');
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (data: {
    name: string;
    description?: string;
    descriptionEn?: string;
    descriptionDe?: string;
    additionalInformation?: { projectId?: string };
    repositories?: string[];
    index: number;
  }) => {
    await apiCreateProject(data);
    // Refetch projects to get the new one with UUID
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
  async ({ uuid, data }: { 
    uuid: string; 
    data: { 
      name?: string; 
      description?: string;
      descriptionEn?: string;
      descriptionDe?: string;
      repositories?: string[];
      additionalInformation?: { projectId?: string; [key: string]: unknown };
      index?: number;
      isVisible?: boolean;
    } 
  }) => {
    await apiUpdateProject(uuid, data);
    return { uuid, data };
  }
);

export const toggleProjectVisibility = createAsyncThunk(
  'projects/toggleVisibility',
  async (uuid: string) => {
    await apiToggleProjectVisibility(uuid);
    return uuid;
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
      .addCase(createProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.sort((a, b) => a.index - b.index);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create project';
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
      })
      .addCase(fetchAllProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.sort((a, b) => a.index - b.index);
      })
      .addCase(fetchAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch all projects';
      })
      .addCase(toggleProjectVisibility.fulfilled, (state, action) => {
        const project = state.projects.find(p => p.uuid === action.payload);
        if (project) {
          project.isVisible = !project.isVisible;
        }
      });
  },
});

export const { clearProjects, reorderProjectsOptimistically } = projectsSlice.actions;
export default projectsSlice.reducer;
