export const BRANCHES = ["Đội Cấn", "Hoàng Hoa Thám", "Ngọc Hà"] as const;
export type Branch = (typeof BRANCHES)[number];

export type Role = "admin" | "teacher" | "student";

export interface Student {
  id: string;
  name: string;
  nickname?: string;
  branch: Branch;
  classId: string;
  bought: number;
  attended: number;
  debt: number;
  transferDebt?: number; // công nợ phát sinh do chuyển lớp
  transferNote?: string;
  feeStatus?: "debt" | "pending" | "ok"; // Còn nợ → Đã ghi nhận → Đã đóng đủ
  feeUpdatedAt?: string; // dd/mm/yyyy - lần cập nhật học phí gần nhất
  // Personal
  dob?: string;            // dd/mm/yyyy
  gender?: "Nam" | "Nữ";
  school?: string;
  address?: string;
  email?: string;
  note?: string;
  // Parent
  parentName?: string;
  parentPhone?: string;
  parentRelation?: "Bố" | "Mẹ" | "Người giám hộ";
  parentEmail?: string;
  // Academic
  enrolledAt?: string;     // dd/mm/yyyy
  syllabusProgress?: number;   // lessons done
  syllabusTotal?: number;      // total lessons
  avgScore?: number;           // 0-10
  latestComment?: string;
  // Ops history
  transferHistory?: { at: string; from: string; to: string; reason: string }[];
  branchHistory?:   { at: string; from: Branch; to: Branch; reason: string }[];
  attendanceHistory?: { at: string; session: string; status: "Có mặt" | "Vắng có phép" | "Vắng không phép" | "Đi muộn" }[];
  scoreHistory?: { at: string; session: string; listening: number; speaking: number; reading: number; writing: number }[];
  auditLog?: { at: string; by: string; action: string; detail: string }[];
  lifecycleHistory?: { at: string; type: "Nhập học" | "Dừng học" | "Bảo lưu" | "Đi học lại"; note?: string }[];
}

export interface ClassRoom {
  id: string;
  name: string;
  schedule: string;
  time: string;
  branch: Branch;
  teacher: string;
  room: string;
  syllabus: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  remainingSessions: number;
  pricePerCourse: number;
  pricePerSession: number;
  sessions?: { day: string; time: string; room: string }[];
  offDates?: string[];   // các ngày nghỉ "dd/mm/yyyy" — buổi học tự dời sang buổi kế tiếp
}

export interface Receipt {
  id: string;
  studentId: string;
  studentName: string;
  branch: Branch;
  amount: number;
  method: "Tiền mặt" | "Chuyển khoản";
  status: "Hiệu lực" | "Đã hủy";
  createdBy: string;
  createdAt: string;
  note?: string;
  cancelLog?: { by: string; at: string; reason: string };
}

export const STUDENTS: Student[] = [
  {
    id: "s1", name: "Hồng Diệp", nickname: "Kirito", branch: "Đội Cấn", classId: "c1",
    bought: 32, attended: 22, debt: 1160000, feeStatus: "debt",
    dob: "12/05/2016", gender: "Nữ", school: "Tiểu học Nguyễn Trãi",
    address: "12 Đội Cấn, Ba Đình, Hà Nội", email: "hongdiep.kirito@gmail.com",
    note: "Bé nhút nhát, cần khuyến khích nói nhiều hơn.",
    parentName: "Nguyễn Văn Hùng", parentPhone: "0912 345 678",
    parentRelation: "Bố", parentEmail: "hung.nguyen@gmail.com",
    enrolledAt: "01/03/2026", syllabusProgress: 11, syllabusTotal: 24,
    avgScore: 8.4, latestComment: "Phát âm rõ, cần luyện thêm Writing.",
    attendanceHistory: [
      { at: "03/03/2026", session: "Buổi 1", status: "Có mặt" },
      { at: "06/03/2026", session: "Buổi 2", status: "Có mặt" },
      { at: "10/03/2026", session: "Buổi 3", status: "Đi muộn" },
      { at: "13/03/2026", session: "Buổi 4", status: "Vắng có phép" },
      { at: "17/03/2026", session: "Buổi 5", status: "Có mặt" },
      { at: "20/03/2026", session: "Buổi 6", status: "Có mặt" },
      { at: "24/03/2026", session: "Buổi 7", status: "Đi muộn" },
      { at: "27/03/2026", session: "Buổi 8", status: "Có mặt" },
      { at: "31/03/2026", session: "Buổi 9", status: "Vắng không phép" },
      { at: "03/04/2026", session: "Buổi 10", status: "Có mặt" },
    ],
    scoreHistory: [
      { at: "10/03/2026", session: "Buổi 3", listening: 8.5, speaking: 8, reading: 9, writing: 7.5 },
      { at: "17/03/2026", session: "Buổi 5", listening: 9,   speaking: 8.5, reading: 9, writing: 8 },
      { at: "20/03/2026", session: "Buổi 6", listening: 8,   speaking: 8,   reading: 8.5, writing: 7 },
      { at: "24/03/2026", session: "Buổi 7", listening: 8.5, speaking: 9,   reading: 9,   writing: 8 },
      { at: "27/03/2026", session: "Buổi 8", listening: 9,   speaking: 9,   reading: 9.5, writing: 8.5 },
      { at: "31/03/2026", session: "Buổi 9", listening: 7.5, speaking: 8,   reading: 8,   writing: 7 },
      { at: "03/04/2026", session: "Buổi 10", listening: 9.5, speaking: 9,  reading: 9,   writing: 8.5 },
      { at: "07/04/2026", session: "Buổi 11", listening: 9,   speaking: 9.5, reading: 9,  writing: 9 },
      { at: "10/04/2026", session: "Buổi 12", listening: 8.5, speaking: 9,   reading: 8.5, writing: 8 },
      { at: "14/04/2026", session: "Buổi 13", listening: 9,   speaking: 9,   reading: 9,   writing: 8.5 },
    ],
    auditLog: [
      { at: "01/03/2026 09:10", by: "Admin Lan", action: "Tạo hồ sơ", detail: "Khởi tạo thông tin học viên" },
      { at: "02/03/2026 14:22", by: "Admin Lan", action: "Thu học phí", detail: "Phiếu DC-000123 · +24 buổi" },
    ],
    lifecycleHistory: [
      { at: "01/03/2026", type: "Nhập học", note: "Đăng ký khoá Family & Friends 1 tại CN Đội Cấn" },
      { at: "15/04/2026", type: "Bảo lưu", note: "PH xin bảo lưu 2 tuần vì lý do gia đình" },
      { at: "29/04/2026", type: "Đi học lại", note: "Quay lại lớp 4CLC1 sau bảo lưu" },
    ],
  },
  {
    id: "s2", name: "Đăng Khoa", nickname: "Bing", branch: "Đội Cấn", classId: "c1",
    bought: 14, attended: 24, debt: 4060000, transferDebt: 0, feeStatus: "pending",
    feeUpdatedAt: "01/06/2026",
    dob: "08/09/2015", gender: "Nam", school: "Tiểu học Kim Đồng",
    address: "45 Liễu Giai, Ba Đình, Hà Nội", email: "",
    note: "Hiếu động, học tốt phần Listening.",
    parentName: "Trần Thị Hoa", parentPhone: "0987 654 321",
    parentRelation: "Mẹ", parentEmail: "hoa.tran@gmail.com",
    enrolledAt: "01/03/2026", syllabusProgress: 20, syllabusTotal: 24,
    avgScore: 7.8, latestComment: "Tiến bộ rõ ở phần nói, còn nợ học phí khóa mới.",
    auditLog: [
      { at: "01/03/2026 10:05", by: "Admin Lan", action: "Tạo hồ sơ", detail: "Khởi tạo thông tin học viên" },
      { at: "02/03/2026 14:30", by: "Admin Lan", action: "Thu học phí", detail: "Phiếu DC-000124 · còn nợ 500.000" },
    ],
  },
  {
    id: "s3", name: "Mimi", branch: "Hoàng Hoa Thám", classId: "c1",
    bought: 24, attended: 10, debt: 1450000, feeStatus: "debt",
    dob: "20/11/2016", gender: "Nữ", school: "Tiểu học Hoàng Hoa Thám",
    address: "120 Hoàng Hoa Thám, Ba Đình, Hà Nội", email: "",
    parentName: "Lê Minh Tâm", parentPhone: "0901 234 567",
    parentRelation: "Mẹ", parentEmail: "tam.le@gmail.com",
    enrolledAt: "05/03/2026", syllabusProgress: 6, syllabusTotal: 24,
    avgScore: 8.0, latestComment: "Chăm chỉ làm bài tập về nhà.",
  },
  {
    id: "s4", name: "Lại Thế Thái Dương", branch: "Ngọc Hà", classId: "c1",
    bought: 96, attended: 30, debt: 0, feeStatus: "ok",
    dob: "15/02/2015", gender: "Nam", school: "Tiểu học Ngọc Hà",
    address: "8 Ngọc Hà, Ba Đình, Hà Nội", email: "thaiduong.lai@gmail.com",
    parentName: "Lại Văn Bình", parentPhone: "0978 111 222",
    parentRelation: "Bố", parentEmail: "binh.lai@gmail.com",
    enrolledAt: "10/02/2026", syllabusProgress: 30, syllabusTotal: 96,
    avgScore: 9.1, latestComment: "Học viên xuất sắc, có thể nâng trình.",
    transferHistory: [
      { at: "01/02/2026", from: "FF1 Basic", to: "FF1 Kids", reason: "Phụ huynh đề nghị nâng trình" },
    ],
  },
  {
    id: "s5", name: "Nguyễn Ngọc Linh", branch: "Đội Cấn", classId: "c1",
    bought: 24, attended: 26, debt: 2900000, feeStatus: "pending",
    feeUpdatedAt: "02/06/2026",
    dob: "03/07/2016", gender: "Nữ", school: "Tiểu học Nguyễn Trãi",
    address: "27 Đội Cấn, Ba Đình, Hà Nội", email: "",
    parentName: "Nguyễn Thị Mai", parentPhone: "0936 777 888",
    parentRelation: "Mẹ", parentEmail: "mai.nguyen@gmail.com",
    enrolledAt: "01/03/2026", syllabusProgress: 23, syllabusTotal: 24,
    avgScore: 8.2, latestComment: "Sắp hết khóa, đã nhắc PH gia hạn.",
  },
];

export const CLASSES: ClassRoom[] = [
  {
    id: "c1", name: "Kindy 7", schedule: "Thứ 2, CN", time: "18:00 - 19:30", branch: "Đội Cấn",
    teacher: "Cô Mai", room: "P.201", syllabus: "FAM",
    startDate: "22/05/2026", endDate: "18/12/2026",
    totalSessions: 71, remainingSessions: 71, pricePerCourse: 3480000, pricePerSession: 145000,
    sessions: [
      { day: "Thứ 2",    time: "18:00 - 19:30", room: "P.201" },
      { day: "Chủ nhật", time: "08:00 - 09:30", room: "P.201" },
    ],
  },
];

export interface TuitionTier {
  label: string;
  sessions: number;
  base: number;
  discountPct: number;
  final: number;
}
export const TUITION_CONFIG: { group: string; tiers: TuitionTier[] }[] = [
  {
    group: "Mẫu giáo - Tiểu học",
    tiers: [
      { label: "1 khóa / 24 buổi", sessions: 24, base: 3480000, discountPct: 0, final: 3480000 },
      { label: "2 khóa / 48 buổi", sessions: 48, base: 6960000, discountPct: 5, final: 6612000 },
      { label: "4 khóa / 96 buổi", sessions: 96, base: 13920000, discountPct: 7, final: 12945600 },
    ],
  },
  {
    group: "Cấp 2",
    tiers: [
      { label: "1 khóa / 24 buổi", sessions: 24, base: 3700000, discountPct: 0, final: 3700000 },
      { label: "2 khóa / 48 buổi", sessions: 48, base: 7400000, discountPct: 5, final: 7030000 },
      { label: "4 khóa / 96 buổi", sessions: 96, base: 14800000, discountPct: 7, final: 13764000 },
    ],
  },
  {
    group: "Lớp luyện thi CLC",
    tiers: [
      { label: "3 tháng (1 khóa / 24 buổi)", sessions: 24, base: 3840000, discountPct: 0, final: 3840000 },
      { label: "6 tháng (2 khóa / 48 buổi)", sessions: 48, base: 7680000, discountPct: 5, final: 7296000 },
      { label: "1 năm (4 khóa / 96 buổi)", sessions: 96, base: 15360000, discountPct: 7, final: 14285000 },
    ],
  },
];

export const PROMOTIONS = [
  { id: "p0", label: "Không ưu đãi", value: 0, type: "fixed" as const },
  { id: "p1", label: "Giảm 500k", value: 500000, type: "fixed" as const },
  { id: "p2", label: "Giảm 5%", value: 5, type: "percent" as const },
  { id: "p3", label: "Giảm 7%", value: 7, type: "percent" as const },
  { id: "p4", label: "Giảm 10%", value: 10, type: "percent" as const },
  { id: "p5", label: "Voucher 300k", value: 300000, type: "fixed" as const },
  { id: "p6", label: "Giới thiệu 2 bạn giảm 400k", value: 400000, type: "fixed" as const },
  { id: "p7", label: "Miễn phí 100%", value: 100, type: "percent" as const },
];

export const RECEIPTS_SEED: Receipt[] = [
  { id: "DC-000123", studentId: "s1", studentName: "Hồng Diệp", branch: "Đội Cấn", amount: 6612000, method: "Chuyển khoản", status: "Hiệu lực", createdBy: "Admin Lan", createdAt: "02/03/2026" },
  { id: "DC-000124", studentId: "s2", studentName: "Đăng Khoa", branch: "Đội Cấn", amount: 3480000, method: "Tiền mặt", status: "Hiệu lực", createdBy: "Admin Lan", createdAt: "02/03/2026" },
  { id: "HH-000045", studentId: "s3", studentName: "Mimi", branch: "Hoàng Hoa Thám", amount: 3480000, method: "Chuyển khoản", status: "Hiệu lực", createdBy: "Admin Hà", createdAt: "06/03/2026" },
  { id: "NH-000077", studentId: "s4", studentName: "Lại Thế Thái Dương", branch: "Ngọc Hà", amount: 12945600, method: "Chuyển khoản", status: "Hiệu lực", createdBy: "Admin Thảo", createdAt: "11/02/2026" },
  { id: "DC-000120", studentId: "s5", studentName: "Nguyễn Ngọc Linh", branch: "Đội Cấn", amount: 3480000, method: "Tiền mặt", status: "Đã hủy", createdBy: "Admin Lan", createdAt: "28/02/2026", cancelLog: { by: "Admin Lan", at: "01/03/2026 09:15", reason: "Phụ huynh hủy đăng ký" } },
];

export interface ClassShift { id: string; label: string; time: string; days: string }
export const CLASS_SHIFTS: ClassShift[] = [
  { id: "sh1", label: "Ca sáng T2-4-6", time: "08:00 - 09:30", days: "Thứ 2, 4, 6" },
  { id: "sh2", label: "Ca chiều T2-4-6", time: "16:30 - 18:00", days: "Thứ 2, 4, 6" },
  { id: "sh3", label: "Ca tối T2-4-6", time: "18:30 - 20:00", days: "Thứ 2, 4, 6" },
  { id: "sh4", label: "Ca sáng T3-5-7", time: "08:00 - 09:30", days: "Thứ 3, 5, 7" },
  { id: "sh5", label: "Ca chiều T3-5-7", time: "16:30 - 18:00", days: "Thứ 3, 5, 7" },
  { id: "sh6", label: "Ca tối T3-5-7", time: "18:30 - 20:00", days: "Thứ 3, 5, 7" },
  { id: "sh7", label: "Ca cuối tuần sáng", time: "08:00 - 09:30", days: "Thứ 7, CN" },
  { id: "sh8", label: "Ca cuối tuần chiều", time: "14:00 - 15:30", days: "Thứ 7, CN" },
];

export interface ClassRoomConfig { id: string; name: string; branch: Branch; capacity: number }
export const ROOMS: ClassRoomConfig[] = [
  { id: "r1", name: "P.201", branch: "Đội Cấn", capacity: 20 },
  { id: "r2", name: "P.202", branch: "Đội Cấn", capacity: 18 },
  { id: "r3", name: "P.203", branch: "Đội Cấn", capacity: 25 },
  { id: "r4", name: "P.105", branch: "Hoàng Hoa Thám", capacity: 20 },
  { id: "r5", name: "P.106", branch: "Hoàng Hoa Thám", capacity: 22 },
  { id: "r6", name: "P.301", branch: "Ngọc Hà", capacity: 18 },
  { id: "r7", name: "P.302", branch: "Ngọc Hà", capacity: 20 },
];

export interface CashReceiptConfig {
  branch: Branch;
  prefix: string;
  start: number;
  end: number;
  current: number;
}
export const CASH_RECEIPT_CONFIG_SEED: CashReceiptConfig[] = [
  { branch: "Đội Cấn",        prefix: "DC", start: 125, end: 999, current: 124 },
  { branch: "Hoàng Hoa Thám", prefix: "HH", start: 46,  end: 999, current: 45  },
  { branch: "Ngọc Hà",        prefix: "NH", start: 78,  end: 999, current: 77  },
];

export const SYLLABUS_LESSONS = [
  { id: "l1", title: "Buổi 1: Hello! My name is...", vocab: "hello, name, I, you", grammar: "What's your name? — My name is...", material: "SB p.4-5, WB p.2", classwork: "Role-play giới thiệu bản thân", homework: "WB p.3, học thuộc lời chào" },
  { id: "l2", title: "Buổi 2: My family", vocab: "mum, dad, brother, sister", grammar: "This is my...", material: "SB p.6-7", classwork: "Vẽ cây gia đình", homework: "Tô màu trang 4 WB" },
  { id: "l3", title: "Buổi 3: My toys", vocab: "ball, doll, car, teddy", grammar: "I have a...", material: "SB p.8-9", classwork: "Đếm đồ chơi", homework: "WB p.5" },
  { id: "l4", title: "Buổi 4: Colors & Shapes", vocab: "red, blue, circle, square", grammar: "It's a red ball.", material: "SB p.10-11", classwork: "Phân loại theo màu", homework: "WB p.6" },
  { id: "l5", title: "Buổi 5: Food I like", vocab: "apple, banana, rice, milk", grammar: "I like / I don't like", material: "SB p.12-13", classwork: "Hỏi đáp về thức ăn", homework: "WB p.7" },
];

