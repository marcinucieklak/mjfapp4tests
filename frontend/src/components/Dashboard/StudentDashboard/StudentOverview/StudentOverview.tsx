import { People, PencilSquare } from "react-bootstrap-icons";

const mockData = {
  activeGroups: 3,
  upcomingExams: 2,
  recentExams: [
    { id: 1, title: "Mathematics Mid-term", date: "2024-03-15", score: "85%" },
    { id: 2, title: "Physics Quiz", date: "2024-03-10", score: "92%" },
  ],
};

export const StudentOverview = () => {
  return (
    <div>
      <h2 className="mb-4">Dashboard Overview</h2>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <People size={24} className="text-primary" />
                </div>
                <div className="ms-3">
                  <h6 className="mb-1">Active Groups</h6>
                  <h4 className="mb-0">{mockData.activeGroups}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <PencilSquare size={24} className="text-success" />
                </div>
                <div className="ms-3">
                  <h6 className="mb-1">Upcoming Exams</h6>
                  <h4 className="mb-0">{mockData.upcomingExams}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-white">
          <h5 className="mb-0">Recent Exam Results</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Exam Title</th>
                  <th>Date</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {mockData.recentExams.map((exam) => (
                  <tr key={exam.id}>
                    <td>{exam.title}</td>
                    <td>{exam.date}</td>
                    <td>
                      <span className="badge bg-success">{exam.score}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
