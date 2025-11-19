import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { AboutSection, EcosystemMap, ProductsServices, PowerSection, CTAJoin } from './components/Sections'

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <Hero />
      <AboutSection />
      <EcosystemMap />
      <ProductsServices />
      <PowerSection />
      <CTAJoin />
      <footer className="border-t border-white/10 py-10 text-center text-zinc-400">
        © {new Date().getFullYear()} KNPRR AGROVERSE · All Rights Reserved
      </footer>
    </div>
  )
}

export default App
