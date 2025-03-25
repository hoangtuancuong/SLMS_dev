export const enum TagType {
  SUBJECT = 0,
  GRADE = 1,
}
export const enum GradeType {
  SUBJECT ='SUBJECT',
  GRADE = 'GRADE',
}

 export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6}
export const enum RoleType {
  STUDENT = 'Học sinh',
  TEACHER = 'Giáo viên',
  ACADEMIC_AFFAIR = 'Admin thường',
  ADMIN = 'Admin tổng',
  KETOAN = 'Kế toán',
  TROGIANG = 'Trợ giảng',
  NULL = 'Không rõ',
}

export const StudySession = {
  1: "Sáng - Ca 1 ",
  2: "Sáng - Ca 2",
  3: "Chiều - Ca 1",
  4: "Chiều - Ca 2",
  5: "Chiều - Ca 3",
  6: "Chiều - Ca 4",
};




export const enum SortType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const enum ActionType {
  UPDATE = 'update',
  DELETE = 'delete',
  DETAIL = 'detail',
  NOTE = 'note',
  MANAGE_CLASS = 'manage_class',
}

export const enum Subject {
  MATH = 'Toán học',
  PHYSICS = 'Vật lý',
  CHEMISTRY = 'Hóa học',
  LITERATURE = 'Văn học',
  ENGLISH = 'Tiếng Anh',
  BIOLOGY = 'Sinh học',
  INFORMATICS = 'Tin học',
  ART = 'Mỹ thuật',
  HISTORY = 'Lịch sử',
}

export const enum CourseMemberStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export const enum ExamType {
  ASSIGNMENT = 'ASSIGNMENT',
  ENTRY_EXAM = 'ENTRY_EXAM',
  TAILIEU = 'TAILIEU'
}

export const enum AssignmentType {
  TEST = 'TEST',
  EXCERCISE = 'EXCERCISE',
  TAILIEU = 'TAILIEU'
}

export const subjectBadgeColors = {
  [Subject.MATH]: 'success',
  [Subject.PHYSICS]: 'success',
  [Subject.CHEMISTRY]: 'red',
  [Subject.LITERATURE]: 'purple',
  [Subject.ENGLISH]: 'pink',
  [Subject.BIOLOGY]: 'indigo',
  [Subject.INFORMATICS]: 'failure',
  [Subject.ART]: 'success',
  [Subject.HISTORY]: 'teal',
};

export const courseMemberStatusBadgeColors = {
  [CourseMemberStatus.APPROVED]: 'lightsuccess',
  [CourseMemberStatus.PENDING]: 'lightwarning',
  [CourseMemberStatus.REJECTED]: 'lighterror',
};

export const enum Grade {
  GRADE_6 = 'Lớp 6',
  GRADE_7 = 'Lớp 7',
  GRADE_8 = 'Lớp 8',
  GRADE_9 = 'Lớp 9',
  GRADE_10 = 'Lớp 10',
  GRADE_11 = 'Lớp 11',
  GRADE_12 = 'Lớp 12',
}

export const gradeBadgeColors = {
  [Grade.GRADE_6]: 'teal',
  [Grade.GRADE_7]: 'success',
  [Grade.GRADE_8]: 'warning',
  [Grade.GRADE_9]: 'purple',
  [Grade.GRADE_10]: 'pink',
  [Grade.GRADE_11]: 'indigo',
  [Grade.GRADE_12]: 'failure',
};

export const shiftName = [
  '',
  'Sáng Ca 1',
  'Sáng Ca 2',
  'Chiều Ca 1',
  'Chiều Ca 2',
  'Chiều Ca 3',
  'Chiều Ca 4',
];

export const shiftDay = [
  '',
  'Chủ nhật',
  'Thứ hai',
  'Thứ ba',
  'Thứ tư',
  'Thứ năm',
  'Thứ sáu',
  'Thứ bảy',
];

export const roomData = {
  T1_CS1: { floor: 1, campus: 1, room: null },
  T2_CS1: { floor: 2, campus: 1, room: null },
  T3_CS1: { floor: 3, campus: 1, room: null },
  T1_CS2: { floor: 1, campus: 2, room: null },
  T2P1_CS2: { floor: 2, campus: 2, room: 1 },
  T2P2_CS2: { floor: 2, campus: 2, room: 2 },
  T3P1_CS2: { floor: 3, campus: 2, room: 1 },
  T3P2_CS2: { floor: 3, campus: 2, room: 2 },
  T4_CS2: { floor: 4, campus: 2, room: null },
};

export const timeSlotMap = {
  '1': 'Sáng - Ca 1',
  '2': 'Sáng - Ca 2',
  '3': 'Chiều - Ca 1',
  '4': 'Chiều - Ca 2',
  '5': 'Chiều - Ca 3',
  '6': 'Chiều - Ca 4',
};

export const SubjectData = [
  {
    id: 1,
    image: '/images/course/math.png',
    code_fragment: 'TH',
    name: 'Toán',
  },
  {
    id: 2,
    image: '/images/course/physics.png',
    code_fragment: 'VL',
    name: 'Lý',
  },
  {
    id: 3,
    image: '/images/course/chemistry.png',
    code_fragment: 'HH',
    name: 'Hóa',
  },
  {
    id: 4,
    image: '/images/course/literature.png',
    code_fragment: 'VH',
    name: 'Văn',
  },
  {
    id: 5,
    image: '/images/course/english.png',
    code_fragment: 'TA',
    name: 'Anh',
  },
  {
    id: 6,
    image: '/images/course/biology.png',
    code_fragment: 'SH',
    name: 'Sinh',
  },
  {
    id: 7,
    image: '/images/course/informatics.png',
    code_fragment: 'TI',
    name: 'Tin',
  },
  {
    id: 8,
    image: '/images/course/art.png',
    code_fragment: 'MT',
    name: 'Mỹ thuật',
  },
  {
    id: 16,
    image: '/images/course/history.png',
    code_fragment: 'LS',
    name: 'Lịch sử',
  },
];

export const statusLesson = {
  NORMAL: 'Bình thường',
  DATE_ALTERED: 'Dời lịch',
  ROOM_ALTERED: 'Đổi phòng',
  SHIFT_ALTERED: 'Chuyển ca',
  CANCELLED: 'Huỷ buổi học',
};

export const statusBadge = {
    "NORMAL": "success",
    "DATE_ALTERED": "pink",
    "ROOM_ALTERED": "teal",
    "SHIFT_ALTERED": "indigo",
    "CANCELLED": "warning"
}

export const examTypeBadge = {
  [ExamType.ASSIGNMENT]: 'teal',
  [ExamType.ENTRY_EXAM]: 'indigo',
  [ExamType.TAILIEU]: 'pink'
}

export const assignmentTypeBadge = {
  [AssignmentType.TEST]: 'teal',
  [AssignmentType.EXCERCISE]: 'indigo',
  [AssignmentType.TAILIEU]: 'pink',
}

