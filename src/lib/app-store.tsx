import * as React from "react";
import {
  RECEIPTS_SEED, STUDENTS, CLASSES, CASH_RECEIPT_CONFIG_SEED,
  SEED_HOMEWORK_SUBMISSIONS, SEED_HOMEWORK_CORRECTIONS, homeworkSubmissionKey, homeworkCorrectionKey,
  createInitialSyllabusContents,
  type Receipt, type Student, type ClassRoom, type Role, type CashReceiptConfig, type Branch,
  type SyllabusStageData,
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
  getSyllabusStages: (syllabusId: string) => SyllabusStageData[];
  setSyllabusStages: (
    syllabusId: string,
    next: SyllabusStageData[] | ((prev: SyllabusStageData[]) => SyllabusStageData[]),
  ) => void;
  ensureSyllabusStages: (syllabusId: string) => void;
  ensureClassSyllabus: (classId: string, syllabusId: string) => void;
  getClassSyllabusStages: (classId: string, syllabusId: string) => SyllabusStageData[];
  setClassSyllabusStages: (
    classId: string,
    syllabusId: string,
    next: SyllabusStageData[] | ((prev: SyllabusStageData[]) => SyllabusStageData[]),
  ) => void;
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
  const [syllabusContents, setSyllabusContents] = React.useState(createInitialSyllabusContents);
  const [classSyllabusContents, setClassSyllabusContents] = React.useState<Record<string, SyllabusStageData[]>>({});

  const getSyllabusStages = React.useCallback(
    (syllabusId: string) => syllabusContents[syllabusId] ?? syllabusContents._default,
    [syllabusContents],
  );

  const ensureSyllabusStages = React.useCallback((syllabusId: string) => {
    setSyllabusContents((prev) => {
      if (prev[syllabusId]) return prev;
      const base = prev._default;
      return { ...prev, [syllabusId]: JSON.parse(JSON.stringify(base)) as SyllabusStageData[] };
    });
  }, []);

  const setSyllabusStages = React.useCallback(
    (syllabusId: string, next: SyllabusStageData[] | ((prev: SyllabusStageData[]) => SyllabusStageData[])) => {
      setSyllabusContents((prev) => {
        const current = prev[syllabusId] ?? prev._default;
        const resolved = typeof next === "function" ? next(current) : next;
        return { ...prev, [syllabusId]: resolved };
      });
    },
    [],
  );

  const cloneStages = React.useCallback(
    (syllabusId: string) =>
      JSON.parse(JSON.stringify(syllabusContents[syllabusId] ?? syllabusContents._default)) as SyllabusStageData[],
    [syllabusContents],
  );

  const getClassSyllabusStages = React.useCallback(
    (classId: string, syllabusId: string) =>
      classSyllabusContents[classId] ?? cloneStages(syllabusId),
    [classSyllabusContents, cloneStages],
  );

  const ensureClassSyllabus = React.useCallback(
    (classId: string, syllabusId: string) => {
      setClassSyllabusContents((prev) => {
        if (prev[classId]) return prev;
        return { ...prev, [classId]: cloneStages(syllabusId) };
      });
    },
    [cloneStages],
  );

  const setClassSyllabusStages = React.useCallback(
    (
      classId: string,
      syllabusId: string,
      next: SyllabusStageData[] | ((prev: SyllabusStageData[]) => SyllabusStageData[]),
    ) => {
      setClassSyllabusContents((prev) => {
        const current = prev[classId] ?? cloneStages(syllabusId);
        const resolved = typeof next === "function" ? next(current) : next;
        return { ...prev, [classId]: resolved };
      });
    },
    [cloneStages],
  );

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
    if (role === "teacher") setPage("my-classes");
    if (role === "student") setPage("my-classes");
  }, [role]);

  return (
    <AppCtx.Provider
      value={{
        role, setRole, students, setStudents, classes, setClasses,
        scheduledSessions, setScheduledSessions, receipts, setReceipts,
        cashConfig, setCashConfig, homeworkSubmissions, setHomeworkSubmission,
        homeworkCorrections, setHomeworkCorrection, page, setPage,
        getSyllabusStages, setSyllabusStages, ensureSyllabusStages,
        ensureClassSyllabus, getClassSyllabusStages, setClassSyllabusStages,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const ctx = React.useContext(AppCtx);
  if (!ctx) throw new Error("useApp outside provider");
  return ctx;
}
