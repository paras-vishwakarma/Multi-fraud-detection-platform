import React, { useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import SmsAnalyzer from "./pages/SmsAnalyzer";
import WebsiteAnalyzer from "./pages/WebsiteAnalyzer";
import DocumentAnalyzer from "./pages/DocumentAnalyzer";
import ScanHistory from "./pages/ScanHistory";
import Login from "./pages/Login"; // Ensure you create this component as discussed earlier

// Your existing Page wrapper
function Page({ children }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}

// New: ProtectedRoute wrapper to enforce authentication
function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    // If there is no token, redirect them to the login screen
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  // 1. Initialize auth state by checking if a token already exists in localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <Routes>
      {/* 2. Public Login Route */}
      <Route
        path="/login"
        element={<Login setAuth={setIsAuthenticated} />}
      />

      {/* 3. Protected Dashboard Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Page><Dashboard /></Page>
          </ProtectedRoute>
        }
      />

      <Route
        path="/sms"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Page><SmsAnalyzer /></Page>
          </ProtectedRoute>
        }
      />

      <Route
        path="/website"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Page><WebsiteAnalyzer /></Page>
          </ProtectedRoute>
        }
      />

      <Route
        path="/documents"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Page><DocumentAnalyzer /></Page>
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Page><ScanHistory /></Page>
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}