import { getContent } from "@/lib/content";
import Image from "next/image";

export default async function Home() {
  const content = await getContent();
  const { hero, about } = content;

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section
        className="relative h-[600px] flex items-center justify-center text-center px-4 overflow-hidden"
        style={{ backgroundColor: hero.background_color }}
      >
        {hero.image && (
          <div className="absolute inset-0 z-0">
            <Image
              src={hero.image}
              alt="Hero Background"
              fill
              className="object-cover opacity-30"
              priority
            />
          </div>
        )}
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
            {hero.title}
          </h1>
          <p className="text-xl mb-8 opacity-90">
            {hero.subtitle}
          </p>
          <a
            href={hero.cta_link}
            className="px-8 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--secondary)', color: '#fff' }}
          >
            {hero.cta_text}
          </a>
        </div>
      </section>

      {/* About Section */}
      <section
        className="py-20 px-4"
        style={{ backgroundColor: about.background_color }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--primary)' }}>
            {about.title}
          </h2>
          <div className="prose lg:prose-xl mx-auto text-center">
            <p>{about.text}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
