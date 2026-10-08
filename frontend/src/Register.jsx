import { useState } from "react";
import "./Register.css";

function Register({ onBackToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        "https://library-management-system-i41u.onrender.com/api/auth/register",
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
        alert("Registration successful! Please login.");

        setUsername("");
        setPassword("");
        setConfirmPassword("");

        onBackToLogin();
      } else {
        alert(data.message || "Registration failed");
      }

    } catch (error) {
      alert("Backend server is not running!");
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        <h1>📚 Library Management System</h1>

        <h2>Create Account</h2>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">
            📝 Register
          </button>

        </form>

        <p className="login-link">
          Already have an account?
          <button onClick={onBackToLogin}>
            Login
          </button>
        </p>

      </div>

    </div>
  );
}

export default Register;
