import Link from 'next/link';
import { LayoutDashboard, ArrowLeft, LogOut, Settings, MessageSquare, Folder, Share2, Users, User } from 'lucide-react';
import { getAdminSession } from '@/lib/auth';
import LogoutButton from './LogoutButton';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const sessionData = await getAdminSession();
    const username = sessionData?.user?.username || 'Admin';

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white border-r border-gray-800 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-yellow-500">Admin Panel</h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <LayoutDashboard size={20} />
                        Projeler
                    </Link>
                    <Link
                        href="/admin/categories"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <Folder size={20} />
                        Kategoriler
                    </Link>
                    <Link
                        href="/admin/about"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <MessageSquare size={20} />
                        Hakkımızda
                    </Link>
                    <Link
                        href="/admin/services"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <MessageSquare size={20} />
                        Hizmetler
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <Settings size={20} />
                        Ayarlar
                    </Link>
                    <Link
                        href="/admin/contact"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <MessageSquare size={20} />
                        İletişim
                    </Link>
                    <Link
                        href="/admin/social-media"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <Share2 size={20} />
                        Sosyal Medya
                    </Link>
                    {sessionData?.user?.role === 'super_admin' && (
                        <Link
                            href="/admin/users"
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <Users size={20} />
                            Kullanıcılar
                        </Link>
                    )}
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Siteye Dön
                    </Link>
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-gray-800 space-y-3">
                    {/* Current User */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-lg">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                            <User size={16} className="text-black" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{username}</p>
                            <p className="text-xs text-gray-400">
                                {sessionData?.user?.role === 'super_admin' ? 'Süper Yönetici' :
                                    sessionData?.user?.role === 'admin' ? 'Yönetici' : 'Editör'}
                            </p>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
