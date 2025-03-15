import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash } from "react-bootstrap-icons";
import { QuestionFormData, Subject, Topic } from "../../../../../types";
import { joiResolver } from "@hookform/resolvers/joi";
import { useEffect, useRef, useState } from "react";
import { subjectsService } from "../../../../../services";
import { toast } from "react-toastify";
import { questionSchema } from "./validation";
import "./QuestionForm.css";

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
    defaultValues: {
      ...initialData,
      options: initialData?.options || ["", ""],
      correctOption: initialData?.correctOption || 0,
      image: null,
      imageUrl: initialData?.imageUrl || null,
      subjectId: initialData?.subjectId || null,
      topicId: initialData?.topicId || null,
      subtopicId: initialData?.subtopicId || null,
    },
    mode: "onChange",
  });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [selectedSubjectDetails, setSelectedSubjectDetails] =
    useState<Subject | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.imageUrl || null
  );

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

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await subjectsService.getSubjects();
        setSubjects(data);

        // If we have initial subject ID, fetch its details
        if (initialData?.subjectId) {
          setIsLoadingDetails(true);
          const details = await subjectsService.getSubjectDetails(
            initialData.subjectId
          );
          setSelectedSubjectDetails(details);

          // If we have initial topic, set it
          if (initialData.topicId) {
            const topic = details.topics?.find(
              (t) => t.id === initialData.topicId
            );
            setSelectedTopic(topic || null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoadingSubjects(false);
        setIsLoadingDetails(false);
      }
    };

    fetchInitialData();
  }, [initialData?.subjectId, initialData?.topicId]);

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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setValue("image", file, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("imageUrl", null);

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleRemoveImage = () => {
    setValue("image", null, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("imageUrl", null);

    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

      <div className="mb-3">
        <label className="form-label">Image (optional)</label>
        <div className="d-flex gap-3 align-items-start">
          <div className="flex-grow-1">
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            <small className="text-muted d-block mt-1">
              Max file size: 5MB. Supported formats: JPG, PNG, GIF
            </small>
          </div>
          {previewUrl && (
            <div className="position-relative">
              <img
                src={previewUrl}
                alt="Question preview"
                className="rounded"
                style={{ maxHeight: "100px" }}
              />
              <button
                type="button"
                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                onClick={handleRemoveImage}
              >
                <Trash size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label className="form-label">Subject</label>
          <select
            className={`form-select ${errors.subjectId ? "is-invalid" : ""}`}
            {...register("subjectId")}
            onChange={(e) => handleSubjectChange(e.target.value)}
            value={getValues("subjectId")?.toString() || ""}
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
          {errors.subjectId && (
            <div className="invalid-feedback">{errors.subjectId.message}</div>
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
