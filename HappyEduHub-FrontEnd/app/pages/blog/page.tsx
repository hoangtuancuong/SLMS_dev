'use client';
import { callApi } from '@/app/utils/api';
import { notify } from '@/components/Alert/Alert';
import SingleBlog from '@/components/Blog/SingleBlog';
import Breadcrumb from '@/components/Common/Breadcrumb';
import { Icon } from '@iconify/react';
import { Datepicker, Pagination, Select, TextInput } from 'flowbite-react';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    title: '',
    author_name: '',
    from_created_at: '',
    to_created_at: '',
    is_approved: 'true',
    type: '',
  });
  const [tempFilters, setTempFilters] = useState(filters);
  useEffect(() => {
    fetchBlogs();
  }, [filters, pageSize, currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const filterParams = Object.entries(filters)
        .filter(([_, value]) => value !== '')
        .map(([key, value]) => `filter[${key}]=${encodeURIComponent(value)}`)
        .join('&');

      //  const sortParams = Object.entries(sort)
      //    .map(([key, value]) => `sort[${key}]=${value}`)
      //    .join('&');

      const query = `limit=${pageSize}&offset=${(currentPage - 1) * pageSize}&${filterParams}`;

      const response = await callApi(`blogs?${query}`);
      setBlogs(response.data);
      setTotalItems(response.meta.total);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
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

  return (
    <>
      <Breadcrumb
        pageName="Bài viết trao đổi"
        description="Các bài viết là những chia sẻ về kiến thức của các giáo viên cũng là nơi giáo viên và học sinh chia sẻ, trao đổi kiến thức cùng nhau.
         Chúng tôi luôn khuyến khích chia sẻ các kiến thức, kinh nghiệm thu được qua quá trình giảng dạy của mình nhằm mục tiêu đào tạo các em học sinh một cách tốt nhất."
      />

      <section className="pb-[30px]  pt-1">
        <div className="container">
          <div className="mb-6 flex flex-wrap gap-4">
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
          <hr className="border-gray-300 mb-6" />

          <div className="-mx-4 mt-6 flex flex-wrap justify-center">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3 border-b  pb-4 mb-4"
              >
                <SingleBlog blog={blog} />
              </div>
            ))}
          </div>
          <hr className="border-gray-300 border-double mb-6" />
        </div>
      </section>

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
      </div>
    </>
  );
};

export default Blog;
