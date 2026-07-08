import { Link } from "react-router-dom";

export default function ProfileBanner() {
    return (
        <div className="container-fluid my-4">
            <div
                className="card border-0 shadow-sm rounded-4"
                style={{ background: "#fff" }}
            >
                <div className="card-body p-5">
                    <div className="row align-items-center">

                        {/* Left Side */}
                        <div className="col-lg-8">
                            <span className="badge bg-primary-subtle text-primary px-3 py-2 mb-3">
                                ✨ Welcome to CoDO
                            </span>

                            <h2 className="fw-bold mb-3">
                                Complete your profile
                            </h2>

                            <p className="text-muted fs-5 mb-4">
                                Add a few details about yourself to help other developers know
                                you better. It only takes a couple of minutes and unlocks more
                                features.
                            </p>

                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <div className="border rounded-3 p-3 h-100">
                                        <h6 className="fw-bold mb-1">
                                            ⏱ Takes only 2 minutes
                                        </h6>
                                        <small className="text-muted">
                                            Quick profile setup
                                        </small>
                                    </div>
                                </div>

                                <div className="col-md-6 mt-">
                                    <div className="border rounded-4 p-3 bg-light">
                                        <div className="d-flex justify-content-between mb-2">
                                            <strong>Profile Progress</strong>
                                            <span className="text-primary fw-bold">35%</span>
                                        </div>

                                        <div className="progress mb-4" style={{ height: "10px" }}>
                                            <div
                                                className="progress-bar"
                                                style={{ width: "35%" }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link to="profile" ><button className="btn btn-primary btn-lg me-3">
                                Complete Profile
                            </button>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}