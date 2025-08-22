import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Toast from "../components/Toast";
import { parseApiError } from "../utils/apiErrors";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!email || !password) return setErr("Email and password are required.");
    try {
      setBusy(true);
      await login(email, password);
      nav("/feed", { replace: true });
    } catch (e: unknown) {
      const parsed = parseApiError(e);
      setErr(parsed.message || "Invalid credentials.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="articles-container" style={{ maxWidth: 480 }}>
      <h2 className="section-title">Log in</h2>

      <form onSubmit={onSubmit} className="search-container">
        {err && (
          <Toast type="error" message={err} onClose={() => setErr(null)} />
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-footer">
          <button className="btn btn-primary" disabled={busy}>
            {busy ? "Signing in…" : "Log in"}
          </button>
          <div className="form-link">
            Don’t have an account? <Link to="/register">Sign up</Link>
          </div>
        </div>
      </form>
    </section>
  );
}
