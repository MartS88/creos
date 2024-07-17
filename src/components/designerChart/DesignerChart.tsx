import React, { useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { AuthContext } from '../context';

interface DesignerCharChartProps {
  tasks: { status: string }[];
}

const DesignerChart: React.FC<DesignerCharChartProps> = ({ tasks }) => {
  const { locale } = useContext(AuthContext);

  const statusCounts = tasks.reduce(
    (acc, task) => {
      if (task.status === 'Done') {
        acc.done += 1;
      } else if (task.status === 'In Progress') {
        acc.inProgress += 1;
      } else if (task.status === 'Placed') {
        acc.placed += 1;
      }
      return acc;
    },
    { done: 0, inProgress: 0, placed: 0 }
  );

  const data = {
    labels: locale === 'RU' ? ['Закрыто', 'В работе', 'Размещено'] : ['Done', 'In Progress', 'Placed'],
    datasets: [
      {
        data: [statusCounts.done, statusCounts.inProgress, statusCounts.placed],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  };

  return <Pie data={data} />;
};

export default DesignerChart;
