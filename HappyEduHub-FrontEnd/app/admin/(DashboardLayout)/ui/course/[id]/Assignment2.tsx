import { callApi } from '@/app/utils/api';
import {
  AssignmentType,
  assignmentTypeBadge,
  courseMemberStatusBadgeColors,
  RoleType,
} from '@/app/utils/constant';
import { Badge, Button, Card, Spinner, Table } from 'flowbite-react';
import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { ConfirmModal } from '@/app/admin/components/dashboard/ConfirmModal';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { notify } from '@/components/Alert/Alert';
import { Icon } from '@iconify/react';
import { IconButton, Link, Tooltip } from '@mui/material';
import AddScoreModal from './AddScoreModal';
import AddAssignmentModal from './AddAssignmentModal';
import { getCurrentUserRole } from '@/app/utils/utils';
import DetailScoreModal from './DetailScoreModal';
import BlogSpinner from '@/app/admin/components/dashboard/BlogSpinner';

const Assignment2 = (props: any) => {
  const role = getCurrentUserRole();
  const { id } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAssignments, setSelectedAssignments] = useState(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addScoreModalId, setAddScoreModalId] = useState<number | null>(null);
  const [detailScoreModalId, setDetailScoreModalId] = useState<number | null>(null);
  const [isAddAssignmentModalOpen, setIsAddAssignmentModalOpen] =
    useState(false);

  const handleDelete = async () => {
    try {
      await Promise.all(
        Array.from(selectedAssignments).map(async (assignmentId) => {
          await callApi(`assignment/course/${id}/${assignmentId}`, 'DELETE');
        })
      );
      fetchData();
      notify('Xóa bài thành công', 'success');
    } catch (error) {
      notify('Xóa thành viên thất bại', 'error');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await callApi(`assignment/course/${id}`, 'GET');
      res.data = res.data.filter((tag) => tag.assignment_type == "TAILIEU")
      const finalAssignments = [];
      if (role !== RoleType.STUDENT) {
        await Promise.all(
          res.data.map(async (assignment: any) => {
            const scoreRes = await callApi(
              `scores/assignment/${assignment.id}`,
              'GET'
            );
            finalAssignments.push({ ...assignment, score: scoreRes });
          })
        );
      } else {
        finalAssignments.push(...res.data);
      }
      setAssignments(finalAssignments);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check if all members are selected
  const isAllSelected = useMemo(
    () =>
      assignments.length > 0 && selectedAssignments.size === assignments.length,
    [assignments, selectedAssignments]
  );

  // Check if some members are selected (for indeterminate state)
  const isIndeterminate = useMemo(
    () =>
      selectedAssignments.size > 0 &&
      selectedAssignments.size < assignments.length,
    [assignments, selectedAssignments]
  );

  // Toggle individual checkbox
  const handleCheckboxChange = (assignmentId: any) => {
    setSelectedAssignments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(assignmentId)) {
        newSet.delete(assignmentId);
      } else {
        newSet.add(assignmentId);
      }
      return newSet;
    });
  };

  // Toggle "Select All" checkbox
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedAssignments(new Set()); // Unselect all
    } else {
      setSelectedAssignments(
        new Set(assignments.map((assignment) => assignment.id))
      ); // Select all
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Card>
      <div className="max-h-96 overflow-y-auto gap-4">
        {' '}
        <BlogSpinner isLoading={loading}></BlogSpinner>
        <div className="flex justify-end">
          {role !== RoleType.STUDENT && (
            <Button color="failure" onClick={() => setIsDeleteModalOpen(true)}>
              <DeleteIcon /> Xóa tài liệu
            </Button>
          )}
          {role !== RoleType.STUDENT && (
            <Button
              color="success"
              onClick={() => setIsAddAssignmentModalOpen(true)}
            >
              <AddIcon /> Thêm tài liệu
            </Button>
          )}
        </div>
        <Table>
          <Table.Head className="sticky top-0 z-10 bg-white">
            {role !== RoleType.STUDENT && (
              <Table.HeadCell className="p-4 w-12">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={handleSelectAll}
                />
              </Table.HeadCell>
            )}
            <Table.HeadCell className="w-16 text-md text-center">
              STT
            </Table.HeadCell>
            <Table.HeadCell className="flex-grow text-md">
              Tên tài liệu
            </Table.HeadCell>
            <Table.HeadCell className="flex-grow text-md">
              Loại tài liệu
            </Table.HeadCell>
            <Table.HeadCell className="flex-grow text-md">
              Ghi chú
            </Table.HeadCell>
            <Table.HeadCell className="flex text-md justify-center">
              File đề
            </Table.HeadCell>
            {role !== RoleType.STUDENT && (
              <Table.HeadCell className="w-32 text-md text-center">
                Thao tác
              </Table.HeadCell>
            )}
          </Table.Head>
          <Table.Body>
            {assignments?.map((assignment, index) => (
              <Table.Row key={assignment?.id}>
                {role !== RoleType.STUDENT && (
                  <Table.Cell className="px-4 py-2 w-12">
                    <Checkbox
                      checked={selectedAssignments.has(assignment?.id)}
                      onChange={() => handleCheckboxChange(assignment?.id)}
                    />
                  </Table.Cell>
                )}
                <Table.Cell className="w-16 text-center">
                  {index + 1}
                </Table.Cell>
                <Table.Cell className="flex-grow">
                  {assignment?.name}
                </Table.Cell>
                <Table.Cell className="flex-grow">
                  <Badge
                    color={assignmentTypeBadge[assignment?.assignment_type]}
                    className="inline-flex items-center w-fit whitespace-nowrap"
                  >
                    Tài liệu
                  </Badge>
                </Table.Cell>
                <Table.Cell className="flex-grow">
                  {assignment?.note}
                </Table.Cell>
                <Table.Cell className="flex-grow">
                <Table.Cell className="flex justify-center">
                    <Link
                      href={assignment?.exam?.drive_url ?? '#'}
                      className="!text-primary underline flex gap-1 items-center"
                      target="_blank"
                    >
                      <Icon className="text-lg" icon="logos:google-drive" />
                      <span className="text-sm">Google Drive</span>
                    </Link>
                  </Table.Cell>
                </Table.Cell>
                  <Table.Cell className="text-center">
                    <Tooltip title="Kết quả bài làm">
                        <IconButton
                          onClick={() =>
                            setDetailScoreModalId(
                              Number.parseInt(assignment?.id.toString())
                            )
                          }
                        >
                          <Icon
                            icon="solar:notes-outline"
                            className="text-blue-500"
                            fontSize={24}
                          />
                        </IconButton>
                      </Tooltip>
                  {(role === RoleType.ACADEMIC_AFFAIR || role === RoleType.TEACHER || role === RoleType.ADMIN) && (
                    <Tooltip title="Nhập điểm">
                      <IconButton
                        onClick={() =>
                          setAddScoreModalId(
                            Number.parseInt(assignment?.id.toString())
                          )
                        }
                      >
                        <Icon
                          icon="famicons:enter-outline"
                          className="text-blue-500"
                          fontSize={24}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <ConfirmModal
        type="delete"
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
      <AddAssignmentModal
        isOpen={isAddAssignmentModalOpen}
        onClose={() => setIsAddAssignmentModalOpen(false)}
        reloadData={fetchData}
        mode={2}
      />
      <AddScoreModal
        isOpen={addScoreModalId}
        onClose={() => setAddScoreModalId(null)}
        reloadData={fetchData}
      />
      <DetailScoreModal
        isOpen={detailScoreModalId}
        onClose={() => setDetailScoreModalId(null)}
        reloadData={fetchData}
      />
    </Card>
  );
};

export default Assignment2;
