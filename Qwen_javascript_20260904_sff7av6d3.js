import { useState, useEffect, useRef } from 'react'
import { supabase } from './lib/supabaseClient'
import { 
  Users, Crown, ShieldCheck, Copy, CheckCircle2, AlertTriangle,
  MessageCircle, Send, LogOut, Settings, CreditCard, History,
  FileText, Phone, Mail, Lock, Eye, EyeOff, Upload, X
} from 'lucide-react'

// Constantes
const MAX_TRANSACTION = 1000000
const INITIAL_FLOAT = 500000
const AGENT_COMMISSION_RATE = 0.35
const DEMO_PIN = "1234"

// Couleurs
const COLORS = {
  gold: '#E8A93B',
  goldSoft: '#F4C87C',
  teal: '#2BBF8A',
  dark: '#1B2A41',
  darkSoft: '#2A3F5F',
  danger: '#E2685E',
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  surface: '#243447',
  surfaceLine: '#334155',
  bgSoft: '#1E293B'
}

// Données de démo
const PAST_DAYS = [
  { day: "Lun", volume: 420000 },
  { day: "Mar", volume: 380000 },
  { day: "Mer", volume: 510000 },
  { day: "Jeu", volume: 460000 },
  { day: "Ven", volume: 610000 },
  { day: "Sam", volume: 705000 },
]

// FAQ
const FAQ_ITEMS = [
  {
    q: "Comment envoyer une transaction ?",
    a: "Connecte-toi, choisis le réseau, entre le numéro et le montant, puis confirme. Un ticket est généré automatiquement."
  },
  {
    q: "Que faire si une transaction échoue ?",
    a: "Vérifie ton solde et le numéro du destinataire. Si le problème persiste, contacte le support."
  }
]

// Fonctions utilitaires
function formatFCFA(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

function generateAgencyCode(name) {
  const base = (name || "AG").replace(/[^A-Za-z]/g, "").toUpperCase().slice(0, 3) || "AGC"
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${base}-${rand}`
}

// Composant principal
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [agent, setAgent] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [floatBalance, setFloatBalance] = useState(INITIAL_FLOAT)
  const [todayCommission, setTodayCommission] = useState(0)
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // ... (continue avec tout ton code existant)
  
  return (
    <div className="min-h-screen bg-dark">
      {/* Ton interface complète */}
    </div>
  )
}