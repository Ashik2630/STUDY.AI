export interface StructuredContent {
  title: string;
  quickSummary: string;
  keyTopics: string[];
  coreConcepts: string[];
  importantExplanations: string;
  smartNotes: string;
  possibleQuestions: string[];
}

export interface WeeklySummaryContent {
  weeklySummary: string;
  whatILearned: string[];
  coreConcepts: string[];
  weakAreas: string[];
  revisionPlan: string;
}

export interface Lecture {
  id: string;
  userId: string;
  title: string;
  rawContent: string;
  structuredContent: StructuredContent;
  createdAt: any;
}

export interface WeeklySummary {
  id: string;
  userId: string;
  weekStartDate: string;
  summary: WeeklySummaryContent;
  lectureIds: string[];
  createdAt: any;
}
