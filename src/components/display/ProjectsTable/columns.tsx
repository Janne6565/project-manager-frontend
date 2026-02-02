import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import type { Project } from "@/types/project";
import { MoreHorizontal, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import TooltipWrapper from "@/components/ui/tooltip-wrapper";

interface ColumnOptions {
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onRowClick?: (project: Project) => void;
  onToggleVisibility?: (project: Project) => void;
}

// Helper to get localized description
function getLocalizedDescription(project: Project, lang: string): string {
  if (lang === 'de' && project.descriptionDe) return project.descriptionDe;
  if (lang === 'en' && project.descriptionEn) return project.descriptionEn;
  return project.descriptionEn || project.descriptionDe || project.description || '';
}

export function createProjectColumns({
  onEdit,
  onDelete,
  onRowClick,
  onToggleVisibility,
}: ColumnOptions = {}): ColumnDef<Project>[] {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, i18n } = useTranslation();

  return [
    {
      id: "drag",
      header: () => null,
      cell: () => null, // Will be replaced in DraggableRow
      size: 40,
    },
    {
      id: "visibility",
      header: () => (
        <div className="flex items-center justify-center">
          <TooltipWrapper tooltip={t("projects.table.tooltips.visibility")}>
            <Eye className="size-4 text-muted-foreground" />
          </TooltipWrapper>
        </div>
      ),
      cell: ({ row }) => {
        const project = row.original;
        const isVisible = project.isVisible !== false;
        
        return (
          <div className="flex items-center justify-center">
            <TooltipWrapper
              tooltip={isVisible ? t("projects.table.tooltips.visibleToPublic") : t("projects.table.tooltips.hiddenFromPublic")}
            >
              <Switch
                checked={isVisible}
                onCheckedChange={() => onToggleVisibility?.(project)}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                className="data-[state=checked]:bg-green-600"
              />
            </TooltipWrapper>
          </div>
        );
      },
      size: 80,
    },
    {
      accessorKey: "name",
      header: t("projects.table.columns.name"),
      cell: ({ row }) => {
        const project = row.original;
        return (
          <Button
            variant="link"
            className="text-foreground w-fit px-0 text-left font-medium"
            onClick={() => onRowClick?.(project)}
          >
            {project.name}
          </Button>
        );
      },
    },
    {
      accessorKey: "description",
      header: t("projects.table.columns.description"),
      cell: ({ row }) => {
        const description = getLocalizedDescription(row.original, i18n.language);
        return (
          <div className="text-muted-foreground max-w-md truncate text-sm">
            {description}
          </div>
        );
      },
    },
    {
      accessorKey: "repositories",
      header: t("projects.table.columns.repositories"),
      cell: ({ row }) => {
        const count = row.original.repositories?.length ?? 0;
        return (
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {t("projects.table.repoCount", { count })}
          </Badge>
        );
      },
      size: 120,
    },
    {
      accessorKey: "contributions",
      header: t("projects.table.columns.contributions"),
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.contributions?.length ?? 0}
        </Badge>
      ),
      size: 120,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const project = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">{t("projects.table.actions.openMenu")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => onEdit?.(project)}>
                {t("projects.table.actions.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRowClick?.(project)}>
                {t("projects.table.actions.viewDetails")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(project)}
                className="text-destructive focus:text-destructive"
              >
                {t("projects.table.actions.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 60,
    },
  ];
}
