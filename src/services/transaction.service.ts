import Transaction from "../models/Transactions";
import { ITransaction } from "../interfaces/transaction.interface";
import Book from "../models/Books";
import Borrower, { BorrowingHistorySchema } from "../models/Borrowers";
import { IBorrowingHistory } from "../interfaces/borrower.interface";

export const getTransactions = async () => {
  try {
    const transactions = await Transaction.find();
    return { status: 200, transactions, message: "Transactions found" };
  } catch (error) {
    return { status: 500, message: error };
  }
};

export const addTransaction = async (transaction: ITransaction) => {
  try {
    // 1. Create and save new transaction
    const newTransaction = new Transaction(transaction);
    const savedTransaction = await newTransaction.save();

    // 2. Update book status
    const book = await Book.findById(transaction.book_id);
    if (!book) {
      // Rollback transaction if book not found
      await Transaction.findByIdAndDelete(savedTransaction._id);
      return { status: 404, message: "Book not found" };
    }

    book.available = false;
    book.borrower_id = transaction.borrower_id.toString();
    book.due_date = transaction.due_date;
    await book.save();

    // 3. Update borrower history
    const user = await Borrower.findById(transaction.borrower_id);
    if (!user) {
      // Rollback changes if borrower not found
      await Transaction.findByIdAndDelete(savedTransaction._id);
      book.available = true;
      book.borrower_id = undefined;
      book.due_date = undefined;
      await book.save();
      return { status: 404, message: "Borrower not found" };
    }

    // Add to borrowing history
    const borrowing_history: IBorrowingHistory = {
      book_id: transaction.book_id.toString(),
      borrow_date: new Date(transaction.borrow_date),
      due_date: new Date(transaction.due_date),
      return_date: undefined,
      status: "borrowed",
      finds: 0,
    };

    user.borrowing_history?.push(borrowing_history);
    await user.save();

    return {
      status: 200,
      transaction: savedTransaction,
      message: "Transaction added successfully",
    };
  } catch (error) {
    console.error("Error in addTransaction:", error);
    return {
      status: 500,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

export const getTransaction = async (id: string) => {
  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return { status: 404, message: "Transaction not found" };
    }
    return { status: 200, transaction, message: "Transaction found" };
  } catch (error) {
    return { status: 500, message: error };
  }
};

export const updateTransaction = async (
  id: string,
  transaction: ITransaction
) => {
  try {
    const existingTransaction = await Transaction.findById(id);

    if (!existingTransaction) {
      return { status: 404, message: "Transaction not found" };
    }

    existingTransaction.book_id =
      transaction.book_id ?? existingTransaction.book_id;
    existingTransaction.borrower_id =
      transaction.borrower_id ?? existingTransaction.borrower_id;
    existingTransaction.borrow_date =
      transaction.borrow_date ?? existingTransaction.borrow_date;
    existingTransaction.due_date =
      transaction.due_date ?? existingTransaction.due_date;
    existingTransaction.return_date =
      transaction.return_date ?? existingTransaction.return_date;

    const updatedTransaction = await existingTransaction.save();
    return {
      status: 200,
      transaction: updatedTransaction,
      message: "Transaction updated successfully",
    };
  } catch (error) {
    return { status: 500, message: error };
  }
};

export const deleteTransaction = async (id: string) => {
  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return { status: 404, message: "Transaction not found" };
    }

    // 1. Update book status
    const book = await Book.findById(transaction.book_id);
    if (!book) {
      return { status: 404, message: "Book not found" };
    }
    book.available = true;
    book.borrower_id = undefined;
    book.due_date = undefined;
    await book.save();

    // 2. Add returndate to borrowing history
    const user = await Borrower.findById(transaction.borrower_id);
    if (!user) {
      return { status: 404, message: "Borrower not found" };
    }
    const borrowing_history = user.borrowing_history?.filter(
      (book) =>
        book.book_id.toString() === transaction.book_id.toString() &&
        !book.return_date &&
        book.borrow_date.toString() === transaction.borrow_date.toString()
    );
    if (!borrowing_history || borrowing_history.length === 0) {
      return { status: 404, message: "Borrowing history not found" };
    }
    borrowing_history[0].return_date = new Date();
    await user.save();

    // 3. Delete transaction 
    await Transaction.deleteOne({ _id: transaction._id });
    return {
      status: 200,
      transaction,
      message: "Transaction deleted successfully",
    };
  } catch (error) {
    return { status: 500, message: error };
  }
};

