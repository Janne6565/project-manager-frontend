import { useState } from "react";
import type { Project } from "@/types/project.ts";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Eye, Settings } from "lucide-react";
import { ContributionsTable } from "@/components/display/ContributionsTable/ContributionsTable";
import { ProjectDetailDrawer } from "@/components/display/ProjectDetailDrawer/ProjectDetailDrawer";

const ProjectDetailPage = ({ project }: { project: Project }) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerEditMode, setDrawerEditMode] = useState(false);

  const handleSeeDetails = () => {
    setDrawerEditMode(false);
    setDrawerOpen(true);
  };

  const handleEditConfiguration = () => {
    setDrawerEditMode(true);
    setDrawerOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          className="w-fit"
          onClick={() => navigate({ to: "/" })}
        >
          <ArrowLeft className="size-4" />
          Back to Projects
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold truncate">{project.name}</h1>
            <p className="text-muted-foreground mt-2">{project.description}</p>

            {/* Additional Information */}
            {project.additionalInformation &&
              Object.keys(project.additionalInformation).length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.entries(project.additionalInformation).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="rounded-lg border bg-muted/50 px-3 pb-1"
                      >
                        <span className="text-xs font-medium text-muted-foreground">
                          {key}:
                        </span>{" "}
                        <span className="text-xs font-semibold">{value}</span>
                      </div>
                    ),
                  )}
                </div>
              )}
          </div>

          <div className="flex gap-2 shrink-0">
            <Button variant="outline" onClick={handleSeeDetails}>
              <Eye className="size-4" />
              See Details
            </Button>
            <Button onClick={handleEditConfiguration}>
              <Settings className="size-4" />
              Edit Configuration
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Contributions Section */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold">Contributions</h2>
          <p className="text-muted-foreground mt-1">
            {(project.contributions || []).length}{" "}
            {(project.contributions || []).length === 1
              ? "contribution"
              : "contributions"}
          </p>
        </div>
        <ContributionsTable contributions={project.contributions || []} />
      </div>

      {/* Drawer */}
      <ProjectDetailDrawer
        project={project}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        initialEditMode={drawerEditMode}
      />
    </div>
  );
};

export default ProjectDetailPage;
