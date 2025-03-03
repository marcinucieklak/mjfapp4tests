import { Dispatch, SetStateAction } from "react";

type Props = {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  isSubmitting: boolean;
  onNext: () => void;
  isEditMode?: boolean;
};

export const StepNavigation = ({
  currentStep,
  setCurrentStep,
  isSubmitting,
  onNext,
  isEditMode = false,
}: Props) => {
  const handleNextClick = (e: React.MouseEvent) => {
    if (currentStep !== 3) {
      e.preventDefault();
      onNext();
    }
  };

  const getButtonText = () => {
    if (currentStep !== 3) return "Next";
    if (isSubmitting) return "Saving...";
    return isEditMode ? "Update Exam" : "Create Exam";
  };

  return (
    <div className="d-flex justify-content-between mt-4">
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
        disabled={currentStep === 1 || isSubmitting}
      >
        Previous
      </button>

      <button
        type={currentStep === 3 ? "submit" : "button"}
        className="btn btn-primary"
        onClick={handleNextClick}
        disabled={isSubmitting}
      >
        {isSubmitting && (
          <span className="spinner-border spinner-border-sm me-2" />
        )}
        {getButtonText()}
      </button>
    </div>
  );
};
