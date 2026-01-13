import React from 'react';
import { Link } from 'react-router-dom';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center">
            {/* Background Decor */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/40 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/40 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md min-h-screen bg-white/50 backdrop-blur-sm shadow-2xl relative z-10 flex flex-col">
                {/* Header */}
                <header className="p-4 bg-white/80 sticky top-0 z-50 border-b border-slate-100 backdrop-blur-md">
                    <Link to="/" className="flex items-center gap-3">
                        <img
                            src="/logo.jpg"
                            alt="REXILIENCIA"
                            className="w-12 h-12 rounded-xl object-cover shadow-lg"
                        />
                        <div>
                            <h1 className="font-bold text-xl text-slate-800 leading-tight tracking-wide">REXILIENCIA</h1>
                            <p className="text-xs text-slate-500 font-medium">Powered by Fuxion</p>
                        </div>
                    </Link>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 overflow-y-auto">
                    {children}
                </main>

                {/* Footer */}
                <footer className="p-4 text-center text-xs text-slate-400 no-print">
                    <p>© 2024 REXILIENCIA · Fuxion Independent Distributor</p>
                </footer>
            </div>
        </div>
    );
}
