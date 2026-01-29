import FloatingHeader from '@/components/display/FloatingHeader/FloatingHeader.tsx';
import ProjectDisplay from '@/components/display/Projects/ProjectDisplay/ProjectDisplay.tsx';

const RootPage = () => {
  return (
    <div className="bg-background w-screen transition-colors min-h-screen flex flex-col">
      <FloatingHeader />
      <ProjectDisplay />
    </div>
  );
};

export default RootPage;
