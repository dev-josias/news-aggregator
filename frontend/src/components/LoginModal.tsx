import { useState } from "react";

import type { ModalProps } from "../types";
import { useAuth } from "../hooks/useAuth";

const LoginModal = ({ onClose }: ModalProps) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(email, password);
    setTimeout(onClose, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="form-footer">
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <div className="form-link">
              Don't have an account? <a href="#">Sign up</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
