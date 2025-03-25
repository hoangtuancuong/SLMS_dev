'use client'
import Header from "@/app/admin/components/dashboard/Header";
import { callApi } from "@/app/utils/api";
import { formattedDate } from "@/app/utils/utils";
import { Checkbox, Collapse, IconButton, Tooltip } from "@mui/material";
import { Button, Card, Pagination, Spinner, Table, TextInput } from "flowbite-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { debounce } from 'lodash';
import { CourseMemberStatus } from "@/app/utils/constant";
import { notify } from "@/components/Alert/Alert";

const EnrollRequest = () => {

    const [enroll, setEnroll] = useState(null);
    const [selectedMembers, setSelectedMembers] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCourses, setTotalCourses] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        code: '',
        name: '',
        email: '',
        course_id: '',
        course_name: '',
    });
    const [tempFilters, setTempFilters] = useState(filters);

    const fetchData = async () => {
        try {
            const filterParams = Object.entries(filters)
                .filter(([_, value]) => value !== '')
                .map(([key, value]) => `filter[${key}]=${encodeURIComponent(value)}`)
                .join('&');
            const offset = (currentPage - 1) * pageSize;
            setLoading(true);
            const res = await callApi(`enroll-request?offset=${offset}&limit=${pageSize}&${filterParams}`, "GET");
            setEnroll(res.data);
            setTotalCourses(res.meta.total);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const approveEnroll = async () => {
        const params = {
            ids: [...selectedMembers],
            status: CourseMemberStatus.APPROVED,
        }
        try {
            await callApi(`members/review-enroll-request`, "POST", params);
            setSelectedMembers(new Set());
            notify("Duyệt đăng ký khóa học thành công", "success");
            fetchData();
        } catch (error) {
            notify("Duyệt đăng ký khóa học thất bại", "error");
        }
    }

    const rejectEnroll = async () => {
        const params = {
            ids: [...selectedMembers],
            status: CourseMemberStatus.REJECTED,
        }
        try {
            await callApi(`members/review-enroll-request`, "POST", params);
            setSelectedMembers(new Set());
            notify("Từ chối đăng ký khóa học thành công", "success");
            fetchData();
        } catch (error) {
            notify("Từ chối đăng ký khóa học thất bại", "error");
        }
    }

    useEffect(() => {
        fetchData();
    }, [currentPage, filters]) // eslint-disable-line react-hooks/exhaustive-deps

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
            email: '',
            course_id: '',
            course_name: '',
        });
        setTempFilters({
            code: '',
            name: '',
            email: '',
            course_id: '',
            course_name: '',
        });
        setCurrentPage(1);
    };

    const isAllSelected = useMemo(
        () =>
            enroll?.length > 0 &&
            selectedMembers.size === enroll?.length,
        [enroll, selectedMembers]
    );

    const isIndeterminate = useMemo(
        () =>
            selectedMembers.size > 0 &&
            selectedMembers.size < enroll.length,
        [enroll, selectedMembers]
    );

    const handleCheckboxChange = (memberId: any) => {
        setSelectedMembers((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(memberId)) {
                newSet.delete(memberId);
            } else {
                newSet.add(memberId);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedMembers(new Set());
        } else {
            setSelectedMembers(
                new Set(
                    enroll
                        .map((item: any) => item?.id)
                )
            );
        }
    };

    return (
        <Card>
            <Header title="Yêu cầu duyệt đăng ký khóa học" icon="solar:bill-check-bold" />
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <Spinner />
                </div>
            ) : (
                <>
                    <div>
                        <div className="flex justify-end gap-2">
                            {selectedMembers.size !== 0 && <h5 className="text-sm text-gray-500 mt-2">Đã chọn {selectedMembers.size} học sinh</h5>}
                            <Button disabled={selectedMembers.size === 0} color="lightsuccess" onClick={approveEnroll}>Duyệt</Button>
                            <Button disabled={selectedMembers.size === 0} color="lighterror" onClick={rejectEnroll}>Từ chối</Button>
                            <Tooltip title="Lọc">
                                <IconButton onClick={() => setShowFilters(!showFilters)}>
                                    <FilterListIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <Collapse in={showFilters}>
                            <div className="flex gap-2 mb-4 mt-4">
                                <TextInput
                                    placeholder="Tìm theo mã học sinh"
                                    value={tempFilters.code}
                                    onChange={(e) => handleFilterChange('code', e.target.value)}
                                    className="flex-1"
                                />
                                <TextInput
                                    placeholder="Tìm theo tên học sinh"
                                    value={tempFilters.name}
                                    onChange={(e) => handleFilterChange('name', e.target.value)}
                                    className="flex-1"
                                />
                                <TextInput
                                    placeholder="Tìm theo email"
                                    value={tempFilters.email}
                                    onChange={(e) => handleFilterChange('email', e.target.value)}
                                    className="flex-1"
                                />
                                <TextInput
                                    placeholder="Tìm theo mã khóa học"
                                    value={tempFilters.course_id}
                                    onChange={(e) => handleFilterChange('course_id', e.target.value)}
                                    className="flex-1"
                                />
                                <TextInput
                                    placeholder="Tìm theo tên khóa học"
                                    value={tempFilters.course_name}
                                    onChange={(e) => handleFilterChange('course_name', e.target.value)}
                                    className="flex-1"
                                />
                                <Tooltip title="Xóa bộ lọc">
                                    <IconButton onClick={clearFilters}>
                                        <RestartAltIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </Collapse>
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>
                                    <Checkbox
                                        checked={isAllSelected}
                                        indeterminate={isIndeterminate}
                                        onChange={handleSelectAll}
                                    />
                                </Table.HeadCell>
                                <Table.HeadCell>Mã học sinh</Table.HeadCell>
                                <Table.HeadCell>Họ tên</Table.HeadCell>
                                <Table.HeadCell>Email</Table.HeadCell>
                                <Table.HeadCell>Mã khóa học</Table.HeadCell>
                                <Table.HeadCell>Tên khóa học</Table.HeadCell>
                                <Table.HeadCell>Ngày đăng ký</Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                {enroll?.map((item: any) => (
                                    <Table.Row key={item?.id}>
                                        <Table.Cell>
                                            <Checkbox
                                                checked={selectedMembers.has(item?.id)}
                                                onChange={() => handleCheckboxChange(item?.id)}
                                            />
                                        </Table.Cell>
                                        <Table.Cell>{item?.user?.code}</Table.Cell>
                                        <Table.Cell>{item?.user?.name}</Table.Cell>
                                        <Table.Cell>{item?.user?.email}</Table.Cell>
                                        <Table.Cell className="text-center">{item?.course_id}</Table.Cell>
                                        <Table.Cell>{item?.course?.name}</Table.Cell>
                                        <Table.Cell>{formattedDate(item?.created_at)}</Table.Cell>
                                    </Table.Row>
                                ))}
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
                    </div>
                </>
            )}
        </Card>
    )
}

export default EnrollRequest;
