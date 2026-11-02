// Skema validasi seluruh konten situs dengan Zod.
// Dijalankan oleh scripts/validate-content.mjs saat build dan di CI.
// File ini TIDAK diimpor aplikasi, supaya Zod tidak ikut masuk bundle browser.
import { z } from 'zod'

const nonEmpty = z.string().trim().min(1)
// URL kosong diperbolehkan (field opsional yang belum terisi).
const url = z.union([z.literal(''), z.url()])
// Item yang klaimnya belum diverifikasi pemilik portofolio.
// Hanya tampil di situs bila verified diubah menjadi true.
const unverifiedItem = z.object({
  name: nonEmpty,
  verified: z.boolean(),
})

const siteSchema = z.strictObject({
  name: nonEmpty,
  role: nonEmpty,
  summary: nonEmpty,
  status: z.string(),
  email: nonEmpty,
  github: url,
  linkedin: url,
  cv: z.string(),
})

const uiSchema = z.strictObject({
  skipLink: nonEmpty,
  nav: z.array(z.object({ label: nonEmpty, href: nonEmpty })).min(1),
  hero: z.object({
    primaryCta: nonEmpty,
    secondaryCta: nonEmpty,
    cvCta: nonEmpty,
    emailLink: nonEmpty,
  }),
  palette: z.object({
    label: nonEmpty,
    hint: nonEmpty,
    placeholder: nonEmpty,
    empty: nonEmpty,
    copyEmail: nonEmpty,
    copied: nonEmpty,
    copyFailed: nonEmpty,
    toggleTheme: nonEmpty,
    openGithub: nonEmpty,
  }),
  posDemo: z.object({
    title: nonEmpty,
    badge: nonEmpty,
    note: nonEmpty,
    menuLabel: nonEmpty,
    cartLabel: nonEmpty,
    empty: nonEmpty,
    total: nonEmpty,
    addItem: nonEmpty,
    removeItem: nonEmpty,
    pay: nonEmpty,
    payTitle: nonEmpty,
    payNote: nonEmpty,
    confirmPay: nonEmpty,
    cancel: nonEmpty,
    success: nonEmpty,
    done: nonEmpty,
    close: nonEmpty,
    trendLabel: nonEmpty,
    trendNote: nonEmpty,
  }),
  sections: z.object({
    projects: nonEmpty,
    skills: nonEmpty,
    education: nonEmpty,
    experience: nonEmpty,
    certifications: nonEmpty,
    contact: nonEmpty,
  }),
  projects: z.object({
    code: nonEmpty,
    demo: nonEmpty,
    roleLabel: nonEmpty,
    resultsLabel: nonEmpty,
  }),
  certifications: z.object({ view: nonEmpty, modalLabel: nonEmpty, close: nonEmpty }),
  contact: z.object({ lead: z.string() }),
  footer: z.object({ note: nonEmpty }),
})

const projectSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/, 'id hanya boleh huruf kecil, angka, dan tanda hubung'),
  // Menandai proyek yang punya demo interaktif tertanam di halaman.
  interactiveDemo: z.literal('pos').optional(),
  title: nonEmpty,
  context: nonEmpty,
  role: z.string(),
  tech: z.array(nonEmpty).default([]),
  techUnverified: z.array(unverifiedItem).default([]),
  results: z.array(nonEmpty).default([]),
  repo: url,
  demo: url,
  screenshot: z.string(),
  screenshotWidth: z.number().positive().optional(),
  screenshotHeight: z.number().positive().optional(),
  screenshotAlt: z.string().optional(),
})

const educationSchema = z.strictObject({
  period: nonEmpty,
  degree: nonEmpty,
  institution: nonEmpty,
  detail: z.string(),
})

const experienceSchema = z.strictObject({
  period: nonEmpty,
  role: nonEmpty,
  organization: nonEmpty,
  description: z.string(),
})

const skillsSchema = z.strictObject({
  group: nonEmpty,
  items: z.array(nonEmpty).default([]),
  itemsUnverified: z.array(unverifiedItem).default([]),
})

const certificationSchema = z.strictObject({
  title: nonEmpty,
  issuer: nonEmpty,
  image: z.string().regex(/^\//, 'image harus path absolut dari public (mis. /sertifikat.webp)'),
})

export const contentSchema = z.strictObject({
  site: siteSchema,
  ui: uiSchema,
  projects: z.array(projectSchema).min(1),
  education: z.array(educationSchema),
  experience: z.array(experienceSchema),
  skills: z.array(skillsSchema).min(1),
  certifications: z.array(certificationSchema),
})

// Data dummy untuk demo POS interaktif (bukan klaim — memang contoh).
const demoSchema = z.strictObject({
  currency: nonEmpty,
  menu: z
    .array(
      z.strictObject({
        id: z.string().regex(/^[a-z0-9-]+$/),
        name: nonEmpty,
        price: z.number().nonnegative(),
      })
    )
    .min(1),
  trend: z.array(z.number().nonnegative()).min(1),
})

// Hanya untuk pemilik situs — tidak pernah dirender di halaman publik.
export const placeholdersSchema = z.array(nonEmpty)
export { demoSchema }
