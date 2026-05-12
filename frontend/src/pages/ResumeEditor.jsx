import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useRef } from 'react'
import { useState } from 'react'

export default function ResumeEditor() {
  const previewRef = useRef()

  // Personal Information
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [github, setGithub] = useState('')

  // Professional Information
  const [skills, setSkills] = useState('')
  const [tools, setTools] = useState('')
  const [education, setEducation] = useState('')
  const [projects, setProjects] = useState('')
  const [certifications, setCertifications] = useState('')
  const [achievements, setAchievements] = useState('')

  // Download Function
  const handleResumeUpload = async (e) => {

  const file = e.target.files[0]

  if (!file) return

  const formData = new FormData()

  formData.append('resume', file)

  try {

    const response = await fetch(
      'http://127.0.0.1:8000/parse-resume',
      {
        method: 'POST',
        body: formData
      }
    )

    const data = await response.json()

    setName(data.name || '')
    setPhone(data.phone || '')
    setEmail(data.email || '')
    setSkills(data.skills || '')
    setEducation(data.education || '')
    setProjects(data.projects || '')

  } catch (error) {

    console.error(
      'Resume parsing failed',
      error
    )
  }
}
const handleDownload = async () => {
  

  const element = previewRef.current

  const canvas =
    await html2canvas(element)

  const imgData =
    canvas.toDataURL('image/png')

  const pdf =
    new jsPDF('p', 'mm', 'a4')

  const pdfWidth =
    pdf.internal.pageSize.getWidth()

  const pageHeight =
  pdf.internal.pageSize.height

const imgHeight =
  (canvas.height * pdfWidth)
  / canvas.width

  let heightLeft = imgHeight
let position = 0

pdf.addImage(
  imgData,
  'PNG',
  0,
  position,
  pdfWidth,
  imgHeight
)

heightLeft -= pageHeight

while (heightLeft > 0) {

  position =
    heightLeft - imgHeight

  pdf.addPage()

  pdf.addImage(
    imgData,
    'PNG',
    0,
    position,
    pdfWidth,
    imgHeight
  )

  heightLeft -= pageHeight
}

  pdf.save('resume.pdf')
}

  return (

    <div className="min-h-screen bg-black text-white p-8">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

  <div>

    <h1 className="text-4xl font-bold mb-8">
      Resume Editor
    </h1>    
        <input
  type="file"
  accept=".pdf"
  onChange={handleResumeUpload}
  className="mb-6"
/>

        <div className="space-y-6">

          {/* Personal Information */}

          <div className="bg-white/5 p-6 rounded-2xl space-y-4">

            <h2 className="text-2xl font-semibold">
              Personal Information
            </h2>

            <input
              type="text"
              placeholder="Enter Full Name"
              value={name}
              onChange={(e) => {

                const value =
                  e.target.value

                if (/^[A-Za-z\s]*$/.test(value)) {

                  setName(value)
                }
              }}
              className="w-full p-3 rounded-lg bg-black/30 border border-white/10"
            />

            <input
              type="text"
              placeholder="Enter 10-digit Phone Number"
              value={phone}
              maxLength={10}
              onChange={(e) => {

                const value =
                  e.target.value

                if (/^\d*$/.test(value)) {

                  setPhone(value)
                }
              }}
              className="w-full p-3 rounded-lg bg-black/30 border border-white/10"
            />

            <input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full p-3 rounded-lg bg-black/30 border border-white/10"
            />

            <input
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={linkedin}
              onChange={(e) =>
                setLinkedin(e.target.value)
              }
              className="w-full p-3 rounded-lg bg-black/30 border border-white/10"
            />

            <input
              type="url"
              placeholder="https://github.com/username"
              value={github}
              onChange={(e) =>
                setGithub(e.target.value)
              }
              className="w-full p-3 rounded-lg bg-black/30 border border-white/10"
            />

          </div>

          {/* Skills & Tools */}

          <div className="bg-white/5 p-6 rounded-2xl space-y-4">

            <h2 className="text-2xl font-semibold">
              Skills & Tools
            </h2>

            <textarea
              placeholder="Enter Technical Skills (Example: Python, React, SQL, FastAPI)"
              value={skills}
              onChange={(e) =>
                setSkills(e.target.value)
              }
              rows={4}
              className="w-full p-3 rounded-lg bg-black/30 border border-white/10"
            />

            <textarea
              placeholder="Enter Tools & Technologies (Example: GitHub, Docker, VS Code)"
              value={tools}
              onChange={(e) =>
                setTools(e.target.value)
              }
              rows={4}
              className="w-full p-3 rounded-lg bg-black/30 border border-white/10"
            />

          </div>

          {/* Education */}

          <div className="bg-white/5 p-6 rounded-2xl space-y-4">

            <h2 className="text-2xl font-semibold">
              Education
            </h2>

            <textarea
              placeholder="Enter Education Details"
              value={education}
              onChange={(e) =>
                setEducation(e.target.value)
              }
              rows={5}
              className="w-full p-3 rounded-lg bg-black/30 border border-white/10"
            />

          </div>

          {/* Projects */}

          <div className="bg-white/5 p-6 rounded-2xl space-y-4">

            <h2 className="text-2xl font-semibold">
              Projects
            </h2>

            <textarea
              placeholder="Enter Project Details"
              value={projects}
              onChange={(e) =>
                setProjects(e.target.value)
              }
              rows={6}
              className="w-full p-3 rounded-lg bg-black/30 border border-white/10"
            />

          </div>

          {/* Certifications */}

          <div className="bg-white/5 p-6 rounded-2xl space-y-4">

            <h2 className="text-2xl font-semibold">
              Certifications
            </h2>

            <textarea
              placeholder="Enter Certifications"
              value={certifications}
              onChange={(e) =>
                setCertifications(e.target.value)
              }
              rows={4}
              className="w-full p-3 rounded-lg bg-black/30 border border-white/10"
            />

          </div>

          {/* Achievements */}

          <div className="bg-white/5 p-6 rounded-2xl space-y-4">

            <h2 className="text-2xl font-semibold">
              Achievements / Awards
            </h2>

            <textarea
              placeholder="Enter Achievements / Awards"
              value={achievements}
              onChange={(e) =>
                setAchievements(e.target.value)
              }
              rows={4}
              className="w-full p-3 rounded-lg bg-black/30 border border-white/10"
            />

          </div>

          {/* Download Button */}

          <button
            onClick={handleDownload}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all p-4 rounded-xl text-lg font-semibold"
          >
            Download Resume PDF
          </button>
          </div>
          </div>
          {/* Live Resume Preview */}

<div
  ref={previewRef}
  className="bg-white text-black p-8 rounded-2xl shadow-lg"
>

  <h1 className="text-3xl font-bold">
    {name || 'Your Name'}
  </h1>

  <div className="mt-2 text-sm space-y-1">

    <p>{phone || 'Phone Number'}</p>

    <p>{email || 'Email Address'}</p>

    <p>{linkedin || 'LinkedIn URL'}</p>

    <p>{github || 'GitHub URL'}</p>

  </div>

  <hr className="my-4 border-gray-300" />

  <section className="mb-4">

    <h2 className="text-xl font-semibold mb-2">
      Skills
    </h2>

    <p className="whitespace-pre-line">
      {skills || 'Skills appear here'}
    </p>

  </section>

  <section className="mb-4">

    <h2 className="text-xl font-semibold mb-2">
      Tools
    </h2>

    <p className="whitespace-pre-line">
      {tools || 'Tools appear here'}
    </p>

  </section>

  <section className="mb-4">

    <h2 className="text-xl font-semibold mb-2">
      Education
    </h2>

    <p className="whitespace-pre-line">
      {education || 'Education appears here'}
    </p>

  </section>

  <section className="mb-4">

    <h2 className="text-xl font-semibold mb-2">
      Projects
    </h2>

    <p className="whitespace-pre-line">
      {projects || 'Projects appear here'}
    </p>

  </section>

  <section className="mb-4">

    <h2 className="text-xl font-semibold mb-2">
      Certifications
    </h2>

    <p className="whitespace-pre-line">
      {certifications || 'Certifications appear here'}
    </p>

  </section>

  <section>

    <h2 className="text-xl font-semibold mb-2">
      Achievements
    </h2>

    <p className="whitespace-pre-line">
      {achievements || 'Achievements appear here'}
    </p>

  </section>

</div>

        </div>

      </div>

    
  )
}