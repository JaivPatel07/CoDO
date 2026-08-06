import React, { useState, useRef, useEffect } from 'react';
import { create_collabration_post, update_collabration_post } from '../../api/user_apis';
import { AlertCircle, ArrowLeft, Users, FileText, Calendar, MapPin, Tag, ChevronDown, X, Plus, Rocket, CheckCircle2, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

// Sample data for our multi-select dropdowns
const AVAILABLE_SKILLS = ['React', 'Python', 'Node.js', 'TypeScript', 'Figma', 'Go', 'UI/UX', 'AWS', 'Docker'];
const AVAILABLE_ROLES = ['Frontend Developer', 'Backend Engineer', 'Fullstack', 'UI/UX Designer', 'Data Scientist', 'DevOps', 'Product Manager'];

// ── Shared input class ───────────────────────────────────────────────────────
const inp = "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 px-4 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 transition-all text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:text-slate-500";
const sel = "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 pl-4 pr-10 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 transition-all text-sm text-slate-800 dark:text-slate-200 appearance-none cursor-pointer";

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

// Convert HH:MM (24h) to { hour, minute, period }
function parse24hTime(timeStr) {
    if (!timeStr) return { hour: "09", minute: "00", period: "AM" };
    const [h, m] = timeStr.split(":");
    const hNum = parseInt(h, 10);
    const period = hNum >= 12 ? "PM" : "AM";
    const hour12 = hNum % 12 || 12;
    return { hour: String(hour12).padStart(2, "0"), minute: m || "00", period };
}

// Convert { hour, minute, period } to HH:MM (24h)
function to24h(hour, minute, period) {
    let h = parseInt(hour, 10);
    if (period === "AM" && h === 12) h = 0;
    if (period === "PM" && h !== 12) h += 12;
    return `${String(h).padStart(2, "0")}:${minute}`;
}



export default function UserPostForm() {
  const navigate = useNavigate();
  const location = useLocation();

  // Detect edit mode — PostManagePage passes { postId, projectData } via state
  const editPostId = location.state?.postId ?? null;
  const editData   = location.state?.projectData ?? null;
  const isEditMode = !!editPostId;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(() => {
    if (editData) {
      return {
        title:            editData.title            || '',
        description:      editData.description      || '',
        event_url:        editData.event_url        || '',
        event_type:       editData.event_type       || 'Hackathon',
        skills:           Array.isArray(editData.skills) ? editData.skills : [],
        roles:            Array.isArray(editData.roles)  ? editData.roles  : [],
        team_size:        editData.team_size         != null ? String(editData.team_size) : '',
        members_required: editData.members_required  != null ? String(editData.members_required) : '',
        start_date:       editData.start_date        || '',
        end_date:         editData.end_date          || '',
        start_time:       editData.start_time        || '09:00',
        end_time:         editData.end_time          || '17:00',
        event_mode:       editData.event_mode        || 'Online',
        event_location:   editData.event_location    || '',
        team_name:        editData.team_name         || '',
      };
    }
    return {
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
      start_time: '09:00',
      end_time: '17:00',
      event_mode: 'Online',
      event_location: '',
      team_name: '',
    };
  });

  const [inputError, setInputError] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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

    if (parseInt(formData.members_required, 10) <= 0) {
      setInputError({ members_required: "Members required must be greater than 0." });
      setErrorMessage("Please fix the validation errors below.");
      return;
    }
    if (parseInt(formData.members_required, 10) >= parseInt(formData.team_size, 10)) {
      setInputError({ members_required: "Members required must be less than total team size." });
      setErrorMessage("Please fix the validation errors below.");
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        // ── EDIT MODE: call PATCH update endpoint ──
        await update_collabration_post(editPostId, formData);
        setSuccessMessage("Post updated successfully!");
      } else {
        // ── CREATE MODE ──
        await create_collabration_post(formData);
        setSuccessMessage("Collaboration post created successfully!");
      }
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      window.scrollTo(0, 0);
      console.log("err:- ", err.response);
      if (err.response?.status === 500) {
        setServerError("Server Error!!! Please try again later.");
      } else if (err.response?.data) {
        setInputError(err.response.data);
      } else {
        setServerError("An unexpected error occurred.");
      }
      setErrorMessage(err.response?.data?.detail || err.message || (isEditMode ? "Failed to update post." : "Failed to create post."));
    } finally {
      setLoading(false);
    }
  };

  // Clear success/error messages after a few seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className="max-w-6xl mx-auto py-6 animate-in fade-in duration-300">
      {/* --- TOAST NOTIFICATIONS --- */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3">
        <AnimatePresence>
          {successMessage && (
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[250px]">
              <CheckCircle2 size={20} className="text-green-500 shrink-0" />
              <span className="text-sm font-medium">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* ------------------------- */}

      {/* ── Header ── */}
      <div className="flex items-start gap-4 mb-8">
        <button onClick={() => navigate(-1)}
          className="mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-800 transition cursor-pointer">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-[10px] font-bold mb-2">
            {isEditMode ? <Pencil size={10} /> : <Users size={10} />}
            {isEditMode ? 'Edit Collaboration Post' : 'Collaboration Post'}
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {isEditMode ? 'Edit Your Post' : 'Find Your Teammates'}
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
            {isEditMode
              ? 'Update the details of your collaboration post.'
              : 'Fill in the details to find collaborators for your next project or hackathon.'}
          </p>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {(serverError || Object.keys(inputError).length > 0 || errorMessage) && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 flex items-start gap-3 mb-6">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Please fix the following</p>
            <p className="text-xs mt-0.5">{serverError || errorMessage || "Review the fields marked in red below."}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        <Section icon={FileText} title="Basic Details" subtitle="Project title, description, and type">
          <div className="grid grid-cols-1 gap-5">
            <div>
              <Label required>Project / Event Title</Label>
              <input type="text" name="title" required placeholder="e.g., Global AI Hackathon 2024"
                className={`${inp} ${inputError.title ? 'border-red-400' : ''}`}
                value={formData.title} onChange={handleChange} />
              <FieldError error={inputError.title} />
            </div>
            <div>
              <Label required>Description</Label>
              <textarea name="description" rows="3" required placeholder="What are you building? What are the goals?"
                className={`${inp} resize-none ${inputError.description ? 'border-red-400' : ''}`}
                value={formData.description} onChange={handleChange} />
              <FieldError error={inputError.description} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label required>Event Type</Label>
              <SelectWrap>
                <select
                  name="event_type" value={formData.event_type} onChange={handleChange}
                  className={`${sel} ${inputError.event_type ? 'border-red-400' : ''}`}>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Side Project">Side Project</option>
                  <option value="Open Source">Open Source</option>
                </select>
              </SelectWrap>
              <FieldError error={inputError.event_type} />
            </div>
            <div>
              <Label>Project / Event URL</Label>
              <input type="url" name="event_url" placeholder="https://..."
                className={`${inp} ${inputError.event_url ? 'border-red-400' : ''}`}
                value={formData.event_url} onChange={handleChange} />
              <FieldError error={inputError.event_url} />
            </div>
          </div>
        </Section>

        <Section icon={Tag} title="Team & Requirements" subtitle="Skills, roles, and team size">
          <div className="grid grid-cols-1 gap-5">
            <div>
              <Label>Team Name (Optional)</Label>
              <input type="text" name="team_name" placeholder="e.g., Code Crusaders"
                className={`${inp} ${inputError.team_name ? 'border-red-400' : ''}`}
                value={formData.team_name} onChange={handleChange} />
              <FieldError error={inputError.team_name} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <MultiSelect label="Required Skills" required options={AVAILABLE_SKILLS} selected={formData.skills}
                onChange={(val) => handleMultiSelect('skills', val)} hasError={!!inputError.skills} />
              <FieldError error={inputError.skills} />
            </div>
            <div>
              <MultiSelect label="Roles Needed" required options={AVAILABLE_ROLES} selected={formData.roles}
                onChange={(val) => handleMultiSelect('roles', val)} hasError={!!inputError.roles} />
              <FieldError error={inputError.roles} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label required>Total Team Size</Label>
              <input type="number" name="team_size" min="1" required placeholder="e.g., 5"
                className={`${inp} ${inputError.team_size ? 'border-red-400' : ''}`}
                value={formData.team_size} onChange={handleChange} />
              <FieldError error={inputError.team_size} />
            </div>
            <div>
              <Label required>Members Required</Label>
              <input type="number" name="members_required" min="1" required placeholder="e.g., 2"
                className={`${inp} ${inputError.members_required ? 'border-red-400' : ''}`}
                value={formData.members_required} onChange={handleChange} />
              <FieldError error={inputError.members_required} />
            </div>
          </div>
        </Section>

        <Section icon={Calendar} title="Schedule & Location" subtitle="Dates, times, and venue details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Date</Label>
                <input type="date" name="start_date" className={`${inp} text-sm ${inputError.start_date ? 'border-red-400' : ''}`}
                  value={formData.start_date} onChange={handleChange} />
                <FieldError error={inputError.start_date} />
              </div>
              <TimePicker label="Start Time" value={formData.start_time} onChange={(val) => setFormData(p => ({ ...p, start_time: val }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>End Date</Label>
                <input type="date" name="end_date" className={`${inp} text-sm ${inputError.end_date ? 'border-red-400' : ''}`} value={formData.end_date} onChange={handleChange} />
                <FieldError error={inputError.end_date} />
              </div>
              <TimePicker label="End Time" value={formData.end_time} onChange={(val) => setFormData(p => ({ ...p, end_time: val }))} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label required>Event Mode</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Online', 'Offline'].map(mode => (
                  <button key={mode} type="button" onClick={() => handleChange({ target: { name: 'event_mode', value: mode } })}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border font-bold text-xs transition cursor-pointer ${formData.event_mode === mode
                      ? "bg-violet-600 border-violet-600 text-white shadow-sm"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-violet-300 hover:text-violet-700"
                      }`}>
                      {mode}
                  </button>
                ))}
              </div>
              <FieldError error={inputError.event_mode} />
            </div>
            <div>
              <Label>Location {formData.event_mode === 'Online' ? '(Meeting Link)' : '(City/Venue)'}</Label>
              <input type="text" name="event_location" placeholder={formData.event_mode === 'Online' ? 'e.g., Zoom, Discord...' : 'e.g., San Francisco, CA'}
                className={`${inp} ${inputError.event_location ? 'border-red-400' : ''}`}
                value={formData.event_location} onChange={handleChange} />
              <FieldError error={inputError.event_location} />
            </div>
          </div>
        </Section>

        {/* ── Submit Actions ── */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-800 font-bold text-sm transition cursor-pointer">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="px-8 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer shadow-md shadow-violet-600/20 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div><span>{isEditMode ? 'Saving...' : 'Publishing...'}</span></>
              : isEditMode
                ? <><Pencil size={15} /><span>Save Changes</span></>
                : <><Rocket size={15} /><span>Publish Post</span></>
            }
          </button>
        </div>

      </form>
    </div>
  );
}

// ── Section wrapper ──────────────────────────────────────────────────────────
function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 dark:border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
          <Icon size={16} />
        </div>
        <div>
          <h2 className="text-sm font-black text-slate-900 dark:text-slate-100">{title}</h2>
          {subtitle && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

// ── Label ────────────────────────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

// ── SelectWrapper (adds chevron icon) ────────────────────────────────────────
function SelectWrap({ children }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
    </div>
  );
}

// ── AM/PM Time Picker ────────────────────────────────────────────────────────
function TimePicker({ label, value, onChange, required }) {
  const parsed = parse24hTime(value);
  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);
  const [period, setPeriod] = useState(parsed.period);

  useEffect(() => {
      const p = parse24hTime(value);
      setHour(p.hour); setMinute(p.minute); setPeriod(p.period);
  }, [value]);

  const update = (h, m, p) => {
      onChange(to24h(h, m, p));
  };

  return (
      <div>
          <Label required={required}>{label}</Label>
          <div className="flex gap-2">
              <SelectWrap>
                  <select value={hour} className={sel}
                      onChange={e => { setHour(e.target.value); update(e.target.value, minute, period); }}>
                      {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
              </SelectWrap>
              <SelectWrap>
                  <select value={minute} className={sel}
                      onChange={e => { setMinute(e.target.value); update(hour, e.target.value, period); }}>
                      {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
              </SelectWrap>
              <SelectWrap>
                  <select value={period} className={`${sel} font-bold text-violet-700`}
                      onChange={e => { setPeriod(e.target.value); update(hour, minute, e.target.value); }}>
                      <option value="AM">AM</option> <option value="PM">PM</option>
                  </select>
              </SelectWrap>
          </div>
      </div>
  );
}

// --- Helper Component: Standardized Error Message ---
function FieldError({ error }) {
  if (!error) return null;
  const message = Array.isArray(error) ? error[0] : error;
  return (
    <p className="text-red-500 text-xs mt-1.5 font-medium animate-in fade-in slide-in-from-top-1">
      {message}
    </p>
  );
}

// --- Helper Component: Custom MultiSelect Dropdown ---
function MultiSelect({ label, options, selected, onChange, hasError, required }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      <Label required={required}>{label}</Label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 cursor-pointer flex justify-between items-center transition-colors min-h-[44px] ${hasError ? 'border-red-400' : 'border-slate-200 dark:border-slate-700 hover:border-violet-400'
          }`}
      >
        <div className="flex flex-wrap gap-1.5 overflow-hidden">
          {selected.length === 0 ? (
            <span className="text-slate-400 dark:text-slate-500 text-sm">Select options...</span>
          ) : (
            selected.map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100 hover:bg-violet-100 transition">
                {item}
                <button type="button" onClick={(e) => { e.stopPropagation(); onChange(item); }} className="text-violet-400 hover:text-violet-700 transition cursor-pointer">
                  <X size={10} />
                </button>
              </span>
            ))
          )}
        </div>
        <ChevronDown size={16} className={`text-slate-400 dark:text-slate-500 transition-transform ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-[100%] left-0 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          {options.map((option) => (
            <label key={option} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-800 cursor-pointer border-b border-slate-50 last:border-0">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onChange(option)}
                className="w-4 h-4 text-violet-600 rounded border-slate-300 focus:ring-violet-500 cursor-pointer"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}