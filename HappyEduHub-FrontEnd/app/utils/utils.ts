import { notify } from '@/components/Alert/Alert';
import { stat } from 'fs';
import store from '../libs/store';
import { RootState } from '../libs/store';
import { DayOfWeek } from './constant';
import { callApi, callUploadFile } from './api';
import { RoleType } from './constant';

export const getUserData = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const getRole = (user) => {
  const role = user?.role?.trim().toUpperCase();

  switch (role) {
    case 'STUDENT':
      return RoleType.STUDENT;
    case 'TEACHER':
      return RoleType.TEACHER;
    case 'ACADEMIC_AFFAIR':
      return RoleType.ACADEMIC_AFFAIR;
    case 'ADMIN':
      return RoleType.ADMIN;
    case 'KETOAN':
      return RoleType.KETOAN;
    case 'TROGIANG':
      return RoleType.TROGIANG;
    default:
      return RoleType.NULL;
  }
};

export const getCurrentUserRole = () => {
  const user = getUserData();
  const role = user?.role?.trim().toUpperCase();

  switch (role) {
    case 'STUDENT':
      return RoleType.STUDENT;
    case 'TEACHER':
      return RoleType.TEACHER;
    case 'ACADEMIC_AFFAIR':
      return RoleType.ACADEMIC_AFFAIR;
    case 'ADMIN':
      return RoleType.ADMIN;
    case 'KETOAN':
      return RoleType.KETOAN;
    case 'TROGIANG':
      return RoleType.TROGIANG;
    default:
      return RoleType.NULL;
  }
};

export const isLoading = (): boolean => {
  return !!localStorage.getItem('loading');
};

export const formattedDate = (dateString, format = 'dd/mm/yyyy') => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return format
    .replace('dd', day)
    .replace('mm', month)
    .replace('yyyy', String(year))
    .replace('yy', String(year).slice(-2));
};

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await callUploadFile(file);

    if (response?.web_view_link) {
      return response;
    } else {
      notify(`Lỗi upload file: ${file.name}`, 'error');
      return null;
    }
  } catch (error) {
    notify(`Lỗi upload file: ${file.name} - ${error.message}`, 'error');
    return null;
  }
};

export const processGoogleDriveLink = (driveLink) => {
  console.log('driveLink', driveLink);

  if (typeof driveLink !== 'string') {
    console.error('Invalid Google Drive link:', driveLink);
    return '';
  }

  const match = driveLink.match(/[-\w]{25,}/);

  return match
    ? `https://drive.google.com/thumbnail?id=${match[0]}&sz=w2000`
    : driveLink;
};

export const getShift = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const time = hours * 60 + minutes;

  const shifts = [
    { id: 1, start: 450, end: 540 }, // 7:30 - 9:00
    { id: 2, start: 570, end: 660 }, // 9:30 - 11:00
    { id: 3, start: 840, end: 930 }, // 14:00 - 15:30
    { id: 4, start: 945, end: 1035 }, // 15:45 - 17:15
    { id: 5, start: 1050, end: 1155 }, // 17:30 - 19:15
    { id: 6, start: 1170, end: 1290 }, // 19:30 - 21:30
  ];

  if (time < shifts[0].start) {
    return 0;
  }

  for (let i = 0; i < shifts.length; i++) {
    const { id, start, end } = shifts[i];
    if (time >= start && time <= end) {
      return id;
    }
    if (i < shifts.length - 1) {
      const nextStart = shifts[i + 1].start;
      if (time > end && time < nextStart) {
        return id + 0.5;
      }
    }
  }

  return 7;
};

export const getLessonStatus = (shift) => {
  console.log('status:', shift);
  const currentShift = getShift();
  console.log('status:', currentShift - shift);

  if (shift - currentShift == 0) {
    return {
      text: 'Đang diễn ra',
      color: 'success',
    };
  }

  if (currentShift - shift < 0.5) {
    return {
      text: 'Chưa diễn ra',
      color: 'secondary',
    };
  }

  if (shift - currentShift == 0.5) {
    return {
      text: 'Sắp diễn ra',
      color: 'teal',
    };
  }

  if (currentShift - shift >= 0.5) {
    return {
      text: 'Đã diễn ra',
      color: 'primary',
    };
  }

  return {
    text: 'Không xác định',
    color: 'secondary',
  };
};
