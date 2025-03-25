'use client';

import { Course } from '@/app/utils/api_model';
import { processGoogleDriveLink } from '@/app/utils/utils';
import Breadcrumb from '@/components/Common/Breadcrumb';
import { Icon } from '@iconify/react';
import { Avatar, Box, IconButton, Modal } from '@mui/material';
import { CheckBoxRounded } from '@mui/icons-material';
import { Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { callApi } from '@/app/utils/api';
import { notify } from '@/components/Alert/Alert';

export default function CourseModal({
  course,
  show,
  onClose,
}: {
  course: Course;
  show: boolean;
  onClose: () => void;
}) {
  const [canEnroll, setCanEnroll] = useState(true);

  useEffect(() => {
    const checkEnroll = async () => {
      try {
        setCanEnroll(false);
        const res = await callApi(`courses/${course.id}/check-enroll`, "GET");
        setCanEnroll(true);
      } catch (_) {
      }
    };
    checkEnroll();
  }, [course]);

  const handleEnroll = async () => {
    try {
      await callApi(`courses/${course.id}/enroll`, "POST");
      notify("Đăng ký khóa học thành công", "success");
      onClose();
      setCanEnroll(false);
    } catch (_) {
      notify("Đăng ký khóa học thất bại", "error");
      setCanEnroll(true);
    }
  };
  
  return (
    <Modal
      open={show}
      onClose={onClose}
      className="shadow-md"
      sx={{
        borderRadius: '12px',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          borderRadius: '12px',
          bgcolor: 'background.paper',
        }}
      >
        <div className="flex flex-col mx-4 mt-4 mb-8">
          <IconButton onClick={onClose} className="self-end">
            <Icon icon="mdi:close" color="black" fontSize={24} />
          </IconButton>
          <div className="flex flex-col md:flex-row ml-8">
            <div className="flex flex-col mr-12" style={{ flexGrow: 2 }}>
              <h1 className="text-2xl font-bold mb-2">{course?.name}</h1>
              <span className="text-lg text-gray-500 mb-8">
                {course?.description}
              </span>
              <div className="h-full rounded-md border-2 border-dashed border-blue-300 p-4 text-blue-500 flex flex-col gap-2">
                <span className="text-lg font-bold">Thông tin giáo viên</span>
                {course?.teacher && (
                  <>
                    <div className="flex items-center gap-2">
                      <Avatar
                        className="w-8 h-8"
                        src={processGoogleDriveLink(course.teacher.avatar_url)}
                      />
                      <span className="text-sm">
                        {JSON.parse(course.teacher.portfolio).hoc_ham ===
                        'Thạc sĩ'
                          ? 'ThS.'
                          : JSON.parse(course.teacher.portfolio).hoc_vi ===
                              'Tiến sĩ'
                            ? 'TS.'
                            : ''}{' '}
                        {course.teacher.name}
                      </span>
                    </div>
                    <span className="text-md font-bold">Giới thiệu</span>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm">
                        {JSON.parse(course.teacher.portfolio).bio}
                      </span>
                      {/* <span className="text-sm">{"[Họ và tên] là một giáo viên [môn học] với [số năm] năm kinh nghiệm giảng dạy tại [trường học/cơ sở giáo dục]. Với niềm đam mê giảng dạy và phát triển tư duy sáng tạo cho học sinh, [tên] luôn nỗ lực áp dụng phương pháp giáo dục hiện đại, giúp học sinh không chỉ tiếp thu kiến thức mà còn phát triển kỹ năng tư duy phản biện và giải quyết vấn đề.\n\nBên cạnh công việc giảng dạy, [tên] cũng tích cực tham gia vào các hoạt động đào tạo giáo viên, nghiên cứu phương pháp sư phạm, và ứng dụng công nghệ trong giáo dục để nâng cao chất lượng dạy và học."}</span> */}
                    </div>
                    <span className="text-md font-bold">
                      Phương pháp giảng dạy
                    </span>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm">
                        {
                          JSON.parse(course.teacher.portfolio)
                            .teaching_philosophy
                        }
                      </span>
                      {/* <span className="text-sm">{"Tôi tin rằng giáo dục không chỉ là truyền đạt kiến thức mà còn là truyền cảm hứng, khơi gợi niềm đam mê học tập và giúp học sinh phát triển toàn diện cả về tư duy lẫn nhân cách.\n\n🔹 Học tập lấy học sinh làm trung tâm: Mỗi học sinh là một cá thể độc đáo, có cách học riêng. Tôi luôn cố gắng tạo ra một môi trường học tập tích cực, nơi học sinh được khuyến khích đặt câu hỏi, suy nghĩ độc lập và khám phá kiến thức theo cách của riêng mình.\n\n🔹 Học thông qua thực tiễn: Tôi tin vào phương pháp học tập dựa trên trải nghiệm thực tế. Thay vì chỉ tiếp thu lý thuyết, học sinh cần có cơ hội áp dụng kiến thức vào thực tế thông qua dự án, tình huống giả lập và các hoạt động tương tác.\n\n🔹 Phát triển tư duy phản biện và sáng tạo: Trong một thế giới không ngừng thay đổi, kỹ năng quan trọng nhất không phải là ghi nhớ thông tin mà là khả năng tư duy phản biện, giải quyết vấn đề và sáng tạo. Tôi luôn khuyến khích học sinh đặt câu hỏi, thách thức giả định và tìm ra những cách tiếp cận mới.\n\n🔹 Tạo môi trường học tập tích cực: Tôi tin rằng sự tôn trọng, động viên và thấu hiểu là chìa khóa để học sinh phát huy hết tiềm năng của mình. Một lớp học tốt không chỉ truyền đạt kiến thức mà còn xây dựng sự tự tin, lòng kiên trì và tinh thần hợp tác cho học sinh.\n\nTóm lại, sứ mệnh của tôi là giúp học sinh không chỉ học tốt mà còn trở thành những cá nhân có tư duy sắc bén, sáng tạo và luôn sẵn sàng học hỏi suốt đời."}</span> */}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div
              className="flex flex-col items-start text-blue-500 mr-12"
              style={{ flexGrow: 1 }}
            >
              <Button color="blue" className="w-full my-5" disabled={!canEnroll} onClick={handleEnroll}>
                {canEnroll ? 'Đăng ký' : 'Bạn không thể đăng ký khóa học này'}
              </Button>
              <div className="w-full rounded-md border-2 border-dashed border-blue-300 p-4 mt-4">
                <span className="text-lg font-bold mt-4 mb-1">
                  Thông tin khóa học
                </span>
                <div className="flex mt-1 gap-1 items-center">
                  <Icon icon="mdi:money" fontSize={24} />
                  {!course && <span>Chưa có thông tin</span>}
                  {course && (
                    <span className="text-md">
                      {Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(course.fee || 0)}
                    </span>
                  )}
                </div>
                <div className="flex mt-1 gap-1 items-center">
                  <Icon icon="mdi:clock" fontSize={24} />
                  {!course && <span>Chưa có thông tin</span>}
                  {course && (
                    <span>
                      {Intl.DateTimeFormat('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }).format(new Date(course.start_date || ''))}{' '}
                      -{' '}
                      {Intl.DateTimeFormat('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }).format(new Date(course.end_date || ''))}
                    </span>
                  )}
                </div>
                <div className="flex mt-1 gap-1 items-center">
                  <Icon icon="mdi:calendar" fontSize={24} />
                  {!course && <span>Chưa có thông tin</span>}
                  {course && <span>{course.shifts.length} ca/tuần</span>}
                </div>
              </div>
              <div className="w-full rounded-md border-2 border-dashed border-blue-300 p-4 mt-4">
                <span className="text-lg font-bold mt-4 mb-1">
                  Thông tin ca học
                </span>
                <div className="w-full grid grid-cols-8 justify-items-center font-medium">
                  <span>Ca</span>
                  <span>T2</span>
                  <span>T3</span>
                  <span>T4</span>
                  <span>T5</span>
                  <span>T6</span>
                  <span className="text-blue-700">T7</span>
                  <span className="text-red-500">CN</span>
                  {[1, 2, 3, 4, 5, 6].map((shift) => {
                    return [
                      <span key={shift}>{shift}</span>,
                      ...[1, 2, 3, 4, 5, 6, 7].map((day) => {
                        if (
                          course?.shifts.find(
                            (courseShift) =>
                              courseShift.day === day &&
                              courseShift.shift === shift
                          )
                        ) {
                          return (
                            <CheckBoxRounded
                              key={day}
                              color="primary"
                              fontSize="small"
                            />
                          );
                        }
                        return (
                          <span
                            key={day}
                            className={
                              day == 6
                                ? 'text-blue-700'
                                : day == 7
                                  ? 'text-red-500'
                                  : ''
                            }
                          >
                            -
                          </span>
                        );
                      }),
                    ];
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
