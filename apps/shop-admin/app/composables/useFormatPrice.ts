export const useFormatPrice = (price: number) => {
  // const { locale } = useI18n(); // use it like this `${locale.value}-EG`

  const formatedPrice = new Intl.NumberFormat(`en-EG`, {}).format(price);

  return formatedPrice;
};
