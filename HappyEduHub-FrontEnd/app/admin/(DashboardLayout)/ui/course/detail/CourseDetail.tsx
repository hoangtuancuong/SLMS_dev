'use client';
import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, TextInput, Label } from 'flowbite-react';
import { HiOutlinePlus } from 'react-icons/hi';
import { callApi } from '@/app/utils/api';

const CourseDetails = ({ courseId }) => {
  const [isLoading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    due_date: '',
  });
  const [newDocument, setNewDocument] = useState({ title: '', url: '' });

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);

      const { data } = await callApi(`courses/${courseId}`, 'GET');
      console.log(data);
      setTimeout(() => {
        setCourse({
          title: 'Khóa học React',
          instructor: { name: 'Giảng viên A', role: 'Giảng viên chính' },
          start_date: '2025-02-01',
          description:
            'Khóa học này sẽ giúp bạn hiểu về React từ cơ bản đến nâng cao.',
        });

        setStudents([
          {
            name: 'Học sinh 1',
            email: 'student1@example.com',
            status: 'Đã tham gia',
          },
          {
            name: 'Học sinh 2',
            email: 'student2@example.com',
            status: 'Chưa tham gia',
          },
          {
            name: 'Học sinh 3',
            email: 'student3@example.com',
            status: 'Đã tham gia',
          },
        ]);

        setAssignments([
          { id: 1, title: 'Bài tập 1', due_date: '2025-02-10' },
          { id: 2, title: 'Bài tập 2', due_date: '2025-02-15' },
        ]);

        setDocuments([
          { title: 'Tài liệu 1', url: 'https://example.com/doc1.pdf' },
          { title: 'Tài liệu 2', url: 'https://example.com/doc2.pdf' },
        ]);

        setLoading(false);
      }, 1000);
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleAddAssignment = () => {
    if (newAssignment.title && newAssignment.due_date) {
      setAssignments([...assignments, { id: Date.now(), ...newAssignment }]);
      setNewAssignment({ title: '', due_date: '' });
      setShowAddAssignmentModal(false);
    }
  };

  const handleAddDocument = () => {
    if (newDocument.title && newDocument.url) {
      setDocuments([...documents, newDocument]);
      setNewDocument({ title: '', url: '' });
      setShowAddDocumentModal(false);
    }
  };

  if (isLoading || !course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-4">
          <h4 className="text-2xl font-bold">Danh sách học sinh</h4>
          <Table striped>
            <Table.Head>
              <Table.HeadCell>Tên</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Trạng thái</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {students.map((student, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{student.name}</Table.Cell>
                  <Table.Cell>{student.email}</Table.Cell>
                  <Table.Cell>{student.status}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-2xl font-bold">Bài tập</h4>
            <Button
              size="sm"
              color="blue"
              onClick={() => setShowAddAssignmentModal(true)}
            >
              <HiOutlinePlus className="mr-1" /> Thêm bài tập
            </Button>
          </div>

          <Table striped>
            <Table.Head>
              <Table.HeadCell>Tiêu đề</Table.HeadCell>
              <Table.HeadCell>Hạn nộp</Table.HeadCell>
              <Table.HeadCell>Hành động</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {assignments.map((assignment) => (
                <Table.Row key={assignment.id}>
                  <Table.Cell>{assignment.title}</Table.Cell>
                  <Table.Cell>{assignment.due_date}</Table.Cell>
                  <Table.Cell>
                    <Button
                      size="xs"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                      }}
                    >
                      Giao bài tập
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-4">
          <h4 className="text-xl font-bold">Thông tin khóa học</h4>
          <p>
            <strong>Giảng viên:</strong> {course.instructor.name}
          </p>
          <p>
            <strong>Vai trò:</strong> {course.instructor.role}
          </p>
          <p>
            <strong>Ngày khai giảng:</strong> {course.start_date}
          </p>
          <p>{course.description}</p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-bold">Tài liệu</h4>
            <Button
              size="sm"
              color="blue"
              onClick={() => setShowAddDocumentModal(true)}
            >
              <HiOutlinePlus className="mr-1" /> Thêm tài liệu
            </Button>
          </div>

          <Table striped>
            <Table.Head>
              <Table.HeadCell>Tiêu đề</Table.HeadCell>
              <Table.HeadCell>Liên kết</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {documents.map((doc, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{doc.title}</Table.Cell>
                  <Table.Cell>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Xem tài liệu
                    </a>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>

      <Modal
        show={showAddAssignmentModal}
        onClose={() => setShowAddAssignmentModal(false)}
      >
        <Modal.Header>Thêm bài tập mới</Modal.Header>
        <Modal.Body>
          <Label>Tiêu đề bài tập</Label>
          <TextInput
            placeholder="Nhập tiêu đề"
            value={newAssignment.title}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, title: e.target.value })
            }
            className="mb-2"
          />
          <Label>Hạn nộp</Label>
          <TextInput
            type="date"
            value={newAssignment.due_date}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, due_date: e.target.value })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAddAssignment}>Thêm bài tập</Button>
          <Button color="gray" onClick={() => setShowAddAssignmentModal(false)}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAddDocumentModal}
        onClose={() => setShowAddDocumentModal(false)}
      >
        <Modal.Header>Thêm tài liệu mới</Modal.Header>
        <Modal.Body>
          <Label>Tiêu đề tài liệu</Label>
          <TextInput
            placeholder="Nhập tiêu đề"
            value={newDocument.title}
            onChange={(e) =>
              setNewDocument({ ...newDocument, title: e.target.value })
            }
            className="mb-2"
          />
          <Label>Liên kết tài liệu</Label>
          <TextInput
            placeholder="Nhập URL"
            value={newDocument.url}
            onChange={(e) =>
              setNewDocument({ ...newDocument, url: e.target.value })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAddDocument}>Thêm tài liệu</Button>
          <Button color="gray" onClick={() => setShowAddDocumentModal(false)}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CourseDetails;
