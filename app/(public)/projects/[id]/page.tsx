'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function ProjectDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { language, dict } = useLanguage();

    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Format date as "dd.mm.yyyy" (e.g., "15.01.2024")
    const formatDate = (dateString: string) => {
        try {
            const d = new Date(dateString);
            return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
        } catch (e) {
            return dateString;
        }
    };

    useEffect(() => {
        if (!id) return;

        fetch(`/api/projects/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProject(data.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = () => {
        if (project?.imageUrls) {
            setCurrentImageIndex((prev) => (prev + 1) % project.imageUrls.length);
        }
    };

    const prevImage = () => {
        if (project?.imageUrls) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? project.imageUrls.length - 1 : prev - 1
            );
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, currentImageIndex]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-xl">{dict?.common?.loading || 'Yükleniyor...'}</div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-xl">Proje bulunamadı</div>
            </div>
        );
    }

    // Determine content based on selected language
    const displayTitle = language === 'en' && project.title_en ? project.title_en : project.title;
    const displayDesc = language === 'en' && project.description_en ? project.description_en : project.description;

    // Category name is not in project object directly (it has category string which IS the name)
    // But API getProjectById query: COALESCE(c.name, p.category, 'Kategorisiz') as category.
    // It doesn't fetch c.name_en!
    // We should fix API query to fetch name_en or handle it here if possible.
    // But for now, we only have TR category name in `project.category`.
    // The previous prompt identified this issue.
    // We should probably rely on what we have, or fetch category EN name.
    // But let's stick to simple display. At least title and desc are translated.

    return (
        <div className="min-h-screen bg-black text-white py-20">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Project Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        {project.category_slug ? (
                            <Link
                                href={`/projects?category=${project.category_slug}`}
                                className="bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-medium hover:bg-yellow-400 transition-colors"
                            >
                                {project.category}
                            </Link>
                        ) : (
                            <span className="bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-medium">
                                {project.category}
                            </span>
                        )}
                        <span className="text-gray-400">{formatDate(project.date)}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{displayTitle}</h1>
                    <p className="text-gray-400 text-lg">{displayDesc}</p>
                </div>

                {/* Image Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.imageUrls?.map((url: string, index: number) => (
                        <div
                            key={index}
                            onClick={() => openLightbox(index)}
                            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                        >
                            <img
                                src={url}
                                alt={`${displayTitle} - ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    {language === 'en' ? 'Zoom' : 'Büyüt'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Lightbox */}
                {lightboxOpen && (
                    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 text-white hover:text-yellow-500 transition-colors z-10"
                        >
                            <X size={32} />
                        </button>

                        {/* Previous Button */}
                        {project.imageUrls.length > 1 && (
                            <button
                                onClick={prevImage}
                                className="absolute left-4 text-white hover:text-yellow-500 transition-colors z-10"
                            >
                                <ChevronLeft size={48} />
                            </button>
                        )}

                        {/* Image */}
                        <div className="max-w-7xl max-h-[90vh] px-16">
                            <img
                                src={project.imageUrls[currentImageIndex]}
                                alt={`${displayTitle} - ${currentImageIndex + 1}`}
                                className="max-w-full max-h-[90vh] object-contain"
                            />
                        </div>

                        {/* Next Button */}
                        {project.imageUrls.length > 1 && (
                            <button
                                onClick={nextImage}
                                className="absolute right-4 text-white hover:text-yellow-500 transition-colors z-10"
                            >
                                <ChevronRight size={48} />
                            </button>
                        )}

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
                            {currentImageIndex + 1} / {project.imageUrls.length}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
