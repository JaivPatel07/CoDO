import ProfileBanner from "../../components/ProfileBanner";

export default function HomePage() {
    return (

        <div>

            {/* we will remove it when user creat his profile  */}
            <ProfileBanner />

            
            <section className="min-h-[420px] rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <p className="mb-2 text-sm font-bold uppercase text-indigo-600">Welcome to CoDO</p>
                <h1 className="mb-3 text-3xl font-bold text-slate-950">Good morning.</h1>
                <p className="text-slate-600">Coming soon.</p>

                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-slate-200 p-5">
                        <strong className="block text-2xl text-slate-950">12</strong>
                        <span className="mt-1 block text-slate-600">Connections</span>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-5">
                        <strong className="block text-2xl text-slate-950">8</strong>
                        <span className="mt-1 block text-slate-600">Team Invites</span>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-5">
                        <strong className="block text-2xl text-slate-950">5</strong>
                        <span className="mt-1 block text-slate-600">Events Joined</span>
                    </div>
                </div>
            </section>
        </div>
    )
}
