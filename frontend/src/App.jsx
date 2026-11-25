import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import SmsAnalyzer from "./pages/SmsAnalyzer";
import WebsiteAnalyzer from "./pages/WebsiteAnalyzer";
import DocumentAnalyzer from "./pages/DocumentAnalyzer";
import ScanHistory from "./pages/ScanHistory";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PageLoader from "./components/PageLoader";

function Page({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <>
      {/* Route-change transition loader */}
      <PageLoader />

      <Routes>
        {/* ── Public Landing Page ── */}
        <Route path="/" element={<Home />} />

        {/* ── Main Dashboard ── */}
        <Route
          path="/dashboard"
          element={
            <Page>
              <Dashboard />
            </Page>
          }
        />

        {/* ── Detection Modules ── */}
        <Route
          path="/sms"
          element={
            <Page>
              <SmsAnalyzer />
            </Page>
          }
        />

        <Route
          path="/email"
          element={
            <Page>
              <SmsAnalyzer />
            </Page>
          }
        />

        <Route
          path="/sms-email"
          element={
            <Page>
              <SmsAnalyzer />
            </Page>
          }
        />

        <Route
          path="/website"
          element={
            <Page>
              <WebsiteAnalyzer />
            </Page>
          }
        />

        <Route
          path="/website-analyzer"
          element={
            <Page>
              <WebsiteAnalyzer />
            </Page>
          }
        />

        <Route
          path="/documents"
          element={
            <Page>
              <DocumentAnalyzer />
            </Page>
          }
        />

        <Route
          path="/document-analyzer"
          element={
            <Page>
              <DocumentAnalyzer />
            </Page>
          }
        />

        <Route
          path="/history"
          element={
            <Page>
              <ScanHistory />
            </Page>
          }
        />

        {/* ── Auth routes ── */}
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
