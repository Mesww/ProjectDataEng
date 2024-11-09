import Book from '../models/Books'; // Import the model you want to work with
import {IBook} from '../interfaces/book.interface';
export const getBooks = async () => {
    try {
        const books = await Book.find();
        if (books.length === 0) {
        return {"Books":books,status:200,message:"Emty book"};
        }
        return {"Books":books,status:200,message:"Books found"};
    } catch (error) {
        throw new Error(`Error ${error}`);
    }
}
export const addBook = async (book:IBook) => {
    try {
        book.publication_date = new Date(book.publication_date);

        const newBook = new Book(book);
        // console.log(newBook);
        const saveBook = await newBook.save();
        // console.log(saveBook);
        return {"book":saveBook,status:200,message:"Book added successfully"};
    } catch (error) {
        return {"book":null,status:500,message:`Error ${error}`};
    }
}

export const getBook = async (id:string) => {
    try {
        const book = await Book.findById(id);
        if (!book) {
            return { "book":null,status:404,message:"Book not found" };
        }
        return {"book":book,status:200,message:"Book found"};
    }
    catch (error) {
        throw new Error(`Error ${error}`);
    }
}
export const updateBook = async (id:string,book:IBook) => {
    try {
        const existingBook = await Book.findById(id);

        // If the book is not found, throw an error
        if (!existingBook) {
            return { "book":null,status:404,message:"Book not found" };
        //   throw new Error(`Book with ID ${id} not found.`);
        }
    
        // Update the book's properties with the provided data
        existingBook.title = book.title ?? existingBook.title;
        existingBook.author = book.author ?? existingBook.author;
        existingBook.genre = book.genre ?? existingBook.genre;
        existingBook.publication_date = book.publication_date ?? existingBook.publication_date;
        existingBook.isbn = book.isbn ?? existingBook.isbn;
        existingBook.available = book.available ?? existingBook.available;
        existingBook.borrower_id = book.borrower_id ?? existingBook.borrower_id;
        existingBook.due_date = book.due_date ?? existingBook.due_date;
        const updatedBook = await existingBook.save();
        
        return {"book":updatedBook,status:200,message:`Book ${existingBook.title} updated successfully`};
    } catch (error) {
        throw new Error(`Error ${error}`);
    }
}

export const deleteBook = async (id:string) => {
    try {
        const book = await Book.findById(id);
        if (!book) {
            return { "book":null,status:404,message:"Book not found" };
        }
        await Book.deleteOne({ _id: book._id });
        return {"book":book,status:200,message:"Book deleted"};
    } catch (error) {
        throw new Error(`Error ${error}`);
    }
}