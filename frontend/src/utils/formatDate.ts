export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("pl-PL", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

export const formatDateTime = (
  date: string | Date | null | undefined
): string => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("pl-PL", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTimeLimit = (minutes: number): string => {
  if (minutes === 0) return "No time limit";
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  return `${hours}h ${remainingMinutes}m`;
};

export const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
