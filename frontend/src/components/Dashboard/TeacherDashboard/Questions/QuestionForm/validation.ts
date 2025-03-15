import Joi from "joi";

export const questionSchema = Joi.object({
  text: Joi.string().required().messages({
    "string.empty": "Question text is required",
  }),
  options: Joi.array()
    .min(2)
    .items(
      Joi.string().required().messages({
        "string.empty": "Option cannot be empty",
      })
    )
    .required()
    .messages({
      "array.min": "At least 2 options are required",
      "array.base": "Options are required",
    }),
  correctOption: Joi.number().required().messages({
    "number.base": "Correct option must be selected",
  }),
  subjectId: Joi.number().required().messages({
    "number.base": "Please select a subject",
    "any.required": "Please select a subject",
  }),
  topicId: Joi.number().allow(null),
  subtopicId: Joi.number().allow(null),
  image: Joi.any(),
  imageUrl: Joi.string().allow(null),
}).options({ stripUnknown: true });
