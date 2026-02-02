import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createProject } from "@/store/slices/projectsSlice";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Plus, X } from "lucide-react";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
}: CreateProjectDialogProps) {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects.projects);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [repositories, setRepositories] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddRepository = () => {
    setRepositories([...repositories, ""]);
  };

  const handleRemoveRepository = (index: number) => {
    setRepositories(repositories.filter((_, i) => i !== index));
  };

  const handleRepositoryChange = (index: number, value: string) => {
    const newRepos = [...repositories];
    newRepos[index] = value;
    setRepositories(newRepos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate the next index
      const maxIndex =
        projects.length > 0 ? Math.max(...projects.map((p) => p.index)) : -1;
      const nextIndex = maxIndex + 1;

      // Filter out empty repositories
      const validRepos = repositories.filter((repo) => repo.trim() !== "");

      await dispatch(
        createProject({
          name,
          description,
          additionalInformation: projectId ? { projectId } : undefined,
          repositories: validRepos.length > 0 ? validRepos : undefined,
          index: nextIndex,
        }),
      ).unwrap();

      // Reset form
      setName("");
      setDescription("");
      setProjectId("");
      setRepositories([""]);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    setProjectId("");
    setRepositories([""]);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New Project</SheetTitle>
          <SheetDescription>
            Add a new project to your workspace
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-6 px-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">
                Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                required
                placeholder="My Awesome Project"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">
                Description <span className="text-destructive">*</span>
              </FieldLabel>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                required
                rows={4}
                placeholder="A brief description of your project..."
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="projectId">Project ID (Optional)</FieldLabel>
              <Input
                id="projectId"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                disabled={isSubmitting}
                placeholder="my-project-id"
              />
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>Repositories (Optional)</FieldLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddRepository}
                  disabled={isSubmitting}
                >
                  <Plus className="size-4" />
                  Add
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {repositories.map((repo, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={repo}
                      onChange={(e) =>
                        handleRepositoryChange(index, e.target.value)
                      }
                      disabled={isSubmitting}
                      placeholder="https://github.com/username/repo"
                    />
                    {repositories.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveRepository(index)}
                        disabled={isSubmitting}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Field>
          </FieldGroup>

          <SheetFooter className="gap-2">
            <Button
              type="submit"
              disabled={isSubmitting || !name || !description}
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
