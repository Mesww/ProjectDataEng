import { addBorrowerController,getBorrowerController,getBorrowersController,updateBorrowerController,deleteBorrowerController, checkOverdueStatusesController } from '../controllers/borrower.controller';

import { Router } from 'express';

const router = Router();

router.get('/', getBorrowersController);
router.post('/', addBorrowerController);
router.get('/checkOverdueStatuses', checkOverdueStatusesController);
router.get('/:id', getBorrowerController);
router.put('/:id', updateBorrowerController);
router.delete('/:id', deleteBorrowerController);

export default router;