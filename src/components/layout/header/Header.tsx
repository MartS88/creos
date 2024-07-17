import classes from './Header.module.scss'
import Navigation from '../header/navigation/Navigation';

const Header = () => {

  return (
    <header className={classes.header}>
      <Navigation />
    </header>
  );
};

export default Header;


