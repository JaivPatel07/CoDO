import { useContext } from "react";
import { UserContext } from "../contextAPI/userContext";

export default function ProfilePic({ uname, className = "" }) {
  const { profileData } = useContext(UserContext);
  return (
    <div
      className={`flex items-center justify-center rounded-full overflow-hidden bg-slate-500 text-white font-bold ${className}`}
    >
      {profileData?.profile_pic ? (
        <img
          src={profileData.profile_pic}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{uname?.charAt(0)?.toUpperCase()}</span>
      )}
    </div>
  );
}