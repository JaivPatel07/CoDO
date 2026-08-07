import { useEffect, useState, useMemo } from "react";
import { Sparkles, Search } from "lucide-react";
import { get_connection_suggestions } from "../../api/networks_api";
import ErrorBanner from "../../components/ErrorBanner";
import SuggestionCard from "./SuggestionCard";
import SuggestionCardSkeleton from "./SuggestionCardSkeleton";

const Suggestions = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setIsLoading(true);
      const response = await get_connection_suggestions(25);
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayedUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;

    return users.filter((user) =>
      user.fullname?.toLowerCase().includes(query) ||
      user.username?.toLowerCase().includes(query) ||
      user.preferred_role?.toLowerCase().includes(query) ||
      user.skills?.some((skill) => skill.toLowerCase().includes(query))
    );
  }, [users, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Sparkles className="text-indigo-500" size={28} />
          Recommended for You
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Curated professionals and students based on your skills, goals, and interests.
        </p>
      </div>

      <div className="relative w-full max-w-md mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
        <input
          type="text"
          placeholder="Search by name, username or skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(0,1fr)]">
          {Array.from({ length: 8 }).map((_, i) => (
            <SuggestionCardSkeleton key={i} />
          ))}
        </div>
      ) : displayedUsers.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No recommendations right now</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Check back later for new connections.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(0,1fr)]">
          {displayedUsers.map((user) => (
            <SuggestionCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Suggestions;