export const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(Math.round(n)) + " VNĐ";

export interface Syllabus {
  id: string;
  code: string;
  name: string;
  level: string;
  ageGroup: string;
  totalLessons: number;
  description: string;
  stages?: number;
  bigTests?: number;
  status?: "Đang dùng" | "Bản nháp" | "Lưu trữ";
  createdAt?: string;
  createdBy?: string;
}
export const SYLLABI: Syllabus[] = [
  { id: "syFAM", code: "FAM",    name: "FAM",                     level: "Starter",      ageGroup: "Mẫu giáo - Lớp 1", totalLessons: 71, stages: 5, bigTests: 5, status: "Đang dùng", createdAt: "01/07/2026", createdBy: "Ms Liên", description: "Family & Friends 1 - Tổng hợp 5 chặng (Unit 0 → 15), 71 buổi." },
];

/* ===== Syllabus chi tiết (demo dùng chung cho mọi syllabus khi mở chi tiết) ===== */
export type HomeworkTaskType = "Phiếu bài tập" | "Quay video" | "None";

export const HOMEWORK_TASK_TYPES: HomeworkTaskType[] = ["Phiếu bài tập", "Quay video", "None"];

export interface SyllabusHomeworkItem {
  id: string;
  content: string;
  type: HomeworkTaskType;
}

export interface SyllabusLesson {
  id: string;
  index: number;
  unit: string;
  objective: string;
  content: string;
  lessonPlan?: string;
  foreignTeacherContent?: string;   // Nội dung cho giáo viên nước ngoài
  suggestedActivities?: string;     // Hoạt động gợi ý
  homeworks: SyllabusHomeworkItem[];
  material: string;
  note: string;
  isBigTest?: boolean;
}
export interface SyllabusBigTest {
  id: string;
  name: string;
  material: string;
  note: string;
}
export interface SyllabusStage {
  id: string;
  name: string;
  goal: string;
  lessons: SyllabusLesson[];
  bigTest: SyllabusBigTest;
}

export type SyllabusSessionData =
  | { id: string; kind: "lesson"; lesson: SyllabusLesson }
  | { id: string; kind: "bigtest"; name: string; note: string; material: string };

export type SyllabusStageData = {
  id: string;
  name: string;
  goal: string;
  sessions: SyllabusSessionData[];
};

export function normalizeSyllabusStage(st: SyllabusStage): SyllabusStageData {
  const sessions: SyllabusSessionData[] = st.lessons.map((l) =>
    l.isBigTest
      ? { id: l.id, kind: "bigtest", name: l.unit, note: l.note, material: l.material }
      : { id: l.id, kind: "lesson", lesson: l },
  );
  sessions.push({
    id: st.bigTest.id,
    kind: "bigtest",
    name: st.bigTest.name,
    note: st.bigTest.note,
    material: st.bigTest.material,
  });
  return { id: st.id, name: st.name, goal: st.goal, sessions };
}

const inferHomeworkType = (text: string): HomeworkTaskType => {
  if (/quay video|video/i.test(text)) return "Quay video";
  return "Phiếu bài tập";
};

const mkLessons = (
  prefix: string,
  units: {
    unit: string;
    objective: string;
    content: string;
    homework?: string;
    note: string;
    homeworks?: SyllabusHomeworkItem[];
  }[],
): SyllabusLesson[] =>
  units.map((u, i) => ({
    id: `${prefix}-l${i + 1}`,
    index: i + 1,
    unit: u.unit,
    objective: "",
    content: [u.objective, u.content, u.note].filter(Boolean).join("\n\n"),
    homeworks:
      u.homeworks ??
      (u.homework
        ? [{ id: `${prefix}-l${i + 1}-h1`, content: u.homework, type: inferHomeworkType(u.homework) }]
        : []),
    material: `https://drive.google.com/mock/${prefix}-unit-${String(i + 1).padStart(2, "0")}`,
    note: "",
  }));

export const SYLLABUS_STAGES: SyllabusStage[] = [
  {
    id: "st1", name: "Chặng 1: Làm quen tiếng Nhật cơ bản",
    goal: "Học viên nhận diện bảng chữ, phát âm chuẩn, viết được Hiragana và Katakana cơ bản.",
    lessons: mkLessons("s1", [
      {
        unit: "Hiragana cơ bản",
        objective: "Học viên nhận diện và viết được nhóm chữ Hiragana đầu tiên",
        content: "Giới thiệu bảng chữ cái, luyện phát âm, luyện viết từng hàng chữ",
        note: "Giáo viên kiểm tra phát âm từng học viên",
        homeworks: [
          { id: "s1-l1-h1", content: "Viết mỗi chữ 5 dòng, học thuộc hàng あ・か・さ", type: "Phiếu bài tập" },
          { id: "s1-l1-h2", content: "Quay video đọc to 10 từ Hiragana đã học trong ngày", type: "Quay video" },
          { id: "s1-l1-h3", content: "Ôn lại bảng chữ đã học trên sách giáo khoa", type: "None" },
        ],
      },
      { unit: "Hiragana mở rộng", objective: "Hoàn thiện toàn bộ bảng Hiragana", content: "Luyện hàng た・な・は・ま・や・ら・わ, ghép từ đơn giản", homework: "Viết 20 từ vựng cơ bản bằng Hiragana", note: "Chú ý nét viết đúng thứ tự" },
      { unit: "Katakana cơ bản", objective: "Nhận diện Katakana và từ ngoại lai", content: "Giới thiệu Katakana, so sánh với Hiragana, từ ngoại lai thường gặp", homework: "Viết tên mình và 10 từ ngoại lai bằng Katakana", note: "Lưu ý phân biệt シ/ツ, ソ/ン" },
      { unit: "Chào hỏi & tự giới thiệu", objective: "Sử dụng được mẫu câu chào hỏi và tự giới thiệu", content: "はじめまして, わたしは～です, よろしくおねがいします", homework: "Quay video tự giới thiệu 30 giây", note: "Khuyến khích học viên nói trước lớp" },
    ]),
    bigTest: { id: "bt1", name: "Big Test 1: Bảng chữ và chào hỏi", material: "https://drive.google.com/mock/bigtest-01", note: "Kiểm tra chữ cái, từ vựng và mẫu câu cơ bản" },
  },
  {
    id: "st2", name: "Chặng 2: Ngữ pháp và mẫu câu nền tảng",
    goal: "Nắm vững các mẫu câu khẳng định, phủ định, nghi vấn và trợ từ cơ bản.",
    lessons: mkLessons("s2", [
      { unit: "Trợ từ は・が・を", objective: "Sử dụng đúng các trợ từ cơ bản", content: "Phân biệt は và が, vai trò của を trong câu", homework: "Đặt 10 câu sử dụng đầy đủ trợ từ", note: "Làm thêm bài tập trong sách Minna" },
      { unit: "Danh từ và tính từ", objective: "Mô tả người, vật bằng tính từ -i và -na", content: "Cấu trúc N は A です, phân loại tính từ", homework: "Viết đoạn văn 5 câu mô tả gia đình", note: "Nhắc lại quy tắc chia tính từ" },
      { unit: "Động từ nhóm I & II", objective: "Chia động từ thể ます", content: "Phân loại nhóm động từ, chia thể ます/ません", homework: "Hoàn thành bảng chia 20 động từ", note: "Kiểm tra miệng đầu buổi sau" },
      { unit: "Mẫu câu nghi vấn", objective: "Đặt câu hỏi cơ bản bằng tiếng Nhật", content: "～か, từ để hỏi なに, どこ, いつ, だれ", homework: "Phỏng vấn bạn cùng lớp 5 câu hỏi", note: "Tổ chức hoạt động theo cặp" },
    ]),
    bigTest: { id: "bt2", name: "Big Test 2: Ngữ pháp nền tảng", material: "https://drive.google.com/mock/bigtest-02", note: "Trắc nghiệm ngữ pháp và viết câu" },
  },
  {
    id: "st3", name: "Chặng 3: Giao tiếp tình huống thường ngày",
    goal: "Giao tiếp được trong các tình huống mua sắm, nhà hàng, hỏi đường.",
    lessons: mkLessons("s3", [
      { unit: "Tại nhà hàng", objective: "Gọi món và thanh toán bằng tiếng Nhật", content: "Mẫu câu gọi món, hỏi giá, đếm số tiền", homework: "Đóng vai gọi món qua video", note: "In sẵn menu mẫu cho lớp" },
      { unit: "Đi mua sắm", objective: "Hỏi giá, hỏi size, mặc cả lịch sự", content: "いくらですか, ありますか, từ vựng quần áo", homework: "Học 30 từ vựng mua sắm", note: "Mang vật mẫu để luyện hội thoại" },
      { unit: "Hỏi đường", objective: "Hỏi và chỉ đường đơn giản", content: "Từ chỉ hướng, phương tiện giao thông", homework: "Vẽ sơ đồ và mô tả bằng tiếng Nhật", note: "Cho học viên thực hành trên bản đồ Tokyo" },
      { unit: "Gọi điện & hẹn gặp", objective: "Thực hiện cuộc gọi cơ bản", content: "もしもし, hẹn giờ, hẹn địa điểm", homework: "Ghi âm hội thoại 1 phút", note: "Lưu ý kính ngữ cơ bản" },
    ]),
    bigTest: { id: "bt3", name: "Big Test 3: Hội thoại tình huống", material: "https://drive.google.com/mock/bigtest-03", note: "Thi nói theo tình huống bốc thăm" },
  },
  {
    id: "st4", name: "Chặng 4: Luyện đọc hiểu và nghe hiểu",
    goal: "Đọc đoạn văn ngắn, nghe hiểu hội thoại đời sống.",
    lessons: mkLessons("s4", [
      { unit: "Đọc hiểu đoạn ngắn", objective: "Hiểu ý chính đoạn 100-150 chữ", content: "Chiến lược đọc lướt, đọc kỹ, gạch keyword", homework: "Đọc 3 bài và trả lời câu hỏi", note: "Bài đọc lấy từ đề N5 mẫu" },
      { unit: "Nghe hội thoại ngắn", objective: "Nghe hiểu hội thoại 30 giây", content: "Luyện nghe theo chủ đề, ghi chú từ khóa", homework: "Nghe 5 đoạn audio và tóm tắt", note: "Phát file audio trước buổi học" },
      { unit: "Đọc thông báo, lịch", objective: "Đọc hiểu thông báo, lịch trình", content: "Từ vựng ngày tháng, giờ, địa điểm", homework: "Dịch 3 mẫu thông báo Nhật", note: "Sưu tầm thông báo thực tế" },
      { unit: "Nghe & ghi chép", objective: "Vừa nghe vừa ghi chép thông tin", content: "Luyện ghi nhanh số, tên, địa điểm", homework: "Làm 1 đề nghe N5 mini", note: "Chấm tại lớp, phản hồi từng học viên" },
    ]),
    bigTest: { id: "bt4", name: "Big Test 4: Đọc - Nghe", material: "https://drive.google.com/mock/bigtest-04", note: "Mô phỏng đề thi N5 phần đọc và nghe" },
  },
  {
    id: "st5", name: "Chặng 5: Ôn tập tổng hợp và kiểm tra cuối khóa",
    goal: "Tổng ôn kiến thức 4 chặng và làm đề thi thử hoàn chỉnh.",
    lessons: mkLessons("s5", [
      { unit: "Tổng ôn từ vựng", objective: "Hệ thống lại 500 từ vựng đã học", content: "Trò chơi flashcard, kiểm tra theo chủ đề", homework: "Hoàn thành bộ 200 flashcard", note: "Chia nhóm thi đấu" },
      { unit: "Tổng ôn ngữ pháp", objective: "Tóm tắt toàn bộ ngữ pháp N5", content: "Mindmap ngữ pháp, bài tập tổng hợp", homework: "Làm 50 câu trắc nghiệm ngữ pháp", note: "Phát sổ tay ngữ pháp tóm tắt" },
      { unit: "Đề thi thử số 1", objective: "Làm trọn vẹn đề N5 mẫu", content: "Thi thử thời gian thật, chấm và chữa", homework: "Sửa lỗi sai và viết lại", note: "Mô phỏng phòng thi nghiêm túc" },
      { unit: "Đề thi thử số 2 & tổng kết", objective: "Đánh giá năng lực cuối khóa", content: "Thi thử lần 2, phản hồi cá nhân hóa", homework: "Lập kế hoạch học tiếp lên N4", note: "Trao chứng nhận hoàn thành khóa học" },
    ]),
    bigTest: { id: "bt5", name: "Big Test 5: Thi cuối khóa", material: "https://drive.google.com/mock/bigtest-05", note: "Thi cuối khóa tính điểm chứng nhận" },
  },
];

