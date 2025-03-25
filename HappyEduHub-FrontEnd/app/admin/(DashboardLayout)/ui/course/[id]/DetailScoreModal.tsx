import {
  Badge,
  Button,
  Modal,
  Spinner,
  Table,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { callApi } from '@/app/utils/api';
import ReactApexChart from 'react-apexcharts'; // Import ApexCharts component
import AveragePoint from '@/app/admin/components/dashboard/AveragePoint';
import StatsDiv from '@/app/admin/components/dashboard/AveragePoint';

const DetailScoreModal = (props: any) => {
  const { id } = useParams();
  const { isOpen, onClose, reloadData } = props;
  const [members, setMembers] = useState<any[]>([]);
  const [inputScore, setInputScore] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [averageSeries, setAverageSeries] = useState<any[]>([]);
  const [scoreDistribution, setScoreDistribution] = useState<any[]>([]);

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

      const scores = scoresRes.students_score.map((score: any) => score.score);
      const avgScore =
        scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length;
      setAverageScore(avgScore);

      const belowAverageCount = scores.filter((score: any) => score < avgScore).length;
      const aboveAverageCount = scores.filter((score: any) => score > avgScore).length;

      setAverageSeries([
        {
          name: 'Dưới trung bình',
          data: [belowAverageCount],
        },
        {
          name: 'Trên trung bình',
          data: [aboveAverageCount],
        },
      ]);

      const scoreCounts = scores.reduce((acc: any, score: number) => {
        acc[score] = (acc[score] || 0) + 1;
        return acc;
      }, {});

      setScoreDistribution(
        Object.keys(scoreCounts).map((score) => ({
          score: score,
          count: scoreCounts[score],
        }))
      );

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const sortedMembers = members.sort((a, b) => (b.score?.score || 0) - (a.score?.score || 0));

  const rankMembers = sortedMembers.map((member, index) => ({
    ...member,
    rank: index + 1,
    badgeColor: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'gray',
  }));

  const chartOptions = {
    labels: scoreDistribution.map((item: any) =>  `Điểm ${item.score}`),
    colors: [
      '#4DC6E1', // Light Blue
      '#FFB6C1', // Light Pink
      '#98FB98', // Light Green
      '#FF6347', // Tomato Red
      '#FFD700', // Gold
      '#D3D3D3', // Light Grey
    ], 
    plotOptions: {
      pie: {
        expandOnClick: true,
      },
    },
    dataLabels: {
      style: {
        fontFamily: "'Open Sans', sans-serif", 
      },
    },
    tooltip: {
      theme: 'dark', 
    },
    grid: {
      padding: {
        bottom: 10,
      },
    },
  };
  

  const chartSeries = scoreDistribution.map((item: any) => item.count);

  return (
    <Modal show={isOpen} onClose={onClose} size="7xl">
      <Modal.Header>Danh sách kết quả</Modal.Header>
      <Modal.Body className='bg-gray-100'>
        <div className="max-h-160 overflow-y-auto mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-12 gap-30">
                <div className="lg:col-span-8 col-span-12">
                  <div className="rounded-sm bg-white px-0 relative w-full break-words border border-blue-300">
                    <div className="overflow-x-auto">
                      <Table hoverable>
                        <Table.Head>
                          <Table.HeadCell className="p-6">Mã học sinh</Table.HeadCell>
                          <Table.HeadCell>Tên học sinh</Table.HeadCell>
                          <Table.HeadCell>Điểm số</Table.HeadCell>
                          <Table.HeadCell>Xếp hạng</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y divide-border">
                          {rankMembers.map((member: any, index: number) => (
                            <Table.Row key={index}>
                              <Table.Cell className="whitespace-nowrap ps-6">
                                {member?.user?.code}
                              </Table.Cell>
                              <Table.Cell>{member?.user?.name}</Table.Cell>
                              <Table.Cell>{member?.score?.score || '-'}</Table.Cell>
                              <Table.Cell>
                                <Badge
                                  className={`${
                                    member.rank === 1
                                      ? 'top1-badge'
                                      : member.rank === 2
                                      ? 'top2-badge'
                                      : member.rank === 3
                                      ? 'top3-badge'
                                      : 'other-badge'
                                  }`}
                                >
                                  {member.rank === 1
                                    ? 'Top 1'
                                    : member.rank === 2
                                    ? 'Top 2'
                                    : member.rank === 3
                                    ? 'Top 3'
                                    : `Top ${member.rank}`}
                                </Badge>
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-4 col-span-12">
                  <div className="col-span-12">
                    <StatsDiv score={averageScore} icon={'solar:users-group-rounded-bold-duotone'} text='Điểm trung bình'></StatsDiv>
                  </div>

                  <div className="col-span-12 mt-5">
                    <div className="  border border-blue-300 bg-white rounded-lg p-6 pt-3 mt-3 relative w-full break-words">
                      <div className='card-title'>
                        Phân bố số điểm
                      </div>
                      <ReactApexChart
                        options={chartOptions}
                        series={chartSeries}
                        type="pie"
                        height={350}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button color="red" onClick={onClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DetailScoreModal;
