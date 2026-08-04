import { useState, useEffect, useRef } from 'react'
import './App.css'

function Reveal({ children }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal${visible ? ' visible' : ''}`}>
      {children}
    </div>
  )
}

const projects = [
  {
    title: 'Trip Planner',
    desc: 'A travel planning app for browsing tourist attractions, saving favorites, and organizing your upcoming trips.',
    tech: ['HTML/CSS', 'Vanilla JS', 'LocalStorage'],
    github: 'https://github.com/Caelusary/trip-planner',
    demo: 'https://trip-planner-nine-opal.vercel.app',
  },
  {
    title: 'Weather Dashboard',
    desc: 'An interactive weather dashboard with live maps, 5-day forecasts, and dynamic time-of-day backgrounds.',
    tech: ['Vanilla JS', 'OpenWeatherMap API', 'Leaflet/OSM'],
    github: 'https://github.com/Caelusary/weather-dashboard',
    demo: 'https://caelusary.github.io/weather-dashboard/',
  },
  {
    title: 'Twogether',
    desc: 'A full-stack couples app for mood tracking, playful mini-games, and shared photo memories.',
    tech: ['Vanilla JS', 'Supabase', 'PostgreSQL'],
    github: 'https://github.com/Caelusary/twogether',
    demo: 'https://zach-to-girlfriend.vercel.app/',
  },
]

const feedbackText = {
  name: 'Please enter your name.',
  email: 'Please enter a valid email address.',
  subject: 'Please enter a subject.',
  message: 'Please enter a message.',
}

function App() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState({ name: null, email: null, subject: null, message: null })
  const [sent, setSent] = useState(false)
  const [fading, setFading] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme')
    return stored ? stored : 'dark'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setStatus((prev) => ({ ...prev, [name]: e.target.checkValidity() ? 'valid' : 'invalid' }))
  }

  const fieldClass = (field) =>
    status[field] === 'invalid' ? 'is-invalid' : status[field] === 'valid' ? 'is-valid' : ''

  const handleSubmit = (e) => {
    e.preventDefault()
    const fields = e.target.querySelectorAll('input[required], textarea[required]')
    const newStatus = {}
    let allValid = true
    fields.forEach((field) => {
      const valid = field.checkValidity()
      newStatus[field.name] = valid ? 'valid' : 'invalid'
      if (!valid) allValid = false
    })
    setStatus((prev) => ({ ...prev, ...newStatus }))
    if (!allValid) return

    const body = `From: ${form.name} (${form.email})\n\n${form.message}`
    const mailto = `mailto:zacharyscottruiz@gmail.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto

    setForm({ name: '', email: '', subject: '', message: '' })
    setStatus({ name: null, email: null, subject: null, message: null })

    setSent(true)
    setFading(false)
    setTimeout(() => setFading(true), 4400)
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <>
      <nav className="navbar">
        <a href="#about" className="logo">
          <span className="logo-mark">ZS</span> Zachary Scott
        </a>

        <button
          className="nav-toggle"
          onClick={() => setNavOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={navOpen}
        >
          <i className={`fa-solid ${navOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>

        <div className={`nav-links${navOpen ? ' open' : ''}`}>
          <a href="#about" onClick={() => setNavOpen(false)}>About</a>
          <a href="#projects" onClick={() => setNavOpen(false)}>Projects</a>
          <a href="#contact" onClick={() => setNavOpen(false)}>Contact</a>
          <button
            className="dark-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            aria-pressed={theme === 'dark'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      <Reveal>
        <section id="about" className="section">
          <h1>About Me</h1>
          <div className="card about-card">
            <p>
              I'm a 3rd year BS Computer Science student who enjoys turning ideas
              into clean, functional web experiences. I love working across the
              stack — from crafting responsive interfaces to wiring up APIs and
              databases — and I'm always looking for the next interesting
              problem to solve.
            </p>
            <div className="badges">
              {['Java', 'Python', 'JavaScript', 'SQL', 'PostgreSQL', 'Supabase', 'Git & GitHub'].map((skill) => (
                <span className="badge" key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="projects" className="section">
          <h2>Projects</h2>
          <div className="project-grid">
            {projects.map((p) => (
              <div className="card project-card" key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="badges">
                  {p.tech.map((t) => (
                    <span className="badge" key={t}>{t}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a href={p.github} target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-github"></i> GitHub
                  </a>
                  <a href={p.demo} target="_blank" rel="noopener noreferrer" className="demo-link">
                    Live Demo
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="contact" className="section">
          <h2>Contact Me</h2>
          <div className="card contact-card">
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="name">Your Name</label>
              <input
                type="text" id="name" name="name" placeholder="Enter your name"
                className={fieldClass('name')}
                value={form.name} onChange={handleChange} onBlur={handleChange} required
              />
              {status.name === 'invalid' && <p className="invalid-feedback">{feedbackText.name}</p>}

              <label htmlFor="email">Your Email</label>
              <input
                type="email" id="email" name="email" placeholder="Enter your email"
                className={fieldClass('email')}
                value={form.email} onChange={handleChange} onBlur={handleChange} required
              />
              {status.email === 'invalid' && <p className="invalid-feedback">{feedbackText.email}</p>}

              <label htmlFor="subject">Subject</label>
              <input
                type="text" id="subject" name="subject" placeholder="Enter subject"
                className={fieldClass('subject')}
                value={form.subject} onChange={handleChange} onBlur={handleChange} required
              />
              {status.subject === 'invalid' && <p className="invalid-feedback">{feedbackText.subject}</p>}

              <label htmlFor="message">Message</label>
              <textarea
                id="message" name="message" rows="5" placeholder="Enter your message"
                className={fieldClass('message')}
                value={form.message} onChange={handleChange} onBlur={handleChange} required
              ></textarea>
              {status.message === 'invalid' && <p className="invalid-feedback">{feedbackText.message}</p>}

              <button type="submit">Send Message</button>

              {sent && (
                <div className={`alert alert-success${fading ? ' fading' : ''}`} role="alert" aria-live="polite">
                  <i className="fa-solid fa-circle-check"></i> Your message has been sent successfully!
                </div>
              )}
            </form>

            <div className="contact-divider"></div>

            <p className="contact-list-heading">Or find me here</p>
            <ul className="contact-list">
              <li>
                <a href="https://github.com/Caelusary" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-github"></i> GitHub
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/zacharyscott.ruiz" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-facebook"></i> Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/definitely_notzach" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-instagram"></i> Instagram
                </a>
              </li>
            </ul>
          </div>
        </section>
      </Reveal>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Zachary Scott D. Ruiz. All Rights Reserved.</p>
      </footer>
    </>
  )
}

export default App