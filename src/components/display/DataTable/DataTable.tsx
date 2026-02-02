import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
} from "@tanstack/react-table";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DragHandleProps {
  listeners?: any;
  attributes?: any;
}

function DragHandle({ listeners, attributes }: DragHandleProps) {
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon-sm"
      className="text-muted-foreground cursor-grab active:cursor-grabbing"
    >
      <GripVertical className="size-4" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

interface DraggableRowProps<TData> {
  row: Row<TData>;
  onRowClick?: (data: TData) => void;
}

function DraggableRow<TData extends { uuid: string }>({
  row,
  onRowClick,
}: DraggableRowProps<TData>) {
  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
    attributes,
    listeners,
  } = useSortable({
    id: row.original.uuid,
  });

  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    // Don't trigger row click if clicking on interactive elements
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('button, a, [role="button"]');

    if (!isInteractive && onRowClick) {
      onRowClick(row.original);
    }
  };

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      onClick={handleRowClick}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-50 cursor-pointer"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {cell.column.id === "drag" ? (
            <DragHandle listeners={listeners} attributes={attributes} />
          ) : (
            flexRender(cell.column.columnDef.cell, cell.getContext())
          )}
        </TableCell>
      ))}
    </TableRow>
  );
}

export interface DataTableProps<TData extends { uuid: string }> {
  data: TData[];
  columns: ColumnDef<TData>[];
  onDragEnd?: (data: TData[]) => void;
  onRowClick?: (data: TData) => void;
}

export function DataTable<TData extends { uuid: string }>({
  data,
  columns,
  onDragEnd,
  onRowClick,
}: DataTableProps<TData>) {
  const [tableData, setTableData] = React.useState<TData[]>(data);
  const sortableId = React.useId();

  React.useEffect(() => {
    setTableData(data);
  }, [data]);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => tableData?.map(({ uuid }) => uuid) || [],
    [tableData],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getRowId: (row) => row.uuid,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = dataIds.indexOf(active.id);
      const newIndex = dataIds.indexOf(over.id);
      const newData = arrayMove(tableData, oldIndex, newIndex);
      setTableData(newData);
      onDragEnd?.(newData);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border">
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        id={sortableId}
      >
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.map((row) => (
                  <DraggableRow
                    key={row.id}
                    row={row}
                    onRowClick={onRowClick}
                  />
                ))}
              </SortableContext>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
}

export { DragHandle };
