import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { DataTableRowActions } from "../../../components/data-table-row-actions";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";

export type Campaign = {
  id?: number;
  name?: string;
  prefix?: string;
  totalCall?: number;
  totalCallTime?: number;
  SipProvider?: SipProvider | null;
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

const getFirstLetter = (name: string): string => {
  const nameArray = name?.split('');
  return nameArray ? nameArray[0]?.toLocaleUpperCase() : "N/A";
};

export const columns = ({ onEdit, onDelete }: AgentActionColumnsProps): ColumnDef<Agent>[] => [
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
    cell: ({row}) => {
      const id = row.getValue('id');
      return (
        <div className="w-[20px]">{id}</div>
      )
    }
  },
  {
    accessorKey: "profile",
    header: ({column}) => {
      return <div>Profile</div>
    },
    cell: ({ row }) => {
      const name = row.getValue('name');
      const profile = row.getValue("profile");
      const BackendURL = import.meta.env.VITE_APP_BACKEND_URL;
      return (
          <Avatar className="">
          <AvatarImage src={`${BackendURL}${profile}`} />
          <AvatarFallback>{getFirstLetter(name)}</AvatarFallback>
        </Avatar>
      )
    }
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
      const campaign: Campaign = row.getValue("Campaign");
      const sipProvider = campaign?.SipProvider;
      const sipProviderName = sipProvider?.name;
      return <div className="font-medium">{sipProviderName}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formatted = date.toLocaleDateString();
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => <DataTableRowActions row={row} onDelete={onDelete} />
  },
];
