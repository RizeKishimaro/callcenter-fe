import { useQuery } from "@tanstack/react-query";
import { getAllAgents } from "../../../service/agent/agentService";
import { memo, useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useToast } from "../../../components/ui/use-toast";
import { DataTable } from "../../../components/data-table";
import { columns } from "./columns";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";

const Agents = () => {
  const { toast } = useToast();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // Initial page index
    pageSize: 10, // Default page size
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: AgentData, isError, isSuccess, isLoading, error } = useQuery({
    queryKey: ['agents', pagination, sorting],
    queryFn: () => getAllAgents(pagination.pageIndex, pagination.pageSize, sorting),
  });
  const handleErrorToast = useCallback((error: Error) => {
    const errorMessage = error?.response?.data?.message || "Internal Server Error. Please tell your system administrator...";
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

  return (
    <section className='py-10'>
      <div className='container'>
        <div className="flex w-full justify-between">
          <h1 className='mb-6 text-3xl font-bold'>All Agents</h1>
          <Button>
            <Link to='/dashboard/manage/agent/create'>Create Agent</Link>
          </Button>
        </div>
        {!isLoading && !isError && isSuccess && (
          <DataTable
            columns={columns}
            data={AgentData?.data}
            pagination={pagination}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
            totalRecords={AgentData?.meta.count || 0} // Assuming the response contains totalRecords
          />
        )}
      </div>
    </section>
  );
};

export default memo(Agents);
