import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Share2, Download, ArrowLeft, AlertTriangle, CheckCircle, Loader2, Calendar, Target, User } from 'lucide-react';
import { generatePDF, sharePDF, downloadPDF } from '../utils/pdfGenerator';

export default function ConsultationDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { loadConsultation, advisorProfile } = useApp();
    const [consultation, setConsultation] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const loaded = loadConsultation(id);
        if (loaded) {
            setConsultation(loaded);
        } else {
            navigate('/');
        }
    }, [id]);

    if (!consultation) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-fuxion-blue" size={32} />
            </div>
        );
    }

    const { profile, goal, results, date } = consultation;
    const { products, tips } = results || { products: [], tips: [] };

    const getImg = (text, color) =>
        `https://placehold.co/400x300/${color}/ffffff?text=${encodeURIComponent(text)}`;

    const handleShare = async () => {
        setIsGenerating(true);
        try {
            const pdfFile = await generatePDF('pdf-content', `recomendacion-${profile?.name || 'fuxion'}.pdf`);
            if (pdfFile) {
                await sharePDF(pdfFile, `Recomendación para ${profile?.name}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setIsGenerating(false);
    };

    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            const pdfFile = await generatePDF('pdf-content', `recomendacion-${profile?.name || 'fuxion'}.pdf`);
            if (pdfFile) {
                downloadPDF(pdfFile);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setIsGenerating(false);
    };

    return (
        <div className="pb-24">
            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-600 hover:text-fuxion-blue mb-4 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Volver al Dashboard</span>
            </button>

            {/* PDF Content */}
            <div id="pdf-content" className="bg-white p-4 rounded-2xl">
                {/* Header */}
                <div className="text-center mb-6 pb-4 border-b border-slate-200">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-fuxion-blue to-fuxion-teal bg-clip-text text-transparent">
                        REXILIENCIA
                    </h1>
                    <p className="text-slate-500 text-sm">Recomendación Nutracéutica Personalizada</p>
                </div>

                {/* Client Info Card */}
                <div className="bg-gradient-to-r from-fuxion-blue to-fuxion-teal text-white rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <User size={20} />
                        <p className="text-xl font-bold">{profile?.name || 'Cliente'}</p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm opacity-90">
                        <div className="flex items-center gap-1">
                            <Target size={14} />
                            <span>{goal}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{new Date(date).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Tips */}
                {tips && tips.length > 0 && (
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
                    {products && products.map((product) => (
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
                                <p className="text-slate-600 text-sm">{product.description}</p>

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

                {/* Footer */}
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
                    </p>
                </div>
            </div>

            {/* Floating Actions */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-50 w-full max-w-sm px-4">
                <button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="flex-1 bg-slate-800 text-white font-bold py-3 rounded-full shadow-xl hover:bg-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
                    PDF
                </button>

                <button
                    onClick={handleShare}
                    disabled={isGenerating}
                    className="flex-1 bg-green-500 text-white font-bold py-3 rounded-full shadow-xl hover:bg-green-600 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Share2 size={20} />}
                    Compartir
                </button>
            </div>
        </div>
    );
}
