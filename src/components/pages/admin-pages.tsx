import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { callZaiChat } from "@/lib/zai";
import { useApp } from "@/lib/app-store";
import {
  BRANCHES, CLASSES, PROMOTIONS, TUITION_CONFIG, formatVND,
  CLASS_SHIFTS, ROOMS, SYLLABI, TEACHERS,
  SYLLABUS_STAGES, SYLLABUS_STUDENTS, SYLLABUS_GRADE_COLUMNS,
  SYLLABUS_REPORT_ROWS, DEFAULT_BTVN_COLUMNS, DEFAULT_SCORE_COLUMNS, DEFAULT_BTVN_COLUMN_ID,
  REPORT_ATTENDANCE_OPTIONS, BTVN_STATUS_OPTIONS, LEARNING_SPIRIT_OPTIONS, HOMEWORK_TASK_TYPES, homeworkSubmissionKey, homeworkCorrectionKey,
  type Syllabus, type SyllabusReportRow, type SyllabusHomeworkItem, type HomeworkTaskType, type BtvnColumn, type ReportAttendance, type BtvnStatus, type LearningSpirit,
  type ReportSelectOption, type ReportTagTone,
  type Receipt, type Branch, type Student,
} from "@/lib/mock-data";
import { toast } from "sonner";
import {
  Users, GraduationCap, Wallet, AlertTriangle, Receipt as ReceiptIcon, XCircle,
  TrendingUp, Calendar, Info, CheckCircle2, ArrowRight, CalendarOff, Repeat,
  Clock, DoorOpen, BookOpen, Tag, Hash, ArrowLeft,
  Layers, FileText, ClipboardCheck, BarChart3, ExternalLink, Link2, Plus, Pencil, Copy, Trash2, Download, FileSpreadsheet, ListChecks, Target, ChevronRight, ChevronLeft, ChevronDown,
  CalendarIcon, Upload, History, FileCheck,
  Search, LayoutGrid, List as ListIcon, Phone, School as SchoolIcon, MapPin,
} from "lucide-react";

