import Certifications from './components/Certifications.jsx'
import Contact from './components/Contact.jsx'
import Experience from './components/Experience.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Projects from './components/Projects.jsx'
import Skills from './components/Skills.jsx'
import SkipLink from './components/SkipLink.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-accent selection:text-surface">
      <SkipLink />
      <Header />
      <main id="main-content">
        <Hero />
        <Projects />
        <Skills />
        <Experience />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
