'use client';

import {
  Badge,
  Button,
  Checkbox,
  Datepicker,
  FileInput,
  Modal,
  Select,
  Spinner,
  Table,
  TextInput,
} from 'flowbite-react';
import AddIcon from '@mui/icons-material/Add';
import { AssignmentType, ExamType, examTypeBadge } from '@/app/utils/constant';
import { formattedDate, uploadFile } from '@/app/utils/utils';
import { useState } from 'react';
import { notify } from '@/components/Alert/Alert';
import { callApi } from '@/app/utils/api';

const AddExam = (props: any) => {
  const { isOpen, onClose, reloadData } = props;

  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [examType, setExamType] = useState<ExamType | null>(null);
  const [key, setKey] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddExam = async () => {
    if (!file) {
      notify('Vui lòng chọn file đề kiểm tra', 'error');
      return;
    }

    const fileUrl = await uploadFile(file);

    try {
      setIsAdding(true);
      await callApi(`exam`, 'POST', {
        name: name,
        drive_url: fileUrl.web_view_link,
        is_private: isPrivate,
        exam_type: examType,
        key: key,
      });
      notify('Thêm đề kiểm tra thành công', 'success');
      onClose();
      reloadData();
    } catch (error) {
      notify('Thêm đề kiểm tra thất bại', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="7xl">
      <Modal.Header>Thêm đề kiểm tra</Modal.Header>
      <Modal.Body>
        <div className="flex items-center mb-4">
          <TextInput
            className="flex-1 mr-4"
            placeholder="Tên đề kiểm tra"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
          <Checkbox
            className="mr-1"
            checked={!isPrivate}
            onChange={(e) => setIsPrivate(!e.target.checked)}
          />
          <span className="mr-4">Đề công khai</span>
        </div>
        <div className="flex items-center mb-4">
        <FileInput
            className="flex-1 mr-4"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Select
            className="flex-1"
            value={examType}
            onChange={(e) => setExamType(e.target.value as ExamType)}
          >
            <option value={null}>Chọn loại đề</option>
            <option value={ExamType.ASSIGNMENT}>Bài tập</option>
            <option value={ExamType.ENTRY_EXAM}>Bài KT đầu vào</option>
            <option value={ExamType.TAILIEU}>Tài liệu</option>
          </Select>
        </div>
        <TextInput
          placeholder="Đáp án của đề"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button color="gray" onClick={onClose}>
          Hủy
        </Button>
        <Button color="success" onClick={handleAddExam} disabled={isAdding}>
          <AddIcon />
          Thêm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddExam;
