import { User, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Lecture, WeeklySummary } from "../types";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { 
  Plus, 
  Calendar, 
  BookOpen, 
  LogOut, 
  ChevronRight,
  History,
  Sparkles
} from "lucide-react";
import { cn } from "../lib/utils";
import { format } from "date-fns";

interface SidebarProps {
  lectures: Lecture[];
  summaries: WeeklySummary[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
}

export function Sidebar({ lectures, summaries, activeTab, setActiveTab, user }: SidebarProps) {
  return (
    <aside className="w-72 bg-surface border-r border-border flex flex-col h-full shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-ink-dark tracking-tight">STUDY.AI</h1>
        </div>

        <Button
          onClick={() => setActiveTab("new")}
          className={cn(
            "w-full justify-start gap-2 h-12 rounded-md transition-all font-semibold",
            activeTab === "new" 
              ? "bg-primary text-white shadow-md" 
              : "bg-white border border-border text-ink-base hover:bg-background"
          )}
        >
          <Plus className="w-4 h-4" />
          New Lecture
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6 pb-6">
          <div>
            <div className="section-title px-2">
              Tracking
            </div>
            <Button
              variant="ghost"
              onClick={() => setActiveTab("weekly")}
              className={cn(
                "w-full justify-start gap-3 h-11 rounded-md text-sm font-medium transition-colors",
                activeTab === "weekly" ? "bg-primary-soft text-primary" : "text-ink-base hover:bg-background"
              )}
            >
              <Calendar className="w-4 h-4 opacity-70" />
              Weekly Summary
              <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
            </Button>
          </div>

          <div>
            <div className="section-title px-2">
              Recent Lectures
            </div>
            <div className="space-y-1">
              {lectures.length === 0 ? (
                <p className="px-2 text-xs text-ink-light italic">No lectures yet</p>
              ) : (
                lectures.map((lecture) => (
                  <Button
                    key={lecture.id}
                    variant="ghost"
                    onClick={() => setActiveTab(lecture.id)}
                    className={cn(
                      "w-full justify-start gap-3 h-11 rounded-md text-sm font-medium transition-colors text-left truncate",
                      activeTab === lecture.id ? "bg-primary-soft text-primary" : "text-ink-base hover:bg-background"
                    )}
                  >
                    <BookOpen className="w-4 h-4 shrink-0 opacity-70" />
                    <span className="truncate">{lecture.title}</span>
                  </Button>
                ))
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-md bg-background mb-3">
          <img 
            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
            alt={user.displayName || ""} 
            className="w-8 h-8 rounded-full"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink-dark truncate">{user.displayName}</p>
            <p className="text-xs text-ink-light truncate">{user.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={() => signOut(auth)}
          className="w-full justify-start gap-2 text-ink-light hover:text-red-600 hover:bg-red-50 h-10 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
