import { api } from "../utils/api";
import { Group, CreateGroupDto, AddStudentToGroupDto } from "../types/models";

export const groupsService = {
  getGroups: () => api.fetch<Group[]>("/groups"),

  createGroup: (data: CreateGroupDto) =>
    api.fetch<Group>("/groups", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateGroup: (groupId: number, data: { name: string }) =>
    api.fetch<Group>(`/groups/${groupId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteGroup: (id: number) =>
    api.fetch(`/groups/${id}`, {
      method: "DELETE",
    }),

  addStudent: (data: AddStudentToGroupDto) =>
    api.fetch("/groups/add-student", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  removeStudent: (groupId: number, studentId: number) =>
    api.fetch(`/groups/${groupId}/students/${studentId}`, {
      method: "DELETE",
    }),
};
