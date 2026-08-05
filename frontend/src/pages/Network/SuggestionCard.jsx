import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { GraduationCap, Users } from "lucide-react";
import { add_network_request } from "../../api/networks_api";
import { UserContext } from "../../contextAPI/userContext";

const SuggestionCard = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(UserContext);

  const skills = user.skills || [];


  const coverGradients = [
    "from-indigo-500 to-blue-500",
    "from-emerald-500 to-green-600",
    "from-violet-500 to-pink-500",
    "from-slate-700 to-slate-900",
    "from-amber-500 to-red-500",
  ];

  const randomGradient = coverGradients[user.id % coverGradients.length];
  const [user_relation,setUser_Relation] = useState('Connect')

  const handleConnectionRequest = async (receiver_username) => {
    try {
      await add_network_request({ receiver_username: receiver_username.username });
      setUser_Relation("Requested...")
    } catch (err) {
      console.log(err)
    }
  };

  const handleMessageRequest = async (other_user) => {
    const udata = {
      "other_fullname": `${other_user.fullname}`,
      "other_username": other_user.username,
      "other_profile_pic": other_user.profile_pic,
      "user2": other_user.id
    };
    navigate(`/user/${localStorage.getItem('username')}/chat`, { state: { receiver: udata } });
  };


  return (
    <div
      onClick={() => navigate(`/user/${user.username}/profile`)}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      {/* Cover */}
      <div className={`h-24 bg-gradient-to-r ${randomGradient} shrink-0`}></div>

      {/* Avatar */}
      <div className="flex justify-center -mt-10 shrink-0">
        <img
          src={
            user.profile_pic ||
            `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff`
          }
          alt={user.username}
          className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-md bg-white"
        />
      </div>

      {/* Card Content */}
      <div className="px-6 pt-3 pb-6 text-center flex flex-col flex-1 w-full overflow-hidden">

        {/* Name & Role */}
        <div className="w-full flex flex-col items-center shrink-0">
          <h2
            className="font-bold text-xl text-slate-900 leading-tight truncate w-full"
            title={user.fullname} // Shows full name on hover
          >
            {user.fullname}
          </h2>
          <p className="text-slate-500 mt-1 text-sm truncate w-full">
            {user.preferred_role || "Student"}
          </p>
        </div>

        {/* Skills */}
        <div className="mt-4 h-14 flex items-start justify-center shrink-0 w-full overflow-hidden">
          <div className="flex flex-wrap justify-center gap-1.5">
            {skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium truncate max-w-[100px]"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium shrink-0">
                +{skills.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Info / Meta */}
        <div className="flex flex-col justify-center space-y-2 text-sm text-gray-600 mb-5 shrink-0 w-full">
          <div className="flex justify-center items-center gap-2 w-full">
            <GraduationCap size={16} className="shrink-0 text-slate-400" />
            <span className="truncate" title={user.college || "College not added"}>
              {user.college || "College not added"}
            </span>
          </div>

          <div className="flex justify-center items-center gap-2 w-full">
            <Users size={16} className="shrink-0 text-slate-400" />
            <span className="truncate">
              {user.connections || 0} Connections
            </span>
          </div>
        </div>

        {/* Spacer to push buttons to bottom if content is short */}
        <div className="flex-1"></div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-auto w-full shrink-0">
          <button
            onClick={(e) => { 
              e.stopPropagation()
              handleConnectionRequest(user)
            }}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-70 flex justify-center items-center h-11"
          >
            {user_relation}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              handleMessageRequest(user)
            }}
            className="w-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-2.5 rounded-xl font-medium transition-colors flex justify-center items-center h-11"
          >
            Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestionCard;