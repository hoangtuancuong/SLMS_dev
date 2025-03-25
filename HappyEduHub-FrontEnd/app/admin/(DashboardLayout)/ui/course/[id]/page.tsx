import CourseDetail from './CourseDetail';

const page = ({ params }: { params: { id: string } }) => {
  return <CourseDetail id={params.id} />;
};

export default page;
