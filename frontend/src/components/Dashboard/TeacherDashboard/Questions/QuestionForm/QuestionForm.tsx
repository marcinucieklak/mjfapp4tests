import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash } from "react-bootstrap-icons";
import { QuestionFormData, Subject, Topic } from "../../../../../types";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useEffect, useState } from "react";
import { subjectsService } from "../../../../../services";
import { toast } from "react-toastify";

const questionSchema = Joi.object({
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
  subjectId: Joi.number().allow(null),
  topicId: Joi.number().allow(null),
  subtopicId: Joi.number().allow(null),
}).options({ stripUnknown: true });

interface QuestionFormProps {
  initialData?: QuestionFormData;
  onSubmit: (data: QuestionFormData) => Promise<void>;
  onCancel: () => void;
}

export const QuestionForm = ({
  initialData,
  onSubmit,
  onCancel,
}: QuestionFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<QuestionFormData>({
    resolver: joiResolver(questionSchema),
    defaultValues: initialData || {
      options: ["", ""],
      correctOption: 0,
    },
  });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [selectedSubjectDetails, setSelectedSubjectDetails] =
    useState<Subject | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const { fields, append, remove } = useFieldArray<QuestionFormData>({
    control,
    name: "options" as never,
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await subjectsService.getSubjects();
        setSubjects(data);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setIsLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleSubjectChange = async (subjectId: string) => {
    const id = subjectId ? Number(subjectId) : null;
    setValue("subjectId", id);
    setValue("topicId", null);
    setValue("subtopicId", null);

    if (id) {
      try {
        setIsLoadingDetails(true);
        const details = await subjectsService.getSubjectDetails(id);
        setSelectedSubjectDetails(details);
      } catch (error) {
        console.error("Failed to fetch subject details:", error);
        toast.error("Failed to load topics");
      } finally {
        setIsLoadingDetails(false);
      }
    } else {
      setSelectedSubjectDetails(null);
    }
  };

  const handleTopicChange = (topicId: string) => {
    const id = topicId ? Number(topicId) : null;
    setValue("topicId", id, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("subtopicId", null);

    const newSelectedTopic = selectedSubjectDetails?.topics?.find(
      (t) => t.id === id
    );
    setSelectedTopic(newSelectedTopic || null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label className="form-label">Question Text</label>
        <textarea
          className={`form-control ${errors.text ? "is-invalid" : ""}`}
          {...register("text")}
          rows={3}
        />
        {errors.text && (
          <div className="invalid-feedback">{errors.text.message}</div>
        )}
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label className="form-label">Subject (optional)</label>
          <select
            className="form-select"
            {...register("subjectId")}
            onChange={(e) => handleSubjectChange(e.target.value)}
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {isLoadingSubjects && (
            <div className="form-text text-muted">Loading subjects...</div>
          )}
        </div>

        {getValues("subjectId") && (
          <div className="col-md-4">
            <label className="form-label">Topic (optional)</label>
            <select
              className="form-select"
              {...register("topicId")}
              onChange={(e) => handleTopicChange(e.target.value)}
              disabled={isLoadingDetails}
            >
              <option value="">Select Topic</option>
              {selectedSubjectDetails?.topics?.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
            {isLoadingDetails && (
              <div className="form-text text-muted">Loading topics...</div>
            )}
          </div>
        )}

        {getValues("topicId") && (
          <div className="col-md-4">
            <label className="form-label">Subtopic (optional)</label>
            <select
              className="form-select"
              {...register("subtopicId")}
              disabled={!selectedTopic?.subtopics?.length}
            >
              <option value="">Select Subtopic</option>
              {selectedTopic?.subtopics?.map((subtopic) => (
                <option key={subtopic.id} value={subtopic.id}>
                  {subtopic.name}
                </option>
              ))}
            </select>
            {!selectedTopic?.subtopics?.length && (
              <div className="form-text text-muted">No subtopics available</div>
            )}
          </div>
        )}
      </div>

      <div className="mt-2">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => append("")}
        >
          <Plus size={16} className="me-1" />
          Add Option
        </button>
      </div>
      {errors.options && (
        <div className="invalid-feedback d-block">{errors.options.message}</div>
      )}

      <div className="mb-3">
        <label className="form-label">Options</label>
        {fields.map((field, index) => (
          <div key={field.id} className="input-group mb-2">
            <input
              type="text"
              className={`form-control ${
                errors.options?.[index] ? "is-invalid" : ""
              }`}
              {...register(`options.${index}`)}
              placeholder={`Option ${index + 1}`}
            />
            <div className="input-group-text">
              <input
                type="radio"
                className="form-check-input mt-0"
                {...register("correctOption")}
                value={index}
                defaultChecked={initialData?.correctOption === index}
              />
            </div>
            {fields.length > 2 && (
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => remove(index)}
              >
                <Trash size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : initialData ? "Update" : "Create"}{" "}
          Question
        </button>
      </div>
    </form>
  );
};
