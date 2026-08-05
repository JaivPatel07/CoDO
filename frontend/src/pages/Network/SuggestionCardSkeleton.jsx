const SuggestionCardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full animate-pulse">
      {/* Cover */}
      <div className="h-24 bg-slate-200"></div>

      {/* Avatar */}
      <div className="flex justify-center -mt-10">
        <div className="w-20 h-20 rounded-full border-4 border-white bg-slate-300"></div>
      </div>

      <div className="px-6 pt-4 pb-5 text-center flex flex-col flex-1">
        {/* Name */}
        <div className="h-7 bg-slate-200 rounded w-1/2 mx-auto"></div>
        {/* Role */}
        <div className="h-4 bg-slate-200 rounded w-1/3 mx-auto mt-2"></div>

        {/* Skills */}
        <div className="mt-3 h-16 flex items-start justify-center">
          <div className="flex justify-center gap-2">
            <div className="h-6 bg-slate-100 rounded-full w-16"></div>
            <div className="h-6 bg-slate-100 rounded-full w-20"></div>
          </div>
        </div>

        <div className="flex-1 min-h-4"></div>
        <div className="h-11 bg-slate-200 rounded-xl w-full mt-8"></div>
        <div className="h-11 bg-slate-100 rounded-xl w-full mt-2"></div>
      </div>
    </div>
  );
};

export default SuggestionCardSkeleton;