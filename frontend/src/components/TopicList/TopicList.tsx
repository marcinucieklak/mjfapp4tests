import { Topic } from "../../types";

interface Props {
  topics: Topic[];
}

export const TopicList = ({ topics }: Props) => {
  return (
    <div className="container">
      <h2 className="mb-4">Topics</h2>
      <div className="row">
        {topics.map((topic) => (
          <div key={topic.id} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{topic.name}</h5>
                {topic.subtopics && (
                  <ul className="list-group list-group-flush">
                    {topic.subtopics.map((subtopic) => (
                      <li key={subtopic.id} className="list-group-item">
                        {subtopic.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
