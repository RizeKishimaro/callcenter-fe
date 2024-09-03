import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"

export type Campaign = {
    id?: number;
    name?: number;
    prefix?: number;
    totalCall?: number;
    totalCallTime?: number;
    concurrentCallLimit?: number;
    welcomeIvr?: string;
    strategy?: null | 'rrmemory' | 'ringall' | 'lastrecent' | 'fewestcalls' | 'random' | 'rrordered';
}

export const columns: ColumnDef<Campaign>[] = [
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
        accessorKey: 'prefix',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Prefix
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: 'totalCallTime',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Total Call Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: 'concurrentCallLimit',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Concurrent Call Limit
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: 'welcomeIvr',
        header: "Welcome IVR"
    },
    {
        accessorKey: 'strategy',
        header: "Strategy"
    },
    {
        accessorKey: 'actions',
        header: "Action",
        cell: ({ row }) => {
            const campaign = row.original

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