import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    BarChart3,
    TrendingUp,
    Users,
    Package,
    ArrowLeft,
    Calendar,
    Target,
    CheckCircle
} from 'lucide-react';

export default function Analytics() {
    const navigate = useNavigate();
    const { history } = useApp();

    // Calculate analytics metrics
    const analytics = useMemo(() => {
        if (history.length === 0) {
            return {
                totalConsultations: 0,
                totalProducts: 0,
                topProducts: [],
                goalDistribution: [],
                conversionRate: 0,
                monthlyTrend: []
            };
        }

        // Total consultations
        const totalConsultations = history.length;

        // Total products recommended
        const totalProducts = history.reduce((sum, item) => {
            return sum + (item.results?.products?.length || 0);
        }, 0);

        // Product frequency
        const productFrequency = {};
        history.forEach(item => {
            item.results?.products?.forEach(product => {
                const productName = product.name;
                productFrequency[productName] = (productFrequency[productName] || 0) + 1;
            });
        });

        // Top 5 products
        const topProducts = Object.entries(productFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({
                name,
                count,
                percentage: ((count / totalConsultations) * 100).toFixed(1)
            }));

        // Goal distribution
        const goalFrequency = {};
        history.forEach(item => {
            const goals = item.goals || [item.goal];
            goals.forEach(goal => {
                goalFrequency[goal] = (goalFrequency[goal] || 0) + 1;
            });
        });

        const goalDistribution = Object.entries(goalFrequency)
            .sort((a, b) => b[1] - a[1])
            .map(([goal, count]) => ({
                goal,
                count,
                percentage: ((count / totalConsultations) * 100).toFixed(1)
            }));

        // Monthly trend
        const monthlyData = {};
        history.forEach(item => {
            const date = new Date(item.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
        });

        const monthlyTrend = Object.entries(monthlyData)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .slice(-6) // Last 6 months
            .map(([month, count]) => {
                const [year, monthNum] = month.split('-');
                const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                return {
                    label: `${monthNames[parseInt(monthNum) - 1]} ${year.slice(2)}`,
                    count
                };
            });

        // Conversion rate (consultations with phone numbers)
        const consultationsWithPhone = history.filter(item => item.profile?.phone).length;
        const conversionRate = ((consultationsWithPhone / totalConsultations) * 100).toFixed(1);

        return {
            totalConsultations,
            totalProducts,
            topProducts,
            goalDistribution,
            conversionRate,
            monthlyTrend
        };
    }, [history]);

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
                <h2 className="text-2xl font-bold text-slate-800">Analytics</h2>
            </div>

            {history.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                    <BarChart3 size={64} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-slate-700 mb-2">Sin datos aún</h3>
                    <p className="text-slate-500 mb-4">Comienza a realizar consultas para ver tus métricas</p>
                    <button
                        onClick={() => navigate('/consultation')}
                        className="btn-primary"
                    >
                        Crear Primera Consulta
                    </button>
                </div>
            ) : (
                <>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-4 shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <Users size={24} className="opacity-80" />
                                <TrendingUp size={20} className="opacity-60" />
                            </div>
                            <p className="text-3xl font-bold">{analytics.totalConsultations}</p>
                            <p className="text-sm opacity-80">Consultas Totales</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-4 shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <Package size={24} className="opacity-80" />
                                <CheckCircle size={20} className="opacity-60" />
                            </div>
                            <p className="text-3xl font-bold">{analytics.totalProducts}</p>
                            <p className="text-sm opacity-80">Productos Recomendados</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-4 shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <Target size={24} className="opacity-80" />
                                <TrendingUp size={20} className="opacity-60" />
                            </div>
                            <p className="text-3xl font-bold">{analytics.conversionRate}%</p>
                            <p className="text-sm opacity-80">Tasa de Conversión</p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-4 shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <Calendar size={24} className="opacity-80" />
                                <TrendingUp size={20} className="opacity-60" />
                            </div>
                            <p className="text-3xl font-bold">{analytics.monthlyTrend.length}</p>
                            <p className="text-sm opacity-80">Meses Activos</p>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Package size={18} className="text-fuxion-blue" />
                            Productos Más Recomendados
                        </h3>
                        <div className="space-y-3">
                            {analytics.topProducts.map((product, index) => (
                                <div key={product.name} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                            index === 1 ? 'bg-gray-100 text-gray-700' :
                                                index === 2 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-slate-100 text-slate-600'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-800">{product.name}</p>
                                        <p className="text-xs text-slate-500">{product.count} consultas</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-fuxion-blue">{product.percentage}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Goal Distribution */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Target size={18} className="text-fuxion-blue" />
                            Distribución por Objetivo
                        </h3>
                        <div className="space-y-3">
                            {analytics.goalDistribution.map((item) => (
                                <div key={item.goal}>
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="font-medium text-slate-700">{item.goal}</p>
                                        <p className="text-sm text-slate-500">{item.count} ({item.percentage}%)</p>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-fuxion-blue to-fuxion-teal rounded-full transition-all"
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Monthly Trend */}
                    {analytics.monthlyTrend.length > 0 && (
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Calendar size={18} className="text-fuxion-blue" />
                                Tendencia Mensual
                            </h3>
                            <div className="flex items-end gap-2 h-32">
                                {analytics.monthlyTrend.map((item, index) => {
                                    const maxCount = Math.max(...analytics.monthlyTrend.map(m => m.count));
                                    const height = (item.count / maxCount) * 100;
                                    return (
                                        <div key={item.label} className="flex-1 flex flex-col items-center">
                                            <div
                                                className="w-full bg-gradient-to-t from-fuxion-blue to-fuxion-teal rounded-t-lg transition-all hover:opacity-80"
                                                style={{ height: `${height}%` }}
                                            />
                                            <p className="text-xs text-slate-500 mt-2 text-center">{item.label}</p>
                                            <p className="text-xs font-bold text-slate-700">{item.count}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}