/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { Lecture, WeeklySummary } from "./types";
import { Sidebar } from "./components/Sidebar";
import { NewLecture } from "./components/NewLecture";
import { LectureView } from "./components/LectureView";
import { WeeklySummaryView } from "./components/WeeklySummaryView";
import { Toaster } from "sonner";
import { BookOpen, LogIn, Sparkles } from "lucide-react";
import { Button } from "./components/ui/button";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [summaries, setSummaries] = useState<WeeklySummary[]>([]);
  const [activeTab, setActiveTab] = useState<"new" | "weekly" | string>("new");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "lectures"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Lecture[];
      setLectures(docs);
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "weeklySummaries"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WeeklySummary[];
      setSummaries(docs);
    });

    return unsubscribe;
  }, [user]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#fbfbfb]">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Sparkles className="w-12 h-12 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#fbfbfb] p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="flex justify-center">
            <div className="p-4 bg-blue-50 rounded-2xl">
              <BookOpen className="w-16 h-16 text-blue-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Lumina</h1>
            <p className="text-lg text-gray-600">
              Your advanced AI learning assistant for lectures and notes.
            </p>
          </div>
          <Button
            onClick={handleLogin}
            size="lg"
            className="w-full h-14 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Sign in with Google
          </Button>
        </motion.div>
      </div>
    );
  }

  const activeLecture = lectures.find((l) => l.id === activeTab);
  const activeSummary = summaries.find((s) => s.id === activeTab);

  return (
    <div className="flex h-screen bg-[#fbfbfb] overflow-hidden font-sans">
      <Sidebar
        lectures={lectures}
        summaries={summaries}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
      />
      
      <main className="flex-1 overflow-y-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === "new" && <NewLecture onProcessed={(id) => setActiveTab(id)} />}
            {activeTab === "weekly" && <WeeklySummaryView lectures={lectures} summaries={summaries} />}
            {activeLecture && <LectureView lecture={activeLecture} />}
            {activeSummary && <WeeklySummaryView lectures={lectures} summaries={summaries} activeSummary={activeSummary} />}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Toaster position="top-right" />
    </div>
  );
}

