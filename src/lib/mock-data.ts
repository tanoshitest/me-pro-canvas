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
  transferNote?: string;
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
  pricePerCourse: number;
  pricePerSession: number;
}

export interface Receipt {
  id: string;
  studentId: string;
  studentName: string;
  branch: Branch;
  amount: number;
  method: "Tiền mặt" | "Chuyển khoản" | "POS";
  status: "Hiệu lực" | "Đã hủy";
  createdBy: string;
  createdAt: string;
  note?: string;
  cancelLog?: { by: string; at: string; reason: string };
}

export const STUDENTS: Student[] = [
  { id: "s1", name: "Hồng Diệp", nickname: "Kirito", branch: "Đội Cấn", classId: "c1", bought: 48, attended: 22, debt: 0 },
  { id: "s2", name: "Đăng Khoa", nickname: "Bing", branch: "Đội Cấn", classId: "c1", bought: 24, attended: 20, debt: 500000 },
  { id: "s3", name: "Mimi", branch: "Hoàng Hoa Thám", classId: "c2", bought: 24, attended: 10, debt: 0 },
  { id: "s4", name: "Lại Thế Thái Dương", branch: "Ngọc Hà", classId: "c3", bought: 96, attended: 30, debt: 0 },
  { id: "s5", name: "Nguyễn Ngọc Linh", branch: "Đội Cấn", classId: "c1", bought: 24, attended: 23, debt: 200000 },
];

export const CLASSES: ClassRoom[] = [
  {
    id: "c1", name: "4CLC1", schedule: "Thứ 3, 6", time: "18:00 - 19:30", branch: "Đội Cấn",
    teacher: "Cô Mai", room: "P.201", syllabus: "Family & Friends 1",
    startDate: "01/03/2026", endDate: "30/06/2026",
    totalSessions: 24, pricePerCourse: 3480000, pricePerSession: 145000,
  },
  {
    id: "c2", name: "4CLC2", schedule: "Thứ 2, 4", time: "18:00 - 19:30", branch: "Hoàng Hoa Thám",
    teacher: "Thầy Hùng", room: "P.105", syllabus: "Family & Friends 1",
    startDate: "05/03/2026", endDate: "05/07/2026",
    totalSessions: 24, pricePerCourse: 3480000, pricePerSession: 145000,
  },
  {
    id: "c3", name: "FF1 Kids", schedule: "Thứ 7, CN", time: "08:00 - 09:30", branch: "Ngọc Hà",
    teacher: "Cô Lan", room: "P.301", syllabus: "Family & Friends 1",
    startDate: "10/02/2026", endDate: "10/05/2026",
    totalSessions: 24, pricePerCourse: 3480000, pricePerSession: 145000,
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
  { id: "HH-000045", studentId: "s3", studentName: "Mimi", branch: "Hoàng Hoa Thám", amount: 3480000, method: "POS", status: "Hiệu lực", createdBy: "Admin Hà", createdAt: "06/03/2026" },
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

export const SYLLABUS_LESSONS = [
  { id: "l1", title: "Buổi 1: Hello! My name is...", vocab: "hello, name, I, you", grammar: "What's your name? — My name is...", material: "SB p.4-5, WB p.2", classwork: "Role-play giới thiệu bản thân", homework: "WB p.3, học thuộc lời chào" },
  { id: "l2", title: "Buổi 2: My family", vocab: "mum, dad, brother, sister", grammar: "This is my...", material: "SB p.6-7", classwork: "Vẽ cây gia đình", homework: "Tô màu trang 4 WB" },
  { id: "l3", title: "Buổi 3: My toys", vocab: "ball, doll, car, teddy", grammar: "I have a...", material: "SB p.8-9", classwork: "Đếm đồ chơi", homework: "WB p.5" },
  { id: "l4", title: "Buổi 4: Colors & Shapes", vocab: "red, blue, circle, square", grammar: "It's a red ball.", material: "SB p.10-11", classwork: "Phân loại theo màu", homework: "WB p.6" },
  { id: "l5", title: "Buổi 5: Food I like", vocab: "apple, banana, rice, milk", grammar: "I like / I don't like", material: "SB p.12-13", classwork: "Hỏi đáp về thức ăn", homework: "WB p.7" },
];

export const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(Math.round(n)) + " VNĐ";