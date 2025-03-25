import {
  Badge,
  Button,
  Modal,
  Spinner,
  Table,
  TextInput,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { callApi } from '@/app/utils/api';
import { courseMemberStatusBadgeColors } from '@/app/utils/constant';
import { notify } from '@/components/Alert/Alert';

const AddScoreModal = (props: any) => {
  const { id } = useParams();
  const { isOpen, onClose, reloadData } = props;
  const [members, setMembers] = useState([]);
  const [inputScore, setInputScore] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const membersRes = await callApi(
        `courses/${id}/members?limit=100&filter[role]=STUDENT&filter[status]=APPROVED`,
        'GET'
      );
      const scoresRes = await callApi(`scores/assignment/${isOpen}`, 'GET');
      const finalMembers = [];
      for (const member of membersRes.data) {
        const score = (scoresRes.students_score as Array<any>).find(
          (score: any) => score.student_id === member.user.id
        );
        finalMembers.push({ ...member, score: score });
      }
      setInputScore(
        scoresRes.students_score.map((score: any) => ({
          user_id: score.student_id,
          score: score.score,
        }))
      );
      setMembers(finalMembers);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await callApi(`scores/batch`, 'POST', {
        assignment_id: isOpen,
        score_data: inputScore,
      });
      onClose();
      reloadData();
      setIsLoading(false);
      notify("Nhập điểm thành công", "success");
    } catch (error) {
      notify("Có lỗi xảy ra", "error");
      console.log(error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal show={isOpen} onClose={onClose} size="7xl">
      <Modal.Header>Nhập điểm</Modal.Header>
      <Modal.Body>
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
                  Tên học sinh
                </Table.HeadCell>
                <Table.HeadCell className="flex-grow text-md">
                  Email
                </Table.HeadCell>
                <Table.HeadCell className="w-32 text-md text-center">
                  Trạng thái
                </Table.HeadCell>
                <Table.HeadCell className="w-32 text-md text-center">
                  Điểm số
                </Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {members.map((member: any, index: number) => (
                  <Table.Row key={index}>
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
                    <Table.Cell className="w-32 inline-flex items-center justify-center">
                      <TextInput
                        className="w-12"
                        value={
                          inputScore.find(
                            (score: any) => score.user_id === member?.user?.id
                          )?.score || ''
                        }
                        onChange={(e) => {
                            const newScore = e.target.value;
                            setInputScore((prevScores) => {
                              const existingIndex = prevScores.findIndex((score) => score.user_id === member?.user?.id);
                              if (existingIndex !== -1) {
                                return prevScores.map((score, idx) => idx === existingIndex ? { ...score, score: newScore } : score);
                              } else {
                                return [...prevScores, { user_id: member?.user?.id, score: newScore }];
                              }
                            });
                        }}
                      />
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
        <Button disabled={isLoading} color="primary" onClick={handleSave}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddScoreModal;
