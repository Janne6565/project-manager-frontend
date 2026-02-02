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
  const [repositories, setRepositories] = useState<string[]>([""]);
  const [additionalInfo, setAdditionalInfo] = useState<Array<{ id: string; key: string; value: string }>>([]);
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

  const handleAddAdditionalInfo = () => {
    setAdditionalInfo([
      ...additionalInfo,
      { id: `${Date.now()}-${additionalInfo.length}`, key: "", value: "" },
    ]);
  };

  const handleRemoveAdditionalInfo = (id: string) => {
    setAdditionalInfo(additionalInfo.filter((item) => item.id !== id));
  };

  const handleAdditionalInfoKeyChange = (id: string, newKey: string) => {
    setAdditionalInfo(
      additionalInfo.map((item) =>
        item.id === id ? { ...item, key: newKey } : item
      )
    );
  };

  const handleAdditionalInfoValueChange = (id: string, newValue: string) => {
    setAdditionalInfo(
      additionalInfo.map((item) =>
        item.id === id ? { ...item, value: newValue } : item
      )
    );
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

      // Filter out empty additional info entries and convert to object
      const validAdditionalInfo: Record<string, string> = {};
      additionalInfo.forEach(({ key, value }) => {
        if (key.trim() !== "" && value.trim() !== "") {
          validAdditionalInfo[key.trim()] = value.trim();
        }
      });

      await dispatch(
        createProject({
          name,
          description,
          additionalInformation: Object.keys(validAdditionalInfo).length > 0 ? validAdditionalInfo : undefined,
          repositories: validRepos.length > 0 ? validRepos : undefined,
          index: nextIndex,
        }),
      ).unwrap();

      // Reset form
      setName("");
      setDescription("");
      setRepositories([""]);
      setAdditionalInfo([]);
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
    setRepositories([""]);
    setAdditionalInfo([]);
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

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>Additional Information (Optional)</FieldLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddAdditionalInfo}
                  disabled={isSubmitting}
                >
                  <Plus className="size-4" />
                  Add
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {additionalInfo.length > 0 ? (
                  additionalInfo.map((item) => (
                    <div key={item.id} className="flex gap-2">
                      <Input
                        value={item.key}
                        onChange={(e) =>
                          handleAdditionalInfoKeyChange(item.id, e.target.value)
                        }
                        disabled={isSubmitting}
                        placeholder="Key"
                        className="w-1/3"
                      />
                      <Input
                        value={item.value}
                        onChange={(e) =>
                          handleAdditionalInfoValueChange(item.id, e.target.value)
                        }
                        disabled={isSubmitting}
                        placeholder="Value"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAdditionalInfo(item.id)}
                        disabled={isSubmitting}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddAdditionalInfo}
                    disabled={isSubmitting}
                    className="w-fit"
                  >
                    <Plus className="size-4" />
                    Add Attribute
                  </Button>
                )}
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
