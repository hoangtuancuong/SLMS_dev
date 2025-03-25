'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Dropdown, Button, TextInput, Checkbox } from 'flowbite-react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { Icon } from '@iconify/react';
import { Table } from 'flowbite-react';
import { callApi } from '@/app/utils/api';
import { notify } from '@/components/Alert/Alert';
import BlogSpinner from '@/app/admin/components/dashboard/BlogSpinner';
import Header from '@/app/admin/components/dashboard/Header';
import { ActionType } from '@/app/utils/constant';
import { useRouter } from 'next/navigation';
import { ConfirmModal } from '@/app/admin/components/dashboard/ConfirmModal';
import { Pagination } from 'flowbite-react';
import Link from 'next/link';
import { debounce } from '@mui/material/utils';
import { GradeType } from '@/app/utils/constant';
const CourseApprovedList = () => {
  const [isLoading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const [filter, setFilter] = useState({
    name: '',
    tagIds: [],
    is_approved: 'false',
  });
  const [modalType, setModalType] = useState('delete');
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [tempFilter, setTempFilter] = useState(filter);
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sort, setSort] = useState({
    name: '',
    start_date: '',
    end_date: '',
    fee: '',
  });
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        ...(filter.name && { 'filter[name]': filter.name }),
        ...(filter.tagIds && { 'filter[tagIds]': filter.tagIds }),
        ...(sort.name && { 'sort[name]': sort.name }),
        ...(sort.start_date && { 'sort[start_date]': sort.start_date }),
        ...(sort.end_date && { 'sort[end_date]': sort.end_date }),
        ...(sort.fee && { 'sort[fee]': sort.fee }),
        ...(filter.is_approved && {
          'filter[is_approved]': filter.is_approved,
        }),
      };

      const response = await callApi('courses', 'GET', null, params);
      setCourses(response.data);
      setTotalCourses(response.meta.total);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCourses();
  }, [limit, offset, filter, sort, currentPage, isModalOpen]);
  const handleDelete = async () => {
    try {
      await callApi(`courses/${selectedId}`, 'DELETE');
      notify('Xoá khóa học thành công', 'success');
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setIsModalOpen(false);
    }
  };
  const handleConfirm = () => {
    if (modalType === 'delete') {
      handleDelete();
    } else if (modalType === 'approvedCourse') {
      handleApprove();
    }
  };

  const handleAction = (item, id) => {
    if (item.action === ActionType.UPDATE) {
      router.push(`/admin/ui/course/${id}/edit`);
    } else if (item.action === ActionType.DETAIL) {
      router.push(`/admin/ui/course/${id}`);
    } else if (item.action === ActionType.DELETE) {
      setSelectedId(id);
      setIsModalOpen(true);
    }
  };
  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...tempFilter, [key]: value };
    setTempFilter(updatedFilters);
    debouncedFilterUpdate(updatedFilters);
  };

  const debouncedFilterUpdate = useCallback(
    debounce((newFilters: any) => {
      setFilter(newFilters);
    }, 500),
    []
  );

  const resetFilters = () => {
    setFilter({
      name: '',
      tagIds: [],
      is_approved: 'false',
    });
    setTempFilter({
      name: '',
      tagIds: [],
      is_approved: 'false',
    });
    setCurrentPage(1);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);

    setModalType('delete');
  };

  const handleSortChange = (field) => {
    setSort((prev) => {
      const newSort = { ...prev };
      newSort[field] = newSort[field] === 'ASC' ? 'DESC' : 'ASC';
      return newSort;
    });
  };
  const handleCheckboxChange = (id, checked) => {
    setSelectedCourse((prev) => {
      if (checked) {
        return [...prev, id];
      }
      return prev.filter((item) => item !== id);
    });
  };

  const openApproveModal = () => {
    setModalType('approvedCourse');
    setIsModalOpen(true);
  };

  const handleSelectAll = () => {
    setSelectedCourse((prev) =>
      prev.length === courses.length ? [] : courses.map((item) => item.id)
    );
  };
  const isCheckAll = () => {
    return selectedCourse.length === courses.length;
  };

  const handleApprove = async () => {
    try {
      for (const id of selectedCourse) {
        await callApi(`courses/${id}/approve`, 'POST');
      }
      notify('Duyệt khóa học thành công!', 'success');
      setSelectedCourse([]);
      fetchCourses();
    } catch (error) {
      notify('Có lỗi xảy ra khi duyệt khóa học!', 'error');
    }
  };
  const getTagByType = (tags, type) => {
    const tag = tags.find(
      (t) => (t.type === GradeType.SUBJECT ? 0 : 1) === type
    );
    return tag ? tag.name : '-';
  };
  const tableActionData = [
    {
      icon: 'solar:pen-new-square-broken',
      action: ActionType.UPDATE,
      listtitle: 'Sửa',
    },
    {
      icon: 'solar-book-broken',
      action: ActionType.DETAIL,
      listtitle: 'Chi tiết',
    },
  ];

  return (
    <div className="rounded-lg dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h5 className="card-title text-xl font-bold text-gray-900">
          Danh sách bài viết
        </h5>
        <Button
          onClick={openApproveModal}
          disabled={selectedCourse.length === 0}
          className="bg-green-500 text-white border rounded-sm border-gray-300"
        >
          <Icon
            icon="solar:add-circle-outline"
            width={20}
            className="transition-transform group-hover:rotate-90"
          />
          Duyệt bài
        </Button>
      </div>

      <div className="mt-3">
        <BlogSpinner isLoading={isLoading} />

        <div className="flex gap-3 mb-4">
          <TextInput
            name="name"
            placeholder="Tìm kiếm theo tên"
            onChange={(e) => handleFilterChange('name', e.target.value)}
            value={tempFilter.name}
            className="w-1/4"
          />
        </div>
        <div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>
                {' '}
                <Checkbox checked={isCheckAll()} onChange={handleSelectAll} />
              </Table.HeadCell>
              <Table.HeadCell>Mã khóa học</Table.HeadCell>
              <Table.HeadCell>Thông tin khóa học</Table.HeadCell>
              <Table.HeadCell>Giảng viên</Table.HeadCell>
              <Table.HeadCell> Môn học</Table.HeadCell>
              <Table.HeadCell>Khối lớp</Table.HeadCell>
              <Table.HeadCell>Học phí</Table.HeadCell>
              <Table.HeadCell>Thao tác</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y divide-border dark:divide-darkborder">
              {courses.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Checkbox
                      checked={selectedCourse.includes(item.id)}
                      onChange={(e) =>
                        handleCheckboxChange(item.id, e.target.checked)
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      href={`/admin/ui/course/${item.id}`}
                      className="hover:text-primary"
                    >
                      <h5 className="text-sm text-wrap font-bold">
                        {item.code}
                      </h5>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-3 items-center">
                      <Link
                        href={`/admin/ui/course/${item.id}`}
                        className="hover:text-primary"
                      >
                        <h5 className="text-sm font-bold">{item.name}</h5>
                      </Link>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <h5 className="text-sm text-wrap">
                      {item.teacher?.name ?? '__'}
                    </h5>
                  </Table.Cell>
                  <Table.Cell>
                    <h5 className="text-sm text-wrap">
                      {getTagByType(item.tags, 0)}
                    </h5>
                  </Table.Cell>
                  <Table.Cell>
                    <h5 className="text-sm text-wrap">
                      {getTagByType(item.tags, 1)}
                    </h5>
                  </Table.Cell>
                  <Table.Cell>
                    <h5 className="text-sm text-wrap">{item.fee} VNĐ</h5>
                  </Table.Cell>
                  <Table.Cell>
                    <Dropdown
                      label=""
                      dismissOnClick={false}
                      renderTrigger={() => (
                        <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-lightprimary hover:text-primary cursor-pointer">
                          <HiOutlineDotsVertical size={22} />
                        </span>
                      )}
                    >
                      {tableActionData.map((action, index) => (
                        <Dropdown.Item
                          key={index}
                          className="flex gap-3"
                          onClick={() => handleAction(action, item.id)}
                        >
                          <Icon icon={action.icon} height={18} />
                          <span>{action.listtitle}</span>
                        </Dropdown.Item>
                      ))}
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalCourses / pageSize)}
            onPageChange={(page) => setCurrentPage(page)}
            previousLabel="Trang trước"
            nextLabel="Trang tiếp"
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        type={modalType}
      />
    </div>
  );
};

export default CourseApprovedList;
