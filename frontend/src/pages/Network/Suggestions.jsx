import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { get_connection_suggestions } from "../../api/networks_api";
import ErrorBanner from "../../components/ErrorBanner";
import SuggestionCard from "./SuggestionCard";
import { Sparkles } from "lucide-react";

const Suggestions = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="max-w-7xl mx-auto px-6 py-4">
{/* Updated Header Section */}
      <div className="mb-8"> 
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Sparkles className="text-indigo-500" size={28} />
          Recommended for You
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Curated professionals and students based on your skills, goals, and interests.
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : users.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No recommendations right now</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Check back later for new connections.</p>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(0,1fr)]">
          {users.map((user) => (
            <SuggestionCard
              key={user.id}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Suggestions;
