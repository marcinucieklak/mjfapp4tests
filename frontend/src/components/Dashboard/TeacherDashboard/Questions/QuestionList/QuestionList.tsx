import { useEffect, useState } from "react";
import {
  QuestionCircle,
  Pencil,
  Trash,
  CheckCircleFill,
  Filter,
} from "react-bootstrap-icons";
import "./QuestionList.css";
import { Question, QuestionFormData, Topic } from "../../../../../types";
import { toast } from "react-toastify";
import { ItemList } from "../../../../Common";
import { questionsService, topicsService } from "../../../../../services";
import { Modal } from "react-bootstrap";
import { QuestionForm } from "../QuestionForm";

export const QuestionList = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<number | null>(
    null
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchQuestions();
    fetchTopics();
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await questionsService.getQuestions();
      setQuestions(data);
    } catch {
      toast.error("Failed to fetch questions");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const data = await topicsService.getTopics();
      setTopics(data);
    } catch {
      toast.error("Failed to fetch topics");
    } finally {
      setIsLoadingTopics(false);
    }
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleEdit = (question: Question) => {
    setSelectedQuestion(question);
    setShowEditModal(true);
  };

  const handleCreateQuestion = async (data: QuestionFormData) => {
    try {
      const newQuestion = await questionsService.createQuestion(data);
      setQuestions([...questions, newQuestion]);
      setShowAddModal(false);
      toast.success("Question created successfully");
    } catch {
      toast.error("Failed to create question");
    }
  };

  const handleUpdateQuestion = async (data: QuestionFormData) => {
    console.log(selectedQuestion, data);
    if (!selectedQuestion) return;

    try {
      const updatedQuestion = await questionsService.updateQuestion(
        selectedQuestion.id,
        data
      );
      setQuestions(
        questions.map((q) =>
          q.id === selectedQuestion.id ? updatedQuestion : q
        )
      );
      setShowEditModal(false);
      setSelectedQuestion(null);
      toast.success("Question updated successfully");
    } catch {
      toast.error("Failed to update question");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await questionsService.deleteQuestion(id);
      setQuestions(questions.filter((q) => q.id !== id));
      toast.success("Question deleted successfully");
    } catch {
      toast.error("Failed to delete question");
    }
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTopic =
      !selectedTopicId || question.topicId === selectedTopicId;
    const matchesSubtopic =
      !selectedSubtopicId || question.subtopicId === selectedSubtopicId;

    return matchesSearch && matchesTopic && matchesSubtopic;
  });

  const handleTopicChange = (topicId: number | null) => {
    setSelectedTopicId(topicId);
    setSelectedSubtopicId(null);
  };

  if (isLoading || isLoadingTopics) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading questions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="questions-container">
      <ItemList
        title="Questions Management"
        onAdd={handleAdd}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        placeholder="Search questions..."
      >
        <div className="card filter-card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label d-flex align-items-center gap-2">
                  <Filter size={14} />
                  Filter by Topic
                </label>
                <select
                  className="form-select"
                  value={selectedTopicId || ""}
                  onChange={(e) =>
                    handleTopicChange(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                >
                  <option value="">All Topics</option>
                  {topics &&
                    topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.name}
                      </option>
                    ))}
                </select>
              </div>

              {selectedTopicId && (
                <div className="col-md-4">
                  <label className="form-label">Filter by Subtopic</label>
                  <select
                    className="form-select"
                    value={selectedSubtopicId || ""}
                    onChange={(e) =>
                      setSelectedSubtopicId(
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                  >
                    <option value="">All Subtopics</option>
                    {topics
                      .find((t) => t.id === selectedTopicId)
                      ?.subtopics?.map((subtopic) => (
                        <option key={subtopic.id} value={subtopic.id}>
                          {subtopic.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row g-4">
          {filteredQuestions.map((question) => (
            <div key={question.id} className="col-12">
              <div className="card question-card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="icon-wrapper bg-info-subtle rounded-3 p-3">
                        <QuestionCircle size={24} className="text-info" />
                      </div>
                      <div>
                        <h5 className="card-title mb-1">{question.text}</h5>
                        {question.topicId && (
                          <small className="text-muted">
                            {
                              topics.find((t) => t.id === question.topicId)
                                ?.name
                            }
                            {question.subtopicId && " > "}
                            {question.subtopicId &&
                              (
                                topics.find((t) => t.id === question.topicId)
                                  ?.subtopics ?? []
                              ).find((s) => s.id === question.subtopicId)?.name}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleEdit(question)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(question.id)}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="options-grid">
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={`option-card ${
                          index === question.correctOption
                            ? "option-correct"
                            : ""
                        }`}
                      >
                        <div className="d-flex align-items-center gap-2">
                          {index === question.correctOption && (
                            <CheckCircleFill
                              className="text-success"
                              size={14}
                            />
                          )}
                          <span>{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ItemList>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <QuestionForm
            onSubmit={handleCreateQuestion}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal.Body>
      </Modal>

      <Modal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setSelectedQuestion(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <QuestionForm
            initialData={selectedQuestion ?? undefined}
            onSubmit={handleUpdateQuestion}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedQuestion(null);
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};
