import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Plus, Users, Search, ChevronDown, FileText, LayoutGrid, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetch_collabration_post } from '../../../api/user_apis';
import CollabrationPostCard from '../../../components/CollabrationPostCard';

const tabs = ['All', 'Hackathon', 'Side Project', 'Open Source', 'My Post'];
const sortOptions = [
  { label: 'Newest First', value: 'Latest' },
  { label: 'Oldest First', value: 'Oldest' }
];
const trendingSkills = ['React', 'Django', 'AI', 'Flutter', 'UI/UX', 'Node.js', 'Python', 'Tailwind', 'Figma'];

function SkeletonPost() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 bg-slate-100 rounded-md w-24" />
        <div className="h-5 bg-slate-100 rounded-md w-16" />
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-100 rounded w-32" />
          <div className="h-3 bg-slate-100 rounded w-24" />
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-2 mb-5">
        <div className="h-6 bg-slate-100 rounded w-4/5" />
        <div className="h-4 bg-slate-100 rounded w-full" />
        <div className="h-4 bg-slate-100 rounded w-3/4" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="h-9 bg-slate-100 rounded-lg w-24" />
        <div className="h-9 bg-slate-100 rounded-lg w-28" />
      </div>
    </div>
  );
}

export default function CollaborationHomePage() {
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Latest');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const [postData, setPostData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetch_post() {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch_collabration_post({ filter: filter, sort: sort });
        if (response.status === 204 || response.data.length === 0) {
          setPostData([]);
        } else {
          setPostData(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        const errorMessage = err.response?.data?.detail || err.message || "An unexpected error occurred.";
        setError(errorMessage);
        setPostData([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetch_post();
  }, [filter, sort]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayedPosts = postData.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );



  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

            {/* Search */}
            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search projects or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex-1 overflow-hidden">
              <div className="flex overflow-x-auto hide-scrollbar gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`whitespace-nowrap text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-200 focus:outline-none ${filter === tab
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full lg:w-44 h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              >
                <span>{sortOptions.find(o => o.value === sort)?.label}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSort(option.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors ${sort === option.value
                        ? 'bg-slate-50 text-slate-900 font-bold'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-semibold'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, i) => <SkeletonPost key={i} />)}
            </div>
          ) : error ? (
            <div className="bg-red-50/50 border border-red-100 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Failed to load posts</h2>
              <p className="text-slate-500 max-w-md">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                Try Again
              </button>
            </div>
          ) : displayedPosts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px] shadow-sm">
              <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-[24px] flex items-center justify-center mb-6 ring-8 ring-slate-50/50">
                <LayoutGrid size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">No Opportunities Found</h2>
              <p className="text-slate-500 max-w-md mb-8 text-lg">We couldn't find any posts matching your criteria. Try adjusting your filters or search terms.</p>
              <Link to='../createpost'>
                <button className="px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5 flex items-center gap-2">
                  <Plus size={20} />
                  Create a Post
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {displayedPosts.map((element) => (
                <CollabrationPostCard key={element.id} project={element} />
              ))}
            </div>
          )}
        </div>
      </div>
        {/* Floating Action Button (Extended on Desktop, Circular on Mobile) */}
        <Link to='../createpost'>
          <button
            className="fixed right-6 bottom-20 md:right-8 md:bottom-8 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition-all duration-300 hover:-translate-y-1 active:scale-95 z-50 group px-0 w-14 h-14 md:w-auto md:h-auto md:px-6 md:py-4"
            aria-label="Create new post"
          >
            <Plus size={24} className="transition-transform duration-300 group-hover:rotate-90 md:mr-2" />
            <span className="hidden md:inline font-bold text-base whitespace-nowrap">Create Post</span>
          </button>
        </Link>
    </div>
  );
}