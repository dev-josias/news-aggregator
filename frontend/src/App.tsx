// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Header from "./components/Header";
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import Preferences from "./pages/Preferences";
import AuthProvider from "./providers/AuthProvider";
import type { JSX } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/feed"
            element={
              <PrivateRoute>
                <Feed />
              </PrivateRoute>
            }
          />
          <Route
            path="/preferences"
            element={
              <PrivateRoute>
                <Preferences />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
