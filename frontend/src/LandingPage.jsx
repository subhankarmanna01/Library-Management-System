import "./LandingPage.css";

function LandingPage({ onLogin, onRegister }) {
  return (
    <div className="landing-page">

      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="landing-logo">
          📚 <span>LibraryMS</span>
        </div>

        <div className="landing-nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>

          <button
            className="nav-login-btn"
            onClick={onLogin}
          >
            Login
          </button>

          <button
            className="nav-register-btn"
            onClick={onRegister}
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="landing-content">

        <h1>
          Library Management
          <br />
          System
        </h1>

        <p>
          Manage Books, Members and Borrowing Easily
        </p>

        <div className="landing-buttons">
          <button
            className="landing-login-btn"
            onClick={onLogin}
          >
            Login
          </button>

          <button
            className="landing-register-btn"
            onClick={onRegister}
          >
            Register
          </button>
        </div>

      </div>

    </div>
  );
}

export default LandingPage;
