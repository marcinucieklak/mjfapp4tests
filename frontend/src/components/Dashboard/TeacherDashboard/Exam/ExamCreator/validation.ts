import Joi from "joi";
import { DisplayMode } from "../../../../../types";

export const examSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
  }),
  description: Joi.string().allow(""),
  displayMode: Joi.string()
    .valid(...Object.values(DisplayMode))
    .required(),
  timeLimit: Joi.number().min(0).max(180).allow(null).optional().messages({
    "number.min": "Time limit must be at least 0 minutes",
    "number.max": "Time limit cannot exceed 180 minutes",
  }),
  startDate: Joi.date().required().messages({
    "date.base": "Invalid date format",
    "any.required": "Start date is required",
  }),
  endDate: Joi.date().required().min(Joi.ref("startDate")).messages({
    "date.base": "Invalid date format",
    "any.required": "End date is required",
    "date.min": "End date must be after start date",
  }),
  groupId: Joi.number().required().messages({
    "number.base": "Please select a group",
    "any.required": "Please select a group",
  }),
  selectedQuestions: Joi.array().min(1).required().messages({
    "array.min": "Select at least one question",
    "array.base": "Select at least one question",
  }),
  subjectId: Joi.number().allow(null),
  topicId: Joi.number().allow(null),
  subtopicId: Joi.number().allow(null),
});
