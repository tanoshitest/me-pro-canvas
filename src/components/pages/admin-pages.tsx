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
import { useApp } from "@/lib/app-store";
import {
  BRANCHES, CLASSES, PROMOTIONS, TUITION_CONFIG, formatVND,
  CLASS_SHIFTS, ROOMS,
  type Receipt, type Branch,
} from "@/lib/mock-data";
import { toast } from "sonner";
import {
  Users, GraduationCap, Wallet, AlertTriangle, Receipt as ReceiptIcon, XCircle,
  TrendingUp, Calendar, Info, CheckCircle2, ArrowRight, CalendarOff, Repeat,
  Clock, DoorOpen, BookOpen, Tag, Hash,
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
  const { students, classes, receipts } = useApp();
  const [selected, setSelected] = React.useState<string | null>(null);
  const stu = students.find((s) => s.id === selected);
  const cls = stu ? classes.find((c) => c.id === stu.classId) : null;
  const stuReceipts = stu ? receipts.filter((r) => r.studentId === stu.id) : [];
  const paid = stuReceipts.filter((r) => r.status === "Hiệu lực").reduce((s, r) => s + r.amount, 0);
  const remaining = stu ? Math.max(0, stu.bought - stu.attended) : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
      <Card>
        <CardHeader><CardTitle>Danh sách học viên</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Họ tên</TableHead><TableHead>Chi nhánh</TableHead><TableHead>Còn buổi</TableHead><TableHead>Công nợ</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id} className={`cursor-pointer ${selected === s.id ? "bg-indigo-50" : ""}`} onClick={() => setSelected(s.id)}>
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

      <Card>
        <CardHeader>
          <CardTitle>{stu ? `Hồ sơ: ${stu.name}` : "Chọn 1 học viên để xem chi tiết"}</CardTitle>
          {stu && <p className="text-xs text-slate-500">Mã HV: <span className="font-mono">{stu.id.toUpperCase()}</span> · {stu.branch}</p>}
        </CardHeader>
        <CardContent>
          {!stu || !cls ? (
            <p className="text-slate-500">Nhấp vào học viên ở bên trái.</p>
          ) : (
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

              {/* ===== HỌC VIÊN ===== */}
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

              {/* ===== PHỤ HUYNH ===== */}
              <TabsContent value="parent" className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <Info2 label="Họ tên phụ huynh" value={stu.parentName ?? "-"} />
                <Info2 label="Quan hệ" value={stu.parentRelation ?? "-"} />
                <Info2 label="Số điện thoại" value={stu.parentPhone ?? "-"} />
                <Info2 label="Email" value={stu.parentEmail ?? "-"} />
              </TabsContent>

              {/* ===== HỌC TẬP ===== */}
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

              {/* ===== HỌC PHÍ ===== */}
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

              {/* ===== ĐIỂM DANH (top) ===== */}
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

              {/* ===== KẾT QUẢ (top) ===== */}
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

              {/* ===== LỊCH SỬ ===== */}
              <TabsContent value="ops" className="mt-3">
                <StudentHistoryTimeline stu={stu} receipts={stuReceipts} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
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

/* ============== CLASSES ============== */
export function AdminClasses() {
  const { classes, setClasses, students } = useApp();
  const [selected, setSelected] = React.useState<string | null>(classes[0]?.id ?? null);
  const cls = classes.find((c) => c.id === selected);
  const [openHoliday, setOpenHoliday] = React.useState(false);
  const [holidayDate, setHolidayDate] = React.useState("");
  const [transferStudentId, setTransferStudentId] = React.useState<string | null>(null);
  const [filterBranch, setFilterBranch] = React.useState<string>("all");
  const [filterClassId, setFilterClassId] = React.useState<string>("all");

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
    <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
      <Card>
        <CardHeader>
          <CardTitle>Danh sách lớp</CardTitle>
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
            <TableHeader><TableRow><TableHead>Lớp</TableHead><TableHead>Lịch</TableHead><TableHead>Chi nhánh</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredClasses.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => setSelected(c.id)}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.schedule} · {c.time}</TableCell>
                  <TableCell>{c.branch}</TableCell>
                </TableRow>
              ))}
              {filteredClasses.length === 0 && (
                <TableRow><TableCell colSpan={3} className="text-center text-slate-500 py-6">Không có lớp phù hợp</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {cls && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Chi tiết lớp: {cls.name}</CardTitle>
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
          </CardHeader>
          <CardContent className="space-y-4">
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
              <div className="font-semibold mb-2">Học viên lớp</div>
              <Table>
                <TableHeader><TableRow><TableHead>Tên</TableHead><TableHead>Đã học/Mua</TableHead><TableHead>Công nợ</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {students.filter((s) => s.classId === cls.id).map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.name}{s.nickname ? ` (${s.nickname})` : ""}</TableCell>
                      <TableCell>{s.attended} / {s.bought}</TableCell>
                      <TableCell>{formatVND(s.debt)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => setTransferStudentId(s.id)}>
                          <Repeat className="h-3.5 w-3.5" /> Chuyển lớp
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

          </CardContent>
        </Card>
      )}
      <TransferDialog studentId={transferStudentId} onClose={() => setTransferStudentId(null)} />
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

  const classOptions = classes.filter((c) => filterBranch === "all" || c.branch === filterBranch);
  const rows = students
    .filter((s) => filterBranch === "all" || s.branch === filterBranch)
    .filter((s) => filterClassId === "all" || s.classId === filterClassId)
    .map((s) => {
      const remain = s.bought - s.attended;
      const status = s.debt > 0
        ? { key: "debt", label: "Còn nợ", variant: "destructive" as const }
        : remain <= 3
          ? { key: "low", label: "Sắp hết buổi", variant: "secondary" as const }
          : { key: "ok", label: "Đã đóng đủ", variant: "default" as const };
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
                  <SelectItem value="low">Sắp hết buổi</SelectItem>
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
  return (
    <Tabs defaultValue="shifts" className="space-y-4">
      <TabsList>
        <TabsTrigger value="shifts"><Clock className="h-4 w-4" /> Ca học</TabsTrigger>
        <TabsTrigger value="rooms"><DoorOpen className="h-4 w-4" /> Phòng học</TabsTrigger>
        <TabsTrigger value="fee"><BookOpen className="h-4 w-4" /> Học phí</TabsTrigger>
        <TabsTrigger value="promotions"><Tag className="h-4 w-4" /> Khuyến mãi</TabsTrigger>
        <TabsTrigger value="receipts"><Hash className="h-4 w-4" /> Phiếu thu</TabsTrigger>
      </TabsList>

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

  const [pkg, setPkg] = React.useState("1");
  const [promoId, setPromoId] = React.useState("p0");
  const [extra, setExtra] = React.useState(0);
  const [received, setReceived] = React.useState(0);
  const [method, setMethod] = React.useState<Receipt["method"]>("Tiền mặt");
  const [receiptNo, setReceiptNo] = React.useState("");
  const [date, setDate] = React.useState("26/05/2026");
  const [note, setNote] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  React.useEffect(() => {
    if (studentId) {
      setPkg("1"); setPromoId("p0"); setExtra(0); setReceived(0);
      setMethod("Tiền mặt"); setNote("");
    }
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

  if (!stu || !cls) return null;
  const cashCfg = cashConfig.find((c) => c.branch === stu.branch);
  const cashExhausted = method === "Tiền mặt" && (!cashCfg || Math.max(cashCfg.current + 1, cashCfg.start) > cashCfg.end);

  const sessionsToAdd = Number(pkg) * cls.totalSessions;
  const base = cls.pricePerCourse * Number(pkg);
  const promo = PROMOTIONS.find((p) => p.id === promoId)!;
  const discount = promo.type === "fixed" ? promo.value : Math.round((base * promo.value) / 100);
  const total = Math.max(0, base - discount + Number(extra));
  const debt = Math.max(0, total - Number(received));

  const submit = () => {
    if (!receiptNo.trim()) {
      toast.error("Không sinh được số phiếu thu", { description: "Kiểm tra cấu hình dải phiếu thu của chi nhánh." });
      return;
    }
    setConfirmOpen(true);
  };

  const finalize = () => {
    const id = receiptNo.trim();
    const newReceipt: Receipt = {
      id, studentId: stu.id, studentName: stu.name, branch: stu.branch,
      amount: Number(received), method, status: "Hiệu lực",
      createdBy: "Admin (demo)", createdAt: date, note,
    };
    setReceipts((prev) => [newReceipt, ...prev]);
    if (method === "Tiền mặt") {
      setCashConfig((prev) => prev.map((c) => c.branch === stu.branch
        ? { ...c, current: Math.max(c.current + 1, c.start) }
        : c));
    }
    setStudents((prev) => prev.map((s) => s.id === stu.id
      ? { ...s, bought: s.bought + sessionsToAdd, debt: s.debt + debt }
      : s));
    toast.success("Đã tạo phiếu thu", {
      description: `Cộng ${sessionsToAdd} buổi vào ví ${stu.name}. Phiếu: ${id}.`,
    });
    setConfirmOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={!!studentId && !confirmOpen} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" /> Thu học phí: {stu.name}
            </DialogTitle>
            <DialogDescription>Lớp {cls.name} · {stu.branch}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-[3fr_2fr]">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Lớp"><Input value={cls.name} readOnly /></Field>
              <Field label="Chi nhánh"><Input value={stu.branch} readOnly /></Field>
              <Field label="Gói thu trước">
                <Select value={pkg} onValueChange={setPkg}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["1","2","3","4","5","6"].map((n) => <SelectItem key={n} value={n}>{n === "1" ? "Khóa này" : `${n} khóa`}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Học phí gốc (auto)"><Input value={formatVND(base)} readOnly /></Field>
              <Field label="Ưu đãi">
                <Select value={promoId} onValueChange={setPromoId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PROMOTIONS.map((p) => <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Thu khác (VNĐ)">
                <Input type="number" value={extra} onChange={(e) => setExtra(Number(e.target.value))} />
              </Field>
              <Field label="Thực thu (VNĐ)">
                <Input type="number" value={received} onChange={(e) => setReceived(Number(e.target.value))} />
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
              <Field label={`Số phiếu thu (auto · ${method === "Tiền mặt" ? "dải " + stu.branch : "chuyển khoản"})`}>
                <Input value={receiptNo} readOnly className="font-mono bg-slate-50" placeholder={cashExhausted ? "Đã hết dải phiếu — cấu hình lại" : ""} />
              </Field>
              <Field label="Ngày thu"><Input value={date} onChange={(e) => setDate(e.target.value)} /></Field>
              <Field label="Ghi chú" className="col-span-2"><Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} /></Field>
            </div>
            <div className="rounded-lg border bg-slate-50 p-4 space-y-2 text-sm h-fit">
              <div className="font-semibold flex items-center gap-2"><Info className="h-4 w-4 text-indigo-600" /> Kết quả tính toán</div>
              <Row label="Số buổi cộng vào ví" value={`+${sessionsToAdd} buổi`} highlight />
              <Row label="Học phí gốc" value={formatVND(base)} />
              <Row label="Ưu đãi" value={`- ${formatVND(discount)}`} />
              <Row label="Thu khác" value={`+ ${formatVND(Number(extra))}`} />
              <div className="border-t pt-2"><Row label="Thành tiền" value={formatVND(total)} bold /></div>
              <Row label="Thực thu" value={formatVND(Number(received))} />
              <Row label="Công nợ còn lại" value={formatVND(debt)} highlight={debt > 0} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Hủy</Button>
            <Button onClick={submit}><Wallet className="h-4 w-4" /> Cập nhật học phí</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận tạo phiếu thu</DialogTitle>
            <DialogDescription>Vui lòng kiểm tra trước khi tạo phiếu.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <Row label="Học viên" value={stu.name} />
            <Row label="Gói" value={`${pkg} khóa · +${sessionsToAdd} buổi`} />
            <Row label="Thành tiền" value={formatVND(total)} bold />
            <Row label="Thực thu" value={formatVND(Number(received))} />
            <Row label="Công nợ" value={formatVND(debt)} highlight={debt > 0} />
            <Row label="Phương thức" value={method} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Hủy</Button>
            <Button onClick={finalize}><CheckCircle2 className="h-4 w-4" /> Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={className}><Label className="text-xs text-slate-600 mb-1.5 block">{label}</Label>{children}</div>;
}
function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-600">{label}</span>
      <span className={`${bold ? "font-bold text-base" : "font-medium"} ${highlight ? "text-indigo-700" : ""}`}>{value}</span>
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
  const need = newClass.totalSessions - remaining;
  const needMore = need > 0;
  const amountDue = needMore ? need * newClass.pricePerSession : 0;
  const surplus = needMore ? 0 : -need;
  const sameBranch = oldClass.branch === newClass.branch;

  const apply = () => {
    const note = needMore
      ? `Chuyển ${oldClass.name} → ${newClass.name}: đóng thêm ${need} buổi (${formatVND(amountDue)})`
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
        : `Học viên còn dư ${surplus} buổi (bảo lưu).`,
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
              <Field label="Số buổi còn lại của lớp mới"><Input value={`${newClass.totalSessions} buổi`} readOnly /></Field>
              <div className={`text-xs px-3 py-2 rounded ${sameBranch ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                {sameBranch ? "Chuyển cùng chi nhánh" : "Chuyển khác chi nhánh"} · {oldClass.branch} <ArrowRight className="inline h-3 w-3" /> {newClass.branch}
              </div>
            </div>
            <div className="rounded-lg border bg-slate-50 p-4 space-y-2 text-sm">
              <div className="font-semibold flex items-center gap-2"><Info className="h-4 w-4 text-indigo-600" /> Kết quả tính toán</div>
              <Row label="Buổi còn lại lớp cũ" value={`${remaining} buổi`} />
              <Row label="Số buổi còn lại của lớp mới" value={`${newClass.totalSessions} buổi`} />
              <Row label="Chênh lệch" value={`${need} buổi`} highlight />
              {needMore ? (
                <>
                  <div className="border-t pt-2 text-rose-700 text-xs">Phụ huynh cần đóng thêm <strong>{need}</strong> buổi.</div>
                  <Row label="Công nợ phát sinh" value={formatVND(amountDue)} bold />
                  <div className="text-xs text-slate-500">→ Công nợ sẽ hiển thị trong Quản lý học viên.</div>
                </>
              ) : (
                <div className="border-t pt-2 text-emerald-700 text-xs">Còn dư <strong>{surplus}</strong> buổi → bảo lưu.</div>
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
