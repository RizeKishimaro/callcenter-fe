import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useHandleErrorToast } from "./useHandleErrorToast";

interface UseDeleteMutationProps<T> {
  mutationFn: (id: number) => Promise<T>;
  queryKey: string;
  onSuccessMessage: string;
}

export const useDeleteMutation = <T>({
  mutationFn,
  queryKey,
  onSuccessMessage,
}: UseDeleteMutationProps<T>) => {
  const queryClient = useQueryClient();
  const handleErrorToast = useHandleErrorToast();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      toast({
        variant: "success",
        title: "Deleted!",
        description: onSuccessMessage,
      });
    },
    onError: (error: AxiosError) => {
      handleErrorToast(error);
    },
  });
};
