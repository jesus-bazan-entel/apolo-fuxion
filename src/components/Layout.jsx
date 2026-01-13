import React from 'react';
import { Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center">
            {/* Background Decor */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuxion-blue/40 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuxion-teal/40 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md min-h-screen bg-white/50 backdrop-blur-sm shadow-2xl relative z-10 flex flex-col">
                {/* Header */}
                <header className="p-4 bg-white/80 sticky top-0 z-50 border-b border-slate-100 backdrop-blur-md">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-fuxion-blue to-fuxion-teal rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Stethoscope size={20} />
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-800 leading-tight">Dr. Columbus</h1>
                            <p className="text-xs text-slate-500 font-medium tracking-wide">VIRTUAL SUITE</p>
                        </div>
                    </Link>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 overflow-y-auto">
                    {children}
                </main>

                {/* Footer */}
                <footer className="p-4 text-center text-xs text-slate-400 no-print">
                    <p>© 2024 Fuxion Independent Distributor</p>
                </footer>
            </div>
        </div>
    );
}
