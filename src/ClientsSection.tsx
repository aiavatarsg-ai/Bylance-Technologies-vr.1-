import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export interface ClientScopeItem {
  id: string
  num: string
  title: string
  category: string
  detail: string
  tags: string[]
}

export interface ClientItem {
  id: string
  name: string
  category: string
  logoText: string
  tagline: string
  description: string
  accentColor: string
  scopes: ClientScopeItem[]
  keyMetrics: { label: string; value: string }[]
  technologies: string[]
}

export const clientsData: ClientItem[] = [
  {
    id: 'eldea-solutions',
    name: 'Eldea Solutions',
    category: 'AI & Software Engineering',
    logoText: 'ELDEA',
    tagline: 'End-to-End Web Refactoring, Multi-Agent AI Architecture & Deployment Management',
    description:
      'Bylance Technologies partnered with Eldea Solutions to deliver comprehensive front-end UI/UX refactoring, Cloudflare Pages infrastructure management, LangGraph AI multi-agent orchestration, and automated WhatsApp lead management.',
    accentColor: '#14b8a6', // Teal accent
    technologies: ['LangGraph', 'Gemini & DeepSeek', 'Cloudflare Pages', 'Interakt (WhatsApp)', 'React & UI/UX'],
    keyMetrics: [
      { value: '5 Core Scopes', label: 'Delivered End-to-End' },
      { value: 'Multi-Agent AI', label: 'LangGraph + Gemini & DeepSeek' },
      { value: 'Edge Hosting', label: 'Cloudflare Pages Deployment' },
      { value: 'Lead Automation', label: 'Interakt WhatsApp Business' },
    ],
    scopes: [
      {
        id: 'scope-1',
        num: '01',
        title: 'Front-End Design & UI/UX Refactoring',
        category: 'Web & Infrastructure',
        detail:
          'Front-end design, UI/UX improvements, and complete refactoring of web properties to maximize performance, visual polish, and user engagement across modern web applications.',
        tags: ['React', 'UI/UX Redesign', 'Web Refactoring', 'Performance'],
      },
      {
        id: 'scope-2',
        num: '02',
        title: 'Domain & Infrastructure Management',
        category: 'Web & Infrastructure',
        detail:
          'Domain configuration and deployment infrastructure management, leveraging high-performance edge platforms such as Cloudflare Pages for seamless, secure global delivery.',
        tags: ['Cloudflare Pages', 'DNS & Domain Control', 'Edge Hosting', 'CI/CD Pipelines'],
      },
      {
        id: 'scope-3',
        num: '03',
        title: 'AI Multi-Agent Systems (LangGraph & LLMs)',
        category: 'AI & Multi-Agent Systems',
        detail:
          'Design and development of advanced AI-based multi-agent systems using frameworks such as LangGraph, integrating state-of-the-art LLMs (e.g., Gemini, DeepSeek) for intelligent orchestration, web search, and data validation workflows.',
        tags: ['LangGraph', 'Gemini LLM', 'DeepSeek LLM', 'Orchestration', 'Search & Validation'],
      },
      {
        id: 'scope-4',
        num: '04',
        title: 'WhatsApp Lead Management & Communication',
        category: 'Lead Automation',
        detail:
          'Streamlined lead management and real-time client communication using WhatsApp Business automation tools such as Interakt for instant response and workflow integration.',
        tags: ['WhatsApp Business', 'Interakt API', 'Lead Management', 'CRM Automation'],
      },
      {
        id: 'scope-5',
        num: '05',
        title: 'End-to-End Client Web Development',
        category: 'Full-Stack Delivery',
        detail:
          'Direct contribution to client-facing web development projects, steering every initiative from initial strategic planning through technical architecture, build, and production delivery.',
        tags: ['Strategic Planning', 'Full-Stack Build', 'Client Delivery', 'Codebase Ownership'],
      },
    ],
  },
]

const categoryFilters = [
  'All',
  'AI & Multi-Agent Systems',
  'Web & Infrastructure',
  'Lead Automation',
  'Full-Stack Delivery',
]

const technologyStrip = [
  { name: 'LANGGRAPH', desc: 'Agentic Orchestration' },
  { name: 'GEMINI & DEEPSEEK', desc: 'LLM Intelligence' },
  { name: 'CLOUDFLARE PAGES', desc: 'Edge Infrastructure' },
  { name: 'INTERAKT', desc: 'WhatsApp Lead Automation' },
  { name: 'REACT & TS', desc: 'UI/UX Engineering' },
]

