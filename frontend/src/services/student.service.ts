import { api } from "../utils/api";
import {
  ExamAvailability,
  ExamSession,
  Group,
  StudentExam,
  StudentOverview,
  User,
} from "../types/models";

export const studentsService = {
  getStudents: () => api.fetch<User[]>("/users/students"),

  getMyGroups: () => api.fetch<Group[]>("/students/groups"),

  getMyExams: () => api.fetch<StudentExam[]>("/students/exams"),

  getExam: (id: number) => api.fetch<StudentExam>(`/students/exams/${id}`),

  startExam: (examId: number) =>
    api.fetch<ExamSession>(`/students/exam-sessions/${examId}/start`, {
      method: "POST",
    }),

  submitAnswer: (sessionId: number, questionId: number, answer: string) =>
    api.fetch<void>(`/students/exam-sessions/${sessionId}/answers`, {
      method: "POST",
      body: JSON.stringify({ questionId, answer }),
    }),

  finishExam: (sessionId: number) =>
    api.fetch<void>(`/students/exam-sessions/${sessionId}/finish`, {
      method: "POST",
    }),

  getOverview: () => api.fetch<StudentOverview>("/students/overview"),

  checkAvailability: (examId: number) =>
    api.fetch<ExamAvailability>(`/students/exams/${examId}/availability`),
};
