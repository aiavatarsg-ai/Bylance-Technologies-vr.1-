import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import CursorGrid from './CursorGrid'

export interface ServiceCardData {
  num: string
  title: string
  shortDesc: string
  fullDesc: string
  accentColor: string
  tags: string[]
  icon: React.ReactNode
}

export const serviceCardsData: ServiceCardData[] = [
  {
    num: '01',
    title: 'Web engineering',
    shortDesc: 'Fast, accessible web apps built on modern frameworks with performance and SEO baked in from day one.',
    fullDesc: 'We build dynamic, high-performance web applications tailored specifically to your business logic. Utilizing robust full-stack architectures—including modern React ecosystems and the MERN stack—we ensure your platform is scalable, secure, and lightning-fast. From complex admin dashboards to highly interactive customer-facing portals, our web solutions feature seamless database integration and are optimized for maximum global reach and SEO performance.',
    accentColor: '#14b8a6', // Teal
    tags: ['Full-Stack Architectures', 'React & MERN Stack', 'SEO & Global Scale', 'Interactive Dashboards'],
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Mobile products',
    shortDesc: 'Native-feeling iOS and Android apps that share a codebase without compromising on polish.',
    fullDesc: 'Deliver exceptional mobile experiences across both iOS and Android with a single, highly optimized codebase. Leveraging advanced cross-platform frameworks like Flutter, we craft mobile applications that deliver a truly native feel. We focus on fluid animations, intuitive gesture controls, and uncompromising performance to keep your users fully engaged, regardless of their device.',
    accentColor: '#3b82f6', // Blue
    tags: ['Cross-Platform (Flutter)', 'iOS & Android', 'Native Performance', 'Fluid Gesture UI'],
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18h3" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Cloud & infrastructure',
    shortDesc: 'Scalable, observable infrastructure with CI/CD, IaC, and cost controls that grow with you.',
    fullDesc: "Build your product on a foundation that won't crack under pressure. We manage your entire digital backend, from secure domain configuration and reliable cloud hosting to scalable database architectures using modern BaaS platforms like Supabase. Our continuous integration and deployment (CI/CD) pipelines ensure your updates roll out seamlessly, while proactive resource monitoring keeps your infrastructure cost-effective as you scale.",
    accentColor: '#a855f7', // Purple
    tags: ['Supabase & BaaS', 'Cloud Hosting', 'CI/CD Pipelines', 'Proactive Monitoring'],
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Applied AI',
    shortDesc: 'Practical LLM features, RAG pipelines, and agents integrated into products people actually use.',
    fullDesc: 'Move beyond the hype and integrate real, value-driving artificial intelligence into your business workflows. We specialize in embedding intelligent features directly into your existing applications. Whether it is deploying custom RAG (Retrieval-Augmented Generation) pipelines that interact seamlessly with your proprietary data or building smart WhatsApp automation agents to handle 24/7 customer inquiries, we make AI practical and impactful.',
    accentColor: '#ec4899', // Pink
    tags: ['Custom RAG Pipelines', 'WhatsApp Automation', 'Proprietary Data Agents', 'Practical Workflows'],
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Product design',
    shortDesc: 'Research-led UX and interface design that turns complex workflows into clear, usable experiences.',
    fullDesc: 'Great software starts with exceptional design. We craft high-fidelity, aesthetic user interfaces that perfectly balance form and function. By incorporating modern design principles—such as sleek dark-mode environments, refined color gradients, and intuitive user journeys—our design process ensures your product is not only visually striking but also effortlessly easy for your target audience to navigate.',
    accentColor: '#f59e0b', // Amber
    tags: ['High-Fidelity UI/UX', 'Dark-Mode Aesthetics', 'Refined Gradients', 'Intuitive User Journeys'],
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    num: '06',
    title: 'Reliability & Security',
    shortDesc: 'Hardening, audits, and monitoring so your product stays available, compliant, and trusted.',
    fullDesc: 'Protect your users, your data, and your reputation with robust, proactive security practices. We implement secure authentication protocols, encrypted data storage, and continuous uptime monitoring to detect and mitigate vulnerabilities before they can impact your business. We harden your software architecture so your application remains highly available, compliant, and resilient against modern digital threats.',
    accentColor: '#10b981', // Emerald
    tags: ['Secure Auth Protocols', 'Encrypted Data Storage', 'Uptime Monitoring', 'Resilient Architecture'],
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
]

function useInView(ref: React.RefObject<Element | null>, threshold = 0.15) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true)
      },
      { threshold }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref, threshold])
  return inView
}

