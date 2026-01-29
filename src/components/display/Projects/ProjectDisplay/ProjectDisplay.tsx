import useProjects from '@/hooks/use-projects.ts';
import ProjectCard from '@/components/display/Projects/ProjectCard/ProjectCard.tsx';
import { useUrlState } from '@/hooks/use-url-state.ts';
import ProjectIndexSelector from '@/components/display/Projects/ProjectDisplay/ProjectIndexSelector/ProjectIndexSelector.tsx';

const ProjectDisplay = () => {
  const [currentIndex, setCurrentIndex] = useUrlState(0, 'projectIndex');
  const { projects, isLoading } = useProjects();

  if (isLoading) return <div>Loading...</div>;

  if (!projects) return <div>No projects found</div>;

  return (
    <div className={'w-full flex justify-center flex-col align-middle items-center grow gap-15'}>
      <ProjectCard project={projects[currentIndex]} />
      <ProjectIndexSelector
        currentIndex={currentIndex}
        setIndex={setCurrentIndex}
        maxIndex={projects.length - 1}
      />
    </div>
  );
};

export default ProjectDisplay;
