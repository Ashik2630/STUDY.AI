import { useState } from "react";
import { db, auth } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { generateWeeklySummary } from "../services/ai";
import { Lecture, WeeklySummary } from "../types";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { 
  Calendar, 
  Sparkles, 
  Loader2, 
  Target, 
  TrendingUp, 
  AlertCircle,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { format, startOfWeek, endOfWeek } from "date-fns";
import ReactMarkdown from "react-markdown";

interface WeeklySummaryViewProps {
  lectures: Lecture[];
  summaries: WeeklySummary[];
  activeSummary?: WeeklySummary;
}

export function WeeklySummaryView({ lectures, summaries, activeSummary }: WeeklySummaryViewProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (lectures.length === 0) {
      toast.error("No lectures found to summarize.");
      return;
    }

    setIsGenerating(true);
    try {
      const lectureData = lectures.map(l => l.structuredContent);
      const summaryContent = await generateWeeklySummary(lectureData);
      
      await addDoc(collection(db, "weeklySummaries"), {
        userId: auth.currentUser?.uid,
        weekStartDate: format(startOfWeek(new Date()), "yyyy-MM-dd"),
        summary: summaryContent,
        lectureIds: lectures.map(l => l.id),
        createdAt: serverTimestamp(),
      });

      toast.success("Weekly summary generated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate summary.");
    } finally {
      setIsGenerating(false);
    }
  };

  const displaySummary = activeSummary || summaries[0];

  if (!displaySummary && !isGenerating) {
    return (
      <div className="max-w-4xl mx-auto p-8 h-full flex flex-col items-center justify-center text-center space-y-6">
        <div className="p-6 bg-primary-soft rounded-3xl">
          <Calendar className="w-16 h-16 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-ink-dark">No Weekly Summaries Yet</h2>
          <p className="text-ink-base max-w-md">
            Combine your recent lectures into a powerful weekly overview to identify patterns and plan your revision.
          </p>
        </div>
        <Button 
          onClick={handleGenerate} 
          disabled={lectures.length === 0}
          className="bg-primary hover:bg-primary/90 text-white h-12 px-8 rounded-md shadow-md gap-2 font-semibold"
        >
          <Sparkles className="w-4 h-4" />
          Generate First Weekly Summary
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-10 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            Learning Progress
          </div>
          <h1 className="text-4xl font-bold text-ink-dark tracking-tight">
            Weekly Review
          </h1>
          <p className="text-ink-light">
            {displaySummary ? (
              `Week of ${format(new Date(displaySummary.weekStartDate), "MMMM do, yyyy")}`
            ) : "Generating..."}
          </p>
        </div>
        {!activeSummary && (
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            variant="outline"
            className="rounded-md h-12 gap-2 border-border text-ink-base hover:bg-background font-semibold"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Refresh Summary
          </Button>
        )}
      </header>

      {isGenerating ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-4 bg-surface rounded-lg border border-dashed border-border">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-ink-light font-medium">AI is analyzing your week...</p>
        </div>
      ) : displaySummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2 space-y-2">
            <h3 className="section-title">Executive Summary</h3>
            <div className="summary-box">
              <p className="text-ink-dark text-lg leading-relaxed">
                {displaySummary.summary.weeklySummary}
              </p>
            </div>
          </div>

          <section className="space-y-4">
            <h3 className="section-title">What I Learned</h3>
            <div className="space-y-3">
              {displaySummary.summary.whatILearned.map((item, i) => (
                <div key={i} className="flex gap-3 p-4 bg-surface border border-border rounded-lg shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                  <p className="text-sm text-ink-base leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="section-title">Core Concepts of the Week</h3>
            <div className="space-y-3">
              {displaySummary.summary.coreConcepts.map((item, i) => (
                <div key={i} className="flex gap-3 p-4 bg-surface border border-border rounded-lg shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <p className="text-sm text-ink-base leading-relaxed font-medium">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="section-title">Weak Areas & Gaps</h3>
            <div className="p-6 bg-red-50/50 border border-red-100 rounded-lg space-y-3">
              {displaySummary.summary.weakAreas.map((item, i) => (
                <div key={i} className="flex gap-2 text-sm text-red-900">
                  <span className="font-bold">•</span>
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="section-title">Revision Plan</h3>
            <Card className="p-6 bg-background border border-border rounded-lg">
              <div className="prose prose-sm max-w-none text-ink-base">
                <ReactMarkdown>{displaySummary.summary.revisionPlan}</ReactMarkdown>
              </div>
            </Card>
          </section>
        </div>
      )}
    </div>
  );
}
