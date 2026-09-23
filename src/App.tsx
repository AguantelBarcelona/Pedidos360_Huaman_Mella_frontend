import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import IntegrationPage from './pages/IntegrationPage';
import ClientePage from './pages/ClientePage';
import AdminPage from './pages/AdminPage';
import CatalogoPage from './pages/CatalogoPage';

import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={<IntegrationPage />}
        />

        <Route
          path="/catalogo"
          element={<CatalogoPage />}
        />

        <Route
          element={
            <RoleRoute allowedRoles={['CLIENTE']} />
          }
        >
          <Route
            path="/cliente"
            element={<ClientePage />}
          />
        </Route>

        <Route
          element={
            <RoleRoute allowedRoles={['ADMIN']} />
          }
        >
          <Route
            path="/admin"
            element={<AdminPage />}
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}