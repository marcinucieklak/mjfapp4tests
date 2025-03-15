import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  DashboardOverview,
  LoginPage,
  RegisterPage,
  ForgotPassword,
  Dashboard,
} from "./components";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./providers";
import { UserType } from "./types";
import {
  TeacherDashboard,
  GroupManager,
  SubjectsManager,
  TopicList,
  QuestionList,
  ExamsManager,
  ExamCreator,
  ExamResults,
  StudentExamResults,
} from "./components/Dashboard/TeacherDashboard";
import {
  ExamSession,
  StudentDashboard,
  StudentExams,
  StudentGroups,
  StudentOverview,
} from "./components/Dashboard/StudentDashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute type={UserType.EXAMINER}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="subjects" element={<SubjectsManager />} />
            <Route path="topics" element={<TopicList />} />
            <Route path="questions" element={<QuestionList />} />
            <Route path="exams" element={<ExamsManager />} />
            <Route path="exam/create" element={<ExamCreator />} />
            <Route path="exam/edit/:id" element={<ExamCreator />} />
            <Route path="exam-results/:examId" element={<ExamResults />} />
            <Route
              path="exam-results/:examId/student/:sessionId"
              element={<StudentExamResults />}
            />
            <Route path="groups" element={<GroupManager />} />
          </Route>
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute type={UserType.STUDENT}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentOverview />} />
            <Route path="groups" element={<StudentGroups />} />
            <Route path="exams" element={<StudentExams />} />
            <Route path="exams/:examId/take" element={<ExamSession />} />
          </Route>
          <Route></Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
