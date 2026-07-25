import { useEffect, useRef, useState } from 'react'
import logoImg from '@/imports/bylance-logo.png'
import GradualBlur from './GradualBlur'
import VariableProximity from './VariableProximity'
import LineSidebar from './LineSidebar'
import StaggeredMenu from './StaggeredMenu'
import Stepper, { Step } from './Stepper'
import SpecularButton from './SpecularButton'
import CursorGrid from './CursorGrid'
import TiltedCard from './TiltedCard'
import ClientsSection from './ClientsSection'
import ServicesSection from './ServicesSection'
import ClickSpark from './ClickSpark'
import BorderGlow from './BorderGlow'




// ─── Easing ──────────────────────────────────────────────────────────────────

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

// ─── Scroll progress hook ────────────────────────────────────────────────────

function useScrollProgress(ref: React.RefObject<HTMLElement | null>, start = 0, end = 1) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handler = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const total = ref.current.offsetHeight - window.innerHeight
      const scrolled = -rect.top
      const raw = clamp(scrolled / (total || 1), 0, 1)
      const mapped = clamp((raw - start) / (end - start), 0, 1)
      setProgress(mapped)
    }
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [ref, start, end])
  return progress
}

function useInView(ref: React.RefObject<Element | null>, threshold = 0.12) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref, threshold])
  return inView
}

// ─── Navbar ─────────────────────────────────────────────────────────────────

function Navbar() {
  const sectionIds = ['hero', 'services', 'clients', 'approach', 'manifesto', 'contact']
  const [activeSectionIdx, setActiveSectionIdx] = useState<number>(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i])
        if (el) {
          const top = el.offsetTop
          if (scrollPos >= top) {
            setActiveSectionIdx(i)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { label: 'Home', ariaLabel: 'Home', link: '#hero' },
    { label: 'Services', ariaLabel: 'Our Services', link: '#services' },
    { label: 'Clients', ariaLabel: 'Our Clients', link: '#clients' },
    { label: 'Approach', ariaLabel: 'Our Approach', link: '#approach' },
    { label: 'Manifesto', ariaLabel: 'Our Manifesto', link: '#manifesto' },
    { label: 'Contact', ariaLabel: 'Boot a Meet', link: '#contact' },
  ]

  const socialItems = [
    { label: 'LinkedIn', link: 'https://linkedin.com' },
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'GitHub', link: 'https://github.com/nezfn' },
  ]

  const handleSidebarClick = (_index: number, label: string) => {
    const id = label.toLowerCase()
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10 sm:py-6 pointer-events-none">
        <a href="#" className="flex items-center gap-2.5 cursor-target pointer-events-auto group">
          <div className="w-8 h-8 rounded-lg bg-white p-0.5 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden group-hover:scale-105 transition-transform duration-200">
            <img src={logoImg} alt="Bylance Technologies Logo" className="w-full h-full object-contain rounded-md" />
          </div>
          <span style={{ fontFamily: 'Sora, sans-serif' }} className="text-white font-semibold text-sm tracking-tight">
            Bylance Technologies
          </span>
        </a>

        <a
          href="#contact"
          className="hidden sm:flex items-center px-4 py-2 sm:px-5 sm:py-2 rounded-full bg-white text-black text-xs sm:text-sm font-semibold hover:bg-teal-400 hover:text-black transition-all duration-200 cursor-target shadow-lg shadow-white/5 pointer-events-auto mr-28 sm:mr-32 min-[1480px]:mr-0"
        >
          Boot a Meet
        </a>
      </header>

      {/* Desktop Navigation: Line Sidebar (Left edge) */}
      <LineSidebar
        items={menuItems.map(m => m.label)}
        accentColor="#14b8a6"
        textColor="#a1a1aa"
        markerColor="#52525b"
        showIndex={true}
        showMarker={true}
        proximityRadius={200}
        maxShift={75}
        falloff="smooth"
        markerLength={64}
        markerGap={14}
        tickScale={0.45}
        scaleTick={true}
        itemGap={24}
        fontSize={1.25}
        smoothing={100}
        activeIndex={activeSectionIdx}
        onItemClick={handleSidebarClick}
      />

      {/* Navigation Menu (Shown when LineSidebar is hidden under 1480px viewport width) */}
      <div className="min-[1480px]:hidden">
        <StaggeredMenu
          position="right"
          items={menuItems}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={true}
          menuButtonColor="#ffffff"
          openMenuButtonColor="#14b8a6"
          colors={['#14b8a6', '#06b6d4', '#ec4899']}
          accentColor="#14b8a6"
          isFixed={true}
        />
      </div>
    </>
  )
}

