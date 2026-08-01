import { useContext } from "react";
import { UserContext } from "../contextAPI/userContext";

export default function ProfilePic({ uname, className = "", custom_pic_url = null }) {
  const { profileData } = useContext(UserContext);
  return (
    <div
      className={`flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-bold ${className}`}
    >
      {profileData?.profile_pic ? (
        <img
          src={profileData.profile_pic}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : custom_pic_url ? (
        <img
          src={custom_pic_url}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) :
        <span>{uname?.charAt(0)?.toUpperCase()}{uname?.charAt(1)?.toUpperCase()}</span>
      }
    </div>
  );
}