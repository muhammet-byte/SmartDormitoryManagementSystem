import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, LayoutGroup } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (email === 'admin@smartdorm.com') {
            localStorage.removeItem('userId');
            setIsLoggingIn(true);
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 800);
            return;
        }

        const studentEmailRegex = /^ogrenci(\d+)@smartdorm\.com$/;
        const match = email.match(studentEmailRegex);

        if (match && password === '1234') {
            const studentId = match[1];
            localStorage.setItem('userId', studentId);
            setIsLoggingIn(true);
            setTimeout(() => {
                navigate('/student/dashboard');
            }, 800);
        } else {
            alert('Hatalı giriş! \nÖğrenci formatı: ogrenci[ID]@smartdorm.com \nŞifre: 1234');
        }
    };

    return (
        <LayoutGroup>
            <div className="min-h-screen bg-[#060F1E] flex items-center justify-center p-4 relative overflow-hidden font-sans antialiased selection:bg-white selection:text-[#060F1E]">

                {/* Arka plan aydınlatmaları */}
                <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-blue-800/10 rounded-full blur-[120px] pointer-events-none" />

                {/* ANA KART KONTEYNERİ - Gölgeler ve arka plan giriş anında sıfırlanıyor */}
                <motion.div
                    animate={{
                        scale: isLoggingIn ? 0.95 : 1,
                        backgroundColor: isLoggingIn ? "rgba(10, 19, 38, 0)" : "rgba(10, 19, 38, 1)",
                        boxShadow: isLoggingIn ? "none" : "0 40px 80px -20px rgba(0,0,0,1)",
                        borderColor: isLoggingIn ? "rgba(255,255,255,0)" : "rgba(255,255,255,0.05)"
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full max-w-5xl border rounded-[2rem] flex flex-col md:flex-row z-10 overflow-hidden relative min-h-[550px]"
                >
                    {/* SOL TARAF - Arka plan rengi giriş anında transparan yapıldı */}
                    <motion.div
                        animate={{
                            backgroundColor: isLoggingIn ? "rgba(13, 24, 46, 0)" : "rgba(13, 24, 46, 1)",
                            borderColor: isLoggingIn ? "rgba(255,255,255,0)" : "rgba(255,255,255,0.05)"
                        }}
                        transition={{ duration: 0.4 }}
                        className="w-full md:w-1/2 p-12 lg:p-16 flex flex-col items-center justify-center relative border-r"
                    >
                        {/* Noktalı arka plan deseni yumuşakça siliniyor */}
                        <motion.div
                            animate={{ opacity: isLoggingIn ? 0 : 0.02 }}
                            className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"
                        ></motion.div>

                        <div className="relative z-10 flex flex-col items-center w-full">

                            {/* LOGO - Fixed konumuna geçince arkası tamamen temiz kalır */}
                            <motion.div
                                layout
                                layoutId="agu-logo"
                                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                                className={isLoggingIn
                                    ? "fixed inset-0 m-auto bg-white p-8 rounded-[2rem] shadow-[0_0_80px_rgba(255,255,255,0.1)] w-48 h-48 flex items-center justify-center z-50"
                                    : "bg-white p-7 rounded-[2rem] shadow-2xl mb-12 w-48 h-48 flex items-center justify-center"
                                }
                            >
                                <img src="/agu-logo.png" alt="AGU Logo" className="w-full h-full object-contain" />
                            </motion.div>

                            {/* Yazılar */}
                            <motion.div
                                animate={{ opacity: isLoggingIn ? 0 : 1, y: isLoggingIn ? 10 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-center w-full"
                            >
                                <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
                                    Welcome to <br />
                                    Smart Dormitory <br />
                                    Management System
                                </h1>
                            </motion.div>
                        </div>

                        <div className="absolute bottom-8 left-0 w-full flex justify-center">
                            <motion.div animate={{ opacity: isLoggingIn ? 0 : 1 }} transition={{ duration: 0.3 }} className="flex items-center gap-2 bg-black/20 px-5 py-2 rounded-full border border-white/5 backdrop-blur-md">
                                <ShieldCheck size={16} className="text-white" />
                                <span className="text-xs font-semibold text-white tracking-widest uppercase">AGU Secure Portal</span>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* SAĞ TARAF - Form alanı */}
                    <motion.div
                        animate={{ opacity: isLoggingIn ? 0 : 1, x: isLoggingIn ? 20 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full md:w-1/2 p-10 lg:p-16 flex flex-col justify-center bg-[#0A1326]"
                    >
                        <div className="mb-12">
                            <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">Giriş Yap</h3>
                            <p className="text-slate-400 font-medium">Sisteme erişmek için bilgilerinizi giriniz.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2.5">
                                <label className="text-sm font-semibold text-white ml-1">E-posta Adresi</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail size={20} className="text-slate-500 group-focus-within:text-white transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-[#121C32] border border-white/5 text-white rounded-2xl focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all placeholder:text-slate-600 shadow-inner text-base font-medium"
                                        placeholder="ornek@smartdorm.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-semibold text-white">Şifre</label>
                                    <a href="#" className="text-sm font-medium text-white hover:text-slate-300 hover:underline underline-offset-4 transition-all">Şifremi Unuttum</a>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={20} className="text-slate-500 group-focus-within:text-white transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-[#121C32] border border-white/5 text-white rounded-2xl focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all placeholder:text-slate-600 shadow-inner text-base font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-8 flex items-center justify-center gap-3 py-4 bg-white hover:bg-slate-100 text-[#060F1E] rounded-2xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
                            >
                                Sisteme Giriş Yap
                                <ArrowRight size={22} strokeWidth={2.5} />
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            </div>
        </LayoutGroup>
    );
}