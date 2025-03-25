'use client';

import { useEffect, useState } from 'react';
import { Card, Badge } from 'flowbite-react';
import { callApi } from '@/app/utils/api';
import { notify } from '@/components/Alert/Alert';

const VNPay = (props: any) => {
  const [transactionResult, setTransactionResult] = useState<{
    status: string;
    message: string;
    txnRef: string;
    amount: string;
    orderInfo: string;
    transactionNo: string;
    bankCode: string;
    payDate: string;
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState({});


  useEffect(() => {
    const parseUrlParams = () => {
      try {
        if (typeof window !== 'undefined') {
          const searchParams = new URLSearchParams(window.location.search);
          
          const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
          const vnp_TransactionStatus = searchParams.get('vnp_TransactionStatus');
          const vnp_TxnRef = searchParams.get('vnp_TxnRef');
          const vnp_Amount = searchParams.get('vnp_Amount');
          const vnp_OrderInfo = searchParams.get('vnp_OrderInfo');
          const vnp_TransactionNo = searchParams.get('vnp_TransactionNo');
          const vnp_BankCode = searchParams.get('vnp_BankCode');
          const vnp_PayDate = searchParams.get('vnp_PayDate');
          
          const formattedAmount = vnp_Amount ? 
            (parseInt(vnp_Amount) / 100).toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }) : '';
          
          let formattedDate = '';
          if (vnp_PayDate) {
            const year = vnp_PayDate.substring(0, 4);
            const month = vnp_PayDate.substring(4, 6);
            const day = vnp_PayDate.substring(6, 8);
            const hour = vnp_PayDate.substring(8, 10);
            const minute = vnp_PayDate.substring(10, 12);
            const second = vnp_PayDate.substring(12, 14);
            
            formattedDate = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
          }
          
          const status = (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') 
            ? 'success' 
            : 'failed';
          
          const message = status === 'success' 
            ? 'Giao dịch thành công' 
            : 'Giao dịch thất bại';
          
          setTransactionResult({
            status,
            message,
            txnRef: vnp_TxnRef || '',
            amount: formattedAmount,
            orderInfo: vnp_OrderInfo || '',
            transactionNo: vnp_TransactionNo || '',
            bankCode: vnp_BankCode || '',
            payDate: formattedDate
          });
        }
      } catch (error) {
        console.error('Error parsing VNPay return URL:', error);
        setTransactionResult({
          status: 'error',
          message: 'Có lỗi xảy ra khi xử lý kết quả giao dịch',
          txnRef: '',
          amount: '',
          orderInfo: '',
          transactionNo: '',
          bankCode: '',
          payDate: ''
        });
      } finally {
        setLoading(false);
      }
    };

    parseUrlParams();
  }, []);

  useEffect(() => {
    const update = async () => {
        try {
            const body = {
                status: transactionResult.status=="success"?"SUCCESS":"FAILED"
            }
            const res = await callApi(`transactions/${transactionResult.txnRef}`, "PUT" ,body)
            console.log(res)
            notify(transactionResult.message, "info")
        } catch(error) {
            console.log(error)
            notify("Update khoản thu thất bại", "info")
        }
    }
    update();
  }, [transactionResult])

  return (
    <Card className="max-w-lg mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">Kết Quả Thanh Toán</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        ) : (
          <>
            {transactionResult?.status === 'success' ? (
              <div className="mt-4">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 rounded-full p-4">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-lg font-semibold text-green-600">{transactionResult?.message}</p>
              </div>
            ) : (
              <div className="mt-4">
                <div className="flex justify-center mb-4">
                  <div className="bg-red-100 rounded-full p-4">
                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-lg font-semibold text-red-600">{transactionResult?.message}</p>
              </div>
            )}
            
            {transactionResult && (
              <div className="mt-6 text-left border-t pt-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Mã giao dịch:</div>
                  <div className="font-medium">{transactionResult.txnRef}</div>
                  
                  <div className="text-gray-600">Số tiền:</div>
                  <div className="font-medium">{transactionResult.amount}</div>
                  
                  <div className="text-gray-600">Nội dung thanh toán:</div>
                  <div className="font-medium">{transactionResult.orderInfo}</div>
                  
                  <div className="text-gray-600">Số hóa đơn:</div>
                  <div className="font-medium">{transactionResult.transactionNo}</div>
                  
                  <div className="text-gray-600">Ngân hàng:</div>
                  <div className="font-medium">{transactionResult.bankCode}</div>
                  
                  <div className="text-gray-600">Ngày thanh toán:</div>
                  <div className="font-medium">{transactionResult.payDate}</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default VNPay;