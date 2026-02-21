export const usePlans = () => {
  const { data, isLoading, error } = useQueryContract(usePlansQuery());

  return { data, isLoading, error };
};
