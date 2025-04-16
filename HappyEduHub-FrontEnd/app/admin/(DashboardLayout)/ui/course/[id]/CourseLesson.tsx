import BlogSpinner from '@/app/admin/components/dashboard/BlogSpinner';
import { callApi } from '@/app/utils/api';
import { notify } from '@/components/Alert/Alert';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formattedDate, getCurrentUserRole } from '@/app/utils/utils';
import { Badge } from 'flowbite-react';
import { ConfirmModal } from '@/app/admin/components/dashboard/ConfirmModal';
import { Tooltip } from '@mui/material';
import LessonAlterModal from '../Component/LessonAlterModal';
import { RoleType, statusBadge, statusLesson } from '@/app/utils/constant';

const CourseLesson = ({ course }) => {
  const [lesson, setLesson] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isAlterModalOpen, setIsAlterModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isRoom, setIsRoom] = useState(false);

  const openLinkInNewTab = (url) => {
    if (url && typeof url === 'string') {
        window.open(url, '_blank');
    } else {
        console.error('URL không hợp lệ');
    }
  }

  async function fetchLessonData() {
    try {
      setLoading(true);
      const response = await callApi(`courses/${course.id}/lessons`);

      setLesson(response);
      setLoading(false);
    } catch (error) {
      notify(error.message, 'error');
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLessonData();
  }, []);

  const handleOpenCancelModal = (id) => {
    setSelectedLesson(id);
    setIsCancelModalOpen(true);
  };

  const handleCancel = async () => {
    try {
      await callApi(`lessons/${selectedLesson}/cancel`, 'POST');
      notify('Huỷ buổi học thành công', 'success');
      await fetchLessonData();
    } catch (error) {
      console.error('Có lỗi', error);
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAlterDate = async (data) => {
    setLoading(true);

    const status = data.isRoom ? 'ROOM_ALTERED' : 'DATE_ALTERED';
    let body = {};

    if (data.isRoom) {
      body = {
        room: data.room,
        status: status,
      };
    } else {
      body = {
        shift: data.shift,
        take_place_at: data.date,
      };
    }

    try {
      await callApi(`lessons/${selectedLesson}`, 'PUT', body);
      notify(
        data.isRoom ? 'Chuyển phòng học thành công' : 'Đổi lịch học thành công',
        'success'
      );
      await fetchLessonData();
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

  const handleCreateZoom = async (id, course) => {
    try {
      setLoading(true)
      const body = {
        "topic": course.name,
        "type": 3,
        "start_time": new Date(),
        "duration": "120",
      };
      const zoom = await callApi("zoom/create-meeting", "POST", body)
      const body_put = zoom.start_url + "|" + zoom.join_url;
      await callApi(`lessons/${id}`, "PUT", {
        "note": body_put,
        "status": "NORMAL"
      })

      fetchLessonData();
      setLoading(false);
      notify("Đã tạo link zoom thành công", "success")
    } catch (error) {
      notify("Có lỗi xảy ra", "error");
    }
  }

  return (
    <>
      <BlogSpinner isLoading={isLoading} />
      {lesson.length == 0 && !isLoading && (
        <div className="w-full flex justify-center items-center mt-4">
          <Image
            alt="Không thấy dữ liệu"
            src="/images/no_data.jpg"
            width="500"
            height="500"
          ></Image>
        </div>
      )}
      <div className="w-full flex justify-evenly flex-wrap gap-4 items-center max-h-[55vh] overflow-auto">
        {lesson.map((item, index) => {
          return (
            <div
              key={index}
              className="relative bg-white pb-3 pt-2 px-6 rounded-xl w-full sm:w-1/2 max-w-md my-4 shadow-xl border border-dashed border-primary transition-all duration-300 hover:-translate-y-2 hover:border-double"
            >
              {
                ((getCurrentUserRole() !== RoleType.STUDENT) && (
                  <><Tooltip title="Huỷ buổi học" placement="top">
                    <button
                      type="button"
                      onClick={() => handleOpenCancelModal(item.id)}
                      className="absolute top-2 right-2 transition-all duration-200 text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm p-1.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.2em"
                        height="1.2em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-width="1.5"
                          d="m14 8l-4 4m0-4l4 4m-6.5 3.5H9m7.5 0H12M21 7v-.63c0-1.193 0-1.79-.158-2.27a3.05 3.05 0 0 0-1.881-1.937C18.493 2 17.914 2 16.755 2h-9.51c-1.159 0-1.738 0-2.206.163a3.05 3.05 0 0 0-1.881 1.936C3 4.581 3 5.177 3 6.37V15m18-4v9.374c0 .858-.985 1.314-1.608.744a.946.946 0 0 0-1.284 0l-.483.442a1.657 1.657 0 0 1-2.25 0a1.657 1.657 0 0 0-2.25 0a1.657 1.657 0 0 1-2.25 0a1.657 1.657 0 0 0-2.25 0a1.657 1.657 0 0 1-2.25 0l-.483-.442a.946.946 0 0 0-1.284 0c-.623.57-1.608.114-1.608-.744V19" />
                      </svg>
                    </button>
                  </Tooltip><Tooltip title="Dời buổi học" placement="top">
                      <button
                        onClick={() => handleAlterModalOpen(item.id, false)}
                        type="button"
                        className="absolute top-2 right-11 transition-all duration-200 text-orange-700 border border-orange-700 hover:bg-orange-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm p-1.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
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
                            d="M9.944 2.25h4.112c1.838 0 3.294 0 4.433.153c1.172.158 2.121.49 2.87 1.238c.748.749 1.08 1.698 1.238 2.87c.153 1.14.153 2.595.153 4.433V13a.75.75 0 0 1-1.5 0v-.25H2.75V13c0 1.907.002 3.262.14 4.29c.135 1.005.389 1.585.812 2.008s1.003.677 2.009.812c1.028.138 2.382.14 4.289.14h3a.75.75 0 0 1 0 1.5H9.944c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433v-2.112c0-1.838 0-3.294.153-4.433c.158-1.172.49-2.121 1.238-2.87c.749-.748 1.698-1.08 2.87-1.238c1.14-.153 2.595-.153 4.433-.153m-7.194 9h18.5V11c0-1.907-.002-3.261-.14-4.29c-.135-1.005-.389-1.585-.812-2.008s-1.003-.677-2.009-.812c-1.027-.138-2.382-.14-4.289-.14h-4c-1.907 0-3.261.002-4.29.14c-1.005.135-1.585.389-2.008.812S3.025 5.705 2.89 6.71c-.138 1.029-.14 2.383-.14 4.29zM6 5.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2A.75.75 0 0 1 6 5.75m3 0a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2A.75.75 0 0 1 9 5.75m3.75 1.75a.75.75 0 0 1 .75-.75H18a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75m2.179 9.253c.389-1.497 1.924-2.503 3.576-2.503c1.277 0 2.44.58 3.106 1.515a.75.75 0 1 1-1.222.87c-.36-.505-1.048-.885-1.884-.885c-.967 0-1.687.482-2 1.08a.75.75 0 0 1 .15 1.24l-.583.5a.75.75 0 0 1-.976 0l-.584-.5a.75.75 0 0 1 .417-1.317M6 14.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75m3 0a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75m11.928 2.68a.75.75 0 0 1 .976 0l.584.5a.75.75 0 0 1-.417 1.317c-.389 1.497-1.924 2.503-3.576 2.503c-1.277 0-2.44-.58-3.106-1.515a.75.75 0 1 1 1.222-.87c.36.505 1.048.885 1.884.885c.967 0 1.687-.482 2-1.08a.75.75 0 0 1-.15-1.24z"
                            clip-rule="evenodd" />
                        </svg>
                      </button>
                    </Tooltip></>
                ))
              }

              {
                (!item.note && (getCurrentUserRole() === RoleType.ADMIN || getCurrentUserRole() === RoleType.ACADEMIC_AFFAIR || getCurrentUserRole() === RoleType.TROGIANG)) && 
                  (<Tooltip title="Tạo Zoom" placement="top">
                    <button
                      onClick={() => handleCreateZoom(item.id, course)}
                      type="button"
                      className="absolute top-2 right-20 transition-all duration-200 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm p-1.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="#338df2" d="M20 12a8 8 0 1 1-16 0a8 8 0 0 1 16 0" opacity="0.5"/><path fill="#338df2" d="M19.009 6.784a.75.75 0 0 0-.138-1.494q-.637.06-1.345.2a.75.75 0 0 0-.472.309l1.117 1.097q.444-.075.838-.112"/><path fill="#338df2" fill-rule="evenodd" d="M20.937 5.38a.75.75 0 1 0-.346 1.459c.394.093.546.232.602.322c.063.102.133.366-.157.948a.75.75 0 0 0 1.343.67c.378-.759.563-1.65.086-2.413c-.344-.55-.923-.843-1.528-.987m-.225 5.581a.75.75 0 1 0-1.065-1.057c-.686.692-1.567 1.43-2.608 2.171a.75.75 0 0 0 .87 1.222c1.095-.78 2.044-1.572 2.803-2.336M3.587 14.947q.302-.378.706-.79l-.238-1.33a.75.75 0 0 0-.744.189q-.503.505-.896.995a.75.75 0 1 0 1.172.937m12.163-.243a.75.75 0 1 0-.77-1.287a35 35 0 0 1-3.092 1.645a.75.75 0 0 0 .638 1.357a37 37 0 0 0 3.224-1.715M2.815 16.25a.75.75 0 0 0-1.43-.455c-.191.601-.211 1.262.15 1.84c.453.724 1.307 1.006 2.154 1.087a.75.75 0 1 0 .143-1.493c-.694-.066-.948-.267-1.025-.39c-.05-.08-.102-.244.008-.589m7.268 1.203a.75.75 0 0 0-.527-1.404c-1.225.46-2.365.791-3.362.989a.75.75 0 0 0 .291 1.471c1.093-.216 2.313-.574 3.598-1.056" clip-rule="evenodd"/></svg>
                    </button>
                </Tooltip>)
              }

              {
                (item.note && getCurrentUserRole() === RoleType.STUDENT) && 
                  (<Tooltip title="Tham gia lớp Zoom" placement="top">
                    <button
                      onClick={() => openLinkInNewTab(item.note.split("|")[1])}
                      type="button"
                      className="absolute top-2 right-2 transition-all duration-200 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm p-1.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><g fill="none" stroke="#0f88d2" stroke-linecap="round" stroke-width="1.5"><path d="M8 16c0 2.828 0 4.243.879 5.121c.641.642 1.568.815 3.121.862M8 8c0-2.828 0-4.243.879-5.121C9.757 2 11.172 2 14 2h1c2.828 0 4.243 0 5.121.879C21 3.757 21 5.172 21 8v8c0 2.828 0 4.243-.879 5.121c-.768.769-1.946.865-4.121.877M3 9.5v5c0 2.357 0 3.535.732 4.268S5.643 19.5 8 19.5M3.732 5.232C4.464 4.5 5.643 4.5 8 4.5"/><path stroke-linejoin="round" d="M6 12h9m0 0l-2.5 2.5M15 12l-2.5-2.5"/></g></svg>
                    </button>
                </Tooltip>)
              }

              {
                (item.note && getCurrentUserRole() !== RoleType.STUDENT) && 
                  (<Tooltip title="Bắt đầu lớp Zoom" placement="top">
                    <button
                      onClick={() => openLinkInNewTab(item.note.split("|")[0])}
                      type="button"
                      className="absolute top-2 right-20 transition-all duration-200 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm p-1.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><g fill="none" stroke="#0f88d2" stroke-linecap="round" stroke-width="1.5"><path d="M8 16c0 2.828 0 4.243.879 5.121c.641.642 1.568.815 3.121.862M8 8c0-2.828 0-4.243.879-5.121C9.757 2 11.172 2 14 2h1c2.828 0 4.243 0 5.121.879C21 3.757 21 5.172 21 8v8c0 2.828 0 4.243-.879 5.121c-.768.769-1.946.865-4.121.877M3 9.5v5c0 2.357 0 3.535.732 4.268S5.643 19.5 8 19.5M3.732 5.232C4.464 4.5 5.643 4.5 8 4.5"/><path stroke-linejoin="round" d="M6 12h9m0 0l-2.5 2.5M15 12l-2.5-2.5"/></g></svg>
                    </button>
                </Tooltip>)
              }

              {/*Trạng thái điểm danh*/}
              {/* <button type="button" className="absolute top-2 right-20 transition-all duration-200 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm p-1.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.245 2h9.51c1.159 0 1.738 0 2.206.163a3.05 3.05 0 0 1 1.881 1.936C21 4.581 21 5.177 21 6.37v14.004c0 .858-.985 1.314-1.608.744a.946.946 0 0 0-1.284 0l-.483.442a1.657 1.657 0 0 1-2.25 0a1.657 1.657 0 0 0-2.25 0a1.657 1.657 0 0 1-2.25 0a1.657 1.657 0 0 0-2.25 0a1.657 1.657 0 0 1-2.25 0l-.483-.442a.946.946 0 0 0-1.284 0c-.623.57-1.608.114-1.608-.744V6.37c0-1.193 0-1.79.158-2.27c.3-.913.995-1.629 1.881-1.937C5.507 2 6.086 2 7.245 2M7 6.75a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5zm3.5 0a.75.75 0 0 0 0 1.5H17a.75.75 0 0 0 0-1.5zM7 10.25a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5zm3.5 0a.75.75 0 0 0 0 1.5H17a.75.75 0 0 0 0-1.5zM7 13.75a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5zm3.5 0a.75.75 0 0 0 0 1.5H17a.75.75 0 0 0 0-1.5z" clip-rule="evenodd"/></svg>
                                </button> */}

              <div className="mt-2">
                <p className="text-xl font-semibold my-2 text-blue-500">
                  Thông tin ca học
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
                    <Badge color="purple">
                      {formattedDate(item.take_place_at)}
                    </Badge>
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
                        {item.status.map((statusItem, index) => (
                          <Badge key={index} color={statusBadge[statusItem]}>
                            {statusLesson[statusItem]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancel}
        type={'default'}
      />
      <LessonAlterModal
        onClose={handleAlterModalClose}
        openModal={isAlterModalOpen}
        onSubmit={handleAlterDate}
        isRoom={isRoom}
      ></LessonAlterModal>
    </>
  );
};

export default CourseLesson;
