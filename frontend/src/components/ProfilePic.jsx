export default function ProfilePic({
  uname,
  className = "",
  custom_pic_url = null,
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-full overflow-hidden bg-slate-500 text-white font-bold ${className}`}
    >
      {custom_pic_url ? (
        <img
          src={custom_pic_url}
          alt={uname}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{uname?.charAt(0)?.toUpperCase()}</span>
      )}
    </div>
  );
}