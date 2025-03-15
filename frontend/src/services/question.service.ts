import { api } from "../utils/api";
import { Question } from "../types";

export interface CreateQuestionDto {
  text: string;
  options: string[];
  correctOption: number;
  subjectId?: number | null;
  topicId?: number | null;
  subtopicId?: number | null;
}

export const questionsService = {
  getQuestions: () => api.fetch<Question[]>("/questions"),

  createQuestion: (formData: FormData) =>
    api.fetch<Question>("/questions", {
      method: "POST",
      body: formData,
    }),

  updateQuestion: (id: number, formData: FormData) =>
    api.fetch<Question>(`/questions/${id}`, {
      method: "PUT",
      body: formData,
    }),

  deleteQuestion: (id: number) =>
    api.fetch(`/questions/${id}`, {
      method: "DELETE",
    }),
};
