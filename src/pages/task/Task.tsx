import classes from './Task.module.scss';
import Layout from '../../components/layout/Layout.tsx';
import TaskChart from '../../components/taskChart/TaskChart.tsx';

const Task = () => {
  return (
    <Layout>
      <div className={classes.task}>
        <TaskChart/>
      </div>
    </Layout>

  );
};

export default Task;
