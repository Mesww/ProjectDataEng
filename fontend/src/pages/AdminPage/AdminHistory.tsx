import { useEffect, useState } from 'react';
import { fetchborrowers } from '../../api/borrowerApi'; // Adjust import path based on your file structure
import { fetchBookById } from '../../api/booksApi';
import SidebarAdmin from '../../components/SidbarAdmin'; // Adjust this import

const AdminHistoryPage = () => {
  const [borrowingHistory, setBorrowingHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch borrowers and their borrowing history
  useEffect(() => {
    const loadBorrowingHistory = async () => {
      try {
        const response = await fetchborrowers();
        
        // Flatten the borrowing history into a single list
        const flattenedHistory = response.Borrowers.reduce((acc, borrower) => {
          borrower.borrowing_history.forEach((history) => {
            acc.push({ borrower: borrower.name, ...history });
          });
          return acc;
        }, []);

        setBorrowingHistory(flattenedHistory); // Store the combined borrowing history in state
      } catch (err) {
        setError("Failed to load borrowing history");
      } finally {
        setLoading(false);
      }
    };

    loadBorrowingHistory();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Admin */}
      <SidebarAdmin />

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">Admin Borrowing History</h1>

        {loading ? (
          <div className="text-center text-xl text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-xl text-red-500">{error}</div>
        ) : (
          <div className="space-y-6">
            {borrowingHistory.length > 0 ? (
              borrowingHistory.map((history) => (
                <div key={history._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-all">
                  <div className="mb-4">
                    <h3 className="text-2xl font-semibold text-gray-800">Borrower: {history.borrower}</h3>
                    <p className="text-gray-600">Book ID: {history.book_id}</p>
                    <p className="text-gray-600">Borrow Date: {new Date(history.borrow_date).toLocaleDateString()}</p>
                    <p className="text-gray-600">Return Date: {history.return_date == null ? 'Not returned yet' : new Date(history.return_date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No borrowing history available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHistoryPage;
