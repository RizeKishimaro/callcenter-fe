import { SortingState } from "@tanstack/react-table";
import axiosInstance from "../../providers/axiosClient";

const CALL_HISTORY_URL = "call-history";

interface CallHistoryFilters {
  agentId?: string;
  startDate?: string;
  endDate?: string;
  direction?: string;
  filterModel?: string;
  filterKeyword?: string;
}

export const getAllCallHistories = async (
  pageIndex: number,
  pageSize: number,
  sorting: SortingState,
  filters: CallHistoryFilters = {} // Accept filters as an argument
) => {
  const sortBy = sorting.length > 0 ? sorting[0].id : "id"; // Default sort by 'id'
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc"; // Default to descending

  // Prepare query parameters, including all available filters
  const params: any = {
    limit: pageSize,
    page: pageIndex + 1,
    sortField: sortBy,
    sortType: sortOrder,
  };

  // Add optional filters if they are provided
  if (filters.agentId) params.agentId = filters.agentId;
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  if (filters.direction) params.direction = filters.direction;
  if (filters.filterModel) params.filterModel = filters.filterModel;
  if (filters.filterKeyword) params.filterKeyword = filters.filterKeyword;

  try {
    const response = await axiosInstance.get(CALL_HISTORY_URL, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching call histories:", error);
    throw error;
  }
};
