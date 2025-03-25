'use client';
import BlogImage from '@/app/admin/components/dashboard/BlogImage';
import BlogSpinner from '@/app/admin/components/dashboard/BlogSpinner';
import { ConfirmModal } from '@/app/admin/components/dashboard/ConfirmModal';
import { callApi } from '@/app/utils/api';
import { ActionType, SortType } from '@/app/utils/constant';
import { formattedDate, processGoogleDriveLink } from '@/app/utils/utils';
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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
const BlogList = () => {
  const [isLoading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
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
    title: '',
    author_name: '',
    from_created_at: '',
    to_created_at: '',
    is_approved: '',
    type: '',
  });
  const [tempFilters, setTempFilters] = useState(filters);

  const fetchBlogs = async () => {
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

      const response = await callApi(`blogs?${query}`);
      setBlogs(response.data);
      setTotalItems(response.meta.total);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, pageSize, filters, sort, isModalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAction = (item, id) => {
    if (item.action === ActionType.UPDATE) {
      router.push(`/admin/ui/blog/update/${id}`);
    } else if (item.action === ActionType.DETAIL) {
      router.push(`/admin/ui/blog/detail/${id}`);
    } else if (item.action === ActionType.DELETE) {
      setSelectedId(id);
      setIsModalOpen(true);
    }
  };
  const handleDelete = async () => {
    try {
      setLoading(true);
      await callApi(`blogs/${selectedId}`, 'DELETE');
      notify('Xóa bài viết thành công', 'success');
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
  const resetFilters = () => {
    setFilters({
      title: '',
      author_name: '',
      from_created_at: '',
      to_created_at: '',
      is_approved: '',
      type: '',
    });
    setTempFilters({
      title: '',
      author_name: '',
      from_created_at: '',
      to_created_at: '',
      is_approved: '',
      type: '',
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
      case 'POST':
        return 'Bài viết';
      case 'DOCUMENT':
        return 'Tài liệu';
      default:
        return 'Không xác định';
    }
  };
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'POST':
        return 'warning';
      case 'DOCUMENT':
        return 'secondary';
      default:
        return 'error';
    }
  };

  const getApprovalBadgeColor = (isApprove: boolean) => {
    return isApprove ? 'success' : 'error';
  };

  const getApprovalBadgeText = (isApprove: boolean) => {
    return isApprove ? 'Đã duyệt' : 'Chưa duyệt';
  };

  return (
    <>
      <div className="rounded-lg dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          <h5 className="card-title text-xl font-bold text-gray-900">
            Danh sách bài viết
          </h5>
          <Link
            href="blog/add"
            className="bg-primary hover:bg-primary-dark text-white text-sm px-4 py-2 rounded-md transition flex items-center gap-2 hover:shadow-lg group"
          >
            <Icon
              icon="solar:add-circle-outline"
              width={20}
              className="transition-transform group-hover:rotate-90"
            />
            Tạo mới
          </Link>
        </div>
        <div>
          <div className="flex gap-3 mb-4 ">
            <TextInput
              placeholder="Tìm tiêu đề"
              value={tempFilters.title}
              onChange={(e) => handleFilterChange('title', e.target.value)}
            />

            <TextInput
              placeholder="Tìm tác giả"
              value={tempFilters.author_name}
              onChange={(e) =>
                handleFilterChange('author_name', e.target.value)
              }
            />
            <Datepicker
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

            <Datepicker
              placeholder="Ngày chỉnh sửa"
              value={tempFilters.to_created_at}
              onSelectedDateChanged={(date) => {
                if (date) {
                  handleFilterChange(
                    'to_created_at',
                    date.toISOString().split('T')[0]
                  );
                }
              }}
            />
            <Select
              value={tempFilters.type}
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
              />
            </div>
          </div>
        </div>

        <div>
          <BlogSpinner isLoading={isLoading} />
          <div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell className="cursor-pointer flex items-center">
                  Tiêu đề
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
                <Table.HeadCell>Tác giả</Table.HeadCell>
                <Table.HeadCell>Loại</Table.HeadCell>
                <Table.HeadCell>Ngày viết</Table.HeadCell>
                <Table.HeadCell className="cursor-pointer flex items-center">
                  Sửa đổi lần cuối
                  <Icon
                    onClick={() => handleSortChange('created_at')}
                    icon={
                      sort.created_at === SortType.ASC
                        ? 'solar:arrow-up-outline'
                        : 'solar:arrow-down-outline'
                    }
                    width={16}
                    className="ml-2"
                  />
                </Table.HeadCell>

                <Table.HeadCell>Trạng thái</Table.HeadCell>
                <Table.HeadCell>Thao tác</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-border dark:divide-darkborder">
                {blogs.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell className="whitespace-nowrap ps-6">
                      <div className="flex gap-3 items-center group relative">
                        <BlogImage
                          thumbnail_url={processGoogleDriveLink(
                            item.thumbnail_url
                          )}
                          title={undefined}
                        />

                        <div
                          className="truncat line-clamp-2 sm:text-wrap max-w-56 cursor-pointer"
                          onClick={() =>
                            router.push(`/admin/ui/blog/detail/${item.id}`)
                          }
                        >
                          <h6 className="text-sm">{item.title}</h6>
                        </div>
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      <h5 className="text-base text-wrap">
                        {item.author.name}
                      </h5>
                      <div className="text-sm font-medium text-dark opacity-70 mb-2 text-wrap">
                        {item.author.role}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={`light${getBadgeColor(item.type)}`}
                        className={`text-${getBadgeColor(item.type)} text-md py-1`}
                      >
                        {getBadgeInfo(item.type)}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <h5 className="text-base text-wrap">
                        {formattedDate(item.created_at)}
                      </h5>
                    </Table.Cell>
                    <Table.Cell>
                      <h5 className="text-base text-wrap">
                        {formattedDate(item.updated_at)}
                      </h5>
                    </Table.Cell>

                    <Table.Cell>
                      <Badge
                        color={`light${getApprovalBadgeColor(item.is_approved)}`}
                        className={`text-${getApprovalBadgeColor(item.is_approved)} text-md py-1`}
                      >
                        {getApprovalBadgeText(item.is_approved)}
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
      </div>
    </>
  );
};

export default BlogList;
