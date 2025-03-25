import { Menu } from '@/types/menu';

const menuData: Menu[] = [
  {
    id: 1,
    title: 'Trang chủ',
    path: '/pages',
    newTab: false,
  },
  {
    id: 2,
    title: 'Giáo viên',
    path: '/pages/teacher',
    newTab: false,
  },
  {
    id: 33,
    title: 'Bài viết',
    path: '/pages/blog',
    newTab: false,
  },
  {
    id: 4,
    title: 'Khóa học',
    path: '/pages/course',
    newTab: true,
  },
  {
    id: 3,
    title: 'Quản lý',
    path: '/admin',
    newTab: false,
  },
];
export default menuData;
