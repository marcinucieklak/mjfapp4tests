import { api } from "../utils/api";
import { DisplayMode, Exam } from "../types";

export interface CreateExamDto {
  title: string;
  questionDisplayMode: DisplayMode;
  questionIds: number[];
  groupId: number;
  subjectId?: number;
  topicId?: number;
  subtopicId?: number;
}

export const examsService = {
  getExams: () => api.fetch<Exam[]>("/exams"),

  getExam: (id: number) => api.fetch<Exam>(`/exams/${id}`),

  createExam: (data: CreateExamDto) =>
    api.fetch<Exam>("/exams", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateExam: (id: number, data: CreateExamDto) =>
    api.fetch<Exam>(`/exams/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteExam: (id: number) =>
    api.fetch(`/exams/${id}`, {
      method: "DELETE",
    }),
};
