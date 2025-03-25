import { useRouter } from 'next/navigation';
import { SubjectImage } from './SubjectImage';
import { Badge } from 'flowbite-react';
import {
  Grade,
  gradeBadgeColors,
  Subject,
  subjectBadgeColors,
} from '@/app/utils/constant';
import { Course } from '@/app/utils/api_model';
import { TeacherAnchor } from '@/components/Course/TeacherAnchor';

export const SingleCourse = (props: { course: Course, onClick: () => void }) => {
  const router = useRouter();

  return (
    <div
      className="flex flex-col shadow-one hover:shadow-three rounded-sm bg-white duration-300"
      key={props.course.id}
    >
      <div
        className="relative rounded-t-sm overflow-hidden"
        onClick={props.onClick}
      >
        <SubjectImage
          tag={props.course.tags.find((tag) => tag.type === 'SUBJECT')}
        />
        <div className="flex flex-col items-end absolute bottom-2 right-2 gap-1">
          <span className="text-sm text-white">
            <Badge
              color={
                subjectBadgeColors[
                  props.course.tags.find((tag) => tag.type === 'SUBJECT')
                    ?.name as Subject
                ]
              }
              className="text-xs font-bold rounded-lg"
            >
              {props.course.tags.find((tag) => tag.type === 'SUBJECT')?.name}
            </Badge>
          </span>
          <span className="text-sm text-white">
            <Badge
              color={
                gradeBadgeColors[
                  props.course.tags.find((tag) => tag.type === 'GRADE')
                    ?.name as Grade
                ]
              }
              className="text-xs font-bold rounded-lg"
            >
              {props.course.tags.find((tag) => tag.type === 'GRADE')?.name}
            </Badge>
          </span>
        </div>
      </div>
      <h3
        className="mx-4 mt-4 text-lg font-bold hover:text-xl duration-300 cursor-pointer"
        onClick={props.onClick}
      >
        {props.course.name}
      </h3>
      <span
        className="mx-4 my-2 text-sm text-gray-500 cursor-pointer"
        onClick={props.onClick}
      >
        {props.course.description}
      </span>
      <div className="flex items-center mx-4 mb-4 mt-2">
        <TeacherAnchor teacher={props.course.teacher} />
        <span className="flex-1"></span>
        {props.course.fee > 0 ? (
          <span className="text-sm text-gray-500">
            {Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(props.course.fee)}
          </span>
        ) : (
          <span className="text-sm text-gray-500 font-bold">Miễn phí</span>
        )}
      </div>
    </div>
  );
};
