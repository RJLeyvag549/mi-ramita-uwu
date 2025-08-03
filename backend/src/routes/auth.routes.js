import { Router } from "express"
import { register, login, logout, getProfile } from "../controllers/auth.controller.js"
import { uploadDocuments, handleFileSizeLimit } from "../middleware/uploadArchive.middleware.js";

const router = Router();

router.get("/profile", getProfile);

router.post("/register", uploadDocuments, handleFileSizeLimit, register);
router.post("/login", login);
router.post("/logout", logout);

export default router;