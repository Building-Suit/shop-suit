export const useGetField = (
  data: any,
  key?: string,
  type?: Column['type']
): any => {
  if (!key) return format(data, type);

  const _key = key?.split('.');

  if (_key.length > 1) {
    return useGetField(data?.[_key?.at(0)!], _key.slice(1).join('.'));
  }

  let field = data?.[_key?.at(0)!];

  return format(field, type);
};

const format = (value: any, type?: Column['type']) => {
  if (type === 'price') return useFormatPrice(value);
  // if (type === 'date') return new Date(value).toLocaleDateString();
  if (type === 'date') return useLocalizationTimeAgo(value);
  return value;
};
