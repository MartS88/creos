import React, { useContext, useEffect, useMemo, useState } from 'react';
import classes from './DesignerTable.module.scss';
import { scrollToElement } from '../../utils/scrollUtils.ts';
import { Designer } from '../../types/designer.ts';
import { FaLongArrowAltDown, FaLongArrowAltUp } from 'react-icons/fa';
import { BiCaretDown } from 'react-icons/bi';
import { AuthContext } from '../context';
import Loader from '../loader/Loader.tsx';

interface DesignerTableProps {
  designers: Designer[];
}

const DesignerTable: React.FC<DesignerTableProps> = ({ designers }) => {
  const { locale } = useContext(AuthContext);
  const [sortField, setSortField] = useState<string>('username');
  const [loadedData, setLoadedData] = useState<Designer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoadedData(designers.slice(0, 20));
  }, [designers]);

  const sortedArray = useMemo(() => {
    const data = [...loadedData];
    switch (sortField) {
      case 'username':
        return data.sort((a, b) => a.username.localeCompare(b.username));
      case 'email':
        return data.sort((a, b) => a.email.localeCompare(b.email));
      case 'tasks':
        return data.sort((a, b) => {
          const aTasks = a.issues.filter(issue => issue.status === 'Done').length;
          const bTasks = b.issues.filter(issue => issue.status === 'Done').length;
          return bTasks - aTasks;
        });
      default:
        return data.sort((a, b) => a.username.localeCompare(b.username));
    }
  }, [loadedData, sortField]);

  const handleSort = (field: string) => {
    setSortField(field);
  };

  const loadMoreData = () => {
    setLoading(true);
    setTimeout(() => {
      const nextItems = designers.slice(loadedData.length, loadedData.length + 20);
      if (nextItems && nextItems.length > 0) {
        setLoadedData(prevData => [...prevData, ...nextItems]);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <div className={classes.scroll_container} onClick={scrollToElement('scroll_down')}>
        <span className={classes.scroll_button}>Scroll Down</span>
        <FaLongArrowAltDown size={18} color={'silver'} />
      </div>

      <table className={classes.designer_table}>
        <thead>
        <tr>
          <th>Avatar</th>
          <th onClick={() => handleSort('username')}>
            {locale === 'RU' ? 'Никнэйм' : 'Username'}
            {sortField === 'username' && (sortField === 'username' ? <BiCaretDown size={18} color={'black'} /> :
              <BiCaretDown size={18} color={'black'} />)}
          </th>
          <th onClick={() => handleSort('email')}>
            {locale === 'RU' ? 'Почта' : 'Email'}
            {sortField === 'email' && (sortField === 'email' ? <BiCaretDown size={18} color={'black'} /> :
              <BiCaretDown size={18} color={'black'} />)}
          </th>
          <th onClick={() => handleSort('tasks')}>
            {locale === 'RU' ? 'Задания (Готовые/Не готовые)' : 'Tasks (Done/In Progress)'}
            {sortField === 'tasks' && (sortField === 'tasks' ? <BiCaretDown size={18} color={'black'} /> :
              <BiCaretDown size={18} color={'black'} />)}
          </th>
        </tr>
        </thead>
        <tbody>
        {sortedArray.map((designer: Designer) => {
          const doneTasks = designer.issues.filter(issue => issue.status === 'Done').length;
          const inProgressTasks = designer.issues.filter(issue => issue.status === 'In Progress').length;

          return (
            <tr key={designer.username}>
              <td><img src={designer.avatar} alt={`${designer.username}'s avatar`} /></td>
              <td>{designer.username}</td>
              <td>{designer.email}</td>
              <td>{`${doneTasks} / ${inProgressTasks}`}</td>
            </tr>
          );
        })}
        {loading && (
          <tr>
            <td>
            </td>
            <td>
            </td>
            <td style={{ transform: 'translate(30%, 10%)' }}>
              <Loader height={'60'} width={'60'} color={'silver'} />
            </td>
            <td>

            </td>

          </tr>
        )}
        </tbody>
      </table>

      {loadedData.length < designers.length && (
        <div className={classes.load_more_container}>
          <button className={classes.load_more_button} onClick={loadMoreData}>
            {locale === 'RU' ? ' Подгрузить Данные' : 'Load more data'}
          </button>
        </div>
      )}

      <div className={classes.scroll_container} id="scroll_down" onClick={scrollToElement('scroll_up')}>
        <span className={classes.scroll_button}>Scroll Up</span>
        <FaLongArrowAltUp size={18} color={'silver'} />
      </div>
    </>
  );
};

export default DesignerTable;

