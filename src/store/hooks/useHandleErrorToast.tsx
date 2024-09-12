import { useCallback } from "react";
import { AxiosError } from "axios";
import { useToast } from "../../components/ui/use-toast";

export const useHandleErrorToast = () => {
  const { toast } = useToast();

  return useCallback(
    (error: Error | AxiosError) => {
      const errorMessage =
        (error as AxiosError)?.response?.data?.message ||
        "Internal Server Error. Please tell your system administrator...";
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Error: ${errorMessage}`,
      });
    },
    [toast]
  );
};
