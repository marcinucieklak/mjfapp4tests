import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Trash,
} from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { subjectsService, topicsService } from "../../../../../services";
import { Subject, Subtopic, Topic } from "../../../../../types";
import { ItemList } from "../../../../Common";
import "./TopicList.css";

interface TopicForm {
  name: string;
  description?: string;
  subjectId: number;
}

interface SubtopicForm {
  name: string;
  description?: string;
}

const topicSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Topic name is required",
  }),
  description: Joi.string().allow(""),
  subjectId: Joi.number().required().messages({
    "number.base": "Please select a subject",
    "any.required": "Subject is required",
  }),
});

const subtopicSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Subtopic name is required",
  }),
  description: Joi.string().allow(""),
});

export const TopicList = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [expandedTopics, setExpandedTopics] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddSubtopicModal, setShowAddSubtopicModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [showEditTopicModal, setShowEditTopicModal] = useState(false);
  const [showEditSubtopicModal, setShowEditSubtopicModal] = useState(false);
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register: registerTopic,
    handleSubmit: handleSubmitTopic,
    formState: { errors: topicErrors },
    reset: resetTopicForm,
    setValue: setTopicValue,
  } = useForm<TopicForm>({
    resolver: joiResolver(topicSchema),
  });

  const {
    register: registerSubtopic,
    handleSubmit: handleSubmitSubtopic,
    formState: { errors: subtopicErrors },
    reset: resetSubtopicForm,
    setValue: setSubtopicValue,
  } = useForm<SubtopicForm>({
    resolver: joiResolver(subtopicSchema),
  });

  useEffect(() => {
    fetchTopics();
    fetchSubjects();
  }, []);

  const fetchTopics = async () => {
    try {
      const data = await topicsService.getTopics();
      setTopics(data);
    } catch {
      toast.error("Failed to fetch topics");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubjects = async () => {
    setIsLoadingSubjects(true);
    try {
      const data = await subjectsService.getSubjects();
      setSubjects(data);
    } catch {
      toast.error("Failed to fetch subjects");
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  const handleAdd = () => {
    resetTopicForm();
    setShowAddModal(true);
  };

  const handleAddSubtopic = (topic: Topic) => {
    setSelectedTopic(topic);
    resetSubtopicForm();
    setShowAddSubtopicModal(true);
  };

  const toggleTopic = (topicId: number) => {
    setExpandedTopics((prevExpanded) =>
      prevExpanded.includes(topicId)
        ? prevExpanded.filter((id) => id !== topicId)
        : [...prevExpanded, topicId]
    );
  };

  const handleDelete = async (id: number) => {
    try {
      await topicsService.deleteTopic(id);
      setTopics(topics.filter((topic) => topic.id !== id));
      toast.success("Topic deleted successfully");
    } catch {
      toast.error("Failed to delete topic");
    }
  };

  const handleDeleteSubtopic = async (topicId: number, subtopicId: number) => {
    try {
      await topicsService.deleteSubtopic(topicId, subtopicId);
      setTopics(
        topics.map((topic) =>
          topic.id === topicId
            ? {
                ...topic,
                subtopics: topic.subtopics?.filter(
                  (st) => st.id !== subtopicId
                ),
              }
            : topic
        )
      );
      toast.success("Subtopic deleted successfully");
    } catch {
      toast.error("Failed to delete subtopic");
    }
  };

  const handleEditTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    resetTopicForm();
    setTopicValue("name", topic.name);
    setTopicValue("description", topic.description ?? "");
    setTopicValue("subjectId", topic.subjectId);
    setShowEditTopicModal(true);
  };

  const handleEditSubtopic = (topic: Topic, subtopic: Subtopic) => {
    setSelectedTopic(topic);
    setSelectedSubtopic(subtopic);
    resetSubtopicForm();
    setSubtopicValue("name", subtopic.name);
    setSubtopicValue("description", subtopic.description ?? "");
    setShowEditSubtopicModal(true);
  };

  const onSubmitEditTopic = handleSubmitTopic(async (data) => {
    if (!selectedTopic) return;

    try {
      const updatedTopic = await topicsService.updateTopic(
        selectedTopic.id,
        data
      );
      setTopics(
        topics.map((topic) =>
          topic.id === selectedTopic.id ? updatedTopic : topic
        )
      );
      setShowEditTopicModal(false);
      setSelectedTopic(null);
      toast.success("Topic updated successfully");
    } catch {
      toast.error("Failed to update topic");
    }
  });

  const onSubmitEditSubtopic = handleSubmitSubtopic(async (data) => {
    if (!selectedTopic || !selectedSubtopic) return;

    try {
      const updatedTopic = await topicsService.updateSubtopic(
        selectedTopic.id,
        selectedSubtopic.id,
        data
      );
      setTopics(
        topics.map((topic) =>
          topic.id === selectedTopic.id ? updatedTopic : topic
        )
      );
      setShowEditSubtopicModal(false);
      setSelectedTopic(null);
      setSelectedSubtopic(null);
      toast.success("Subtopic updated successfully");
    } catch {
      toast.error("Failed to update subtopic");
    }
  });

  const onSubmitTopic = handleSubmitTopic(async (data) => {
    try {
      const newTopic = await topicsService.createTopic(data);
      setTopics([...topics, newTopic]);
      setShowAddModal(false);
      toast.success("Topic created successfully");
    } catch {
      toast.error("Failed to create topic");
    }
  });

  const onSubmitSubtopic = handleSubmitSubtopic(async (data) => {
    if (!selectedTopic) return;

    try {
      const updatedTopic = await topicsService.createSubtopic({
        ...data,
        topicId: selectedTopic.id,
      });
      setTopics(
        topics.map((topic) =>
          topic.id === selectedTopic.id ? updatedTopic : topic
        )
      );
      setShowAddSubtopicModal(false);
      setSelectedTopic(null);
      toast.success("Subtopic added successfully");
    } catch {
      toast.error("Failed to add subtopic");
    }
  });

  const filteredTopics = topics.filter((topic) => {
    const matchesTopicName = topic.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSubtopics = topic.subtopics?.some((subtopic) =>
      subtopic.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesTopicName || matchesSubtopics;
  });

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading topics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="topics-container">
      <ItemList
        title="Topics Management"
        onAdd={handleAdd}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        placeholder="Search topics and subtopics..."
      >
        {filteredTopics.map((topic) => (
          <div key={topic.id} className="topic-card card mb-3">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <button
                  className="btn btn-link p-0 text-dark"
                  onClick={() => toggleTopic(topic.id)}
                >
                  {expandedTopics.includes(topic.id) ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
                <h6 className="mb-0">{topic.name}</h6>
                <span className="badge bg-primary-subtle text-primary rounded-pill">
                  {topic.subtopics?.length} subtopics
                </span>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleAddSubtopic(topic)}
                >
                  <Plus size={16} /> Add Subtopic
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleEditTopic(topic)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(topic.id)}
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>

            {expandedTopics.includes(topic.id) && (
              <div className="card-body">
                <div className="subtopics-list">
                  {topic.subtopics?.map((subtopic) => (
                    <div
                      key={subtopic.id}
                      className="subtopic-item d-flex justify-content-between align-items-center p-2"
                    >
                      <span>{subtopic.name}</span>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-light btn-sm"
                          onClick={() => handleEditSubtopic(topic, subtopic)}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn btn-light btn-sm"
                          onClick={() =>
                            handleDeleteSubtopic(topic.id, subtopic.id)
                          }
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </ItemList>
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Topic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onSubmitTopic}>
            <div className="mb-3">
              <label className="form-label">Topic Name</label>
              <input
                type="text"
                className={`form-control ${
                  topicErrors.name ? "is-invalid" : ""
                }`}
                {...registerTopic("name")}
              />
              {topicErrors.name && (
                <div className="invalid-feedback">
                  {topicErrors.name.message}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Description (Optional)</label>
              <textarea
                className="form-control"
                {...registerTopic("description")}
                rows={3}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Subject</label>
              <select
                className={`form-select ${
                  topicErrors.subjectId ? "is-invalid" : ""
                }`}
                {...registerTopic("subjectId", { valueAsNumber: true })}
                disabled={isLoadingSubjects}
              >
                <option value="">Select a subject...</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              {topicErrors.subjectId && (
                <div className="invalid-feedback">Please select a subject</div>
              )}
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Topic
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showAddSubtopicModal}
        onHide={() => {
          setShowAddSubtopicModal(false);
          setSelectedTopic(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Subtopic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onSubmitSubtopic}>
            <div className="mb-3">
              <label className="form-label">Subtopic Name</label>
              <input
                type="text"
                className={`form-control ${
                  subtopicErrors.name ? "is-invalid" : ""
                }`}
                {...registerSubtopic("name")}
              />
              {subtopicErrors.name && (
                <div className="invalid-feedback">
                  {subtopicErrors.name.message}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Description (Optional)</label>
              <textarea
                className="form-control"
                {...registerSubtopic("description")}
                rows={3}
              />
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddSubtopicModal(false);
                  setSelectedTopic(null);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!selectedTopic}
              >
                Add Subtopic
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <Modal
        show={showEditTopicModal}
        onHide={() => {
          setShowEditTopicModal(false);
          setSelectedTopic(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Topic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onSubmitEditTopic}>
            <div className="mb-3">
              <label className="form-label">Topic Name</label>
              <input
                type="text"
                className={`form-control ${
                  topicErrors.name ? "is-invalid" : ""
                }`}
                {...registerTopic("name")}
              />
              {topicErrors.name && (
                <div className="invalid-feedback">
                  {topicErrors.name.message}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Description (Optional)</label>
              <textarea
                className="form-control"
                {...registerTopic("description")}
                rows={3}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Subject</label>
              <select
                className={`form-select ${
                  topicErrors.subjectId ? "is-invalid" : ""
                }`}
                {...registerTopic("subjectId", { valueAsNumber: true })}
                disabled={isLoadingSubjects}
              >
                <option value="">Select a subject...</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              {topicErrors.subjectId && (
                <div className="invalid-feedback">Please select a subject</div>
              )}
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowEditTopicModal(false);
                setSelectedTopic(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update Topic
            </button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showEditSubtopicModal}
        onHide={() => {
          setShowEditSubtopicModal(false);
          setSelectedTopic(null);
          setSelectedSubtopic(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Subtopic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onSubmitEditSubtopic}>
            <div className="mb-3">
              <label className="form-label">Subtopic Name</label>
              <input
                type="text"
                className={`form-control ${
                  subtopicErrors.name ? "is-invalid" : ""
                }`}
                {...registerSubtopic("name")}
              />
              {subtopicErrors.name && (
                <div className="invalid-feedback">
                  {subtopicErrors.name.message}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Description (Optional)</label>
              <textarea
                className="form-control"
                {...registerSubtopic("description")}
                rows={3}
              />
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowEditSubtopicModal(false);
                setSelectedTopic(null);
                setSelectedSubtopic(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update Subtopic
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};
