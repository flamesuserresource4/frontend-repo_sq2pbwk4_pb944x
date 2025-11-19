import { motion } from 'framer-motion'
import { Sparkles, Tractor, Satellite, ShoppingCart, Shield, Cpu, Boxes, Cloud, Workflow, LineChart, Handshake, MapPin, Truck, Database, BadgePercent } from 'lucide-react'

const Section = ({ id, title, subtitle, children }) => (
  <section id={id} className="relative py-24 bg-[#0A0A0A] overflow-hidden">
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(600px_300px_at_50%_0%,rgba(198,255,63,0.06),transparent)]" />
    <div className="max-w-7xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-14">
        <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="mt-4 text-zinc-300 max-w-3xl mx-auto">{subtitle}</p>}
      </motion.div>
      {children}
    </div>
  </section>
)

export function AboutSection() {
  const items = [
    { icon: <Cpu className="text-[#C6FF3F]" />, title: 'AI-Driven', desc: 'Real-time intelligence for crops, markets, and logistics.' },
    { icon: <Satellite className="text-[#C6FF3F]" />, title: 'Satellite + IoT', desc: 'Sensors and imagery to power precision agriculture.' },
    { icon: <Handshake className="text-[#C6FF3F]" />, title: 'Ecosystem First', desc: 'Farmers, vendors, buyers, finance—connected seamlessly.' },
  ]
  return (
    <Section id="about" title="About KNPRR AGROVERSE" subtitle="A next-gen AgroTech ecosystem merging AI, marketplace dynamics, and on-ground logistics to empower every stakeholder.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition overflow-hidden">
            <div className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(400px_200px_at_0%_0%,rgba(198,255,63,0.15),transparent)]" />
            <div className="relative z-10">
              <div className="size-12 rounded-xl bg-[#C6FF3F]/10 flex items-center justify-center mb-4">{card.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{card.title}</h3>
              <p className="text-zinc-300 text-sm">{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

export function EcosystemMap() {
  const nodes = [
    { label: 'Farmers', icon: <Tractor size={18} /> },
    { label: 'Agro-shops', icon: <ShoppingCart size={18} /> },
    { label: 'Buyers', icon: <Boxes size={18} /> },
    { label: 'Logistics', icon: <Truck size={18} /> },
    { label: 'Sensors', icon: <Database size={18} /> },
  ]
  return (
    <Section id="ecosystem" title="AgroVerse Ecosystem" subtitle="An interactive network of stakeholders connected by intelligence and speed.">
      <div className="relative aspect-[16/9] rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(800px_400px_at_60%_0%,#C6FF3F,transparent)]" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="relative size-[520px] max-w-full">
            <div className="absolute inset-0 rounded-full border border-[#C6FF3F]/30 animate-pulse"></div>
            <div className="absolute inset-8 rounded-full border border-[#C6FF3F]/20"></div>
            <div className="absolute inset-16 rounded-full border border-[#C6FF3F]/10"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-4 py-2 rounded-full text-black bg-[#C6FF3F] font-semibold shadow-[0_0_25px_#C6FF3F]">AGROVERSE CORE</div>
            </div>
            {nodes.map((n, i) => (
              <motion.div key={n.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-white text-sm border border-white/10 hover:border-[#C6FF3F]/50`}
                style={{ left: [50, 85, 15, 80, 20][i] + '%', top: [5, 35, 65, 80, 20][i] + '%' }}>
                <span className="inline-flex items-center gap-2">{n.icon}{n.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

export function ProductsServices() {
  const cards = [
    { title: 'AI Crop Advisory', icon: <Cpu /> },
    { title: 'Fertilizer Marketplace', icon: <ShoppingCart /> },
    { title: 'Vendor Network', icon: <Workflow /> },
    { title: 'Smart Sensors', icon: <Satellite /> },
    { title: 'Cold Storage Integration', icon: <Cloud /> },
    { title: 'Livestock & Equipment', icon: <Boxes /> },
    { title: 'Loans & Insurance', icon: <Shield /> },
    { title: 'Demand Analysis', icon: <LineChart /> },
  ]

  return (
    <Section id="services" title="Products & Services" subtitle="Designed to scale with farmers, vendors, and enterprise buyers.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="group perspective">
            <div className="relative h-48 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 overflow-hidden shadow-xl">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(400px_200px_at_100%_0%,rgba(198,255,63,0.15),transparent)]" />
              <div className="absolute -inset-1 bg-gradient-to-br from-[#C6FF3F]/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition" />
              <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                <div className="size-10 rounded-lg bg-[#C6FF3F]/10 text-[#C6FF3F] flex items-center justify-center">{c.icon}</div>
                <div className="text-white font-semibold">{c.title}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

export function PowerSection() {
  const stats = [
    { value: '70%', label: 'Lower procurement cost' },
    { value: 'X2', label: 'Faster delivery network' },
    { value: 'AI', label: 'Demand analysis engine' },
    { value: 'Pan-India', label: 'Vendor ecosystem' },
  ]
  return (
    <Section id="why" title="Why KNPRR AGROVERSE" subtitle="Engineered for scale, speed, and intelligence.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
            <div className="absolute -inset-1 opacity-50 bg-[conic-gradient(from_90deg_at_50%_50%,transparent,rgba(198,255,63,0.08),transparent)]" />
            <div className="relative z-10">
              <div className="text-4xl font-extrabold text-white">{s.value}</div>
              <div className="text-zinc-300 mt-2">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

export function CTAJoin() {
  return (
    <Section id="join" title="Join the AgroVerse" subtitle="Be a part of the future-ready agriculture network.">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="#" className="px-8 py-4 rounded-full bg-[#C6FF3F] text-black font-semibold shadow-[0_0_30px_#C6FF3F] hover:shadow-[0_0_45px_#C6FF3F] transition">Get Started</a>
        <a href="#" className="px-8 py-4 rounded-full border border-white/20 text-white hover:border-white/40 transition backdrop-blur-md">Talk to Sales</a>
      </div>
    </Section>
  )
}
