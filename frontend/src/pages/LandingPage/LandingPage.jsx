import { Link } from "react-router-dom";
import "./LandingPage.css";
import { FaUserGraduate, FaBuilding } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome to CoDO</h1>
        <p className="subtitle">
          Choose how you want to continue and start exploring opportunities.
        </p>

        <div className="card-wrapper">
          <div className="option-card">
            <div className="icon student">
              <FaUserGraduate />
            </div>

            <h2>Continue as Student</h2>

            <p>
              Discover teammates, projects, hackathons, internships, and build
              your professional profile.
            </p>

            <button className="student-btn">
              <Link to="/signup">Continue as Student</Link>
            </button>
          </div>

          <div className="option-card">
            <div className="icon organization">
              <FaBuilding />
            </div>

            <Link to="/organization"><h2>Continue as Organization</h2></Link>

            <p>
              Hire talented students, post opportunities, host events, and grow
              your community with CoDO.
            </p>

            <button className="organization-btn">
              Continue as Organization
            </button>
          </div>
        </div>
        <Link to='/login'><button style={{margin:'40px', padding:'10px 20px', border:'none',borderRadius:'20px',backgroundColor:'green'}}>Already Have Account</button></Link>
      </div>

    </div>
  );
}
