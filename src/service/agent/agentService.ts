import { SortingState } from "@tanstack/react-table";
import axiosInstance from "../../providers/axiosClient";
import { AgentDto } from "../../providers/types/agent";

const AGENT_URL = "agent";

export const getAllAgents = async (
  pageIndex: number,
  pageSize: number,
  sorting: SortingState
) => {
  const sortBy = sorting.length > 0 ? sorting[0].id : "id"; // Default sort by 'id'
  const sortOrder =
    sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc"; // Default to ascending

  const response = await axiosInstance.get(AGENT_URL, {
    params: {
      limit: pageSize,
      page: pageIndex+1,
      sortField: sortBy,
      sortType: sortOrder,
    },
  });
  return response.data;
};

export const createAgent = async (formData: FormData) => {
  console.log("Over")
  const response = await axiosInstance.post(`${AGENT_URL}/register`, formData);
  return response.data;
};

export const updateAgent = async (id: number, body: AgentDto) => {
  const response = await axiosInstance.put(`${AGENT_URL}/${id}`, body);
  return response.data;
};

export const getAgent = async (id: number) => {
  const response = await axiosInstance.get(`${AGENT_URL}/${id}`);
  return response.data;
};

export const deleteAgent = async (id: number) => {
  const response = await axiosInstance.delete(`${AGENT_URL}/${id}`);
  return response.data;
};
