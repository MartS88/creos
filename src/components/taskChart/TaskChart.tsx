import React, { useContext, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useGetIssuesQuery } from '../../service/api';
import { IssueResponse } from '../../types/issue';
import Loader from '../loader/Loader';
import classes from './TaskChart.module.scss';
import { AuthContext } from '../context';

export const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export interface WeeklyData {
  week: number;
  profit: number;
  expenses: number;
  difference: number;
}

const TaskChart: React.FC = () => {
  const { locale } = useContext(AuthContext);
  const [previousMonthData, setPreviousMonthData] = useState<WeeklyData[]>([]);
  const [currentMonthData, setCurrentMonthData] = useState<WeeklyData[]>([]);
  const [weeksToShow, setWeeksToShow] = useState<number>(8);
  const { data: issueData, error: issueError, isLoading: issueLoading } = useGetIssuesQuery();

  useEffect(() => {
    if (issueData) {
      processData(issueData);
    }
  }, [issueData, weeksToShow]);

  const processData = (tasks: IssueResponse[]) => {
    const previousMonthWeeklyData: { [key: number]: WeeklyData } = {};
    const currentMonthWeeklyData: { [key: number]: WeeklyData } = {};
    const now = new Date();

    tasks.forEach((task) => {
      const dateFinished = new Date(task.date_finished);
      const weekNumber = getWeekNumber(dateFinished);
      const isCurrentMonth = dateFinished.getMonth() === now.getMonth() && dateFinished.getFullYear() === now.getFullYear();
      const isPreviousMonth = dateFinished.getMonth() === now.getMonth() - 1 && dateFinished.getFullYear() === now.getFullYear();

      if (isCurrentMonth) {
        if (!currentMonthWeeklyData[weekNumber]) {
          currentMonthWeeklyData[weekNumber] = { week: weekNumber, profit: 0, expenses: 0, difference: 0 };
        }
        currentMonthWeeklyData[weekNumber].profit += task.received_from_client;
        const expenses = task.send_to_project_manager + task.send_to_account_manager + task.send_to_designer;
        currentMonthWeeklyData[weekNumber].expenses += expenses;
        currentMonthWeeklyData[weekNumber].difference += (task.received_from_client - expenses);
      } else if (isPreviousMonth) {
        if (!previousMonthWeeklyData[weekNumber]) {
          previousMonthWeeklyData[weekNumber] = { week: weekNumber, profit: 0, expenses: 0, difference: 0 };
        }
        previousMonthWeeklyData[weekNumber].profit += task.received_from_client;
        const expenses = task.send_to_project_manager + task.send_to_account_manager + task.send_to_designer;
        previousMonthWeeklyData[weekNumber].expenses += expenses;
        previousMonthWeeklyData[weekNumber].difference += (task.received_from_client - expenses);
      }
    });

    const previousMonthChartData = Object.values(previousMonthWeeklyData).sort((a, b) => a.week - b.week).slice(-weeksToShow);
    const currentMonthChartData = Object.values(currentMonthWeeklyData).sort((a, b) => a.week - b.week).slice(-weeksToShow);

    setPreviousMonthData(previousMonthChartData);
    setCurrentMonthData(currentMonthChartData);
  };

  const createChartData = (data: WeeklyData[]) => ({
    labels: data.map(d => `Week ${d.week}`),
    datasets: [
      {
        label: locale === 'RU' ? 'Доходы' : 'Profit',
        data: data.map(d => d.profit),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: locale === 'RU' ? 'Затраты' : 'Expenses',
        data: data.map(d => d.expenses),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: locale === 'RU' ? 'Прибыль' : 'Difference',
        data: data.map(d => d.difference),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
    ],
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: locale === 'RU' ? 'Закрытые задачи по неделям' : 'Tasks Closed by Week',
      },
    },
  };

  if (issueLoading) {
    return (
      <div className={classes.loader_container}>
        <Loader height={'60'} width={'60'} color="whitesmoke" />
      </div>
    );
  }

  if (issueError) {
    return (
      <div className={classes.error_container}>
        <span className={classes.error_title}>Error loading data</span>
      </div>
    );
  }

  return (
    <div className={classes.task_chart_container}>
      <h2>{locale === 'RU' ? 'Диаграмма задач' : 'Task Chart'}</h2>
      <label>
        {locale === 'RU' ? 'Количество недель для отображения:' : 'Number of weeks to show:'}
        <input
          type="number"
          value={weeksToShow}
          onChange={(e) => setWeeksToShow(Number(e.target.value))}
        />
      </label>
      <div className={classes.charts_container}>
        <div className={classes.charts_wrapper}>

          <Bar data={createChartData(previousMonthData)} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: locale === 'RU' ? 'Финансы, прошлый месяц' : 'Finance, Last Month' } } }} />
        </div>
        <div className={classes.charts_wrapper}>

          <Bar data={createChartData(currentMonthData)} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: locale === 'RU' ? 'Финансы, текущий месяц' : 'Finance, Current Month' } } }} />
        </div>
      </div>
    </div>
  );
};

export default TaskChart;
