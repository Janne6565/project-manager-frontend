import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAppSelector } from "@/store/hooks.ts";
import ProjectDetailPage from "@/components/display/ProjectDetailPage/ProjectDetailPage.tsx";
import { ProtectedRoute } from "@/components/technical/protected-route";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/project/$projectUuid")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute>
      <ProjectRouteContent />
    </ProtectedRoute>
  );
}

function ProjectRouteContent() {
  const { projectUuid } = Route.useParams();
  const { loading, error, projects } = useAppSelector(
    (state) => state.projects,
  );

  if (!projectUuid) {
    return <ProjectNotFound />;
  }

  if (error) {
    return <ProjectsCouldNotBeLoaded error={error} />;
  }

  if (loading) {
    return <ProjectsLoading />;
  }

  const project = projects.find((p) => p.uuid === projectUuid);
  if (!project) {
    return <ProjectNotFound />;
  }

  return <ProjectDetailPage project={project} />;
}

const ProjectsLoading = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
      <div className="text-muted-foreground">Loading project...</div>
    </div>
  </div>
);

const ProjectNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertCircle className="size-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Project Not Found</h2>
          <p className="text-muted-foreground">
            The project you're looking for doesn't exist or has been deleted.
          </p>
        </div>
        <Button onClick={() => navigate({ to: "/" })}>
          <ArrowLeft className="size-4" />
          Back to Projects
        </Button>
      </div>
    </div>
  );
};

const ProjectsCouldNotBeLoaded = ({ error }: { error: string }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertCircle className="size-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Failed to Load Projects</h2>
          <p className="text-muted-foreground">
            {error || "An error occurred while loading projects. Please try again."}
          </p>
        </div>
        <Button onClick={() => navigate({ to: "/" })}>
          <ArrowLeft className="size-4" />
          Back to Projects
        </Button>
      </div>
    </div>
  );
};
