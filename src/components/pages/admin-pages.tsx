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
import { useApp } from "@/lib/app-store";
import {
  BRANCHES, CLASSES, PROMOTIONS, TUITION_CONFIG, formatVND,
  CLASS_SHIFTS, ROOMS, SYLLABI, TEACHERS,
  SYLLABUS_STAGES, SYLLABUS_STUDENTS, SYLLABUS_GRADE_COLUMNS,
  type Syllabus,
  type Receipt, type Branch, type Student,
} from "@/lib/mock-data";
import { toast } from "sonner";
import {
  Users, GraduationCap, Wallet, AlertTriangle, Receipt as ReceiptIcon, XCircle,
  TrendingUp, Calendar, Info, CheckCircle2, ArrowRight, CalendarOff, Repeat,
  Clock, DoorOpen, BookOpen, Tag, Hash, ArrowLeft,
  Layers, FileText, ClipboardCheck, BarChart3, ExternalLink, Plus, Pencil, Copy, Trash2, Download, FileSpreadsheet, ListChecks, Target, ChevronRight, ChevronLeft,
  CalendarIcon,
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
function ClassStudentsTabs({
  cls,
  students,
  onTransfer,
}: {
  cls: { id: string; totalSessions: number; startDate: string };
  students: Student[];
  onTransfer: (id: string) => void;
}) {
  const total = cls.totalSessions || 24;
  // Synthesize session dates from cls.startDate (DD/MM/YYYY) every 3 days
  const startParts = cls.startDate?.split("/").map(Number) ?? [1, 1, 2026];
  const startD = new Date(startParts[2], (startParts[1] || 1) - 1, startParts[0] || 1);
  const fmt = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  const sessions = Array.from({ length: total }).map((_, i) => {
    const d = new Date(startD);
    d.setDate(startD.getDate() + i * 3);
    return { idx: i + 1, date: fmt(d) };
  });

  const ATT_STATES = ["Có mặt", "Vắng có phép", "Vắng không phép", "Học bù", "—"] as const;
  type AttState = (typeof ATT_STATES)[number];
  const attColor = (s: AttState) =>
    s === "Có mặt" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : s === "Học bù" ? "bg-blue-50 text-blue-700 border-blue-200"
    : s === "Vắng có phép" ? "bg-amber-50 text-amber-700 border-amber-200"
    : s === "Vắng không phép" ? "bg-rose-50 text-rose-700 border-rose-200"
    : "bg-slate-50 text-slate-400 border-slate-200";

  // Deterministic mock based on ids
  const hash = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  };
  const attendanceOf = (sid: string, idx: number, attended: number): AttState => {
    if (idx > attended) return "—";
    const r = hash(`${sid}-${idx}`) % 20;
    if (r < 15) return "Có mặt";
    if (r === 15) return "Học bù";
    if (r < 18) return "Vắng có phép";
    return "Vắng không phép";
  };
  const SKILLS = ["Nghe", "Nói", "Đọc", "BTVN"] as const;
  const scoreOf = (sid: string, idx: number, skill: string, attended: number) => {
    if (idx > attended) return null;
    const r = (hash(`${sid}-${idx}-${skill}`) % 40) / 10; // 0..3.9
    return +(6.0 + r).toFixed(1);
  };

  const presentCount = (sid: string, attended: number) =>
    sessions.filter((s) => attendanceOf(sid, s.idx, attended) === "Có mặt" || attendanceOf(sid, s.idx, attended) === "Học bù").length;

  return (
    <Tabs defaultValue="list" className="space-y-3">
      <TabsList>
        <TabsTrigger value="list">Danh sách học viên</TabsTrigger>
        <TabsTrigger value="att">Điểm danh</TabsTrigger>
        <TabsTrigger value="grade">Kết quả học tập</TabsTrigger>
      </TabsList>

      <TabsContent value="list">
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
      </TabsContent>

      <TabsContent value="att">
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-50">
              <tr>
                <th className="sticky left-0 z-10 bg-slate-50 text-left px-3 py-2 border-b min-w-[200px]">Học viên</th>
                {sessions.map((s) => (
                  <th key={s.idx} className="px-2 py-2 border-b border-l text-xs font-semibold text-slate-600 whitespace-nowrap">
                    <div>BUỔI {s.idx}</div>
                    <div className="text-[10px] font-normal text-slate-400">{s.date}</div>
                  </th>
                ))}
                <th className="px-3 py-2 border-b border-l text-xs font-semibold text-slate-600 bg-slate-100">Có mặt</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stu) => (
                <tr key={stu.id} className="hover:bg-slate-50/50">
                  <td className="sticky left-0 z-10 bg-white px-3 py-2 border-b font-medium">
                    <div>{stu.name}{stu.nickname ? ` (${stu.nickname})` : ""}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{stu.id.toUpperCase()}</div>
                  </td>
                  {sessions.map((sess) => {
                    const st = attendanceOf(stu.id, sess.idx, stu.attended);
                    return (
                      <td key={sess.idx} className="px-2 py-2 border-b border-l text-center">
                        <span className={`inline-block text-[11px] px-2 py-0.5 rounded border ${attColor(st)}`}>
                          {st === "Có mặt" ? "✓" : st === "Học bù" ? "Bù" : st === "Vắng có phép" ? "P" : st === "Vắng không phép" ? "K" : "—"}
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 border-b border-l text-center font-semibold bg-slate-50/50">
                    {presentCount(stu.id, stu.attended)}/{total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-3 flex-wrap text-xs text-slate-500 mt-2">
          <span><span className="inline-block w-3 h-3 rounded bg-emerald-100 border border-emerald-200 mr-1 align-middle" />Có mặt (✓)</span>
          <span><span className="inline-block w-3 h-3 rounded bg-blue-100 border border-blue-200 mr-1 align-middle" />Học bù (Bù)</span>
          <span><span className="inline-block w-3 h-3 rounded bg-amber-100 border border-amber-200 mr-1 align-middle" />Vắng có phép (P)</span>
          <span><span className="inline-block w-3 h-3 rounded bg-rose-100 border border-rose-200 mr-1 align-middle" />Vắng không phép (K)</span>
        </div>
      </TabsContent>

      <TabsContent value="grade">
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-50">
              <tr>
                <th rowSpan={2} className="sticky left-0 z-10 bg-slate-50 text-left px-3 py-2 border-b min-w-[200px] align-middle">Học sinh</th>
                {sessions.map((s) => (
                  <th key={s.idx} colSpan={SKILLS.length} className="px-2 py-1.5 border-b border-l text-xs font-semibold text-slate-600 text-center whitespace-nowrap">
                    <div>BUỔI {s.idx}</div>
                    <div className="text-[10px] font-normal text-slate-400">{s.date} · {s.idx}/{total}</div>
                  </th>
                ))}
              </tr>
              <tr>
                {sessions.map((s) =>
                  SKILLS.map((k, ki) => (
                    <th key={`${s.idx}-${k}`} className={`px-2 py-1.5 border-b text-[11px] font-medium text-slate-500 ${ki === 0 ? "border-l" : ""}`}>
                      {k}
                    </th>
                  )),
                )}
              </tr>
            </thead>
            <tbody>
              {students.map((stu) => (
                <tr key={stu.id} className="hover:bg-slate-50/50">
                  <td className="sticky left-0 z-10 bg-white px-3 py-2 border-b font-medium">
                    <div>{stu.name}{stu.nickname ? ` (${stu.nickname})` : ""}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{stu.id.toUpperCase()}</div>
                  </td>
                  {sessions.map((sess) =>
                    SKILLS.map((k, ki) => {
                      const v = scoreOf(stu.id, sess.idx, k, stu.attended);
                      const isHw = k === "BTVN";
                      return (
                        <td key={`${sess.idx}-${k}`} className={`px-2 py-2 border-b text-center ${ki === 0 ? "border-l" : ""}`}>
                          {v === null ? (
                            <span className="text-[11px] text-slate-300">—</span>
                          ) : (
                            <span className={`text-sm font-medium ${isHw ? "text-indigo-600" : "text-slate-700"}`}>{v.toFixed(1)}</span>
                          )}
                        </td>
                      );
                    }),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info"><Info className="h-4 w-4 mr-1" /> Thông tin lớp học</TabsTrigger>
                <TabsTrigger value="syllabus"><BookOpen className="h-4 w-4 mr-1" /> Syllabus</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info2 label="Chi nhánh" value={cls.branch} />
              <Info2 label="Giáo viên" value={cls.teacher} />
              <Info2 label="Syllabus" value={cls.syllabus} />
              <div className="rounded-md border bg-slate-50 px-3 py-2 col-span-1">
                <div className="text-xs text-slate-500 mb-1">Lịch học</div>
                {cls.sessions?.length ? (
                  <div className="space-y-0.5">
                    {cls.sessions.map((sess, i) => (
                      <div key={i} className="font-medium text-sm">
                        <span className="text-slate-700">{sess.day}</span>
                        <span className="text-slate-400 mx-1">·</span>
                        <span>{sess.time}</span>
                        <span className="text-slate-400 mx-1">·</span>
                        <span className="text-indigo-700">{sess.room}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="font-medium">{cls.schedule} · {cls.time} · {cls.room}</div>
                )}
              </div>
              <Info2 label="Ngày bắt đầu" value={cls.startDate} />
              <Info2 label="Ngày kết thúc dự kiến" value={cls.endDate} />
              <Info2 label="Số buổi / khóa" value={cls.totalSessions.toString()} />
              <Info2
                label="Tiến độ"
                value={`${Math.min(
                  cls.totalSessions,
                  Math.max(0, ...students.filter((s) => s.classId === cls.id).map((s) => s.attended)),
                )}/${cls.totalSessions} buổi`}
              />
              <Info2 label="Học phí" value={formatVND(cls.pricePerCourse)} />
            </div>

            <div>
            <ClassStudentsTabs cls={cls} students={students.filter((s) => s.classId === cls.id)} onTransfer={setTransferStudentId} />
            </div>
              </TabsContent>
              <TabsContent value="syllabus">
                {(() => {
                  const sy = SYLLABI.find((s) => cls.syllabus.includes(s.name) || cls.syllabus.includes(s.code)) ?? SYLLABI[0];
                  return <SyllabusDetail syllabus={sy} embedded />;
                })()}
              </TabsContent>
            </Tabs>
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
function SyllabusDetail({ syllabus, onBack, embedded }: { syllabus: Syllabus; onBack?: () => void; embedded?: boolean }) {
  const stages = SYLLABUS_STAGES;

  type Sel = { kind: "lesson"; stageId: string; lessonId: string } | { kind: "bigtest"; stageId: string };
  const [sel, setSel] = React.useState<Sel>({ kind: "lesson", stageId: stages[0].id, lessonId: stages[0].lessons[0].id });

  return (
    <div className="space-y-4">
      {!embedded && (
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
      )}

      <div className="space-y-3">
        {embedded ? (
          <Tabs defaultValue="content" className="space-y-3">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="content">Nội dung syllabus</TabsTrigger>
              <TabsTrigger value="attendance">Điểm danh</TabsTrigger>
              <TabsTrigger value="grades">Nhập điểm trên lớp</TabsTrigger>
              <TabsTrigger value="homework">Nhập điểm homeworks</TabsTrigger>
              <TabsTrigger value="report">Báo cáo học vụ</TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <SyllabusContentTree stages={stages} sel={sel} setSel={setSel} />
            </TabsContent>
            <TabsContent value="attendance">
              <SyllabusAttendanceTab sel={sel} />
            </TabsContent>
            <TabsContent value="grades">
              <SyllabusGradesTab />
            </TabsContent>
            <TabsContent value="homework">
              <SyllabusHomeworkTab sel={sel} />
            </TabsContent>
            <TabsContent value="report">
              <SyllabusReportTab />
            </TabsContent>
          </Tabs>
        ) : (
          <SyllabusContentTree stages={stages} sel={sel} setSel={setSel} />
        )}
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

type SyllabusSel = { kind: "lesson"; stageId: string; lessonId: string } | { kind: "bigtest"; stageId: string };

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
          homework: "",
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
                  <EditField icon={Target} label="Mục tiêu tổng quan" value={lesson.objective} onChange={(v) => updateLesson(stage.id, lesson.id, { objective: v })} />
                  <EditField icon={FileText} label="Nội dung chi tiết" value={lesson.content} onChange={(v) => updateLesson(stage.id, lesson.id, { content: v })} multiline />
                  <EditField icon={Info} label="Lưu ý" value={lesson.note} onChange={(v) => updateLesson(stage.id, lesson.id, { note: v })} />
                </TabsContent>
                <TabsContent value="after-class" className="space-y-4">
                  <EditField icon={ListChecks} label="Homeworks" value={lesson.homework} onChange={(v) => updateLesson(stage.id, lesson.id, { homework: v })} multiline />
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
        <div className="text-xs text-slate-400 italic py-2">Chưa có tài liệu nào. Bấm "Thêm link" để thêm.</div>
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

function SyllabusAttendanceTab({ sel }: { sel: SyllabusSel }) {
  const stages = SYLLABUS_STAGES;
  const stage = stages.find((s) => s.id === sel.stageId)!;
  const lesson = sel.kind === "lesson" ? stage.lessons.find((l) => l.id === sel.lessonId) ?? null : null;
  const [q, setQ] = React.useState("");
  const [rows, setRows] = React.useState(SYLLABUS_STUDENTS);

  const filtered = rows.filter((r) => `${r.code} ${r.name}`.toLowerCase().includes(q.toLowerCase()));

  const update = (id: string, patch: Partial<typeof rows[number]>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5" /> Điểm danh học viên</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border bg-slate-50/60 px-3 py-2 flex items-center justify-between gap-3 flex-wrap text-sm">
          <div className="flex items-center gap-2">
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

        <div className="flex gap-2">
          <Button size="sm" onClick={() => toast.success("Đã lưu điểm danh")}><CheckCircle2 className="h-4 w-4" /> Lưu điểm danh</Button>
        </div>

        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Mã HV</TableHead>
                <TableHead>Tên học viên</TableHead>
                <TableHead className="w-48">Trạng thái</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.code}</TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>
                    <Select value={r.attendance} onValueChange={(v) => update(r.id, { attendance: v as typeof r.attendance })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Có mặt">Có mặt</SelectItem>
                        <SelectItem value="Vắng có phép">Vắng có phép</SelectItem>
                        <SelectItem value="Vắng không phép">Vắng không phép</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input value={r.attendanceNote} onChange={(e) => update(r.id, { attendanceNote: e.target.value })} placeholder="Ghi chú..." />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function SyllabusGradesTab() {
  const [cols, setCols] = React.useState<string[]>(SYLLABUS_GRADE_COLUMNS);
  const [rows, setRows] = React.useState(SYLLABUS_STUDENTS);
  const [newCol, setNewCol] = React.useState("");

  const addCol = () => {
    const name = newCol.trim();
    if (!name) return;
    if (cols.includes(name)) { toast.error("Cột điểm đã tồn tại"); return; }
    setCols((c) => [...c, name]);
    setRows((rs) => rs.map((r) => ({ ...r, grades: { ...r.grades, [name]: 0 } })));
    setNewCol("");
    toast.success(`Đã thêm cột "${name}"`);
  };

  const updateGrade = (id: string, col: string, val: string) => {
    const n = Number(val);
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, grades: { ...r.grades, [col]: Number.isFinite(n) ? n : 0 } } : r)));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5" /> Nhập điểm trên lớp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2 flex-wrap">
          <div>
            <Label className="text-xs">Tên cột điểm mới</Label>
            <Input value={newCol} onChange={(e) => setNewCol(e.target.value)} placeholder="Ví dụ: Dictation, Speaking Test..." className="w-64" />
          </div>
          <Button size="sm" onClick={addCol}><Plus className="h-4 w-4" /> Thêm cột điểm</Button>
          <div className="flex-1" />
          <Button size="sm" onClick={() => toast.success("Đã lưu điểm")}><CheckCircle2 className="h-4 w-4" /> Lưu điểm</Button>
          <Button size="sm" variant="outline" onClick={() => toast.info("Đã xuất bảng điểm")}><FileSpreadsheet className="h-4 w-4" /> Xuất bảng điểm</Button>
        </div>

        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Mã HV</TableHead>
                <TableHead>Tên học viên</TableHead>
                {cols.map((c) => <TableHead key={c} className="text-center w-28">{c}</TableHead>)}
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.code}</TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  {cols.map((c) => (
                    <TableCell key={c} className="text-center">
                      <Input
                        type="number" step="0.5" min={0} max={10}
                        value={r.grades[c] ?? 0}
                        onChange={(e) => updateGrade(r.id, c, e.target.value)}
                        className="h-8 text-center"
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Input
                      value={r.gradeNote}
                      onChange={(e) => setRows((rs) => rs.map((x) => x.id === r.id ? { ...x, gradeNote: e.target.value } : x))}
                      placeholder="Ghi chú..."
                    />
                  </TableCell>
                </TableRow>
              ))}
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

function SyllabusHomeworkTab({ sel }: { sel: SyllabusSel }) {
  const stages = SYLLABUS_STAGES;
  const lessons = stages.flatMap((st) => st.lessons.map((l) => ({ ...l, stageName: st.name })));
  const stage = stages.find((s) => s.id === sel.stageId)!;
  const currentLesson = sel.kind === "lesson" ? stage.lessons.find((l) => l.id === sel.lessonId) ?? null : null;
  const [rows, setRows] = React.useState(() =>
    SYLLABUS_STUDENTS.map((s) => ({
      id: s.id, code: s.code, name: s.name,
      scores: Object.fromEntries(lessons.map((l) => [l.id, 8 + ((s.id.charCodeAt(2) + l.index) % 3)])) as Record<string, number>,
      note: "",
    })),
  );

  const update = (id: string, lessonId: string, val: string) => {
    const n = Number(val);
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, scores: { ...r.scores, [lessonId]: Number.isFinite(n) ? n : 0 } } : r)));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Nhập điểm homeworks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border bg-slate-50/60 px-3 py-2 flex items-center justify-between gap-3 flex-wrap text-sm">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-600" />
            <span className="text-slate-500">{stage.name}</span>
            <span className="text-slate-400">·</span>
            {currentLesson ? (
              <>
                <BookOpen className="h-4 w-4 text-emerald-600" />
                <span className="font-medium">Buổi {currentLesson.index}: {currentLesson.unit}</span>
              </>
            ) : (
              <>
                <ClipboardCheck className="h-4 w-4 text-amber-600" />
                <span className="font-medium">{stage.bigTest.name}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => toast.success("Đã lưu điểm homeworks")}><CheckCircle2 className="h-4 w-4" /> Lưu điểm</Button>
            <Button size="sm" variant="outline" onClick={() => toast.info("Đã xuất bảng điểm homeworks")}><FileSpreadsheet className="h-4 w-4" /> Xuất bảng</Button>
          </div>
        </div>

        {!currentLesson ? (
          <div className="text-sm text-slate-500 italic p-4 border rounded-md">
            Big Test không có điểm homeworks. Chọn một buổi học ở "Nội dung syllabus" để nhập điểm.
          </div>
        ) : (
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Mã HV</TableHead>
                <TableHead>Tên học viên</TableHead>
                <TableHead className="text-center w-32">Điểm homeworks</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.code}</TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number" step="0.5" min={0} max={10}
                      value={r.scores[currentLesson.id] ?? 0}
                      onChange={(e) => update(r.id, currentLesson.id, e.target.value)}
                      className="h-8 text-center px-1"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={r.note}
                      onChange={(e) => setRows((rs) => rs.map((x) => x.id === r.id ? { ...x, note: e.target.value } : x))}
                      placeholder="Ghi chú..."
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        )}
      </CardContent>
    </Card>
  );
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

export function AdminSchedule() {
  const { classes } = useApp();
  const colors = ["bg-indigo-100 border-indigo-300 text-indigo-800", "bg-emerald-100 border-emerald-300 text-emerald-800", "bg-amber-100 border-amber-300 text-amber-800", "bg-rose-100 border-rose-300 text-rose-800", "bg-sky-100 border-sky-300 text-sky-800"];
  const [branch, setBranch] = React.useState<"all" | Branch>("all");
  const [weekOffset, setWeekOffset] = React.useState(0);

  const weekLabel = React.useMemo(() => {
    const now = new Date();
    const day = (now.getDay() + 6) % 7; // Mon=0
    const monday = new Date(now);
    monday.setDate(now.getDate() - day + weekOffset * 7);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const f = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    return `${f(monday)} – ${f(sunday)}/${sunday.getFullYear()}`;
  }, [weekOffset]);

  // Build events
  const events: { day: string; start: number; end: number; cls: string; teacher: string; room: string; color: string }[] = [];
  classes
    .filter((c) => branch === "all" || c.branch === branch)
    .forEach((c, idx) => {
    (c.sessions ?? []).forEach((s) => {
      const [a, b] = s.time.split(" - ");
      events.push({
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
                {DAYS.map((d) => (
                  <div key={d + h} className="relative border-t border-l">
                    {events
                      .filter((e) => e.day === d && Math.floor(e.start) === h)
                      .map((e, i) => {
                        const heightPct = (e.end - e.start) * 100;
                        const topPct = (e.start - h) * 100;
                        return (
                          <div
                            key={i}
                            className={`absolute left-1 right-1 rounded-md border px-1.5 py-0.5 text-[10px] leading-tight shadow-sm overflow-hidden ${e.color}`}
                            style={{ top: `${topPct}%`, height: `${heightPct}%` }}
                          >
                            <div className="font-semibold truncate">{e.cls}</div>
                            <div className="truncate opacity-80">{e.teacher}</div>
                            <div className="truncate opacity-70">{e.room}</div>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ============== ATTENDANCE REPORT (demo) ============== */
export function AdminAttendanceReport() {
  return <AttendanceReportCard />;
}

/* ============== FINANCE REPORT (Thu / Chi) ============== */
export function AdminFinanceReport() {
  return <FinanceReportCard />;
}

function AttendanceReportCard() {
  return (
    <Card>
      <CardHeader><CardTitle>Báo cáo chấm công</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-500">Tổng hợp số buổi dạy, vắng, đi muộn của giáo viên theo tháng.</p>
        <div className="flex gap-2">
          <Button onClick={() => toast.success("Đã xuất báo cáo chấm công (demo)")}>Xuất báo cáo Excel</Button>
          <Button variant="outline" onClick={() => toast.info("Tính năng demo")}>Lọc theo tháng</Button>
        </div>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Giáo viên</TableHead><TableHead>Tháng</TableHead>
            <TableHead className="text-right">Buổi dạy</TableHead><TableHead className="text-right">Vắng</TableHead><TableHead className="text-right">Đi muộn</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {TEACHERS.flatMap((t) =>
              t.attendanceReport.map((a, i) => (
                <TableRow key={t.id + i}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>{a.month}</TableCell>
                  <TableCell className="text-right">{a.sessions}</TableCell>
                  <TableCell className="text-right">{a.absent}</TableCell>
                  <TableCell className="text-right">{a.late}</TableCell>
                </TableRow>
              )),
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
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

export function AdminSalaryReport() {
  return (
    <Card>
      <CardHeader><CardTitle>Báo cáo lương</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-500">Bảng lương theo tháng dựa trên số buổi dạy và các khoản trừ.</p>
        <div className="flex gap-2">
          <Button onClick={() => toast.success("Đã xuất bảng lương (demo)")}>Xuất bảng lương Excel</Button>
          <Button variant="outline" onClick={() => toast.info("Tính năng demo")}>Lọc theo tháng</Button>
        </div>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Giáo viên</TableHead><TableHead>Tháng</TableHead>
            <TableHead className="text-right">Buổi</TableHead>
            <TableHead className="text-right">Tổng</TableHead>
            <TableHead className="text-right">Trừ</TableHead>
            <TableHead className="text-right">Thực nhận</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {TEACHERS.flatMap((t) =>
              t.salaryReport.map((s, i) => (
                <TableRow key={t.id + i}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>{s.month}</TableCell>
                  <TableCell className="text-right">{s.sessions}</TableCell>
                  <TableCell className="text-right">{formatVND(s.gross)}</TableCell>
                  <TableCell className="text-right text-rose-600">-{formatVND(s.deduct)}</TableCell>
                  <TableCell className="text-right font-semibold">{formatVND(s.net)}</TableCell>
                </TableRow>
              )),
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/* ============== ADMISSIONS CRM ============== */
type LeadStatus = "Lead Mới" | "Fail" | "Đang Học Thử" | "Đã Chốt" | "Đang Tham Vấn" | "Chăm Sóc";
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
  testResult?: "Pending" | "Thành công" | "Fail";
  // step 2
  trialClass?: string;
  closedClass?: string;
  tuition?: string;
  paymentBy?: string;
  startDate?: string;
  doneTrial?: boolean;
  gaveBooks?: boolean;
  enrolled?: boolean;
  // step 3
  care1Date?: string; care1Note?: string;
  care2Date?: string; care2Note?: string;
  care3Date?: string; care3Note?: string;
  managerChecked?: boolean;
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
          testResult:
            status === "Fail" ? "Fail" : status === "Lead Mới" || status === "Đang Tham Vấn" ? "Pending" : "Thành công",
        };
        if (step >= 2) {
          base.trialClass = TRIAL_CLASSES[seed % TRIAL_CLASSES.length];
          base.tuition = TUITIONS[seed % TUITIONS.length];
        }
        if (step === 3) {
          base.closedClass = base.trialClass;
          base.enrolled = true;
          base.doneTrial = true;
          base.gaveBooks = true;
          base.startDate = `${String(((seed * 5) % 27) + 1).padStart(2, "0")}/05/2026`;
          if (status === "Chăm Sóc") {
            base.care1Date = `${String(((seed * 5) % 27) + 1).padStart(2, "0")}/06/2026`;
            base.care1Note = "PH hài lòng, con thích lớp.";
          }
        }
        leads.push(base);
        counter++;
      }
    });
  });
  return leads;
}

const INITIAL_LEADS: Lead[] = generateLeads();

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
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="Lead Mới">Lead Mới</SelectItem>
              <SelectItem value="Đang Tham Vấn">Đang Tham Vấn</SelectItem>
              <SelectItem value="Fail">Fail</SelectItem>
              <SelectItem value="Đang Học Thử">Đang Học Thử</SelectItem>
              <SelectItem value="Đã Chốt">Đã Chốt</SelectItem>
              <SelectItem value="Chăm Sóc">Chăm Sóc</SelectItem>
            </SelectContent>
          </Select>
        )}
        {view === "list" && mode === "admin" && (
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="h-9 w-[220px]">
              <SelectValue placeholder="Phụ trách" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả phụ trách</SelectItem>
              <SelectItem value="unassigned">Chưa phân</SelectItem>
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

  const toTrial = () => {
    const next: Lead = { ...lead, step: 2, status: "Đang Học Thử", testResult: lead.testResult || "Thành công" };
    onSave(next, "Đã chuyển sang Học thử");
    setActiveStep(2);
  };
  const markFail = () => {
    const next: Lead = { ...lead, status: "Fail", testResult: "Fail" };
    onSave(next, "Đã đánh dấu Fail");
  };
  const confirmClose = () => {
    const next: Lead = { ...lead, step: 3, status: "Đã Chốt", enrolled: true };
    onSave(next, "Đã chốt lớp");
    setActiveStep(3);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 max-h-[92vh] overflow-hidden flex flex-col">
        <DialogHeader className="px-6 py-4 border-b border-slate-200 bg-slate-50/60">
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
          <div className="mt-3 flex items-center gap-2 text-xs">
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
          <div className="mt-4 flex items-center gap-2">
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
                    {s === 1 ? "Test & Tham vấn" : s === 2 ? "Học thử & Chốt lớp" : "Chăm sóc 1 tháng"}
                  </div>
                  {idx < 2 && <div className={cn("flex-1 h-0.5 rounded", reached && (lead.step > s || activeStep > s) ? "bg-teal-400" : "bg-slate-200")} />}
                </React.Fragment>
              );
            })}
          </div>
        </DialogHeader>

        <Tabs value={String(activeStep)} onValueChange={(v) => setActiveStep(Number(v) as 1 | 2 | 3)} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-6 mt-4 grid grid-cols-3 w-auto">
            <TabsTrigger value="1">Bước 1</TabsTrigger>
            <TabsTrigger value="2">Bước 2</TabsTrigger>
            <TabsTrigger value="3">Bước 3</TabsTrigger>
          </TabsList>

          {/* TAB 1 */}
          <TabsContent value="1" className="flex-1 overflow-y-auto px-6 py-4 mt-0 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                <h3 className="text-sm font-semibold text-slate-800">Thông tin học viên</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
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
                <Field label="Trường" className="col-span-2"><Input value={lead.school} onChange={(e) => update("school", e.target.value)} /></Field>
                <Field label="Đặc điểm" className="col-span-2"><Textarea rows={2} value={lead.feature} onChange={(e) => update("feature", e.target.value)} placeholder="Ghi chú về học sinh, phụ huynh..." /></Field>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2 */}
          <TabsContent value="2" className="flex-1 overflow-y-auto px-6 py-4 mt-0 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Lớp học thử"><Input value={lead.trialClass ?? ""} onChange={(e) => update("trialClass", e.target.value)} placeholder="VD: Cam 31" /></Field>
              <Field label="Chốt lớp">
                <Select value={lead.closedClass ?? ""} onValueChange={(v) => update("closedClass", v)}>
                  <SelectTrigger><SelectValue placeholder="Chọn lớp chốt" /></SelectTrigger>
                  <SelectContent>
                    {["Kindy 4","Cam 22","Cam 31","Star 12","Junior A1","Junior A2"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
              <Field label="Thu tiền (VNĐ)">
                <Input
                  value={lead.tuition ?? ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    const formatted = raw ? Number(raw).toLocaleString("vi-VN") : "";
                    update("tuition", formatted);
                  }}
                  placeholder="2.500.000"
                />
              </Field>
              <Field label="NS Thu tiền"><Input value={lead.paymentBy ?? ""} onChange={(e) => update("paymentBy", e.target.value)} /></Field>
              <Field label="Ngày bắt đầu học"><Input type="text" value={lead.startDate ?? ""} onChange={(e) => update("startDate", e.target.value)} placeholder="dd/mm/yyyy" /></Field>
            </div>

            <div className="border border-slate-200 rounded-md p-3 bg-slate-50/40 space-y-2">
              <CheckRow checked={!!lead.doneTrial} onChange={(v) => update("doneTrial", v)} label="Đã hoàn thành học thử" />
              <CheckRow checked={!!lead.gaveBooks} onChange={(v) => update("gaveBooks", v)} label="Đã phát sách" />
              <CheckRow checked={!!lead.enrolled} onChange={(v) => update("enrolled", v)} label="Đã ghi danh" />
            </div>
          </TabsContent>

          {/* TAB 3 */}
          <TabsContent value="3" className="flex-1 overflow-y-auto px-6 py-4 mt-0 space-y-4">
            <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-teal-200">
              {[1, 2, 3].map((n) => {
                const dKey = (`care${n}Date`) as "care1Date" | "care2Date" | "care3Date";
                const nKey = (`care${n}Note`) as "care1Note" | "care2Note" | "care3Note";
                return (
                  <div key={n} className="relative">
                    <span className="absolute -left-[18px] top-1 h-3.5 w-3.5 rounded-full bg-white border-2 border-teal-500" />
                    <div className="text-sm font-semibold text-slate-800 mb-2">Chăm sóc lần {n}</div>
                    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2">
                      <Input type="text" placeholder="dd/mm/yyyy" value={lead[dKey] ?? ""} onChange={(e) => update(dKey, e.target.value)} />
                      <Textarea rows={2} placeholder={`Ghi chú lần ${n}...`} value={lead[nKey] ?? ""} onChange={(e) => update(nKey, e.target.value)} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-slate-200 pt-3">
              <CheckRow checked={!!lead.managerChecked} onChange={(v) => update("managerChecked", v)} label="Quản lý check — Đã rà soát đầy đủ nhật ký chăm sóc" />
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer per step */}
        <DialogFooter className="px-6 py-3 border-t border-slate-200 bg-slate-50/60">
          {activeStep === 1 && (
            <div className="flex w-full justify-between gap-2">
              <div />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onSave(lead)}>Lưu</Button>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-1.5" onClick={toTrial}>
                  Chuyển sang Học thử <ArrowRight className="h-4 w-4" />
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
                <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50" onClick={markFail}>Đánh dấu Fail</Button>
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
                Lưu Nhật Ký
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