function Card3D({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0) rotateX(0deg)' : 'translateY(48px) rotateX(14deg)',
        perspective: '800px',
        transformOrigin: 'top center',
      }}
    >
      {children}
    </div>
  )
}

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref)
  const [selectedService, setSelectedService] = useState<ServiceCardData | null>(null)

  // Handle ESC key press to close active modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedService(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <section id="services" className="py-28 px-4 grid-bg relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none z-0">
        <CursorGrid
          cellSize={48}
          color="#14b8a6"
          radius={150}
          falloff="smooth"
          holdTime={400}
          fadeDuration={800}
          lineWidth={1.2}
          maxOpacity={0.35}
          fillOpacity={0.03}
          gridOpacity={0.02}
          clickPulse={true}
          pulseSpeed={650}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div
          className="mb-14 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(32px)' }}
        >
          <p className="text-teal-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">// What we do</p>
          <h2 style={{ fontFamily: 'Sora, sans-serif' }} className="text-4xl md:text-5xl font-bold text-white max-w-2xl leading-tight">
            One team for the entire product lifecycle
          </h2>
          <p className="mt-4 text-white/45 text-base max-w-xl leading-relaxed">
            From discovery to delivery, Bylance covers every layer of your stack so you don't have to stitch together five vendors.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ perspective: '1000px' }}>
          {serviceCardsData.map((service, i) => (
            <Card3D key={service.title} delay={i * 65}>
              <div className="group p-6 rounded-2xl bg-[#111] border border-white/8 hover:border-teal-500/30 hover:bg-[#131c1f] transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#0d1f1e] border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/10 transition-colors">
                      {service.icon}
                    </div>
                    <span className="text-xs font-mono font-semibold text-white/30 group-hover:text-teal-400/70 transition-colors">
                      {service.num}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'Sora, sans-serif' }} className="text-white font-semibold text-base mb-2 group-hover:text-teal-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-white/45 text-sm leading-relaxed mb-4">
                    {service.shortDesc}
                  </p>
                </div>

                {/* Learn More Button */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400 group-hover:text-teal-300 transition-colors cursor-pointer"
                  >
                    Learn More
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>

                  <span className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-teal-400 transition-colors" />
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      </div>

      {/* Expanded Service Detail Modal with Smooth Framer Motion Animation */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop Fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Card Scale & Slide Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              className="relative w-full max-w-2xl bg-[#0d0d0d] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-teal-500/10 z-10 my-auto overflow-hidden"
            >
              {/* Top Accent Line */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent"
                style={{
                  backgroundImage: `linear-gradient(90deg, transparent, ${selectedService.accentColor}, transparent)`
                }}
              />

              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                  style={{
                    backgroundColor: `${selectedService.accentColor}15`,
                    borderColor: `${selectedService.accentColor}40`,
                    color: selectedService.accentColor,
                  }}
                >
                  {selectedService.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">
                      SERVICE {selectedService.num}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'Sora, sans-serif' }} className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    {selectedService.title}
                  </h3>
                </div>
              </div>

              {/* Full Description Content */}
              <div className="mb-8 border-t border-white/8 pt-6">
                <p className="text-white/80 text-base sm:text-lg leading-relaxed font-normal">
                  {selectedService.fullDesc}
                </p>
              </div>

              {/* Feature Tags */}
              <div className="mb-8">
                <p className="text-white/35 text-xs uppercase font-mono tracking-wider mb-3">Key Capabilities & Stack</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedService.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg border text-xs font-medium"
                      style={{
                        backgroundColor: `${selectedService.accentColor}10`,
                        borderColor: `${selectedService.accentColor}30`,
                        color: selectedService.accentColor,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between gap-4 pt-6 border-t border-white/8">
                <button
                  onClick={() => {
                    setSelectedService(null)
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-teal-400 transition-colors shadow-lg cursor-pointer flex items-center gap-2"
                >
                  Book a Call for {selectedService.title}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>

                <button
                  onClick={() => setSelectedService(null)}
                  className="px-5 py-2.5 rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-sm transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
