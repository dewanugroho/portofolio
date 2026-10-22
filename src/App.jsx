import { useState } from 'react'
import { Code2, Mail, ExternalLink, Layout, Server, BrainCircuit, Briefcase, GraduationCap, Award, ChevronRight, X, Wrench } from 'lucide-react'

export default function App() {
  const [modalImage, setModalImage] = useState(null)

  const projects = [
    {
      title: "Fullstack POS & Financial Analytics",
      description: "Sistem kasir berbasis web dengan dasbor analitik keuangan real-time untuk usaha kuliner. Dibangun dengan autentikasi JWT, integrasi pembayaran QRIS melalui Midtrans, dan reverse proxy Nginx pada VPS mandiri.",
      tech: ["React", "FastAPI", "SQLite", "Tailwind", "Midtrans", "VPS"],
      link: "https://dimsumgembul.my.id",
      github: "https://github.com/dewanugroho/dimsum-pos",
      type: "Fullstack",
      status: null
    },
    {
      title: "NLP Chatbot dengan Rasa Framework",
      description: "Chatbot berbasis pemrosesan bahasa alami (NLP) untuk deteksi intent dan entity pada skenario respons otomatis. Dikembangkan sebagai bagian dari riset skripsi mengenai otomatisasi layanan pelanggan UMKM.",
      tech: ["Python", "Rasa Framework", "NLP"],
      link: "#",
      github: "https://github.com/dewanugroho/Chatbot-Rasa",
      type: "AI / Backend",
      status: null
    },
    {
      title: "Virtual Agent dengan Google Dialogflow",
      description: "Agen virtual untuk otomatisasi layanan pelanggan menggunakan Google Dialogflow, digunakan sebagai pembanding performa terhadap Rasa Framework dalam riset skripsi.",
      tech: ["Python", "Dialogflow", "Google Cloud", "NLP"],
      link: "#",
      github: "https://github.com/dewanugroho/Chatbot-Dialogflow",
      type: "AI / Cloud",
      status: null
    },
    {
      title: "Automated Video Content Clipper",
      description: "Automation berbasis Python untuk memotong video panjang menjadi cuplikan pendek yang siap diunggah ke media sosial.",
      tech: ["Python", "OpenCV", "Automation"],
      link: "#",
      github: "https://github.com/dewanugroho/auto-clip-video",
      type: "Scripting / Tools",
      status: "Work in Progress"
    },
    {
      title: "Kedai Kopi Nuansa",
      description: "Sistem manajemen dan pemesanan digital untuk kedai kopi lokal dengan antarmuka yang responsif.",
      tech: ["Web Development", "Frontend", "UI/UX"],
      link: "#",
      github: "https://github.com/dewanugroho/kedai_kopi_nuansa",
      type: "Web App",
      status: "Work in Progress"
    }
  ]

  const experiences = [
    {
      role: "Pemilik & Pengembang Sistem",
      company: "Dimsum Gembul",
      period: "2025 - Sekarang",
      icon: <Briefcase className="text-blue-500" size={24} />,
      description: "Merancang dan mengembangkan sistem Point of Sales (POS) berbasis web untuk operasional bisnis kuliner, mencakup pencatatan transaksi, dasbor analitik keuangan, dan integrasi pembayaran QRIS. Turut mengelola operasional produksi dan perencanaan kebutuhan alat."
    },
    {
      role: "Mahasiswa Informatika",
      company: "Universitas Sahid Surakarta",
      period: "2022 - Sekarang",
      icon: <GraduationCap className="text-emerald-500" size={24} />,
      description: "Menjalankan tugas akhir (skripsi) yang membandingkan Google Dialogflow dan Rasa Framework untuk otomatisasi chatbot layanan pelanggan UMKM, mencakup perancangan alur percakapan, pelatihan model, dan evaluasi performa."
    }
  ]

  const certifications = [
    { title: "USAHID Elite (English Language Integrated-Test) - Universitas Sahid Surakarta", image: "/sertifikat-usahid.jpg" },
    { title: "IBM SkillsBuild University Education: AI Agent for Programming - Hacktiv8 Indonesia", image: "/sertifikat-hacktiv8.jpg" }
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-blue-200">

      {/* Modal Gambar */}
      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm" onClick={() => setModalImage(null)}>
          <div className="relative max-w-4xl w-full flex justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setModalImage(null)}
              className="absolute -top-10 right-0 md:-right-10 text-white hover:text-blue-400 bg-slate-800/50 p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <img src={modalImage} alt="Detail" className="max-h-[85vh] w-auto rounded-xl shadow-2xl object-contain bg-slate-900" />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative bg-slate-900 text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-slate-900 to-slate-900"></div>
        <div className="relative max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <p className="text-blue-400 font-semibold text-sm mb-4 tracking-wide">
              Terbuka untuk kesempatan magang
            </p>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Dewa Bintang Nugroho</h1>
            <h2 className="text-xl md:text-2xl text-slate-300 font-light mb-6">Mahasiswa Informatika & Fullstack Developer</h2>
            <p className="text-slate-400 leading-relaxed mb-8 text-lg max-w-2xl mx-auto md:mx-0">
              Mahasiswa Informatika di Universitas Sahid Surakarta dengan pengalaman membangun sistem fullstack, mulai dari perancangan backend, integrasi pembayaran, hingga deployment mandiri di VPS. Saat ini menjalankan usaha kuliner Dimsum Gembul sekaligus menyelesaikan riset skripsi tentang chatbot berbasis NLP.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <a href="mailto:dewanugroho004@gmail.com" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-colors">
                <Mail size={20} /> Hubungi Saya
              </a>
              <a href="https://github.com/dewanugroho" target="_blank" rel="noreferrer" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-colors border border-slate-600">
                <Code2 size={20} /> GitHub
              </a>
            </div>
          </div>
          <div
            onClick={() => setModalImage('/foto_formal.jpg')}
            className="w-56 h-56 md:w-72 md:h-72 rounded-full border-4 border-slate-700 overflow-hidden shadow-2xl relative group cursor-pointer"
            title="Klik untuk memperbesar"
          >
            <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-10 flex items-center justify-center">
               <span className="opacity-0 group-hover:opacity-100 text-white font-semibold drop-shadow-md transition-opacity">Perbesar</span>
            </div>
            <img src="/foto_formal.jpg" alt="Dewa Bintang Nugroho" className="w-full h-full object-cover bg-slate-800" />
          </div>
        </div>
      </header>

      {/* Tech Stack */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-10 justify-center md:justify-start">
            <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
            <h3 className="text-3xl font-black text-slate-800">Tech Stack & Tools</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center gap-4 text-center">
              <div className="p-4 bg-blue-100 rounded-full"><Layout className="text-blue-600" size={32}/></div>
              <div><h4 className="font-bold text-lg text-slate-700">Frontend</h4><p className="text-sm text-slate-500 mt-1">React, Tailwind CSS, Vite</p></div>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center gap-4 text-center">
              <div className="p-4 bg-green-100 rounded-full"><Server className="text-green-600" size={32}/></div>
              <div><h4 className="font-bold text-lg text-slate-700">Backend & DB</h4><p className="text-sm text-slate-500 mt-1">Python, FastAPI, MySQL, SQLite</p></div>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center gap-4 text-center">
              <div className="p-4 bg-purple-100 rounded-full"><BrainCircuit className="text-purple-600" size={32}/></div>
              <div><h4 className="font-bold text-lg text-slate-700">AI & NLP</h4><p className="text-sm text-slate-500 mt-1">Rasa, Dialogflow, Langflow</p></div>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center gap-4 text-center">
              <div className="p-4 bg-orange-100 rounded-full"><Wrench className="text-orange-600" size={32}/></div>
              <div><h4 className="font-bold text-lg text-slate-700">DevOps & Tools</h4><p className="text-sm text-slate-500 mt-1">Git, Docker, Nginx, Linux VPS</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience & Certifications */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Timeline Kiri */}
          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-1 bg-emerald-500 rounded-full"></div>
              <h3 className="text-3xl font-black text-slate-800">Pengalaman</h3>
            </div>
            <div className="space-y-8">
              {experiences.map((exp, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
                      {exp.icon}
                    </div>
                    {idx !== experiences.length - 1 && <div className="w-px h-full bg-slate-200 mt-4"></div>}
                  </div>
                  <div className="pb-4">
                    <span className="text-sm font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">{exp.period}</span>
                    <h4 className="text-xl font-bold mt-4 mb-1 text-slate-800">{exp.role}</h4>
                    <h5 className="text-slate-600 font-medium mb-3">{exp.company}</h5>
                    <p className="text-slate-600 leading-relaxed text-sm">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sertifikasi Kanan */}
          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-1 bg-amber-500 rounded-full"></div>
              <h3 className="text-3xl font-black text-slate-800">Sertifikasi & Pelatihan</h3>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="space-y-6">
                {certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    onClick={() => setModalImage(cert.image)}
                    className="flex gap-4 items-start group cursor-pointer hover:bg-slate-50 p-2 -ml-2 rounded-xl transition-colors"
                    title="Klik untuk melihat sertifikat"
                  >
                    <div className="mt-1 bg-amber-100 p-2 rounded-lg text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors shrink-0">
                      <Award size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 leading-relaxed group-hover:text-blue-600 transition-colors">{cert.title}</p>
                      <span className="text-xs text-slate-400 font-medium">Lihat Dokumen Resmi ↗</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-20 px-6 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-10 justify-center md:justify-start">
            <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
            <h3 className="text-3xl font-black text-slate-800">Portofolio Proyek</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full group">
                <div className="flex justify-between items-start mb-6 gap-2">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-bold bg-blue-50 text-blue-600 px-4 py-2 rounded-full border border-blue-100">{project.type}</span>
                    {project.status && (
                      <span className="text-xs font-bold bg-amber-50 text-amber-600 px-4 py-2 rounded-full border border-amber-100">{project.status}</span>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {project.github !== "#" && (
                      <a href={project.github} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 text-slate-400 hover:bg-slate-800 hover:text-white rounded-full transition-colors" title="Source Code">
                        <Code2 size={18} />
                      </a>
                    )}
                    {project.link !== "#" && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="p-2 bg-blue-50 text-blue-500 hover:bg-blue-600 hover:text-white rounded-full transition-colors" title="Live Demo">
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>
                <h4 className="text-2xl font-bold mb-4 text-slate-800">{project.title}</h4>
                <p className="text-slate-600 mb-8 leading-relaxed flex-grow text-sm">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech.map((t, i) => (
                    <span key={i} className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-medium text-sm">&copy; 2026 Dewa Bintang Nugroho.</p>
          <div className="flex gap-4">
            <span className="text-sm flex items-center gap-1 hover:text-white transition-colors cursor-pointer">React <ChevronRight size={14}/></span>
            <span className="text-sm flex items-center gap-1 hover:text-white transition-colors cursor-pointer">Tailwind CSS <ChevronRight size={14}/></span>
            <span className="text-sm flex items-center gap-1 hover:text-white transition-colors cursor-pointer">Vite <ChevronRight size={14}/></span>
          </div>
        </div>
      </footer>
    </div>
  )
}
  