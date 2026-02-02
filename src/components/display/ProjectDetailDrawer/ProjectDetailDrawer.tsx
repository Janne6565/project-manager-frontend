import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
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
import { Plus, X } from "lucide-react";

interface ProjectDetailDrawerProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEditMode?: boolean;
}

export function ProjectDetailDrawer({
  project,
  open,
  onOpenChange,
  initialEditMode = false,
}: ProjectDetailDrawerProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [repositories, setRepositories] = useState<string[]>(
    project.repositories || [],
  );
  // Store additional info as array with stable IDs for React keys
  const [additionalInfo, setAdditionalInfo] = useState<Array<{ id: string; key: string; value: string }>>(
    Object.entries(project.additionalInformation || {}).map(([key, value], index) => ({
      id: `${Date.now()}-${index}`,
      key,
      value,
    }))
  );
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [isSaving, setIsSaving] = useState(false);
  
  // Track the previous open state to detect when drawer is opening
  const prevOpenRef = useRef(open);

  // Reset form state when project changes or drawer opens
  useEffect(() => {
    const isOpening = open && !prevOpenRef.current;
    prevOpenRef.current = open;
    
    if (isOpening) {
      setName(project.name);
      setDescription(project.description);
      setRepositories(project.repositories || []);
      setAdditionalInfo(
        Object.entries(project.additionalInformation || {}).map(([key, value], index) => ({
          id: `${Date.now()}-${index}`,
          key,
          value,
        }))
      );
      setIsEditing(initialEditMode);
    }
  }, [project, open, initialEditMode]);

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Filter out empty repositories
      const validRepos = repositories.filter((repo) => repo.trim() !== "");

      // Filter out empty additional info entries and convert back to object
      const validAdditionalInfo: Record<string, string> = {};
      additionalInfo.forEach(({ key, value }) => {
        if (key.trim() !== "" && value.trim() !== "") {
          validAdditionalInfo[key.trim()] = value.trim();
        }
      });

      await dispatch(
        updateProject({
          uuid: project.uuid,
          data: {
            name,
            description,
            repositories: validRepos.length > 0 ? validRepos : [],
            additionalInformation: Object.keys(validAdditionalInfo).length > 0 ? validAdditionalInfo : {},
            index: project.index,
          },
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
    setRepositories(project.repositories || []);
    setAdditionalInfo(
      Object.entries(project.additionalInformation || {}).map(([key, value], index) => ({
        id: `${Date.now()}-${index}`,
        key,
        value,
      }))
    );
    setIsEditing(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? t("projects.drawer.titleEdit") : t("projects.drawer.titleView")}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? t("projects.drawer.descriptionEdit")
              : t("projects.drawer.descriptionView")}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 py-6 px-5">
          {!isEditing ? (
            <>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium">{t("projects.drawer.name")}</h3>
                <p className="text-sm">{project.name}</p>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium">{t("projects.drawer.description")}</h3>
                <p className="text-muted-foreground text-sm">
                  {project.description || t("projects.drawer.noDescription")}
                </p>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium">{t("projects.drawer.repositories")}</h3>
                <div className="flex flex-col gap-1">
                  {(project.repositories?.length ?? 0) > 0 ? (
                    project.repositories?.map((repo, index) => (
                      <a
                        key={index}
                        href={repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm truncate"
                      >
                        {repo}
                      </a>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      {t("projects.drawer.noRepositories")}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium">{t("projects.drawer.contributions")}</h3>
                <Badge variant="outline" className="w-fit">
                  {t("projects.drawer.contributionCount", { count: project.contributions?.length ?? 0 })}
                </Badge>
              </div>

              {project.additionalInformation && Object.keys(project.additionalInformation).length > 0 && (
                <>
                  <Separator />
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium">{t("projects.drawer.additionalInfo")}</h3>
                    <div className="flex flex-col gap-2">
                      {Object.entries(project.additionalInformation).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-2">
                          <span className="text-sm font-medium text-muted-foreground min-w-[100px]">{key}:</span>
                          <span className="text-sm">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <form onSubmit={(e) => e.preventDefault()}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">{t("projects.drawer.name")}</FieldLabel>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSaving}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">{t("projects.drawer.description")}</FieldLabel>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSaving}
                    rows={4}
                  />
                </Field>
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel>{t("projects.drawer.repositories")}</FieldLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleAddRepository}
                      disabled={isSaving}
                    >
                      <Plus className="size-4" />
                      {t("common.add")}
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {repositories.length > 0 ? (
                      repositories.map((repo, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={repo}
                            onChange={(e) =>
                              handleRepositoryChange(index, e.target.value)
                            }
                            disabled={isSaving}
                            placeholder={t("projects.drawer.repositoryPlaceholder")}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveRepository(index)}
                            disabled={isSaving}
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
                        onClick={handleAddRepository}
                        disabled={isSaving}
                        className="w-fit"
                      >
                        <Plus className="size-4" />
                        {t("projects.drawer.addRepository")}
                      </Button>
                    )}
                  </div>
                </Field>
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel>{t("projects.drawer.additionalInfo")}</FieldLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleAddAdditionalInfo}
                      disabled={isSaving}
                    >
                      <Plus className="size-4" />
                      {t("common.add")}
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
                            disabled={isSaving}
                            placeholder={t("projects.drawer.keyPlaceholder")}
                            className="w-1/3"
                          />
                          <Input
                            value={item.value}
                            onChange={(e) =>
                              handleAdditionalInfoValueChange(item.id, e.target.value)
                            }
                            disabled={isSaving}
                            placeholder={t("projects.drawer.valuePlaceholder")}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAdditionalInfo(item.id)}
                            disabled={isSaving}
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
                        disabled={isSaving}
                        className="w-fit"
                      >
                        <Plus className="size-4" />
                        {t("projects.drawer.addAttribute")}
                      </Button>
                    )}
                  </div>
                </Field>
              </FieldGroup>
            </form>
          )}
        </div>

        <SheetFooter className="gap-2">
          {!isEditing ? (
            <>
              <Button onClick={() => setIsEditing(true)}>{t("projects.drawer.editButton")}</Button>
              <SheetClose asChild>
                <Button variant="outline">{t("projects.drawer.close")}</Button>
              </SheetClose>
            </>
          ) : (
            <>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? t("projects.drawer.saving") : t("projects.drawer.saveButton")}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                {t("projects.drawer.cancel")}
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
