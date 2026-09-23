import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Building, ArrowUpRight, Tag, Sparkles } from 'lucide-react';

const statusConfig = {
  ONGOING: {
    label: 'Live Now',
    bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
    dot: 'bg-emerald-400 animate-ping',
    badgeText: 'text-emerald-300',
  },
  UPCOMING: {
    label: 'Upcoming',
    bg: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300',
    dot: 'bg-indigo-400',
    badgeText: 'text-indigo-300',
  },
  COMPLETED: {
    label: 'Completed',
    bg: 'bg-slate-500/15 border-slate-500/30 text-slate-400',
    dot: 'bg-slate-400',
    badgeText: 'text-slate-400',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
    dot: 'bg-rose-400',
    badgeText: 'text-rose-400',
  },
};

export const formatDateRange = (startDateStr, endDateStr) => {
  if (!startDateStr) return '';
  const start = new Date(startDateStr);
  const end = endDateStr ? new Date(endDateStr) : null;

  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const startYear = start.getFullYear();

  if (!end || isNaN(end.getTime()) || start.toDateString() === end.toDateString()) {
    return `${startMonth} ${startDay}, ${startYear}`;
  }

  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const endDay = end.getDate();
  const endYear = end.getFullYear();

  if (startMonth === endMonth && startYear === endYear) {
    return `${startMonth} ${startDay} – ${endDay}, ${startYear}`;
  } else if (startYear === endYear) {
    return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${startYear}`;
  } else {
    return `${startMonth} ${startDay}, ${startYear} – ${endMonth} ${endDay}, ${endYear}`;
  }
};

const EventCard = ({ event }) => {
  const status = statusConfig[event.status] || statusConfig.UPCOMING;

  return (
    <div className="group relative rounded-3xl overflow-hidden glass-card-interactive flex flex-col h-full bg-slate-900/60 border border-white/[0.08]">
      {/* Banner Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-950">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
          {/* Category Pill */}
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-slate-200 border border-white/10 shadow-sm">
            <Tag className="w-3 h-3 text-cyan-400" />
            {event.category}
          </span>

          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border shadow-sm ${status.bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            <span className={status.badgeText}>{status.label}</span>
          </span>
        </div>

        {/* Date Badge at Bottom-Left of Image */}
        <div className="absolute bottom-3.5 left-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl text-xs font-semibold bg-slate-950/85 backdrop-blur-md text-indigo-300 border border-indigo-500/25 shadow-md">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>{formatDateRange(event.startDate, event.endDate)}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Industry Tag */}
          <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-1.5">
            <Sparkles className="w-3 h-3" />
            <span>{event.industry}</span>
          </div>

          {/* Event Title */}
          <h3 className="text-lg font-extrabold text-white group-hover:text-indigo-300 transition-colors duration-200 line-clamp-2 leading-snug mb-2.5">
            {event.name}
          </h3>

          {/* Description snippet */}
          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {event.description}
          </p>

          {/* Location & Venue */}
          <div className="space-y-1.5 border-t border-slate-800/80 pt-3.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="truncate font-semibold text-slate-200">
                {event.city}, {event.country}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="truncate text-slate-400">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/events/${event.id}`}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider bg-slate-800/80 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-violet-600 text-slate-200 hover:text-white border border-slate-700/80 hover:border-transparent transition-all duration-300 group/btn shadow-sm"
        >
          <span>View Details</span>
          <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-200" />
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
