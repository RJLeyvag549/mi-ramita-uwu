import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Error404 from './pages/Error404';
import EditUser from './pages/EditUser';
import ProtectedRoute from './components/ProtectedRoute';
import Users from './pages/Users';
import FundingPage from './pages/FundingPage';
import MeetingPage from './pages/MeetingPage';
import ActPage from './pages/ActPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rutas protegidas */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/users" 
        element={
          <ProtectedRoute allowedRoles={['administrador']}>
            <Users />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/edit-user/:rut" 
        element={
          <ProtectedRoute>
            <EditUser />
          </ProtectedRoute>
        } 
      />
      <Route
        path="/reuniones"
        element={
          <ProtectedRoute>
            <MeetingPage />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/actas" 
        element={
          <ProtectedRoute>
            <ActPage />
          </ProtectedRoute>
        }
      />
      <Route path="/planilla" element={<FundingPage />} />
      <Route 
        path="/funding" 
        element={
          <ProtectedRoute allowedRoles={['administrador']}>
            <FundingPage />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default AppRouter;
