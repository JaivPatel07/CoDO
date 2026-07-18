import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetch_collabration_post } from '../../../api/user_apis';
import SkeletonPostLoader from '../../../components/SkeletonPostLoader';
import CollabrationPostCard from '../../../components/CollabrationPostCard';


const tabs = ['All', 'Hackathon', 'Side Project', 'Open Source'];
const sortOptions = ['Latest', 'Trending', 'All Time'];

export default function CollaborationHomePage() {
  const [activeTab, setActiveTab] = useState('All');
  const [sortOption, setSortOption] = useState('All Time');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [postData, setPostData] = useState([])
  const [isloading,setLoading] = useState(false)
  const [error,setError] = useState("")

  useEffect(() => {

    async function fetch_post() {
      try {
        const response = await fetch_collabration_post()
        // console.log(response)
        if (response.data.status === 204) {
          setPostData([])
        }
        else {
          console.log(response.data)
          setPostData(response.data)
          // setError("dfksdjfl")
        }
      }
      catch (err) {
        console.log(err.response)
        setError(err.response)
      }
    }
    fetch_post()

  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* Main Content */}
      <main className="pt-7 pb-24 md:pb-12 min-h-screen max-w-7xl mx-auto px-4 md:px-8">

        {/* Filters & Sorting */}
        <section className="sticky top-4 z-40 bg-white/90 backdrop-blur-md p-3 md:px-5 md:py-3 mb-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
            <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300 ${activeTab === tab
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Dropdown */}
          <div className="relative flex items-center gap-2" ref={dropdownRef}>
            <span className="text-sm font-medium text-slate-400">Sorted by:</span>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-sm font-semibold text-slate-800 bg-slate-100 px-4 py-2 rounded-full hover:bg-slate-200 transition-all shadow-sm group"
            >
              {sortOption}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-[110%] w-40 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortOption(option);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${sortOption === option
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 font-medium hover:text-slate-900'
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Project Grid */}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-5 text-red-700 flex items-center gap-3 mb-6">
              <AlertCircle className="flex-shrink-0" />
              <div>
                  <p className="font-bold">Error loading events</p>
                  <p className="text-xs">{error}</p>
              </div>
          </div>
        )}

        {
        postData.length === 0
          ?<SkeletonPostLoader />
          :<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postData.map((element) => (
              <CollabrationPostCard key={element.id} project={element} />
            ))}
          </div>
        }
      </main>

      {/* Floating Action Button */}
      <Link to='../createpost' >
        <button className="fixed right-5 bottom-24 md:right-8 md:bottom-8 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_24px_rgba(37,99,235,0.6)] transition-all duration-300 hover:-translate-y-1 active:scale-95 z-50 group">
          <span className="material-symbols-outlined text-3xl transition-transform duration-300 group-hover:rotate-90"><Plus /></span>
        </button>
      </Link>
    </div>
  );
}