import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Header = ({
  onViewChange,
  currentView,
}: {
  onViewChange: (view: string) => void;
  currentView: string;
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={() => onViewChange("home")}>
          NewsHub
        </div>

        <nav className={`nav-menu ${mobileMenuOpen ? "active" : ""}`}>
          <a
            href="#"
            className={`nav-link ${currentView === "home" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              onViewChange("home");
            }}
          >
            Home
          </a>
          <a
            href="#"
            className={`nav-link ${currentView === "feed" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              onViewChange("feed");
            }}
          >
            My Feed
          </a>
          <a
            href="#"
            className={`nav-link ${
              currentView === "bookmarks" ? "active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              onViewChange("bookmarks");
            }}
          >
            Bookmarks
          </a>
          <a
            href="#"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              onViewChange("trending");
            }}
          >
            Trending
          </a>
        </nav>

        <div className="auth-buttons">
          {user ? (
            <div className="user-menu">
              <div
                className="user-avatar"
                onClick={() => onViewChange("preferences")}
              >
                {user.name[0].toUpperCase()}
              </div>
              <button className="btn btn-secondary" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <button
                className="btn btn-secondary"
                onClick={() => onViewChange("login")}
              >
                Login
              </button>
              <button
                className="btn btn-primary"
                onClick={() => onViewChange("register")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>
    </header>
  );
};

export default Header;
