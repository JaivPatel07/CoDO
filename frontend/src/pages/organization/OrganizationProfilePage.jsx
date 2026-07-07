import { useEffect, useState } from "react";
import { fetch_organization_profile } from "../../api/organization_apis";
import { FaBuilding, FaUser, FaPhone, FaGlobe, FaInfoCircle, FaBriefcase } from 'react-icons/fa';

function ProfileDetail({ icon, label, value }) {
    return (
        <div className="flex items-start gap-4">
            <div className="mt-1 text-slate-500">{icon}</div>
            <div>
                <p className="font-bold text-slate-700">{label}</p>
                <p className="text-slate-600">{value || 'Not provided'}</p>
            </div>
        </div>
    );
}

export default function OrganizationProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getProfile = async () => {
            try {
                setLoading(true);
                const data = await fetch_organization_profile();
                setProfile(data);
            } catch (err) {
                setError(err.detail || err.error || "Failed to fetch organization profile.");
            } finally {
                setLoading(false);
            }
        };
        getProfile();
    }, []);

    if (loading) {
        return <div className="text-center p-10">Loading profile...</div>;
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-lg text-red-700 text-center">
                <FaInfoCircle className="inline mr-2" />
                {error}
            </div>
        );
    }

    if (!profile) {
        return <div className="text-center p-10">No profile found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl">
                <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-3xl text-emerald-600">
                            <FaBuilding />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900">{profile.organization_name}</h1>
                            <p className="text-lg text-slate-600">{profile.organization_type}</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-2">About Us</h2>
                        <p className="text-slate-600 leading-relaxed">{profile.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <ProfileDetail icon={<FaUser />} label="Contact Person" value={profile.contact_person} />
                        <ProfileDetail icon={<FaPhone />} label="Phone Number" value={profile.phone_number} />
                        {profile.website && (
                            <ProfileDetail
                                icon={<FaGlobe />}
                                label="Website"
                                value={
                                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                                        {profile.website}
                                    </a>
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}