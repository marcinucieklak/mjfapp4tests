import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../../Common";
import { studentsService } from "../../../../services";
import {
  DisplayMode,
  ExamSession as ExamSessionType,
  Question,
} from "../../../../types/models";
import "./ExamSession.css";
import { formatDateTime, formatTime, shuffle } from "../../../../utils";

const API_URL = import.meta.env.VITE_API_URL;

export const ExamSession = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<ExamSessionType | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Map<number, string>>(
    new Map()
  );
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [shuffledOptions, setShuffledOptions] = useState<Map<number, string[]>>(
    new Map()
  );
  const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (questionId: number) => {
    setLoadingImages((prev) => {
      const next = new Set(prev);
      next.delete(questionId);
      return next;
    });
  };

  const handleImageError = (questionId: number) => {
    setLoadingImages((prev) => {
      const next = new Set(prev);
      next.delete(questionId);
      return next;
    });
    toast.error("Failed to load question image");
  };

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const availability = await studentsService.checkAvailability(
          Number(examId)
        );

        if (!availability.canStart) {
          if (
            availability.startDate &&
            new Date(availability.startDate) > new Date()
          ) {
            toast.error(
              `Exam will be available from ${formatDateTime(
                availability.startDate
              )}`
            );
          } else if (
            availability.endDate &&
            new Date(availability.endDate) < new Date()
          ) {
            toast.error(
              `Exam has ended on ${formatDateTime(availability.endDate)}`
            );
          } else {
            toast.error("Exam is not available");
          }
          navigate("/student/dashboard/exams");
          return;
        }

        const data = await studentsService.startExam(Number(examId));
        setSession(data);

        const shuffled = shuffle(data.exam.questions);
        setShuffledQuestions(shuffled);

        const optionsMap = new Map();
        shuffled.forEach((question) => {
          optionsMap.set(question.id, shuffle(question.options));
        });
        setShuffledOptions(optionsMap);
      } catch {
        toast.error("Failed to start exam");
        navigate("/student/dashboard/exams");
      } finally {
        setIsLoading(false);
      }
    };

    checkAvailability();
  }, [examId, navigate]);

  useEffect(() => {
    if (!session?.timeoutAt) return;

    const timer = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor(
          (new Date(session.timeoutAt as string).getTime() - Date.now()) / 1000
        )
      );
      setTimeRemaining(remaining);

      if (remaining === 0) {
        clearInterval(timer);
        handleTimeExpired();
      }
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.timeoutAt]);

  const handleAnswerSubmit = async (questionId: number, answer: string) => {
    if (!session) return;
    setIsSubmitting(true);

    try {
      await studentsService.submitAnswer(session.id, questionId, answer);

      setSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          answers: [
            ...prev.answers.filter((a) => a.questionId !== questionId),
            { questionId, answer },
          ],
        };
      });
    } catch {
      toast.error("Failed to submit answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session || !currentAnswer) return;

    const currentQuestion =
      session.exam.questions[session.currentQuestionIndex];
    setIsSubmitting(true);

    try {
      await studentsService.submitAnswer(
        session.id,
        currentQuestion.id,
        currentAnswer
      );

      if (session.currentQuestionIndex === session.exam.questions.length - 1) {
        await studentsService.finishExam(session.id);
        toast.success("Exam completed successfully!");
        navigate("/student/dashboard/exams");
        return;
      }

      setSession((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          answers: [
            ...prev.answers,
            { questionId: currentQuestion.id, answer: currentAnswer },
          ],
        };
      });

      setCurrentAnswer("");
    } catch {
      toast.error("Failed to submit answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeExpired = async () => {
    try {
      await studentsService.finishExam(session!.id);
      toast.warning("Exam time has expired");
      navigate("/student/dashboard/exams");
    } catch {
      toast.error("Failed to finish exam");
    }
  };

  const renderQuestion = (question: Question, index: number) => {
    const isCurrentQuestion = index === session?.currentQuestionIndex;
    const submittedAnswer = session?.answers.find(
      (a) => a.questionId === question.id
    )?.answer;
    const selectedAnswer = selectedAnswers.get(question.id);
    const shuffledOptionsList = shuffledOptions.get(question.id) || [];

    const handleOptionChange = (option: string) => {
      if (session?.exam.questionDisplayMode === DisplayMode.SINGLE) {
        setCurrentAnswer(option);
      } else {
        setSelectedAnswers(new Map(selectedAnswers.set(question.id, option)));
      }
    };

    const handleAnswerClick = () => {
      if (session?.exam.questionDisplayMode === DisplayMode.ALL) {
        const answer = selectedAnswers.get(question.id);
        if (answer) {
          handleAnswerSubmit(question.id, answer);
        }
      }
    };

    return (
      <div
        key={question.id}
        className={`question-container mb-4 ${
          session?.exam.questionDisplayMode === DisplayMode.SINGLE &&
          !isCurrentQuestion
            ? "d-none"
            : ""
        }`}
      >
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 className="mb-0">Question {index + 1}</h5>
          {session?.exam.questionDisplayMode === DisplayMode.ALL && (
            <span
              className={`badge ${
                submittedAnswer ? "bg-success" : "bg-secondary"
              } ms-2`}
            >
              {submittedAnswer ? "Answered" : "Not answered"}
            </span>
          )}
        </div>

        <p className="mb-4">{question.text}</p>

        {question.imageFullUrl && (
          <div className="question-image-container mb-4">
            {loadingImages.has(question.id) && (
              <div className="image-loading-placeholder d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading image...</span>
                </div>
              </div>
            )}
            <img
              src={`${API_URL}${question.imageFullUrl}`}
              alt="Question illustration"
              className={`question-image ${
                loadingImages.has(question.id) ? "invisible" : ""
              }`}
              loading="lazy"
              onLoad={() => handleImageLoad(question.id)}
              onError={() => handleImageError(question.id)}
            />
          </div>
        )}

        <div className="options-list">
          {shuffledOptionsList.map((option, optionIndex) => (
            <div className="form-check" key={optionIndex}>
              <input
                className="form-check-input"
                type="radio"
                name={`question-${question.id}`}
                id={`option-${question.id}-${optionIndex}`}
                value={option}
                checked={
                  session?.exam.questionDisplayMode === DisplayMode.ALL
                    ? option === (submittedAnswer || selectedAnswer)
                    : option === currentAnswer
                }
                onChange={(e) => handleOptionChange(e.target.value)}
              />
              <label
                className="form-check-label"
                htmlFor={`option-${question.id}-${optionIndex}`}
              >
                {option}
              </label>
            </div>
          ))}
        </div>
        {session?.exam.questionDisplayMode === DisplayMode.ALL &&
          !submittedAnswer && (
            <div className="text-end mt-3">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAnswerClick}
                disabled={!selectedAnswers.has(question.id) || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Answer"
                )}
              </button>
            </div>
          )}
      </div>
    );
  };

  const handleFinishExam = async () => {
    if (!session) return;
    setIsSubmitting(true);

    try {
      await studentsService.finishExam(session.id);
      toast.success("Exam completed successfully!");
      navigate("/student/dashboard/exams");
    } catch {
      toast.error("Failed to finish exam");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null;
  }

  const isLastQuestion =
    session.currentQuestionIndex === session.exam.questions.length - 1;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="card-title mb-0">{session.exam.title}</h4>
            {timeRemaining !== null && (
              <div
                className={`badge ${
                  timeRemaining < 300 ? "bg-danger" : "bg-primary"
                }`}
              >
                Time Remaining: {formatTime(timeRemaining)}
              </div>
            )}
            <div className="d-flex gap-3 align-items-center">
              <span className="badge bg-secondary">
                {session.exam.group.name}
              </span>
              <span className="badge bg-primary">
                {session.exam.questionDisplayMode === DisplayMode.SINGLE
                  ? `Question ${session.currentQuestionIndex + 1} of ${
                      session.exam.questions.length
                    }`
                  : `${session.answers.length} of ${session.exam.questions.length} answered`}
              </span>
            </div>
          </div>

          {shuffledQuestions.map((question, index) =>
            renderQuestion(question, index)
          )}

          {session.exam.questionDisplayMode === DisplayMode.SINGLE ? (
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                {isLastQuestion ? "Last question" : "More questions ahead"}
              </small>
              <button
                className="btn btn-primary"
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Submitting...
                  </>
                ) : isLastQuestion ? (
                  "Finish Exam"
                ) : (
                  "Next Question"
                )}
              </button>
            </div>
          ) : (
            <div className="text-end">
              <button
                className="btn btn-primary"
                onClick={() => handleFinishExam()}
                disabled={
                  session.answers.length !== session.exam.questions.length ||
                  isSubmitting
                }
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Submitting...
                  </>
                ) : (
                  "Finish Exam"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
