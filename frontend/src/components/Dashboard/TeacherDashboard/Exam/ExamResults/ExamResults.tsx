import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Download, Person } from "react-bootstrap-icons";
import { examsService } from "../../../../../services";
import { LoadingSpinner } from "../../../../Common";
import { toast } from "react-toastify";
import { Exam } from "../../../../../types";
import { fetchImageAsBase64, formatScore, shuffle } from "../../../../../utils";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import "jspdf/dist/polyfills.es.js";
import { font } from "./DejaVuSans-normal";

const API_URL = import.meta.env.VITE_API_URL;

export const ExamResults = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await examsService.getExamWithSessions(Number(examId));
        setExam(data);
      } catch {
        toast.error("Failed to load exam results");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  const handleExportExamPDF = async () => {
    if (!exam || !exam.questions) return;

    const doc = new jsPDF();
    doc.addFileToVFS("DejaVuSans.ttf", font);
    doc.addFont("DejaVuSans.ttf", "DejaVuSans", "normal");
    doc.setFont("DejaVuSans");

    let yPos = 15;

    doc.setFontSize(16);
    doc.text(exam.title, 14, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.text(`Group: ${exam.group?.name}`, 14, yPos);
    yPos += 7;

    if (exam.timeLimit) {
      doc.text(`Time limit: ${exam.timeLimit} minutes`, 14, yPos);
      yPos += 15;
    }

    const shuffledQuestions = shuffle([...exam.questions]);

    for (const question of shuffledQuestions) {
      if (yPos > 260) {
        doc.addPage();
        yPos = 15;
      }

      const questionIndex = shuffledQuestions.indexOf(question) + 1;

      const splitText = doc.splitTextToSize(
        questionIndex + ": " + question.text,
        180
      );

      doc.setFont("DejaVuSans", "normal");
      doc.text(splitText, 14, yPos + 7);

      yPos += 7 + splitText.length * 7;

      if (question.imageUrl) {
        try {
          const imgData = await fetchImageAsBase64(
            `${API_URL}${question.imageFullUrl || question.imageUrl}`
          );
          doc.addImage(imgData, "JPEG", 14, yPos, 100, 60);
          yPos += 70;
        } catch (error) {
          console.error("Error adding image:", error);
        }
      }

      const shuffledOptions = shuffle([...question.options]);
      shuffledOptions.forEach((option, optIndex) => {
        const optionText = `${String.fromCharCode(65 + optIndex)}. ${option}`;
        const splitOption = doc.splitTextToSize(optionText, 170);
        doc.text(splitOption, 20, yPos);
        yPos += splitOption.length * 7;
      });

      yPos += 10;
    }

    doc.save(`${exam.title} - Exam.pdf`);
  };

  const handleExportPDF = () => {
    if (!exam || !exam.sessions) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(exam.title, 14, 15);

    doc.setFontSize(12);
    doc.text(`Group: ${exam.group?.name}`, 14, 25);
    doc.text(`Total Students: ${exam.sessions.length}`, 14, 32);

    const tableData = exam.sessions.map((session, index) => {
      const gradeFormat = formatScore(session.score || 0);
      return [
        index + 1,
        `${session.student?.name} ${session.student?.surname}`,
        `${session.score}%`,
        gradeFormat.grade,
        gradeFormat.label,
        new Date(session.updatedAt || "").toLocaleDateString(),
      ];
    });

    autoTable(doc, {
      head: [
        ["#", "Student Name", "Score", "Grade", "Result", "Completed Date"],
      ],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save(`${exam.title} - Results.pdf`);
  };

  if (isLoading) return <LoadingSpinner />;
  if (!exam) return null;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">{exam.title}</h2>
          <p className="text-muted mb-0">
            Group: {exam.group?.name} | Students who took the exam in total:{" "}
            {exam.sessions?.length}
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={handleExportPDF}>
            <Download className="me-2" />
            Export Results
          </button>
          <button
            className="btn btn-info text-white"
            onClick={handleExportExamPDF}
          >
            <Download className="me-2" />
            Export Exam
          </button>
          <Link
            to="/teacher/dashboard/exams"
            className="btn btn-outline-primary"
          >
            Back to Exams
          </Link>
        </div>
      </div>

      <div className="row g-4">
        {exam.sessions &&
          exam.sessions.map((session) => {
            const gradeFormat = formatScore(session.score || 0);

            return (
              <div key={session.id} className="col-md-6 col-xl-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-info bg-opacity-10 p-3 rounded-circle me-3">
                        <Person size={24} className="text-info" />
                      </div>
                      <div>
                        <h5 className="mb-1">
                          {session.student?.name} {session.student?.surname}
                        </h5>
                        <span className={`badge bg-${gradeFormat.color}`}>
                          {gradeFormat.grade} ({gradeFormat.label})
                        </span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {session.updatedAt && (
                          <>
                            Completed:{" "}
                            {new Date(session.updatedAt).toLocaleDateString()}
                          </>
                        )}
                      </small>
                      <Link
                        to={`/teacher/dashboard/exam-results/${examId}/student/${session.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
