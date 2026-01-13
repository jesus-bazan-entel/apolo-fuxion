import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Plus, History, Trash2, ArrowRight, Settings as SettingsIcon } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const { history, setHistory, clearCurrent } = useApp();

    const handleStart = () => {
        clearCurrent();
        navigate('/consultation');
    };

    const deleteItem = (id, e) => {
        e.stopPropagation();
        const newHistory = history.filter(item => item.id !== id);
        setHistory(newHistory);
        localStorage.setItem('fuxion_history', JSON.stringify(newHistory));
    };

    const quotes = [
        "Que tu alimento sea tu medicina.",
        "Limpiar, Regenerar y Potenciar.",
        "La salud verdadera viene de la naturaleza."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-fuxion-blue to-fuxion-teal rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">

                {/* Settings Button */}
                <button
                    onClick={() => navigate('/settings')}
                    className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors z-20"
                >
                    <SettingsIcon size={20} className="text-white" />
                </button>

                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">Hola, Socio Fuxion</h2>
                    <p className="opacity-90 mb-4">¿Listo para ayudar a mejorar la salud de alguien hoy?</p>
                    <button
                        onClick={handleStart}
                        className="w-full bg-white text-fuxion-blue font-bold py-3 px-4 rounded-xl shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        Iniciar Nueva Consulta
                    </button>
                </div>

                {/* Abstract Shapes */}
                <div className="absolute -right-4 -bottom-10 w-32 h-32 bg-white opacity-10 rounded-full" />
                <div className="absolute -left-4 -top-10 w-24 h-24 bg-white opacity-10 rounded-full" />
            </div>

            {/* Quote */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
                <p className="text-orange-800 italic font-medium text-sm">"{randomQuote}"</p>
                <p className="text-orange-400 text-xs mt-1">- Dr. Ivan Columbus</p>
            </div>

            {/* History */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <History size={18} />
                        Recientes
                    </h3>
                    <span className="text-xs text-slate-400">{history.length} consultas</span>
                </div>

                <div className="space-y-3">
                    {history.length === 0 ? (
                        <div className="text-center py-10 opacity-50">
                            <p>No hay consultas recientes</p>
                        </div>
                    ) : (
                        history.map(item => (
                            <div
                                key={item.id}
                                onClick={() => {
                                    // In a real app, maybe view details. For now, just alert or restore?
                                    // Let's just restore logic context could be tricky, maybe just viewing result?
                                    // Simplification: Not implemented fully for this demo
                                }}
                                className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-fuxion-blue transition-colors cursor-pointer group"
                            >
                                <div>
                                    <p className="font-bold text-slate-800">{item.profile.name || "Invitado"}</p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(item.date).toLocaleDateString()} • {item.goal}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => deleteItem(item.id, e)}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
