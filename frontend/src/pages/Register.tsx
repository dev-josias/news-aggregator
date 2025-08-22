import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!name || !email || !password) return setErr("All fields are required.");
    if (password.length < 8)
      return setErr("Password must be at least 8 characters.");
    if (password !== confirm) return setErr("Passwords do not match.");
    try {
      setBusy(true);
      await register(name, email, password, confirm);
      nav("/preferences", { replace: true });
    } catch (e: unknown) {
      let errors: Record<string, string[]> | undefined;
      let message: string | undefined;
      if (typeof e === "object" && e !== null && "response" in e) {
        const errObj = e as {
          response?: {
            data?: { errors?: Record<string, string[]>; message?: string };
          };
        };
        errors = errObj.response?.data?.errors;
        message = errObj.response?.data?.message;
      }
      setErr(
        (errors && Object.values(errors)[0]?.[0]) ||
          message ||
          "Registration failed."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="articles-container" style={{ maxWidth: 520 }}>
      <h2 className="section-title">Create account</h2>

      <form onSubmit={onSubmit} className="search-container">
        {err && (
          <div className="toast error" role="alert">
            {err}

            <button className="btn btn-primary" onClick={() => setErr(null)}>
              Close
            </button>
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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

        <div className="form-group">
          <label className="form-label" htmlFor="confirm">
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            className="form-input"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <div className="form-footer">
          <button className="btn btn-primary" disabled={busy}>
            {busy ? "Creating…" : "Sign up"}
          </button>
          <div className="form-link">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </form>
    </section>
  );
}
