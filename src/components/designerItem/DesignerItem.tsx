import React, { useContext } from 'react';
import classes from './DesignerItem.module.scss';
import { IDesigner } from '../../pages/home/Home.tsx';
import { AuthContext } from '../context';
import Loader from '../loader/Loader.tsx';
import { Designer } from '../../types/designer.ts';
import { MdDoneOutline } from "react-icons/md";

interface DesignerItemProps {
  sortedDesigners: IDesigner[];
}

function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const DesignerItem: React.FC<DesignerItemProps> = ({ sortedDesigners }) => {
  const { allDesigners, fetchLoading, isError } = useContext(AuthContext);

  if (isError) return <p className={classes.error_title}>Error fetching data</p>;

  const sortedByTime = [...sortedDesigners].sort((a, b) => a.medianTime - b.medianTime);

  return (
    <>
      {fetchLoading ? (
        <div className={classes.loader}>
          <Loader height={'60'} width={'60'} color="gray" />
        </div>
      ) : (
        sortedByTime.map((issue: IDesigner,index:number) => {
          const findDesigner = allDesigners.find((designer: Designer) => designer.username === issue.designer);

          return (
            <div className={classes.designer_item} key={issue.designer}>
              <h3 className={classes.rank}>#{index+1}</h3>
              <div className={classes.designer_item_block}>
                {findDesigner && (
                  <img
                    src={findDesigner.avatar}
                    draggable="false"
                    alt="Designer Avatar"
                    className={classes.designer_item_img}
                  />
                )}
                <h3 className={classes.designer_item_name}>{issue.designer}</h3>
                <span>Median Time {formatTime(issue.medianTime)}</span>
                <span>Tasks: {issue.completedTasks.length}  <MdDoneOutline
                  size={20} color={'green'} /></span>
              </div>
            </div>
          );
        })
      )}
    </>
  );
};

export default React.memo(DesignerItem);

