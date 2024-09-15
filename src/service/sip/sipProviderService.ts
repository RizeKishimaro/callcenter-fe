import { SortingState } from "@tanstack/react-table";
import axiosInstance from "../../providers/axiosClient";

const SIP_PROVIDER_URL = "sip-provider";

export const getAllSipProviders = async (
  pageIndex: number = 0,
  pageSize: number = 10,
  sorting: SortingState
) => {
  const sortBy = sorting.length > 0 ? sorting[0].id : "id"; // Default sort by 'id'
  const sortOrder =
    sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc"; // Default to ascending

  const response = await axiosInstance.get(SIP_PROVIDER_URL, {
    params: {
      limit: pageSize,
      page: pageIndex + 1,
      sortField: sortBy,
      sortType: sortOrder,
    },
  });
  return response.data;
};

export const createSetupSipProvider = async (body: {
  provider_number: string;
  name: string;
  codecs: string;
  transport: string;
  host: string;
  extension: string;
  concurrentlimit: number;
  strategy: string;
  prefix: string;
}) => {
  try {
    const response = await axiosInstance.post(
      `${SIP_PROVIDER_URL}/set-up`,
      body
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const createSipProvider = async (body: {
  provider_number: string;
  name: string;
  codecs: string;
  transport: string;
  host: string;
  extension: string;
}) => {
  try {
    const response = await axiosInstance.post(SIP_PROVIDER_URL, body);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateSipProvider = async (
  id: number,
  body: {
    provider_number: string;
    name: string;
    codecs: string;
    transport: string;
    host: string;
    extension: string;
  }
) => {
  const response = await axiosInstance.put(`${SIP_PROVIDER_URL}/${id}`, body);
  return response.data;
};

export const getSipProvider = async (id: number) => {
  const response = await axiosInstance.get(`${SIP_PROVIDER_URL}/${id}`);
  return response.data;
};

export const deleteSipProvider = async (id: number) => {
  const response = await axiosInstance.delete(`${SIP_PROVIDER_URL}/${id}`);
  return response.data;
};
