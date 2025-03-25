'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Badge,
  Dropdown,
  Pagination,
  Select,
  TextInput,
  Datepicker,
} from 'flowbite-react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { Icon } from '@iconify/react';
import { Table } from 'flowbite-react';
import Link from 'next/link';
import { callApi } from '@/app/utils/api';
import { notify } from '@/components/Alert/Alert';
import BlogSpinner from '@/app/admin/components/dashboard/BlogSpinner';
import { useRouter } from 'next/navigation';
import {
  SortType,
  ActionType,
  Subject,
  subjectBadgeColors,
} from '@/app/utils/constant';
import { debounce } from 'lodash';
import { ConfirmModal } from '@/app/admin/components/dashboard/ConfirmModal';
import Header from '@/app/admin/components/dashboard/Header';
const TeacherList = () => {
  const [isLoading, setLoading] = useState(false);
  const [teacher, setTeacher] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    created_at: '',
    updated_at: '',
    is_approved: '',
    role: 'TEACHER',
    gender: '',
  });
  const [tempFilters, setTempFilters] = useState(filters);
  const [subject, setSubject] = useState([]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const filterParams = Object.entries(filters)
        .filter(([_, value]) => value !== '')
        .map(([key, value]) => `filter[${key}]=${encodeURIComponent(value)}`)
        .join('&');

      const query = `limit=${pageSize}&offset=${(currentPage - 1) * pageSize}&${filterParams}`;

      const response = await callApi(`user?${query}`);
      const tag = await callApi(`tags`);
      setSubject(tag);
      setTeacher(response.data);
      setTotalItems(response.meta.total);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, pageSize, filters, isModalOpen]);

  const handleAction = (item, id) => {
    if (item.action === ActionType.UPDATE) {
      router.push(`/admin/ui/teacher/update/${id}`);
    } else if (item.action === ActionType.DETAIL) {
      router.push(`/admin/ui/teacher/detail/${id}`);
    } else if (item.action === ActionType.DELETE) {
      setSelectedId(id);
      setIsModalOpen(true);
    }
  };
  const handleDelete = async () => {
    try {
      setLoading(true);
      await callApi(`user/${selectedId}`, 'DELETE');
      notify('Xóa giáo viên thành công', 'success');
      setIsModalOpen(false);
      await fetchBlogs();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  };
  const debouncedFilterUpdate = useCallback(
    debounce((newFilters) => {
      setFilters(newFilters);
    }, 500),
    []
  );
  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...tempFilters, [key]: value };
    setTempFilters(updatedFilters);
    debouncedFilterUpdate(updatedFilters);
  };
  const resetFilters = () => {
    setFilters({
      name: '',
      email: '',
      phone_number: '',
      date_of_birth: '',
      created_at: '',
      updated_at: '',
      is_approved: '',
      role: 'TEACHER',
      gender: '',
    });
    setTempFilters({
      name: '',
      email: '',
      phone_number: '',
      date_of_birth: '',
      created_at: '',
      updated_at: '',
      is_approved: '',
      role: 'TEACHER',
      gender: '',
    });
    setCurrentPage(1);
  };
  const tableActionData = [
    {
      icon: 'solar:pen-new-square-broken',
      listtitle: 'Sửa',
      action: ActionType.UPDATE,
    },
    {
      icon: 'solar:trash-bin-minimalistic-outline',
      listtitle: 'Xoá',
      action: ActionType.DELETE,
    },
    {
      icon: 'solar:document-text-outline',
      listtitle: 'Chi tiết',
      action: ActionType.DETAIL,
    },
  ];

  const getBadgeInfo = (type: string) => {
    switch (type) {
      case 'MALE':
        return 'Nam';
      case 'FEMALE':
        return 'Nữ';
      default:
        return 'Không xác định';
    }
  };
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'MALE':
        return 'primary';
      case 'FEMALE':
        return 'secondary';
      default:
        return 'error';
    }
  };

  return (
    <>
      <div className="rounded-lg dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
        <Header
          icon="solar:user-bold"
          title="Danh sách giáo viên"
          showButton={true}
          buttonIcon={'solar:add-square-broken'}
          buttonText={'Tạo mới giáo viên'}
          buttonLink={'teacher/add'}
        />
        <div>
          <div className="flex gap-3 mb-4 ">
            <TextInput
              placeholder="Tìm theo tên"
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />

            <TextInput
              placeholder="Tìm theo email"
              value={tempFilters.email}
              onChange={(e) => handleFilterChange('email', e.target.value)}
            />
            <TextInput
              placeholder="Tìm theo số điện thoại"
              value={tempFilters.phone_number}
              onChange={(e) =>
                handleFilterChange('phone_number', e.target.value)
              }
            />
            <Datepicker
              placeholder="Ngày sinh"
              value={tempFilters.date_of_birth}
              onSelectedDateChanged={(date) => {
                if (date) {
                  handleFilterChange(
                    'date_of_birth',
                    date.toISOString().split('T')[0]
                  );
                }
              }}
            />

            <Select
              value={tempFilters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
            </Select>
            <div className="ml-auto flex items-center">
              <Icon
                icon="tabler:filter-off"
                width={20}
                className="cursor-pointer transition-transform"
                onClick={resetFilters}
              />
            </div>
          </div>
        </div>

        <div>
          <BlogSpinner isLoading={isLoading} />
          <div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>STT</Table.HeadCell>
                <Table.HeadCell>Mã giáo viên</Table.HeadCell>
                <Table.HeadCell>Tên giáo viên</Table.HeadCell>
                <Table.HeadCell>Giới tính</Table.HeadCell>
                <Table.HeadCell>Số điện thoại</Table.HeadCell>
                <Table.HeadCell>Môn dạy</Table.HeadCell>
                <Table.HeadCell>Thao tác</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-border dark:divide-darkborder">
                {teacher.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <h5 className="text-base text-wrap">{index + 1}</h5>
                    </Table.Cell>
                    <Table.Cell>
                      <h5 className="text-base text-wrap">{item.code}</h5>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap ps-6">
                      <div className="flex gap-3 items-center group relative">
                        <div className="truncat line-clamp-2 sm:text-wrap max-w-56">
                          <h6 className="text-sm">{item.name}</h6>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={`light${getBadgeColor(item.gender)}`}
                        className={`text-${getBadgeColor(item.gender)} text-md py-1`}
                      >
                        {getBadgeInfo(item.gender)}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <h5 className="text-base text-wrap">
                        {item.phone_number}
                      </h5>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={
                          'indigo'
                        }
                      >
                        {item.additional_teacher_data?.subject.name}
                      </Badge>
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
                        {tableActionData.map((items, index) => (
                          <Dropdown.Item
                            key={index}
                            className="flex gap-3"
                            onClick={() => handleAction(items, item.id)}
                          >
                            <Icon icon={`${items.icon}`} height={18} />
                            <span>{items.listtitle}</span>
                          </Dropdown.Item>
                        ))}
                      </Dropdown>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>

        <div className="flex justify-center mt-4 gap-8 items-center">
          <div className="h-8 flex items-center">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalItems / pageSize)}
              onPageChange={(page) => setCurrentPage(page)}
              previousLabel="Trang trước"
              nextLabel="Trang tiếp"
            />
          </div>
          <div className="h-8 flex items-center">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="w-20 h-8 px-2 py-1 text-sm border border-gray-300 rounded-md"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleDelete}
          type="delete"
        />
      </div>
    </>
  );
};

export default TeacherList;
