import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Sparkles } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/ai-tools', label: 'AI Tools' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-2 rounded-xl bg-[radial-gradient(circle,rgba(198,255,63,0.25)_0%,transparent_60%)] blur"></div>
            <Sparkles className="relative size-8 text-[#C6FF3F] drop-shadow-[0_0_12px_rgba(198,255,63,0.75)]" />
          </div>
          <span className="text-lg font-semibold tracking-wide text-white group-hover:text-[#C6FF3F] transition">KNPRR AGROVERSE</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `text-sm uppercase tracking-wider transition ${isActive ? 'text-[#C6FF3F]' : 'text-zinc-300 hover:text-white'}`}
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/vendor-login" className="px-4 py-2 rounded-full bg-[#C6FF3F] text-black font-semibold shadow-[0_0_20px_#C6FF3F] hover:shadow-[0_0_30px_#C6FF3F] transition">Vendor Login</Link>
        </div>

        <button className="lg:hidden text-white" onClick={() => setOpen(!open)} aria-label="Toggle Menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-black/80 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6 grid gap-4">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className="text-zinc-200 text-sm">
                {item.label}
              </NavLink>
            ))}
            <Link to="/vendor-login" onClick={() => setOpen(false)} className="px-4 py-2 rounded-full text-center bg-[#C6FF3F] text-black font-semibold shadow-[0_0_20px_#C6FF3F]">Vendor Login</Link>
          </div>
        </div>
      )}
    </header>
  )
}
