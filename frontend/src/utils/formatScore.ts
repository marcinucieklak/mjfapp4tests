type GradeFormat = {
  grade: string;
  label: string;
  color: string;
};

export const formatScore = (score: number): GradeFormat => {
  if (score >= 91) {
    return { grade: "5.0", label: "Bardzo dobry", color: "success" };
  } else if (score >= 81) {
    return { grade: "4.5", label: "Dobry plus", color: "success" };
  } else if (score >= 71) {
    return { grade: "4.0", label: "Dobry", color: "primary" };
  } else if (score >= 61) {
    return { grade: "3.5", label: "Dostateczny plus", color: "primary" };
  } else if (score >= 50) {
    return { grade: "3.0", label: "Dostateczny", color: "warning" };
  } else {
    return { grade: "2.0", label: "Niedostateczny", color: "danger" };
  }
};
