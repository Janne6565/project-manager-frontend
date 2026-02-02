import type { ColumnDef } from '@tanstack/react-table';
import type { Project } from '@/types/project';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DragHandle } from '@/components/display/DataTable/DataTable';
import { Badge } from '@/components/ui/badge';

interface ColumnOptions {
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onRowClick?: (project: Project) => void;
}

export function createProjectColumns({
  onEdit,
  onDelete,
  onRowClick,
}: ColumnOptions = {}): ColumnDef<Project>[] {
  return [
    {
      id: 'drag',
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.uuid} />,
      size: 40,
    },
    {
      accessorKey: 'name',
      header: 'Name',
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
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className="text-muted-foreground max-w-md truncate text-sm">
          {row.original.description}
        </div>
      ),
    },
    {
      accessorKey: 'repositories',
      header: 'Repositories',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.repositories.length} repo{row.original.repositories.length !== 1 ? 's' : ''}
        </Badge>
      ),
      size: 120,
    },
    {
      accessorKey: 'contributions',
      header: 'Contributions',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.contributions.length}
        </Badge>
      ),
      size: 120,
    },
    {
      id: 'actions',
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
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => onEdit?.(project)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRowClick?.(project)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(project)}
                className="text-destructive focus:text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 60,
    },
  ];
}
