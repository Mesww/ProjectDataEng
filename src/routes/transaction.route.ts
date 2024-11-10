import { addTransactionController,updateTransactionController,getTransactionController,getTransactionsController,deleteTransactionController } from '../controllers/transaction.controller';
import { Router } from 'express';
const router = Router();

router.get('/', getTransactionsController);
router.post('/', addTransactionController);
router.get('/:id', getTransactionController);
router.put('/:id', updateTransactionController);
router.delete('/:id', deleteTransactionController);

export default router;