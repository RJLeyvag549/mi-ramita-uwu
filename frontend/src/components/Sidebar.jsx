import { NavLink } from "react-router-dom";
//import { getUserRole } from '../services/auth.service.js';
import { LiaFileAlt } from "react-icons/lia";

const Sidebar = () => {
  //const userRole = getUserRole();
  //const isAdmin = userRole === "admin" || userRole === "administrador";

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>
          Inicio
        </NavLink>
        <NavLink to="/planilla" className={({ isActive }) => (isActive ? "active" : "")}>
          <LiaFileAlt className="icon" /> Planilla
        </NavLink>
        <NavLink to="/reuniones" className={({ isActive }) => (isActive ? "active" : "")}>
          <span className="icon">📅</span> Reuniones
        </NavLink>
        <NavLink to="/actas" className={({ isActive }) => (isActive ? "active" : "")}>
          <span className="icon">📝</span> Actas
        </NavLink>

      </nav>
    </aside>
  );
};

export default Sidebar;


