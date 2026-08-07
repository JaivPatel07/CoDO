import { useState } from "react";

export default function ProfilePic({
  uname,
  className = "",
  custom_pic_url = null,
}) {
  const [imgError, setImgError] = useState(false);
  return (
    <div
      className={`flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-bold ${className}`}
    >
      {custom_pic_url && !imgError ? (
        <img
          src={custom_pic_url}
          alt={uname}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{uname?.charAt(0)?.toUpperCase()}</span>
      )}
    </div>
  );
}