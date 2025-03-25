import AssignmentList from './AssignmentList';
import CourseList from './CourseList';
import TimeTable from './TimeTable';
const page = () => {
  return (
    <div className="flex flex-col">
      <div className="flex gap-4 mt-2">
        <div className="w-2/3">
          <CourseList />
        </div>
        <div className="w-1/3 flex flex-col gap-4">
          <div className="bg-white dark:bg-darkgray p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Thời khóa biểu</h3>
            <TimeTable />
          </div>
          <div className="bg-white dark:bg-darkgray p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Bài tập</h3>
            <AssignmentList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
