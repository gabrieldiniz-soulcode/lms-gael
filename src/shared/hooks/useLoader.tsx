import { LoaderContext } from '@/contexts/LoaderContext';
import { useContext } from 'react';

export const useLoader = () => {
  const loaderContext = useContext(LoaderContext);

  if (!loaderContext) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }

  const { isLoading, responses, setIsLoading, setResponses, updateResponses } = loaderContext;

  return { isLoading, responses, setIsLoading, setResponses, updateResponses };
};
