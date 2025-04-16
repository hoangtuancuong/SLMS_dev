import { Avatar, Badge, Button, Card } from 'flowbite-react';
import {
  Grade,
  gradeBadgeColors,
  RoleType,
  roomData,
  shiftDay,
  shiftName,
  statusBadge,
  Subject,
  subjectBadgeColors,
  timeSlotMap,
} from '@/app/utils/constant';
import { Skeleton, Tooltip } from '@mui/material';
import {
  formattedDate,
  getLessonStatus,
  processGoogleDriveLink,
} from '@/app/utils/utils';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { callApi } from '@/app/utils/api';
import { notify } from '@/components/Alert/Alert';
import LessonAlterModal from '../../course/Component/LessonAlterModal';
import StudentModal from './StudentModal';
import BlogSpinner from '@/app/admin/components/dashboard/BlogSpinner';
import { Mode } from '@mui/icons-material';
import StudentRollCallModal from './StudentRollCallModal';

const Lessons = (props: any) => {
  const { lessons } = props;
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentData, setStudents] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [rollcall, setRollCall] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [mode, setMode] = useState(0);

  const handleRollCall = async (selectedStudents) => {
    setIsStudentModalOpen(false);
    setLoading(true);
    selectedStudents.map(async (student_id, index) => {
      try {
        const studentInfo = studentData.find(
          (student) => student.id == student_id
        );
        const body = {
          lesson_id: selectedLesson,
          user_id: student_id,
          status: 'ABSENT',
          note: '',
        };
        const response = await callApi('rollcall', 'POST', body);
        notify(
          `Đánh dấu học sinh vắng thành công`,
          'success'
        );
        console.log(studentInfo)
        setLoading(false);
      } catch (error) {
        setLoading(false);
        notify(error.message, 'error');
      }
    });
  };

  const handleModifyRollCall = async (selectedRollcall, status) => {
    setIsStudentModalOpen(false);
    setLoading(true);
    selectedRollcall.map(async (student_id, index) => {
      try {
        const studentInfo = studentData.find(
          (student) => student.id == student_id
        );
        const body = {
          status: status,
          note: '',
        };
        const response = await callApi(`rollcall/${student_id}`, 'PUT', body);
        notify(
          `Đánh dấu muộn thành công`,
          'success'
        );
        setLoading(false);
      } catch (error) {
        setLoading(false);
        notify(error.message, 'error');
      }
    });
  };

  const handleStudentModalOpen = async (course_id, id, mode) => {
    setLoading(true);
    setMode(mode);

    try {
      setSelectedLesson(id);

      let res = await callApi(
        `courses/${course_id}/members?limit=${100}`
      );
      if (mode == 1) {
        res = await callApi(
          `rollcall/lesson/${id}`
        );
      }
      const response = res
      if (mode == 0) {
        setStudents(response.data);
      } else {
        setRollCall(response)
      }
    } catch (error) {
      notify('Có lỗi xảy ra', 'error');
      setLoading(false);
    } finally {
      setLoading(false);
    }
    setIsStudentModalOpen(true);
  };

  const handleStudentModalClose = () => setIsStudentModalOpen(false);

  if (!lessons)
    return (
      <Card>
        <Skeleton variant="rectangular" width="100%" height={100} />
        <Skeleton variant="rectangular" width="100%" height={100} />
        <Skeleton variant="rectangular" width="100%" height={100} />
      </Card>
    );

  return (
    <>
      <BlogSpinner isLoading={isLoading}></BlogSpinner>
      {lessons.map((item, index) => (
        <div
          key={index}
          className="relative bg-white pb-3 pt-2 px-6 rounded-xl w-full my-4 shadow-xl border border-dashed border-primary transition-all duration-300 hover:-translate-y-2 hover:border-double"
        >
          <div className="absolute top-3 right-3 flex gap-x-2">
            <Tooltip title="Gán phòng học" placement="top">
              <button
                onClick={() =>
                  handleStudentModalOpen(item.course_id, item.id, 1)
                }
                type="button"
                className="transition-all duration-200 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm p-1.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M20 4H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1M4 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3zm2 5h2v2H6zm5 0a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2zm-3 4H6v2h2zm2 1a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1m-2 3H6v2h2zm2 1a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1"
                    clip-rule="evenodd"
                  />
                </svg>
                <span className="ml-1">Danh sách vắng</span>
              </button>
            </Tooltip>

            <Tooltip title="Gán phòng học" placement="top">
              <button
                onClick={() =>
                  handleStudentModalOpen(item.course_id, item.id, 0)
                }
                type="button"
                className="transition-all duration-200 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm p-1.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
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
                <span className="ml-1">Điểm danh</span>
              </button>
            </Tooltip>
          </div>

          <div className="mt-2">
            <p className="text-xl font-semibold my-2 text-blue-500">
              {item?.course?.code} - {item?.course?.name}
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
                <Badge color="blue">{`Tầng ${roomData[item.room]?.floor}`} {`- Phòng ${roomData[item.room]?.room}`}</Badge>
                <Badge color="indigo">Cơ sở {roomData[item.room]?.campus}</Badge>
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
                <Badge color="pink">{timeSlotMap[item.shift]}</Badge>
              </div>
            </div>
            <div className="border-t-2"></div>

            <div className="flex justify-between">
              <div className="my-2">
                <p className="font-semibold text-base mb-2 text-blue-500">
                  Người dạy
                </p>
                {item?.course?.members[0]?.name}
              </div>
              <div className="my-2">
                <p className="font-semibold text-base mb-2 text-blue-500 text-end">
                  Trạng thái
                </p>
                <div className="text-base text-gray-400 font-semibold">
                  <div className="flex space-x-2">
                    <Badge color={getLessonStatus(item.shift).color}>
                      {getLessonStatus(item.shift).text}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <StudentModal
        onClose={handleStudentModalClose}
        isOpen={isStudentModalOpen && mode == 0}
        studentData={studentData}
        onConfirm={handleRollCall}
        mode={mode}
      ></StudentModal>

      <StudentRollCallModal
        onClose={handleStudentModalClose}
        isOpen={isStudentModalOpen && mode == 1}
        studentData={rollcall}
        onConfirm={handleModifyRollCall}
        mode={mode}
      ></StudentRollCallModal>
    </>
  );
};

export default Lessons;
