import { useRef, useState, useEffect } from 'react'

export interface ClientItem {
  id: string
  name: string
  category: string
  logoText: string
  description: string
  metric: string
  metricLabel: string
  accentColor: string
}

const defaultClients: ClientItem[] = [
  {
    id: '1',
    name: 'Nexus AI Systems',
    category: 'Artificial Intelligence',
    logoText: 'NEXUS',
    description: 'Engineered a real-time copilot interface with sub-50ms streaming latency and scalable multi-tenant architecture.',
    metric: '10x',
    metricLabel: 'Faster Data Analysis',
    accentColor: '#14b8a6', // Teal
  },
  {
    id: '2',
    name: 'FinFlow Global',
    category: 'FinTech & Payments',
    logoText: 'FINFLOW',
    description: 'Rebuilt high-frequency trade processing infrastructure with bulletproof security and instant ledger synchronization.',
    metric: '$4.2M+',
    metricLabel: 'Daily Transaction Volume',
    accentColor: '#3b82f6', // Blue
  },
  {
    id: '3',
    name: 'Pulse Health Cloud',
    category: 'HealthTech & Compliance',
    logoText: 'PULSE',
    description: 'Designed HIPAA-compliant telemedicine platform with seamless web & mobile experiences for providers.',
    metric: '500K+',
    metricLabel: 'Active Patients Served',
    accentColor: '#ec4899', // Pink
  },
  {
    id: '4',
    name: 'Veloce Logistics',
    category: 'SaaS & Enterprise',
    logoText: 'VELOCE',
    description: 'Automated fleet dispatch routing and analytics dashboard handling millions of live telemetry pings.',
    metric: '99.99%',
    metricLabel: 'Uptime SLA Delivered',
    accentColor: '#a855f7', // Purple
  },
]

const partnerLogos = [
  'NEXUS AI',
  'FINFLOW',
  'PULSE',
  'VELOCE',
  'APEX DATA',
  'HYPERION',
]

export default function ClientsSection() {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('All')

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

  const categories = ['All', 'Artificial Intelligence', 'FinTech & Payments', 'HealthTech & Compliance', 'SaaS & Enterprise']

  const filteredClients = activeTab === 'All'
    ? defaultClients
    : defaultClients.filter(c => c.category === activeTab)

  return (
    <section id="clients" ref={ref} className="py-28 px-6 sm:px-10 relative overflow-hidden bg-[#080808]">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-teal-500/10 via-blue-500/5 to-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className={`flex flex-col items-center text-center gap-4 max-w-2xl mx-auto mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/20 bg-teal-500/10 text-teal-400 text-xs font-mono tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Our Clients & Partners
          </div>

          <h2 style={{ fontFamily: 'Sora, sans-serif' }} className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Trusted by visionary teams building the future
          </h2>

          <p className="text-white/60 text-base sm:text-lg leading-relaxed">
            We partner with ambitious founders, high-growth startups, and tech leaders to ship high-impact digital products.
          </p>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === category
                    ? 'bg-white text-black font-semibold shadow-md shadow-white/10'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Client Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClients.map((client, index) => (
            <div
              key={client.id}
              className={`group relative rounded-2xl bg-[#0d0d0d] border border-white/8 p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-500 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              {/* Card Top: Logo Tag & Category */}
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs tracking-wider border"
                      style={{
                        backgroundColor: `${client.accentColor}12`,
                        borderColor: `${client.accentColor}30`,
                        color: client.accentColor,
                      }}
                    >
                      {client.logoText.slice(0, 3)}
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'Sora, sans-serif' }} className="text-lg font-semibold text-white group-hover:text-teal-300 transition-colors">
                        {client.name}
                      </h3>
                      <span className="text-white/40 text-xs">{client.category}</span>
                    </div>
                  </div>

                  <span
                    className="text-xs px-2.5 py-1 rounded-md border font-mono"
                    style={{
                      borderColor: `${client.accentColor}25`,
                      color: client.accentColor,
                      backgroundColor: `${client.accentColor}08`,
                    }}
                  >
                    {client.category.split(' ')[0]}
                  </span>
                </div>

                <p className="text-white/70 text-sm leading-relaxed mb-8">
                  {client.description}
                </p>
              </div>

              {/* Card Bottom: Key Metric Result */}
              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div style={{ fontFamily: 'Sora, sans-serif' }} className="text-2xl font-bold text-white tracking-tight">
                    {client.metric}
                  </div>
                  <div className="text-white/40 text-xs">{client.metricLabel}</div>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:bg-white/10 group-hover:border-white/25 transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Partner Logos Strip */}
        <div className={`mt-16 pt-12 border-t border-white/5 transition-all duration-700 delay-300 ${inView ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-center text-white/40 text-xs font-mono uppercase tracking-[0.2em] mb-8">
            Powering Next-Gen Products Across Tech
          </p>

          <div className="flex items-center justify-center gap-8 sm:gap-14 flex-wrap opacity-60 hover:opacity-100 transition-opacity">
            {partnerLogos.map((logo, idx) => (
              <div
                key={idx}
                style={{ fontFamily: 'Sora, sans-serif' }}
                className="text-white/40 font-bold text-sm sm:text-base tracking-widest hover:text-white transition-colors cursor-default"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
