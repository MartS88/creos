import classes from './Navigation.module.scss';
import { MdModeNight, MdOutlineWbSunny } from 'react-icons/md';
import  { useContext, useState } from 'react';
import { AuthContext } from '../../../context';
import { useLocation, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const { locale, setLocale, theme, setTheme } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const getCurrentWeekNumber = (): number => {
    const date: Date = new Date();
    const startDate: Date = new Date(date.getFullYear(), 0, 1);
    const days: number = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber: number = Math.ceil((date.getDay() + 1 + days) / 7);
    return weekNumber;
  };

  const handleShowMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleMenuClick = (option: string) => {
    setLocale(option);
    setShowMenu(false);
  };

  const handleLightMode = (option: string) => {
    setTheme(option);
  };

  return (
    <div className={classes.navigation}>
      <nav className={classes.navigation_block}>
        <div className={classes.span_block}>
          <span
            className={location.pathname === '/' || location.pathname === '/home' ? classes.active : ''}
            onClick={() => navigate('/')}
          >
            {locale === 'RU' ? 'Комментарии' : 'Comments'}
          </span>
          <span
            className={location.pathname === '/task' ? classes.active : ''}
            onClick={() => navigate('/task')}
          >
            {locale === 'RU' ? 'Задачи' : 'Tasks'}
          </span>
          <span
            className={location.pathname === '/designers' ? classes.active : ''}
            onClick={() => navigate('/designers')}
          >
            {locale === 'RU' ? 'Дизайнеры' : 'Designers'}
          </span>
        </div>

        <div className={classes.svg_block}>
          {theme === 'light'
            ? <MdOutlineWbSunny size={20} onClick={() => handleLightMode('dark')} />
            : <MdModeNight size={20} onClick={() => handleLightMode('light')} />
          }
        </div>
        <span className={classes.toggle_button} onClick={handleShowMenu}>{locale}</span>
        {showMenu && (
          <ul className={`${classes.menu} ${showMenu ? classes.showMenu : ''}`}>
            <li onClick={() => handleMenuClick('EN')}>English</li>
            <li onClick={() => handleMenuClick('RU')}>Русский</li>
          </ul>
        )}
        <div className={classes.week_number}>
          week: {getCurrentWeekNumber()}
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
