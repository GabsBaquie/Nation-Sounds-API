import { Router } from 'express';
import SecurityInfoController from '../controllers/SecurityInfoController';

const router = Router();

router.get('/', SecurityInfoController.getAll);
router.post('/', SecurityInfoController.create);

export default router;
