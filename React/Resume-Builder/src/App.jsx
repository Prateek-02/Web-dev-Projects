import { useState } from 'react'
import html2pdf from 'html2pdf.js'
import './App.css'

function App() {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: ''
    },
    education: [{
      school: '',
      degree: '',
      year: '',
      gpa: ''
    }],
    experience: [{
      company: '',
      position: '',
      duration: '',
      description: ''
    }],
    certifications: [{
      name: '',
      issuer: '',
      date: '',
      link: ''
    }],
    technicalSkills: '',
    powerSkills: '',
    projects: [{
      name: '',
      description: '',
      technologies: '',
      link: ''
    }]
  })

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }))
  }

  const handleEducationChange = (e, index) => {
    const { name, value } = e.target
    setResumeData(prev => {
      const newEducation = [...prev.education]
      newEducation[index] = { ...newEducation[index], [name]: value }
      return { ...prev, education: newEducation }
    })
  }

  const handleExperienceChange = (e, index) => {
    const { name, value } = e.target
    setResumeData(prev => {
      const newExperience = [...prev.experience]
      newExperience[index] = { ...newExperience[index], [name]: value }
      return { ...prev, experience: newExperience }
    })
  }

  const handleCertificationChange = (e, index) => {
    const { name, value } = e.target
    setResumeData(prev => {
      const newCertifications = [...prev.certifications]
      newCertifications[index] = { ...newCertifications[index], [name]: value }
      return { ...prev, certifications: newCertifications }
    })
  }

  const handleProjectChange = (e, index) => {
    const { name, value } = e.target
    setResumeData(prev => {
      const newProjects = [...prev.projects]
      newProjects[index] = { ...newProjects[index], [name]: value }
      return { ...prev, projects: newProjects }
    })
  }

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { school: '', degree: '', year: '', gpa: '' }]
    }))
  }

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', duration: '', description: '' }]
    }))
  }

  const addCertification = () => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { name: '', issuer: '', date: '', link: '' }]
    }))
  }

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', technologies: '', link: '' }]
    }))
  }

  const downloadResume = () => {
    const element = document.querySelector('.resume-preview')
    const opt = {
      margin: 1,
      filename: `${resumeData.personalInfo.name.trim() || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }
    html2pdf().set(opt).from(element).save()
  }

  return (
    <div className="resume-maker">
      <div className="form-section">
        <h2>Resume Builder</h2>
        
        <section>
          <h3>Personal Information</h3>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={resumeData.personalInfo.name}
            onChange={handlePersonalInfoChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={resumeData.personalInfo.email}
            onChange={handlePersonalInfoChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={resumeData.personalInfo.phone}
            onChange={handlePersonalInfoChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={resumeData.personalInfo.location}
            onChange={handlePersonalInfoChange}
          />
        </section>

        <section>
          <h3>Education</h3>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="education-entry">
              <input
                type="text"
                name="school"
                placeholder="School/University"
                value={edu.school}
                onChange={(e) => handleEducationChange(e, index)}
              />
              <input
                type="text"
                name="degree"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => handleEducationChange(e, index)}
              />
              <input
                type="text"
                name="year"
                placeholder="Year"
                value={edu.year}
                onChange={(e) => handleEducationChange(e, index)}
              />
              <input
                type="text"
                name="gpa"
                placeholder="GPA"
                value={edu.gpa}
                onChange={(e) => handleEducationChange(e, index)}
              />
            </div>
          ))}
          <button onClick={addEducation}>Add Education</button>
        </section>

        <section>
          <h3>Experience</h3>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="experience-entry">
              <input
                type="text"
                name="company"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => handleExperienceChange(e, index)}
              />
              <input
                type="text"
                name="position"
                placeholder="Position"
                value={exp.position}
                onChange={(e) => handleExperienceChange(e, index)}
              />
              <input
                type="text"
                name="duration"
                placeholder="Duration"
                value={exp.duration}
                onChange={(e) => handleExperienceChange(e, index)}
              />
              <textarea
                name="description"
                placeholder="Description"
                value={exp.description}
                onChange={(e) => handleExperienceChange(e, index)}
              />
            </div>
          ))}
          <button onClick={addExperience}>Add Experience</button>
        </section>

        <section>
          <h3>Certifications</h3>
          {resumeData.certifications.map((cert, index) => (
            <div key={index} className="certification-entry">
              <input
                type="text"
                name="name"
                placeholder="Certification Name"
                value={cert.name}
                onChange={(e) => handleCertificationChange(e, index)}
              />
              <input
                type="text"
                name="issuer"
                placeholder="Issuing Organization"
                value={cert.issuer}
                onChange={(e) => handleCertificationChange(e, index)}
              />
              <input
                type="text"
                name="date"
                placeholder="Date Earned"
                value={cert.date}
                onChange={(e) => handleCertificationChange(e, index)}
              />
              <input
                type="url"
                name="link"
                placeholder="Certification Link (optional)"
                value={cert.link}
                onChange={(e) => handleCertificationChange(e, index)}
              />
            </div>
          ))}
          <button onClick={addCertification}>Add Certification</button>
        </section>

        <section>
          <h3>Projects</h3>
          {resumeData.projects.map((project, index) => (
            <div key={index} className="project-entry">
              <input
                type="text"
                name="name"
                placeholder="Project Name"
                value={project.name}
                onChange={(e) => handleProjectChange(e, index)}
              />
              <textarea
                name="description"
                placeholder="Project Description"
                value={project.description}
                onChange={(e) => handleProjectChange(e, index)}
              />
              <input
                type="text"
                name="technologies"
                placeholder="Technologies Used (e.g., React, Node.js, MongoDB)"
                value={project.technologies}
                onChange={(e) => handleProjectChange(e, index)}
              />
              <input
                type="url"
                name="link"
                placeholder="Project Link (optional)"
                value={project.link}
                onChange={(e) => handleProjectChange(e, index)}
              />
            </div>
          ))}
          <button onClick={addProject}>Add Project</button>
        </section>

        <section>
          <h3>Technical Skills</h3>
          <textarea
            name="technicalSkills"
            placeholder="Enter your technical skills (e.g., Programming Languages, Frameworks, Tools)"
            value={resumeData.technicalSkills}
            onChange={(e) => setResumeData(prev => ({ ...prev, technicalSkills: e.target.value }))}
          />
        </section>

        <section>
          <h3>Power Skills</h3>
          <textarea
            name="powerSkills"
            placeholder="Enter your power skills (e.g., Leadership, Communication, Problem Solving)"
            value={resumeData.powerSkills}
            onChange={(e) => setResumeData(prev => ({ ...prev, powerSkills: e.target.value }))}
          />
        </section>
      </div>

      <div className="preview-section">
        <div className="preview-header-actions">
          <h2 className="animate-fade-slide-down">Resume Preview</h2>
          <button onClick={downloadResume} className="download-button animate-float">
            Download PDF
          </button>
        </div>
        <div className="resume-preview">
          <div className="preview-header animate-fade-slide-down">
            <h1 className="animate-sparkle">{resumeData.personalInfo.name || 'Your Name'}</h1>
            <div className="contact-info">
              {resumeData.personalInfo.email && (
                <p className="delay-100">📧 {resumeData.personalInfo.email}</p>
              )}
              {resumeData.personalInfo.phone && (
                <p className="delay-200">📱 {resumeData.personalInfo.phone}</p>
              )}
              {resumeData.personalInfo.location && (
                <p className="delay-300">📍 {resumeData.personalInfo.location}</p>
              )}
            </div>
          </div>

          <div className="preview-education animate-fade-slide-down delay-200">
            <h3>🎓 Education</h3>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="education-item">
                <h4>{edu.school}</h4>
                <p className="degree">{edu.degree}</p>
                <p className="year-gpa">{edu.year} {edu.gpa && `• GPA: ${edu.gpa}`}</p>
              </div>
            ))}
          </div>

          <div className="preview-experience animate-fade-slide-down delay-300">
            <h3>💼 Experience</h3>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <h4>{exp.company}</h4>
                <p className="position-duration">{exp.position}  {exp.duration}</p>
                <p className="description">{exp.description}</p>
              </div>
            ))}
          </div>

          <div className="preview-certifications animate-fade-slide-down delay-400" style={{marginBottom: '2rem'}}>
            <h3>📜 Certifications</h3>
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="certification-item">
                <h4>{cert.name}</h4>
                <p className="issuer-date">{cert.issuer}  {cert.date}</p>
                {cert.link && (
                  <p className="link">🔗 <a href={cert.link} target="_blank" rel="noopener noreferrer">View Certificate</a></p>
                )}
              </div>
            ))}
          </div>

          <div className="preview-projects animate-fade-slide-down delay-400">
            <h3>🚀 Projects</h3>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="project-item">
                <h4>{project.name}</h4>
                <p className="description">{project.description}</p>
                <p className="technologies">🛠️ {project.technologies}</p>
                {project.link && (
                  <p className="link">🔗 <a href={project.link} target="_blank" rel="noopener noreferrer">{project.link}</a></p>
                )}
              </div>
            ))}
          </div>

          <div className="preview-technical-skills animate-fade-slide-down delay-500">
            <h3>⚡ Technical Skills</h3>
            <p>{resumeData.technicalSkills.split(',').map((skill, index) => (
              <span key={index} className="skill-tag">{skill.trim()}</span>
            ))}</p>
          </div>

          <div className="preview-power-skills animate-fade-slide-down delay-500">
            <h3>💪 Power Skills</h3>
            <p>{resumeData.powerSkills.split(',').map((skill, index) => (
              <span key={index} className="skill-tag">{skill.trim()}</span>
            ))}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App