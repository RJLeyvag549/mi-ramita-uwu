import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth.service.js';
import Form from '../components/Formulario.jsx';
import LoginIcon from "../components/LoginIcon.jsx";

const Login = () => {
    const navigate = useNavigate();


const loginSubmit = async (data) => {
    try {
        const res = await login(data);

        // Si todo bien, navegar
        if (res?.token) {
            navigate('/home');
        } else {
            alert("Credenciales incorrectas.");
        }

    } catch (error) {
        console.error("Error en login:", error);
        alert("Ocurrió un error al iniciar sesión.");
    }
};




    return (
        <main className="container">
            <LoginIcon />
            <Form
            title={
    <h1>
    JUNTA VECINAL<br />
    PARQUE ECUADOR
    </h1>
}

                
                fields={[
                    {
                        label: "Correo electrónico",
                        name: "email",
                        placeholder: "example@gmail.com",
                        type: "email",
                        required: true,
                    },
                    {
                        label: "Contraseña",
                        name: "password",
                        placeholder: "**********",
                        type: "password",
                        required: true,
                    },
                ]}
                buttonText="Iniciar sesión"
                onSubmit={loginSubmit}
                footerContent={
                    <p>
                        ¿No tienes cuenta?, <a href="/register">Regístrate aquí!</a>
                    </p>
                }
            />
        </main>
    );
};

export default Login;
