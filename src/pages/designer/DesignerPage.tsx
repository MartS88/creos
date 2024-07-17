import  { useContext } from 'react';
import classes from './DesignerPage.module.scss';
import Layout from '../../components/layout/Layout.tsx';
import { AuthContext } from '../../components/context';
import DesignerChart from '../../components/designerChart/DesignerChart.tsx';
import DesignerTable from '../../components/designerTable/DesignerTable.tsx';
import { Designer } from '../../types/designer.ts';



const DesignerPage = () => {
  const { allDesigners,locale } = useContext(AuthContext);
  const allTasks = allDesigners.flatMap((designer: Designer) => designer.issues);

  return (
    <Layout>
      <div className={classes.designer_page} id="scroll_up">
        <div className={classes.designer_chart_container}>
          <h2>{locale === 'RU' ? 'Статус задач' : 'Task Status Distribution'}</h2>
          <DesignerChart tasks={allTasks} />
        </div>
        <div className={classes.designer_table_container}>
          <DesignerTable designers={allDesigners} />
        </div>
      </div>
    </Layout>
  )
    ;
};

export default DesignerPage;
