export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("pl-PL", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};
