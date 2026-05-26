import { createFileRoute } from "@tanstack/react-router";
import { AppProvider, useApp } from "@/lib/app-store";
import { AppShell } from "@/components/app-shell";
import {
  AdminStudents, AdminClasses, AdminTuition, AdminFees, AdminSyllabus,
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
      case "students": return <AdminStudents />;
      case "syllabus": return <AdminSyllabus />;
      case "classes": return <AdminClasses />;
      case "fees": return <AdminFees />;
      case "tuition": return <AdminTuition />;
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