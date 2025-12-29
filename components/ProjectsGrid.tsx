'use client';

import { useState } from 'react';
import { Project } from '@/lib/db';
import Link from 'next/link';

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
    const [filter, setFilter] = useState('Tümü');

    const categories = ['Tümü', 'Villa', 'Ofis', 'Mağaza', 'Restoran', 'Konut', 'Diğer'];

    const filteredProjects = filter === 'Tümü'
        ? projects
        : projects.filter(p => p.category === filter);

    return (
        <div>
            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setFilter(category)}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === category
                                ? 'bg-yellow-500 text-black'
                                : 'bg-gray-800 text-white hover:bg-gray-700'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                    <Link href={`/projects/${project.id}`} key={project.id} className="group block relative overflow-hidden rounded-xl aspect-[4/5] bg-gray-900">
                        {project.imageUrls?.[0] && (
                            <img
                                src={project.imageUrls[0]}
                                alt={project.title}
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 p-8">
                            <span className="text-yellow-500 font-medium mb-2 block">{project.category}</span>
                            <h3 className="text-2xl font-bold text-white group-hover:text-yellow-500 transition-colors">{project.title}</h3>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-20 text-gray-500 text-lg">
                    Bu kategoride henüz proje bulunmamaktadır.
                </div>
            )}
        </div>
    );
}
