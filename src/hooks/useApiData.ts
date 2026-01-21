import React from "react";
import { useToast } from "./useToast";
import { getErrorMessage } from "../utils/errors";

export interface DataState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseApiDataOptions {
  errorMessage?: string;
  toastOnError?: boolean;
  onError?: (error: Error) => void;
}

export function useApiData<T>(
  fetchFunction: () => Promise<T[]>,
  options: UseApiDataOptions = {}
): DataState<T> {
  const { errorMessage = "An error occurred", toastOnError = false, onError } = options;
  const [data, setData] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { addToast } = useToast();
  const requestIdRef = React.useRef(0);
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchData = React.useCallback(async () => {
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      console.log('useApiData: fetching...', requestId);
      const result = await fetchFunction();
      console.log('useApiData: fetched', requestId, 'result count:', result?.length);
      if (!isMountedRef.current || requestId !== requestIdRef.current) {
        console.log('useApiData: aborted (mounted/id mismatch)', requestId, isMountedRef.current, requestIdRef.current);
        return;
      }
      setData(result);
    } catch (err) {
      console.error('useApiData: error', requestId, err);
      if (!isMountedRef.current || requestId !== requestIdRef.current) {
        return;
      }
      const message = getErrorMessage(err, errorMessage);
      setError(message);
      if (toastOnError) {
        addToast(message, "error");
      }
      if (err instanceof Error) {
        onError?.(err);
      }
    } finally {
      if (isMountedRef.current && requestId === requestIdRef.current) {
        console.log('useApiData: finished loading', requestId);
        setLoading(false);
      }
    }
  }, [addToast, errorMessage, fetchFunction, onError, toastOnError]);

  React.useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
