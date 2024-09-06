import { SortingState } from "@tanstack/react-table";
import axiosInstance from "../../providers/axiosClient";
import { UserDto } from "../../providers/types/user";

const USER_URL = "user";

export const getAllUsers = async (
  pageIndex: number,
  pageSize: number,
  sorting: SortingState
) => {
  const sortBy = sorting.length > 0 ? sorting[0].id : "id"; // Default sort by 'id'
  const sortOrder =
    sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc"; // Default to ascending

  const response = await axiosInstance.get(USER_URL, {
    params: {
      limit: pageSize,
      page: pageIndex+1,
      sortField: sortBy,
      sortType: sortOrder,
    },
  });
  return response.data;
};

export const createUser = async (body: UserDto) => {
  const response = await axiosInstance.post(`${USER_URL}/register`, body);
  return response.data;
};
