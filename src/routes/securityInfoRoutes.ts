import { Router } from 'express';
import SecurityInfoController from '../controllers/SecurityInfoController';

const router = Router();

router.get('/', SecurityInfoController.getAll);
router.get('/:id', SecurityInfoController.getById);
router.post('/', SecurityInfoController.create);
router.put('/:id', SecurityInfoController.update);
router.delete('/:id', SecurityInfoController.delete);

export default router;
