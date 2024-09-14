import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { DataTableRowActions } from "../../../components/data-table-row-actions";

export type Campaign = {
  id?: number;
  name?: string;
  prefix?: string;
  totalCall?: number;
  totalCallTime?: number;
};

export type Agent = {
  id: number;
  name: string;
  sipName: string;
  profile?: string;
  Campaign?: Campaign;
  SipProvider?: SipProvider;
  createdAt?: string;
};

export type SipProvider = {
  id?: number;
  name?: string;
  provider_number?: number;
  extension?: string;
};

interface AgentActionColumnsProps {
  onEdit?: (agent: Agent) => void;
  onDelete?: (agent: Agent) => void;
}

export const columns=({onEdit, onDelete}: AgentActionColumnsProps): ColumnDef<Agent>[] => [
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
    accessorKey: "sipName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sip Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "profile",
    header: "Profile",
  },
  {
    accessorKey: "Campaign",
    header: "Campaign",
    cell: ({ row }) => {
      const campaign: Campaign = row.getValue("Campaign");
      const campaignName = campaign?.name;
      return <div className="font-medium">{campaignName}</div>;
    },
  },
  {
    accessorKey: "SipProvider",
    header: "Sip Provider",
    cell: ({ row }) => {
      const sipProvider: SipProvider = row.getValue("SipProvider");
      const sipProviderName = sipProvider?.name;
      return <div className="font-medium">{sipProviderName}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Create At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formatted = date.toLocaleDateString();
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => <DataTableRowActions row={row} onDelete={onDelete}/>
  },
];