export const FAM_SYLLABUS_STAGES: SyllabusStage[] = [
  {
    "id": "fam-st1",
    "name": "Chặng 1: Unit 0–3",
    "goal": "Nội dung: UNIT 0, Unit 1 : OUR NEW THINGS, Unit 2 : PLAY TIME !, UNIT 3 : THIS IS MY NOSE",
    "lessons": [
      {
        "id": "fam-s1-l1",
        "index": 1,
        "unit": "UNIT 0",
        "objective": "",
        "content": "- Review : Numbers + Days of week + Colours\n- Introduce characters\n- Say Hello / Goodbye\n- Reading dialogue",
        "lessonPlan": "",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s1-l1-h1",
            "content": "Quay video chào hỏi,giới thiệu bản thân (tên,tuổi)",
            "type": "Quay video"
          },
          {
            "id": "fam-s1-l1-h2",
            "content": "Quay video lồng tiếng từ 2p40 https://youtu.be/xb3za6PAXQE",
            "type": "Quay video"
          },
          {
            "id": "fam-s1-l1-h3",
            "content": "Viết từ vựng các ngày trong tuần vào vở (mỗi từ 1 dòng)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l1-h4",
            "content": "Làm bài tập trong sách bài tập (làm hết phần Starter  Hello)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: FF1-Hello starter.pptx",
        "note": ""
      },
      {
        "id": "fam-s1-l2",
        "index": 2,
        "unit": "Unit 1 : OUR NEW THINGS · Lesson 1,2",
        "objective": "",
        "content": "- New words : School's things ( pen, rubber, pencil, ruler, book)\n- Structure : What's this ? It's a ....\n- Reading : Dialogue",
        "lessonPlan": "- Warm up\n- Teach vocab about School's things\n- Practice vocabulary ( Game)\n- Teach grammar : What's this ? It's a ....\n- Practice Grammar\n- Game Grammar\n- Read dilogue\n- Practice extra\n- Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s1-l2-h1",
            "content": "Các con quay video bài đọc từ vựng và đọc Story Lesson 1 ( Nghe kỹ link cô gửi 3-5 lần đọc theo rồi mới quay video)",
            "type": "Quay video"
          },
          {
            "id": "fam-s1-l2-h2",
            "content": "Viết từ mới và cấu trúc vào vở (mỗi từ 5 lần): vừa viết vừa đánh vần từng từ.",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l2-h3",
            "content": "Làm bài tập sách Workbook Lesson 1",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l2-h4",
            "content": "Hoàn thiện BT sách Extra Lesson 1 page 1, 2, 3 (1 số bài đã hoàn thiện tại lớp)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l2-h5",
            "content": "Hoàn thiện link quizziz cô gửi.( yêu cầu làm nhiều lần để đúng 90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 1_lesson 1&2.pptx\nhttps://quizizz.com/admin/quiz/618f66170863b9001db29dae?source=quiz_page",
        "note": ""
      },
      {
        "id": "fam-s1-l3",
        "index": 3,
        "unit": "Unit 1 : OUR NEW THINGS · Lesson 3,4",
        "objective": "",
        "content": "- Review words : School's things ( Unit 1)\n- Review grammar : WHat's this ? It's a .....\n- New words : bag, folder, door, window, bookcase\n- Song : Open the book\n- Phonics : Review phonics A - B - C - D",
        "lessonPlan": "- Warm up\n- Review words\n- Teach new word : School's things\n- Practice Vocabulary ( lesson 1+3)\n- Sing the song\n- Review Grammar : What's this ? It's a ......\n- Practice Grammar\n- Check homework\n- Review phonics\n- Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s1-l3-h1",
            "content": "Các con quay video: -Bài đọc từ mới và giới thiệu về đồ dùng học tập của mình sử dụng cấu trúc “I have got……”",
            "type": "Quay video"
          },
          {
            "id": "fam-s1-l3-h2",
            "content": "Viết từ mới vào vở ô ly mỗi từ 5 lần",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l3-h3",
            "content": "Làm bài tập về nhà trong sách Workbook Lesson 3 +4",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l3-h4",
            "content": "Làm bài tập sách Bổ trợ Lesson 2 trang 4 ,5, 6",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l3-h5",
            "content": "Làm link quizziz cô gửi ( Yêu cầu>90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 1_lesson 3&4.pptx\nhttps://quizizz.com/admin/quiz/618f66170863b9001db29dae",
        "note": ""
      },
      {
        "id": "fam-s1-l4",
        "index": 4,
        "unit": "Unit 1 : OUR NEW THINGS · Lesson 5,6",
        "objective": "",
        "content": "- Review words : School's things ( L1+3 )\n- Review grammar : WHat's this ? It's a .....\n- Reading Skill : School bag\n- Listening Skill : Listen and number\n- Writing Skill : Number of words\n- Speaking Skill : Talk about your school bag",
        "lessonPlan": "- Warm up\n- Check homework + Check test vocab\n- Practice Grammar\n- Reading + Reading comprehension\n- Listening + Asking questions about pic\n- Writing : Count the number of words\n- Guide Student to speak about school bag: Speaking Skill : Talk about your school bag",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s1-l4-h1",
            "content": "Các con quay video: Hoàn thiện School bag sau đó tập thuyết trình theo mẫu cô gửi ( Mang sản phẩm  thu hoạch vào buổi sau) -Quay video đọc lại Skill time reading giới thiệu về cái cặp sách của con (link cô gửi)",
            "type": "Quay video"
          },
          {
            "id": "fam-s1-l4-h2",
            "content": "Làm bài tập về nhà trong sách workbook trang 12,13",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l4-h3",
            "content": "Làm sách Bổ trợ Extrabài còn lại  trang 7-11 ( Bài 2 5 6 làm trên lớp)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 1_lesson 5&6.pptx\nhttps://quizizz.com/admin/quiz/61e80f9a6cda5d001f6f76b0",
        "note": ""
      },
      {
        "id": "fam-s1-l5",
        "index": 5,
        "unit": "Review words + Grammar",
        "objective": "",
        "content": "- Review words + Grammar\n- Practice speaking : Talk about your school bag\n- Listening extra : (Starters Listening )",
        "lessonPlan": "- Warm up\n- Homework check\n- Review words + Grammar\n- Practice Game\n- Speaking : Talk about school bag\n- Listening extra : Starters Listening ( L4_Bổ trợ)",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s1-l5-h1",
            "content": "Các con quay video bài speaking giới thiệu bức tranh cô gửi sử dụng cấu trúc “I see….”",
            "type": "Quay video"
          },
          {
            "id": "fam-s1-l5-h2",
            "content": "Làm bài tập lesson 4 trang 12, 13,14",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l5-h3",
            "content": "Làm links Quizziz cô gửi, yêu cầu>90%",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: Unit 1-Lesson78.pptx\nhttps://quizizz.com/admin/quiz/61518aca097d6d001df96a91?source=quiz_page",
        "note": ""
      },
      {
        "id": "fam-s1-l6",
        "index": 6,
        "unit": "Unit 2 : PLAY TIME ! · Lesson 1,2",
        "objective": "",
        "content": "- Mini test Unit 1 -15p\n- New words : Toys\n- ( doll, ball, teddy, puzzle, car)\n- Structure : This is my doll. This is your car ( my / your)\n- Reading : Dialogue",
        "lessonPlan": "- Mini test Unit 1 -15p\n- Warm up\n- Check homework\n- Teach vocab about Toys\n- Practice vocabulary ( Game)\n- Teaching Grammar : My / your\n- Practice Grammar\n- Game Grammar\n- Read dialogue\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s1-l6-h1",
            "content": "Các con quay video bài đọc từ vựng và Story theo link cô gửi",
            "type": "Quay video"
          },
          {
            "id": "fam-s1-l6-h2",
            "content": "Viết từ mới và mẫu câu cô gửi vào vở ghi (mỗi từ 5 lần )",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l6-h3",
            "content": "Làm bài tập workbook Unit2 - Lesson 1,2",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l6-h4",
            "content": "Làm sách Extra FF1 lesson 1 page 15,16,17,18  ( Bài còn lại2,4 5,)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l6-h5",
            "content": "Hoàn thiện Quizziz cô gửi (YC >90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 2_lesson 1&2.pptx\nhttps://quizizz.com/admin/quiz/61efaf6c4712ef001d18b0a0",
        "note": ""
      },
      {
        "id": "fam-s1-l7",
        "index": 7,
        "unit": "Unit 2 : PLAY TIME ! · Lesson 3,4",
        "objective": "",
        "content": "- Review words : Toys ( Lesson 1)\n- Review grammar : my / your\n- New words : kite, bike, train, game, scooter\n- Grammar : Is this your kite ? Yes, it is / No, it isn't.\n- Song : Toys, toys, toys\n- Phonics : E - F - G - H",
        "lessonPlan": "- Warm up\n- Review words\n- Teach new word : Toys\n- Practice Vocabulary ( lesson 1+3)\n- Sing the song\n- Review Grammar : my / your\n- Teach grammar : Is this your kite ? Yes, it is. / No, it isn't.\n- Check homework\n- Phonics : E - F - G - H\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s1-l7-h1",
            "content": "Các con quay video: -Đọc từ vựng sử dụng cấu trúc “I have got….” ( Lưu ý nghe kỹ link youtube rồi mới quay)",
            "type": "Quay video"
          },
          {
            "id": "fam-s1-l7-h2",
            "content": "Viết từ mới vào vở ghi (mỗi từ 5 lần)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l7-h3",
            "content": "Làm bài tập workbook Unit2-Lesson 3,4 (trang 16,17)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l7-h4",
            "content": "Làm bài tập FF1 Extra : Lesson 2 page 19,20,21 ( Bài còn lại )",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l7-h5",
            "content": "Làm quizziz cô gửi  yêu cầu >90%",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 2_lesson 3&4.pptx\nhttps://quizizz.com/admin/quiz/62cfdcd37fb34c001e45d433?source=quiz_page",
        "note": ""
      },
      {
        "id": "fam-s1-l8",
        "index": 8,
        "unit": "Unit 2 : PLAY TIME ! · Lesson 5,6",
        "objective": "",
        "content": "- Review words :  Toys ( L1+3 )\n- Review grammar : Is this your .... ? Yes, it is. / No, it isn't\n- Reading Skill : My favourite\n- Listening Skill : Listen and number\n- Writing Skill : Identify the words\n- Speaking : My favourite",
        "lessonPlan": "- Warm up\n- Check homework + Check test vocab\n- Practice Grammar\n- Reading + Reading comprehension\n- Listening + making Q and A\n- Writing : Identify the words",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s1-l8-h1",
            "content": "Các con quay video lại bài đọc Skill time 2 ( Cần nghe kỹ video 3-5 lần mới quay bài)",
            "type": "Quay video"
          },
          {
            "id": "fam-s1-l8-h2",
            "content": "Tập thuyết trình về đồ chơi yêu thích của tớ theo mẫu cô gửi. Buổi sau sẽ thực hành trên lớp.",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l8-h3",
            "content": "Làm bài tập workbook Unit2-Lesson 5,6",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l8-h4",
            "content": "Làm Bài FF1 Extra lesson 3 page 22,23,24 ( Bài còn lại )",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l8-h5",
            "content": "Làm Quizziz cô gửi (yc >90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 2_lesson 56.pptx\nhttps://quizizz.com/admin/quiz/6164458540c262001ee23a24",
        "note": ""
      },
      {
        "id": "fam-s1-l9",
        "index": 9,
        "unit": "Unit 2 : PLAY TIME ! · Lesson 7,8",
        "objective": "",
        "content": "- Review words + Grammar\n- Speaking : My favourite\n- Listening extra : (Starters Listening )\n- Mini test Unit 2",
        "lessonPlan": "- Warm up\n- Homework check\n- Review words + Grammar\n- Practice Game\n- Speaking : My favourite\n- Listening extra : Starters Listening ( L4_Bổ trợ)",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s1-l9-h1",
            "content": "Các con quay video thu hoạch bài thuyết trình : -Speaking giới thiệu về đồ chơi yêu thích của mình (Có thể tham khảo mẫu cô gửi,tự tập thuyết trình) - Đọc lại toàn bộ từ vựng unit 2",
            "type": "Quay video"
          },
          {
            "id": "fam-s1-l9-h2",
            "content": "Làm bài tập FF1 extra lesson 4",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: Unit 2-Lesson 78.pptx",
        "note": ""
      },
      {
        "id": "fam-s1-l10",
        "index": 10,
        "unit": "UNIT 3 : THIS IS MY NOSE · Lesson 1,2",
        "objective": "",
        "content": "- New words : Body parts\n- (arms, nose, face, legs, ears )\n- Structure : This is my nose. / These are my arms\n- ( This is / These are)\n- Reading : Dialogue",
        "lessonPlan": "- Mini test Unit 2\n- Warm up\n- Check homework\n- Teach vocab about Body parts\n- Practice vocabulary ( Game)\n- Teach grammar : This is / These are\n- Practice Grammar\n- Game Grammar\n- Read dialogue\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s1-l10-h1",
            "content": "Các con quay video bài đọc từ vựng và Story",
            "type": "Quay video"
          },
          {
            "id": "fam-s1-l10-h2",
            "content": "Viết từ mới và mẫu câu vào vở ô ly (mỗi từ 5 lần)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l10-h3",
            "content": "Làm bài tập workbook Unit 14-Lesson 1,2",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l10-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 14 - lesson 1 - (tr172-174)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l10-h5",
            "content": "Làm Link quizziz cô gửi >90%",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 3_lesson12.pptx\nhttps://quizizz.com/admin/quiz/61ac3268705900001e040e66",
        "note": ""
      },
      {
        "id": "fam-s1-l11",
        "index": 11,
        "unit": "UNIT 3 : THIS IS MY NOSE · Lesson 3,4",
        "objective": "",
        "content": "- Review words : Body parts ( Lesson 1)\n- Review grammar : This is / These are\n- New words : fingers / hands / eyes/ eye brows/ shoulders\n- Song : Ten fingers on my hands\n- Phonics : I - J - K - L",
        "lessonPlan": "- Warm up\n- Review words + Practice words\n- Teach new word : Body parts ( cont)\n- Sing the song\n- Review Grammar : This is / These are\n- Practice Grammar\n- Check homework\n- Phonics : i, j, k, l\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s1-l11-h1",
            "content": "Các con quay video giới thiệu bộ phận trên cơ thể sử dụng cấu trúc “I have….” VD: I have ten fingers……",
            "type": "Quay video"
          },
          {
            "id": "fam-s1-l11-h2",
            "content": "Viết từ vựng Unit3- Lesson 3,4 vào vở ghi (mỗi từ 5 lần)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l11-h3",
            "content": "Làm bài tập workbook Unit3- Lesson 3,4",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l11-h4",
            "content": "Làm bài tập FF1 Extra page 32,33,34 ( Bài tập còn lại)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 3_lesson 34.pptx\nhttps://wayground.com/admin/quiz/68df3a9237dd9aa09deed31b",
        "note": ""
      },
      {
        "id": "fam-s1-l12",
        "index": 12,
        "unit": "UNIT 3 : THIS IS MY NOSE · Lesson 5,6",
        "objective": "",
        "content": "- Review words :  Body parts  ( L1+3 )\n- Review grammar : This is / These are\n- Reading Skill : Making craft\n- Listening Skill : Listen and number\n- Writing Skill : Identify the sentences\n- Speaking : Describe the monster",
        "lessonPlan": "- Warm up\n- Check homework + Check test vocab\n- Practice Grammar\n- Reading + Reading comprehension\n- Listening and numbers\n- Writing : Count the numbers\n- Speaking : Describe the monster",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s1-l12-h1",
            "content": "Các con quay video bài đọc từ vựng và miêu tả 1 con Monsters cô gửi sử dụng cấu trúc “It has/It has no….” VD: It has 2 eyes,It has no toes……",
            "type": "Quay video"
          },
          {
            "id": "fam-s1-l12-h2",
            "content": "Viết từ mới vào vở ô ly (mỗi từ 5 lần)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l12-h3",
            "content": "Làm bài tập workbook Unit3- Lesson 5,6",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l12-h4",
            "content": "Làm bài tập FF1 extra page 35 36 37  ( Bt còn lại)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 3_lesson 56.pptx\nhttps://quizlet.com/vn/559853135/ff1-unit-3-flash-cards/",
        "note": ""
      },
      {
        "id": "fam-s1-l13",
        "index": 13,
        "unit": "UNIT 3 : THIS IS MY NOSE · Lesson 7,8",
        "objective": "",
        "content": "- Review words + Grammar\n- Speaking : Describe the monster\n- Listening extra : (Starters Listening )\n- Mini test Unit 3",
        "lessonPlan": "- Warm up\n- Homework check\n- Review words + Grammar\n- Practice Game\n- Speaking : Describe the monster ( Carf)\n- Listening extra : Starters Listening ( L4_Bổ trợ)",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s1-l13-h1",
            "content": "Các con quay video thuyết trình   miêu tả 2 monsters đã làm. - Quay video đọc lại toàn bộ từ vựng unit 3 cô gửi",
            "type": "Quay video"
          },
          {
            "id": "fam-s1-l13-h2",
            "content": "Làm bài tập sách FF1 Extra Lesson 4",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l13-h3",
            "content": "Làm quizziz cô gửi (YV >90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: Unit 3_Lesson 78.pptx\nhttps://quizizz.com/admin/quiz/60d5e9e8b2a36c001b0e781d/ff-unit",
        "note": ""
      },
      {
        "id": "fam-s1-l14",
        "index": 14,
        "unit": "Review Unit 1 ,2 ,3",
        "objective": "",
        "content": "- Review Unit 1 ,2 ,3",
        "lessonPlan": "- Mini test Unit 3",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s1-l14-h1",
            "content": "Quay video đọc từ vựng Unit 1,2,3",
            "type": "Quay video"
          },
          {
            "id": "fam-s1-l14-h2",
            "content": "Làm workbook review trang 26,28,29 sách Workbook",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l14-h3",
            "content": "Viết từ vựng Unit 1,2,3 (mỗi từ 1 dòng)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s1-l14-h4",
            "content": "Làm Quizziz ôn tập",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: ReviewU123.pptx\nhttps://quizizz.com/admin/quiz/61683a78f1a8ae001d6423d9",
        "note": ""
      }
    ],
    "bigTest": {
      "id": "fam-bt1",
      "name": "Big Test — Unit 1 - 3",
      "material": "https://drive.google.com/drive/folders/1HXn1WS9vMLfzLBxcVbVxiCdTOrC4URv7?usp=sharing",
      "note": "- No Homework\n- Giáo Viên trông test, thu hoạch video\n- Nhận xét , chấm bài, tổng hợp kết quả và gửi muộn nhất 7 ngày sau khi test\n- Từ ngày thứ 8 được tính là muộn, Gv bị phạt 30k/ ngày muộn"
    }
  },
  {
    "id": "fam-st2",
    "name": "Chặng 2: Unit 4–6",
    "goal": "Nội dung: Unit 4 : HE'S A HERO, Unit 5 : WHERE'S THE BALL   ?, UNIT 6: BILL'S TEDDY",
    "lessons": [
      {
        "id": "fam-s2-l1",
        "index": 1,
        "unit": "Unit 4 : HE'S A HERO · Lesson 1,2",
        "objective": "",
        "content": "- New words : Jobs  (teacher, pupil, housewife, fireman, pilot )\n- Structure : He/ She is a ....\n- Is he / she a .... ? Yes, he is. / No , he isn't\n- Reading : Dialogue",
        "lessonPlan": "- Warm up\n- Teach vocab about Jobs\n- Practice vocabulary ( Game)\n- Grammar : He / She is a ....  + Practice Grammar\n- Grammar : Is he / she a ..... ? Yes, he is / No, he isn't\n- Practice Grammar\n- Game Grammar\n- Read dialogue\n- Practice extra\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s2-l1-h1",
            "content": "Các con quay video bài đọc từ vựng và Story (  xem kỹ video youtube cô gửi  3-5 lần rồi mới quay video gửi cô.",
            "type": "Quay video"
          },
          {
            "id": "fam-s2-l1-h2",
            "content": "Viết từ mới vào vở ghi (mỗi từ  5 lần)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l1-h3",
            "content": "Làm bài tập workbook Unit 4- Lesson 1,2 trang 30,31",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l1-h4",
            "content": "Hoàn thiện Lesson 1 -FF1 Extra page 41,42,43,44 ( bài còn lại)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l1-h5",
            "content": "Làm Quizziz cô gửi (YC>90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 4_lesson 12.pptx\nhttps://quizizz.com/admin/quiz/61b99d61dd9bcd001dbb9f6a",
        "note": ""
      },
      {
        "id": "fam-s2-l2",
        "index": 2,
        "unit": "Unit 4 : HE'S A HERO · Lesson 3,4",
        "objective": "",
        "content": "- Review words :  Jobs  ( Lesson 1)\n- Review grammar : He / She is a ... .\n- Is he / she  a .... ? Yes, he/ she is . /\n- No, he/she isn't\n- New words : doctor, policeman, farmer, postman, zookeeper\n- Song : Two kinds doctor\n- Phonics : M,N,O,P",
        "lessonPlan": "- Warm up\n- Review words : Jobs\n- Teach new word : Jobs (L3)\n- Game vocabulary\n- Review Grammar : Is he / she a ... ? Yes, he is / No, he isn't\n- Practice Grammar ( Game)\n- Sing the song\n- Check homework\n- Teach phonics\n- Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s2-l2-h1",
            "content": "Các con quay video bài đọc từ vựng Lesson 3",
            "type": "Quay video"
          },
          {
            "id": "fam-s2-l2-h2",
            "content": "Viết từ mới cô gửi vào vở ghi (mỗi từ 5 lần)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l2-h3",
            "content": "Làm bài tập workbook Unit4- Lesson 3,4",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l2-h4",
            "content": "Làm bài tập lesson 2 - FF1 Extra page 45,46,47 ( bài còn lại)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l2-h5",
            "content": "Làm links Quizziz cô gửi (>90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 4_lesson 34.pptx\nhttps://quizizz.com/admin/quiz/62295b7791c3a0001e93c1d1",
        "note": ""
      },
      {
        "id": "fam-s2-l3",
        "index": 3,
        "unit": "Unit 4 : HE'S A HERO · Lesson 5,6",
        "objective": "",
        "content": "- Review words : Jobs  ( L1+3 )\n- Review grammar : tobe is\n- Reading Skill : Family members\n- Listening Skill : Listen and number\n- Writing Skill : capital letter / Full stop\n- Speaking Skill : Talk about your family",
        "lessonPlan": "- Warm up\n- Review vocab + Check vocab\n- Review Gammar + practice grammar\n- Check homework\n- Reading + Reading comprehension\n- Listening and numbering the picture\n- Writing : Capital letter and full stop\n- Speaking : talk about your family",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s2-l3-h1",
            "content": ".Các con quay video bài đọc toàn bộ từ vựng Unit 4 sử dụng cấu trúc He/She is…. Và đọc bài Skills time. ( yêu cầu nghe kỹ link cô gửi, tập đọc theo rồi mới quay video)",
            "type": "Quay video"
          },
          {
            "id": "fam-s2-l3-h2",
            "content": "Làm bài tập workbook Unit4- Lesson 5,6",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l3-h3",
            "content": "Làm bài tập Lesson 3- FF1 extra page 48,49,50 ( bài còn lại)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l3-h4",
            "content": "Hoàn thiện Quizziz cô gửi (YC>90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 4_lesson 56.pptx\nhttps://quizizz.com/admin/quiz/61bb5a71356cba001d8ede84",
        "note": ""
      },
      {
        "id": "fam-s2-l4",
        "index": 4,
        "unit": "Unit 4 : HE'S A HERO · Lesson 7,8",
        "objective": "",
        "content": "- Review words + Grammar\n- Practice speaking : Talk about your family\n- Listening extra : (Starters Listening )\n- Mini test Unit 4",
        "lessonPlan": "- Warm up\n- Homework check\n- Review words + Grammar\n- Practice Game\n- Speaking : Talk about your family\n- Listening extra : Starters Listening ( L4_Bổ trợ)",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s2-l4-h1",
            "content": "Các con có thể sử dụng hình ảnh gia đình mình quay video thuyết trình về các thành viên trong gia đình  (cô gửi mẫu tham khảo)",
            "type": "Quay video"
          },
          {
            "id": "fam-s2-l4-h2",
            "content": "Làm bài tập Lesson 4 - FF1 extra page 51,52,53,54,55 ( Bài còn lại )",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l4-h3",
            "content": "Làm link quizziz cô gửi (YV>90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: Unit 4-Lesson 78.pptx\nhttps://wayground.com/admin/quiz/6232e9f307a744001d177dc5",
        "note": ""
      },
      {
        "id": "fam-s2-l5",
        "index": 5,
        "unit": "Unit 5 : WHERE'S THE BALL   ? · Lesson 1,2",
        "objective": "",
        "content": "- New words : Things at the park\n- ( seesaw, slide,net, swing, tree)\n- Structure : in , on, under\n- Where is the ball ? It's in the net\n- Reading : Dialogue",
        "lessonPlan": "- Mini test Unit 4\n- Warm up\n- Check homework\n- Teach vocab about Things at the park\n- Practice vocabulary ( Game)\n- Teach grammar : Where is the ball ? It's in the net\n- Practice Grammar\n- Game Grammar\n- Read dialogue\n- Practice extra\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s2-l5-h1",
            "content": "Các con quay video bài đọc từ vựng và bài story ( Yc nghe link youtube cô gửi ít nhất 3-5 lần )",
            "type": "Quay video"
          },
          {
            "id": "fam-s2-l5-h2",
            "content": "Viết từ mới vào vở ghi (mỗi từ 5 lần) + và cấu trúc Unit 5-Lesson 1,2 : Viết 1 lần",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l5-h3",
            "content": "Làm bài tập workbook Unit5- Lesson 1,2",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l5-h4",
            "content": "Làm Bài tập Lesson 1-FF1Extra page: 56,57,58 ( bài còn lại)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l5-h5",
            "content": "Làm link quizziz cô gửi.( YC >90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 5_lesson 12.pptx\nhttps://quizizz.com/admin/quiz/61e2bd045fa512001eb8d640",
        "note": ""
      },
      {
        "id": "fam-s2-l6",
        "index": 6,
        "unit": "Unit 5 : WHERE'S THE BALL   ? · Lesson 3,4",
        "objective": "",
        "content": "- Review words : Things at the park\n- Review grammar : Where is the ball ? It's in the net\n- New words : pool, armbands, ice cream, frisbee, climbing frame\n- Song : At the park\n- Phonics : Q, R, S, T , U",
        "lessonPlan": "- Warm up\n- Check homework\n- Review words : Things at the park\n- Teach new word : Things at the park ( l3)\n- Practice Vocabulary ( lesson 1+3)\n- Sing the song\n- Review Grammar : Where is the ball ? It's in the net.\n- Practice Grammar\n- Phonics : Q, R, S, T , U\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s2-l6-h1",
            "content": "Các con quay video bài đọc từ vựng và lồng tiếng video từ 1p40 https://youtu.be/4RVWqBdD_Oo",
            "type": "Quay video"
          },
          {
            "id": "fam-s2-l6-h2",
            "content": "Viết từ mới vào vở ghi,mỗi từ 10 lần",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l6-h3",
            "content": "Làm bài tập workbook Unit5- Lesson 3,4",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l6-h4",
            "content": "Làm bài 1,2,3,4,5-sách bổ trợ không màu",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l6-h5",
            "content": "Làm Quizziz cô gửi (>90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 5_lesson 34.pptx\nhttps://quizizz.com/admin/quiz/61e40f7254c3ca001e53b24a",
        "note": ""
      },
      {
        "id": "fam-s2-l7",
        "index": 7,
        "unit": "Unit 5 : WHERE'S THE BALL   ? · Lesson 5,6",
        "objective": "",
        "content": "- Review words :  Things at the park   ( L1+3 )\n- Review grammar : Where is the ball ? It's in the net\n- Reading Skill : things at the park\n- Listening Skill : Listen and number\n- Writing Skill : Capital letter for names",
        "lessonPlan": "- Warm up\n- Check homework\n- Review vocabulary + Check test vocab\n- Review Grammar + Practice Grammar\n- Reading + Reading comprehension\n- Listening + making Q and A\n- Writing : Capital letters for Days of the week\n- Guide S to talk about describe sth in the park",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s2-l7-h1",
            "content": "Các con quay video miêu tả bức tranh trong bài Skilltime sử dụng giới từ đã được học. VD: The ball is in the net. Quay video đọc lại toàn bộ từ vựng Unit 5 lesson 1 +3",
            "type": "Quay video"
          },
          {
            "id": "fam-s2-l7-h2",
            "content": "Làm bài tập workbook Unit5- Lesson 5,6",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l7-h3",
            "content": "Làm bài  Lesson 3 sách FF1 extra page 63,64,65 ( bài còn lại)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 5_lesson 56.pptx",
        "note": ""
      },
      {
        "id": "fam-s2-l8",
        "index": 8,
        "unit": "Unit 5 : WHERE'S THE BALL   ? · Lesson 7,8",
        "objective": "",
        "content": "- Review words + Grammar\n- Speaking : Describe the things in the park\n- Listening extra : (Starters Listening )",
        "lessonPlan": "- Warm up\n- Homework check\n- Review words + Grammar\n- Practice Game\n- Speaking : Things at the park\n- Listening extra : Starters Listening ( L4_Bổ trợ)",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s2-l8-h1",
            "content": "Quay video miêu tả bức tranh cô gửi .",
            "type": "Quay video"
          },
          {
            "id": "fam-s2-l8-h2",
            "content": "Làm bài tập Lesson 4 - FF1 extra page 66,67,68 ( Bài còn lại)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l8-h3",
            "content": "Làm quizziz cô gửi (YC>90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: Unit 5-Lesso 78.pptx\nhttps://quizizz.com/admin/quiz/618d2e7d384bbd001da63b53",
        "note": ""
      },
      {
        "id": "fam-s2-l9",
        "index": 9,
        "unit": "UNIT 6: BILL'S TEDDY · Lesson 1,2",
        "objective": "",
        "content": "- New words : Family (mom, dad, brother, sister, grandma, grandpa)\n- Structure : Possessive case . This is Mum's hat.\n- Reading : Dialogue",
        "lessonPlan": "- Mini test Unit 5\n- Warm up\n- Check homework\n- Teach vocab about Family\n- Practice vocabulary ( Game)\n- Teach grammar : This is Mum's hat\n- Practice Grammar\n- Game Grammar\n- Read dialogue\n- Practice extra\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s2-l9-h1",
            "content": "Các con quay video bài đọc từ vựng và story",
            "type": "Quay video"
          },
          {
            "id": "fam-s2-l9-h2",
            "content": "Viết từ mới và mẫu câu cô gửi vào vở ô ly (mỗi từ 5 lần)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l9-h3",
            "content": "Làm bài tập workbook Unit6- Lesson 1,2",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l9-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 6 - lesson 1 - exercise 1,2,3,4 (tr69-71) (Còn lại làm trên lớp)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l9-h5",
            "content": "Hoàn thiện link quizziz cô gửi.( yêu cầu làm nhiều lần để đúng 90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 6_lesson 12.pptx\nhttps://www.liveworksheets.com/kd2301223kt\nhttps://www.liveworksheets.com/ka880829cs\nhttps://quizizz.com/admin/quiz/620725624575e1001dd691bd",
        "note": ""
      },
      {
        "id": "fam-s2-l10",
        "index": 10,
        "unit": "UNIT 6: BILL'S TEDDY · Lesson 3,4",
        "objective": "",
        "content": "- Review words : Family ( Lesson 1)\n- Review grammar : Possessive case\n- New words : aunt, uncle, cousin\n- Song : In my family\n- Phonics : V, W, X, Y, Z",
        "lessonPlan": "- Warm up\n- Check homework\n- Review words + Practice words\n- Teach new word : Family ( aunt, uncle, cousin)\n- Practice : all words\n- Sing the song\n- Review Grammar : Possessive's case\n- Practice Grammar\n- Phonics : V, W, X, Y, Z\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s2-l10-h1",
            "content": "Các con quay video bài đọc từ vựng và giới thiệu các thành viên trong gia đình sử dụng cấu trúc cô gửi",
            "type": "Quay video"
          },
          {
            "id": "fam-s2-l10-h2",
            "content": "Viết từ mới và mẫu câu cô gửi vào vở ô ly (mỗi từ 2 dòng)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l10-h3",
            "content": "Làm bài tập workbook Unit6- Lesson 3,4",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l10-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 6 - lesson 2 - exercise 1,3,4,5 (tr73-75) (Còn lại làm trên lớp)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l10-h5",
            "content": "Hoàn thiện link quizziz cô gửi.( yêu cầu làm nhiều lần để đúng 90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 6_lesson 34.pptx\nhttps://wordwall.net/resource/27581234/letters-vwxyz\nhttps://quizizz.com/admin/quiz/62085dfe0682b0001d7e735a\nhttps://www.liveworksheets.com/ni1703865jl",
        "note": ""
      },
      {
        "id": "fam-s2-l11",
        "index": 11,
        "unit": "UNIT 6: BILL'S TEDDY · Lesson 5,6",
        "objective": "",
        "content": "- Review words :  Family  ( L1+3 )\n- Review grammar :Possessive case\n- Reading Skill : Story about Grandpa's hat\n- Listening Skill : Listen and number\n- Writing Skill : Idenfity the question and answer\n- Speaking : Introduce about your family",
        "lessonPlan": "- Warm up\n- Check homework\n- Review vocabulary + Check test vocab\n- Review Grammar + Practice Grammar\n- Reading + Reading comprehension\n- Listening + retell\n- Writing : Identify tthe question and answer\n- Speaking : introduce about your family\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s2-l11-h1",
            "content": "Các con quay video bài đọc từ vựng và bài Skills time",
            "type": "Quay video"
          },
          {
            "id": "fam-s2-l11-h2",
            "content": "Viết từ mới vào vở ô ly (mỗi từ 1 dòng )",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l11-h3",
            "content": "Làm bài tập workbook Unit6- Lesson 5,6",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l11-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 6 - lesson 3 - exercise 1,2,4,6 (tr76-78) (Bỏ exercise 3) (Còn lại làm trên lớp)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l11-h5",
            "content": "Hoàn thiện link quizziz cô gửi.( yêu cầu làm nhiều lần để đúng 90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 6_lesson 56.pptx\nhttps://quizizz.com/admin/quiz/62105f646a5162001d7dd6c5\nhttps://www.liveworksheets.com/kd2301223kt",
        "note": ""
      },
      {
        "id": "fam-s2-l12",
        "index": 12,
        "unit": "UNIT 6: BILL'S TEDDY · Lesson 7,8",
        "objective": "",
        "content": "- Review words + Grammar\n- Speaking : Introduce about your family\n- Listening extra : (Starters Listening )",
        "lessonPlan": "- Warm up\n- Homework check\n- Review words + Grammar\n- Practice Game\n- Speaking : Introduce about your family\n- Listening extra : Starters Listening ( L4_Bổ trợ)",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s2-l12-h1",
            "content": "Các con quay video giới thiệu về gia đình của mình (cô gửi gợi ý)",
            "type": "Quay video"
          },
          {
            "id": "fam-s2-l12-h2",
            "content": "Làm Sách bổ trợ nâng cao - unit 6 - lesson 4- exercise 1,2,3,5 (tr79-82) (Bỏ exercise 3) (Còn lại làm trên lớp)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l12-h3",
            "content": "Hoàn thiện link quizziz cô gửi.( yêu cầu làm nhiều lần để đúng 90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: Unit 6-Lesson 78.pptx\nhttps://quizizz.com/admin/quiz/6211bc21873a47001d6063cd",
        "note": ""
      },
      {
        "id": "fam-s2-l13",
        "index": 13,
        "unit": "Review Unit  4,5,6",
        "objective": "",
        "content": "- Review Unit  4,5,6",
        "lessonPlan": "- Mini test Unit 6",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s2-l13-h1",
            "content": "Quay Video từ vựng unit 4 5 6 theo slide cô gửi.",
            "type": "Quay video"
          },
          {
            "id": "fam-s2-l13-h2",
            "content": "Làm Quizziz ôn tập cô gửi",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l13-h3",
            "content": "Làm bài tập Workbook trang 48,50,51",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s2-l13-h4",
            "content": "Ôn tập toàn bộ Unit 4 5 6 buổi sau có bài Bigtest.",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: ReviewU456.pptx\nhttps://quizizz.com/admin/quiz/618d2e7d384bbd001da63b53\nhttps://quizizz.com/admin/quiz/62105f646a5162001d7dd6c5",
        "note": ""
      }
    ],
    "bigTest": {
      "id": "fam-bt2",
      "name": "Big Test — Unit 4 - 6",
      "material": "https://drive.google.com/drive/folders/1HXn1WS9vMLfzLBxcVbVxiCdTOrC4URv7?usp=sharing",
      "note": "- No Homework\n- Giáo Viên trông test, thu hoạch video\n- Nhận xét , chấm bài, tổng hợp kết quả và gửi muộn nhất 7 ngày sau khi test\n- Từ ngày thứ 8 được tính là muộn, Gv bị phạt 30k/ ngày muộn"
    }
  },
  {
    "id": "fam-st3",
    "name": "Chặng 3: Unit 7–9",
    "goal": "Nội dung: UNIT 7 : ARE THESE HIS TROUSERS ?, Unit 8 : WHERE'S GRANDMA ?, UNIT 9 : LUNCHTIME",
    "lessons": [
      {
        "id": "fam-s3-l1",
        "index": 1,
        "unit": "UNIT 7 : ARE THESE HIS TROUSERS ? · Lesson 1,2",
        "objective": "",
        "content": "- New words : Clothes\n- (dress, shorts, T shirt, trousers, socks )\n- Structure : his  / her .\n- Review : This is / These are\n- Reading : Dialogue",
        "lessonPlan": "- Warm up\n- Teach vocab about Clothes\n- Practice vocabulary ( Game)\n- Review grammar :  This is / These are\n- Teach grammar : his / her\n- Practice Grammar\n- Game Grammar\n- Read dialogue\n- Practice extra\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s3-l1-h1",
            "content": "Các con quay video bài đọc từ vựng và story",
            "type": "Quay video"
          },
          {
            "id": "fam-s3-l1-h2",
            "content": "Viết từ mới và mẫu câu cô gửi vào vở ô ly (mỗi từ 2 dòng)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l1-h3",
            "content": "Làm bài tập workbook Unit7- Lesson 1,2 (trang 52,53)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l1-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 7 - lesson 1 - exercise 1,2,4 (tr83-85) (Còn lại làm trên lớp)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l1-h5",
            "content": "Hoàn thiện link quizziz cô gửi.( yêu cầu làm nhiều lần để đúng 90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 7_lesson 12.pptx\nhttps://www.liveworksheets.com/ia1889346vf\nhttps://www.liveworksheets.com/ks2771617xk\nhttps://quizizz.com/admin/quiz/6221c93cca7d7a001de16c7b",
        "note": ""
      },
      {
        "id": "fam-s3-l2",
        "index": 2,
        "unit": "UNIT 7 : ARE THESE HIS TROUSERS ? · Lesson 3,4",
        "objective": "",
        "content": "- Review words : Clothes  ( Lesson 1)\n- Grammar : Are these ... ? Is this .... ?\n- New words : shoes, coat, hat, cardigan, tracksuit\n- Song : Everyday\n- Phonics : alphabet review",
        "lessonPlan": "- Warm up\n- Check homework\n- Review words : Clothes\n- Teach new word : Clothes ( Lesson 3)\n- Practice Vocabulary\n- Sing the song\n- Grammar : Is this ... ? Are these .... ?\n- Practice Grammar\n- Review phonics\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s3-l2-h1",
            "content": "Các con quay video bài đọc từ vựng và giới thiệu về trang phục mình đang mặc (I am wearing a red T-shirt –Tôi đang mặc 1 cái áo phông màu đỏ….)",
            "type": "Quay video"
          },
          {
            "id": "fam-s3-l2-h2",
            "content": "Viết từ mới và mẫu câu cô gửi vào vở ô ly (mỗi từ 2 dòng)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l2-h3",
            "content": "Làm bài tập workbook Unit7- Lesson 3,4 (trang 54,55)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l2-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 7 - lesson 2 - exercise 1,2,3,6 (tr86-89) (Còn lại làm trên lớp)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l2-h5",
            "content": "Hoàn thiện link quizziz cô gửi.( yêu cầu làm nhiều lần để đúng 90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 7_lesson 34.pptx\nhttps://quizizz.com/admin/quiz/6221cf45ab68d8001da9a631",
        "note": ""
      },
      {
        "id": "fam-s3-l3",
        "index": 3,
        "unit": "UNIT 7 : ARE THESE HIS TROUSERS ? · Lesson 5,6",
        "objective": "",
        "content": "- Review words : Clothes ( L1+3 )\n- Review grammar : his / her - Are these / Is this ... ?\n- Reading Skill : dialouge at the shop\n- Writing Skill : short form of WHat is / Where is\n- Speaking Skill : Describe the people ( clothes)",
        "lessonPlan": "- Warm up\n- Check homework\n- Review vocab + Check test vocab\n- Practice Grammar\n- Reading + Reading comprehension\n- Listening + retell\n- Writing : Short form tobe is\n- Speaking : Describe the people ( clothes)",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s3-l3-h1",
            "content": "Các con quay video bài đọc từ vựng và lồng tiếng từ 1p30 https://youtu.be/4p3SogmVYpQ",
            "type": "Quay video"
          },
          {
            "id": "fam-s3-l3-h2",
            "content": "Viết từ mới ( Skirt, Cap, Sandals, Head scarf, Jacket) và mẫu câu cô gửi vào vở ô ly (mỗi từ 2 dòng)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l3-h3",
            "content": "Làm bài tập workbook Unit7- Lesson 5,6 (trang 56,57)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l3-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 7 - lesson 3 - exercise 1,3,4,5,7 (tr90-92) (Còn lại làm trên lớp)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l3-h5",
            "content": "Hoàn thiện link quizziz cô gửi.( yêu cầu làm nhiều lần để đúng 90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 7_lesson 56.pptx\nhttps://www.liveworksheets.com/or1930383sa\nhttps://quizizz.com/admin/quiz/61a8dedee3d430001ea50c41",
        "note": ""
      },
      {
        "id": "fam-s3-l4",
        "index": 4,
        "unit": "UNIT 7 : ARE THESE HIS TROUSERS ? · Lesson 7,8",
        "objective": "",
        "content": "- Review words + Grammar\n- Practice speaking : Describe the people ( clothes)\n- Listening extra : (Starters Listening)",
        "lessonPlan": "- Warm up\n- Homework check\n- Review words + Grammar\n- Practice Game\n- Speaking : Describe the people ( clothes)\n- Listening extra : Starters Listening ( L4_Bổ trợ)",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s3-l4-h1",
            "content": "Các con quay video speaking giới thiệu trang phục của 3 nhân vật trong bức tranh cô gửi",
            "type": "Quay video"
          },
          {
            "id": "fam-s3-l4-h2",
            "content": "Làm Sách bổ trợ nâng cao - unit 7 - lesson 4 - exercise 2,3 (tr94) (Còn lại làm trên lớp)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l4-h3",
            "content": "Hoàn thiện link quizziz cô gửi.( yêu cầu làm nhiều lần để đúng 90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: Unit 7-Lesson 78.pptx\nhttps://quizizz.com/admin/quiz/6229f60d5bc12800211a1ee4",
        "note": ""
      },
      {
        "id": "fam-s3-l5",
        "index": 5,
        "unit": "Unit 8 : WHERE'S GRANDMA ? · Lesson 1,2",
        "objective": "",
        "content": "- New words : Rooms  ( kitchen, living room, dining room, bedroom, bathroom, garden)\n- Structure : Where's Grandma ? She's in the kitchen .\n- Reading : Dialogue",
        "lessonPlan": "- Mini test Unit 7\n- Warm up\n- Check homework\n- Teach vocab about rooms in the house\n- Practice vocabulary ( Game)\n- Teach grammar : Where's Grandma ? Where are mom and dad ?\n- Practice Grammar\n- Game Grammar\n- Read dialogue\n- Practice extra\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s3-l5-h1",
            "content": "Các con quay video bài đọc từ vựng và story",
            "type": "Quay video"
          },
          {
            "id": "fam-s3-l5-h2",
            "content": "Viết từ mới và mẫu câu cô gửi vào vở ô ly (mỗi từ 2 dòng)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l5-h3",
            "content": "Làm bài tập workbook Unit8- Lesson 1,2 (trang 58,59)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l5-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 8 - lesson 1 - exercise 1,2,3,4 (tr96-98) (Còn lại làm trên lớp)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l5-h5",
            "content": "Hoàn thiện link quizziz cô gửi.( yêu cầu làm nhiều lần để đúng 90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 8_lesson 12.pptx\nhttps://www.liveworksheets.com/fu2560643kv\nhttps://www.liveworksheets.com/bu1295522uk\nhttps://www.liveworksheets.com/qc1910182nl\nhttps://quizizz.com/admin/quiz/61b85395ac40b2001d0688d9",
        "note": ""
      },
      {
        "id": "fam-s3-l6",
        "index": 6,
        "unit": "Unit 8 : WHERE'S GRANDMA ? · Lesson 3,4",
        "objective": "",
        "content": "- Review words : rooms  ( Lesson 1)\n- Review grammar : Where's ... ? Where are ... ?\n- Grammar : Is she in the ... ? Are they in the ....?\n- New words : upstairs, downstairs, house, flat, front door\n- Song : Come into my house\n- Phonics : sh ( shoe, sheep, fish)",
        "lessonPlan": "- Warm up\n- Check homework\n- Review words : rooms\n- Teach new word : parts of house\n- Practice Vocabulary ( lesson 1+3)\n- Sing the song\n- Review Grammar : Where is ... ? Where are ... ?\n- New Grammar : Is she in the ... ? Are they in the ... ?\n- Practice Grammar\n- Phonics : sh\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s3-l6-h1",
            "content": "Các con quay video bài đọc từ vựng và lồng tiếng (Từ 1p40) https://youtu.be/4RVWqBdD_Oo",
            "type": "Quay video"
          },
          {
            "id": "fam-s3-l6-h2",
            "content": "Viết từ mới vào vở ô ly (mỗi từ 2 dòng)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l6-h3",
            "content": "Làm bài tập workbook Unit8- Lesson 3,4 (trang 60,61)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l6-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 8 - lesson 2 - exercise 1,2,5 (tr100-102) (Còn lại làm trên lớp)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l6-h5",
            "content": "Hoàn thiện link quizziz cô gửi.( yêu cầu làm nhiều lần để đúng 90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 8_lesson 34.pptx\nhttps://www.liveworksheets.com/ke2562828dv\nhttps://quizizz.com/admin/quiz/61bc1b9bf95b79001ee810d2",
        "note": ""
      },
      {
        "id": "fam-s3-l7",
        "index": 7,
        "unit": "Unit 8 : WHERE'S GRANDMA ? · Lesson 5,6",
        "objective": "",
        "content": "- Review words :  rooms + house    ( L1+3 )\n- Review grammar : Where is / Where are ?\n- Is she ... ? Are they ... ?\n- Reading Skill : Describing the house\n- Listening Skill : Listen the number\n- Writing Skill : vowels\n- Speaking : Describe the house",
        "lessonPlan": "- Warm up\n- Check homework\n- Review vocabulary + Check test vocab\n- Practice Grammar\n- Reading + Reading comprehension\n- Listening + making Q and A\n- Writing : identify the question words\n- Guide S to describe the house",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s3-l7-h1",
            "content": "Quay video: Đọc bài Skills time sách lesson 5 . Quay video trả lời câu hỏi cô gửi.",
            "type": "Quay video"
          },
          {
            "id": "fam-s3-l7-h2",
            "content": "Làm btvn Unit8- Lesson 5,6",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l7-h3",
            "content": "Làm Sách bổ trợ nâng cao - unit 8 - lesson 3  (tr100-102) (Làm bài còn lại )",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l7-h4",
            "content": "Hoàn thiện link quizziz cô gửi.( yêu cầu làm nhiều lần để đúng 90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 8_lesson 56.pptx\nhttps://quizizz.com/admin/quiz/61c191595765e4001d02e145\nhttps://www.liveworksheets.com/ke2562828dv",
        "note": ""
      },
      {
        "id": "fam-s3-l8",
        "index": 8,
        "unit": "Review words + Grammar",
        "objective": "",
        "content": "- Review words + Grammar\n- Speaking :Describe the house\n- Listening extra : (Starters Listening)",
        "lessonPlan": "- Warm up\n- Homework check\n- Review words + Grammar\n- Practice Game\n- Speaking : Describe the house\n- Listening extra : Starters Listening ( L4_Bổ trợ)",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s3-l8-h1",
            "content": "Quay video: Các con quay video bức tranh nói về ngôi nhà theo mẫu cô gửi và miêu tả vị trí các nhân vật trong bức tranh. Quay đọc lại toàn bộ từ vựng unit 8.",
            "type": "Quay video"
          },
          {
            "id": "fam-s3-l8-h2",
            "content": "Làm Sách FF1 Extra- unit 8 - lesson 4  (tr106-108) (Làm bài còn lại ) (Link file nghe đính kèm.)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l8-h3",
            "content": "Hoàn thiện link quizziz cô gửi.( yêu cầu làm nhiều lần để đúng 90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: Unit 8-Lesson 78.pptx\nhttps://quizizz.com/admin/quiz/61c191595765e4001d02e145",
        "note": ""
      },
      {
        "id": "fam-s3-l9",
        "index": 9,
        "unit": "UNIT 9 : LUNCHTIME · Lesson 1,2",
        "objective": "",
        "content": "- New words : Food and drinks\n- (lunchbox, sandwich, drinks, apple, banana, biscuit)\n- Structure : have got / haven't got\n- Reading : Dialogue",
        "lessonPlan": "- Mini test Unit 8\n- Warm up\n- Check homework\n- Teach vocab about Food\n- Practice vocabulary ( Game)\n- Teach grammar : have got / haven't got\n- Practice Grammar\n- Game Grammar\n- Read dialogue\n- Practice extra\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s3-l9-h1",
            "content": "Các con quay video bài đọc từ vựng và story",
            "type": "Quay video"
          },
          {
            "id": "fam-s3-l9-h2",
            "content": "Viết từ mới và cấu trúc vào vở (viết mỗi từ 2 dòng)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l9-h3",
            "content": "Làm bài tập workbook unit 9 - lesson 1,2",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l9-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 9 - lesson 1 - exercise 1,3,4,5 (tr110-112) (Còn lại làm trên lớp)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l9-h5",
            "content": "Hoàn thiện link quizziz cô gửi.( yêu cầu làm nhiều lần để đúng 90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 9_lesson 12.pptx\nhttps://www.liveworksheets.com/ls2362693so\nhttps://quizizz.com/admin/quiz/61cac6b0bb0fab001e8c0189",
        "note": ""
      },
      {
        "id": "fam-s3-l10",
        "index": 10,
        "unit": "UNIT 9 : LUNCHTIME · Lesson 3,4",
        "objective": "",
        "content": "- Review words : Food  ( Lesson 1)\n- Review grammar : have got / haven't got\n- New words : tomato, pear, grapes, pineapple, cherries )\n- Song : Open my lunch box\n- Phonics : ch ( chair, teacher, chick)",
        "lessonPlan": "- Warm up\n- Check homework\n- Review words + Practice words\n- Teach new word : Food\n- Practice : all words\n- Sing the song\n- Review Grammar : have got / haven't got\n- Practice Grammar\n- Phonics : ch ( chair, teacher, chick)\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s3-l10-h1",
            "content": "Các con quay video bài đọc từ vựng và giới thiệu 3 bữa ăn trong ngày của mình",
            "type": "Quay video"
          },
          {
            "id": "fam-s3-l10-h2",
            "content": "Viết từ mới và cấu trúc vào vở (kèm nghĩa tiếng Việt)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l10-h3",
            "content": "Làm bài tập workbook unit 9 - lesson 3,4",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l10-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 9 - lesson 2 - exercise 1,2,3,5 (tr113-115) (Còn lại làm trên lớp)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l10-h5",
            "content": "Hoàn thiện link quizziz cô gửi.( yêu cầu làm nhiều lần để đúng 90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 9_lesson 34.pptx\nhttps://wordwall.net/resource/15974733\nhttps://quizizz.com/admin/quiz/61ceb112394836001ddc24c8",
        "note": ""
      },
      {
        "id": "fam-s3-l11",
        "index": 11,
        "unit": "UNIT 9 : LUNCHTIME · Lesson 5,6",
        "objective": "",
        "content": "- Review words : Jobs  ( L1+3 )\n- Review grammar : tobe is\n- Reading Skill : Family members\n- Listening Skill : Listen and number\n- Writing Skill : capital letter / Full stop\n- Speaking Skill : Talk about your family",
        "lessonPlan": "- Warm up\n- Review vocab + Check vocab\n- Review Gammar + practice grammar\n- Check homework\n- Reading + Reading comprehension\n- Listening and numbering the picture\n- Writing : Capital letter and full stop\n- Speaking : talk about your family",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s3-l11-h1",
            "content": "Quay video: Đọc lại toàn bộ từ vựng unit 9 Quay video đọc bài skills time",
            "type": "Quay video"
          },
          {
            "id": "fam-s3-l11-h2",
            "content": "Làm bài tập workbook unit 9 - lesson 5,6",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l11-h3",
            "content": "Làm Sách bổ trợ nâng cao - unit 9 - lesson 2  (tr116-118) ( làm bài còn lại)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 9_lesson 56.pptx\nhttps://quizizz.com/admin/quiz/61d40db8401c43001dbe5198",
        "note": ""
      },
      {
        "id": "fam-s3-l12",
        "index": 12,
        "unit": "UNIT 9 : LUNCHTIME · Lesson 7,8",
        "objective": "",
        "content": "- Review words + Grammar\n- Speaking : Describe your lunchbox\n- Listening extra : (Starters Listening )",
        "lessonPlan": "- Warm up\n- Homework check\n- Review words + Grammar\n- Practice Game\n- Speaking : Describe the lunchbox\n- Listening extra : Starters Listening ( L4_Bổ trợ)",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s3-l12-h1",
            "content": "Các con quay video đọc câu truyện Potato At home",
            "type": "Quay video"
          },
          {
            "id": "fam-s3-l12-h2",
            "content": "Làm Sách bổ trợ nâng cao - unit 9 - lesson 4 - exercise 1,2,4 (tr119-120) (Còn lại làm trên lớp)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l12-h3",
            "content": "Hoàn thiện link quizziz cô gửi.( yêu cầu làm nhiều lần để đúng 90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: Unit 9-Lesson 78.pptx\nhttps://www.liveworksheets.com/ey1130699qv\nhttps://quizizz.com/admin/quiz/61d40db8401c43001dbe5198",
        "note": ""
      },
      {
        "id": "fam-s3-l13",
        "index": 13,
        "unit": "Review Unit  7,8,9",
        "objective": "",
        "content": "- Review Unit  7,8,9",
        "lessonPlan": "- Mini test Unit 9",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s3-l13-h1",
            "content": "Quay video đọc lại từ vựng unit 7 8 9",
            "type": "Quay video"
          },
          {
            "id": "fam-s3-l13-h2",
            "content": "Làm Quizziz ôn tập cô gửi",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l13-h3",
            "content": "Làm bài tập Workbook trang 70,72,73",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s3-l13-h4",
            "content": "Các con ôn tập toàn bộ unit 7 8 9 . Buổi sau có bài BigTest.",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: ReviewU7,89.pptx\nhttps://quizizz.com/admin/quiz/61dd4e5e074596001d0bc241",
        "note": ""
      }
    ],
    "bigTest": {
      "id": "fam-bt3",
      "name": "Big Test — Unit 7 - 9",
      "material": "https://drive.google.com/drive/folders/1HXn1WS9vMLfzLBxcVbVxiCdTOrC4URv7?usp=sharing",
      "note": "- No Homework\n- Giáo Viên trông test, thu hoạch video\n- Nhận xét , chấm bài, tổng hợp kết quả và gửi muộn nhất 7 ngày sau khi test\n- Từ ngày thứ 8 được tính là muộn, Gv bị phạt 30k/ ngày muộn"
    }
  },
  {
    "id": "fam-st4",
    "name": "Chặng 4: Unit 10–12",
    "goal": "Nội dung: UNIT 10 : A NEW FRIEND, Unit 11 : I LIKE MONKEYS, UNIT 12 : DINNER TIME",
    "lessons": [
      {
        "id": "fam-s4-l1",
        "index": 1,
        "unit": "UNIT 10 : A NEW FRIEND · Lesson 1,2",
        "objective": "",
        "content": "- New words : Hair style\n- (long, short, blond, brown, curly, straight )\n- Structure : has got / hasn't got\n- Reading : Dialogue",
        "lessonPlan": "- Warm up\n- Teach vocab about Hair style\n- Practice vocabulary ( Game)\n- Teach grammar : has got / hasn't got\n- Practice Grammar\n- Game Grammar\n- Read dilogue\n- Practice extra\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s4-l1-h1",
            "content": "Các con quay video bài đọc từ vựng và story",
            "type": "Quay video"
          },
          {
            "id": "fam-s4-l1-h2",
            "content": "Viết từ mới vào vở mỗi từ 5 lần",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l1-h3",
            "content": "Làm bài tập workbook trang 74,75",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l1-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 10 - lesson 1  (tr121-123) (Làm bài còn lại)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l1-h5",
            "content": "Làm quizziz cô gửi (>90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 10_lesson 12.pptx\nhttps://quizizz.com/admin/quiz/61e67db03f6e80001d73618d\nhttps://www.liveworksheets.com/ox1380167je",
        "note": ""
      },
      {
        "id": "fam-s4-l2",
        "index": 2,
        "unit": "UNIT 10 : A NEW FRIEND · Lesson 3,4",
        "objective": "",
        "content": "- Review words : Hair style   ( Lesson 1)\n- Review grammar : Put on / Don't put on ....\n- New words : Shapes (circle, triangle, square, rectangle, diamond)\n- Song : It's a square\n- Phonics : th ( three, bath, teeth)",
        "lessonPlan": "- Warm up\n- Check homework\n- Review words : Hair style\n- Teach new word : Shapes\n- Practice Vocabulary\n- Sing the song\n- Review Grammar : has got / hasn't got\n- Practice Grammar\n- Teach phonics\n- Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s4-l2-h1",
            "content": "Các con quay video bài đọc từ vựng và giới thiệu các hình khối (có bao nhiêu cạnh,góc)",
            "type": "Quay video"
          },
          {
            "id": "fam-s4-l2-h2",
            "content": "Viết từ mới vào vở (mỗi từ 5 lần )",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l2-h3",
            "content": "Làm bài tập workbook trang 76,77",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l2-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 10 - lesson 2 - (tr124-126) (Làm bài còn lại)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 10_lesson 34.pptx\nhttps://quizizz.com/admin/quiz/61e962d7ce58f4002008127d\nhttps://www.liveworksheets.com/aa679420yv\nhttps://www.liveworksheets.com/ef1366021el\nhttps://wordwall.net/resource/24353424/ch-th-sh\nhttps://wordwall.net/resource/26677991/digraphs-ch-th-ng-sh",
        "note": ""
      },
      {
        "id": "fam-s4-l3",
        "index": 3,
        "unit": "UNIT 10 : A NEW FRIEND · Lesson 5,6",
        "objective": "",
        "content": "- Review words : Hair style + shape  ( L1+3 )\n- Review grammar : has got / hasn't got\n- Reading Skill : letter from pen friend\n- Listening skill : Listen and number\n- Writing Skill : short form of have got / has got\n- Speaking Skill : Describe your best friend",
        "lessonPlan": "- Warm up\n- Check homework\n- Review vocabulary + Check test vocab\n- Practice Grammar\n- Reading + Reading comprehension\n- Listening + retell\n- Writing : short form of have got / has got\n- Speaking : Describe your best friend",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s4-l3-h1",
            "content": "Các con quay video giới thiệu về những nhân vật cô gửi (theo mẫu cô gửi.)",
            "type": "Quay video"
          },
          {
            "id": "fam-s4-l3-h2",
            "content": "Viết từ mới vào vở (mỗi từ 5 lần)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l3-h3",
            "content": "Làm bài tập workbook trang 78,79",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l3-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 10 - lesson 3 - (tr127-129) (Làm bài còn lại)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l3-h5",
            "content": "Làm quizziz(>90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 10_lesson 56.pptx\nhttps://quizizz.com/admin/quiz/61efc16d9a514a001ed072e1\nhttps://www.liveworksheets.com/fm2151757ev",
        "note": ""
      },
      {
        "id": "fam-s4-l4",
        "index": 4,
        "unit": "UNIT 10 : A NEW FRIEND · Lesson 7,8",
        "objective": "",
        "content": "- Review words + Grammar\n- Practice speaking : Describe your best friend\n- Listening extra : (Starters Listening )",
        "lessonPlan": "- Warm up\n- Homework check\n- Review words + Grammar\n- Practice Game\n- Speaking : Describe your best friend\n- Listening extra : Starters Listening ( L4_Bổ trợ)",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s4-l4-h1",
            "content": "Quay video đọc lại toàn bộ bảng từ vựng cô gửi. Quay video :Describe your best friend theo phiếu cô gửi",
            "type": "Quay video"
          },
          {
            "id": "fam-s4-l4-h2",
            "content": "Làm quizziz ôn tập cô gửi >90%",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l4-h3",
            "content": "Làm Sách bổ trợ nâng cao - unit 10 - lesson 4 - (tr130-133) - Bài còn lại",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: Unit 10-Lesson 78.pptx\nhttps://quizizz.com/admin/quiz/62750a9db31527001d5cab9f\nhttps://www.liveworksheets.com/fm2151757ev\nhttps://www.liveworksheets.com/vj2353016ac\nhttps://www.liveworksheets.com/uh2327733vo",
        "note": ""
      },
      {
        "id": "fam-s4-l5",
        "index": 5,
        "unit": "Unit 11 : I LIKE MONKEYS · Lesson 1,2",
        "objective": "",
        "content": "- New words : Animal  ( elephant, giraffe, monkey, big, tall, little )\n- Structure : I like ... / I don't like ....\n- I'm little . The elephant is big.\n- Reading : Dialogue",
        "lessonPlan": "- Mini test Unit 10\n- Warm up\n- Check homework\n- Teach vocab about Animal\n- Practice vocabulary ( Game)\n- Teach grammar : like / don't like - be ( am is are)\n- Practice Grammar\n- Game Grammar\n- Read dialogue\n- Practice extra\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s4-l5-h1",
            "content": "Các con quay video đọc từ vựng và story",
            "type": "Quay video"
          },
          {
            "id": "fam-s4-l5-h2",
            "content": "Viết từ mới và cấu trúc vào vở (mỗi từ 5 lần)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l5-h3",
            "content": "Làm bài tập workbook Unit11-Lesson 1,2",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l5-h4",
            "content": "Làm Sách bổ trợFF1 Extra - unit 11 - lesson 1 - (tr134-136)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 11_lesson 12.pptx\nhttps://quizizz.com/admin/quiz/61f2a965f0f511001e62a1e4",
        "note": ""
      },
      {
        "id": "fam-s4-l6",
        "index": 6,
        "unit": "Unit 11 : I LIKE MONKEYS · Lesson 3,4",
        "objective": "",
        "content": "- Review words : Animal ( Lesson 1)\n- Review grammar : like / don't like - be ( am is are)\n- New words : tiger, snake, parrot, polar bear, seal\n- Song : Let's go to the zoo\n- Phonics : CVC words (_a_)",
        "lessonPlan": "- Warm up\n- Check homework\n- Review words : animals\n- Teach new word : animals\n- Practice Vocabulary ( lesson 1+3)\n- Sing the song\n- Review Grammar : like / don't like - be ( am is are)\n- Practice Grammar\n- Phonics : CVC words (_a_)\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s4-l6-h1",
            "content": "Các con quay video đọc từ vựng và miêu tả bức tranh cô gửi  (ít nhất 5 loài động vật) VD: I see a giraffe. It’s tall,it has long neck,it’s brown and yellow",
            "type": "Quay video"
          },
          {
            "id": "fam-s4-l6-h2",
            "content": "Viết từ mới vào vở (mỗi từ 5 lần)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l6-h3",
            "content": "Làm bài tập workbook Unit11-Lesson 3,4",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l6-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 11 - lesson 2 page 137, 138,139 ( còn lại)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l6-h5",
            "content": "Làm link quizziz cô gửi >90%",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 11_lesson 34.pptx\nhttps://quizizz.com/admin/quiz/620222e5b65efd001df88443\nhttps://www.liveworksheets.com/ds2749487ma\nhttps://www.liveworksheets.com/fb337947ru",
        "note": ""
      },
      {
        "id": "fam-s4-l7",
        "index": 7,
        "unit": "Unit 11 : I LIKE MONKEYS · Lesson 5,6",
        "objective": "",
        "content": "- Review words :  Animals\n- Review grammar : like / don't like - be ( am is are)\n- Reading Skill : Describing the animals\n- Listening Skill : Listen and number\n- Writing Skill : Find the adjectives\n- Speaking : Describe the animals",
        "lessonPlan": "- Warm up\n- Check homework\n- Review words + Check test vocab\n- Practice Grammar\n- Reading + Reading comprehension\n- Listening + making Q and A\n- Writing : Find the adjectives\n- Guide S to describe the the animal",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s4-l7-h1",
            "content": "Các con quay video đọc bài Skills time",
            "type": "Quay video"
          },
          {
            "id": "fam-s4-l7-h2",
            "content": "Viết từ mới vào vở (mỗi từ 5 lần )",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l7-h3",
            "content": "Làm bài tập workbook Unit11-Lesson 5,6",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l7-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 11 - lesson 3 -(tr140-142) (Bài còn lại )",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l7-h5",
            "content": "Làm quizziz cô gửi >90%",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 11_lesson 56.pptx\nhttps://quizizz.com/admin/quiz/62061f40ee3b47001ed94fca\nhttps://www.liveworksheets.com/oe53608pd\nhttps://www.liveworksheets.com/ds2749487ma",
        "note": ""
      },
      {
        "id": "fam-s4-l8",
        "index": 8,
        "unit": "Unit 11 : I LIKE MONKEYS · Lesson 7,8",
        "objective": "",
        "content": "- Review words + Grammar\n- Speaking : Describe the animals\n- Listening extra : (Starters Listening )",
        "lessonPlan": "- Warm up\n- Homework check\n- Review words + Grammar\n- Practice Game\n- Speaking : Describe the picture\n- Listening extra : Starters Listening ( L4_Bổ trợ)\n- Mini test Unit 11",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s4-l8-h1",
            "content": "Các con quay video lồng tiếng video từ 2p25 https://youtu.be/q6s5Pg9ws9g?si=bVLAMvX8HkmB6ayO",
            "type": "Quay video"
          },
          {
            "id": "fam-s4-l8-h2",
            "content": "Làm Sách bổ trợ nâng cao - unit 11 - lesson 4 - (tr143-144) (Bài còn lại )",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: Unit 11-Lesson 78.pptx\nhttps://www.liveworksheets.com/oe53608pd\nhttps://www.liveworksheets.com/ds2749487ma",
        "note": ""
      },
      {
        "id": "fam-s4-l9",
        "index": 9,
        "unit": "UNIT 12 : DINNER TIME · Lesson 1,2",
        "objective": "",
        "content": "- New words : Food ( rice, meat, carrots, yogurt, fish, bread)\n- Structure : Do you like ... ? What do you like ?\n- Reading : Dialogue",
        "lessonPlan": "- Mini test Unit 11\n- Warm up\n- Check homework\n- Teach vocab about food\n- Practice vocabulary ( Game)\n- Teach grammar :  Do you like ... ? What do you like ?\n- Practice Grammar\n- Game Grammar\n- Read dialogue\n- Practice extra\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s4-l9-h1",
            "content": "Các con quay video bài đọc từ vựng và bài Story",
            "type": "Quay video"
          },
          {
            "id": "fam-s4-l9-h2",
            "content": "Viết từ mới và mẫu câu cô gửi vào vở ô ly (mỗi từ 5 lần)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l9-h3",
            "content": "Làm bài tập workbook Unit 12- Lesson 1,2",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l9-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 12 - lesson 1 - (tr146-148) (Còn lại)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l9-h5",
            "content": "Làm link quizziz cô gửi >90%",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 12_lesson 12.pptx\nhttps://quizizz.com/admin/quiz/620b5f265bbaab001d6ee57b\nhttps://www.liveworksheets.com/xb2542542nq",
        "note": ""
      },
      {
        "id": "fam-s4-l10",
        "index": 10,
        "unit": "UNIT 12 : DINNER TIME · Lesson 3,4",
        "objective": "",
        "content": "- Review words : Food ( Lesson 1)\n- Review grammar :  Do you like ... ? What do you like ?\n- New words : drinks  ( milk, juice, water, hot chocolate, tea)\n- Song : Drink your milk\n- Phonics : CVC (_e_)",
        "lessonPlan": "- Warm up\n- Review words + Practice words\n- Teach new word : Drinks\n- Practice : all words\n- Sing the song\n- Review Grammar :  Do you like ... ? What do you like ?\n- Practice Grammar\n- Check homework\n- Phonics : CVC (_e_)\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s4-l10-h1",
            "content": "Các con quay video bài đọc từ vựng và bài trả lời các câu hỏi cô gửi. ( kèm ảnh)",
            "type": "Quay video"
          },
          {
            "id": "fam-s4-l10-h2",
            "content": "Viết từ mới và mẫu câu cô gửi vào vở ô ly (mỗi từ 5 lần)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l10-h3",
            "content": "Làm bài tập workbook Unit3- Lesson 3,4",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l10-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 12 - lesson 2 - (tr149-151) (Còn lại) 5, Làm Linkz quizziz >90%",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 12_lesson 34.pptx\nhttps://quizizz.com/admin/quiz/620f58c4ed9dcf001ed7e3ea\nhttps://www.liveworksheets.com/sm1270996iv\nhttps://www.liveworksheets.com/cb1333968yf",
        "note": ""
      },
      {
        "id": "fam-s4-l11",
        "index": 11,
        "unit": "UNIT 12 : DINNER TIME · Lesson 5,6",
        "objective": "",
        "content": "- Review words : Food and drinks  ( L1+3 )\n- Review grammar :  Do you like ... ? What do you like ?\n- Reading Skill : Choosing the dish from the menu\n- Listening Skill : Listen and draw\n- Writing Skill : short form of do not, is not, are not\n- Speaking : WHat do you have for each meal ?",
        "lessonPlan": "- Warm up\n- Check homework + Check test vocab\n- Practice Grammar\n- Reading + Reading comprehension\n- Listening + retell\n- Writing : isn't , don't , aren't\n- Speaking : What do you have for each meal ?",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s4-l11-h1",
            "content": "Quay bài Skills time.",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l11-h2",
            "content": "Làm bài tập workbook Unit3- Lesson 5,6",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l11-h3",
            "content": "Làm Sách bổ trợ nâng cao - unit 12 - lesson 3 - (tr152-154) (Còn lại)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l11-h4",
            "content": "Làm quizziz >90%",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 12_lesson 56.pptx\nhttps://quizizz.com/admin/quiz/62149abcd3dc06001d9d57ef\nhttps://www.liveworksheets.com/sm1270996iv\nhttps://www.liveworksheets.com/rh913688yd",
        "note": ""
      },
      {
        "id": "fam-s4-l12",
        "index": 12,
        "unit": "Review words + Grammar",
        "objective": "",
        "content": "- Review words + Grammar\n- Speaking : WHat do you have for each meal ?\n- Listening extra : (Staters Listening)",
        "lessonPlan": "- Warm up\n- Homework check\n- Review words + Grammar\n- Practice Game\n- Speaking : WHat do you have for each meal ?\n- Listening extra : Starters Listening ( L4_Bổ trợ)\n- Mini test Unit 12",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s4-l12-h1",
            "content": "Các con quay video bài đọc từ vựng unit 12",
            "type": "Quay video"
          },
          {
            "id": "fam-s4-l12-h2",
            "content": "Các con quay video lồng tiếng từ 2p https://youtu.be/mqHABUNVm7o?si=WdW8GhoNMOchyReV",
            "type": "Quay video"
          },
          {
            "id": "fam-s4-l12-h3",
            "content": "Làm Sách bổ trợ nâng cao - unit 12 - lesson 4 - (tr155-159) (Còn lại )",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: Unit 12-Lesson 78.pptx",
        "note": ""
      },
      {
        "id": "fam-s4-l13",
        "index": 13,
        "unit": "Review Unit  10,11,12",
        "objective": "",
        "content": "- Review Unit  10,11,12",
        "lessonPlan": "- Mini test Unit 12",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s4-l13-h1",
            "content": "Quay video đọc từ vựng unit 10 11 12",
            "type": "Quay video"
          },
          {
            "id": "fam-s4-l13-h2",
            "content": "Làm bài tập Workbook trang 92,94,95",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l13-h3",
            "content": "Làm link quizziz cô gửi >90%",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s4-l13-h4",
            "content": "Ôn tập lại unit 10,11,12 buổi sau có bài Big test",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: ReviewU101112.pptx\nhttps://quizizz.com/admin/quiz/61f3bc5e95bbef001e2227d2\nhttps://quizizz.com/admin/quiz/62061f40ee3b47001ed94fca\nhttps://quizizz.com/admin/quiz/62149abcd3dc06001d9d57ef",
        "note": ""
      }
    ],
    "bigTest": {
      "id": "fam-bt4",
      "name": "Big Test — Unit 10 - 12",
      "material": "https://drive.google.com/drive/folders/1HXn1WS9vMLfzLBxcVbVxiCdTOrC4URv7?usp=sharing",
      "note": "- No Homework\n- Giáo Viên trông test, thu hoạch video\n- Nhận xét , chấm bài, tổng hợp kết quả và gửi muộn nhất 7 ngày sau khi test\n- Từ ngày thứ 8 được tính là muộn, Gv bị phạt 30k/ ngày muộn"
    }
  },
  {
    "id": "fam-st5",
    "name": "Chặng 5: Unit 13–15",
    "goal": "Nội dung: UNIT 13 : Tidy up, Unit 14 : ACTION BOY CAN RUN, UNIT 15 : LET'S PLAY BALL",
    "lessons": [
      {
        "id": "fam-s5-l1",
        "index": 1,
        "unit": "UNIT 13 : Tidy up · Lesson 1,2",
        "objective": "",
        "content": "- New words : Things at home\n- (rug, bed, cupboard, shelf, pillow, blanket)\n- Structure : There's .... / There are ...\n- Reading : Dialogue",
        "lessonPlan": "- Warm up\n- Teach vocab about Things at home\n- Practice vocabulary ( Game)\n- Teach grammar : There is / There are\n- Practice Grammar\n- Game Grammar\n- Read dilogue\n- Practice extra\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s5-l1-h1",
            "content": "Các con quay video bài đọc toàn bộ từ vựng Unit 12 và story",
            "type": "Quay video"
          },
          {
            "id": "fam-s5-l1-h2",
            "content": "Viết từ mới và mẫu câu cô gửi vào vở ô ly (mỗi từ 5 lần)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l1-h3",
            "content": "Làm bài tập workbook Unit 12- Lesson 1,2",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l1-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 13 - lesson 1 - (tr160-162) (Còn lại)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l1-h5",
            "content": "Làm link quizziz cô gửi >90%",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 13_lesson 1.pptx\nhttps://quizizz.com/admin/quiz/6220c1e4edc88a001d7875c7\nliveworksheets.com/worksheet/en/english-second-language-esl/1316627\nhttps://www.liveworksheets.com/worksheet/en/english-second-language-esl/683801",
        "note": ""
      },
      {
        "id": "fam-s5-l2",
        "index": 2,
        "unit": "UNIT 13 : Tidy up · Lesson 3,4",
        "objective": "",
        "content": "- Review words :Things at home  ( Lesson 1)\n- Review grammar : There is / There are\n- New words :Number 11 - 20\n- Song : There are ten in the bed\n- Phonics : CVC (i)",
        "lessonPlan": "- Warm up\n- Check homework\n- Review words : Things at home\n- Teach new word : Number 1 - 20\n- Practice Vocabulary\n- Sing the song\n- Review Grammar : There is / There are\n- Practice Grammar\n- Teach phonics\n- Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s5-l2-h1",
            "content": ".Các con quay video bài đọc từ vựng và video Speaking “What’s in your bedroom?”",
            "type": "Quay video"
          },
          {
            "id": "fam-s5-l2-h2",
            "content": "Viết từ mới cô gửi vào vở ô ly (mỗi từ 5 lần)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l2-h3",
            "content": "Làm bài tập workbook Unit13-Lesson 5,6",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l2-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 13 - lesson 3 - (tr166-168) (Còn lại)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l2-h5",
            "content": "Làm link quizziz >90%",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 13_lesson 34.pptx\nhttps://quizizz.com/admin/quiz/62271583b97ac8001eff540a",
        "note": ""
      },
      {
        "id": "fam-s5-l3",
        "index": 3,
        "unit": "UNIT 13 : Tidy up · Lesson 5,6",
        "objective": "",
        "content": "- Review words : Things at home + Number\n- Review grammar : There is / There are\n- Reading Skill : Read the letter\n- Listening skill : Listen and identify picture\n- Writing Skill : ? or .\n- Speaking Skill : Describe your bedroom",
        "lessonPlan": "- Warm up\n- Check homework + Check test vocab\n- Practice Grammar\n- Reading + Reading comprehension\n- Listening + retell\n- Writing : ? or .\n- Speaking : Describe your bedroom",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s5-l3-h1",
            "content": "Các con quay video bài đọc từ vựng và video Speaking “What’s in your bedroom?”",
            "type": "Quay video"
          },
          {
            "id": "fam-s5-l3-h2",
            "content": "Viết từ mới cô gửi vào vở ô ly (mỗi từ 2 dòng)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l3-h3",
            "content": "Làm bài tập workbook Unit13-Lesson 5,6",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l3-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 13 - lesson 3 - exercise 1,3,4,5 (tr166-168) (Còn lại làm trên lớp)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l3-h5",
            "content": "Hoàn thiện link quizziz cô gửi.( yêu cầu làm nhiều lần để đúng 90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 13_lesson 56.pptx\nhttps://quizizz.com/admin/quiz/622965f7733aa0001e2fa934\nhttps://www.liveworksheets.com/worksheet/en/english-second-lan/438347",
        "note": ""
      },
      {
        "id": "fam-s5-l4",
        "index": 4,
        "unit": "UNIT 13 : Tidy up · Lesson 7,8",
        "objective": "",
        "content": "- Review words + Grammar\n- Practice speaking : Describe your bedroom\n- Listening extra : (Starters Listening)\n- Mini test Unit 13",
        "lessonPlan": "- Warm up\n- Homework check\n- Review words + Grammar\n- Practice Game\n- Speaking : Describe your bedroom\n- Listening extra : Starters Listening ( L4_Bổ trợ)",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s5-l4-h1",
            "content": "Các con quay video Potato In the evening (8 câu) và At the store (4 câu)",
            "type": "Quay video"
          },
          {
            "id": "fam-s5-l4-h2",
            "content": "Làm Sách bổ trợ nâng cao - unit 13 - lesson 4 - exercise 1,2,3 (tr169-171) (Còn lại làm trên lớp)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l4-h3",
            "content": "Hoàn thiện link quizziz cô gửi.( yêu cầu làm nhiều lần để đúng 90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: Unit 13-Lesson 78.pptx",
        "note": ""
      },
      {
        "id": "fam-s5-l5",
        "index": 5,
        "unit": "Unit 14 : ACTION BOY CAN RUN · Lesson 1,2",
        "objective": "",
        "content": "- Mini test Unit 13\n- New words : Action ( run, fly, walk, fly, swim, climb, talk)\n- Structure :can / can't\n- Reading : Dialogue",
        "lessonPlan": "- Warm up\n- Check homework\n- Teach vocab about actions\n- Practice vocabulary ( Game)\n- Teach grammar : Can / can't\n- Practice Grammar\n- Game Grammar\n- Read dialogue\n- Practice extra\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s5-l5-h1",
            "content": "Các con quay video bài đọc từ vựng và Story",
            "type": "Quay video"
          },
          {
            "id": "fam-s5-l5-h2",
            "content": "Viết từ mới và mẫu câu vào vở ô ly (mỗi từ 2 dòng)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l5-h3",
            "content": "Làm bài tập workbook Unit14-Lesson 1,2",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l5-h4",
            "content": "Làm Sách bổ trợ nâng cao - unit 14 - lesson 1 - exercise 1,3, 4 (tr172-174) (Còn lại làm trên lớp)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l5-h5",
            "content": "Hoàn thiện link quizziz cô gửi.( yêu cầu làm nhiều lần để đúng 90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 14_lesson 1.pptx\nhttps://quizizz.com/admin/quiz/622f4ea6b80113001d0919b9",
        "note": ""
      },
      {
        "id": "fam-s5-l6",
        "index": 6,
        "unit": "Unit 14 : ACTION BOY CAN RUN · Lesson 3,4",
        "objective": "",
        "content": "- Review words : Actions  ( Lesson 1)\n- Review grammar : can/ can't\n- New words : write, draw, sing, dance , cook\n- Song : I can do anything\n- Phonics : CVC (o)",
        "lessonPlan": "- Warm up\n- Review words : Actions\n- Teach new word : actions ( Lesson 3)\n- Practice Vocabulary ( lesson 1+3)\n- Sing the song\n- Review Grammar :can / can't\n- Practice Grammar\n- Check homework\n- Phonics : CVC (o)\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s5-l6-h1",
            "content": "Các con quay video bài đọc từ vựng và miêu tả 5 con vật dùng can,can’t VD: The parrot can talk but it can’t run",
            "type": "Quay video"
          },
          {
            "id": "fam-s5-l6-h2",
            "content": "Viết từ mới và mẫu câu cô gửi vào vở ô ly (mỗi từ 5 lần )",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l6-h3",
            "content": "Làm bài tập workbook Unit14- Lesson 3,4",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l6-h4",
            "content": "Làm Sách bổ trợ  - unit 14 - lesson 2 - (tr175-177) (Còn lại)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l6-h5",
            "content": "Làm link quizziz",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: Unit 14-Lesson 34.pptx\nhttps://quizizz.com/admin/quiz/623349dcf3e650001f7beb10",
        "note": ""
      },
      {
        "id": "fam-s5-l7",
        "index": 7,
        "unit": "Unit 14 : ACTION BOY CAN RUN · Lesson 5,6",
        "objective": "",
        "content": "- Review words :  Actions\n- Review grammar : can / can't\n- Reading Skill : Animal's ability\n- Listening Skill : Listen and number\n- Writing Skill : Short form of can not\n- Speaking : Describe favourite animal ( ability)",
        "lessonPlan": "- Warm up\n- Check homework + Check test vocab\n- Practice Grammar\n- Reading + Reading comprehension\n- Listening + describe a pic\n- Writing : and / or\n- Describe favourite animal ( ability)",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s5-l7-h1",
            "content": "Các con quay video bài đọc từ vựng và bài Speaking: Describe an animal (cô gửi mẫu)",
            "type": "Quay video"
          },
          {
            "id": "fam-s5-l7-h2",
            "content": "Làm bài tập workbook Unit14- Lesson 5,6",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l7-h3",
            "content": "Làm Sách bổ trợ nâng cao - unit 14 - lesson 3 - (tr179) (Còn lại)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l7-h4",
            "content": "Làm Quizziz cô gửi",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 14_lesson 56.pptx\nhttps://quizizz.com/admin/quiz/623977ff26b9fd001d11e6d6",
        "note": ""
      },
      {
        "id": "fam-s5-l8",
        "index": 8,
        "unit": "Review words + Grammar",
        "objective": "",
        "content": "- Review words + Grammar\n- Speaking : Describe favourite animal ( ability)\n- Listening extra : (Movers Listening )",
        "lessonPlan": "- Warm up\n- Homework check\n- Review words + Grammar\n- Practice Game\n- Speaking : Describe the differences\n- Listening extra : Starters Listening ( L4_Bổ trợ)\n- Mini test Unit 14",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s5-l8-h1",
            "content": "Quay video thu hoạch Speaking miêu tả 1 con vật yêu thích (cô gửi gợi ý) một cách tự tin nhất. Có thể dùng ảnh minh họa của con. Quay video đọc lại bảng từ vựng unit 14.",
            "type": "Quay video"
          },
          {
            "id": "fam-s5-l8-h2",
            "content": "Làm Sách bổ trợ nâng cao - unit 14 - lesson 4 - (tr180-183) (Còn lại )",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: Unit 14-Lesson 78.pptx",
        "note": ""
      },
      {
        "id": "fam-s5-l9",
        "index": 9,
        "unit": "UNIT 15 : LET'S PLAY BALL · Lesson 1,2",
        "objective": "",
        "content": "- New words : The beach ( sandcastle, beach, the sea, crab, boat, shell)\n- Structure : Let's V\n- Reading : Dialogue\n- Mini test Unit 14",
        "lessonPlan": "- Warm up\n- Check homework\n- Teach vocab about the beach\n- Practice vocabulary ( Game)\n- Teach grammar : Let's V\n- Practice Grammar\n- Game Grammar\n- Read dialogue\n- Practice extra\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s5-l9-h1",
            "content": "Các con quay video bài đọc từ vựng Story",
            "type": "Quay video"
          },
          {
            "id": "fam-s5-l9-h2",
            "content": "Viết từ mới vào vở ô ly (mỗi từ 5 lần)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l9-h3",
            "content": "Làm bài tập workbook Unit15- Lesson 1,2",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l9-h4",
            "content": "Làm Sách bổ trợ  - unit 15 - lesson 1 -(tr185,186)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l9-h5",
            "content": "Hoàn thiện link quizziz cô gửi.( yêu cầu làm nhiều lần để đúng 90%)",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 15_lesson 12.pptx\nhttps://quizizz.com/admin/quiz/623c77ca725566001ea88fba",
        "note": ""
      },
      {
        "id": "fam-s5-l10",
        "index": 10,
        "unit": "UNIT 15 : LET'S PLAY BALL · Lesson 3,4",
        "objective": "",
        "content": "- Review words : the beach\n- Review grammar : Let's V\n- New words : sun cream, bat, ice lolly, bucket, spade\n- Song : It's wonderful day\n- Phonics : CVC (u)",
        "lessonPlan": "- Warm up\n- Review words + Practice words\n- Teach new word : the beach (cont)\n- Practice : all words\n- Sing the song\n- Review Grammar : Let's V\n- Practice Grammar\n- Check homework\n- Phonics : CVC\n- Practice + Wrap up",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s5-l10-h1",
            "content": "Các con quay video bài đọc từ vựng và bài miêu tả tranh cô gửi (ít nhất 5 hoạt động) Từ vựng cô đã gợi ý.",
            "type": "Quay video"
          },
          {
            "id": "fam-s5-l10-h2",
            "content": "Viết từ mới vào vở ô ly (mỗi từ 5 lần)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l10-h3",
            "content": "Làm bài tập workbook Unit 15- Lesson 3,4",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l10-h4",
            "content": "Sách bổ trợ  - unit 15 - lesson 2 -       (tr187,188,189)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l10-h5",
            "content": "Làm Quizziz cô gửi",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 15_lesson 34.pptx\nhttps://quizizz.com/admin/quiz/6242c53f80bd49001dc6c3fd",
        "note": ""
      },
      {
        "id": "fam-s5-l11",
        "index": 11,
        "unit": "UNIT 15 : LET'S PLAY BALL · Lesson 5,6",
        "objective": "",
        "content": "- Review words : the beach\n- Review grammar : Let's V\n- Reading Skill : Reading a letter\n- Listening Skill : Listen and identify picture\n- Writing Skill : Find the verb\n- Speaking : Find the differences",
        "lessonPlan": "- Warm up\n- Check homework + Check test vocab\n- Practice Grammar\n- Reading + Reading comprehension\n- Listening\n- Writing :  Find the verb\n- Speaking : Find the differences",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s5-l11-h1",
            "content": "Các con quay video bài đọc Skills time",
            "type": "Quay video"
          },
          {
            "id": "fam-s5-l11-h2",
            "content": "Làm bài tập workbook Unit 15- Lesson 5,6",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l11-h3",
            "content": "Làm Sách bổ trợ  - unit 15 - lesson 3 - (tr190,191,192)",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l11-h4",
            "content": "Làm link quizziz cô gửi",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: unit 15_lesson 56.pptx\nhttps://quizizz.com/admin/quiz/6245a935f36e09001d71efe2",
        "note": ""
      },
      {
        "id": "fam-s5-l12",
        "index": 12,
        "unit": "Review words + Grammar",
        "objective": "",
        "content": "- Review words + Grammar\n- Speaking : Find the differences\n- Listening extra : (Movers Listening )",
        "lessonPlan": "- Warm up\n- Homework check\n- Review words + Grammar\n- Practice Game\n- Speaking : Describe the differences\n- Listening extra : Starters Listening ( L4_Bổ trợ)\n- Mini test Unit 15",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s5-l12-h1",
            "content": "Các con quay video Speaking miêu tả bức tranh với mẫu câu : At the beach,I see… Let’s play (Football)",
            "type": "Quay video"
          },
          {
            "id": "fam-s5-l12-h2",
            "content": "Làm sách bổ trợ nâng cao - unit 15 - lesson 4 -  (tr193-195 )",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: Unit 15-Lesson 78.pptx",
        "note": ""
      },
      {
        "id": "fam-s5-l13",
        "index": 13,
        "unit": "Review Unit  13,14,15",
        "objective": "",
        "content": "- Review Unit  13,14,15",
        "lessonPlan": "- Mini test Unit 15",
        "foreignTeacherContent": "Foreign teacher: Warm-up greeting & free talk theo chủ đề buổi; luyện phát âm (minimal pairs), đọc mẫu và sửa lỗi trực tiếp; hỏi-đáp mở rộng để tăng phản xạ giao tiếp.",

        "suggestedActivities": "Hoạt động gợi ý: Flashcard game / TPR khởi động; role-play theo mẫu câu; chant/song củng cố từ vựng; hoạt động nhóm (matching, board race) và mini-game thưởng cuối buổi.",

        "homeworks": [
          {
            "id": "fam-s5-l13-h1",
            "content": "Quay video đọc từ mới Unit 13,14,15 theo bảng cô gửi",
            "type": "Quay video"
          },
          {
            "id": "fam-s5-l13-h2",
            "content": "Làm bài tập workbook trang 114,116,117",
            "type": "Phiếu bài tập"
          },
          {
            "id": "fam-s5-l13-h3",
            "content": "Ôn tập lại toàn bộ 3 unit 13 14 15 buổi sau có bài kiểm tra Bigtest",
            "type": "Phiếu bài tập"
          }
        ],
        "material": "PPT: ReviewU13,14,15.pptx\nhttps://wayground.com/admin/quiz/6245a935f36e09001d71efe2/unit-15-ff1-l123456",
        "note": ""
      }
    ],
    "bigTest": {
      "id": "fam-bt5",
      "name": "Big Test — Unit 13 - 15",
      "material": "https://drive.google.com/drive/folders/1HXn1WS9vMLfzLBxcVbVxiCdTOrC4URv7?usp=sharing",
      "note": "- No Homework\n- Giáo Viên trông test, thu hoạch video\n- Nhận xét , chấm bài, tổng hợp kết quả và gửi muộn nhất 7 ngày sau khi test\n- Từ ngày thứ 8 được tính là muộn, Gv bị phạt 30k/ ngày muộn"
    }
  }
];

