import { SortingState } from "@tanstack/react-table";
import axiosInstance from "../../providers/axiosClient";

const CAMPAIGN_URL = "campaign";

export const getAllCampaigns = async (
  pageIndex: number = 0,
  pageSize: number = 10,
  sorting: SortingState
) => {
  const sortBy = sorting.length > 0 ? sorting[0].id : "id"; // Default sort by 'id'
  const sortOrder =
    sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc"; // Default to ascending

  const response = await axiosInstance.get(CAMPAIGN_URL, {
    params: {
      limit: pageSize,
      page: pageIndex + 1,
      sortField: sortBy,
      sortType: sortOrder,
    },
  });
  console.log("the response : ", response.data)
  return response.data;
};

export const createCampaign = async (body: {
  name: string;
  concurrentlimit: number;
  strategy: string;
  prefix: string;
}) => {
  const response = await axiosInstance.post(CAMPAIGN_URL, body);
  return response.data;
};

export const updateCampaign = async (
  id: number,
  body: { name: string; concurrentlimit: number; strategy: string }
) => {
  const response = await axiosInstance.put(`${CAMPAIGN_URL}/${id}`, body);
  return response.data;
};

export const getCampaign = async (id: number) => {
  const response = await axiosInstance.get(`${CAMPAIGN_URL}/${id}`);
  return response.data;
};

export const deleteCampaign = async (id: number) => {
  const response = await axiosInstance.delete(`${CAMPAIGN_URL}/${id}`);
  return response.data;
};
