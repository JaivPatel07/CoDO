import React, { useState, useRef, useEffect } from 'react';
import { create_collabration_post } from '../../api/user_apis';
import { AlertCircle } from 'lucide-react'; // Added missing import

// Sample data for our multi-select dropdowns
const AVAILABLE_SKILLS = ['React', 'Python', 'Node.js', 'TypeScript', 'Figma', 'Go', 'UI/UX', 'AWS', 'Docker'];
const AVAILABLE_ROLES = ['Frontend Developer', 'Backend Engineer', 'Fullstack', 'UI/UX Designer', 'Data Scientist', 'DevOps', 'Product Manager'];

export default function UserPostForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_url: '',
    event_type: 'Hackathon',
    skills: [],
    roles: [],
    team_size: '',
    members_required: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    event_mode: 'Online',
    event_location: '',
  });

  const [inputError, setInputError] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear individual field error when user starts typing
    if (inputError[name]) {
      setInputError((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleMultiSelect = (field, value) => {
    setFormData((prev) => {
      const currentValues = prev[field];
      if (currentValues.includes(value)) {
        return { ...prev, [field]: currentValues.filter((v) => v !== value) };
      }
      return { ...prev, [field]: [...currentValues, value] };
    });
    // Clear array error when user selects an option
    if (inputError[field]) {
      setInputError((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInputError({});
    setServerError("");

    try {
      const response = await create_collabration_post(formData);
      console.log('Success:', response);
      // Optional: Add redirect or success message here
    } catch (err) {
      console.log("err:- ", err.response);
      // Fixed: changed 'err.respons' to 'err.response'
      if (err.response?.status === 500) {
        setServerError("Server Error!!! Please try again later.");
      } else if (err.response?.data) {
        setInputError(err.response.data);
      } else {
        setServerError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-2 px-4 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        {/* Header */}
        <div className="bg-slate-900 px-8 py-6 text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-3xl text-blue-400">campaign</span>
          <div>
            <h2 className="text-2xl font-bold tracking-wide">Create New Post</h2>
            <p className="text-slate-400 text-sm mt-1">Fill in the details to find collaborators for your next big thing.</p>
          </div>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mx-8 mt-8 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 flex items-center gap-3">
            <AlertCircle className="flex-shrink-0 w-5 h-5" />
            <div>
              <p className="font-bold text-sm">Failed to create post</p>
              <p className="text-xs mt-0.5">{serverError}</p>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* Section 1: Basic Info */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Basic Details</h3>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project / Event Title *</label>
                <input
                  type="text" name="title" required
                  placeholder="e.g., Global AI Hackathon 2024"
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all ${
                    inputError.title ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                  value={formData.title} onChange={handleChange}
                />
                <FieldError error={inputError.title} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
                <textarea
                  name="description" rows="3" required
                  placeholder="What are you building? What are the goals?"
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all resize-none ${
                    inputError.description ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                  value={formData.description} onChange={handleChange}
                />
                <FieldError error={inputError.description} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Event Type *</label>
                <select
                  name="event_type"
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all bg-white ${
                    inputError.event_type ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                  value={formData.event_type} onChange={handleChange}
                >
                  <option value="Hackathon">Hackathon</option>
                  <option value="Side Project">Side Project</option>
                  <option value="Open Source">Open Source</option>
                </select>
                <FieldError error={inputError.event_type} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project / Event URL</label>
                <input
                  type="url" name="event_url"
                  placeholder="https://..."
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all ${
                    inputError.event_url ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                  value={formData.event_url} onChange={handleChange}
                />
                <FieldError error={inputError.event_url} />
              </div>
            </div>
          </div>

          {/* Section 2: Requirements */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Team & Requirements</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <MultiSelect
                  label="Required Skills"
                  options={AVAILABLE_SKILLS}
                  selected={formData.skills}
                  onChange={(val) => handleMultiSelect('skills', val)}
                  hasError={!!inputError.skills}
                />
                <FieldError error={inputError.skills} />
              </div>
              <div>
                <MultiSelect
                  label="Roles Needed"
                  options={AVAILABLE_ROLES}
                  selected={formData.roles}
                  onChange={(val) => handleMultiSelect('roles', val)}
                  hasError={!!inputError.roles}
                />
                <FieldError error={inputError.roles} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Total Team Size *</label>
                <input
                  type="number" name="team_size" min="1" required
                  placeholder="e.g., 5"
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all ${
                    inputError.team_size ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                  value={formData.team_size} onChange={handleChange}
                />
                <FieldError error={inputError.team_size} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Required Members Count *</label>
                <input
                  type="number" name="members_required" min="0" required
                  placeholder="e.g., 2"
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all ${
                    inputError.members_required ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                  value={formData.members_required} onChange={handleChange}
                />
                <FieldError error={inputError.members_required} />
              </div>
            </div>
          </div>

          {/* Section 3: Schedule & Location */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Schedule & Location</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Date</label>
                  <input
                    type="date" name="start_date"
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all text-sm ${
                      inputError.start_date ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                    value={formData.start_date} onChange={handleChange}
                  />
                  <FieldError error={inputError.start_date} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Time</label>
                  <input
                    type="time" name="start_time"
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all text-sm ${
                      inputError.start_time ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                    value={formData.start_time} onChange={handleChange}
                  />
                  <FieldError error={inputError.start_time} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">End Date</label>
                  <input
                    type="date" name="end_date"
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all text-sm ${
                      inputError.end_date ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                    value={formData.end_date} onChange={handleChange}
                  />
                  <FieldError error={inputError.end_date} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">End Time</label>
                  <input
                    type="time" name="end_time"
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all text-sm ${
                      inputError.end_time ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                    value={formData.end_time} onChange={handleChange}
                  />
                  <FieldError error={inputError.end_time} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Event Mode *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 flex-1 hover:bg-blue-50 transition-colors">
                    <input
                      type="radio" name="event_mode" value="Online"
                      checked={formData.event_mode === 'Online'} onChange={handleChange}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Online</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 flex-1 hover:bg-blue-50 transition-colors">
                    <input
                      type="radio" name="event_mode" value="Offline"
                      checked={formData.event_mode === 'Offline'} onChange={handleChange}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Offline</span>
                  </label>
                </div>
                <FieldError error={inputError.event_mode} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Location {formData.event_mode === 'Online' ? '(Meeting Link)' : '(City/Venue)'}
                </label>
                <input
                  type="text" name="event_location"
                  placeholder={formData.event_mode === 'Online' ? 'e.g., Zoom, Discord...' : 'e.g., San Francisco, CA'}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all ${
                    inputError.event_location ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                  value={formData.event_location} onChange={handleChange}
                />
                <FieldError error={inputError.event_location} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
            <button
              type="button"
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-blue-200 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              Publish Post
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// --- Helper Component: Standardized Error Message ---
function FieldError({ error }) {
  if (!error) return null;
  // Handles arrays (common in Django/Laravel APIs) or plain strings
  const message = Array.isArray(error) ? error[0] : error;
  return (
    <p className="text-red-500 text-xs mt-1.5 font-medium animate-in fade-in slide-in-from-top-1">
      {message}
    </p>
  );
}

// --- Helper Component: Custom MultiSelect Dropdown ---
function MultiSelect({ label, options, selected, onChange, hasError }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 rounded-lg border bg-white cursor-pointer flex justify-between items-center transition-colors min-h-[46px] ${
          hasError ? 'border-red-300 bg-red-50/30' : 'border-slate-200 hover:border-blue-400'
        }`}
      >
        <div className="flex flex-wrap gap-1.5 overflow-hidden">
          {selected.length === 0 ? (
            <span className="text-slate-400 text-sm">Select options...</span>
          ) : (
            selected.map((item) => (
              <span key={item} className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                {item}
                <span
                  className="material-symbols-outlined text-[12px] cursor-pointer hover:text-blue-900"
                  onClick={(e) => { e.stopPropagation(); onChange(item); }}
                >
                  close
                </span>
              </span>
            ))
          )}
        </div>
        <span className="material-symbols-outlined text-slate-400">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-[100%] left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          {options.map((option) => (
            <label key={option} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onChange(option)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-slate-700 font-medium">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}