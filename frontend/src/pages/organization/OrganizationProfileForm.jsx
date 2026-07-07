import { useState } from "react";
import { useNavigate } from "react-router-dom";

function submit_organization_profile(formData) {
    // This is a placeholder for your API call function.
    // You should implement this in your `api` folder.
    const token = localStorage.getItem('access');
    return fetch('http://127.0.0.1:8000/api/organization/profile/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    }).then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw err });
        }
        return res.json();
    });
}

export default function OrganizationProfileForm() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.target);

        try {
            const response = await submit_organization_profile(formData);
            setSuccess(response.message);
            setTimeout(() => navigate("/organization/profile"), 2000); // Redirect after success
        } catch (err) {
            setError(err.error || "An error occurred.");
            console.error(err);
        }
    };

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold">Complete Your Organization Profile</h2>
                <p className="text-muted">
                    Provide details about your organization to connect with student talent.
                </p>
            </div>

            {error && (
                <div className="alert alert-danger text-center">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success text-center">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="card shadow-sm border-0 rounded-4 mb-4">
                    <div className="card-body p-4">
                        <h4 className="fw-bold mb-4">🏢 Organization Details</h4>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Organization Name</label>
                                <input
                                    name="organization_name"
                                    className="form-control"
                                    placeholder="e.g., Acme Corporation"
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Organization Type</label>
                                <input
                                    name="organization_type"
                                    className="form-control"
                                    placeholder="e.g., Tech Company, University"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                rows="4"
                                className="form-control"
                                placeholder="Tell us about your organization..."
                                required
                            ></textarea>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Contact Person</label>
                                <input
                                    name="contact_person"
                                    className="form-control"
                                    placeholder="e.g., Jane Doe"
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Phone Number</label>
                                <input
                                    name="phone_number"
                                    className="form-control"
                                    placeholder="+1 (555) 123-4567"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Website</label>
                            <input
                                name="website"
                                type="url"
                                className="form-control"
                                placeholder="https://your-company.com"
                            />
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-lg px-5 rounded-pill">
                        Save Profile
                    </button>
                </div>
            </form>
        </div>
    );
}