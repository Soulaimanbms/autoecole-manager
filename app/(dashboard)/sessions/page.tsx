"use client";

import * as React from "react";
import { Plus, Calendar, List, ChevronLeft, ChevronRight, Car, BookOpen } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StudentAvatar } from "@/components/shared/StudentAvatar";
import { getInitials, formatDate } from "@/lib/utils";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const MOCK_SESSIONS = [
  { id: "1", date: "2024-04-15", dayIndex: 0, time: "08:30", duration: 60, type: "conduite", status: "scheduled", student: "Mohamed Alami", instructor: "Karim B." },
  { id: "2", date: "2024-04-15", dayIndex: 0, time: "10:00", duration: 45, type: "code", status: "completed", student: "Fatima Zahra", instructor: "Hassan M." },
  { id: "3", date: "2024-04-16", dayIndex: 1, time: "09:00", duration: 60, type: "conduite", status: "scheduled", student: "Youssef Tazi", instructor: "Karim B." },
  { id: "4", date: "2024-04-17", dayIndex: 2, time: "14:00", duration: 60, type: "conduite", status: "scheduled", student: "Aicha Ouali", instructor: "Hassan M." },
  { id: "5", date: "2024-04-18", dayIndex: 3, time: "08:00", duration: 60, type: "conduite", status: "completed", student: "Omar Chraibi", instructor: "Karim B." },
  { id: "6", date: "2024-04-18", dayIndex: 3, time: "10:30", duration: 45, type: "code", status: "missed", student: "Sara Bennani", instructor: "Hassan M." },
  { id: "7", date: "2024-04-19", dayIndex: 4, time: "15:00", duration: 60, type: "conduite", status: "scheduled", student: "Khalid Rafiq", instructor: "Karim B." },
  { id: "8", date: "2024-04-20", dayIndex: 5, time: "09:30", duration: 60, type: "conduite", status: "scheduled", student: "Nadia Chraibi", instructor: "Hassan M." },
];

export default function SessionsPage() {
  const [view, setView] = React.useState<"calendar" | "list">("calendar");
  const [weekOffset, setWeekOffset] = React.useState(0);

  const weekLabel =
    weekOffset === 0 ? "Cette semaine"
    : weekOffset === -1 ? "Semaine dernière"
    : weekOffset === 1 ? "Semaine prochaine"
    : `Semaine ${weekOffset > 0 ? "+" : ""}${weekOffset}`;

  const sessionsByDay = DAYS.map((_, idx) => MOCK_SESSIONS.filter((s) => s.dayIndex === idx));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Planning</div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Séances</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-default rounded-lg p-1">
            <button onClick={() => setView("calendar")} className={`p-2 rounded-lg transition-all ${view === "calendar" ? "bg-accent-dim text-accent-text" : "text-muted hover:bg-bg-hover"}`}>
              <Calendar className="h-4 w-4" />
            </button>
            <button onClick={() => setView("list")} className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-accent-dim text-accent-text" : "text-muted hover:bg-bg-hover"}`}>
              <List className="h-4 w-4" />
            </button>
          </div>
          <button className="btn-primary inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />Nouvelle séance
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => setWeekOffset((w) => w - 1)} className="p-2 rounded-lg text-muted hover:bg-bg-hover border border-default transition-all">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-text-primary min-w-[140px] text-center">{weekLabel}</span>
        <button onClick={() => setWeekOffset((w) => w + 1)} className="p-2 rounded-lg text-muted hover:bg-bg-hover border border-default transition-all">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {view === "calendar" ? (
        <div className="grid grid-cols-7 gap-3">
          {DAYS.map((day, idx) => {
            const daySessions = sessionsByDay[idx];
            return (
              <div key={day} className="space-y-2">
                <div className="text-center">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted">{day}</div>
                </div>
                <div className="min-h-[200px] bg-white rounded-xl border border-default p-2 space-y-2">
                  {daySessions.length === 0 ? (
                    <div className="flex items-center justify-center h-full py-8">
                      <span className="text-[10px] text-faint">—</span>
                    </div>
                  ) : (
                    daySessions.map((s) => (
                      <div key={s.id} className={`p-2 rounded-lg border text-[10px] cursor-pointer hover:shadow-sm transition-all ${s.status === "completed" ? "bg-success-bg border-success/20" : s.status === "missed" ? "bg-error-bg border-error/20" : "bg-info-bg border-info/20"}`}>
                        <div className="font-bold text-text-primary">{s.time}</div>
                        <div className="text-muted truncate mt-0.5">{s.student}</div>
                        <div className="flex items-center gap-1 mt-1">
                          {s.type === "conduite" ? <Car className="h-3 w-3 text-muted" /> : <BookOpen className="h-3 w-3 text-muted" />}
                          <span className="text-muted">{s.type}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-default overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-3 border-b border-default bg-bg-page">
            <div className="col-span-2 table-header-cell">Date & Heure</div>
            <div className="col-span-3 table-header-cell">Élève</div>
            <div className="col-span-2 table-header-cell">Moniteur</div>
            <div className="col-span-2 table-header-cell">Type</div>
            <div className="col-span-2 table-header-cell">Durée</div>
            <div className="col-span-1 table-header-cell">Statut</div>
          </div>
          <div className="divide-y divide-default">
            {MOCK_SESSIONS.map((s) => (
              <div key={s.id} className="grid grid-cols-12 px-6 py-4 hover:bg-bg-hover transition-all items-center group">
                <div className="col-span-2">
                  <div className="text-sm font-semibold text-text-primary">{formatDate(s.date)}</div>
                  <div className="text-[10px] text-muted">{s.time}</div>
                </div>
                <div className="col-span-3 flex items-center gap-3">
                  <StudentAvatar initials={getInitials(s.student)} size="sm" />
                  <span className="text-sm font-semibold text-text-primary">{s.student}</span>
                </div>
                <div className="col-span-2 text-sm text-text-body">{s.instructor}</div>
                <div className="col-span-2">
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-info-bg text-info-text">
                    {s.type === "conduite" ? <Car className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
                    {s.type}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-text-body">{s.duration} min</div>
                <div className="col-span-1">
                  <StatusBadge status={s.status} variant="session" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-muted">{MOCK_SESSIONS.length} séances cette semaine</div>
    </div>
  );
}
