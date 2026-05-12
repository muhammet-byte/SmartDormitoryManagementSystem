import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // 1. Yönetici (Admin) Girişi
        if (email === 'admin@smartdorm.com') {
            localStorage.removeItem('userId');
            navigate('/admin/dashboard');
            return;
        }

        // 2. Dinamik Öğrenci Girişi Kontrolü
        // E-posta formatını kontrol ediyoruz: ogrenci[ID]@smartdorm.com
        const studentEmailRegex = /^ogrenci(\d+)@smartdorm\.com$/;
        const match = email.match(studentEmailRegex);

        if (match && password === '1234') {
            // match[1] bize e-postanın içindeki numarayı (ID) verir.
            const studentId = match[1];

            // Yakaladığımız ID'yi tarayıcıya kaydedip öğrenci paneline yönlendiriyoruz
            localStorage.setItem('userId', studentId);
            navigate('/student/dashboard');
        } else {
            // Eğer format veya şifre yanlışsa
            alert('Hatalı giriş! \nÖğrenci formatı: ogrenci[ID]@smartdorm.com \nŞifre: 1234');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                {/* Sol Taraf: Karşılama ve Branding */}
                <div className="w-full md:w-5/12 bg-indigo-600 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-12">
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                <Home size={24} className="text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tight">SmartDorm</span>
                        </div>

                        <h1 className="text-4xl font-black leading-tight mb-4">
                            Yeni Nesil<br />Yurt Yönetimi
                        </h1>
                        <p className="text-indigo-100 font-medium">
                            Yapay zeka destekli oda eşleştirme ve akıllı yönetim sistemine hoş geldiniz.
                        </p>
                    </div>

                    <div className="relative z-10 mt-12">
                        <div className="bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={16} className="text-indigo-200" />
                                <span className="text-sm font-bold text-indigo-100">Test Hesapları</span>
                            </div>
                            <p className="text-xs text-indigo-200">Admin: admin@smartdorm.com</p>
                            <p className="text-xs text-indigo-200">Öğrenci: ogrenci1@smartdorm.com</p>
                        </div>
                    </div>

                    {/* Arka Plan Süslemeleri */}
                    <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
                </div>

                {/* Sağ Taraf: Giriş Formu */}
                <div className="w-full md:w-7/12 p-8 md:p-12 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Giriş Yap</h2>
                        <p className="text-gray-500 mb-8">Hesabınıza erişmek için bilgilerinizi girin.</p>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-posta Adresi</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="ornek@smartdorm.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-sm font-semibold text-gray-700">Şifre</label>
                                    <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Şifremi Unuttum</a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" id="remember" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                                <label htmlFor="remember" className="text-sm text-gray-600 font-medium">Beni hatırla</label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 mt-4 group"
                            >
                                Sisteme Giriş Yap
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}