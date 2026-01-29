import { useContext } from 'react';
import { ProjectsContext } from '@/components/technical/projects-provider.tsx';

const useProjects = () => {
  const contextValue = useContext(ProjectsContext);
  if (!contextValue) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return contextValue;
};

export default useProjects;
