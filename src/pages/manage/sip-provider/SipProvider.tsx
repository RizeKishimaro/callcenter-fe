import { PaginationState, SortingState } from "@tanstack/react-table";
import { useState } from "react";
import {
  deleteSipProvider,
  getAllSipProviders,
} from "../../../service/sip/sipProviderService";
import { DataTable } from "../../../components/data-table";
import { columns, SipProvider } from "./columns";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";
import { usePaginatedQuery } from "../../../store/hooks/usePaginationQuery";
import { useDeleteMutation } from "../../../store/hooks/useDeleteMutation";

const SipProviders = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // Initial page index
    pageSize: 10, // Default page size
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const {
    data: SipProviderData,
    isError,
    isLoading,
    isSuccess,
  } = usePaginatedQuery({
    queryKey: "sipProviders",
    queryFn: getAllSipProviders,
    pagination,
    sorting,
  });

  const deleteMutation = useDeleteMutation({
    mutationFn: deleteSipProvider,
    queryKey: "sipProviders",
    onSuccessMessage: "Sip Provider is deleted successfully.",
  });

  const onDelete = (sipProvider: SipProvider) => {
    deleteMutation.mutate(sipProvider.id);
  };
  return (
    <section className="py-10">
      <div className="container">
        <div className="flex w-full justify-between">
          <h1 className="mb-6 text-3xl font-bold">All Sip Providers</h1>
          <Button>
            <Link to="/dashboard/manage/admin/sip-provider/create">
              Create Sip-Provider
            </Link>
          </Button>
        </div>
        {!isLoading && !isError && isSuccess && (
          <DataTable
            columns={columns({ onDelete })}
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
  );
};

export default SipProviders;
