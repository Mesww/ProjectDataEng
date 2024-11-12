import { useEffect, useState } from "react";
import SidebarAdmin from "../../components/SidbarAdmin";
import { fetchborrowers, addborrower, updateborrower, deleteborrower } from "../../api/borrowerApi";
import Borrower from "../../interfaces/BorrowersInterface";

const AdminBorrowers = () => {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null);
  const [newBorrower, setNewBorrower] = useState<Borrower>({ name: "", email: "", phone: "", activeStatus: true, role: "user", borrowing_history: [] });
  
  const loadBorrowers = async () => {
    try {
      const response = await fetchborrowers();
      setBorrowers(response.Borrowers);
    } catch (err) {
      setError("Failed to load borrowers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBorrowers();
  }, []);

  const handleAddBorrower = async () => {
    try {
      await addborrower(newBorrower);
      setShowAddModal(false);
      setNewBorrower({
        name: "",
        email: "",
        phone: "",
        activeStatus: true,
        role: "user",
        borrowing_history: []
      });
      loadBorrowers();
    } catch (err) {
      setError("Failed to add borrower");
    }
  };

  const handleUpdateBorrower = async (id: string) => {
    if (!selectedBorrower) return;
    try {
      await updateborrower(id, selectedBorrower);
      setBorrowers((prev) => prev.map((b) => (b._id === id ? selectedBorrower : b)));
      setShowEditModal(false);
    } catch (err) {
      setError("Failed to update borrower");
    }
  };

  const handleDeleteBorrower = async (id: string) => {
    try {
      await deleteborrower(id);
      setBorrowers((prev) => prev.filter((b) => b._id !== id));
      setShowDeleteModal(false);
    } catch (err) {
      setError("Failed to delete borrower");
    }
  };

  return (
    <div className="flex min-h-screen">
      <SidebarAdmin />
      <div className="flex-1 bg-gray-50 h-screen overflow-y-auto">
        <div className="p-6">
          <h2 className="text-3xl font-semibold mb-4">Manage Borrowers</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4"
          >
            Add Borrower
          </button>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {borrowers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {borrowers.map((borrower) => (
                <div key={borrower._id} className="bg-white shadow-md rounded-lg p-4">
                  <h3 className="text-xl font-semibold">{borrower.name}</h3>
                  <p><strong>Email:</strong> {borrower.email}</p>
                  <p><strong>Phone:</strong> {borrower.phone}</p>
                  <p><strong>Status:</strong> {borrower.activeStatus ? "Active" : "Inactive"}</p>
                  <p><strong>Role:</strong> {borrower.role}</p>

                  <button
                    onClick={() => {
                      setSelectedBorrower(borrower);
                      setShowEditModal(true);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded mt-2 mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setSelectedBorrower(borrower);
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
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedBorrower && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-2xl font-semibold mb-4">Edit Borrower</h2>
            <input
              type="text"
              placeholder="Name"
              value={selectedBorrower.name}
              onChange={(e) => setSelectedBorrower({ ...selectedBorrower, name: e.target.value })}
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Email"
              value={selectedBorrower.email}
              onChange={(e) => setSelectedBorrower({ ...selectedBorrower, email: e.target.value })}
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Phone"
              value={selectedBorrower.phone}
              onChange={(e) => setSelectedBorrower({ ...selectedBorrower, phone: e.target.value })}
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedBorrower.activeStatus}
                onChange={(e) => setSelectedBorrower({ ...selectedBorrower, activeStatus: e.target.checked })}
                className="mr-2"
              />
              Active Status
            </label>

            <div className="flex mt-4">
              <button
                onClick={() => handleUpdateBorrower(selectedBorrower._id)}
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-2xl font-semibold mb-4">Add Borrower</h2>
            <input
              type="text"
              placeholder="Name"
              value={newBorrower.name}
              onChange={(e) => setNewBorrower({ ...newBorrower, name: e.target.value })}
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Email"
              value={newBorrower.email}
              onChange={(e) => setNewBorrower({ ...newBorrower, email: e.target.value })}
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Phone"
              value={newBorrower.phone}
              onChange={(e) => setNewBorrower({ ...newBorrower, phone: e.target.value })}
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newBorrower.activeStatus}
                onChange={(e) => setNewBorrower({ ...newBorrower, activeStatus: e.target.checked })}
                className="mr-2"
              />
              Active Status
            </label>

            <div className="flex mt-4">
              <button
                onClick={handleAddBorrower}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Add
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBorrower && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete "{selectedBorrower.name}"?</p>
            <button
              onClick={() => handleDeleteBorrower(selectedBorrower._id)}
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

export default AdminBorrowers;