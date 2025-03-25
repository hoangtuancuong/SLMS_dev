'use client';
import BlogSpinner from '@/app/admin/components/dashboard/BlogSpinner';
import { ConfirmModal } from '@/app/admin/components/dashboard/ConfirmModal';
import Header from '@/app/admin/components/dashboard/Header';
import Header2 from '@/app/admin/components/dashboard/Header2';
import useExcelUpload from '@/app/hooks/useExcelUpload';
import { callApi } from '@/app/utils/api';
import { ActionType, SortType } from '@/app/utils/constant';
import { notify } from '@/components/Alert/Alert';
import { Icon } from '@iconify/react';
import {
  Badge,
  Datepicker,
  Dropdown,
  Pagination,
  Select,
  Table,
  TextInput,
} from 'flowbite-react';
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import StudentExcelModal from './components/StudentExcelModal';

const StudentList = () => {
  const [isLoading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [isExcelImported, setIsExcelImported] = useState(false);
  const {
    fileInputRef,
    handleClickImport,
    handleFileUpload,
    loading,
    formattedData,
  } = useExcelUpload(() => {
    setIsExcelImported(true);
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [sort, setSort] = useState({
    title: SortType.DESC,
    created_at: SortType.DESC,
  });
  const router = useRouter();
  const [filters, setFilters] = useState({
    code: '',
    name: '',
    phone_number: '',
    date_of_birth: '',
    class: '',
    school: '',
    created_at: '',
    updated_at: '',
    is_approved: '',
    role: 'STUDENT',
    gender: '',
  });
  const [tempFilters, setTempFilters] = useState(filters);
  const fetchStudents = async () => {
    try {
      setLoading(true);

      const filterParams = Object.entries(filters)
        .filter(([_, value]) => value !== '')
        .map(([key, value]) => `filter[${key}]=${encodeURIComponent(value)}`)
        .join('&');

      const sortParams = Object.entries(sort)
        .map(([key, value]) => `sort[${key}]=${value}`)
        .join('&');

      const query = `limit=${pageSize}&offset=${(currentPage - 1) * pageSize}&${filterParams}&${sortParams}`;

      const response = await callApi(`user?${query}`);
      const student = response.data.filter(
        (s) =>
          s.additional_student_data &&
          (!filters.school ||
            s.additional_student_data.school?.includes(filters.school)) &&
          (!filters.class ||
            s.additional_student_data.class?.includes(filters.class))
      );

      setStudents(student);
      setTotalItems(response.meta.total);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentPage, pageSize, filters, sort, isModalOpen]);

  const handleSubmitImport = async () => {
    if (!formattedData) {
      notify('Lỗi xảy ra khi nhập file excel', 'error');
      return;
    }

    setLoading(true);
    const body = formattedData;

    try {
      setLoading(true);
      setIsExcelImported(false);
      const response = await callApi('user/bulk-student-create', 'POST', body);
      console.log(response);
      notify('Tạo tài khoản thành công', 'success');
      fetchStudents();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (item, id) => {
    if (item.action === ActionType.UPDATE) {
      router.push(`/admin/ui/student/update/${id}`);
    } else if (item.action === ActionType.DETAIL) {
      router.push(`/admin/ui/student/detail/${id}`);
    } else if (item.action === ActionType.DELETE) {
      setSelectedId(id);
      setIsModalOpen(true);
    }
  };
  const handleDelete = async () => {
    try {
      setLoading(true);
      await callApi(`user/${selectedId}`, 'DELETE');
      notify('Xóa người dùng thành công', 'success');
      setIsModalOpen(false);
      await fetchStudents();
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
      code: '',
      phone_number: '',
      date_of_birth: '',
      created_at: '',
      updated_at: '',
      is_approved: '',
      role: 'STUDENT',
      gender: '',
      class: '',
      school: '',
    });
    setTempFilters({
      name: '',
      code: '',
      phone_number: '',
      date_of_birth: '',
      created_at: '',
      updated_at: '',
      is_approved: '',
      role: 'STUDENT',
      gender: '',
      class: '',
      school: '',
    });
    setCurrentPage(1);
  };
  const handleSortChange = (field) => {
    setSort((prev) => {
      const newSort = { ...prev };
      if (!newSort[field]) {
        newSort[field] = SortType.ASC;
      } else if (newSort[field] === SortType.ASC) {
        newSort[field] = SortType.DESC;
      } else {
        newSort[field] = SortType.ASC;
      }
      return { ...newSort };
    });
  };
  const downloadFileMau = async () => {
    const response = await fetch('/xlsx/Thông tin học sinh.xlsx');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'Thông tin học sinh.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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

  return (
    <>
      <div className="rounded-lg dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
        <Header2
          icon="solar:user-bold"
          title="Danh sách học sinh"
          buttons={[
            {
              text: 'Tạo mới học sinh',
              icon: 'solar:add-square-broken',
              link: '/admin/ui/student/add',
              color: 'primary',
              shadowColor: 'blue',
            },
            {
              text: 'Import Excel',
              icon: 'solar:cash-out-broken',
              link: '#',
              onClick: handleClickImport,
              color: 'green-600',
              shadowColor: 'green',
            },
            {
              text: 'Tải file Excel mẫu',
              icon: 'solar:cloud-download-bold-duotone',
              link: '#',
              onClick: downloadFileMau,
              color: 'pink-500',
              shadowColor: 'green',
            },
          ]}
        />

        <div>
          <div className="flex gap-3 mb-4 ">
            <TextInput
              placeholder="Mã học sinh"
              value={tempFilters.code}
              onChange={(e) => handleFilterChange('code', e.target.value)}
            />

            <TextInput
              placeholder="Tên học sinh"
              value={tempFilters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />

            <TextInput
              placeholder="Trường học"
              value={tempFilters.school}
              onChange={(e) => handleFilterChange('school', e.target.value)}
            />

            <TextInput
              placeholder="Lớp học"
              value={tempFilters.class}
              onChange={(e) => handleFilterChange('class', e.target.value)}
            />
            {/* <Datepicker
              placeholder="Ngày tạo"
              value={tempFilters.from_created_at}
              onSelectedDateChanged={(date) => {
                if (date) {
                  handleFilterChange(
                    'from_created_at',
                    date.toISOString().split('T')[0]
                  );
                }
              }}
            />

            <Select
              value={tempFilters.truong}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="POST">Bài viết</option>
              <option value="DOCUMENT">Tài liệu</option>
            </Select>
            <div className="ml-auto flex items-center">
              <Icon
                icon="tabler:filter-off"
                width={20}
                className="cursor-pointer transition-transform"
                onClick={resetFilters}
              /> */}
            {/* </div> */}
          </div>
        </div>

        <div>
          <BlogSpinner isLoading={isLoading} />
          <div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell className="cursor-pointer flex items-center">
                  Mã học sinh
                  <Icon
                    onClick={() => handleSortChange('title')}
                    icon={
                      sort.title === SortType.ASC
                        ? 'solar:arrow-up-outline'
                        : 'solar:arrow-down-outline'
                    }
                    width={16}
                    className="ml-2"
                  />
                </Table.HeadCell>
                <Table.HeadCell>Tên học sinh</Table.HeadCell>
                <Table.HeadCell>Trường học</Table.HeadCell>
                <Table.HeadCell>Lớp học</Table.HeadCell>
                <Table.HeadCell>SĐT liên lạc</Table.HeadCell>
                <Table.HeadCell>Thao tác</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-border dark:divide-darkborder">
                {students.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell className="whitespace-nowrap ps-6">
                      <div className="flex gap-3 items-center group relative">
                        <div
                          className="truncat line-clamp-2 sm:text-wrap max-w-56 cursor-pointer"
                          onClick={() =>
                            router.push(`/admin/ui/student/detail/${item.id}`)
                          }
                        >
                          <Badge color={'indigo'}>{item.code}</Badge>
                        </div>
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      <h5 className="text-base text-wrap">{item.name}</h5>
                    </Table.Cell>
                    <Table.Cell>
                      <h5 className="text-base text-wrap">
                        {item.additional_student_data?.school}
                      </h5>
                    </Table.Cell>
                    <Table.Cell>
                      <h5 className="text-base text-wrap">
                        {item.additional_student_data?.class}
                      </h5>
                    </Table.Cell>
                    <Table.Cell>
                      <h5 className="text-base text-wrap">
                        {item.additional_student_data?.first_contact_tel}
                      </h5>
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
                            className="flex gap-3 pointer-events-auto"
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

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".xls,.xlsx"
          onChange={handleFileUpload}
        />

        <StudentExcelModal
          studentData={formattedData}
          isOpen={isExcelImported}
          onClose={() => setIsExcelImported(false)}
          onConfirm={handleSubmitImport}
        ></StudentExcelModal>
      </div>
    </>
  );
};

export default StudentList;
