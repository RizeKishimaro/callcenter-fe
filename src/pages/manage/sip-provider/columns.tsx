import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { DataTableRowActions } from "../../../components/data-table-row-actions";

export type SipProvider = {
  id?: number;
  name?: string;
  codecs?: string;
  transport?: string;
  provider_number?: number;
  host?: string;
  extension?: string;
};

interface SipProviderActionColumnsProps {
  onEdit?: (sipProvider: SipProvider) => void;
  onDelete?: (sipProvider: SipProvider) => void;
}

export const columns = ({
  onEdit,
  onDelete,
}: SipProviderActionColumnsProps): ColumnDef<SipProvider>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "codecs",
    header: "Codecs",
    cell: ({ row }) => {
      const codecs: string = row.getValue("codecs") || "";
      const codeLists: string[] = codecs.split(",");

      return (
        <div>
          {codeLists.map((codec, index) => (
            <Badge key={index} className="mx-2">
              {codec}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "transport",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Transport
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "provider_number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Provider Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "host",
    header: "Host",
  },
  {
    accessorKey: "extension",
    header: "Extension",
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => <DataTableRowActions row={row} onDelete={onDelete} />,
  },
];
