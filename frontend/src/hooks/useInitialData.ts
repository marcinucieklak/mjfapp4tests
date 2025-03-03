import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Group, Question, Subject, Topic } from "../types";
import {
  groupsService,
  questionsService,
  subjectsService,
  topicsService,
} from "../services";

interface UseInitialDataProps {
  setIsLoading: (loading: boolean) => void;
}

interface UseInitialDataReturn {
  questions: Question[];
  subjects: Subject[];
  topics: Topic[];
  groups: Group[];
}

export const useInitialData = ({
  setIsLoading,
}: UseInitialDataProps): UseInitialDataReturn => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsData, subjectsData, topicsData, groupsData] =
          await Promise.all([
            questionsService.getQuestions(),
            subjectsService.getSubjects(),
            topicsService.getTopics(),
            groupsService.getGroups(),
          ]);

        setQuestions(questionsData);
        setSubjects(subjectsData);
        setTopics(topicsData);
        setGroups(groupsData);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        toast.error("Failed to load exam data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setIsLoading]);

  return { questions, subjects, topics, groups };
};
