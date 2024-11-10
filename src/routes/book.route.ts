
import { getBookController,getBooksController,deleteBookController,updateBookController,addBookController } from '../controllers/book.controller';

import express from 'express';
const router = express.Router();

router.get('/', getBooksController);
router.post('/', addBookController);
router.get('/:id', getBookController);
router.put('/:id', updateBookController);
router.delete('/:id', deleteBookController);

export default router;