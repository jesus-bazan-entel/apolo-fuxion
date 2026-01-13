import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    Bell,
    ArrowLeft,
    Calendar,
    Clock,
    MessageCircle,
    Check,
    X,
    Plus,
    Filter,
    Loader2
} from 'lucide-react';
import {
    REMINDER_INTERVALS,
    scheduleReminder,
    getPendingReminders,
    markReminderAsSent,
    cancelReminder
} from '../services/reminderService';

export default function Reminders() {
    const navigate = useNavigate();
    const { history, reminders, addReminder, updateReminder, deleteReminder } = useApp();
    const [filter, setFilter] = useState('all'); // all, pending, sent, cancelled
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [selectedInterval, setSelectedInterval] = useState('1week');
    const [isSending, setIsSending] = useState(null);

    // Filter reminders
    const filteredReminders = useMemo(() => {
        if (filter === 'all') return reminders;
        return reminders.filter(r => r.status === filter);
    }, [reminders, filter]);

    // Get pending reminders count
    const pendingCount = useMemo(() => {
        return reminders.filter(r => r.status === 'pending').length;
    }, [reminders]);

    const handleScheduleReminder = () => {
        if (!selectedConsultation) return;

        const reminder = scheduleReminder(selectedConsultation, selectedInterval);
        if (reminder) {
            addReminder(reminder);
            setShowScheduleModal(false);
            setSelectedConsultation(null);
        }
    };

    const handleSendReminder = async (reminder) => {
        setIsSending(reminder.id);

        // Open WhatsApp with the reminder message
        const cleanPhone = reminder.clientPhone?.replace(/[\s\-\(\)\+]/g, '');
        const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(reminder.message)}`;
        window.open(url, '_blank');

        // Mark as sent
        updateReminder(reminder.id, { status: 'sent', sentAt: new Date().toISOString() });
        setIsSending(null);
    };

    const handleCancelReminder = (reminderId) => {
        if (confirm('¿Cancelar este recordatorio?')) {
            updateReminder(reminderId, { status: 'cancelled', cancelledAt: new Date().toISOString() });
        }
    };

    const handleDeleteReminder = (reminderId) => {
        if (confirm('¿Eliminar este recordatorio permanentemente?')) {
            deleteReminder(reminderId);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-700',
            sent: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700'
        };
        const labels = {
            pending: 'Pendiente',
            sent: 'Enviado',
            cancelled: 'Cancelado'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hoy';
        if (diffDays === 1) return 'Mañana';
        if (diffDays < 0) return 'Vencido';

        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 -ml-2 text-slate-400 hover:text-slate-600"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-800">Recordatorios</h2>
                    <p className="text-sm text-slate-500">Gestiona el seguimiento de tus clientes</p>
                </div>
                <button
                    onClick={() => setShowScheduleModal(true)}
                    className="p-3 bg-fuxion-blue text-white rounded-xl shadow-lg hover:bg-blue-600 transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
                    <p className="text-xs text-yellow-600">Pendientes</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-green-700">
                        {reminders.filter(r => r.status === 'sent').length}
                    </p>
                    <p className="text-xs text-green-600">Enviados</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-slate-700">{reminders.length}</p>
                    <p className="text-xs text-slate-600">Total</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {['all', 'pending', 'sent', 'cancelled'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === status
                                ? 'bg-fuxion-blue text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        {status === 'all' ? 'Todos' :
                            status === 'pending' ? 'Pendientes' :
                                status === 'sent' ? 'Enviados' : 'Cancelados'}
                    </button>
                ))}
            </div>

            {/* Reminders List */}
            <div className="space-y-3">
                {filteredReminders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                        <Bell size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 mb-2">
                            {filter === 'all' ? 'Sin recordatorios' : `Sin recordatorios ${filter === 'pending' ? 'pendientes' : filter === 'sent' ? 'enviados' : 'cancelados'}`}
                        </h3>
                        <p className="text-slate-500 mb-4">
                            {filter === 'all'
                                ? 'Programa recordatorios para hacer seguimiento a tus clientes'
                                : 'No hay recordatorios en esta categoría'}
                        </p>
                        {filter === 'all' && (
                            <button
                                onClick={() => setShowScheduleModal(true)}
                                className="btn-primary"
                            >
                                Crear Primer Recordatorio
                            </button>
                        )}
                    </div>
                ) : (
                    filteredReminders.map(reminder => (
                        <div
                            key={reminder.id}
                            className={`bg-white rounded-xl p-4 border ${reminder.status === 'pending' ? 'border-yellow-200 shadow-sm' :
                                    reminder.status === 'sent' ? 'border-green-200' :
                                        'border-red-200 opacity-60'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-slate-800">{reminder.clientName}</h4>
                                        {getStatusBadge(reminder.status)}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Calendar size={14} />
                                        <span>{formatDate(reminder.scheduledDate)}</span>
                                        <span className="text-slate-300">•</span>
                                        <Clock size={14} />
                                        <span>
                                            {new Date(reminder.scheduledDate).toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                {reminder.message}
                            </p>

                            <div className="flex gap-2">
                                {reminder.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleSendReminder(reminder)}
                                            disabled={isSending === reminder.id}
                                            className="flex-1 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                                        >
                                            {isSending === reminder.id ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <>
                                                    <MessageCircle size={16} />
                                                    Enviar WhatsApp
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleCancelReminder(reminder.id)}
                                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                            title="Cancelar"
                                        >
                                            <X size={16} />
                                        </button>
                                    </>
                                )}
                                {reminder.status === 'sent' && (
                                    <div className="flex items-center gap-1 text-green-600 text-sm">
                                        <Check size={16} />
                                        <span>Enviado el {new Date(reminder.sentAt).toLocaleDateString('es-ES')}</span>
                                    </div>
                                )}
                                {reminder.status === 'cancelled' && (
                                    <button
                                        onClick={() => handleDeleteReminder(reminder.id)}
                                        className="text-red-500 text-sm hover:underline"
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Schedule Reminder Modal */}
            {showScheduleModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
                            <h3 className="font-bold text-lg text-slate-800">Programar Recordatorio</h3>
                            <button
                                onClick={() => setShowScheduleModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Select Consultation */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Seleccionar Cliente
                                </label>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {history.length === 0 ? (
                                        <p className="text-sm text-slate-500 text-center py-4">
                                            No hay consultas disponibles
                                        </p>
                                    ) : (
                                        history.map(consultation => (
                                            <button
                                                key={consultation.id}
                                                onClick={() => setSelectedConsultation(consultation)}
                                                className={`w-full p-3 rounded-xl border text-left transition-all ${selectedConsultation?.id === consultation.id
                                                        ? 'border-fuxion-blue bg-blue-50'
                                                        : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                <p className="font-semibold text-slate-800">{consultation.profile?.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {consultation.goals?.join(', ') || consultation.goal}
                                                </p>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Select Interval */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Intervalo de Recordatorio
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {REMINDER_INTERVALS.map(interval => (
                                        <button
                                            key={interval.id}
                                            onClick={() => setSelectedInterval(interval.id)}
                                            className={`p-3 rounded-xl border text-center transition-all ${selectedInterval === interval.id
                                                    ? 'border-fuxion-blue bg-blue-50 text-fuxion-blue font-bold'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            {interval.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Preview */}
                            {selectedConsultation && (
                                <div className="bg-slate-50 rounded-xl p-3">
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">
                                        Vista Previa del Mensaje
                                    </p>
                                    <p className="text-sm text-slate-700 whitespace-pre-line">
                                        {scheduleReminder(selectedConsultation, selectedInterval)?.message}
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={handleScheduleReminder}
                                disabled={!selectedConsultation}
                                className="btn-primary w-full"
                            >
                                Programar Recordatorio
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}