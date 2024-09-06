import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Checkbox } from "@components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

export type SipData = {
  id: number;
  sip_codecs: string | null;
  sip_transport: string | null;
  sip_host: string | null;
  sip_extension: string | null;
  sip_number: number | null;
};

export const sipColumns: ColumnDef<SipData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "sip_codecs",
    header: "SIP Codecs",
  },
  {
    accessorKey: "sip_transport",
    header: "SIP Transport",
  },
  {
    accessorKey: "sip_host",
    header: "SIP Host",
  },
  {
    accessorKey: "sip_extension",
    header: "SIP Extension",
  },
  {
    accessorKey: "sip_number",
    header: "SIP Number",
    cell: ({ getValue }) => {
      const sipNumber = getValue<number | null>();
      return sipNumber !== null ? sipNumber : "N/A";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const sipData = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(sipData.sip_number)}
            >
              Copy SIP Number
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(sipData.sip_host)}
            >
              Copy SIP Host
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];


