import { useQueryContract, usePlansQuery } from '#imports';

export const usePlans = () => {
  const { data, isLoading, error, refresh } = useQueryContract(usePlansQuery());

  return { data, isLoading, error, refresh };
};
