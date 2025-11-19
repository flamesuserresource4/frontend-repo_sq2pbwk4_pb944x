import { motion } from 'framer-motion'
import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/80 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-40 pb-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white"
        >
          Revolutionizing Agriculture with Intelligence & Innovation
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mt-6 text-lg sm:text-2xl text-zinc-300 max-w-3xl mx-auto"
        >
          Empower farmers. Transform ecosystems. Build the future of AgroTech.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="#ecosystem" className="px-6 py-3 rounded-full bg-[#C6FF3F] text-black font-semibold shadow-[0_0_25px_#C6FF3F] hover:shadow-[0_0_40px_#C6FF3F] transition">
            Explore Platform
          </a>
          <a href="#join" className="px-6 py-3 rounded-full border border-white/20 text-white hover:border-white/40 transition backdrop-blur-md">
            Join as Vendor
          </a>
        </motion.div>
      </div>

      {/* Neon edges */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C6FF3F] to-transparent opacity-60"></div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#C6FF3F]/60 to-transparent opacity-40"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#C6FF3F]/60 to-transparent opacity-40"></div>
    </section>
  )
}
