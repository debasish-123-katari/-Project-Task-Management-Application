import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
export default function Layout() {
  const { user, setUser } = useAuth(); const navigate = useNavigate();
  async function logout() { try { await api.post('/auth/logout'); } finally { setUser(null); navigate('/login'); } }
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">T</span><span>TaskFlow<small>WORKSPACE</small></span></div>
      <div className="nav-label">WORKSPACE</div>
      <NavLink end to="/" className={({isActive}) => `nav-link ${isActive?'active':''}`}><span>▦</span> Overview</NavLink>
      <NavLink to="/projects" className={({isActive}) => `nav-link ${isActive?'active':''}`}><span>▣</span> Projects</NavLink>
      <NavLink to="/tasks" className={({isActive}) => `nav-link ${isActive?'active':''}`}><span>☷</span> Tasks</NavLink>
      <div className="sidebar-bottom"><div className="avatar">{user?.name?.[0]?.toUpperCase()}</div><div className="user-meta"><strong>{user?.name}</strong><small>{user?.email}</small></div><button className="icon-button" title="Log out" onClick={logout}>↗</button></div>
    </aside>
    <main className="main-area"><header className="topbar"><div><span className="breadcrumb">Workspace</span><span className="breadcrumb-sep"> / </span><span>My workspace</span></div><div className="topbar-user"><span className="online-dot"></span> {user?.name}</div></header><div className="page-content"><Outlet /></div></main>
  </div>;
}
