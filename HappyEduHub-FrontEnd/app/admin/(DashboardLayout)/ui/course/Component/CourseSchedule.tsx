import { HiOutlinePlus } from 'react-icons/hi';
import CourseTimeItem from './CourseTimeItem';

const CourseSchedule = ({
  values,
  daysOfWeek,
  handleAddCourseTime,
  handleCourseTimeChange,
  handleRemoveCourseTime,
}) => {
  return (
    <div className="col-span-12 space-y-4 relative">
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-semibold">Thời gian học</h4>
        <button
          type="button"
          onClick={handleAddCourseTime}
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          <HiOutlinePlus className="w-5 h-5" />
        </button>
      </div>

      {values.course_times.map((courseTime, index) => (
        <CourseTimeItem
          key={index}
          index={index}
          courseTime={courseTime}
          daysOfWeek={daysOfWeek}
          onChange={handleCourseTimeChange}
          onRemove={handleRemoveCourseTime}
        />
      ))}
    </div>
  );
};

export default CourseSchedule;
