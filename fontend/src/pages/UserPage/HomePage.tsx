import { Link } from "react-router-dom";

const HomePage = ({ onLogout }: { onLogout: () => void }) => (
  <div>
    <h1>Home Page</h1>
    <button onClick={onLogout}>Logout</button>
  </div>
);

export default HomePage;
