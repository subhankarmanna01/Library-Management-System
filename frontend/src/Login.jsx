import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://library-management-system-i41u.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
  alert("Login successful!");

  localStorage.setItem("libraryAdminLoggedIn", "true");

  onLogin(data.user);

      } else {
        alert(data.message || "Invalid username or password");
      }
    } catch (error) {
      alert("Backend server is not running!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>📚 Library Management System</h1>

        <h2>Admin Login</h2>

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            🔐 Login
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;
