'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectCard from '@/components/ProjectCard';
import { useLanguage } from '@/components/LanguageProvider';

export default function ProjectsPage() {
    const searchParams = useSearchParams();
    const categorySlug = searchParams.get('category');
    const { language, dict } = useLanguage();

    const [projects, setProjects] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        // Fetch categories
        fetch('/api/projects/categories')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCategories(data.data);
                }
            })
            .catch(err => console.error(err));

        // Fetch projects
        fetch('/api/projects')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProjects(data.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        // Set selected category from URL
        if (categorySlug) {
            const category = categories.find(c => c.slug === categorySlug);
            if (category) {
                setSelectedCategory(category.slug);
            }
        }
    }, [categorySlug, categories]);

    const filteredProjects = selectedCategory === 'all'
        ? projects
        : projects.filter(p => {
            // Find category by matching project's category name with categories list
            const projectCategory = categories.find(c => c.name === p.category);
            return projectCategory?.slug === selectedCategory;
        });

    // Pagination calculations
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProjects = filteredProjects.slice(startIndex, endIndex);

    // Reset to page 1 when category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    // Sort categories by project count (most to least)
    const sortedCategories = [...categories].sort((a, b) => {
        const aCount = projects.filter(p => p.category === a.name).length;
        const bCount = projects.filter(p => p.category === b.name).length;
        return bCount - aCount; // Descending order
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-xl">{dict.common.loading}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white py-20">
            <div className="container mx-auto px-4">
                <h1 className="text-5xl font-bold text-center mb-4">{dict.header.projects}</h1>
                <p className="text-center text-gray-400 mb-12">
                    {language === 'tr' ? 'Tasarladığımız ve hayata geçirdiğimiz seçkin projelerden örnekler.' : 'Examples of exclusive projects we designed and brought to life.'}
                </p>

                {/* Category Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-6 py-2 rounded-full font-medium transition-colors ${selectedCategory === 'all'
                            ? 'bg-yellow-500 text-black'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                    >
                        {dict.projects.all}
                    </button>
                    {sortedCategories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.slug)}
                            className={`px-6 py-2 rounded-full font-medium transition-colors ${selectedCategory === category.slug
                                ? 'bg-yellow-500 text-black'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                        >
                            {language === 'en' ? (category.name_en || category.name) : category.name}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                {currentProjects.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                            {currentProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                {/* Previous Button */}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:hover:bg-gray-800"
                                >
                                    ← {dict.common.prev}
                                </button>

                                {/* Page Numbers */}
                                <div className="flex gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === pageNum
                                                ? 'bg-yellow-500 text-black'
                                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}
                                </div>

                                {/* Next Button */}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:hover:bg-gray-800"
                                >
                                    {dict.common.next} →
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center text-gray-400 py-20">
                        {dict.projects.no_projects}
                    </div>
                )}
            </div>
        </div>
    );
}
