import { useQuery } from "@tanstack/react-query";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import { getAllSipProviders } from "../../../service/sip/sipProviderService";
import { AxiosError } from "axios";
import { useToast } from "../../../components/ui/use-toast";
import { DataTable } from "../../../components/data-table";
import { columns } from "./columns";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";

const SipProvider = () => {
    const { toast } = useToast();
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0, // Initial page index
        pageSize: 10, // Default page size
    });
    const [sorting, setSorting] = useState<SortingState>([]);

    const { data: SipProviderData, isError, isSuccess, isLoading, error } = useQuery({
        queryKey: ['agents', pagination, sorting],
        queryFn: () => getAllSipProviders(pagination.pageIndex, pagination.pageSize, sorting),
        keepPreviousData: true,
    });
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
  return (
    <section className='py-10'>
    <div className='container'>
    <div className="flex w-full justify-between">
      <h1 className='mb-6 text-3xl font-bold'>All Sip Providers</h1>
          <Button>
            <Link to='/dashboard/manage/admin/sip-provider/create'>Create Sip-Provider</Link>
          </Button>
        </div>
      {!isLoading && !isError && isSuccess && (
        <DataTable
          columns={columns}
          data={SipProviderData?.data}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          totalRecords={SipProviderData?.meta.count || 0} // Assuming the response contains totalRecords
        />
      )}
    </div>
  </section>
  )
}

export default SipProvider