/** Buổi học thêm riêng cho từng lớp — không ghi đè syllabus tổng. */
export type ClassSyllabusInsert = {
  id: string;
  stageId: string;
  afterSessionId: string | null;
  order: number;
  session: SyllabusSessionData;
};

export type ClassSyllabusExtras = {
  inserts: ClassSyllabusInsert[];
};

export function createClassSessionId(classId: string): string {
  return `cls-${classId}-s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function isClassAddedSession(sessionId: string, classId: string): boolean {
  return sessionId.startsWith(`cls-${classId}-s-`);
}

function mergeStageSessions(
  masterSessions: SyllabusSessionData[],
  inserts: ClassSyllabusInsert[],
): SyllabusSessionData[] {
  const result: SyllabusSessionData[] = [];
  const sorted = [...inserts].sort((a, b) => a.order - b.order);

  const appendAfter = (afterId: string | null) => {
    for (const ins of sorted.filter((i) => i.afterSessionId === afterId)) {
      result.push(ins.session);
      appendAfter(ins.session.id);
    }
  };

  appendAfter(null);
  for (const ms of masterSessions) {
    result.push(ms);
    appendAfter(ms.id);
  }
  return result;
}

export function mergeClassSyllabusStages(
  master: SyllabusStageData[],
  extras: ClassSyllabusExtras,
): SyllabusStageData[] {
  return master.map((stage) => ({
    ...stage,
    sessions: mergeStageSessions(
      stage.sessions,
      extras.inserts.filter((i) => i.stageId === stage.id),
    ),
  }));
}

export function resolveInsertAnchor(
  stageSessions: SyllabusSessionData[],
  insertIndex: number,
): string | null {
  if (insertIndex <= 0) return null;
  return stageSessions[insertIndex - 1]?.id ?? null;
}

export function nextInsertOrder(
  inserts: ClassSyllabusInsert[],
  stageId: string,
  afterSessionId: string | null,
): number {
  const same = inserts.filter((i) => i.stageId === stageId && i.afterSessionId === afterSessionId);
  return same.length > 0 ? Math.max(...same.map((i) => i.order)) + 1 : 0;
}

export function createInitialSyllabusContents(): Record<string, SyllabusStageData[]> {
  const base = SYLLABUS_STAGES.map(normalizeSyllabusStage);
  const clone = () => JSON.parse(JSON.stringify(base)) as SyllabusStageData[];
  const map: Record<string, SyllabusStageData[]> = { _default: clone() };
  for (const s of SYLLABI) map[s.id] = clone();
  map["syFAM"] = FAM_SYLLABUS_STAGES.map(normalizeSyllabusStage);
  return map;
}

export function resolveSyllabusId(label: string, extra: Syllabus[] = []): string {
  const all = [...extra, ...SYLLABI];
  const hit =
    all.find((s) => label === s.id || label.startsWith(s.id) || label.includes(s.code) || label.includes(s.name));
  return hit?.id ?? "_default";
}

/* ===== Demo điểm danh & điểm số (dùng chung) ===== */
export interface SyllabusStudentRow {
  id: string;
  code: string;
  name: string;
  attendance: "Có mặt" | "Vắng có phép" | "Vắng không phép";
  attendanceNote: string;
  grades: Record<string, number>;
  gradeNote: string;
}
export const SYLLABUS_GRADE_COLUMNS: string[] = ["Quiz 1", "Homework", "Speaking", "Mini Test"];

export type ReportAttendance = "Vắng" | "Có phép" | "Không phép" | "Đi muộn";
export type BtvnStatus = "Yes" | "X" | "Yes làm thiếu";
export type LearningSpirit =
  | "Nói chuyện riêng"
  | "Chưa tập trung"
  | "Hăng hái nhưng còn mất tập trung"
  | "Ít hăng hái"
  | "Hăng hái tích cực"
  | "Ngoan, tập trung"
  | "Tốt, tập trung"
  | "Mất kết nối"
  | "Đôi lúc chưa tập trung"
  | "Có tiến bộ"
  | "Cần luyện tập thêm";

export interface BtvnColumn {
  id: string;
  label: string;
}

export const DEFAULT_BTVN_COLUMN_ID = "btvn-default";

export const DEFAULT_BTVN_COLUMNS: BtvnColumn[] = [
  { id: DEFAULT_BTVN_COLUMN_ID, label: "" },
];

export const DEFAULT_SCORE_COLUMNS: BtvnColumn[] = [
  { id: "score-1", label: "BTVN /110" },
  { id: "score-2", label: "Thực hành ngữ pháp /30" },
];

export function homeworkSubmissionKey(studentId: string, sessionIdx: number, columnId: string) {
  return `${studentId}|${sessionIdx}|${columnId}`;
}

export function homeworkCorrectionKey(studentId: string, sessionIdx: number, columnId: string) {
  return `corr|${studentId}|${sessionIdx}|${columnId}`;
}

export const SEED_HOMEWORK_SUBMISSIONS: Record<string, string> = {
  [homeworkSubmissionKey("ss1", 1, "score-1")]: "https://docs.google.com/document/d/demo-hong-diep-btvn",
  [homeworkSubmissionKey("ss2", 1, "score-1")]: "https://docs.google.com/document/d/demo-minh-khang-btvn",
  [homeworkSubmissionKey("ss3", 1, "score-1")]: "https://drive.google.com/file/d/demo-thanh-ha-btvn",
  [homeworkSubmissionKey("ss5", 1, "score-1")]: "https://docs.google.com/document/d/demo-khanh-linh-btvn",
  [homeworkSubmissionKey("ss1", 1, "score-2")]: "https://docs.google.com/document/d/demo-hong-diep-nguphap",
  [homeworkSubmissionKey("s1", 1, "score-1")]: "https://docs.google.com/document/d/demo-kirito-btvn",
  [homeworkSubmissionKey("s1", 1, "score-2")]: "https://docs.google.com/document/d/demo-kirito-nguphap",
};

export const SEED_HOMEWORK_CORRECTIONS: Record<string, string> = {
  [homeworkCorrectionKey("s1", 1, "score-1")]: "https://docs.google.com/document/d/demo-kirito-btvn-corrected",
  [homeworkCorrectionKey("ss1", 1, "score-1")]: "https://docs.google.com/document/d/demo-hong-diep-btvn-corrected",
  [homeworkCorrectionKey("ss2", 1, "score-1")]: "https://docs.google.com/document/d/demo-minh-khang-btvn-corrected",
  [homeworkCorrectionKey("ss5", 1, "score-1")]: "https://docs.google.com/document/d/demo-khanh-linh-btvn-corrected",
};

export type ReportTagTone =
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "muted"
  | "violet"
  | "pink"
  | "slate"
  | "teal"
  | "orange";

export interface ReportSelectOption<T extends string = string> {
  value: T;
  tone: ReportTagTone;
}

export const REPORT_ATTENDANCE_OPTIONS: ReportSelectOption<ReportAttendance>[] = [
  { value: "Vắng", tone: "success" },
  { value: "Có phép", tone: "info" },
  { value: "Không phép", tone: "danger" },
  { value: "Đi muộn", tone: "warning" },
];

export const BTVN_STATUS_OPTIONS: ReportSelectOption<BtvnStatus>[] = [
  { value: "Yes", tone: "success" },
  { value: "X", tone: "danger" },
  { value: "Yes làm thiếu", tone: "warning" },
];

export const LEARNING_SPIRIT_OPTIONS: ReportSelectOption<LearningSpirit>[] = [
  { value: "Nói chuyện riêng", tone: "orange" },
  { value: "Chưa tập trung", tone: "warning" },
  { value: "Hăng hái nhưng còn mất tập trung", tone: "info" },
  { value: "Ít hăng hái", tone: "violet" },
  { value: "Hăng hái tích cực", tone: "pink" },
  { value: "Ngoan, tập trung", tone: "teal" },
  { value: "Tốt, tập trung", tone: "pink" },
  { value: "Mất kết nối", tone: "slate" },
  { value: "Đôi lúc chưa tập trung", tone: "teal" },
  { value: "Có tiến bộ", tone: "orange" },
  { value: "Cần luyện tập thêm", tone: "warning" },
];

export interface SyllabusReportRow {
  id: string;
  code: string;
  name: string;
  attendance: ReportAttendance;
  btvnHw: Record<string, BtvnStatus>;
  scores: Record<string, number | "">;
  learningSpirit: LearningSpirit;
  teacherComment: string;
}

const defaultBtvnHw = (columnIds: string[] = [DEFAULT_BTVN_COLUMN_ID]): Record<string, BtvnStatus> =>
  Object.fromEntries(columnIds.map((id) => [id, "Yes" as BtvnStatus]));

export const SYLLABUS_REPORT_ROWS: SyllabusReportRow[] = [
  { id: "ss1", code: "HV001", name: "Nguyễn Hồng Diệp", attendance: "Vắng", btvnHw: { [DEFAULT_BTVN_COLUMN_ID]: "Yes" }, scores: { "score-1": 105, "score-2": "" }, learningSpirit: "Hăng hái tích cực", teacherComment: "Con hăng hái tham gia, trả lời câu hỏi tốt. Cần luyện thêm phần nghe." },
  { id: "ss2", code: "HV002", name: "Trần Minh Khang", attendance: "Vắng", btvnHw: { [DEFAULT_BTVN_COLUMN_ID]: "Yes làm thiếu" }, scores: { "score-1": 86, "score-2": "" }, learningSpirit: "Ngoan, tập trung", teacherComment: "Con tập trung nghe giảng, làm bài đầy đủ nhưng cần nhanh hơn." },
  { id: "ss3", code: "HV003", name: "Lê Thanh Hà", attendance: "Có phép", btvnHw: { [DEFAULT_BTVN_COLUMN_ID]: "Yes" }, scores: { "score-1": 101, "score-2": "" }, learningSpirit: "Tốt, tập trung", teacherComment: "Vắng có phép. BTVN hoàn thành khá tốt." },
  { id: "ss4", code: "HV004", name: "Phạm Quang Huy", attendance: "Không phép", btvnHw: { [DEFAULT_BTVN_COLUMN_ID]: "X" }, scores: { "score-1": 62, "score-2": "" }, learningSpirit: "Chưa tập trung", teacherComment: "Con cần cải thiện thái độ học tập và hoàn thành BTVN đầy đủ hơn." },
  { id: "ss5", code: "HV005", name: "Đỗ Khánh Linh", attendance: "Vắng", btvnHw: { [DEFAULT_BTVN_COLUMN_ID]: "Yes" }, scores: { "score-1": 110, "score-2": "" }, learningSpirit: "Hăng hái tích cực", teacherComment: "Học sinh xuất sắc, chủ động phát biểu và hỗ trợ bạn cùng lớp." },
  { id: "ss6", code: "HV006", name: "Hoàng Đức Anh", attendance: "Đi muộn", btvnHw: { [DEFAULT_BTVN_COLUMN_ID]: "Yes làm thiếu" }, scores: { "score-1": 78, "score-2": "" }, learningSpirit: "Đôi lúc chưa tập trung", teacherComment: "Con vào muộn, cần đến lớp đúng giờ hơn." },
  { id: "ss7", code: "HV007", name: "Vũ Thu Trang", attendance: "Có phép", btvnHw: { [DEFAULT_BTVN_COLUMN_ID]: "Yes làm thiếu" }, scores: { "score-1": 92, "score-2": "" }, learningSpirit: "Có tiến bộ", teacherComment: "Con có tiến bộ rõ rệt so với tuần trước." },
  { id: "ss8", code: "HV008", name: "Bùi Gia Bảo", attendance: "Vắng", btvnHw: { [DEFAULT_BTVN_COLUMN_ID]: "Yes làm thiếu" }, scores: { "score-1": 74, "score-2": "" }, learningSpirit: "Cần luyện tập thêm", teacherComment: "Con cần bổ sung từ vựng và luyện tập thêm ở nhà." },
  { id: "ss9", code: "HV009", name: "Ngô Mai Phương", attendance: "Vắng", btvnHw: { [DEFAULT_BTVN_COLUMN_ID]: "Yes" }, scores: { "score-1": 98, "score-2": "" }, learningSpirit: "Hăng hái tích cực", teacherComment: "Rất chủ động phát biểu, thái độ học tập tốt." },
  { id: "ss10", code: "HV010", name: "Đặng Hải Nam", attendance: "Không phép", btvnHw: { [DEFAULT_BTVN_COLUMN_ID]: "X" }, scores: { "score-1": 55, "score-2": "" }, learningSpirit: "Ít hăng hái", teacherComment: "Cần gọi phụ huynh trao đổi về việc nghỉ học và không làm BTVN." },
].map((r) => ({ ...r, btvnHw: r.btvnHw ?? defaultBtvnHw() }));

export const SYLLABUS_STUDENTS: SyllabusStudentRow[] = [
  { id: "ss1",  code: "HV001", name: "Nguyễn Hồng Diệp",   attendance: "Có mặt",          attendanceNote: "Tham gia tích cực",        grades: { "Quiz 1": 9,  Homework: 10, Speaking: 8.5, "Mini Test": 9   }, gradeNote: "Học đều, phát âm tốt" },
  { id: "ss2",  code: "HV002", name: "Trần Minh Khang",     attendance: "Có mặt",          attendanceNote: "",                          grades: { "Quiz 1": 8,  Homework: 8,  Speaking: 7,   "Mini Test": 8   }, gradeNote: "Cần luyện thêm nghe" },
  { id: "ss3",  code: "HV003", name: "Lê Thanh Hà",         attendance: "Vắng có phép",    attendanceNote: "Đi khám bệnh",             grades: { "Quiz 1": 7,  Homework: 9,  Speaking: 8,   "Mini Test": 7.5 }, gradeNote: "" },
  { id: "ss4",  code: "HV004", name: "Phạm Quang Huy",      attendance: "Vắng không phép", attendanceNote: "Không liên lạc được",      grades: { "Quiz 1": 5,  Homework: 6,  Speaking: 5,   "Mini Test": 6   }, gradeNote: "Cần gọi phụ huynh" },
  { id: "ss5",  code: "HV005", name: "Đỗ Khánh Linh",       attendance: "Có mặt",          attendanceNote: "",                          grades: { "Quiz 1": 10, Homework: 10, Speaking: 9.5, "Mini Test": 9.5 }, gradeNote: "Học sinh xuất sắc" },
  { id: "ss6",  code: "HV006", name: "Hoàng Đức Anh",       attendance: "Có mặt",          attendanceNote: "Đi muộn 5 phút",           grades: { "Quiz 1": 7.5,Homework: 7,  Speaking: 7,   "Mini Test": 7   }, gradeNote: "" },
  { id: "ss7",  code: "HV007", name: "Vũ Thu Trang",        attendance: "Vắng có phép",    attendanceNote: "Đi du lịch cùng gia đình", grades: { "Quiz 1": 8,  Homework: 8,  Speaking: 7.5, "Mini Test": 8   }, gradeNote: "" },
  { id: "ss8",  code: "HV008", name: "Bùi Gia Bảo",         attendance: "Có mặt",          attendanceNote: "",                          grades: { "Quiz 1": 6,  Homework: 7,  Speaking: 6.5, "Mini Test": 6.5 }, gradeNote: "Cần bổ sung từ vựng" },
  { id: "ss9",  code: "HV009", name: "Ngô Mai Phương",      attendance: "Có mặt",          attendanceNote: "",                          grades: { "Quiz 1": 9,  Homework: 9,  Speaking: 9,   "Mini Test": 8.5 }, gradeNote: "Rất chủ động phát biểu" },
  { id: "ss10", code: "HV010", name: "Đặng Hải Nam",        attendance: "Vắng không phép", attendanceNote: "Tự ý nghỉ",                grades: { "Quiz 1": 4,  Homework: 5,  Speaking: 5,   "Mini Test": 5   }, gradeNote: "Cảnh báo học vụ" },
];
export interface Teacher {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  dob: string;
  gender: "Nam" | "Nữ";
  address: string;
  branch: Branch;
  position: string;
  startDate: string;
  baseSalary: number;
  perSessionRate: number;
  contract: { name: string; signedAt: string; expiresAt: string; fileName: string };
  related: { name: string; relation: string; phone: string }[];
  classes: string[]; // class ids
  attendanceReport: { month: string; sessions: number; absent: number; late: number }[];
  salaryReport: { month: string; sessions: number; gross: number; deduct: number; net: number }[];
}

export const TEACHERS: Teacher[] = [
  {
    id: "t1", name: "Cô Mai", email: "mai.nguyen@meprototype.vn", phone: "0912 111 222",
    dob: "15/08/1992", gender: "Nữ", address: "12 Đội Cấn, Ba Đình, Hà Nội",
    branch: "Đội Cấn", position: "Giáo viên chính", startDate: "01/09/2022",
    baseSalary: 8000000, perSessionRate: 250000,
    contract: { name: "Hợp đồng lao động 2026", signedAt: "01/01/2026", expiresAt: "31/12/2026", fileName: "HDLD-CoMai-2026.pdf" },
    related: [
      { name: "Nguyễn Văn Hùng", relation: "Chồng", phone: "0988 000 111" },
      { name: "Nguyễn Thị Lan", relation: "Mẹ", phone: "0977 000 222" },
    ],
    classes: ["c1"],
    attendanceReport: [
      { month: "01/2026", sessions: 22, absent: 0, late: 1 },
      { month: "02/2026", sessions: 20, absent: 1, late: 0 },
      { month: "03/2026", sessions: 24, absent: 0, late: 2 },
    ],
    salaryReport: [
      { month: "01/2026", sessions: 22, gross: 13500000, deduct: 500000, net: 13000000 },
      { month: "02/2026", sessions: 20, gross: 13000000, deduct: 500000, net: 12500000 },
      { month: "03/2026", sessions: 24, gross: 14000000, deduct: 500000, net: 13500000 },
    ],
  },
  {
    id: "t2", name: "Thầy Hùng", email: "hung.tran@meprototype.vn", phone: "0934 222 333",
    dob: "20/03/1990", gender: "Nam", address: "45 Hoàng Hoa Thám, Ba Đình, Hà Nội",
    branch: "Hoàng Hoa Thám", position: "Giáo viên chính", startDate: "15/06/2021",
    baseSalary: 9000000, perSessionRate: 280000,
    contract: { name: "Hợp đồng lao động 2026", signedAt: "01/01/2026", expiresAt: "31/12/2026", fileName: "HDLD-ThayHung-2026.pdf" },
    related: [
      { name: "Trần Thị Bình", relation: "Vợ", phone: "0966 333 444" },
    ],
    classes: [],
    attendanceReport: [
      { month: "01/2026", sessions: 20, absent: 0, late: 0 },
      { month: "02/2026", sessions: 22, absent: 0, late: 1 },
      { month: "03/2026", sessions: 24, absent: 1, late: 0 },
    ],
    salaryReport: [
      { month: "01/2026", sessions: 20, gross: 14600000, deduct: 600000, net: 14000000 },
      { month: "02/2026", sessions: 22, gross: 15160000, deduct: 600000, net: 14560000 },
      { month: "03/2026", sessions: 24, gross: 15720000, deduct: 600000, net: 15120000 },
    ],
  },
  {
    id: "t3", name: "Cô Lan", email: "lan.pham@meprototype.vn", phone: "0945 444 555",
    dob: "05/11/1994", gender: "Nữ", address: "8 Ngọc Hà, Ba Đình, Hà Nội",
    branch: "Ngọc Hà", position: "Giáo viên chính", startDate: "01/03/2023",
    baseSalary: 8500000, perSessionRate: 260000,
    contract: { name: "Hợp đồng lao động 2026", signedAt: "01/01/2026", expiresAt: "31/12/2026", fileName: "HDLD-CoLan-2026.pdf" },
    related: [
      { name: "Phạm Văn Đức", relation: "Bố", phone: "0901 555 666" },
    ],
    classes: [],
    attendanceReport: [
      { month: "01/2026", sessions: 18, absent: 0, late: 0 },
      { month: "02/2026", sessions: 20, absent: 0, late: 0 },
      { month: "03/2026", sessions: 22, absent: 0, late: 1 },
    ],
    salaryReport: [
      { month: "01/2026", sessions: 18, gross: 13180000, deduct: 500000, net: 12680000 },
      { month: "02/2026", sessions: 20, gross: 13700000, deduct: 500000, net: 13200000 },
      { month: "03/2026", sessions: 22, gross: 14220000, deduct: 500000, net: 13720000 },
    ],
  },
];
