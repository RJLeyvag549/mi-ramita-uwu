import path from "path";
import { AppDataSource } from "../config/configDb.js";
import jwt from "jsonwebtoken";
import User from "../entity/user.entity.js";
import { comparePassword } from "../helpers/bcrypt.helper.js";
import { HOST, PORT, SESSION_SECRET } from "../config/configEnv.js";
import { createUserService } from "../services/user.service.js";
import { registerValidation, validateUploadedFiles, loginValidation} from "../validations/auth.validation.js";
import { groupErrorsByField } from "../helpers/errorFormatter.helper.js"
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* FUNCIÓN PARA REGISTRAR UN NUEVO USUARIO
export async function register(req, res) {
  try {
    
    //console.log("BODY:", req.body);
    //console.log("FILES:", req.files);

    //* VALIDACIÓN DOCUMENTOS (CÉDULA Y RESIDENCIA)
    const fileError = validateUploadedFiles(req.files);
    if (fileError) {
      return res.status(400).json({ message: fileError });
    }

    //*VALIDACIÓN DATOS DEL BODY (CON AHRUPACIÓN DE ERRORES)
    const { error } = registerValidation.validate(req.body, { abortEarly: false }); 
    if (error) {
      return res.status(400).json({
        message: "Hay errores en los datos enviados",
        errors: groupErrorsByField(error.details)
});
    }

    const userRepository = AppDataSource.getRepository(User);

    const { firstName, lastName, rut, email, password, contact, homeAddress } = req.body;

    const docIdentityFile = req.files?.docIdentity?.[0];
    const docResidenceFile = req.files?.docResidence?.[0];

    if (!firstName || !lastName || !rut || !email || !password || !contact || !homeAddress || !docIdentityFile || !docResidenceFile) {
      return res.status(400).json({ message: "Faltan campos obligatorios o documentos :V" });
    }

    //* VALIDACIÓN SI EXISTE EMAIL/RUT EN DB
    const existingEmail = await userRepository.findOne({ where: { email } });
    if (existingEmail) return res.status(409).json({ message: "Correo ya registrado" });

    const existingRut = await userRepository.findOne({ where: { rut } });
    if (existingRut) return res.status(409).json({ message: "RUT ya registrado" });

    //* PARA CONSTRUIR LAS URL DE LOS DOCUMENTOS
    const baseUrl = `http://${HOST}:${PORT}/api/src/upload/`;  //* Ruta base
    const docIdentityUrl = baseUrl + path.basename(docIdentityFile.path);
    const docResidenceUrl = baseUrl + path.basename(docResidenceFile.path);

    const [newUser, creationError] = await createUserService({
      firstName,
      lastName,
      rut,
      email,
      password,
      contact,
      homeAddress,
      docIdentity: docIdentityUrl,
      docResidence: docResidenceUrl,
    });

    if (creationError) return res.status(500).json({ message: creationError });

    const { password: _, ...safeUser } = newUser;

    return res.status(201).json({
      message: "Solicitud de registro enviada con éxito. En espera de aprobación!",
      user: safeUser
    });

  } catch (error) {
    console.error("Error en auth.controller.js -> register():", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* FUNCIÓN PARA INICIAR SESIÓN
export async function login(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const { email, password } = req.body;

    const { error } = loginValidation.validate(req.body, { abortEarly: false }); 
    if (error) {
      const formattedErrors = groupErrorsByField(error.details);
      return res.status(400).json({
        message: "Error al iniciar sesión",
        details: formattedErrors
      });
    }

    //* BUSCA AL USUARIO EN LA BD POR EMAIL
    const userFound = await userRepository.findOne({ where: { email } });
    
    if (!userFound) {
      return res.status(400).json({
        message: "Error al iniciar sesión",
        details: {
          email: ["El correo electrónico debe ser válido."]
        }
      });
    }

    //* COMPARA CONTRASEÑA INGRESADA CON LA QUE ESTÁ EN LA BD (ENCRIPTADA)
    const isMatch = await comparePassword(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Error al iniciar sesión",
        details: {
          password: ["Contraseña inválida."]
        }
      });
    }

    //* CREA TOKEN (JWT)
    const payload = {
      id: userFound.id,
      email: userFound.email,
      role: userFound.role,
    };
    const accessToken = jwt.sign(payload, SESSION_SECRET, { expiresIn: "1d" });

    //* ENVÍA TOKEN COMO RESPUESTA
res.status(200).json({
  message: "Inicio de sesión exitoso",
  token: accessToken, // 👈 así lo espera tu frontend
});

  } catch (error) {
    console.error("Error en auth.controller.js -> login(): ", error);
    return res.status(500).json({ message: "Error al iniciar sesión" });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* FUNCIÓN PARA CERRAR SESIÓN                                                          
export async function logout(req, res) {
  // Eliminar la cookie de sesión del cliente
  try {
    res.clearCookie("jwt", { httpOnly: true });
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al cerrar sesión" });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* FUNCIÓN QUE OBTIENE EL PERFIL DEL USUARIO AUTENTICADO - VER SI USAR ESTO, POR QUE SIRVE PARA QUE EL PROPIO USUARIO VEA SU PERFIIL
export async function getProfile(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userEmail = req.user.email;
    const user = await userRepository.findOne({ where: { email: userEmail } });
    
    if (!user) {
      return res.status(404).json({ message: "Perfil no encontrado." });
    }

    const formattedUser = {
      id: user.id,
      username: user.firstName + " " + user.lastName,
      email: user.email,
      rut: user.rut,
      role: user.role
    };

    res.status(200).json({ message: "Perfil encontrado: ", data: formattedUser });
  } catch (error) {
    console.error("Error en user.controller -> getProfile(): ", error);
    res.status(500).json({ message: "Error interno del servidor"})
  }
}





