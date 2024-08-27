import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu"
import { Checkbox } from "@components/ui/checkbox"

import { ColumnDef } from "@tanstack/react-table"

export type Agent = {
  id: number
  ag_name: string
  sip_name: string
  ag_profile: string | null
  ag_call_time: number | null
  campaign_id: number
  sip_provider_id: number
  created_at: string
}

export const agentcolumns: ColumnDef<Agent>[] = [
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "ag_name",
    header: "Agent Name",
  },
  {
    accessorKey: "sip_name",
    header: "SIP Name",
  },
  {
    accessorKey: "ag_profile",
    header: "Profile",
  },
  {
    accessorKey: "ag_call_time",
    header: "Call Time (s)",
    cell: ({ getValue }) => {
      const callTime = getValue<number | null>()
      return callTime !== null ? `${callTime}s` : "N/A"
    },
  },
  {
    accessorKey: "campaign_id",
    header: "Campaign ID",
  },
  {
    accessorKey: "sip_provider_id",
    header: "SIP Provider ID",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ getValue }) => {
      const createdAt = new Date(getValue<string>())
      return createdAt.toLocaleString()
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const agent = row.original

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
              onClick={() => navigator.clipboard.writeText(agent.ag_name)}
            >
              Copy Agent Name
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(agent.sip_name)}
            >
              Copy SIP Name
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

