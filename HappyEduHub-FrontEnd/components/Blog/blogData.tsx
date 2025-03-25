import { Blog } from '@/types/blog';

const blogData: Blog[] = [
  {
    id: 1,
    title: 'Kiến thức về bất đẳng thức',
    content:
      'Bất đẳng thức là một phần kiến thức nâng cao quan trọng với việc đạt được điểm tuyệt đối',
    thumbnail_url: '/images/blog/blog-01.jpg',
    author: {
      name: 'Phạm Thảo',
      avatar_url: '/images/blog/author-01.png',
      role: 'Giáo viên',
    },
    tags: ['Số học'],
    publishDate: '2025',
    createdAt: '',
    is_approved: false,
    updatedAt: '',
  },
  {
    id: 2,
    title: '9 cách giải các bài toán hình học không gian',
    content:
      '9 cách giải bài toán hình học không gian sẽ cung cấp hướng giải cho các bài toán thường gặp trong các kì thi',
    thumbnail_url: '/images/blog/blog-02.jpg',
    author: {
      name: 'Trần Tuấn',
      avatar_url: '/images/blog/author-02.png',
      role: 'Giáo viên',
    },
    tags: ['Hình học'],
    publishDate: '2025',
    createdAt: '',
    is_approved: false,
    updatedAt: '',
  },
  {
    id: 3,
    title: 'Các bài toán xác xuất',
    content:
      'Các bài toán xác xuất thống kê thường là các bài toán lập công thức đòi hỏi sự hiểu biết về thực tế trong cuộc sống',
    thumbnail_url: '/images/blog/blog-03.jpg',
    author: {
      name: 'Lê Hải',
      avatar_url: '/images/blog/author-03.png',
      role: 'Giáo viên',
    },
    tags: ['Số học'],
    publishDate: '2025',
    createdAt: '',
    is_approved: false,
    updatedAt: '',
  },
];
export default blogData;
