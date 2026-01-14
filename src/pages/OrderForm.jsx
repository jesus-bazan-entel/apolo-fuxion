import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Search, CheckCircle, Package, User } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function OrderForm() {
    const navigate = useNavigate();
    const { saveOrder, currentConsultation, setHistory, history, clients } = useApp();

    const [clientSearch, setClientSearch] = useState('');
    const [selectedClient, setSelectedClient] = useState(currentConsultation.profile?.name ? {
        name: currentConsultation.profile.name,
        phone: currentConsultation.profile.phone
    } : null);

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredClients = Object.values(clients).filter(c =>
        c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.phone.includes(clientSearch)
    ).slice(0, 5);

    const handleAddProduct = (product) => {
        const exists = selectedProducts.find(p => p.id === product.id);
        if (exists) {
            setSelectedProducts(selectedProducts.map(p =>
                p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
            ));
        } else {
            setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
        }
    };

    const handleRemoveProduct = (productId) => {
        setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    };

    const handleUpdateQuantity = (productId, delta) => {
        setSelectedProducts(selectedProducts.map(p =>
            p.id === productId ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
        ));
    };

    const handleSubmit = async () => {
        if (!selectedClient || selectedProducts.length === 0) return;

        setIsSubmitting(true);
        try {
            await saveOrder({
                client: selectedClient,
                products: selectedProducts.map(p => ({
                    id: p.id,
                    name: p.name,
                    quantity: p.quantity,
                    emoji: p.emoji
                })),
                status: 'Pendiente' // Pendiente, Pagado, Entregado
            });
            navigate('/');
        } catch (error) {
            console.error('Error saving order:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Pre-fill from consultation if available
    React.useEffect(() => {
        if (currentConsultation.results?.products && selectedProducts.length === 0) {
            const initialProducts = currentConsultation.results.products.map(p => ({
                ...p,
                quantity: 1
            }));
            setSelectedProducts(initialProducts);
        }
    }, [currentConsultation]);

    return (
        <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-2">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold text-slate-800">Nuevo Pedido</h2>
            </div>

            {/* Client Selection */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <label className="block text-sm font-bold text-slate-700 mb-2">Cliente</label>
                {selectedClient ? (
                    <div className="flex items-center justify-between p-3 bg-fuxion-blue/5 rounded-xl border border-fuxion-blue/20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-fuxion-blue/10 flex items-center justify-center text-fuxion-blue">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{selectedClient.name}</p>
                                <p className="text-xs text-slate-500">{selectedClient.phone}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedClient(null)}
                            className="text-xs text-red-500 font-bold hover:underline"
                        >
                            Cambiar
                        </button>
                    </div>
                ) : (
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar cliente por nombre o celular..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-fuxion-blue"
                            value={clientSearch}
                            onChange={(e) => setClientSearch(e.target.value)}
                        />
                        {clientSearch && filteredClients.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden">
                                {filteredClients.map(c => (
                                    <button
                                        key={c.phone}
                                        onClick={() => setSelectedClient(c)}
                                        className="w-full p-3 text-left hover:bg-slate-50 flex items-center gap-3 border-b border-slate-50 last:border-0"
                                    >
                                        <User size={16} className="text-slate-400" />
                                        <div>
                                            <p className="font-bold text-sm text-slate-800">{c.name}</p>
                                            <p className="text-[10px] text-slate-500">{c.phone}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Product Selection */}
            <div className="bg-white p-4顺 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Package size={18} className="text-fuxion-blue" />
                    Productos del Pedido
                </h3>

                {selectedProducts.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl">
                        <p className="text-slate-400 text-sm">No hay productos seleccionados</p>
                    </div>
                ) : (
                    <div className="space-y-3 mb-6">
                        {selectedProducts.map(product => (
                            <div key={product.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{product.emoji}</span>
                                    <div>
                                        <p className="font-bold text-sm text-slate-800">{product.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <button
                                                onClick={() => handleUpdateQuantity(product.id, -1)}
                                                className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600"
                                            >
                                                -
                                            </button>
                                            <span className="text-xs font-bold w-4 text-center">{product.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(product.id, 1)}
                                                className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveProduct(product.id)}
                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Agregar otro producto..."
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-100 outline-none focus:ring-1 focus:ring-fuxion-blue"
                        onChange={(e) => {
                            const val = e.target.value.toLowerCase();
                            if (val.length < 2) return;
                            const found = PRODUCTS.find(p => p.name.toLowerCase().includes(val));
                            if (found) {
                                handleAddProduct(found);
                                e.target.value = '';
                            }
                        }}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {PRODUCTS.slice(0, 8).map(p => (
                        <button
                            key={p.id}
                            onClick={() => handleAddProduct(p)}
                            className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs font-medium text-slate-600 hover:border-fuxion-blue hover:text-fuxion-blue transition-colors"
                        >
                            + {p.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Submit Button */}
            <button
                disabled={!selectedClient || selectedProducts.length === 0 || isSubmitting}
                onClick={handleSubmit}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4"
            >
                {isSubmitting ? <CheckCircle className="animate-pulse" /> : <ShoppingBag size={20} />}
                Confirmar Pedido
            </button>
        </div>
    );
}
