import React, { useState, useEffect } from 'react';
import { Modal } from 'flowbite-react';
import { callApi } from '@/app/utils/api';
import { notify } from '../Alert/Alert';
interface UserInfo {
  name: string;
  email: string;
  phone_number: string;
  date_of_birth: Date;
}

interface EditUserInfoModalProps {
  show: boolean;
  onClose: () => void;
  userInfo: UserInfo;
}

const EditUserInfoModal: React.FC<EditUserInfoModalProps> = ({
  show,
  onClose,
  userInfo,
}) => {
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(userInfo);

  const handleSubmit = async () => {
    if (!userData.date_of_birth || !userData.name || !userData.phone_number) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      await callApi('user/update', 'PUT', {
        name: userData.name,
        phone_number: userData.phone_number,
        date_of_birth: userData.date_of_birth,
      });
      handleClose();
      notify('Thay đổi thông tin thành công', 'success');
      window.location.reload();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };
  const handleClose = () => {
    setUserData(userInfo);
    setError('');
    onClose();
  };
  useEffect(() => {
    setUserData(userInfo);
  }, [userInfo]);

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header className=""></Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <label className="block">
            <span className="text-gray-700 text-medium font-bold block pb-3">
              Họ và tên
            </span>
            <input
              type="text"
              className="w-full border text-black border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />
          </label>

          <label className="block">
            <span className="text-gray-700 text-md font-bold  block pb-3">
              Số điện thoại
            </span>
            <input
              type="tel"
              className="w-full border text-black border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={userData.phone_number}
              onChange={(e) =>
                setUserData({ ...userData, phone_number: e.target.value })
              }
            />
          </label>
          <label className="block">
            <span className="text-gray-700 text-md font-bold block pb-3">
              Ngày sinh
            </span>
            <input
              type="date"
              className="w-full border text-black border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={
                userData.date_of_birth
                  ? new Date(userData.date_of_birth).toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) =>
                setUserData({
                  ...userData,
                  date_of_birth: new Date(e.target.value), // Chuyển về kiểu Date
                })
              }
            />
          </label>
        </div>
      </Modal.Body>
      <Modal.Footer className="">
        <button
          onClick={handleSubmit}
          className="border-2 font-bold rounded-sm border-[#4a6cf7] text-[#4a6cf7] px-4 py-2 shadow transition duration-300 hover:bg-[#4a6cf7] hover:text-white"
        >
          Lưu
        </button>
        <button
          onClick={onClose}
          className="border-2 font-bold rounded-sm border-[#ff0000] text-[#ff0000] px-4 py-2 shadow transition duration-300 hover:bg-[#ff0000] hover:text-white"
        >
          Hủy
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserInfoModal;
