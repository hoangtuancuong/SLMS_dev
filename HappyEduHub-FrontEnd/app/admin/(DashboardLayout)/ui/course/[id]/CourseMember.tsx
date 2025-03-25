import { callApi } from '@/app/utils/api';
import { courseMemberStatusBadgeColors, RoleType } from '@/app/utils/constant';
import { Badge, Button, Card, Spinner, Table } from 'flowbite-react';
import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmModal } from '@/app/admin/components/dashboard/ConfirmModal';
import AddMemberModal from './AddMemberModal';
import { notify } from '@/components/Alert/Alert';

const CourseMember = (props: any) => {
  const { role } = props;
  const { id } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const handleDelete = async () => {
    const params = {
      ids: [...selectedMembers],
    };
    try {
      await callApi(`members/${id}/bulk-delete`, 'POST', params);
      notify('Xóa thành viên thành công', 'success');
      fetchData();
    } catch (error) {
      notify('Xóa thành viên thất bại', 'error');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await callApi(
        `courses/${id}/members?pageNoLimit=true&filter[role]=STUDENT`,
        'GET'
      );
      setMembers(res.data);
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
    () => members.length > 0 && selectedMembers.size === members.length,
    [members, selectedMembers]
  );

  // Check if some members are selected (for indeterminate state)
  const isIndeterminate = useMemo(
    () => selectedMembers.size > 0 && selectedMembers.size < members.length,
    [members, selectedMembers]
  );

  // Toggle individual checkbox
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
      setSelectedMembers(new Set()); // Unselect all
    } else {
      setSelectedMembers(new Set(members.map((member) => member.id))); // Select all
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
      {(role === RoleType.ACADEMIC_AFFAIR || role === RoleType.ADMIN) && (
        <div className="flex justify-end gap-2">
          <Button
            color={selectedMembers.size === 0 ? 'lightgray' : 'error'}
            disabled={selectedMembers.size === 0}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <DeleteIcon />
            Xóa
          </Button>
          <Button color="success" onClick={() => setIsAddMemberModalOpen(true)}>
            <AddIcon />
            Thêm thành viên
          </Button>
        </div>
      )}

      <div className="max-h-96 overflow-y-auto">
        <Table>
          <Table.Head className="sticky top-0 z-10 bg-white">
            <Table.HeadCell className="p-4 w-12">
              {role === RoleType.ACADEMIC_AFFAIR && (
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={handleSelectAll}
                />
              )}
            </Table.HeadCell>
            <Table.HeadCell className="w-16 text-md text-center">
              STT
            </Table.HeadCell>
            <Table.HeadCell className="flex-grow text-md">
              Mã học sinh
            </Table.HeadCell>
            <Table.HeadCell className="flex-grow text-md">
              Họ tên
            </Table.HeadCell>
            <Table.HeadCell className="flex-grow text-md">Email</Table.HeadCell>
            <Table.HeadCell className="w-32 text-md text-center">
              Trạng thái
            </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {members?.map((member, index) => (
              <Table.Row key={member?.id}>
                <Table.Cell className="px-4 py-2 w-12">
                  {role === RoleType.ACADEMIC_AFFAIR && (
                    <Checkbox
                      checked={selectedMembers.has(member?.id)}
                      onChange={() => handleCheckboxChange(member?.id)}
                    />
                  )}
                </Table.Cell>
                <Table.Cell className="w-16 text-center">
                  {index + 1}
                </Table.Cell>
                <Table.Cell className="flex-grow">
                  {member?.user?.code}
                </Table.Cell>
                <Table.Cell className="flex-grow">
                  {member?.user?.name}
                </Table.Cell>
                <Table.Cell className="flex-grow">
                  {member?.user?.email}
                </Table.Cell>
                <Table.Cell className="w-32 text-center">
                  <Badge
                    color={courseMemberStatusBadgeColors[member?.status]}
                    className="inline-flex items-center w-fit whitespace-nowrap"
                  >
                    {member?.status}
                  </Badge>
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
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        reloadData={fetchData}
      />
    </Card>
  );
};

export default CourseMember;
