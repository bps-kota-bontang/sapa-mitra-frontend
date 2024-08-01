export const formatCurrency = (number: number): string => {
  if (!number) return "0";
  const parts = number.toFixed(2).toString().split(".");
  const formattedInteger = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formattedInteger},${parts[1]}`;
};

export const formatNumber = (value: any): any => {
  if (!value) return "";
  value = `${value}`.replace(".", ",");

  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const formatParserNumber = (value: any): any => {
  if (!value) return "";

  return value
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
};
