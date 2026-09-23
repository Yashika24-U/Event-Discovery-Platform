import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Building,
  Globe,
  Image as ImageIcon,
  Tag,
  Briefcase,
  Users,
  Layers,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { createEvent, updateEvent } from '../services/api';

const CATEGORY_OPTIONS = ['Conference', 'Expo', 'Summit', 'Trade Show', 'Workshop', 'Meetup'];
const STATUS_OPTIONS = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];

// Helper to convert Date/ISO to input format YYYY-MM-DDTHH:mm
const formatToInputDate = (dateVal) => {
  if (!dateVal) return '';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

const initialFormData = {
  name: '',
  description: '',
  category: 'Conference',
  industry: '',
  startDate: '',
  endDate: '',
  venue: '',
  city: '',
  country: '',
  organizer: '',
  website: '',
  image: '',
  status: 'UPCOMING',
};

const EventModal = ({ isOpen, onClose, onSuccess, eventToEdit = null }) => {
  const isEditMode = Boolean(eventToEdit);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (eventToEdit) {
        setFormData({
          name: eventToEdit.name || '',
          description: eventToEdit.description || '',
          category: eventToEdit.category || 'Conference',
          industry: eventToEdit.industry || '',
          startDate: formatToInputDate(eventToEdit.startDate),
          endDate: formatToInputDate(eventToEdit.endDate),
          venue: eventToEdit.venue || '',
          city: eventToEdit.city || '',
          country: eventToEdit.country || '',
          organizer: eventToEdit.organizer || '',
          website: eventToEdit.website || '',
          image: eventToEdit.image || '',
          status: eventToEdit.status || 'UPCOMING',
        });
      } else {
        const now = new Date();
        const start = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const end = new Date(start.getTime() + 2 * 24 * 60 * 60 * 1000);

        setFormData({
          ...initialFormData,
          startDate: formatToInputDate(start),
          endDate: formatToInputDate(end),
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        });
      }
      setErrors({});
      setServerError(null);
    }
  }, [isOpen, eventToEdit]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Event name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.industry.trim()) newErrors.industry = 'Industry is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue name is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.organizer.trim()) newErrors.organizer = 'Organizer name is required';
    if (!formData.website.trim()) {
      newErrors.website = 'Website URL is required';
    } else if (!/^https?:\/\/.+/i.test(formData.website.trim())) {
      newErrors.website = 'Must be a valid URL (http:// or https://)';
    }
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else if (!/^https?:\/\/.+/i.test(formData.image.trim())) {
      newErrors.image = 'Must be a valid URL (http:// or https://)';
    }

    if (formData.startDate && formData.endDate) {
      const s = new Date(formData.startDate);
      const e = new Date(formData.endDate);
      if (e < s) {
        newErrors.endDate = 'End date cannot be earlier than start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setServerError(null);

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        industry: formData.industry.trim(),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        venue: formData.venue.trim(),
        city: formData.city.trim(),
        country: formData.country.trim(),
        organizer: formData.organizer.trim(),
        website: formData.website.trim(),
        image: formData.image.trim(),
        status: formData.status,
      };

      let response;
      if (isEditMode) {
        response = await updateEvent(eventToEdit.id, payload);
      } else {
        response = await createEvent(payload);
      }

      if (onSuccess) {
        onSuccess(
          isEditMode ? 'Event updated successfully!' : 'Event created successfully!',
          response.data
        );
      }
      onClose();
    } catch (err) {
      console.error('Error saving event:', err);
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors && err.response.data.errors.join(', ')) ||
        'Failed to save event. Please check inputs and verify database connectivity.';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {isEditMode ? 'Edit Summit Listing' : 'Publish New Summit'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditMode
                  ? 'Update event details and synchronize database state'
                  : 'Register a new global conference or trade expo on NexusEvents'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Server Error Alert */}
          {serverError && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-rose-200">Submission Error</p>
                <p className="text-xs text-rose-300/90">{serverError}</p>
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> General Information
            </h3>

            {/* Event Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Event Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Global AI & Cloud Expo 2026"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                  errors.name ? 'border-rose-500 ring-1 ring-rose-500/40' : 'border-slate-800 focus:border-cyan-400'
                } text-white placeholder-slate-500 focus:outline-none transition-colors`}
              />
              {errors.name && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.name}</p>}
            </div>

            {/* Category & Industry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category <span className="text-rose-400">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white focus:outline-none"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Industry Sector <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="e.g. Artificial Intelligence, FinTech, Cybersecurity"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                    errors.industry ? 'border-rose-500 ring-1 ring-rose-500/40' : 'border-slate-800 focus:border-cyan-400'
                  } text-white placeholder-slate-500 focus:outline-none`}
                />
                {errors.industry && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.industry}</p>}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Event Status <span className="text-rose-400">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white focus:outline-none"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Comprehensive summary of keynotes, exhibits, networking sessions..."
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                  errors.description ? 'border-rose-500 ring-1 ring-rose-500/40' : 'border-slate-800 focus:border-cyan-400'
                } text-white placeholder-slate-500 focus:outline-none transition-colors resize-y`}
              />
              {errors.description && (
                <p className="text-xs text-rose-400 mt-1 font-medium">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Date & Schedule Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Start Date & Time <span className="text-rose-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                    errors.startDate ? 'border-rose-500 ring-1 ring-rose-500/40' : 'border-slate-800 focus:border-cyan-400'
                  } text-white focus:outline-none`}
                />
                {errors.startDate && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  End Date & Time <span className="text-rose-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                    errors.endDate ? 'border-rose-500 ring-1 ring-rose-500/40' : 'border-slate-800 focus:border-cyan-400'
                  } text-white focus:outline-none`}
                />
                {errors.endDate && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.endDate}</p>}
              </div>
            </div>
          </div>

          {/* Venue & Location */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Location & Venue
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Venue Name / Facility <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. Moscone Center, South Hall"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                  errors.venue ? 'border-rose-500 ring-1 ring-rose-500/40' : 'border-slate-800 focus:border-cyan-400'
                } text-white placeholder-slate-500 focus:outline-none`}
              />
              {errors.venue && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.venue}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  City <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                    errors.city ? 'border-rose-500 ring-1 ring-rose-500/40' : 'border-slate-800 focus:border-cyan-400'
                  } text-white placeholder-slate-500 focus:outline-none`}
                />
                {errors.city && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Country <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g. United States"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                    errors.country ? 'border-rose-500 ring-1 ring-rose-500/40' : 'border-slate-800 focus:border-cyan-400'
                  } text-white placeholder-slate-500 focus:outline-none`}
                />
                {errors.country && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.country}</p>}
              </div>
            </div>
          </div>

          {/* Organizer & Media Links */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Organizer & External Links
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Organizer Organization <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                placeholder="e.g. AI Innovations Global"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                  errors.organizer ? 'border-rose-500 ring-1 ring-rose-500/40' : 'border-slate-800 focus:border-cyan-400'
                } text-white placeholder-slate-500 focus:outline-none`}
              />
              {errors.organizer && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.organizer}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Official Website URL <span className="text-rose-400">*</span>
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example-summit.com"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                  errors.website ? 'border-rose-500 ring-1 ring-rose-500/40' : 'border-slate-800 focus:border-cyan-400'
                } text-white placeholder-slate-500 focus:outline-none`}
              />
              {errors.website && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.website}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Banner Image URL <span className="text-rose-400">*</span>
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                  errors.image ? 'border-rose-500 ring-1 ring-rose-500/40' : 'border-slate-800 focus:border-cyan-400'
                } text-white placeholder-slate-500 focus:outline-none`}
              />
              {errors.image && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.image}</p>}

              {/* Live Preview Box */}
              {formData.image && (
                <div className="mt-2.5 relative h-36 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-lg bg-slate-950/80 text-[10px] font-bold text-cyan-300 border border-slate-700">
                    Live Banner Preview
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/95 flex items-center justify-end gap-3 sticky bottom-0 z-10 backdrop-blur-md">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            type="button"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isEditMode ? 'Save Changes' : 'Publish Summit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
