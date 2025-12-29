import Link from 'next/link';
import Image from 'next/image';

interface ProjectCardProps {
    project: {
        id: string;
        title: string;
        category: string;
        description: string;
        imageUrls: string[];
        date: string;
    };
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Link href={`/projects/${project.id}`} className="block">
            <div className="group relative overflow-hidden rounded-lg bg-gray-900 hover:bg-gray-800 transition-all duration-300 cursor-pointer">
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden">
                    {project.imageUrls?.[0] ? (
                        <img
                            src={project.imageUrls[0]}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <span className="text-gray-500">Resim Yok</span>
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                        <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                            {project.category}
                        </span>
                    </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-500 transition-colors">
                        {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                        {project.description}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">{project.date}</span>
                        <span className="text-yellow-500 group-hover:text-yellow-400 text-sm font-medium">
                            Detayları Gör →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
