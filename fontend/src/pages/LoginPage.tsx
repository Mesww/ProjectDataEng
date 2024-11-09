import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "user" && password === "password") {
      onLogin();  // Set logged in state
      navigate("/");  // Redirect to the home page
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-400 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Login</h1>
        <div className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLogin}
            className="w-full p-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <span className="text-blue-500 cursor-pointer">Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
