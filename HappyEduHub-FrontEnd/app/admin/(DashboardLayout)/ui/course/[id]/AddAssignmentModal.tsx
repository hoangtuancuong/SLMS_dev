import {
  Badge,
  Button,
  Datepicker,
  Modal,
  Select,
  Spinner,
  Table,
  TextInput,
} from 'flowbite-react';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Checkbox, Chip, MenuItem } from '@mui/material';
import { useParams } from 'next/navigation';
import { callApi } from '@/app/utils/api';
import {
  AssignmentType,
  courseMemberStatusBadgeColors,
  ExamType,
  examTypeBadge,
} from '@/app/utils/constant';
import { notify } from '@/components/Alert/Alert';
import { debounce } from 'lodash';
import { Icon } from '@iconify/react';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { formattedDate } from '@/app/utils/utils';

const AddAssignmentModal = (props: any) => {
  const { id } = useParams();
  const { isOpen, onClose, reloadData, mode } = props;
  const [selectedExam, setSelectedExam] = useState(null);
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [assignmentName, setAssignmentName] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [assignmentType, setAssignmentType] = useState<AssignmentType | null>(
    null
  );

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const examResponse = await callApi('exam/get-all?limit=100', 'GET', null);
      const allTeachersIds = Array.from(
        new Set(examResponse.data.map((exam) => exam.teacher_id))
      );
      const teachers = await Promise.all(
        allTeachersIds.map(async (teacherId) => {
          const teacherResponse = await callApi(
            `user/${teacherId}`,
            'GET',
            null,
            null
          );
          return teacherResponse;
        })
      );
      const finalExams = examResponse.data.map((exam) => {
        const teacher = teachers.find(
          (teacher) => teacher.id === exam.teacher_id
        );
        return { ...exam, teacher: teacher };
      });
      setExams(finalExams);
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
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Toggle individual checkbo

  const handleAddAssignment = async () => {
    setIsLoading(true)
    console.log(assignmentName)
    const params = {
        course_id: id,
        name: assignmentName,
        start_date: startDate,
        end_date: endDate,
        assignment_type: assignmentType,
        exam_id: selectedExam.id,
    }
    try {
        await callApi(`assignment`, "POST", params);
        notify("Thêm tài nguyên thành công", "success");
        onClose();
        reloadData();
        setIsLoading(false);
    } catch (error) {
        notify("Thêm tài nguyên thất bại", "error");
        setIsLoading(false);
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal show={isOpen} onClose={onClose} size="7xl">
        <Modal.Header>Thêm bài tập</Modal.Header>
        <Modal.Body>
          <div className="flex h-12 items-stretch justify-start gap-4">
            <TextInput
              className="h-12"
              placeholder="Tên bài tập"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
            />
            <Datepicker
              className="h-12"
              value={formattedDate(startDate)}
              onSelectedDateChanged={(e) => setStartDate(new Date(e))}
            />
            <Datepicker
              className="h-12"
              value={formattedDate(endDate)}
              onSelectedDateChanged={(e) => setEndDate(new Date(e))}
            />
            <Select
              className="w-1/6"
              value={assignmentType}
              onChange={(e) =>
                setAssignmentType(e.target.value as AssignmentType)
              }
              required
            >
              <option value={null}>Chọn loại bài tập</option>
              {mode == 1 && (
                <><option value={AssignmentType.EXCERCISE}>Bài tập</option><option value={AssignmentType.TEST}>Bài kiểm tra</option></>
              )}
              {mode == 2 && (
                <option value={AssignmentType.TAILIEU}>Tài liệu</option>
              )}
            </Select>
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
                  <Table.HeadCell className="flex-grow text-md">
                    Mã học sinh
                  </Table.HeadCell>
                  <Table.HeadCell className="flex-grow text-md">
                    Email
                  </Table.HeadCell>
                  <Table.HeadCell className="w-32 text-md text-center">
                    Trạng thái
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {exams.map((exam: any, index: number) => (
                    <Table.Row
                      key={index}
                      className={`${selectedExam?.id === exam.id ? 'bg-blue-200' : ''} hover:bg-blue-100 cursor-pointer`}
                      onClick={() => setSelectedExam(exam)}
                    >
                      <Table.Cell>
                        <h5 className="text-sm text-wrap font-bold">
                          {exam.name}
                        </h5>
                      </Table.Cell>
                      <Table.Cell>
                        <h5 className="text-sm text-wrap font-bold">
                          {exam.teacher.name}
                        </h5>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          color={examTypeBadge[exam.exam_type]}
                          size={'small'}
                        >
                          {exam.exam_type === ExamType.ASSIGNMENT
                            ? 'Bài Tập'
                            : (exam.exam_type === ExamType.ENTRY_EXAM?"Kiểm tra":"Tài liệu")}
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
          <Button color="success" onClick={handleAddAssignment}>
            <AddIcon />
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </LocalizationProvider>
  );
};

export default AddAssignmentModal;
