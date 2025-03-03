import { api } from "../utils/api";
import { Subject } from "../types";

export interface CreateSubjectDto {
  name: string;
  description: string;
}

export interface UpdateSubjectDto extends CreateSubjectDto {
  id: number;
}

export const subjectsService = {
  getSubjects: () => api.fetch<Subject[]>("/subjects"),

  getSubjectDetails: (id: number) =>
    api.fetch<Subject>(`/subjects/${id}/details`),

  createSubject: (data: CreateSubjectDto) =>
    api.fetch<Subject>("/subjects", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateSubject: (id: number, data: CreateSubjectDto) =>
    api.fetch<Subject>(`/subjects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteSubject: (id: number) =>
    api.fetch(`/subjects/${id}`, {
      method: "DELETE",
    }),
};
