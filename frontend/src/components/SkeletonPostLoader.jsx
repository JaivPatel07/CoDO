export default function SkeletonPostLoader() {
return (
        <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-6 flex flex-col h-full animate-pulse min-h-[350px] dark:bg-slate-900 dark:border-slate-800">
            {/* Top Actions: Category & Bookmark */}
            <div className="flex justify-between items-start mb-4">
                <div className="h-6 bg-slate-100 rounded-md w-24 dark:bg-slate-800"></div>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800"></div>
            </div>

            {/* Title */}
            <div className="space-y-2 mb-4 mt-2">
                <div className="h-6 bg-slate-200 rounded-md w-3/4 dark:bg-slate-700"></div>
                <div className="h-6 bg-slate-100 rounded-md w-1/2 dark:bg-slate-800"></div>
            </div>

            {/* Description */}
            <div className="space-y-2 mb-6">
                <div className="h-4 bg-slate-100 rounded-md w-full dark:bg-slate-800"></div>
                <div className="h-4 bg-slate-100 rounded-md w-5/6 dark:bg-slate-800"></div>
            </div>

            {/* Info Stats Row */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="h-14 bg-slate-50 rounded-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700"></div>
                <div className="h-14 bg-slate-50 rounded-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700"></div>
            </div>

            {/* Skills */}
            <div className="flex gap-2 mb-6 mt-auto">
                <div className="h-6 bg-slate-100 rounded-md w-16 dark:bg-slate-800"></div>
                <div className="h-6 bg-slate-100 rounded-md w-20 dark:bg-slate-800"></div>
                <div className="h-6 bg-slate-100 rounded-md w-14 dark:bg-slate-800"></div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0 dark:bg-slate-700"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-slate-200 rounded-md w-24 dark:bg-slate-700"></div>
                        <div className="h-3 bg-slate-100 rounded-md w-32 dark:bg-slate-800"></div>
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0 dark:bg-slate-800"></div>
            </div>
        </div>
    )
}