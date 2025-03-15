import { api } from "../utils/api";
import { DashboardOverview } from "../types/models";

export const teacherService = {
  getDashboardOverview: () =>
    api.fetch<DashboardOverview>("/users/dashboard/overview"),
};
