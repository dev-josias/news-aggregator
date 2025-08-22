import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <nav className="nav-menu" id="nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/feed" className="nav-link">
            My Feed
          </Link>
          <Link to="/preferences" className="nav-link">
            Preferences
          </Link>
        </nav>

        <div className="auth-buttons">
          {!user ? (
            <>
              <Link className="btn btn-secondary" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary" to="/register">
                Sign up
              </Link>
            </>
          ) : (
            <div className="user-menu">
              <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
              <button className="btn btn-secondary" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
