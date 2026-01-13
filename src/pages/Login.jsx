import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail, registerWithEmail, isFirebaseConfigured } from '../firebase';
import { Mail, Lock, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Check if Firebase is configured
        if (!isFirebaseConfigured()) {
            setError('Firebase no está configurado. Contacta al administrador.');
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                await loginWithEmail(email, password);
            } else {
                await registerWithEmail(email, password);
                // Save name to localStorage for now, could save to Firestore later
                localStorage.setItem('fuxion_advisor_name', name);
            }
            navigate('/');
        } catch (err) {
            console.error('Auth error:', err);
            switch (err.code) {
                case 'auth/user-not-found':
                    setError('No existe una cuenta con este email');
                    break;
                case 'auth/wrong-password':
                    setError('Contraseña incorrecta');
                    break;
                case 'auth/email-already-in-use':
                    setError('Este email ya está registrado');
                    break;
                case 'auth/weak-password':
                    setError('La contraseña debe tener al menos 6 caracteres');
                    break;
                case 'auth/invalid-email':
                    setError('Email inválido');
                    break;
                default:
                    setError(err.message || 'Error de autenticación');
            }
        }
        setLoading(false);
    };

    // Demo mode for when Firebase isn't configured
    const handleDemoMode = () => {
        localStorage.setItem('fuxion_demo_mode', 'true');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img src="/logo.jpg" alt="REXILIENCIA" className="w-24 h-24 mx-auto rounded-2xl shadow-xl mb-4" />
                    <h1 className="text-3xl font-bold text-white">REXILIENCIA</h1>
                    <p className="text-white/80 text-sm">Sistema Experto Fuxion</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">
                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2">
                            <AlertCircle className="text-red-500 shrink-0" size={18} />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Tu Nombre
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-fuxion-blue outline-none"
                                        placeholder="Ej. María García"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-fuxion-blue outline-none"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-fuxion-blue outline-none"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-fuxion-blue to-fuxion-teal text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    {isLogin ? 'Entrar' : 'Crear Cuenta'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle Login/Register */}
                    <div className="mt-6 text-center">
                        <p className="text-slate-500 text-sm">
                            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                            <button
                                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                                className="text-fuxion-blue font-bold ml-1 hover:underline"
                            >
                                {isLogin ? 'Regístrate' : 'Inicia sesión'}
                            </button>
                        </p>
                    </div>

                    {/* Demo Mode */}
                    {!isFirebaseConfigured() && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <button
                                onClick={handleDemoMode}
                                className="w-full py-2 text-slate-500 text-sm hover:text-fuxion-blue"
                            >
                                Continuar en modo demo (sin cuenta)
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-center text-white/60 text-xs mt-6">
                    © 2024 REXILIENCIA · Powered by Fuxion
                </p>
            </div>
        </div>
    );
}
