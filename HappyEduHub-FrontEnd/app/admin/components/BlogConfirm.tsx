import { Modal } from 'flowbite-react';
import React from 'react';
import { callApi } from '@/app/utils/api';
import { notify } from '@/components/Alert/Alert';

const DeleteConfirmModal = ({ isOpen, onClose, id }) => {
  const handleDelete = async () => {
    try {
      await callApi(`blogs/${id}`, 'DELETE');
      notify('Xóa bài viết thành công', 'success');
      onClose();
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>Xác nhận xóa</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            Bạn có chắc chắn muốn xóa bài viết này không?
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={handleDelete}
        >
          Xóa
        </button>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 ml-2"
          onClick={onClose}
        >
          Hủy
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmModal;
