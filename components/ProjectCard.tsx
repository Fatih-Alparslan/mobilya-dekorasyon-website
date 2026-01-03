'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

interface ProjectCardProps {
    project: {
        id: string;
        title: string;
        title_en?: string;
        category: string;
        description: string;
        description_en?: string;
        imageUrls: string[];
        date: string;
    };
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const { language, dict } = useLanguage();

    const displayTitle = language === 'en' && project.title_en ? project.title_en : project.title;
    const displayDescription = language === 'en' && project.description_en ? project.description_en : project.description;

    const formatDate = (dateString: string) => {
        try {
            const d = new Date(dateString);
            return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
        } catch (e) {
            return dateString;
        }
    };

    return (
        <Link href={`/projects/${project.id}`} className="block h-full">
            <div className="group relative overflow-hidden rounded-lg bg-gray-900 hover:bg-gray-800 transition-all duration-300 cursor-pointer flex flex-col h-full">
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-800 flex-shrink-0">
                    {project.imageUrls?.[0] ? (
                        <img
                            src={project.imageUrls[0]}
                            alt={displayTitle}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-gray-500">{language === 'tr' ? 'Resim Yok' : 'No Image'}</span>
                        </div>
                    )}

                    <div className="absolute top-4 left-4 z-10">
                        <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                            {project.category}
                        </span>
                    </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-500 transition-colors">
                        {displayTitle}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">
                        {displayDescription}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-gray-500 text-sm">{formatDate(project.date)}</span>
                        <span className="text-yellow-500 group-hover:text-yellow-400 text-sm font-medium">
                            {dict.home.view_project} →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
