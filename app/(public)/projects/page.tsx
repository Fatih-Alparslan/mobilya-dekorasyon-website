'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectCard from '@/components/ProjectCard';

export default function ProjectsPage() {
    const searchParams = useSearchParams();
    const categorySlug = searchParams.get('category');

    const [projects, setProjects] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [loading, setLoading] = useState(true);

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

    // Sort categories by project count (most to least)
    const sortedCategories = [...categories].sort((a, b) => {
        const aCount = projects.filter(p => p.category === a.name).length;
        const bCount = projects.filter(p => p.category === b.name).length;
        return bCount - aCount; // Descending order
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-xl">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white py-20">
            <div className="container mx-auto px-4">
                <h1 className="text-5xl font-bold text-center mb-4">Projelerimiz</h1>
                <p className="text-center text-gray-400 mb-12">
                    Tasarladığımız ve hayata geçirdiğimiz seçkin projelerden örnekler.
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
                        Tümü
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
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-400 py-20">
                        Bu kategoride henüz proje yok.
                    </div>
                )}
            </div>
        </div>
    );
}
