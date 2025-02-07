import { Question } from "../../types";

interface Props {
  questions: Question[];
}

export const QuestionList = ({ questions }: Props) => {
  return (
    <div className="container">
      <h2 className="mb-4">Questions</h2>
      <div className="list-group">
        {questions.map((question) => (
          <div key={question.id} className="list-group-item">
            <h5>{question.text}</h5>
            <div className="options">
              {question.options.map((option, index) => (
                <div key={index} className="form-check">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    className="form-check-input"
                    id={`option-${question.id}-${index}`}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`option-${question.id}-${index}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
