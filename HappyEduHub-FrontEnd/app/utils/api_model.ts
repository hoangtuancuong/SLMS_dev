import { Grade, Subject } from './constant';

export type Course = {
  id: number;
  name: string;
  description: string;
  fee: number;
  start_date: Date;
  end_date: Date;
  is_approved: boolean;
  is_private: boolean;
  is_generated: boolean;
  code: string;
  created_at: Date;
  updated_at: Date;
  tags: Tag[];
  shifts: Shift[];
  teacher: {
    id: string;
    name: string;
    role: string | null;
    avatar_url: string | null;
    portfolio: string;
  } | null;
};

export type Tag = {
  id: number;
  name: Subject | Grade;
  type: 'SUBJECT' | 'GRADE';
};

export type Shift = {
  id: number;
  day: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  shift: 1 | 2 | 3 | 4 | 5;
  room: string | null;
};

export type Member = {
  id: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: Date;
  updated_at: Date;
  user: MemberUser;
  course: MemberCourse;
};

export type MemberUser = {
  id: number;
  name: string;
  role: 'TEACHER' | 'STUDENT';
  avatar_url: string | null;
};

export type MemberCourse = {
  id: number;
  name: string;
};
