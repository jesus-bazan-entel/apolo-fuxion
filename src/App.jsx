import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FormWizard from './pages/FormWizard';
import Results from './pages/Results';
import Settings from './pages/Settings';
import ConsultationDetail from './pages/ConsultationDetail';
import Login from './pages/Login';
import Analytics from './pages/Analytics';
import Reminders from './pages/Reminders';
import { AppProvider, useApp } from './context/AppContext';
import { Loader2 } from 'lucide-react';

// Protected Route Component
function ProtectedRoute({ children }) {
    const { isAuthenticated, authChecked, loading } = useApp();

    if (loading || !authChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-fuxion-blue" size={40} />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

// Public Route (redirect if already logged in)
function PublicRoute({ children }) {
    const { isAuthenticated, authChecked, loading } = useApp();

    if (loading || !authChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-fuxion-blue" size={40} />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={
                <PublicRoute>
                    <Login />
                </PublicRoute>
            } />
            <Route path="/" element={
                <ProtectedRoute>
                    <Layout><Dashboard /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/consultation" element={
                <ProtectedRoute>
                    <Layout><FormWizard /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/results" element={
                <ProtectedRoute>
                    <Layout><Results /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/settings" element={
                <ProtectedRoute>
                    <Layout><Settings /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/analytics" element={
                <ProtectedRoute>
                    <Layout><Analytics /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/reminders" element={
                <ProtectedRoute>
                    <Layout><Reminders /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/history/:id" element={
                <ProtectedRoute>
                    <Layout><ConsultationDetail /></Layout>
                </ProtectedRoute>
            } />
        </Routes>
    );
}

function App() {
    return (
        <AppProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AppProvider>
    );
}

export default App;
