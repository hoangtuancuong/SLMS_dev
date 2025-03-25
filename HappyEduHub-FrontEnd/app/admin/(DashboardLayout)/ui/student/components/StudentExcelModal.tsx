import { Table, Badge, Dropdown } from 'flowbite-react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { Icon } from '@iconify/react';

const StudentExcelModal = ({ isOpen, onClose, studentData, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="relative w-full max-w-5xl p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between pb-4 border-b border-gray-300">
          <h3 className="text-2xl font-bold">
            Xác nhận các học sinh được nhập
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✖
          </button>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-y-scroll max-h-[60vh] shadow shadow-md shadow-blue-200">
          <Table hoverable>
            <Table.Head className="bg-blue-500 text-white">
              <Table.HeadCell>#</Table.HeadCell>
              <Table.HeadCell>Họ tên</Table.HeadCell>
              <Table.HeadCell>Lớp</Table.HeadCell>
              <Table.HeadCell>Trường</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>SĐT Phụ Huynh</Table.HeadCell>
              <Table.HeadCell>Địa chỉ</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y divide-gray-200">
              {studentData.student_data.map((student, index) => (
                <Table.Row key={index} className="hover:bg-blue-50 transition">
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell className="font-medium">
                    {student.name}
                  </Table.Cell>
                  <Table.Cell>{student.class}</Table.Cell>
                  <Table.Cell>{student.school}</Table.Cell>
                  <Table.Cell className="text-blue-500">
                    {student.email}
                  </Table.Cell>
                  <Table.Cell>{student.first_contact_tel}</Table.Cell>
                  <Table.Cell>{student.address}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition"
          >
            Đóng
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition"
          >
            Xác nhận Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentExcelModal;
