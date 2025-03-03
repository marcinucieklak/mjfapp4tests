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
