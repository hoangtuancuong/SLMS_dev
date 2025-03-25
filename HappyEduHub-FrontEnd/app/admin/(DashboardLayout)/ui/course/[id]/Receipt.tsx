import { callApi } from '@/app/utils/api';
import { courseMemberStatusBadgeColors, RoleType } from '@/app/utils/constant';
import { Badge, Button, Card, Spinner, Table } from 'flowbite-react';
import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { notify } from '@/components/Alert/Alert';
import { Icon } from '@iconify/react';
import { IconButton, Link, Tooltip } from '@mui/material';
import { formattedDate, getCurrentUserRole, getUserData } from '@/app/utils/utils';
import AddReceiptModal from './AddRecepitModal';
import { ConfirmModal } from '@/app/admin/components/dashboard/ConfirmModal';
import PaymentListModal from './PaymentList';

interface Shift {
  id: number;
  course_id: number;
  day: number;
  shift: number;
  room: string;
}

interface Tag {
  id: number;
  name: string;
  type: string;
  note: string;
  code_fragment: string;
  created_at: string;
  updated_at: string;
}

interface Teacher {
  id: number;
  name: string;
  role: string;
  avatar_url: string;
}

interface Course {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  fee: number;
  shifts: Shift[];
  tags: Tag[];
  teacher: Teacher;
  is_approved: boolean;
  is_private: boolean;
  is_generated: boolean;
  code: string;
  created_at: string;
  updated_at: string;
}

interface Receipt {
  id: number;
  course: Course;
  name: string;
  amount: number;
  deadline: string;
  document_url: string;
  note: string;
  created_at: string;
  updated_at: string;
}

