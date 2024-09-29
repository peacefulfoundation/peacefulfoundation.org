'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { Briefcase, ChevronUp, Home, Mail, User } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';

const sections = [
  { id: 'home', icon: Home, content: 'Welcome to our homepage' },
  { id: 'about', icon: User, content: 'Learn about our company' },
  { id: 'portfolio', icon: Briefcase, content: 'Check out our work' },
  { id: 'contact', icon: Mail, content: 'Get in touch with us' },
];

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('home');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrolling) return;

      const sectionHeight = window.innerHeight;
      const scrollPosition = container.scrollTop;
      const sectionIndex = Math.round(scrollPosition / sectionHeight);
      const targetSection = sections[sectionIndex];

      if (targetSection && targetSection.id !== activeSection) {
        setActiveSection(targetSection.id);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeSection, isScrolling]);

  const scrollToSection = (id: string) => {
    setIsScrolling(true);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setTimeout(() => setIsScrolling(false), 1000); // Adjust timeout as needed
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="fixed left-0 top-0 z-10 flex h-full w-16 flex-col items-center justify-center space-y-8 bg-gray-800">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`rounded-full p-2 transition-colors duration-200 ${
              activeSection === section.id
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <section.icon className="h-6 w-6" />
            <span className="sr-only">{section.id}</span>
          </button>
        ))}
      </aside>
      <main
        ref={containerRef}
        className="ml-16 flex-1 snap-y snap-mandatory overflow-y-auto"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="flex h-screen snap-start items-center justify-center p-8 text-4xl font-bold"
          >
            <div className="mx-auto max-w-4xl text-center">
              <section.icon className="mx-auto mb-8 h-24 w-24" />
              <h2 className="mb-4">{section.content}</h2>
              <p className="text-xl font-normal">
                This is the {section.id} section. Scroll or use the sidebar to
                navigate.
              </p>
            </div>
          </section>
        ))}
      </main>
      <button
        onClick={() => scrollToSection('home')}
        className="fixed bottom-8 right-8 z-10 rounded-full bg-blue-500 p-2 text-white shadow-lg transition-colors duration-200 hover:bg-blue-600"
      >
        <ChevronUp className="h-6 w-6" />
        <span className="sr-only">Scroll to top</span>
      </button>
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-1 bg-blue-500"
        style={{ scaleX, transformOrigin: '0%' }}
      />
    </div>
  );
}
