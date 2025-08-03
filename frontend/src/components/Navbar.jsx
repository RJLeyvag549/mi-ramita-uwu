import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout } from '../services/auth.service.js';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const logoutSubmit = () => {
        try {
            logout();
            navigate('/'); 
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <img
                        src="/family.png"
                        alt="Logo metodología de desarrollo"
                    />
                    <h1 color='white'>Junta de Vecinos</h1>
                </li>
                
                <li className={location.pathname === "/" ? "active" : ""}>
                    <NavLink to="/" onClick={logoutSubmit} className="boton-cerrar">Cerrar</NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
