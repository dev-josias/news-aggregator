import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          NewsApp
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? "×" : "☰"}
        </button>

        <nav className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`}>
          <Link to="/" className="nav-link" onClick={closeMobileMenu}>
            Home
          </Link>
          <Link to="/feed" className="nav-link" onClick={closeMobileMenu}>
            My Feed
          </Link>
          <Link
            to="/preferences"
            className="nav-link"
            onClick={closeMobileMenu}
          >
            Preferences
          </Link>
        </nav>

        <div className="auth-buttons">
          {!user ? (
            <>
              <Link
                className="btn btn-secondary"
                to="/login"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
              <Link
                className="btn btn-primary"
                to="/register"
                onClick={closeMobileMenu}
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="user-menu">
              <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
