import { useEffect, useState } from "react";
import { get_connection_suggestions } from "../../api/networks_api";
import SuggestionCard from "./SuggestionCard";

const Suggestions = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchSuggestions()
  }, [])

  const fetchSuggestions = async () => {
    try {
      const response = await get_connection_suggestions()
      setUsers(response.data)
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-2">People You May Know</h1>

      <p className="text-gray-500 mb-8">
        Connect with students and grow your network.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <SuggestionCard
            key={user.id}
            user={user}
            onConnect={() =>
              setUsers((prev) => prev.filter((u) => u.id !== user.id))
            }
          />
        ))}
      </div>
    </div>
  )
}

export default Suggestions
