import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { runLogic } from '../logic/columbusEngine';
import { generateAIRecommendation, convertAIResponseToResults } from '../services/aiService';
import { PRODUCTS } from '../data/products';
import { CONSULTATION_TEMPLATES } from '../data/templates';
import { User, Activity, ShieldAlert, ArrowRight, Check, UserPlus, Phone, Sparkles, Loader2, LayoutTemplate, Edit3, MessageSquare } from 'lucide-react';

export default function FormWizard() {
    const navigate = useNavigate();
    const { currentConsultation, setCurrentConsultation, saveConsultation } = useApp();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [useAI, setUseAI] = useState(true); // Toggle for AI mode
    const [showTemplates, setShowTemplates] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const updateProfile = (field, value) => {
        setCurrentConsultation(prev => ({
            ...prev,
            profile: { ...prev.profile, [field]: value }
        }));
    };

    const updateNotes = (value) => {
        setCurrentConsultation(prev => ({
            ...prev,
            notes: value
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
            return prev;
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
                        const cleanPhone = contact.tel[0].replace(/[\s\-\(\)]/g, '');
                        updateProfile('phone', cleanPhone);
                    }
                }
            } catch (err) {
                console.log('Contact picker cancelled or failed:', err);
            }
        } else {
            alert('Tu navegador no soporta el selector de contactos.');
        }
    };

    const finish = async () => {
        const goals = Array.isArray(currentConsultation.goals) ? currentConsultation.goals : [currentConsultation.goal];
        const profile = {
            ...currentConsultation.profile,
            goal: goals[0],
            goals: goals,
            conditions: currentConsultation.conditions,
            notes: currentConsultation.notes
        };

        setIsLoading(true);

        try {
            let results;

            if (useAI) {
                // Try AI generation first
                try {
                    const aiResponse = await generateAIRecommendation(profile);
                    results = convertAIResponseToResults(aiResponse, PRODUCTS);
                } catch (aiError) {
                    console.warn('AI generation failed, falling back to local engine:', aiError);
                    // Fallback to local engine
                    results = runLogic(profile);
                }
            } else {
                // Use local engine directly
                results = runLogic(profile);
            }

            saveConsultation(results);
            navigate('/results');
        } catch (error) {
            console.error('Error generating recommendation:', error);
            // Final fallback
            const results = runLogic(profile);
            saveConsultation(results);
            navigate('/results');
        } finally {
            setIsLoading(false);
        }
    };

    const currentGoals = Array.isArray(currentConsultation.goals) ? currentConsultation.goals : (currentConsultation.goal ? [currentConsultation.goal] : []);

    // Loading Screen
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <div className="w-20 h-20 bg-gradient-to-br from-fuxion-blue to-fuxion-teal rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="text-white animate-spin" size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Dr. Columbus está analizando...</h2>
                <p className="text-slate-500 text-center">Generando tu recomendación personalizada con IA</p>
            </div>
        );
    }

    const applyTemplate = (template) => {
        setCurrentConsultation(prev => ({
            ...prev,
            profile: { ...prev.profile, ...template.profile },
            goals: template.goals,
            conditions: template.conditions
        }));
        setShowTemplates(false);
    };

    const startEdit = () => {
        setIsEditing(true);
        setStep(1);
    };

    return (
        <div className="py-4">
            {/* Progress Bar */}
            <div className="flex gap-2 mb-4 px-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-fuxion-blue' : 'bg-slate-200'}`} />
                ))}
            </div>

            {/* Template Selection Modal */}
            {showTemplates && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
                            <h3 className="font-bold text-lg text-slate-800">Plantillas de Consulta</h3>
                            <button
                                onClick={() => setShowTemplates(false)}
                                className="p-2 hover:bg-slate-100 rounded-full"
                            >
                                <ArrowRight size={20} className="rotate-180" />
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            {CONSULTATION_TEMPLATES.map(template => (
                                <button
                                    key={template.id}
                                    onClick={() => applyTemplate(template)}
                                    className="w-full p-4 rounded-xl border border-slate-200 hover:border-fuxion-blue hover:shadow-md transition-all text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                            style={{ backgroundColor: `${template.color}20` }}
                                        >
                                            {template.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-800">{template.name}</h4>
                                            <p className="text-xs text-slate-500">{template.description}</p>
                                        </div>
                                        <ArrowRight size={18} className="text-slate-300" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions Bar */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setShowTemplates(true)}
                    className="flex-1 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
                >
                    <LayoutTemplate size={18} />
                    <span className="font-semibold text-sm">Plantillas</span>
                </button>
                {currentConsultation.results && (
                    <button
                        onClick={startEdit}
                        className="flex-1 p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
                    >
                        <Edit3 size={18} />
                        <span className="font-semibold text-sm">Editar</span>
                    </button>
                )}
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

                    {/* Particular Comments / Notes */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <MessageSquare size={18} className="text-fuxion-blue" />
                            Comentarios particulares del cliente
                        </label>
                        <textarea
                            className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-fuxion-blue outline-none bg-white min-h-[120px] transition-all text-sm placeholder:text-slate-400"
                            placeholder="Escribe aquí cualquier detalle adicional, dolencias específicas o metas de bienestar..."
                            value={currentConsultation.notes || ''}
                            onChange={e => updateNotes(e.target.value)}
                        />
                    </div>

                    {/* AI Toggle */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Sparkles className="text-purple-600" size={20} />
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">Recomendación con IA</p>
                                    <p className="text-xs text-slate-500">Dr. Columbus Virtual personalizado</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setUseAI(!useAI)}
                                className={`w-12 h-6 rounded-full transition-colors ${useAI ? 'bg-purple-600' : 'bg-slate-300'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${useAI ? 'translate-x-6' : 'translate-x-0.5'}`} />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={finish}
                        className="btn-primary w-full mt-8 flex items-center justify-center gap-2"
                    >
                        {useAI ? <Sparkles size={18} /> : <Activity size={18} />}
                        {useAI ? 'Generar con IA' : 'Generar Receta'}
                    </button>
                </div>
            )}
        </div>
    );
}
