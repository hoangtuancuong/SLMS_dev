'use client';
import Header from '@/app/admin/components/dashboard/Header';
import { callApi } from '@/app/utils/api';
import {
  Card,
  Table,
  Spinner,
  Badge,
  Pagination,
  TextInput,
} from 'flowbite-react';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Collapse, IconButton, Select, MenuItem } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { debounce } from 'lodash';

const CourseList = () => {
  const pageSize = 10;
  const [courses, setCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    code: '',
    name: '',
    course_time_status: '',
  });
  const [tempFilters, setTempFilters] = useState(filters);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFilterUpdate = useCallback(
    debounce((newFilters: any) => {
      setFilters(newFilters);
    }, 500),
    []
  );
  const handleFilterChange = (key, value) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
    debouncedFilterUpdate({ ...tempFilters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      code: '',
      name: '',
      course_time_status: '',
    });
    setTempFilters({
      code: '',
      name: '',
      course_time_status: '',
    });
    debouncedFilterUpdate({
      code: '',
      name: '',
      course_time_status: '',
    });
  };

  const fetchData = async () => {
    try {
      const offset = (currentPage - 1) * pageSize;
      setIsLoading(true);
      const filterParams = Object.entries(filters)
        .filter(([_, value]) => value !== '')
        .map(([key, value]) => `filter[${key}]=${encodeURIComponent(value)}`)
        .join('&');
      const res = await callApi(
        `courses/my-courses?offset=${offset}&limit=${pageSize}&${filterParams}`,
        'GET'
      );
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
  }, [currentPage, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const getStatusBadge = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return <Badge color="lightwarning">Chưa bắt đầu</Badge>;
    } else if (now > end) {
      return <Badge color="lightsuccess">Đã kết thúc</Badge>;
    } else {
      return <Badge color="lightprimary">Đang học</Badge>;
    }
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
            <Select
              value={tempFilters.course_time_status}
              onChange={(e) =>
                handleFilterChange('course_time_status', e.target.value)
              }
              displayEmpty
              sx={{ minWidth: 200, height: 40, borderRadius: '10px' }}
            >
              <MenuItem value="HAVE_NOT_STARTED">
                <Badge color="lightwarning">Chưa bắt đầu</Badge>
              </MenuItem>
              <MenuItem value="IN_PROGRESS">
                <Badge color="lightprimary">Đang học</Badge>
              </MenuItem>
              <MenuItem value="COMPLETED">
                <Badge color="lightsuccess">Đã kết thúc</Badge>
              </MenuItem>
            </Select>
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
              <strong>Trạng thái</strong>
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
                    <Table.Cell className="whitespace-nowrap">
                      {getStatusBadge(course.start_date, course.end_date)}
                    </Table.Cell>
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
    </>
  );
};

export default CourseList;
