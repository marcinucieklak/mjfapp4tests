import { useEffect, useMemo, useState } from "react";
import { PencilSquare, Eye, Trash, Pencil } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Exam } from "../../../../../types";
import { ConfirmationModal, ItemList } from "../../../../Common";
import { examsService } from "../../../../../services";
import "./ExamsManager.css";
import { formatDate } from "../../../../../utils";

export const ExamsManager = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredExams = useMemo(() => {
    return exams.filter(
      (exam) =>
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [exams, searchTerm]);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const data = await examsService.getExams();
      setExams(data);
    } catch {
      toast.error("Failed to fetch exams");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (exam: Exam) => {
    setExamToDelete(exam);
  };

  const handleDeleteConfirm = async () => {
    if (!examToDelete) return;

    setIsDeleting(true);
    try {
      await examsService.deleteExam(examToDelete.id);
      toast.success("Exam deleted successfully");
      setExams(exams.filter((exam) => exam.id !== examToDelete.id));
    } catch {
      toast.error("Failed to delete exam");
    } finally {
      setIsDeleting(false);
      setExamToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading exams...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="exams-container">
        <ItemList
          title="Exams Management"
          onAdd={() => navigate("/teacher/dashboard/exam/create")}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          placeholder="Search by title or subject..."
        >
          <div className="row g-4">
            {filteredExams.map((exam) => (
              <div key={exam.id} className="col-md-6 col-lg-4">
                <div className="card exam-card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="icon-wrapper bg-primary-subtle rounded-3 p-3">
                        <PencilSquare size={24} className="text-primary" />
                      </div>
                      <span className="badge bg-primary-subtle text-primary rounded-pill">
                        {exam.questionDisplayMode}
                      </span>
                    </div>

                    <h5 className="card-title mb-2">{exam.title}</h5>
                    <p className="text-muted small mb-3">
                      Display Mode: {exam.questionDisplayMode}
                    </p>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <small className="text-muted">
                        Created {formatDate(exam.createdAt)}
                      </small>
                      <div className="btn-group">
                        <button
                          className="btn btn-light btn-sm"
                          onClick={() =>
                            navigate(
                              `/teacher/dashboard/exam-results/${exam.id}`
                            )
                          }
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn btn-light btn-sm"
                          onClick={() =>
                            navigate(`/teacher/dashboard/exam/edit/${exam.id}`)
                          }
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="btn btn-light btn-sm"
                          onClick={() => handleDeleteClick(exam)}
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
      </div>

      <ConfirmationModal
        isOpen={!!examToDelete}
        title="Delete Exam"
        message={`Are you sure you want to delete "${examToDelete?.title}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setExamToDelete(null)}
        isLoading={isDeleting}
      />
    </>
  );
};
