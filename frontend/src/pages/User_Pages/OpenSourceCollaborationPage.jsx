import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, Filter, Star, GitFork, Eye, 
  MessageCircle, ChevronRight, Clock, Users, ChevronDown,
  CheckCircle2, Plus, X, ExternalLink, Code2, Sparkles,
  Layers, GitPullRequest, Award
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { fetchOpenSourceProjects, createOpenSourceProject } from '../../api/opensource_apis';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const FILTERS = ["All", "Seeking Contributors", "Good First Issues", "Actively Developing", "Maintenance"];
const SORTS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Most Stars", value: "most_stars" },
  { label: "Most Forks", value: "most_forks" },
  { label: "Most Issues", value: "most_issues" },
];

const statMeta = {
  total: {
    label: "Total Projects",
    icon: Layers,
    bg: "bg-slate-50",
    iconColor: "text-slate-500",
    borderColor: "border-slate-200",
  },
  seeking: {
    label: "Seeking Contributors",
    icon: GitPullRequest,
    bg: "bg-violet-50",
    iconColor: "text-violet-500",
    borderColor: "border-violet-100",
  },
  goodFirst: {
    label: "Good First Issues",
    icon: Award,
    bg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    borderColor: "border-emerald-100",
  },
};

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value || 0);

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
const StatCard = ({ kind, value, hint }) => {
  const meta = statMeta[kind];
  const Icon = meta.icon;

  return (
    <div className={`group bg-white rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10 ${meta.borderColor}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-slate-500">{meta.label}</p>
        <div className={`h-8 w-8 flex items-center justify-center rounded-lg ${meta.bg} ${meta.iconColor}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className="mt-2 text-3xl font-black text-slate-900">{formatNumber(value)}</p>
      {hint && (
        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-violet-500 transition-colors">
          <span>{hint}</span>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON LOADER
// ─────────────────────────────────────────────────────────────────────────────
function OpenSourceCollaborationSkeleton() {
  return (
    <div className="space-y-8 animate-pulse max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="flex justify-between items-center mb-10">
        <div className="h-9 w-80 bg-slate-200 rounded-lg" />
        <div className="h-12 w-48 bg-slate-200 rounded-xl" />
      </div>
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="h-11 flex-1 bg-slate-100 rounded-xl" />
        <div className="h-11 w-28 bg-slate-100 rounded-xl" />
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex justify-between items-center"><div className="h-4 w-24 bg-slate-200 rounded-md" /><div className="h-8 w-8 bg-slate-100 rounded-lg" /></div>
            <div className="h-8 w-16 mt-2 bg-slate-200 rounded-md" />
          </div>
        ))}
      </div>
      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-80 bg-white rounded-2xl border border-slate-100 shadow-sm" />)}
      </div>
    </div>
  );
}

export default function OpenSourceCollaborationPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filter states
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All'); // Default to 'All'

  const [activeFilter, setActiveFilter] = useState("All");
  const [loadingMore, setLoadingMore] = useState(false);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const pageSize = 9; // Number of projects per page

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => loadProjects({ nextPage: 1 }), 250);
    return () => clearTimeout(timer);
  }, [searchQuery, activeFilter, sort]);

  const loadProjects = async ({ nextPage = 1, append = false } = {}) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);
      const res = await fetchOpenSourceProjects();
      // For now, fetching all and slicing. In a real app, fetchOpenSourceProjects would take pagination/filters.
      const allProjects = res.data;
      const start = (nextPage - 1) * pageSize;
      const end = start + pageSize;
      const paginatedProjects = allProjects.slice(start, end);

      setProjects(current => append ? [...current, ...paginatedProjects] : paginatedProjects);
      setHasNext(end < allProjects.length); // Simple check for client-side pagination
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading projects", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Memoized unique filter options
  const uniqueTechnologies = useMemo(() => {
    const allTechs = projects.flatMap(p => p.technologies);
    return [...new Set(allTechs)].sort();
  }, [projects]);

  const uniqueRoles = useMemo(() => {
    const allRoles = projects.flatMap(p => p.roles_needed);
    return [...new Set(allRoles)].sort();
  }, [projects]);

  const uniqueCategories = useMemo(() => {
    const allCategories = projects.map(p => p.category).filter(Boolean);
    return [...new Set(allCategories)].sort();
  }, [projects]);

  const uniqueDifficulties = ['Beginner Friendly', 'Intermediate', 'Advanced'];
  const uniqueStatusesForFilter = ['All', 'Looking for Contributors', 'Actively Developing', 'Good First Issues', 'Maintenance'];

  const uniqueStatuses = useMemo(() => {
    const allStatuses = projects.map(p => p.status).filter(Boolean);
    return ['All', ...new Set(allStatuses)].sort();
  }, [projects]);

  // Memoized filtered projects
  const displayedProjects = useMemo(() => {
    let currentProjects = projects;

    // Apply search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentProjects = currentProjects.filter(p =>
        p.repository_name.toLowerCase().includes(lowerCaseQuery) ||
        p.description.toLowerCase().includes(lowerCaseQuery) ||
        p.owner_username.toLowerCase().includes(lowerCaseQuery) ||
        p.technologies.some(tech => tech.toLowerCase().includes(lowerCaseQuery)) ||
        p.roles_needed.some(role => role.toLowerCase().includes(lowerCaseQuery)) ||
        p.skills_required.some(skill => skill.toLowerCase().includes(lowerCaseQuery)) ||
        p.category.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Apply filters
    if (selectedTechnologies.length > 0) {
      currentProjects = currentProjects.filter(p =>
        p.technologies.some(tech => selectedTechnologies.includes(tech))
      );
    }
    if (selectedRoles.length > 0) {
      currentProjects = currentProjects.filter(p =>
        p.roles_needed.some(role => selectedRoles.includes(role))
      );
    }
    if (selectedDifficulty) {
      currentProjects = currentProjects.filter(p => p.difficulty === selectedDifficulty);
    }
    if (selectedCategory) {
      currentProjects = currentProjects.filter(p => p.category === selectedCategory);
    }
    if (selectedStatus && selectedStatus !== 'All') {
      currentProjects = currentProjects.filter(p => p.status === selectedStatus); // This will need to be adjusted if status names are different
    }

    return currentProjects;
  }, [projects, searchQuery, selectedTechnologies, selectedRoles, selectedDifficulty, selectedCategory, selectedStatus]);

  // Stat values for the cards
  const statValues = useMemo(() => {
    const total = projects.length;
    const seeking = projects.filter(p => p.status === 'Looking for Contributors').length;
    const goodFirst = projects.filter(p => p.status === 'Good First Issues').length;
    return { total, seeking, goodFirst };
  }, [projects]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPage(1); // Reset page when filter changes
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1); // Reset page when sort changes
  };

  const handleLoadMore = () => {
    loadProjects({ nextPage: page + 1, append: true });
  };

  if (loading && page === 1) {
    return <OpenSourceCollaborationSkeleton />;
  }

  const handleClearFilters = () => {
    setSelectedTechnologies([]);
    setSelectedRoles([]);
    setSelectedDifficulty('');
    setSelectedCategory('');
    setSelectedStatus('All');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-violet-100 selection:text-violet-900 pb-16 animate-in fade-in duration-500">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Hero Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black tracking-tight text-slate-900"
          >
            Open Source <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500">Collaboration</span>
          </motion.h1>
          <p className="mt-1 text-[13px] font-medium text-slate-500 max-w-md hidden sm:block">
            Discover and contribute to exciting open-source projects.
          </p>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <button 
              onClick={() => setIsPublishModalOpen(true)}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2"
            >
              <FaGithub className="w-4 h-4" />
              Publish Repository
            </button>
          </motion.div>
        </div>
          
        {/* Search & Filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 mb-8">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search repositories, technologies, or universities..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-100 outline-none transition-all text-slate-700 placeholder:text-slate-400 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                {FILTERS.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleFilterChange(filter)}
                    className={`h-11 rounded-2xl border px-4 text-[13px] font-bold transition focus:outline-none focus:ring-4 focus:ring-violet-100 ${
                      activeFilter === filter
                        ? "border-violet-200 bg-violet-50 text-violet-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <label className="relative">
                <select
                  value={sort}
                  onChange={handleSortChange}
                  className="h-11 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-4 pr-10 text-[13px] font-bold text-slate-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100 lg:w-48"
                  aria-label="Sort projects"
                >
                  {SORTS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </label>
              <button onClick={() => setIsFilterModalOpen(true)} className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-sm">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
        </section>

        {/* Stat Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <StatCard
            kind="total"
            value={statValues.total}
            hint="Total projects listed"
          />
          <StatCard
            kind="seeking"
            value={statValues.seeking}
            hint="Projects looking for help"
          />
          <StatCard
            kind="goodFirst"
            value={statValues.goodFirst}
            hint="Beginner-friendly issues"
          />
        </section>

        {/* Projects Listing */}
        <section>
          {loading && page === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: pageSize }).map((_, index) => <ProjectCardSkeleton key={index} />)}
            </div>
          ) : displayedProjects.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles size={32} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No Projects Found</h3>
                <p className="text-slate-500 mb-6 mt-2 max-w-sm">Be the first to share your work! Publish your repository to start collaborating with the community.</p>
                <button onClick={() => setIsPublishModalOpen(true)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                  Publish Repository
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
            
            {hasNext && (
              <div className="text-center pt-4">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-[13px] font-bold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-violet-100"
                >
                  {loadingMore ? "Loading..." : "Load More Projects"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
        </section>

      </main>

      {/* Publish Repository Modal */}
      <AnimatePresence>
        {isPublishModalOpen && (
          <PublishModal 
            onClose={() => setIsPublishModalOpen(false)} 
            onSuccess={() => {
              setIsPublishModalOpen(false);
              loadProjects();
            }}
          />
        )}
      </AnimatePresence>

      {/* Filter Modal */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <FilterModal
            onClose={() => setIsFilterModalOpen(false)}
            filters={{ selectedTechnologies, selectedRoles, selectedDifficulty, selectedCategory, selectedStatus }}
            setFilters={{ setSelectedTechnologies, setSelectedRoles, setSelectedDifficulty, setSelectedCategory, setSelectedStatus }}
            options={{ uniqueTechnologies, uniqueRoles, uniqueDifficulties, uniqueCategories, uniqueStatuses }}
            onClear={handleClearFilters}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT CARD SKELETON
// ─────────────────────────────────────────────────────────────────────────────
function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
      <div className="relative h-[140px] overflow-hidden rounded-t-xl bg-slate-100 mb-4" />
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 bg-slate-100 rounded-md" />
          <div className="h-3 w-1/2 bg-slate-100 rounded-md" />
        </div>
      </div>
      <div className="h-4 w-full bg-slate-100 rounded-md mb-2" />
      <div className="h-4 w-5/6 bg-slate-100 rounded-md mb-6" />
      <div className="flex flex-wrap gap-2 mb-6"><div className="h-6 w-20 bg-slate-100 rounded-md" /><div className="h-6 w-24 bg-slate-100 rounded-md" /></div>
      <div className="flex items-center justify-between">
        <div className="h-10 w-24 bg-slate-100 rounded-lg" />
        <div className="h-10 w-20 bg-slate-100 rounded-lg" />
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-50/50 transition-all group cursor-pointer"
      onClick={() => navigate(String(project.id))}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center">
            {project.owner_profile_pic ? (
              <img src={project.owner_profile_pic} alt={project.owner_username} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <FaGithub className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              {project.repository_name} {/* Removed status badge from here, moved to below description */}
              <span className="px-2 py-0.5 bg-violet-50 text-violet-700 text-xs font-semibold rounded-full border border-violet-200 shrink-0">
                {project.status || 'Active'}
              </span>
            </h3>
            <p className="text-sm text-slate-500 hover:text-violet-600 transition-colors">
              {project.owner_username}
            </p>
          </div>
        </div>
      </div>

      <p className="text-slate-600 mb-5 leading-relaxed line-clamp-2">
        {project.description}
      </p>

      {/* Tech Stack & Roles */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {project.technologies?.map(tech => (
            <span key={tech} className="px-2.5 py-1 bg-violet-50 text-violet-700 text-xs font-semibold rounded-md border border-violet-100/50">
              {tech}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {project.roles_needed?.map(role => (
            <span key={role} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-100/50">
              Looking for: {role}
            </span>
          ))}
        </div>
      </div>

      {/* GitHub Stats */}
      <div className="flex items-center gap-4 text-slate-500 text-sm font-medium mb-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500" /> {project.stars}</div>
        <div className="flex items-center gap-1.5"><GitFork className="w-4 h-4 text-slate-400" /> {project.forks}</div>
        <div className="flex items-center gap-1.5"><MessageCircle className="w-4 h-4 text-sky-500" /> {project.open_issues}</div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <a 
            href={project.repository_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <FaGithub className="w-4 h-4" />
            GitHub
          </a>
          <button 
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-all shadow-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function FilterModal({ onClose, filters, setFilters, options, onClear }) {
  const { selectedTechnologies, selectedRoles, selectedDifficulty, selectedCategory, selectedStatus } = filters;
  const { setSelectedTechnologies, setSelectedRoles, setSelectedDifficulty, setSelectedCategory, setSelectedStatus } = setFilters;
  const { uniqueTechnologies, uniqueRoles, uniqueDifficulties, uniqueCategories, uniqueStatuses } = options;

  const handleTechChange = (tech) => {
    setSelectedTechnologies(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const handleRoleChange = (role) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleClearAndClose = () => {
    onClear();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Projects
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-400 text-slate-700"
            >
              {uniqueStatusesForFilter.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Technologies Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Technologies</label>
            <div className="flex flex-wrap gap-2">
              {uniqueTechnologies.map(tech => (
                <button
                  key={tech}
                  onClick={() => handleTechChange(tech)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${selectedTechnologies.includes(tech) ? 'bg-violet-600 text-white border-violet-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'}`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* Roles Needed Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Roles Needed</label>
            <div className="flex flex-wrap gap-2">
              {uniqueRoles.map(role => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${selectedRoles.includes(role) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'}`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-400 text-slate-700"
            >
              <option value="">Any</option>
              {uniqueDifficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-400 text-slate-700"
            >
              <option value="">Any</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handleClearAndClose}
            className="px-5 py-2 text-slate-600 hover:text-slate-900 font-medium"
          >
            Clear Filters
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl shadow-sm transition-all"
          >
            Apply Filters
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLISH MODAL
// ─────────────────────────────────────────────────────────────────────────────
function PublishModal({ onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [githubRepoData, setGithubRepoData] = useState(null);
  const [githubFetchLoading, setGithubFetchLoading] = useState(false);
  const [githubFetchError, setGithubFetchError] = useState('');

  const [formData, setFormData] = useState({
    // GitHub-derived fields (will be pre-filled)
    repository_name: '', // from GitHub
    repository_url: '', // from GitHub
    tagline: '', // from GitHub description
    description: '', // from GitHub description
    owner_username: '', // from GitHub
    owner_profile_pic: '', // from GitHub
    stars: 0, // from GitHub
    forks: 0, // from GitHub
    open_issues: 0, // from GitHub
    technologies: [], // from GitHub topics/languages
    // CoDO-specific manual fields
    // These are the only fields the user manually enters after GitHub import
    repository_url: '',
    tagline: '',
    description: '',
    category: '',
    difficulty: 'Beginner Friendly',
    technologies: '',
    roles_needed: '',
    skills_required: '', // from GitHub
    category: '', // from GitHub
    status: 'Actively Developing', // Default status, can be "Looking for Contributors"
  });
  const [loading, setLoading] = useState(false);

  // Placeholder for GitHub API call
  // In a real app, this would call a backend endpoint that fetches from GitHub API
  const fetchGithubRepoDetails = async (url) => {
    setGithubFetchLoading(true);
    setGithubFetchError('');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      const parts = url.split('/');
      const owner = parts[parts.length - 2];
      const repo = parts[parts.length - 1];

      if (!owner || !repo) {
        throw new Error('Invalid GitHub URL format. Please use format like https://github.com/owner/repo');
      }

      // Mock data from GitHub API
      const mockData = {
        github_repo_id: `gh-${Math.random().toString(36).substring(7)}`, // Mock ID
        repository_name: repo,
        repository_url: url,
        tagline: `A cool project by ${owner}`,
        description: `This is a detailed description for ${repo}, an open-source project. It aims to solve a common problem in software development.`,
        owner_username: owner,
        owner_profile_pic: `https://avatars.githubusercontent.com/${owner}`, // Mock avatar
        stars: Math.floor(Math.random() * 1000) + 50,
        forks: Math.floor(Math.random() * 200) + 10,
        open_issues: Math.floor(Math.random() * 50) + 5,
        technologies: ['React', 'JavaScript', 'TailwindCSS'], // Ensure this is an array
        // Default CoDO specific fields
        roles_needed: [],
        skills_required: [],
        category: '',
        difficulty: 'Beginner Friendly',
        status: 'Actively Developing',
      };

      setGithubRepoData(mockData);
      setFormData(prev => ({
        ...prev,
        github_repo_id: mockData.github_repo_id,
        repository_name: mockData.repository_name,
        repository_url: mockData.repository_url,
        tagline: mockData.tagline,
        description: mockData.description,
        owner_username: mockData.owner_username,
        owner_profile_pic: mockData.owner_profile_pic,
        stars: mockData.stars,
        forks: mockData.forks,
        open_issues: mockData.open_issues,
        // Technologies from GitHub, ensure it's an array
        technologies: mockData.technologies,
        // Keep manual fields as they are or set defaults
        roles_needed: prev.roles_needed || [],
        skills_required: prev.skills_required || [],
      }));
      setStep(2); // Move to next step after fetching
    } catch (err) {
      setGithubFetchError(err.message || 'Failed to fetch GitHub repository details. Please check the URL.');
    } finally {
      setGithubFetchLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Ensure technologies, roles_needed, skills_required are arrays
      const payload = {
        ...formData,
        // If technologies is a string (e.g., from manual input), convert to array
        technologies: Array.isArray(formData.technologies) ? formData.technologies : formData.technologies.split(',').map(s => s.trim()).filter(Boolean),
        // Roles and skills are always manual input, so they should be strings that need splitting
        roles_needed: Array.isArray(formData.roles_needed) ? formData.roles_needed : formData.roles_needed.split(',').map(s => s.trim()).filter(Boolean),
        skills_required: Array.isArray(formData.skills_required) ? formData.skills_required : formData.skills_required.split(',').map(s => s.trim()).filter(Boolean),
      };
      await createOpenSourceProject(payload);
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to publish project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FaGithub className="w-5 h-5" />
            {step === 1 ? 'Import from GitHub' : 'Add Collaboration Details'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {step === 1 ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 mb-4">
                Enter your GitHub repository URL to automatically import project details.
              </p>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Repository URL</label>
                <input 
                  type="url" 
                  value={githubRepoUrl}
                  onChange={e => {
                    setGithubRepoUrl(e.target.value);
                    setGithubFetchError(''); // Clear error on change
                  }}
                  placeholder="https://github.com/owner/repo" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-100 focus:border-violet-400 outline-none transition-all"
                />
                {githubFetchError && <p className="text-red-500 text-xs mt-1.5">{githubFetchError}</p>}
              </div>
              <div className="flex items-center justify-center py-4">
                <span className="text-slate-400 text-sm">OR</span>
              </div>
              <button
                // This would trigger GitHub OAuth flow and then list repos
                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                disabled // Disable for now as GitHub OAuth integration is more complex
              >
                <FaGithub className="w-5 h-5" /> Connect GitHub & Choose Repository
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Display GitHub-derived data */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-md font-bold text-slate-900 mb-2">Imported from GitHub:</h3>
                <p className="text-sm text-slate-700"><strong>Repo:</strong> <a href={formData.repository_url} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">{formData.repository_name}</a></p>
                <p className="text-sm text-slate-700"><strong>Owner:</strong> {formData.owner_username}</p>
                <p className="text-sm text-slate-700 line-clamp-2"><strong>Description:</strong> {formData.description}</p>
                <p className="text-sm text-slate-700"><strong>Stars:</strong> {formData.stars} | <strong>Forks:</strong> {formData.forks} | <strong>Issues:</strong> {formData.open_issues}</p>
                <p className="text-sm text-slate-700"><strong>Tech:</strong> {Array.isArray(formData.technologies) ? formData.technologies.join(', ') : formData.technologies}</p>
              </div>

              {/* CoDO-specific manual fields */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tagline (Short, catchy description)</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Short, catchy description"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-100 focus:border-violet-400 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Detailed Description & Goals</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-400 text-slate-700 resize-none"
                  placeholder="What is this project about? Why should students contribute?"
                />
              </div>
              {/* Technologies are now imported, but if we want to allow editing or adding more, uncomment this:
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Technologies (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : ''} // Display current array as string
                  onChange={e => setFormData({...formData, technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} // Convert string to array
                  placeholder="React, Django, Python"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-100 focus:border-violet-400 outline-none transition-all"
                />
              </div> */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Roles Needed (comma separated)</label>
                <input 
                  type="text"
                  value={Array.isArray(formData.roles_needed) ? formData.roles_needed.join(', ') : formData.roles_needed}
                  onChange={e => setFormData({...formData, roles_needed: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                  placeholder="Frontend, Backend, AI/ML" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-100 focus:border-violet-400 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Skills Required (comma separated)</label>
                <input 
                  type="text"
                  value={Array.isArray(formData.skills_required) ? formData.skills_required.join(', ') : formData.skills_required}
                  onChange={e => setFormData({...formData, skills_required: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                  placeholder="Git, REST API, Tailwind" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-100 focus:border-violet-400 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Difficulty</label>
                  <select 
                    value={formData.difficulty}
                    onChange={e => setFormData({...formData, difficulty: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-400 text-slate-700"
                  >
                    <option>Beginner Friendly</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Web App"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-100 focus:border-violet-400 outline-none transition-all"
                  />
                </div>

              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {step === 1 ? (
            <>
              <div />
              <button onClick={() => fetchGithubRepoDetails(githubRepoUrl)} disabled={githubFetchLoading || !githubRepoUrl} className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                Next Step
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setStep(1)} className="px-5 py-2 text-slate-600 hover:text-slate-900 font-medium">
                Back
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="px-6 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-medium rounded-xl shadow-sm transition-all"
              >
                {loading ? 'Publishing...' : 'Publish Project'}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
