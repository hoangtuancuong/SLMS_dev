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
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { callApi } from '@/app/utils/api';
import { notify } from '@/components/Alert/Alert';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { formattedDate } from '@/app/utils/utils';
import { Textarea } from 'flowbite-react';

const AddReceiptModal = (props) => {
  const { id } = useParams();
  const { isOpen, onClose, reloadData } = props;
  const [isLoading, setIsLoading] = useState(false);

  // Receipt fields based on the API
  const [receiptName, setReceiptName] = useState('');
  const [amount, setAmount] = useState(0);
  const [deadline, setDeadline] = useState(new Date());
  const [documentUrl, setDocumentUrl] = useState('');
  const [note, setNote] = useState('');

  const handleAddReceipt = async () => {
    const params = {
      course_id: id,
      name: receiptName,
      amount: amount,
      deadline: deadline.toISOString(),
      document_url: documentUrl,
      note: note
    };

    try {
      setIsLoading(true)
      await callApi(`receipts`, "POST", params);
      notify("Thêm khoản thu thành công", "success");
      onClose();
      reloadData();
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      notify("Thêm khoản thu thất bại", "error");
    }
  };

  // Clear form data when modal opens
  useEffect(() => {
    if (isOpen) {
      setReceiptName('');
      setAmount(0);
      setDeadline(new Date());
      setDocumentUrl('');
      setNote('');
    }
  }, [isOpen]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal show={isOpen} onClose={onClose} size="3xl">
        <Modal.Header>Thêm khoản thu</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Tên khoản thu</label>
              <TextInput
                placeholder="Tên khoản thu"
                value={receiptName}
                onChange={(e) => setReceiptName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Số tiền</label>
              <TextInput
                type="number"
                placeholder="Số tiền"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))}
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Hạn nộp</label>
              <Datepicker
                value={formattedDate(deadline)}
                onSelectedDateChanged={(e) => setDeadline(new Date(e))}
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Đường dẫn tài liệu (nếu có)</label>
              <TextInput
                placeholder="Đường dẫn tài liệu"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Ghi chú</label>
              <Textarea
                placeholder="Ghi chú"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button color="gray" onClick={onClose}>
            Hủy
          </Button>
          <Button color="success" onClick={handleAddReceipt}>
            <AddIcon className="mr-2" />
            Thêm khoản thu
          </Button>
        </Modal.Footer>
      </Modal>
    </LocalizationProvider>
  );
};

export default AddReceiptModal;