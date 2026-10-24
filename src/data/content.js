// Poin tunggal sumber konten untuk seluruh situs.
// Menambah bahasa Inggris nanti = buat portfolio.en.json, lalu:
//   const content = { id: idContent, en: enContent }
//   export default content[LOCALE]
// dan ganti nilai LOCALE (atau ubah jadi state preferensi pengguna).
import id from './portfolio.json'

const LOCALE = 'id'
const content = { id }

export default content[LOCALE]
