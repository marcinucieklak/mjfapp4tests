import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TopicList } from "./components/TopicList";
import { QuestionList } from "./components/QuestionList";

function App() {
  const mockQuestions = [
    {
      id: 1,
      text: "Sample question",
      options: ["Option 1", "Option 2", "Option 3"],
      correctOption: 0,
    },
  ];

  const mockTopics = [
    {
      id: 1,
      name: "Sample Topic",
      subtopics: [{ id: 1, name: "Subtopic 1", topicId: 1 }],
    },
  ];

  return (
    <Router>
      <div className="container py-4">
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              Exam System
            </a>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<TopicList topics={mockTopics} />} />
          <Route
            path="/questions"
            element={<QuestionList questions={mockQuestions} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
