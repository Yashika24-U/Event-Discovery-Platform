import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Shield, Menu, X, Sparkles, Zap } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav shadow-lg shadow-black/20' : 'bg-slate-975/60 backdrop-blur-md border-b border-white/[0.05]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Nexus<span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">Events</span>
                </span>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" /> LIVE
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:block">Global Tech & Industry Summits</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200 ${
                isActive('/')
                  ? 'text-indigo-400 drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4 text-indigo-400" />
              Discover Events
            </Link>

            <a
              href="#categories-section"
              className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors duration-200"
            >
              Categories
            </a>

            <a
              href="#about-section"
              className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors duration-200"
            >
              About Platform
            </a>
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/admin"
              className="relative group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white overflow-hidden shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 transition-all duration-300 group-hover:opacity-95" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Content */}
              <Shield className="w-4 h-4 relative z-10 text-cyan-200 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10 tracking-wide">Admin Portal</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                isActive('/')
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4 text-indigo-400" />
              Discover Events
            </Link>

            <a
              href="#categories-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              Categories
            </a>

            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 mt-4 px-4 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 shadow-md shadow-indigo-500/20"
            >
              <Shield className="w-4 h-4" />
              Admin Portal
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
