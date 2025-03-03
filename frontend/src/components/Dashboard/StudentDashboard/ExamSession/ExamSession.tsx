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

export const ExamSession = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<ExamSessionType | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const startExam = async () => {
      try {
        const data = await studentsService.startExam(Number(examId));
        setSession(data);
      } catch {
        toast.error("Failed to start exam");
        navigate("/student/dashboard/exams");
      } finally {
        setIsLoading(false);
      }
    };

    startExam();
  }, [examId, navigate]);

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

  const renderQuestion = (question: Question, index: number) => {
    const isCurrentQuestion = index === session?.currentQuestionIndex;
    const answer = session?.answers.find(
      (a) => a.questionId === question.id
    )?.answer;

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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Question {index + 1}</h5>
          {session?.exam.questionDisplayMode === DisplayMode.ALL && (
            <span className="badge bg-secondary">
              {answer ? "Answered" : "Not answered"}
            </span>
          )}
        </div>

        <p>{question.text}</p>

        <div className="options-list">
          {question.options?.map((option, optionIndex) => (
            <div className="form-check" key={optionIndex}>
              <input
                className="form-check-input"
                type="radio"
                name={`question-${question.id}`}
                id={`option-${question.id}-${optionIndex}`}
                value={option}
                checked={
                  session?.exam.questionDisplayMode === DisplayMode.ALL
                    ? currentAnswer === option
                    : answer === option
                }
                onChange={(e) => {
                  if (
                    session?.exam.questionDisplayMode === DisplayMode.SINGLE
                  ) {
                    setCurrentAnswer(e.target.value);
                  } else {
                    handleAnswerSubmit(question.id, e.target.value);
                  }
                }}
                disabled={isSubmitting}
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

          {session.exam.questions.map((question, index) =>
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
