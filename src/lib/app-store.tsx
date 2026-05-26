import * as React from "react";
import {
  RECEIPTS_SEED, STUDENTS, CLASSES, CASH_RECEIPT_CONFIG_SEED,
  type Receipt, type Student, type ClassRoom, type Role, type CashReceiptConfig,
} from "./mock-data";

type Ctx = {
  role: Role; setRole: (r: Role) => void;
  students: Student[]; setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  classes: ClassRoom[]; setClasses: React.Dispatch<React.SetStateAction<ClassRoom[]>>;
  receipts: Receipt[]; setReceipts: React.Dispatch<React.SetStateAction<Receipt[]>>;
  cashConfig: CashReceiptConfig[]; setCashConfig: React.Dispatch<React.SetStateAction<CashReceiptConfig[]>>;
  page: string; setPage: (p: string) => void;
};

const AppCtx = React.createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = React.useState<Role>("admin");
  const [students, setStudents] = React.useState<Student[]>(STUDENTS);
  const [classes, setClasses] = React.useState<ClassRoom[]>(CLASSES);
  const [receipts, setReceipts] = React.useState<Receipt[]>(RECEIPTS_SEED);
  const [cashConfig, setCashConfig] = React.useState<CashReceiptConfig[]>(CASH_RECEIPT_CONFIG_SEED);
  const [page, setPage] = React.useState<string>("teachers");

  React.useEffect(() => {
    // reset to default page for each role
    if (role === "admin") setPage("teachers");
    if (role === "teacher") setPage("today");
    if (role === "student") setPage("info");
  }, [role]);

  return (
    <AppCtx.Provider value={{ role, setRole, students, setStudents, classes, setClasses, receipts, setReceipts, cashConfig, setCashConfig, page, setPage }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const ctx = React.useContext(AppCtx);
  if (!ctx) throw new Error("useApp outside provider");
  return ctx;
}