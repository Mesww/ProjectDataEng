import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
// import { fetchHistory } from './api/historyApi'; // Assuming fetchHistory is defined in an API file

const HistoryPage = () => {
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const getHistory = async () => {
//       try {
//         const response = await fetchHistory();
//         setHistory(response.history); // Assuming the response is an array of history items
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getHistory();
//   }, []);

//   if (loading) return <p className="text-center text-xl">Loading...</p>;
//   if (error) return <p className="text-center text-xl text-red-500">Error: {error}</p>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-center mb-6">History Page</h1>

        <h2 className="text-2xl font-semibold text-center mb-4">Action History</h2>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <div key={item._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-bold text-blue-600">{item.action}</h3>
              <p className="text-gray-600 mt-1">Performed By: {item.user}</p>
              <p className="text-gray-600">Date: {new Date(item.date).toLocaleDateString()}</p>
              <p className="text-gray-600">Details: {item.details}</p>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default HistoryPage;
