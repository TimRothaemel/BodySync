// debug-env.js
import dotenv from 'dotenv'

// Prüfe .env Pfad
const result = dotenv.config()
console.log('dotenv config result:', result)

// Alle geladenen Variablen anzeigen
console.log('Geladene env Variablen:', {
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseKey: process.env.VITE_SUPABASE_ANON_KEY ? '***' + process.env.VITE_SUPABASE_ANON_KEY.slice(-10) : 'Nicht gefunden'
})