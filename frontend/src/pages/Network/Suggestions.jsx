import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { get_connection_suggestions } from "../../api/networks_api";
import ErrorBanner from "../../components/ErrorBanner";
import SuggestionCard from "./SuggestionCard";
import SuggestionCardSkeleton from "./SuggestionCardSkeleton";

const Suggestions = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const response = await get_connection_suggestions();
        setUsers(response.data);
      } catch (err) {
        setError("Failed to load suggestions. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleConnect = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <SuggestionCardSkeleton key={index} />
          ))}
        </div>
      );
    }

if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-2xl p-12 min-h-[300px]">
          <div className="w-full max-w-md">
            <ErrorBanner message={error} />
          </div>
        </div>
      );
    }

    if (users.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-2xl p-12 min-h-[300px]">
          <Users className="w-12 h-12 text-slate-400 mb-4" />
          <h3 className="text-xl font-bold text-slate-800">All Caught Up!</h3>
          <p className="text-slate-500 mt-2">There are no new suggestions for you right now. Check back later!</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <SuggestionCard key={user.id} user={user} onConnect={() => handleConnect(user.id)} />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Expand Your Network
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500">Discover and connect with talented students and professionals in the community.</p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Suggestions;
