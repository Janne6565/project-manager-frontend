import { createContext, type ReactNode } from 'react';
import type { Project } from '@/types/project.ts';
import { useQuery } from '@tanstack/react-query';

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
      return [
        {
          id: '1',
          name: 'Janne Keipert',
          description: 'My personal website',
          lastTimeTouched: Date.now(),
        },
        {
          id: '2',
          name: 'Janne Keipert 2',
          description: 'My personal website 2',
          lastTimeTouched: Date.now(),
        },
        {
          id: '3',
          name: 'Janne Keipert 3',
          description: 'My personal website 3',
          lastTimeTouched: Date.now(),
        },
      ];
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
