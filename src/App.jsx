import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FormWizard from './pages/FormWizard';
import Results from './pages/Results';
import Settings from './pages/Settings';
import ConsultationDetail from './pages/ConsultationDetail';
import { AppProvider } from './context/AppContext';

function App() {
    return (
        <AppProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/consultation" element={<FormWizard />} />
                        <Route path="/results" element={<Results />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/history/:id" element={<ConsultationDetail />} />
                    </Routes>
                </Layout>
            </Router>
        </AppProvider>
    );
}

export default App;
