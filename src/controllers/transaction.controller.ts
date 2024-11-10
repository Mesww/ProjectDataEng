import { addTransaction,getTransaction,getTransactions,deleteTransaction,updateTransaction } from '../services/transaction.service';
import { Request, Response } from 'express';

export const getTransactionsController = async (req: Request, res: Response) => {
    try {
    const transactions = await getTransactions();
    res.status(transactions.status).json(transactions);
    } catch (error) {
    res.status(500).json({ message: error });
    }
}

export const addTransactionController = async (req: Request, res: Response) => {
    try {
    const transaction = await addTransaction(req.body);
    res.status(transaction.status).json(transaction);
    } catch (error) {
    res.status(500).json({ message: error });
    }
}

export const getTransactionController = async (req: Request, res: Response) => {
    try {
    const transaction = await getTransaction(req.params.id);
    res.status(transaction.status).json(transaction);
    } catch (error) {
    res.status(500).json({ message: error });
    }
}

export const updateTransactionController = async (req: Request, res: Response) => {
    try {
    const transaction = await updateTransaction(req.params.id, req.body);
    res.status(transaction.status).json(transaction);
    } catch (error) {
    res.status(500).json({ message: error });
    }
}

export const deleteTransactionController = async (req: Request, res: Response) => {
    try {
    const transaction = await deleteTransaction(req.params.id);
    res.status(transaction.status).json(transaction);
    } catch (error) {
    res.status(500).json({ message: error });
    }
}




