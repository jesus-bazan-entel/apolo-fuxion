import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { runLogic } from '../logic/columbusEngine';
import { User, Activity, ShieldAlert, ArrowRight, Check, UserPlus, Phone } from 'lucide-react';

export default function FormWizard() {
    const navigate = useNavigate();
    const { currentConsultation, setCurrentConsultation, saveConsultation } = useApp();
    const [step, setStep] = useState(1);

    const updateProfile = (field, value) => {
        setCurrentConsultation(prev => ({
            ...prev,
            profile: { ...prev.profile, [field]: value }
        }));
    };

    // Toggle goal selection (max 3)
    const toggleGoal = (goal) => {
        setCurrentConsultation(prev => {
            const currentGoals = Array.isArray(prev.goals) ? prev.goals : (prev.goal ? [prev.goal] : []);
            const exists = currentGoals.includes(goal);

            if (exists) {
                return { ...prev, goals: currentGoals.filter(g => g !== goal), goal: currentGoals.filter(g => g !== goal)[0] || '' };
            } else if (currentGoals.length < 3) {
                const newGoals = [...currentGoals, goal];
                return { ...prev, goals: newGoals, goal: newGoals[0] };
            }
            return prev; // Max 3 reached, do nothing
        });
    };

    const toggleCondition = (cond) => {
        setCurrentConsultation(prev => {
            const exists = prev.conditions.includes(cond);
            return {
                ...prev,
                conditions: exists
                    ? prev.conditions.filter(c => c !== cond)
                    : [...prev.conditions, cond]
            };
        });
    };

    // Contact Picker API
    const pickContact = async () => {
        if ('contacts' in navigator && 'ContactsManager' in window) {
            try {
                const props = ['name', 'tel'];
                const opts = { multiple: false };
                const contacts = await navigator.contacts.select(props, opts);

                if (contacts.length > 0) {
                    const contact = contacts[0];
                    if (contact.name && contact.name[0]) {
                        updateProfile('name', contact.name[0]);
                    }
                    if (contact.tel && contact.tel[0]) {
                        // Clean phone number (remove spaces, dashes)
                        const cleanPhone = contact.tel[0].replace(/[\s\-\(\)]/g, '');
                        updateProfile('phone', cleanPhone);
                    }
                }
            } catch (err) {
                console.log('Contact picker cancelled or failed:', err);
            }
        } else {
            alert('Tu navegador no soporta el selector de contactos. Por favor ingresa los datos manualmente.');
        }
    };

    const finish = () => {
        const goals = Array.isArray(currentConsultation.goals) ? currentConsultation.goals : [currentConsultation.goal];
        const results = runLogic({
            ...currentConsultation.profile,
            goal: goals[0], // Primary goal for main logic
            goals: goals,   // All goals
            conditions: currentConsultation.conditions
        });

        saveConsultation(results);
        navigate('/results');
    };

    const currentGoals = Array.isArray(currentConsultation.goals) ? currentConsultation.goals : (currentConsultation.goal ? [currentConsultation.goal] : []);

    return (
        <div className="py-4">
            {/* Progress Bar */}
            <div className="flex gap-2 mb-8 px-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-fuxion-blue' : 'bg-slate-200'}`} />
                ))}
            </div>

            {step === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right duration-500">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Datos del Cliente</h2>

                    {/* Contact Picker Button */}
                    <button
                        onClick={pickContact}
                        className="w-full p-4 bg-gradient-to-r from-fuxion-blue to-fuxion-teal text-white rounded-xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform"
                    >
                        <UserPlus size={22} />
                        <span className="font-bold">Importar de Contactos</span>
                    </button>

                    <div className="flex items-center gap-4 my-4">
                        <div className="flex-1 h-px bg-slate-200"></div>
                        <span className="text-slate-400 text-sm">o ingresa manualmente</span>
                        <div className="flex-1 h-px bg-slate-200"></div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-fuxion-blue focus:border-transparent outline-none transition-all"
                                placeholder="Ej. Juan Pérez"
                                value={currentConsultation.profile.name}
                                onChange={e => updateProfile('name', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Edad</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-fuxion-blue outline-none"
                                placeholder="0"
                                value={currentConsultation.profile.age}
                                onChange={e => updateProfile('age', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Género</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-fuxion-blue outline-none bg-white"
                                value={currentConsultation.profile.gender}
                                onChange={e => updateProfile('gender', e.target.value)}
                            >
                                <option value="">Seleccionar</option>
                                <option value="Hombre">Hombre</option>
                                <option value="Mujer">Mujer</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Celular (WhatsApp)</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input
                                type="tel"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-fuxion-blue outline-none"
                                placeholder="51999999999"
                                value={currentConsultation.profile.phone}
                                onChange={e => updateProfile('phone', e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        disabled={!currentConsultation.profile.name}
                        onClick={() => setStep(2)}
                        className="btn-primary w-full mt-8 flex items-center justify-center gap-2"
                    >
                        Continuar <ArrowRight size={18} />
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4 animate-in slide-in-from-right duration-500">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Objetivos del Cliente</h2>
                    <p className="text-slate-500 text-sm mb-4">Selecciona hasta 3 objetivos que desea mejorar tu cliente.</p>

                    {/* Selected count indicator */}
                    <div className="flex items-center justify-between mb-4 p-3 bg-slate-50 rounded-xl">
                        <span className="text-sm text-slate-600">Seleccionados:</span>
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className={`w-3 h-3 rounded-full transition-colors ${i <= currentGoals.length ? 'bg-fuxion-blue' : 'bg-slate-200'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {['Bajar de Peso', 'Inmunidad', 'Energía', 'Detox', 'Articulaciones', 'Hormonal', 'Deporte', 'Vigor Mental'].map(g => {
                            const isSelected = currentGoals.includes(g);
                            const isDisabled = !isSelected && currentGoals.length >= 3;

                            return (
                                <button
                                    key={g}
                                    onClick={() => toggleGoal(g)}
                                    disabled={isDisabled}
                                    className={`p-4 rounded-xl border text-sm font-bold transition-all relative ${isSelected
                                            ? 'bg-fuxion-blue text-white border-transparent shadow-lg transform scale-105'
                                            : isDisabled
                                                ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-fuxion-blue'
                                        }`}
                                >
                                    {isSelected && (
                                        <span className="absolute top-1 right-1 bg-white text-fuxion-blue rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                            {currentGoals.indexOf(g) + 1}
                                        </span>
                                    )}
                                    {g}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        disabled={currentGoals.length === 0}
                        onClick={() => setStep(3)}
                        className="btn-primary w-full mt-8 flex items-center justify-center gap-2"
                    >
                        Continuar <ArrowRight size={18} />
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-4 animate-in slide-in-from-right duration-500">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Matriz de Riesgo</h2>
                    <p className="text-slate-500 text-sm mb-6">Selecciona si presenta alguna de estas condiciones.</p>

                    <div className="space-y-2">
                        {['Hipertensión', 'Diabetes', 'Gastritis', 'Embarazo', 'Lactancia'].map(c => {
                            const active = currentConsultation.conditions.includes(c);
                            return (
                                <button
                                    key={c}
                                    onClick={() => toggleCondition(c)}
                                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${active
                                        ? 'bg-red-50 border-red-200 text-red-700'
                                        : 'bg-white border-slate-200 text-slate-600'
                                        }`}
                                >
                                    <span className="font-semibold flex items-center gap-2">
                                        <ShieldAlert size={18} className={active ? 'opacity-100' : 'opacity-40'} />
                                        {c}
                                    </span>
                                    {active && <Check size={18} />}
                                </button>
                            )
                        })}
                    </div>

                    <button
                        onClick={finish}
                        className="btn-primary w-full mt-8 flex items-center justify-center gap-2"
                    >
                        Generar Receta <Activity size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}
