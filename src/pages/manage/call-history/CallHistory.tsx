import { useCallback, useEffect, useState } from "react";
import { DataTable } from "../../../components/data-table"
import { useToast } from "../../../components/ui/use-toast"
import { columns } from "./columns"
import { PaginationState, SortingState } from "@tanstack/react-table";
import { getAllCallHistories } from "../../../service/call/callHistoryService";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip";

const CallHistory = () => {
    const { toast } = useToast();
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0, // Initial page index
        pageSize: 10, // Default page size
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        direction: "",
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [key]: value,
        }));
    };

    const { data: callHistoryData, isError, isSuccess, isLoading, error } = useQuery({
        queryKey: ['agents', pagination, sorting, filters],
        queryFn: () => getAllCallHistories(pagination.pageIndex, pagination.pageSize, sorting, filters),
        keepPreviousData: true,
    });

    const clearFilters = () => {
        setFilters({
            startDate: "",
            endDate: "",
            direction: "",
        });
    };

    const handleErrorToast = useCallback((error: Error) => {
        const errorMessage = error.response?.data?.message || "Internal Server Error. Please tell your system administrator...";
        toast({
            variant: "destructive",
            title: "Error!",
            description: `Error: ${errorMessage}`,
        });
    }, [toast]);

    useEffect(() => {
        if (isError && !isLoading && error instanceof AxiosError) {
            handleErrorToast(error);
        }
    }, [isLoading, isSuccess, isError, error, handleErrorToast]);

    const isAnyFilterApplied = Object.values(filters).some((filter) => filter !== "");

    return (
        <section className='py-10'>
            <div className='container'>
                <div className="flex w-full justify-start">
                    <h1 className='mb-6 text-3xl font-bold flex-1'>All Call Histories</h1>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {isAnyFilterApplied && (
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Button onClick={clearFilters} variant="ghost" className="ml-2">
                                            <Trash2 className="text-red-400 h-5 w-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        Reset
                                    </TooltipContent>
                                </Tooltip>
                            )}
                            {/* StartDate, endDate and Direction(outgoing, incoming) */}
                            <Input
                                type="date"
                                placeholder="Start Date"
                                value={filters.startDate}
                                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                            />
                            <Input
                                type="date"
                                placeholder="End Date"
                                value={filters.endDate}
                                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                            />
                            <SelectGroup>
                                <Select
                                    value={filters.direction}
                                    onValueChange={(value) => handleFilterChange("direction", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectLabel>Avaliable Type</SelectLabel>
                                        <SelectItem value="outgoing">Outgoing</SelectItem>
                                        <SelectItem value="incoming">Incoming</SelectItem>
                                    </SelectContent>

                                </Select>
                            </SelectGroup>
                        </div>
                    </div>
                </div>
                {!isLoading && !isError && isSuccess && (
                    <>
                        <DataTable
                            columns={columns}
                            data={callHistoryData?.data}
                            pagination={pagination}
                            setPagination={setPagination}
                            sorting={sorting}
                            setSorting={setSorting}
                            totalRecords={callHistoryData?.meta.count} // Assuming the response contains totalRecords
                        />
                    </>
                )}
            </div>
        </section>
    )
}

export default CallHistory