const ReceiptList = ({course}) => {
  const role = getCurrentUserRole();
  const { id } = useParams();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReceipts, setSelectedReceipts] = useState(new Set());
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAddReceiptModalOpen, setIsAddReceiptModalOpen] = useState(false);
  const [paymentListModal, setPaymentListModalOpen] = useState(false);
  const [receipt, setReceipt] = useState(false);
  const [transactions, setTransaction] = useState([])

  const isAllSelected = useMemo(
    () => receipts.length > 0 && selectedReceipts.size === receipts.length,
    [receipts, selectedReceipts]
  );

  const isIndeterminate = useMemo(
    () =>
      selectedReceipts.size > 0 &&
      selectedReceipts.size < receipts.length,
    [receipts, selectedReceipts]
  );

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedReceipts(new Set());
    } else {
      const allIds = new Set(receipts.map((receipt) => receipt.id));
      setSelectedReceipts(allIds);
    }
  };

  const handleCheckboxChange = (receiptId) => {
    const newSelected = new Set(selectedReceipts);
    if (newSelected.has(receiptId)) {
      newSelected.delete(receiptId);
    } else {
      newSelected.add(receiptId);
    }
    setSelectedReceipts(newSelected);
  };

  const handleOpenPaymentList = (receipt) => {
    setReceipt(receipt);
    setPaymentListModalOpen(true);
    console.log("test",receipt)
  }

  const handleDelete = async () => {
    
    try {
      await Promise.all(
        Array.from(selectedReceipts).map(async (receiptId) => {
          await callApi(`receipts/${id}`, 'DELETE');
        })
      );
      fetchData();
      notify('Xóa biên lai thành công', 'success');
    } catch (error) {
      notify('Xóa biên lai thất bại', 'error');
    } finally {
      setIsConfirmModalOpen(false);
    }
  };

  const handlePayment = async (receipt) => {
    console.log(receipt)
    const user_id = getUserData().id

    const body = {
      "receipt_id": receipt.id,
      "user_id": user_id,
      "transaction_code": `U${user_id}C${receipt.id}D${new Date()}`,
      "payment_method": "VNPay",
      "amount": receipt.amount,
      "status": "PENDING",
      "raw_response_from_gateway": "{}",
      "note": `${receipt.id}`,
      "paid_at": new Date()
    }

    try {
      const res = await callApi("transactions", "POST", body)
      
      if (res) {
        const res_vnpay = await callApi("create_payment_url", "POST", {
          amount: receipt.amount,
          transactionId: res.id
        })
        window.location.href = res_vnpay.url
      }
    } catch(error) {
      notify(error.message, "error")
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await callApi(`courses/${id}/receipts`, 'GET');
      const res_transaction = await callApi(`transactions?limit=99`)
      setTransaction(res_transaction.data);
      setReceipts(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const checkReceipt = (id) => {
    if (transactions.find((t) => (t.receipt.id == id && t.user_id == getUserData().id)))
      return true;
    else return false;
  }

  useEffect(() => {
    fetchData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
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
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-xl font-bold">Danh sách biên lai</h5>
          <div className="flex gap-2">
            {role !== RoleType.STUDENT && (
              <>
                <Button
                  color="success"
                  onClick={() => setIsAddReceiptModalOpen(true)}
                >
                  <AddIcon className="mr-2" /> Thêm khoản thu
                </Button>
              </>
            )}
          </div>
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
            <Table.HeadCell className="text-md">
              Tên biên lai
            </Table.HeadCell>
            <Table.HeadCell className="text-md">
              Khóa học
            </Table.HeadCell>
            <Table.HeadCell className="text-md">
              Số tiền
            </Table.HeadCell>
            <Table.HeadCell className="text-md">
              Hạn nộp
            </Table.HeadCell>
            <Table.HeadCell className="text-md">
              Ghi chú
            </Table.HeadCell>
            <Table.HeadCell className="w-32 text-md text-center">
              Thao tác
            </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {receipts.map((receipt, index) => (
              <Table.Row key={receipt.id}>
                {role !== RoleType.STUDENT && (
                  <Table.Cell className="px-4 py-2 w-12">
                    <Checkbox
                      checked={selectedReceipts.has(receipt.id)}
                      onChange={() => handleCheckboxChange(receipt.id)}
                    />
                  </Table.Cell>
                )}
                <Table.Cell className="w-16 text-center">
                  {index + 1}
                </Table.Cell>
                <Table.Cell>
                  {receipt.name}
                </Table.Cell>
                <Table.Cell>
                  {receipt.course.name}
                </Table.Cell>
                <Table.Cell>
                  {formatAmount(receipt.amount)}
                </Table.Cell>
                <Table.Cell>
                  {formattedDate(receipt.deadline)}
                </Table.Cell>
                <Table.Cell>
                  {receipt.note}
                </Table.Cell>
                  <Table.Cell className="text-center">
                    <div className="flex justify-center gap-2">
                    {(role === RoleType.STUDENT  && checkReceipt(receipt.id)) && (
                      <Tooltip title="Thanh toán">
                        <IconButton onClick={() => alert("Khoản thu này bạn đã thanh toán xong")}>
                          <Icon
                            icon="mdi:cash-sync"
                            className="text-green-500"
                            fontSize={24}
                          />
                        </IconButton>
                      </Tooltip>
                    )}
                    {(role === RoleType.STUDENT  && !checkReceipt(receipt.id)) && (
                      <Tooltip title="Thanh toán">
                        <IconButton  onClick={() => handlePayment(receipt)}>
                          <Icon
                            icon="mdi:cash-sync"
                            className="text-green-500"
                            fontSize={24}
                          />
                        </IconButton>
                      </Tooltip>
                    )}
                    {role !== RoleType.STUDENT && (
                      <>
                        <Tooltip title="Danh sách thanh toán">
                          <IconButton onClick={() => handleOpenPaymentList(receipt)}>
                            <Icon
                              icon="mdi:list-status"
                              className="text-blue-500"
                              fontSize={24}
                            />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton onClick={() => {
                            setSelectedReceipts(new Set([receipt.id]));
                            setIsConfirmModalOpen(true);
                          }}>
                            <Icon
                              icon="mdi:delete-outline"
                              className="text-red-500"
                              fontSize={24}
                            />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    </div>
                  </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      
      <AddReceiptModal isOpen={isAddReceiptModalOpen}
        onClose={() => setIsAddReceiptModalOpen(false)}
        reloadData={fetchData}></AddReceiptModal>

      <ConfirmModal
        type="delete"
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDelete}
      />

      <PaymentListModal isOpen={paymentListModal} onClose={() => setPaymentListModalOpen(false)} course={course} receipt={receipt}></PaymentListModal>
    </Card>
  );
};

export default ReceiptList;