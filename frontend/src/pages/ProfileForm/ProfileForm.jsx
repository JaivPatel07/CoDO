import { useState } from "react";
import { submit_profile } from "../../api/user_apis";

export default function ProfileForm() {

  const [image, setImage] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const allSkills = [
    "React",
    "Next.js",
    "Vue",
    "Angular",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "Express",
    "Python",
    "Django",
    "Flask",
    "Java",
    "Spring Boot",
    "C",
    "C++",
    "C#",
    "PHP",
    "Laravel",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Firebase",
    "Docker",
    "Kubernetes",
    "AWS",
    "Git",
    "Tailwind CSS",
    "Bootstrap",
  ];

  const [selectedSkills, setSelectedSkills] = useState([]);

  const addSkill = (skill) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const removeSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter((item) => item !== skill));
  };


  const handleSubmit = async (e) => {
    e.preventDefault()

    const { firstname, lastname, email, phone, country, state, city, college, degree, school, graduation_year,
      bio, experience, preferred_role, git_link, linkedin_link
    } = e.target



    if (selectedSkills.length <= 0) {
      setError('Please Select Skilled Field!!!')
    }
    else {
      setError(null)
    }

    // console.log(image,selectedSkills,e.target.preferred_role)

    const formData = new FormData();

    formData.append("profile_pic", image);
    formData.append("firstname", firstname.value);
    formData.append("lastname", lastname.value);
    formData.append("email", email.value);
    formData.append("phone", phone.value);
    formData.append("country", country.value);
    formData.append("state", state.value);
    formData.append("city", city.value);
    formData.append("college", college.value);
    formData.append("school", school.value);
    formData.append("graduation_year", graduation_year.value);
    formData.append("bio", bio.value);
    formData.append("experience", experience.value);
    formData.append("preferred_role", preferred_role.value);
    formData.append("git_link", git_link.value);
    formData.append("linkedin_link", linkedin_link.value);

    formData.append("selectedSkills", JSON.stringify(selectedSkills));

    try {
      console.log(formData.get('selectedSkills'))
      const response = await submit_profile(formData);
      console.log(response)
      setSuccess(response.data.message)
    } catch (err) {
      console.log(err.response);
      setError(JSON.stringify(Object.values(err.response.data)[0][0]));
    }
  }

  return (
    <div className="container py-5">

      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold">Complete Your Profile</h2>
        <p className="text-muted">
          A complete profile helps you connect with developers and join
          amazing projects.
        </p>
      </div>

      <>
        {error && (
          <div style={{ textAlign: "center", color: "red" }}>
            <h3>{error}</h3>
          </div>
        )}

        {success && (
          <div style={{ textAlign: "center", color: "green" }}>
            <h3>{success}</h3>
          </div>
        )}
      </>

      <form onSubmit={handleSubmit}>

        {/* ================= BASIC INFO ================= */}

        <div className="card shadow-sm border-0 rounded-4 mb-4">
          <div className="card-body p-4">

            <h4 className="fw-bold mb-4">
              👤 Basic Information
            </h4>

            <div className="text-center mb-4">

              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : "https://placehold.co/120x120"
                }
                alt=""
                className="rounded-circle border"
                width="120"
                height="120"
              />

              <div className="mt-3">

                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />

              </div>

            </div>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label className="form-label">First Name</label>
                <input
                  className="form-control"
                  placeholder="First Name"
                  name="firstname"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Last Name</label>
                <input
                  className="form-control"
                  placeholder="Last Name"
                  name="lastname"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Email</label>
                <input
                  className="form-control"
                  disabled
                  value="john@gmail.com"
                  name="email"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Phone</label>
                <input
                  className="form-control"
                  placeholder="+91 xxxxxxxxxx"
                  name="phone"
                />
              </div>


            </div>

          </div>
        </div>

        {/* ================= LOCATION ================= */}

        <div className="card shadow-sm border-0 rounded-4 mb-4">
          <div className="card-body p-4">

            <h4 className="fw-bold mb-4">
              📍 Location
            </h4>

            <div className="row">

              <div className="col-md-4 mb-3">
                <label>Country</label>
                <input
                  className="form-control"
                  placeholder="India"
                  name="country"
                />
              </div>

              <div className="col-md-4 mb-3">
                <label>State</label>
                <input
                  className="form-control"
                  placeholder="Gujarat"
                  name="state"
                />
              </div>

              <div className="col-md-4 mb-3">
                <label>City</label>
                <input
                  className="form-control"
                  placeholder="Ahmedabad"
                  name="city"
                />
              </div>

            </div>

          </div>
        </div>

        {/* ================= EDUCATION ================= */}

        <div className="card shadow-sm border-0 rounded-4 mb-4">
          <div className="card-body p-4">

            <h4 className="fw-bold mb-4">
              🎓 Education
            </h4>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label>College / University</label>
                <input
                  className="form-control"
                  placeholder="ABC Engineering College"
                  name="college"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Degree</label>
                <input
                  className="form-control"
                  placeholder="B.Tech Computer Engineering"
                  name="degree"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>School</label>
                <input
                  className="form-control"
                  placeholder="XYZ High School"
                  name="school"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Graduation Year</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="2026"
                  name="graduation_year"
                />
              </div>

            </div>

          </div>
        </div>

        {/* ================= PROFESSIONAL ================= */}

        <div className="card shadow-sm border-0 rounded-4 mb-4">
          <div className="card-body p-4">

            <h4 className="fw-bold mb-4">
              💻 Developer Profile
            </h4>

            <div className="mb-3">
              <label>Bio</label>

              <textarea
                rows="4"
                className="form-control"
                placeholder="Tell us about yourself..."
                name="bio"
              ></textarea>
            </div>

            {/* ================= SKILLS ================= */}

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Skills
              </label>

              <select
                className="form-select"
                onChange={(e) => {
                  addSkill(e.target.value);
                  e.target.value = "";
                }}
              >
                <option value="">Select a Skill</option>

                {allSkills
                  .filter((skill) => !selectedSkills.includes(skill))
                  .map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
              </select>

              <div className="mt-3 d-flex flex-wrap gap-2">

                {selectedSkills.length === 0 && (
                  <span className="text-muted">
                    No skills selected.
                  </span>
                )}

                {selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="badge rounded-pill bg-primary d-flex align-items-center"
                    style={{
                      fontSize: "15px",
                      padding: "10px 14px",
                    }}
                  >
                    {skill}

                    <button
                      type="button"
                      className="btn-close btn-close-white ms-2"
                      style={{
                        fontSize: "8px",
                      }}
                      onClick={() => removeSkill(skill)}
                    ></button>
                  </span>
                ))}

              </div>
            </div>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label>Experience Level</label>

                <select className="form-select" name="experience">
                  <option>Student</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Professional</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Preferred Role</label>

                <select className="form-select" name="preferred_role">
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>Full Stack Developer</option>
                  <option>UI/UX Designer</option>
                  <option>Mobile Developer</option>
                  <option>AI / ML Engineer</option>
                </select>
              </div>

            </div>

          </div>
        </div>

        {/* ================= LINKS ================= */}

        <div className="card shadow-sm border-0 rounded-4 mb-4">
          <div className="card-body p-4">

            <h4 className="fw-bold mb-4">
              🔗 Professional Links
            </h4>

            <div className="mb-3">
              <label>GitHub</label>
              <input
                className="form-control"
                placeholder="https://github.com/username"
                name="git_link"
              />
            </div>

            <div className="mb-3">
              <label>LinkedIn</label>
              <input
                className="form-control"
                placeholder="https://linkedin.com/in/username"
                name="linkedin_link"
              />
            </div>
          </div>
        </div>

        {/* ================= SUBMIT ================= */}

        <div className="text-center">

          <button type="submit" className="btn btn-primary btn-lg px-5 rounded-pill">
            Save Profile
          </button>

        </div>

      </form>

    </div>
  );
}