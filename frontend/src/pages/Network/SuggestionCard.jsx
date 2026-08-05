import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { GraduationCap, Users } from "lucide-react";
import { add_network_request } from "../../api/networks_api";
import { UserContext } from "../../contextAPI/userContext";

const SuggestionCard = ({ user, onConnect }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(UserContext);

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
    "from-violet-600 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-violet-500 to-fuchsia-500",
    "from-slate-700 to-slate-900",
    "from-amber-500 to-orange-600",
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

      <div className="px-6 pt- pb-5 text-center flex flex-col flex-1">
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
                className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-medium"
              >
                {skill}
              </span>
            ))}

            {skills.length > 3 && (
              <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-500 text-xs">
                +{skills.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="h-16 flex flex-col justify-center space-y-2 text-sm text-slate-600">
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
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl font-semibold transition"
        >
          {loading ? "Sending..." : "Connect"}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/user/${userData.username}/chat`, {
                state: {
                    receiver: {
                        other_username: user.username,
                        other_fullname: user.fullname,
                        other_profile_pic: user.profile_pic
                    }
                }
            });
          }}
className="w-full mt-2 border border-violet-600 text-violet-600 hover:bg-violet-50 py-2.5 rounded-xl font-medium transition"
        >
          Message
        </button>
      </div>
    </div>
  );
};

export default SuggestionCard;
