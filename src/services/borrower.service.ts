import Borrower from '../models/Borrowers'
import { IBorrower } from '../interfaces/borrower.interface';
import e from 'express';

export const getBorrowers = async () => {
    try {
        const borrowers = await Borrower.find();
        if (borrowers.length === 0) {
            return {"Borrowers":borrowers,status:200,message:"Empty borrower"};
        }
        return {"Borrowers":borrowers,status:200,message:"Borrowers found"};
    } catch (error) {
        throw new Error(`Error ${error}`);
    }
}

export const addBorrower = async (borrower:IBorrower) => {
    try {
        const newBorrower = new Borrower(borrower);
        await newBorrower.save();

        return {"borrower":newBorrower,status:201,message:"Borrower added successfully"};
    } catch (error) {
        throw new Error(`Error ${error}`);
    }
}

export const getBorrower = async (id:string) => {
    try {
        const borrower = await Borrower.findById(id);
        if (!borrower) {
            return { "borrower":null,status:404,message:"Borrower not found" };
        }
        return {"borrower":borrower,status:200,message:"Borrower found"};
    }
    catch (error) {
        throw new Error(`Error ${error}`);
    }
}

export const updateBorrower = async (id:string,borrower:IBorrower) => {
    try {
        const existingBorrower = await Borrower.findById(id);

        // If the borrower is not found, throw an error
        if (!existingBorrower) {
            return { "borrower":null,status:404,message:"Borrower not found" };
        //   throw new Error(`Borrower with ID ${id} not found.`);
        }
    
        // Update the borrower's properties with the provided data
        existingBorrower.name = borrower.name ?? existingBorrower.name;
        existingBorrower.email = borrower.email ?? existingBorrower.email;
        existingBorrower.phone = borrower.phone ?? existingBorrower.phone;
        existingBorrower.activeStatus = borrower.activeStatus ?? existingBorrower.activeStatus;
        existingBorrower.borrowing_history = borrower.borrowing_history ?? existingBorrower.borrowing_history
       
        const updatedBorrower = await existingBorrower.save();
        
        return {"borrower":updatedBorrower,status:200,message:`Borrower ${existingBorrower.name} updated successfully`};
    } catch (error) {
        throw new Error(`Error ${error}`);
    }
}

export const deleteBorrower = async (id:string) => {
    try {
        const borrower = await Borrower.findByIdAndDelete(id);
        if (!borrower) {
            return { "borrower":null,status:404,message:"Borrower not found" };
        }
        return {"borrower":borrower,status:200,message:"Borrower deleted"};
    } catch (error) {
        throw new Error(`Error ${error}`);
    }
}