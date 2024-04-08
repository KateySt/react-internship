import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { RatingData } from 'Types/RatingData';
import { useAppSelector } from 'Store/hooks';
import { selectMembers, selectQuizzes } from 'Store/features/company/CompaniesSlice';

const BarChart: React.FC<{
  data: {
    user_id?: number;
    quiz_id?: number;
    rating: RatingData[];
  }
}> = ({ data }) => {
  const [chartInstance, setChartInstance] = useState<Chart<'bar'> | null>(null);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const labels: string[] = [];
  const averages: number[] = [];
  const members = useAppSelector(selectMembers);
  const quizzes = useAppSelector(selectQuizzes);
  let label = '';

  useEffect(() => {
    if (!members && !data?.user_id) return;
    let member = members.find(el => el.user_id === data?.user_id);
    if (!member) return;
    label = `${member.user_firstname} ${member.user_lastname}`;
  }, [data, members]);

  useEffect(() => {
    if (!quizzes && !data?.quiz_id) return;
    let quiz = quizzes.find(el => el.quiz_id=== data?.quiz_id);
    if (!quiz) return;
    label = `${quiz.quiz_name}`;
  }, [data, quizzes]);

  useEffect(() => {
    if (!data) return;
    data.rating.forEach((ratingData: RatingData) => {
      const date = new Date(ratingData.pass_at);
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      labels.push(formattedDate);
      averages.push(ratingData.average_rating);
    });
  }, [data]);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance) {
      chartInstance.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const newChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: averages,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    setChartInstance(newChartInstance);

    return () => {
      if (newChartInstance) {
        newChartInstance.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} id="myChart" width={600} height={400} />;
};

export default BarChart;