import { Lecture } from "../types";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  BookOpen, 
  Lightbulb, 
  HelpCircle, 
  FileText, 
  CheckCircle2,
  Clock,
  Share2
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { Button } from "./ui/button";

interface LectureViewProps {
  lecture: Lecture;
}

export function LectureView({ lecture }: LectureViewProps) {
  const { structuredContent } = lecture;

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10 pb-24">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          {lecture.createdAt?.toDate ? format(lecture.createdAt.toDate(), "MMMM do, yyyy • h:mm a") : "Just now"}
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="section-title">Title</h3>
            <h1 className="text-4xl font-bold text-ink-dark tracking-tight leading-tight">
              {lecture.title}
            </h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-md border-border text-ink-base font-semibold">
              Export to PDF
            </Button>
            <Button className="bg-primary text-white rounded-md font-semibold shadow-md">
              Save to My Vault
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {/* Quick Summary */}
          <section className="space-y-2">
            <h3 className="section-title">Quick Summary</h3>
            <div className="summary-box">
              <p className="text-ink-dark leading-relaxed text-lg">
                {structuredContent.quickSummary}
              </p>
            </div>
          </section>

          {/* Smart Notes */}
          <section className="space-y-2">
            <h3 className="section-title">Smart Notes</h3>
            <div className="prose prose-indigo max-w-none text-ink-base leading-relaxed bg-surface p-8 rounded-lg border border-border shadow-sm">
              <ReactMarkdown>{structuredContent.smartNotes}</ReactMarkdown>
            </div>
          </section>

          {/* Important Explanations */}
          <section className="space-y-2">
            <h3 className="section-title">Important Explanations</h3>
            <Card className="p-8 bg-surface border-border shadow-sm rounded-lg">
              <div className="prose prose-indigo max-w-none text-ink-base">
                <ReactMarkdown>{structuredContent.importantExplanations}</ReactMarkdown>
              </div>
            </Card>
          </section>
        </div>

        <div className="space-y-8">
          {/* Core Concepts */}
          <section className="space-y-2">
            <h3 className="section-title">Core Concepts</h3>
            <div className="space-y-3">
              {structuredContent.coreConcepts.map((concept, i) => (
                <div key={i} className="concept-card">
                  <strong className="text-primary font-bold text-xs uppercase tracking-wider mb-1 block">Concept {i + 1}</strong>
                  <p className="text-sm text-ink-base leading-snug">{concept}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Key Topics */}
          <section className="space-y-2">
            <h3 className="section-title">Key Topics</h3>
            <ul className="space-y-2">
              {structuredContent.keyTopics.map((topic, i) => (
                <li key={i} className="relative pl-5 text-sm text-ink-base before:content-['•'] before:absolute before:left-0 before:text-primary before:font-bold">
                  {topic}
                </li>
              ))}
            </ul>
          </section>

          <Separator className="bg-border" />

          {/* Possible Questions */}
          <section className="space-y-2">
            <h3 className="section-title">Possible Questions</h3>
            <div className="question-list space-y-3">
              {structuredContent.possibleQuestions.map((q, i) => (
                <div key={i} className="text-sm text-[#065f46] font-medium">
                  {i + 1}. {q}
                </div>
              ))}
            </div>
          </section>
          
          <div className="p-6 bg-background border border-border rounded-lg">
            <p className="text-[0.7rem] text-ink-light uppercase font-bold mb-1">Notes Quality Score</p>
            <p className="text-xl font-bold text-accent">98% Refined</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrainCircuit(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.105 4 4 0 0 0 8 0 4 4 0 0 0 .52-8.105 4 4 0 0 0-2.526-5.77A3 3 0 0 0 12 5Z" />
      <path d="M9 13a4.5 4.5 0 0 0 3-4" />
      <path d="M6.003 5.125A3 3 0 1 0 12 5" />
      <path d="M12 13c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2" />
      <path d="M15 13v2" />
      <path d="M17 13v2" />
    </svg>
  );
}
