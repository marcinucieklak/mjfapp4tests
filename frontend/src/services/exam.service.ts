import { api } from "../utils/api";
import { DisplayMode, Exam, ExamSession } from "../types";

export interface CreateExamDto {
  title: string;
  questionDisplayMode: DisplayMode;
  questionIds: number[];
  groupId: number;
  subjectId?: number;
  topicId?: number;
  subtopicId?: number;
  timeLimit: number;
  startDate?: string;
  endDate?: string;
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

  getExamWithSessions: (examId: number) =>
    api.fetch<Exam>(`/exams/${examId}/results`),

  getExamSessionDetails: (examId: number, sessionId: number) =>
    api.fetch<ExamSession>(`/exams/${examId}/sessions/${sessionId}`),
};
