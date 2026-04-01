import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./store/AppContext";
import MainLayout from "./layouts/MainLayout";
import DirectoryPage from "./pages/DirectoryPage";
import NGOProfilePage from "./pages/NGOProfilePage";
import RegistrationPage from "./pages/RegistrationPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

export default function App() {
  return (
    <AppProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<DirectoryPage />} />
            <Route path="/ngo/:id" element={<NGOProfilePage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </AppProvider>
  );
}
