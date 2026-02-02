import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createProject, fetchProjects } from "@/store/slices/projectsSlice";
import { fetchUnassignedContributions } from "@/store/slices/contributionsSlice";
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
  initialRepository?: string;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  initialRepository,
}: CreateProjectDialogProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects.projects);

  const [name, setName] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionDe, setDescriptionDe] = useState("");
  const [repositories, setRepositories] = useState<string[]>([initialRepository || ""]);
  const [additionalInfo, setAdditionalInfo] = useState<Array<{ id: string; key: string; value: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens with initial repository
  useEffect(() => {
    if (open) {
      setRepositories([initialRepository || ""]);
    }
  }, [open, initialRepository]);

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
          descriptionEn: descriptionEn.trim() || undefined,
          descriptionDe: descriptionDe.trim() || undefined,
          additionalInformation: Object.keys(validAdditionalInfo).length > 0 ? validAdditionalInfo : undefined,
          repositories: validRepos.length > 0 ? validRepos : undefined,
          index: nextIndex,
        }),
      ).unwrap();

      // Reload all data to reflect the new project and updated contributions
      await Promise.all([
        dispatch(fetchProjects()),
        dispatch(fetchUnassignedContributions()),
      ]);

      // Reset form and close dialog after successful creation and data reload
      setName("");
      setDescriptionEn("");
      setDescriptionDe("");
      setRepositories([initialRepository || ""]);
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
    setDescriptionEn("");
    setDescriptionDe("");
    setRepositories([""]);
    setAdditionalInfo([]);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("projects.create.title")}</SheetTitle>
          <SheetDescription>
            {t("projects.create.description")}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-6 px-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">
                {t("projects.create.name")} <span className="text-destructive">{t("projects.create.required")}</span>
              </FieldLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                required
                placeholder={t("projects.create.namePlaceholder")}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="descriptionEn">
                {t("projects.create.descriptionEn")}
              </FieldLabel>
              <Textarea
                id="descriptionEn"
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                disabled={isSubmitting}
                rows={4}
                placeholder="English description..."
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="descriptionDe">
                {t("projects.create.descriptionDe")}
              </FieldLabel>
              <Textarea
                id="descriptionDe"
                value={descriptionDe}
                onChange={(e) => setDescriptionDe(e.target.value)}
                disabled={isSubmitting}
                rows={4}
                placeholder="Deutsche Beschreibung..."
              />
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>{t("projects.create.repositories")}</FieldLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddRepository}
                  disabled={isSubmitting}
                >
                  <Plus className="size-4" />
                  {t("projects.create.addRepository")}
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
                      placeholder={t("projects.create.repositoriesPlaceholder")}
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
                <FieldLabel>{t("projects.create.additionalInfo")}</FieldLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddAdditionalInfo}
                  disabled={isSubmitting}
                >
                  <Plus className="size-4" />
                  {t("projects.create.addButton")}
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
                        placeholder={t("projects.create.keyPlaceholder")}
                        className="w-1/3"
                      />
                      <Input
                        value={item.value}
                        onChange={(e) =>
                          handleAdditionalInfoValueChange(item.id, e.target.value)
                        }
                        disabled={isSubmitting}
                        placeholder={t("projects.create.valuePlaceholder")}
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
                    {t("projects.create.addAttribute")}
                  </Button>
                )}
              </div>
            </Field>
          </FieldGroup>

          <SheetFooter className="gap-2">
            <Button
              type="submit"
              disabled={isSubmitting || !name}
            >
              {isSubmitting ? t("projects.create.creating") : t("projects.create.createButton")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {t("projects.create.cancel")}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
