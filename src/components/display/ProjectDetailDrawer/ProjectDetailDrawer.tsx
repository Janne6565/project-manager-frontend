import { useState } from "react";
import type { Project } from "@/types/project";
import { useAppDispatch } from "@/store/hooks";
import { updateProject } from "@/store/slices/projectsSlice";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import TooltipWrapper from "@/components/ui/tooltip-wrapper.tsx";

interface ProjectDetailDrawerProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailDrawer({
  project,
  open,
  onOpenChange,
}: ProjectDetailDrawerProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await dispatch(
        updateProject({
          uuid: project.uuid,
          data: { name, description },
        }),
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update project:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(project.name);
    setDescription(project.description);
    setIsEditing(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Project" : "Project Details"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Make changes to the project details"
              : "View project information and statistics"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 py-6 px-5">
          {!isEditing ? (
            <>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium">Name</h3>
                <p className="text-sm">{project.name}</p>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium">Description</h3>
                <p className="text-muted-foreground text-sm">
                  {project.description || "No description provided"}
                </p>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium">Repositories</h3>
                <div className="flex flex-col gap-1">
                  {(project.repositories?.length ?? 0) > 0 ? (
                    project.repositories?.map((repo, index) => (
                      <TooltipWrapper tooltip={repo} asChild>
                        <a
                          key={index}
                          href={repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm truncate"
                        >
                          {repo}
                        </a>
                      </TooltipWrapper>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No repositories linked
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium">Contributions</h3>
                <Badge variant="outline" className="w-fit">
                  {project.contributions?.length ?? 0} contribution
                  {(project.contributions?.length ?? 0) !== 1 ? "s" : ""}
                </Badge>
              </div>

              {project.additionalInformation?.projectId && (
                <>
                  <Separator />
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium">Project ID</h3>
                    <p className="text-muted-foreground text-sm">
                      {project.additionalInformation.projectId}
                    </p>
                  </div>
                </>
              )}
            </>
          ) : (
            <form onSubmit={(e) => e.preventDefault()}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSaving}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSaving}
                    rows={4}
                  />
                </Field>
              </FieldGroup>
            </form>
          )}
        </div>

        <SheetFooter className="gap-2">
          {!isEditing ? (
            <>
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </>
          ) : (
            <>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
