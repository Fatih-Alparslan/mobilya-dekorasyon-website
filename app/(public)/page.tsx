import Link from 'next/link';
import { ArrowRight, Ruler, Home, Building2, Paintbrush, Wrench, Hammer, Sofa, Package } from 'lucide-react';
import { getProjects, getServices } from '@/lib/db';

// Icon mapping
const iconMap: any = {
  'Home': Home,
  'Building2': Building2,
  'Wrench': Wrench,
  'Sofa': Sofa,
  'Paintbrush': Paintbrush,
  'Hammer': Hammer,
  'Ruler': Ruler,
  'Package': Package,
};

export default async function HomePage() {
  const projects = await getProjects();
  const recentProjects = projects.slice(0, 3);
  const services = await getServices();
  const displayServices = services.slice(0, 4); // Maksimum 4 hizmet

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1620626012053-1541e455023c?auto=format&fit=crop&q=80&w=3270")',
          }}
        >
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            <span className="block text-white mb-2">HAYALLERİNİZİ</span>
            <span className="block text-yellow-500">TASARLIYORUZ</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Profesyonel iç mimarlık ve dekorasyon hizmetleriyle yaşam alanlarınıza değer katıyoruz.
            Modern, estetik ve fonksiyonel çözümler.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="px-8 py-4 bg-yellow-500 text-black font-bold text-lg rounded hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
            >
              Projelerimizi İnceleyin
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white text-white font-bold text-lg rounded hover:bg-white hover:text-black transition-all"
            >
              Bize Ulaşın
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-yellow-500 font-bold tracking-widest text-sm uppercase">Hizmetlerimiz</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">Faaliyet Alanlarımız</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayServices.map((service) => {
              const IconComponent = iconMap[service.icon] || Wrench;
              return (
                <div key={service.id} className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-yellow-500 transition-colors group">
                  <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-yellow-500 transition-colors">
                    <IconComponent className="text-yellow-500 group-hover:text-black transition-colors" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Projects Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-yellow-500 font-bold tracking-widest text-sm uppercase">Son Çalışmalar</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">Projelerimiz</h2>
            </div>
            <Link href="/projects" className="hidden md:flex items-center gap-2 text-white hover:text-yellow-500 transition-colors">
              Tümünü Gör <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {recentProjects.map((project) => (
              <Link href={`/projects/${project.id}`} key={project.id} className="group block relative overflow-hidden rounded-xl aspect-[4/5]">
                <img
                  src={project.imageUrls?.[0] || 'https://via.placeholder.com/800x1000'}
                  alt={project.title}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 p-8">
                  <span className="text-yellow-500 font-medium mb-2 block">{project.category}</span>
                  <h3 className="text-2xl font-bold text-white group-hover:text-yellow-500 transition-colors">{project.title}</h3>
                </div>
              </Link>
            ))}

            {recentProjects.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                Henüz sergilenecek proje bulunmuyor.
              </div>
            )}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link href="/projects" className="inline-flex items-center gap-2 text-white hover:text-yellow-500 transition-colors">
              Tümünü Gör <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-yellow-500 z-0" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-black mb-6">Projeniz için Hazır mısınız?</h2>
          <p className="text-black/80 text-xl max-w-2xl mx-auto mb-10 font-medium">
            Hayalinizdeki mekanı tasarlamak için bizimle iletişime geçin, profesyonel ekibimiz size yardımcı olsun.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-black text-white font-bold rounded hover:bg-gray-900 transition-colors"
          >
            Teklif Alın
          </Link>
        </div>
      </section>
    </div>
  );
}
