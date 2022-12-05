import { Router } from "express";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getAutoSuggestedUsers,
} from "../services/userService";
import { validateRequest } from "../validators/validateRequest";
import { userSchema } from "../validators/schemas/userSchema";
import { protect } from "../services/authService";

const router = Router();

// protects all routes after this middleware
router.use(protect);

router.post("/", validateRequest(userSchema), createUser);

router.get("/", getUsers);

router.get("/autosuggest", getAutoSuggestedUsers);

router.get("/:id", getUser);

router.patch("/:id", validateRequest(userSchema), updateUser);

router.delete("/:id", deleteUser);

export default router;
