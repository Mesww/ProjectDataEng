
import { deleteBook,getBook,getBooks,updateBook,addBook } from '../services/book.service';
import { Request, Response } from 'express';
import { IBook } from '../interfaces/book.interface';

export const getBooksController = async (req: Request, res: Response) => {
    try {
        console.log('getBooksController');
        const books = await getBooks();
        console.log('books',books);
 
        res.status(books.status).json({ books });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

export const addBookController = async (req: Request, res: Response) => {
    try {
        const body: IBook = req.body;
        const book = await addBook(body);
        res.status(book.status).json({ book });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}
export const getBookController = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const book = await getBook(id);
    
        res.status(book.status).json({ book });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

export const updateBookController = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const body: IBook = req.body;
        const book = await updateBook(id,body);
   
        res.status(book.status).json({ book });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

export const deleteBookController = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const book = await deleteBook(id);
 
        res.status(book.status).json({ book });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}