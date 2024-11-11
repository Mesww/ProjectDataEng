import { useEffect, useState } from "react";
import SidebarAdmin from "../../components/SidbarAdmin";
import { useAuth } from "../../context/AuthContext";
import { fetchBooks, updateBook, deleteBook, addBook } from "../../api/booksApi";
import Books from "../../interfaces/bookInterface";

const AdminPage = () => {
  const { user, logout } = useAuth();
  const [books, setBooks] = useState<Books[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Books | null>(null);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    publication_date: new Date().toISOString().substring(0, 10),
    isbn: "",
    available: true
  });

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await fetchBooks();
        setBooks(response.books.Books);
      } catch (err) {
        setError("Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  // Function to handle adding a new book
  const handleAddBook = async () => {
    try {
      const response = await addBook(newBook);
      setBooks((prevBooks) => [...prevBooks, response.book]);
      setShowAddModal(false);
      // Reset the new book form
      setNewBook({
        title: "",
        author: "",
        genre: "",
        publication_date: new Date().toISOString().substring(0, 10),
        isbn: "",
        available: true
      });
    } catch (err) {
      setError("Failed to add book");
    }
  };

  // Function to handle updating a book
  const handleUpdateBook = async (id: string) => {
    if (!selectedBook) return;

    try {
      await updateBook(id, selectedBook);
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book._id === id ? selectedBook : book))
      );
      setShowEditModal(false);
    } catch (err) {
      setError("Failed to update book");
    }
  };

  // Function to handle deleting a book
  const handleDeleteBook = async (id: string) => {
    try {
      await deleteBook(id);
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
      setShowDeleteModal(false);
    } catch (err) {
      setError("Failed to delete book");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarAdmin />

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold mb-4">Welcome, {user?.name}</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-6"
        >
          Logout
        </button>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">All Books</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add New Book
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && books.length === 0 && <p>No books available.</p>}

        {books.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book) => (
              <div key={book._id} className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-xl font-semibold">{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Genre:</strong> {book.genre}</p>
                <p><strong>Publication Date:</strong> {new Date(book.publication_date).toLocaleDateString()}</p>
                <p><strong>ISBN:</strong> {book.isbn}</p>
                <p><strong>Available:</strong> {book.available ? "Yes" : "No"}</p>
                <p><strong>Due Date:</strong> {book.due_date == null ? "N/A" : new Date(book.due_date).toLocaleDateString()}</p>

                <button
                  onClick={() => {
                    setSelectedBook(book);
                    setShowEditModal(true);
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded mt-2 mr-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    setSelectedBook(book);
                    setShowDeleteModal(true);
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-2xl font-semibold mb-4">Add New Book</h2>
            <input
              type="text"
              placeholder="Title"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Author"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Genre"
              value={newBook.genre}
              onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <input
              type="date"
              value={newBook.publication_date}
              onChange={(e) => setNewBook({ ...newBook, publication_date: e.target.value })}
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="ISBN"
              value={newBook.isbn}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newBook.available}
                onChange={(e) => setNewBook({ ...newBook, available: e.target.checked })}
                className="mr-2"
              />
              Available
            </label>

            <div className="flex mt-4">
              <button
                onClick={handleAddBook}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Add Book
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedBook && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-2xl font-semibold mb-4">Edit Book</h2>
            <input
              type="text"
              placeholder="Title"
              value={selectedBook.title}
              onChange={(e) => setSelectedBook({ ...selectedBook, title: e.target.value })}
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Author"
              value={selectedBook.author}
              onChange={(e) => setSelectedBook({ ...selectedBook, author: e.target.value })}
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Genre"
              value={selectedBook.genre}
              onChange={(e) => setSelectedBook({ ...selectedBook, genre: e.target.value })}
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <input
              type="date"
              value={new Date(selectedBook.publication_date).toISOString().substring(0, 10)}
              onChange={(e) => setSelectedBook({ ...selectedBook, publication_date: new Date(e.target.value).toISOString() })}
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="ISBN"
              value={selectedBook.isbn}
              onChange={(e) => setSelectedBook({ ...selectedBook, isbn: e.target.value })}
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedBook.available}
                onChange={(e) => setSelectedBook({ ...selectedBook, available: e.target.checked })}
                className="mr-2"
              />
              Available
            </label>

            <div className="flex mt-4">
              <button
                onClick={() => handleUpdateBook(selectedBook._id)}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBook && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete the book titled "{selectedBook.title}"?</p>
            <button
              onClick={() => handleDeleteBook(selectedBook._id)}
              className="bg-red-500 text-white px-4 py-2 rounded mr-2 mt-4"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded mt-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;