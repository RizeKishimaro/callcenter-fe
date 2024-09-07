import { ArrowUpDown } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Badge } from "../../../components/ui/badge";


export interface CallHangupBy {
    id: number;
    name: string;
    sipName: string;
    campaignId: number;
    sipProviderId: number;
}

export interface CallHistory {
    id: number;
    callerNumber: string;
    agentNumberId: number | null;
    callHangupById: number | null;
    transferById: number | null;
    callStartTime: string; // ISO date string
    callEndTime: string;   // ISO date string
    totalSeconds: string;  // Can be a number if you want, but keeping as string for compatibility
    call_status: string;
    campaign_name: string;
    direction: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    callHangupBy?: CallHangupBy; // Optional, as it can be null or undefined
}

export const columns: ColumnDef<CallHistory>[] = [
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const callHistory = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full">
                            Actions
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
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
        accessorKey: "callerNumber",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Caller Number
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "callHangupBy",
        header: "HangUpBy",
        cell: ({ row }) => {
            const callHangupBy = row.getValue<CallHangupBy>("callHangupBy");
            return <div>{callHangupBy ? callHangupBy.name : "N/A"}</div>;
        },
    },
    {
        accessorKey: "transferById",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Transfer By
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "callStartTime",
        header: "Call Start Time",
        cell: ({ row }) => {
            const date = new Date(row.getValue("callStartTime"));
            const formatted = date.toLocaleTimeString();
            return <div className="font-medium w-[100px]">{formatted}</div>;
        },
    },
    {
        accessorKey: "callEndTime",
        header: "Call End Time",
        cell: ({ row }) => {
            const date = new Date(row.getValue("callEndTime"));
            const formatted = date.toLocaleTimeString();
            return <div className="font-medium w-[100px]">{formatted}</div>;
        },
    },
    {
        accessorKey: "totalSeconds",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Total Seconds
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "call_status",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Call Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "campaign_name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Campaign Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "direction",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Direction
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const direction = row.getValue('direction') || "";

            // Define the badge color based on the direction
            const badgeColor = direction === "incoming" ? "bg-green-500 text-xs hover:bg-green-500/75" : direction === "outgoing" ? "bg-blue-500 text-xs hover:bg-blue-500/75" : "bg-gray-500 text-xs hover:bg-gray-500/75";

            return (
                <>
                    {direction ? (
                        <Badge className={`${badgeColor} text-white cursor-pointer`} > {direction}</Badge >
                    ) : (
                        <Badge className={`${badgeColor} text-white cursor-pointer`}>N/A</Badge>  // Display 'N/A' if direction is null or empty
                    )}
                </>
            );
        }
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"));
            const formatted = date.toLocaleDateString();
            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => {
            const date = new Date(row.getValue("updatedAt"));
            const formatted = date.toLocaleDateString();
            return <div className="font-medium">{formatted}</div>;
        },
    },
];