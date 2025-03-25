import { Avatar, Badge, Button, Card } from 'flowbite-react';
import {
  Grade,
  gradeBadgeColors,
  RoleType,
  shiftDay,
  shiftName,
  Subject,
  subjectBadgeColors,
} from '@/app/utils/constant';
import { Skeleton } from '@mui/material';
import { processGoogleDriveLink } from '@/app/utils/utils';
import EditIcon from '@mui/icons-material/Edit';

const CourseDetailData = (props: any) => {
  const { course, role } = props;
  const subjectTag = course?.tags?.find((tag: any) => tag.type === 'SUBJECT');
  const gradeTag = course?.tags?.find((tag: any) => tag.type === 'GRADE');
  const subjectName = subjectTag?.name as Subject;
  const gradeName = gradeTag?.name as Grade;

  if (!course)
    return (
      <Card>
        <Skeleton variant="rectangular" width="100%" height={100} />
        <Skeleton variant="rectangular" width="100%" height={100} />
        <Skeleton variant="rectangular" width="100%" height={100} />
        <Skeleton variant="rectangular" width="100%" height={100} />
        <Skeleton variant="rectangular" width="100%" height={100} />
      </Card>
    );

  return (
    <Card className="border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar
            img={processGoogleDriveLink(course?.teacher?.avatar_url)}
            rounded
            bordered
            color="gray"
          />
          <h1>{course?.teacher?.name}</h1>
        </div>
        {[RoleType.ADMIN, RoleType.TEACHER].includes(role) && (
          <Button
            color="lightprimary"
            href={`/admin/ui/course/${course?.id}/edit`}
          >
            <EditIcon />
            Sửa thông tin
          </Button>
        )}
      </div>
      <h1>Mã khóa học: {course?.code}</h1>
      <h1>Tên khóa học: {course?.name}</h1>
      <div className="flex items-center gap-2">
        <h1>Môn học: </h1>
        {subjectName && (
          <Badge color={subjectBadgeColors[subjectName]}>{subjectName}</Badge>
        )}
        {gradeName && (
          <Badge color={gradeBadgeColors[gradeName]}>{gradeName}</Badge>
        )}
      </div>
      <div>
        <h1>Thông tin ca học: </h1>
        <div className="ml-4 mt-2">
          {course?.shifts &&
            course?.shifts.map((shift: any, index: number) => (
              <div key={index} className="mb-1 flex items-center gap-2">
                <span>{index + 1}.</span>
                <span className="flex gap-1">
                  <Badge color="purple">{shiftDay[shift.day]}</Badge> -
                  <Badge color="pink">Ca {shiftName[shift.shift]}</Badge> -
                  <Badge color="indigo">
                    {shift.room ? `Phòng ${shift.room}` : '- Chưa có phòng'}
                  </Badge>
                </span>
              </div>
            ))}
        </div>
      </div>
      <h1>Ghi chú: </h1>
      <span>{course?.description}</span>
    </Card>
  );
};

export default CourseDetailData;
