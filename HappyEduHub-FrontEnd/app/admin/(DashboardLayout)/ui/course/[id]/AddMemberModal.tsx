import {
  Badge,
  Button,
  Modal,
  Spinner,
  Table,
  TextInput,
} from 'flowbite-react';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Checkbox, Chip, MenuItem, Select } from '@mui/material';
import { useParams } from 'next/navigation';
import { callApi } from '@/app/utils/api';
import { courseMemberStatusBadgeColors } from '@/app/utils/constant';
import { notify } from '@/components/Alert/Alert';
import { debounce } from 'lodash';
import { Icon } from '@iconify/react';

const AddMemberModal = (props: any) => {
  const { id } = useParams();
  const { isOpen, onClose, reloadData } = props;
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState(new Set());
  const [filters, setFilters] = useState({
    code: '',
    name: '',
    email: '',
    status: '',
  });
  const [tempFilters, setTempFilters] = useState(filters);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const filterParams = Object.entries(filters)
        .filter(([_, value]) => value !== '')
        .map(([key, value]) => `filter[${key}]=${value}`)
        .join('&');
      const res = await callApi(
        `courses/${id}/not-members?filter[role]=STUDENT&${filterParams}`,
        'GET'
      );
      setMembers(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // Get only selectable members
  const selectableMembers = useMemo(
    () => members.filter((member) => member.status === null),
    [members]
  );

  // Check if all selectable members are selected
  const isAllSelected = useMemo(
    () =>
      selectableMembers.length > 0 &&
      selectedMembers.size === selectableMembers.length,
    [selectableMembers, selectedMembers]
  );

  // Check if some selectable members are selected (for indeterminate state)
  const isIndeterminate = useMemo(
    () =>
      selectedMembers.size > 0 &&
      selectedMembers.size < selectableMembers.length,
    [selectableMembers, selectedMembers]
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

  // Toggle "Select All" checkbox
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedMembers(new Set()); // Unselect all
    } else {
      setSelectedMembers(
        new Set(
          members
            .filter((member) => member.status === null)
            .map((member) => member?.user?.id)
        )
      ); // Select only those with status === null
    }
  };

  // Remove chip when clicked
  const handleRemoveChip = (memberId: any) => {
    setSelectedMembers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(memberId);
      return newSet;
    });
  };

  const handleAddMember = async () => {
    const params = {
      user_ids: [...selectedMembers],
    };
    try {
      await callApi(`members/${id}/bulk-add`, 'POST', params);
      notify('Thêm thành viên thành công', 'success');
      onClose();
      reloadData();
    } catch (error) {
      notify('Thêm thành viên thất bại', 'error');
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
      email: '',
      status: '',
    });
    setTempFilters({
      code: '',
      name: '',
      email: '',
      status: '',
    });
    debouncedFilterUpdate({
      code: '',
      name: '',
      email: '',
      status: '',
    });
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="7xl">
      <Modal.Header>Thêm thành viên</Modal.Header>
      <Modal.Body>
        <div>
          <div className="flex gap-2">
            <TextInput
              value={tempFilters.code}
              onChange={(e) => handleFilterChange('code', e.target.value)}
              className="w-1/4"
              placeholder="Mã học sinh"
            />
            <TextInput
              value={tempFilters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              className="w-1/4"
              placeholder="Tên học sinh"
            />
            <TextInput
              value={tempFilters.email}
              onChange={(e) => handleFilterChange('email', e.target.value)}
              className="w-1/4"
              placeholder="Email"
            />
            <Select
              value={tempFilters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              displayEmpty
              sx={{ minWidth: 200, height: 40, borderRadius: '10px' }}
            >
              {Object.keys(courseMemberStatusBadgeColors).map((status) => (
                <MenuItem key={status} value={status}>
                  <Badge color={courseMemberStatusBadgeColors[status]}>
                    {status}
                  </Badge>
                </MenuItem>
              ))}
              <MenuItem value="NOT_ENROLLED">
                <Badge color="lightprimary">NOT ENROLLED</Badge>
              </MenuItem>
            </Select>
            <div className="ml-auto flex items-center">
              <Icon
                icon="tabler:filter-off"
                width={20}
                className="cursor-pointer transition-transform"
                onClick={clearFilters}
              />
            </div>
          </div>
          {/* Chip List for Selected Members */}
          <div className="mt-2 flex flex-wrap gap-2">
            {[...selectedMembers].map((memberId) => {
              const member = members.find((m) => m?.user?.id === memberId);
              return (
                <Chip
                  key={member?.user?.id}
                  variant="outlined"
                  color="primary"
                  label={`${member?.user?.code} - ${member?.user?.name}`}
                  onDelete={() => handleRemoveChip(memberId)}
                  sx={{
                    transition: 'color 0.3s, border-color 0.3s',
                    '& .MuiChip-deleteIcon:hover': {
                      color: 'error.main',
                    },
                  }}
                />
              );
            })}
          </div>
        </div>
        {/* Scrollable Table */}
        <div className="max-h-96 overflow-y-auto mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : (
            <Table>
              <Table.Head className="sticky top-0 z-10 bg-white">
                <Table.HeadCell>
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={handleSelectAll}
                  />
                </Table.HeadCell>
                <Table.HeadCell className="flex-grow text-md">
                  Mã học sinh
                </Table.HeadCell>
                <Table.HeadCell className="flex-grow text-md">
                  Tên học sinh
                </Table.HeadCell>
                <Table.HeadCell className="flex-grow text-md">
                  Email
                </Table.HeadCell>
                <Table.HeadCell className="w-32 text-md text-center">
                  Trạng thái
                </Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {members.map((member: any, index: number) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Checkbox
                        checked={selectedMembers.has(member?.user?.id)}
                        onChange={() => handleCheckboxChange(member?.user?.id)}
                        disabled={member?.status !== null}
                      />
                    </Table.Cell>
                    <Table.Cell>{member?.user?.code}</Table.Cell>
                    <Table.Cell>{member?.user?.name}</Table.Cell>
                    <Table.Cell>{member?.user?.email}</Table.Cell>
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
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button color="gray" onClick={onClose}>
          Hủy
        </Button>
        <Button color="success" onClick={handleAddMember}>
          <AddIcon />
          Thêm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddMemberModal;
