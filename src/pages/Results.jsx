import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Share2, Printer, Home, AlertTriangle } from 'lucide-react';

export default function Results() {
    const navigate = useNavigate();
    const { currentConsultation, history, advisorProfile } = useApp();

    // If navigated directly without data, go home
    useEffect(() => {
        if (!currentConsultation.results && history.length > 0) {
            // Trying to view last? Or just redirect
            // For MVP just redirect
            if (history.length > 0) {
                // In a real app we might load the ID from URL. 
                // For now, let's assume we just finished the flow.
            } else {
                navigate('/');
            }
        }
    }, [currentConsultation, history, navigate]);

    if (!currentConsultation.results) return null;

    const { profile, results } = currentConsultation;
    const { products, tips } = results;

    // --- Dynamic Image Generator Helper ---
    const getImg = (text, color) =>
        `https://placehold.co/600x400/${color}/ffffff?text=${encodeURIComponent(text)}`;

    // --- WhatsApp Logic ---
    const handleWhatsApp = () => {
        let msg = `*Hola ${profile.name}*, aquí tienes tu recomendación Fuxion personalizada:\n\n`;
        msg += `*Objetivo:* ${currentConsultation.goal}\n\n`;

        products.forEach(p => {
            msg += `${p.emoji} *${p.name}*: ${p.usage}\n`;
        });

        if (tips.length > 0) {
            msg += `\n*Nota del Dr.:* ${tips[0]}\n`;
        }

        if (advisorProfile && advisorProfile.name) {
            msg += `\n\nAtentamente,\n*${advisorProfile.name}*\nAsesor Fuxion`;
            if (advisorProfile.social) msg += `\nIG: ${advisorProfile.social}`;
        } else {
            msg += `\nCualquier duda estoy para servirte.`;
        }

        const url = `https://wa.me/${profile.phone}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="pb-20 animate-in fade-in duration-700">

            {/* Header for Print */}
            <div className="hidden print-force-show mb-8 text-center border-b pb-4">
                <h1 className="text-3xl font-bold text-slate-900">Dr. Columbus Virtual</h1>
                <p className="text-slate-500">Recomendación Nutracéutica Personalizada</p>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Tu Plan Fuxion</h2>
                <p className="text-slate-500">Preparado para: <span className="font-semibold text-fuxion-blue">{profile.name}</span></p>
            </div>

            {/* Tips Section */}
            {tips.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex gap-3 print-break-inside-avoid">
                    <AlertTriangle className="text-yellow-600 shrink-0" />
                    <div>
                        <p className="text-sm text-yellow-800 font-medium">Nota Importante:</p>
                        <ul className="list-disc list-inside text-sm text-yellow-700">
                            {tips.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                    </div>
                </div>
            )}

            {/* Products Grid */}
            <div className="space-y-6">
                {products.map(product => (
                    <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden print-break-inside-avoid flex flex-col md:flex-row">
                        {/* Image Area */}
                        <div className="h-48 md:h-auto md:w-1/3 relative bg-slate-100">
                            <img
                                src={getImg(product.name, product.imageColor)}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                                {product.line}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col justify-center">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
                                {product.name}
                            </h3>
                            <p className="text-sm text-slate-500 mb-3 leading-relaxed">
                                {product.description}
                            </p>

                            <div className="bg-blue-50 text-blue-800 p-3 rounded-xl text-sm font-medium">
                                <span className="block text-xs uppercase text-blue-400 mb-1">Modo de uso</span>
                                {product.usage}
                            </div>

                            {product.warning && (
                                <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                                    <AlertTriangle size={12} />
                                    {product.warning}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Action Buttons (No Print) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-50 no-print w-full max-w-sm px-4">
                <button
                    onClick={() => navigate('/')}
                    className="p-4 bg-white text-slate-700 rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 transition-transform active:scale-95"
                >
                    <Home size={24} />
                </button>

                <button
                    onClick={handlePrint}
                    className="flex-1 bg-slate-800 text-white font-bold rounded-full shadow-xl hover:bg-slate-700 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                    <Printer size={20} />
                    PDF
                </button>

                <button
                    onClick={handleWhatsApp}
                    className="flex-1 bg-green-500 text-white font-bold rounded-full shadow-xl hover:bg-green-600 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                    <Share2 size={20} />
                    WhatsApp
                </button>
            </div>

            {/* Legal Footer */}
            <div className="mt-12 pt-8 border-t border-slate-200 text-center text-[10px] text-slate-400">
                {advisorProfile?.name && (
                    <div className="mb-4 text-sm text-slate-700 font-medium">
                        <p>Asesorado por: <span className="font-bold">{advisorProfile.name}</span></p>
                        <p>{advisorProfile.phone} {advisorProfile.social && ` | ${advisorProfile.social}`}</p>
                    </div>
                )}
                <p>Esta herramienta es de uso exclusivo para empresarios independientes. Las recomendaciones no sustituyen la opinión médica profesional.</p>
            </div>
        </div>
    );
}
