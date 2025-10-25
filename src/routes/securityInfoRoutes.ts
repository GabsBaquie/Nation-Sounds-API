import { Router } from "express";
import SecurityInfoController from "../controllers/SecurityInfoController";
import { CreateSecurityInfoDto } from "../dto/requests/security-info.dto";
import { validateDto } from "../middleware/validateDto";

const router = Router();

router.get("/", SecurityInfoController.getAll);
router.get("/:id", SecurityInfoController.getById);
router.post(
  "/",
  validateDto(CreateSecurityInfoDto),
  SecurityInfoController.create
);
router.put(
  "/:id",
  validateDto(CreateSecurityInfoDto),
  SecurityInfoController.update
);
router.delete("/:id", SecurityInfoController.delete);

export default router;
