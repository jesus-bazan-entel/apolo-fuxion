import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MessageCircle, Share2, Home, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { generatePDF, downloadPDF, sharePDFViaWhatsApp } from '../utils/pdfGenerator';

export default function Results() {
    const navigate = useNavigate();
    const { currentConsultation, advisorProfile } = useApp();
    const [isGenerating, setIsGenerating] = useState(false);
    const [shareStatus, setShareStatus] = useState('');

    if (!currentConsultation.results) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-500">No hay resultados disponibles.</p>
                <button onClick={() => navigate('/')} className="btn-primary mt-4">
                    Volver al Inicio
                </button>
            </div>
        );
    }

    const { profile, results, goal } = currentConsultation;
    const goals = currentConsultation.goals || [goal];
    const { products, tips } = results;

    const getImg = (text, color) =>
        `https://placehold.co/400x300/${color}/ffffff?text=${encodeURIComponent(text)}`;

    // Send WhatsApp directly to client (text only)
    const handleWhatsApp = () => {
        let msg = `¡Hola *${profile.name}*! 👋\n\n`;
        msg += `Te comparto tu recomendación personalizada de productos Fuxion:\n\n`;
        msg += `🎯 *Objetivo${goals.length > 1 ? 's' : ''}:* ${goals.join(', ')}\n\n`;

        msg += `📋 *Tu Plan de Productos:*\n`;
        products.forEach((p) => {
            msg += `\n${p.emoji} *${p.name}*\n`;
            msg += `   ${p.usage}\n`;
        });

        if (tips.length > 0) {
            msg += `\n⚠️ *Nota:* ${tips[0]}\n`;
        }

        if (advisorProfile?.name) {
            msg += `\n\n✨ Asesorado por: *${advisorProfile.name}*`;
            if (advisorProfile.phone) msg += `\n📱 ${advisorProfile.phone}`;
            if (advisorProfile.social) msg += `\n📷 ${advisorProfile.social}`;
        }

        msg += `\n\n_Powered by REXILIENCIA_`;

        const cleanPhone = (profile.phone || '').replace(/[\s\-\(\)\+]/g, '');
        const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    };

    // Share PDF via WhatsApp with short link
    const handleSharePDF = async () => {
        setIsGenerating(true);
        setShareStatus('Generando PDF...');

        try {
            const pdfFile = await generatePDF('pdf-content', `recomendacion-${profile.name || 'fuxion'}.pdf`);
            if (pdfFile) {
                setShareStatus('Subiendo a la nube...');
                await sharePDFViaWhatsApp(pdfFile, profile.name, profile.phone, advisorProfile);
                setShareStatus('');
            }
        } catch (error) {
            console.error('Error:', error);
            setShareStatus('');
            // Fallback: just download
            try {
                const pdfFile = await generatePDF('pdf-content', `recomendacion-${profile.name || 'fuxion'}.pdf`);
                if (pdfFile) {
                    downloadPDF(pdfFile);
                    alert('No se pudo subir el PDF. Se ha descargado en tu dispositivo.');
                }
            } catch (e) {
                console.error('Download fallback failed:', e);
            }
        }
        setIsGenerating(false);
    };

    return (
        <div className="pb-24">
            {/* PDF Content Container */}
            <div id="pdf-content" className="bg-white p-4 rounded-2xl">
                {/* Header */}
                <div className="text-center mb-6 pb-4 border-b border-slate-200">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-fuxion-blue to-fuxion-teal bg-clip-text text-transparent">
                        REXILIENCIA
                    </h1>
                    <p className="text-slate-500 text-sm">Recomendación Nutracéutica Personalizada</p>
                </div>

                {/* Client Info */}
                <div className="bg-gradient-to-r from-fuxion-blue to-fuxion-teal text-white rounded-xl p-4 mb-6">
                    <p className="text-sm opacity-80">Preparado para:</p>
                    <p className="text-xl font-bold">{profile.name}</p>
                    <p className="text-sm opacity-80 mt-1">Objetivo{goals.length > 1 ? 's' : ''}: {goals.join(', ')}</p>
                </div>

                {/* Tips Section */}
                {tips.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                        <div className="flex gap-2 items-start">
                            <AlertTriangle className="text-amber-600 shrink-0 mt-1" size={18} />
                            <div>
                                <p className="font-bold text-amber-800 text-sm mb-2">Nota Importante:</p>
                                {tips.map((t, i) => (
                                    <p key={i} className="text-amber-700 text-sm">{t}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Products */}
                <div className="space-y-6">
                    {products.map((product, index) => (
                        <div key={product.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            {/* Product Header */}
                            <div className="bg-slate-50 p-4 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{product.emoji}</span>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">{product.name}</h3>
                                        <p className="text-xs text-slate-500">{product.line} • {product.type}</p>
                                    </div>
                                </div>
                                {product.tagline && (
                                    <p className="mt-2 text-sm font-medium text-fuxion-blue italic">
                                        "{product.tagline}"
                                    </p>
                                )}
                            </div>

                            {/* Product Image */}
                            <div className="h-40 bg-slate-100">
                                <img
                                    src={getImg(product.name, product.imageColor)}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Product Content */}
                            <div className="p-4 space-y-4">
                                {/* Description */}
                                <p className="text-slate-600 text-sm">{product.description}</p>

                                {/* Benefits */}
                                {product.benefits && (
                                    <div>
                                        <p className="font-bold text-slate-700 text-sm mb-2">✨ Beneficios:</p>
                                        <ul className="space-y-1">
                                            {product.benefits.map((b, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                    <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* How to Take */}
                                {product.howToTake && (
                                    <div className="bg-blue-50 rounded-xl p-3">
                                        <p className="font-bold text-blue-800 text-sm mb-2">🕐 ¿Cómo tomarlo?</p>
                                        <ul className="space-y-1">
                                            {product.howToTake.map((h, i) => (
                                                <li key={i} className="text-sm text-blue-700">{h}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Important Notes */}
                                {product.importantNotes && (
                                    <div className="bg-amber-50 rounded-xl p-3">
                                        <p className="font-bold text-amber-800 text-sm mb-2">⚠️ Importante:</p>
                                        <ul className="space-y-1">
                                            {product.importantNotes.map((n, i) => (
                                                <li key={i} className="text-sm text-amber-700">{n}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Advisor Footer */}
                <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                    {advisorProfile?.name && (
                        <div className="mb-4">
                            <p className="text-slate-600 text-sm">Asesorado por:</p>
                            <p className="font-bold text-slate-800">{advisorProfile.name}</p>
                            <p className="text-slate-500 text-sm">
                                {advisorProfile.phone}
                                {advisorProfile.social && ` • ${advisorProfile.social}`}
                            </p>
                        </div>
                    )}
                    <p className="text-[10px] text-slate-400">
                        Esta herramienta es de uso exclusivo para empresarios independientes.
                        Las recomendaciones no sustituyen la opinión médica profesional.
                    </p>
                </div>
            </div>

            {/* Floating Action Buttons */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-3 z-50 w-full max-w-sm px-4">
                {/* Main action: Send to client */}
                {profile.phone && (
                    <button
                        onClick={handleWhatsApp}
                        className="w-full bg-green-500 text-white font-bold py-4 rounded-full shadow-xl hover:bg-green-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <MessageCircle size={22} />
                        Enviar a {profile.name} por WhatsApp
                    </button>
                )}

                {/* Secondary actions */}
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/')}
                        className="p-4 bg-white text-slate-700 rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <Home size={24} />
                    </button>

                    <button
                        onClick={handleSharePDF}
                        disabled={isGenerating}
                        className="flex-1 bg-slate-800 text-white font-bold rounded-full shadow-xl hover:bg-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Share2 size={20} />}
                        Enviar PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

