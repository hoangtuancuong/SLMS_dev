import { callApi } from '@/app/utils/api';
import { Badge, Button, Card, Spinner, Table } from 'flowbite-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { notify } from '@/components/Alert/Alert';
import { getCurrentUserRole, getUserData } from '@/app/utils/utils';
import StatsDiv from '@/app/admin/components/dashboard/AveragePoint';
import { RoleType } from '@/app/utils/constant';

const Statistics = ({ course }) => {
  const role = getCurrentUserRole();
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [absents, setAbsents] = useState(0);
  const [late, setLate] = useState(0);
  const { id } = useParams();

  const fetchData = async () => {
    const user = getUserData();
    try {
      setLoading(true);
      const res_score = await callApi(`scores/course/${course.id}/user/${user.id}`, 'GET');
      const res_assignment = await callApi(`assignment/course/${course.id}`);
      const res = await callApi(`rollcall/lesson/${course.id}`)
      
      setScores(Array.isArray(res_score) ? res_score : []);
      setAssignments(Array.isArray(res_assignment?.data) ? res_assignment.data : []);
      setAbsents(res.filter((x)=>x.status=="ABSENT" && x.user_id == user.id).length)
      setLate(res.filter((x)=>x.status=="LATE" && x.user_id == user.id).length)
      
      console.log("Scores:", res_score);
      console.log("Assignments:", res_assignment?.data);
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (course?.id) {
      fetchData();
    }
  }, [course, id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Prepare data for chart
  const prepareChartData = () => {
    if (!scores.length || !assignments.length) {
      return {
        series: [],
        categories: []
      };
    }

    // Sort scores by assignment order if possible
    const sortedScores = [...scores].sort((a, b) => {
      const indexA = assignments.findIndex(item => item.id === a.assignment_id);
      const indexB = assignments.findIndex(item => item.id === b.assignment_id);
      return indexA - indexB;
    });

    // Extract data points and categories
    const dataPoints = sortedScores.map(score => score.score);
    const categories = sortedScores.map(score => {
      const assignment = assignments.find(a => a.id === score.assignment_id);
      return assignment?.name || `Assignment ${score.assignment_id}`;
    });

    return {
      series: [{
        name: 'Điểm số',
        data: dataPoints
      }],
      categories: categories
    };
  };

  const chartData = prepareChartData();

  const chartOptions = {
    chart: {
      type: 'line',
      height: 315,
      fontFamily: 'inherit',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false
      }
    },
    colors: ['#3b82f6'],
    dataLabels: {
      enabled: true,
      offsetY: -5,
      style: {
        fontSize: '12px',
        colors: ['#304758']
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      },
    },
    markers: {
      size: 6,
      colors: ['#3b82f6'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 8,
      }
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: 'Bài tập',
      },
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Điểm số',
      },
      min: 0,
      max: 10,
      forceNiceScale: true,
      labels: {
        formatter: function (val) {
          return val.toFixed(1);
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    }
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
      <div className="grid grid-cols-12 gap-6">
        {getCurrentUserRole() == RoleType.STUDENTVIP && (
          <>
          <div className="lg:col-span-8 col-span-12">
            <div className="border border-blue-300 bg-white rounded-lg p-6 relative w-full break-words">
              {scores.length > 0 ? (
                <Chart
                  options={chartOptions}
                  series={chartData.series}
                  type="line"
                  height="315px"
                  width="100%"
                />
              ) : (
                <div className="flex justify-center items-center h-[315px] text-gray-500">
                  Chưa có dữ liệu điểm số
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-4 col-span-12">
            <div className="col-span-12">
              <StatsDiv text={'Vắng'} score={absents} icon={'solar:plate-bold-duotone'} />
            </div>
            <div className="col-span-12 mt-5">
              <StatsDiv text={'Muộn'} score={late} icon={'solar:alarm-bold-duotone'} />
            </div>
          </div>
          </>
        )}

        {getCurrentUserRole() == RoleType.STUDENT && (
          <>
            <div className="lg:col-span-12 col-span-12">
              <div className="border border-blue-300 bg-white rounded-lg p-6 relative w-full break-words">
                {scores.length > 0 ? (
                  <Chart
                    options={chartOptions}
                    series={chartData.series}
                    type="line"
                    height="315px"
                    width="100%"
                  />
                ) : (
                  <div className="flex justify-center items-center h-[315px] text-gray-500">
                    Chưa có dữ liệu điểm số
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Statistics;