import { callApi } from '@/app/utils/api';
import { Badge, Button, Card, Spinner, Table } from 'flowbite-react';
import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { notify } from '@/components/Alert/Alert';
import { getCurrentUserRole, getUserData } from '@/app/utils/utils';
import StatsDiv from '@/app/admin/components/dashboard/AveragePoint';

const Statitisc = ({course}: any) => {
  const role = getCurrentUserRole();
  const [loading, setLoading] = useState(false)
  const [scores, setScore] = useState(null);
  const [assignments, setAssignments] = useState(null);
  const [absents, setAbsents] = useState(0);
  const [late, setLate] = useState(0);
  const { id } = useParams();
  useState(false);


  const fetchData = async () => {
    const user = getUserData();
    try {
      setLoading(true);
      const res_score = await callApi(`scores/course/${course.id}/user/${user.id}`, 'GET');
      const res_assignment = await callApi(`assignment/course/${course.id}`)
      setScore(res_score)
      setAssignments(res_assignment.data)
      console.log(res_score)
      console.log(res_assignment.data)
    } catch (error) {
      notify(error.message, "error");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const getChartData = () => {
    if (!scores || !assignments) return [];

    const scoresData = scores.map(score => ({
      x: assignments.find(assignment => assignment.id === score.assignment_id)?.name || '',
      y: score.score,
    }));

    return [
      {
        type: 'area',
        name: 'Scores',
        data: scoresData,
      },
    ];
  };

  const optionsColumnChart = {
    chart: {
      fontFamily: 'inherit',
      foreColor: '#adb0bb',
      fontSize: '12px',
      offsetX: 0,
      offsetY: 10,
      animations: {
        speed: 500,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ['var(--color-primary)', '#adb0bb35'],
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 0.1,
        opacity: 0.3,
        stops: [100],
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: '#90A4AE50',
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: 10,
      tickAmount: 5,
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: 'dark',
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-8 col-span-12">
          <div className="border border-blue-300 bg-white rounded-lg p-6 relative w-full break-words">
            <Chart
              options={optionsColumnChart}
              series={getChartData()}
              type="area"
              height="315px"
              width="100%"
            />
          </div>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <div className="col-span-12">
            <StatsDiv text={'Vắng'} score={absents} icon={'solar:plate-bold-duotone'}></StatsDiv>
          </div>
          <div className="col-span-12 mt-5">
            <StatsDiv text={'Muộn'} score={late} icon={'solar:alarm-bold-duotone'}></StatsDiv>
          </div>
        </div>
      </div>
    </>
  );
};

export default Statitisc;
