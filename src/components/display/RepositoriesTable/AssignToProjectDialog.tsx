import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProjects, updateProject } from "@/store/slices/projectsSlice";
import { fetchUnassignedContributions } from "@/store/slices/contributionsSlice";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AssignToProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repositoryUrl: string;
}

export function AssignToProjectDialog({
  open,
  onOpenChange,
  repositoryUrl,
}: AssignToProjectDialogProps) {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects.projects);
  const [selectedProjectUuid, setSelectedProjectUuid] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAssign = async () => {
    if (!selectedProjectUuid) {
      setError("Please select a project");
      return;
    }

    setIsAssigning(true);
    setError(null);

    try {
      const project = projects.find((p) => p.uuid === selectedProjectUuid);
      if (!project) {
        throw new Error("Project not found");
      }

      // Add repository to project's repositories array
      const updatedRepositories = [
        ...(project.repositories || []),
        repositoryUrl,
      ];

      // Send complete project data for PUT endpoint
      await dispatch(
        updateProject({
          uuid: selectedProjectUuid,
          data: {
            name: project.name,
            description: project.description,
            additionalInformation: project.additionalInformation,
            repositories: updatedRepositories,
            index: project.index,
          },
        })
      ).unwrap();

      // Refetch projects and contributions to update the UI
      await Promise.all([
        dispatch(fetchProjects()),
        dispatch(fetchUnassignedContributions()),
      ]);

      // Close dialog and reset after successful assignment and data reload
      onOpenChange(false);
      setSelectedProjectUuid("");
      setError(null);
    } catch (err) {
      console.error("Failed to assign repository:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to assign repository to project"
      );
    } finally {
      setIsAssigning(false);
    }
  };

  const handleCancel = () => {
    setSelectedProjectUuid("");
    setError(null);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Repository to Project</AlertDialogTitle>
          <AlertDialogDescription>
            Select a project to add this repository to.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Repository</Label>
            <div className="text-sm text-muted-foreground font-mono bg-muted px-3 py-2 rounded">
              {repositoryUrl}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-select">Project</Label>
            <Select
              value={selectedProjectUuid}
              onValueChange={setSelectedProjectUuid}
              disabled={isAssigning}
            >
              <SelectTrigger id="project-select">
                <SelectValue placeholder="Select a project..." />
              </SelectTrigger>
              <SelectContent>
                {projects.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    No projects available
                  </div>
                ) : (
                  projects.map((project) => (
                    <SelectItem key={project.uuid} value={project.uuid}>
                      {project.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded">
              {error}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={isAssigning || !selectedProjectUuid}>
            {isAssigning ? "Adding..." : "Add to Project"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
