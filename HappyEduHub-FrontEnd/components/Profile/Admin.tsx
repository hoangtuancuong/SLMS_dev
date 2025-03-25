'use client';
import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import EditUserInfoModal from './FormInfo';
import ChangePasswordModal from './FormPassword';
import { Spinner } from 'flowbite-react';
import { processGoogleDriveLink } from '@/app/utils/utils';
interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'ACADEMIC_AFFAIR';
  phone_number: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  date_of_birth: Date;
}

const AdminInfo = ({ userInfo }: { userInfo: UserInfo }) => {
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  useEffect(() => {}, [openInfoModal]);
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 p-8 mt-10">
      {/* Cột bên trái */}
      <div className="w-1/3 space-y-6 flex flex-col">
        {/* Ô Avatar */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-sm p-6 text-center">
          <div className="relative inline-block group">
            <img
              src={
                processGoogleDriveLink(userInfo?.avatar_url) ||
                '/images/default.png'
              }
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 dark:border-blue-500 shadow-md"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 rounded-full flex items-center justify-center transition-opacity">
              <EditIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-80 transition-opacity" />
            </div>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
            {userInfo?.name}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{'Quản Trị Viên'}</p>
        </div>

        {/* Ô Thông tin cá nhân */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-sm p-6 ">
          <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-white mb-4">
            Thông tin cá nhân
          </h3>
          <div className="font-bold py-3 text-gray-700">Thông tin Email</div>
          <div className="border-b py-1 text-gray-700">
            {userInfo?.email || 'N/A'}
          </div>
          <div className="font-bold py-3 text-gray-700">Số điện thoại</div>
          <div className="border-b py-1 text-gray-700">
            {userInfo?.phone_number || 'Chưa có thông tin'}
          </div>
          <div className="font-bold py-3 text-gray-700">Ngày sinh</div>
          <div className="border-b py-1 text-gray-700">
            {userInfo?.date_of_birth
              ? new Date(userInfo.date_of_birth).toLocaleDateString()
              : 'Chưa có thông tin'}
          </div>

          {/* Nút mở modal */}
          <div className="mt-6 flex space-x-4 font-bold">
            <button
              className="border-2 rounded-sm border-[#4a6cf7] text-[#4a6cf7] px-4 py-2 shadow transition duration-300 hover:bg-[#4a6cf7] hover:text-white"
              onClick={() => setOpenInfoModal(true)}
            >
              Đổi thông tin
            </button>
            <button
              className="border-2 rounded-sm border-[#9d00ff] text-[#9d00ff] px-4 py-2 shadow transition duration-300 hover:bg-[#9d00ff] hover:text-white"
              onClick={() => setOpenPasswordModal(true)}
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>

      {/* Cột bên phải: Lịch học */}
      <div className="w-2/3 bg-white dark:bg-gray-800 shadow-sm p-8 ml-8 rounded-sm flex-grow">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
          Lịch học
        </h2>
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <Spinner aria-label="Extra large spinner example" size="xl" />
        </div>
      </div>

      <EditUserInfoModal
        show={openInfoModal}
        onClose={() => setOpenInfoModal(false)}
        userInfo={userInfo}
      />
      <ChangePasswordModal
        show={openPasswordModal}
        onClose={() => setOpenPasswordModal(false)}
      />
    </div>
  );
};

export default AdminInfo;
