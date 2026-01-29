import type { Project } from '@/types/project.ts';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Card className={'w-full max-w-sm'}>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default ProjectCard;