/* ============== DASHBOARD ============== */
export function AdminDashboard() {
  const { students, classes, receipts } = useApp();
  const totalStudents = students.length;
  const totalClasses = classes.length;
  const revenue = receipts.filter((r) => r.status === "Hiệu lực").reduce((s, r) => s + r.amount, 0);
  const debt = students.reduce((s, x) => s + x.debt, 0);
  const created = receipts.length;
  const cancelled = receipts.filter((r) => r.status === "Đã hủy").length;
  const lowSessions = students.filter((s) => s.bought - s.attended <= 3);

  const [aiPrompt, setAiPrompt] = React.useState("Tóm tắt tình hình học viên sắp hết buổi.");
  const [aiResponse, setAiResponse] = React.useState<string | null>(null);
  const [aiLoading, setAiLoading] = React.useState(false);

  const askZai = async () => {
    setAiLoading(true);
    setAiResponse(null);

    try {
      const result = await callZaiChat([
        { role: "system", content: "Bạn là trợ lý quản lý trung tâm ngoại ngữ." },
        { role: "user", content: aiPrompt },
      ]);
      setAiResponse(result.choices[0]?.message.content ?? "Không có phản hồi.");
    } catch (error) {
      console.error(error);
      setAiResponse(error instanceof Error ? error.message : "Lỗi khi gọi ZAI");
    } finally {
      setAiLoading(false);
    }
  };

  const cards = [
    { label: "Tổng học viên", value: totalStudents, icon: Users, color: "bg-indigo-500" },
    { label: "Lớp đang học", value: totalClasses, icon: GraduationCap, color: "bg-emerald-500" },
    { label: "Doanh thu tháng", value: formatVND(revenue), icon: TrendingUp, color: "bg-amber-500" },
    { label: "Công nợ cần thu", value: formatVND(debt), icon: AlertTriangle, color: "bg-rose-500" },
    { label: "Phiếu thu đã tạo", value: created, icon: ReceiptIcon, color: "bg-blue-500" },
    { label: "Phiếu thu đã hủy", value: cancelled, icon: XCircle, color: "bg-slate-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-lg ${c.color} text-white grid place-content-center`}>
                <c.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm text-slate-500">{c.label}</div>
                <div className="text-xl font-bold">{c.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> Trợ lý ZAI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <Input value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} />
            <Button onClick={askZai} disabled={aiLoading}>
              {aiLoading ? "Đang gửi..." : "Gửi ZAI"}
            </Button>
          </div>
          {aiResponse ? (
            <div className="rounded-lg border border-border bg-muted p-4 text-sm whitespace-pre-wrap">
              {aiResponse}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Học viên sắp hết buổi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Học viên</TableHead>
                <TableHead>Chi nhánh</TableHead>
                <TableHead>Đã mua</TableHead>
                <TableHead>Đã học</TableHead>
                <TableHead>Còn lại</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowSessions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}{s.nickname ? ` (${s.nickname})` : ""}</TableCell>
                  <TableCell>{s.branch}</TableCell>
                  <TableCell>{s.bought}</TableCell>
                  <TableCell>{s.attended}</TableCell>
                  <TableCell><Badge variant="destructive">{s.bought - s.attended} buổi</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ============== STUDENTS ============== */
export function AdminStudents() {
  const { students, setStudents, classes, receipts } = useApp();
  const [selected, setSelected] = React.useState<string | null>(null);
  const stu = students.find((s) => s.id === selected);
  const cls = stu ? classes.find((c) => c.id === stu.classId) : null;
  const stuReceipts = stu ? receipts.filter((r) => r.studentId === stu.id) : [];
  const paid = stuReceipts.filter((r) => r.status === "Hiệu lực").reduce((s, r) => s + r.amount, 0);
  const remaining = stu ? Math.max(0, stu.bought - stu.attended) : 0;

  type StudentStatus = "Chưa xếp lớp" | "Đang học" | "Nghỉ học" | "Bảo lưu";
  const [studentStatus, setStudentStatus] = React.useState<Record<string, StudentStatus>>({});
  const getStuStatus = (id: string): StudentStatus =>
    studentStatus[id] ?? "Đang học";
  const stuStatusColor = (s: StudentStatus) =>
    s === "Đang học" ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : s === "Chưa xếp lớp" ? "bg-amber-100 text-amber-700 border-amber-200"
    : s === "Bảo lưu" ? "bg-blue-100 text-blue-700 border-blue-200"
    : "bg-rose-100 text-rose-700 border-rose-200";

  const emptyStu = () => ({
    name: "", nickname: "", branch: "" as Branch | "", classId: "",
    dob: "", gender: "Nam" as "Nam" | "Nữ", school: "", address: "", email: "",
    parentName: "", parentPhone: "", parentRelation: "Mẹ" as "Bố" | "Mẹ" | "Người giám hộ", parentEmail: "",
    note: "",
  });
  const [openAdd, setOpenAdd] = React.useState(false);
  const [newStu, setNewStu] = React.useState(emptyStu());
  const classOpts = classes.filter((c) => !newStu.branch || c.branch === newStu.branch);

  const submitStudent = () => {
    if (!newStu.name.trim() || !newStu.branch || !newStu.classId) {
      toast.error("Vui lòng nhập họ tên, chi nhánh và lớp.");
      return;
    }
    const id = `s${Date.now()}`;
    setStudents((prev) => [
      ...prev,
      {
        id, name: newStu.name.trim(), nickname: newStu.nickname || undefined,
        branch: newStu.branch as Branch, classId: newStu.classId,
        bought: 24, attended: 0, debt: 0,
        dob: newStu.dob, gender: newStu.gender, school: newStu.school,
        address: newStu.address, email: newStu.email, note: newStu.note,
        parentName: newStu.parentName, parentPhone: newStu.parentPhone,
        parentRelation: newStu.parentRelation, parentEmail: newStu.parentEmail,
        enrolledAt: new Date().toLocaleDateString("vi-VN"),
      },
    ]);
    toast.success(`Đã thêm học viên ${newStu.name.trim()}`);
    setOpenAdd(false);
    setNewStu(emptyStu());
  };

  return (
    <div className="space-y-4">
      {stu && cls ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <div className="flex items-center gap-3">
                <CardTitle>Hồ sơ: {stu.name}</CardTitle>
                <Select value={getStuStatus(stu.id)} onValueChange={(v) => setStudentStatus((p) => ({ ...p, [stu.id]: v as StudentStatus }))}>
                  <SelectTrigger className={`h-7 w-auto px-2.5 text-xs font-medium border ${stuStatusColor(getStuStatus(stu.id))}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chưa xếp lớp">Chưa xếp lớp</SelectItem>
                    <SelectItem value="Đang học">Đang học</SelectItem>
                    <SelectItem value="Nghỉ học">Nghỉ học</SelectItem>
                    <SelectItem value="Bảo lưu">Bảo lưu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Mã HV: <span className="font-mono">{stu.id.toUpperCase()}</span> · {stu.branch}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelected(null)}>
              <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="space-y-3">
              <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="personal">Học viên</TabsTrigger>
                <TabsTrigger value="parent">Phụ huynh</TabsTrigger>
                <TabsTrigger value="academic">Học tập</TabsTrigger>
                <TabsTrigger value="fee">Học phí</TabsTrigger>
                <TabsTrigger value="att-top">Điểm danh</TabsTrigger>
                <TabsTrigger value="grade-top">Kết quả</TabsTrigger>
                <TabsTrigger value="ops">Lịch sử</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <Info2 label="Mã học viên" value={stu.id.toUpperCase()} />
                <Info2 label="Họ tên" value={`${stu.name}${stu.nickname ? ` (${stu.nickname})` : ""}`} />
                <Info2 label="Ngày sinh" value={stu.dob ?? "-"} />
                <Info2 label="Giới tính" value={stu.gender ?? "-"} />
                <Info2 label="Trường học" value={stu.school ?? "-"} />
                <Info2 label="Email" value={stu.email || "-"} />
                <Info2 label="Địa chỉ" value={stu.address ?? "-"} className="col-span-2" />
                <Info2 label="Ghi chú" value={stu.note ?? "-"} className="col-span-2" />
              </TabsContent>

              <TabsContent value="parent" className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <Info2 label="Họ tên phụ huynh" value={stu.parentName ?? "-"} />
                <Info2 label="Quan hệ" value={stu.parentRelation ?? "-"} />
                <Info2 label="Số điện thoại" value={stu.parentPhone ?? "-"} />
                <Info2 label="Email" value={stu.parentEmail ?? "-"} />
              </TabsContent>

              <TabsContent value="academic" className="mt-3 space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <Info2 label="Chi nhánh" value={stu.branch} />
                  <Info2 label="Lớp hiện tại" value={cls.name} />
                  <Info2 label="Giáo viên phụ trách" value={cls.teacher} />
                  <Info2 label="Ngày nhập học" value={stu.enrolledAt ?? "-"} />
                  <Info2 label="Syllabus đang học" value={cls.syllabus} />
                  <Info2
                    label="Tiến độ syllabus"
                    value={`${stu.syllabusProgress ?? 0}/${stu.syllabusTotal ?? cls.totalSessions} buổi`}
                  />
                  <Info2 label="Điểm trung bình" value={stu.avgScore != null ? stu.avgScore.toFixed(1) : "-"} />
                  <Info2 label="Nhận xét gần nhất" value={stu.latestComment ?? "-"} />
                </div>
              </TabsContent>

              <TabsContent value="fee" className="mt-3 space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <Info2 label="Tổng buổi đã mua" value={`${stu.bought} buổi`} />
                  <Info2 label="Số buổi đã học" value={`${stu.attended} buổi`} />
                  <Info2 label="Số buổi còn lại (Ví)" value={`${remaining} buổi`} />
                  <Info2 label="Học phí đã đóng" value={formatVND(paid)} />
                  <Info2 label="Học phí còn nợ" value={formatVND(stu.debt)} />
                  <Info2 label="Công nợ hiện tại" value={formatVND(stu.debt)} />
                </div>
                <div>
                  <div className="font-semibold mb-2">Lịch sử thanh toán</div>
                  {stuReceipts.length === 0 ? (
                    <p className="text-slate-500">Chưa có giao dịch.</p>
                  ) : (
                    <Table><TableHeader><TableRow>
                      <TableHead>Mã phiếu</TableHead><TableHead>Ngày</TableHead><TableHead>Số tiền</TableHead>
                      <TableHead>Phương thức</TableHead><TableHead>Trạng thái</TableHead>
                    </TableRow></TableHeader><TableBody>
                      {stuReceipts.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-mono text-xs">{r.id}</TableCell>
                          <TableCell>{r.createdAt}</TableCell>
                          <TableCell>{formatVND(r.amount)}</TableCell>
                          <TableCell>{r.method}</TableCell>
                          <TableCell>
                            <Badge variant={r.status === "Hiệu lực" ? "default" : "secondary"}>{r.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody></Table>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="att-top" className="mt-3 text-sm">
                {!stu.attendanceHistory?.length ? (
                  <p className="text-slate-500">Chưa có dữ liệu điểm danh.</p>
                ) : (
                  <Table><TableHeader><TableRow>
                    <TableHead>Ngày</TableHead><TableHead>Buổi</TableHead><TableHead>Trạng thái</TableHead>
                  </TableRow></TableHeader><TableBody>
                    {stu.attendanceHistory.map((a, i) => (
                      <TableRow key={i}>
                        <TableCell>{a.at}</TableCell>
                        <TableCell>{a.session}</TableCell>
                        <TableCell>
                          <Badge variant={a.status === "Có mặt" ? "secondary" : a.status === "Đi muộn" ? "default" : "destructive"}>
                            {a.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody></Table>
                )}
              </TabsContent>

              <TabsContent value="grade-top" className="mt-3 text-sm">
                {!stu.scoreHistory?.length ? (
                  <p className="text-slate-500">Chưa có dữ liệu điểm.</p>
                ) : (
                  <Table><TableHeader><TableRow>
                    <TableHead>Ngày</TableHead><TableHead>Buổi</TableHead>
                    <TableHead>Listening</TableHead><TableHead>Speaking</TableHead>
                    <TableHead>Reading</TableHead><TableHead>Writing</TableHead>
                  </TableRow></TableHeader><TableBody>
                    {stu.scoreHistory.map((g, i) => (
                      <TableRow key={i}>
                        <TableCell>{g.at}</TableCell><TableCell>{g.session}</TableCell>
                        <TableCell>{g.listening}</TableCell><TableCell>{g.speaking}</TableCell>
                        <TableCell>{g.reading}</TableCell><TableCell>{g.writing}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody></Table>
                )}
              </TabsContent>

              <TabsContent value="ops" className="mt-3">
                <StudentHistoryTimeline stu={stu} receipts={stuReceipts} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Danh sách học viên</CardTitle>
          <Button size="sm" onClick={() => { setNewStu(emptyStu()); setOpenAdd(true); }}>
            <Plus className="h-4 w-4" /> Thêm học viên
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Họ tên</TableHead><TableHead>Chi nhánh</TableHead><TableHead>Còn buổi</TableHead><TableHead>Công nợ</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id} className="cursor-pointer hover:bg-slate-50" onClick={() => setSelected(s.id)}>
                  <TableCell className="font-medium">{s.name}{s.nickname ? ` (${s.nickname})` : ""}</TableCell>
                  <TableCell>{s.branch}</TableCell>
                  <TableCell>{s.bought - s.attended}</TableCell>
                  <TableCell className={s.debt > 0 ? "text-rose-600 font-semibold" : ""}>{formatVND(s.debt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      )}

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Thêm học viên mới</DialogTitle>
            <DialogDescription>Điền thông tin cá nhân, lớp học và phụ huynh.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cột trái: Thông tin cá nhân + Chi nhánh & Lớp */}
            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold mb-2">Thông tin cá nhân</div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs text-slate-500">Họ tên</Label>
                    <Input className="h-9 mt-1" value={newStu.name} onChange={(e) => setNewStu({ ...newStu, name: e.target.value })} /></div>
                  <div><Label className="text-xs text-slate-500">Nickname</Label>
                    <Input className="h-9 mt-1" value={newStu.nickname} onChange={(e) => setNewStu({ ...newStu, nickname: e.target.value })} /></div>
                  <div><Label className="text-xs text-slate-500">Ngày sinh</Label>
                    <Input className="h-9 mt-1" placeholder="DD/MM/YYYY" value={newStu.dob} onChange={(e) => setNewStu({ ...newStu, dob: e.target.value })} /></div>
                  <div><Label className="text-xs text-slate-500">Giới tính</Label>
                    <Select value={newStu.gender} onValueChange={(v) => setNewStu({ ...newStu, gender: v as "Nam" | "Nữ" })}>
                      <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Nam">Nam</SelectItem><SelectItem value="Nữ">Nữ</SelectItem></SelectContent>
                    </Select></div>
                  <div><Label className="text-xs text-slate-500">Trường</Label>
                    <Input className="h-9 mt-1" value={newStu.school} onChange={(e) => setNewStu({ ...newStu, school: e.target.value })} /></div>
                  <div><Label className="text-xs text-slate-500">Email</Label>
                    <Input className="h-9 mt-1" value={newStu.email} onChange={(e) => setNewStu({ ...newStu, email: e.target.value })} /></div>
                  <div className="col-span-2"><Label className="text-xs text-slate-500">Địa chỉ</Label>
                    <Input className="h-9 mt-1" value={newStu.address} onChange={(e) => setNewStu({ ...newStu, address: e.target.value })} /></div>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold mb-2">Chi nhánh &amp; Lớp</div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs text-slate-500">Chi nhánh</Label>
                    <Select value={newStu.branch} onValueChange={(v) => setNewStu({ ...newStu, branch: v as Branch, classId: "" })}>
                      <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Chọn chi nhánh" /></SelectTrigger>
                      <SelectContent>{BRANCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                    </Select></div>
                  <div><Label className="text-xs text-slate-500">Lớp</Label>
                    <Select value={newStu.classId} onValueChange={(v) => setNewStu({ ...newStu, classId: v })}>
                      <SelectTrigger className="h-9 mt-1"><SelectValue placeholder={newStu.branch ? "Chọn lớp" : "Chọn CN trước"} /></SelectTrigger>
                      <SelectContent>{classOpts.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select></div>
                </div>
              </div>
            </div>
            {/* Cột phải: Thông tin phụ huynh + Ghi chú */}
            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold mb-2">Thông tin phụ huynh</div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs text-slate-500">Họ tên phụ huynh</Label>
                    <Input className="h-9 mt-1" value={newStu.parentName} onChange={(e) => setNewStu({ ...newStu, parentName: e.target.value })} /></div>
                  <div><Label className="text-xs text-slate-500">Quan hệ</Label>
                    <Select value={newStu.parentRelation} onValueChange={(v) => setNewStu({ ...newStu, parentRelation: v as "Bố" | "Mẹ" | "Người giám hộ" })}>
                      <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bố">Bố</SelectItem>
                        <SelectItem value="Mẹ">Mẹ</SelectItem>
                        <SelectItem value="Người giám hộ">Người giám hộ</SelectItem>
                      </SelectContent>
                    </Select></div>
                  <div><Label className="text-xs text-slate-500">SĐT phụ huynh</Label>
                    <Input className="h-9 mt-1" value={newStu.parentPhone} onChange={(e) => setNewStu({ ...newStu, parentPhone: e.target.value })} /></div>
                  <div><Label className="text-xs text-slate-500">Email phụ huynh</Label>
                    <Input className="h-9 mt-1" value={newStu.parentEmail} onChange={(e) => setNewStu({ ...newStu, parentEmail: e.target.value })} /></div>
                </div>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Ghi chú</Label>
                <Textarea className="mt-1" rows={4} value={newStu.note} onChange={(e) => setNewStu({ ...newStu, note: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAdd(false)}>Hủy</Button>
            <Button onClick={submitStudent}>Thêm học viên</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Info2({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-md border bg-slate-50 px-3 py-2 ${className ?? ""}`}>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-medium break-words">{value}</div>
    </div>
  );
}

/* Parse "dd/mm/yyyy" or "dd/mm/yyyy hh:mm" → Date */
function parseDMY(s: string): number {
  const [datePart, timePart] = s.split(" ");
  const [d, m, y] = datePart.split("/").map(Number);
  const [hh, mm] = (timePart ?? "00:00").split(":").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0).getTime();
}

type TimelineEvent = {
  at: string;
  type: "Nhập học" | "Dừng học" | "Bảo lưu" | "Đi học lại" | "Đóng học phí" | "Chuyển lớp" | "Chuyển chi nhánh";
  title: string;
  detail?: string;
};

function StudentHistoryTimeline({ stu, receipts }: { stu: Student; receipts: Receipt[] }) {
  const events: TimelineEvent[] = [];

  if (stu.lifecycleHistory?.length) {
    stu.lifecycleHistory.forEach((l) =>
      events.push({ at: l.at, type: l.type, title: l.type, detail: l.note }),
    );
  } else if (stu.enrolledAt) {
    events.push({ at: stu.enrolledAt, type: "Nhập học", title: "Nhập học", detail: `Đăng ký tại CN ${stu.branch}` });
  }

  receipts.forEach((r) =>
    events.push({
      at: r.createdAt,
      type: "Đóng học phí",
      title: `Đóng học phí · ${formatVND(r.amount)}`,
      detail: `Phiếu ${r.id} · ${r.method}${r.status === "Đã hủy" ? " · Đã hủy" : ""}`,
    }),
  );

  stu.transferHistory?.forEach((t) =>
    events.push({
      at: t.at,
      type: "Chuyển lớp",
      title: `Chuyển lớp: ${t.from} → ${t.to}`,
      detail: t.reason,
    }),
  );

  stu.branchHistory?.forEach((t) =>
    events.push({
      at: t.at,
      type: "Chuyển chi nhánh",
      title: `Chuyển chi nhánh: ${t.from} → ${t.to}`,
      detail: t.reason,
    }),
  );

  events.sort((a, b) => parseDMY(b.at) - parseDMY(a.at));

  if (!events.length) {
    return <p className="text-sm text-slate-500">Chưa có lịch sử.</p>;
  }

  const color: Record<TimelineEvent["type"], string> = {
    "Nhập học": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Dừng học": "bg-rose-100 text-rose-700 border-rose-200",
    "Bảo lưu": "bg-amber-100 text-amber-700 border-amber-200",
    "Đi học lại": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Đóng học phí": "bg-blue-100 text-blue-700 border-blue-200",
    "Chuyển lớp": "bg-violet-100 text-violet-700 border-violet-200",
    "Chuyển chi nhánh": "bg-violet-100 text-violet-700 border-violet-200",
  };

  return (
    <ol className="relative border-l border-slate-200 ml-2 space-y-3 text-sm">
      {events.map((e, i) => (
        <li key={i} className="ml-4">
          <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-slate-300 border-2 border-white" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500">{e.at}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${color[e.type]}`}>{e.type}</span>
          </div>
          <div className="font-medium mt-0.5">{e.title}</div>
          {e.detail && <div className="text-slate-600 text-xs">{e.detail}</div>}
        </li>
      ))}
    </ol>
  );
}

/* ============== CLASSES ============== */

const REPORT_TAG_TONE_CLASS: Record<ReportTagTone, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  info: "bg-sky-50 text-sky-700 border-sky-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  danger: "bg-rose-50 text-rose-700 border-rose-200",
  muted: "bg-muted text-muted-foreground border-border",
  violet: "bg-violet-50 text-violet-700 border-violet-200",
  pink: "bg-pink-50 text-pink-700 border-pink-200",
  slate: "bg-slate-700 text-slate-50 border-slate-600",
  teal: "bg-teal-50 text-teal-700 border-teal-200",
  orange: "bg-orange-50 text-orange-800 border-orange-200",
};

const reportTh = "text-xs font-medium text-muted-foreground whitespace-nowrap";
const reportCell = "border-r border-border align-middle";

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function buildClassSessions(cls: { totalSessions: number; startDate: string }) {
  const total = cls.totalSessions || 24;
  const startParts = cls.startDate?.split("/").map(Number) ?? [1, 1, 2026];
  const startD = new Date(startParts[2], (startParts[1] || 1) - 1, startParts[0] || 1);
  const fmt = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  return Array.from({ length: total }).map((_, i) => {
    const d = new Date(startD);
    d.setDate(startD.getDate() + i * 3);
    return { idx: i + 1, date: fmt(d) };
  });
}

const syllabusLessonPath = () =>
  SYLLABUS_STAGES.flatMap((st) =>
    st.lessons.map((l) => ({ stageName: st.name, index: l.index, unit: l.unit })),
  );

function syllabusSessionIndex(sel: SyllabusSel, stages: typeof SYLLABUS_STAGES = SYLLABUS_STAGES): number {
  let n = 0;
  for (const st of stages) {
    for (const l of st.lessons) {
      n += 1;
      if (sel.kind === "lesson" && sel.stageId === st.id && sel.lessonId === l.id) return n;
    }
    n += 1;
    if (sel.kind === "bigtest" && sel.stageId === st.id) return n;
  }
  return 1;
}

function mockSessionReport(stu: Student, sessionIdx: number) {
  const h = hashStr(`${stu.id}-${sessionIdx}`);
  const pick = <T,>(arr: T[], seed: number) => arr[seed % arr.length];
  if (sessionIdx > stu.attended) {
    return {
      attendance: "Không phép" as ReportAttendance,
      btvnHw: { [DEFAULT_BTVN_COLUMN_ID]: "X" as BtvnStatus },
      scores: { "score-1": "" as const, "score-2": "" as const },
      learningSpirit: "Chưa tập trung" as LearningSpirit,
      teacherComment: "",
    };
  }
  const attPool: ReportAttendance[] = ["Vắng", "Có phép", "Không phép", "Đi muộn"];
  const btvnPool: BtvnStatus[] = ["Yes", "X", "Yes làm thiếu"];
  const spiritPool = LEARNING_SPIRIT_OPTIONS.map((o) => o.value);
  const comments = [
    stu.latestComment,
    "Con tham gia tích cực, cần luyện thêm phần nghe.",
    "Con tập trung nghe giảng, làm bài đầy đủ.",
    "Cần hoàn thành BTVN đúng hạn hơn.",
    "",
  ].filter(Boolean) as string[];
  return {
    attendance: pick(attPool, h),
    btvnHw: { [DEFAULT_BTVN_COLUMN_ID]: pick(btvnPool, h >> 2) },
    scores: {
      "score-1": 55 + (h % 56),
      "score-2": h % 4 === 0 ? ("" as const) : (h % 31),
    },
    learningSpirit: pick(spiritPool, h >> 4),
    teacherComment: pick(comments.length ? comments : [""], h >> 6),
  };
}

function ReportTagView<T extends string>({
  value,
  options,
  compact,
}: {
  value: T;
  options: ReportSelectOption<T>[];
  compact?: boolean;
}) {
  const opt = options.find((o) => o.value === value);
  const toneClass = opt ? REPORT_TAG_TONE_CLASS[opt.tone] : REPORT_TAG_TONE_CLASS.muted;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border font-medium",
        compact ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        toneClass,
      )}
    >
      {value}
    </span>
  );
}

function normalizeSubmissionUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function SubmissionLinkButton({ url, readOnly }: { url?: string; readOnly?: boolean }) {
  if (!url) {
    return (
      <span
        className={cn(
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-dashed",
          readOnly ? "border-muted-foreground/20 bg-muted/20" : "border-muted-foreground/30 bg-muted/40",
        )}
        title="Học sinh chưa nộp link"
      >
        <Link2 className="h-3.5 w-3.5 text-muted-foreground/45" />
      </span>
    );
  }
  if (readOnly) {
    return (
      <a
        href={normalizeSubmissionUrl(url)}
        target="_blank"
        rel="noopener noreferrer"
        title="Xem bài nộp"
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
      >
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    );
  }
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="h-8 w-8 shrink-0 border-indigo-200 bg-indigo-50/80 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800"
      asChild
      title="Xem bài nộp của học sinh"
    >
      <a href={normalizeSubmissionUrl(url)} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </Button>
  );
}

function CorrectionLinkControl({
  url,
  onSave,
  readOnly,
}: {
  url?: string;
  onSave?: (url: string) => void;
  readOnly?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(url ?? "");

  React.useEffect(() => {
    if (open) setDraft(url ?? "");
  }, [open, url]);

  if (readOnly) {
    if (!url) {
      return (
        <span
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-dashed border-muted-foreground/20 bg-muted/20"
          title="Giáo viên chưa up link chữa bài"
        >
          <FileCheck className="h-3.5 w-3.5 text-muted-foreground/35" />
        </span>
      );
    }
    return (
      <a
        href={normalizeSubmissionUrl(url)}
        target="_blank"
        rel="noopener noreferrer"
        title="Xem bài chữa của giáo viên"
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
      >
        <FileCheck className="h-3.5 w-3.5" />
      </a>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            "h-8 w-8 shrink-0",
            url
              ? "border-emerald-200 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100"
              : "border-dashed border-muted-foreground/35 bg-muted/30 text-muted-foreground hover:bg-muted/50",
          )}
          title={url ? "Sửa link chữa bài" : "Up link chữa bài cho học sinh xem"}
        >
          {url ? <FileCheck className="h-3.5 w-3.5" /> : <Upload className="h-3.5 w-3.5" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-3" align="center">
        <div className="space-y-1">
          <div className="text-sm font-medium">Link chữa bài</div>
          <p className="text-xs text-muted-foreground">Dán link Google Docs/Drive bài đã chữa. Học sinh xem trên portal Nộp BTVN.</p>
        </div>
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="https://docs.google.com/..."
          className="h-9"
        />
        <div className="flex gap-2 justify-end">
          {url && (
            <Button variant="outline" size="sm" asChild>
              <a href={normalizeSubmissionUrl(url)} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" /> Xem
              </a>
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => {
              onSave?.(draft);
              setOpen(false);
              toast.success(draft.trim() ? "Đã lưu link chữa bài" : "Đã xóa link chữa bài");
            }}
          >
            Lưu
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ClassSessionReportView({
  cls,
  students,
}: {
  cls: { totalSessions: number; startDate: string; syllabus: string };
  students: Student[];
}) {
  const { homeworkSubmissions, homeworkCorrections } = useApp();
  const sessions = React.useMemo(() => buildClassSessions(cls), [cls]);
  const lessons = React.useMemo(() => syllabusLessonPath(), []);
  const maxAttended = Math.max(0, ...students.map((s) => s.attended));
  const [sessionIdx, setSessionIdx] = React.useState(() => Math.min(maxAttended || 1, sessions.length));
  const [q, setQ] = React.useState("");

  const btvnColumns = DEFAULT_BTVN_COLUMNS.map((c) => ({ ...c, label: c.label || "BTVN" }));
  const scoreColumns = DEFAULT_SCORE_COLUMNS;

  const currentSession = sessions.find((s) => s.idx === sessionIdx)!;
  const lesson = lessons[sessionIdx - 1];

  const rows = students.map((stu) => ({
    id: stu.id,
    name: stu.nickname ? `${stu.name} (${stu.nickname})` : stu.name,
    ...mockSessionReport(stu, sessionIdx),
  }));
  const filtered = rows.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));
  const dataColSpan = 3 + btvnColumns.length + scoreColumns.length + 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">Ngày học</Label>
            <Select value={String(sessionIdx)} onValueChange={(v) => setSessionIdx(Number(v))}>
              <SelectTrigger className="h-9 w-72 mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {sessions.map((s) => {
                  const les = lessons[s.idx - 1];
                  return (
                    <SelectItem key={s.idx} value={String(s.idx)}>
                      {s.date}{les ? ` · Buổi ${s.idx} · ${les.unit}` : ` · Buổi ${s.idx}`}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Input className="h-9 w-56" placeholder="Tìm học viên..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="rounded-md border bg-slate-50/60 px-3 py-2 flex items-center gap-2 flex-wrap text-sm">
        <Calendar className="h-4 w-4 text-indigo-600 shrink-0" />
        <span className="font-medium">Buổi {currentSession.idx}</span>
        <span className="text-slate-400">·</span>
        <span className="text-slate-600">{currentSession.date}</span>
        {lesson && (
          <>
            <span className="text-slate-400">·</span>
            <Layers className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-slate-500">{lesson.stageName}</span>
            <span className="text-slate-400">·</span>
            <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
            <span className="font-medium">{lesson.unit}</span>
          </>
        )}
        <Badge variant="outline" className="ml-auto text-[10px]">Chỉ xem</Badge>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2} className={cn(reportTh, reportCell, "w-12 text-center")}>STT</TableHead>
              <TableHead rowSpan={2} className={cn(reportTh, reportCell, "min-w-[160px]")}>Học viên</TableHead>
              <TableHead rowSpan={2} className={cn(reportTh, reportCell, "w-36 text-center")}>Điểm danh</TableHead>
              <TableHead colSpan={btvnColumns.length} className={cn(reportTh, reportCell, "text-center")}>BTVN</TableHead>
              {scoreColumns.map((col) => (
                <TableHead key={col.id} rowSpan={2} className={cn(reportTh, reportCell, "min-w-[120px] text-center")}>
                  {col.label}
                </TableHead>
              ))}
              <TableHead rowSpan={2} className={cn(reportTh, reportCell, "min-w-[180px] text-center")}>Tinh thần học tập</TableHead>
            </TableRow>
            <TableRow>
              {btvnColumns.map((col) => (
                <TableHead key={col.id} className={cn(reportTh, reportCell, "min-w-[120px] text-center text-xs")}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={dataColSpan} className="text-center text-muted-foreground py-8">
                  Không có học viên phù hợp
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r, idx) => (
                <React.Fragment key={r.id}>
                  <TableRow>
                    <TableCell className={cn(reportCell, "text-center text-muted-foreground align-top pt-3")}>{idx + 1}</TableCell>
                    <TableCell className={cn(reportCell, "font-medium align-top pt-3")}>{r.name}</TableCell>
                    <TableCell className={cn(reportCell, "text-center align-top pt-2")}>
                      <ReportTagView value={r.attendance} options={REPORT_ATTENDANCE_OPTIONS} compact />
                    </TableCell>
                    {btvnColumns.map((col) => (
                      <TableCell key={col.id} className={cn(reportCell, "text-center align-top pt-2")}>
                        <ReportTagView value={r.btvnHw[col.id] ?? "Yes"} options={BTVN_STATUS_OPTIONS} compact />
                      </TableCell>
                    ))}
                    {scoreColumns.map((col) => (
                      <TableCell key={col.id} className={cn(reportCell, "text-center align-top pt-2")}>
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-sm font-medium tabular-nums min-w-[2rem]">
                            {r.scores[col.id] !== "" && r.scores[col.id] != null ? r.scores[col.id] : "—"}
                          </span>
                          <SubmissionLinkButton
                            readOnly
                            url={homeworkSubmissions[homeworkSubmissionKey(r.id, sessionIdx, col.id)]}
                          />
                          <CorrectionLinkControl
                            readOnly
                            url={homeworkCorrections[homeworkCorrectionKey(r.id, sessionIdx, col.id)]}
                          />
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className={cn(reportCell, "text-center align-top pt-2")}>
                      <ReportTagView value={r.learningSpirit} options={LEARNING_SPIRIT_OPTIONS} />
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent border-b-2 border-border">
                    <TableCell colSpan={dataColSpan} className="p-2 pb-3 bg-muted/20">
                      <div className="text-sm text-slate-700 whitespace-pre-wrap min-h-9 px-3 py-2 rounded-md border bg-background">
                        {r.teacherComment ? (
                          r.teacherComment
                        ) : (
                          <span className="text-muted-foreground italic">Chưa có nhận xét</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

type SyllabusSel = { kind: "lesson"; stageId: string; lessonId: string } | { kind: "bigtest"; stageId: string };

function ClassStudentsList({
  students,
  onTransfer,
}: {
  students: Student[];
  onTransfer: (id: string) => void;
}) {
  return (
    <Table>
      <TableHeader><TableRow>
        <TableHead>Tên</TableHead><TableHead>Đã học/Mua</TableHead><TableHead>Công nợ</TableHead><TableHead></TableHead>
      </TableRow></TableHeader>
      <TableBody>
        {students.map((s) => (
          <TableRow key={s.id}>
            <TableCell>{s.name}{s.nickname ? ` (${s.nickname})` : ""}</TableCell>
            <TableCell>{s.attended} / {s.bought}</TableCell>
            <TableCell>{formatVND(s.debt)}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => onTransfer(s.id)}>
                <Repeat className="h-3.5 w-3.5" /> Chuyển lớp
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ClassInfoSection({
  cls,
  students,
  onTransfer,
}: {
  cls: { totalSessions: number; startDate: string; syllabus: string; pricePerCourse: number };
  students: Student[];
  onTransfer: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Info2
          label="Tiến độ"
          value={`${Math.min(
            cls.totalSessions,
            Math.max(0, ...students.map((s) => s.attended)),
          )}/${cls.totalSessions} buổi`}
        />
        <Info2 label="Học phí" value={formatVND(cls.pricePerCourse)} />
      </div>

      <Tabs defaultValue="list" className="space-y-3">
        <TabsList>
          <TabsTrigger value="list">Danh sách học viên</TabsTrigger>
          <TabsTrigger value="report">Báo cáo</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <ClassStudentsList students={students} onTransfer={onTransfer} />
        </TabsContent>

        <TabsContent value="report">
          <ClassSessionReportView cls={cls} students={students} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ClassSyllabusSection({
  cls,
  students,
}: {
  cls: { totalSessions: number; startDate: string };
  students: Student[];
}) {
  const stages = SYLLABUS_STAGES;
  const [sel, setSel] = React.useState<SyllabusSel>({
    kind: "lesson",
    stageId: stages[0].id,
    lessonId: stages[0].lessons[0].id,
  });
  const sessions = React.useMemo(() => buildClassSessions(cls), [cls]);
  const sessionIdx = syllabusSessionIndex(sel, stages);
  const sessionDate = sessions[sessionIdx - 1]?.date;

  return (
    <Tabs defaultValue="syllabus" className="space-y-3">
      <TabsList>
        <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
        <TabsTrigger value="report">Report</TabsTrigger>
      </TabsList>

      <TabsContent value="syllabus">
        <SyllabusContentTree stages={stages} sel={sel} setSel={setSel} />
      </TabsContent>

      <TabsContent value="report">
        <SyllabusReportsTab sel={sel} sessionDate={sessionDate} sessionIdx={sessionIdx} students={students} />
      </TabsContent>
    </Tabs>
  );
}

function ClassDetailTabs({
  cls,
  students,
  onTransfer,
}: {
  cls: { id: string; totalSessions: number; startDate: string; syllabus: string; pricePerCourse: number };
  students: Student[];
  onTransfer: (id: string) => void;
}) {
  return (
    <Tabs defaultValue="info" className="space-y-4">
      <TabsList className="flex-wrap h-auto">
        <TabsTrigger value="info"><Info className="h-4 w-4 mr-1" /> Thông tin lớp</TabsTrigger>
        <TabsTrigger value="content"><BookOpen className="h-4 w-4 mr-1" /> Nội dung syllabus</TabsTrigger>
        <TabsTrigger value="report">Báo cáo học vụ</TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="space-y-4">
        <ClassInfoSection cls={cls} students={students} onTransfer={onTransfer} />
      </TabsContent>

      <TabsContent value="content">
        <ClassSyllabusSection cls={cls} students={students} />
      </TabsContent>

      <TabsContent value="report">
        <SyllabusReportTab />
      </TabsContent>
    </Tabs>
  );
}

export function AdminClasses() {
  const { classes, setClasses, students } = useApp();
  const [selected, setSelected] = React.useState<string | null>(null);
  const cls = classes.find((c) => c.id === selected);
  const [openHoliday, setOpenHoliday] = React.useState(false);
  const [holidayDate, setHolidayDate] = React.useState("");
  const [transferStudentId, setTransferStudentId] = React.useState<string | null>(null);
  const [filterBranch, setFilterBranch] = React.useState<string>("all");
  const [filterClassId, setFilterClassId] = React.useState<string>("all");

  // Create class dialog
  const DEFAULT_TOTAL_SESSIONS = 24;
  const DAY_OPTIONS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
  const DAY_TO_INDEX: Record<string, number> = {
    "Thứ 2": 1, "Thứ 3": 2, "Thứ 4": 3, "Thứ 5": 4, "Thứ 6": 5, "Thứ 7": 6, "Chủ nhật": 0,
  };
  const fmtDate = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  type NewSession = { day: string; shiftId: string; room: string };
  const emptyForm = () => ({
    branch: "" as Branch | "",
    name: "",
    teacher: "",
    syllabus: "",
    startDate: undefined as Date | undefined,
    tuitionGroup: "",
    sessions: [{ day: "Thứ 2", shiftId: "", room: "" }] as NewSession[],
  });
  const [openCreate, setOpenCreate] = React.useState(false);
  const [form, setForm] = React.useState(emptyForm());
  const branchRooms = ROOMS.filter((r) => !form.branch || r.branch === form.branch);
  const branchTeachers = TEACHERS.filter((t) => !form.branch || t.branch === form.branch);

  const updateSession = (i: number, patch: Partial<NewSession>) => {
    setForm((f) => ({ ...f, sessions: f.sessions.map((s, idx) => idx === i ? { ...s, ...patch } : s) }));
  };
  const addSession = () => setForm((f) => ({ ...f, sessions: [...f.sessions, { day: "Thứ 4", shiftId: "", room: "" }] }));
  const removeSession = (i: number) => setForm((f) => ({ ...f, sessions: f.sessions.filter((_, idx) => idx !== i) }));

  // Auto-generate end date: count occurrences of selected weekdays starting from startDate until reaching totalSessions
  const computedEndDate = React.useMemo(() => {
    if (!form.startDate || form.sessions.length === 0) return null;
    const dayIdxs = Array.from(new Set(form.sessions.map((s) => DAY_TO_INDEX[s.day]).filter((n) => n !== undefined)));
    if (dayIdxs.length === 0) return null;
    const d = new Date(form.startDate);
    let count = 0;
    let last = new Date(d);
    // safety cap
    for (let i = 0; i < 366 * 3; i++) {
      if (dayIdxs.includes(d.getDay())) {
        count++;
        last = new Date(d);
        if (count >= DEFAULT_TOTAL_SESSIONS) break;
      }
      d.setDate(d.getDate() + 1);
    }
    return last;
  }, [form.startDate, form.sessions]);

  const submitCreate = () => {
    if (!form.branch || !form.name.trim() || !form.teacher || !form.syllabus || !form.startDate || !computedEndDate) {
      toast.error("Vui lòng điền đầy đủ thông tin lớp.");
      return;
    }
    if (!form.tuitionGroup) {
      toast.error("Vui lòng chọn khung học phí.");
      return;
    }
    if (form.sessions.length === 0 || form.sessions.some((s) => !s.day || !s.shiftId || !s.room)) {
      toast.error("Vui lòng cấu hình đầy đủ lịch học và phòng cho từng buổi.");
      return;
    }
    const sy = SYLLABI.find((s) => s.id === form.syllabus);
    const tg = TUITION_CONFIG.find((g) => g.group === form.tuitionGroup);
    const tier = tg?.tiers.find((t) => t.sessions === DEFAULT_TOTAL_SESSIONS) ?? tg?.tiers[0];
    const expandedSessions = form.sessions.map((s) => {
      const sh = CLASS_SHIFTS.find((x) => x.id === s.shiftId);
      return { day: s.day, time: sh?.time ?? "", room: s.room };
    });
    const id = `c${Date.now()}`;
    setClasses((prev) => [
      ...prev,
      {
        id,
        name: form.name.trim(),
        schedule: form.sessions.map((s) => s.day).join(", "),
        time: expandedSessions[0].time,
        branch: form.branch as Branch,
        teacher: form.teacher,
        room: expandedSessions[0].room,
        syllabus: sy ? `${sy.code} · ${sy.name}` : form.syllabus,
        startDate: fmtDate(form.startDate!),
        endDate: fmtDate(computedEndDate),
        totalSessions: DEFAULT_TOTAL_SESSIONS,
        remainingSessions: DEFAULT_TOTAL_SESSIONS,
        pricePerCourse: tier?.final ?? 0,
        pricePerSession: tier ? Math.round(tier.final / tier.sessions) : 0,
        sessions: expandedSessions,
      },
    ]);
    toast.success(`Đã tạo lớp ${form.name.trim()}`);
    setOpenCreate(false);
    setForm(emptyForm());
  };

  const filteredClasses = classes.filter((c) =>
    (filterBranch === "all" || c.branch === filterBranch) &&
    (filterClassId === "all" || c.id === filterClassId),
  );
  const classOptions = classes.filter((c) => filterBranch === "all" || c.branch === filterBranch);

  const confirmHoliday = () => {
    if (!cls || !holidayDate) return;
    setClasses((prev) =>
      prev.map((c) => c.id === cls.id ? { ...c, endDate: shiftDate(c.endDate, 7) } : c),
    );
    toast.success("Đã dời ngày kết thúc lớp do có lịch nghỉ.", {
      description: `Ngày nghỉ: ${holidayDate}. Không trừ buổi học viên, không cộng buổi giáo viên.`,
    });
    setOpenHoliday(false);
    setHolidayDate("");
  };

  return (
    <div className="space-y-4">
      {cls ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Chi tiết lớp: {cls.name}</CardTitle>
              <div className="text-xs text-slate-500 mt-1">{cls.branch} · {cls.teacher}</div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={openHoliday} onOpenChange={setOpenHoliday}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm"><CalendarOff className="h-4 w-4" /> Set lịch nghỉ</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set lịch nghỉ buổi học</DialogTitle>
                    <DialogDescription>
                      Khi xác nhận: trạng thái buổi chuyển "Nghỉ", không trừ buổi học viên, không cộng buổi giáo viên,
                      và ngày kết thúc lớp tự dời thêm 1 buổi.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Label>Ngày nghỉ</Label>
                    <Input placeholder="VD: 25/03/2026" value={holidayDate} onChange={(e) => setHolidayDate(e.target.value)} />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenHoliday(false)}>Hủy</Button>
                    <Button onClick={confirmHoliday}>Xác nhận lịch nghỉ</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={() => setSelected(null)}>
                <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ClassDetailTabs
              cls={cls}
              students={students.filter((s) => s.classId === cls.id)}
              onTransfer={setTransferStudentId}
            />
          </CardContent>
        </Card>
      ) : (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>Danh sách lớp</CardTitle>
            <Button size="sm" onClick={() => { setForm(emptyForm()); setOpenCreate(true); }}>
              <Plus className="h-4 w-4" /> Tạo lớp
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div>
              <Label className="text-xs text-slate-500">Chi nhánh</Label>
              <Select
                value={filterBranch}
                onValueChange={(v) => { setFilterBranch(v); setFilterClassId("all"); }}
              >
                <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                  {BRANCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-slate-500">Lớp</Label>
              <Select value={filterClassId} onValueChange={setFilterClassId}>
                <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả lớp</SelectItem>
                  {classOptions.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Lớp</TableHead><TableHead>Lịch</TableHead>
              <TableHead>Chi nhánh</TableHead><TableHead>Giáo viên</TableHead>
              <TableHead>Syllabus</TableHead><TableHead className="text-right">Học viên</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filteredClasses.map((c) => (
                <TableRow key={c.id} className="cursor-pointer hover:bg-indigo-50" onClick={() => setSelected(c.id)}>
                  <TableCell className="font-medium text-indigo-700">{c.name}</TableCell>
                  <TableCell>{c.schedule} · {c.time}</TableCell>
                  <TableCell>{c.branch}</TableCell>
                  <TableCell>{c.teacher}</TableCell>
                  <TableCell className="text-xs">{c.syllabus}</TableCell>
                  <TableCell className="text-right">{students.filter((s) => s.classId === c.id).length}</TableCell>
                </TableRow>
              ))}
              {filteredClasses.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-slate-500 py-6">Không có lớp phù hợp</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      )}
      <TransferDialog studentId={transferStudentId} onClose={() => setTransferStudentId(null)} />

      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo lớp học mới</DialogTitle>
            <DialogDescription>
              Cấu hình thông tin lớp. Số buổi mặc định là {DEFAULT_TOTAL_SESSIONS} (có thể chỉnh ở tab Cấu hình).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-500">Chi nhánh</Label>
                <Select
                  value={form.branch}
                  onValueChange={(v) => setForm((f) => ({ ...f, branch: v as Branch, teacher: "", sessions: f.sessions.map((s) => ({ ...s, room: "" })) }))}
                >
                  <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Chọn chi nhánh" /></SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Tên lớp</Label>
                <Input className="h-9 mt-1" placeholder="VD: 4CLC2" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Giáo viên</Label>
                <Select value={form.teacher} onValueChange={(v) => setForm((f) => ({ ...f, teacher: v }))}>
                  <SelectTrigger className="h-9 mt-1"><SelectValue placeholder={form.branch ? "Chọn giáo viên" : "Chọn chi nhánh trước"} /></SelectTrigger>
                  <SelectContent>
                    {branchTeachers.map((t) => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Syllabus</Label>
                <Select value={form.syllabus} onValueChange={(v) => setForm((f) => ({ ...f, syllabus: v }))}>
                  <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Chọn syllabus" /></SelectTrigger>
                  <SelectContent>
                    {SYLLABI.map((s) => <SelectItem key={s.id} value={s.id}>{s.code} · {s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
               <div>
                 <Label className="text-xs text-slate-500">Ngày bắt đầu</Label>
                 <Popover>
                   <PopoverTrigger asChild>
                     <Button
                       variant="outline"
                       className={cn("h-9 mt-1 w-full justify-start font-normal", !form.startDate && "text-muted-foreground")}
                     >
                       <CalendarIcon className="h-4 w-4 mr-2" />
                       {form.startDate ? fmtDate(form.startDate) : "Chọn ngày"}
                     </Button>
                   </PopoverTrigger>
                   <PopoverContent className="w-auto p-0" align="start">
                     <CalendarUI
                       mode="single"
                       selected={form.startDate}
                       onSelect={(d) => setForm((f) => ({ ...f, startDate: d ?? undefined }))}
                       initialFocus
                     />
                   </PopoverContent>
                 </Popover>
               </div>
               <div>
                 <Label className="text-xs text-slate-500">Ngày kết thúc dự kiến</Label>
                 <Input
                   className="h-9 mt-1 bg-slate-50"
                   value={computedEndDate ? fmtDate(computedEndDate) : ""}
                   placeholder="Tự động tính theo lịch học"
                   disabled
                 />
                 <p className="text-[11px] text-slate-400 mt-1">Tự sinh từ ngày bắt đầu + lịch học</p>
               </div>
              <div>
                <Label className="text-xs text-slate-500">Số buổi / khóa</Label>
                <Input className="h-9 mt-1 bg-slate-50" value={DEFAULT_TOTAL_SESSIONS} disabled />
                <p className="text-[11px] text-slate-400 mt-1">Cấu hình tại tab Cấu hình</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Học phí</Label>
                <Select value={form.tuitionGroup} onValueChange={(v) => setForm((f) => ({ ...f, tuitionGroup: v }))}>
                  <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Chọn khung học phí" /></SelectTrigger>
                  <SelectContent>
                    {TUITION_CONFIG.map((g) => {
                      const tier = g.tiers.find((t) => t.sessions === DEFAULT_TOTAL_SESSIONS) ?? g.tiers[0];
                      return (
                        <SelectItem key={g.group} value={g.group}>
                          {g.group} · {formatVND(tier.final)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-slate-400 mt-1">Cấu hình tại tab Cấu hình</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-semibold">Lịch học &amp; phòng học</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSession}>
                  <Plus className="h-3.5 w-3.5" /> Thêm buổi
                </Button>
              </div>
              <div className="space-y-2">
                {form.sessions.map((s, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                    <Select value={s.day} onValueChange={(v) => updateSession(i, { day: v })}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DAY_OPTIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={s.shiftId} onValueChange={(v) => updateSession(i, { shiftId: v })}>
                      <SelectTrigger className="h-9"><SelectValue placeholder="Chọn khung giờ" /></SelectTrigger>
                      <SelectContent>
                        {CLASS_SHIFTS.map((sh) => (
                          <SelectItem key={sh.id} value={sh.id}>{sh.time} · {sh.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={s.room} onValueChange={(v) => updateSession(i, { room: v })}>
                      <SelectTrigger className="h-9"><SelectValue placeholder={form.branch ? "Chọn phòng" : "Chọn CN trước"} /></SelectTrigger>
                      <SelectContent>
                        {branchRooms.map((r) => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="ghost" size="sm" disabled={form.sessions.length <= 1} onClick={() => removeSession(i)}>
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCreate(false)}>Hủy</Button>
            <Button onClick={submitCreate}>Tạo lớp</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============== FEES (Quản lý học phí) ============== */
export function AdminFees() {
  const { students, classes } = useApp();
  const [collectStudentId, setCollectStudentId] = React.useState<string | null>(null);
  const [filterBranch, setFilterBranch] = React.useState<string>("all");
  const [filterClassId, setFilterClassId] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [fromDate, setFromDate] = React.useState<string>(""); // yyyy-mm-dd
  const [toDate, setToDate] = React.useState<string>("");

  const parseDMY = (s?: string) => {
    if (!s) return null;
    const [dd, mm, yyyy] = s.split("/").map(Number);
    return new Date(yyyy, mm - 1, dd).getTime();
  };
  const fromTs = fromDate ? new Date(fromDate).getTime() : null;
  const toTs = toDate ? new Date(toDate).getTime() + 86399999 : null;

  const classOptions = classes.filter((c) => filterBranch === "all" || c.branch === filterBranch);
  const rows = students
    .filter((s) => filterBranch === "all" || s.branch === filterBranch)
    .filter((s) => filterClassId === "all" || s.classId === filterClassId)
    .filter((s) => {
      if (!fromTs && !toTs) return true;
      const ts = parseDMY(s.feeUpdatedAt);
      if (ts == null) return false;
      if (fromTs && ts < fromTs) return false;
      if (toTs && ts > toTs) return false;
      return true;
    })
    .map((s) => {
      const remain = s.bought - s.attended;
      const fs = s.feeStatus ?? (s.debt > 0 ? "debt" : "ok");
      const status =
        fs === "debt"    ? { key: "debt",    label: "Còn nợ",      variant: "destructive" as const } :
        fs === "pending" ? { key: "pending", label: "Đã ghi nhận", variant: "secondary"   as const } :
                           { key: "ok",      label: "Đã đóng đủ",  variant: "default"     as const };
      return { s, remain, status };
    })
    .filter((r) => filterStatus === "all" || r.status.key === filterStatus);

  const totalDebt = rows.reduce((sum, r) => sum + r.s.debt, 0);
  const debtCount = rows.filter((r) => r.s.debt > 0).length;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card><CardContent className="p-4">
          <div className="text-xs text-slate-500">Tổng học viên</div>
          <div className="text-xl font-bold">{rows.length}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-xs text-slate-500">Đang nợ học phí</div>
          <div className="text-xl font-bold text-rose-600">{debtCount}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-xs text-slate-500">Tổng công nợ</div>
          <div className="text-xl font-bold text-rose-600">{formatVND(totalDebt)}</div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[150px]">
              <Label className="text-xs text-slate-500">Từ ngày</Label>
              <Input type="date" className="h-9 mt-1" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="min-w-[150px]">
              <Label className="text-xs text-slate-500">Đến ngày</Label>
              <Input type="date" className="h-9 mt-1" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
            <div className="flex-1 min-w-[180px]">
              <Label className="text-xs text-slate-500">Chi nhánh</Label>
              <Select value={filterBranch} onValueChange={(v) => { setFilterBranch(v); setFilterClassId("all"); }}>
                <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                  {BRANCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <Label className="text-xs text-slate-500">Lớp</Label>
              <Select value={filterClassId} onValueChange={setFilterClassId}>
                <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả lớp</SelectItem>
                  {classOptions.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <Label className="text-xs text-slate-500">Tình trạng</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="debt">Còn nợ</SelectItem>
                  <SelectItem value="pending">Đã ghi nhận</SelectItem>
                  <SelectItem value="ok">Đã đóng đủ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-xs text-slate-500 pt-2">Nhấp vào tên học viên để mở phiếu thu học phí.</p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Học viên</TableHead><TableHead>Chi nhánh</TableHead>
              <TableHead>Lớp</TableHead><TableHead>Buổi còn lại</TableHead>
              <TableHead>Công nợ</TableHead><TableHead>Tình trạng</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {rows.map(({ s, remain, status }) => (
                <TableRow key={s.id} className="cursor-pointer" onClick={() => setCollectStudentId(s.id)}>
                  <TableCell className="font-medium text-indigo-700 hover:underline">
                    {s.name}{s.nickname ? ` (${s.nickname})` : ""}
                  </TableCell>
                  <TableCell>{s.branch}</TableCell>
                  <TableCell>{classes.find((c) => c.id === s.classId)?.name ?? "-"}</TableCell>
                  <TableCell>{remain} buổi</TableCell>
                  <TableCell className={s.debt > 0 ? "text-rose-600 font-semibold" : ""}>
                    {formatVND(s.debt)}
                  </TableCell>
                  <TableCell><Badge variant={status.variant}>{status.label}</Badge></TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-slate-500 py-6">Không có học viên phù hợp</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CollectFeeDialog studentId={collectStudentId} onClose={() => setCollectStudentId(null)} />
    </div>
  );
}

function shiftDate(d: string, days: number) {
  // d: dd/mm/yyyy
  const [dd, mm, yyyy] = d.split("/").map(Number);
  const dt = new Date(yyyy, mm - 1, dd);
  dt.setDate(dt.getDate() + days);
  return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
}

/* ============== SETTINGS (Cấu hình) ============== */
export function AdminTuition() {
  const { cashConfig, setCashConfig } = useApp();
  const [sessionsPerCourse, setSessionsPerCourse] = React.useState<number>(24);
  return (
    <Tabs defaultValue="shifts" className="space-y-4">
      <TabsList>
        <TabsTrigger value="shifts"><Clock className="h-4 w-4" /> Ca học</TabsTrigger>
        <TabsTrigger value="rooms"><DoorOpen className="h-4 w-4" /> Phòng học</TabsTrigger>
        <TabsTrigger value="course"><BookOpen className="h-4 w-4" /> Khoá học</TabsTrigger>
        <TabsTrigger value="fee"><BookOpen className="h-4 w-4" /> Học phí</TabsTrigger>
        <TabsTrigger value="promotions"><Tag className="h-4 w-4" /> Khuyến mãi</TabsTrigger>
        <TabsTrigger value="receipts"><Hash className="h-4 w-4" /> Phiếu thu</TabsTrigger>
      </TabsList>

      <TabsContent value="course">
        <Card>
          <CardHeader>
            <CardTitle>Cấu hình khoá học</CardTitle>
            <p className="text-xs text-slate-500">Số buổi mặc định cho mỗi khoá học. Có thể thay đổi bất cứ lúc nào.</p>
          </CardHeader>
          <CardContent>
            <div className="max-w-md space-y-2">
              <Label>Số buổi / khoá</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min={1}
                  value={sessionsPerCourse}
                  onChange={(e) => setSessionsPerCourse(Number(e.target.value) || 0)}
                  className="w-32"
                />
                <span className="text-sm text-slate-500">buổi</span>
              </div>
              <p className="text-xs text-slate-500">Hiện tại: <span className="font-semibold text-slate-700">{sessionsPerCourse} buổi / khoá</span></p>
              <Button size="sm" className="mt-2">Lưu cấu hình</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="shifts">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Cấu hình ca học</CardTitle>
              <Button size="sm" variant="outline">+ Thêm ca học</Button>
            </div>
            <p className="text-xs text-slate-500">Các ca học sẽ hiển thị để chọn khi tạo lớp mới.</p>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Tên ca</TableHead><TableHead>Khung giờ</TableHead>
                <TableHead>Ngày trong tuần</TableHead><TableHead></TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {CLASS_SHIFTS.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.label}</TableCell>
                    <TableCell>{s.time}</TableCell>
                    <TableCell>{s.days}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">Sửa</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="rooms">
        <div className="space-y-4">
          {BRANCHES.map((b) => {
            const rooms = ROOMS.filter((r) => r.branch === b);
            return (
              <Card key={b}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Chi nhánh: {b}</CardTitle>
                    <Button size="sm" variant="outline">+ Thêm phòng</Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Tên phòng</TableHead><TableHead>Sức chứa</TableHead><TableHead></TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {rooms.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">{r.name}</TableCell>
                          <TableCell>{r.capacity} học viên</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost">Sửa</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </TabsContent>

      <TabsContent value="fee">
        <div className="space-y-4">
          {TUITION_CONFIG.map((g) => (
            <Card key={g.group}>
              <CardHeader><CardTitle className="text-base">{g.group}</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Gói</TableHead><TableHead>Số buổi</TableHead><TableHead>Học phí gốc</TableHead>
                    <TableHead>Ưu đãi</TableHead><TableHead>Thành tiền</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {g.tiers.map((t) => (
                      <TableRow key={t.label}>
                        <TableCell className="font-medium">{t.label}</TableCell>
                        <TableCell>{t.sessions}</TableCell>
                        <TableCell>{formatVND(t.base)}</TableCell>
                        <TableCell>{t.discountPct ? `Giảm ${t.discountPct}%` : "—"}</TableCell>
                        <TableCell className="font-semibold text-indigo-700">{formatVND(t.final)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="promotions">
        <Card>
          <CardHeader><CardTitle>Danh sách khuyến mãi</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PROMOTIONS.map((p) => (
                <div key={p.id} className="border rounded-lg p-4 bg-white flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.label}</div>
                    <div className="text-xs text-slate-500">{p.type === "fixed" ? "Giảm tiền cố định" : "Giảm theo %"}</div>
                  </div>
                  <Badge variant="secondary">{p.type === "fixed" ? formatVND(p.value) : `${p.value}%`}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="receipts">
        <Card>
          <CardHeader>
            <CardTitle>Cấu hình số phiếu thu tiền mặt</CardTitle>
            <p className="text-xs text-slate-500">
              Mỗi chi nhánh có dải số phiếu thu giấy riêng. Khi thu tiền mặt, hệ thống tự sinh mã phiếu kế tiếp theo dải đã cấu hình.
              Phiếu chuyển khoản dùng mã tự sinh chung (CK-xxxx).
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Chi nhánh</TableHead>
                <TableHead>Tiền tố</TableHead>
                <TableHead>Số bắt đầu</TableHead>
                <TableHead>Số kết thúc</TableHead>
                <TableHead>Số đã dùng</TableHead>
                <TableHead>Số kế tiếp</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {cashConfig.map((c) => {
                  const next = Math.max(c.current + 1, c.start);
                  const exhausted = next > c.end;
                  return (
                    <TableRow key={c.branch}>
                      <TableCell className="font-medium">{c.branch}</TableCell>
                      <TableCell>
                        <Input className="w-24" value={c.prefix}
                          onChange={(e) => setCashConfig((prev) => prev.map((x) => x.branch === c.branch ? { ...x, prefix: e.target.value.toUpperCase() } : x))} />
                      </TableCell>
                      <TableCell>
                        <Input className="w-28" type="number" value={c.start}
                          onChange={(e) => setCashConfig((prev) => prev.map((x) => x.branch === c.branch ? { ...x, start: Number(e.target.value) } : x))} />
                      </TableCell>
                      <TableCell>
                        <Input className="w-28" type="number" value={c.end}
                          onChange={(e) => setCashConfig((prev) => prev.map((x) => x.branch === c.branch ? { ...x, end: Number(e.target.value) } : x))} />
                      </TableCell>
                      <TableCell>{c.current}</TableCell>
                      <TableCell className={`font-mono ${exhausted ? "text-red-600" : "text-indigo-700"}`}>
                        {exhausted ? "Đã hết dải" : `${c.prefix}-${String(next).padStart(6, "0")}`}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

/* ============== COLLECT FEE (dialog) ============== */
export function CollectFeeDialog({ studentId, onClose }: { studentId: string | null; onClose: () => void }) {
  const { students, classes, receipts, setReceipts, setStudents, cashConfig, setCashConfig } = useApp();
  const stu = students.find((s) => s.id === studentId) ?? null;
  const cls = stu ? classes.find((c) => c.id === stu.classId) ?? null : null;

  const [sessions, setSessions] = React.useState(24);
  const [promoId, setPromoId] = React.useState("p0");
  const [method, setMethod] = React.useState<Receipt["method"]>("Tiền mặt");
  const [receiptNo, setReceiptNo] = React.useState("");
  const [date, setDate] = React.useState("26/05/2026");
  const [note, setNote] = React.useState("");

  const paidTotal = React.useMemo(
    () => receipts.filter((r) => r.studentId === studentId && r.status === "Hiệu lực")
      .reduce((s, r) => s + r.amount, 0),
    [receipts, studentId],
  );

  React.useEffect(() => {
    if (studentId) {
      const price = cls?.pricePerSession ?? 0;
      const debtSessions = price > 0 && (stu?.debt ?? 0) > 0
        ? Math.ceil((stu?.debt ?? 0) / price)
        : 0;
      const studentRemaining = (stu?.bought ?? 0) - (stu?.attended ?? 0);
      const classRemaining = cls?.remainingSessions ?? 0;
      const catchUp = Math.max(0, classRemaining - studentRemaining);
      const suggested = catchUp > 0 ? catchUp : (debtSessions > 0 ? debtSessions : 24);
      setSessions(suggested);
      setPromoId("p0");
      setMethod("Tiền mặt"); setNote("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  // Auto-generate receipt number whenever student or method changes
  React.useEffect(() => {
    if (!stu) return;
    if (method === "Tiền mặt") {
      const cfg = cashConfig.find((c) => c.branch === stu.branch);
      if (!cfg) { setReceiptNo(""); return; }
      const next = Math.max(cfg.current + 1, cfg.start);
      setReceiptNo(next > cfg.end ? "" : `${cfg.prefix}-${String(next).padStart(6, "0")}`);
    } else {
      setReceiptNo(`CK-${String(100000 + receipts.length + 1).slice(1)}`);
    }
  }, [studentId, method, stu, cashConfig, receipts.length]);

  const oldDebt = stu?.debt ?? 0;
  const pricePerSession = cls?.pricePerSession ?? 0;
  const sessionsNum = Math.max(0, Number(sessions) || 0);
  const base = sessionsNum * pricePerSession;
  const promo = PROMOTIONS.find((p) => p.id === promoId) ?? PROMOTIONS[0];
  const discount = promo.type === "fixed" ? promo.value : Math.round((base * promo.value) / 100);
  const totalCollect = Math.max(0, base - discount);
  const newDebt = Math.max(0, oldDebt + base - discount - totalCollect);

  if (!stu || !cls) return null;
  const classDone = cls.totalSessions - cls.remainingSessions;
  const studentRemaining = stu.bought - stu.attended;
  // Số buổi cần đóng để khớp tiến độ lớp = số buổi còn lại của lớp - số buổi còn lại của HS
  const catchUpSessions = Math.max(0, cls.remainingSessions - studentRemaining);
  const catchUpAmount = catchUpSessions * pricePerSession;
  const cashCfg = cashConfig.find((c) => c.branch === stu.branch);
  const cashExhausted = method === "Tiền mặt" && (!cashCfg || Math.max(cashCfg.current + 1, cashCfg.start) > cashCfg.end);

  const submit = () => {
    if (!receiptNo.trim()) {
      toast.error("Không sinh được số phiếu thu", { description: "Kiểm tra cấu hình dải phiếu thu của chi nhánh." });
      return;
    }
    if (totalCollect <= 0) {
      toast.error("Vui lòng chọn số buổi đóng.");
      return;
    }
    const id = receiptNo.trim();
    const newReceipt: Receipt = {
      id, studentId: stu.id, studentName: stu.name, branch: stu.branch,
      amount: totalCollect, method, status: "Hiệu lực",
      createdBy: "Admin (demo)", createdAt: date, note,
    };
    setReceipts((prev) => [newReceipt, ...prev]);
    if (method === "Tiền mặt") {
      setCashConfig((prev) => prev.map((c) => c.branch === stu.branch
        ? { ...c, current: Math.max(c.current + 1, c.start) }
        : c));
    }
    setStudents((prev) => prev.map((s) => s.id === stu.id
      ? {
          ...s,
          bought: s.bought + sessionsNum,
          debt: newDebt,
          transferDebt: newDebt === 0 ? 0 : s.transferDebt,
          feeStatus: (s.feeStatus ?? (s.debt > 0 ? "debt" : "ok")) === "pending" ? "ok" : "pending",
          feeUpdatedAt: (() => {
            const d = new Date();
            return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
          })(),
        }
      : s));
    const prevStatus = stu.feeStatus ?? (stu.debt > 0 ? "debt" : "ok");
    const nextStatus = prevStatus === "pending" ? "Đã đóng đủ" : "Đã ghi nhận";
    toast.success(`Đã cập nhật học phí · ${nextStatus}`, {
      description: `${stu.name} · +${sessionsNum} buổi · Phiếu ${id}`,
    });
    onClose();
  };

  return (
    <Dialog open={!!studentId} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" /> Thu học phí: {stu.name}
          </DialogTitle>
          <DialogDescription>Lớp {cls.name} · {stu.branch}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-[1fr_22rem]">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Số buổi đóng" className="col-span-2">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  value={sessions}
                  onChange={(e) => setSessions(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-sm text-slate-500">
                  buổi · {formatVND(sessionsNum * pricePerSession)}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Gợi ý để khớp tiến độ lớp {cls.name}: <strong>{catchUpSessions} buổi</strong>
                {oldDebt > 0 && pricePerSession > 0 && (
                  <> · Theo công nợ: {Math.ceil(oldDebt / pricePerSession)} buổi</>
                )}
              </div>
            </Field>
            <Field label="Ưu đãi" className="col-span-2">
              <Select value={promoId} onValueChange={setPromoId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROMOTIONS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Phương thức">
              <Select value={method} onValueChange={(v) => setMethod(v as Receipt["method"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
                  <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Ngày thu"><Input value={date} onChange={(e) => setDate(e.target.value)} /></Field>
            <Field label="Số phiếu thu (auto)" className="col-span-2">
              <Input value={receiptNo} readOnly className="font-mono bg-slate-50" placeholder={cashExhausted ? "Đã hết dải phiếu — cấu hình lại" : ""} />
            </Field>
            <Field label="Ghi chú" className="col-span-2"><Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} /></Field>
          </div>
          <div className="rounded-lg border bg-slate-50 p-4 space-y-2 text-sm h-fit">
            <div className="font-semibold flex items-center gap-2"><Info className="h-4 w-4 text-indigo-600" /> Thông tin học phí</div>
            <Row label="Lớp đang học" value={cls.name} />
            <Row label="Tiến độ lớp" value={`${classDone}/${cls.totalSessions} buổi`} />
            <Row label="Số buổi còn lại của HS" value={`${studentRemaining} buổi`} highlight={studentRemaining <= 3} />
            <Row label="Công nợ học phí" value={`${catchUpSessions} buổi · ${formatVND(catchUpAmount)}`} highlight={catchUpSessions > 0} />
            <Row label="Thanh toán" value={formatVND(base)} />
            <Row label={`Ưu đãi (${promo.label})`} value={`- ${formatVND(discount)}`} />
            <div className="border-t pt-2 space-y-2">
              <Row label="Tổng thu" value={formatVND(totalCollect)} bold highlight />
              <Row label="Số buổi sau khi đóng" value={`${(stu.bought + sessionsNum) - stu.attended} buổi`} bold highlight />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={submit}>
            <CheckCircle2 className="h-4 w-4" />
            {(stu.feeStatus ?? (stu.debt > 0 ? "debt" : "ok")) === "pending"
              ? "XÁC NHẬN HOÀN THÀNH"
              : "GHI NHẬN THU HỌC PHÍ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={className}><Label className="text-xs text-slate-600 mb-1.5 block">{label}</Label>{children}</div>;
}
function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-600">{label}</span>
      <span className={`whitespace-nowrap ${bold ? "font-bold text-base" : "font-medium"} ${highlight ? "text-indigo-700" : ""}`}>{value}</span>
    </div>
  );
}

/* ============== RECEIPTS ============== */
export function AdminReceipts() {
  const { receipts, setReceipts } = useApp();
  const [cancelTarget, setCancelTarget] = React.useState<Receipt | null>(null);
  const [reason, setReason] = React.useState("");
  const [recOpen, setRecOpen] = React.useState(false);

  const doCancel = () => {
    if (!cancelTarget) return;
    setReceipts((prev) => prev.map((r) => r.id === cancelTarget.id ? {
      ...r, status: "Đã hủy",
      cancelLog: { by: "Admin (demo)", at: new Date().toLocaleString("vi-VN"), reason },
    } : r));
    toast.success(`Đã hủy phiếu ${cancelTarget.id}`, { description: `Lý do: ${reason}` });
    setCancelTarget(null); setReason("");
  };

  const valid = receipts.filter((r) => r.status === "Hiệu lực");
  const cancelled = receipts.filter((r) => r.status === "Đã hủy");
  const sumBy = (m: Receipt["method"]) => valid.filter((r) => r.method === m).reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => setRecOpen(true)}>📋 Đối soát phiếu thu</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Mã phiếu</TableHead><TableHead>Học viên</TableHead><TableHead>Chi nhánh</TableHead>
              <TableHead>Số tiền</TableHead><TableHead>Phương thức</TableHead><TableHead>Trạng thái</TableHead>
              <TableHead>Người tạo</TableHead><TableHead>Ngày</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {receipts.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell>{r.studentName}</TableCell>
                  <TableCell>{r.branch}</TableCell>
                  <TableCell>{formatVND(r.amount)}</TableCell>
                  <TableCell>{r.method}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === "Hiệu lực" ? "default" : "secondary"}>{r.status}</Badge>
                  </TableCell>
                  <TableCell>{r.createdBy}</TableCell>
                  <TableCell>{r.createdAt}</TableCell>
                  <TableCell>
                    {r.status === "Hiệu lực" && (
                      <Button variant="ghost" size="sm" onClick={() => setCancelTarget(r)}>Hủy phiếu</Button>
                    )}
                    {r.cancelLog && (
                      <span className="text-[11px] text-slate-500">{r.cancelLog.reason}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!cancelTarget} onOpenChange={(v) => !v && setCancelTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hủy phiếu {cancelTarget?.id}</DialogTitle>
            <DialogDescription>
              Phiếu sẽ không bị xóa. Hệ thống chỉ đổi trạng thái thành "Đã hủy" và ghi log gồm người hủy, thời gian, lý do, số tiền, mã phiếu.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Lý do hủy</Label>
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="VD: PH yêu cầu hủy" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelTarget(null)}>Đóng</Button>
            <Button variant="destructive" onClick={doCancel} disabled={!reason.trim()}>Xác nhận hủy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={recOpen} onOpenChange={setRecOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Đối soát phiếu thu</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Box label="Phiếu đã tạo" value={String(receipts.length)} />
            <Box label="Phiếu hiệu lực" value={String(valid.length)} />
            <Box label="Phiếu đã hủy" value={String(cancelled.length)} />
            <Box label="Tổng Tiền mặt" value={formatVND(sumBy("Tiền mặt"))} />
            <Box label="Tổng Chuyển khoản" value={formatVND(sumBy("Chuyển khoản"))} />
          </div>
          <div className="border border-amber-300 bg-amber-50 rounded p-3 text-xs text-amber-800 flex gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Cảnh báo: kiểm tra số phiếu giấy với mã phiếu trên hệ thống. Nếu lệch hoặc thiếu, đối chiếu ngay với thu ngân.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
function Box({ label, value }: { label: string; value: string }) {
  return <div className="rounded border bg-slate-50 p-3"><div className="text-xs text-slate-500">{label}</div><div className="font-semibold text-lg">{value}</div></div>;
}

/* ============== TRANSFER ============== */
export function TransferDialog({ studentId, onClose }: { studentId: string | null; onClose: () => void }) {
  const { students, classes, setStudents } = useApp();
  const stu = students.find((s) => s.id === studentId) ?? null;
  const oldClass = stu ? classes.find((c) => c.id === stu.classId) ?? null : null;
  const otherClasses = oldClass ? classes.filter((c) => c.id !== oldClass.id) : [];
  const [newClassId, setNewClassId] = React.useState<string>("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  React.useEffect(() => {
    if (otherClasses[0]) setNewClassId(otherClasses[0].id);
  }, [studentId]);

  if (!stu || !oldClass) return null;
  const newClass = classes.find((c) => c.id === newClassId) ?? otherClasses[0];
  if (!newClass) return null;

  const remaining = stu.bought - stu.attended;
  const newRemaining = newClass.remainingSessions ?? newClass.totalSessions;
  const need = newRemaining - remaining;
  const needMore = need > 0;
  const isEqual = need === 0;
  const amountDue = needMore ? need * newClass.pricePerSession : 0;
  const surplus = needMore ? 0 : -need;
  const sameBranch = oldClass.branch === newClass.branch;

  const apply = () => {
    const note = needMore
      ? `Chuyển ${oldClass.name} → ${newClass.name}: đóng thêm ${need} buổi (${formatVND(amountDue)})`
      : isEqual
        ? `Chuyển ${oldClass.name} → ${newClass.name}: vừa khít, không phát sinh`
        : `Chuyển ${oldClass.name} → ${newClass.name}: bảo lưu ${surplus} buổi`;
    setStudents((prev) => prev.map((s) => s.id === stu.id ? {
      ...s,
      classId: newClass.id,
      branch: newClass.branch,
      bought: needMore ? s.bought + need : s.bought,
      debt: s.debt + amountDue,
      transferNote: note,
    } : s));
    toast.success("Chuyển lớp thành công", {
      description: needMore
        ? `Đã ghi công nợ ${formatVND(amountDue)} vào hồ sơ học viên (xem ở Quản lý học viên).`
        : isEqual
          ? `Số buổi vừa khít, không phát sinh công nợ.`
          : `Học viên còn dư ${surplus} buổi (bảo lưu sang kỳ sau).`,
    });
    setConfirmOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={!!studentId && !confirmOpen} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Repeat className="h-5 w-5" /> Chuyển lớp: {stu.name}</DialogTitle>
            <DialogDescription>Chọn lớp mới (cùng hoặc khác chi nhánh). Hệ thống tự tính chênh lệch buổi và công nợ.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <Field label="Lớp cũ"><Input value={`${oldClass.name} (${oldClass.branch})`} readOnly /></Field>
              <Field label="Số buổi còn lại"><Input value={remaining.toString()} readOnly /></Field>
              <Field label="Lớp mới">
                <Select value={newClassId} onValueChange={setNewClassId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{otherClasses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} · {c.branch} {c.branch === oldClass.branch ? "(cùng CN)" : ""}
                    </SelectItem>
                  ))}</SelectContent>
                </Select>
              </Field>
              <Field label="Số buổi còn lại của lớp mới"><Input value={`${newRemaining} buổi`} readOnly /></Field>
              <div className={`text-xs px-3 py-2 rounded ${sameBranch ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                {sameBranch ? "Chuyển cùng chi nhánh" : "Chuyển khác chi nhánh"} · {oldClass.branch} <ArrowRight className="inline h-3 w-3" /> {newClass.branch}
              </div>
            </div>
            <div className="rounded-lg border bg-slate-50 p-4 space-y-2 text-sm">
              <div className="font-semibold flex items-center gap-2"><Info className="h-4 w-4 text-indigo-600" /> Kết quả tính toán</div>
              <Row label="Buổi còn lại lớp cũ" value={`${remaining} buổi`} />
              <Row label="Số buổi còn lại của lớp mới" value={`${newRemaining} buổi`} />
              <Row label="Chênh lệch" value={`${need} buổi`} highlight />
              {needMore ? (
                <>
                  <div className="border-t pt-2 text-rose-700 text-xs">Phụ huynh cần đóng thêm <strong>{need}</strong> buổi.</div>
                  <Row label="Công nợ phát sinh" value={formatVND(amountDue)} bold />
                  <div className="text-xs text-slate-500">→ Công nợ sẽ hiển thị trong Quản lý học viên.</div>
                </>
              ) : isEqual ? (
                <div className="border-t pt-2 text-indigo-700 text-xs">Số buổi <strong>vừa khít</strong> với lớp mới, không phát sinh công nợ.</div>
              ) : (
                <div className="border-t pt-2 text-emerald-700 text-xs">Còn dư <strong>{surplus}</strong> buổi → bảo lưu sang kỳ sau.</div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Hủy</Button>
            <Button onClick={() => setConfirmOpen(true)}><Repeat className="h-4 w-4" /> Thực hiện chuyển lớp</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận chuyển lớp</DialogTitle>
            <DialogDescription>{stu.name}: {oldClass.name} → {newClass.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <Row label="Buổi chênh lệch" value={`${need}`} highlight />
            {needMore
              ? <Row label="Công nợ phát sinh" value={formatVND(amountDue)} bold />
              : isEqual
                ? <Row label="Trạng thái" value="Vừa khít · không phát sinh" bold />
                : <Row label="Số dư bảo lưu" value={`${surplus} buổi`} bold />}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Hủy</Button>
            <Button onClick={apply}><CheckCircle2 className="h-4 w-4" /> Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ============== SYLLABUS ============== */
export function AdminSyllabus() {
  const [q, setQ] = React.useState("");
  const [selId, setSelId] = React.useState<string | null>(null);
  const [extraSyllabi, setExtraSyllabi] = React.useState<Syllabus[]>([]);
  const allSyllabi = React.useMemo(() => [...extraSyllabi, ...SYLLABI], [extraSyllabi]);
  const sel = allSyllabi.find((s) => s.id === selId) ?? null;
  const list = allSyllabi.filter((s) =>
    `${s.code} ${s.name} ${s.level} ${s.ageGroup}`.toLowerCase().includes(q.toLowerCase()),
  );

  const [openAdd, setOpenAdd] = React.useState(false);
  const emptyForm = () => ({
    name: "", code: "", level: "", ageGroup: "",
    stages: 5,
    stageConfig: Array.from({ length: 5 }, () => ({ lessons: 4, bigTest: true })),
  });
  const [form, setForm] = React.useState(emptyForm());

  const setStageCount = (n: number) => {
    const count = Math.max(1, Math.min(20, Number(n) || 1));
    setForm((prev) => {
      const cfg = [...prev.stageConfig];
      if (count > cfg.length) {
        while (cfg.length < count) cfg.push({ lessons: 4, bigTest: true });
      } else {
        cfg.length = count;
      }
      return { ...prev, stages: count, stageConfig: cfg };
    });
  };
  const updateStage = (i: number, patch: Partial<{ lessons: number; bigTest: boolean }>) => {
    setForm((prev) => {
      const cfg = prev.stageConfig.map((s, idx) => idx === i ? { ...s, ...patch } : s);
      return { ...prev, stageConfig: cfg };
    });
  };

  const submitSyllabus = () => {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên syllabus.");
      return;
    }
    const stages = Math.max(1, Number(form.stages) || 1);
    const cfg = form.stageConfig.slice(0, stages);
    const totalLessons = cfg.reduce((sum, s) => sum + Math.max(1, Number(s.lessons) || 1), 0);
    const bigTests = cfg.filter((s) => s.bigTest).length;
    const id = `sy${Date.now()}`;
    const today = new Date();
    const created = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
    const autoCode = form.name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 6) || "SY";
    const newItem: Syllabus = {
      id, code: autoCode, name: form.name.trim(),
      level: form.level || "Cấp 1", ageGroup: form.ageGroup.trim() || "—",
      totalLessons,
      stages, bigTests,
      status: "Bản nháp", createdAt: created, createdBy: "Admin",
      description: "Syllabus mới — bấm để cấu hình chi tiết từng chặng.",
    };
    setExtraSyllabi((prev) => [newItem, ...prev]);
    toast.success(`Đã tạo syllabus ${newItem.code}. Bấm vào để cấu hình chi tiết.`);
    setOpenAdd(false);
    setForm(emptyForm());
    setSelId(id);
  };

  if (sel) {
    return <SyllabusDetail syllabus={sel} onBack={() => setSelId(null)} />;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Danh mục syllabus</CardTitle>
            <Button size="sm" onClick={() => { setForm(emptyForm()); setOpenAdd(true); }}>
              <Plus className="h-4 w-4" /> Tạo syllabus
            </Button>
          </div>
          <Input
            placeholder="Tìm theo mã, tên, cấp độ..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="mt-2"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Tên syllabus</TableHead>
                <TableHead>Khóa / Level</TableHead>
                <TableHead className="text-center">Chặng</TableHead>
                <TableHead className="text-center">Buổi</TableHead>
                <TableHead className="text-center">Big Test</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Người tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((s) => (
                <TableRow key={s.id} className="cursor-pointer" onClick={() => setSelId(s.id)}>
                  <TableCell className="font-mono text-xs">{s.code}</TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell><Badge variant="secondary">{s.level}</Badge></TableCell>
                  <TableCell className="text-center">{s.stages ?? 5}</TableCell>
                  <TableCell className="text-center">{s.totalLessons}</TableCell>
                  <TableCell className="text-center">{s.bigTests ?? 5}</TableCell>
                  <TableCell>
                    <Badge variant={s.status === "Bản nháp" ? "outline" : s.status === "Lưu trữ" ? "secondary" : "default"}>
                      {s.status ?? "Đang dùng"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">{s.createdAt ?? "—"}</TableCell>
                  <TableCell className="text-xs text-slate-600">{s.createdBy ?? "—"}</TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" title="Xem" onClick={() => setSelId(s.id)}><BookOpen className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" title="Sửa"><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" title="Nhân bản"><Copy className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" title="Xóa" className="text-rose-600"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {list.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-slate-500 py-6">
                    Không tìm thấy syllabus phù hợp.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Tạo syllabus mới</DialogTitle>
            <DialogDescription>Nhập thông tin chung và cấu hình số chặng. Sau khi tạo, bấm vào syllabus để cấu hình chi tiết từng chặng.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="text-sm font-semibold text-slate-700">Thông tin chung</div>
              <div>
                <Label className="text-xs text-slate-500">Tên syllabus</Label>
                <Input className="h-9 mt-1" placeholder="VD: Family & Friends 5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Cấp độ</Label>
                <Select value={form.level || "Cấp 1"} onValueChange={(v) => setForm({ ...form, level: v })}>
                  <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Chọn cấp độ" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cấp 1">Cấp 1</SelectItem>
                    <SelectItem value="Cấp 2">Cấp 2</SelectItem>
                    <SelectItem value="Chất lượng cao">Chất lượng cao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Đối tượng học</Label>
                <Input className="h-9 mt-1" placeholder="VD: Lớp 5 - 6" value={form.ageGroup} onChange={(e) => setForm({ ...form, ageGroup: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Số chặng</Label>
                <Input className="h-9 mt-1" type="number" min={1} max={20} value={form.stages} onChange={(e) => setStageCount(Number(e.target.value))} />
              </div>
              <div className="text-xs text-slate-500 pt-1">
                Tổng: <b>{form.stageConfig.reduce((s, x) => s + (Number(x.lessons) || 0), 0)}</b> buổi ·{" "}
                <b>{form.stageConfig.filter((x) => x.bigTest).length}</b> Big Test
              </div>
            </div>
            <div className="flex flex-col min-h-0">
              <div className="text-sm font-semibold text-slate-700 mb-2">Cấu hình chi tiết từng chặng</div>
              <div className="rounded-md border bg-slate-50 p-3 max-h-[60vh] overflow-y-auto flex-1">
                <div className="space-y-2">
                  {form.stageConfig.map((st, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-md border bg-white px-3 py-2">
                      <div className="font-semibold text-sm text-slate-700 w-20">Chặng {i + 1}</div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-slate-500">Số buổi</Label>
                        <Input
                          className="h-8 w-20"
                          type="number"
                          min={1}
                          max={50}
                          value={st.lessons}
                          onChange={(e) => updateStage(i, { lessons: Number(e.target.value) })}
                        />
                      </div>
                      <label className="flex items-center gap-2 text-xs text-slate-600 ml-auto cursor-pointer">
                        <input
                          type="checkbox"
                          checked={st.bigTest}
                          onChange={(e) => updateStage(i, { bigTest: e.target.checked })}
                        />
                        Có Big Test
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* legacy block removed */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAdd(false)}>Hủy</Button>
            <Button onClick={submitSyllabus}>Tạo & cấu hình chi tiết</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ----- Syllabus detail ----- */
function SyllabusDetail({ syllabus, onBack }: { syllabus: Syllabus; onBack?: () => void }) {
  const stages = SYLLABUS_STAGES;
  const [sel, setSel] = React.useState<SyllabusSel>({ kind: "lesson", stageId: stages[0].id, lessonId: stages[0].lessons[0].id });

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-30 -mx-4 px-4 pt-1 pb-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="h-4 w-4" /></Button>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-mono">{syllabus.code}</span>
                  <span>•</span>
                  <span className="truncate">{syllabus.ageGroup}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-base font-bold truncate">{syllabus.name}</div>
                  <Badge variant="secondary" className="text-[10px]">{syllabus.level}</Badge>
                  <Badge variant={syllabus.status === "Bản nháp" ? "outline" : "default"} className="text-[10px]">{syllabus.status ?? "Đang dùng"}</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-1.5">
              <Button size="sm" onClick={() => toast.success("Đã lưu syllabus")}>Lưu</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      <div className="space-y-3">
        <SyllabusContentTree stages={stages} sel={sel} setSel={setSel} />
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode; color: string }) {
  return (
    <div className="rounded-lg border bg-card p-3 flex items-center gap-3">
      <div className={`h-10 w-10 rounded-md ${color} text-white grid place-content-center`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-lg font-bold">{value}</div>
      </div>
    </div>
  );
}

function SyllabusContentTree({ stages, sel, setSel }: { stages: typeof SYLLABUS_STAGES; sel: SyllabusSel; setSel: React.Dispatch<React.SetStateAction<SyllabusSel>> }) {
  const [stagesState, setStagesState] = React.useState(stages);
  const [openStages, setOpenStages] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(stagesState.map((s, i) => [s.id, i === 0])),
  );

  const stage = stagesState.find((s) => s.id === sel.stageId)!;
  const lesson = sel.kind === "lesson" ? stage.lessons.find((l) => l.id === sel.lessonId)! : null;
  const bigTest = sel.kind === "bigtest" ? stage.bigTest : null;

  // Continuous numbering across stages: each lesson + each big test occupies one "buổi" slot.
  const lessonNo = new Map<string, number>();
  const bigTestNo = new Map<string, number>();
  {
    let n = 0;
    for (const st of stagesState) {
      for (const l of st.lessons) { n += 1; lessonNo.set(l.id, n); }
      n += 1; bigTestNo.set(st.id, n);
    }
  }
  const lessonGlobal = lesson ? lessonNo.get(lesson.id) : undefined;
  const bigTestGlobal = sel.kind === "bigtest" ? bigTestNo.get(sel.stageId) : undefined;

  const toggle = (id: string) => setOpenStages((o) => ({ ...o, [id]: !o[id] }));

  const insertLessonAt = (stageId: string, pos: number) => {
    const newId = `${stageId}-l-${Date.now()}`;
    setStagesState((sts) =>
      sts.map((st) => {
        if (st.id !== stageId) return st;
        const newLesson = {
          id: newId,
          index: pos + 1,
          unit: "",
          objective: "",
          content: "",
          homeworks: [],
          material: "",
          note: "",
        };
        const lessons = [...st.lessons];
        lessons.splice(pos, 0, newLesson);
        return { ...st, lessons: lessons.map((l, i) => ({ ...l, index: i + 1 })) };
      }),
    );
    setOpenStages((o) => ({ ...o, [stageId]: true }));
    setSel({ kind: "lesson", stageId, lessonId: newId });
  };

  const updateLesson = (stageId: string, lessonId: string, patch: Partial<typeof stagesState[number]["lessons"][number]>) => {
    setStagesState((sts) =>
      sts.map((st) =>
        st.id !== stageId ? st : { ...st, lessons: st.lessons.map((l) => (l.id === lessonId ? { ...l, ...patch } : l)) },
      ),
    );
  };
  const updateBigTest = (stageId: string, patch: Partial<typeof stagesState[number]["bigTest"]>) => {
    setStagesState((sts) =>
      sts.map((st) => (st.id !== stageId ? st : { ...st, bigTest: { ...st.bigTest, ...patch } })),
    );
  };

  const addStage = () => {
    const newId = `st-${Date.now()}`;
    const bigTestNum = stagesState.length + 1;
    const newStage = {
      id: newId,
      name: `Chặng ${stagesState.length + 1}: Chặng mới`,
      goal: "",
      lessons: [],
      bigTest: {
        id: `${newId}-bt`,
        name: `Big Test ${bigTestNum}`,
        note: "",
        material: "",
      },
    } as typeof stagesState[number];
    setStagesState((sts) => [...sts, newStage]);
    setOpenStages((o) => ({ ...o, [newId]: true }));
    // Add an empty first lesson and select it for editing
    setTimeout(() => insertLessonAt(newId, 0), 0);
  };

  const InsertSlot = ({ stageId, pos }: { stageId: string; pos: number }) => (
    <button
      onClick={(e) => { e.stopPropagation(); insertLessonAt(stageId, pos); }}
      className="group w-full h-1.5 my-0.5 relative flex items-center justify-center"
      title="Chèn buổi tại đây"
    >
      <span className="absolute inset-x-2 h-px bg-transparent group-hover:bg-indigo-300 transition-colors" />
      <span className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center h-4 w-4 rounded-full bg-indigo-600 text-white text-[10px] leading-none">+</span>
    </button>
  );

  return (
    <div className="grid grid-cols-12 gap-4 items-start">
      {/* Tree */}
      <Card className="col-span-12 md:col-span-4 lg:col-span-3 md:sticky md:top-4 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto">
        <CardHeader className="pb-3 sticky top-0 bg-card z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><Layers className="h-4 w-4" /> Cây nội dung</CardTitle>
            <Button size="icon" variant="ghost" title="Thêm chặng" onClick={addStage}><Plus className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1 text-sm">
            {stagesState.map((st) => {
              const open = !!openStages[st.id];
              return (
                <div key={st.id}>
                  <button
                    onClick={() => toggle(st.id)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent text-left"
                  >
                    <ChevronRight className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-90" : ""}`} />
                    <Layers className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                    <span className="font-medium truncate">{st.name}</span>
                  </button>
                  {open && (
                    <div className="ml-5 border-l pl-2 mt-0.5 space-y-0.5">
                      <InsertSlot stageId={st.id} pos={0} />
                      {st.lessons.map((l, idx) => {
                        const active = sel.kind === "lesson" && sel.lessonId === l.id;
                        return (
                          <React.Fragment key={l.id}>
                            <button
                              onClick={() => setSel({ kind: "lesson", stageId: st.id, lessonId: l.id })}
                              className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left ${active ? "bg-indigo-100 text-indigo-700 font-medium" : "hover:bg-accent"}`}
                            >
                              <BookOpen className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate text-xs">Buổi {lessonNo.get(l.id)}: {l.unit}</span>
                            </button>
                            <InsertSlot stageId={st.id} pos={idx + 1} />
                          </React.Fragment>
                        );
                      })}
                      {(() => {
                        const active = sel.kind === "bigtest" && sel.stageId === st.id;
                        return (
                          <button
                            onClick={() => setSel({ kind: "bigtest", stageId: st.id })}
                            className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left ${active ? "bg-amber-100 text-amber-700 font-medium" : "hover:bg-accent"}`}
                          >
                            <ClipboardCheck className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                            <span className="truncate text-xs">Buổi {bigTestNo.get(st.id)}: {st.bigTest.name}</span>
                          </button>
                        );
                      })()}
                      <InsertSlot stageId={st.id} pos={st.lessons.length} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detail */}
      <Card className="col-span-12 md:col-span-8 lg:col-span-9">
        <CardContent className="p-5 space-y-4">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Layers className="h-3 w-3" /> {stage.name}
          </div>

          {lesson && (
            <>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <BookOpen className="h-3 w-3 text-emerald-600" /> Buổi {lessonGlobal}
                  </div>
                  <Input
                    value={lesson.unit}
                    onChange={(e) => updateLesson(stage.id, lesson.id, { unit: e.target.value })}
                    placeholder="Tên buổi..."
                    className="text-xl font-bold h-auto py-1 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-indigo-500"
                  />
                </div>
              </div>

              <Tabs defaultValue="in-class" className="w-full">
                <TabsList>
                  <TabsTrigger value="in-class">IN CLASS</TabsTrigger>
                  <TabsTrigger value="after-class">AFTER CLASS</TabsTrigger>
                  <TabsTrigger value="teaching-material">TEACHING MATERIAL</TabsTrigger>
                </TabsList>
                <TabsContent value="in-class" className="space-y-4">
                  <EditField icon={FileText} label="In class" value={lesson.content} onChange={(v) => updateLesson(stage.id, lesson.id, { content: v })} multiline />
                </TabsContent>
                <TabsContent value="after-class" className="space-y-4">
                  <HomeworkListEditor
                    items={lesson.homeworks}
                    onChange={(homeworks) => updateLesson(stage.id, lesson.id, { homeworks })}
                  />
                </TabsContent>
                <TabsContent value="teaching-material" className="space-y-4">
                  <MaterialLinks
                    value={lesson.material}
                    onChange={(v) => updateLesson(stage.id, lesson.id, { material: v })}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}

          {bigTest && (
            <>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ClipboardCheck className="h-3 w-3 text-amber-600" /> Buổi {bigTestGlobal} · Big Test
                  </div>
                  <Input
                    value={bigTest.name}
                    onChange={(e) => updateBigTest(stage.id, { name: e.target.value })}
                    placeholder="Tên big test..."
                    className="text-xl font-bold h-auto py-1 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-amber-500"
                  />
                </div>
              </div>

              <EditField icon={Info} label="Lưu ý" value={bigTest.note} onChange={(v) => updateBigTest(stage.id, { note: v })} />
              <EditField icon={ExternalLink} label="Tài liệu (Google Drive)" value={bigTest.material} onChange={(v) => updateBigTest(stage.id, { material: v })} placeholder="https://..." />
              <DetailField icon={Target} label="Mục tiêu chặng" value={stage.goal} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DetailField({ icon: Icon, label, value, link }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; link?: boolean }) {
  return (
    <div className="rounded-md border bg-slate-50/50 p-3">
      <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
        <Icon className="h-3 w-3" /> {label}
      </div>
      {link ? (
        <a href={value} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:underline break-all">{value}</a>
      ) : (
        <div className="text-sm text-slate-700 whitespace-pre-wrap">{value}</div>
      )}
    </div>
  );
}

function HomeworkListEditor({
  items,
  onChange,
}: {
  items: SyllabusHomeworkItem[];
  onChange: (items: SyllabusHomeworkItem[]) => void;
}) {
  const homeworkTypeTone: Record<HomeworkTaskType, string> = {
    "Phiếu bài tập": "bg-blue-50 text-blue-700 border-blue-200",
    "Quay video": "bg-violet-50 text-violet-700 border-violet-200",
    None: "bg-slate-50 text-slate-600 border-slate-200",
  };

  const updateAt = (id: string, patch: Partial<SyllabusHomeworkItem>) =>
    onChange(items.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  const removeAt = (id: string) => onChange(items.filter((h) => h.id !== id));
  const addOne = () =>
    onChange([...items, { id: `hw-${Date.now()}`, content: "", type: "Phiếu bài tập" }]);

  return (
    <div className="rounded-md border bg-slate-50/50 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <ListChecks className="h-3 w-3" /> Homeworks
        </div>
        <Button size="sm" variant="outline" className="h-7 gap-1" onClick={addOne}>
          <Plus className="h-3.5 w-3.5" /> Thêm bài
        </Button>
      </div>
      {items.length === 0 ? (
        <div className="text-xs text-slate-400 italic py-2">Chưa có bài tập. Bấm &quot;Thêm bài&quot; để tạo HM1, HM2...</div>
      ) : (
        items.map((hw, idx) => (
          <div key={hw.id} className="rounded-md border bg-background p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-indigo-700">HM{idx + 1}</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                onClick={() => removeAt(hw.id)}
                title="Xoá bài tập"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-[1fr_180px]">
              <div>
                <Label className="text-[11px] text-muted-foreground">Nội dung</Label>
                <Textarea
                  value={hw.content}
                  onChange={(e) => updateAt(hw.id, { content: e.target.value })}
                  placeholder="Mô tả bài tập về nhà..."
                  rows={2}
                  className="mt-1 min-h-[60px] resize-y bg-white text-sm"
                />
              </div>
              <div>
                <Label className="text-[11px] text-muted-foreground">Loại bài tập</Label>
                <Select value={hw.type} onValueChange={(v) => updateAt(hw.id, { type: v as HomeworkTaskType })}>
                  <SelectTrigger className="h-9 mt-1 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {HOMEWORK_TASK_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge variant="outline" className={cn("mt-2 text-[10px]", homeworkTypeTone[hw.type])}>
                  {hw.type}
                </Badge>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function MaterialLinks({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const links = value === "" ? [] : value.split("\n");
  const setLinks = (next: string[]) => onChange(next.join("\n"));
  const updateAt = (i: number, v: string) => setLinks(links.map((l, idx) => (idx === i ? v : l)));
  const removeAt = (i: number) => setLinks(links.filter((_, idx) => idx !== i));
  const addOne = () => setLinks([...links, ""]);

  return (
    <div className="rounded-md border bg-slate-50/50 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <ExternalLink className="h-3 w-3" /> PPTX bài giảng và tài liệu đính kèm
        </div>
        <Button size="sm" variant="outline" className="h-7 gap-1" onClick={addOne}>
          <Plus className="h-3.5 w-3.5" /> Thêm link
        </Button>
      </div>
      {links.length === 0 ? (
        <div className="text-xs text-slate-400 italic py-2">Chưa có tài liệu nào. Bấm &quot;Thêm link&quot; để thêm.</div>
      ) : (
        <div className="space-y-2">
          {links.map((link, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={link}
                onChange={(e) => updateAt(i, e.target.value)}
                placeholder="https://..."
                className="h-8 text-sm"
              />
              {link && (
                <a href={link} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-indigo-600 shrink-0" title="Mở link">
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 shrink-0" onClick={() => removeAt(i)} title="Xoá">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EditField({ icon: Icon, label, value, onChange, multiline, placeholder }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string }) {
  return (
    <div className="rounded-md border bg-slate-50/50 p-3">
      <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
        <Icon className="h-3 w-3" /> {label}
      </div>
      {multiline ? (
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder ?? "Nhập nội dung..."} className="min-h-[80px] bg-white" />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder ?? "Nhập nội dung..."} className="bg-white" />
      )}
    </div>
  );
}

function ColoredPillSelect<T extends string>({
  value,
  options,
  onChange,
  compact,
}: {
  value: T;
  options: ReportSelectOption<T>[];
  onChange: (v: T) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);
  const toneClass = selected ? REPORT_TAG_TONE_CLASS[selected.tone] : REPORT_TAG_TONE_CLASS.muted;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1 rounded-md border font-medium justify-between shadow-sm hover:opacity-90 transition-opacity",
            compact ? "px-2 py-0.5 text-[11px] min-w-[72px]" : "px-2.5 py-1 text-xs min-w-[130px]",
            toneClass,
          )}
        >
          <span className="truncate">{value}</span>
          <ChevronDown className="h-3 w-3 shrink-0 opacity-70" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-1.5" align="start">
        <div className="max-h-72 overflow-y-auto space-y-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={cn(
                "w-full text-left rounded-md px-2.5 py-1.5 text-xs font-medium border",
                REPORT_TAG_TONE_CLASS[opt.tone],
                value === opt.value && "ring-2 ring-ring ring-offset-1",
              )}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.value}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLTextAreaElement>(null);

  const resize = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  React.useLayoutEffect(() => {
    resize();
  }, [value, resize]);

  return (
    <Textarea
      ref={ref}
      value={value}
      onChange={(e) => {
        onChange(e);
        resize();
      }}
      placeholder={placeholder}
      rows={1}
      className={cn(
        "min-h-9 max-h-40 resize-none overflow-hidden py-1.5 leading-normal",
        className,
      )}
    />
  );
}

function SyllabusReportsTab({
  sel,
  sessionDate,
  sessionIdx,
  students,
}: {
  sel: SyllabusSel;
  sessionDate?: string;
  sessionIdx?: number;
  students?: Student[];
}) {
  const { homeworkSubmissions, homeworkCorrections, setHomeworkCorrection } = useApp();
  const stages = SYLLABUS_STAGES;
  const stage = stages.find((s) => s.id === sel.stageId)!;
  const lesson = sel.kind === "lesson" ? stage.lessons.find((l) => l.id === sel.lessonId) ?? null : null;
  const [q, setQ] = React.useState("");
  const [btvnColumns, setBtvnColumns] = React.useState<BtvnColumn[]>(() => DEFAULT_BTVN_COLUMNS.map((c) => ({ ...c })));
  const [scoreColumns, setScoreColumns] = React.useState<BtvnColumn[]>(() => DEFAULT_SCORE_COLUMNS.map((c) => ({ ...c })));
  const activeSessionIdx = sessionIdx ?? 1;
  const [rows, setRows] = React.useState<SyllabusReportRow[]>(() =>
    SYLLABUS_REPORT_ROWS.map((r) => ({ ...r, btvnHw: { ...r.btvnHw }, scores: { ...r.scores } })),
  );

  React.useEffect(() => {
    if (!students?.length) return;
    setRows(
      students.map((stu) => ({
        id: stu.id,
        code: stu.id.toUpperCase(),
        name: stu.nickname ? `${stu.name} (${stu.nickname})` : stu.name,
        ...mockSessionReport(stu, activeSessionIdx),
      })),
    );
  }, [students, activeSessionIdx]);

  const filtered = rows.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));

  const update = (id: string, patch: Partial<SyllabusReportRow>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const updateBtvnHw = (id: string, colId: string, val: BtvnStatus) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, btvnHw: { ...r.btvnHw, [colId]: val } } : r)));

  const updateScore = (id: string, colId: string, val: string) => {
    const n = val === "" ? "" : Number(val);
    setRows((rs) =>
      rs.map((r) =>
        r.id === id ? { ...r, scores: { ...r.scores, [colId]: n === "" || Number.isFinite(n) ? n : r.scores[colId] } } : r,
      ),
    );
  };

  const updateBtvnColumnLabel = (colId: string, label: string) =>
    setBtvnColumns((cols) => cols.map((c) => (c.id === colId ? { ...c, label } : c)));

  const updateScoreColumnLabel = (colId: string, label: string) =>
    setScoreColumns((cols) => cols.map((c) => (c.id === colId ? { ...c, label } : c)));

  const addBtvnColumn = () => {
    const newId = `btvn-${Date.now()}`;
    setBtvnColumns((cols) => [...cols, { id: newId, label: "" }]);
    setRows((rs) => rs.map((r) => ({ ...r, btvnHw: { ...r.btvnHw, [newId]: "Yes" } })));
  };

  const removeBtvnColumn = (colId: string) => {
    if (btvnColumns.length <= 1) return;
    setBtvnColumns((cols) => cols.filter((c) => c.id !== colId));
    setRows((rs) =>
      rs.map((r) => {
        const { [colId]: _, ...rest } = r.btvnHw;
        return { ...r, btvnHw: rest };
      }),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileSpreadsheet className="h-5 w-5" /> Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border bg-slate-50/60 px-3 py-2 flex items-center justify-between gap-3 flex-wrap text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            {sessionDate && (
              <>
                <Calendar className="h-4 w-4 text-indigo-600 shrink-0" />
                <span className="font-medium">{sessionDate}</span>
                {sessionIdx != null && (
                  <>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600">Buổi {sessionIdx}</span>
                  </>
                )}
                <span className="text-slate-400">·</span>
              </>
            )}
            <Layers className="h-4 w-4 text-indigo-600" />
            <span className="text-slate-500">{stage.name}</span>
            <span className="text-slate-400">·</span>
            {lesson ? (
              <>
                <BookOpen className="h-4 w-4 text-emerald-600" />
                <span className="font-medium">Buổi {lesson.index}: {lesson.unit}</span>
              </>
            ) : (
              <>
                <ClipboardCheck className="h-4 w-4 text-amber-600" />
                <span className="font-medium">{stage.bigTest.name}</span>
              </>
            )}
          </div>
          <Input className="h-8 w-56" placeholder="Tìm học viên..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button size="sm" onClick={() => toast.success("Đã lưu báo cáo buổi học")}>
            <CheckCircle2 className="h-4 w-4" /> Lưu báo cáo
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.info("Đã xuất bảng báo cáo")}>
            <FileSpreadsheet className="h-4 w-4" /> Xuất bảng
          </Button>
          <span className="text-xs text-muted-foreground self-center ml-1">
            <ExternalLink className="inline h-3 w-3 text-indigo-600" /> bài nộp HS ·{" "}
            <Upload className="inline h-3 w-3 text-emerald-600" /> up link chữa bài
          </span>
        </div>

        <div className="border rounded-md overflow-x-auto">
          <Table className="border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead rowSpan={2} className={cn(reportTh, reportCell, "w-12 text-center")}>STT</TableHead>
                <TableHead rowSpan={2} className={cn(reportTh, reportCell, "min-w-[160px]")}>Học viên</TableHead>
                <TableHead rowSpan={2} className={cn(reportTh, reportCell, "w-36 text-center")}>Điểm danh</TableHead>
                <TableHead colSpan={btvnColumns.length} className={cn(reportTh, reportCell, "text-center")}>
                  <div className="flex items-center justify-center gap-1.5">
                    <span>BTVN</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      title="Thêm cột BTVN"
                      onClick={addBtvnColumn}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableHead>
                {scoreColumns.map((col) => (
                  <TableHead key={col.id} rowSpan={2} className={cn(reportTh, reportCell, "min-w-[196px] p-1.5 text-center")}>
                    <Input
                      value={col.label}
                      onChange={(e) => updateScoreColumnLabel(col.id, e.target.value)}
                      placeholder="Tên cột điểm..."
                      className="h-8 text-xs text-center"
                    />
                  </TableHead>
                ))}
                <TableHead rowSpan={2} className={cn(reportTh, reportCell, "min-w-[180px] text-center")}>Tinh thần học tập</TableHead>
              </TableRow>
              <TableRow>
                {btvnColumns.map((col) => (
                  <TableHead key={col.id} className={cn(reportTh, reportCell, "min-w-[120px] p-1.5")}>
                    <div className="flex items-center gap-1">
                      <Input
                        value={col.label}
                        onChange={(e) => updateBtvnColumnLabel(col.id, e.target.value)}
                        placeholder="Tên BTVN..."
                        className="h-8 text-xs"
                      />
                      {btvnColumns.length > 1 && (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                          title="Xóa cột"
                          onClick={() => removeBtvnColumn(col.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r, idx) => {
                const dataColSpan = 3 + btvnColumns.length + scoreColumns.length + 1;
                return (
                  <React.Fragment key={r.id}>
                    <TableRow>
                      <TableCell className={cn(reportCell, "text-center text-muted-foreground align-top pt-3")}>{idx + 1}</TableCell>
                      <TableCell className={cn(reportCell, "font-medium align-top pt-3")}>{r.name}</TableCell>
                      <TableCell className={cn(reportCell, "text-center align-top pt-2")}>
                        <ColoredPillSelect
                          value={r.attendance}
                          options={REPORT_ATTENDANCE_OPTIONS}
                          onChange={(v) => update(r.id, { attendance: v as ReportAttendance })}
                          compact
                        />
                      </TableCell>
                      {btvnColumns.map((col) => (
                        <TableCell key={col.id} className={cn(reportCell, "text-center align-top pt-2")}>
                          <ColoredPillSelect
                            value={r.btvnHw[col.id] ?? "Yes"}
                            options={BTVN_STATUS_OPTIONS}
                            onChange={(v) => updateBtvnHw(r.id, col.id, v as BtvnStatus)}
                            compact
                          />
                        </TableCell>
                      ))}
                      {scoreColumns.map((col) => (
                        <TableCell key={col.id} className={cn(reportCell, "text-center p-1 align-top pt-2")}>
                          <div className="flex items-center justify-center gap-1">
                            <Input
                              type="number"
                              min={0}
                              value={r.scores[col.id] ?? ""}
                              onChange={(e) => updateScore(r.id, col.id, e.target.value)}
                              className="h-8 w-16 text-center"
                              placeholder="—"
                            />
                            <SubmissionLinkButton
                              url={homeworkSubmissions[homeworkSubmissionKey(r.id, activeSessionIdx, col.id)]}
                            />
                            <CorrectionLinkControl
                              url={homeworkCorrections[homeworkCorrectionKey(r.id, activeSessionIdx, col.id)]}
                              onSave={(url) => setHomeworkCorrection(r.id, activeSessionIdx, col.id, url)}
                            />
                          </div>
                        </TableCell>
                      ))}
                      <TableCell className={cn(reportCell, "text-center align-top pt-2")}>
                        <ColoredPillSelect
                          value={r.learningSpirit}
                          options={LEARNING_SPIRIT_OPTIONS}
                          onChange={(v) => update(r.id, { learningSpirit: v as LearningSpirit })}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent border-b-2 border-border">
                      <TableCell colSpan={dataColSpan} className="p-2 pb-3 bg-muted/20">
                        <AutoResizeTextarea
                          value={r.teacherComment}
                          onChange={(e) => update(r.id, { teacherComment: e.target.value })}
                          placeholder="Nhận xét của giáo viên..."
                          className="text-sm bg-background"
                        />
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function SyllabusReportTab() {
  return <SyllabusReportTabImpl />;
}

function SyllabusReportTabImpl() {
  const total = SYLLABUS_STUDENTS.length;
  const attendRate = Math.round((SYLLABUS_STUDENTS.filter((s) => s.attendance === "Có mặt").length / total) * 100);
  const highAbsent = SYLLABUS_STUDENTS.filter((s) => s.attendance === "Vắng không phép").length;
  const avg = (
    SYLLABUS_STUDENTS.reduce((s, r) => s + Object.values(r.grades).reduce((a, b) => a + b, 0) / Object.values(r.grades).length, 0) / total
  ).toFixed(1);

  const cards = [
    { label: "Tổng số học viên", value: total, icon: Users, color: "bg-indigo-500" },
    { label: "Tỷ lệ đi học", value: `${attendRate}%`, icon: CheckCircle2, color: "bg-emerald-500" },
    { label: "HV vắng nhiều", value: highAbsent, icon: AlertTriangle, color: "bg-rose-500" },
    { label: "Điểm trung bình lớp", value: avg, icon: BarChart3, color: "bg-amber-500" },
    { label: "Số buổi đã học", value: 12, icon: BookOpen, color: "bg-blue-500" },
    { label: "Số buổi còn lại", value: 8, icon: Calendar, color: "bg-slate-500" },
  ];

  const perLesson = [85, 90, 78, 92, 88, 75, 80, 95, 82, 90, 86, 88];
  const perColumn = SYLLABUS_GRADE_COLUMNS.map((c) => ({
    col: c,
    avg: (SYLLABUS_STUDENTS.reduce((s, r) => s + (r.grades[c] ?? 0), 0) / total),
  }));

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-xs text-slate-500 italic">
            Báo cáo học vụ đang ở phiên bản demo. Dữ liệu chi tiết sẽ được phát triển ở giai đoạn sau.
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-md ${c.color} text-white grid place-content-center`}>
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500">{c.label}</div>
                <div className="text-lg font-bold">{c.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Tỷ lệ điểm danh theo buổi</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {perLesson.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t bg-indigo-500" style={{ height: `${v}%` }} />
                  <div className="text-[10px] text-slate-500">B{i + 1}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Điểm trung bình theo cột điểm</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {perColumn.map((c) => (
              <div key={c.col}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{c.col}</span>
                  <span className="font-semibold">{c.avg.toFixed(1)} / 10</span>
                </div>
                <div className="h-2 bg-slate-100 rounded overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${c.avg * 10}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-rose-500" /> Học viên cần lưu ý</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã HV</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Lý do</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SYLLABUS_STUDENTS.filter((s) => s.attendance === "Vắng không phép" || (s.grades["Quiz 1"] ?? 10) < 6).map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.code}</TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-xs text-slate-600">{s.gradeNote || s.attendanceNote || "Cần theo dõi"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ============== TEACHERS ============== */
export function AdminTeachers() {
  const { classes } = useApp();
  const [selId, setSelId] = React.useState<string | null>(null);
  const [extraTeachers, setExtraTeachers] = React.useState<typeof TEACHERS>([]);
  const allTeachers = React.useMemo(() => [...TEACHERS, ...extraTeachers], [extraTeachers]);
  const sel = allTeachers.find((t) => t.id === selId) ?? null;
  const teacherClasses = sel ? classes.filter((c) => sel.classes.includes(c.id)) : [];

  const fmtDate = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  type TeacherStatus = "Đang dạy" | "Nghỉ";
  const [teacherStatus, setTeacherStatus] = React.useState<Record<string, TeacherStatus>>({});
  const getTStatus = (id: string): TeacherStatus => teacherStatus[id] ?? "Đang dạy";
  const tStatusColor = (s: TeacherStatus) =>
    s === "Đang dạy"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-rose-100 text-rose-700 border-rose-200";

  const emptyT = () => ({
    name: "", email: "", phone: "", dob: "", gender: "Nữ" as "Nam" | "Nữ",
    address: "", startDate: "",
    employmentType: "Fulltime" as "Fulltime" | "Parttime",
    baseSalary: 8000000, perSessionRate: 250000,
    contractName: "",
    contractSigned: undefined as Date | undefined,
    contractExpires: undefined as Date | undefined,
    contractFile: "",
  });
  const [openAdd, setOpenAdd] = React.useState(false);
  const [t, setT] = React.useState(emptyT());

  const submitTeacher = () => {
    if (!t.name.trim() || !t.email.trim() || !t.phone.trim()) {
      toast.error("Vui lòng nhập họ tên, email và số điện thoại.");
      return;
    }
    const id = `t${Date.now()}`;
    setExtraTeachers((prev) => [
      ...prev,
      {
        id, name: t.name.trim(), email: t.email, phone: t.phone,
        dob: t.dob, gender: t.gender, address: t.address,
        branch: BRANCHES[0], position: t.employmentType, startDate: t.startDate,
        baseSalary: Number(t.baseSalary) || 0, perSessionRate: Number(t.perSessionRate) || 0,
        contract: {
          name: t.contractName,
          signedAt: t.contractSigned ? fmtDate(t.contractSigned) : "",
          expiresAt: t.contractExpires ? fmtDate(t.contractExpires) : "",
          fileName: t.contractFile,
        },
        related: [], classes: [],
        attendanceReport: [], salaryReport: [],
      },
    ]);
    toast.success(`Đã thêm giáo viên ${t.name.trim()}`);
    setOpenAdd(false);
    setT(emptyT());
  };

  return (
    <div className="space-y-4">
      {sel ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <div className="flex items-center gap-3">
                <CardTitle>{sel.name}</CardTitle>
                <Select value={getTStatus(sel.id)} onValueChange={(v) => setTeacherStatus((p) => ({ ...p, [sel.id]: v as TeacherStatus }))}>
                  <SelectTrigger className={`h-7 w-auto px-2.5 text-xs font-medium border ${tStatusColor(getTStatus(sel.id))}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đang dạy">Đang dạy</SelectItem>
                    <SelectItem value="Nghỉ">Nghỉ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-xs text-slate-500 mt-1">{sel.position} · CN {sel.branch} · Vào làm {sel.startDate}</div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelId(null)}>
              <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="info" className="space-y-3">
              <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="info">Thông tin</TabsTrigger>
                <TabsTrigger value="contract">Hợp đồng</TabsTrigger>
                <TabsTrigger value="related">Người liên quan</TabsTrigger>
                <TabsTrigger value="classes">Lớp phụ trách</TabsTrigger>
                <TabsTrigger value="att">Chấm công</TabsTrigger>
                <TabsTrigger value="salary">Lương</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="grid grid-cols-2 gap-3 text-sm mt-3">
                <Info2 label="Họ tên" value={sel.name} />
                <Info2 label="Giới tính" value={sel.gender} />
                <Info2 label="Ngày sinh" value={sel.dob} />
                <Info2 label="Email" value={sel.email} />
                <Info2 label="Số điện thoại" value={sel.phone} />
                <Info2 label="Chi nhánh" value={sel.branch} />
                <Info2 label="Địa chỉ" value={sel.address} className="col-span-2" />
                <Info2 label="Lương cơ bản" value={formatVND(sel.baseSalary)} />
                <Info2 label="Lương / buổi" value={formatVND(sel.perSessionRate)} />
              </TabsContent>

              <TabsContent value="contract" className="text-sm mt-3 space-y-2">
                <div className="rounded-md border bg-slate-50 px-3 py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{sel.contract.name}</div>
                    <div className="text-xs text-slate-500">
                      Ký {sel.contract.signedAt} · Hết hạn {sel.contract.expiresAt}
                    </div>
                    <div className="text-xs text-indigo-600 mt-1 font-mono">📎 {sel.contract.fileName}</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast.success("Đã tải xuống hợp đồng (demo)")}>
                    Tải xuống
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="related" className="text-sm mt-3">
                {sel.related.length === 0 ? (
                  <p className="text-slate-500">Chưa có người liên quan.</p>
                ) : (
                  <Table><TableHeader><TableRow>
                    <TableHead>Họ tên</TableHead><TableHead>Quan hệ</TableHead><TableHead>SĐT</TableHead>
                  </TableRow></TableHeader><TableBody>
                    {sel.related.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell>{r.relation}</TableCell>
                        <TableCell>{r.phone}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody></Table>
                )}
              </TabsContent>

              <TabsContent value="classes" className="text-sm mt-3">
                {teacherClasses.length === 0 ? (
                  <p className="text-slate-500">Chưa phụ trách lớp nào.</p>
                ) : (
                  <Table><TableHeader><TableRow>
                    <TableHead>Lớp</TableHead><TableHead>Syllabus</TableHead>
                    <TableHead>Lịch</TableHead><TableHead>Phòng</TableHead>
                  </TableRow></TableHeader><TableBody>
                    {teacherClasses.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>{c.syllabus}</TableCell>
                        <TableCell className="text-xs">{c.schedule} · {c.time}</TableCell>
                        <TableCell>{c.room}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody></Table>
                )}
              </TabsContent>

              <TabsContent value="att" className="text-sm mt-3">
                <Table><TableHeader><TableRow>
                  <TableHead>Tháng</TableHead><TableHead className="text-right">Số buổi</TableHead>
                  <TableHead className="text-right">Vắng</TableHead><TableHead className="text-right">Đi muộn</TableHead>
                </TableRow></TableHeader><TableBody>
                  {sel.attendanceReport.map((a, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{a.month}</TableCell>
                      <TableCell className="text-right">{a.sessions}</TableCell>
                      <TableCell className="text-right">{a.absent}</TableCell>
                      <TableCell className="text-right">{a.late}</TableCell>
                    </TableRow>
                  ))}
                </TableBody></Table>
              </TabsContent>

              <TabsContent value="salary" className="text-sm mt-3">
                <Table><TableHeader><TableRow>
                  <TableHead>Tháng</TableHead><TableHead className="text-right">Buổi</TableHead>
                  <TableHead className="text-right">Tổng</TableHead><TableHead className="text-right">Trừ</TableHead>
                  <TableHead className="text-right">Thực nhận</TableHead>
                </TableRow></TableHeader><TableBody>
                  {sel.salaryReport.map((s, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{s.month}</TableCell>
                      <TableCell className="text-right">{s.sessions}</TableCell>
                      <TableCell className="text-right">{formatVND(s.gross)}</TableCell>
                      <TableCell className="text-right text-rose-600">-{formatVND(s.deduct)}</TableCell>
                      <TableCell className="text-right font-semibold">{formatVND(s.net)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody></Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Danh sách giáo viên</CardTitle>
          <Button size="sm" onClick={() => { setT(emptyT()); setOpenAdd(true); }}>
            <Plus className="h-4 w-4" /> Thêm giáo viên
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Họ tên</TableHead>
              <TableHead>Vị trí</TableHead>
              <TableHead>Chi nhánh</TableHead>
              <TableHead>Vào làm</TableHead>
              <TableHead className="text-right">Số lớp</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {allTeachers.map((t) => (
                <TableRow key={t.id} className="cursor-pointer hover:bg-slate-50" onClick={() => setSelId(t.id)}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>{t.position}</TableCell>
                  <TableCell>{t.branch}</TableCell>
                  <TableCell className="text-xs text-slate-600">{t.startDate}</TableCell>
                  <TableCell className="text-right"><Badge variant="secondary">{t.classes.length}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      )}

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Thêm giáo viên mới</DialogTitle>
            <DialogDescription>Điền thông tin cá nhân, công việc và hợp đồng.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cột trái: Thông tin cá nhân + Công việc */}
            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold mb-2">Thông tin cá nhân</div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs text-slate-500">Họ tên</Label>
                    <Input className="h-9 mt-1" value={t.name} onChange={(e) => setT({ ...t, name: e.target.value })} /></div>
                  <div><Label className="text-xs text-slate-500">Giới tính</Label>
                    <Select value={t.gender} onValueChange={(v) => setT({ ...t, gender: v as "Nam" | "Nữ" })}>
                      <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Nam">Nam</SelectItem><SelectItem value="Nữ">Nữ</SelectItem></SelectContent>
                    </Select></div>
                  <div><Label className="text-xs text-slate-500">Ngày sinh</Label>
                    <Input className="h-9 mt-1" placeholder="DD/MM/YYYY" value={t.dob} onChange={(e) => setT({ ...t, dob: e.target.value })} /></div>
                  <div><Label className="text-xs text-slate-500">SĐT</Label>
                    <Input className="h-9 mt-1" value={t.phone} onChange={(e) => setT({ ...t, phone: e.target.value })} /></div>
                  <div className="col-span-2"><Label className="text-xs text-slate-500">Email</Label>
                    <Input className="h-9 mt-1" value={t.email} onChange={(e) => setT({ ...t, email: e.target.value })} /></div>
                  <div className="col-span-2"><Label className="text-xs text-slate-500">Địa chỉ</Label>
                    <Input className="h-9 mt-1" value={t.address} onChange={(e) => setT({ ...t, address: e.target.value })} /></div>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold mb-2">Công việc</div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs text-slate-500">Hình thức làm việc</Label>
                    <Select value={t.employmentType} onValueChange={(v) => setT({ ...t, employmentType: v as "Fulltime" | "Parttime" })}>
                      <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fulltime">Fulltime</SelectItem>
                        <SelectItem value="Parttime">Parttime</SelectItem>
                      </SelectContent>
                    </Select></div>
                  <div><Label className="text-xs text-slate-500">Ngày vào làm</Label>
                    <Input className="h-9 mt-1" placeholder="DD/MM/YYYY" value={t.startDate} onChange={(e) => setT({ ...t, startDate: e.target.value })} /></div>
                  <div><Label className="text-xs text-slate-500">Lương cơ bản (VNĐ)</Label>
                    <Input className="h-9 mt-1" type="number" value={t.baseSalary} onChange={(e) => setT({ ...t, baseSalary: Number(e.target.value) })} /></div>
                  <div><Label className="text-xs text-slate-500">Lương / buổi (VNĐ)</Label>
                    <Input className="h-9 mt-1" type="number" value={t.perSessionRate} onChange={(e) => setT({ ...t, perSessionRate: Number(e.target.value) })} /></div>
                </div>
              </div>
            </div>
            {/* Cột phải: Hợp đồng */}
            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold mb-2">Hợp đồng</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2"><Label className="text-xs text-slate-500">Tên hợp đồng</Label>
                    <Input className="h-9 mt-1" value={t.contractName} onChange={(e) => setT({ ...t, contractName: e.target.value })} /></div>
                  <div><Label className="text-xs text-slate-500">Ngày ký</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("h-9 mt-1 w-full justify-start font-normal", !t.contractSigned && "text-muted-foreground")}>
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {t.contractSigned ? fmtDate(t.contractSigned) : "Chọn ngày"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarUI mode="single" selected={t.contractSigned} onSelect={(d) => setT({ ...t, contractSigned: d ?? undefined })} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div><Label className="text-xs text-slate-500">Ngày hết hạn</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("h-9 mt-1 w-full justify-start font-normal", !t.contractExpires && "text-muted-foreground")}>
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {t.contractExpires ? fmtDate(t.contractExpires) : "Chọn ngày"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarUI mode="single" selected={t.contractExpires} onSelect={(d) => setT({ ...t, contractExpires: d ?? undefined })} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="col-span-2"><Label className="text-xs text-slate-500">File hợp đồng</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setT({ ...t, contractFile: f.name });
                        }}
                      />
                      <Button type="button" variant="outline" className="h-9" onClick={() => fileInputRef.current?.click()}>
                        Tải lên
                      </Button>
                      <Input className="h-9 flex-1" placeholder="Chưa có file" value={t.contractFile} onChange={(e) => setT({ ...t, contractFile: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAdd(false)}>Hủy</Button>
            <Button onClick={submitTeacher}>Thêm giáo viên</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============== TEACHING SCHEDULE (calendar) ============== */
const DAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
const HOURS = Array.from({ length: 14 }, (_, i) => 7 + i); // 7h..20h

function parseHour(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h + (m ?? 0) / 60;
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDateKey(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export function AdminSchedule() {
  const { classes, scheduledSessions, setScheduledSessions } = useApp();
  const colors = ["bg-indigo-100 border-indigo-300 text-indigo-800", "bg-emerald-100 border-emerald-300 text-emerald-800", "bg-amber-100 border-amber-300 text-amber-800", "bg-rose-100 border-rose-300 text-rose-800", "bg-sky-100 border-sky-300 text-sky-800"];
  const [branch, setBranch] = React.useState<"all" | Branch>("all");
  const [weekOffset, setWeekOffset] = React.useState(0);
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [selectedSlot, setSelectedSlot] = React.useState<{ date: string; day: string; hour: number } | null>(null);
  const [assignment, setAssignment] = React.useState({
    classId: "",
    teacherId: "",
    branch: "Đội Cấn" as Branch,
    room: "",
    start: "08:00",
    end: "09:30",
  });

  const weekStart = React.useMemo(() => {
    const now = new Date();
    const day = (now.getDay() + 6) % 7; // Mon=0
    const monday = new Date(now);
    monday.setDate(now.getDate() - day + weekOffset * 7);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }, [weekOffset]);

  const weekLabel = React.useMemo(() => {
    const sunday = new Date(weekStart);
    sunday.setDate(weekStart.getDate() + 6);
    const f = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    return `${f(weekStart)} – ${f(sunday)}/${sunday.getFullYear()}`;
  }, [weekStart]);

  const weekDates = React.useMemo(
    () => DAYS.map((_, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      return toDateKey(date);
    }),
    [weekStart],
  );

  // Build events
  const events: { id: string; day: string; date?: string; start: number; end: number; cls: string; teacher: string; room: string; color: string }[] = [];
  classes
    .filter((c) => branch === "all" || c.branch === branch)
    .forEach((c, idx) => {
    (c.sessions ?? []).forEach((s) => {
      const [a, b] = s.time.split(" - ");
      events.push({
        id: `${c.id}-${s.day}-${s.time}`,
        day: s.day,
        start: parseHour(a),
        end: parseHour(b),
        cls: c.name,
        teacher: c.teacher,
        room: s.room,
        color: colors[idx % colors.length],
      });
    });
  });
  scheduledSessions
    .filter((session) => weekDates.includes(session.date) && (branch === "all" || session.branch === branch))
    .forEach((session, index) => {
      const dayIndex = weekDates.indexOf(session.date);
      events.push({
        id: session.id,
        day: DAYS[dayIndex],
        date: session.date,
        start: parseHour(session.start),
        end: parseHour(session.end),
        cls: session.className,
        teacher: session.teacherName,
        room: `${session.branch} · ${session.room}`,
        color: colors[(index + 2) % colors.length],
      });
    });

  const openAssignment = (dayIndex: number, hour: number) => {
    const date = weekDates[dayIndex];
    setSelectedSlot({ date, day: DAYS[dayIndex], hour });
    setAssignment({
      classId: "",
      teacherId: "",
      branch: branch === "all" ? "Đội Cấn" : branch,
      room: "",
      start: `${String(hour).padStart(2, "0")}:00`,
      end: `${String(Math.min(hour + 1, 20)).padStart(2, "0")}:30`,
    });
    setAssignOpen(true);
  };

  const selectedClass = classes.find((item) => item.id === assignment.classId);
  const branchRooms = ROOMS.filter((room) => room.branch === assignment.branch);

  const saveAssignment = () => {
    const teacher = TEACHERS.find((item) => item.id === assignment.teacherId);
    if (!selectedSlot || !selectedClass || !teacher || !assignment.room || assignment.end <= assignment.start) {
      toast.error("Vui lòng chọn đủ lớp, giáo viên, phòng và giờ dạy hợp lệ.");
      return;
    }

    setScheduledSessions((current) => [
      ...current,
      {
        id: `scheduled-${Date.now()}`,
        date: selectedSlot.date,
        start: assignment.start,
        end: assignment.end,
        classId: selectedClass.id,
        className: selectedClass.name,
        teacherId: teacher.id,
        teacherName: teacher.name,
        branch: assignment.branch,
        room: assignment.room,
        checkIn: null,
        checkOut: null,
      },
    ]);
    toast.success(`Đã gán ${teacher.name} dạy lớp ${selectedClass.name}`, {
      description: `${selectedSlot.day}, ${formatDateKey(selectedSlot.date)} · ${assignment.start} - ${assignment.end}`,
    });
    setAssignOpen(false);
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-7rem)]">
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 pb-3">
        <div>
          <CardTitle>Lịch dạy tuần này</CardTitle>
          <p className="text-xs text-slate-500">Hiển thị lịch dạy theo giờ giống Google Calendar.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={branch} onValueChange={(v) => setBranch(v as "all" | Branch)}>
            <SelectTrigger className="h-9 w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả chi nhánh</SelectItem>
              {BRANCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center rounded-md border">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none" onClick={() => setWeekOffset((v) => v - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-9 px-3 rounded-none border-x text-xs font-medium" onClick={() => setWeekOffset(0)}>
              {weekOffset === 0 ? `Tuần này · ${weekLabel}` : weekLabel}
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none" onClick={() => setWeekOffset((v) => v + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
        <div className="h-full flex flex-col">
          <div className="grid border-b" style={{ gridTemplateColumns: "52px repeat(7, 1fr)" }}>
            <div />
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-slate-600 py-2">{d}</div>
            ))}
          </div>
          <div className="flex-1 min-h-0 grid" style={{ gridTemplateColumns: "52px repeat(7, 1fr)", gridTemplateRows: `repeat(${HOURS.length}, minmax(0, 1fr))` }}>
            {HOURS.map((h) => (
              <React.Fragment key={h}>
                <div className="text-[10px] text-slate-400 pr-2 text-right border-t pt-0.5">{`${h}:00`}</div>
                {DAYS.map((d, dayIndex) => (
                  <button
                    type="button"
                    key={d + h}
                    className="group relative border-t border-l text-left hover:bg-indigo-50/60"
                    onClick={() => openAssignment(dayIndex, h)}
                    title={`Gán ca dạy ${d} lúc ${h}:00`}
                  >
                    <span className="pointer-events-none absolute inset-0 hidden place-content-center text-[10px] font-medium text-indigo-500 group-hover:grid">
                      + Gán ca
                    </span>
                    {events
                      .filter((e) => e.day === d && (!e.date || e.date === weekDates[dayIndex]) && Math.floor(e.start) === h)
                      .map((e) => {
                        const heightPct = (e.end - e.start) * 100;
                        const topPct = (e.start - h) * 100;
                        return (
                          <div
                            key={e.id}
                            className={`absolute left-1 right-1 z-[1] rounded-md border px-1.5 py-0.5 text-[10px] leading-tight shadow-sm overflow-hidden ${e.color}`}
                            style={{ top: `${topPct}%`, height: `${heightPct}%` }}
                            onClick={(event) => event.stopPropagation()}
                          >
                            <div className="font-semibold truncate">{e.cls}</div>
                            <div className="truncate opacity-80">{e.teacher}</div>
                            <div className="truncate opacity-70">{e.room}</div>
                          </div>
                        );
                      })}
                  </button>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Gán ca dạy</DialogTitle>
            <DialogDescription>
              {selectedSlot ? `${selectedSlot.day}, ${formatDateKey(selectedSlot.date)} · ô ${selectedSlot.hour}:00` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Lớp học</Label>
              <Select value={assignment.classId} onValueChange={(value) => {
                const cls = classes.find((item) => item.id === value);
                const teacher = TEACHERS.find((item) => item.name === cls?.teacher);
                setAssignment((current) => ({
                  ...current,
                  classId: value,
                  teacherId: teacher?.id ?? current.teacherId,
                  branch: cls?.branch ?? current.branch,
                  room: cls?.room ?? "",
                }));
              }}>
                <SelectTrigger><SelectValue placeholder="Chọn lớp" /></SelectTrigger>
                <SelectContent>
                  {classes.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Giáo viên</Label>
                <Select value={assignment.teacherId} onValueChange={(value) => setAssignment((current) => ({ ...current, teacherId: value }))}>
                  <SelectTrigger><SelectValue placeholder="Chọn giáo viên" /></SelectTrigger>
                  <SelectContent>
                    {TEACHERS.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Trung tâm</Label>
                <Select value={assignment.branch} onValueChange={(value) => setAssignment((current) => ({ ...current, branch: value as Branch, room: "" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Phòng</Label>
                <Select value={assignment.room} onValueChange={(value) => setAssignment((current) => ({ ...current, room: value }))}>
                  <SelectTrigger><SelectValue placeholder="Chọn phòng" /></SelectTrigger>
                  <SelectContent>
                    {branchRooms.map((item) => <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Giờ bắt đầu</Label>
                <Input type="time" value={assignment.start} onChange={(event) => setAssignment((current) => ({ ...current, start: event.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Giờ kết thúc</Label>
                <Input type="time" value={assignment.end} onChange={(event) => setAssignment((current) => ({ ...current, end: event.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>Hủy</Button>
            <Button onClick={saveAssignment}>Gán ca dạy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* ============== ATTENDANCE REPORT (demo) ============== */
export function AdminAttendanceReport() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="admin" className="space-y-4">
        <TabsList className="h-10">
          <TabsTrigger value="admin" className="gap-2">
            <Users className="h-4 w-4" /> Admin
          </TabsTrigger>
          <TabsTrigger value="teacher" className="gap-2">
            <GraduationCap className="h-4 w-4" /> Giáo viên
          </TabsTrigger>
        </TabsList>
        <TabsContent value="admin">
          <AttendanceReportCard />
        </TabsContent>
        <TabsContent value="teacher">
          <AttendanceReportCard selfCheck />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ============== FINANCE REPORT (Thu / Chi) ============== */
export function AdminFinanceReport() {
  return <FinanceReportCard />;
}

function AttendanceReportCard({ selfCheck = false }: { selfCheck?: boolean }) {
  const { scheduledSessions, setScheduledSessions } = useApp();
  const [teacherId, setTeacherId] = React.useState(TEACHERS[0]?.id ?? "");
  const [month, setMonth] = React.useState("06/2026");
  const [selfCheckTimes, setSelfCheckTimes] = React.useState<
    Record<string, { checkIn: string | null; checkOut: string | null }>
  >({});
  const teacher = TEACHERS.find((item) => item.id === teacherId) ?? TEACHERS[0];
  const baseAttendanceRows = React.useMemo(
    () => createMonthlyAttendance(teacherId, month, scheduledSessions),
    [teacherId, month, scheduledSessions],
  );
  const attendanceRows = baseAttendanceRows;
  const workingRows = attendanceRows.filter((row) => row.shift !== null);
  const lateCount = workingRows.filter((row) => row.lateMinutes > 0).length;
  const earlyCount = workingRows.filter((row) => row.earlyMinutes > 0).length;
  const absentCount = workingRows.filter((row) => row.status === "absent").length;
  const successfulCount = workingRows.filter((row) => row.status === "present").length;

  const updateSelfCheck = (row: AttendanceRow, field: "checkIn" | "checkOut") => {
    if (!row.shift) return;
    const selfCheckKey = `${teacherId}-${row.id}`;
    const current = selfCheckTimes[selfCheckKey];
    if (field === "checkOut" && !current?.checkIn) {
      toast.error("Vui lòng bấm IN trước khi bấm OUT");
      return;
    }

    const time = getNow();
    setSelfCheckTimes((previous) => ({
      ...previous,
      [selfCheckKey]: {
        checkIn: field === "checkIn" ? time : previous[selfCheckKey]?.checkIn ?? null,
        checkOut: field === "checkOut" ? time : previous[selfCheckKey]?.checkOut ?? null,
      },
    }));
    setScheduledSessions((previous) =>
      previous.map((session) =>
        session.id === row.id ? { ...session, [field]: time } : session,
      ),
    );
    toast.success(`${field === "checkIn" ? "Check-in" : "Check-out"} thành công lúc ${time}`);
  };

  return (
    <Card className="flex h-[calc(100vh-7rem)] min-h-0 flex-col overflow-hidden">
      <CardHeader className="shrink-0 space-y-1 px-5 pb-3 pt-4">
        <CardTitle className="text-lg">Báo cáo chấm công</CardTitle>
        <p className="text-sm leading-5 text-slate-500">
          Chi tiết ca làm, giờ vào và giờ ra của giáo viên theo từng ngày trong tháng.
        </p>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-3 px-5 pb-4">
        <div className="flex shrink-0 flex-col gap-2 rounded-lg border bg-slate-50 px-3 py-2.5 lg:flex-row lg:items-end">
          <div className="grid flex-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs">Giáo viên</Label>
              <Select value={teacherId} onValueChange={setTeacherId}>
                <SelectTrigger className="h-9 bg-white">
                  <SelectValue placeholder="Chọn giáo viên" />
                </SelectTrigger>
                <SelectContent>
                  {TEACHERS.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} - {item.branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Tháng báo cáo</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="h-9 bg-white">
                  <SelectValue placeholder="Chọn tháng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="01/2026">Tháng 01/2026</SelectItem>
                  <SelectItem value="02/2026">Tháng 02/2026</SelectItem>
                  <SelectItem value="03/2026">Tháng 03/2026</SelectItem>
                  <SelectItem value="06/2026">Tháng 06/2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            className="h-9 lg:min-w-44"
            onClick={() => {
              exportAttendanceExcel({
                teacherName: teacher?.name ?? "Giáo viên",
                branch: teacher?.branch ?? "",
                month,
                rows: attendanceRows,
                totalShifts: workingRows.length,
                successful: successfulCount,
                late: lateCount,
                early: earlyCount,
                absent: absentCount,
              });
              toast.success(`Đã xuất báo cáo ${teacher?.name} - ${month}`);
            }}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Xuất báo cáo Excel
          </Button>
        </div>

        <div className="grid shrink-0 gap-2 sm:grid-cols-2 xl:grid-cols-6">
          <AttendanceSummary label="Giáo viên" value={teacher?.name ?? "-"} />
          <AttendanceSummary label="Ca được xếp" value={`${workingRows.length} ca`} />
          <AttendanceSummary label="Điểm danh thành công" value={`${successfulCount} ca`} tone="success" />
          <AttendanceSummary label="Đi muộn" value={`${lateCount} ca`} tone={lateCount ? "danger" : "default"} />
          <AttendanceSummary label="Về sớm" value={`${earlyCount} ca`} tone={earlyCount ? "warning" : "default"} />
          <AttendanceSummary label="Vắng" value={`${absentCount} ca`} tone={absentCount ? "danger" : "default"} />
        </div>

        <div className="min-h-0 flex-1 overflow-hidden rounded-lg border">
          <div className="h-full overflow-hidden [&>div]:h-full">
            <Table className="min-w-[1260px]">
              <TableHeader className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_0_rgb(226_232_240)]">
                <TableRow>
                  <TableHead className="w-14">STT</TableHead>
                  <TableHead className="min-w-36">Ngày</TableHead>
                  <TableHead className="min-w-32">Ca làm</TableHead>
                  <TableHead className="min-w-44">Trung tâm</TableHead>
                  <TableHead className="min-w-36">Lớp học</TableHead>
                  <TableHead className="min-w-28">Giờ vào</TableHead>
                  <TableHead className="min-w-28">Giờ ra</TableHead>
                  <TableHead className="min-w-64">Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={row.status === "off" ? "bg-slate-50/60 text-slate-400" : undefined}
                  >
                    {row.shiftIndex === 0 && (
                      <>
                        <TableCell rowSpan={row.totalShifts} className="align-top pt-4">
                          {row.dayNumber}
                        </TableCell>
                        <TableCell rowSpan={row.totalShifts} className="align-top pt-4">
                          <div className="font-medium text-slate-900">{row.displayDate}</div>
                          <div className="text-xs text-slate-500">{row.weekday}</div>
                          {row.totalShifts > 1 && (
                            <Badge className="mt-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-50">
                              {row.totalShifts} ca trong ngày
                            </Badge>
                          )}
                        </TableCell>
                      </>
                    )}
                    <TableCell>
                      {row.shift ? (
                        <Badge variant="outline" className="whitespace-nowrap bg-white font-normal">
                          <Clock className="mr-1.5 h-3.5 w-3.5" />
                          {row.shift.start} - {row.shift.end}
                        </Badge>
                      ) : (
                        <span className="text-sm">Không có ca</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {row.branch ? (
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                          {row.branch}
                        </div>
                      ) : (
                        <span className="text-slate-400">--</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">
                      {row.className ?? "--"}
                    </TableCell>
                    <TableCell className={row.lateMinutes > 0 ? "font-semibold text-red-600" : ""}>
                      {selfCheck && row.shift ? (
                        selfCheckTimes[`${teacherId}-${row.id}`]?.checkIn ? (
                          <span>{selfCheckTimes[`${teacherId}-${row.id}`]?.checkIn}</span>
                        ) : (
                          <Button
                            size="sm"
                            className="h-8 min-w-16 bg-emerald-500 font-bold hover:bg-emerald-600"
                            onClick={() => updateSelfCheck(row, "checkIn")}
                          >
                            IN
                          </Button>
                        )
                      ) : (
                        row.checkIn ?? "--:--"
                      )}
                    </TableCell>
                    <TableCell className={row.earlyMinutes > 0 ? "font-semibold text-amber-600" : ""}>
                      {selfCheck && row.shift ? (
                        selfCheckTimes[`${teacherId}-${row.id}`]?.checkOut ? (
                          <span>{selfCheckTimes[`${teacherId}-${row.id}`]?.checkOut}</span>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 min-w-16 font-bold"
                            disabled={!selfCheckTimes[`${teacherId}-${row.id}`]?.checkIn}
                            onClick={() => updateSelfCheck(row, "checkOut")}
                          >
                            OUT
                          </Button>
                        )
                      ) : (
                        row.checkOut ?? "--:--"
                      )}
                    </TableCell>
                    <TableCell>
                      <AttendanceNote row={row} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ===== Teacher Self-Check-In Card ===== */
type SelfCheckSession = {
  id: string;
  className: string;
  branch: Branch;
  room: string;
  scheduledStart: string;
  scheduledEnd: string;
  checkIn: string | null;
  checkOut: string | null;
};

function getNow() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function diffMinutes(a: string, b: string): number {
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return (bh * 60 + bm) - (ah * 60 + am);
}

function TeacherSelfCheckCard() {
  const { scheduledSessions, setScheduledSessions } = useApp();
  const [teacherId, setTeacherId] = React.useState(TEACHERS[0]?.id ?? "");
  const [selfSessions, setSelfSessions] = React.useState<SelfCheckSession[]>(() =>
    buildDemoSessions(TEACHERS[0]?.id ?? ""),
  );

  React.useEffect(() => {
    setSelfSessions(buildDemoSessions(teacherId));
  }, [teacherId]);

  const teacher = TEACHERS.find((t) => t.id === teacherId) ?? TEACHERS[0];

  const handleIn = (id: string) => {
    const time = getNow();
    setSelfSessions((prev) =>
      prev.map((s) => s.id === id && !s.checkIn ? { ...s, checkIn: time } : s),
    );
    // also update scheduledSessions if this session exists
    setScheduledSessions((prev) =>
      prev.map((s) => s.id === id && !s.checkIn ? { ...s, checkIn: time } : s),
    );
    toast.success(`Check-in thành công lúc ${time}`);
  };

  const handleOut = (id: string) => {
    const sess = selfSessions.find((s) => s.id === id);
    if (!sess?.checkIn) { toast.error("Chưa check-in!"); return; }
    const time = getNow();
    setSelfSessions((prev) =>
      prev.map((s) => s.id === id && s.checkIn && !s.checkOut ? { ...s, checkOut: time } : s),
    );
    setScheduledSessions((prev) =>
      prev.map((s) => s.id === id && s.checkIn && !s.checkOut ? { ...s, checkOut: time } : s),
    );
    toast.success(`Check-out thành công lúc ${time}`);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">Chấm công giáo viên</CardTitle>
            <p className="text-sm text-slate-500 mt-0.5">
              Bấm <span className="font-semibold text-emerald-600">IN</span> khi vào, <span className="font-semibold text-rose-600">OUT</span> khi ra. Kết quả hiển thị tự động.
            </p>
          </div>
          <div className="space-y-1 min-w-[200px]">
            <Label className="text-xs">Giáo viên</Label>
            <Select value={teacherId} onValueChange={setTeacherId}>
              <SelectTrigger className="h-9 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEACHERS.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name} · {t.branch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-50 border-y">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 min-w-[140px]">Lớp học</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Trung tâm</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Phòng</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Ca</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-600 min-w-[110px]">Giờ vào</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-600 min-w-[110px]">Giờ ra</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 min-w-[160px]">Kết quả</th>
              </tr>
            </thead>
            <tbody>
              {selfSessions.map((sess) => {
                const lateMin = sess.checkIn ? diffMinutes(sess.scheduledStart, sess.checkIn) : 0;
                const earlyMin = sess.checkOut ? diffMinutes(sess.checkOut, sess.scheduledEnd) : 0;
                const isDone = !!(sess.checkIn && sess.checkOut);
                const isAbsent = false;

                let resultNode: React.ReactNode = null;
                if (isDone) {
                  if (lateMin > 0 || earlyMin > 0) {
                    resultNode = (
                      <div className="flex flex-wrap gap-1.5">
                        {lateMin > 0 && <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">Đi trễ {lateMin} phút</Badge>}
                        {earlyMin > 0 && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Về sớm {earlyMin} phút</Badge>}
                      </div>
                    );
                  } else {
                    resultNode = <span className="text-emerald-600 font-semibold">✓ Đúng giờ</span>;
                  }
                } else if (sess.checkIn) {
                  resultNode = <span className="text-blue-600 text-xs">Đang trong ca...</span>;
                } else {
                  resultNode = <span className="text-slate-400 text-xs">Chờ check-in</span>;
                }

                return (
                  <tr key={sess.id} className="border-b hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-indigo-700">{sess.className}</td>
                    <td className="px-4 py-3 text-slate-600">{sess.branch}</td>
                    <td className="px-4 py-3 text-slate-600">{sess.room}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {sess.scheduledStart} – {sess.scheduledEnd}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {sess.checkIn ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="font-bold text-emerald-600 text-base">{sess.checkIn}</span>
                          <span className="text-[10px] text-slate-400">đã check-in</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleIn(sess.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-sm shadow-sm transition-all"
                          title="Check-in"
                        >
                          IN
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {sess.checkOut ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="font-bold text-rose-600 text-base">{sess.checkOut}</span>
                          <span className="text-[10px] text-slate-400">đã check-out</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOut(sess.id)}
                          disabled={!sess.checkIn}
                          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold text-sm shadow-sm transition-all ${
                            sess.checkIn
                              ? "bg-rose-500 hover:bg-rose-600 active:scale-95 text-white"
                              : "bg-slate-100 text-slate-400 cursor-not-allowed"
                          }`}
                          title="Check-out"
                        >
                          OUT
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">{resultNode}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t bg-slate-50/50 flex flex-wrap gap-4 text-xs text-slate-500">
          <span><span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-1.5 align-middle" />Đúng giờ</span>
          <span><span className="inline-block w-3 h-3 rounded-full bg-rose-400 mr-1.5 align-middle" />Đi trễ</span>
          <span><span className="inline-block w-3 h-3 rounded-full bg-amber-400 mr-1.5 align-middle" />Về sớm</span>
          <span><span className="inline-block w-3 h-3 rounded-full bg-slate-200 mr-1.5 align-middle" />Chờ chấm công</span>
        </div>
      </CardContent>
    </Card>
  );
}

function buildDemoSessions(teacherId: string): SelfCheckSession[] {
  const teacher = TEACHERS.find((t) => t.id === teacherId) ?? TEACHERS[0];
  const shifts = [
    { start: "08:00", end: "09:30" },
    { start: "14:00", end: "15:30" },
    { start: "18:00", end: "19:30" },
  ];
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return teacher.classes.map((classId, idx) => {
    const cls = CLASSES.find((c) => c.id === classId);
    const shift = shifts[idx % shifts.length];
    return {
      id: `self-${teacherId}-${idx}`,
      className: cls?.name ?? `Lớp ${idx + 1}`,
      branch: teacher.branch,
      room: cls?.room ?? "P.101",
      scheduledStart: shift.start,
      scheduledEnd: shift.end,
      checkIn: null,
      checkOut: null,
    };
  }).concat(
    // Add extra demo sessions if teacher has no classes
    teacher.classes.length === 0
      ? [{
          id: `self-${teacherId}-demo`,
          className: "Ca dạy demo",
          branch: teacher.branch,
          room: "P.201",
          scheduledStart: "18:00",
          scheduledEnd: "19:30",
          checkIn: null,
          checkOut: null,
        }]
      : [],
  );
}

type AttendanceStatus = "present" | "absent" | "scheduled" | "off";


type AttendanceRow = {
  id: string;
  dayNumber: number;
  date: string;
  displayDate: string;
  weekday: string;
  shiftIndex: number;
  totalShifts: number;
  shift: { start: string; end: string } | null;
  branch: Branch | null;
  className: string | null;
  checkIn: string | null;
  checkOut: string | null;
  lateMinutes: number;
  earlyMinutes: number;
  status: AttendanceStatus;
};

function AttendanceSummary({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "success" | "danger" | "warning";
}) {
  return (
    <div className="rounded-lg border bg-white px-3 py-2">
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div
        className={cn(
          "mt-0.5 text-base font-semibold",
          tone === "success" && "text-emerald-600",
          tone === "danger" && "text-red-600",
          tone === "warning" && "text-amber-600",
        )}
      >
        {value}
      </div>
    </div>
  );
}

function AttendanceNote({ row }: { row: AttendanceRow }) {
  if (row.status === "off") return <span className="text-sm text-slate-400">Ngày nghỉ / không xếp ca</span>;
  if (row.status === "absent") return <Badge variant="destructive">Vắng mặt</Badge>;
  if (row.status === "scheduled") return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Chờ chấm công</Badge>;

  const hasIssue = row.lateMinutes > 0 || row.earlyMinutes > 0 || !row.checkOut;
  if (!hasIssue) return <span className="text-sm text-emerald-600">Đúng giờ</span>;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {row.lateMinutes > 0 && (
        <span className="font-semibold text-red-600">Đi trễ {row.lateMinutes} phút</span>
      )}
      {row.earlyMinutes > 0 && (
        <span className="font-medium text-amber-600">Về sớm {row.earlyMinutes} phút</span>
      )}
      {!row.checkOut && <span className="font-medium text-slate-600">Chưa ghi nhận giờ ra</span>}
    </div>
  );
}

function createMonthlyAttendance(
  teacherId: string,
  monthValue: string,
  scheduledSessions: ReturnType<typeof useApp>["scheduledSessions"],
): AttendanceRow[] {
  const [month, year] = monthValue.split("/").map(Number);
  const totalDays = new Date(year, month, 0).getDate();
  const teacherOffset = Math.max(0, TEACHERS.findIndex((item) => item.id === teacherId));
  const teacher = TEACHERS[teacherOffset];
  const weekdays = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  const shifts = [
    { start: "08:00", end: "10:00" },
    { start: "14:00", end: "16:00" },
    { start: "18:00", end: "20:00" },
  ];

  const baseRows: AttendanceRow[] = Array.from({ length: totalDays }, (_, index) => {
    const day = index + 1;
    const date = new Date(year, month - 1, day);
    const weekdayIndex = date.getDay();
    const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const baseRow = {
      dayNumber: day,
      date: dateKey,
      displayDate: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`,
      weekday: weekdays[weekdayIndex],
    };

    if (weekdayIndex === 0) {
      return [{
        ...baseRow,
        id: `${dateKey}-off`,
        shiftIndex: 0,
        totalShifts: 1,
        shift: null,
        branch: null,
        className: null,
        checkIn: null,
        checkOut: null,
        lateMinutes: 0,
        earlyMinutes: 0,
        status: "off" as const,
      }];
    }

    const totalShifts = day % 10 === 0 ? 3 : day % 4 === 0 || day % 7 === 0 ? 2 : 1;
    const startShiftIndex = totalShifts === 1 ? (day + teacherOffset) % shifts.length : totalShifts === 2 ? day % 2 : 0;

    return Array.from({ length: totalShifts }, (_, shiftIndex) => {
      const shift = shifts[startShiftIndex + shiftIndex];
      const anomalySeed = day * 3 + shiftIndex * 5 + teacherOffset * 7 + month;
      const isAbsent = anomalySeed % 29 === 0;
      const lateMinutes = !isAbsent && anomalySeed % 9 === 0 ? 7 + ((day + shiftIndex) % 12) : 0;
      const earlyMinutes = !isAbsent && anomalySeed % 13 === 0 ? 9 + ((day + shiftIndex) % 14) : 0;
      const missingCheckout = !isAbsent && anomalySeed % 31 === 0;
      const normalEarlyArrival = 3 + ((day + teacherOffset + shiftIndex) % 8);
      const normalLateDeparture = 2 + ((day + month + shiftIndex) % 7);
      const homeBranchIndex = BRANCHES.indexOf(teacher.branch);
      const branchIndex = totalShifts > 1
        ? (homeBranchIndex + shiftIndex + Math.floor(day / 4)) % BRANCHES.length
        : homeBranchIndex;

      return {
        ...baseRow,
        id: `${dateKey}-${shiftIndex}`,
        shiftIndex,
        totalShifts,
        shift,
        branch: BRANCHES[branchIndex],
        className: teacher.classes.length
          ? CLASSES.find((item) => item.id === teacher.classes[(day + shiftIndex) % teacher.classes.length])?.name ?? "Ca dạy"
          : "Ca dạy",
        checkIn: isAbsent
          ? null
          : addMinutes(shift.start, lateMinutes > 0 ? lateMinutes : -normalEarlyArrival),
        checkOut: isAbsent || missingCheckout
          ? null
          : addMinutes(shift.end, earlyMinutes > 0 ? -earlyMinutes : normalLateDeparture),
        lateMinutes,
        earlyMinutes,
        status: isAbsent ? "absent" as const : "present" as const,
      };
    });
  }).flat();

  const assignedRows: AttendanceRow[] = scheduledSessions
    .filter((session) => {
      const [sessionYear, sessionMonth] = session.date.split("-").map(Number);
      return session.teacherId === teacherId && sessionYear === year && sessionMonth === month;
    })
    .map((session) => {
      const date = new Date(`${session.date}T00:00:00`);
      return {
        id: session.id,
        dayNumber: date.getDate(),
        date: session.date,
        displayDate: formatDateKey(session.date),
        weekday: weekdays[date.getDay()],
        shiftIndex: 0,
        totalShifts: 1,
        shift: { start: session.start, end: session.end },
        branch: session.branch,
        className: session.className,
        checkIn: session.checkIn,
        checkOut: session.checkOut,
        lateMinutes: session.checkIn ? Math.max(0, minutesBetween(session.start, session.checkIn)) : 0,
        earlyMinutes: session.checkOut ? Math.max(0, minutesBetween(session.checkOut, session.end)) : 0,
        status: session.checkIn ? "present" : "scheduled",
      };
    });

  const assignedDates = new Set(assignedRows.map((row) => row.date));
  const combined = [
    ...baseRows.filter((row) => !(row.status === "off" && assignedDates.has(row.date))),
    ...assignedRows,
  ].sort((a, b) => a.date.localeCompare(b.date) || (a.shift?.start ?? "").localeCompare(b.shift?.start ?? ""));

  const counts = combined.reduce<Record<string, number>>((result, row) => {
    result[row.date] = (result[row.date] ?? 0) + 1;
    return result;
  }, {});
  const indices: Record<string, number> = {};

  return combined.map((row) => {
    const shiftIndex = indices[row.date] ?? 0;
    indices[row.date] = shiftIndex + 1;
    return { ...row, shiftIndex, totalShifts: counts[row.date] };
  });
}

function addMinutes(time: string, minutes: number) {
  const [hour, minute] = time.split(":").map(Number);
  const total = hour * 60 + minute + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function minutesBetween(start: string, end: string) {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  return endHour * 60 + endMinute - (startHour * 60 + startMinute);
}

function exportAttendanceExcel({
  teacherName,
  branch,
  month,
  rows,
  totalShifts,
  successful,
  late,
  early,
  absent,
}: {
  teacherName: string;
  branch: string;
  month: string;
  rows: AttendanceRow[];
  totalShifts: number;
  successful: number;
  late: number;
  early: number;
  absent: number;
}) {
  const escapeCell = (value: string | number) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  const noteForRow = (row: AttendanceRow) => {
    if (row.status === "off") return "Ngày nghỉ / không xếp ca";
    if (row.status === "absent") return "Vắng mặt";
    if (row.status === "scheduled") return "Chờ giáo viên chấm công in/out";

    const notes: string[] = [];
    if (row.lateMinutes > 0) notes.push(`Đi trễ ${row.lateMinutes} phút`);
    if (row.earlyMinutes > 0) notes.push(`Về sớm ${row.earlyMinutes} phút`);
    if (!row.checkOut) notes.push("Chưa ghi nhận giờ ra");
    return notes.length ? notes.join("; ") : "Đúng giờ";
  };

  const detailRows = rows.map((row) => `
    <tr>
      <td>${row.dayNumber}</td>
      <td>${escapeCell(row.displayDate)}</td>
      <td>${escapeCell(row.weekday)}</td>
      <td>${row.shift ? `${row.shift.start} - ${row.shift.end}` : "Không có ca"}</td>
      <td>${escapeCell(row.branch ?? "--")}</td>
      <td>${escapeCell(row.className ?? "--")}</td>
      <td>${row.checkIn ?? "--:--"}</td>
      <td>${row.checkOut ?? "--:--"}</td>
      <td>${escapeCell(row.status === "present" ? "Đã điểm danh" : row.status === "absent" ? "Vắng" : row.status === "scheduled" ? "Chờ chấm công" : "Không xếp ca")}</td>
      <td>${escapeCell(noteForRow(row))}</td>
    </tr>
  `).join("");

  const content = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Cham cong</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; }
          td, th { border: 1px solid #cbd5e1; padding: 6px 10px; white-space: nowrap; }
          .title { font-size: 18px; font-weight: bold; text-align: center; background: #e0e7ff; }
          .label { font-weight: bold; background: #f1f5f9; }
          .header { font-weight: bold; color: white; background: #312e81; text-align: center; }
          .success { color: #047857; font-weight: bold; }
          .danger { color: #dc2626; font-weight: bold; }
          .warning { color: #d97706; font-weight: bold; }
        </style>
      </head>
      <body>
        <table>
          <tr><td class="title" colspan="10">BÁO CÁO CHẤM CÔNG GIÁO VIÊN</td></tr>
          <tr><td class="label">Giáo viên</td><td colspan="4">${escapeCell(teacherName)}</td><td class="label">Tháng</td><td colspan="4">${escapeCell(month)}</td></tr>
          <tr><td class="label">Chi nhánh chính</td><td colspan="9">${escapeCell(branch)}</td></tr>
          <tr>
            <td class="label">Ca được xếp</td><td>${totalShifts}</td>
            <td class="label">Điểm danh thành công</td><td class="success">${successful}</td>
            <td class="label">Đi muộn</td><td class="danger">${late}</td>
            <td class="label">Về sớm</td><td class="warning">${early}</td>
            <td><b>Vắng:</b> <span class="danger">${absent}</span></td>
          </tr>
          <tr><td colspan="10"></td></tr>
          <tr>
            <th class="header">STT ngày</th>
            <th class="header">Ngày</th>
            <th class="header">Thứ</th>
            <th class="header">Ca làm</th>
            <th class="header">Trung tâm</th>
            <th class="header">Lớp học</th>
            <th class="header">Giờ vào</th>
            <th class="header">Giờ ra</th>
            <th class="header">Trạng thái</th>
            <th class="header">Ghi chú</th>
          </tr>
          ${detailRows}
        </table>
      </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", content], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `bao-cao-cham-cong-${teacherName.toLowerCase().replaceAll(" ", "-")}-${month.replace("/", "-")}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/* ============== FINANCE REPORT (Thu / Chi) ============== */
type FinanceTxn = {
  id: string;
  date: string; // yyyy-mm-dd
  type: "thu" | "chi";
  category: string;
  branch: Branch | "Tất cả";
  amount: number;
  note?: string;
  source: "auto" | "manual";
};

const SEED_FINANCE: FinanceTxn[] = [
  { id: "F-001", date: "2026-03-02", type: "thu", category: "Học phí (đã xác nhận)", branch: "Đội Cấn", amount: 6612000, note: "Phiếu DC-000123 — Hồng Diệp", source: "auto" },
  { id: "F-002", date: "2026-03-02", type: "thu", category: "Học phí (ghi nhận)", branch: "Đội Cấn", amount: 3480000, note: "Phiếu DC-000124 — Đăng Khoa (học vụ duyệt)", source: "auto" },
  { id: "F-003", date: "2026-03-06", type: "thu", category: "Học phí (đã xác nhận)", branch: "Hoàng Hoa Thám", amount: 3480000, note: "Phiếu HH-000045 — Mimi", source: "auto" },
  { id: "F-004", date: "2026-02-28", type: "chi", category: "Lương giáo viên", branch: "Đội Cấn", amount: 18500000, note: "Trả lương T2/2026 — Trần Thu Hà", source: "auto" },
  { id: "F-005", date: "2026-02-28", type: "chi", category: "Lương giáo viên", branch: "Hoàng Hoa Thám", amount: 16200000, note: "Trả lương T2/2026 — Nguyễn Minh Anh", source: "auto" },
  { id: "F-006", date: "2026-03-01", type: "chi", category: "Tiền điện nước", branch: "Đội Cấn", amount: 2450000, source: "manual" },
  { id: "F-007", date: "2026-03-05", type: "chi", category: "Văn phòng phẩm", branch: "Ngọc Hà", amount: 850000, source: "manual" },
  { id: "F-008", date: "2026-03-10", type: "thu", category: "Bán giáo trình", branch: "Đội Cấn", amount: 1200000, source: "manual" },
];

function FinanceReportCard() {
  const [txns, setTxns] = React.useState<FinanceTxn[]>(SEED_FINANCE);
  const [from, setFrom] = React.useState<string>("");
  const [to, setTo] = React.useState<string>("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [branchFilter, setBranchFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [open, setOpen] = React.useState<null | "thu" | "chi">(null);

  const filtered = txns.filter((t) => {
    if (from && t.date < from) return false;
    if (to && t.date > to) return false;
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (branchFilter !== "all" && t.branch !== branchFilter) return false;
    if (statusFilter !== "all") {
      if (statusFilter === "ghi-nhan" && !t.category.includes("ghi nhận")) return false;
      if (statusFilter === "da-xac-nhan" && !t.category.includes("đã xác nhận")) return false;
    }
    return true;
  });

  const totalThu = filtered.filter((t) => t.type === "thu").reduce((s, t) => s + t.amount, 0);
  const totalChi = filtered.filter((t) => t.type === "chi").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Nhật ký thu chi</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen("thu")}><Plus className="h-4 w-4 mr-1" />Tạo khoản thu</Button>
            <Button onClick={() => setOpen("chi")}><Plus className="h-4 w-4 mr-1" />Tạo khoản chi</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid gap-3 md:grid-cols-6">
            <div>
              <Label className="text-xs text-slate-500">Từ ngày</Label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs text-slate-500">Đến ngày</Label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs text-slate-500">Loại hình</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="thu">Thu</SelectItem>
                  <SelectItem value="chi">Chi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-slate-500">Chi nhánh</Label>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {BRANCHES.map((b) => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-slate-500">Trạng thái</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="ghi-nhan">Ghi nhận</SelectItem>
                  <SelectItem value="da-xac-nhan">Đã xác nhận</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full" onClick={() => { setFrom(""); setTo(""); setTypeFilter("all"); setBranchFilter("all"); setStatusFilter("all"); }}>Đặt lại bộ lọc</Button>
            </div>
          </div>

          <Table>
            <TableHeader><TableRow>
              <TableHead>Ngày</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Hạng mục</TableHead>
              <TableHead>Chi nhánh</TableHead>
              <TableHead>Ghi chú</TableHead>
              <TableHead className="text-right">Số tiền</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-slate-500 py-8">Không có giao dịch phù hợp</TableCell></TableRow>
              )}
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.date.split("-").reverse().join("/")}</TableCell>
                  <TableCell>
                    {t.type === "thu"
                      ? <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Thu</Badge>
                      : <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">Chi</Badge>}
                  </TableCell>
                  <TableCell className="font-medium">{t.category}</TableCell>
                  <TableCell>{t.branch}</TableCell>
                  <TableCell className="text-slate-600">{t.note ?? "—"}</TableCell>
                  <TableCell className={cn("text-right font-semibold", t.type === "thu" ? "text-emerald-600" : "text-rose-600")}>
                    {t.type === "chi" ? "-" : ""}{formatVND(t.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="text-xs text-slate-500 leading-relaxed border-t pt-3">
            <strong>Logic ghi nhận tự động:</strong> Khi chuyển trạng thái <em>"Trả lương"</em> cho giáo viên → tạo khoản <strong>Chi · Lương giáo viên</strong>.
            Khi học vụ duyệt phiếu lần 1 → ghi nhận <strong>Thu · Học phí (ghi nhận)</strong>.
            Khi admin duyệt thành công → chuyển thành <strong>Thu · Học phí (đã xác nhận)</strong>.
          </div>
        </CardContent>
      </Card>

      <FinanceTxnDialog
        open={open !== null}
        type={open ?? "thu"}
        onClose={() => setOpen(null)}
        onSubmit={(t) => { setTxns((prev) => [t, ...prev]); setOpen(null); toast.success(`Đã tạo khoản ${t.type === "thu" ? "thu" : "chi"}`); }}
      />
    </div>
  );
}

function FinanceTxnDialog({ open, type, onClose, onSubmit }: {
  open: boolean; type: "thu" | "chi"; onClose: () => void; onSubmit: (t: FinanceTxn) => void;
}) {
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = React.useState("");
  const [branch, setBranch] = React.useState<Branch>(BRANCHES[0]);
  const [amount, setAmount] = React.useState<string>("");
  const [note, setNote] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setDate(new Date().toISOString().slice(0, 10));
      setCategory(""); setBranch(BRANCHES[0]); setAmount(""); setNote("");
    }
  }, [open]);

  const submit = () => {
    const amt = Number(amount.replace(/[^\d]/g, ""));
    if (!category.trim() || !amt) { toast.error("Vui lòng nhập hạng mục và số tiền"); return; }
    onSubmit({
      id: `M-${Date.now().toString().slice(-6)}`,
      date, type, category: category.trim(), branch, amount: amt,
      note: note.trim() || undefined, source: "manual",
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo khoản {type === "thu" ? "thu" : "chi"}</DialogTitle>
          <DialogDescription>Nhập thông tin giao dịch để thêm vào nhật ký thu chi.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Ngày</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div>
              <Label>Chi nhánh</Label>
              <Select value={branch} onValueChange={(v) => setBranch(v as Branch)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{BRANCHES.map((b) => (<SelectItem key={b} value={b}>{b}</SelectItem>))}</SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Hạng mục</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder={type === "thu" ? "VD: Bán giáo trình" : "VD: Tiền điện nước"} />
          </div>
          <div>
            <Label>Số tiền (VND)</Label>
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" inputMode="numeric" />
          </div>
          <div>
            <Label>Ghi chú</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={submit}>Lưu giao dịch</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type SalaryStatus = "Đã duyệt" | "Chờ duyệt" | "Đang tính";

type TeacherSalary = {
  id: string;
  name: string;
  position: string;
  foreignSessions: number;
  localSessions: number;
  supportAllowance: number;
  parkingAllowance: number;
  studentCount: number;
  bonus: number;
  rateA?: number;
  rateB?: number;
  studentRate?: number;
  status: SalaryStatus;
};

type RenewalClass = {
  name: string;
  renewalRate: number;
  amount: number;
  note?: string;
};

type AcademicSalary = {
  id: string;
  name: string;
  position: string;
  baseSalary: number;
  closedStudents: number;
  salesRevenue: number;
  renewalRevenue: number;
  renewalClasses: RenewalClass[];
  studentsLeft: number;
  kpiBudget: number;
  kpiPercent: number;
  bonus: number;
  status: SalaryStatus;
};

type TeacherSalarySettings = {
  rateA: number;
  rateB: number;
  studentRate: number;
  defaultParking: number;
};

const INITIAL_TEACHER_SALARY_SETTINGS: TeacherSalarySettings = {
  rateA: 320000,
  rateB: 230000,
  studentRate: 15000,
  defaultParking: 300000,
};

const INITIAL_TEACHER_SALARIES: TeacherSalary[] = [
  { id: "GV01", name: "Cô Mai", position: "Giáo viên chủ nhiệm", foreignSessions: 12, localSessions: 18, supportAllowance: 1200000, parkingAllowance: 300000, studentCount: 48, bonus: 500000, status: "Đã duyệt" },
  { id: "GV02", name: "Thầy Nam", position: "Giáo viên IELTS", foreignSessions: 16, localSessions: 12, supportAllowance: 800000, parkingAllowance: 300000, studentCount: 42, bonus: 400000, status: "Chờ duyệt" },
  { id: "GV03", name: "Cô Linh", position: "Giáo viên Kids", foreignSessions: 10, localSessions: 22, supportAllowance: 1000000, parkingAllowance: 250000, studentCount: 55, bonus: 300000, status: "Đã duyệt" },
  { id: "GV04", name: "Thầy Minh", position: "Giáo viên giao tiếp", foreignSessions: 14, localSessions: 16, supportAllowance: 600000, parkingAllowance: 300000, studentCount: 39, bonus: 250000, status: "Đang tính" },
  { id: "GV05", name: "Cô Hương", position: "Giáo viên Cambridge", foreignSessions: 18, localSessions: 10, supportAllowance: 1500000, parkingAllowance: 300000, studentCount: 61, bonus: 550000, status: "Đã duyệt" },
  { id: "GV06", name: "Thầy Long", position: "Giáo viên Teens", foreignSessions: 8, localSessions: 24, supportAllowance: 500000, parkingAllowance: 200000, studentCount: 46, bonus: 200000, status: "Chờ duyệt" },
  { id: "GV07", name: "Cô Trang", position: "Giáo viên TOEIC", foreignSessions: 15, localSessions: 15, supportAllowance: 900000, parkingAllowance: 300000, studentCount: 44, bonus: 450000, status: "Đang tính" },
  { id: "GV08", name: "Thầy Quân", position: "Giáo viên Foundation", foreignSessions: 11, localSessions: 19, supportAllowance: 700000, parkingAllowance: 300000, studentCount: 50, bonus: 350000, status: "Chờ duyệt" },
];

const INITIAL_ACADEMIC_SALARIES: AcademicSalary[] = [
  { id: "HV01", name: "Nguyễn Thu Hà", position: "Học vụ Đội Cấn", baseSalary: 8500000, closedStudents: 19, salesRevenue: 142000000, renewalRevenue: 96000000, renewalClasses: [
      { name: "Lớp ESL A", renewalRate: 0.035, amount: 52000000, note: "24/24" },
      { name: "Lớp IELTS B", renewalRate: 0.025, amount: 44000000, note: "22/22" },
    ], studentsLeft: 0, kpiBudget: 3000000, kpiPercent: 95, bonus: 1200000, status: "Đã duyệt" },
  { id: "HV02", name: "Trần Minh Anh", position: "Học vụ Hoàng Hoa Thám", baseSalary: 8200000, closedStudents: 14, salesRevenue: 105000000, renewalRevenue: 78000000, renewalClasses: [
      { name: "Lớp TOEIC 1", renewalRate: 0.04, amount: 32000000, note: "24/24" },
      { name: "Lớp Junior", renewalRate: 0.033, amount: 26000000, note: "20/24" },
      { name: "Lớp Basic", renewalRate: 0.02, amount: 20000000, note: "18/24" },
    ], studentsLeft: 1, kpiBudget: 2800000, kpiPercent: 88, bonus: 800000, status: "Chờ duyệt" },
  { id: "HV03", name: "Lê Khánh Vy", position: "Học vụ Ngọc Hà", baseSalary: 8000000, closedStudents: 9, salesRevenue: 68000000, renewalRevenue: 64000000, renewalClasses: [
      { name: "Lớp Kids", renewalRate: 0.045, amount: 34000000, note: "18/20" },
      { name: "Lớp Basic", renewalRate: 0.035, amount: 30000000, note: "16/18" },
    ], studentsLeft: 2, kpiBudget: 2500000, kpiPercent: 76, bonus: 600000, status: "Đang tính" },
  { id: "HV04", name: "Phạm Đức Anh", position: "Trưởng nhóm học vụ", baseSalary: 11000000, closedStudents: 22, salesRevenue: 178000000, renewalRevenue: 120000000, renewalClasses: [
      { name: "Lớp IELTS Pro", renewalRate: 0.05, amount: 66000000, note: "24/24" },
      { name: "Lớp Conversation", renewalRate: 0.04, amount: 54000000, note: "22/22" },
    ], studentsLeft: 3, kpiBudget: 4500000, kpiPercent: 103, bonus: 1500000, status: "Chờ duyệt" },
];

function calculateTeacherSalary(person: TeacherSalary, settings: TeacherSalarySettings) {
  const rateA = person.rateA ?? settings.rateA;
  const rateB = person.rateB ?? settings.rateB;
  const studentRate = person.studentRate ?? settings.studentRate;
  const foreignSalary = person.foreignSessions * rateA;
  const localSalary = person.localSessions * rateB;
  const studentSalary = person.studentCount * studentRate;
  const total = foreignSalary + localSalary + person.supportAllowance + person.parkingAllowance + studentSalary + person.bonus;
  return { rateA, rateB, studentRate, foreignSalary, localSalary, studentSalary, total };
}

function getSalesRate(closedStudents: number) {
  if (closedStudents <= 0) return 0;
  return closedStudents >= 17 ? 0.05 : 0.03;
}

function getRenewalRate(studentsLeft: number) {
  if (studentsLeft <= 0) return 0.01;
  if (studentsLeft === 1) return 0.008;
  if (studentsLeft === 2) return 0.005;
  return 0;
}

function calculateAcademicSalary(person: AcademicSalary) {
  const salesRate = getSalesRate(person.closedStudents);
  const renewalRate = 0.01;
  const salesSalary = person.salesRevenue * salesRate;
  const renewalSalary = person.renewalRevenue * renewalRate;
  const kpiSalary = person.kpiBudget * (person.kpiPercent / 100);
  const total = person.baseSalary + salesSalary + renewalSalary + kpiSalary + person.bonus;
  return { salesRate, renewalRate, salesSalary, renewalSalary, kpiSalary, total };
}

function SalaryStatusBadge({ status }: { status: SalaryStatus }) {
  return (
    <Badge
      className={cn(
        "whitespace-nowrap",
        status === "Đã duyệt" && "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
        status === "Chờ duyệt" && "bg-amber-100 text-amber-700 hover:bg-amber-100",
        status === "Đang tính" && "bg-blue-100 text-blue-700 hover:bg-blue-100",
      )}
    >
      {status}
    </Badge>
  );
}

function SalaryMoneyInput({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const formattedValue = value.toLocaleString("vi-VN");

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-slate-600">{label}</Label>
      <Input
        type="text"
        inputMode="numeric"
        disabled={disabled}
        value={formattedValue}
        onChange={(event) => {
          const raw = event.target.value.replace(/\D/g, "");
          onChange(Math.max(0, Number(raw) || 0));
        }}
      />
    </div>
  );
}

export function AdminSalaryReport() {
  const [teacherSettings, setTeacherSettings] = React.useState(INITIAL_TEACHER_SALARY_SETTINGS);
  const [teachers, setTeachers] = React.useState(INITIAL_TEACHER_SALARIES);
  const [academicStaff, setAcademicStaff] = React.useState(INITIAL_ACADEMIC_SALARIES);
  const [selected, setSelected] = React.useState<
    { kind: "teacher"; id: string } | { kind: "academic"; id: string } | null
  >(null);

  const selectedTeacher = selected?.kind === "teacher"
    ? teachers.find((person) => person.id === selected.id)
    : undefined;
  const selectedAcademic = selected?.kind === "academic"
    ? academicStaff.find((person) => person.id === selected.id)
    : undefined;

  const updateTeacher = (id: string, patch: Partial<TeacherSalary>) => {
    setTeachers((current) => current.map((person) => person.id === id ? { ...person, ...patch } : person));
  };
  const updateAcademic = (id: string, patch: Partial<AcademicSalary>) => {
    setAcademicStaff((current) => current.map((person) => person.id === id ? { ...person, ...patch } : person));
  };

  const teacherPayroll = teachers.reduce(
    (sum, person) => sum + calculateTeacherSalary(person, teacherSettings).total,
    0,
  );
  const academicPayroll = academicStaff.reduce(
    (sum, person) => sum + calculateAcademicSalary(person).total,
    0,
  );

  return (
    <div className="space-y-4">
      <Tabs defaultValue="teachers" className="space-y-4">
        <TabsList className="grid h-auto w-full max-w-md grid-cols-2 p-1">
          <TabsTrigger value="teachers">Giáo viên ({teachers.length})</TabsTrigger>
          <TabsTrigger value="academic">Học vụ ({academicStaff.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="teachers" className="space-y-4">
          <SalaryTable
            rows={teachers.map((person) => ({
              id: person.id,
              name: person.name,
              position: person.position,
              total: calculateTeacherSalary(person, teacherSettings).total,
              status: person.status,
            }))}
            onSelect={(id) => setSelected({ kind: "teacher", id })}
          />
        </TabsContent>

        <TabsContent value="academic">
          <SalaryTable
            rows={academicStaff.map((person) => ({
              id: person.id,
              name: person.name,
              position: person.position,
              total: calculateAcademicSalary(person).total,
              status: person.status,
            }))}
            onSelect={(id) => setSelected({ kind: "academic", id })}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto p-0">
          {selectedTeacher && (
            <TeacherSalaryDetail
              person={selectedTeacher}
              settings={teacherSettings}
              onChange={(patch) => updateTeacher(selectedTeacher.id, patch)}
            />
          )}
          {selectedAcademic && (
            <AcademicSalaryDetail
              person={selectedAcademic}
              onChange={(patch) => updateAcademic(selectedAcademic.id, patch)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SalaryTable({
  rows,
  onSelect,
}: {
  rows: { id: string; name: string; position: string; total: number; status: SalaryStatus }[];
  onSelect: (id: string) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[720px]">
            <TableHeader><TableRow>
              <TableHead className="w-24">Mã</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Vị trí</TableHead>
              <TableHead className="text-right">Tổng lương</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-28"></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Xem chi tiết lương của ${row.name}`}
                  className="cursor-pointer hover:bg-indigo-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
                  onClick={() => onSelect(row.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(row.id);
                    }
                  }}
                >
                  <TableCell className="text-slate-500">{row.id}</TableCell>
                  <TableCell className="font-semibold text-slate-900">{row.name}</TableCell>
                  <TableCell>{row.position}</TableCell>
                  <TableCell className="text-right font-bold text-indigo-600">{formatVND(row.total)}</TableCell>
                  <TableCell><SalaryStatusBadge status={row.status} /></TableCell>
                  <TableCell><Button size="sm" variant="outline">Chi tiết</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function SalaryBreakdownRow({ label, formula, value }: { label: string; formula?: string; value: number }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b py-3 last:border-0">
      <div><div className="font-medium text-slate-800">{label}</div>{formula && <div className="mt-0.5 text-xs text-slate-500">{formula}</div>}</div>
      <div className="shrink-0 font-semibold">{formatVND(value)}</div>
    </div>
  );
}

function TeacherSalaryDetail({
  person,
  settings,
  onChange,
}: {
  person: TeacherSalary;
  settings: TeacherSalarySettings;
  onChange: (patch: Partial<TeacherSalary>) => void;
}) {
  const calculation = calculateTeacherSalary(person, settings);
  return (
    <>
      <DialogHeader className="border-b bg-slate-50 px-6 py-5">
        <DialogTitle>Chi tiết lương · {person.name}</DialogTitle>
        <DialogDescription>{person.position} · Chỉnh thông số để tự động tính lại tổng lương.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-6 px-6 pb-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="grid content-start gap-3 grid-cols-1 xl:grid-cols-2">
          <SalaryMoneyInput label="Số buổi có GV nước ngoài" value={person.foreignSessions} onChange={(foreignSessions) => onChange({ foreignSessions })} />
          <SalaryMoneyInput label="Đơn giá A" value={calculation.rateA} onChange={(rateA) => onChange({ rateA })} />
          <SalaryMoneyInput label="Số buổi không có GV nước ngoài" value={person.localSessions} onChange={(localSessions) => onChange({ localSessions })} />
          <SalaryMoneyInput label="Đơn giá B" value={calculation.rateB} onChange={(rateB) => onChange({ rateB })} />
          <SalaryMoneyInput label="Phụ cấp hỗ trợ" value={person.supportAllowance} onChange={(supportAllowance) => onChange({ supportAllowance })} />
          <SalaryMoneyInput label="Tiền gửi xe" value={person.parkingAllowance} onChange={(parkingAllowance) => onChange({ parkingAllowance })} />
          <SalaryMoneyInput label="Thưởng" value={person.bonus} onChange={(bonus) => onChange({ bonus })} />
          <SalaryMoneyInput label="Tổng học sinh phụ trách" value={person.studentCount} onChange={(studentCount) => onChange({ studentCount })} />
          <SalaryMoneyInput label="Đơn giá / học sinh" value={calculation.studentRate} onChange={(studentRate) => onChange({ studentRate })} />
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Breakdown</div>
          <SalaryBreakdownRow label="Buổi có GV nước ngoài" formula={`${person.foreignSessions} × ${formatVND(calculation.rateA)}`} value={calculation.foreignSalary} />
          <SalaryBreakdownRow label="Buổi không có GV nước ngoài" formula={`${person.localSessions} × ${formatVND(calculation.rateB)}`} value={calculation.localSalary} />
          <SalaryBreakdownRow label="Phụ cấp hỗ trợ" value={person.supportAllowance} />
          <SalaryBreakdownRow label="Tiền gửi xe" value={person.parkingAllowance} />
          <SalaryBreakdownRow label="Thưởng" value={person.bonus} />
          <SalaryBreakdownRow label="Phụ cấp học sinh" formula={`${person.studentCount} × ${formatVND(calculation.studentRate)}`} value={calculation.studentSalary} />
          <div className="mt-3 flex items-center justify-between px-4 py-3">
            <span className="font-semibold">Tổng lương</span>
            <span className="text-2xl font-extrabold text-indigo-700">{formatVND(calculation.total)}</span>
          </div>
        </div>
      </div>
    </>
  );
}

function AcademicSalaryDetail({
  person,
  onChange,
}: {
  person: AcademicSalary;
  onChange: (patch: Partial<AcademicSalary>) => void;
}) {
  const calculation = calculateAcademicSalary(person);
  return (
    <>
      <DialogHeader className="border-b bg-slate-50 px-6 py-5">
        <DialogTitle>Chi tiết lương · {person.name}</DialogTitle>
        <DialogDescription>{person.position} · Các khoản thưởng được tính lại ngay khi thay đổi.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-6 px-6 pb-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="grid content-start gap-3 grid-cols-1 xl:grid-cols-2">
          <SalaryMoneyInput label="Lương cứng" value={person.baseSalary} onChange={(baseSalary) => onChange({ baseSalary })} />
          <SalaryMoneyInput label="Số học sinh chốt được tự động từ CRM (tuyển sinh)" value={person.closedStudents} disabled onChange={() => {}} />
          <SalaryMoneyInput label="Doanh số chốt mới" value={person.salesRevenue} disabled onChange={() => {}} />
          <SalaryMoneyInput label="Doanh thu tái tục" value={person.renewalRevenue} disabled onChange={() => {}} />
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs text-slate-600">Danh sách lớp tái tục</Label>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700">
              <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-3 border-b border-slate-200 bg-slate-100 px-3 py-2 text-xs uppercase tracking-[0.15em] text-slate-500">
                <span>Lớp</span>
                <span>Tỷ lệ tái tục</span>
                <span className="text-right">Số tiền</span>
              </div>
              {person.renewalClasses.length > 0 ? (
                <div className="divide-y divide-slate-200">
                  {person.renewalClasses.map((cls) => {
                    if (typeof cls === "string") {
                      return (
                        <div key={cls} className="grid grid-cols-[1.5fr_1fr_1fr] items-center gap-3 px-3 py-3">
                          <div>{cls}</div>
                          <div>—</div>
                          <div className="text-right font-semibold">—</div>
                        </div>
                      );
                    }

                    return (
                      <div key={cls.name} className="grid grid-cols-[1.5fr_1fr_1fr] items-center gap-3 px-3 py-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-slate-900">{cls.name}</div>
                          {cls.note ? <div className="text-xs text-slate-500">{cls.note}</div> : null}
                        </div>
                        <div>{Number.isFinite(cls.renewalRate) ? `${(cls.renewalRate * 100).toFixed(1)}%` : "—"}</div>
                        <div className="text-right font-semibold">{Number.isFinite(cls.amount) ? formatVND(cls.amount) : "—"}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-3 py-3">Chưa có lớp tái tục</div>
              )}
            </div>
          </div>
          <SalaryMoneyInput label="Định mức tiền KPI" value={person.kpiBudget} disabled onChange={() => {}} />
          <SalaryMoneyInput label="Thưởng" value={person.bonus} disabled onChange={() => {}} />
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs text-slate-600">% KPI đạt được tự động từ CRM (giao việc)</Label>
            <div className="flex items-center gap-3">
              <Input type="text" inputMode="numeric" value={person.kpiPercent.toString()} disabled className="!bg-slate-100" />
              <span className="font-semibold text-slate-600">%</span>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Breakdown</div>
          <SalaryBreakdownRow label="Lương cứng" value={person.baseSalary} />
          <SalaryBreakdownRow label="Lương doanh số" formula={`${person.closedStudents} học sinh · ${(calculation.salesRate * 100).toFixed(0)}% × ${formatVND(person.salesRevenue)}`} value={calculation.salesSalary} />
          <SalaryBreakdownRow
            label="Doanh thu tái tục"
            formula={`Các lớp: ${person.renewalClasses.map((cls) => cls.name).join(", ")}`}
            value={calculation.renewalSalary}
          />
          <SalaryBreakdownRow label="Thưởng KPI" formula={`${formatVND(person.kpiBudget)} × ${person.kpiPercent}%`} value={calculation.kpiSalary} />
          <SalaryBreakdownRow label="Thưởng" value={person.bonus} />
          <div className="mt-3 flex items-center justify-between px-4 py-4">
            <span className="font-semibold">Tổng lương</span>
            <span className="text-2xl font-extrabold text-indigo-700">{formatVND(calculation.total)}</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============== ADMISSIONS CRM ============== */
type LeadStatus = "Lead Mới" | "Fail" | "Đang Học Thử" | "Đã Chốt" | "Đang Tham Vấn" | "Chăm Sóc";
type LeadActivity = {
  id: string;
  at: string;
  by: string;
  action: string;
  note: string;
  attachment?: string;
};
type Lead = {
  id: string;
  source: string;
  parentName: string;
  phone: string;
  studentName: string;
  dob: string;
  grade: string;
  school: string;
  feature: string;
  status: LeadStatus;
  facility: string;
  step: 1 | 2 | 3;
  assignedTo?: string; // staff id
  // step 1
  assignDate?: string;
  assignBy?: string;
  tester?: string;
  consultant?: string;
  consultationDecision?: "test" | "no-test";
  testDate?: string;
  testCenter?: "Đội Cấn" | "Hoàng Hoa Thám" | "Ngọc Hà";
  testFileName?: string;
  testResult?: "Pending" | "Thành công";
  testNote?: string;
  // step 2
  trialClass?: string;
  trialNote?: string;
  placementType?: "existing" | "waitlist";
  closedClass?: string;
  waitlistNote?: string;
  // step 3
  feeStatus?: "Chưa thu" | "Thu một phần" | "Đã thu đủ";
  tuition?: string;
  paymentNote?: string;
  care1Date?: string; care1Note?: string;
  care2Date?: string; care2Note?: string;
  care3Date?: string; care3Note?: string;
  managerChecked?: boolean;
  failReason?: string;
  activities?: LeadActivity[];
};

type Staff = { id: string; name: string; facility: string };
const STAFF: Staff[] = [
  { id: "s1", name: "Nguyễn Thị Mai", facility: "ĐC" },
  { id: "s2", name: "Trần Văn Nam", facility: "ĐC" },
  { id: "s3", name: "Lê Thu Hà", facility: "NH" },
  { id: "s4", name: "Phạm Minh Tuấn", facility: "NH" },
  { id: "s5", name: "Đỗ Khánh Linh", facility: "HHT" },
  { id: "s6", name: "Vũ Quốc Bảo", facility: "HHT" },
];
const staffName = (id?: string) => STAFF.find((s) => s.id === id)?.name ?? "—";

type WorkTab = "admin" | "teacher" | "academic";
type WorkTaskStatus = "Mới" | "Đang xử lý" | "Hoàn thành" | "Quá hạn";
type WorkTask = {
  id: string;
  title: string;
  description: string;
  team: WorkTab;
  status: WorkTaskStatus;
  assignedTo?: string;
  dueDate: string;
  priority: "Cao" | "Trung bình" | "Thấp";
  category: string;
  requester: string;
};

type TaskAssignee = { id: string; name: string; team: WorkTab; role: string };
const TASK_TABS: { id: WorkTab; label: string }[] = [
  { id: "admin", label: "Admin" },
  { id: "teacher", label: "Giáo viên" },
  { id: "academic", label: "Học vụ" },
];
const TASK_STATUSES: WorkTaskStatus[] = ["Mới", "Đang xử lý", "Hoàn thành", "Quá hạn"];
const TASK_STATUS_BADGE: Record<WorkTaskStatus, string> = {
  "Mới": "bg-slate-100 text-slate-700 border-slate-200",
  "Đang xử lý": "bg-amber-100 text-amber-700 border-amber-200",
  "Hoàn thành": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Quá hạn": "bg-rose-100 text-rose-700 border-rose-200",
};
const TASK_ASSIGNEES: TaskAssignee[] = [
  { id: "a1", name: "Hà Anh", team: "admin", role: "Quản lý hành chính" },
  { id: "a2", name: "Minh Nhật", team: "admin", role: "Trợ lý hành chính" },
  { id: "t1", name: "Thảo Vy", team: "teacher", role: "Giáo viên tiếng Anh" },
  { id: "t2", name: "Quốc Bảo", team: "teacher", role: "Giáo viên Toán" },
  { id: "h1", name: "Khánh Linh", team: "academic", role: "Điều phối học vụ" },
  { id: "h2", name: "Ngọc Mai", team: "academic", role: "Chăm sóc học vụ" },
];
const taskAssigneeName = (id?: string) => TASK_ASSIGNEES.find((a) => a.id === id)?.name ?? "—";

const parseTaskDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};
const formatTaskDate = (value: string) => parseTaskDate(value).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
const taskDueLabel = (value: string, status: WorkTaskStatus) => {
  if (status === "Hoàn thành") return "Đã hoàn thành";
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = parseTaskDate(value);
  const diff = Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return `Quá hạn ${Math.abs(diff)} ngày`;
  if (diff === 0) return "Hạn hôm nay";
  return `Còn ${diff} ngày`;
};

const WORK_TASK_TEMPLATES: Omit<WorkTask, "id" | "dueDate" | "status" | "assignedTo">[] = [
  {
    title: "Điều phối lịch học bù",
    description: "Liên hệ phụ huynh và sắp xếp các buổi học bù cho học viên.",
    team: "admin",
    priority: "Cao",
    category: "Hành chính",
    requester: "Ban Giám đốc",
  },
  {
    title: "Cập nhật hợp đồng gia sư",
    description: "Hoàn thiện hồ sơ và điều chỉnh phụ cấp cho giáo viên mới.",
    team: "admin",
    priority: "Trung bình",
    category: "Hành chính",
    requester: "Phòng nhân sự",
  },
  {
    title: "Xác nhận danh sách lớp học thử",
    description: "Rà soát danh sách học viên và gửi thông báo xác nhận đến PHHS.",
    team: "teacher",
    priority: "Cao",
    category: "Giáo viên",
    requester: "Phòng tuyển sinh",
  },
  {
    title: "Chuẩn bị bài kiểm tra giữa kỳ",
    description: "Thiết kế đề kiểm tra và tải lên hệ thống cho các lớp Toán.",
    team: "teacher",
    priority: "Trung bình",
    category: "Giáo viên",
    requester: "Tổ chuyên môn",
  },
  {
    title: "Rà soát hồ sơ học vụ",
    description: "Kiểm tra thông tin học sinh mới và xác nhận lịch học.",
    team: "academic",
    priority: "Trung bình",
    category: "Học vụ",
    requester: "Ban học vụ",
  },
  {
    title: "Gọi chăm sóc học viên sau ghi danh",
    description: "Thu thập phản hồi phụ huynh và cập nhật nhật ký học vụ.",
    team: "academic",
    priority: "Cao",
    category: "Học vụ",
    requester: "Phòng dịch vụ",
  },
];

const WORK_TASKS: WorkTask[] = Array.from({ length: 30 }, (_, index) => {
  const template = WORK_TASK_TEMPLATES[index % WORK_TASK_TEMPLATES.length];
  const status = TASK_STATUSES[index % TASK_STATUSES.length];
  const assignedMap: Record<WorkTab, string[]> = {
    admin: ["a1", "a2"],
    teacher: ["t1", "t2"],
    academic: ["h1", "h2"],
  };
  const dueDay = 10 + (index % 21);
  const dueMonth = dueDay > 30 ? 7 : 6;
  const dueDate = dueMonth === 6 ? `2026-06-${String(dueDay).padStart(2, "0")}` : `2026-07-${String(dueDay - 30).padStart(2, "0")}`;
  return {
    id: `work-${index + 1}`,
    title: template.title + ` #${index + 1}`,
    description: template.description,
    team: template.team,
    status,
    assignedTo: assignedMap[template.team][index % 2],
    dueDate,
    priority: template.priority,
    category: template.category,
    requester: template.requester,
  };
});

const ALL_STATUSES: LeadStatus[] = ["Lead Mới", "Đang Tham Vấn", "Fail", "Đang Học Thử", "Đã Chốt", "Chăm Sóc"];
const SOURCES = ["Chị Liên", "Vãng lai", "Page", "Zalo OA", "Giới thiệu", "Tiktok"];
const FIRST_NAMES = ["Bảo An", "Gia Hưng", "Khánh Linh", "Minh Khôi", "Ngọc Mai", "Tuấn Kiệt", "Thảo Vy", "Hà My", "Quang Minh", "Tú Anh", "Đức Anh", "Phương Linh", "Hải Đăng", "Nhật Minh", "Bảo Châu", "Khôi Nguyên", "Thanh Trúc", "Gia Bảo", "Hoàng Long", "Thùy Dương"];
const LASTNAMES = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đỗ", "Bùi", "Đặng", "Ngô"];
const PARENTS = ["Mẹ Hương", "Bố Tùng", "Mẹ Dương", "Bố An", "Mẹ Linh", "Mẹ Khánh", "Bố Quang", "Mẹ Trang", "Bố Hải", "Mẹ Phượng"];
const GRADES = ["Mầm", "Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5"];
const SCHOOLS = ["TH Ba Đình", "TH Ngọc Hà", "TH Hoàng Diệu", "TH Kim Đồng", "TH Nguyễn Du", "TH Lý Thái Tổ", "TH Cát Linh", "MN Hoa Sen"];
const FEATURES = ["", "Mẹ không trả lời", "Học vào cuối tuần", "Đã học IELTS Junior", "Con nhút nhát", "Con tăng động", "Cần ưu đãi học phí", ""];
const TRIAL_CLASSES = ["Cam 31", "Cam 22", "Star 12", "Kindy 4", "Pre A1.2", "A1 Mover", "Flyers 3"];
const TUITIONS = ["1.520.000", "1.800.000", "2.200.000", "2.575.000", "3.100.000"];
const nowLabel = () => new Date().toLocaleString("vi-VN");
const formatAdmissionDate = (date: Date) =>
  `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
const parseAdmissionDate = (value?: string) => {
  if (!value) return undefined;
  const [day, month, year] = value.split("/").map(Number);
  if (!day || !month || !year) return undefined;
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

function generateLeads(): Lead[] {
  const leads: Lead[] = [];
  let counter = 1;
  STAFF.forEach((staff) => {
    ALL_STATUSES.forEach((status) => {
      for (let i = 0; i < 10; i++) {
        const seed = counter;
        const firstName = FIRST_NAMES[seed % FIRST_NAMES.length];
        const lastName = LASTNAMES[seed % LASTNAMES.length];
        const studentName = `${lastName} ${firstName}`;
        const phone = `09${String(10000000 + seed * 73 + staff.id.charCodeAt(1) * 1117).slice(0, 8)}`;
        const day = ((seed * 7) % 27) + 1;
        const month = ((seed * 3) % 12) + 1;
        const year = 2014 + (seed % 6);
        const dob = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
        const step: 1 | 2 | 3 =
          status === "Lead Mới" || status === "Đang Tham Vấn" || status === "Fail"
            ? 1
            : status === "Đang Học Thử"
            ? 2
            : 3;
        const base: Lead = {
          id: `L${String(counter).padStart(4, "0")}`,
          source: SOURCES[seed % SOURCES.length],
          parentName: PARENTS[seed % PARENTS.length],
          phone,
          studentName,
          dob,
          grade: GRADES[seed % GRADES.length],
          school: SCHOOLS[seed % SCHOOLS.length],
          feature: FEATURES[seed % FEATURES.length],
          status,
          facility: staff.facility,
          step,
          assignedTo: staff.id,
          testResult: status === "Lead Mới" || status === "Đang Tham Vấn" || status === "Fail" ? "Pending" : "Thành công",
        };
        if (step >= 2) {
          base.consultationDecision = seed % 2 === 0 ? "test" : "no-test";
          if (base.consultationDecision === "test") {
            base.testDate = `${String(((seed * 3) % 27) + 1).padStart(2, "0")}/05/2026`;
            base.testCenter = seed % 3 === 0 ? "Đội Cấn" : seed % 3 === 1 ? "Hoàng Hoa Thám" : "Ngọc Hà";
            base.testFileName = `de-test-${base.id}.pdf`;
            base.testNote = "Đã hoàn thành bài test đầu vào.";
          }
          base.trialClass = TRIAL_CLASSES[seed % TRIAL_CLASSES.length];
          base.trialNote = "Học viên tham gia tốt, phù hợp với lớp.";
          base.tuition = TUITIONS[seed % TUITIONS.length];
        }
        if (step === 3) {
          base.placementType = seed % 4 === 0 ? "waitlist" : "existing";
          base.closedClass = base.trialClass;
          base.feeStatus = seed % 3 === 0 ? "Thu một phần" : "Đã thu đủ";
          base.paymentNote = "Đã xác nhận tình trạng học phí với phụ huynh.";
          if (status === "Chăm Sóc") {
            base.care1Date = `${String(((seed * 5) % 27) + 1).padStart(2, "0")}/06/2026`;
            base.care1Note = "PH hài lòng, con thích lớp.";
          }
        }
        base.activities = [
          {
            id: `activity-${base.id}`,
            at: "01/05/2026 09:00",
            by: staff.name,
            action: "Tiếp nhận lead",
            note: "Bắt đầu tham vấn phụ huynh.",
          },
        ];
        leads.push(base);
        counter++;
      }
    });
  });
  return leads;
}

const FACILITIES = ["ĐC", "NH", "HHT"];
function generateUnassignedLeads(): Lead[] {
  const leads: Lead[] = [];
  for (let i = 0; i < 10; i++) {
    const seed = 9000 + i;
    const firstName = FIRST_NAMES[seed % FIRST_NAMES.length];
    const lastName = LASTNAMES[seed % LASTNAMES.length];
    const phone = `09${String(20000000 + seed * 137).slice(0, 8)}`;
    const day = ((seed * 7) % 27) + 1;
    const month = ((seed * 3) % 12) + 1;
    const year = 2014 + (seed % 6);
    leads.push({
      id: `U${String(i + 1).padStart(4, "0")}`,
      source: SOURCES[seed % SOURCES.length],
      parentName: PARENTS[seed % PARENTS.length],
      phone,
      studentName: `${lastName} ${firstName}`,
      dob: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`,
      grade: GRADES[seed % GRADES.length],
      school: SCHOOLS[seed % SCHOOLS.length],
      feature: FEATURES[seed % FEATURES.length],
      status: "Lead Mới",
      facility: FACILITIES[i % FACILITIES.length],
      step: 1,
      testResult: "Pending",
    });
  }
  return leads;
}

const INITIAL_LEADS: Lead[] = [...generateUnassignedLeads(), ...generateLeads()];

const STAGES: { key: 1 | 2 | 3 | 0; title: string; statuses: LeadStatus[]; color: string; ring: string; chip: string; dot: string }[] = [
  { key: 0, title: "Lead Mới", statuses: ["Lead Mới"], color: "bg-slate-50", ring: "border-slate-200", chip: "bg-slate-100 text-slate-700 border-slate-200", dot: "bg-slate-400" },
  { key: 1, title: "Bước 1: Test & Tham vấn", statuses: ["Đang Tham Vấn", "Fail"], color: "bg-orange-50/60", ring: "border-orange-200", chip: "bg-orange-100 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  { key: 2, title: "Bước 2: Học thử & Chốt lớp", statuses: ["Đang Học Thử"], color: "bg-amber-50/60", ring: "border-amber-200", chip: "bg-amber-100 text-amber-800 border-amber-200", dot: "bg-amber-500" },
  { key: 3, title: "Bước 3: Chăm sóc 1 tháng", statuses: ["Đã Chốt", "Chăm Sóc"], color: "bg-teal-50/60", ring: "border-teal-200", chip: "bg-teal-100 text-teal-700 border-teal-200", dot: "bg-teal-500" },
];

const STATUS_BADGE: Record<LeadStatus, string> = {
  "Lead Mới": "bg-slate-100 text-slate-700 border-slate-200",
  "Đang Tham Vấn": "bg-orange-100 text-orange-700 border-orange-200",
  "Fail": "bg-rose-100 text-rose-700 border-rose-200",
  "Đang Học Thử": "bg-amber-100 text-amber-800 border-amber-200",
  "Đã Chốt": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Chăm Sóc": "bg-teal-100 text-teal-700 border-teal-200",
};

const EMPTY_LEAD: Lead = {
  id: "", source: "", parentName: "", phone: "", studentName: "", dob: "", grade: "", school: "",
  feature: "", status: "Lead Mới", facility: "ĐC", step: 1, testResult: "Pending",
};

export function AdminAdmissions() {
  const [leads, setLeads] = React.useState<Lead[]>(INITIAL_LEADS);
  const [view, setView] = React.useState<"kanban" | "list">("kanban");
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<LeadStatus | "all">("all");
  const [assigneeFilter, setAssigneeFilter] = React.useState<string>("all");
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Lead>(EMPTY_LEAD);
  const [activeStep, setActiveStep] = React.useState<1 | 2 | 3>(1);
  const [mode, setMode] = React.useState<"admin" | "staff">("admin");
  const [currentStaffId, setCurrentStaffId] = React.useState<string>(STAFF[0].id);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (mode === "staff" && l.assignedTo !== currentStaffId) return false;
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (mode === "admin" && assigneeFilter !== "all") {
        if (assigneeFilter === "unassigned" ? !!l.assignedTo : l.assignedTo !== assigneeFilter) return false;
      }
      if (!q) return true;
      return l.studentName.toLowerCase().includes(q) || l.phone.includes(q) || l.parentName.toLowerCase().includes(q);
    });
  }, [leads, search, statusFilter, assigneeFilter, mode, currentStaffId]);

  const matchesSearch = React.useCallback((lead: Lead) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return lead.studentName.toLowerCase().includes(q)
      || lead.phone.includes(q)
      || lead.parentName.toLowerCase().includes(q);
  }, [search]);

  const statusCountBase = React.useMemo(() => leads.filter((lead) => {
    if (mode === "staff" && lead.assignedTo !== currentStaffId) return false;
    if (mode === "admin" && assigneeFilter !== "all") {
      if (assigneeFilter === "unassigned" ? !!lead.assignedTo : lead.assignedTo !== assigneeFilter) return false;
    }
    return matchesSearch(lead);
  }), [leads, mode, currentStaffId, assigneeFilter, matchesSearch]);

  const assigneeCountBase = React.useMemo(() => leads.filter((lead) => {
    if (statusFilter !== "all" && lead.status !== statusFilter) return false;
    return matchesSearch(lead);
  }), [leads, statusFilter, matchesSearch]);

  const statusCounts = React.useMemo(() => Object.fromEntries(
    ALL_STATUSES.map((status) => [status, statusCountBase.filter((lead) => lead.status === status).length]),
  ) as Record<LeadStatus, number>, [statusCountBase]);

  const assigneeCounts = React.useMemo(() => Object.fromEntries(
    STAFF.map((staff) => [staff.id, assigneeCountBase.filter((lead) => lead.assignedTo === staff.id).length]),
  ) as Record<string, number>, [assigneeCountBase]);

  const unassignedCount = assigneeCountBase.filter((lead) => !lead.assignedTo).length;

  const openNew = () => {
    setEditing({ ...EMPTY_LEAD, id: String(Date.now()) });
    setActiveStep(1);
    setOpen(true);
  };
  const openEdit = (l: Lead) => {
    setEditing({ ...l });
    setActiveStep(l.step);
    setOpen(true);
  };
  const upsert = (l: Lead) => {
    setLeads((prev) => prev.some((p) => p.id === l.id) ? prev.map((p) => p.id === l.id ? l : p) : [l, ...prev]);
  };
  const handleSave = (l: Lead, msg = "Đã lưu thay đổi") => {
    upsert(l);
    setEditing(l);
    toast.success(msg);
  };
  const assignLead = (leadId: string, staffId: string) => {
    setLeads((prev) => prev.map((p) => p.id === leadId ? { ...p, assignedTo: staffId } : p));
    toast.success(`Đã phân lead cho ${staffName(staffId)}`);
  };

  const byStage = (stageKey: 0 | 1 | 2 | 3) => {
    const stage = STAGES.find((s) => s.key === stageKey)!;
    return filtered.filter((l) => stage.statuses.includes(l.status));
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Mode tabs */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as "admin" | "staff")}>
        <div className="flex flex-wrap items-center gap-3">
          <TabsList>
            <TabsTrigger value="admin" className="gap-1.5"><Users className="h-3.5 w-3.5" /> Admin</TabsTrigger>
            <TabsTrigger value="staff" className="gap-1.5"><Users className="h-3.5 w-3.5" /> Nhân sự</TabsTrigger>
          </TabsList>
          {mode === "staff" && (
            <Select value={currentStaffId} onValueChange={setCurrentStaffId}>
              <SelectTrigger className="h-9 w-[260px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["ĐC", "NH", "HHT"].map((fac) => (
                  <React.Fragment key={fac}>
                    <div className="px-2 py-1 text-[11px] font-semibold uppercase text-slate-400">Cơ sở {fac}</div>
                    {STAFF.filter((s) => s.facility === fac).map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </React.Fragment>
                ))}
              </SelectContent>
            </Select>
          )}
          {mode === "staff" && (
            <Badge variant="secondary" className="gap-1">
              <MapPin className="h-3 w-3" /> Cơ sở {STAFF.find((s) => s.id === currentStaffId)?.facility}
            </Badge>
          )}
        </div>
      </Tabs>

      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={mode === "staff" ? "Tìm trong lead của tôi..." : "Tìm theo tên học viên hoặc số điện thoại..."}
            className="pl-9 h-9"
          />
        </div>
        <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5">
          <button
            onClick={() => setView("kanban")}
            className={cn("px-3 h-8 rounded-[5px] text-sm flex items-center gap-1.5 transition-colors", view === "kanban" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            <LayoutGrid className="h-4 w-4" /> Kanban
          </button>
          <button
            onClick={() => setView("list")}
            className={cn("px-3 h-8 rounded-[5px] text-sm flex items-center gap-1.5 transition-colors", view === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            <ListIcon className="h-4 w-4" /> Danh sách
          </button>
        </div>
        {view === "list" && (
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as LeadStatus | "all")}>
            <SelectTrigger className="h-9 w-[210px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><FilterOptionCount label="Tất cả trạng thái" count={statusCountBase.length} /></SelectItem>
              {ALL_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  <FilterOptionCount label={status} count={statusCounts[status]} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {view === "list" && mode === "admin" && (
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="h-9 w-[250px]">
              <SelectValue placeholder="Phụ trách" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><FilterOptionCount label="Tất cả phụ trách" count={assigneeCountBase.length} /></SelectItem>
              <SelectItem value="unassigned"><FilterOptionCount label="Chưa phân" count={unassignedCount} /></SelectItem>
              {["ĐC", "NH", "HHT"].map((fac) => (
                <React.Fragment key={fac}>
                  <div className="px-2 py-1 text-[11px] font-semibold uppercase text-slate-400">Cơ sở {fac}</div>
                  {STAFF.filter((s) => s.facility === fac).map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <FilterOptionCount label={s.name} count={assigneeCounts[s.id] ?? 0} />
                    </SelectItem>
                  ))}
                </React.Fragment>
              ))}
            </SelectContent>
          </Select>
        )}
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="secondary" className="gap-1"><Users className="h-3 w-3" /> {filtered.length} lead</Badge>
          {mode === "admin" && (
            <Button onClick={openNew} className="bg-teal-600 hover:bg-teal-700 text-white gap-1.5">
              <Plus className="h-4 w-4" /> Tạo Lead Mới
            </Button>
          )}
        </div>
      </div>

      {view === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {STAGES.map((stage) => {
            const items = byStage(stage.key);
            return (
              <div key={stage.key} className={cn("rounded-lg border", stage.ring, stage.color, "flex flex-col min-h-[60vh]")}>
                <div className="px-3.5 py-3 flex items-center gap-2 border-b border-slate-200/70">
                  <span className={cn("h-2 w-2 rounded-full", stage.dot)} />
                  <div className="font-semibold text-sm text-slate-800 flex-1">{stage.title}</div>
                  <Badge variant="outline" className={cn("h-5 px-1.5 text-[11px] font-medium", stage.chip)}>
                    {items.length}
                  </Badge>
                </div>
                <div className="p-2.5 space-y-2.5 flex-1 overflow-y-auto">
                  {items.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => openEdit(l)}
                      className="w-full text-left bg-white rounded-md border border-slate-200 p-3 hover:border-teal-400 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-sm text-slate-900 line-clamp-1">{l.studentName || "—"}</div>
                        <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5 font-medium shrink-0", STATUS_BADGE[l.status])}>{l.status}</Badge>
                      </div>
                      <div className="mt-1.5 space-y-1 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-slate-400" /> {l.phone} <span className="text-slate-400">·</span> {l.parentName}</div>
                        <div className="flex items-center gap-1.5"><SchoolIcon className="h-3 w-3 text-slate-400" /> {l.grade} <span className="text-slate-400">·</span> {l.school}</div>
                        <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-slate-400" /> Cơ sở {l.facility}</div>
                        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 mt-1.5">
                          <Users className="h-3 w-3 text-slate-400" />
                          <span className={cn("font-medium", l.assignedTo ? "text-slate-700" : "text-rose-500")}>
                            {l.assignedTo ? staffName(l.assignedTo) : "Chưa phân"}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                  {items.length === 0 && (
                    <div className="text-center text-xs text-slate-400 py-10">Chưa có lead</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Học viên</TableHead>
                  <TableHead>PHHS</TableHead>
                  <TableHead>SĐT</TableHead>
                  <TableHead>Lớp</TableHead>
                  <TableHead>Trường</TableHead>
                  <TableHead>Cơ sở</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Phụ trách</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((l) => (
                  <TableRow key={l.id} className="cursor-pointer" onClick={() => openEdit(l)}>
                    <TableCell className="font-medium">{l.studentName}</TableCell>
                    <TableCell>{l.parentName}</TableCell>
                    <TableCell>{l.phone}</TableCell>
                    <TableCell>{l.grade}</TableCell>
                    <TableCell>{l.school}</TableCell>
                    <TableCell>{l.facility}</TableCell>
                    <TableCell><Badge variant="outline" className={cn("text-[10px] font-medium", STATUS_BADGE[l.status])}>{l.status}</Badge></TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {mode === "admin" ? (
                        <Select value={l.assignedTo ?? ""} onValueChange={(v) => assignLead(l.id, v)}>
                          <SelectTrigger className="h-8 w-[170px] text-xs">
                            <SelectValue placeholder="Chưa phân" />
                          </SelectTrigger>
                          <SelectContent>
                            {STAFF.map((s) => (
                              <SelectItem key={s.id} value={s.id} className="text-xs">{s.name} <span className="text-slate-400">· {s.facility}</span></SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-xs">{staffName(l.assignedTo)}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEdit(l); }}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={9} className="text-center text-slate-400 py-8">Không có lead phù hợp</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dialog */}
      <LeadDialog
        open={open}
        onOpenChange={setOpen}
        lead={editing}
        setLead={setEditing}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        onSave={handleSave}
        staff={STAFF}
        canAssign={mode === "admin"}
      />
    </div>
  );
}

export function AdminWorkManagement() {
  const [tasks, setTasks] = React.useState<WorkTask[]>(WORK_TASKS);
  const [search, setSearch] = React.useState("");
  const [dueFilter, setDueFilter] = React.useState<"all" | "onTime" | "overdue">("all");
  const [requesterFilter, setRequesterFilter] = React.useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = React.useState<string>("all");
  const [sortOrder, setSortOrder] = React.useState<"nearest" | "furthest">("nearest");
  const [selectedTask, setSelectedTask] = React.useState<WorkTask | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  const taskDueStatus = React.useCallback((task: WorkTask) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return parseTaskDate(task.dueDate).getTime() < now.getTime() ? "overdue" : "onTime";
  }, []);

  const requesterOptions = React.useMemo(
    () => Array.from(new Set(tasks.map((task) => task.requester))),
    [tasks],
  );

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks
      .filter((task) => {
        if (dueFilter !== "all" && taskDueStatus(task) !== dueFilter) return false;
        if (requesterFilter !== "all" && task.requester !== requesterFilter) return false;
        if (assigneeFilter !== "all" && task.assignedTo !== assigneeFilter) return false;
        if (!query) return true;
        return task.title.toLowerCase().includes(query)
          || task.description.toLowerCase().includes(query)
          || task.category.toLowerCase().includes(query)
          || task.requester.toLowerCase().includes(query)
          || taskAssigneeName(task.assignedTo).toLowerCase().includes(query);
      })
      .sort((a, b) => {
        const diff = parseTaskDate(a.dueDate).getTime() - parseTaskDate(b.dueDate).getTime();
        return sortOrder === "nearest" ? diff : -diff;
      });
  }, [tasks, search, dueFilter, requesterFilter, assigneeFilter, sortOrder, taskDueStatus]);

  const overdueCount = tasks.filter((task) => task.status === "Quá hạn").length;
  const openCount = tasks.filter((task) => task.status === "Mới" || task.status === "Đang xử lý").length;
  const doneCount = tasks.filter((task) => task.status === "Hoàn thành").length;

  const updateTaskStatus = (taskId: string, newStatus: WorkTaskStatus) => {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: newStatus } : t));
    toast.success("Đã cập nhật trạng thái nhiệm vụ");
    setDetailOpen(false);
  };

  const openDetail = (task: WorkTask) => {
    setSelectedTask(task);
    setDetailOpen(true);
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col space-y-5 animate-fade-in overflow-hidden">
      <div className="hidden" />

      <div className="grid gap-3 lg:grid-cols-[minmax(0,_1fr)_220px_220px_220px_220px] items-center">
        <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9 h-9"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm theo tiêu đề, mô tả, người giao, người phụ trách..."
            />
          </div>
        </div>

        <Select value={dueFilter} onValueChange={(value) => setDueFilter(value as "all" | "onTime" | "overdue")}> 
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder="Tình trạng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="onTime">Đúng hạn</SelectItem>
            <SelectItem value="overdue">Trễ hạn</SelectItem>
          </SelectContent>
        </Select>

        <Select value={requesterFilter} onValueChange={setRequesterFilter}>
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder="Người giao" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả người giao</SelectItem>
            {requesterOptions.map((name) => (
              <SelectItem key={name} value={name}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder="Người nhận" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả người nhận</SelectItem>
            {TASK_ASSIGNEES.map((assignee) => (
              <SelectItem key={assignee.id} value={assignee.id}>{assignee.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "nearest" | "furthest")}> 
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder="Deadline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nearest">Deadline gần nhất</SelectItem>
            <SelectItem value="furthest">Deadline xa nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden min-h-0">
        <CardHeader>
          <CardTitle className="text-sm">Danh sách tất cả nhiệm vụ</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 p-0 overflow-hidden">
          <div className="flex-1 min-h-0 max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-none">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nhiệm vụ</TableHead>
                  <TableHead>Người giao</TableHead>
                  <TableHead>Người phụ trách</TableHead>
                  <TableHead>Độ ưu tiên</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {filtered.map((task) => (
                <TableRow key={task.id} className="group hover:bg-slate-50 transition-colors">
                  <TableCell>
                    <div className="text-sm font-semibold text-slate-900">{task.title}</div>
                    <div className="text-xs text-slate-500">{task.category} · {task.description}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-slate-900">{task.requester}</div>
                  </TableCell>
                  <TableCell className="text-sm">{taskAssigneeName(task.assignedTo)}</TableCell>
                  <TableCell className="text-sm">{task.priority}</TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{formatTaskDate(task.dueDate)}</div>
                    <div className="text-xs text-slate-500">{taskDueLabel(task.dueDate, task.status)}</div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className={TASK_STATUS_BADGE[task.status]}>{task.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openDetail(task)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-400 py-10">Không có nhiệm vụ phù hợp.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* Task Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
            <DialogDescription>{selectedTask?.description}</DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">Người giao</div>
                  <div className="text-sm font-medium text-slate-900">{selectedTask.requester}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">Người phụ trách</div>
                  <div className="text-sm font-medium text-slate-900">{taskAssigneeName(selectedTask.assignedTo)}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">Độ ưu tiên</div>
                  <div className="text-sm font-medium text-slate-900">{selectedTask.priority}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">Deadline</div>
                  <div className="text-sm font-medium text-slate-900">{formatTaskDate(selectedTask.dueDate)}</div>
                </div>
              </div>
              
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Cập nhật trạng thái</div>
                <div className="grid grid-cols-2 gap-2">
                  {TASK_STATUSES.map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={selectedTask.status === status ? "default" : "outline"}
                      className={selectedTask.status === status ? "bg-teal-600 hover:bg-teal-700" : ""}
                      onClick={() => updateTaskStatus(selectedTask.id, status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-blue-50 p-3 text-xs text-blue-900">
                <div className="font-semibold mb-1">Thông báo:</div>
                {selectedTask.status === "Quá hạn" && "🔴 Nhiệm vụ này đã vượt quá deadline, hãy cập nhật trạng thái sớm"}
                {selectedTask.status === "Mới" && "📌 Chưa bắt đầu xử lý"}
                {selectedTask.status === "Đang xử lý" && "⏳ Đang thực hiện, hãy cố gắng hoàn thành đúng deadline"}
                {selectedTask.status === "Hoàn thành" && "✅ Đã hoàn thành thành công"}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


function FilterOptionCount({ label, count }: { label: string; count: number }) {
  return (
    <span className="inline-flex min-w-[165px] items-center justify-between gap-4 pr-3">
      <span>{label}</span>
      <span className="font-semibold tabular-nums text-rose-600">{count}</span>
    </span>
  );
}

function LeadDialog({ open, onOpenChange, lead, setLead, activeStep, setActiveStep, onSave, staff, canAssign }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lead: Lead;
  setLead: (l: Lead) => void;
  activeStep: 1 | 2 | 3;
  setActiveStep: (s: 1 | 2 | 3) => void;
  onSave: (l: Lead, msg?: string) => void;
  staff: Staff[];
  canAssign: boolean;
}) {
  const update = <K extends keyof Lead>(k: K, v: Lead[K]) => setLead({ ...lead, [k]: v });
  const isEmpty = !lead.studentName && !lead.parentName;
  const [activityNote, setActivityNote] = React.useState("");

  React.useEffect(() => {
    setActivityNote("");
  }, [lead.id]);

  const withActivity = (current: Lead, action: string, note: string, attachment?: string): Lead => ({
    ...current,
    activities: [
      {
        id: `${Date.now()}-${Math.random()}`,
        at: nowLabel(),
        by: staffName(current.assignedTo) === "—" ? "Admin" : staffName(current.assignedTo),
        action,
        note,
        attachment,
      },
      ...(current.activities ?? []),
    ],
  });

  const addManualActivity = () => {
    if (!activityNote.trim()) {
      toast.error("Vui lòng nhập nội dung ghi chú");
      return;
    }
    const next = withActivity(lead, "Ghi chú", activityNote.trim());
    setActivityNote("");
    onSave(next, "Đã thêm ghi chú");
  };

  const toTrial = () => {
    if (!lead.consultationDecision) {
      toast.error("Vui lòng chọn phụ huynh có test đầu vào hay không");
      return;
    }
    if (lead.consultationDecision === "test") {
      if (!lead.testDate || !lead.testCenter || !lead.testFileName) {
        toast.error("Vui lòng nhập ngày test, trung tâm test và tải kết quả test");
        return;
      }
      if (lead.testResult !== "Thành công") {
        toast.error("Chỉ chuyển sang học thử sau khi đã trả kết quả test");
        return;
      }
    }
    const note = lead.consultationDecision === "test"
      ? `Đã hoàn tất test đầu vào ngày ${lead.testDate} tại ${lead.testCenter}. ${lead.testNote || "Đã trả kết quả."}`
      : "Phụ huynh quyết định không test đầu vào.";
    const next = withActivity(
      { ...lead, step: 2, status: "Đang Học Thử" },
      "Chuyển sang học thử",
      note,
      lead.testFileName,
    );
    onSave(next, "Đã chuyển sang Học thử");
    setActiveStep(2);
  };

  const markFail = () => {
    if (activeStep === 3 || lead.step === 3) {
      toast.error("Lead đã sang bước Học phí & Chăm sóc nên không thể đánh dấu Fail");
      return;
    }
    if (!lead.failReason?.trim()) {
      toast.error("Vui lòng nhập lý do Fail");
      return;
    }
    const next = withActivity(
      { ...lead, status: "Fail" },
      "Đánh dấu Fail",
      lead.failReason.trim(),
    );
    onSave(next, "Đã đánh dấu Fail");
  };

  const confirmClose = () => {
    if (!lead.trialClass?.trim()) {
      toast.error("Vui lòng chọn lớp học thử");
      return;
    }
    if (!lead.placementType) {
      toast.error("Vui lòng chọn gán lớp có sẵn hoặc danh sách chờ");
      return;
    }
    if (lead.placementType === "existing" && !lead.closedClass) {
      toast.error("Vui lòng chọn lớp chính thức");
      return;
    }
    const placementNote = lead.placementType === "existing"
      ? `Đã gán vào lớp ${lead.closedClass}.`
      : `Đã đưa vào danh sách chờ. ${lead.waitlistNote || ""}`.trim();
    const next = withActivity(
      { ...lead, step: 3, status: "Đã Chốt", feeStatus: lead.feeStatus ?? "Chưa thu" },
      "Chốt lớp",
      `${placementNote} ${lead.trialNote || ""}`.trim(),
    );
    onSave(next, "Đã chốt lớp");
    setActiveStep(3);
  };

  const recordPayment = () => {
    if (!lead.feeStatus || lead.feeStatus === "Chưa thu" || !lead.tuition?.trim()) {
      toast.error("Vui lòng chọn tình trạng đã thu và nhập số tiền");
      return;
    }
    const next = withActivity(
      lead,
      "Thu học phí",
      `${lead.feeStatus}: ${lead.tuition} VNĐ. ${lead.paymentNote || ""}`.trim(),
    );
    onSave(next, "Đã ghi nhận thu học phí");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-[1500px] h-[96vh] max-h-[96vh] p-0 gap-0 overflow-hidden flex flex-col [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        <DialogHeader className="px-5 py-3 border-b border-slate-200 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-teal-100 text-teal-700 grid place-content-center font-bold">
              {(lead.studentName || "L").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base">
                {isEmpty ? "Thêm Lead Mới" : lead.studentName}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {isEmpty ? "Điền thông tin để bắt đầu quy trình tuyển sinh" : `${lead.parentName} · ${lead.phone}`}
              </DialogDescription>
            </div>
            <Badge variant="outline" className={cn("text-[11px] font-medium", STATUS_BADGE[lead.status])}>{lead.status}</Badge>
          </div>

          {/* Assignment */}
          <div className="mt-2 flex items-center gap-2 text-xs">
            <Users className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-slate-500">Phụ trách:</span>
            {canAssign ? (
              <Select value={lead.assignedTo ?? ""} onValueChange={(v) => update("assignedTo", v)}>
                <SelectTrigger className="h-7 w-[220px] text-xs">
                  <SelectValue placeholder="Chưa phân" />
                </SelectTrigger>
                <SelectContent>
                  {staff.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="text-xs">{s.name} <span className="text-slate-400">· {s.facility}</span></SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="font-medium text-slate-700">{staff.find((s) => s.id === lead.assignedTo)?.name ?? "Chưa phân"}</span>
            )}
          </div>

          {/* Stepper */}
          <div className="mt-3 flex items-center gap-2">
            {[1, 2, 3].map((s, idx) => {
              const reached = lead.step >= s || activeStep >= s;
              const active = activeStep === s;
              return (
                <React.Fragment key={s}>
                  <div className={cn("flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                    active ? "bg-teal-600 text-white" : reached ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500")}
                  >
                    <span className={cn("h-5 w-5 rounded-full grid place-content-center text-[11px] font-bold",
                      active ? "bg-white text-teal-700" : reached ? "bg-teal-600 text-white" : "bg-slate-300 text-white")}>{s}</span>
                    {s === 1 ? "Tham vấn & Test" : s === 2 ? "Học thử & Chốt lớp" : "Học phí & Chăm sóc"}
                  </div>
                  {idx < 2 && <div className={cn("flex-1 h-0.5 rounded", reached && (lead.step > s || activeStep > s) ? "bg-teal-400" : "bg-slate-200")} />}
                </React.Fragment>
              );
            })}
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] overflow-hidden">
        <Tabs value={String(activeStep)} onValueChange={(v) => setActiveStep(Number(v) as 1 | 2 | 3)} className="min-w-0 flex flex-col overflow-hidden">
          <TabsList className="mx-4 mt-3 grid grid-cols-3 w-auto">
            <TabsTrigger value="1">Bước 1</TabsTrigger>
            <TabsTrigger value="2">Bước 2</TabsTrigger>
            <TabsTrigger value="3">Bước 3</TabsTrigger>
          </TabsList>

          {/* TAB 1 */}
          <TabsContent value="1" className="flex-1 overflow-y-auto px-4 py-2 mt-0 space-y-2.5 [&_input]:h-8 [&_button[role=combobox]]:h-8 [&_label]:text-xs [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                <h3 className="text-sm font-semibold text-slate-800">Thông tin học viên</h3>
              </div>
              <div className="grid grid-cols-4 gap-x-2.5 gap-y-2">
                <Field label="Nguồn data">
                  <Select value={lead.source} onValueChange={(v) => update("source", v)}>
                    <SelectTrigger><SelectValue placeholder="Chọn nguồn" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chị Liên">Chị Liên</SelectItem>
                      <SelectItem value="Page">Page</SelectItem>
                      <SelectItem value="Vãng lai">Vãng lai</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Họ tên PHHS"><Input value={lead.parentName} onChange={(e) => update("parentName", e.target.value)} placeholder="VD: Mẹ An" /></Field>
                <Field label="SĐT"><Input value={lead.phone} onChange={(e) => update("phone", e.target.value)} placeholder="09xxxxxxxx" /></Field>
                <Field label="Họ tên học sinh"><Input value={lead.studentName} onChange={(e) => update("studentName", e.target.value)} /></Field>
                <Field label="Ngày sinh"><Input type="text" value={lead.dob} onChange={(e) => update("dob", e.target.value)} placeholder="dd/mm/yyyy" /></Field>
                <Field label="Lớp">
                  <Select value={lead.grade} onValueChange={(v) => update("grade", v)}>
                    <SelectTrigger><SelectValue placeholder="Chọn lớp" /></SelectTrigger>
                    <SelectContent>
                      {["Mầm non","Lớp 1","Lớp 2","Lớp 3","Lớp 4","Lớp 5","Lớp 6","Lớp 7","Lớp 8","Lớp 9"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Trường"><Input value={lead.school} onChange={(e) => update("school", e.target.value)} /></Field>
                <Field label="Đặc điểm"><Input value={lead.feature} onChange={(e) => update("feature", e.target.value)} placeholder="Ghi chú ngắn..." /></Field>
              </div>
            </div>

            <section className="rounded-lg border border-orange-200 bg-orange-50/40 p-2.5 space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Quyết định sau tham vấn</h3>
                  <p className="text-[11px] text-slate-500">Chọn test đầu vào hoặc chuyển thẳng sang học thử.</p>
                </div>
              <div className="grid w-[480px] grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => update("consultationDecision", "test")}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-left transition-colors",
                    lead.consultationDecision === "test" ? "border-teal-500 bg-white ring-1 ring-teal-500" : "border-slate-200 bg-white hover:border-slate-300",
                  )}
                >
                  <div className="font-medium text-sm">Test đầu vào</div>
                </button>
                <button
                  type="button"
                  onClick={() => update("consultationDecision", "no-test")}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-left transition-colors",
                    lead.consultationDecision === "no-test" ? "border-teal-500 bg-white ring-1 ring-teal-500" : "border-slate-200 bg-white hover:border-slate-300",
                  )}
                >
                  <div className="font-medium text-sm">Không test</div>
                </button>
              </div>
              </div>

              {lead.consultationDecision === "test" && (
                <div className="grid grid-cols-5 gap-2 border-t border-orange-200 pt-2.5">
                  <Field label="Ngày test">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn("w-full justify-start bg-white font-normal", !lead.testDate && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {lead.testDate || "Chọn ngày test"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarUI
                          mode="single"
                          selected={parseAdmissionDate(lead.testDate)}
                          onSelect={(date) => update("testDate", date ? formatAdmissionDate(date) : "")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                  <Field label="Trung tâm test">
                    <Select value={lead.testCenter ?? ""} onValueChange={(v) => update("testCenter", v as Lead["testCenter"])}>
                      <SelectTrigger><SelectValue placeholder="Chọn trung tâm" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Đội Cấn">Đội Cấn</SelectItem>
                        <SelectItem value="Hoàng Hoa Thám">Hoàng Hoa Thám</SelectItem>
                        <SelectItem value="Ngọc Hà">Ngọc Hà</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Kết quả test">
                    <label className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm hover:bg-slate-50">
                      <Upload className="h-4 w-4 text-slate-500" />
                      <span className="truncate">{lead.testFileName || "Chọn file kết quả test"}</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => update("testFileName", e.target.files?.[0]?.name ?? "")}
                      />
                    </label>
                  </Field>
                  <Field label="Trạng thái">
                    <Select value={lead.testResult ?? "Pending"} onValueChange={(v) => update("testResult", v as Lead["testResult"])}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Đang chờ kết quả</SelectItem>
                        <SelectItem value="Thành công">Đã trả kết quả</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Ghi chú kết quả">
                    <Input value={lead.testNote ?? ""} onChange={(e) => update("testNote", e.target.value)} placeholder="Nhận xét năng lực, trình độ phù hợp..." />
                  </Field>
                </div>
              )}
            </section>

          </TabsContent>

          {/* TAB 2 */}
          <TabsContent value="2" className="flex-1 overflow-y-auto px-4 py-3 mt-0 space-y-3 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
            <div className="grid grid-cols-2 gap-3 h-full content-start">
            <section className="rounded-lg border border-amber-200 bg-amber-50/40 p-3 space-y-3">
              <h3 className="text-sm font-semibold text-slate-800">Học thử</h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Lớp học thử">
                  <Select value={lead.trialClass ?? ""} onValueChange={(v) => update("trialClass", v)}>
                    <SelectTrigger><SelectValue placeholder="Chọn lớp học thử" /></SelectTrigger>
                    <SelectContent>
                      {CLASSES.map((c) => <SelectItem key={c.id} value={c.name}>{c.name} · {c.branch}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Cơ sở">
                  <Select value={lead.facility} onValueChange={(v) => update("facility", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ĐC">ĐC</SelectItem>
                      <SelectItem value="NH">NH</SelectItem>
                      <SelectItem value="HHT">HHT</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Ghi chú học thử" className="col-span-2">
                  <Textarea rows={2} value={lead.trialNote ?? ""} onChange={(e) => update("trialNote", e.target.value)} placeholder="Mức độ phù hợp, phản hồi của giáo viên và phụ huynh..." />
                </Field>
              </div>
            </section>

            <section className="rounded-lg border border-teal-200 bg-teal-50/40 p-3 space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Chốt lớp</h3>
                <p className="text-xs text-slate-500 mt-1">Gán vào lớp đang có hoặc đưa lead vào danh sách chờ.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => update("placementType", "existing")}
                  className={cn(
                    "rounded-md border bg-white px-3 py-2 text-left",
                    lead.placementType === "existing" ? "border-teal-500 ring-1 ring-teal-500" : "border-slate-200",
                  )}
                >
                  <div className="font-medium text-sm">Gán vào lớp có sẵn</div>
                  <div className="text-xs text-slate-500 mt-1">Chọn một lớp chính thức đang hoạt động.</div>
                </button>
                <button
                  type="button"
                  onClick={() => update("placementType", "waitlist")}
                  className={cn(
                    "rounded-md border bg-white px-3 py-2 text-left",
                    lead.placementType === "waitlist" ? "border-teal-500 ring-1 ring-teal-500" : "border-slate-200",
                  )}
                >
                  <div className="font-medium text-sm">Danh sách chờ</div>
                  <div className="text-xs text-slate-500 mt-1">Chờ đủ học viên hoặc mở lớp phù hợp.</div>
                </button>
              </div>
              {lead.placementType === "existing" && (
                <Field label="Lớp chính thức">
                  <Select value={lead.closedClass ?? ""} onValueChange={(v) => update("closedClass", v)}>
                  <SelectTrigger><SelectValue placeholder="Chọn lớp chốt" /></SelectTrigger>
                  <SelectContent>
                      {CLASSES.map((c) => <SelectItem key={c.id} value={c.name}>{c.name} · {c.branch}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              )}
              {lead.placementType === "waitlist" && (
                <Field label="Ghi chú danh sách chờ">
                  <Textarea rows={2} value={lead.waitlistNote ?? ""} onChange={(e) => update("waitlistNote", e.target.value)} placeholder="Khung giờ, trình độ hoặc lớp phụ huynh mong muốn..." />
                </Field>
              )}
            </section>
            </div>

          </TabsContent>

          {/* TAB 3 */}
          <TabsContent value="3" className="flex-1 overflow-y-auto px-4 py-3 mt-0 space-y-3 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
            <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3 h-full content-start">
            <section className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-3 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Tình trạng học phí</h3>
                  <p className="text-xs text-slate-500 mt-1">Ghi nhận khoản thu và tự động thêm vào nhật ký lead.</p>
                </div>
                <Badge variant="outline" className="bg-white">{lead.feeStatus ?? "Chưa thu"}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Info2 label="Trạng thái" value={lead.feeStatus ?? "Chưa thu"} />
                <Info2 label="Số tiền thu (VNĐ)" value={lead.tuition ? formatVND(Number(lead.tuition.replace(/\D/g, ""))) : ""} />
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-3">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">Chăm sóc sau ghi danh</h3>
            <div className="relative pl-5 space-y-2.5 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-teal-200">
              {[1, 2, 3].map((n) => {
                const dKey = (`care${n}Date`) as "care1Date" | "care2Date" | "care3Date";
                const nKey = (`care${n}Note`) as "care1Note" | "care2Note" | "care3Note";
                return (
                  <div key={n} className="relative">
                    <span className="absolute -left-[17px] top-1 h-3 w-3 rounded-full bg-white border-2 border-teal-500" />
                    <div className="text-xs font-semibold text-slate-800 mb-1">Chăm sóc lần {n}</div>
                    <div className="grid grid-cols-[140px_1fr] gap-2">
                      <Input type="text" placeholder="dd/mm/yyyy" value={lead[dKey] ?? ""} onChange={(e) => update(dKey, e.target.value)} />
                      <Input placeholder={`Ghi chú lần ${n}...`} value={lead[nKey] ?? ""} onChange={(e) => update(nKey, e.target.value)} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-slate-200 pt-2 mt-3">
              <CheckRow checked={!!lead.managerChecked} onChange={(v) => update("managerChecked", v)} label="Quản lý check — Đã rà soát đầy đủ nhật ký chăm sóc" />
            </div>
            </section>
            </div>

          </TabsContent>
        </Tabs>
        <LeadActivityPanel activities={lead.activities} note={activityNote} setNote={setActivityNote} onAdd={addManualActivity} />
        </div>

        {activeStep !== 3 && lead.step !== 3 && (
          <div className="px-5 py-2 border-t border-rose-100 bg-rose-50/50 flex items-center gap-2">
            <Input
              value={lead.failReason ?? ""}
              onChange={(e) => update("failReason", e.target.value)}
              placeholder="Nhập lý do nếu lead không tiếp tục..."
              className="bg-white"
            />
            <Button type="button" variant="outline" onClick={markFail} className="shrink-0 border-rose-300 text-rose-600 hover:bg-rose-100 hover:text-rose-700">
              <XCircle className="h-4 w-4 mr-1.5" /> Đánh dấu Fail
            </Button>
          </div>
        )}

        {/* Footer per step */}
        <DialogFooter className="px-5 py-2 border-t border-slate-200 bg-slate-50/60">
          {activeStep === 1 && (
            <div className="flex w-full justify-between gap-2">
              <div />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onSave(lead)}>Lưu</Button>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-1.5" onClick={toTrial}>
                  Xác nhận & sang Học thử <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          {activeStep === 2 && (
            <div className="flex w-full justify-between gap-2 flex-wrap">
              <Button variant="ghost" onClick={() => setActiveStep(1)} className="gap-1.5">
                <ArrowLeft className="h-4 w-4" /> Quay lại Bước 1
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onSave(lead, "Đã lưu")}>Lưu</Button>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-1.5" onClick={confirmClose}>
                  <CheckCircle2 className="h-4 w-4" /> Xác nhận Chốt lớp
                </Button>
              </div>
            </div>
          )}
          {activeStep === 3 && (
            <div className="flex w-full justify-between gap-2">
              <Button variant="ghost" onClick={() => setActiveStep(2)} className="gap-1.5">
                <ArrowLeft className="h-4 w-4" /> Quay lại Bước 2
              </Button>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => onSave({ ...lead, status: lead.managerChecked ? "Chăm Sóc" : lead.status }, "Đã lưu nhật ký chăm sóc")}>
                Lưu Học phí & Chăm sóc
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function LeadActivityPanel({ activities, note, setNote, onAdd }: {
  activities?: LeadActivity[];
  note: string;
  setNote: (value: string) => void;
  onAdd: () => void;
}) {
  return (
    <aside className="hidden lg:flex min-h-0 flex-col border-l border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-800">Nhật ký lead</h3>
      </div>
      <div className="mt-3 space-y-2">
        <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Thêm ghi chú trao đổi với phụ huynh hoặc học viên..." />
        <Button type="button" variant="outline" className="w-full" onClick={onAdd}>Thêm log</Button>
      </div>
      <div className="mt-4 flex-1 min-h-0 space-y-3 overflow-y-auto pr-1">
        {(activities ?? []).map((activity) => (
          <div key={activity.id} className="relative pl-5 text-xs before:absolute before:left-1 before:top-1.5 before:h-2 before:w-2 before:rounded-full before:bg-teal-500">
            <div className="flex flex-wrap items-center gap-x-2">
              <span className="font-semibold text-slate-800">{activity.action}</span>
              <span className="text-slate-400">{activity.at} · {activity.by}</span>
            </div>
            <div className="text-slate-600 mt-1">{activity.note}</div>
            {activity.attachment && <div className="text-teal-700 mt-1">Tệp: {activity.attachment}</div>}
          </div>
        ))}
        {!activities?.length && <div className="text-xs text-slate-400">Chưa có hoạt động nào.</div>}
      </div>
    </aside>
  );
}

function CheckRow({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer" />
      {label}
    </label>
  );
}
