import { createFileRoute } from "@tanstack/react-router";
import { AppProvider, useApp } from "@/lib/app-store";
import { AppShell } from "@/components/app-shell";
import {
  AdminDashboard, AdminStudents, AdminClasses, AdminTuition, AdminPromotions,
  AdminCollect, AdminReceipts,
} from "@/components/pages/admin-pages";
import { TeacherToday, TeacherSyllabus } from "@/components/pages/teacher-pages";
import {
  StudentInfo, StudentSchedule, StudentTuition, StudentResults,
} from "@/components/pages/student-pages";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function PageRouter() {
  const { role, page } = useApp();
  if (role === "admin") {
    switch (page) {
      case "dashboard": return <AdminDashboard />;
      case "students": return <AdminStudents />;
      case "classes": return <AdminClasses />;
      case "tuition": return <AdminTuition />;
      case "promotions": return <AdminPromotions />;
      case "collect": return <AdminCollect />;
      case "receipts": return <AdminReceipts />;
    }
  }
  if (role === "teacher") {
    switch (page) {
      case "today": return <TeacherToday />;
      case "syllabus": return <TeacherSyllabus />;
    }
  }
  if (role === "student") {
    switch (page) {
      case "info": return <StudentInfo />;
      case "schedule": return <StudentSchedule />;
      case "tuition-history": return <StudentTuition />;
      case "results": return <StudentResults />;
    }
  }
  return null;
}

function HomePage() {
  return (
    <AppProvider>
      <AppShell>
        <PageRouter />
      </AppShell>
      <Toaster position="top-right" richColors />
    </AppProvider>
  );
}