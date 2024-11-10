import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { fetchTransactions } from '../../api/transactionApi';
import { fetchBookById } from '../../api/booksApi';
import Books from '../../interfaces/bookInterface';

interface Transaction {
  _id: string;
  book_id: string;
  borrower_id: string;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
}

const HistoryPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [books, setBooks] = useState<{ [key: string]: Books }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user.id) {
          // Fetch all transactions and filter by borrower_id
          const response = await fetchTransactions();
          const userTransactions = response.transactions.filter(
            (transaction: Transaction) => transaction.borrower_id === user.id
          );
          setTransactions(userTransactions);

          // Fetch book details for each unique book_id in the transactions
          const uniqueBookIds = [...new Set(userTransactions.map((t) => t.book_id))];
          const bookDetails = await Promise.all(
            uniqueBookIds.map(async (bookId) => {
              const bookData = await fetchBookById(bookId);
              return { book_id: bookId, book: bookData.book.book };
            })
          );

          // Map book details by book_id for easy access
          const bookDetailsMap = bookDetails.reduce((acc, item) => {
            acc[item.book_id] = item.book;
            return acc;
          }, {} as { [key: string]: Books });

          setBooks(bookDetailsMap);
        }
      } catch (err) {
        setError('Failed to fetch transaction history or book details');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-center mb-6">History Page</h1>
        <h2 className="text-2xl font-semibold text-center mb-4">Borrowing History</h2>

        {/* Display Loading, Error, or Borrowing History */}
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && transactions.length === 0 && <p className="text-center">No borrowing history available.</p>}

        {transactions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transactions.map((transaction) => {
              const book = books[transaction.book_id];
              return (
                <div key={transaction._id} className="bg-white shadow-md rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">Book Details</h3>
                  {book ? (
                    <>
                      <p><strong>Title:</strong> {book.title}</p>
                      <p><strong>Author:</strong> {book.author}</p>
                      <p><strong>Genre:</strong> {book.genre}</p>
                      <p><strong>Publication Date:</strong> {new Date(book.publication_date).toLocaleDateString()}</p>
                      <p><strong>ISBN:</strong> {book.isbn}</p>
                      <p className="mt-4"><strong>Due Date:</strong> {new Date(transaction.due_date).toLocaleDateString()}</p>
                    </>
                  ) : (
                    <p>Loading book details...</p>
                  )}
                  <p><strong>Borrowed Date:</strong> {new Date(transaction.borrow_date).toLocaleDateString()}</p>
                  <p><strong>Return Date:</strong> {transaction.return_date ? new Date(transaction.return_date).toLocaleDateString() : 'Not returned yet'}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
