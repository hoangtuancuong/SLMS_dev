import React, { useState } from 'react';
import { Modal, Button, Label, Select, Datepicker } from 'flowbite-react';
import { roomData, timeSlotMap } from '@/app/utils/constant';
import { formattedDate } from '@/app/utils/utils';

const LessonAlterModal = ({ openModal, onClose, onSubmit, isRoom }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  const formatRoomLabel = (roomKey) => {
    const data = roomData[roomKey];
    if (data.room === null) {
      return `Cơ sở ${data.campus} - Tầng ${data.floor}`;
    } else {
      return `Cơ sở ${data.campus} - Tầng ${data.floor} - Phòng ${data.room}`;
    }
  };

  const handleSubmit = () => {
    onSubmit({
      isRoom: isRoom,
      date: selectedDate,
      shift: selectedValue,
      room: selectedRoom,
    });
    onClose();
  };

  return (
    <Modal
      show={openModal}
      onClose={onClose}
      size="lg"
      position="center"
      popup={false}
    >
      <Modal.Header>Thay đổi lịch học</Modal.Header>
      <Modal.Body className="overflow-visible">
        <div className="space-y-6 py-2">
          {!isRoom && (
            <>
              <div className="z-10 relative">
                <div className="mb-2 block">
                  <Label htmlFor="datepicker" value="Ngày được dời đến" />
                </div>
                <div className="relative z-20">
                  <Datepicker
                    id="datepicker"
                    placeholder="Chọn ngày học"
                    value={formattedDate(selectedDate)}
                    onSelectedDateChanged={(date) => setSelectedDate(date)}
                    className="w-full"
                    showClearButton={false}
                  />
                </div>
              </div>
              <div className="mt-6">
                <div className="mb-2 block">
                  <Label htmlFor="selectLesson" value="Ca học" />
                </div>
                <Select
                  id="selectLesson"
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value)}
                  required
                  className="w-full"
                >
                  <option>Chọn ca học</option>
                  {Object.entries(timeSlotMap).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>
            </>
          )}

          {isRoom && (
            <div>
              <div className="mb-2 block">
                <Label htmlFor="selectRoom" value="Phòng học" />
              </div>
              <Select
                id="selectRoom"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                required
                className="w-full"
              >
                <option>Chọn phòng học</option>
                {Object.keys(roomData).map((roomKey) => (
                  <option key={roomKey} value={roomKey}>
                    {formatRoomLabel(roomKey)}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end gap-4 w-full">
          <Button color="gray" onClick={onClose}>
            Hủy
          </Button>
          <Button color="success" onClick={handleSubmit}>
            Xác nhận
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default LessonAlterModal;
