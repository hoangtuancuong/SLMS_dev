import { useState, useRef } from 'react';
import { notify } from '@/components/Alert/Alert';

const useExcelUpload = (onUploadSuccess) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formattedData, setFormattedData] = useState(null);

  const handleClickImport = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const result = e.target.result;
        if (!(result instanceof ArrayBuffer)) {
          throw new Error('Lỗi đọc file Excel.');
        }

        const data = new Uint8Array(result);
        const XLSX = await import('xlsx');
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: (string | undefined)[][] = XLSX.utils.sheet_to_json(
          sheet,
          { header: 1 }
        );

        const expectedHeaders = [
          'Họ tên học sinh',
          'Lớp',
          'Trường',
          'Email',
          'Giới tính',
          'Họ tên phụ huynh 1',
          'CCCD',
          'Ngày cấp',
          'SĐT phụ huynh 1',
          'Họ tên phụ huynh 2 (optional)',
          'SĐT phụ huynh 2 (optional)',
          'Địa chỉ',
          'Ghi chú',
          'Giáo viên chủ nhiệm (nếu là học sinh thái phiên)',
        ];

        const fileHeaders = jsonData[1];
        if (JSON.stringify(fileHeaders) !== JSON.stringify(expectedHeaders)) {
          throw new Error('File Excel không đúng định dạng.');
        }

        const filteredData = jsonData
          .slice(2)
          .filter((row) =>
            row.some((cell) => cell !== undefined && cell !== '')
          )
          .map((row) => ({
            name: row[0] || '',
            class: row[1] || '',
            school: row[2] || '',
            email: row[3] || '',
            first_contact_name: row[5] || '',
            cccd: row[6] || '',
            date_of_birth: new Date().toISOString(),
            first_contact_tel: row[8] || '',
            address: row[11] || '',
            gender: row[4] == 'Nam' ? 'MALE' : 'FEMALE',
            phone_number: row[8] || '',
            role: 'STUDENT',
            avatar_url: '',
            is_thaiphien: row[2] == 'THPT Thái Phiên',
          }));

        setFormattedData({ student_data: filteredData });
        console.log({ student_data: filteredData });

        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } catch (error) {
        notify(error.message, 'error');
        setFormattedData(null);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const validateFinalData = (data) => {
    if (!Array.isArray(data) || data.length === 0) return false;

    return data.every(
      (item) =>
        typeof item.name === 'string' &&
        item.name.trim() !== '' &&
        typeof item.class === 'string' &&
        typeof item.school === 'string' &&
        typeof item.email === 'string' &&
        item.email.includes('@') &&
        typeof item.phone_number === 'string' &&
        typeof item.date_of_birth === 'string' &&
        ['MALE', 'FEMALE'].includes(item.gender) &&
        typeof item.address === 'string' &&
        typeof item.is_thaiphien === 'boolean' &&
        typeof item.first_contact_name === 'string' &&
        typeof item.first_contact_tel === 'string' &&
        typeof item.second_contact_name === 'string' &&
        typeof item.second_contact_tel === 'string' &&
        typeof item.homeroom_teacher_id === 'number' &&
        typeof item.cccd === 'string'
    );
  };

  return {
    fileInputRef,
    handleClickImport,
    handleFileUpload,
    loading,
    formattedData,
    validateFinalData,
  };
};

export default useExcelUpload;
