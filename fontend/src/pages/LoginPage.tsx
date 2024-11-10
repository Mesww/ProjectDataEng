import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchborrowers } from "../api/borrowerApi"; // Assuming this is the correct import

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      // Fetch borrowers from the API
      const response = await fetchborrowers();
      const borrowers = response.Borrowers;

      // Find the user by matching email and password
      const user = borrowers.find(
        (u: { email: string; password: string; }) => u.email === email && u.password === password 
      );

      if (user) {
        // Store user data without the password
        login({
          email: user.email,
          role: user.role,
          name: user.name,
          activeStatus: user.activeStatus,
          id: user._id

        });
        navigate(user.role === "admin" ? "/admin" : "/");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Failed to fetch borrowers");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Enter your credentials to access your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center text-red-500 mb-4">
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
