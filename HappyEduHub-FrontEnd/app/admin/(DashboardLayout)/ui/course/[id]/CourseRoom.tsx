import { Avatar, Badge, Button, Card } from 'flowbite-react';
import {
  Grade,
  gradeBadgeColors,
  RoleType,
  shiftDay,
  shiftName,
  statusBadge,
  Subject,
  subjectBadgeColors,
} from '@/app/utils/constant';
import { Skeleton, Tooltip } from '@mui/material';
import { formattedDate, processGoogleDriveLink } from '@/app/utils/utils';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import LessonAlterModal from '../Component/LessonAlterModal';
import { callApi } from '@/app/utils/api';
import { notify } from '@/components/Alert/Alert';

const CourseRoom = (props: any) => {
  const { course, role } = props;
  const [isAlterModalOpen, setIsAlterModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isRoom, setIsRoom] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const subjectTag = course?.tags?.find((tag: any) => tag.type === 'SUBJECT');
  const gradeTag = course?.tags?.find((tag: any) => tag.type === 'GRADE');
  const subjectName = subjectTag?.name as Subject;
  const gradeName = gradeTag?.name as Grade;

  const handleAlterDate = async (data) => {
    setLoading(true);

    const status = data.isRoom ? 'ROOM_ALTERED' : 'DATE_ALTERED';
    let body = {};

    if (data.isRoom) {
      body = {
        room: data.room,
      };
    } else {
      body = {
        shift: data.shift,
        take_place_at: data.date,
      };
    }

    try {
      await callApi(`courses/${course.id}/shifts/${selectedLesson}/assign-room`, 'POST', body);
      notify(
        data.isRoom ? 'Gán phòng học thành công' : 'Đổi lịch học thành công',
        'success'
      );
    } catch (error) {
      console.error('Có lỗi', error);
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAlterModalOpen = (id, isRoom) => {
    setSelectedLesson(id);
    setIsRoom(isRoom);
    setIsAlterModalOpen(true);
  };
  const handleAlterModalClose = () => setIsAlterModalOpen(false);

  if (!course)
    return (
      <Card>
        <Skeleton variant="rectangular" width="100%" height={100} />
        <Skeleton variant="rectangular" width="100%" height={100} />
        <Skeleton variant="rectangular" width="100%" height={100} />
      </Card>
    );

  return (
    <>
      {course.shifts.map((item, index) => (
        <div
          key={index}
          className="relative bg-white pb-3 pt-2 px-6 rounded-xl w-full my-4 shadow-xl border border-dashed border-primary transition-all duration-300 hover:-translate-y-2 hover:border-double"
        >
          <Tooltip title="Gán phòng học" placement="top">
            <button
              onClick={() => handleAlterModalOpen(item.id, true)}
              type="button"
              className="absolute top-2 right-1 transition-all duration-200 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm p-1.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.2em"
                height="1.2em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 2c-4.4 0-8 3.6-8 8c0 5.4 7 11.5 7.3 11.8c.2.1.5.2.7.2s.5-.1.7-.2C13 21.5 20 15.4 20 10c0-4.4-3.6-8-8-8m0 17.7c-2.1-2-6-6.3-6-9.7c0-3.3 2.7-6 6-6s6 2.7 6 6s-3.9 7.7-6 9.7M12 6c-2.2 0-4 1.8-4 4s1.8 4 4 4s4-1.8 4-4s-1.8-4-4-4m0 6c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2"
                />
              </svg>
              <span className="ml-1">Gán phòng học</span>
            </button>
          </Tooltip>

          <div className="mt-2">
            <p className="text-xl font-semibold my-2 text-blue-500">
              Thông tin buổi học
            </p>
            <div className="flex flex-wrap gap-2 text-gray-400 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div className="flex flex-wrap gap-1">
                <Badge color="pink">{item.room}</Badge>
                <Badge color="indigo">Cơ sở 1</Badge>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-gray-400 text-sm my-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div className="flex flex-wrap gap-1">
                <Badge color="purple">{shiftDay[item.day]}</Badge>
                <Badge color="pink">Ca {item.shift}</Badge>
              </div>
            </div>
            <div className="border-t-2"></div>

            <div className="flex justify-between">
              <div className="my-2">
                <p className="font-semibold text-base mb-2 text-blue-500">
                  Người dạy
                </p>
                {course.teacher.name}
              </div>
              <div className="my-2">
                <p className="font-semibold text-base mb-2 text-blue-500 text-end">
                  Trạng thái
                </p>
                <div className="text-base text-gray-400 font-semibold">
                  <div className="flex space-x-2">
                    {item.room && (
                      <Badge color={'success'}>Đã được gán phòng</Badge>
                    )}
                    {!item.room && (
                      <Badge color={'warning'}>Cần được gán phòng</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <LessonAlterModal
        onClose={handleAlterModalClose}
        openModal={isAlterModalOpen}
        onSubmit={handleAlterDate}
        isRoom={isRoom}
      ></LessonAlterModal>
    </>
  );
};

export default CourseRoom;
