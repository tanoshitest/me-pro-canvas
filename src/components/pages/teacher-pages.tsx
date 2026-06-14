import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/lib/app-store";
import { SYLLABUS_LESSONS } from "@/lib/mock-data";
import { toast } from "sonner";
import { CheckCircle2, Clock, MapPin, BookOpen, LogIn, LogOut, CalendarDays } from "lucide-react";

const TEACHER_STUDENTS = [
  { id: "s1", name: "Hồng Diệp (Kirito)" },
  { id: "s2", name: "Đăng Khoa (Bing)" },
  { id: "s3", name: "Mimi" },
  { id: "s5", name: "Nguyễn Ngọc Linh" },
];
const STATUSES = ["Có mặt", "Vắng có phép", "Vắng không phép", "Học bù"] as const;

export function TeacherToday() {
  const { classes, scheduledSessions, setScheduledSessions } = useApp();
  const recordAttendance = (sessionId: string, type: "in" | "out") => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setScheduledSessions((current) => current.map((session) =>
      session.id === sessionId
        ? { ...session, [type === "in" ? "checkIn" : "checkOut"]: time }
        : session,
    ));
    toast.success(type === "in" ? `Check-in thành công lúc ${time}` : `Check-out thành công lúc ${time}`);
  };

  return (
    <div className="space-y-4">
      {scheduledSessions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4 text-indigo-600" />
              Ca dạy được phân công
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {scheduledSessions.map((session) => (
              <div key={session.id} className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center">
                <div>
                  <div className="font-semibold text-indigo-700">{session.className}</div>
                  <div className="text-xs text-slate-500">{session.teacherName} · {formatTeacherDate(session.date)}</div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {session.start} - {session.end}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {session.branch} · {session.room}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={session.checkIn ? "outline" : "default"}
                    disabled={Boolean(session.checkIn)}
                    onClick={() => recordAttendance(session.id, "in")}
                  >
                    <LogIn className="h-4 w-4" />
                    {session.checkIn ? `In ${session.checkIn}` : "Check-in"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!session.checkIn || Boolean(session.checkOut)}
                    onClick={() => recordAttendance(session.id, "out")}
                  >
                    <LogOut className="h-4 w-4" />
                    {session.checkOut ? `Out ${session.checkOut}` : "Check-out"}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      {classes.map((c) => (
        <Card key={c.id}>
          <CardContent className="p-5 grid sm:grid-cols-5 gap-4 items-center">
            <div className="font-bold text-lg text-indigo-700">{c.name}</div>
            <div className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-slate-400" />{c.time}</div>
            <div className="text-sm">{c.branch}</div>
            <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-slate-400" />{c.room}</div>
            <div className="flex items-center gap-2 text-sm"><BookOpen className="h-4 w-4 text-slate-400" />{c.syllabus} · Buổi 6</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TeacherSyllabus() {
  const [lessonId, setLessonId] = React.useState(SYLLABUS_LESSONS[0].id);
  const lesson = SYLLABUS_LESSONS.find((l) => l.id === lessonId)!;
  const [completed, setCompleted] = React.useState<Record<string, boolean>>({});
  const [att, setAtt] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(TEACHER_STUDENTS.map((s) => [s.id, "Có mặt"])),
  );
  const [grades, setGrades] = React.useState<Record<string, Record<string, string>>>({});

  const completeLesson = () => {
    setCompleted((p) => ({ ...p, [lessonId]: true }));
    const present = Object.values(att).filter((v) => v === "Có mặt").length;
    toast.success("Đã hoàn thành buổi học", {
      description: `Trừ 1 buổi cho ${present} học viên có mặt. Cộng 1 buổi dạy cho giáo viên. Tiến độ syllabus cập nhật.`,
    });
  };
  const saveGrades = () => toast.success("Đã lưu điểm & nhận xét", { description: "Phụ huynh/học sinh có thể xem kết quả." });

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <Card>
        <CardHeader><CardTitle className="text-base">Family & Friends 1</CardTitle></CardHeader>
        <CardContent className="p-0">
          {SYLLABUS_LESSONS.map((l) => (
            <button key={l.id} onClick={() => setLessonId(l.id)}
              className={`w-full text-left px-4 py-3 border-b text-sm flex items-center justify-between cursor-pointer ${lessonId === l.id ? "bg-indigo-50 text-indigo-700 font-medium" : "hover:bg-slate-50"}`}>
              <span>{l.title}</span>
              {completed[l.id] && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>{lesson.title}</CardTitle></CardHeader>
        <CardContent>
          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content">Nội dung</TabsTrigger>
              <TabsTrigger value="att">Điểm danh</TabsTrigger>
              <TabsTrigger value="grade">Nhập điểm</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-3 mt-4 text-sm">
              <Info label="Từ vựng" value={lesson.vocab} />
              <Info label="Ngữ pháp" value={lesson.grammar} />
              <Info label="Tài liệu" value={lesson.material} />
              <Info label="Bài tập lớp" value={lesson.classwork} />
              <Info label="Bài tập về nhà" value={lesson.homework} />
            </TabsContent>

            <TabsContent value="att" className="mt-4">
              <Table>
                <TableHeader><TableRow><TableHead>Học viên</TableHead><TableHead>Trạng thái</TableHead></TableRow></TableHeader>
                <TableBody>
                  {TEACHER_STUDENTS.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>
                        <div className="flex gap-1.5 flex-wrap">
                          {STATUSES.map((st) => (
                            <Badge key={st} variant={att[s.id] === st ? "default" : "outline"}
                              className="cursor-pointer" onClick={() => setAtt((p) => ({ ...p, [s.id]: st }))}>
                              {st}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button className="mt-4" size="lg" onClick={completeLesson}>
                <CheckCircle2 className="h-4 w-4" /> Hoàn thành buổi học
              </Button>
            </TabsContent>

            <TabsContent value="grade" className="mt-4">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Học viên</TableHead>
                  {["Listening", "Speaking", "Reading", "Writing", "Participation"].map((c) => <TableHead key={c}>{c}</TableHead>)}
                  <TableHead>Nhận xét</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {TEACHER_STUDENTS.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.name}</TableCell>
                      {["L","S","R","W","P"].map((k) => (
                        <TableCell key={k}>
                          <Input className="w-16" type="number"
                            value={grades[s.id]?.[k] ?? ""}
                            onChange={(e) => setGrades((p) => ({ ...p, [s.id]: { ...p[s.id], [k]: e.target.value } }))} />
                        </TableCell>
                      ))}
                      <TableCell>
                        <Textarea rows={1} className="min-w-[180px]" placeholder="Nhận xét..."
                          value={grades[s.id]?.note ?? ""}
                          onChange={(e) => setGrades((p) => ({ ...p, [s.id]: { ...p[s.id], note: e.target.value } }))} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button className="mt-4" onClick={saveGrades}>Lưu điểm & nhận xét</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l-4 border-indigo-500 bg-slate-50 px-4 py-3 rounded">
      <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">{label}</div>
      <div className="mt-1">{value}</div>
    </div>
  );
}

function formatTeacherDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}
