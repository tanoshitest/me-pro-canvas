import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/lib/app-store";
import { formatVND, SYLLABUS_LESSONS } from "@/lib/mock-data";

const ME_ID = "s1"; // demo: student logs in as Hồng Diệp

function useMe() {
  const { students, classes, receipts } = useApp();
  const me = students.find((s) => s.id === ME_ID)!;
  const myClass = classes.find((c) => c.id === me.classId)!;
  const myReceipts = receipts.filter((r) => r.studentId === me.id);
  return { me, myClass, myReceipts };
}

export function StudentInfo() {
  const { me, myClass } = useMe();
  const left = me.bought - me.attended;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card><CardHeader><CardTitle>Lớp hiện tại</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label="Tên lớp" value={myClass.name} />
          <Row label="Chi nhánh" value={myClass.branch} />
          <Row label="Giáo viên" value={myClass.teacher} />
          <Row label="Syllabus đang học" value={myClass.syllabus} />
        </CardContent></Card>
      <Card><CardHeader><CardTitle>Buổi học</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row label="Đã mua" value={`${me.bought} buổi`} />
          <Row label="Đã học" value={`${me.attended} buổi`} />
          <Row label="Còn lại" value={`${left} buổi`} highlight />
          <Progress value={(me.attended / me.bought) * 100} />
          <Row label="Công nợ" value={formatVND(me.debt)} highlight={me.debt > 0} />
        </CardContent></Card>
    </div>
  );
}

export function StudentSchedule() {
  const { myClass } = useMe();
  const list = Array.from({ length: 8 }).map((_, i) => ({
    date: `${String(10 + i * 3).padStart(2, "0")}/06/2026`,
    status: i === 2 ? "Nghỉ" : "Sắp tới",
  }));
  return (
    <Card>
      <CardHeader><CardTitle>Buổi học sắp tới · {myClass.name}</CardTitle></CardHeader>
      <CardContent>
        <div className="text-sm text-slate-600 mb-3">Ngày kết thúc mới: <strong>{myClass.endDate}</strong></div>
        <Table>
          <TableHeader><TableRow><TableHead>Ngày</TableHead><TableHead>Giờ</TableHead><TableHead>Trạng thái</TableHead></TableRow></TableHeader>
          <TableBody>
            {list.map((b) => (
              <TableRow key={b.date}>
                <TableCell>{b.date}</TableCell>
                <TableCell>{myClass.time}</TableCell>
                <TableCell>
                  <Badge variant={b.status === "Nghỉ" ? "destructive" : "secondary"}>{b.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function StudentTuition() {
  const { me, myReceipts } = useMe();
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Card><CardContent className="p-5"><div className="text-sm text-slate-500">Đã đóng</div><div className="text-xl font-bold">{formatVND(myReceipts.reduce((s, r) => s + r.amount, 0))}</div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="text-sm text-slate-500">Công nợ</div><div className="text-xl font-bold text-rose-600">{formatVND(me.debt)}</div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="text-sm text-slate-500">Gói đã mua</div><div className="text-xl font-bold">{me.bought} buổi</div></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Lịch sử đóng học phí</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Mã phiếu</TableHead><TableHead>Ngày</TableHead><TableHead>Số tiền</TableHead><TableHead>Phương thức</TableHead><TableHead>Trạng thái</TableHead></TableRow></TableHeader>
            <TableBody>
              {myReceipts.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell>{r.createdAt}</TableCell>
                  <TableCell>{formatVND(r.amount)}</TableCell>
                  <TableCell>{r.method}</TableCell>
                  <TableCell><Badge variant={r.status === "Hiệu lực" ? "default" : "secondary"}>{r.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function StudentResults() {
  const progress = 4 / SYLLABUS_LESSONS.length;
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Tiến độ syllabus</CardTitle></CardHeader>
        <CardContent>
          <Progress value={progress * 100} />
          <div className="text-sm text-slate-500 mt-2">Đã hoàn thành 4/{SYLLABUS_LESSONS.length} buổi</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Điểm theo từng buổi</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Buổi</TableHead>
              <TableHead>Listening</TableHead><TableHead>Speaking</TableHead><TableHead>Reading</TableHead><TableHead>Writing</TableHead>
              <TableHead>Nhận xét GV</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {SYLLABUS_LESSONS.slice(0, 4).map((l, i) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.title}</TableCell>
                  <TableCell>{8 + i * 0.3}</TableCell><TableCell>{7.5 + i * 0.4}</TableCell>
                  <TableCell>{8.5}</TableCell><TableCell>{8}</TableCell>
                  <TableCell className="text-sm text-slate-600">Tiến bộ, cần luyện thêm phát âm.</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between"><span className="text-slate-500">{label}</span>
      <span className={`font-medium ${highlight ? "text-indigo-700" : ""}`}>{value}</span></div>
  );
}