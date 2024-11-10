// AdminPage.tsx

const AdminPage = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default AdminPage;
