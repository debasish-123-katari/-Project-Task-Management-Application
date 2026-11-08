import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';

function Protected({ children }) {

  const { user, checking } = useAuth();
  if (checking) return <div className="center-screen">Loading your workspace…</div>;
  return user ? children : <Navigate to="/login" replace />;
}
export default function App() {
  const { user } = useAuth();
  return <Routes>
    <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
    <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
    <Route path="/" element={<Protected><Layout /></Protected>}>
      <Route index element={<Dashboard />} />
      <Route path="projects" element={<Projects />} />
      <Route path="projects/:id" element={<ProjectDetail />} />
      <Route path="tasks" element={<Tasks />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
