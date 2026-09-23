import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  X,
  Sparkles,
  MapPin,
  Tag,
  RotateCcw,
  SearchX,
  AlertCircle,
  Layers,
  Flame,
  Globe2,
} from 'lucide-react';
import { fetchEvents } from '../services/api';
import EventCard from '../components/EventCard';

const CATEGORIES = ['All', 'Conference', 'Expo', 'Summit', 'Trade Show'];

const POPULAR_CITIES = [
  'All',
  'San Francisco',
  'London',
  'Boston',
  'Berlin',
  'Singapore',
  'Tokyo',
];

const SkeletonCard = () => (
  <div className="rounded-3xl overflow-hidden glass-card bg-slate-900/40 border border-white/[0.06] flex flex-col h-[470px] animate-pulse">
    {/* Image skeleton */}
    <div className="h-56 w-full skeleton-shimmer bg-slate-800" />

    {/* Content skeleton */}
    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="h-3.5 w-28 rounded-lg bg-slate-800 skeleton-shimmer" />
        <div className="h-6 w-full rounded-lg bg-slate-800 skeleton-shimmer" />
        <div className="h-4 w-4/5 rounded-lg bg-slate-800/70 skeleton-shimmer" />
        <div className="h-4 w-3/5 rounded-lg bg-slate-800/50 skeleton-shimmer" />
      </div>

      <div className="space-y-2 pt-3 border-t border-slate-800/60">
        <div className="h-3.5 w-44 rounded bg-slate-800/70 skeleton-shimmer" />
        <div className="h-3.5 w-36 rounded bg-slate-800/50 skeleton-shimmer" />
        <div className="h-11 w-full rounded-2xl bg-slate-800 skeleton-shimmer mt-2" />
      </div>
    </div>
  </div>
);

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Load events from API
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedCity !== 'All') params.city = selectedCity;
      if (selectedStatus !== 'All') params.status = selectedStatus;

      const response = await fetchEvents(params);
      if (response && response.success) {
        setEvents(response.data || []);
      } else {
        setEvents(response.data || []);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
      setError(
        err.response?.data?.message ||
          'Unable to connect to backend server. Make sure the Node.js backend is running on port 5000.'
      );
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedCity, selectedStatus]);

  // Real-time debounce effect for live search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedCity('All');
    setSelectedStatus('All');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedCity !== 'All' ||
    selectedStatus !== 'All';

  return (
    <div className="min-h-screen bg-slate-975 text-slate-100 pb-24 mesh-gradient-bg">
      {/* HERO SECTION WITH RADIAL MESH GRADIENT */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden mesh-gradient-hero">
        {/* Ambient background glow orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[350px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 mb-6 shadow-ambient">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Discover Top-Tier Global Tech Expos & Summits</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Where Global Innovators Gather & Lead
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Explore industry-shaping trade shows, developer summits, and technology conferences across San Francisco, London, Berlin, Singapore, and beyond.
          </p>

          {/* Unified Floating Search Bar */}
          <div className="max-w-2xl mx-auto relative flex items-center shadow-2xl shadow-indigo-950/60 rounded-3xl glass-panel p-2.5 border border-white/10 group focus-within:border-indigo-500 focus-within:shadow-glow-indigo transition-all duration-300">
            <div className="pl-4 pr-2 text-slate-400">
              <Search className="w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by event name, city, venue, or industry..."
              className="w-full bg-transparent text-white placeholder-slate-500 px-2 py-2.5 text-sm sm:text-base focus:outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setSearchQuery(searchInput)}
              className="ml-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 transition-all shadow-md shadow-indigo-600/30 flex-shrink-0 cursor-pointer"
            >
              Search
            </button>
          </div>

          {/* Trending Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-xs text-slate-400">
            <span className="font-semibold text-slate-500 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Popular:
            </span>
            {['Artificial Intelligence', 'FinTech', 'Clean Energy', 'San Francisco', 'London', 'Tokyo'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchInput(tag)}
                className="px-3.5 py-1 rounded-full bg-slate-900/80 hover:bg-indigo-600/20 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* DISCOVERY & FILTERING SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="categories-section">
        {/* Filter Controls Bar */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/[0.08] mb-10 shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mr-1">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                Category:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500/50'
                      : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* City & Status Dropdowns */}
            <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto">
              {/* City Filter */}
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl px-3.5 py-2 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400 font-medium">City:</span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                >
                  {POPULAR_CITIES.map((city) => (
                    <option key={city} value={city} className="bg-slate-900 text-white">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl px-3.5 py-2 text-xs text-slate-300">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-slate-400 font-medium">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-slate-900 text-white">All Statuses</option>
                  <option value="UPCOMING" className="bg-slate-900 text-white">Upcoming</option>
                  <option value="ONGOING" className="bg-slate-900 text-white">Live / Ongoing</option>
                  <option value="COMPLETED" className="bg-slate-900 text-white">Completed</option>
                </select>
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all cursor-pointer"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Tag Bar */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex-wrap">
              <span className="font-semibold text-slate-300">Active Filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Category: {selectedCategory}
                </span>
              )}
              {selectedCity !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  City: {selectedCity}
                </span>
              )}
              {selectedStatus !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Status: {selectedStatus}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Global Summits'}
            </h2>
            {!loading && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-cyan-400 border border-slate-800">
                {events.length} {events.length === 1 ? 'event' : 'events'}
              </span>
            )}
          </div>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-4 mb-8">
            <AlertCircle className="w-6 h-6 flex-shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-base font-bold text-rose-200 mb-1">Backend Connection Error</h4>
              <p className="text-sm text-rose-300/90 leading-relaxed mb-3">{error}</p>
              <button
                onClick={loadEvents}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow"
              >
                Retry Request
              </button>
            </div>
          </div>
        )}

        {/* SKELETON LOADING STATE (6 Cards) */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-20 px-6 glass-panel rounded-3xl border border-white/[0.08] max-w-xl mx-auto my-6 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-cyan-400 shadow-inner">
              <SearchX className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-2 tracking-tight">No Events Found</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto leading-relaxed">
              We couldn't find any events matching your search terms or active filters. Try broadening your criteria.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All Filters
            </button>
          </div>
        )}

        {/* EVENT CARDS GRID */}
        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>

      {/* PLATFORM VALUE PROPOSITION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28" id="about-section">
        <div className="glass-panel p-8 sm:p-14 rounded-3xl border border-white/[0.08] relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 block flex items-center gap-1.5">
              <Globe2 className="w-4 h-4" /> About NexusEvents Discovery
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Curating High-Impact Tech Summits Worldwide
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-6 font-normal">
              NexusEvents brings together leading innovators, researchers, executives, and developers across AI, FinTech, Clean Energy, and Cyber Defense. Explore real-time schedules, verified venues, and register directly with organizers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
