import { useQueryClient } from "@tanstack/react-query";
import { deleteAgent, getAllAgents } from "../../../service/agent/agentService";
import { memo, useState } from "react";
import { useToast } from "../../../components/ui/use-toast";
import { DataTable } from "../../../components/data-table";
import { Agent, columns } from "./columns";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";
import { usePaginatedQuery } from "../../../store/hooks/usePaginationQuery";
import { useDeleteMutation } from "../../../store/hooks/useDeleteMutation";

const Agents = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  
  const { data: AgentData, isError, isLoading, isSuccess } = usePaginatedQuery({
    queryKey: "agents",
    queryFn: getAllAgents,
    pagination,
    sorting,
  });

  const deleteMutation = useDeleteMutation({
    mutationFn: deleteAgent,
    queryKey: "agents",
    onSuccessMessage: "Agent deleted successfully.",
  });

  const onDelete = (agent: Agent) => {
    deleteMutation.mutate(agent.id);
  };

  return (
    <section className="py-10">
      <div className="container">
        <div className="flex w-full justify-between">
          <h1 className="mb-6 text-3xl font-bold">All Agents</h1>
          <Button>
            <Link to="/dashboard/manage/agent/create">Create Agent</Link>
          </Button>
        </div>
        {!isLoading && !isError && isSuccess && (
          <DataTable
            columns={columns({ onDelete })}
            data={AgentData?.data}
            pagination={pagination}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
            totalRecords={AgentData?.meta.count || 0}
          />
        )}
      </div>
    </section>
  );
};

export default memo(Agents);
