import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/lib/app-store";
import { formatVND, SYLLABUS_LESSONS, DEFAULT_SCORE_COLUMNS, homeworkSubmissionKey, homeworkCorrectionKey } from "@/lib/mock-data";
import { toast } from "sonner";
import { ExternalLink, Link2, Save, FileCheck } from "lucide-react";

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

export function StudentHomework() {
  const { me, myClass } = useMe();
  const { homeworkSubmissions, homeworkCorrections, setHomeworkSubmission } = useApp();
  const [sessionIdx, setSessionIdx] = React.useState(Math.max(1, me.attended));
  const [drafts, setDrafts] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    setDrafts(
      Object.fromEntries(
        DEFAULT_SCORE_COLUMNS.map((col) => [
          col.id,
          homeworkSubmissions[homeworkSubmissionKey(me.id, sessionIdx, col.id)] ?? "",
        ]),
      ),
    );
  }, [homeworkSubmissions, me.id, sessionIdx]);

  const saveAll = () => {
    DEFAULT_SCORE_COLUMNS.forEach((col) => {
      setHomeworkSubmission(me.id, sessionIdx, col.id, drafts[col.id] ?? "");
    });
    toast.success("Đã gửi link bài nộp cho giáo viên");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-indigo-600" />
            Nộp BTVN
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Dán link Google Docs / Google Drive bài làm của bạn. Giáo viên sẽ xem bài nộp bên cạnh ô chấm điểm trên báo cáo buổi học.
          </p>
          <div className="max-w-xs">
            <Label className="text-xs text-muted-foreground">Buổi học</Label>
            <Select value={String(sessionIdx)} onValueChange={(v) => setSessionIdx(Number(v))}>
              <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: Math.max(me.attended, 1) }).map((_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>Buổi {i + 1}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Bài nộp · Buổi {sessionIdx} · {myClass.name}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {DEFAULT_SCORE_COLUMNS.map((col) => {
            const submitKey = homeworkSubmissionKey(me.id, sessionIdx, col.id);
            const corrKey = homeworkCorrectionKey(me.id, sessionIdx, col.id);
            const saved = homeworkSubmissions[submitKey];
            const corrected = homeworkCorrections[corrKey];
            return (
              <div key={col.id} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <Label className="font-medium">{col.label || "Bài tập"}</Label>
                  <div className="flex gap-1.5">
                    {saved ? (
                      <Badge variant="secondary" className="text-[10px]">Đã nộp</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">Chưa nộp</Badge>
                    )}
                    {corrected && (
                      <Badge className="text-[10px] bg-emerald-600 hover:bg-emerald-600">Đã chữa bài</Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Bài nộp của bạn</Label>
                  <div className="flex gap-2">
                    <Input
                      value={drafts[col.id] ?? ""}
                      onChange={(e) => setDrafts((d) => ({ ...d, [col.id]: e.target.value }))}
                      placeholder="https://docs.google.com/..."
                      className="h-9"
                    />
                    {saved && (
                      <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" asChild title="Mở bài nộp">
                        <a href={saved.startsWith("http") ? saved : `https://${saved}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                {corrected ? (
                  <div className="rounded-md border border-emerald-200 bg-emerald-50/60 p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-emerald-800">
                      <FileCheck className="h-4 w-4 shrink-0" />
                      <span>Giáo viên đã up bài chữa</span>
                    </div>
                    <Button size="sm" variant="outline" className="border-emerald-300 bg-white hover:bg-emerald-50" asChild>
                      <a href={corrected.startsWith("http") ? corrected : `https://${corrected}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" /> Xem bài chữa
                      </a>
                    </Button>
                  </div>
                ) : saved ? (
                  <p className="text-xs text-muted-foreground italic">Giáo viên chưa up link chữa bài.</p>
                ) : null}
              </div>
            );
          })}
          <Button onClick={saveAll}>
            <Save className="h-4 w-4" /> Lưu & gửi bài nộp
          </Button>
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