import Link from 'next/link';
import { LayoutDashboard, FileText, ArrowLeft, LogOut, Settings, MessageSquare, Folder } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Siteye Dön
                    </Link>


                </nav>
                <div className="p-4 border-t border-gray-800">
                    {/* Logout implementation can be added here or just rely on browser clearing cookies */}
                    <form action="/api/auth/logout" method="POST">
                        <button className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
                            <LogOut size={20} />
                            Çıkış Yap
                        </button>
                    </form>
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
