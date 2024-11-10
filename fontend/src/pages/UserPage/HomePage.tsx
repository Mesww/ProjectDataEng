import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar'; // Import Sidebar
import { fetchBooks } from '../../api/booksApi'; // assuming fetchBooks is in a file named bookApi.js

const HomePage = ({ onLogout }: { onLogout: () => void }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBooks = async () => {
      try {
        const response = await fetchBooks();
        const fetchedBooks = response.books.Books; // Accessing the Books array
        setBooks(fetchedBooks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getBooks();
  }, []);

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (error) return <p className="text-center text-xl text-red-500">Error: {error}</p>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-center mb-6">Home Page</h1>
        <div className="text-center mb-6">
          <button 
            onClick={onLogout} 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
            Logout
          </button>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-4">Book List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-bold text-blue-600">{book.title}</h3>
              <p className="text-gray-600 mt-1">Author: {book.author}</p>
              <p className="text-gray-600">Genre: {book.genre}</p>
              <p className="text-gray-600">ISBN: {book.isbn}</p>
              <p className="text-gray-600">Publication Date: {new Date(book.publication_date).toLocaleDateString()}</p>
              <p className="text-gray-600">Availability: {book.available ? 'Available' : 'Checked Out'}</p>
              <p className="text-gray-600">Due Date: {book.due_date ? new Date(book.due_date).toLocaleDateString() : 'N/A'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
