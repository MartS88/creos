import  { useContext, useEffect, useState } from 'react';
import classes from './Home.module.scss';
import { AuthContext } from '../../components/context';
import { useGetCommentsQuery, useGetIssuesQuery } from '../../service/api';
import Layout from '../../components/layout/Layout.tsx';
import Loader from '../../components/loader/Loader.tsx';
import { IssueResponse } from '../../types/issue.ts';
import CommentItem from '../../components/commenItem/CommentItem.tsx';
import DesignerItem from '../../components/designerItem/DesignerItem.tsx';


export interface IDesigner {
  designer: string;
  medianTime: number;
  taskCount: number;
  completedTasks: IssueResponse[];
}



const Home = () => {
  const { data: commentsData, error: commentsError, isLoading: commentsLoading } = useGetCommentsQuery();
  const { data: issueData, error: issueError, isLoading: issueLoading } = useGetIssuesQuery();
  const { locale } = useContext(AuthContext);
  const [selectOption, setSelectOption] = useState<string>('comments');
  const [sortedDesigners, setSortedDesigners] = useState<IDesigner[] | null>(null);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (issueData) {
      const result = filterAndSortIssues(issueData);
      setSortedDesigners(result);
    }

  }, [issueData]);

  const filterAndSortIssues = (issues: IssueResponse[]): IDesigner[] => {
    const designerCount: { [key: string]: number } = {};
    const designerTimes: { [key: string]: number[] } = {};
    const designerTasks: { [key: string]: IssueResponse[] } = {};
    const designerInfo: { [key: string]: { avatar: string; username: string } } = {};

    issues.forEach(issue => {
      if (issue.status === 'Done') {
        const designer = issue.designer || 'null';
        const startTime = new Date(issue.date_started_by_designer).getTime();
        const endTime = new Date(issue.date_finished_by_designer).getTime();
        const timeTaken = endTime - startTime;

        if (!designerCount[designer]) {
          designerCount[designer] = 0;
          designerTimes[designer] = [];
          designerTasks[designer] = [];

        }
        designerCount[designer]++;
        designerTimes[designer].push(timeTaken);
        designerTasks[designer].push({ ...issue, timeTaken });
      }
    });

    const designerMedianTimes: { [key: string]: number } = {};
    for (const designer in designerTimes) {
      const times = designerTimes[designer].sort((a, b) => a - b);
      const mid = Math.floor(times.length / 2);
      const median = times.length % 2 !== 0 ? times[mid] : (times[mid - 1] + times[mid]) / 2;
      designerMedianTimes[designer] = median;
    }


    const uniqueDesigners: IDesigner[] = Object.keys(designerCount).map(designer => ({
      designer,
      medianTime: designerMedianTimes[designer],
      taskCount: designerCount[designer],
      completedTasks: designerTasks[designer],
    }));

    uniqueDesigners.sort((a, b) => {
      if (a.taskCount > b.taskCount) return -1;
      if (a.taskCount < b.taskCount) return 1;
      if (a.medianTime < b.medianTime) return -1;
      if (a.medianTime > b.medianTime) return 1;
      return 0;
    });

    return uniqueDesigners.slice(0, 10);
  };

  if (commentsLoading || issueLoading) {
    return (
      <div className={classes.loader}>
        <Loader height={'60'} width={'60'} color="whitesmoke" />
      </div>
    );
  }

  if (commentsError || issueError || error) {
    return <div className={classes.loader}><span className={classes.error_title}>Error loading data: {error}</span>
    </div>;
  }

  return (
    <Layout>
      <div className={classes.home}>
        <div className={classes.sort_buttons}>
          <button
            className={`${classes.button_item} ${selectOption === 'comments' ? classes.active : ''}`}
            onClick={() => setSelectOption('comments')}
          >
            {locale === 'RU' ? 'Посмотреть комментарии' : 'Look Comments'}
          </button>
          <button
            className={`${classes.button_item} ${selectOption === 'designers' ? classes.active : ''}`}
            onClick={() => setSelectOption('designers')}
          >
            {locale === 'RU' ? 'Посмотреть дизайнеров' : 'Look Designers'}
          </button>
        </div>

        {selectOption === 'comments' && (
          <div className={classes.list}>
            <CommentItem commentsData={commentsData}/>
              </div>
            )}

        {selectOption === 'designers' && (
          <div className={classes.list}>
            <DesignerItem sortedDesigners={sortedDesigners}/>
          </div>
        )}


      </div>
    </Layout>
  )
    ;
};

export default Home
