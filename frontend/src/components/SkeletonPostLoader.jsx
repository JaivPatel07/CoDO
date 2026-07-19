export default function SkeletonPostLoader() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 animate-pulse">
                    <div className="h-44 bg-slate-100 rounded-2xl"></div>
                    <div className="h-6 bg-slate-100 rounded-lg w-3/4"></div>
                    <div className="h-4 bg-slate-100 rounded-lg w-1/2"></div>
                    <div className="h-10 bg-slate-100 rounded-xl"></div>
                </div>
            ))}
        </div>
    )
}