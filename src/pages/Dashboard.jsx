import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Plus, History, Trash2, Settings as SettingsIcon, ChevronRight, Loader2, BarChart3, Bell, Calendar, ChevronDown, ChevronUp, User, Star, ShoppingBag, CheckCircle2, Clock, Wallet } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
    const navigate = useNavigate();
    const { history, orders, deleteConsultation, deleteOrder, updateOrder, clearCurrent, loading, clients, updateClientRating } = useApp();
    const [expandedClient, setExpandedClient] = useState(null);
    const [viewMode, setViewMode] = useState('consultations'); // 'consultations' or 'orders'

    const handleStart = () => {
        clearCurrent();
        navigate('/consultation');
    };

    const handleViewConsultation = (id) => {
        navigate(`/history/${id}`);
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (confirm('¿Eliminar esta consulta?')) {
            deleteConsultation(id);
        }
    };

    // Group consultations by client (phone number is primary ID)
    const clientGroups = history.reduce((groups, consultation) => {
        const phone = consultation.profile?.phone || '';
        const name = consultation.profile?.name || 'Invitado';
        const key = phone || `name-${name}`;

        if (!groups[key]) {
            groups[key] = {
                name: name,
                phone: phone,
                consultations: []
            };
        }
        groups[key].consultations.push(consultation);
        return groups;
    }, {});

    const clientsList = Object.values(clientGroups).map(client => ({
        ...client,
        consultations: client.consultations.sort((a, b) => new Date(b.date) - new Date(a.date))
    })).sort((a, b) => {
        const dateA = new Date(a.consultations[0].date);
        const dateB = new Date(b.consultations[0].date);
        return dateB - dateA;
    });

    const StarRating = ({ phone, rating = 0 }) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={(e) => {
                            e.stopPropagation();
                            updateClientRating(phone, star);
                        }}
                        className="transition-transform active:scale-125"
                    >
                        <Star
                            size={14}
                            className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    const StatusBadge = ({ orderId, status }) => {
        const statuses = [
            { id: 'Pendiente', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Clock size={10} /> },
            { id: 'Pagado', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Wallet size={10} /> },
            { id: 'Entregado', color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle2 size={10} /> }
        ];

        const currentStatus = statuses.find(s => s.id === status) || statuses[0];

        const rotateStatus = (e) => {
            e.stopPropagation();
            const currentIndex = statuses.findIndex(s => s.id === status);
            const nextIndex = (currentIndex + 1) % statuses.length;
            updateOrder(orderId, { status: statuses[nextIndex].id });
        };

        return (
            <button
                onClick={rotateStatus}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all active:scale-95 ${currentStatus.color}`}
            >
                {currentStatus.icon}
                {currentStatus.id}
            </button>
        );
    };

    const quotes = [
        "Que tu alimento sea tu medicina.",
        "Limpiar, Regenerar y Potenciar.",
        "La salud verdadera viene de la naturaleza."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-fuxion-blue" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-fuxion-blue to-fuxion-teal rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                    <button
                        onClick={() => navigate('/analytics')}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
                        title="Ver Analytics"
                    >
                        <BarChart3 size={20} className="text-white" />
                    </button>
                    <button
                        onClick={() => navigate('/settings')}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
                        title="Configuración"
                    >
                        <SettingsIcon size={20} className="text-white" />
                    </button>
                </div>

                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">Hola, Socio Fuxion</h2>
                    <p className="opacity-90 mb-4">¿Listo para ayudar a mejorar la salud de alguien hoy?</p>
                    <div className="flex gap-3">
                        <button
                            onClick={handleStart}
                            className="flex-1 bg-white text-fuxion-blue font-bold py-3 px-4 rounded-xl shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
                        >
                            <Plus size={20} />
                            Nueva Consulta
                        </button>
                        <button
                            onClick={() => navigate('/order')}
                            className="flex-1 bg-white/20 border border-white/30 text-white font-bold py-3 px-4 rounded-xl shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 backdrop-blur-sm"
                        >
                            <ShoppingBag size={20} />
                            Nuevo Pedido
                        </button>
                    </div>
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
                        Mis Clientes
                    </h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/analytics')}
                            className="text-xs text-fuxion-blue hover:underline flex items-center gap-1"
                        >
                            <BarChart3 size={14} />
                            Analytics
                        </button>
                        <span className="text-xs text-slate-400">|</span>
                        <button
                            onClick={() => navigate('/reminders')}
                            className="text-xs text-fuxion-blue hover:underline flex items-center gap-1"
                        >
                            <Bell size={14} />
                            Recordatorios
                        </button>
                        <span className="text-xs text-slate-400">|</span>
                        <span className="text-xs text-slate-400">{history.length} consultas</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {clientsList.length === 0 ? (
                        <div className="text-center py-10 opacity-50">
                            <p>No hay consultas recientes</p>
                            <p className="text-sm">Inicia una nueva consulta para ver tu historial aquí</p>
                        </div>
                    ) : (
                        clientsList.map(client => {
                            const isExpanded = expandedClient === (client.phone || client.name);
                            return (
                                <div
                                    key={client.phone || client.name}
                                    className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all"
                                >
                                    <div
                                        onClick={() => setExpandedClient(isExpanded ? null : (client.phone || client.name))}
                                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                                <User size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-slate-800 truncate">{client.name}</p>
                                                    {client.phone && <StarRating phone={client.phone} rating={clients[client.phone]?.rating} />}
                                                </div>
                                                <p className="text-xs text-slate-500">
                                                    {client.consultations.length} {client.consultations.length === 1 ? 'consulta' : 'consultas'}
                                                    {client.phone && ` • ${client.phone}`}
                                                </p>
                                            </div>
                                        </div>
                                        {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                    </div>

                                    {isExpanded && (
                                        <div className="border-t border-slate-50 bg-slate-50/50 p-2 space-y-2">
                                            {/* Sub-navigation for client details */}
                                            <div className="flex gap-1 p-1 bg-white rounded-lg border border-slate-100 mb-2">
                                                <button
                                                    onClick={() => setViewMode('consultations')}
                                                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${viewMode === 'consultations' ? 'bg-fuxion-blue text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                                >
                                                    CONSULTAS
                                                </button>
                                                <button
                                                    onClick={() => setViewMode('orders')}
                                                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${viewMode === 'orders' ? 'bg-fuxion-blue text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                                >
                                                    PEDIDOS
                                                </button>
                                            </div>

                                            {viewMode === 'consultations' ? (
                                                client.consultations.map(item => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => handleViewConsultation(item.id)}
                                                        className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between hover:border-fuxion-blue transition-all cursor-pointer shadow-sm"
                                                    >
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Calendar size={12} className="text-slate-400" />
                                                                <span className="text-xs font-medium text-slate-600">
                                                                    {new Date(item.date).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm font-bold text-slate-700">{item.goal}</p>
                                                            {item.results?.products && (
                                                                <p className="text-[10px] text-fuxion-blue mt-0.5">
                                                                    {item.results.products.length} productos recomendados
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={(e) => handleDelete(item.id, e)}
                                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                            <ChevronRight size={18} className="text-slate-300" />
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="space-y-2">
                                                    {orders.filter(o => o.client?.phone === client.phone).length === 0 ? (
                                                        <div className="text-center py-4 text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                                                            No hay pedidos registrados
                                                            <button
                                                                onClick={() => navigate('/order')}
                                                                className="block mx-auto mt-2 text-fuxion-blue font-bold hover:underline"
                                                            >
                                                                + Crear Pedido
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        orders.filter(o => o.client?.phone === client.phone).map(order => (
                                                            <div
                                                                key={order.id}
                                                                className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm"
                                                            >
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <ShoppingBag size={12} className="text-fuxion-blue" />
                                                                        <span className="text-xs font-medium text-slate-600">
                                                                            {new Date(order.date).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                    <StatusBadge orderId={order.id} status={order.status} />
                                                                </div>

                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {order.products.map((p, i) => (
                                                                            <span key={i} className="text-[10px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 text-slate-600">
                                                                                {p.quantity}x {p.name}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            if (confirm('¿Eliminar pedido?')) deleteOrder(order.id);
                                                                        }}
                                                                        className="p-2 text-slate-300 hover:text-red-500 rounded-full transition-colors"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
