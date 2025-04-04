import { useState } from 'react';
import { Table } from 'flowbite-react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StudentExcelModal = ({
  isOpen,
  onClose,
  studentData,
  onConfirm,
  mode,
}) => {
  const [selectedStudents, setSelectedStudents] = useState([]);

  if (!isOpen) return null;

  const toggleSelectAll = () => {
    if (selectedStudents.length === studentData.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(studentData.map((student) => student.user.id));
    }
  };

  const toggleSelectStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="relative w-full max-w-5xl p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between pb-4 border-b border-gray-300">
          <h3 className="text-2xl font-bold">
            {mode == 0 && `Điểm danh học sinh`}
            {mode == 1 && `Danh sách học sinh vắng`}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✖
          </button>
        </div>

        <div className="mt-4 overflow-x-auto max-h-[60vh]">
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
              {studentData?.map((student, index) => (
                <Table.Row
                  key={student.user.id}
                  className={`hover:bg-blue-50 transition cursor-pointer ${selectedStudents.includes(student.user.id) ? 'bg-blue-200' : ''}`}
                  onClick={() => toggleSelectStudent(student.user.id)}
                >
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell className="font-medium flex items-center justify-between">
                    {student.user.name}
                    {selectedStudents.includes(student.user.id) && (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>{student.user.class}</Table.Cell>
                  <Table.Cell>{student.user.school}</Table.Cell>
                  <Table.Cell className="text-blue-500">
                    {student.user.email}
                  </Table.Cell>
                  <Table.Cell>{student.user.first_contact_tel}</Table.Cell>
                  <Table.Cell>{student.user.address}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition"
          >
            Đóng
          </button>
          <button
            onClick={toggleSelectAll}
            className="px-6 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition"
          >
            Chọn hết
          </button>
          <button
            onClick={() => onConfirm(selectedStudents)}
            className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition"
            disabled={selectedStudents.length === 0}
          >
            {mode == 0 && `Đánh dấu vắng (${selectedStudents.length})`}
            {mode == 1 && `Đánh dấu muộn (${selectedStudents.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentExcelModal;
