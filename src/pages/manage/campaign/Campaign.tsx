import { memo, useState } from "react";
import { PaginationState, SortingState } from "@tanstack/react-table";
import {
  deleteCampaign,
  getAllCampaigns,
} from "../../../service/sip/campaignService";
import { DataTable } from "../../../components/data-table";
import { Campaign, columns } from "./columns";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";
import { usePaginatedQuery } from "../../../store/hooks/usePaginationQuery";
import { useDeleteMutation } from "../../../store/hooks/useDeleteMutation";

const Campaigns = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // Initial page index
    pageSize: 10, // Default page size
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: CampaignData, isError, isLoading, isSuccess } = usePaginatedQuery({
    queryKey: "campaigns",
    queryFn: getAllCampaigns,
    pagination,
    sorting,
  });

  const deleteMutation = useDeleteMutation({
    mutationFn: deleteCampaign,
    queryKey: "campaigns",
    onSuccessMessage: "Campaign is deleted successfully.",
  });

  const onDelete = (campaign: Campaign) => {
    deleteMutation.mutate(campaign.id);
  };

  return (
    <section className="py-10">
      <div className="container">
        <div className="flex w-full justify-between">
          <h1 className="mb-6 text-3xl font-bold">All Campaigns</h1>
          <Button>
            <Link to="/dashboard/manage/admin/campaign/create">
              Create Campaign
            </Link>
          </Button>
        </div>
        {!isLoading && !isError && isSuccess && (
          <DataTable
            columns={columns({ onDelete })}
            data={CampaignData?.data}
            pagination={pagination}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
            totalRecords={CampaignData?.meta.count || 0} // Assuming the response contains totalRecords
          />
        )}
      </div>
    </section>
  );
};

export default Campaigns;
