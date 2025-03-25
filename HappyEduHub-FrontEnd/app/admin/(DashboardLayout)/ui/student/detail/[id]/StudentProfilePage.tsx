'use client';
import { useState, useEffect, useMemo } from 'react';
import { callApi } from '@/app/utils/api';
import { Badge } from 'flowbite-react';
import Image from 'next/image';
import {
  getCurrentUserRole,
  getUserData,
  processGoogleDriveLink,
} from '@/app/utils/utils';
import { RoleType } from '@/app/utils/constant';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';
import TabPanel from '@/app/admin/components/dashboard/TabPanel';

const OverviewTab = ({ student }) => {
  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Thông tin học sinh
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-lg">📧</span>
          <span>
            <strong>Email:</strong> {student.email}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg">📞</span>
          <span>
            <strong>Số điện thoại:</strong>{' '}
            {student.phone_number ?? 'Chưa cập nhật'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg">🎂</span>
          <span>
            <strong>Ngày sinh:</strong>{' '}
            {new Date(student.date_of_birth).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg">🏠</span>
          <span>
            <strong>Địa chỉ:</strong> {student.address ?? 'Chưa cập nhật'}
          </span>
        </div>

        {student.additional_student_data && (
          <>
            <div className="flex items-center gap-3">
              <span className="text-lg">🏫</span>
              <span>
                <strong>Trường:</strong>{' '}
                {student.additional_student_data.school ?? 'Chưa cập nhật'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">📚</span>
              <span>
                <strong>Lớp:</strong>{' '}
                {student.additional_student_data.class ?? 'Chưa cập nhật'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">🆔</span>
              <span>
                <strong>CCCD:</strong>{' '}
                {student.additional_student_data.cccd ?? 'Chưa cập nhật'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">👨‍👩‍👦</span>
              <span>
                <strong>Người liên hệ:</strong>{' '}
                {student.additional_student_data.first_contact_name ??
                  'Chưa cập nhật'}
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

// const CareerTab = ({ teacher }) => {
//   return (
//     <div>
//       <h2 className="text-xl font-semibold mb-4">Sự nghiệp</h2>
//       <div className="space-y-4">
//         {teacher.additional_teacher_data.portfolio.career.map((item, index) => (
//           <div
//             key={index}
//             className="p-4 bg-gray-100 rounded-lg transition duration-300 hover:bg-blue-600 hover:text-white"
//           >
//             <p className="font-semibold">{item.role} - {item.school}</p>
//             <p>{item.start_year} - {item.end_year || 'Hiện tại'}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const AchievementsTab = ({ teacher }) => {
//   return (
//     <div>
//       <h2 className="text-xl font-semibold mb-4">Thành tích</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {teacher.additional_teacher_data.portfolio.achievements.map((item, index) => (
//           <div
//             key={index}
//             className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
//           >
//             <div className="flex items-center gap-3">
//               <span className="text-2xl">🎖</span>
//               <h3 className="text-lg font-medium">{item.name}</h3>
//             </div>
//             <p className="mt-2 text-gray-600">{item.desc}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const GalleryTab = ({ teacher }) => {
//   return (
//     <div>
//       <h2 className="text-xl font-semibold mb-4">Hình ảnh</h2>
//       {teacher.additional_teacher_data.portfolio.gallery.length > 0 ? (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {teacher.additional_teacher_data.portfolio.gallery.map((img, index) => (
//             <div
//               key={index}
//               className="cursor-pointer group"
//             >
//               <Image
//                 src={processGoogleDriveLink(img)}
//                 alt={`Gallery Image ${index + 1}`}
//                 width={200}
//                 height={150}
//                 className="rounded-md shadow-md object-cover w-full h-[150px] group-hover:scale-105 transition-transform duration-300"
//               />
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-600">Chưa có hình ảnh.</p>
//       )}
//     </div>
//   );
// };

const StudentProfilePage = ({ id }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setLoading] = useState(false);
  const [student, setStudent] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    date_of_birth: '',
    role: 'TEACHER',
    avatar_url: '',
    is_thaiphien: false,
    gender: 'MALE',
    address: '',
    additional_teacher_data: {
      subject: {
        name: '',
      },
      portfolio: {
        hero_image: '',
        hoc_ham: '',
        school: [],
        start_teaching_year: '',
        bio: '',
        teaching_philosophy: '',
        achievements: [],
        career: [],
        gallery: [],
        teaching_grades: [],
      },
    },
  });

  const tabs = [
    {
      key: 'overview',
      title: 'Tổng quan',
      icon: <HomeIcon fontSize="small" />,
      component: <OverviewTab student={student} />,
    },
    // { key: 'career', title: 'Sự nghiệp', icon: <WorkIcon fontSize="small" />, component: <CareerTab teacher={teacher} /> },
    // { key: 'achievements', title: 'Thành tích', icon: <EmojiEventsIcon fontSize="small" />, component: <AchievementsTab teacher={teacher} /> },
    // { key: 'gallery', title: 'Hình ảnh', icon: <PhotoCameraIcon fontSize="small" />, component: <GalleryTab teacher={teacher} /> },
  ];

  useEffect(() => {
    const fetchStudentData = async () => {
      const role = getCurrentUserRole();
      const endpoint = role == RoleType.STUDENT ? 'user/my-info' : `user/${id}`;

      try {
        const response = await callApi(endpoint, 'GET');
        setStudent(response);
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  return (
    <div className="p-6">
      <div className="relative w-full h-64 rounded-lg overflow-hidden mb-6">
        <Image
          src="/images/bg_detail.jpg"
          alt="Student cover"
          layout="fill"
          objectFit="cover"
          className="transition-all duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end">
          <div className="relative w-24 h-24 rounded-sm overflow-hidden border-2 border-white mr-4">
            <Image
              src={
                processGoogleDriveLink(student.avatar_url) ||
                '/images/default_avatar.jpg'
              }
              layout="fill"
              objectFit="cover"
              alt="Avatar"
            />
          </div>
          <div className="text-white">
            <h1 className="text-3xl font-bold text-white">{student.name}</h1>
            <div className="flex items-center mt-2">
              <Badge color="success">Học sinh</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto">
        <TabPanel
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          rightButton={{
            icon: <EditIcon />,
            text: 'Chỉnh sửa thông tin',
            href: `/admin/ui/student/update/${id}`,
          }}
        />

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          {tabs.find((tab) => tab.key === activeTab)?.component}
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
