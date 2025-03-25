export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
  role?: RoleType[];
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
}

import { RoleType } from '@/app/utils/constant';
import { uniqueId } from 'lodash';

const SidebarContent: MenuItem[] = [
  {
    heading: '',
    children: [
      // {
      //   name: 'Bàn làm việc',
      //   icon: 'solar:widget-add-line-duotone',
      //   id: uniqueId(),
      //   url: '/admin',
      //   role: [RoleType.ADMIN],
      // },
      {
        name: 'Trang chủ',
        icon: 'solar:home-outline',
        id: uniqueId(),
        url: '/pages',
      },
      {
        name: 'Thống kê',
        icon: 'solar:chart-2-linear',
        id: uniqueId(),
        url: '/admin/ui/thong-ke',
        role: [RoleType.KETOAN, RoleType.ADMIN],
      },
    ],
  },
  {
    heading: 'Học sinh',
    children: [
      {
        name: 'Dashboard',
        icon: 'solar:widget-add-line-duotone',
        id: uniqueId(),
        url: '/admin/ui/student/dashboard',
        role: [RoleType.STUDENT],
      },
      {
        name: 'Thông tin bản thân',
        icon: 'solar:book-bookmark-outline',
        id: uniqueId(),
        url: '/admin/ui/student/detail/0',
        role: [RoleType.STUDENT],
      },
    ],
  },
  {
    heading: 'Giáo viên',
    children: [
      {
        name: 'Dashboard',
        icon: 'solar:widget-add-line-duotone',
        id: uniqueId(),
        url: '/admin/ui/teacher/dashboard',
        role: [RoleType.TEACHER],
      },
      {
        name: 'Thông tin bản thân',
        icon: 'solar:book-bookmark-outline',
        id: uniqueId(),
        url: '/admin/ui/teacher/detail/0',
        role: [RoleType.TEACHER],
      },
    ],
  },
  {
    heading: 'Giáo vụ',
    children: [
      {
        name: 'Dashboard',
        icon: 'solar:widget-add-line-duotone',
        id: uniqueId(),
        url: '/admin/ui/academic-affair/dashboard',
        role: [RoleType.ACADEMIC_AFFAIR, RoleType.ADMIN],
      },
      {
        name: 'Duyệt học sinh',
        icon: 'solar:bill-check-bold',
        id: uniqueId(),
        url: '/admin/ui/academic-affair/enroll',
        role: [RoleType.ACADEMIC_AFFAIR, RoleType.ADMIN],
      },
    ],
  },
  {
    heading: "Chương trình giảng dạy",
    children: [
      {
        name: 'Tài nguyên dạy học',
        icon: 'solar:file-check-broken',
        id: uniqueId(),
        url: '/admin/ui/test/exam',
        role: [RoleType.ACADEMIC_AFFAIR, RoleType.ADMIN, RoleType.TEACHER],
      }
    ]
  },
  {
    heading: 'Khóa học',
    children: [
      {
        name: 'Điểm danh',
        icon: 'solar:list-bold',
        id: uniqueId(),
        url: '/admin/ui/academic-affair/roll-call',
        role: [RoleType.ADMIN, RoleType.TROGIANG],
      },
      {
        name: 'Danh sách khóa học',
        icon: 'solar:book-bookmark-outline',
        id: uniqueId(),
        url: '/admin/ui/course',
        role: [RoleType.ADMIN,  RoleType.ACADEMIC_AFFAIR, RoleType.KETOAN, RoleType.TROGIANG],
      },
      // {
      //   name: 'Phê duyệt khóa học',
      //   icon: 'solar:file-check-broken',
      //   id: uniqueId(),
      //   url: '/admin/ui/course/approve',
      //   role: [RoleType.ADMIN, RoleType.TEACHER, RoleType.ACADEMIC_AFFAIR],
      // },
    ],
  },
  {
    heading: 'Bài viết',
    children: [
      {
        name: 'Danh sách blog',
        icon: 'solar:hamburger-menu-line-duotone',
        id: uniqueId(),
        url: '/admin/ui/blog',
        role: [RoleType.ADMIN, RoleType.TEACHER, RoleType.ACADEMIC_AFFAIR],
      },
      {
        name: 'Phê duyệt blog',
        icon: 'solar:archive-minimalistic-linear',
        id: uniqueId(),
        url: '/admin/ui/blog/approve',
        role: [RoleType.ADMIN,  RoleType.ACADEMIC_AFFAIR],
      }
    ],
  },
  {
    heading: 'Quản lý giáo viên',
    children: [
      {
        name: 'Danh sách giáo viên',
        icon: 'solar:book-bookmark-outline',
        id: uniqueId(),
        url: '/admin/ui/teacher',
        role: [RoleType.ADMIN, RoleType.ACADEMIC_AFFAIR],
      }
    ],
  },
  {
    heading: 'Quản lý học sinh',
    children: [
      {
        name: 'Danh sách học sinh',
        icon: 'solar:user-outline',
        id: uniqueId(),
        url: '/admin/ui/student',
        role: [RoleType.ADMIN, RoleType.ACADEMIC_AFFAIR],
      }
    ],
  // },
  // {
  //   heading: 'Utilities',
  //   children: [
  //     {
  //       name: 'Typography',
  //       icon: 'solar:text-circle-outline',
  //       id: uniqueId(),
  //       url: '/admin/ui/typography',
  //       role: [RoleType.ADMIN],
  //     },
  //     {
  //       name: 'Table',
  //       icon: 'solar:bedside-table-3-linear',
  //       id: uniqueId(),
  //       url: '/admin/ui/table',
  //       role: [RoleType.ADMIN],
  //     },
  //     {
  //       name: 'Form',
  //       icon: 'solar:password-minimalistic-outline',
  //       id: uniqueId(),
  //       url: '/admin/ui/form',
  //       role: [RoleType.ADMIN],
  //     },
  //     {
  //       name: 'Shadow',
  //       icon: 'solar:airbuds-case-charge-outline',
  //       id: uniqueId(),
  //       url: '/admin/ui/shadow',
  //       role: [RoleType.ADMIN],
  //     },
  //   ],
  // },
  // {
  //   heading: 'Extra',
  //   children: [
  //     {
  //       name: 'Icons',
  //       icon: 'solar:smile-circle-outline',
  //       id: uniqueId(),
  //       url: '/admin/icons/solar',
  //       role: [RoleType.ADMIN],
  //     },
  //     {
  //       name: 'Sample Page',
  //       icon: 'solar:notes-minimalistic-outline',
  //       id: uniqueId(),
  //       url: '/admin/sample-page',
  //       role: [RoleType.ADMIN],
  //     },
    // ],
  },
];

export default SidebarContent;
