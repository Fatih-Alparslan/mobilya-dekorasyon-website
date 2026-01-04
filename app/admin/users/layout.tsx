import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function UsersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const sessionData = await getAdminSession();

    if (sessionData?.user?.role !== 'super_admin') {
        redirect('/admin');
    }

    return <>{children}</>;
}
