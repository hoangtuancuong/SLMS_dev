'use client';
import { Modal, Button } from 'flowbite-react';
import {
  HiOutlineExclamationCircle,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineCheckCircle,
} from 'react-icons/hi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  type: string;
}

const getModalContent = (type: string) => {
  switch (type) {
    case 'delete':
      return {
        title: 'Xác nhận xóa',
        content: 'Bạn có chắc chắn muốn xóa không?',
        confirmText: 'Xóa',
        confirmColor: 'failure',
        icon: HiOutlineTrash,
      };
    case 'edit':
      return {
        title: 'Xác nhận chỉnh sửa',
        content: 'Bạn có chắc chắn muốn lưu thay đổi không?',
        confirmText: 'Lưu',
        confirmColor: 'blue',
        icon: HiOutlinePencil,
      };
    case 'cancel':
      return {
        title: 'Hủy thao tác',
        content: 'Bạn có chắc chắn muốn hủy?',
        confirmText: 'Hủy',
        confirmColor: 'warning',
        icon: HiOutlineExclamationCircle,
      };
    case 'approved':
      return {
        title: 'Duyệt bài viết',
        content: 'Bạn có chắc chắn muốn thực hiện hành động này?',
        confirmText: 'Xác nhận',
        confirmColor: 'success',
        icon: HiOutlineCheckCircle,
      };
    case 'approvedCourse':
      return {
        title: 'Duyệt khóa học',
        content: 'Bạn có chắc chắn muốn thực hiện hành động này?',
        confirmText: 'Xác nhận',
        confirmColor: 'success',
        icon: HiOutlineCheckCircle,
      };
    default:
      return {
        title: 'Thông báo',
        content: 'Bạn có chắc chắn muốn thực hiện hành động này?',
        confirmText: 'Xác nhận',
        confirmColor: 'gray',
        icon: HiOutlineExclamationCircle,
      };
  }
};

export function ConfirmModal({ isOpen, onClose, onConfirm, type }: ModalProps) {
  const {
    title,
    content,
    confirmText,
    confirmColor,
    icon: Icon,
  } = getModalContent(type);

  return (
    <Modal show={isOpen} size="md" onClose={onClose} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <Icon className={`mx-auto mb-4 h-14 w-14  dark:text-gray-200`} />
          <h3 className="mb-5 text-lg font-semibold text-gray-700 dark:text-gray-300">
            {title}
          </h3>
          <p className="mb-5 text-base text-gray-500 dark:text-gray-400">
            {content}
          </p>
          <div className="flex justify-center gap-4">
            {onConfirm && (
              <Button
                className="rounded-sm"
                color={confirmColor as any}
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            )}
            <Button className="rounded-sm" color="gray" onClick={onClose}>
              Hủy
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
