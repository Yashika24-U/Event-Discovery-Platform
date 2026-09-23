import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Building,
  ArrowLeft,
  Share2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle,
  Clock,
  Ticket,
  Users,
  Check,
  X,
} from 'lucide-react';
import { fetchEventById } from '../services/api';
import { formatDateRange } from '../components/EventCard';

const statusConfig = {
  ONGOING: {
    label: 'Live Now',
    bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
    dot: 'bg-emerald-400 animate-ping',
  },
  UPCOMING: {
    label: 'Upcoming Event',
    bg: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300',
    dot: 'bg-indigo-400',
  },
  COMPLETED: {
    label: 'Event Completed',
    bg: 'bg-slate-500/15 border-slate-500/30 text-slate-400',
    dot: 'bg-slate-400',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
    dot: 'bg-rose-400',
  },
};

const formatFullDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchEventById(id);
        if (res && res.success) {
          setEvent(res.data);
        } else {
          setEvent(res.data);
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError(
          err.response?.data?.message ||
            'Unable to fetch event details. The event might have been removed or the ID is invalid.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadEvent();
    }
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConfirmRegistration = (e) => {
    e.preventDefault();
    setIsRegistered(true);
    setShowRegModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-975 text-slate-100 pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
          <div className="h-6 w-36 rounded-lg bg-slate-800 skeleton-shimmer" />
          <div className="h-[420px] w-full rounded-3xl bg-slate-800 skeleton-shimmer" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-44 rounded-3xl bg-slate-800 skeleton-shimmer" />
              <div className="h-44 rounded-3xl bg-slate-800 skeleton-shimmer" />
            </div>
            <div className="h-96 rounded-3xl bg-slate-800 skeleton-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-975 text-slate-100 pt-40 pb-20">
        <div className="max-w-lg mx-auto px-4 text-center glass-panel p-10 rounded-3xl border border-white/[0.08] shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Event Not Found</h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            {error || 'We could not locate this event record in the database.'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/30"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Events
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[event.status] || statusConfig.UPCOMING;

  return (
    <div className="min-h-screen bg-slate-975 text-slate-100 pt-32 pb-24 mesh-gradient-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white group transition-colors"
          >
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 group-hover:border-slate-700 transition-colors shadow-sm">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span>Back to Discovery</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold bg-slate-900/90 hover:bg-slate-850 text-slate-300 hover:text-white border border-white/10 transition-all shadow-sm cursor-pointer"
            title="Copy link"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-400" />
                <span>Share Summit</span>
              </>
            )}
          </button>
        </div>

        {/* FULL-WIDTH HERO IMAGE BANNER */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/[0.08] shadow-2xl mb-10 group">
          <div className="h-80 sm:h-96 md:h-[440px] w-full relative overflow-hidden bg-slate-950">
            <img
              src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80'}
              alt={event.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80';
              }}
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-slate-950/20" />
          </div>

          {/* Floating Metadata */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-12 flex flex-col justify-end">
            <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
              {/* Category */}
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-slate-200 border border-white/10 shadow-md">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                {event.category}
              </span>

              {/* Status */}
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold backdrop-blur-md border shadow-md ${status.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>

              {/* Industry */}
              <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                {event.industry}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl drop-shadow-lg">
              {event.name}
            </h1>
          </div>
        </div>

        {/* RESPONSIVE 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT COLUMN: Main Description & Schedule */}
          <div className="lg:col-span-2 space-y-8">
            {/* Full Event Description */}
            <div className="glass-panel p-8 rounded-3xl border border-white/[0.08] shadow-xl space-y-4">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>About The Summit</span>
              </h2>
              <p className="text-base text-slate-300 leading-relaxed font-normal whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Schedule Breakdown */}
            <div className="glass-panel p-8 rounded-3xl border border-white/[0.08] shadow-xl space-y-6">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span>Date & Schedule Breakdown</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Convenes On
                  </span>
                  <p className="text-base font-extrabold text-white">
                    {formatFullDate(event.startDate)}
                  </p>
                  <p className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Doors Open: {formatTime(event.startDate)}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Concludes On
                  </span>
                  <p className="text-base font-extrabold text-white">
                    {formatFullDate(event.endDate)}
                  </p>
                  <p className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Closing Sessions: {formatTime(event.endDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Venue Location Card */}
            <div className="glass-panel p-8 rounded-3xl border border-white/[0.08] shadow-xl space-y-4">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span>Venue Location Details</span>
              </h2>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 flex-shrink-0">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{event.venue}</h4>
                  <p className="text-sm text-slate-300 font-medium">
                    {event.city}, {event.country}
                  </p>
                  <span className="inline-block mt-2 text-xs font-semibold text-slate-500">
                    Official Host Facility & Exhibition Grounds
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT STICKY SIDEBAR: Organizer Card, Dates, Actions */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-28">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] shadow-2xl space-y-6">
              {/* Event Timeline badge */}
              <div className="border-b border-slate-800/80 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Duration & Dates
                </span>
                <p className="text-lg font-extrabold text-white">
                  {formatDateRange(event.startDate, event.endDate)}
                </p>
              </div>

              {/* Verified Organizer Card */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Hosted & Organized By
                </span>
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center font-extrabold text-sm shadow">
                    {event.organizer.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{event.organizer}</p>
                    <p className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Organizer
                    </p>
                  </div>
                </div>
              </div>

              {/* PRIMARY ATTEND / REGISTER ACTION */}
              {isRegistered ? (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-sm text-emerald-200">Registration Confirmed!</p>
                    <p className="text-xs text-emerald-400/80">You're on the attendee list.</p>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowRegModal(true)}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Register / Attend Event</span>
                </button>
              )}

              {/* OUTBOUND OFFICIAL WEBSITE LINK */}
              <a
                href={event.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-700/80 hover:border-slate-600 transition-all group"
              >
                <span>Visit Official Website</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <p className="text-center text-[11px] text-slate-500">
                Direct ticketing & accreditation handled by {event.organizer}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* REGISTRATION POPUP MODAL */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6 sm:p-8 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <Ticket className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Event Registration</h3>
              </div>
              <button
                onClick={() => setShowRegModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmRegistration} className="space-y-4 text-xs">
              <p className="text-slate-300">
                Register to attend <span className="font-bold text-white">"{event.name}"</span>.
              </p>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRegModal(false)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-slate-300 hover:text-white bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-md shadow-indigo-600/30"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
