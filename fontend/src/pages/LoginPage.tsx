import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onLogin }: { onLogin: (role: string) => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Simulate a simple users array with roles
  const users = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "user", password: "123", role: "user" },
  ];

  const handleLogin = () => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      onLogin(user.role); // Pass the role to the parent component
      navigate(user.role === "admin" ? "/admin" : "/"); // Redirect based on role
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
