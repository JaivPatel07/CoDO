import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { GraduationCap, Users } from "lucide-react";
import { add_network_request } from "../../api/networks_api";

const SuggestionCard = ({ user, onConnect }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const skills = user.skills || [];

  const handleConnect = async () => {
    try {
      setLoading(true);

      await add_network_request({ receiver_username: user.username });

      if (onConnect) {
        onConnect();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const coverGradients = [
    "from-indigo-500 to-blue-500",
    "from-emerald-500 to-green-600",
    "from-violet-500 to-pink-500",
    "from-slate-700 to-slate-900",
    "from-amber-500 to-red-500",
  ];

  const randomGradient = coverGradients[user.id % coverGradients.length];

  return (
    <div
      onClick={() => navigate(`/user/${user.username}/profile`)}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      {/* Cover */}
      <div className={`h-24 bg-gradient-to-r ${randomGradient}`}></div>

      {/* Avatar */}
      <div className="flex justify-center -mt-10">
        <img
          src={
            user.profile_pic ||
            `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff`
          }
          alt={user.username}
          className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-md mb-1"
        />
      </div>

      <div className="px-6 pt-1 pb-5 text-center flex flex-col flex-1">
        <h2 className="font-bold text-2xl text-slate-900 leading-tight">
          {user.fullname}
        </h2>

        <p className="text-slate-500 mt-1">
          {user.preferred_role || "Student"}
        </p>

        <div className="mt-3 h-16 flex items-start justify-center">
          <div className="flex flex-wrap justify-center gap-2">
            {skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"
              >
                {skill}
              </span>
            ))}

            {skills.length > 3 && (
              <span className="px-3 py-1 rounded-full bg-gray-100 text-xs">
                +{skills.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="h-16 flex flex-col justify-center space-y-2 text-sm text-gray-600">
          <div className="flex justify-center items-center gap-2">
            <GraduationCap size={16} />

            {user.college || "College not added"}
          </div>

          <div className="flex justify-center items-center gap-2">
            <Users size={16} />
            {user.connections} Connections
          </div>
        </div>

        <div className="flex-1 min-h-4"></div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleConnect();
          }}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold transition"
        >
          {loading ? "Sending..." : "Connect"}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();

            alert("Messaging coming soon");
          }}
          className="w-full mt-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-2.5 rounded-xl font-medium transition"
        >
          Message
        </button>
      </div>
    </div>
  );
};

export default SuggestionCard;
