import React from 'react';
import { Zap, Globe, Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Nexus<span className="text-indigo-400">Events</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              The premier platform for discovering world-class trade shows, developer summits, and industrial expos worldwide.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <span>© {new Date().getFullYear()} NexusEvents Inc.</span>
              <span>•</span>
              <span>All rights reserved.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition-colors">
                  Discover Summits
                </Link>
              </li>
              <li>
                <a href="#categories-section" className="hover:text-cyan-400 transition-colors">
                  Popular Categories
                </a>
              </li>
              <li>
                <Link to="/admin" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Top Industries</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Artificial Intelligence</li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Financial Technology</li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Clean Energy & Mobility</li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Cybersecurity</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>Designed with React, Vite, Tailwind CSS, Sequelize & PostgreSQL.</p>
          <div className="flex items-center gap-2">
            <span>Global Event Infrastructure</span>
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
