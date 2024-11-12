import { getBorrower,getBorrowers,addBorrower,updateBorrower,deleteBorrower, checkOverdueStatuses } from '../services/borrower.service';

import { Request, Response } from 'express';

export const getBorrowersController = async (req: Request, res: Response) => {
    try {
        const response = await getBorrowers();
        res.status(response.status).send(response);
    } catch (error) {
        res.status(500).send({ "borrowers":null,status:500,message:"Internal server error" });
    }
}

export const addBorrowerController = async (req: Request, res: Response) => {
    try {
        const response = await addBorrower(req.body);
        res.status(response.status).send(response);
    } catch (error) {
        res.status(500).send({ "borrower":null,status:500,message:"Internal server error" });
    }
}

export const getBorrowerController = async (req: Request, res: Response) => {
    try {
        const response = await getBorrower(req.params.id);
        res.status(response.status).send(response);
    } catch (error) {
        res.status(500).send({ "borrower":null,status:500,message:"Internal server error" });
    }
}

export const updateBorrowerController = async (req: Request, res: Response) => {
    try {
        const response = await updateBorrower(req.params.id,req.body);
        res.status(response.status).send(response);
    } catch (error) {
        res.status(500).send({ "borrower":null,status:500,message:"Internal server error" });
    }
}

export const deleteBorrowerController = async (req: Request, res: Response) => {
    try {
        const response = await deleteBorrower(req.params.id);
        res.status(response.status).send(response);
    } catch (error) {
        res.status(500).send({ "borrower":null,status:500,message:"Internal server error" });
    }
}
export const checkOverdueStatusesController = async (req: Request, res: Response) => {
    try {
        const response = await checkOverdueStatuses();
        res.status(response.status).send(response);
    } catch (error) {
        res.status(500).send({ status: 500, message: "Internal server error while updating overdue statuses" });
    }
};