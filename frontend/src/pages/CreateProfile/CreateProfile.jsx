import React, { useState } from "react";

const skillsList = [
  "React",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "JavaScript",
  "Machine Learning",
  "AI",
  "UI/UX",
  "Django",
  "Flutter",
  "SQL",
  "MongoDB",
];

const interestsList = [
  "Web Development",
  "App Development",
  "Competitive Programming",
  "Artificial Intelligence",
  "Cyber Security",
  "Cloud Computing",
  "Data Science",
  "Open Source",
  "Blockchain",
];

const languagesList = [
  "English",
  "Hindi",
  "Gujarati",
  "French",
  "German",
];

export default function CreateProfile() {
  const [profile, setProfile] = useState({
    image: null,
    fullName: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",

    country: "",
    state: "",
    city: "",

    school: "",
    college: "",
    degree: "",
    branch: "",
    graduationYear: "",

    status: "",
    company: "",
    jobTitle: "",
    experience: "",

    bio: "",

    linkedin: "",
    github: "",
    portfolio: "",

    availability: "",
    privacy: "Public",

    skills: [],
    interests: [],
    languages: [],
  });
                                                
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleMultiSelect = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setProfile({
      ...profile,
      [e.target.name]: values,
    });
  };

  const handleImage = (e) => {
    setProfile({
      ...profile,
      image: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(profile);

    // Send to backend
    // axios.post(...)
  };

  return (
    <div className="container py-5">

      <div className="card shadow-lg">

        <div className="card-header bg-primary text-white">
          <h3>Create Your CoDO Profile</h3>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            {/* Profile */}

            <h4 className="mb-3">Profile</h4>

            <div className="mb-3">
              <label>Profile Picture</label>
              <input
                type="file"
                className="form-control"
                onChange={handleImage}
              />
            </div>

            <hr />

            {/* Personal */}

            <h4>Personal Information</h4>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Phone</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label>Gender</label>

                <select
                  className="form-select"
                  name="gender"
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label>Date of Birth</label>

                <input
                  type="date"
                  className="form-control"
                  name="dob"
                  onChange={handleChange}
                />
              </div>

            </div>

            <hr />

            {/* Location */}

            <h4>Location</h4>

            <div className="row">

              <div className="col-md-4 mb-3">
                <label>Country</label>
                <input
                  className="form-control"
                  name="country"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label>State</label>
                <input
                  className="form-control"
                  name="state"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label>City</label>
                <input
                  className="form-control"
                  name="city"
                  onChange={handleChange}
                />
              </div>

            </div>

            <hr />

            {/* Education */}

            <h4>Education</h4>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label>School</label>
                <input
                  className="form-control"
                  name="school"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>College</label>
                <input
                  className="form-control"
                  name="college"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label>Degree</label>
                <input
                  className="form-control"
                  name="degree"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label>Branch</label>
                <input
                  className="form-control"
                  name="branch"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label>Graduation Year</label>

                <input
                  type="number"
                  className="form-control"
                  name="graduationYear"
                  onChange={handleChange}
                />
              </div>

            </div>

            <hr />

            {/* Professional */}

            <h4>Professional</h4>

            <div className="row">

              <div className="col-md-4 mb-3">

                <label>Status</label>

                <select
                  className="form-select"
                  name="status"
                  onChange={handleChange}
                >
                  <option>Select</option>
                  <option>Student</option>
                  <option>Working Professional</option>
                  <option>Freelancer</option>
                  <option>Entrepreneur</option>
                </select>

              </div>

              <div className="col-md-4 mb-3">
                <label>Company</label>
                <input
                  className="form-control"
                  name="company"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label>Job Title</label>
                <input
                  className="form-control"
                  name="jobTitle"
                  onChange={handleChange}
                />
              </div>

            </div>

            <hr />

            {/* Skills */}

            <h4>Skills</h4>

            <select
              multiple
              className="form-select mb-3"
              style={{ height: 180 }}
              name="skills"
              onChange={handleMultiSelect}
            >
              {skillsList.map((skill) => (
                <option key={skill}>{skill}</option>
              ))}
            </select>

            <hr />

            {/* Interests */}

            <h4>Interests</h4>

            <select
              multiple
              className="form-select mb-3"
              style={{ height: 180 }}
              name="interests"
              onChange={handleMultiSelect}
            >
              {interestsList.map((interest) => (
                <option key={interest}>{interest}</option>
              ))}
            </select>

            <hr />

            {/* Languages */}

            <h4>Languages</h4>

            <select
              multiple
              className="form-select mb-3"
              style={{ height: 150 }}
              name="languages"
              onChange={handleMultiSelect}
            >
              {languagesList.map((language) => (
                <option key={language}>{language}</option>
              ))}
            </select>

            <hr />

            {/* Bio */}

            <h4>About</h4>

            <textarea
              rows="5"
              className="form-control mb-3"
              name="bio"
              onChange={handleChange}
            />

            <hr />

            {/* Social */}

            <h4>Social Links</h4>

            <input
              className="form-control mb-3"
              placeholder="LinkedIn URL"
              name="linkedin"
              onChange={handleChange}
            />

            <input
              className="form-control mb-3"
              placeholder="GitHub URL"
              name="github"
              onChange={handleChange}
            />

            <input
              className="form-control mb-3"
              placeholder="Portfolio Website"
              name="portfolio"
              onChange={handleChange}
            />

            <hr />

            {/* Availability */}

            <h4>Availability</h4>

            <select
              className="form-select mb-3"
              name="availability"
              onChange={handleChange}
            >
              <option>Select</option>
              <option>Open to Work</option>
              <option>Looking for Internship</option>
              <option>Freelance</option>
              <option>Not Looking</option>
            </select>

            <h4>Privacy</h4>

            <select
              className="form-select mb-4"
              name="privacy"
              onChange={handleChange}
            >
              <option>Public</option>
              <option>Private</option>
            </select>

            <button className="btn btn-primary btn-lg w-100">
              Create Profile
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}