import { getUserById } from '@/lib/db';
import { notFound } from 'next/navigation';
import EditUserForm from './EditUserForm';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
        notFound();
    }

    const user = await getUserById(userId);

    if (!user) {
        notFound();
    }

    return <EditUserForm user={user} />;
}
