import { GoogleGenAI, Type } from "@google/genai";
import { StructuredContent, WeeklySummaryContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function processLecture(content: string): Promise<StructuredContent> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: content,
    config: {
      systemInstruction: `You are an advanced AI Learning Assistant designed to help students learn from lecture content in real-time.
The user will provide lecture content (notes, transcript, voice-to-text, etc.).
Your job is to transform this into highly structured, minimal, and effective study material.

OUTPUT STRUCTURE:
1. Title: Generate a relevant topic title
2. Quick Summary: 3–5 lines simple explanation (easy English)
3. Key Topics: Bullet points of main topics discussed
4. Core Concepts: Extract 3 to 5 most important concepts (short, clear, easy to remember)
5. Important Explanations: Key definitions / examples / logic
6. Smart Notes: Clean, structured notes for revision
7. Possible Questions: 2–5 exam/interview-style questions

ADVANCED BEHAVIOR:
- If input is incomplete → intelligently infer meaning
- If topic is programming → include code explanation
- If concept is complex → simplify it like teaching a beginner
- Keep everything concise but powerful. Use simple English.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          quickSummary: { type: Type.STRING },
          keyTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
          coreConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
          importantExplanations: { type: Type.STRING },
          smartNotes: { type: Type.STRING },
          possibleQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "quickSummary", "keyTopics", "coreConcepts", "importantExplanations", "smartNotes", "possibleQuestions"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function generateWeeklySummary(lectures: StructuredContent[]): Promise<WeeklySummaryContent> {
  const input = JSON.stringify(lectures);
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: input,
    config: {
      systemInstruction: `You are an AI Study Tracker.
You will receive multiple structured lecture notes.
Your job:
1. Combine all lecture summaries
2. Remove duplicate ideas
3. Identify learning patterns
4. Extract overall knowledge gained

OUTPUT STRUCTURE:
1. Weekly Summary (short paragraph)
2. What I Learned: Bullet points
3. Core Concepts of the Week: 5–10 key ideas
4. Weak Areas (if any gaps detected)
5. Revision Plan: What to revise next

STYLE: Simple English, clear structure, actionable insights.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          weeklySummary: { type: Type.STRING },
          whatILearned: { type: Type.ARRAY, items: { type: Type.STRING } },
          coreConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
          weakAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
          revisionPlan: { type: Type.STRING }
        },
        required: ["weeklySummary", "whatILearned", "coreConcepts", "weakAreas", "revisionPlan"]
      }
    }
  });

  return JSON.parse(response.text);
}
