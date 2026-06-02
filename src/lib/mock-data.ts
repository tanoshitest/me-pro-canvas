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
    bought: 32, attended: 22, debt: 1160000,
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
    bought: 14, attended: 24, debt: 4060000, transferDebt: 0,
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
    id: "s3", name: "Mimi", branch: "Hoàng Hoa Thám", classId: "c2",
    bought: 24, attended: 10, debt: 1450000,
    dob: "20/11/2016", gender: "Nữ", school: "Tiểu học Hoàng Hoa Thám",
    address: "120 Hoàng Hoa Thám, Ba Đình, Hà Nội", email: "",
    parentName: "Lê Minh Tâm", parentPhone: "0901 234 567",
    parentRelation: "Mẹ", parentEmail: "tam.le@gmail.com",
    enrolledAt: "05/03/2026", syllabusProgress: 6, syllabusTotal: 24,
    avgScore: 8.0, latestComment: "Chăm chỉ làm bài tập về nhà.",
  },
  {
    id: "s4", name: "Lại Thế Thái Dương", branch: "Ngọc Hà", classId: "c3",
    bought: 96, attended: 30, debt: 0,
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
    bought: 24, attended: 26, debt: 2900000,
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
    id: "c1", name: "4CLC1", schedule: "Thứ 3, 6", time: "18:00 - 19:30", branch: "Đội Cấn",
    teacher: "Cô Mai", room: "P.201", syllabus: "Family & Friends 1",
    startDate: "01/03/2026", endDate: "30/06/2026",
    totalSessions: 24, remainingSessions: 18, pricePerCourse: 3480000, pricePerSession: 145000,
    sessions: [
      { day: "Thứ 3", time: "18:30 - 19:30", room: "P.201" },
      { day: "Thứ 6", time: "19:00 - 20:30", room: "P.202" },
    ],
  },
  {
    id: "c2", name: "4CLC2", schedule: "Thứ 2, 4", time: "18:00 - 19:30", branch: "Hoàng Hoa Thám",
    teacher: "Thầy Hùng", room: "P.105", syllabus: "Family & Friends 1",
    startDate: "05/03/2026", endDate: "05/07/2026",
    totalSessions: 24, remainingSessions: 24, pricePerCourse: 3480000, pricePerSession: 145000,
    sessions: [
      { day: "Thứ 2", time: "18:00 - 19:30", room: "P.105" },
      { day: "Thứ 4", time: "18:00 - 19:30", room: "P.106" },
    ],
  },
  {
    id: "c3", name: "FF1 Kids", schedule: "Thứ 7, CN", time: "08:00 - 09:30", branch: "Ngọc Hà",
    teacher: "Cô Lan", room: "P.301", syllabus: "Family & Friends 1",
    startDate: "10/02/2026", endDate: "10/05/2026",
    totalSessions: 24, remainingSessions: 20, pricePerCourse: 3480000, pricePerSession: 145000,
    sessions: [
      { day: "Thứ 7",     time: "08:00 - 09:30", room: "P.301" },
      { day: "Chủ nhật",  time: "08:00 - 09:30", room: "P.302" },
    ],
  },
  {
    id: "c4", name: "4CLC3 (đang mở)", schedule: "Thứ 3, 5", time: "18:00 - 19:30", branch: "Đội Cấn",
    teacher: "Cô Mai", room: "P.203", syllabus: "Family & Friends 1",
    startDate: "15/03/2026", endDate: "15/06/2026",
    totalSessions: 24, remainingSessions: 22, pricePerCourse: 3480000, pricePerSession: 145000,
    sessions: [
      { day: "Thứ 3", time: "18:00 - 19:30", room: "P.203" },
      { day: "Thứ 5", time: "18:00 - 19:30", room: "P.203" },
    ],
  },
  {
    id: "c5", name: "FF2 Beginner", schedule: "Thứ 2, 6", time: "17:30 - 19:00", branch: "Hoàng Hoa Thám",
    teacher: "Thầy Hùng", room: "P.106", syllabus: "Family & Friends 2",
    startDate: "01/03/2026", endDate: "01/09/2026",
    totalSessions: 24, remainingSessions: 10, pricePerCourse: 3480000, pricePerSession: 145000,
    sessions: [
      { day: "Thứ 2", time: "17:30 - 19:00", room: "P.106" },
      { day: "Thứ 6", time: "17:30 - 19:00", room: "P.106" },
    ],
  },
  {
    id: "c6", name: "CLC4 Luyện thi", schedule: "Thứ 4, 7", time: "18:00 - 19:30", branch: "Ngọc Hà",
    teacher: "Cô Lan", room: "P.302", syllabus: "Luyện thi CLC lớp 4",
    startDate: "01/03/2026", endDate: "01/12/2026",
    totalSessions: 24, remainingSessions: 4, pricePerCourse: 3840000, pricePerSession: 160000,
    sessions: [
      { day: "Thứ 4", time: "18:00 - 19:30", room: "P.302" },
      { day: "Thứ 7", time: "09:30 - 11:00", room: "P.302" },
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
  { id: "syN5",  code: "JLPT-N5", name: "JLPT N5 Foundation",      level: "N5", ageGroup: "Người mới bắt đầu", totalLessons: 20, stages: 5, bigTests: 5, status: "Đang dùng", createdAt: "10/01/2025", createdBy: "Cô Mai",  description: "Lộ trình nền tảng JLPT N5: bảng chữ, từ vựng, ngữ pháp cơ bản và luyện đề." },
  { id: "syA1",  code: "GT-A1",   name: "Giao tiếp sơ cấp A1",     level: "A1", ageGroup: "Người đi làm",       totalLessons: 20, stages: 5, bigTests: 5, status: "Đang dùng", createdAt: "15/02/2025", createdBy: "Thầy Nam", description: "Giao tiếp tiếng Nhật sơ cấp theo tình huống đời sống và công sở." },
  { id: "syN4",  code: "JLPT-N4", name: "JLPT N4 Intensive",       level: "N4", ageGroup: "Đã học xong N5",     totalLessons: 20, stages: 5, bigTests: 5, status: "Bản nháp", createdAt: "05/03/2025", createdBy: "Cô Hà",   description: "Tăng tốc JLPT N4: ngữ pháp nâng cao, đọc hiểu, nghe hiểu và luyện đề." },
  { id: "sy01", code: "FF1",   name: "Family & Friends 1",      level: "Starter",      ageGroup: "Mẫu giáo - Lớp 1", totalLessons: 24, description: "Làm quen tiếng Anh qua bài hát, từ vựng cơ bản về gia đình, đồ vật." },
  { id: "sy02", code: "FF2",   name: "Family & Friends 2",      level: "Beginner",     ageGroup: "Lớp 2 - 3",         totalLessons: 24, description: "Mở rộng vốn từ, câu đơn giản, đọc hiểu đoạn ngắn." },
  { id: "sy03", code: "FF3",   name: "Family & Friends 3",      level: "Elementary",   ageGroup: "Lớp 3 - 4",         totalLessons: 24, description: "Ngữ pháp cơ bản: thì hiện tại, quá khứ đơn, kỹ năng viết câu." },
  { id: "sy04", code: "FF4",   name: "Family & Friends 4",      level: "Pre-Intermediate", ageGroup: "Lớp 4 - 5",     totalLessons: 24, description: "Phát triển 4 kỹ năng, luyện kể chuyện và mô tả." },
  { id: "sy05", code: "CLC4",  name: "Luyện thi CLC lớp 4",     level: "Intermediate", ageGroup: "Lớp 4",             totalLessons: 24, description: "Ôn luyện chuyên sâu cho kỳ thi vào lớp 6 CLC, đề mẫu các trường top." },
  { id: "sy06", code: "CLC5",  name: "Luyện thi CLC lớp 5",     level: "Intermediate", ageGroup: "Lớp 5",             totalLessons: 24, description: "Tăng tốc luyện đề, phản xạ nghe nói, viết đoạn 80-100 từ." },
  { id: "sy07", code: "SBS1",  name: "Solutions for Beginners", level: "Beginner",     ageGroup: "Lớp 6",             totalLessons: 24, description: "Chuyển tiếp tiểu học lên cấp 2, củng cố ngữ pháp nền tảng." },
  { id: "sy08", code: "MOV",   name: "Movers Practice",         level: "A1",           ageGroup: "Lớp 3 - 5",         totalLessons: 24, description: "Luyện thi chứng chỉ Cambridge Movers, full 3 kỹ năng." },
  { id: "sy09", code: "FLY",   name: "Flyers Practice",         level: "A2",           ageGroup: "Lớp 4 - 6",         totalLessons: 24, description: "Luyện thi Cambridge Flyers, chiến lược làm bài và mẹo nghe." },
  { id: "sy10", code: "KET",   name: "KET for Schools",         level: "A2",           ageGroup: "Lớp 6 - 7",         totalLessons: 24, description: "Luyện thi KET, kỹ năng viết email và đoạn văn ngắn." },
];

/* ===== Syllabus chi tiết (demo dùng chung cho mọi syllabus khi mở chi tiết) ===== */
export interface SyllabusLesson {
  id: string;
  index: number;
  unit: string;
  objective: string;
  content: string;
  homework: string;
  material: string;
  note: string;
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

const mkLessons = (prefix: string, units: { unit: string; objective: string; content: string; homework: string; note: string }[]): SyllabusLesson[] =>
  units.map((u, i) => ({
    id: `${prefix}-l${i + 1}`,
    index: i + 1,
    unit: u.unit,
    objective: u.objective,
    content: u.content,
    homework: u.homework,
    material: `https://drive.google.com/mock/${prefix}-unit-${String(i + 1).padStart(2, "0")}`,
    note: u.note,
  }));

export const SYLLABUS_STAGES: SyllabusStage[] = [
  {
    id: "st1", name: "Chặng 1: Làm quen tiếng Nhật cơ bản",
    goal: "Học viên nhận diện bảng chữ, phát âm chuẩn, viết được Hiragana và Katakana cơ bản.",
    lessons: mkLessons("s1", [
      { unit: "Hiragana cơ bản", objective: "Học viên nhận diện và viết được nhóm chữ Hiragana đầu tiên", content: "Giới thiệu bảng chữ cái, luyện phát âm, luyện viết từng hàng chữ", homework: "Viết mỗi chữ 5 dòng, học thuộc hàng あ・か・さ", note: "Giáo viên kiểm tra phát âm từng học viên" },
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
    classes: ["c2"],
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
    classes: ["c3"],
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
