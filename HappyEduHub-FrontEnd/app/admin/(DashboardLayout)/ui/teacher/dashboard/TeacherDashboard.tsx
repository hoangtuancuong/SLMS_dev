'use client';
import Header from '@/app/admin/components/dashboard/Header';
import { callApi } from '@/app/utils/api';
import { Grade, gradeBadgeColors } from '@/app/utils/constant';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Collapse, IconButton } from '@mui/material';
import {
  Badge,
  Button,
  Card,
  Pagination,
  Spinner,
  Table,
  TextInput,
} from 'flowbite-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import TimeTableModal from './TimeTableModal';
import { debounce } from 'lodash';

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    code: '',
    name: '',
    status: '',
  });
  const [tempFilters, setTempFilters] = useState(filters);
  const [openTimeTableModal, setOpenTimeTableModal] = useState(false);

  const getGradeFromCode = (code: string) => {
    switch (code) {
      case '6':
        return Grade.GRADE_6;
      case '7':
        return Grade.GRADE_7;
      case '8':
        return Grade.GRADE_8;
      case '9':
        return Grade.GRADE_9;
      case '10':
        return Grade.GRADE_10;
      case '11':
        return Grade.GRADE_11;
      case '12':
        return Grade.GRADE_12;
      default:
        return null;
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFilterUpdate = useCallback(
    debounce((newFilters: any) => {
      setFilters(newFilters);
    }, 500),
    []
  );
  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...tempFilters, [key]: value };
    setTempFilters(updatedFilters);
    debouncedFilterUpdate(updatedFilters);
  };

  const clearFilters = () => {
    setFilters({
      code: '',
      name: '',
      status: '',
    });
    setTempFilters({
      code: '',
      name: '',
      status: '',
    });
    setCurrentPage(1);
  };

  const fetchData = async () => {
    try {
      const offset = (currentPage - 1) * pageSize;
      const filterParams = Object.entries(filters)
        .filter(([_, value]) => value !== '')
        .map(([key, value]) => `filter[${key}]=${encodeURIComponent(value)}`)
        .join('&');
      setIsLoading(true);
      const res = await callApi(
        `courses/my-courses?offset=${offset}&limit=${pageSize}&${filterParams}`,
        'GET'
      );
      console.log(res);
      const data = res?.data;
      const meta = res?.meta;
      setCourses(data);
      setTotalCourses(meta?.total);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    console.log(currentPage);
  }, [currentPage, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenTimeTableModal = () => {
    setOpenTimeTableModal(true);
  };

  const handleCloseTimeTableModal = () => {
    setOpenTimeTableModal(false);
  };

  const noData = () => {
    return (
      <Table.Row>
        <Table.Cell colSpan={6} className="text-center">
          <div className="flex justify-center items-center">
            Không có dữ liệu
          </div>
        </Table.Cell>
      </Table.Row>
    );
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center">
          <Header icon="solar:document-bold" title="Danh sách lớp học" />
          <div className="flex gap-2">
            <Button color="lightprimary" onClick={handleOpenTimeTableModal}>
              Thời khóa biểu
            </Button>
            <IconButton onClick={() => setShowFilters(!showFilters)}>
              <FilterListIcon />
            </IconButton>
          </div>
        </div>

        <Collapse in={showFilters}>
          <div className="flex gap-4 mb-4">
            <TextInput
              placeholder="Tìm theo mã khóa học"
              value={tempFilters.code}
              onChange={(e) => handleFilterChange('code', e.target.value)}
              className="h-[40px]"
            />
            <TextInput
              placeholder="Tìm theo tên khóa học"
              value={tempFilters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              className="h-[40px]"
            />
            <IconButton onClick={clearFilters}>
              <RestartAltIcon />
            </IconButton>
          </div>
        </Collapse>

        <Table hoverable striped>
          <Table.Head>
            <Table.HeadCell>
              <strong>Mã khóa học</strong>
            </Table.HeadCell>
            <Table.HeadCell>
              <strong>Tên khóa học</strong>
            </Table.HeadCell>
            <Table.HeadCell>
              <strong>Lớp</strong>
            </Table.HeadCell>
            <Table.HeadCell>
              <strong>Mô tả</strong>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y divide-border dark:divide-darkborder">
            {isLoading ? (
              <Table.Row>
                <Table.Cell colSpan={6} className="text-center">
                  <div className="flex justify-center items-center">
                    <Spinner size="xl" />
                  </div>
                </Table.Cell>
              </Table.Row>
            ) : totalCourses === 0 ? (
              noData()
            ) : (
              courses.map((course) => {
                const gradeTag = course.tags.find(
                  (tag) => tag.type === 'GRADE'
                );
                console.log(gradeTag, 'gradeTag');
                const grade = getGradeFromCode(gradeTag?.code_fragment);
                console.log(grade);
                return (
                  <Table.Row key={course.id}>
                    <Table.Cell>
                      <Link
                        href={`/admin/ui/course/${course.id}`}
                        className="hover:text-primary"
                      >
                        <h1>{course.code}</h1>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        href={`/admin/ui/course/${course.id}`}
                        className="hover:text-primary"
                      >
                        <h1>{course.name}</h1>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      {grade && (
                        <Badge
                          color={gradeBadgeColors[grade]}
                          className="inline-flex items-center w-fit whitespace-nowrap"
                        >
                          {grade}
                        </Badge>
                      )}
                    </Table.Cell>
                    <Table.Cell>{course.description}</Table.Cell>
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table>
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalCourses / pageSize)}
            onPageChange={(page) => setCurrentPage(page)}
            previousLabel="Trang trước"
            nextLabel="Trang tiếp"
            showIcons
          />
        </div>
      </Card>
      <TimeTableModal
        open={openTimeTableModal}
        setClose={handleCloseTimeTableModal}
      />
    </>
  );
};

export default TeacherDashboard;
