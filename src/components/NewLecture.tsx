import { useState } from "react";
import { db, auth } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { processLecture } from "../services/ai";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Sparkles, Loader2, BrainCircuit, FileText, Mic } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

interface NewLectureProps {
  onProcessed: (id: string) => void;
}

export function NewLecture({ onProcessed }: NewLectureProps) {
  const [content, setContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (!content.trim()) {
      toast.error("Please provide some lecture content first.");
      return;
    }

    setIsProcessing(true);
    try {
      const structured = await processLecture(content);
      
      const docRef = await addDoc(collection(db, "lectures"), {
        userId: auth.currentUser?.uid,
        title: structured.title,
        rawContent: content,
        structuredContent: structured,
        createdAt: serverTimestamp(),
      });

      toast.success("Lecture processed successfully!");
      onProcessed(docRef.id);
    } catch (error) {
      console.error(error);
      toast.error("Failed to process lecture. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="space-y-2">
        <h3 className="section-title">New Lecture</h3>
        <h2 className="text-3xl font-bold text-ink-dark tracking-tight">Capture Knowledge</h2>
        <p className="text-ink-base">Paste your notes, transcript, or unstructured text to transform it into study material.</p>
      </div>

      <Card className="p-6 border-border shadow-sm bg-surface overflow-hidden relative rounded-lg">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <BrainCircuit className="w-32 h-32" />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm font-medium text-ink-light mb-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background rounded-full">
              <FileText className="w-4 h-4" />
              Typed Notes
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background rounded-full opacity-50">
              <Mic className="w-4 h-4" />
              Voice (Coming Soon)
            </div>
          </div>

          <Textarea
            placeholder="Paste lecture content here... (e.g., 'Today we discussed the mitochondria, which is the powerhouse of the cell...')"
            className="min-h-[400px] text-lg leading-relaxed border-none focus-visible:ring-0 resize-none p-0 placeholder:text-ink-light"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isProcessing}
          />

          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div className="text-xs text-ink-light">
              {content.length} characters
            </div>
            <Button
              onClick={handleProcess}
              disabled={isProcessing || !content.trim()}
              className="bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-md shadow-md transition-all gap-2 font-semibold"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  ANALYZING LIVE LECTURE
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Study Material
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Structured", desc: "Clean bullet points and clear hierarchy.", icon: FileText },
          { title: "Intelligent", desc: "Infers meaning from incomplete notes.", icon: BrainCircuit },
          { title: "Ready", desc: "Generates exam-style questions instantly.", icon: Sparkles },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="p-4 rounded-md bg-surface border border-border shadow-sm space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center">
              <feature.icon className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold text-ink-dark">{feature.title}</h3>
            <p className="text-sm text-ink-base leading-snug">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
