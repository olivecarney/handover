"use client";

import { ContentData } from "@/lib/content";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function AgencyLayout({ content }: { content: ContentData }) {
    const { hero, about, portfolio, testimonials, theme } = content;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <main
            className="min-h-screen flex flex-col font-sans"
            style={{
                backgroundColor: "var(--site-background)",
                color: "var(--site-foreground)",
            }}
        >
            {/* Navigation (Simple) */}
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="text-xl font-bold tracking-tighter">{content.brand_name || "AGENCY."}</div>
                <a
                    href="#contact"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-sm font-medium hover:opacity-70 transition-opacity"
                >
                    Contact
                </a>
            </nav>

            {/* Hero Section */}
            <section
                className="relative min-h-[80vh] flex items-center justify-center px-4 overflow-hidden"
                style={{ backgroundColor: hero.background_color }}
            >
                {hero.image && (
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={hero.image}
                            alt="Hero Background"
                            fill
                            className="object-cover opacity-20 grayscale"
                            priority
                        />
                    </div>
                )}
                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1
                            className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter leading-tight"
                            style={{ color: "var(--site-primary)" }}
                        >
                            {hero.title}
                        </h1>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        <p className="text-xl md:text-2xl mb-10 opacity-80 max-w-2xl mx-auto font-light">
                            {hero.subtitle}
                        </p>
                        <a
                            href={hero.cta_link}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-transform hover:scale-105"
                            style={{
                                backgroundColor: "var(--site-secondary)",
                                color: "#fff",
                            }}
                        >
                            {hero.cta_text}
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* About Section */}
            <section
                className="py-24 px-4"
                style={{ backgroundColor: about.background_color }}
            >
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2
                            className="text-sm font-bold tracking-widest uppercase mb-4 opacity-60"
                            style={{ color: "var(--site-primary)" }}
                        >
                            {about.title}
                        </h2>
                        <p className="text-3xl md:text-4xl font-light leading-relaxed">
                            {about.text}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Portfolio Section */}
            {portfolio && portfolio.length > 0 && (
                <section className="py-24 px-4 bg-black/5">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-end mb-12">
                            <h2
                                className="text-4xl font-bold tracking-tight"
                                style={{ color: "var(--site-primary)" }}
                            >
                                Selected Work
                            </h2>
                        </div>
                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {portfolio.map((project) => (
                                <motion.div
                                    key={project.id}
                                    variants={item}
                                    className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-200 cursor-pointer"
                                >
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <p className="text-sm text-white/80 font-medium mb-1">
                                            {project.category}
                                        </p>
                                        <h3 className="text-2xl font-bold text-white">
                                            {project.title}
                                        </h3>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Testimonials Section */}
            {testimonials && testimonials.length > 0 && (
                <section className="py-24 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2
                                className="text-4xl font-bold tracking-tight mb-4"
                                style={{ color: "var(--site-primary)" }}
                            >
                                Client Stories
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {testimonials.map((t) => (
                                <div key={t.id} className="p-8 rounded-2xl bg-muted/30 border">
                                    <p className="text-lg italic mb-6 opacity-80">"{t.quote}"</p>
                                    <div>
                                        <p className="font-bold">{t.author}</p>
                                        <p className="text-sm opacity-60">{t.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer id="contact" className="py-12 px-4 border-t opacity-60 text-center text-sm">
                <div className="flex flex-col items-center gap-4">
                    <p>© {new Date().getFullYear()} {content.brand_name || "Agency"}. Powered by <a href="https://github.com/olivecarney/handover" className="underline hover:text-primary">Handover</a>.</p>
                    <p className="text-xs">Created by <a href="#" className="underline hover:text-primary">Your Name</a></p>
                </div>
            </footer>
        </main>
    );
}
