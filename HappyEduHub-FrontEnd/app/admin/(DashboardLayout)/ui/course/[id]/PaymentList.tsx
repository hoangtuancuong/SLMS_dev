import { callApi } from '@/app/utils/api';
import { Badge, Button, Modal, Spinner, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';

const PaymentListModal = ({ isOpen, onClose, course, receipt }) => {
  const [studentsWithPaymentStatus, setStudentsWithPaymentStatus] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!course?.id || !receipt?.id) return;
    
    try {
      setLoading(true);
      
      const membersRes = await callApi(
        `courses/${course.id}/members?limit=99&filter[role]=STUDENT`,
        'GET'
      );
      
      const transactionsRes = await callApi(
        `receipts/${receipt.id}/transactions?limit=99`,
        'GET'
      );
      
      const members = membersRes.data || [];
      const transactions = transactionsRes.data || [];
      
      const paymentStatusMap = {};
      transactions.forEach(transaction => {
        console.log(transaction)
        if (transaction.status == 'SUCCESS' && transaction.user_id) {
          paymentStatusMap[transaction.user_id] = true;
        }
      });
      
      const processedStudents = members.map(member => {
        const userId = member?.user?.id;
        const isPaid = !!paymentStatusMap[userId];
        
        return {
          ...member,
          paymentStatus: {
            isPaid,
            text: isPaid ? 'Đã thanh toán' : 'Chưa thanh toán',
            color: isPaid ? 'success' : 'warning'
          }
        };
      });
      
      setStudentsWithPaymentStatus(processedStudents);
    } catch (error) {
      console.error("Error fetching data:", error);
      setStudentsWithPaymentStatus([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, course?.id, receipt?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl">
      <Modal.Header>Trạng thái thanh toán</Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="flex justify-center items-center p-4">
            <Spinner />
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <Table.Head className="sticky top-0 z-10 bg-white">  
                <Table.HeadCell className="w-12 text-md text-center">
                  STT
                </Table.HeadCell>
                <Table.HeadCell className="flex-grow text-md">
                  Mã học sinh
                </Table.HeadCell>
                <Table.HeadCell className="flex-grow text-md">
                  Họ tên
                </Table.HeadCell>
                <Table.HeadCell className="flex-grow text-md">
                  Email
                </Table.HeadCell>
                <Table.HeadCell className="w-32 text-md text-center">
                  Thanh toán
                </Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {studentsWithPaymentStatus.length > 0 ? (
                  studentsWithPaymentStatus.map((student, index) => (
                    <Table.Row key={student?.id || index}>
                      <Table.Cell className="w-12 text-center">
                        {index + 1}
                      </Table.Cell>
                      <Table.Cell className="flex-grow">
                        {student?.user?.code || ''}
                      </Table.Cell>
                      <Table.Cell className="flex-grow">
                        {student?.user?.name || ''}
                      </Table.Cell>
                      <Table.Cell className="flex-grow">
                        {student?.user?.email || ''}
                      </Table.Cell>
                      <Table.Cell className="w-32 text-center">
                        <Badge
                          color={student.paymentStatus.color}
                          className="inline-flex items-center w-fit whitespace-nowrap"
                        >
                          {student.paymentStatus.text}
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={5} className="text-center py-4">
                      Không có dữ liệu
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentListModal;