import { useEffect, useState } from "react";
import { Book, Pencil, Trash } from "react-bootstrap-icons";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { subjectsService } from "../../../../../services";
import { Subject } from "../../../../../types";
import { ItemList } from "../../../../Common";
import "./SubjectsManager.css";
import { formatDate } from "../../../../../utils";

interface SubjectForm {
  name: string;
  description: string;
}

const subjectSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Subject name is required",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required",
  }),
});

export const SubjectsManager = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<SubjectForm>({
    resolver: joiResolver(subjectSchema),
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await subjectsService.getSubjects();
      setSubjects(data);
    } catch {
      toast.error("Failed to fetch subjects");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    reset();
    setShowAddModal(true);
  };

  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject);
    setValue("name", subject.name);
    setValue("description", subject.description ?? "");
    setShowEditModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await subjectsService.deleteSubject(id);
      setSubjects(subjects.filter((subject) => subject.id !== id));
      toast.success("Subject deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete subject");
    }
  };

  const onSubmit = async (data: SubjectForm) => {
    try {
      if (showEditModal && selectedSubject) {
        const updated = await subjectsService.updateSubject(
          selectedSubject.id,
          data
        );
        setSubjects(subjects.map((s) => (s.id === updated.id ? updated : s)));
        toast.success("Subject updated successfully");
      } else {
        const created = await subjectsService.createSubject(data);
        setSubjects([...subjects, created]);
        toast.success("Subject created successfully");
      }
      setShowAddModal(false);
      setShowEditModal(false);
    } catch {
      toast.error(
        showEditModal ? "Failed to update subject" : "Failed to create subject"
      );
    }
  };

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="subjects-container">
      <ItemList
        title="Subjects Management"
        onAdd={handleAdd}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        placeholder="Search subjects..."
      >
        <div className="row g-4">
          {filteredSubjects.map((subject) => (
            <div key={subject.id} className="col-md-6 col-lg-4">
              <div className="card subject-card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="icon-wrapper bg-primary-subtle rounded-3 p-3">
                      <Book size={24} className="text-primary" />
                    </div>
                    <span className="badge bg-primary-subtle text-primary rounded-pill">
                      {subject.topicsCount} topics
                    </span>
                  </div>

                  <h5 className="card-title mb-2">{subject.name}</h5>
                  <p className="text-muted small mb-3">{subject.description}</p>

                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Created {formatDate(subject.createdAt)}
                    </small>
                    <div className="btn-group">
                      <button
                        className="btn btn-light btn-sm"
                        onClick={() => handleEdit(subject)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="btn btn-light btn-sm"
                        onClick={() => handleDelete(subject.id)}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ItemList>
      <Modal
        show={showAddModal || showEditModal}
        onHide={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          setSelectedSubject(null);
          reset();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {showEditModal ? "Edit Subject" : "Add New Subject"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">Subject Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                {...register("name")}
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name.message}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
                {...register("description")}
                rows={3}
              />
              {errors.description && (
                <div className="invalid-feedback">
                  {errors.description.message}
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedSubject(null);
                  reset();
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {showEditModal ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};
