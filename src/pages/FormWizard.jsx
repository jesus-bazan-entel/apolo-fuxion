import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { runLogic } from '../logic/columbusEngine';
import { User, Activity, ShieldAlert, ArrowRight, Check } from 'lucide-react';

export default function FormWizard() {
    const navigate = useNavigate();
    const { currentConsultation, setCurrentConsultation, saveConsultation } = useApp();
    const [step, setStep] = useState(1);

    const updateField = (field, value) => {
        setCurrentConsultation(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const updateProfile = (field, value) => {
        setCurrentConsultation(prev => ({
            ...prev,
            profile: { ...prev.profile, [field]: value }
        }));
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

    const finish = () => {
        const results = runLogic({
            ...currentConsultation.profile,
            goal: currentConsultation.goal,
            conditions: currentConsultation.conditions
        });
        saveConsultation(results);
        navigate('/results');
    };

    // --- STEPS RENDERERS ---

    const Step1_Profile = () => (
        <div className="space-y-4 animate-in slide-in-from-right duration-500">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Datos del Cliente</h2>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-fuxion-blue focus:border-transparent outline-none transition-all"
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
                        className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-fuxion-blue outline-none"
                        placeholder="0"
                        value={currentConsultation.profile.age}
                        onChange={e => updateProfile('age', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Género</label>
                    <select
                        className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-fuxion-blue outline-none bg-white"
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
                <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-fuxion-blue outline-none"
                    placeholder="51999999999"
                    value={currentConsultation.profile.phone}
                    onChange={e => updateProfile('phone', e.target.value)}
                />
            </div>

            <button
                disabled={!currentConsultation.profile.name}
                onClick={() => setStep(2)}
                className="btn-primary w-full mt-8 flex items-center justify-center gap-2"
            >
                Continuar <ArrowRight size={18} />
            </button>
        </div>
    );

    const Step2_Goal = () => {
        const goals = [
            'Bajar de Peso', 'Inmunidad', 'Energía', 'Detox',
            'Articulaciones', 'Hormonal', 'Deporte', 'Vigor Mental'
        ];

        return (
            <div className="space-y-4 animate-in slide-in-from-right duration-500">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Objetivo Principal</h2>
                <p className="text-slate-500 text-sm mb-6">Selecciona qué desea mejorar tu cliente.</p>

                <div className="grid grid-cols-2 gap-3">
                    {goals.map(g => (
                        <button
                            key={g}
                            onClick={() => updateField('goal', g)}
                            className={`p-4 rounded-xl border text-sm font-bold transition-all ${currentConsultation.goal === g
                                    ? 'bg-fuxion-blue text-white border-transparent shadow-lg transform scale-105'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-fuxion-blue'
                                }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>

                <button
                    disabled={!currentConsultation.goal}
                    onClick={() => setStep(3)}
                    className="btn-primary w-full mt-8 flex items-center justify-center gap-2"
                >
                    Continuar <ArrowRight size={18} />
                </button>
            </div>
        );
    };

    const Step3_Conditions = () => {
        const conditions = ['Hipertensión', 'Diabetes', 'Gastritis', 'Embarazo', 'Lactancia'];

        return (
            <div className="space-y-4 animate-in slide-in-from-right duration-500">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Matriz de Riesgo</h2>
                <p className="text-slate-500 text-sm mb-6">Selecciona si presenta alguna de estas condiciones.</p>

                <div className="space-y-2">
                    {conditions.map(c => {
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
        );
    };

    return (
        <div className="py-4">
            {/* Progress Bar */}
            <div className="flex gap-2 mb-8 px-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-fuxion-blue' : 'bg-slate-200'}`} />
                ))}
            </div>

            {step === 1 && <Step1_Profile />}
            {step === 2 && <Step2_Goal />}
            {step === 3 && <Step3_Conditions />}
        </div>
    );
}