// ─── Hero — Pinned scroll section ────────────────────────────────────────────
// 220vh container, sticky viewport. As you scroll:
//  · hero image tilts smoothly from 3D isometric perspective angle to flat (layer 3)
//  · text translates smoothly with subtle parallax
//  · mouse tracking adds dynamic 3D tilt response without uncomfortable fading

function Hero() {
  const pinRef = useRef<HTMLDivElement>(null)
  const titleContainerRef = useRef<HTMLHeadingElement>(null)
  const progress = useScrollProgress(pinRef as React.RefObject<HTMLElement>, 0, 1)
  const p = easeOutCubic(progress)

  // Mouse interaction state for subtle extra 3D tilt
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    setMousePos({ x, y })
  }
  const handleMouseLeave = () => setMousePos({ x: 0, y: 0 })

  // 3D image rotation calculations (combining scroll + mouse offset)
  const imgRotateX = (1 - p) * 22 - mousePos.y * 5 * (1 - p)
  const imgRotateY = (1 - p) * -10 + mousePos.x * 6 * (1 - p)
  const imgScale   = 0.82 + p * 0.18
  const imgZ       = (1 - p) * -60
  const imgShadowOpacity = 0.35 + p * 0.45

  // Subtle text parallax translation
  const textY1 = (1 - p) * 10
  const textY2 = (1 - p) * 18

  return (
    <div ref={pinRef} id="hero" style={{ height: '220vh' }} className="relative">
      <div
        className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-between grid-bg select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Interactive CursorGrid overlay combined with existing grid-bg */}
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

        {/* Ambient background glows & floating kinetic orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-pink-500/8 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[130px] pointer-events-none" />
        </div>

        {/* Hero image — scroll & mouse driven 3D perspective tilt */}
        <div
          style={{
            perspective: '1300px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 0,
            zIndex: 10,
          }}
        >
          <div
            style={{
              transform: `rotateX(${imgRotateX}deg) rotateY(${imgRotateY}deg) scale(${imgScale}) translateZ(${imgZ}px)`,
              transformOrigin: 'center bottom',
              transition: 'transform 0.1s cubic-bezier(0.1, 0.9, 0.2, 1)',
              width: 'min(840px, 90vw)',
              willChange: 'transform',
            }}
          >
            <div
              className="rounded-t-2xl overflow-hidden border border-b-0 border-white/15 backdrop-blur-sm relative"
              style={{
                boxShadow: `0 -20px 80px -10px rgba(20, 184, 166, ${imgShadowOpacity * 0.3}), 0 30px 100px -20px rgba(0, 0, 0, ${imgShadowOpacity})`,
              }}
            >
              {/* Glossy header bar mock */}
              <div className="h-8 sm:h-9 bg-[#161616]/90 border-b border-white/10 px-3.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-white p-0.5 flex items-center justify-center">
                    <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono text-white/50 tracking-wider">bylance.app // studio workspace</span>
                </div>
                <div className="w-8 sm:w-10" />
              </div>

              {/* Interactive AI Studio Workspace Mockup */}
              <div className="bg-[#09090d] p-4 sm:p-6 text-left border-t border-white/5 font-mono text-xs text-white/80 min-h-[250px] sm:min-h-[290px] flex flex-col justify-between">
                {/* Editor Header Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-white/8 text-[10px] sm:text-[11px]">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded bg-teal-500/10 border border-teal-500/20 text-teal-300 font-semibold">
                      App.tsx
                    </span>
                    <span className="text-white/40 hover:text-white/70 transition-colors cursor-pointer hidden sm:inline">
                      LangGraph.ts
                    </span>
                    <span className="text-white/40 hover:text-white/70 transition-colors cursor-pointer hidden sm:inline">
                      Cloudflare.config
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    <span className="text-teal-400 font-semibold tracking-wide text-[9px] sm:text-[10px]">
                      SYSTEM ACTIVE • 99.9% UPTIME
                    </span>
                  </div>
                </div>

                {/* Simulated Syntax Highlighting & AI Telemetry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 py-3 sm:py-4 items-center">
                  <div className="md:col-span-8 bg-[#0d0d14] p-3 sm:p-4 rounded-xl border border-white/8 space-y-1 sm:space-y-1.5 font-mono text-[10px] sm:text-[11px] leading-relaxed">
                    <div>
                      <span className="text-purple-400 font-semibold">import</span> &#123;{' '}
                      <span className="text-cyan-300">LangGraph</span>, <span className="text-cyan-300">Gemini</span>,{' '}
                      <span className="text-cyan-300">DeepSeek</span> &#125; <span className="text-purple-400">from</span>{' '}
                      <span className="text-emerald-300">'@bylance/ai-engine'</span>
                    </div>
                    <div className="text-white/30">// Initialize multi-agent orchestration for enterprise client</div>
                    <div>
                      <span className="text-purple-400 font-semibold">export const</span>{' '}
                      <span className="text-yellow-300">agentStack</span> = <span className="text-purple-400">new</span>{' '}
                      <span className="text-cyan-300">LangGraph</span>(&#123;
                    </div>
                    <div className="pl-3 sm:pl-4">
                      orchestration: <span className="text-emerald-300">'autonomous-search-validation'</span>,
                    </div>
                    <div className="pl-3 sm:pl-4">
                      llms: [<span className="text-teal-300">Gemini.v1_5</span>, <span className="text-teal-300">DeepSeek.r1</span>],
                    </div>
                    <div className="pl-3 sm:pl-4">
                      edgeHost: <span className="text-emerald-300">'cloudflare-pages'</span>,
                    </div>
                    <div className="pl-3 sm:pl-4">
                      crmIntegration: <span className="text-emerald-300">'interakt-whatsapp'</span>
                    </div>
                    <div>&#125;)</div>
                  </div>

                  <div className="md:col-span-4 flex flex-col gap-2.5">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
                      <div className="text-[9px] sm:text-[10px] text-teal-300 uppercase tracking-widest mb-0.5 font-mono">Edge Latency</div>
                      <div className="text-base sm:text-lg font-bold text-white font-sans">14ms Global SLA</div>
                    </div>
                    <div className="p-2.5 sm:p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                      <div className="text-[9px] sm:text-[10px] text-pink-300 uppercase tracking-widest mb-0.5 font-mono">Agent Validation</div>
                      <div className="text-xs sm:text-sm font-bold text-white font-sans">100% Real-Time</div>
                    </div>
                  </div>
                </div>

                {/* Editor Footer Bar */}
                <div className="pt-2 sm:pt-2.5 border-t border-white/8 flex items-center justify-between text-[9px] sm:text-[10px] text-white/40">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span>UTF-8</span>
                    <span>TypeScript 5.7</span>
                    <span>Cloudflare Edge</span>
                  </div>
                  <div className="text-teal-400 font-semibold">● BYLANCE STUDIO ENGINE</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text — Main Hero Headline & CTAs (100% ratio gets original full text-7xl & max-w-4xl) */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-4xl mx-auto pt-20 sm:pt-24 md:pt-28 min-[1480px]:pt-32 pb-8">
          <div
            style={{
              transform: `translateY(${textY1}px)`,
              transition: 'transform 0.08s ease-out',
            }}
          >
            <h1
              ref={titleContainerRef}
              style={{ fontFamily: 'Roboto Flex, Sora, sans-serif' }}
              className="text-4xl sm:text-5xl md:text-6xl min-[1480px]:text-7xl font-bold leading-[1.1] tracking-tight text-white mb-4 min-[1480px]:mb-5 drop-shadow-md"
            >
              <VariableProximity
                label="We design and ship"
                fromFontVariationSettings="'wght' 400, 'opsz' 12"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                containerRef={titleContainerRef as React.RefObject<HTMLElement | null>}
                radius={180}
                falloff="linear"
              />{' '}
              <span className="bg-gradient-to-r from-teal-300 via-cyan-400 to-pink-400 bg-clip-text text-transparent inline-block">
                <VariableProximity
                  label="production-grade"
                  fromFontVariationSettings="'wght' 500, 'opsz' 12"
                  toFontVariationSettings="'wght' 1000, 'opsz' 40"
                  containerRef={titleContainerRef as React.RefObject<HTMLElement | null>}
                  radius={180}
                  falloff="linear"
                />
              </span>{' '}
              <VariableProximity
                label="software, end to end."
                fromFontVariationSettings="'wght' 400, 'opsz' 12"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                containerRef={titleContainerRef as React.RefObject<HTMLElement | null>}
                radius={180}
                falloff="linear"
              />
            </h1>
          </div>

          {/* Text — Layer 2 (Description & CTAs) */}
          <div
            style={{
              transform: `translateY(${textY2}px)`,
              transition: 'transform 0.08s ease-out',
            }}
            className="flex flex-col items-center gap-5 sm:gap-6"
          >
            <p className="text-white/65 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed font-normal">
              Bylance Technologies partners with ambitious founders and engineering teams to build resilient web, mobile, and cloud products — from initial architecture to scale.
            </p>

            <div className="flex items-center gap-4 flex-wrap justify-center pt-2">
              <SpecularButton
                size="lg"
                radius={9999}
                tint="#ffffff"
                tintOpacity={0.06}
                blur={12}
                textColor="#ffffff"
                lineColor="#14b8a6"
                baseColor="#14b8a6"
                intensity={1.4}
                shineSize={16}
                shineFade={40}
                thickness={1.5}
                speed={0.4}
                followMouse={true}
                proximity={280}
                autoAnimate={false}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Boot a Meet
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </SpecularButton>

              <SpecularButton
                size="lg"
                radius={9999}
                tint="#ffffff"
                tintOpacity={0.02}
                blur={8}
                textColor="#e5e5e5"
                lineColor="#ec4899"
                baseColor="#52525b"
                intensity={1.1}
                shineSize={14}
                shineFade={40}
                thickness={1.2}
                speed={0.3}
                followMouse={true}
                proximity={250}
                autoAnimate={false}
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore services
              </SpecularButton>

              <SpecularButton
                size="lg"
                radius={9999}
                tint="#ffffff"
                tintOpacity={0.02}
                blur={8}
                textColor="#e5e5e5"
                lineColor="#3b82f6"
                baseColor="#52525b"
                intensity={1.1}
                shineSize={14}
                shineFade={40}
                thickness={1.2}
                speed={0.3}
                followMouse={true}
                proximity={250}
                autoAnimate={false}
                onClick={() => document.getElementById('clients')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Our Clients
              </SpecularButton>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2.5 pointer-events-none transition-opacity duration-300"
          style={{ opacity: clamp(1 - progress * 3, 0, 1) }}
        >
          <span className="text-white/40 text-[11px] font-mono tracking-[0.2em] uppercase">Scroll to explore</span>
          <div className="w-[2px] h-10 bg-white/10 rounded-full overflow-hidden relative">
            <div className="w-full h-1/2 bg-gradient-to-b from-teal-400 to-pink-400 rounded-full animate-scroll-line" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Stats ───────────────────────────────────────────────────────────────────

function StatsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref as React.RefObject<Element>)

  const stats = [
    { value: '14-Day', label: 'Rapid MVP Sprints' },
    { value: 'Pixel-Perfect', label: 'High-Fidelity UI/UX' },
    { value: 'End-to-End', label: 'Web, Mobile & Cloud' },
    { value: '24/7', label: 'Smart Automation Workflows' },
  ]

  return (
    <section className="py-20 px-4" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/8 rounded-2xl overflow-hidden border border-white/8">
          {stats.map(({ value, label }, i) => (
            <div
              key={label}
              className={`bg-[#0d0d0d] p-6 sm:p-8 flex flex-col justify-between gap-2 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <span style={{ fontFamily: 'Sora, sans-serif' }} className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">{value}</span>
              <span className="text-white/45 text-xs sm:text-sm font-medium leading-snug">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


// ─── Approach — horizontal 3D flip-in ────────────────────────────────────────

const steps = [
  {
    num: '01',
    title: 'Discover',
    actionLabel: 'Start Discovery',
    shortDesc: 'We pressure-test the idea, map constraints, and align on the smallest version worth building.',
    fullDesc: 'We kick off with a rigorous deep dive into your product requirements, user demographics, and technical constraints. Rather than diving blindly into code, we focus on scoping an elite Minimum Viable Product (MVP). By identifying potential technical roadblocks early, defining core data schemas, and mapping out the user journey, we establish a crystal-clear, risk-mitigated development roadmap before a single line of code is written.',
    color: 'from-teal-400 to-cyan-300',
    accentBorder: 'hover:border-teal-500/40',
    btnClass: 'bg-teal-500/10 border-teal-500/30 text-teal-300 hover:bg-teal-500/20 hover:border-teal-400',
  },
  {
    num: '02',
    title: 'Design',
    actionLabel: 'Start Design',
    shortDesc: 'Interfaces, architecture, and data models take shape as clickable, reviewable artifacts — not guesswork.',
    fullDesc: 'This phase translates abstract requirements into tangible, high-fidelity visuals and structured architecture. We build interactive Figma wireframes and clickable prototypes featuring sleek, modern UI aesthetics. Concurrently, our engineering team designs the underlying database schemas, API routes, and cloud infrastructure layout. You see exactly how the product will look, feel, and function, leaving absolutely zero room for guesswork.',
    color: 'from-pink-400 to-rose-300',
    accentBorder: 'hover:border-pink-500/40',
    btnClass: 'bg-pink-500/10 border-pink-500/30 text-pink-300 hover:bg-pink-500/20 hover:border-pink-400',
  },
  {
    num: '03',
    title: 'Build',
    actionLabel: 'Start Build',
    shortDesc: 'Tight iterations with visible progress. You see working software every week, not just status decks.',
    fullDesc: 'We shift into rapid, iterative development cycles driven by clean engineering practices. Working in tight weekly sprints, we turn the approved blueprints into high-performance web platforms or cross-platform mobile apps. You receive direct access to a staging environment with fully functioning software updates every single week—letting you touch, test, and critique the progress in real time instead of reading static status reports.',
    color: 'from-violet-400 to-purple-300',
    accentBorder: 'hover:border-violet-500/40',
    btnClass: 'bg-violet-500/10 border-violet-500/30 text-violet-300 hover:bg-violet-500/20 hover:border-violet-400',
  },
  {
    num: '04',
    title: 'Ship & Scale',
    actionLabel: 'Start Shipping',
    shortDesc: 'We launch, instrument, and keep improving — handing over a codebase your team can actually own.',
    fullDesc: 'Launch day is just the beginning. We manage the entire deployment pipeline, configuring your domain routing, optimizing cloud hosting environments, and setting up automated production monitors. Once live, we hand over a completely documented, highly modular codebase. We stay close to analyze real-world performance metrics, refine features based on actual user feedback, and ensure your system seamlessly scales as your client base explodes.',
    color: 'from-amber-400 to-orange-300',
    accentBorder: 'hover:border-amber-500/40',
    btnClass: 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400',
  },
]

function ApproachCard({
  num,
  title,
  actionLabel,
  shortDesc,
  fullDesc,
  color,
  accentBorder,
  btnClass,
  i,
  inView,
}: {
  num: string
  title: string
  actionLabel: string
  shortDesc: string
  fullDesc: string
  color: string
  accentBorder: string
  btnClass: string
  i: number
  inView: boolean
}) {
  return (
    <div
      className="transition-all duration-700 h-full flex flex-col"
      style={{
        transitionDelay: `${i * 90}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
      }}
    >
      <TiltedCard
        captionText={`Phase ${num} — ${title}`}
        containerHeight="100%"
        containerWidth="100%"
        imageHeight="100%"
        imageWidth="100%"
        rotateAmplitude={10}
        scaleOnHover={1.02}
        showMobileWarning={false}
        showTooltip={false}
        displayOverlayContent={true}
        overlayContent={
          <div className={`p-6 rounded-2xl bg-[#111]/95 backdrop-blur-md border border-white/10 ${accentBorder} transition-all duration-300 h-full flex flex-col justify-between shadow-2xl`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent block`}
                >
                  {num}
                </span>
                <span className="text-xs font-mono text-white/30">Phase {i + 1} of 4</span>
              </div>

              <h3 style={{ fontFamily: 'Sora, sans-serif' }} className="text-white font-semibold text-xl mb-3">
                {title}
              </h3>

              <p className="text-white/80 text-sm leading-relaxed mb-4 font-medium">
                {shortDesc}
              </p>

              {/* Full Deep Dive Paragraph - Displayed by default */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-white/55 text-xs sm:text-sm leading-relaxed font-normal">
                  {fullDesc}
                </p>
              </div>
            </div>

            {/* Action Button Redirecting to Contact Section */}
            <div className="mt-6 pt-4 border-t border-white/8">
              <button
                type="button"
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`w-full py-3 px-4 rounded-xl border ${btnClass} font-semibold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg`}
              >
                {actionLabel}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        }
      />
    </div>
  )
}

function ApproachSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref as React.RefObject<Element>)

  return (
    <section id="approach" className="py-28 px-4" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div
          className="mb-14 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(32px)' }}
        >
          <p className="text-pink-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">// How we work</p>
          <h2 style={{ fontFamily: 'Sora, sans-serif' }} className="text-4xl md:text-5xl font-bold text-white max-w-xl leading-tight">
            A predictable path from idea to launch
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {steps.map((step, i) => (
            <ApproachCard key={step.num} {...step} i={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Manifesto — staggered row reveal ────────────────────────────────────────

const principles = [
  { ch: 'Ch. 01', title: 'Ship real software', body: 'Demos are cheap. We measure ourselves by production systems that hold up under real users, real load, and real edge cases.' },
  { ch: 'Ch. 02', title: 'Own the outcome', body: 'We think like partners, not contractors. That means telling you the hard truths early and optimizing for your product, not our invoice.' },
  { ch: 'Ch. 03', title: 'Leave it better', body: 'Every engagement ends with documentation, tests, and a clean codebase — so your team inherits momentum, not debt.' },
]

function ManifestoRow({ ch, title, body, i }: { ch: string; title: string; body: string; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<Element>)
  return (
    <div
      ref={ref}
      className={`p-8 flex flex-col md:flex-row md:items-start gap-6 transition-all duration-700 ${i < principles.length - 1 ? 'border-b border-white/8' : ''}`}
      style={{
        transitionDelay: `${i * 80}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateX(0) rotateY(0deg)' : 'translateX(-32px) rotateY(6deg)',
        perspective: '900px',
        transformOrigin: 'left center',
      }}
    >
      <div className="md:w-52 flex-shrink-0">
        <p style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-white/30 text-xs mb-2">{ch}</p>
        <h3 style={{ fontFamily: 'Sora, sans-serif' }} className="text-white font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-white/50 text-base leading-relaxed md:pt-6">{body}</p>
    </div>
  )
}

function ManifestoSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref as React.RefObject<Element>)

  return (
    <section id="manifesto" className="py-28 px-4 grid-bg relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none z-0">
        <CursorGrid
          cellSize={48}
          color="#ec4899"
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
        <p className="text-pink-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">// Manifesto</p>
        <h2
          className="text-4xl md:text-5xl font-bold text-white mb-14 max-w-xl leading-tight transition-all duration-700"
          style={{ fontFamily: 'Sora, sans-serif', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          The principles behind every build
        </h2>
        <BorderGlow
          edgeSensitivity={45}
          glowColor="320 70 60"
          backgroundColor="#0e0e12"
          borderRadius={24}
          glowRadius={20}
          glowIntensity={0.35}
          fillOpacity={0.12}
          coneSpread={20}
          animated={false}
          colors={['#ec4899', '#a855f7', '#14b8a6']}
        >
          {principles.map((p, i) => <ManifestoRow key={p.ch} {...p} i={i} />)}
        </BorderGlow>
      </div>
    </section>
  )
}


// ─── Contact ─────────────────────────────────────────────────────────────────

function ContactSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref as React.RefObject<Element>)
  const [form, setForm] = useState({ name: '', email: '', projectType: '', details: '', company: '', description: '' })
  const [sent, setSent] = useState(false)

  const inputClass = "w-full px-4 py-3 rounded-xl bg-[#111] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-teal-500/50 transition-colors"
  const labelClass = "block text-white/60 text-xs font-medium mb-1.5"

  const handleValidateStep = (step: number) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (step === 1) {
      return form.name.trim().length > 0 && emailRegex.test(form.email.trim())
    }
    if (step === 2) {
      return form.projectType.trim().length > 0 && form.details.trim().length > 0
    }
    if (step === 3) {
      return form.company.trim().length > 0
    }
    return true
  }

  return (
    <section id="contact" className="py-28 px-4 grid-bg relative overflow-hidden" ref={ref}>
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
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start relative z-10">
        <div
          className="transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0) rotateY(0deg)' : 'translateX(-40px) rotateY(8deg)', perspective: '1000px', transformOrigin: 'left center' }}
        >
          <p className="text-teal-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">// Contact</p>
          <h2 style={{ fontFamily: 'Sora, sans-serif' }} className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Tell us what you're building
          </h2>
          <p className="text-white/45 text-base leading-relaxed mb-10">
            Share a few details and we'll reply within one business day with next steps — no sales runaround.
          </p>
          <div className="flex items-center gap-4 p-4 rounded-xl border border-white/8 bg-[#0f0f0f]">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 flex-shrink-0">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div>
              <p className="text-white/30 text-xs uppercase tracking-wider mb-0.5">Email us</p>
              <p className="text-white/80 text-sm">bylancetechnologies@gmail.com</p>
            </div>
          </div>
        </div>

        <div
          className="transition-all duration-700"
          style={{ transitionDelay: '120ms', opacity: inView ? 1 : 0, transform: inView ? 'translateX(0) rotateY(0deg)' : 'translateX(40px) rotateY(-8deg)', perspective: '1000px', transformOrigin: 'right center' }}
        >
          {sent ? (
            <div className="p-8 rounded-2xl border border-white/10 bg-[#0f0f0f] flex flex-col items-center justify-center h-80 text-center shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 style={{ fontFamily: 'Sora, sans-serif' }} className="text-white font-semibold text-xl mb-2">Project Brief Received!</h3>
              <p className="text-white/45 text-sm max-w-sm">We'll analyze your requirements and get back to you within one business day.</p>
            </div>
          ) : (
            <Stepper
              initialStep={1}
              accentColor="#14b8a6"
              onValidateStep={handleValidateStep}
              onFinalStepCompleted={() => setSent(true)}
              backButtonText="Back"
              nextButtonText="Next Step"
            >
              <Step>
                <div className="mb-2">
                  <h3 style={{ fontFamily: 'Sora, sans-serif' }} className="text-xl font-semibold text-white mb-1">Contact Information</h3>
                  <p className="text-white/45 text-xs">Who should we contact regarding this project?</p>
                </div>
                <div className="flex flex-col gap-3.5 mt-4">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input className={inputClass} placeholder="Jane Doe" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelClass}>Work Email *</label>
                    <input className={inputClass} type="email" placeholder="name@company.com" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>
              </Step>

              <Step>
                <div className="mb-2">
                  <h3 style={{ fontFamily: 'Sora, sans-serif' }} className="text-xl font-semibold text-white mb-1">Project Details</h3>
                  <p className="text-white/45 text-xs">Tell us about the project type and key requirements.</p>
                </div>
                <div className="flex flex-col gap-3.5 mt-4">
                  <div>
                    <label className={labelClass}>Project Type *</label>
                    <input
                      className={inputClass}
                      placeholder="e.g. AI Web App, Mobile App, Cloud Infrastructure"
                      required
                      value={form.projectType}
                      onChange={e => setForm(f => ({ ...f, projectType: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Project Details & Scope *</label>
                    <textarea
                      className={inputClass + ' resize-none h-24'}
                      placeholder="What are you building, and what does success look like?"
                      required
                      value={form.details}
                      onChange={e => setForm(f => ({ ...f, details: e.target.value }))}
                    />
                  </div>
                </div>
              </Step>

              <Step>
                <div className="mb-2">
                  <h3 style={{ fontFamily: 'Sora, sans-serif' }} className="text-xl font-semibold text-white mb-1">Company Details</h3>
                  <p className="text-white/45 text-xs">Tell us about your organization and team.</p>
                </div>
                <div className="flex flex-col gap-3.5 mt-4">
                  <div>
                    <label className={labelClass}>Company / Organization *</label>
                    <input
                      className={inputClass}
                      placeholder="e.g. Acme Corp"
                      required
                      value={form.company}
                      onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      className={inputClass + ' resize-none h-20'}
                      placeholder="Brief description of your company or product focus..."
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    />
                  </div>
                </div>
              </Step>
            </Stepper>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/8 py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white p-0.5 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                <img src={logoImg} alt="Bylance Technologies Logo" className="w-full h-full object-contain rounded-md" />
              </div>
              <span style={{ fontFamily: 'Sora, sans-serif' }} className="text-white font-semibold text-sm">Bylance Technologies</span>
            </div>
            <p className="text-white/35 text-sm leading-relaxed max-w-xs">An AI-native software studio building production-grade web, mobile, and cloud products.</p>
          </div>

          <div>
            <p className="text-white/25 text-xs uppercase tracking-widest mb-4">Company</p>
            <ul className="flex flex-col gap-2.5">
              {['Services', 'Approach', 'Manifesto'].map(link => (
                <li key={link}><a href={`#${link.toLowerCase()}`} className="text-white/50 hover:text-white text-sm transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white/25 text-xs uppercase tracking-widest mb-4">Explore</p>
            <ul className="flex flex-col gap-2.5">
              {[['Contact', '#contact']].map(([label, href]) => (
                <li key={label}><a href={href} className="text-white/50 hover:text-white text-sm transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white/25 text-xs uppercase tracking-widest mb-4">Get in touch</p>
            <a href="mailto:bylancetechnologies@gmail.com" className="text-white/50 hover:text-white text-sm transition-colors break-all">bylancetechnologies@gmail.com</a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/8">
          <p className="text-white/25 text-xs">© 2026 Bylance Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/30 hover:text-white transition-colors">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
            <a href="#" className="text-white/30 hover:text-white transition-colors">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="https://github.com/nezfn" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors" title="GitHub: nezfn">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function useAtBottom(threshold = 280) {
  const [atBottom, setAtBottom] = useState(false)
  useEffect(() => {
    const handler = () => {
      const scrollPosition = window.innerHeight + window.scrollY
      const pageHeight = document.documentElement.scrollHeight
      setAtBottom(pageHeight - scrollPosition <= threshold)
    }
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [threshold])
  return atBottom
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const atBottom = useAtBottom(300)

  return (
    <ClickSpark
      sparkColor="#14b8a6"
      sparkSize={12}
      sparkRadius={25}
      sparkCount={10}
      duration={500}
    >
      <div className="bg-[#080808] text-white min-h-screen relative">
        <Navbar />
        <Hero />
        <StatsSection />
        <ServicesSection />
        <ClientsSection />
        <ApproachSection />
        <ManifestoSection />
        <ContactSection />
        <Footer />
        <div className={`hidden md:block transition-opacity duration-500 ${atBottom ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <GradualBlur
            target="page"
            position="bottom"
            height="4.5rem"
            curve="bezier"
            strength={3}
            divCount={8}
            exponential={true}
            opacity={1}
            zIndex={99}
          />
        </div>
      </div>
    </ClickSpark>
  )
}


