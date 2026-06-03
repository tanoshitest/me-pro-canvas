import * as React from "react";
import {
  Users, GraduationCap, BookOpen, Wallet, ClipboardCheck, UserCog, CalendarRange,
  CalendarDays, ClipboardList, User, Building2, BadgeInfo, PanelLeftClose, PanelLeftOpen,
  UserPlus,
  Briefcase,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type NavItem = { id: string; label: string; icon: React.ComponentType<{ className?: string }>; disabled?: boolean; done?: boolean };

const NAV: Record<string, NavItem[]> = {
  admin: [
    { id: "admissions", label: "Quản lý tuyển sinh", icon: UserPlus, disabled: true },
    { id: "teachers", label: "Quản lý giáo viên", icon: UserCog, done: true },
    { id: "students", label: "Quản lý học viên", icon: Users, done: true },
    { id: "syllabus", label: "Quản lý syllabus", icon: ClipboardCheck, done: true },
    { id: "classes", label: "Quản lý lớp học", icon: GraduationCap, done: true },
    { id: "fees", label: "Quản lý học phí", icon: Wallet, done: true },
    { id: "schedule-admin", label: "Lịch dạy", icon: CalendarRange, done: true },
    { id: "finance-report", label: "Báo cáo thu chi", icon: BarChart3 },
    { id: "attendance-report", label: "Báo cáo chấm công", icon: ClipboardList },
    { id: "salary-report", label: "Báo cáo lương", icon: Wallet },
    { id: "work-management", label: "Quản lý công việc", icon: Briefcase, disabled: true },
    { id: "tuition", label: "Cấu hình", icon: BookOpen, done: true },
  ],
  teacher: [
    { id: "today", label: "Lịch dạy hôm nay", icon: CalendarDays },
    { id: "syllabus", label: "Syllabus & Điểm danh", icon: ClipboardList },
  ],
  student: [
    { id: "info", label: "Thông tin học tập", icon: User },
    { id: "schedule", label: "Lịch học", icon: CalendarDays },
    { id: "tuition-history", label: "Học phí", icon: Wallet },
    { id: "results", label: "Kết quả học tập", icon: BookOpen },
  ],
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const { role, setRole, page, setPage } = useApp();
  const nav = NAV[role];
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className={cn(
        "shrink-0 border-r border-slate-200 bg-white flex flex-col transition-[width] duration-200 h-screen sticky top-0",
        collapsed ? "w-16" : "w-64",
      )}>
        <div className={cn("h-16 flex items-center gap-2 border-b border-slate-200", collapsed ? "px-3 justify-center" : "px-5")}>
          <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white grid place-content-center font-bold">ME</div>
          {!collapsed && (
            <div>
              <div className="font-bold text-base leading-tight">ME PROTOTYPE</div>
              <div className="text-xs text-slate-500">Trung tâm ngoại ngữ</div>
            </div>
          )}
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {!collapsed && (
            <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {role === "admin" ? "Quản trị" : role === "teacher" ? "Giáo viên" : "Học sinh"}
            </div>
          )}
          {nav.map((item) => {
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { if (!item.disabled) setPage(item.id); }}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "w-full flex items-center gap-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left cursor-pointer",
                  collapsed ? "px-0 justify-center" : "px-3",
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-700 hover:bg-slate-100",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="flex-1">{item.label}</span>}
                {!collapsed && item.done && <CheckCircle2 className="h-4 w-4 text-red-500 shrink-0" />}
              </button>
            );
          })}
        </nav>
        {!collapsed && (
          <div className="p-4 border-t border-slate-200 text-xs text-slate-500">
            v1.0 · Demo mockdata
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 -ml-2"
              onClick={() => setCollapsed((v) => !v)}
              title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
            >
              {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </Button>
            <h1 className="text-lg font-semibold">{nav.find((n) => n.id === page)?.label ?? ""}</h1>
            <Badge variant="secondary" className="gap-1"><Building2 className="h-3 w-3" /> 3 chi nhánh</Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
              <BadgeInfo className="h-3.5 w-3.5" /> Đổi vai trò để xem nghiệp vụ
            </div>
            <Select value={role} onValueChange={(v) => setRole(v as never)}>
              <SelectTrigger className="w-44 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">👔 Admin</SelectItem>
                <SelectItem value="teacher">👩‍🏫 Giáo viên</SelectItem>
                <SelectItem value="student">🎒 Học sinh</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}