export const formatCurrency = (number: number): string => {
  const parts = number.toFixed(2).toString().split(".");
  const formattedInteger = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formattedInteger},${parts[1]}`;
};
