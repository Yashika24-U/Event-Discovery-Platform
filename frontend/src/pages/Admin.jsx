import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Plus,
  Calendar,
  Layers,
  MapPin,
  Sparkles,
  ArrowLeft,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  X,
  Loader2,
  RefreshCw,
  Building,
  Globe,
} from 'lucide-react';
import { fetchEvents, deleteEvent } from '../services/api';
import EventModal from '../components/EventModal';
import { formatDateRange } from '../components/EventCard';

const statusBadgeStyles = {
  ONGOING: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  UPCOMING: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  COMPLETED: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  CANCELLED: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

const Admin = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);

  // Delete confirmation state
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast Notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchEvents();
      if (res && res.data) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error('Admin fetch error:', err);
      showToast(
        err.response?.data?.message || 'Failed to fetch events from backend server.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEventToEdit(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (event) => {
    setEventToEdit(event);
    setIsFormModalOpen(true);
  };

  // Trigger Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;

    try {
      setIsDeleting(true);
      await deleteEvent(eventToDelete.id);
      showToast(`Summit '${eventToDelete.name}' was successfully deleted.`, 'success');
      setEventToDelete(null);
      await loadData();
    } catch (err) {
      console.error('Failed to delete event:', err);
      showToast(
        err.response?.data?.message || 'Failed to delete event record.',
        'error'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle successful form submission (Create or Edit)
  const handleFormSuccess = (message) => {
    showToast(message, 'success');
    loadData();
  };

  // Filtered list for search
  const filteredEvents = events.filter((ev) => {
    const q = searchFilter.toLowerCase();
    return (
      ev.name?.toLowerCase().includes(q) ||
      ev.category?.toLowerCase().includes(q) ||
      ev.city?.toLowerCase().includes(q) ||
      ev.country?.toLowerCase().includes(q) ||
      ev.industry?.toLowerCase().includes(q) ||
      ev.organizer?.toLowerCase().includes(q)
    );
  });

  const totalEvents = events.length;
  const activeEvents = events.filter(
    (e) => e.status === 'UPCOMING' || e.status === 'ONGOING'
  ).length;
  const distinctCities = new Set(events.map((e) => e.city)).size;

  return (
    <div className="min-h-screen bg-slate-975 text-slate-100 pt-32 pb-24 mesh-gradient-bg">
      {/* FLOATING TOAST NOTIFICATION CONTAINER */}
      {toast && (
        <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-2xl border ${
              toast.type === 'success'
                ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900/95 border-rose-500/40 text-rose-300'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            )}
            <span className="text-sm font-bold text-white">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Refresh */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white group transition-colors"
          >
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 group-hover:border-slate-700 transition-colors shadow-sm">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span>Back to Public Discovery</span>
          </Link>

          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold bg-slate-900/90 hover:bg-slate-850 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer shadow-sm"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* DASHBOARD HERO HEADER */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/[0.08] shadow-2xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 flex-shrink-0">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  NexusEvents Admin Console
                </h1>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  CRUD Manager
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Maintain live event schedules, verify organizer accreditations, and publish summits.
              </p>
            </div>
          </div>

          {/* ACTION BAR: ADD NEW EVENT PRIMARY BUTTON */}
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex-shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Event</span>
          </button>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Events
              </span>
              <p className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                {loading ? '...' : totalEvents}
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium">PostgreSQL live records</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Calendar className="w-7 h-7" />
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Summits
              </span>
              <p className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                {loading ? '...' : activeEvents}
              </p>
              <p className="text-xs text-emerald-400/90 mt-1 font-medium">Upcoming / Live now</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Sparkles className="w-7 h-7" />
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Cities Covered
              </span>
              <p className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                {loading ? '...' : distinctCities}
              </p>
              <p className="text-xs text-cyan-400/90 mt-1 font-medium">Global tech hubs</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Globe className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* RESPONSIVE DATA TABLE CONTAINER */}
        <div className="glass-panel rounded-3xl border border-white/[0.08] overflow-hidden shadow-2xl">
          {/* Table Search Header */}
          <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/40">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-extrabold text-white">Event Directory</h3>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {filteredEvents.length} records
              </span>
            </div>

            {/* Quick Live Filter */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by title, city, category..."
                className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-xs uppercase text-slate-400 tracking-wider border-b border-slate-800 font-bold">
                <tr>
                  <th className="px-6 py-4">Event Banner & Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">City / Country</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {loading && (
                  <tr>
                    <td colSpan="6" className="text-center py-20">
                      <div className="inline-flex items-center gap-3 text-sm font-semibold text-cyan-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Loading directory records from PostgreSQL...</span>
                      </div>
                    </td>
                  </tr>
                )}

                {!loading && filteredEvents.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-20 text-slate-400">
                      <p className="text-base font-bold text-slate-300 mb-1">
                        No events match your criteria
                      </p>
                      <p className="text-xs text-slate-500">
                        Click 'Add New Event' above to register a new conference or reset your filter.
                      </p>
                    </td>
                  </tr>
                )}

                {!loading &&
                  filteredEvents.map((ev) => (
                    <tr
                      key={ev.id}
                      className="hover:bg-slate-900/60 transition-colors group"
                    >
                      {/* Banner + Title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={ev.image}
                            alt=""
                            className="w-14 h-14 rounded-2xl object-cover bg-slate-800 border border-slate-700/60 flex-shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=200&q=80';
                            }}
                          />
                          <div className="max-w-xs sm:max-w-sm">
                            <Link
                              to={`/events/${ev.id}`}
                              className="font-extrabold text-white hover:text-cyan-300 transition-colors line-clamp-1 flex items-center gap-1.5"
                            >
                              <span>{ev.name}</span>
                              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                            </Link>
                            <span className="text-xs text-cyan-400 font-semibold block mt-0.5">
                              {ev.industry}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700">
                          {ev.category}
                        </span>
                      </td>

                      {/* Dates */}
                      <td className="px-6 py-4 text-xs font-semibold text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{formatDateRange(ev.startDate, ev.endDate)}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5 font-bold text-slate-200">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>
                            {ev.city}, {ev.country}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[190px] mt-0.5">
                          {ev.venue}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                            statusBadgeStyles[ev.status] || statusBadgeStyles.UPCOMING
                          }`}
                        >
                          {ev.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          {/* Edit button */}
                          <button
                            onClick={() => handleOpenEdit(ev)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-300 hover:text-white bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 hover:border-indigo-500 transition-all cursor-pointer shadow-sm"
                            title="Edit Event"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => setEventToDelete(ev)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 hover:border-rose-600 transition-all cursor-pointer shadow-sm"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT EVENT MODAL */}
      <EventModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={handleFormSuccess}
        eventToEdit={eventToEdit}
      />

      {/* CUSTOM DELETE CONFIRMATION DIALOG */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-8 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
                Delete Summit Listing?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Are you sure you want to permanently delete{' '}
                <span className="font-extrabold text-white">"{eventToDelete.name}"</span>?
              </p>
              <p className="text-xs text-rose-400 mt-2 font-semibold">
                This action is irreversible and will remove the event from the database.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
