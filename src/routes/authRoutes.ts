import { Router } from "express";
import { validateRequest } from "../validators/validateRequest";
import { authSchema } from "../validators/schemas/authSchema";
import { login } from "../services/authService";

const router = Router();

router.post("/", validateRequest(authSchema), login);

export default router;
