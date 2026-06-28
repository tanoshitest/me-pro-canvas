import * as React from "react";
import {
  RECEIPTS_SEED, STUDENTS, CLASSES, CASH_RECEIPT_CONFIG_SEED,
  SEED_HOMEWORK_SUBMISSIONS, SEED_HOMEWORK_CORRECTIONS, homeworkSubmissionKey, homeworkCorrectionKey,
  type Receipt, type Student, type ClassRoom, type Role, type CashReceiptConfig, type Branch,
} from "./mock-data";

export type ScheduledTeachingSession = {
  id: string;
  date: string;
  start: string;
  end: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  branch: Branch;
  room: string;
  checkIn: string | null;
  checkOut: string | null;
};

type Ctx = {
  role: Role; setRole: (r: Role) => void;
  students: Student[]; setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  classes: ClassRoom[]; setClasses: React.Dispatch<React.SetStateAction<ClassRoom[]>>;
  scheduledSessions: ScheduledTeachingSession[];
  setScheduledSessions: React.Dispatch<React.SetStateAction<ScheduledTeachingSession[]>>;
  receipts: Receipt[]; setReceipts: React.Dispatch<React.SetStateAction<Receipt[]>>;
  cashConfig: CashReceiptConfig[]; setCashConfig: React.Dispatch<React.SetStateAction<CashReceiptConfig[]>>;
  homeworkSubmissions: Record<string, string>;
  setHomeworkSubmission: (studentId: string, sessionIdx: number, columnId: string, url: string) => void;
  homeworkCorrections: Record<string, string>;
  setHomeworkCorrection: (studentId: string, sessionIdx: number, columnId: string, url: string) => void;
  page: string; setPage: (p: string) => void;
};

const AppCtx = React.createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = React.useState<Role>("admin");
  const [students, setStudents] = React.useState<Student[]>(STUDENTS);
  const [classes, setClasses] = React.useState<ClassRoom[]>(CLASSES);
  const [scheduledSessions, setScheduledSessions] = React.useState<ScheduledTeachingSession[]>([]);
  const [receipts, setReceipts] = React.useState<Receipt[]>(RECEIPTS_SEED);
  const [cashConfig, setCashConfig] = React.useState<CashReceiptConfig[]>(CASH_RECEIPT_CONFIG_SEED);
  const [homeworkSubmissions, setHomeworkSubmissions] = React.useState<Record<string, string>>(SEED_HOMEWORK_SUBMISSIONS);
  const [homeworkCorrections, setHomeworkCorrections] = React.useState<Record<string, string>>(SEED_HOMEWORK_CORRECTIONS);
  const [page, setPage] = React.useState<string>("teachers");

  const setHomeworkSubmission = React.useCallback(
    (studentId: string, sessionIdx: number, columnId: string, url: string) => {
      const key = homeworkSubmissionKey(studentId, sessionIdx, columnId);
      setHomeworkSubmissions((prev) => {
        const next = { ...prev };
        if (url.trim()) next[key] = url.trim();
        else delete next[key];
        return next;
      });
    },
    [],
  );

  const setHomeworkCorrection = React.useCallback(
    (studentId: string, sessionIdx: number, columnId: string, url: string) => {
      const key = homeworkCorrectionKey(studentId, sessionIdx, columnId);
      setHomeworkCorrections((prev) => {
        const next = { ...prev };
        if (url.trim()) next[key] = url.trim();
        else delete next[key];
        return next;
      });
    },
    [],
  );

  React.useEffect(() => {
    // reset to default page for each role
    if (role === "admin") setPage("teachers");
    if (role === "teacher") setPage("today");
    if (role === "student") setPage("info");
  }, [role]);

  return (
    <AppCtx.Provider value={{ role, setRole, students, setStudents, classes, setClasses, scheduledSessions, setScheduledSessions, receipts, setReceipts, cashConfig, setCashConfig, homeworkSubmissions, setHomeworkSubmission, homeworkCorrections, setHomeworkCorrection, page, setPage }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const ctx = React.useContext(AppCtx);
  if (!ctx) throw new Error("useApp outside provider");
  return ctx;
}
