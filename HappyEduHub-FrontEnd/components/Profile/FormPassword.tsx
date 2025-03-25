'use client';
import React, { useState, useEffect } from 'react';
import { Modal } from 'flowbite-react';
import { callApi } from '@/app/utils/api';
import { notify } from '../Alert/Alert';
const ChangePasswordModal = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Mật khẩu mới không khớp');
      return;
    }

    try {
      setError('');

      await callApi('user/change-password', 'PUT', {
        old_password: passwords.currentPassword,
        password: passwords.newPassword,
        confirm_password: passwords.confirmPassword,
      });

      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      handleClose();
      notify('Thay đổi thông tin thành công', 'success');
    } catch (err: any) {
      notify('err.message', 'error');
    }
  };

  const handleClose = () => {
    setPasswords({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setError('');
    onClose();
  };

  useEffect(() => {
    if (show) {
      setError('');
    }
  }, [show]);

  return (
    <Modal show={show} onClose={onClose} className="rounded-sm overflow-hidden">
      <Modal.Header></Modal.Header>
      <Modal.Body>
        <div className="space-y-5 ">
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <label className="block">
            <span className="text-gray-700 font-bold text-medium pb-2 block">
              Mật khẩu hiện tại
            </span>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-sm px-4 py-2 text-black focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, currentPassword: e.target.value })
              }
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-bold text-medium pb-2 block">
              Mật khẩu mới
            </span>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-sm px-4 py-2 text-black focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-bold text-medium pb-2 block">
              Xác nhận mật khẩu
            </span>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-black focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
            />
          </label>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="border-2 font-bold rounded-sm border-[#4a6cf7] text-[#4a6cf7] px-4 py-2 shadow transition duration-300 hover:bg-[#4a6cf7] hover:text-white"
          onClick={handleSubmit}
        >
          Lưu
        </button>
        <button
          className="border-2 font-bold rounded-sm border-[#ff0000] text-[#ff0000] px-4 py-2 shadow transition duration-300 hover:bg-[#ff0000] hover:text-white"
          onClick={handleClose}
        >
          Hủy
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePasswordModal;
