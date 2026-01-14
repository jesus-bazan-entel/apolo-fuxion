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
import { Loader2, AlertTriangle } from 'lucide-react';

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

// Custom Error Boundary
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
                    <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm border border-slate-100">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">¡Ups! Algo salió mal</h2>
                        <p className="text-slate-500 text-sm mb-6">
                            La aplicación ha encontrado un error. Intenta recargar la página.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary w-full"
                        >
                            Recargar Aplicación
                        </button>
                        {import.meta.env.DEV && (
                            <pre className="mt-4 p-2 bg-slate-100 rounded text-left text-[10px] overflow-auto max-h-40">
                                {this.state.error.toString()}
                            </pre>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
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
            <ErrorBoundary>
                <Router>
                    <AppRoutes />
                </Router>
            </ErrorBoundary>
        </AppProvider>
    );
}

export default App;
