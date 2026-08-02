import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { add_network_request } from "../../api/networks_api";

const SuggestionCard = ({ user, onConnect }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleConnect = async () => {
    try {
      setLoading(true)

      await add_network_request({receiver_username : user.username,})

      if (onConnect) {
        onConnect()
      }
    }
    catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={() => navigate(`/user/${user.username}/profile`)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl cursor-pointer transition duration-300 overflow-hidden"
    >
      {/* Cover */}
      <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

      {/* Avatar */}
      <div className="flex justify-center -mt-10">
        <img
          src={
            user.profile_pic ||
            `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff`
          }
          alt={user.username}
          className="w-20 h-20 rounded-full border-4 border-white object-cover"
        />
      </div>

      <div className="px-5 pb-5 text-center">
        <h2 className="font-bold text-lg mt-3">{user.fullname}</h2>

        <p className="text-gray-500">@{user.username}</p>

        <p className="text-sm text-gray-600 mt-3 h-10 overflow-hidden">
          {user.bio || "No bio available"}
        </p>

        <p className="text-sm text-gray-500 mt-3">
          🎓 {user.college || "College not added"}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleConnect();
          }}
          disabled={loading}
          className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl"
        >
          {loading ? "Sending..." : "Connect"}
        </button>
      </div>
    </div>
  )
}

export default SuggestionCard
