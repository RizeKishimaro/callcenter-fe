import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { PaginationState, SortingState } from "@tanstack/react-table";

interface UsePaginatedQueryProps<T> {
  queryKey: string;
  queryFn: (pageIndex: number, pageSize: number, sorting: SortingState, filters?: Record<string, any>) => Promise<T>;
  pagination: PaginationState;
  sorting: SortingState;
  filters?: Record<string, any>;
  options?: UseQueryOptions<T>;
}

export const usePaginatedQuery = <T>({
  queryKey,
  queryFn,
  pagination,
  sorting,
  filters,
  options,
}: UsePaginatedQueryProps<T>) => {
  return useQuery({
    queryKey: [queryKey, pagination, sorting, filters],
    queryFn: () => queryFn(pagination.pageIndex, pagination.pageSize, sorting, filters),
    keepPreviousData: true,
    ...options,
  });
};
