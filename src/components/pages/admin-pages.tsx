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
  type Receipt, type Branch,
} from "@/lib/mock-data";
import { toast } from "sonner";
import {
  Users, GraduationCap, Wallet, AlertTriangle, Receipt as ReceiptIcon, XCircle,
  TrendingUp, Calendar, Info, CheckCircle2, ArrowRight, CalendarOff, Repeat,
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
                <TableRow key={s.id} className="cursor-pointer" onClick={() => setSelected(s.id)}>
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
        <CardHeader><CardTitle>{stu ? `Hồ sơ: ${stu.name}` : "Chọn 1 học viên để xem chi tiết"}</CardTitle></CardHeader>
        <CardContent>
          {!stu ? (
            <p className="text-slate-500">Nhấp vào học viên ở bên trái.</p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Info2 label="Chi nhánh" value={stu.branch} />
                <Info2 label="Lớp hiện tại" value={classes.find((c) => c.id === stu.classId)?.name ?? "-"} />
                <Info2 label="Số buổi đã mua" value={stu.bought.toString()} />
                <Info2 label="Đã học" value={stu.attended.toString()} />
                <Info2 label="Còn lại" value={(stu.bought - stu.attended).toString()} />
                <Info2 label="Công nợ" value={formatVND(stu.debt)} />
              </div>
              {stu.transferNote && (
                <div className="rounded-md border border-amber-300 bg-amber-50 text-amber-800 text-sm px-3 py-2 flex items-start gap-2">
                  <Repeat className="h-4 w-4 mt-0.5 shrink-0" />
                  <span><strong>Lịch sử chuyển lớp:</strong> {stu.transferNote}</span>
                </div>
              )}
              <Tabs defaultValue="fee">
                <TabsList>
                  <TabsTrigger value="fee">Lịch sử học phí</TabsTrigger>
                  <TabsTrigger value="att">Điểm danh</TabsTrigger>
                  <TabsTrigger value="grade">Kết quả</TabsTrigger>
                </TabsList>
                <TabsContent value="fee" className="mt-3">
                  <Table><TableHeader><TableRow>
                    <TableHead>Mã phiếu</TableHead><TableHead>Ngày</TableHead><TableHead>Tiền</TableHead><TableHead>PT</TableHead>
                  </TableRow></TableHeader><TableBody>
                    {receipts.filter((r) => r.studentId === stu.id).map((r) => (
                      <TableRow key={r.id}><TableCell>{r.id}</TableCell><TableCell>{r.createdAt}</TableCell><TableCell>{formatVND(r.amount)}</TableCell><TableCell>{r.method}</TableCell></TableRow>
                    ))}
                  </TableBody></Table>
                </TabsContent>
                <TabsContent value="att" className="mt-3 text-sm space-y-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex justify-between py-1.5 border-b">
                      <span>Buổi {i + 1} · 0{i + 3}/03/2026</span>
                      <Badge variant={i === 3 ? "destructive" : "secondary"}>{i === 3 ? "Vắng có phép" : "Có mặt"}</Badge>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="grade" className="mt-3">
                  <Table><TableHeader><TableRow>
                    <TableHead>Buổi</TableHead><TableHead>Listening</TableHead><TableHead>Speaking</TableHead><TableHead>Reading</TableHead><TableHead>Writing</TableHead>
                  </TableRow></TableHeader><TableBody>
                    {[8.5, 9, 8, 7.5].map((g, i) => (
                      <TableRow key={i}><TableCell>Buổi {i + 1}</TableCell><TableCell>{g}</TableCell><TableCell>{g - 0.5}</TableCell><TableCell>{g}</TableCell><TableCell>{g - 1}</TableCell></TableRow>
                    ))}
                  </TableBody></Table>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Info2({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-slate-50 px-3 py-2">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-medium">{value}</div>
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
        <CardHeader><CardTitle>Danh sách lớp</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Lớp</TableHead><TableHead>Lịch</TableHead><TableHead>Chi nhánh</TableHead></TableRow></TableHeader>
            <TableBody>
              {classes.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => setSelected(c.id)}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.schedule} · {c.time}</TableCell>
                  <TableCell>{c.branch}</TableCell>
                </TableRow>
              ))}
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
              <Info2 label="Lịch học" value={`${cls.schedule} · ${cls.time}`} />
              <Info2 label="Ngày bắt đầu" value={cls.startDate} />
              <Info2 label="Ngày kết thúc dự kiến" value={cls.endDate} />
              <Info2 label="Số buổi / khóa" value={cls.totalSessions.toString()} />
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

            <div>
              <div className="font-semibold mb-2">Bảng điểm danh theo buổi</div>
              <div className="grid grid-cols-6 gap-2 text-xs">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="border rounded p-2 text-center bg-slate-50">
                    <div className="font-medium">B{i + 1}</div>
                    <div className="text-slate-500">{i < 5 ? "✓ Đủ" : i === 5 ? "Nghỉ" : "—"}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <TransferDialog studentId={transferStudentId} onClose={() => setTransferStudentId(null)} />
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

/* ============== TUITION CONFIG ============== */
export function AdminTuition() {
  return (
    <div className="space-y-6">
      {TUITION_CONFIG.map((g) => (
        <Card key={g.group}>
          <CardHeader><CardTitle>{g.group}</CardTitle></CardHeader>
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
  );
}

/* ============== PROMOTIONS ============== */
export function AdminPromotions() {
  return (
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
  );
}

/* ============== COLLECT FEE ============== */
export function AdminCollect() {
  const { students, classes, receipts, setReceipts, setStudents } = useApp();
  const [studentId, setStudentId] = React.useState(students[0].id);
  const [pkg, setPkg] = React.useState("1");
  const [promoId, setPromoId] = React.useState("p0");
  const [extra, setExtra] = React.useState(0);
  const [received, setReceived] = React.useState(0);
  const [method, setMethod] = React.useState<Receipt["method"]>("Tiền mặt");
  const [receiptNo, setReceiptNo] = React.useState("");
  const [date, setDate] = React.useState("26/05/2026");
  const [note, setNote] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const stu = students.find((s) => s.id === studentId)!;
  const cls = classes.find((c) => c.id === stu.classId)!;
  const sessionsToAdd = Number(pkg) * cls.totalSessions;
  const base = cls.pricePerCourse * Number(pkg);
  const promo = PROMOTIONS.find((p) => p.id === promoId)!;
  const discount = promo.type === "fixed" ? promo.value : Math.round((base * promo.value) / 100);
  const total = Math.max(0, base - discount + Number(extra));
  const debt = Math.max(0, total - Number(received));

  const submit = () => {
    if (method === "Tiền mặt" && !receiptNo.trim()) {
      toast.error("Cần nhập số phiếu thu (tiền mặt)", { description: "VD: DC-000125" });
      return;
    }
    setConfirmOpen(true);
  };

  const finalize = () => {
    const id = receiptNo.trim() || `${stu.branch.slice(0, 2).toUpperCase()}-${String(1000 + receipts.length).slice(1)}`;
    const newReceipt: Receipt = {
      id, studentId: stu.id, studentName: stu.name, branch: stu.branch,
      amount: Number(received), method, status: "Hiệu lực",
      createdBy: "Admin (demo)", createdAt: date, note,
    };
    setReceipts((prev) => [newReceipt, ...prev]);
    setStudents((prev) => prev.map((s) => s.id === stu.id
      ? { ...s, bought: s.bought + sessionsToAdd, debt: s.debt + debt }
      : s));
    toast.success("Đã tạo phiếu thu", {
      description: `Cộng ${sessionsToAdd} buổi vào ví ${stu.name}. Phiếu: ${id}.`,
    });
    setConfirmOpen(false);
    setReceiptNo(""); setReceived(0); setExtra(0); setPromoId("p0"); setNote("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader><CardTitle>Phiếu thu học phí</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Học viên">
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {students.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
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
                  <SelectItem value="POS">POS</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label={`Số phiếu thu ${method === "Tiền mặt" ? "(bắt buộc khớp phiếu giấy)" : "(auto)"}`}>
              <Input placeholder="VD: DC-000125" value={receiptNo} onChange={(e) => setReceiptNo(e.target.value)} />
            </Field>
            <Field label="Ngày thu"><Input value={date} onChange={(e) => setDate(e.target.value)} /></Field>
            <Field label="Ghi chú" className="col-span-2"><Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} /></Field>
          </div>
          <Button onClick={submit} className="w-full" size="lg">
            <Wallet className="h-4 w-4" /> Cập nhật học phí
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-4 w-4 text-indigo-600" /> Kết quả tính toán</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row label="Số buổi cộng vào ví" value={`+${sessionsToAdd} buổi`} highlight />
          <Row label="Học phí gốc" value={formatVND(base)} />
          <Row label="Ưu đãi" value={`- ${formatVND(discount)}`} />
          <Row label="Thu khác" value={`+ ${formatVND(Number(extra))}`} />
          <div className="border-t pt-2"><Row label="Thành tiền" value={formatVND(total)} bold /></div>
          <Row label="Thực thu" value={formatVND(Number(received))} />
          <Row label="Công nợ còn lại" value={formatVND(debt)} highlight={debt > 0} />
          <div className="bg-slate-50 border rounded p-3 text-xs text-slate-600 leading-relaxed">
            <strong>Logic:</strong> Thành tiền = Học phí gốc − Ưu đãi + Thu khác.<br />
            Công nợ = Thành tiền − Thực thu. Khi cập nhật, hệ thống tự tạo phiếu thu và cộng buổi vào ví học viên.
          </div>
        </CardContent>
      </Card>

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
    </div>
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
            <Box label="Tổng POS" value={formatVND(sumBy("POS"))} />
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
              <Field label="Yêu cầu lớp mới"><Input value={`${newClass.totalSessions} buổi`} readOnly /></Field>
              <Field label="Đơn giá 1 buổi"><Input value={formatVND(newClass.pricePerSession)} readOnly /></Field>
              <div className={`text-xs px-3 py-2 rounded ${sameBranch ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                {sameBranch ? "Chuyển cùng chi nhánh" : "Chuyển khác chi nhánh"} · {oldClass.branch} <ArrowRight className="inline h-3 w-3" /> {newClass.branch}
              </div>
            </div>
            <div className="rounded-lg border bg-slate-50 p-4 space-y-2 text-sm">
              <div className="font-semibold flex items-center gap-2"><Info className="h-4 w-4 text-indigo-600" /> Kết quả tính toán</div>
              <Row label="Buổi còn lại lớp cũ" value={`${remaining} buổi`} />
              <Row label="Yêu cầu lớp mới" value={`${newClass.totalSessions} buổi`} />
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
