'use client';
import Header from '@/app/admin/components/dashboard/Header';
import { callApi } from '@/app/utils/api';
import { roomData, shiftName } from '@/app/utils/constant';
import { Modal, Table, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';

const TimeTableModal = ({ open, setClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeTableData, setTimeTableData] = useState({});

  const headerConfig = [
    { text: 'Ca', width: 'w-[80px]' },
    { text: 'Thứ 2', width: 'w-[150px]' },
    { text: 'Thứ 3', width: 'w-[150px]' },
    { text: 'Thứ 4', width: 'w-[150px]' },
    { text: 'Thứ 5', width: 'w-[150px]' },
    { text: 'Thứ 6', width: 'w-[150px]' },
    { text: 'Thứ 7', width: 'w-[150px]' },
    { text: 'Chủ nhật', width: 'w-[150px]' },
  ];

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await callApi('courses/my-course-schedule', 'GET');
      const formattedData = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {} };

      res.forEach((course) => {
        course.shifts.forEach((shift) => {
          formattedData[shift.shift][shift.day] = {
            code: course.code,
            room: shift.room,
            name: course.name,
            description: course.description,
          };
        });
      });

      setTimeTableData(formattedData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  return (
    <Modal
      show={open}
      onClose={setClose}
      size="7xl"
      className="rounded-lg shadow-xl"
    >
      <Modal.Header className="bg-gradient-to-r from-gray-200 to-white text-white">
        <Header icon="solar:calendar-bold" title="Thời khóa biểu" />
      </Modal.Header>
      <Modal.Body className="p-6 bg-gray-50">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Spinner size="xl" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 bg-white">
            <Table hoverable className="table-fixed w-full">
              <Table.Head className="bg-blue-100">
                {headerConfig.map((header) => (
                  <Table.HeadCell
                    key={header.text}
                    className={`text-center font-semibold ${header.width}`}
                  >
                    {header.text}
                  </Table.HeadCell>
                ))}
              </Table.Head>

              <Table.Body className="divide-y divide-gray-300">
                {[1, 2, 3, 4, 5, 6].map((shift) => (
                  <Table.Row
                    key={shift}
                    className="hover:bg-gray-100 divide-x divide-gray-300"
                  >
                    <Table.Cell className="text-center font-bold bg-gray-200 w-[80px]">
                      {shiftName[shift]}
                    </Table.Cell>
                    {[2, 3, 4, 5, 6, 7, 1].map((day) => (
                      <Table.Cell
                        className="p-4 text-center w-[150px]"
                        key={day}
                      >
                        {timeTableData[shift]?.[day] ? (
                          <div className="bg-blue-50 p-2 rounded-md shadow-md border border-blue-200">
                            <div className="font-semibold text-blue-600">
                              {timeTableData[shift]?.[day]?.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              <strong>Mã:</strong>{' '}
                              {timeTableData[shift]?.[day]?.code ?? 'N/A'}
                            </div>
                            {timeTableData[shift]?.[day]?.room &&
                            roomData[timeTableData[shift]?.[day]?.room] ? (
                              <div className="text-sm text-gray-600">
                                <strong>Phòng:</strong> Tầng{' '}
                                {
                                  roomData[timeTableData[shift]?.[day]?.room]
                                    .floor
                                }{' '}
                                - Cơ sở{' '}
                                {
                                  roomData[timeTableData[shift]?.[day]?.room]
                                    .campus
                                }
                                {roomData[timeTableData[shift]?.[day]?.room]
                                  .room
                                  ? ` - Phòng ${roomData[timeTableData[shift]?.[day]?.room].room}`
                                  : ''}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-600">
                                <strong>Phòng:</strong> N/A
                              </div>
                            )}
                            <div className="text-xs text-gray-500">
                              {timeTableData[shift]?.[day]?.description ??
                                'Chưa có mô tả'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Trống</span>
                        )}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default TimeTableModal;
