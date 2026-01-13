import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Save, UserCircle, Phone, Instagram, ArrowLeft } from 'lucide-react';

export default function Settings() {
    const navigate = useNavigate();
    const { advisorProfile, saveAdvisorProfile } = useApp();

    const [form, setForm] = useState({
        name: '',
        phone: '',
        social: ''
    });

    useEffect(() => {
        if (advisorProfile) setForm(advisorProfile);
    }, [advisorProfile]);

    const handleSave = () => {
        saveAdvisorProfile(form);
        navigate('/'); // Go back to dashboard after save
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-2">
                <button onClick={() => navigate('/')} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold text-slate-800">Mi Perfil de Asesor</h2>
            </div>

            <p className="text-slate-500 text-sm">
                Estos datos aparecerán automáticamente en la firma de tus PDFs y mensajes de WhatsApp.
            </p>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tu Nombre Completo</label>
                    <div className="relative">
                        <UserCircle className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-fuxion-blue outline-none"
                            placeholder="Ej. María Fuxioner"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tu Celular / WhatsApp</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                            type="tel"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-fuxion-blue outline-none"
                            placeholder="+51 999..."
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Red Social / Instagram (Opcional)</label>
                    <div className="relative">
                        <Instagram className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-fuxion-blue outline-none"
                            placeholder="@tu_usuario"
                            value={form.social}
                            onChange={e => setForm({ ...form, social: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={handleSave}
                className="btn-primary w-full mt-8 flex items-center justify-center gap-2"
            >
                <Save size={18} />
                Guardar Configuración
            </button>

            {/* Preview Card */}
            <div className="mt-8 p-4 bg-slate-100 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Vista Previa (Pie de Página)</p>
                <div className="text-sm text-slate-700">
                    <p className="font-bold">Asesorado por: {form.name || "[Tu Nombre]"}</p>
                    <p>{form.phone || "[Tu Teléfono]"} | {form.social || "[Tu Red Social]"}</p>
                </div>
            </div>

        </div>
    );
}
