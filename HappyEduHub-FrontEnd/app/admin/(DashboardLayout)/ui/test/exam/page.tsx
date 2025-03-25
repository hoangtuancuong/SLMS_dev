'use client';

import { HiOutlineDotsVertical } from 'react-icons/hi';
import BlogSpinner from '@/app/admin/components/dashboard/BlogSpinner';
import Header from '@/app/admin/components/dashboard/Header';
import { callApi } from '@/app/utils/api';
import { ExamType, examTypeBadge, RoleType } from '@/app/utils/constant';
import { notify } from '@/components/Alert/Alert';
import { TeacherAnchor } from '@/components/Course/TeacherAnchor';
import { Icon } from '@iconify/react';
import { Badge, Button, Dropdown, Table } from 'flowbite-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { getCurrentUserRole } from '@/app/utils/utils';
import AddExamModal from './AddExamModal';

export default function Exam() {
  const [isLoading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);
  const limit = 10;
  const [offset, setOffset] = useState(0);

  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const examResponse = await callApi('exam/get-all', 'GET', null, {
        limit,
        offset,
      });
      const allTeachersIds = Array.from(
        new Set(examResponse.data.map((exam) => exam.teacher_id))
      );
      const teachers = await Promise.all(
        allTeachersIds.map(async (teacherId) => {
          const teacherResponse = await callApi(
            `user/${teacherId}`,
            'GET',
            null,
            null
          );
          return teacherResponse;
        })
      );
      const finalExams = examResponse.data.map((exam) => {
        const teacher = teachers.find(
          (teacher) => teacher.id === exam.teacher_id
        );
        return { ...exam, teacher: teacher };
      });
      setExams(finalExams);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [limit, offset]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses, limit, offset]);

  const handlePagination = (direction) => {
    if (direction === 'next') {
      setOffset(offset + limit);
    } else if (direction === 'prev' && offset > 0) {
      setOffset(offset - limit);
    }
  };

  const handleDelete = async (id) => {
    try {
      await callApi(`exam/${id}`, 'DELETE', null, null);
      setExams(exams.filter((exam) => exam.id !== id));
      notify('Xoá đề kiểm tra thành công', 'success');
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  return (
    <div className="rounded-lg dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
      <div className="flex justify-between items-center">
        <Header
          className="inline"
          icon="solar:file-check-bold"
          title="Danh sách "
        />
        <Button color="success" onClick={() => setIsAddExamModalOpen(true)}>
          <Icon icon="solar:add-circle-outline" />
          Thêm tài nguyên
        </Button>
      </div>

      <div className="mt-3">
        <BlogSpinner isLoading={isLoading}></BlogSpinner>
        <div className="flex gap-3 mb-4">
          {/* <TextInput
            name="name"
            placeholder="Tìm kiếm theo tên"
            onChange={handleFilterChange}
            value={filter.name}
            className="w-1/4"
          />
          <TextInput
            name="from_start_date"
            type="date"
            onChange={handleFilterChange}
            value={filter.from_start_date}
            className="w-1/4"
          />
          <TextInput
            name="to_start_date"
            type="date"
            onChange={handleFilterChange}
            value={filter.to_start_date}
            className="w-1/4"
          />
          <Button onClick={() => setOffset(0)}>Lọc</Button> */}
        </div>

        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Tên</Table.HeadCell>
              <Table.HeadCell>File đề</Table.HeadCell>
              <Table.HeadCell>Giảng viên tạo đề</Table.HeadCell>
              <Table.HeadCell>Loại đề</Table.HeadCell>
              {getCurrentUserRole() === RoleType.ADMIN && (
                <Table.HeadCell>Thao tác</Table.HeadCell>
              )}
            </Table.Head>
            <Table.Body className="divide-y divide-border dark:divide-darkborder">
              {exams.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Link
                      href={`/admin/ui/test/exam/${item.id}`}
                      className="hover:text-primary"
                    >
                      <h5 className="text-sm text-wrap font-bold">
                        {item.name}
                      </h5>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      href={item.drive_url ?? '#'}
                      className="!text-primary underline flex gap-1 items-center"
                      target="_blank"
                    >
                      <Icon className="text-lg" icon="logos:google-drive" />
                      <span className="text-sm">Google Drive</span>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <TeacherAnchor teacher={item.teacher}></TeacherAnchor>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={examTypeBadge[item.exam_type]} size={'small'}>
                      {item.exam_type === ExamType.ASSIGNMENT
                        ? 'Bài Tập'
                        : (item.exam_type === ExamType.ENTRY_EXAM?"Kiểm tra đầu vào":"Tài liệu")}
                    </Badge>
                  </Table.Cell>
                  {getCurrentUserRole() === RoleType.ADMIN && (
                    <Table.Cell>
                      <Icon
                        icon="solar:trash-bin-minimalistic-outline"
                        height={18}
                      />
                    </Table.Cell>
                  )}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <div className="mt-4 flex justify-between">
          <Button
            className="text-primary"
            onClick={() => handlePagination('prev')}
            disabled={offset === 0}
          >
            Trang trước
          </Button>
          <Button
            className="text-primary"
            onClick={() => handlePagination('next')}
            disabled={exams.length < limit}
          >
            Trang sau
          </Button>
        </div>
      </div>
      <AddExamModal
        isOpen={isAddExamModalOpen}
        onClose={() => setIsAddExamModalOpen(false)}
        reloadData={fetchCourses}
      />
    </div>
  );
}
