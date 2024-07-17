import React, { ReactNode } from 'react';
import '../../index.scss';
import classes from './Layout.module.scss';
import Header from './header/Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

  return (
    <div className={classes.container}>
      <Header />
      <main className={classes.wrapper}>
        {children}
      </main>

    </div>
  );
};

export default React.memo(Layout)

