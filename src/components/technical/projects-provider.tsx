import { createContext, type ReactNode } from 'react';
import type { Project } from '@/types/project.ts';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

interface ProjectsContext {
  projects: Project[] | undefined;
  isLoading: boolean;
}

export const ProjectsContext = createContext<ProjectsContext>({
  projects: undefined,
  isLoading: false,
});

const ProjectsProvider = (props: { children: ReactNode }) => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      return apiFetch<Project[]>('/projects', { requireAuth: false });
    },
  });

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        isLoading,
      }}
    >
      {props.children}
    </ProjectsContext.Provider>
  );
};

export default ProjectsProvider;
