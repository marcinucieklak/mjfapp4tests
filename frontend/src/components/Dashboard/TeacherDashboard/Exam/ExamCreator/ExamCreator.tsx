import { joiResolver } from "@hookform/resolvers/joi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CreateExamDto, examsService } from "../../../../../services";
import { ExamFormData, DisplayMode } from "../../../../../types";
import { examSchema } from "./validation";
import { useInitialData } from "../../../../../hooks";
import { StepHeader } from "./StepHeader";
import { StepNavigation } from "./StepNavigation";
import { LoadingSpinner } from "../../../../Common";
import "./ExamCreator.css";

export const ExamCreator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { questions, subjects, topics, groups } = useInitialData({
    setIsLoading,
  });

  const defaultStartDate = new Date();
  const defaultEndDate = new Date();
  defaultEndDate.setDate(defaultEndDate.getDate() + 1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExamFormData>({
    resolver: joiResolver(examSchema),
    defaultValues: {
      displayMode: DisplayMode.SINGLE,
      selectedQuestions: [],
      subjectId: null,
      topicId: null,
      subtopicId: null,
      timeLimit: 0,
      startDate: defaultStartDate.toISOString().slice(0, 16),
      endDate: defaultEndDate.toISOString().slice(0, 16),
    },
  });

  useEffect(() => {
    const loadExam = async () => {
      if (id) {
        try {
          const exam = await examsService.getExam(Number(id));

          reset({
            title: exam.title,
            displayMode: exam.questionDisplayMode,
            selectedQuestions: exam.questions.map((q) => q.id),
            groupId: exam.groupId,
            subjectId: exam.subjectId || null,
            topicId: exam.topicId || null,
            subtopicId: exam.subtopicId || null,
            timeLimit: exam.timeLimit || 0,
            startDate: exam.startDate
              ? new Date(exam.startDate).toISOString().slice(0, 16)
              : undefined,
            endDate: exam.endDate
              ? new Date(exam.endDate).toISOString().slice(0, 16)
              : undefined,
          });
        } catch {
          toast.error("Failed to load exam");
          navigate("/teacher/dashboard/exams");
        }
      }
    };

    loadExam();
  }, [id, reset, navigate]);

  const handleNext = () => {
    let isValid = true;

    switch (currentStep) {
      case 1:
        if (!watch("title") || !watch("groupId")) {
          if (!watch("title")) {
            setValue("title", "", { shouldValidate: true });
          }
          if (!watch("groupId")) {
            setValue("groupId", 0, { shouldValidate: true });
            toast.error("Please select a group");
          }
          if (!watch("startDate")) {
            setValue("startDate", "", { shouldValidate: true });
            toast.error("Start date is required");
          }
          if (!watch("endDate")) {
            setValue("endDate", "", { shouldValidate: true });
            toast.error("End date is required");
          }

          const startDate = watch("startDate");
          const endDate = watch("endDate");
          if (
            startDate &&
            endDate &&
            new Date(endDate) <= new Date(startDate)
          ) {
            setValue("endDate", "", { shouldValidate: true });
            toast.error("End date must be after start date");
          }

          isValid = false;
        }
        break;
      case 2:
        isValid = true;
        break;
      case 3: {
        const selectedQuestions = watch("selectedQuestions");
        if (selectedQuestions.length === 0) {
          setValue("selectedQuestions", [], { shouldValidate: true });
          toast.error("Please select at least one question");
          isValid = false;
        }
        break;
      }
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(3, prev + 1));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="mb-3">
            <label className="form-label">Exam Title</label>
            <input
              type="text"
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              {...register("title")}
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title.message}</div>
            )}

            <div className="mt-3">
              <label className="form-label">Group</label>
              <select
                className={`form-select ${errors.groupId ? "is-invalid" : ""}`}
                {...register("groupId")}
              >
                <option value="">Select Group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              {errors.groupId && (
                <div className="invalid-feedback">{errors.groupId.message}</div>
              )}
            </div>

            <div className="mt-3">
              <label className="form-label">Display Mode</label>
              <select className="form-select" {...register("displayMode")}>
                {Object.values(DisplayMode).map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3">
              <label className="form-label">Time Limit (minutes)</label>
              <input
                type="number"
                className={`form-control ${
                  errors.timeLimit ? "is-invalid" : ""
                }`}
                {...register("timeLimit")}
                min="0"
                max="180"
              />
              <small className="text-muted">
                Set to 0 for no time limit (max 180 minutes)
              </small>
              {errors.timeLimit && (
                <div className="invalid-feedback">
                  {errors.timeLimit.message}
                </div>
              )}
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <label className="form-label">Start Date</label>
                <input
                  type="datetime-local"
                  className={`form-control ${
                    errors.startDate ? "is-invalid" : ""
                  }`}
                  {...register("startDate", { required: true })}
                  min={new Date().toISOString().slice(0, 16)}
                />
                {errors.startDate && (
                  <div className="invalid-feedback">
                    {errors.startDate.message}
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label">End Date</label>
                <input
                  type="datetime-local"
                  className={`form-control ${
                    errors.endDate ? "is-invalid" : ""
                  }`}
                  {...register("endDate", { required: true })}
                  min={
                    watch("startDate") || new Date().toISOString().slice(0, 16)
                  }
                />
                {errors.endDate && (
                  <div className="invalid-feedback">
                    {errors.endDate.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <div className="mb-3">
              <label className="form-label">Subject (Optional)</label>
              <select
                className="form-select"
                {...register("subjectId")}
                onChange={(e) => {
                  const id = e.target.value ? Number(e.target.value) : null;
                  setValue("subjectId", id);
                  setValue("topicId", null);
                  setValue("subtopicId", null);
                }}
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Topic (Optional)</label>
              <select
                className="form-select"
                {...register("topicId")}
                onChange={(e) => {
                  const id = e.target.value ? Number(e.target.value) : null;
                  setValue("topicId", id);
                  setValue("subtopicId", null);
                }}
              >
                <option value="">Select Topic</option>
                {topics
                  .filter(
                    (topic) =>
                      !watch("subjectId") ||
                      Number(topic.subjectId) === Number(watch("subjectId"))
                  )
                  .map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Subtopic (Optional)</label>
              <select className="form-select" {...register("subtopicId")}>
                <option value="">Select Subtopic</option>
                {watch("topicId") &&
                  topics
                    .find((t) => Number(t.id) === Number(watch("topicId")))
                    ?.subtopics?.map((subtopic) => (
                      <option key={subtopic.id} value={subtopic.id}>
                        {subtopic.name}
                      </option>
                    ))}
              </select>
            </div>
          </div>
        );

      case 3: {
        const selectedSubjectId = watch("subjectId");
        const selectedTopicId = watch("topicId");
        const selectedSubtopicId = watch("subtopicId");

        const filteredQuestions = questions.filter((question) => {
          const matchesSearch =
            searchTerm.toLowerCase().trim() === "" ||
            question.text.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesSubject =
            !selectedSubjectId ||
            Number(question.subjectId) === Number(selectedSubjectId);
          const matchesTopic =
            !selectedTopicId ||
            Number(question.topicId) === Number(selectedTopicId);
          const matchesSubtopic =
            !selectedSubtopicId ||
            Number(question.subtopicId) === Number(selectedSubtopicId);

          return (
            matchesSearch && matchesSubject && matchesTopic && matchesSubtopic
          );
        });

        return (
          <div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="questions-grid">
              {filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className={`card question-card cursor-pointer ${
                    watch("selectedQuestions").includes(question.id)
                      ? "border-primary"
                      : ""
                  }`}
                  onClick={() => {
                    const isSelected = watch("selectedQuestions").includes(
                      question.id
                    );
                    const newQuestions = isSelected
                      ? watch("selectedQuestions").filter(
                          (id) => id !== question.id
                        )
                      : [...watch("selectedQuestions"), question.id];
                    setValue("selectedQuestions", newQuestions);
                  }}
                >
                  <div className="card-body">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`question-${question.id}`}
                        checked={watch("selectedQuestions").includes(
                          question.id
                        )}
                        onChange={(e) => e.preventDefault()}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`question-${question.id}`}
                      >
                        {question.text}
                      </label>
                    </div>

                    <div className="options-grid mt-3">
                      {question.options.map((option, index) => (
                        <div
                          key={index}
                          className={`option-card ${
                            index === question.correctOption
                              ? "option-correct"
                              : ""
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  const onSubmit = async (data: ExamFormData) => {
    try {
      const examDto: CreateExamDto = {
        title: data.title,
        questionDisplayMode: data.displayMode,
        questionIds: data.selectedQuestions,
        groupId: data.groupId,
        subjectId: data.subjectId || undefined,
        topicId: data.topicId || undefined,
        subtopicId: data.subtopicId || undefined,
        timeLimit: data.timeLimit,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
      };

      if (id) {
        await examsService.updateExam(Number(id), examDto);
        toast.success("Exam updated successfully");
      } else {
        await examsService.createExam(examDto);
        toast.success("Exam created successfully");
      }

      navigate("/teacher/dashboard/exams");
    } catch {
      toast.error(id ? "Failed to update exam" : "Failed to create exam");
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <StepHeader currentStep={currentStep} setCurrentStep={setCurrentStep} />
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent()}
            <StepNavigation
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              isSubmitting={isSubmitting}
              onNext={handleNext}
              isEditMode={!!id}
            />
          </form>
        </div>
      </div>
    </div>
  );
};
