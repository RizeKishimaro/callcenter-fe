
import { AxiosError } from 'axios'; // Ensure AxiosError is imported if using Axios
import { useHandleErrorToast } from './useHandleErrorToast';
import { toast } from '../../components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type UseDeleteMutationProps<T> = {
  mutationFn: () => Promise<T>;
  queryKey: string | unknown[];  // Adjust this type based on your query key usage
  onSuccessMessage: string;
};

export const useDeleteMutation = <T,>({
  mutationFn,
  queryKey,
  onSuccessMessage,
}: UseDeleteMutationProps<T>) => {
  const queryClient = useQueryClient();
  const handleErrorToast = useHandleErrorToast(); // Ensure this function is implemented

  return useMutation<T, AxiosError>({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast({
        variant: "success",
        title: "Deleted!",
        description: onSuccessMessage,
      });
    },
    onError: (error: AxiosError) => {
      handleErrorToast(error); // Ensure handleErrorToast handles AxiosError properly
    },
  });
};

