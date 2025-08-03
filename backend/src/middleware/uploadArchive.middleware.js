//* ESTE ARCHIVO PERMITE QUE USUARIOS SUBAN ARCHIVOS AL BACKEND

import multer from "multer";

//* CONFIGURACIÓN DEL ALMACENAMIENTO 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/upload/");
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, fileName);
  },
});

//* FILTRO: ACPTA ARCHIVOS PDF, JPEG O PNG 
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos PDF, JPG o PNG"), false);
  }
};

//* ESTABLECE LÍMITE DE TAMAÑO (5MB)
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: fileFilter,
});

//* ACEPTA MÁXIMO 1 ARCHIVO POR CAMPO
const uploadDocuments = upload.fields([
  { name: "docIdentity", maxCount: 1 },
  { name: "docResidence", maxCount: 1 },
]);

//* MANEJO DE ERRORES PARA EL TAMAÑO DEL ARCHIVO
const handleFileSizeLimit = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: "El archivo excede el límite de 5MB" });
  } else if (err) {
		//* MANEJO ERRORES PARA EL TIPO DE ARCHIVO
    return res.status(400).json({ message: err.message });
  }
  next();
};

export { uploadDocuments, handleFileSizeLimit };
