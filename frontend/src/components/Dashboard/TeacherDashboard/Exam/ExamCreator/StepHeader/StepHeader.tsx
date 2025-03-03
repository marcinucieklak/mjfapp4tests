import { InfoCircle, Grid3x3, QuestionCircle } from "react-bootstrap-icons";
import "./StepHeader.css";

type Props = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
};

export const StepHeader = ({ currentStep, setCurrentStep }: Props) => {
  const steps = [
    { number: 1, title: "Basic Info", icon: InfoCircle },
    { number: 2, title: "Select Topics", icon: Grid3x3 },
    { number: 3, title: "Select Questions", icon: QuestionCircle },
  ];

  return (
    <div className="card-header bg-white">
      <div className="progress mb-3" style={{ height: "2px" }}>
        <div
          className="progress-bar"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>
      <ul className="nav nav-pills card-header-pills gap-2">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <li key={step.number} className="nav-item">
              <button
                type="button"
                className={`nav-link d-flex align-items-center gap-2 ${
                  currentStep === step.number ? "active" : ""
                }`}
                onClick={() => setCurrentStep(step.number)}
                disabled={currentStep < step.number}
              >
                <Icon size={18} />
                <span>{step.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
