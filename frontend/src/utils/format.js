export const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value || 0);
