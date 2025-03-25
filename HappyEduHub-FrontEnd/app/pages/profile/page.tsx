'use client';
import React from 'react';
import { callApi } from '@/app/utils/api';
import { useState, useEffect } from 'react';
import { notify } from '@/components/Alert/Alert';
import StudentInfo from '@/components/Profile/Student';
import TeacherInfo from '@/components/Profile/Teacher';
import AcademicAffairInfo from '@/components/Profile/AcademicAffair';
import AdminInfo from '@/components/Profile/Admin';
interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'ACADEMIC_AFFAIR';
  phone_number: string | null;
  date_of_birth: Date | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  additional_data: string;
}
const Profile = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await callApi('user/my-info', 'GET');
        const data = response;
        setUserInfo(await data);
      } catch (err) {
        console.error('Error fetching user info:', err);
        notify('Không tìm thấy thông tin người dùng', 'error');
      }
    };

    fetchUserInfo();
  }, []);

  const renderContentByRole = () => {
    if (!userInfo) return null;

    switch (userInfo.role) {
      case 'ADMIN':
        return <AdminInfo userInfo={userInfo} />;
      case 'TEACHER':
        return <TeacherInfo userInfo={userInfo} />;
      case 'STUDENT':
        return <StudentInfo userInfo={userInfo} />;
      case 'ACADEMIC_AFFAIR':
        return <AcademicAffairInfo userInfo={userInfo} />;
      default:
        return (
          <div className="text-center">
            <p>Không thể hiển thị nội dung cho vai trò này</p>
          </div>
        );
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">{renderContentByRole()}</div>
    </div>
  );
};

export default Profile;
