import { Suspense, useEffect, useState } from 'react';
import classes from './App.module.scss';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { setupStore } from './store/store';
import { AuthProvider } from './components/context';
import Home from './pages/home/Home.tsx';
import Task from './pages/task/Task.tsx';
import DesignerPage from './pages/designer/DesignerPage.tsx';
import Loader from './components/loader/Loader';



const allRoutes = [
    { path: '/', element: <Home /> },
    { path: '/home', element: <Home /> },
    { path: '/task', element: <Task /> },
    { path: '/designers', element: <DesignerPage/> },
];

const App = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showLoader, setShowLoader] = useState<boolean>(true);

    useEffect(() => {
        const loadTimer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        const loaderTimer = setTimeout(() => {
            setShowLoader(false);
        }, 1000);

        return () => {
            clearTimeout(loadTimer);
            clearTimeout(loaderTimer);
        };
    }, []);

    return (
      <Provider store={setupStore()}>
          <AuthProvider>
              <Router>
                  <Suspense fallback={
                      <div className={classes.loader}>
                          <div className={classes.loader_block}>
                              <Loader height={'60'} width={'60'} color="whitesmoke" />
                          </div>
                      </div>
                  }>
                      {showLoader ? (
                        <div className={classes.loader}>
                            <div className={classes.loader_block}>
                                <Loader height={'60'} width={'60'} color="whitesmoke" />
                            </div>
                        </div>
                      ) : (
                        <Routes>
                            {allRoutes.map(({ path, element }) => (
                              <Route key={path} path={path} element={element} />
                            ))}
                        </Routes>
                      )}
                  </Suspense>
              </Router>
          </AuthProvider>
      </Provider>
    );
};

export default App;