export default function ClientsSection() {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [activeScopeTab, setActiveScopeTab] = useState<string>('scope-3')
  const [selectedCaseModal, setSelectedCaseModal] = useState<ClientItem | null>(null)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCaseModal(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const mainClient = clientsData[0]
  const filteredScopes =
    activeCategory === 'All'
      ? mainClient.scopes
      : mainClient.scopes.filter((s) => s.category === activeCategory)

  const activeScopeDetail =
    mainClient.scopes.find((s) => s.id === activeScopeTab) || mainClient.scopes[0]

  return (
    <section id="clients" ref={ref} className="py-28 px-4 sm:px-8 relative overflow-hidden bg-[#080808]">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-teal-500/10 via-blue-500/5 to-purple-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div
          className={`flex flex-col items-center text-center gap-4 max-w-2xl mx-auto mb-14 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/20 bg-teal-500/10 text-teal-400 text-xs font-mono tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Client Success & Proven Delivery
          </div>

          <h2 style={{ fontFamily: 'Sora, sans-serif' }} className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Engineering real impact for industry leaders
          </h2>

          <p className="text-white/60 text-base sm:text-lg leading-relaxed">
            Deep dive into our engineering engagement with <strong className="text-teal-300 font-semibold">Eldea Solutions</strong> — from LangGraph multi-agent AI systems to Cloudflare deployment and lead automation.
          </p>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-4">
            {categoryFilters.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  activeCategory === category
                    ? 'bg-teal-400 text-black font-semibold shadow-md shadow-teal-400/20'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/8'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Client Case Card: Eldea Solutions */}
        <div
          className={`rounded-3xl bg-[#0d0d12] border border-white/10 p-6 sm:p-10 shadow-2xl transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Top Bar: Brand, Category, Badge */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center font-mono font-bold text-teal-400 text-lg tracking-widest shadow-lg shadow-teal-500/10">
                ELDEA
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 style={{ fontFamily: 'Sora, sans-serif' }} className="text-2xl font-bold text-white">
                    {mainClient.name}
                  </h3>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300">
                    {mainClient.category}
                  </span>
                </div>
                <p className="text-white/50 text-sm mt-1">{mainClient.tagline}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCaseModal(mainClient)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer self-start md:self-auto"
            >
              View Full Case Study
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>

          {/* Client Metrics Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-b border-white/10">
            {mainClient.keyMetrics.map((m, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#13131a] border border-white/5">
                <div style={{ fontFamily: 'Sora, sans-serif' }} className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {m.value}
                </div>
                <div className="text-white/40 text-xs mt-1 font-mono">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Interactive Work Scopes Showcase */}
          <div className="pt-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h4 style={{ fontFamily: 'Sora, sans-serif' }} className="text-white font-semibold text-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                Delivered Engineering Scopes ({filteredScopes.length})
              </h4>
              <span className="text-xs font-mono text-white/40">Select a scope to inspect deliverables</span>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Scope List Buttons */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                {filteredScopes.map((scope) => {
                  const isActive = activeScopeTab === scope.id
                  return (
                    <button
                      key={scope.id}
                      type="button"
                      onClick={() => setActiveScopeTab(scope.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start justify-between gap-3 ${
                        isActive
                          ? 'bg-teal-500/10 border-teal-500/40 text-white shadow-lg shadow-teal-500/5'
                          : 'bg-[#111116] border-white/5 text-white/60 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-teal-400 font-bold">{scope.num}</span>
                          <span className="text-xs font-mono text-white/40">[{scope.category}]</span>
                        </div>
                        <div style={{ fontFamily: 'Sora, sans-serif' }} className="font-semibold text-sm">
                          {scope.title}
                        </div>
                      </div>

                      <svg
                        className={`w-4 h-4 mt-1 transition-transform duration-300 flex-shrink-0 ${
                          isActive ? 'text-teal-400 translate-x-1' : 'text-white/20'
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  )
                })}
              </div>

              {/* Right Column: Active Scope Detail Card */}
              <div className="lg:col-span-7 rounded-2xl bg-[#13131c] border border-teal-500/30 p-6 sm:p-8 min-h-[300px] flex flex-col justify-between shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-3xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="text-xs font-mono font-bold text-teal-400 tracking-wider">
                      DELIVERABLE #{activeScopeDetail.num}
                    </span>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                      {activeScopeDetail.category}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'Sora, sans-serif' }} className="text-xl sm:text-2xl font-bold text-white mb-4">
                    {activeScopeDetail.title}
                  </h3>

                  <p className="text-white/75 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                    {activeScopeDetail.detail}
                  </p>
                </div>

                {/* Scope Tags */}
                <div>
                  <div className="text-white/40 text-xs font-mono uppercase mb-2">Technologies & Architecture</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {activeScopeDetail.tags.map((t, idx) => (
                      <span key={idx} className="text-xs px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Ecosystem Strip */}
        <div className={`mt-16 pt-12 border-t border-white/8 transition-all duration-700 delay-300 ${inView ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-center text-white/40 text-xs font-mono uppercase tracking-[0.2em] mb-8">
            Core Technology Stack Delivered for Eldea Solutions
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {technologyStrip.map((tech, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#0f0f14] border border-white/5 hover:border-teal-500/30 transition-all duration-300 text-center group"
              >
                <div style={{ fontFamily: 'Sora, sans-serif' }} className="text-white font-bold text-sm tracking-wider group-hover:text-teal-300 transition-colors">
                  {tech.name}
                </div>
                <div className="text-white/40 text-xs font-mono mt-1">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Case Study Modal with Smooth Framer Motion */}
      <AnimatePresence>
        {selectedCaseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-4xl rounded-3xl bg-[#0f0f14] border border-teal-500/30 p-6 sm:p-10 shadow-2xl my-8 text-white max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedCaseModal(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono uppercase mb-4">
                  Full Case Study
                </div>

                <h3 style={{ fontFamily: 'Sora, sans-serif' }} className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {selectedCaseModal.name}
                </h3>
                <p className="text-white/60 text-base">{selectedCaseModal.tagline}</p>
              </div>

              {/* Modal Scopes Breakdown */}
              <div className="space-y-6 mb-8">
                <h4 style={{ fontFamily: 'Sora, sans-serif' }} className="text-xl font-semibold text-white border-b border-white/10 pb-3">
                  Scope of Work Delivered by Bylance Technologies
                </h4>

                {selectedCaseModal.scopes.map((scope) => (
                  <div key={scope.id} className="p-5 rounded-2xl bg-[#15151e] border border-white/8">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono font-bold text-teal-400">{scope.num}</span>
                      <h5 style={{ fontFamily: 'Sora, sans-serif' }} className="font-semibold text-white text-base">
                        {scope.title}
                      </h5>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed mb-3">{scope.detail}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {scope.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs px-2.5 py-0.5 rounded bg-white/5 text-teal-300 font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button inside Modal */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCaseModal(null)
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-teal-400/20"
                >
                  Start Similar Project →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
