import { Router } from "express";
import {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
  addUsersToGroup,
} from "../services/groupService";
import { validateRequest } from "../validators/validateRequest";
import { groupSchema } from "../validators/schemas/groupSchema";
import { protect } from "../services/authService";

const router = Router();

// protects all routes after this middleware
router.use(protect);

router.post("/", validateRequest(groupSchema), createGroup);

router.get("/", getGroups);

router.post("/addusers", addUsersToGroup);

router.get("/:id", getGroup);

router.patch("/:id", validateRequest(groupSchema), updateGroup);

router.delete("/:id", deleteGroup);


export default router;
