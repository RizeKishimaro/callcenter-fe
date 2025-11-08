import { Row } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onEdit?: (value: TData) => void;
  onDelete?: (value: TData) => void;
}

export function DataTableRowActions<TData>({
  row,
  onEdit,
  onDelete,
}: DataTableRowActionsProps<TData>) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full">
          Action
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={()=> onDelete(row.original)}>Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
