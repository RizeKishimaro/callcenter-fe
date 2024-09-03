import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"

export type User = {
    id: number;
    name: string;
    sipName: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'id',
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
        accessorKey: 'name',
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
    },
    {
        accessorKey: 'sipName',
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Sip Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
    },
    {
        accessorKey: 'role',
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Role
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
    },
    {
        accessorKey: 'createdAt',
        header: "Create At",
        cell: ({ row }) => {
            const date = new Date(row.getValue('createdAt'))
            const formatted = date.toLocaleDateString()
            return <div className="font-medium">{formatted}</div>
        }
    },
    {
        accessorKey: 'updatedAt',
        header: "Create At",
        cell: ({ row }) => {
            const date = new Date(row.getValue('updatedAt'))
            const formatted = date.toLocaleDateString()
            return <div className="font-medium">{formatted}</div>
        }
    },
    {
        accessorKey: 'actions',
        header: "Action",
        cell: ({ row }) => {
            const agent = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='outline' className="w-full">
                            Action
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start'>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                        <DropdownMenuItem>Update</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    },
]