import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ROUTES } from './shared/enums/routes';
import { MainLayout } from './layouts/Main';
import { AuthLayout } from './layouts/Auth';
import { DashboardComponent } from './pages/Dashboard';
import { AssessmentComponent } from './pages/Assessment';
import LoginPage from './pages/Login';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route index element={<LoginPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardComponent />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path={ROUTES.ASSESSMENT} element={<AssessmentComponent />} />
        </Route>

        {/* <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardComponent />} />
          </Route>
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
};
