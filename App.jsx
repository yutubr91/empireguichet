import React, { useState, useEffect, useRef } from "react";
import bcrypt from "bcryptjs";
import {
  Wallet,
  ArrowRightLeft,
  ArrowDownCircle,
  ArrowUpCircle,
  Smartphone,
  BarChart3,
  Megaphone,
  CheckCircle2,
  Clock,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Coins,
  ShieldCheck,
  Ticket,
  LogIn,
  UserPlus,
  LogOut,
  User,
  MessageCircle,
  HelpCircle,
  Phone,
  Mail,
  Send,
  ChevronDown,
  Zap,
  Droplet,
  Car,
  Sun,
  Moon,
  QrCode,
  Copy,
  Share2,
  Users,
  Search,
  Filter,
  Crown,
  FileText,
  Table,
  Settings,
  Bell,
  KeyRound,
  Save,
  Check,
  Upload,
  FileCheck,
  AlertTriangle,
  Camera,
  MapPin,
  Calendar,
  Fingerprint,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Trash2,
  CreditCard,
  Gift,
  MessageSquare,
  Lock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
} from "recharts";
import { supabase } from "./supabaseClient";

// ===== Tarification de l'abonnement EmpireGuichet =====
const SUBSCRIPTION_PERIOD_MONTHS = 6;
const SUBSCRIPTION_PRICING = {
  agent: 2500,
  manager: 2500,
};
// Montant à afficher : on privilégie la valeur enregistrée sur l'abonnement,
// mais si elle est absente ou à 0 (abonnement pas encore créé en base, ou
// ligne créée avant la mise en place du tarif), on retombe sur le tarif
// courant du plan plutôt que d'afficher 0 FCFA.
function getSubscriptionAmount(subscription, role) {
  const fallback = SUBSCRIPTION_PRICING[role === "manager" ? "manager" : "agent"];
  return subscription?.monthly_amount || fallback;
}
const HISTORY_UNLOCK_PRICE = 200;
const REFERRAL_COMMISSION_AMOUNT = 300;
// Numéro à composer pour envoyer le paiement (à remplacer par le vrai numéro marchand)
const PAYMENT_RECEIVING_NUMBER = "+225 XX XX XX XX XX";

const DARK_COLORS = {
  bg: "#1B2A41",
  bgSoft: "#22354F",
  surface: "#2A405E",
  surfaceLine: "#3C567A",
  text: "#F1F5F9",
  textMuted: "#A8BBD2",
  gold: "#22D3EE",
  goldSoft: "#67E8F9",
  teal: "#2BBF8A",
  danger: "#E2685E",
  deposit: "#2BBF8A",
  withdraw: "#E8935A",
  transfer: "#5B9DF9",
  headerBg: "rgba(27,42,65,0.92)",
  chartGrid: "#3C567A",
};

const LIGHT_COLORS = {
  bg: "#F5F7FA",
  bgSoft: "#E9EEF3",
  surface: "#FFFFFF",
  surfaceLine: "#D6DEE7",
  text: "#101826",
  textMuted: "#5C7089",
  gold: "#0891B2",
  goldSoft: "#0E7490",
  teal: "#1D8F63",
  danger: "#C43D34",
  deposit: "#1D8F63",
  withdraw: "#C9702E",
  transfer: "#2563EB",
  headerBg: "rgba(245,247,250,0.92)",
  chartGrid: "#D6DEE7",
};

const NETWORKS = [
  { id: "mtn", name: "MTN MoMo", color: "#FFCC00", fg: "#1A1400", fee: 0.012, letter: "MTN", type: "momo" },
  { id: "orange", name: "Orange Money", color: "#FF6600", fg: "#2A0E00", fee: 0.012, letter: "OM", type: "momo" },
  { id: "moov", name: "Moov Money", color: "#0B3FA8", fg: "#F3F0E8", fee: 0.01, letter: "MV", type: "momo" },
  { id: "wave", name: "Wave", color: "#1DC8F2", fg: "#00222C", fee: 0.008, letter: "W", type: "momo" },
  { id: "djamo", name: "Djamo", color: "#7B5CFA", fg: "#F3F0E8", fee: 0.015, letter: "DJ", type: "momo" },
  { id: "crypto", name: "Crypto (USDT)", color: "#2BBF8A", fg: "#08221A", fee: 0.02, letter: "₮", type: "crypto" },
  { id: "cie", name: "CIE (Électricité)", color: "#F5A623", fg: "#052E36", fee: 0.01, letter: "CIE", type: "facture" },
  { id: "sodeci", name: "SODECI (Eau)", color: "#29B6C7", fg: "#04262B", fee: 0.01, letter: "SDC", type: "facture" },
  { id: "peage", name: "Péage (Pont HKB)", color: "#8D6E63", fg: "#F3F0E8", fee: 0.02, letter: "PG", type: "peage" },
];

const COUNTRY_CODES = [
  { code: "+225", iso: "ci", flag: "🇨🇮", name: "Côte d'Ivoire", phoneLength: 10 },
  { code: "+221", iso: "sn", flag: "🇸🇳", name: "Sénégal", phoneLength: 9 },
  { code: "+223", iso: "ml", flag: "🇲🇱", name: "Mali", phoneLength: 8 },
  { code: "+226", iso: "bf", flag: "🇧🇫", name: "Burkina Faso", phoneLength: 8 },
  { code: "+229", iso: "bj", flag: "🇧🇯", name: "Bénin", phoneLength: 10 },
  { code: "+228", iso: "tg", flag: "🇹🇬", name: "Togo", phoneLength: 8 },
  { code: "+224", iso: "gn", flag: "🇬🇳", name: "Guinée", phoneLength: 9 },
  { code: "+227", iso: "ne", flag: "🇳🇪", name: "Niger", phoneLength: 8 },
  { code: "+237", iso: "cm", flag: "🇨🇲", name: "Cameroun", phoneLength: 9 },
  { code: "+33", iso: "fr", flag: "🇫🇷", name: "France", phoneLength: 10 },
];

// Ne garde que les chiffres et tronque à la longueur attendue pour le pays sélectionné
// (ex. 10 chiffres pour la Côte d'Ivoire, indicatif pays exclu).
function sanitizePhoneDigits(raw, countryCode) {
  const digitsOnly = raw.replace(/\D/g, "");
  const maxLen = COUNTRY_CODES.find((c) => c.code === countryCode)?.phoneLength || 10;
  return digitsOnly.slice(0, maxLen);
}

function Wallet3D({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <style>{`
        @keyframes wDrop {
          0% { transform: translateY(-55px) rotate(-6deg); opacity: 0; }
          65% { transform: translateY(3px) rotate(0deg); opacity: 1; }
          80% { transform: translateY(-2px); }
          100% { transform: translateY(0); opacity: 1; }
        }
        .w-drop-cash { animation: wDrop 0.9s cubic-bezier(.34,1.56,.64,1) 0.15s both; transform-origin: 91px 49px; }
        .w-drop-card2 { animation: wDrop 0.9s cubic-bezier(.34,1.56,.64,1) 0.3s both; transform-origin: 39px 39px; }
        .w-drop-card1 { animation: wDrop 0.9s cubic-bezier(.34,1.56,.64,1) 0.45s both; transform-origin: 47px 35px; }
        @media (prefers-reduced-motion: reduce) {
          .w-drop-cash, .w-drop-card2, .w-drop-card1 { animation: none; }
        }
      `}</style>
      <defs>
        <linearGradient id="wBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8A5A28" />
          <stop offset="55%" stopColor="#6B4520" />
          <stop offset="100%" stopColor="#4A2E15" />
        </linearGradient>
        <linearGradient id="wTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A87438" />
          <stop offset="100%" stopColor="#8A5A28" />
        </linearGradient>
        <linearGradient id="wCard1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7CB8FF" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="wCard2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7CF7C4" />
          <stop offset="100%" stopColor="#1D8F63" />
        </linearGradient>
        <linearGradient id="wCash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A9E6C4" />
          <stop offset="100%" stopColor="#4FAE79" />
        </linearGradient>
        <radialGradient id="wClasp" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFE9A8" />
          <stop offset="55%" stopColor="#E8A93B" />
          <stop offset="100%" stopColor="#9C6A17" />
        </radialGradient>
        <filter id="wShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.35" />
        </filter>
      </defs>
      <ellipse cx="60" cy="106" rx="38" ry="7" fill="#000000" opacity="0.18" />
      <g filter="url(#wShadow)">
        {/* cash peeking from the side, styled like a banknote */}
        <g transform="rotate(-4 91 49)">
          <g className="w-drop-cash">
            <rect x="78" y="42" width="26" height="15" rx="2" fill="url(#wCash)" />
            <rect x="80" y="44" width="22" height="11" rx="1" fill="none" stroke="#FFFFFF" strokeWidth="0.7" opacity="0.7" />
            <circle cx="86" cy="49.5" r="3.1" fill="none" stroke="#FFFFFF" strokeWidth="0.7" opacity="0.75" />
            <circle cx="86" cy="49.5" r="1.3" fill="#FFFFFF" opacity="0.5" />
            <rect x="96" y="45.5" width="4" height="1.3" rx="0.6" fill="#FFFFFF" opacity="0.6" />
            <rect x="96" y="48" width="4" height="1.3" rx="0.6" fill="#FFFFFF" opacity="0.6" />
            <rect x="96" y="50.5" width="4" height="1.3" rx="0.6" fill="#FFFFFF" opacity="0.6" />
          </g>
        </g>
        {/* second card, mostly hidden — just a magnetic stripe hint */}
        <g transform="rotate(-10 39 39)">
          <g className="w-drop-card2">
            <rect x="16" y="24" width="46" height="30" rx="4" fill="url(#wCard2)" />
            <rect x="16" y="30" width="46" height="4.5" fill="#0B1220" opacity="0.55" />
          </g>
        </g>
        {/* front card, fully detailed like a real bank card */}
        <g transform="rotate(-2 47 35)">
          <g className="w-drop-card1">
            <rect x="24" y="20" width="46" height="30" rx="4" fill="url(#wCard1)" />
            <rect x="29" y="26" width="9" height="6.5" rx="1.4" fill="#F3D98B" stroke="#C99A3D" strokeWidth="0.4" />
            <line x1="29" y1="29.3" x2="38" y2="29.3" stroke="#C99A3D" strokeWidth="0.4" />
            <line x1="32.3" y1="26" x2="32.3" y2="32.5" stroke="#C99A3D" strokeWidth="0.4" />
            <rect x="29" y="38" width="6" height="1.6" rx="0.8" fill="#FFFFFF" opacity="0.85" />
            <rect x="37" y="38" width="6" height="1.6" rx="0.8" fill="#FFFFFF" opacity="0.85" />
            <rect x="45" y="38" width="6" height="1.6" rx="0.8" fill="#FFFFFF" opacity="0.85" />
            <rect x="53" y="38" width="6" height="1.6" rx="0.8" fill="#FFFFFF" opacity="0.85" />
            <rect x="29" y="43" width="16" height="2" rx="1" fill="#FFFFFF" opacity="0.55" />
            <circle cx="58" cy="44" r="5.5" fill="#F5D89A" opacity="0.85" />
            <circle cx="63" cy="44" r="5.5" fill="#FFFFFF" opacity="0.65" />
          </g>
        </g>
        {/* wallet body (covers the lower half of the cards, so they look tucked in) */}
        <rect x="12" y="46" width="96" height="52" rx="10" fill="url(#wBody)" />
        <rect x="12" y="46" width="96" height="16" rx="8" fill="url(#wTop)" />
        {/* bifold center crease */}
        <line x1="60" y1="46" x2="60" y2="98" stroke="#3A2410" strokeWidth="2" opacity="0.6" />
        {/* stitched border */}
        <rect x="17" y="51" width="86" height="42" rx="7" fill="none" stroke="#C9A15A" strokeWidth="1.4" strokeDasharray="2.5 3" opacity="0.7" />
        {/* snap button */}
        <circle cx="60" cy="72" r="8" fill="url(#wClasp)" />
        <circle cx="57.5" cy="69.5" r="2.1" fill="#FFFDF5" opacity="0.85" />
      </g>
    </svg>
  );
}

function Shield3D({ size = 120 }) {
  return (
    <div style={{ perspective: 500, width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 0 120 120" className="shield-spin" style={{ transformStyle: "preserve-3d" }}>
      <style>{`
        @keyframes shieldSpin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        .shield-spin { animation: shieldSpin 4.5s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .shield-spin { animation: none; }
        }
      `}</style>
      <defs>
        <linearGradient id="sBack" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#153355" />
          <stop offset="100%" stopColor="#1E4B82" />
        </linearGradient>
        <linearGradient id="sFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5B9DF9" />
          <stop offset="55%" stopColor="#2E6FE0" />
          <stop offset="100%" stopColor="#1B4CB0" />
        </linearGradient>
        <linearGradient id="sRim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE9A8" />
          <stop offset="50%" stopColor="#E8A93B" />
          <stop offset="100%" stopColor="#9C6A17" />
        </linearGradient>
        <linearGradient id="sPanel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8FBBFF" />
          <stop offset="100%" stopColor="#3D6FE0" />
        </linearGradient>
        <linearGradient id="sCheck" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7CF7C4" />
          <stop offset="100%" stopColor="#2BBF8A" />
        </linearGradient>
        <filter id="sShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#000000" floodOpacity="0.35" />
        </filter>
      </defs>
      <ellipse cx="60" cy="106" rx="30" ry="6" fill="#000000" opacity="0.18" />
      <g filter="url(#sShadow)">
        <path d="M60 12 L96 24 V56 C96 82 80 98 60 108 C40 98 24 82 24 56 V24 Z" fill="url(#sBack)" transform="translate(4,3)" opacity="0.6" />
        {/* outer metallic rim */}
        <path d="M60 8 L96 21 V54 C96 81 79 98 60 109 C41 98 24 81 24 54 V21 Z" fill="url(#sRim)" />
        {/* main blue face, inset from rim */}
        <path d="M60 13 L91 24 V53 C91 76 77 91 60 101 C43 91 29 76 29 53 V24 Z" fill="url(#sFront)" />
        {/* inner panel line */}
        <path d="M60 19 L85 28 V52 C85 72 73 85 60 94 C47 85 35 72 35 52 V28 Z" fill="none" stroke="url(#sPanel)" strokeWidth="1.6" opacity="0.7" />
        {/* rivets */}
        <circle cx="60" cy="14" r="2.4" fill="#FFE9A8" opacity="0.9" />
        <circle cx="31" cy="27" r="2" fill="#FFE9A8" opacity="0.8" />
        <circle cx="89" cy="27" r="2" fill="#FFE9A8" opacity="0.8" />
        <path
          d="M60 10 L94 22 V54 C94 80 78 96 60 106"
          fill="none"
          stroke="#BFE0FF"
          strokeWidth="2"
          opacity="0.5"
        />
        {/* checkmark shadow for bevel effect */}
        <path
          d="M46 59 L56 69 L78 45"
          fill="none"
          stroke="#0B3D2A"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
          transform="translate(0,1.5)"
        />
        <path
          d="M45 58 L55 68 L77 44"
          fill="none"
          stroke="url(#sCheck)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M45 58 L55 68 L77 44"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.4"
        />
        <ellipse cx="52" cy="28" rx="20" ry="10" fill="#FFFFFF" opacity="0.18" />
      </g>
    </svg>
    </div>
  );
}

function Chart3D({ size = 120 }) {
  const bars = [
    { x: 22, h: 30, c1: "#8FE3C0", c2: "#1D8F63" },
    { x: 46, h: 48, c1: "#7CF7C4", c2: "#2BBF8A" },
    { x: 70, h: 38, c1: "#9AF0D2", c2: "#22A876" },
    { x: 94, h: 60, c1: "#67E8B0", c2: "#189E68" },
  ];
  const dx = 7;
  const dy = -5;
  return (
    <svg width={size} height={size} viewBox="0 0 130 120">
      <defs>
        <style>{`
          @keyframes barColorCycle {
            0%, 100% { filter: hue-rotate(0deg); }
            50% { filter: hue-rotate(55deg); }
          }
          @keyframes arrowRise {
            0% { transform: translateY(64px); opacity: 0; }
            15% { opacity: 1; }
            55% { transform: translateY(0px); opacity: 1; }
            85% { transform: translateY(0px); opacity: 1; }
            100% { transform: translateY(64px); opacity: 0; }
          }
          @keyframes markerPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.55; }
          }
          .chart-bar-0 { animation: barColorCycle 3.2s ease-in-out infinite; }
          .chart-bar-1 { animation: barColorCycle 3.2s ease-in-out infinite 0.3s; }
          .chart-bar-2 { animation: barColorCycle 3.2s ease-in-out infinite 0.6s; }
          .chart-bar-3 { animation: barColorCycle 3.2s ease-in-out infinite 0.9s; }
          .chart-arrow { animation: arrowRise 2.4s ease-in-out infinite; transform-origin: 94px 32px; }
          .chart-end-marker { animation: markerPulse 2.4s ease-in-out infinite; transform-origin: 100px 26px; }
          @media (prefers-reduced-motion: reduce) {
            .chart-bar-0, .chart-bar-1, .chart-bar-2, .chart-bar-3, .chart-arrow, .chart-end-marker { animation: none; }
          }
        `}</style>
        {bars.map((b, i) => (
          <linearGradient id={`bar${i}`} key={i} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={b.c1} />
            <stop offset="100%" stopColor={b.c2} />
          </linearGradient>
        ))}
        <linearGradient id="floorGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#DDEDE4" />
          <stop offset="100%" stopColor="#B9D8C8" />
        </linearGradient>
        <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFE9A8" />
          <stop offset="100%" stopColor="#E8A93B" />
        </linearGradient>
        <filter id="cShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>
      <ellipse cx="65" cy="106" rx="46" ry="7" fill="#000000" opacity="0.16" />
      <g filter="url(#cShadow)">
        {/* floor plane for grounding */}
        <polygon points={`14,100 116,100 ${116 + dx},${100 + dy} ${14 + dx},${100 + dy}`} fill="url(#floorGrad)" opacity="0.55" />
        {bars.map((b, i) => {
          const top = 100 - b.h;
          return (
            <g key={i} className={`chart-bar-${i}`}>
              {/* side face (darker) */}
              <polygon
                points={`${b.x + 16},${top} ${b.x + 16 + dx},${top + dy} ${b.x + 16 + dx},${100 + dy} ${b.x + 16},100`}
                fill={shadeColor(b.c2, -22)}
              />
              {/* top face (lighter) */}
              <polygon
                points={`${b.x},${top} ${b.x + 16},${top} ${b.x + 16 + dx},${top + dy} ${b.x + dx},${top + dy}`}
                fill={shadeColor(b.c1, 18)}
              />
              {/* front face */}
              <rect x={b.x} y={top} width="16" height={b.h} rx="2" fill={`url(#bar${i})`} />
            </g>
          );
        })}
        <path
          d="M20 72 L44 50 L68 60 L100 26"
          fill="none"
          stroke="url(#chartLine)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path className="chart-arrow" d="M88 26 L100 26 L100 38" fill="none" stroke="url(#chartLine)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {[[20, 72], [44, 50], [68, 60]].map(([px, py], i) => (
          <circle key={i} cx={px} cy={py} r="3.2" fill="#FFFDF5" stroke="#E8A93B" strokeWidth="1.6" />
        ))}
        <circle className="chart-end-marker" cx={100} cy={26} r="3.2" fill="#FFFDF5" stroke="#E8A93B" strokeWidth="1.6" />
      </g>
    </svg>
  );
}

function FlagIcon({ iso, size = 16 }) {
  return (
    <img
      src={`https://flagcdn.com/24x18/${iso}.png`}
      alt=""
      width={size}
      height={Math.round(size * 0.75)}
      style={{ borderRadius: 2, objectFit: "cover", flexShrink: 0 }}
    />
  );
}

function KycStatusBadge({ status, colors }) {
  const map = {
    validated: { label: "Validé", bg: "rgba(43,191,138,0.14)", color: colors.deposit },
    pending: { label: "En attente", bg: "rgba(59,130,246,0.14)", color: colors.transfer },
    rejected: { label: "Refusé", bg: "rgba(232,147,90,0.14)", color: colors.withdraw },
  };
  const s = map[status] || { label: "Aucun document", bg: colors.bgSoft, color: colors.textMuted };
  return (
    <span className="text-xs px-2.5 py-1 rounded-md" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function PasswordInput({ value, onChange, placeholder, colors, className }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className || "w-full px-3.5 py-2.5 pr-11 rounded-lg text-sm outline-none"}
        style={{ background: colors.bgSoft, border: `1px solid ${colors.surfaceLine}`, color: colors.text, width: "100%" }}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: colors.textMuted }}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

function CountryDropdown({ value, onChange, showLabel, colors, width }) {
  const [open, setOpen] = useState(false);
  const current = COUNTRY_CODES.find((c) => (showLabel ? c.name === value : c.code === value)) || COUNTRY_CODES[0];
  return (
    <div style={{ position: "relative", width: width || (showLabel ? "100%" : 118), flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm w-full"
        style={{ background: colors.bgSoft, border: `1px solid ${colors.surfaceLine}`, color: colors.text }}
      >
        <FlagIcon iso={current.iso} />
        <span className="gc-mono" style={{ fontSize: 13 }}>{showLabel ? current.name : current.code}</span>
        <ChevronDown size={13} style={{ marginLeft: "auto", color: colors.textMuted }} />
      </button>
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 29 }} onClick={() => setOpen(false)} />
          <div
            className="absolute mt-1 rounded-lg overflow-hidden"
            style={{ top: "100%", left: 0, width: showLabel ? "100%" : 200, maxHeight: 240, overflowY: "auto", background: colors.surface, border: `1px solid ${colors.surfaceLine}`, zIndex: 30, boxShadow: "0 12px 30px -10px rgba(0,0,0,0.5)" }}
          >
            {COUNTRY_CODES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => { onChange(showLabel ? c.name : c.code); setOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left"
                style={{ color: colors.text, background: (showLabel ? c.name === value : c.code === value) ? colors.bgSoft : "transparent" }}
              >
                <FlagIcon iso={c.iso} />
                <span>{showLabel ? c.name : `${c.name} (${c.code})`}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const NETWORK_TYPE_LABELS = {
  momo: { field: "Numéro de téléphone", placeholder: "07 XX XX XX XX" },
  crypto: { field: "Numéro / adresse", placeholder: "T... adresse USDT" },
  facture: { field: "Numéro de compteur / référence client", placeholder: "Ex. 123456789" },
  peage: { field: "Numéro d'abonnement télépéage / plaque", placeholder: "Ex. AB 1234 CI" },
};

const FCFA_PER_USDT = 615;
const LOGO_DATA_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAFQCAYAAACSzOQVAAEAAElEQVR42uxdZ2Ac1dU9972ZraqWZEvuDXCj2piOZDChhA6SSUiAJAQCCSGdNCIrCSSQBgRITAi9SvTQi23ZYDC4YePeJFdJVm+7O/Peu9+PmV2tHJIAHxhs9iZCxavV7OzMeeede++5QCYykYlMZCITmchEJjKRiUxkIhOZyEQmMpGJz0qUl5fLzFnIRCYykYlMZCITmchEJj5gBMpPO7xCCJE5E5nYZyJzNWdibw8CgOmT88MVp4374Q3f/3I0/eeZyEQGoDORiU8pqsu9a/i4oXzQoeMKJwdz7bEAUFlZmQHoTGQAOhOZ+DSj6MpSAoCSktzTx0ycKIeOHH80AJSVZa7tTGQAOhOZ+FSjrKzMALBGjMg9FqEc5OWFzvF+PtNkzk4mMgCdiUx8SsEMIqoyp5xSWlw8OHqIjikeObrkoCIgSwhpkNGhM5EB6Exk4tOJuTNLJQAqPzZywrCBobDjSGfwsKKii744aAqzQXV5eeb6zsReHVbmFGTi/xFUCRAqAaBUlKEM/v+Bspn6fzPYGsLclTQXc1FWVquJwB/mj5fNHMioAhdl8ykhC5RIJJCXM0wcd+oXj/3zc3fNLbpyAqEm8yZlIhOZ+DyAcSVEZWWpxVwtmVlKKf4XBtuf5AExgwBkv33fF+pb/nUUt6y6zWVezW889avlACQzZxh0JjIMOhP7ZlQCYmJ1OZUXTSA5/beqqkozUGuqqmqTDwmMBQZ+89zR4XoUTZ8wYVTo4PHFxshYyaYtDWXRvCyZnRcxoUCUhJUFjSji8V6bWWutEzwgGl89ZnT2og0bGsVzL2169ve3126orISoqsL/TPBNKEeACM6PZ4yeWpzLw3tjjskyMQl0mTHjho3/4oG5hxDR4g/6fJnIRAagM/GZZ8nl5RBXTiilsplzNZEwqEhpBOHJ+Rh7+plTJg4eOeTY0QcMHpWfP2BkICj2G5QLkZcbkoGsHCAoAWHheBBYMbRy0NUVQ6K3E5271sO1emJNW3aFW1tcrGjtnvLi485XmztcZ1dnYhmADatWfbDE3rGxEmsVdjqTxkTLB2TZ3NzLRlDcgu7Wg0aNtU4/o/SU51Y8s6SsrFJUVVVlADoTe+cNmTkFmWugvByiuroa0rpAG92HZROB8V+/YtqRwyaMnFZQVFA2dFjh4OHDcmUo6AK6F3ATgNGA0nBd1l29CW5pS1BTQ7toamxSW7bs5M6urroN65tGObHEttZmPaTXxbL2TgzrdlDgMmKKEYdAwmGc1uZiJbzE9f8EVGYmIorMvfXIVZPHDxze0tjIAw7+IkVGHaFleIBc8OST84859/qTmdkhIp15mzORYdCZ2Hvki0qImTOrSVoX6Joao4kqACB86dTsg6eWHX3qmIkjThkxcsgho0bkB0TUBWJxmI5dMC11SgNgEaSYlrK1K44t25qwtX4ntm5qpJ0NbR1NTZ2JlhaT2xPX0tGIuBoIWjTUtogsC1PzBwARDcRdBOIabUQ00EgRbWtUH+jYq8vLJRHpb5488KgxI/OHx41tLDsgiGwQSED3YvDokVOPHobBBGxigAgfLgGZiUxkADoTe5wtV1eXiy996QldVaVNVVUFAORdcvSQo0/54tSzxk4cdkLJ4Oyxg4uiACegulqQ2LlFwxi2AhEhQznUSwFr+46d2LhxLW/ZXNeycVOz2L6tB+0dBrE4ogkXUQOKQHJIAAjYNNS2ATBDMyGhuNMwOuOKmh3Ni5XBAiZSTiC8EegCPgCQll/ZRFQDlB0z6uzBxbnY1SaMsEOChA1hWYREjxpxwH7Br174xVMXEN06t7LSQlWVyrz9mchIHJn4zLJlIS/QbDz14Mtj7MmnX3TajNETRpSPGjVw5MAiAyRicDq72EnEteu4QgZCCIRyia0wNbW1Y+XaTVjx7hqzaX39zm1bHaejE0YZFJJAWAoKCMFQGtAgOJphmLqI8I5ibGDmWtfIDlfp9wrasWMx4H7Ua1YIYmM4uOCu0tWTJw4b1d7NBrE2kX3AqQiPPAg61q5ldr587dFnFky/4I/HMLMgoowOnYkMg87EZyfKyyGrq6tBNEP7bLn4pm8dc/KEIyZcPm780COGFYcEehsRb99kuuoUM1lEUgrLDltWdj56EgKrNjVg+eIV5r13N4jNWzqdlhaIhEYUgoptCSksjxk7iqE1VjsGK1nwHO3iPRnhlWt2oKXviDwpuC55fIBMK1M2H4Q9V5eXi4qaGnPlWYOPHVYcHtkb11qAJRMAYQGQIMESJs5jJ0w6fPrEwHgisdr/WxktOhMZgM7EpxvV5ZDl1WyISBNV4LgiHP21715w8cGHjznvwANyC2z0Ita0BW2bejVDEJEtLMtCMBJhBMPY1Z7AyqWreMk7K1oWL92KHQ0cURpBEiSEhGVLzlMuoyeBDgbeVODXjMAr63dhFdKZcbvHeEsBOdAH3xrvc/LrDw2Y5dUACFw2ddBXSwoi1NqpOKkwEwggApGEcZQeMW6kXXHGtIteW/XSz66cXUk106oyF0cmMhJHJj4tYC6XX3rica39SoyrDy88/oxvnnzl6PGjykeNLRbo3IbuXY3acV0iaZNhEBmNQCjMOpBFjS3dWPHuCvPWgrVm9aqWnqZ2dDtM+UIgYgmvKySh0KM05iqDZxOMF+raUd8PQAHZBFCtB8IfiBV/mOuVCFyShYLn/1624YARBbkdPQwpLeJ4F3LGn4XgiEmA0wltYGR0gHjruZc3HXX6ryYIKRJGG0ImWZiJDIPOxJ6MykqI3/5WmIqaGg0AV08ffOZp5x3zg0mHjSgdXCjhtOxE5+r1SpMtRSBLUiAINi4CtoRLYWzY1kLvLFqQWPrO+vYNG+Oh7gSikBQNBJErFCPmgh0Xr2uB6h7gha0t2Jj250UpIGp9MP4kZYQ5laXyhKpaddVXJ1xywMgBefGYUFJoCzAAuwBrAAwDASGlMK4x4w49ZPRV500s/evjK1/25ZGMzJGJDIPOxB4AZkDM5GoiqtAA6OtHDvzyuRefcvXUqSWHF2U56GjYySreY8iOSmGHARYAGFY4CkUC27Y14c3XVyQWLtywc9XGuBvXKAxKyglIlgyg18VOR+FxF7hnTTMWp4NyOUA1fSx5jwRzpSCqovl3f2HJMQcOPKilLWEEsTDM4N5W5Ew4E8FRh4HdOEAWjJZKRnKsp++69/Gzv3Hz+cwsMzXRmcgw6Ex84gsrc7UgmqGrqALfPjT/qDMuO/n3Rxx7wPF52YzurZtNc3MMwraECOZIZgYn4rDDYTbBfNqyswVL3l6O2vnr3dUbu7o74sizJOWFpCcP97ioU8A/e4BZG5qxK/k3ywGRBOU97UFUXV0uBVXpKyomnjFuTNFBvQnWlmVJNtrrbCGCR97Z4x1MAJSEVjxpyqGnnDwuUgKgIdP6nYm9KTJmMntZVJeXSyEFE1XoE8I89cU/n1L989u+seDkk4cdb3eu1a3rlhultLBCYUHCAmsXljCwc7PRGAM99fQ8vvmGR3HXfUuwfE2XYIOCnCDyBBgxhdouFxfVuTjo3Qb8dkMDdpUD0r9OkvLFpwJu5eUTmAGcctzQqwsHhNh1ASEFSAqQkBBSACS8QyVvoZGCyDhxPWbShOiFX/vyd4mIy8oqM9d8JjIMOhOfqJwx4J5fnfaLo46f9N39Rweszu2bede6diOsiBR22COPRkESsczJoba4wFvzNqt5s5fsendFS3bcRdi2gWgQUmugV9PsuOY/rNqFF1OACEiUl6OmpubjTvR9BHCGBKrMJedMPHzKpIJp8e44C0HSc+wXIAmwZYOE7deIGDA0mAmseyUQ4IlTDvl2IXBLWdnMRqDqU08WMoNmzqykjE9IJjIMei+XM+ZUllpVIENUoX9z3rgvvfuvq968+NLjfjAkp8NqXrtKu3FDMpAjAQmjGMZxYVkWq+hAWrS6A3/724uJf9wxt2PhkpaIBoWzQpAWIHs1ZvcqnLZoJ5/ogzP5jJlqAF3jJdS4urpcfqq7hupyEIHPP2XE1YMHBYTjGCMEgYgghICQFoQV8AA6iX5gEAyEBJlEuz702AOzv//dM68iIsNcLT7l1yOJwBlwzkQGoPdm1lwJIaXgaVW16nCbJ86edWH11b8886Fxo8z+LavfVrH2NohwVJK0wCzAzCDSCGRnY0e3TQ8/VNt1y5+f6amdv8XEY25edohyLWIZczG/y+Dchdtw4qIGvAAvWSyxWxXGd688/VgAORUVNXrOnEoLn0JSmSsrBVBtvj3joP0Pm5R/ntOVMCApAfYkDiFAJEHCAiPdccN4UgcxjHEkBaT5wpknXD4QGASUc+WncO1XVkIwM1VU1OhB0ejAK7925hGp9SQTmcgA9N4TcypLraoqMlob+Y+rp/3swZd/unDaiSPKVct63Va/zcAKWWRZnpscMcAGgWAAjp2D1xfWu7fe8tSWh2uWtja0JETIQjggIR3NS7s1LnxzG0qXbMOT3MeYGWnAXFlZKgEgT7V/763nrl1w3XXfO2batColBO15Nj1zIhERf/HUkdeXDMwKOSrA0rKIpAUWnv5M0gKEAHOSkKbjHUFKmxBvM1OmHTzgZz+f8QMiMmVz9qgWTczVsqqKDBHRXddXnPbYY99/q6TImgQANTWZ0VyZyAD03sGaAcHMYlpVrfpihA+ee9fXF3z9R2dfPzSrLbpr7XKtjS1lMCLYMGAMjDaA0bCzc7mhC/zgQ2/03HT73LbFy1uzAjaNyLIRdgxau1lcMz+AoxZvw0OApzHTf6hbnju3FgDhqYdfjzcveXnit06OzH6p+oe/M4ZDFRU1mpmpvPyTB+rq6nIpxAz9jYpJp009ZPB5brfR0g5KIW2QsCCEBWHZIGmBpAUrFGKQ7QE0yTSRmaAVJGCZ02eccvnUsQOGlpXN1HuCRVdWllokvKTuJQfygS/c+8MXLvpOxXPbVi+NXHvjE88LIVBRUZOROjLx/it75hR8dqK6HLLiMaHBBjd/7cDvnf6VU387ekww2rJ2hTJaSBmMELObWleNciBtCzo4AO+u2MxPPbmQlq9tcySBQjbZRjPiBo+1GVyzYgs2JYH5fzWTlJbCqq2FOnKYeLI4bM781Y+P4kOPPlzWtRWsfP6FtX/59nUP/dPbmldLoookuHzcSTe/lLBCzHv6mwuPmzzg0FhjjxYE6TFlb9fgXcIEZRL87Ivb6Nzvz4Rtx1OJwtQFzgxmoUWkQNbc+cBTFd/8yznMcyyiaZ+Iy51nUMXwTZpyHrju1F8efcr0q0cddnRgzZyH3XPPuGVTzA5dVtcen+fLS5n67ExkGPRnNZjLZUUNdAGbA5679SsvXXHtJX8pzm6N7lz+jjZkWWQHyBg3iUcwRsGOZqHTZOHxJxfyTX99LbZsVZvOCsLOCsB2Fa/v0Th3Xh3KV2zBplKvYoc+UKdfbfKYqK65G3T34xvMzo0b9WC9cuLFM/a7c/FLNz73nROmHkdUoUkQCyH4417wmcsFUYW+8Zen/OTow0oOdVviStoBibTSOhISzAbBiI11Gxrpppterl/++mtMwSIY3f9legfIEk6vPvWck87+2SXHnEs0TVVXV8uP/71kqqoShojMb7409opVr/zy3Qt/9M0fj5pwgJVoXMYP3ff0fU29WJoX1R2f0OKWiQxAZ+Ljeg+86SA1+nvHZX/x5ccuXXjauRO/0L3xLdXZ0MhWKFeCGWDlAzPAbCCjA7Bhu4O//f0lPFyzhDp73EBOhKRhUK/G7fUSU96ox5PJOuZaQH1YIFCaGixL0DtLd+HVhQ2yx2XTtWmBPmxw42k/veGieS88+Ns/24bHG2MKqqurA0T0sQBNZSWEEI/pv11XPuHC8kN+SrE2Y2BJzwtJQAjpJQeFhLSk0SaBp596++2FrfLHj97xN4q17WBI22fYAFiDYECkoZ0uysqPmouuunjWzZWnDC0vLzfM/HEsLFRdXS4vvrgyRETy9BJz7Ly7Ln3pR7f87vbx08tGut0JhYDAy4+/ov5yT/36QQMs2R1zN/uLWgagM5EB6M9alJdDCikMEeGWbxz0+5/8/rJnJ02M5jYufV1rzZYVChPYq+c1ALTjAlKCsgox740NuOmPT2PBwm0cCZLJC8KKKV7brvCF2Rvx7Q0b0JkmZ3wojdP31SBbqgcMeAcRyedeeM+09SREIL9YNm7dqHN73+BTSnO+v2jeP+ZXXjHjZxUVFYcwc74Pdv8vwJs4EcTMaFrx5o97Nm3I0laeIXKJ4LklgTxwNiwQGFDAL7/4Lj/01K4/FkZtUTt/x8KXH7yTZChsjNIg1t7iZhRgXJDpERBa56qWws1vr7yciHjuzDL5/30fmRkVFTX63nurht/+wxNu/9uzf33luK9d+oVQ1gCl2tqMHSmQrfVbxC03P9uQFxUVBL5/Qys6/XswA9CZyAD0ZynmVJZaNTWkjTYFj8z8wpxvXXPeNRFu1s3r1rMM5khICQb7dy6BXQdWJIoeHcIjD87B7bPmYHNjr86KEIFZdDm4dUUHDl+4Ga+Uln4IOeP9w5QD4q1t2B53+Hs5YYimxoR5c2EdQlELIhCVCS2oY02tOnDAmoLKyhk/nP3EX+86/agDv0REOSDiysrKj9wEddttHsDPmb8tdtPvnuKN63bAjkTBRnn/IBhsNEK5Obq9qV0++uiS2g1O+M2isFmypjn7qzX3P7O6cc0qYUWzjVY9YJMATBzsdkKEbGx+80363iU/5+cX7MgGCLdX1X5UgKQ5cyqtmhpoIpK/Kd//ivdeuvZfV9xQ+c2hhx4c0l27NHS3BQoLhMJ4aFY1b9zsDMuPimUrW/S/yjPacyb+R8jMKdjzwVwuR017Xk8rxPFP3n/Zo9O/eNARLeuXKae7x7LDUYLxanjJ44ye81z2AOxoU7jnzlfx7CubmCSb7CBkr4OmboMvv1GHm2IxOOWAfL7+/3/TrwK4HJCvdOO94Tk4OCAxsaW5S089YqiIBCzvEO2QiLW3sG5eygccOGjQaeedN/24gycOXvLUnDcer63t+ag0emo9aBXAYwqt87c1qUPadmzBsSccKGzSXtEwARBgVxP+/uenuh98oeWqaDS4o74zvjUBt1XGVHfXzo1nHzHtSCNFQhA7IOMCZFgnuumXV/7WeX1Nr8wdEFyys109PxEQqz4KiyXg3ntqzZfG5R/191u/dWfFVd/6bsmBkwp0vF1zooukFILZQAQjaNy4in75kzt6YwrrQkH91YZuxFb5l0PmjshEhkF/NoK88Us1+qdnjPjSLfd++7WDDso9qGH5mxpMlggEPd2UkioBAWwQzBmI1Zva8Kc/PYWXF+zgQIgobEH2unix1cXkhXV45mNgzf8WNQBXAqJL4WoFatpU30tzX1vNdhDQbgLGjQNSkhFh0bFhoQk1vRj84sklX3/8jdtX/PanF/5i/IQJgY+i7zb5Eok2HKGgoNfealEr313HMhoGswGDICQbxVJsaA6/tjOArYMHGIsZOProAdnLbDzW1OEu1E6nlOxqaBdaJSBCYSx87S1+qrb54WjUEjrhJtL/3od5HysrK8W4kuyCFx76/h9+V33j68fMKD8pkBdWqqvJSGhJQhKzglIuU9Dw0w8/07h8q1ttZUcvW9aAXf4b/Jkor2Nm+ph0+ExkAHrvPdfJ2Xg/v2Dc7T+o/OpDY0qMbFi10shQloSQ/UZPs/FmUYvsYsx9ewv++JeXzZoNPW5BFpFkdroUfjl3M05dsR3bygFZW/vhk4AfROpYBdCiHdgac/gXroZ48oXNZsfOVtiWC60cGKOgYYBAjnASCq0rntETRm8rOXhU4LerVq0aIKT07eU+ePgaOHpc3EGCYru6oRa8sUlBBmFIgIjguqCsLOIfVH5tSnEkL7ZkS+/O8nLIyTmHOwdmh/N/8psrh2TlhlnHewQZBVaKIUALF6zf2aqoh0HPam3dBm+4wIda1EpLIauqfm1Gia4LxhXLH4048CB2O7ZoTvRYlhUQYOlNFmAFOxoyTes30tM1r/+hJzf3h6u/2bXwMwLOBACTJ08uJCImIv4kKloykQHoz3xUAkJawhCR/sePjr3z2t9+9YpAYqtq2VIPO5QljPHrdRkeezbGq1II5+P511Y6t9z6mtPc0stFOWS7mltiwPTXN+M6z0QI4pM0ya8BdClgLdiJexXRO5u3JOQrtZt1ICihXAVjGEazD9YaJLNkrDNkXn9ytooC45n7wODDLAwAxDs79GsaKLdsBNZuaolBGZCwmcEgkiLR0qz3H85D77rzR18hIq6+7mbrry++mJj5s4t/MXLcgKHoaNKSQDDaG4eVcHjDmq15WcSDjjrjoHNXNCU24SPIDHPnQgO/ssLZ1gnzH3tM6Z42llZYgjjF8IkEDEsDO0vOefa1tS+s6plb+b2zY/QZsTqtrvb8SE46+eTL77zzrpovfOELAyoqKjQzS2T6IzIA/XmJ8nLI30hhtDJZT/3xzPu+dsXJ3+jZstTt2dVsWcEIGWO8ngvA635TGixs6EAOHntiIWbdMc9h16XcCMnuBM/Z2oMjFmzG/NJSWDU1e8b+058n6DL4GlsCr9XWo6U9DtsmsDFgY2CUhnbikNKgrdNw05ZGa79iMRxsUP7RbnhTClhvbjXP9bj4LVj3MDNIeLtxYoahkDRtW/jgMcHvX3bZlwprlpWoyy6aNuaow4degrZGo1VcGjcOdh2Q0YDWgKvi3Yxf/eMfS1x4teEfcddRE4pErP3WrttpdezYLMiyAHZ8/w+AmWCFC7lrRxPuvfPF+mAw2DFz5j0JfEbK6mpqakBEqHn0Ud6wYW3BL37xi7nVjz9+pjfHMsOmMwD9eWDOpbAee1xqo83ImhvPePOM847+avP6xcrpSdgiGPK8I8hnzUQwWkEGgkjILNxz3+uJux9awiGpo9EQ2R0xvntOHU7ZsAsb0ySNPXMzA7oSEG83Yg4EvbJ1a1wuWrpVh8I2jNIwxsBoDe26kBahqbmTu7sTZr8SWwJAU+lHY2S1gGbzK9EQx6/HjcqtI5tgtOJkB6EgIjfm6MGDnIJLZhz1vYqKCn3eecdcUzIsENLdrUyqh8jtAbndkG6XhgR94fQj73eANe/8/Zs28NHOIREwdOi28SEyQxpaEuhqbSCS0qfi3pAZpQxg5YnZz73svLGqZ/6RRx7Z8HHViX9cwcyQUh5xz113j/rTn/60rWjAgIfnzX/jH8ycX1FRoefMmZOxI84A9L4LzlXzhBpm9KiXbzt39vkXHjGpaeUbijVbwg5AABBE8LbrBNYadjCIXg7ivgfnNdU8vbo3EiKyLVC34u/P34KvA3A+aUnjP8UqnwWzzb92NPjV2ZvR3dsLBkMrBa0VtFHQKsHaCBkzlujo1u8BQFnt/4flz2QA0eHDBoyCUdBOQrBRMEaDWYMpIEx7M48YKL51dvnpx44eEvwKOtrZaCPhxsBuL9jpge5tI8TakTtk0IEAaPJlsz7yOWQAWUJtczXHNAO2nTQDTG4VDOyQrUzPNpr34itPdAK/nTt3bs9HkVM+QQZtAMAotS5/wIAh77zzzv6XXXbZHeyq6W+//c6SysrK46dNm6aYWVZWZoYcZAB6H4rqcsiq+UJNZDPmobsumH3SmQeP2rFkgRLSsoTl7apJCEAQhJBgrWEFo9zDUb7nvtebnnl+LfJzKR/gRGscl9Zuwk3JKg18SsmlJItevBOvK6Knl6/pkcuXbzdSaLiJBLTjwhhGvDfOQ4pyKTyg8O6X16tFzKCqj3jM1eUQQgg+dTSOOGTSoIG6u8uwdsm4Cqy8kjsGhNsbp2yrreD0Ywe8OCLfDetelwgM47owTgLa6YVyYwKtdTxsUPbh4wZnD/CB8iNd/2WlkGu29O7cvEvdP2xwCEXDh2qjGCCPcBrtAoGQWDb/BfPi81tvIxKoIPqs3WsMQGzYtOmnrqOuzcrK6onFYgXTTii9fvm773Z97WuX1D786KO/ISK7qqrKZCSPDEDvM+A843Ghpxoz6q5Hv/bqMSccMHL7soXaDoQtkJd/ERB+PlB44BzO4rjMoTvumm9efm1DsCiXBlqCe7ocnPP2NvxzMmB/QlUaH4lFB2x5Y2Mnml+dt9WN9/TATSSgHOVJvAlj8rMJZ337ohVEZBbfcdlH3iaPnj5ZMDNOP31s5YgxJaK3M8ZkGKwUWLswSoGVgnZdwGkGdzcHne5uw0aBtQOjEv6HA9aa4p0deuyIrOxrf/6dy4mIF82a9ZFAp7YWppJZzNvGs8YfvL+xC8dYRjucHFBEwtJAQrw55/WFq+L0ujH6U9n1fIAwAMyGTRtucF3+cSBgOcNGDBt76Tcv/e1z/3r2b6ecdNIvFyxY8NKEQw8d6ycQPxVP8AxAZ+JjidJSWDMeF3qYMaP+fN9XZ089ctjIHe++pQOBiGQmUNKyB14JHSsFEQwjjiD9/Y5XE3Nnr0FBDuVq5u09Lk5ctB0vlJbCWgy4n4ltsQcyYmmTetMIen7J6k5s2dIG5cThOA60cqEhhdu6EaOH5f+EmfOP/PY/3cpKiA97Yy+aNdmecvli99ovDztrxjmTju/tdIzRRmqtYYyG1hpauVBuAlrF2e3txtKFa5bEejoc0jGoRNw7HuVCKwWjFVy2pWrdbEqPzP/RaccfP/7wb13uzvkIHY+zLpssq6Rlvj4ZE6d/+UJhXJsFNIEEwIAIZqFt80rUvrrybgCYWUaf5fuMAci6ug0vu67+HQw6R44cOfXbV131TmXlzFljx4w9/uVn/1V75VVXVhCRYq8sJwPSGYDeu6K8HHL+60IFjBk96+/lc445fsTIncsXajsYleyPYEpd1iQArSACESSQhXvve71uzpzVPUX5JBOat3U6OPH1OixM2n5+phYh/5qxQuLR7c2mcdmaFlaOYieegHIVQAHRtnOrOXwMFd9z8zWPKqVLrrvOMuIDJsh8P2w55fLF7tdOHDz94ouPfig7LHVPd5xYa2il4LoKRiloV8FNOLAkaNv21vjzr256e/WqrSFJLnQiDla+Vq28mm3Wiro7e7hEbsj/43Vn3clcGppWVaU+RGkZzZlTal1+5zIXRke/9v3yvxVNOoY53sJEEkQMow3DCsg3X13YXrPEfVIIgaraz3w7twYgt27dulEz/42Zm0ePHv3FO+++q+6HP/rx3fFYYvB1v7nu0erq6h8SkWBm7Ak/8ExkAPrjAWdAPv6E0EabMQ/9+YtzTjl57IjGFYu1HciSDPS5qqV1B5IdZjeQx9WPv7n6X8+vihfm0gDH8LZWhRMX1GFtmqzxmQq/qYOKWM+PaaxasaFNt3f0UHdPLytXQTkOWEZF85rX9JfOmHTS3274+QNKqWLDLJlZzJlTaZWXl0tmryCNCKisrBRzKkst5mpZBRgi0r//1vFf/lnlBc8MzbMiLc2uIGhSKTasobSfmNQuC8vGonfWUV0vHnl70bYWSBtGuWy0hnZceMeVgErEYQzLlp07zX6RDUevnH/+65ecePzhRKRJCE521PkNQ8QAVVZCVJeXS2YWJCVPm1arjjV6wqKHL3jp2C9fMkx372IptAAM2GhIW2okGvntee++AKBZ63Ml9o52bg1AbNu2rdVxnFu01otLBg48+oknHlvyk5/85M7VK1ehvLz8jy+/+tqjRCRramo0M2fw4xOOzFbl/xmVgPitJYxWZtTDv54+54JLjhjR8O5ibQUiEilRIylrCMAALCxGdhHd/8Dc3urqFa1FuTRUE29tVZj+zmasKwWsWnz2wDktJAA9LIrvjykR11xdMXRQVsjm7Jwsys7LQyAUgkVAQLh64GFfkm+v1e/+7a933vzAC4uqAfS8zzWYArCzDhx44GXfPfeXRx83qsLqWI/Oxka2AgECMyA8pSS945KkrUMBFj/+1b+Wts7pnmofFnzzpj+dNyUSlOw6WjAYbBhGKxjjLZbMBBNv1wMGj5ANOKT31VfX3XzpL269C0C3T1p2+mYoaYsrAGDIHVcdNOO4M6ZXjTvx6Czd0W6EDAqIsF8m6UJGc8zGxW+Lr50+85T5u/jl8nISfr363oQJDMAaMXToZWRZY+rq6mrOOOOsL/3w+9//bum0Urz55psLv/vd7166aNGi9+bMmWNNmzZNZZAgA9CfyfPnMS6y7rt22ltfvWzaoY0r3lJSBCwIz8bZs8eE9zUYmiVE7hA88fgCc/f9C82AKFmKeVs748S9BJyTOy+zXy5Gg3DnFWcWlU4YGRWuYeTnZSMnNweBUNCbqeV2m4H7HSN6Ivtj/aamxU0NzQ+/8sI76ymw853XF+wYlldUaIYFRPE5Zx09vGjUwDNHjMo7YczggN2ydY1OdMeEZdt+M4/n7ecp+b6Wb4DsAbnqvXc3Wd/+5fxvLW0Rs/YLmbuu//HBXzvr7MN0+65OSZJgjAEbBjN7z2MMmAE33mEikZDIHnEM1uwINS9buvntRW+8vWTJps0v9G5o29GVQO9+IxCZMH7caUdNO/ywcQcdcOqBh48eDDsO3bXLyFCWYBkFZAAgC2yUETmF4vHb79pw/rcfOYiZ457h1V5niJQEaRoyZMgplmWF6+vr55SfV1551Xevuvq444/DO++80/Tcc8+dXFVVtSwD0hmA/iyDs3mkavr9My454SvNaxYqhrCSFVVeyy/5XwHaGASLxmJ+7YrWP970SntY6tEkeYujcNJrm7Hus6g5/7fXTwQeGMCfTz88cun5JxZl98Y0B2xJ0WgIWdkRBANBSMuCjrcb2w6KguHjYeUMRrvOhkGol0EmHM1hKxDNLs7rBOLb0L1jA7rbOzUFIpKE8MHUsxf1Frwk0AJMMNlZIfrV715tvfmltvFC0K6A4ePPOSz06M03nDFIsmLH1cLbuTAMe00kYMBLNhoY12GYuMkpHiOzSiYhbrKwq7UjoRMdSrmGwvmD5aDigmC0MAK4XTDtOzTruBChHIIVBuwAIIMABcAypEmS/OEF33v1pqfrTzJcKYiqzF6ODTy0uPhwK2Tn19VtXXLhhV/56VXf+c4PjzjyCNTX1ze/s+ydL5SfXb6UmSURZaxTP4GtaiY+wsU7a9Zka8qUy/V1F0+69/IfnPXV9g1LlFHGImGlPDVS4EwErRUCA0fyOwvXmb/c/HKrTWqYtGh7j8b0uZuxvhSwauv3GnBGKWDVASYviIGs9OkHjYkELEFwFFPC1UgkFJQyUEpBU5ASLmPX9jrTXLdSx3asBjo2BoKxuoDs3BAsHhJi3Vmve5t3sHIMSTsokryT/YnlSQbtFREwjAHCIakXv7NR3llT97uGGF48fzwCy3fRJoqrjmjAPfPgiUUmEVPCm0fofxiG1n4NtdFgEkR2VMS7O7lr20qTaF7H1LrGHj4sGig5YJCdb7dYAb1DqdZ6Nt2tJAQJkjZ5becACQmQ8Bz2woW8ZdUqcfPva27f2kNvrlo1V6xatVfbiRIA0dndvT0UigQKCwuPmj9/3msJxxUjRo6YMnLEiHBeVl75wMED1xx/7PFrmFlWVVVl7FM/5q1qJj5kzKkslZdfvtj9+RkjL/vOD8++KL5ztauVawk7iOR+ltljfgBBuwnIvMFY894W+sstL8Nid1goSL0x4pPmbfLBGdirtohJx7mcnNC8XR2mu35HjAMWkXI1HMegu9tFS2svWtp70dEVQ29Mga2IQCjP0lZQ9MYT3NnZxS27mjjetYusUNSyozkyEA6StITfyJNKq4KI/FZG9jN4xgg7as1dFXpjaSuuq64ulzWr4FZXny9XtOHuNmvQCmaSYG2M0V5LepI1+x8eEzcwrgNmkJZh6bhGxpXLhiTrll3s9sZYO7BIBKUQkoxWMK4DaAdQDqBdkPGrN2zIBXMWxN9swpMkBGpq9nqvZ3/LAdHQ0LBaKbV5+PDhx99//71P3vC73y/fuGEjZWVn55975rlPf//737+GiJK10pnIMOhPJyorS62v/Xq+Kj/APv8nvz7/rqKshO5uarGsYIi8BBRSJXVeI4oDK2cQd8dU/I83vrCutaV7QH4OycYevmzeRswuLd27mPNuN69o7lbtYYEp+VEcOG5klo4ljDAMaM3QmuG6GkYbjwUbA4KCIIaUREJKMipBkdxsRHPzYZwEAMAY7QOx92GSi51vjedhNIFYY/JJp4rB+x1ec/nld7S/8/dv2tMvul+HxTmnfqti7OWJlkZhWEjDSVBmGGM8ucP0SSXaGC+JqBwoNw47FKaBw0eQp2AFyGsw6jue5O8RBDybWAmmAJNg+udND6xcuLrtDkEU82uG94VgANTZ2bk9JycnkJubO/zNN998Mh6LHTJlyuRBhYWF7iGHHHpyNBp1pk+fPm/OnDnWvffeazJokWHQezTKyyF/89v5aiSbA6645qxHR43Kttq277RkOExgAxIEIb0WbiIJNg4QzmFjR+n2W15q2ri5NTcvh+zmBF/xRh3u28s05/+oUyrGI+u2JbitWxEIUC7DVQxXGbiuQU+Pi96Yi3jcQcJx4brK/3AQTyh0tezyh+J6Np1CSgjpDYYFpSVKfMYLGAgC9XZ3mLzed4YeNpruMsYgZ9hEQQQuOyT6a2qujziOD76pj2SDi/INnoz3vdbQyltIlOMiFI2ALBsMCU5rsWF/sQAnHfwcQCmwG4MUips2r8GG1VtuAdCirzX72qxBBkBbt259XSm1Y8TQoZG777nnO3fM+sda13XtrOws5/LLLr/+pz/9+TXTpk1TGaOlDEDvcTCqrmY22gy69S9ffHzaqYdQe329tqNRr5ZOyJQrHQkBgoZim8N5g+mlZxeunv/WNrukgIa29vLvZ6/F3ydP/mzWOX/IMADgRDB7ayu/WbczLgDBrvKYqtYGSmtobZCIu4jHXcRjComEhutoxBMasQTQ3tLmgZ3fYSmkhBACQhJIeOcUbMBgGNaefGQ0LDsiW7Zu1YeNoun3/K3yov1PuzrxxN0Xf3NkdudhTQ1tRhuW2v/7SmloZXxjJ98e1f831t7xKm3gKINQJOznEjkFxskeUBj2BtBqBeMmYBI90LFOIOCKdxetTryy2p1PQoCq9sl7gAHQzp07X9Na9w4dOjT0l7/e8ot77r23h4gCIDiXXvr13//wxz+8bNq0aWrWrFl2BjYyEsceiVmzLrOnTDlT33rlIfdf+O0zju+pX6uFtC0AIGYQMQjetA8hCEq7iA4aRXNnvxf/y21zVEk+De12+V+vbcQVpaUQb765zwwLFbEYEhZjWEEWHz1mSFjGHUUAeXaqnFy3vARfct9rGDAG0Jqg3DhKRgyFJYRf7+JjAQPGcF+C0PhJQk5RWjAkwtSDorFHTt7e3Fl77nF5D1gtW4LKBIi9t8aTSIyBJ3Ukk4Xe96z7JBQGYIxC8fARsINhsDGg5BGl1UOzYTAMYDSgFcDGyNygePKhOatefGvHTVKQuw/JG+8L1J3Dh2/NV2oImNtXrly5ZciQwUeNHTPW0q4yUw8/Yvp+o/ebd+V3rqyrrq6WNTU1mcRhBqA/Wd35Rz96Ul112uBf/HDmhd8W3Y2ucVybhPRIZJI5+1t0rRyECkZg8+bmxB/+/OISC2qSC2xq7saJDT1I1NV5ecR9aBfGQQvhIJnTJ40OR7QGGwalBrwmvUd8nEuCszGAASGeUBg8vAThSNiXEPweEU6SdIbRBuQ/AffxWQg7SPGeTgqFIrkjRo36crFZnZvoVgQpKel5Yjgd7AGjtSdXaO9YkARnZtgBC4NHjvV/ZkDsVeJw8uAZYL8uG0aDtYNAMKR7EpruuPX5mve2Jp559NHzZU3Nqn1ZgyXs2qU7Ojq2FxcXFzc2Nm7avLmODjzwwCMGFZcoZg4fMG7/MwcVF8/+1re+tT0D0hmJ4xOL8nLIX/9mvirL52Ou+EHFtVlWr453tlnCtj3NWVgg4emlJCVYu7CyCqARSNx+68vrWlt6DrNttO7s5vMX70Tv+QyJfUubNABAAu81d5jO9k4XguBJCn5CLZk0NBpQmuEkDBKO8ROIGq7joKurF8JOusGRn4hTIKNBWkGwAowLGBesXBjlgrWCVgkYCiPWtIQn5dVlx7t62UgLSikoV8FJOFCOSkkcytVQLsNxNFxXQbkarmsAFoBSCGZlwwpHwOyxZ2YN1p6kAt+oKZnwZGYYpYFQkNaubaQ33u54FyDU1NTs67dFcs6ky8xrCwsLS5YuXfr43Xff/a+enu4AEdxAIFB48smnvHzmKWceOmPGDJ2xK80A9CfCFKqrq8HG5P70d+fMGj8xJ9i9YytZgRDBGI8xSwFpCQjLApEBWwEOZw/A/f98rundlQ2RwfkU6nT5iuU7sLQUsD6jtpP/r5u1EhCtMWzrTWDbtqY4bIs4yUyNSX544OxqL3nouBqO6+nAzBpd3QlQ1kDYkTwEs3M4lJtlQnm5JpQ/wIQKBiIycCiixSMQLR6BrIElHBlQwOG8XI5kZ3EkL2yyssNsEo06p2gAR3LDHM0NmGi2bbKyLBPNDphIdthEskMmmhvUWTmWzoqSzoqwjoS1CkdIWUFpGIaz8/IAImbjsnETYOXAGMezNzUmVT7JSRXGECMg5PJ3N3ducTFXSNoXyus+KEiL+vr6dq316iFDhoSf+te/HrznnnvqA8Gg3dXd7ZYUFw/4zvevei57yJABF1xwgc4Y/3/4yGRa/0vMmjXZIqpwb7568q0nn3PExET9GtcOR21jjFdiBb+VW1gQzNBGc3bxKJr7woLOB594zxlaIMZ0a3PjvI2onjwZdu3iz4Zt6Mcdc/3W77iLlxpanOMO3R+GwIL9nBoMoEmzIMmWDRYWwbaBUJAoEiYQCzg9rWhsbuV4VydUvEfGemPU3e0gFlNwEgrEypiEQ+y6ZJw4xeNeBYhyFQAmow2MAVyloA2QSGhS2ivHk0LAlhaEINi2AARDCAMpBYIBG7k5QRTkhyChgEgW4hZRIC8bwnYVXA0oAziGXEcLowUxC4/hE0BSGrhxub1+x4sANmp1niSq+bx01BkAYseOHesGDx5cMCA3N3L/vfffUlJSfMOXvvRl0djQoA455KCSVx5//P4jjjji3JkzZ7pVVVWfiZmMGYDe23Xn0lLr8m/Nc795bN5XL/zG9K/otgaXhTfcSKRsQz3jHkMSpBII5I/A9q0tzh33LFgZDeOoXsOL3luLmZWVEFVV2Ge9CpJNKwmD2Q2thpVrpC0FazYgC4YZxAyh2VC8xyvBU9pAkoJRGvGYQdecRnT97W3EFNDjcFvMMa29MXTGXCTYG3LuCkbAGAyGwSDDcBxGd1yjkRWUEAhLgSgBwgC2q1HvKLxnNLZLwi6bkCDAlYROpaEdjSALDAuHMConjMJoEJMCttw/FK4T+YURN78wGiwpKbD2G1uA4cPCKCwYgEh+FqJhC1JI2NqFcQ0sUtza0Ix1a3fMBkAzy5o+b/YJBgDt2LHj7eHDh0c6Ozt33nfPvX8fM3rMdw455DC9fccOPXbsfqfdfffdNUR0Lnv+CJmW8AxA/z/AGRAz5841fycadenVZ9xUkGdxz/adlhWKAkZ5JhScvDoJxAbGzmaWUbr33pqtW7b37F+QR/GGXr58GxBbVQWJT2lU1R7c7qJN4d1dHaYh4boludkWd3Up6u0h2dDuoqVdOV0x1RRL8LvtvWwScSxzDYrjDg7WGgEmYpfFKpflO8KWmxWFWuIYsIWiCZNjYlnGUVm2VHGyiJU2diQ72DY4P79j/NEifuttGxP/VjWRsrvzTUP6VCuvKkP6OJoAho2ZkF+3Ye2xllYTBXcX9q7pfqMD2JGDzaPHRGGysjB1yFB76qDC4GGjxgySQ0fmW8VDBqJwQC4GFGZZa9dvVS+80fIaQIza2s9rg4Ymojeys7MnLVm27NY77rhj4nXXXz8tJydHNzY1qtNOO+2Mu+6669tEdHPGXOlDaKyZU/A+aMPVkqhC3/3TqS9ectWJJ3dtWqetUK5MVml4Z02kkEBrw5GBo+m1597Yce2vn4sPyhWjmxPmmtfrcOM+0IzygRe1KsDsn0sPnHtk4EKtjdrRpFtaY1zbneBqQcHF61sLunZ0N7T0AajJgtfi7vw/FrAsACEgmGtHsvMsiylAAWZmcuFSrNPpALrWfaRnFgSQBBjICUamDuCumQOCPG1AFKH8wgiK8iSGjcjVXU6PuP7RtlEA6v0Lw3xOsYSLi4uLiouLsWzZsnE/+tGPnr7mp9fkNO9qJtu22XFceff995X94Xe/q62urpYVFRUZJp0B6A8X1dXlsmLGY/rKsrxvXv+nC+4IuO1KJZQl7RBIWBBCgMkf+AoBo3sh80Zz09Ztie98775Vqtc5xDF49uVNOGvyZNiL91HdefdI+okcUohrgwK/3tVL9zfHAg926sQiAC3v+0sl+xd+5wc/yj7x9K/y/Ef+MIl6tx0yZkwJBuTlIBrOCm7atKk0K2zn50dDCAUEhSNBBMMBBEMBBEIRNhrBRKw3qtyegBvvyRbsBAkuhAjCwIIxBK2Vm58b3BDr7VbxeAJOwiDmErocQmtHAsXDR861AsGG1uYGbmrq5B1tWFt40Gkr3n3lX+Kp+29TADalHXFxHjAlP4ypQVsOFeDxIRtHhgO8tn4nH/oNIFGFfaqE8iOB9PDhw0uAREiI8KXXX3/dz084cbpu3LmTcnJz0dXVtfVHP/rR9JdeemnjzJkzqaqqKtMSngHoD86ZmJmHEg155O4zlx97zKic1i3bhR20iUAgK9mC7PkvAAZaRjiQk0d/+fW97z7xQv2Iolwy9R08/t1G7KJPcQr3p3HuAJjxAzFduyhb14ZfAsDYUypzLrnwoGj3xnfKDjpoYrhtx3snFmXL4oLCgdS6Y/XkrHAwhxxGNKSRF40jQL2woFE4IAfBkAUpBARpCNIeoxUCsCxAhgAR9CHB9RpGdMIg3gOlvR4Sr1vQFUa5cJ0EtOvCGAUSNigQBckgWAShiWDYQCOAzt4gYsqClT8cPY502LLe7OpyzOZN23ZFcnOeXfz2qq5bVzW+iNraBAAOARVD89C7oR3PJncRGUyBHDp06LimpiZz5BFHzPrzn/98bH5+vuns6uTBg4fIxYsXzzvttNNOmDOHado0ykgdGYD+gOyZy2UF1eg/feuAR37w49NntNVvV8ISFvl7ciEkIAWEFBDShlaao4PH0MLXZu+66kevNQwuoANb4vzl1+vxcDkg98GSuv95PU2eDCs3d7+BZUcd9cu87OLhNncemx0wMhpIRC2nHcbpgnY64ca6oeM96O2NoTeW4MKCbJ03IGyEtBGNBKiwKJdyC4vIssMQdgBCChAMWRaBLAFpWSBpQQgJ9tO2rBxS8U5o5TJrbbTSgDasmVlrDe0a0koBRnu2R8awNszGKMR74+T2dhNrLdxEXI485CgUH3UGQTMQygYQho4bdHT1YuvOXfG21pbWzs72eSve3bT8l+vljfAaMTJs0I+ioqKsaDQ6pK6ubtAV37ri2V/88pfR9vZWkkKqwoED7UcfefjG73znqmtmzZplX3755W7mjGUA+r+DcznkjMdJn3xA4MS/3nT+q8XZ0LGuhJQBC4IYgjz25vlDSMAoyJxh7CS6zHevum9RXX3P4YEQv/DKRpz+edGdd4/KUlhVtVAXHp//g7LDBv2pqTkB5bQiwA6CFpygBSMtSdIOUCAgASklyJKCJAoLIsiKBhAMWoiELVgBm+1IiKSwIO0ApCUhLdtrHCEBwxogA0HC39EYkHbgxuNQjuv7bnieG2AGsdf8knSz0zAACRCk1wgqBYQgCAJYuygYMQ4Dpp4MKDKgXAaEhnYZJg64sSCsGGAx2hqbccVVd1/46AubHqosLbWqamszjNDf1wwdOnQsgFYAF/7hD3+45YQTp6nmXS0yFAxpwwazZs069Y9//OOrGT36P0emiiN5QZWXg2tqIl//2uE3Dx8ouKluFwWjURjXBaQAC4IAgYkAODBsm2g0KKrvf2rz0jXdg4rzKN7Rje8wQDNrYWo/z2fTicm2HZtdV5EOhexQTiSASEgGJMFzjHMVujodxBxGbwIcsLBxfR2ZRMIYpY2MJ/SghGNy4oo7pEALGHY8wblxJUJxhyzXELT2/DkEgSSBiZjAYFcDrubtluR3AxJNUoAtibAEBoAQZgMRlIgFAtiWFUKrbZOMK+SzDByaFQ1lD8wXanChrYJLdwT55SWjho4o4kFDhsncgkJpRXIRzYoiEiKAbSCYFSNp2xapTANG/2AAtG3bts3Dhw8fvmXLlkcffPDBrxx++JSp4XBYx3p6RDQ7W5x77nmznnrgqSPLy8tbKisrRUaPzgD0+zO/ylJZUVGjfjpj5JWnnDRuYlPdFi2kJbXjQErpFXp68AwjGBxPcHhgMdWvWtFx1yNr6wtz6MROl3+wsBF1FZ9PaaNfFGYL5ERhtzY6lnJVS9MuJkfxZsG8bmsTAoL5VWFj3aZdyNnWAt3o4B0Aw/KAI0JBHG0RxlkCo/0ek0FSIGAR2SRMyjfDm2Li5eKEXzlHAGkDxFyYhKZdCc2rjRItUiCHiAtJIMQGbtyl7T0w7wB4uy+flxBAIgfAOAAFEuBBtO2YQXnIjQaRF4lgdPFAq3vY4EhHIBg4smhQXmTo4KIBI0bnoyBHZNqY3z90IBBoGT58eMHcuXOvr3700ce/ednl6OnuFp0dHWr06FGjK2+o/AsRfcWfxpI5YxmA/nf2PHPmXH17FRWfec4RP6W4ox0HIhgENOsUNEsCmARYu2Ar2wSkkc+9sHx2cyeOHJiH997ailv20VbuDxxz/c8bdjjO9ibzr40N5hUVxAMrtiAC77w0AAgBiKef/6FhDCaJIDNapcRKMNYxIU8CUQIKDAEuc4FgZBEjxIADNgnDaDVANwEuAxqEAAE9guAEJbYJgS1W0GzTBt1BgBEAoBAfkM29kWz0HFEIuyTLQ+jfzIM69DA4TWsxSBAdTUA2WIRaHC5siFO7bscid4vZ0qY6faON5thwsaF8/Bh8xc6J7ASAVbW1mQ653Vj0hg0bOkeMGDHAcZw1Tzz51CPHHHvshSNHjNIdnR1Wa2uLOua4Yy685pprnieih5hZEFGGRWcAui+quVwQkf7d5QffeOhBJQU7V6xWdtAmozU8+zSCAXv1sCShlUbu4EK5Ytnq5r/et1EMGkAl3S5fAEAPxD5nhPThwtd11tYbJ+6Y7FYHb/QCbQDaBAH6VxDi14gbA6qogJgwAVxVBbMthh0lQJsClmlAuIBthxECAGbIgETcMERcwg0bWJKgTTdijR7oM7xa6mQ+RQOw037e9370pB1rK/Buff/DX7wYvcVZWCA110GjAAEdFoBlW9glCU1ZYex64rulPSf+Zp5iBtyswIa1Da7dsb53IQDUZJKE7wfSqK+v3zZixIhJixYtuu3BBx864Rc/+0WxFNJopYWU0px6yil/vP3221/y3hVkWsEzAO1FeTlkOarNqaMDB555xqQL2rds1sbAMsr4dpeeL6YgwBgClAMRyjWWZPHAo4tfhcBZDuOBd7Zhns+eP9cJolp/90AB80xACBOxzM7eXs+O1DCYqvxxupQC0tSNvBPo7fdksff/G10f7FCc3XdJ/w1A0qOhG7sA7PJUj3//hWlVtYBvsQqTqLcC+Hkb0JEBlv+8QwWglFLNhYW5RfPmzPvrSdOnX3/kkUea9vZO2dHRoQ4YN67ktttuu5aIvpeZDp4B6D72XF0OIuL7fnPM70eU2Hbd0iYdycmBMdqb5AHysv4AhBRw4gkuGT1MLHt7yYbHXmoqKS4k0dbDPwFAtf/OnpLzTlG+j1XLTAB4lf+a3udrUdOK7YCZRd5rl/8JICcAXJV2fmr+C3Cmb5s/BBDy/3i+/wQo/+s5DQDs7MYaAGs+wt/43Ekd27dv3z5ixIhhG9ZvmP3Siy8vP/TQQw6SUhhtWLa2tppDDz306osuuuhpAHM9uw7KnM/PM0BXl0MK8ZguP6LgzOOOG3Naw7rNWlpSKuVCCk+pSHo4MDO0k4CMFCDuJPj6G+ck8nOo1GG+fk0zdr7fVG4iYvZHyNZ8ZCxAP0+Jj0Re0j0q6IMcB/+HB/K//87uUEn9f5890P2fbKhmt6d8v0PVStEHA8IaUVFRgwkTJuz2QqqQloPi//DCPiwLTi7CH7e04Q8wZ8ycOfM/vmt+Um1v6VxkrfXanAE5g+bPr72zrOz4W0rLyri1tU0Yw6aoqIDPP//8vxDRMcwcR3JSQwagP6fyRjVzBZF1wZen/mZAQGNzey9CWWFvcgcYgnzix95sukQijuETRtITj9SaFWtjY4sGie3bO/gPAERtfxAi797iHABDAZYRIAB4wmjyw03DhmSVvuv/W/pjI8l/Z/zHnvH033H/w78h7Tnc3f7tv/2O+/4XDSmAXQbC/sRAAOj9D8fo7vY8NlJ6RlJDtvyv4+zJEz3sJRI74DFw/SEYlf5vsEdpGgsRoNSjfgVGubEswUo9KlFTA6r4QJahHxUciYj4V7/6lZg4cSKVl5enFhPLsrQxhpk5eZz/9fmFENBai/dZ01gIYT4jo7eSZXetBx54IK9YseK5l19+5ZIjjjzyMNu2DADZ3taup06devCf/vSnrxDRrIzU8TkG6MrKUksIoa44/8Dzjj1u7EE73luqrYAtjTYgARgjAWKv+YEEjHJhR/PQpQTf9cDi1uw8Uai1+XV9B9r9jsEkgyL/xpJ3/+mrrx4wJm+K67oUFArECUgBSCsHJIOemT0TwMqf3mFBa4YUBoIkBHlDAKQd9ZozjPJHNhkQCEyyD2zI8poxBMAQqYUFZKVeA0MArL0BqF4fnWf8BAE22psYYozfjGPDPxEw2k1N0iaS8P8ItFJgw7AkQMJrHNFaQfvPq5QCgWC0gob2jt0YkGBIImij/Vpmr0LGGwZLmgS5whY9liXiwXCwwzBJElIJKbWrXKO1N52lN8FQSnuT0xXgui4rUtjWaJa9+FbjE8UjJ6zq7lIsopLj7e1Y9tZbqK9fm9wRxeEtAJ1E/Rskdv/+47vmKoXPhsmypNLa/Ke633wAQwOAM3zsWFVQUKCLi4sRCoVgjCEA6Ozs5LfeegsdHR22MUYT0ab/8GclewjNAGRNTQ3X1NSgpqbm02CnDADjxo3rHDBgQNfsuXN+fsJJJz03/cQTqL2tDSSEUI6rjznmmN8cesAB/wKwMyN1fD47CSn5xj93z4ylx+xvHVT37gZjh2zJYG+atBBek5sQENJCoqcLw6ccwc+9vKr7hz96kYpLZGPTdj1pKuDW9N+KkRDExnDgrUfP3XLE5EGDehu7tErEiWFI2hbIDoOskO/lARC0B9IGIEl+Z5w3RstrcRMgQSCvN9mb8UfCm34thPc1hO+8Rv7Xft9E6t4kb+p46mfwH+//vvCfI/VSLP95k5t4Th1Lnw6R/HvwhriKNH1CSEDY6Bt5ySmQ9z6zfxzJid0p9YK8x6Tdk8x9v5N6vP/7xgCsPOMNJoA0EBiFnW024vEOY1iAOQ6vlTuBjrYuJBI9MFp1S6Ju2xbNWSGrWbHRiVgiagdsu3Bwdltj/YZgzaPvvHnzI+t/xpWVgj5CA4U/PUTMnDnTSClNMpfhR9GgQYOyDj300BOmT5+uA4HA/qFQeOqoUSN1IBAYppTaPycnB8FgkKSUsG3be6+TcpvW6OnpheMk0N3VGc/Kzl3a3t7W07izQXT2dq2MhELLXn755eDq1WvfWbFiRRO83GpHGn2HEAKvvvqqNXfuXFNVVbVHZZKLSy8O3Vt7r/nSly585Te/rjpeaaWNNtJ1HTVoULH18ksv33TRJRd9P2NL+jlk0JWVpVIIUlfMOLD8kP2CB29bvV7LQFCynxg0xr9WyXjt3UpDhrJZSZsefuD1xaEsOt7V+tf1QHykd/76XdjGMDBokP3k/fNU17bRGHvAEBkNCOhE3CTiLkmrm4S0AJA3IsufCA5jPPwRMrVIeAMBjG9xSqkJ2RDCH1BL3ixE/7PXsZEcXgt/NBODIH1cpbSVxJNPKQ3YKW34Lcj/3pvM5z2HkClwTo5tJZKeVu9bsRJJsPCfg/2T44MsE3ljtpOYnU6u/BlZScJHAMMfIAt/tqH3O/7gVvbAvg/LvWOVVpMZJEkIqYU/8sRbfCIACpV/nkUOyMoBycFwHUAwkJML9CZQ++obuPPR99rfq+u6CwRUeBNAPjAol5WVibKyMu3X8xpfJy4+66yzDp88+fApBx086YBoJHrssOHDswsGDMjJyclBIBD44DSUAaOVf1oYII4IIY+R/vXiOs70hOPg9NPPRFtbW6ylpTXR2dmxuqmpYVPjrl2vL3h9wfqnn356ida6LQl+RARjjKipqaHy8nLzSbPW3oG9LhHpefPm3vz2O+8cf9xxx6C1pRUMli0tu8xhkw/72owZM24uKyur/7yz6M8dg/aL4fmRW09/q3QMT92xqUnboYCEr/kl2YUQgLQDcHp7ueTgKXh7+dYdF339yYbiYmHlN5gpZYCpev/KDZ48GXZ+KzZZjKEjR+W2Hn3U8PDhB5eEBw3MgRNXrAyTJNk3vZrgJSbJG6MkhPSAVvhs0WezQggPiOGDNMhn+T7Y+sfvcU2P1TL3wXIKSPvEWB9U4ckgnA7+IvVYTj6j371HKXadxsIpuTjAZ+SUYnzpmc70TB8ze8/vg23foD+AiUGGvV1DCpj78nGGOTVdm/rSah6Yaw1mxd7CZoH9v8Ha7XsespghOZKbb5xE3J7z2mI8+6+lc2te2TWfgjgvO4THNnag8gOYXlF1dbUoLy/n9CaLKVOmTDrr9NOPmjBp0vShw4YdO2zYsMElJSXvp5ezMcaTL7xFlJj9LQWTX4uP1AKljYZSCkYpuFpDKwUQGW9KuQH5c8+9nRhZwWAAlrQgpEA8Hkd7ewfa2tsat2zZsmNnQ+Ps5cuWzZ41a9YapNmqMrOcOXcmYS7MJ9V+7d+H4csvv2z+T3/600N6unuMNkY6TkKXlJTIefPmP/rlL3/5K8xsPs/NK58rBl1eDikE6ctnHFx28OisqTvrNhhh25KNLx0wgWF8wkcwSkFYAQ7m5orH7n/oLStEo8Dml7WAGti3f/+3WLwYfMZECXINFq/usN9csWLd6OHr3enHjJxw6hfGR3JyQhzv6KXkttUDviQHTIJyUqEgpCpKfEAHKNlD44OSx3zZsKedC+Gz0rTxXL48QH1pTP9vM/qGD1CaWshIm+zllzdw2vERCML/idcGn/bAtIoO9Gni/Z8sdRjetwJEHngy8W7VHNxvofDMj/ompVAS3Mk/RiIQSfK0+uRzEVhaYDCMUpCW5EBeiVy3ZrN87L4XNz3+fN0dS9vwxrAB1pQA6U42kP9j109z5syRJ554okoa/Rx66KHjv/G1b5w3bvwBZw0cNGjy2DFjKRwJ+zsrY1zlGm8NYSmkABFJMCBIQFoytXwlwRj+LshjuP5iBfJcFS2G7ZMJo41MPo6NARmG0grG0dzb0+P79nmakm1bNGzw0EEH7Lf/ICnFoS2nn/7Db3zjG61bt29dsHb16ufuvvuOl9M1bWaWAPjjBsmZM2cChJ633lp4y4oVK+4++KCD0dbehoAdkK0treaggw6cMePCC/8hhHjt8+zT8bli0MlJKU//84LHDivuPm/7hu06GA5Jf2fvYwdBkHcT6EQvF+1/ILZ1221fPOOOJ3KLrOK1u9QZ/8X3N6mQ0ukT5Lvk6PHNcVCvQ7IzxhsCwKbjD84accnXjjlgwgGDTHdrq7CknWLtEB5rpvQnSkkZPtuVAsLXnckfkJhizikJhFI3e5I/J6UQTqtlEyBfjvAkFcNIyRr9WHLq+YQP2+wfj6eTMwkf+Cm1EPSTL1J1HpSqoGBO+mpwkiSCYUDMHhQzwEb77NkbasjJc+KzcuYkw+5j6cmfpZ7bl2/Y/2WjXASjEZNgW7z60sLOe++avWLxZo4bixaBxTsJpaUEiqTEwq2dWITdSu+SyT4hhPYrJHJ+/OMfVxx99NFf3n///aaNHz8BRATHScB1tfZH9gkpJUkpIUTfuWVvWUqdt74FOD1dwMmyIBhff9Zaw2fd0MbAaAM2BsafOG6M8TqD2PtZ8ujZG2wMow0bY1hIYQJ2QIRDIREMh5BIJLClfkti+47tC957b+UTN9xww7MdHR11AOzTTz/d/uEPf+hMmzZNf1x6tc+ic6/+7tXv/OAH3x/T1d1lAAittB5YXCzmz5s3u6KiYvrnuQX8c2PyUl4OWV5RY5ZPm3jwmSeP/Ev3lo1EQlJKcqUkiPUlUrRyzODDjhOPPzzn6VcX7RCFOahp7OKVtclOsv/wd1atghk/UEyxmCd3JiASGgxCDwsqWLPVqV+3YuP6YUMLx44eXWgSvTGS0kqBMKeALg2cfRnBczz1ZI6k5pwEUU/u6GOolPp5mkaNvgXIez6RkjlAwvt5CkS9YxHCXxCSj00CjF/RQUSePo008E+yfFBK+04mO5Nli8nlQyQBP03ZTsoW6Qw+uWtILqL9GEZyRQOndgmplsVU5QmDDSOck4MNG7fS/Xc8vez2u99duLWT9ouGaIoxnOMoXqkU3hgXw2vLE9j2PsllOW3atGRSbdCdd955xc9//vN/nHfuuRcffMgho7KzcxCPx1UikWCttCBBQpAQQkoSlHZeU6+PUjMT09721MKWLlkltXz2k40pDTopkzGDdf/ijFSJnRDe7/m5CSElSWmRkEIYZorFYtzd3WUSjst5ubn22LFjRh166GGnnXXWmZefeupph5eUlMj77ruv8d57723/uAlibW1tLB6PBw859NCTSgYP0fFYXEjLEq7jcHFx8ZhYLLbg7LPP3lhZWSlqP4deJ58bBp1kz//8wzn/PG2y/PqmxWtUKCtigRnC8hhkCpxBYKMQLhzCYtB+5txTb7y1W4gJwRJz+qpVUPjvjQkEgA8fgeIIia/EHD4/pviIuIsWMFoIFNjVzbcdMUYcVXXt6efuPyxsYt2OkJZMZeqT4JxM5pHwwDMJtH3VG7xbYq/vLSVKB0eZBgA+UHpP3qdFQ/TJD2nAjtTzy7TFI/3nIsX0Uv/mHzcnodQHyJRQwpySTPoqTfyv2Xc/SVZqJNkyPE9n+Ey6v2adzqi5PziBwAYQgowIBMSrr7zJjz40b/bs5aY1GBCnB6UJJxR6XIM/u4ybtnWiFckNhv8+V1dXyxkzZmhmxsCBA0f/9je/uXLylCkX7b///kXMQKy3R7ExJC1bWrbl+Ur7Cxul7VAo7X0S2G1xpd26Z3x9PilzJD+MMTBae8w5+eEzam18Jm2Mp9EnE6zplS9JcEfynKVd8zDQSrMxxliWxZFw2MrOyUF3Tw/q6uo2v7fqvX8+9cRTdz7zzDNNH6RG+4PgT2VlJVVVVRX/5JqfvHvF5d8q6Ozsgm3bpLXWxSXFcn7t/Nnnnn/uKcysP48sWnx+FqJyc+K47IJDx2d9sXVTHZNlS621d9FrL8FitHfTk5Rw4glTNGo81q1YPW9jB6xoSDy7ahWcD3DOGADeqUdDbZ3549s7+EjWOFwCD4KRBebBBWE68c215sX7H17cqmVESCk5VanRbwo1IyVWUF9ZG6f1RyRZa18iL/1F+3KDX+LGfcUOqeG3SWmEU3ghUr+XngTkZHlfOiuG6APCNHBGSoIRaeV6KUj2wYhTLNvTtZMHljQRpf4nFF7i0Pvb/G/0gjkt6ZncZZAEawM7EDCOsMTD9zzp3nLz3D88u5hfDwZosjGmrcfBMzHglM0d+JUPzslnNZWVlYKZRUVFhWbmAbfeeutfXnjh+XcvvuSSH44cObKotbVVtba0GKWUBSKZTNQZw75mzKn1p1/DCHtJzuRfMunVKMkiIuq/S6A0eSi1u0qy6jTZn5n79YJSv/3Gbjus3VgagSClJDtgSxJk9cZivGPHTt3T3a1Hjxo16itf+spvjz3+2IuIiOfMmfNx7L55586dEsCOpUvevbepqYnCkbA2RkEIIVtbW834iePLzjjjjOMAsF+6mAHofS3mVJZKIuLpZ029qCjUO6itqcsISeTdSEnG4ScHQVCOCxHMgQOL7vr77DVZYQqJqHrYv5Y/aCMDlZbCAkDvtWDRmjZcDY3pxtDjDB4eCom8BW9tn7t27XZEc7MN92ODfZJLCjh3w0D2a4MpLeHm/bxPFkmxaEEpfTvJ5JCq0PCSVMntt5dwFH2Cg186l2TY7D/O9FtA0qtIhJ/07PsZpxpnqB/g4v0qPFJAjdTOIPn8funH++z9/PpvXxNPltexVghmRXVHT6944B8P1t1635prF261WrNCXJxw+R2lMHNTByq2tuF1/15IqSO+P7EhIjPzV7+6atmyZYsv/eY3vzd8+IisnTt2qM6OThYkLMu2BJKLHPquJ077nL4bSDLb1Gvy4TQFs7Sb6p0CYO63GNK/9Q2m/RvStGvypJ1+u7IUwKfVslOapIZkSSeRZUlpmGVra5vT2dmh8vMLPtZGnpKSEg0Ab775xl0L3lzghsMhaQwzCYKTcExBQYG46JKLvkpE/N/a3jMAvRez57KZcw0AecTk4vLehiYmYYG1l0gx6UkV47HMRE8v5w8fIdau21D3zNKeJbk5cvmyDdiF/6I9vx878MdeMQBRCljru7F6Qxd/2WVUhoK0YWMLbnv77TpDxMIYzckbKX2bnt6anM6w0htFKO3mElKkael+tQcnt7CUYnWcQnVKgXwyIZjibGnJrFQdNqeBqY+nTJwGyqJPckkuGLtVcqQ/R6pggbgPpLiPQ/PuG6GkJID+TN871L5aGFYuAtFsvW3bLnn7nx+q+9Pd216ob5d52QEVcFws7iX8oq4b/4DnWSd9OYPLy8ulkIKJSJ900kmHvPD8C7VXXX31LcXFxSPrNtfp9rZ2BsiSUhCnywY+gBpOS96lEnl9Sb0+mcH0sV1KU3jSFyD6d+2M0rTs5AKcfJ6+40lfyfuuAyZKPQfvtstK29+AeXf2DkghhGFjGfXx9o1UVVWZ6upq2d3dvWrZ0mWvuI5LoVBIA4CQUnZ2dPK4/Q4476yzzhomhNCfNxa9z7/Y8nIIIjJXffOoI4pz5FFtDa2GAlL2MRJK8xQiv7YWJrdkMF6fveQ1LRANR8UL+P+Z4hjfTEkAoC3deKzskKEvdACzWzoSC9i4ZAk2IoU3PtSlV2OkJS/T9WZG2lYa6KtTTpMlvK5EAZGuc6YxVE7d8LtthVO3p1cGmALvfklG6dca+7KJEGksr09zTunI/VgbpUoC2U8Z9kk51CfJ7HbMyRrwVIITfQsNEcO4cQRyomrtum3y3tsfembW083VCRBs0p0xjTesIty/qxMb0ee0pwFgzpw5Vk1NjTbaBG+//faqv95yyxtHHDH1+KamRtXSvMtYUkghBBn2NN509kp9mTvAcGrx12masN6NVafK6ZJIyrvLNn1Jz1Q+AP+ut6fU4HQ9P71wMykNpR3z7gJSihTApEomkzkHKWRaYvrjh4yamhoAoDcWLHhs1apViESjBABSCnJcRw8eMiT7jDPO+tH/Mo/KAPReGNXV1QCAsmPGXxzlHjiu4lSTB6W61lKXqnESiAwYJNq6rUTNY2uaB2fR8GWbnPWVH4/fbzLNLu6Ze4kDgLTWrdr0bW3TC9SSHYEiXduAlyRLATf3JQRBfcm3JGAKIVMMOyUZJFvCk7IEhP8t9b9xkwBKaXUW/ZpT/C49CL/LUPTJDSAfxDilnPSraiZK+YZQUl0gTttm961KJPq23qnjS5b5gfol4IxyEMjNUe8t32Td8/dHav7yZPejZFMRmBtdjVcaezC7vh5x/yCTJWM0h7224i984QtT33rzrZcv+upXfxUMBiPbt2/XBGEF7IDgfuV8yfPMaUm8vu5NZi95x8k8h9EeaBvjlckx90v+pTIK3JcUTElCadIO7Q6t/1Zq7ld9JJOR1FcFkw7dfee175rzKnxEWp4i2W0qIKWAFBYCQeuTAGjDzNiwYcNzb771VpOUUno9pQxmlr29MRxwwH6XFhQMG+zfQ5QB6H1E3hBihs7JyRlQEDUVLXVbABGQSSkDEP7V6gOFsODEY1w09gBataJu69pmDMzNCS4CgKqP96IwqFlFANhVxvLYrUwl7yhVvkb9dGekaYepUrW0umVKk1GT3YGe9iz91muRYrnUz1uDIMjyGk9SJX0+8/YBWMAvqxPe3yHhtX4nywMF+roH+yQZv4UcAsRit0VC9rFCX5Lh3dWMfqwafgKxj5GnC/NEAkYb2Ln5evV79dYT9z/14B+fid0YCYpRULxWMR5piKXqmlO7ocrKSiGE4Gk0TV3/2+u/e8tNt8wZP37c8Vu3bFHxeJyDwaAk4QFev3I39pmwTkoZfv01/OkEPugaIPXvJp1N+5UX6QDN4P7A7T/WsIHx9W3PZKr/7yGtwifF6Jl2uz76dlhIq3ChtGsgfVdD6RIKvO5WgNHT3fNJ3KdJut+yaNGiZ1taWhAMBjUbhhSCuro69QEHjItcf/0vzyAiZmaRAeh9ICorSyUz45orjjxlaE4st721Q5GUlMyqG39X6d1QALMGZICt3CL865n5jVkBHDBkcOS5NPb78a8gBBbS8g2RfLAUSYaZViq2mzCZTOwl2WWyTjkJkMIzJmICjIAxgo0RUN4HK0NQhoxriJUhdo0wjoFxDBnHSCgDo5mNw6wTzCbBzAlm7TKM63+dYDKOMcbxf+7/jB0DkzCs4gzd9/sE1/gNbYa8dk3DDEMMw0YbozSz0myUy0a7bLTn3sdpjLz/RgR9uwtB0Aawcgv0hvWN8tmHn7j/zzW9fyrMFhMNm3qj8cCOLqxNyyGwD85WVVWVMcbkPfH4E/dd+e0rbg6Fg5H6+notpLCEENS3KKYvPNyveiKp/5qUrsypaTx9F9lubBt9bFpr7ZXOacPJ1mYppZJSKimEsixLWdJStm2rYDCkIpGICgaDypJSM7PRWhutFSeZeXqZBqc1qSRzCJyWsE1aHIi0BCL871PpWb/5CcyI9cQ+GSblKRf6jTfeuGfRokUIBILSGAMGQWtN2igeOXLkt+G51X5uyu326VbvmTO/zVVVtZg0ofB81dZAyiWSAe8m8u49hjFeO7AUDJWII3vQEGrpcrtr529dE82ithffbu30tUr9Sa+Q/UrkUs13fTcb0b8Jsv3ZT1LGNAY6kAcrkkue7ZMP8mT5STxOtWh7v2+nWBb7Bkge+gVSFQN9EocFwJNNFIHIL7VTYDATDDGlmFoKViXYTwOCXWh2wRAQIBgYv8XbgI0LGK/M3BJsENAM14Hu7pF9NeLsWaN6EOetcMrAysnVuxpa5IOzqpf+89metbnZdKmBWax68HwDUgne1I2ddEo7+OCDR970l5ufOvKoIw6ur69zXcexAsGgNMy+Zu91+1GaZp9WMgPj1zR7bdgShj3hxu/Qh/BWIBDLPtMnAKyZbSvAoVDYSJl6RgmAEokE4vG4SCQScF0XiUQCjpMAG4YQEoFAAHbQRjgYQigcRjgc8s39jHYch52EQ67r+IdN/SQUIL2nJx3I++rYiblvHgNT/wVKfEKcrgrG7xhc/vbbb6868cQTJ5AQhgBhW5boaGs3o0aNmvTjH//4SCJ6vbq6WiZb7DMAvZfKG0CFOWLSqEGFQWd685ZGSMsWRps0IEp2VhGYBeJxxwwbMUosXbm2bmcXrBEjsh5HaxfwSVox+tUj6U0myRsm1Tzjeyx7yRvRV/dM8KUF9DWEaAU7vxj3VK/BhlXLuwoKrK6AbTmRiHACIWl8cGUWAsIIkAQClsWCBBMUSIIZUhhjLAM7KEgK2zJxY1i6LgfCEdnDxpJEArbNruuaoGHBQkIBkoI2KYLmrl6d7bps2QERk9JWkqAJrnESCXT3xoWjWGiXpNFMhhlKmUAi4YbZwFZG2Lk5oejoUUMwcuwoHDCh2HBPu0i1Qie35WxgtIK0o9zdEZOP3PbA1kdebkE4SFWO5nsTGs82vg84z5o1y542bZpbUVFx9jU/ueauMWPH5K9du1YFbNu2A0F/h0Jpmi/1fcXcr10+5awnBIwx/q5GAsZA+w06wjAUK8AAlrRMNBo1tm1bSmlqbW0WW7duxZYt9djVvGvnjm3bVUPDzs5gKDS7vb1DdXV1ob29HbGYx1wtIRDJyqK8vDwO2PaY7JycQ4cOGcoDBw4cPGr0KGvY0KEoLCpCTk42lNK6N9aLWCwmPMm5z+kQ+A8DcdLyG0xpNdipndknSahmAkDHipUrH2tsbPxVQUGBicViQgoJpRUXFhWJgw466HsA5vtDDjIMem+WN4hq9U2VY04ssHqy67sSKhgNWf2SK37vsGHjCQEsEMwuwuwXX9wWEoiWjR+0dEV91ycx0igNn5P+C/39jlN6YqpaoY/6eFpxcrPPqZIzIgkmbSiSL/Ybk7Pz6z9fc9TFQONbQDGH8UXbxhjDiMNrTAwSYECwhEDUeLMK8oSFHAFIIgQIiBDDIoEuf2sZkoR2Itj+LjlmNLJYwAiC4wstDgswa7ggBAF0GiChPZKttQa5jB6tsMYo1CmFNhgkDCNLMQoF4CiFuiH5oAMnINgdxwUnnHxs+deuOBdSdYOVm0pqsvaKwhwK0jMPPrDjged2rpE2ncSKG5TGXxp70LT77sdnzu511113dsWMGY/l5+XJ+vo6HQoGrL6kafomRSC9STPVpO6jF6WZGnkLq+lrsycDZTSYibOyskxubg45jiPWrF0jFryxAO+9997qzZs3Lm5u3vXs+jWbWlo7Wt+CN0jgw/hdJCeYjztk0qThg4aUHD9q5JiDh48YfszBBx+cPWH8eOTl50Fro7q7ugQzCyllXwLSvB9YU7+qIV95g7Q8b+pPlFURYfl7y+YuWbL42jPOOFP09vb6Do9CdHd384ETJ55wwgknDBJCNO6+8GYAeq+SN+aaqiriA4YHyt3ONhhI6CTDIeor+fK39K7rIJJfRK1dJvbK3M2rw7nWtr++uCHxSckbNSkCRv3cyyjdTyK9DjotidPvRkrlgdK6+IxGJMeKg0T9fSSQJykrBG0LlxmELMGiADB5kijil4iFSGAQgAAxsm2BHL+3BZI8D30SHnvUnNa5nVxXdF8ZNXH/Uj6/6gzaEDQzlCFjDG9xDKRhCBbUpQW2gmScGd0g9JiA3fh2W3zx228AAJ5Ytur1q8MR+6avXlFuVEuT1+kOA+YEZFYev1TzLP/9nvcWtjnibFuamGtw4bYevPcfwFn98YYbLv3yV776dxDEzp07TDgclsZw/3xVmkcGUjXEaUnQZE246F9NQfA8wQ1rGGM4KyvLhMNh2bRrl3zmmScxb9789cuWLnt80eLFTwFYirQJ5JRWP37ttdf2uzfnzp2b+rqsrCzJOI2U0oWXiHxv2XvvvYf33nseeAUABg4bOXLaQRMmnHPQQQeddvLJJ2cfdNBBkJalu7q6SGstRD/3QUrzb+nPtEV6s9AnGFVVVUmZ4/VVq1a9c8YZZ06VQmp4ZdgUj8fUkGHD884444wZs2fPvsX3is4w6L0x+SkEmUmjooMiNpW27uhmWEKyAVh4iCGESDObkTCJOA+cNJrWbdxSt6GF5f4Tcl6sb2v9ZOWNFCmm9wXhVI0vs1/+RL4tZ1/ym/wRVKkWaQZgFLRyCWwsY7QeGqF2JfAKG4QZGGQZXSAkCg1QRGDJhBAD2QLIImCAYzBIEIICyCbiAiIiYVimyqBVWh4qvXaXk3XPfVCXxD1tuFkzdhnDjQx0CKAeQIMGtzBjrRCmw0g4YUJrVofbM60cshzASkyQVTVrbn72mQVTzq2Y/pVoJFtrp1eyciGz8/TSBe/Kp59444bljaKpMNvYvQ7+WteJ2buD86JFi+wpU6a4v7/++u9cdMklf40nEqa9rQ2hcFiw6bNz9VSk9HZ26hvi4hcGsr9rSbdWTW/CV8pFNBLVwVBQbli/Xj711BPO6wveeG7ZoqUPdXR3Pw+gNwnG1157rbVq1SoG+srNfLD6jx0htbW1ycek62JUXl5OEyZMoJkzZxohRNPWurpHt9bVPfrc88+PfKym5ksnnHDi5Wefc86II446AlJI1dLa4tk4JY20UvXlSHNIZP/nydKXT5aw1tTUEAB36dIlixobGqbm5uZy3HG8MWnaCICx3377fR3AHemLWwag9yZ5o7RUVNXWmvKzDzk6L6Tzt3fHtQhIaZgB7Rv5kAckwi9ak4DJLh4uFzz+dGOAkDP12PPXL1t1xycqb6SShJS06ExrnU6hn/B9l1M2/CkQT+qknO6tkFx0vBtdV1RU2LkxNK0CGkeMgOxtQJsrUCQd7NSCI7ZAtu/yGSWBgDTIByEgvDkjUSlQDEaACAEAlgCiIITIs7ATYGhmSI9hQzLD9RsXXcPoBuCAETdAmzFoM4xOAG3M6NSMVs1oAKPJimFnA5AqEVhV4+0ySktXUWUlxCt3Jh5uben6SjQ3B5yIwcrK162NzfLxh1594Z/z+b4RhVaw2TV3d3SibXdwnjVrlj1lyhT3n3f88/zTTj/1r72xmO7s7BCBYJCMMalTLf7N66LPBTspYxhKduWlvR/sLfxGM4JB2+QPyKct9VvkQw896Lz00ovVS5Ys+wOA5UkQPP+882RNTQ0zM/83IP6AkaL+fsNHCrhLS0vlt7/9bb7gggvq1m/c+Lv1Gzfe9viTT8w47bTTvvvVr3xl0uFTp6K3p0c7jiMt2+5Xg57sNhQpApBcaD/ZvFxFRQUTERYtWvLY0qVLLz/55JNFbyzmzeeUUnR1dZmxY8dOPOeccyYQ0ZJ93St6nwTosplA1TTgwP0GTHc7W9lRmoM2wbBIGbj59XUwhmBchh3JETEdMW8tWLstEhab7rjjDhefYPVGnwrAabpnX5VAPwvKpJVFP5tN0a8bMDkOyhhFACER19kACqqrq1uSzmP19XABbPQ/0q31k6797zebjnZriUhnbbs9lum/J23/uxyP989doaoK5uiRAcu2LX+wbZBZRuSzjz6/47YnWx8anG3lFo5wF9Uvhou+BpR+mvOfbvzTOV845aRHemNx3d3ZIUKRMBmTNgAh3eJVUFojHvnbAOp3oCJVg+wdrVEGefn5Oh6Lybvu/CeefvaZ++fOnvtnAMuICOeff75MsuSampo9UX3AtbW1ymfbVFpaKufPn9/Z3Nz8j/vuu+/B11585bKLL7nop5dedtmgwkFFqqOt3ZIpfbmvwLNv9gKn/fSTPW4iQk9PzzvvrXyv6eSTTy4h/5QLIeAkEqaoqMg675xzzn7yySeXlJWV7dMAvS/WQdMJJ8xTAAJhETulpbGViKTQxi938q+61DQPEnASCc4tHkotzfGG1et6h2TnBZftsYPdTb9MLxBIVpt47bfwytEoDUSQrFdNJjz9Nl0YJOKJbABFQkr+D+DIu33+T5Oe3w+0+X889v0+zP/4wPuBfhlKAQATDhxiIjlhwE2wlTuAF7/6mvrbXcu35+WInwVI5SzuA2fTlyiutKZNm6auuOyyc8865+zHGKDOjg4RDIXIb4JI88RODuwV/Zzjkg0fKb8TJCs5/JPmVeCY3NxcLF2yWF7z4x+v+PVvfnP5G/Pf+OMhhxyyvby8XDKzqKmp0T4wfxrVB1xbW6uMMVRaWmoJIXq3N+286fobbzjqiiuueH7R229bAwcN4t2uxLSOzr4uQ9uyP/FjfeSRRySA7lUrV81v7+xAMBQyaUZTwnEdDBsx4iwAwbKysn06SbjPAXR5eblgZnynYvLh2ZYzsquj17BgwcYDNG36vAzI13lVIsG5Q8di0dK1rTEXZviIkoW7sbpPFqLTnTrTten0qdmAb2LD3qzBfihJ/T2dBYE971z1Ca4rH/Tj/7cb8vJhmHbsRCscCgIBm3sa68W9d732blMP7R8JcMSy8ObuzLu0tNSqqqpSp5xyyrHf+va3H8vPz0VHWxsikTClmzmlG031+TTvZu3abzfTJwMo5cK2LWPZlrjrrrv0T396zc0PPvzw18Ph8IrCwsKchoaGSE1NjcFnp9KgH1BLKTe/9MrLX7z0G5de949//APZ2dlERMYYk/IfF9Kfcm9ZkJYFIT75Tfdtt91GALB8xYpn6zbXIRQKEftSFAlBnZ1dPHBg0UEXX3zxoeTNY6QMQO8lceWVTQQAUw4dMDUEJZSCEcIfGsrw/RD6fGWIAWEFWGYPxHtLl65lwurXFm5uwsfjvfG/7xiRBrIivVWaUi50SNuGp3YAqZl8ydI7SmuJFgCEDwyfyLXLH+LjY0Ho1vbuM+xoFiAgX6x+Yetjc9vnR6LIVcyXbmhFZ3ma02BlZaWYO3euGTFiRPF11133z/333x9NTU0cDIdFn3LRV+cs0qajc7JNPukXkiytS++sEwJKK0QjUR2P9Yrbbrll5U033fLDNWvW3Tl8+HDWWne6rtsEoBefzalFXFtbq7TWorq6Wm6qq/vld77znXOu/cUv26QQQghptDEeMEsJy7Jg2RakkHsEMGpraw0RYfv27W+sXrW6V0opTMqnj8horQcNKuaysrIz92ElYN98YWVlAxmAzKb4Gb1tnRDk20ICqdZh4w+RNgwo10E4r0jElOUuenPdWzpo1fglV3tkVbYkpQY/9TNq592npVDKD25357IkgIjUlp1hlJbYB0aa+QQa4/cryOXcgVi14G3x8KOLr+kV4p0eh7+zrgWvARBpk7dp5syZRERm5rW/em7SxIn7123ebAKBgNz9gqc086iUlWfKeCm5ZlJaHbT3hVIKubl5pqGxUf7ud79bfuddd/+ViDvz8/P3c113KBEVGmN6Ghoa2j/BXczHEaaiokJPnjzZJqKn/3LzTdN/9rOftYRCIREMho0gzyBJSukNtRV7jKgaYwwB2FRXX7dea01Entjk73SEchUNHTbsNAC2JS2dAei9ILwKqRpdUFAQyQuZwzo64mAhhPaBmZOjlABfzyLEe3uQNWgYNTV3d6/fqgYWDRywbY++AWluY0gzyknWQaeb3QhKmgoZv6LNN8VJu2+EXyKmDSSA4F7+lpKc/hsFINvKKjiMlMIrz7716OOrzMMHjYi8srkdt2E3G9g5c+ZIItK/nvnrv5x97jmHbdq0WUkppTY6rYGE/g2gU77SfVpG6n+peYLMcB0Xubm5ZsuWLeLGG298+aWXX12el5t7um3bRwpLfCEQkBHLsla0trZuB+DuDSd58eLF7mGHHWYLIZbc+c9/nn3ttb9M5OREyQ7YnJQ4KDWZZ89ETU2NAIBt27bN7ezqQjAYNMkOWiGk6Ont4cKCgolHlZYeoI3GvuoTvU+9qJpyCAbw/XOKJuZGKBLrVUYKEHj3KdPeG60NIxZLmKzCEajfuG2Hwxh7yP7DWvac/uyXMfnH1cdQ+N/MbDituoP6LUombX5gsgGcGcwWgBwGUL6X2jMyvKINAMEBJWNKljz3ivrTg5v/WF1dLt/Y0L1rdxmqurpaTps2TV16yaUnf+nLX/pee3u71kZZySdLtvcLkc6UkwnCPlkjlRRMjc7yfq6UQk5Ojl6/fp244YYb7p7/+uuNWVlZxwii8YFg4EDLDv6rvn7bw9u2bWvFXnbOFy9e7B533HEWEb1+6623zvjDDTea7OxsTZ4nb8q1b0/tyZI69MqVaxZv27KFg6mSSEpOTTclJSXWl847b4q3cy7LAPRnPYomlBIAGlgUPhOq1467HndOOYulplaYlH+vYcHh/EK8++7aegUse3z20o49eXMJYfokDO4bTcTp8wiB1GQUj1WLNAhLJhA5zfyI2H8u69MpGvgYEZoNLr74cEv01IUeeeS157bG5PAbfvlC/u6vqrKyUpSXl5vc3Nz8r1/2jbuKiweZnp5uCtiBviklfT3+faw4ra87New1BeBI6dNaawwYMECvW7tG3vC7398y7/V5W7Ki0eOIKM8KBd42tpmxaf3659F/dNZeFbW1teqwww6zATz99zvuuOTRRx+xsrKixnXc1LCBPXgsmoiwbt3qxRs2bCDLsqThvpSKMQzLsjBw4MDzAdC+Ws2xTwF02cyBDICLCyJHdLTHoRhkjDcRlZn6OtyM971SCoFINsUN4d2l7202Egv9i/ATPy/l/mfZbwpJesNJ6j9pk1/SpmYjzVPZB/OULE3EwjPC2KsljrIyj68N6N0xvW75m80PPrN55fConrJ4XXfr7iDo6878t7/97eajjjpy8M6GnRwKR0T64secPmWE+vy3Rf9hBkJISH96OgmC0Rq5eXlq69at8qabbr557uvz3s3NzjlLCCEty6pcvXL1lzeu3LgVaaOz9tZzvnjxYnfy5Mn2li1bHrj5LzfNWrxosczKytJaaxAR5B5Ma/g6dGtjU9NmaVkgkEnLv1A8Hsew4cOmAIgKIfZJI/99BqC9rX2NGTc4uyASlBNa22KQJASxNzXZcHL+oJ8sZILrJDinaIhQRjevWtGsB+aG29Ph8ROVY5IXoaA0Qx6Rpo368/6S3sNGp1ztklMuSFBKFukbOtp36EGgYK8GaK+jGavX7Rryz+o1jxnm4pCF17DbVI3q6mophNA//vGPS0895ZSv7mpq0rYdkCItAdjPcDMlOYtU/bNIlzP8r6WQYMMIhUK6tbXF+vNf/vzACy+9umhQ0aBvCCGjgUDgqlWrVv3VB+Z+DTJ7cyxevFgxs3hz4cJv/fEPf1rQ0dEhI+GQJn/R2lO3tK9D9zQ0NGxxEgn4g1Y8p0cSIhaL6ZKSwYVXX331FGZGdXX1Pidz7DMvaGalpwycdeLQ4Rbc4p5eF7ZNxGnz4pLgnPrsOsgtHoYt9S3d7XFkDSrKadxTAJ0M5SblCU7pnj5Ke7Ud3L+jhIH/kNRKPqhvAqkE8gCgaS9lFlX+S19X5zS9tTK+2pb427oOvIb+iUEqLy8HMwfPPvucP4YjYe7t7YXn2JYmC6WbUfnyVn8NmvqZFXmOTARpWUZIKW/9663L7r//gceHDi35uhAiKIT45ooVK56ePHmy7QPzvrTF5oqKCmJmeqT64e/8445/mFA4QnsYMWjGjBkaQLRu06b3Oto7YNt2n884Acp1OScrSx5yyCHHAUB5eXlG4vjsRqkAgPyIfaKEYbB2heBUo7I2gNYMZQyUMTAMGMc1A4qHoquna00CiI8dld26p4+aRNrA0aTOkbZ/7xvi3d/NPzlXkCltuGpysooQDNYIAgOxD7jmksCOSBSvb/VGVvWbrJ6s2rj5zzdfeuCBE6c0NDRob6adSTP+QVo7fH93wPRJ2YS+5CEIMMZwfn4+Hn3k0fZb/vrXH40aNapUEJGU8ptr1qypLS0ttRYvXuxiH4yamhpdVlYmASx96KFH/vjWW28FgoEgXLXHX27bmnXr1m7fsR2WbfUtnsmeWWYUFxcfhX2gpHSfBuhkx9nE/XMKVCxGSaN7ZobWHiB7c97QNwtOSFAoD/NfeXtwEEg89PLGzt0BYE+8AWw4NevOM+j1xzylWT/2DWTl/gOgUpV4/nzA1OgrhuUz6L3+IiVEWcN5H41RlJWVmTFjxgwrPaH0F47jaKONYB+JU7P+OLlLSc5z7G+KlD5ENQkAWink5+WbN998U/zt73+bWTJkyFTLsg6RzD9YvXr10tLSUqu2tlZhH47a2lpdWVkp3lu1/Ibbb7ttBwA3HIjuMRmHmXHSSSdZW7duXVlfV99rW7YEwEmbAzDLWG8vAsHAkQDCQgiNfUyH3ocAeq4GgFg8cXJvTxwEIT1Q9hKCqRlyfhuhUQoiGJF2NKQ2rq23IiHsYsMo3cPnhJAc94T+8+zgOdIl9eikBSaQzEJ5Q6Q8IihS3hxJbDeGQXu/GZYBAA5gvhPFRvR5eiRvYCIi86Mf/GjmhPHjSro6u9i2bcFpk7G9AcGc6gpMzXtKrW/cTyYSQoANIxyO6MbGBnnrrbc+sG7dunVZ4fBpACpXb9jwuQDn5OmZO3euIKLW116Z/f2a6kftvLysyJ762wAwbtw4pbVua2xq2Or7Unv9tYJgSUmJRMIMHTIke8aM845gZpSXl+9TOvS+8mIIIJQAkcL8QHZ3lwMSAkajbwJymozA8BhSOCcf7R1Aw84WGY4E1n9K9wCMUakmGg+cTapJxRsDJ9IMe5D6d04ayUvpmZIK4Xd5CxitwZ/tLrYPfJNuaMCubdvQb1qp35hgjj322P2PLzv+q7F43EgpZUoeSg1xNWkWQH0G/H3VAH1TbNKUIhMKhcQ//nHn2ieffPIXo0aNOpaEuH79+vXzPkfgDABWXV2dxcy0o3FHzaw7Zl371ltv1wLA3Llz94jmPmnSJAOgpbWldYnSCkJKkxowICUMs8nLz7emTTtpPwC48sorMwz6sxbl5RBE4DNOG3lgojs2trvXNYbJ6yD0y+tStbDC67YzykXuwMFo70xwewsPyS4IrASA2j2e7CEQWaBUbbZJeTqn7cP7Elkp2EoWdaPfrEJPmhbwxxzuK0Dybzddsqzum9+8/CcTJkywY7GYCQQC5I9b6ZvWbrgf3Cd3J6mqjvRrgxmO4yA7J4dnz5lN995379dHjx6d47rue+vWrXsBgPwcgTMAqPr6+nhyOXvttTm/vfHGGxcA3vSTPfG+X3bZZQqAXL9hQ3d3Tw+kFN6w4L7MOdm2jaJBRdO8nXTZPjWrcN8AaL+q+JRjhwtbu3AcBe3rzeyX2LFBqkTNk69cDmZloXFnfa/jYP3QAUWt6axtT4VMzsDWvjkIp0kdSYG57xOMP3EZIg2Q02cWUp86QPuO3ze/L3s+/PD9J08+5MJYPGaIyEqvwkjuRnSabORp0yYFxumTrpOwbVmW6uzokI/VPPaXHTt2LCCiwvr6+kf8RWKfnyL932Ly5Mn2Hm6pJiLiYDDIzc3NizvaOiClJJM00/EfoJVGUUHheABhABmA/qxF0QTPwW71pl1nOHEX2sBwsu6Zk8ZInDbiCmCjkVVQgvr6ZtlhsPIHv7+oBZ9CB1hS8+w7Pp/5JTsH/e4t44N3qg4ahL7pAwCIQWnWy9KbErNP2jCWlZUJIuJzZ8y4dNwBB4S6OruMSBuyy/6kdON3jxrjL9L+LsX73nj6dKrkDlBKmaysLPnKKy9tvPfee39+7LHH5re1tS3Z1276jwKUJSUlkcWLF5tPwxx/0KBBYsuWuvzmlmYIIURStfJkQIh4LIZAMHjggVMOLCEisy/5cuxTgvoBQ0NhJ+ENzEtptKmtEKXm45EH2hzNG4Teru51Ctgx7cRfq/JP4Xy42sBo47ede7ppavqb0X5zTVJHN/2GyFJyzkrK2J9T2qpPpvdFxkdlZWUaKMo68sijZjiOYuW6glO7D+9BXmuyz4sNw2gNpbUHzn7TTyqRyN57EAgETEtrCz373HO/JqJ4SUlJT2tra+ensbP6rEU8Hrex5xd89gG6t7OzWze3tHRYlkVJS9jk4I1YPM7FxSW48PwLB/ryV4ZBf6YY1cwyA0Duau46sKc3DpJEfcyzLxeUYqeGYUiQpjzevHrjcAms/7TaDDw87WN7Hns2nnbKnKrlZdb+CBj/tVDfME+v4gN96jkTjGcQtc/5E1RWVkoi4qu/M+P88RPGD+/o6NAkhEix4qSWb0zqvBqtYYz2DH+07mPR/sXBbOC4jgmHI3LOnDmbq6sfqzHGUE1NjYN9dBfyYS/Ttra2DnxKOY1gMKg7OjrqtFKNUlpIKn0pecqwikaiCIeDJwLA3LlzMwz6s8SohKgyACw2fLCrGN5IWH8iMfVJG8ZoMANKaRiSZGTY7GrsKoxI7Pi0Dt5ApAGG9gAG6XKHBmudkj2SC0+ajZK/U6DU14AAM6WnUvaZmDlzJgOQRx93/Neyc7LhJBKUDrjGaCit/PZ+A6U0tDZek5LW0Mb4H56spI13bm07YNrb2+mlF168hYhiM2fOlBnm/OkvDAAwf/78VgBq27ZtESH7rGLTHdEtS+Kggw6xfQksw6A/U+8iA6isdPOjIu5q7U1n5r7qKZNiqOS3emsEQhFIS6vOzs72YDA1GHWPhy0Bo41/XH5iUzOSGnq/Ru80HT3dsD9ppclplR37IvGrrKwURKSnTJkyYtKkiUd2dXUxSSGYGdoYKK2hlOr7cBWM1tBGw2gFZgOljde45AO61gaO43AkEpGLFy9ue6S6+kFgj1UpZOIDEDAppQbgdnV17TDepBfmtConY4xUSmP7ju1fxD6WzN3rAbq83HsN0x696VDWXKiUMUxM3tbWBzrjt3onW7yNRjCShc7ObtHV07mSA9gKADWfAkoTPJaslfITWxpaa7D2dFOTaoUDUjprshLP9A0v7ePTvuESNOQ+1v6a9Pw955xzvjJ69Gg71hPTJDy/FTYGSik4rgPHceA6LrTWUMYDaG2Md16Nr0PrJLvWYEAzMy1a9PaLAHYZY/oNn83EpwvQSYbS29u7Qbs+AUt/ABFc18X48eNDyFRxfLaiqcl7Awdm6RHCuCFXM7NhSjYqGH+atzYM5bNUrTXscJBbWnfZXR0mOuXgok2f1nZW+4xO++zPY3faTxYC7Ce2POHN9PFpX1NNiuzJbrk+N2ID3tfsZD3PXzFh/IQzCCBXuQTDPhPWUK6LRMKBE3fgKs/DOJkITC58WntArrSC1gqO40BKKdatW4dnn33+nwCooqIiozt/pnbIDAB1TU1NQdf10wL9prswuW6CCVQyePDgYUII3lfUgb3+RSTVpgmjogmQhlJIA+W+GuhU8ggEpTSHsrKhNfeqBAITyiZ8as0HbLy2c+84PdbMvgzDxi8F839Onl7jW4/6AJ5sZfbXl/QBpyJJp0v3GXnDTJ06ddyggQMnd3R2gIgkwwNopZQHzokEHNeBVt6uRGvt28t6N3oStJVS0MbAdR0TCgXF8uXvrl6xYsV8ZkZNTY3OwOJnCKC9Tx2trc0US8RBxP2qm4gEOQmHw+FwwcmnnzzCb/neJxbZfYZh5WZbIdfVqVI1z5S/D8BSzXdgOI7LoUgWZeVm1zsGq5bNbQ99Wset/aoNaIZhfwvuT7RlndZdaJIVCiq1TefkLjxZqpKaAu67sSUVkNp9ZrdHpcccd+roMWPIdZXruRQasNZwHB+cHcdL/KWV0KVK6uB9r7WXjNVKgQCjlMLq1aueICJn7ty5MgOJnzkKjaysrJyujq6ORDwOZohUh6gvAWqtEI1G+YLzLugG9h3r0b0foH0KXd+QmKi0X7vhJwY5vTkl+XjDMFohGM5GItajHIN6nT3M+fQkDvQ1UWifLRvjJbbYZ9F+ggvMKZ063cQ/bRuY3PGBJO1TddAzZ840AHjs/mO+EIlG4DqOYL+EznEdOG4CrnL8c4NUMwrSBjYk5xmwTiUHIYSU9XX1/NLsV55i5j3mMZGJDxwEALnRaHY8HneVq1whBfWZXHmfjWG2bZuWL1t+NAAUFRXtEwx6H2gFLgVQC0fxOIKASdpKJlt+03UsAiCkZ2YfiKK5qTNbAN3/+te/4kSf1vtpfIc99IkUxoBBMEQgYUBGwMD4soXwdgJag5ITlpKt30m7UvYHye47pRwkhDCDBw8uGD58xKFuwmFXKfF/7H15fF1Vvf367n3OnTK3TWfa0hFaZpBJoCkgggMqkIAj4lPwyfM5/54jSQCf+pxRUEYRlSFhHmQotEnL3BZKSwt0ntskbebkDmfv/f39sfc59wZRUQqUcLcfTJom6b1nWOe713d91xKCoJV21EYOSin3vLKDP8SAEez8zwAN49KpGQICWmudSqXkyhdXvvjKi6+8wMyCiIoAvQ8yHBmlurPZ7EA6nUHViJEAZ12vhUIFE0spkUglDhlOb34YcNB2/56KwzdsItc3jrjnoWY4kf09SbTtbB9HgCekZ2rfNsWD7eqZqKlpoik44/hnrRWYdaTtRcH23V6aiAYz2DBgFAg8bDjo2tpawcw48sgjjxs/YUL1wOAAG2NIBQqZTAbZbBY5FUTj8qHGOeT1ueDPxgzZWbEQEjt27FwEIBhOAw7DDaCZeWc2CAazmYyQgoY0f/MxWISpU6dkgeGjhX7HX5At7mPSc4o0kON182btOpIHkwuQBZEndTY9GJdAnJnfxlgo43TQOg8m2l54xul1Q6mgcWPhVi4WNhDt5zDh9JyORr3hwR8OF+ns2bMJAGbNmHXSiJEjOZvNGmMs75xxvLNRJtK8F+6awunCkBYy7uGnjYaUAoMDA1i3bl0LALS0tBThcB9dM2fODHQQcDaX5SGUnivAwsJmv/32H1Y7oOETGmuMUBEwEzSHQI0C7tZVVwYQAhxksgDeXhCLFBsheGgLvNpNwBntgNrJ7ZSygByCtdGOow5lZEoDSoUXb2w40BuOf5YTJk44yvMkZTIZUjmFIAiggiDUMudvWpM36ocx0d8VjoOrIGApPdnZ1ZWeP3/+MqA4nLIvr1GjRlEQBBWBUhSmtIfBFa6CJqUCvPTSqhNgd8PDov/yjgfohgZ7IvrTapS7ASkEMS6cxKMww8xVpRDQgXn7RgjdUjovpQt1uoU+EdZIyTj1gaM6dKjp1dDaysWUCmACBVYGUAEMKxjG4KvB7s0AUBTOybwZF6kQBgBVVlQcHAQBlFIU6ADuc9tQLaB4CgMaGIVudvkReWMMJ5Mp6uru2rxly5aNzg2vONa9Dy9jTKlSOj/mXehGCCJ3P0wGIKWUjGHQg3mnNwlJCjCAeDowE4wxtqlrGEYQBBkwu5w+wCVnC2gDMPsgSEjXZ3O9xrduNYcXXR6YSRAM2e6WlNLx6BxViJE1qe0S2iYYADbWwU94gAkCIMjAMECePyA1o6XlB/C8ywoA6PW4qobfQwVU4Gv+HP+dz4esRx/9wd9cazWoQXPHVVxX9/d1x7W1taK5uVlPnTr12FHVo8pyucAorQWzRhAEbognTEphd74RjcqHgbHEAMjAcNhAJpNMJYWUshUAa609IlJFGNw31/jx42FgPCkoC3CK2TAgCER2PsDaxWLSpMm5IRRIEaDfZmrDfigLNI+z2x62qRquWsrn9jmA4bwRvhAE720e6g07k4YZgoWjPQBDALRxKSqea3QZAAos2YK1cx1gsu+HFaByGSDIUSadxbpssMZuHhqN2y357t1qd+5zhS/hNQC2EJGp4HoxBZVzIYJLWMezcJIrioCeN6/xNcCv8Z8en5B/Pvq4oyuqq6vj2UxGG0cBKa0jKR2i7a7Jy+nCrzJFb0QIa9NqXOr38hUrGCjyz/v6KukqYQFRxYa9MJ2MOZ/wTCCwMYjHY1QE6H3xjQhQfjjB4QVTpHYgEo7iyJ88Gckc3s4HTGgwb0FZMINFaEHqbEOVhpAOvMP36GR1RAYsCEJIK88zGumBQTll+gH4+VcrLqmoEv8vLhEGppIwxIoJ2mgIySBBEEzQYBeTFYIZgYzNBGBDLsnF+lRHSeIWEu1nxjAbJiKwYYZWBsoQWDPgUbD/tDEP+4nSfstWeJAxn+GPLH3knofbf/KHBb+wE2H0d+8qH/5hpWVlyAU51lojFwT5xmre9DvimwVZYyxbQYvIOcsYK0EUJCiTzUAA8wGgo6OjSG/sw6t8drnmFtaGjQwVOYKNc0gPnQkZ8VhsWL3vd34FzXmoCy05tWFI4Qq78EYVbgtsGGzsLD+Jt5+Cty/BPkigLdhaYHGVnrEgbEIKRBhIlmBp6REhyAbkkgaRBDPQ27YLM2ceh8MOO2R/0mkAAiQFQNIiLggg5WpfAsgbwmIwszVdorBAFgCFRbN2f5YInfSiotqYKB0bpJ0FKjvtOQ6xEsAsAAGjA3hVI/DcvX1bAfzCs5zh313JVPI9vudhoK/fNQZVpH6x2uawWraURt4JkByH76gNZjA0QKCB/n7s2LFjBwA0NzcXUXCf3iTDGOYBBgQ7FZOx1YNLsSNorUFCoLZ2NpqbV0dJOUWA3geWMXCeC84hVjMMCQi2o89G2yraYoWrFqVE7u1iHWtDHppt488wSFjAE8aAHd+sjEIU52QAKSXgVBwkCVJIEGnnv6Gi0efdK+6F0Vljq2w7WSiiAR6OaBEiQJBwEkQLaMZ5ediiuyD5OmqxuTkutgM1HPEy0TPR8iUONIkIQvrGTnnaR48J0qZy0hQx2N/V9Sqkf801bvy4jDEG2VzWGiEpO2lpwwny06I26ZzD6Mk8i04MZhtwoI1hX0rq6+tLP7Jw4YCjUooV9D685syZwyRIeJ5H2u3WOIp5I3A48AXC7Nm1jj575/cJhxFAF0QYGYBdXJ9xvAYRQYqCVGdmxGLS/j3h7fWrcCPLggDDFpihFdgICCFsU5AYxAQNDSaCYICYAMFDthPhxKSIpyCQFGEKC5GI0llCEI0KaGus5EBYQoQ6aiCayAwpgnASL2SlQxmjGdJ+ZEg7yQhDDLLNO8HRvyHAREaLUpFR9A8HhBoaGkxjYyNSqVQ5A8hms+6QWQtRIirgoAteg4F7aDnig8nuRMAwRrPwfeH7cuOGV15ZSURFid2+uwgANzc3S096ypMShg1FCi13Pdpxb0t4zJkzp0hx7HP7IIcQNtnZbtHDTlU0XeiA2QqqBFKlpe6mfnufsuGEGxlhKQ/n9WzIRLlrIfwIJjBZECdBlouOdggF6d6wSSwAQIJApB0Pz9FHQeFxCUFYIC8fpbwCgvJoHMrV8nvHkPOnKN3C/o3OByaEFbY7GyTISgVVDplAUSG4vvrmlFIaAGXpgfThSgVQKhBSenbHwSHr/OqmYAFtBLL+wS5Zh2CPlZACnZ1d0TUzXJpKw3lJz8v5vm9tdt25Njw0XYWGmVHs8BltDce7He8khQu9JgtQbsAbQgoIQdDaoCSV3Dc2QCFwFI4lG87HNIXG8hxOGebHwZXSUIGycjxlv5cdzRFpgp0Pth0dRxQIwNpSPUPitApGoaNQAB2GsNporVCDGr7e0P+CXDZilAkY5iq6SU5jnBOfCyIgEpBebA8AaH2JeO1DwwCQiCViFZlsFsYwGaMtTYVwsIehORxCyUvsrOqFodlpxiPjfgNBAt1dXTxkl1Bc+ywH3dzcjFgs1pNIJKC1RhTvxvnGOcJrbhgtbxjgsgWMaP/u+rrElltltjeklOFUP4QAdJBGMlX6Nh6A5ojNNdpAM0BsoC2tCiaR54udGgHS6SuMBRVNYbqELbsFCMY9qEJrVTiO2R4dLhgpsdOWxEDoDUZkf56GSJ4ZHCogOORFOPq78PvzHHZYx1LeSTCspA1AsM1ZItJEEAfOGtcKvIKWhpZ/JHjk0pISrQKV91ZxVBYhP9Kdr4TtA4/B0KFTkgkT0DWUDkBCYDCd9or4985hMUtLS9v8mM9aawppSiJEhYghEXZEihX0PoXQwEBMyJ2w8ikmRwGwG+tmJstLu8w+kgK5dC/isVLE3vZoI4pMfUKbTNZwkVc2tku7itPogsBT9/dKGWdMbyLbUq0LqluDV1XRTtLnxqFtsAGGmAsZw5H/tIHztzBcMFb7qlhEpz82bsuZr6BNNMnHJs/9h0nbzApl5bEMgHzywt9ZsViMlFIAayepspW+ZpvYDfeejFO+6KjCD8fk3bFxFTQAKKU63Ud6B1/99I64Q9/Az7sdjiwpKUnEY3FSbnArspU1efMwbTRWrVpVrKD3le3PbedA1jUjnUzQCoCnEVl2VlDoEkeRmD3csoMEBge6ES8tgwCqAMbot2nMV4aaZzYglvktG7lhFFiuGdpYdYXjhVlYjXG4PZdSQGntFB+hqx9FFWZ0LzODyUBAgqMq2e06nBQtrHht9Z7n+CKlBCHfcAwDa7lgCKhgb0qRUVWY/CIQpqAYHcBw8LpuYCGk2x8BwnDUGCKGk9Qh9AUe0swcYpMdvk6QISIxadJ+LQDgTPr3+SlCZhav3jiGl9GbDJKv6+W1tLRE/05NTQ0DYM/zjFKK/pHG/fViVSIR86QnoZRmAKTZRNdqeN3l+ekiQO8Ta5XLJGTmQJAdUCAiNw6N/JabDZht45CEQLqvV4yYGkeyHEfja1rc3khvsbmK1dmRoxuMm37LE2vCDpMIK4/TZCK5HYcTN45eILLZhuF2DwRIIdyATphwTgXKDBFN0oFds7FgGi+UkFv+wlbQkQ91eFyFHeViB+yAiSrsvLwpbN6YKGyc2U6/sHHvwby+G4qEk9MVNE9Dq9XwJbGjg6J+REgN5e/i6HogIaA0lxaAyb5fLv+tV3VYe+zLxkB7a4Q+FfPjhyXjCfSpAUPk1D8F2YS2kOFI0z4cegvDhoPLBYg0kSEHmZdBsuNqXeUlJNJ9aVSNKENlOarQOCcce349JhV7l2Misub8xoEghZ+bCIzDQRtjCgznhRXpM8Nxum5oxQGyMSbinSnULIe8tmtKRoMcIdiDHXhyoUij4HvzU5jkKJFQgxpp7goGh8JfEmJwKIEkwVFGZHR7tfzTAs2ZXCGSVEXlPPKZkxS+n5Aqd7roUG4XacpB0EqVvROu7fr6etHY2GguueSSH8ycOfNwZZSCgTRaeyQES09qKaQhAhPb8ViSEjHPYxOFQbBTORCElJBSRKr28NyYgodl2HQzBc8CIWCNqaLw3VwBS8pkjGGlAhhjd3TS84Unpf/ss88+cMUVV1zT1NQk6+rq/tWHCRERM7M3bswYL5FMoruvzxUgYQanS8shAQNg9erVxQp6X1uDyvhSeA587MXHxPkqju1oN9hOtg329SBZmkJZZZnCttW6YF//1i9jgUYZ671hgcvKw0woCzTuYnS6Zza2YibH9xKFwyQcVeUhYLLzIxEhyDqfmUiX5AY4mMjZc1qfkoifCDvmBHtsyVEJNJSHNoXRYuFfhq3biJd2fLdSIOHB89xobg3+oTVH6PCnjbGvbShxEf1b2rkARrSMU5aY6Pew09EadHZ17l9wBvbZ1dDQgMbGRjr88CPqzjjj9IPa2trge340RSpcSpAtPqx2ngquZxrCWAu7yxSUB+iChnLYaxhSprjBJbsT4rw6iLnQpwpWBqkivl9pjWlTpyKZTPZcccUV17zBGKr0xEmTuoQQCP2Cw0ZI+NCWQiCdTkfV83CQTg4bgCbCJinyGgILPOSqSocXjgVlFsgM9hPBR6qsogzoGwGg423BZg3nUe38I8KqmPJAqR37YmmG/HSU9YRiSLLAbY2DyN6gHEGXGxmxtA+5rwgT4rPlpIlDvTSFOO+O1tDgrAgMkR9SYYeAeb22vZmJHd9coLownG8UggDvdV6BKtBRWIGIdrc85PWEjdEQaELNJUcj3oAQGipQpAIFMI8BAM/z9uU7WTgt+GFbtmyZ2d83gIGBdC6X6+ZsOkPaaOF5ElJ4BbtFMcTCioeibTSgFO03nXdJBOeEaJeVp4jcg75AxkiuerWUGUMHytresjHlpRVEkvxFixYFa9euXQv8234n4c+MJiH2Y0u5keD8Q8I+jO3uqL+/f1jJOIYNQM+ZWLJQCP01A0Psxn/DhyxFRjl2C09CIjfYTyrbZ0aOqqiS2HaIBh6rBUTzW8bnNUcsYqjMKBxdDQfkDNsJQhCg2YDJ0iIC1l8ipBHYRcewEFYbTGTnTiIxv5PcCeuvathWX9GzDNajJAT9cLA7aggOJYSjlGy4apqGDFZznnM2eUBmk/97ExVpr09IlM1mosZgXutsIqQxBV7QjoMBcX5YhYT9d5ViGK0RqAAlydQ7wdSdjDGYPHni8Q899GCmt7end8bMWaMmThiPEVUj4Hs+DGuds+EFAiTCt2rft6S/qSiH8HivPr8F8soQrPNtdsv5WqOiKDzO2bkydBAgEU+YktIS76WXX8KTTzw5/9HFC7697Ollz9sZ/3+rzxO+ojmelIe5xCFiOdTllo3t0bR3dHjFCnofXNt351Ay0SvYtg1VIIVm7ezSRHUuAGvFYyZOhMSqhH7r6edX8X/sQJSialBQgZ44nPozgBHOlEgbSOkafm7bb02VBGA0SJuCfr9zrpOuaShoCFUg3Y2MELSF0047JUjUOXSNR2PyOY9WdYJQ3hESC2BDYDifD5Mvh6KEE5ZQr5Nc6B8YcOoPHT28ooBYHXVY8zx9qPRwuwJr5m+ijn8mk0Yymdznu0hz586l1tZWlJdXjd24cWPm6aeffqispKRr/MSJY6dNm7r/gbMOOOjIo45KTZs+HZWVFUinM3qgv59UYCcuJcJq2vY32IUXRGSYCB+ulJe4R2odVxy4k1eQXlLQhLNArpRCZVWV3r27Xd75pzvuveHGP/5y+/btLe76fiMqjvDnusZPmNCjtS4taDZF9zYbw54nMW7suCcB5LTWwyIA+B0P0GFv6aVtg2LahHJI52wWXjxEoR2Fu7AEQZIAoNC3ZztGjp4AD9C5t/qFuwI6iuVCXqUgLGEMDXeDcNjgclygAUzkoBkCUtQvgzAapeUliJeUaCZyRlII/c2jijJUtQgS0Ti8BTTrVsfGkAVxyj/zQp9tNi6YlkNWIYTlKL2GjYEO0hAqzSpQyGaNZEgizzUttYYyr6vBT4ODg0IUhIUWhgEz5XlRbUzUEAyPFZEp4M3tKx3sH0DVyJEc8tv7+iotTQ2kBzOJkSNGztFGr9m8eePLK1asWPBALDZmyqQppTNmznjPQQcffOzhhx+WnD59GkpKSjidTptcLidjMT+iLSJqzTUPBOfthrhA9RD6lzCGSifDYxVS3AIC2iiMGjlSrVq9yrviit/89KGHHvp/ITDPmTPHJ6J/+/aqrwddeilzKpWaWlZaOjKXy7FtvVhzrrABbAAmEqgsr9yIaG+KIkC/3au11Z6Eti79JBPt9iRG5gzYIxNZ5QjKy8gEQt2wRF/bFh43vhpVwBGDoIfejuDYUGkWqThCrthN+UU3C0I1hAVkAeEoDBGBlQVdA/gSy9bkECstkbGYDyE829WXBCkJwhOQguB5PoQn4UtE8kQSBAg/Krqg7VC1FNJpnd0rYh1NLBpN0MwglwXAYLAyCIIcTK4XcRBKUmUoq45Bq4zu78uSVoBWOacEwN9Vcbit6oBWqk0KMcWxJhSGwBZSPGFMmAtuKDBS4oi3DkN4B9KDGBsflwAQY+a3RcHzr6xUqrS8v39Qg804IQQSiVRJKpGaaYC+to4dS5evWH5X8+3NienTZx57xOGHnX300UcfdeKJJ8rRY6qRTmd0Jp0RnhSRZzq5R5hx+k5byBSk0wwlsaNjzO6YhztVbTQqKiv02nVrvW9/9zuXr1i+4gfMLOvq6uAojTdU+1x6KRlmlmPHjj1t1KjqRJDLGYAFF+7gQk91AGvXr/WB4RPAMBwoDgaA5bvQqQxnpSQSBobI7qqiy00UVoEM4cXQtWc7xhxwAKqSOGR7mt/62CvkbTmjG0XYF8nGURXRdtLqiSND/dBBzg2rhOoPlcvxuP3G02aNXd/+74c+NWUMTJAB+R44kbBNuYQHlCaAeAJIxIHw67YjZf3sjQFBwsspeIYgUyko34P2JJDNwJMEpQWEL/KpKTEfnMlBxBlBJgP09oC3daN00MgPTxyfqhpRVfG+Iw4eX3HonGp0pgdySgX+P6leWWstiWgwkYw/BxJTmGGITXSDsqNxQk7asI7oLBMGxyJ0N7Rf09qIIMiZ/t6+KXPnzj2ktbV1aRitta9d3DU1Naa1tRW5XK5MSGn8eGy8MTxKBSqpjX5Ba71ZSk9PmDAh6fv+hnXr1rSsW7fmx/fed+9Jx7znmG8ef8LxHzz77LPlqFHV2LO7g20POG9sBZc6ZIwuUAEV2nPx3zSMqeDhKaXUKlDy2muvu2rF8hU/WLhwoeeAeW887MKHpldVXjmpqqoKuSBwO7QwixDOMtd+7aWXVksMozUsOGi33ZJdPZpHV3gwOYZEaLHpQA8U+TPYvD4P3bu2Y9qRZRg7AnhxO6PmrcdnOwJm8lrnsGIFAVRg/EIMJ33L86+k4SpFhpQETxIkgT0imji9fHADxGMbOsTrGAbhV3eI3DpHAgtSgPKAIAEkBoBcDJAKmDAI7PGBMgWsyw69p1699H14sY9S6Dt9/J3b5p3z0Ul1556+3+RYzIf5JwN8DQ0NBAC7d3dqExpGuR0HCsNhDWBgokoqVImENIh2bn9hMzGbySCeTMgLL75QtLa2ora2dp807Q9tUBcvXvzV6YcddpnHODomYzOZ+b0mMElmLtGas8bowWw2G580adK4ysrK3hUrVixqXdy6qHVx65GPPPLIly747AUfff/p7x/R091l7WUjPbhTEEV3B+UfaijQ0Udnl6KhVKWUGTGiSj7++BMv33bbbV9j5pD33ds7kdLq0aOQSiXR29eXlxA6majr0RArw+PHjH0YGD4JOcOigl5wCbx5jciVJcXDMYn/IJAhsOBoQKXQ+9gOeEgvhq72DpFMMqrGVByO7T2JSxdRBgUD0G/Nw4Uils8Yk++Xk1VeUBS6RtH2kh13aJySQgqycj3XXDRGIJNmcSSMv1Tfampq6mj06KHvqfYfAHXtbHDzatCq9mba2Y/Mlh4InUKus2OQVQxi3IFIl5X1YOtWmPfH23RDTaEUg9G8eihKh9OetywrXbJmYODBHzdv+flgd98tlzZMnjeiPG5/tgb/UAe9detmnctl8yAbWZ+a/I7iVfpco020NSciaJ0fOwyCgKX0MNgzeCCAZ98B17lZt3x5B4AH3H+/nD59enUQBGMAVHielySieBAEZdu2bRNz587N1tTUmEsvvXTZsmXL/mPZsmVX/fDSS39w7sc//oGenh6P7fQHnAQGxiUOketG5/vVQ5vUUbfBHlOjtRarVq9+kIhyLS0tHvbuyHw4pDJyxqxZJcmSFPbs6YTve5FTYfSNQlAmm6Huvr6dwPBJyBkWFXTINu3q1tkRpY6bDZ+yIV/G+QQnIsDzfPT1dRGgMHHypNF4bmWCCJm3XpnDTp0QDkWjQH/qrO1ChQbDGfXbajEseE2I6JoRBIxcwJBxgWWAlt55xryGROXfuHzDKnnwhc35Lz4NoPF1bzv6d8+dC2/xYmq7Yn7Xx/f03r/Dk/YSbGl47V8ScomZTG7BYDp9HghktDNLgm0UaWOs33NoDuWSEkMtdCQJNG7i0O6uGIZRXl5+NIA/vsEhirfseV5bWyva29uptbXVrFu3rgN5/T5NnDixSik1RgiR2r59u2xsbFQARH19vbjs8suXfe+SS74LIU759GfO99t27WQpJRVOwBNR5AMYDSe5Rns4RxAJKNxB7O3rw+62tgXMTFddddWbdffE95swYZR94Bbw4KE+mw37vk/dPT19d911V48D6GIFva8hdHuvWn2wiLEnjGPahLOssIkhYQEgSLgIKINM7x5MnT7eA1Z60YTGW10aGTiHNYqmlwUDLKy+VFipBZgYliq0AwIiMkNyGmkQcjlGoDWEfBV7sY8ATGurzSGfVo2yp1f1klK24mr5JyDf3tm+s7enB6lUClqraJzd8so6mlY0hZONboglnGxjJ3UhIjCB+tODGDdu/BgAoqam5p3Q8edX8eSFWlKzbdu2TgCdAMTu3bvDXY1pbGw0Rx55pP/cc8+tvvuee5pPe/9pF8TicZPLZqUQ1jidwNFOJBThRQMqYEu3Oc8YuIlCIiLP91E5cuS2N+lKY0dRlY6fOHFkNpdzQ6I0ZADHGMPxWFxkM9mNS5YsWeNkfcPCNWlYGPavdtv3GOOZXMDkCafedR2EUFAfRiCFTTU/RtTVsQPTps0s8YDphgm1b8MxCW1A8ybk7JqH7MzoQxtSx79y3hcj4mCZoWErS209RvdJgAn/y2YB36c+P4U2WO7/NV9wa2srA8DGtRs729raFUBCKeXMngDlrER1ZKWqnYWqo0G01T9r5x9h3OcEiJ6ubqQz6RPsDlkYvPMC7Nh2MCI5WQjY5tVUw9SpUw0z04svvnj1U089jZhv7VvzZgj0qtgyKjC44mhoyj7kCjy4BSGXy/l4c9AZzIxpU6YcNX78+Fg2kzHCKVHcN9jGsNHwPB+rXn7Zxzs9hHA4AnRzs725F65M9/YM6L54XBJALp6U8mOsoU6YrJgtHo+hu22zmjF7Bh3sYwYMo33uW3uCDef7HUMUDWHlB7st18zQUVIIoLVNXDEFgwPWNtSAjAbvuzNyBIDG9GJzoPl5HSD7zw6REAJ9fX3L2js69kAQqUAZrUwUkGtDGawvtFLWzIddsG4IyGFTURv7d5700NndxeXl5ana2tr9mRn19fXv9Jub/14l29zcrIUQnE6nl+/evXsTiEWURgY4m4C88yOF4/kFfH/4Zx1KLB3VIYR4M6oBcr/X23/69MPGjh1LmUyGQ38aY3RkLctMJhbzUVlR8Qgir8UiQO9LyzCDNvZhzUDabJPSdjYErN+yINtIozDV2o1Ax5Ml6N6+DuXl5TjksLJjAfPPfOP3+rJRVvmYKcP54ZX8uLTLKIwqaRPpebUz8XdDI5BkP4+UG7RPggiWAUEWOMsI3B89Xf7O92utBYBcZ+eeZQRAKcVKKxvxFUZ5gaNYMBtvZaCCwI2Y26ovb/LPYAalBwa0FKJs3rxTDx9m98M/WtmqqqpMKAUKr6MCUV10Q5khO7T8zi2soF0axpv3JHdG/dOnTTuwJJWCCoJI/xdN2IabZCJs27q1HQAKfamLAL2vrAZbme3szm6xo8fEQtqGoRTk7DgBIaw7nAQgfA8DvZ3kSY05c2bPAYCGlqa3lBsIQddWLBQ1ukKQDhNK8vl/+eQTu2UHDFP+RqNCydw+XelhWy86N/egu/Brr3lqGxoEAN69e8/LmUyGjTGstYJWCobDijlvzm+Mdn9noLSyeYUOpKNsRjYIggB9fX0YM2bEPACoqanBu2GxTWbIT2WafJZjlDWJ0OAq1BuHDToMSVE37ji+KfhsP06cOWvWSBJD0+TtwFbk4OelBwexp63tcQfQw8a1f9gAdEOLVaj1pbHYGMAXZMhJ0KRH8CXBkwKetL621uBFQAUZ0d2+E5Om7ncggErpfVy/legmXJePHQdoOB/bFDYPI5c2zts9WlDOp8TYzwWsURTB2E7Pvn5+X1dk0+rVqxkANq9fv6Crs4uklMLGgLk4K1c9h/+FIKyVdsktJqKPwmrRMENISdu2b0PVyJHvAeC/QxqFb3h50oN08fEccfeODmJ7vRmdLwTYGSRF9p7EQ2i40OJzb18brmKfWV09akp//wCDWUQB9GEgBDPisTi1d3Rg0ZNPbhx252q4vJHVrfa5vrUt90w2CyTiQma1hiThUr5dsCrlm4dEBCE86ti+lqfMmjZ6AnDEdoMFb6WrnWenu6G0gQxfmnNhCxvRBm5IhSky9c8DjYu3YgHWDKWZmCSUQgpAORid+3ol/c9Wc3MzExFefPnlFW1t7X1Tp+1flu7NsIxOJoYY+Vtg0fmIM3dLG6NAQjhjKgPf88TO7TswcfyEw8499yMTiGjTGzT2eafU0PY4sPMIzzuz5hvPIb8c2Uo7epBeTYa8OYeKmQ0RYfrUqTP333//2EB/H0jKyMipYMTflJSkRG9P73OLFy/e5YZlhs35GzYV9Gx3pazuwEt7+nMqHnOW5JT3OBZkHdyklM7JzSCWTKB948tq/MQJfMR4vBesaPZb2Cgk57+hXRUMJqs8cMY/SueN6sPK0FaDHL23wp8PDYEy6UwcQOqdwHe8HibIGEMAtu7uaF/veT6M1syu8lOBspU0m3wwgGtohccr1D9zxN1rMEDdPd2KpJAf/ODH5hFRmE84rJdyO4vIBrbgONmgYg022lqLmjDKzERKGZg89fEmISEJIRlA/OBDDz169OgxyGZzWoRpQQUBAwDY831s3751B4AA+7inyrsWoBsBw/UQnWm0pbPmhURMwJPQgiwHbeWeVoRPzqBckEE8kUTXrk0imUrQ7KMmHw0QN7TUv2VbXWtCb/L8X6TUeNVN4PhTrUNdb4HsyW5WYVzVaIzCQHdXDEByuFypDQ0NEgC1tbc/qpViEqSNkxUa2OOmAuUS0LmAFiqgO1zyeajqCFQAAmjHtu00ZtyEs5kZ7waaw7COjoEtBNhJE3XUVA3T4e2DztJmUSJ72O8Ivcr3/j48rNMP3H/KlBopJSvbKI4MutgZigsh2BMCGZV7xPHPRZndvrrciLHa3qleYADxmIDnGoRRIhQJB9TGArcUUOl+6uvcjgMPmnM0gArpXfaWaWLD8eyQ4rPVjeUA800cB85GRyYx7EzymRHJyqxCwaZlq5yWw4rCsjw0L3/hhYfaO9rJ92Myv7MwUCqwUsSCaCwVcqqO19dGu0gm20RUgUIsnpDrN2xAPBY77ayzzprqBhyGtZpDBQpK5UHaaA2jrByR3bELwdlei9pGoRldYPfKkdXAm3CZWTNFIWbNmnXAqCCXgyeloyXFkBF03/eop7fPLHh0wVoAeBOnGYsA/UbXlc7zYXtHZnHfoEJJQjIRW/6Zw5MapkYJcBjQ6sfEro1rzMGHHzJ6KnCkMW/hwArnt90GVrmkDEeDAuR4ZnYqD5upZ6tEC+ZhkzDssgurEdWBBqCGi2y/ubnZEBG2bNny7PYdO3b5vi+0NkxEtqFlbKKHDTRV+S28NpEiwbgKMWwesjaQUqJ/oF/5nu9/7Oyz64gICxcuHNYAbXdiCsqmsEArZY+ZNg64jfsenac+3ABQpIsOG7Ja7133DQD19fXMzJg6deqJM2fN8gbTaZaeJFHgVy0EwbBhPxaXO3fuHLz11lufISI0NzebIkDvo6vGeUOv24Xn2zoDE/c9KYiYXDKIHGJIblUTbBjJkhQ6Nr1opkzfj085zP8wWNGX3iIe2hiGUrZi0dogzK2OBlNQMH4XbVEBpe3WVCsDVcA/h+oPIUQAIDuM9nt8ySWXeAD6dnfsvlNKCctwuAdTyDOHFSHrSPVitI5AWSudnyp0W3bf88XatWsxaeLEjzOzqKmp0cMZoLWxx0ApFQ34hGndxvmNFw75aK3s8dL5gaCwsrbHf68itLj00ksNgFGzZx3w/jFjRot0epCE8y4Ig3LD4KHSkhJks9mnAfQZY+Rw4p+HHUA3Wuyi7YN4efPO9CawIUmCrfrBNQoFhmiFCQQ/lkCma5eA8OiAI2efDhBqWvgtkdsxrOZZaTsdyM5MwoZzhlI6jrJiOZpewZARZ2sgZJuFlvyQhSPAw4nmwKpVq5p6unsgPSl0OFEWOgK6yo4ZUYM1rADtAItyW3erk9baIBaLiZdeWm2SydQh3/te/fFCCK6trR22zUKtVHSclLZBr1qpIcBtuHAK0wJzoBSUZihtoI2CMvrNQMPwnptzyKGHTo/5MRdanzeitiIsASkE+56HHTt3PA1ADTf+edgBNAA0zIUEkN3eGSzqG1AQnrAToU43KYWMvDhClRZJASBL7ds28JHHHTc5DkwR0uP6twCgSRA0A4rzVpiWxuBoYovZUTMm3yiMuFZtoJQNgVXKQLvBFSbyAPjDqZxobm7Wzk/i8T2de1YlkykR5AJjWA9pnAL5CtAwQyu7GymsAt3Tznp3GI3+vj7evm0HTpz73q8wM5qamoYvxeHoMa0VjKM0Qt5ZK4Ugoj20A+agAMgDKOU4bKWjJvXeWnPnziVmxn777feBo485Brkgpz0pXe9laEiy78eor7/fvLh8eetw5J+HJUCHxkm7e/WDWzuyiPmCQBIgEQ5wuLdtq1SbYaghEyW0fc0SfcgxxybPPgAfZWOAuW/+8dEG0Bp53wPXBMxPvMGZwjiAcRly+VFwS2konR8w0LbBGAdQgmF2yTo1h960ZdNdUgporUx0rLRxx85NEoZbdFcZcigZcyAVVoa5XA6pkpR86sknTHlJ6Uc++MEPHgnA1NfXD0su2qpdLG2hnXpDKw3lqJ+oWlYWlFUI2o631kEI2Gqv5zk6FQ3NmjXruOkzpmOgv4+EtMlCNjTZzQYYYxLJpNy5a1fnrbffvmQ48s/DEqBD46RV3Vi0uT3TK4Q17QwTVcPBDlu+svMRNhCxFHq2vULJ0lLMPfXoM8BMb8XYt3mVl0HkbOcqagJHuYXaIGrkmGjiK8+lOmcv0tqwIOEBKGMAtcPI4auxsdEQCC0LWm7Y3dGeTsQTUgUBcyQ5LDDuL9CMo2CsOXy6WZ7a/rUUEj193Wbnrp3+Jz7xqS8REYdpLsNuhTpw43YUoVQxnMZ0ahcLytpx+Mr2O7SGcny15a33KiaS45+rDzpozuGpVBLZXE6EPaS87h8wbDiZSGD71q0vdXV19RpjxHDjn4clQMPpoQcHsautM3gyUExCwoR2nqGHcmF8lFVCCKhcn9i56SXMPPqk94IwXsg3f+xbEFyOnvV6Dk3Sw/9nl/bNLqop9OjQKjStp4gagauuDQxLO4UYH47n17ARbW1tGzdt2vhERUUFBVobw8apYDiahouq5lC7i3xcmHG8vnZfN8YglUrJRYsWBSNHVH3m4osvPE4IoYdlFU2IaA2re+aoeVo4Gm/lizr/X9ggdFW2rboVAuwdL465c+dKZqZxo0e/78QTTijNZbNaiIIwUZeMA1j9M4PRvnv3rQDY+bWgCNDvgFXTaN/X2l3q2s27skjGpatKXfVE+UrKaOOadAHgJWjDsgXqoEMPT9Xuh/exMai3nPabtnwbCWKBhQpAGXm+OZLXha5sIZ3hPi8cWuECy0i8RePqb/n5rakRAOjlVS/9LhcEiMfiMNEgSn7oB0BkMIXwScs285EtoR/xmYbZJJNJjvmef/vtTd27du1JMTOtXr162FXRUnhRw1kbZYHXFQD5pmp+Z6a0imxa89QbR5auweDeAeiLL76YAfB7jj76rIMOOhh9ff0spYwa53n/Z4OYH5O7du0K/vrXvy4A8g3kIkC/A1YroImAVR148KVNfVu0NtKwZuMaQpaf5CGj00YpMCWxY81ySviMD9fOrQUxGlr4Tee1wsZWfpw7bBRSVOmF463a8dIGfzswEF2heQ+KYTkV19raqpkZTzzzzP0bNqxdV1FeJrK5nDFGF4x5c75qdpmOkQ7ehIZTDG0UCyFURUWF6OzsEkuWLvnDddffcOgdd9zxmKXMmofdQ05IYVVCCLl7p9Rg87eyO7etI0Y0aZjn9l2PZO/Y9dN5552nAYw44ogjahLJJDKZrLRWCO61up2i0tqkSkpo29btL7W2tq5lZhqO52nYAjQAPukkeADS29vSd/T1ZtgXpENrTm2AIFC2seY62lY+xMhkc+KV51sx54S5NUnGeCG9N3WqkETeYY0iOmOorjmUjZnIRCwPQox8hRg1vwq2gsP1/NbU1EgAudUvrro2m80SSWnCdA0UnDAXeRAdq5DHdFponUqmyPekt2LFig0PPPDAmS0tiz5HRDsctcEAMNwkd77vOcMtDC1SXB9D6zwtFFXShUkqrpDQTnvu7wWErq2tFcYYGj169AlHH3vciP7+fiOFc5oJr2V3zQsiLYh446b1DwLQw9k/ZdhOTI127nZrt+Oure1pkoJELmcQKEagAKUJKsh7WyhtkM0FoHgZrXz8MTVlxsTU194/+gNs9JtOc4Q+u2FKRdgADEdtdeTNgbyJeigLjaR4zkPBKTmEENhrtc2+W0XTgpZF12/atHFPWUmp1Np2GsLqLhwHDjlmjhqprJPJpK6oKJfbt28LHnv0sZ83Nzcfs3Xr1vuampokM1NjY6Nx9McwrM4oAlc2xtnbahitnOwwNE0qpD2cp0k4jekah7yXDPtra2tBRHxKzcnnzJgxnft6ew1JUUDZhZFwBp7vya1bt9Ijjzz6CDA85XXDHqCbAVNfD7ExgyXrd2ReMqyE1tpkcxq5QCOnDLKBRjarkQsMgkBDBQxIH93tO6i7fRcf94H3nQ8ADS1vXoCUAEf5bnmfAwwB6cjzORxYQegBSeBIF4oCNzfNLpQgNpyr6IaGGglgz47tW3/l+5KIyLAp2FkgelCBDSOXU1oQmYqKctnX1yufeOKJh++54873Pvn0098kot21tbWyrq5OA+D6eojQevSyb3/w1M+dOassQrd36NJaRwVpEOQKFEAcTbJqlfcyiTw5QqDmgsqa8x/3Fr3BzCVza2pOBoPSg2lRGFBhTQ8YWhuTTCTF2nVrty5cuPAp9wA1RYB+B97ALdbEP7N9T3BTV08OgDG5XAClDHI5jUxWYTCrkc5oZLLG0hxBABH35cpnWnn2EUcff/IIHE1Cci3enCqaJPJgG/LQISgj78qWdxbL54MyuMDvGG6ghawaZPifXzQ2tur6+nqx/PGnrmrbtWN3SWmJyAU5Y3cXVq3jxpF1LBbjqqpKmc0MisefWDz/9juaPvLI/Pmn7+ntXTJ37lyvsFLmplrZ2AhDRHzv9R+5cWQi86WSyfvnuKn2nT5KTAAkCcF2ilBHLn9sCm1tTZSCHk0UGjW0otY6GpR6o4kqc+fOlcYYes973vORI99z5ITduzu0lELkp0JNQbwVGcMGa9esux1A2tEbxQr6nbkNtk2y1dvNbRt2ZTNCklTKcM7xz9nAVs+5wCCTM8jkbEUtEylsXrXMjBg1Wnz8M+89n2DetMkyQsHgiclbKYb5hAaAjiYh82PfXFBNMxPYEGAIbGBVKmBoIIfhvbilpUVs6+3t3Lx5/c+S8ZgQJDgMCXbDDGbkyJEyF2Ro+QvPL7rjrns+8fDD80/bsaP9XmYmAKK1tVUB4HpAMLOgumZ91lFHTX3lia8uHty5+/z/bnjsl7/57cPZurrmd/ausrnZ+jkK4cDVjXcb5SSJ+cazLpDa5atpjUCraPxbuWGWNwrQLqKKP/TBD54/ZvRoDPT3IXyNzOwqeOuj4sd8sWXLVv3wwof/WPCzKAL0O3OZplrItiw27erMLdaBJs3GaMMIlEKgQpDWCLRBJme/pg2hv79HrnruGRx84ikfZ0aVOO/N00TnG4J5jW4hUOcHVsKoK9dEjPg5N5EYBahGr3O4AzRaW20Vfdc9D/0iM9j/YkVVlcgFOldZWWWqR48Wg4O94sknW+/50403vf/uu++Zu23btlscMEuXvGEAYGH9XK+RyBCR+dX3zrngN9fWPDmwdd0J365/YpuaNOlFMFOzSxh3P/+OW6tWrSIAwvc9NsZAB45zVnoIzWZMnvcNAZrDpmDUSLRKjzfKQdfXQwghzJgxVQcdd9yx8/bs2cNCShnSJ6GO3dqgap1MpsTmzZuXrVq+akVhr6AI0O/Q5SxIeXNb8Oc9fQqeAAdKI1BhFaARKNs81JotP53NIpYqo6WP3qumHzC76jvvG10HNqivn7vXaQ7h5kyibjrnTfoLvXej/znP57w3h4loERv2aacNxbshn9pV0XPmzCEAgcp2f//gA6ZQZWVFrH3XVrHgkfvW3PanG//jgQce+WhHZ+cjzEy1tbUhMGsAcFWznNfYqg5knrzgroY7Pl07+4bdSx6t/vLX7jeZpPwatmzpcvazbKxzD79TQRquvRzkgnyOo5Of5rX0ZogxPxeEHORpEW2HR94gu1BTs1AwA+fVferzM2bO9Du7OrXnx6JkHG00NDNyKgCzYa0NVq1c+RDscMqwT78Z9rdxa6vVRD+9HbdvaMttE4KkUsZEgawuUUJrGy+lNCMbGLDw0bZlA23fvB4nnfmhbzBzoqHhzdhOWZVGqG0u1Gfnb6eQA3E/ESVgMLSBSwG336+dF4WLZRPDmJ6LVl1dnZ4+fXr8sp9cNX/pMy2LnlvScsuN1/7+/Y8seOKwHbv7biismAsVGQvr671GwBCRvrah9vw7Fv/k6VlV7Wdtf/bO3C9u3CBebqfLdw2Y2y888kh/dn09f/Ob3zzkkfnzV06fPr2aiLi+vv6dGIhABECpIK93Do35X6VzjiSKBUMrtijQQ9J83shrsdauXHnkUUd9sqenF1opoVSA0KWQnf5aBYp9LyY3b9o0uPiJJ24iIgz36vldAdAA+JxzIAEMbm3LNQ1mDDFgAuenbNOLIx8LaKMRaEY6rSDicbngzmZz0HEnzLjgyMRRQgjTVLu3m4WUnwQ0+So5kt1xPsiTC4A7BHLrjeA0qrAVDzGY2EAC5e+WMnpdxTozenTVoT/6xR8+ee8DLZ/ozeIRIkoXUBkRMDfV1kopJeY1NqoTKjB18V2X3XPmx469sfvFh8ZufPJ+85d7d8YeXNJ7VadBPZi9Iy+8EI2NjeboY4752rixYw669777bj/zzDPLGhsb1TsJpHfu3EkApJTSWYq64Vrt0noKXBIBuBBiU+ABHTbsCq5XY+D7/56as76+Xgoh+GNnnvmZQw89ZNSuHTu0INscjOSlTvKntdapVIpeeeWVhatWrVrvvDeKAD0c1mxnoLRlN1+1tSPIAJBBaHRfMBodTv8qZRAoAxFPYd3K5dzf2YnzLvjkt5gZtXu5WSgl8lKiaAKQo6BOuLgmmwtnnFg/PwbOzkAp1KqGWmnhScjh6cXx2tfxMgQ+kZk9dapwQyaeq5x1Id/JzLKuuVlrrcXV36393k2PXrVsclXPmYv/dEXQ17aNH1+d6//jX/d8tl3hYmam+vp6XHTRRcGvf33lvFQi8enLL7s8eHHlipN++ctfPnzeeeeNb2xsVAsXLnwnVdIi5sWi/ob1IrFSOjvOHYbtamgOQZkLgowtLRIm1Gjzb+/QqKGhQTNz2cmnnvwtY5gHBgdJaVXwQMirSKTniZ7eHvP88ud/DYDq6uro3XFhvwtWI2BqayHX9WL9rk79gN22QYcJJlEwJty4q7EArQINP+nJR+5sNrOPOPbMT07HsUCtqd2LVbQgEak4lDG2qnFjg/lKhQqmt2wCSzTIwiayIlUukRkgeJ6EAOQwMrL7R8sAgJcoe6Ernd7ttr4qJEhDntlJ5/TPvn728U8/9OOnz/344Zd3rriz8tn7b1ZjJlTTmh1p9cc7d318l6E/1tpdFzU0NDCAqoMPPvC3K1aslGPGjJYP3H+fXvDoo8d945vfevar3/jGyfPmzVPM7GEfP9hdXV0EgBKphNMU60gul0/uzo9xh0ZKUW/E+b5EzUPHT/87Ko6mpiZBQvApNTVfOP74907csWO79mO+iMJsNUchC0orU15eLrZu3fbKrbfeOp+ZMVxHu9+VAA0AzVYhRVvb1W/29CoSHhMXppJwGDCKaNQ6CBRiJSmsev5ZDgzjkxee9T0i4qamvTA+VWs/+D65aoQjxy528joOHeqizrqMzPvNEAoEkSWp3Z4KSEGIAf67gIKO1ubNmzM7d+4cHFoxN8mQZz7vmCnHPHX/T5o/9fn3PT4Wa97z1K1X660bNvN+UyebbTvavZvu3fbTlwbpr7WzOdbcDL1w4UJBRPrO22+/pLOrc/aWrVuU7/ti1Mhq+dTTT+snH1884aLPf/7+G2684SIighCCm5qa9tnG1datWyWAeElpidHaFMRamQK1Rj7LMWoiOgmedpU1v8q69d+gOKi2ttaAueSDZ37oK7F4jAf6+wRRXnJq4F6LBWyWUuCVV1653t7Lze8a3Hr39PoBXV8PWr4bizv7zdNxycIwazYF5vcG1h9XhdWEy64TkPc132YOPul9Z5wxEkcJKc3eGlzxhBuqoKgQdFFXzq0umowjKMO2CeiGMOwFzaF1dFRVa2Pg3FR9vPsWcX29YGZhK+Y6/d5qHHrP9f9zy49+f8lTB4zLnLP+wd/TS63zDccrZMXISrNla1vsd7dteXzJLvyivp5F82oETU1Nct68eeqaa645sbS8/KuLFy3WZWWlMvQ7qa4eJdeuXWNub25OHn/Mcb9/+plnfm2MSdbV1el9tZoOgoAAJFKpEoQRUuxEmaFTYt5OVEU5jyZM9DY8xIwK/2adEnLPp5566qdramombd2yxXieL4zWeT7c2CZ4oBUnEim5fv2GwWuuuebPRIS6ujpTBOhhuNxkodnVxb8KAgNfOCN353tbaKUItuZFWimkSlN4fvFCzmmSF37tQ/VsDJp473DRNizCRIBrIqe1oQ+OSONsQvN5cvGyBCLr9UUFuXzMChKQAKP93cFzUFNTrWRmUGOjISLz2aO89/z1D//zl5vu/eUzxxyUOm/rouvpmTuv0dlsFn5FpaislGpPR4e8tnnDrYu24CxB2NPYCMPMqK6upgsvvDA1ZfLkG5944nHWKiA2hggEEgSlNcrKK0RnVxf/9srfqmw6/aUXV6166oorrjiRiBQAZma5LwG1A2gZj8WsOsi+G8c7o2AoRedHuqPquoAOKaDW7C7wX6oDQu7ZP+P09389Hk9yT28fSc/L/173bwtiGANdVVnBGzasa25vb28bjsGwRYB2q7UVmhnUst7c096N9ak4BDObyJRI5wdA8lI3BjEjHmN53y236KNP/8gZH5qI9wh5nt4bXLTvCSvUjvTPlK+InaG8coAdmf9woezJgJhdxVyg7FAKPPzPLzXV1kpmFiDBdXXNmoj4x5897PjH7264o/7q3z979KGjPrH5yeb4o3++Uu9u2w1OjJI5FihNsmpv2+1df/um+Y+swycFocNwdLzEvHnz1KmnnPqXDRs2TN22ZYtJxBPCGONkjwIAIQgCeFKS7/neH264Xj/1+BOHnnLKKYueXbr01+PGjZtERFoIsc8AdU9PjwYwIKSkwF4f+euI814b7AKL2XDkyJU3nbLccCE3/a+suXPnSiEE15x44ifmzp07Y+uWLToRT4hC7X/Yb1FKIx6LiY6ODlo4/7GrAKCuru5dtR18VwE0AG6ogQSQ2dqJX2oNkhLGRBVpaMGYn+wzmgFWqKhK4eVnW3lgICu//P8+08DG4EtfWviGb7pUPAwvze8YDfIVTZTQFJqWO7tMht2SgkRkHckANAsELrswA7SDgNHDp+Kg+nqIhfVzPWaWEJLrmps1ERmwGf+X7773M0/f9Z1nPvutLz9x4OT4WW1P/QWL//RzvaetnePlo6QyQCYTcCpBeseO3d5v/rR1/YK1+J3buEgAZuHChR4R6T/96eYve1J+dOmSpaqyqkqGQbPMFqSj2Cxjdz/Vo0fL555bYv74xxtNkM389/z58x9//vnnP2uMSRCRDitqpzChtwGwaebMmXL//fcnIQSCXC7ikCO3P3cBGrbKDu08N149LWiY8+np/1omIbW0tBhmTn3kIx/5fiKRQndXN3medLtB902W50MuF+jy8nKxYuWKhY8sWLCEmcW7pTkYUaDvNoKy0VXRROqGiSPkNyaMFJNzAQwRhLvz8lQD7KSfJOs6l0gJ79brr9Ff+uZ3PvD5I+795MmnnPKXplrIuuZ/PbnE9QiRjBMGs8hXLc4XOrJXDC9aZ2BnJb2hibnjEF11HSbTC+HDT5QgB/SF7+mdCMaWrwTNmVNL1dWz6dRTL1eNjcyNaDVoJAAY03De1JOPOfXUj02aPufUMdWxqp4da/Di/Vdzes824yVLZHLkKGnNsQJkAs1lJQLr1rXLm//a/pcnt+Cew/fHk89stL5KIe+8ePFjczra2n/ZuqjVVFZVSmO0jUgrODfWo9ieATf+jcqqKsEM/OXPf9b77z91v/e+94Q/LF265Ftam59++tOfvp+IdgOAEKLAWS40jX1zjl9TU5Oorq6mk08+Wc2fP38AQFwppYNcgFwuh1jMGh4KIVxng/MJagzrlliYBBFeiIwIpF+visNxz+rDH/hA3amnnTZ908YNOhb3pdYagmhIarcxBp4nqau7Sy9atPi7RMR1dXXvtoLy3QfQALimxpr5b9nNl4+ppOslcVgfIdrVkcuUdbWOUgrJ0iQ2v7SC1m/ZhfP/65OXXve5K++sbeJswd36L6+YFOiLhlFsxUzOjc2+ljArRdjXwgwDE5mYh6539j4iCMEgSAEvAQLS9VqLnUSi/g2AQGN4g73qz3/v+P6TP9tKuLCCrAcaADRgrmiYM5pR28TS8wwz0NjIDEQmRWIucMiXLznu4FFTjzirasKMU/abOKZMDWzGhhWL8cqDy3Umk6ZkaUrESkfI0O8YMADBVJQLWrVml7mvtes/W7fgWoez7MBD1NbWmrM+eMLUHRuWzn9uVRs5c/+wgxs1xwgAk/1ojZncrobteausrJTbtm7lG2+8wcyYPn32sccd94fbbrttTywWu/Huu+9++Hvf+95SIuqC6zsIIfDoo496HR0dvGrVKm5sbAzjE+mfHMdC8BMA0NDQYG9szzNaazj7VACIX3f11cfPnjPn02UV5VOeefJpZmgyWoMERYohogIsFiLaLBgYCCaQEAUVtzu+rw+fqaGhwTQ2NsbOPe/cbwPM/QP9lEwmXZBz+G9HVbweNbJaLnv++db77rvvaWYWbidSBOh3AxddXw/R2Gj+PH6E+fp+I2n2QIY1k9UNs9NJWMNw202GICilMaLKE/f98df62z/61dRLzrjvmyTkZU1NtbKu7t/celFhUoq7PAvyCW0jJ0wFsToPBwlRGguRS2LRzlTJAAYelF8y0Ch9A5Imf3/T635dfw+o/9m3UsEXtVKv3s6zkB43RikFABoZjWAAraYx/xsqAcTOmISjTzltxqgDZs86sXrSrCNHjRl98KjRo8Vgdyd2rl2KZ598Qad7OmCEJ2SiVCb9SjAMgsBACgYRw/ekLi0h2frEVvPgov7apzvprqZalkSIDLAaGhqYiOjhO75xzeLFy8f1BSN1KuFL44z/w3cQjd0bwBqeFChqnCc3DCORiFMymZBbt201G2/ZyJMmTR55xBFHfuP097//GyefPO+Vtrb2x55//vkHGxsbH9da98+bN08NeaoxC8/zIv5A/e1xHPLtRDYluLExOkuxkpKSyp/+9KdHz5o160MjR4w8mWFmdLTvwZNPPw2lA8R8H1prSJII36cQIipKoqojLKwFolST8JojIYDUP7+cmpqaBBHp88//9PkHH3rYrDVr1uhEPCHDAa2o6HDxZJ4Xo5xSWLRo8c+dFSy9G7HqXQnQAHj1aggAuY1t/P3RZeIuQQzF9p4Lm3ZgA8soiEiKFIvFsWfLJrFowWJ93sWf+9aVDzZcX1vbtLMeJBr/jdFTEgZgmTdJCq1FQ94vvGaRbyIKV96HmmiL6bYCyQWMrAJENp0rDQZmjQZMFhAKMKG1XQ4gD/ANEFP5STsiQAWADhwNXoC3ZMvQ6HoxsBI+DSDD9mMWtpZSbD8nABkiyr5G9TcSwH7jADkekAcdAH3MCRVYv6fyw0ccOrNkv5kzqphLaiZPn5wQEhPKShMIBgfQ3b4Z25cvwPLtG9Rgfx95nhCpklLpV4wE2DZHowRvYScsS0p8lYoZ7+FFm7ubHx08/5U03XvhkezXNefrPuaFkoj47pu/2rRh7faabXvievTYpFRB4NQOjkJylTJghvKyBRU2ke1fgGyTLZksEb7vo7u7m++//37jx32x/+Qps2bOnDnr9Pef9qUPnHHGlvbdHTu04QWZwcFFa9as2XXJJZfsJKJ25Ef1FRHlYIdvXnMdcMABMy+99PvxDZu2nXH8scePy6ncvPKyiomCaGR3Tw+eeuopbNm8mQMdmJKSEun7Ptjt1NgY59olbNNZCoQWBJbRMFEfJKR4hGf7456UOi7i/2x3RrW1tQxgxCnzTv5hV+ceEwQ5EvEEokokvOeIoILAjB8/kZYvf+6FO++88wHXHNRFgH4XreZm6NpayOZmfc+4SrROHSvmqixrAmS4zSNynK/d08K6gGmUVqTo/ht+j0uvu6bsN988qZGIvrCwvl7+O+YtHoTNRdR27NvKUQ0kRZF4btqQXa0WVt3kQNtVIK7QUyTR05umDx97sv/kw6c0SV+DTWCxlAwYEmwECHk5oYVgGYGbpVEIEHYQMfQIkSIcqiGAPKuXZUAKynlSZAVJLT0R+D5n2BDFfD9dWl7S63m+BmuAAg4C8js6uiZks3pMIpaAJ2OIxSRKymNIxCVYlYDAGOjahc4tr2DPzrWmp30bZ/q7WGklvFiMRCzpJctGgMgNTwSBPUbMYNYwDKgcc2mpp3PpjPfwwu0rrn00+4NUScnTtbUD8prmPNA1NdX7RPNy8+/6bqPKdH10wZODW2YdOnPK4EAvkyCyFV7B1j/kHkK7QLL8rRAU6dCJLDUASRBkp0B9P0ZVlXEZqABr1qwxK1euNMlEUo4dN3bSxP32mzR69JhjR1RUfnf/KVNw6qmn7qqsqtrc3tbmd3V1md27d8PzxJ6SkrI9Ukrd39dXycyjS8vKMHbMWFSOqBS7du46ory8Qk6ZMhODg4PY07EHy59/Abs7OnQum2VPeiKZTIiETBQEsYYAzIBxD33XfyFBEFQYN1X4MwLZTJZ9zzelZRVSCOG9nur5Kxdf/H+HHnpY9fIXluuSkpTjngXIXVfsdidSSs7mMuLhhx/5NRGZ5uZmiWGaUP9vbGTfPasWkM2APmQMjjluhvdEWZKQVUZK4Rpu4V7PeWGEh4yEh/7uARx83CnqvE+dJb7y4Yvn3douF916tn7dDUNugqQ66Hu/WX3/pg58cMfujI7HhAyt+SnSqSLadjIYgghEFtQFWb8Y4/hD4xqNGozxU2Zh1KhR8DwwWVYavkeQ0rcAIpxgTNitKkhCgEHETELYf1N4jiOFa5gKkBuHJ5IkhHCqEttEtSF+5Ao9cv+OsJW+1mCjnOmTgskFrANNuYE+ZDP9yAYZNtl+bYIBmCALZiWEFBCxhJBeAiQ9K4OMpi5ttSWELf7C3bHWjEDBJFKe2LGjG4uf3vnbW1fil2NKMEkKrNzRhz3hOVh69YX+URddE/zyR//5mdOOiP3xx1cv7xg99ZgRUjCBWYQTdCAGkYyGO5BP9wAJ9z6JbFK2a+4SuYBaIdxLtQ/ckPMNG4tKa5PL5gDASOmJVCpJZeVlVFZWhoryCni+BykkhHDVOwmw0chkMsjlcshkchhMD6K/vw99vf2cy2UMQOz5nojHExTzfSKiaHdBAISUUXhudJ25az281sI/5wdaAAH7fjLpjKmsqhSlZeV4fPGiG9esWfO1mpqa3gLuPH+P1dbKO+64Qx984ME1P/vlTxdorfTu3bu9WCwGEZoRRNQGoJQ21aNGUWvrol2Nl146UwjRb4x5x3a6ixX0G6miEVbReGbiCH3TIZPlBTnNCkweCpOEHWCGkjeYAKWVJXhm4WPixPd/UFx8+UXX3vz5qw+tbeLgX20YSkI0ym0Mg8hENwejYOsX8Zy2SgSEjaGPHiDsuEOGx8DOdS+gbZ2BJ4kkMTwpICVsFRxVghS55IU7BiEEieimdV+jfHc9/0wPOUuCIHoVK0MsHBVAwlknE4FhQcl+1f5GKSU8X8DzPJKe54lYDOQnQBC2EUeOb4mGJCji5sEMYw9F1ECNe0IlYtp7dsX2waeW9352/kY0X3gk/FeWYUtrAUVw9dVX+0dddFFw0Zcu+uSH3zvmj7f8/Ne/7hRn7plRlrxUaUZ/X68iEh4JsvxogVoDTvEQNmpFyAIJArk3RhCRJLKw+pZSIHzWSynh+75IJVMgYVtymg16e3u5u6vLbHQTfdaoyA6LhDsqIQQ86UF6nv3XBQnf98j3S6VwlBzBppeHJ1eIkE7gAvoCIfrmG6H2Mop2V0SAkB6U1kza6KnTpnqdnZ0Dt95y87cffPDB39q+TuvfoTaa0NxMsc/+x/m/2m+//ejZZ5+hkpISaKXBwlbuNjvSUkKxWIz7+vrEfffffz0R9d969q2yrvndSW+86wEasE53zKAZKb5kXCXOqS4XqcGAWTCIOdzWsb0JnXE+CbttHTEyJv78q5/qy6+9eubvPvP4T4jEVxbW13vzGhvV6yjfGQA0PMkcuCoNIHZVWQEnpw1b3kXkOc/Ih8NBpnB0DLMFCi+ZcpUXEPcAT1qg4KiDJ6Jmj7slbXUu4Kp0hhDSNiRD7bV7PRS1+V3F5WosW0kCbDiqqaOU0ryI0Q45uAcDMVuKX0o7RRbYBxCRsRypcMBS0Hm0zIyJHlpK2y9UlHlschlvwVNtq+9ZnPnc2jSeqa+H19gY8c0EgJc6cP7GV7/w6c+dNfGmZ++9atMP7um6BPhjbwofWzJrzpyrxowZu39Hx24d6IA86Ql2Ib5EZHcSlO+iUQHwQZCjW9xrDytQN60Xnlu7M5ERGBptIjpWCkFSCBnzC2SXIZ0VHgDKV+5RqjsQudHl1ZeuMh7CleepjbCeCAm0Qh/ykK4RREin+3VlRaWcNHmyt2LliuXX/Paaz+3YveN5p67g1ypK6uvrZV0dqXM+ds6X3n/66Ye+suYVlUqmPGb3sHNGMkw2KUgrbUaMGCnuuOP23c8999wVYWjvuxmfxLsdoBsBU1cHsS6NbVs79a+kJEmA0a5SC4dYQnN/V6SC2SAW99HbuVPceuOt+qyLv/xfZ4zko065/HL1OjyjSUgYAKm2HjMtpwykIBIOpDni4xBJt3RYZYfmSCZvUVpY2dqKN7RPtdtaZYyL+FJQgZ0yzKmc9RpRyo25axitYJSyWXVKQwUBlFKho5j9HqWgVD6NIwhyUEH458D+rFb2c2XTN2wV6D46o3h2znvhaK/9nSaiMTSHMUscRS6hwAMifOtBoMFMqqTEEzt3dso/PbDlgSsfydR3l2JVbS1kY+MQyomXLrXg/H+Xfu0z59ceddPuZX/CLffv/DmIer/85enx5rvueuiKK644asfOnX+uHl0tR40cKYIg0FopLlSohLphK1HLA6ZwDzMpCVIIJ1WjPLAjpEX+trrOvzceMuGXN6/niAeGU4yEuYLh19xV4HwzQkMjk/cZp3zSedgIRATyBeny7ufTg2kT5JSZNGmS9OOx3F8fuP+HDQ0Nx+/YveP5+vp6z6lHXgucRUNDgwaw33mfPO+y3t5e09vTI8PjFb0e12pRSiOVKuFt27bRIw89ehkRdTjds3k34xOhuNxWDKK5GbHzj5YrxoygaQMZwVJAhFVTOKRACLfU9nPpeejaNWC+/n9XUP/2dS8ec8EVJ0gpe90gAv+DB6OZXI2x36+bsG3Ltn5pjGJPinw9SyHgRlUpIs4hrHzJKTpgPT3CIRv7GgmSCCGfDgo5a44qPo4KLAcgyFd9YeUHV7gTSatqEUMVC+wqbyFoCA1T2FGz1SYjDHPlCBxCvr1A8lsIWrZhBCEp4uXtl8lZrsIkS2KkVZaWr2rb/OTygR8t3or28SWIVZXi/hVtGCw8B0uXXu0fddRFwW9+/L3zTzp+yo17nv017njwpa1XPjbhUOYt3URAbW1tNK122mmnfeboo4/+TmVFxQEdHR0YGBjQiXhc+PG45d85L39EwTmTUuabu5R/iNodDiLQDikHE+7MUEgzcNS/jZpzGAroUVNS5H1ZQuAGwilHd9XaEtpxzIVVfIGmLvwdAHJBYMDg0aNHy2QqgY2bNz3w55v+/L1Nmza9IITAD8wPRCP+flOcmSUR6R//74/v/vgnz/vIwoULdSqZkuEkpogebvbdBUqZ6urRdP1116+/9bbbZtfX1+vX4rTfbUsWsdmuOashVgO5GPGacZXi0x6x0RzeE/kuFLlB3WiHa4BYStILTz2tP37xd8btF2wac9+zmx7mpiZubH7tFOimWojZtfU0I/7Kew+cnPrEmvU9nIgJEV6sITKSIAgnpeNwnJvz9AK5ARXk+1YQES/MUWOJwyYnEdiKpxEy5eTUD+ENSwXiOmaKnPRCGgThIyTq7HMBVz5E5xD9jCmYdmSnihARMCNSoUQPDI6OQLSLyaMVQ2mw9CSnkp7YuHUPFi3ZfsWVC4PzNvXiiQOrMEijseylrUgXFCDEvNCbMOEc9WDTFZ898pARN6578IdY/uKW/r88Kb/ePbhnicM4rF69mgFQU1OT/PGPf7x80aJFN1SPGtEzeszYwyZMnFAaKE2ZTFoTiISUlFf7WOAVrqMqhLS0FaLTOaSKllK8qkwqePCFDzum6AEtSICkdA/Zgh6Bo1TszxoH+vligjB04sU2e2mIioOEiOgSpbVhwIwcOVKOHDVCdOzueHHhgoVfuPaaa+u7u7vb6uvrvZaWFm5FK/8D1YY8+OCD9dkf/ejHL/6vi7+3atVqpbXyCtVIXPDmjTGoqKw0L61+SfzxppsuTqfTK6qrq8Xq1avNux2XihV0wZo7F15rK9THDpbXHbif/I/eQaMI5IU62Lxon+321QGG5/vI9A/ggPecrj5xwee988887+v3buZfslavyaEtXFjvzZvXqO742ZG3D+7YffbS5TtVWanvGYOoEpUCebkWQpDM0xjhtGFUWzlnMiEIQli70bBaskIEipppggEh3ZSY44aJQ2kVEMk2EE7K8ZCq6296hgW8eWElGX6BDYZUfhao4OSCtlEUZpELIK9YKKhMHXXDqRJpSks92ds9gCeXtT29YGmuflknHiECLrkEorHxb7bEwnGt5rnFf/6PUWWZ65655XK1Z3eHvHOJ9/lHVvTcGM5cvJYC4fY7bteuiTrxC5///A+mTZ32mdLyskRXVyd6enqVlFLEfF/kj5OIeHoqBF4UPAQdoIY/Ez6AwsYnux0TFRzkELiHvEhXLdup0wIb0MJWbuSVEVIx9rqSTn0ipANmpXUsFqMRI0aImB/Djh071q1YueJHzc3NNwPIMLNoaGj4pzmA9YBosO9l1L1337167LhxI1avWoWS0lLSWkdceeH1JD1fxxMx+etf/nrxo489NrdwF/NuX6J4CPKrtRWa6yEWrNTfbO/lzSUJIQzY2HuOhwAMuygq2wBSKKssxarFD8nlLyw3P/zVZZeONnqq53v8ase7q68+0p83r1F99cIDTpu4/6iPvbSq3ZSXeJ4x9veF/s+hYRMX+CLkDRK44AvI83kwAJmhW+XI0D+fc0iCHLcbJrdEpAMKCr6ICw0tT4c0qTg/wBD+W4UpL5HBk6v4CznVcA4m8huh/PacTV7Rop3DYDZrHauqygUl5KBc/sLWndfdtfXG3zyS+/WGPn9n7WzErMuok5Y4fKqtrZVCSkNE+MvvvnNTZbz/ukU3NuSk6fOeWSNuf2RFzw2F09t/o/JpbtZsmJwJ/7Zrr7vuop/+6H8PW7Vy5c9jsfieAw44wBszZoxgQGdzWW2MYSEEPCFdFZx/mEkhIISMNNOWnw65abJUjqvABQl4ngfP8yCFgJQepCcdqLpmbgGvXUhNCEL0d3m1C/Kucxw2Axk5FXCQy2lBZKqrR8mS0hKxa+euFx7660Nf+sElPzi8ubn5BiFExiWhm9ej8x9/9dWSiMxPfvSjK2fPmTNy5coVJlWSIhtSm9feh01TpRSXlZWhZWGLfqL1yW++25uCxQr6n4krrOxOnzhVfvCYGf79xgRKafJCMSiHhkQhV0qhgkIi5gl0daTN/1z5J7H28YWPv+9r153GvDAgmmcAmLByvvij40d+8VtnPfXkrQ9N37B6M8dLY8ICtLCVk6BIPSEoX6mT0xa7LqXjFqO62snkbHUa8sxEefvcUA1hqQx2HHaei4x4bMeRhqkthXpZUUDvUAGnHFZ/JELNgPkbHTkTQ0C47wn5b+FuXOSbnrZLC4IwfkxwSYokcRabt/bseObFgQdaX0FMeDQiJvmZXA5/2pnB1oIdvGtSzfUaGxcpgCuXPfjjP4yq8D56/7U/DPYb6/tPvZTr+tHd3Z9tasIDdXWWRXk990pTU5MomGgbf8EFF3z+wFkHXDB+wvgpQRBg957d6OnpVWBDQkohhdWKRz0Mh9YUahLDHUYkM3NVUyjnCx/MBfxE6J4X0UoudTtMeudClUbkepS38tRaMxEZKQSnUkmvtLQUvb292Llr5xMvvrj6V62trXcDUEIInH322bK5udm8Xh64qalJ1tXV6XPPPfe/Guov+c0Ly1/QuVxOSk9Gj39yu4wwCCCZKlH9AwPe73772589s2TJt+bOneu1traqIhIVAfrvb9PmwmtshTr7MO+GAyfQBb2DRhORjOpLCrneQhEFQZKAzmlov0pdesXvvXt//+uffuZXLf+PnV6PiMwXPzX3oK9+de6fH7/nkUOfX/CMGVVdIrQ2kSFSoTAj6vS7ykiIsHovYPHEq2gB5Js9jDxgRze++114tYaX2Lr2iXzTMAyqDRs6FP47zpOBHKcYcpkCNISSiMBniLzLfY8QKFRkW7UCEASGhSSTSHiiNEmk1QDWbe7b/Pwr6ZvvewEPAJgwthynCYllXcDNXV3oefU1zQvrJc1rVKdNwaGX/qbhnlGlmcl3X/u73JiRcb+zP9j0k5u7fk4luGd7J7bhX7f7E01NTXTuuedqB6IlZ37wgx849LDDzhs3fvz7q0dXl2ilsautDT093TqXy7EgIX3fhx/zyXNDIiHQEoAo1gcU0SM8RN+eb6ZFae/goQ3FKI2bXMag3eEYzWycwD4Wi1FJqkQmEnFordHW3tbT1tbW9Pzzy5uXL18+P7xGTjzxRK+1tVX/K8elvr5eXHbZZWb65MmH/Pb3v39WSuGvX7eekqkkRbI65ui8GwCsjamqqhJ33X33phtuuGFOfX19ptgYLAL06zouTbUQdc2o+Pzx3tNjKnlG9yCML0hYuHKMsAgBW+TpBOGhr2cQBxx0lLro61/1vvkf3/7Rdc9suwSA+mvTtz9Zlgyuf+6xlvjyx5fpUWPKpGAFT1IBXeGskJw/NcjYLfAQ7pcKKlvbEIx46ahhNJQvlkIM5aspzzEbp8/1wspWiKiaLaz+bGWe1zMX6rWp8OEVbq8L+l/58Xn6G2bNGLAUZGK+ID8OoVmhffcg2jv6n1qzOXvvX1fg2QFg98QSGN+H6CZsLgDmQoAld1z44g/POP9/Gr7yy8Fdr1Q9fPMfgvIRlXJ394C4Y2HvGU9v088QoevvURuv9xqpr6+Xl112mcrzvJjymU9+5iOzZs86s6qy6r1jxoyJS0+gt6cHvb19SGeyKgiyKKCTyT5YBQk3JWiBzET0T6i6YZMfhdauoxpqwV3IK1vJpIJh1gRC3PcRTyW9srJS+H4MuVyA3Xt2D+xu3/3E1m1b/zp//vzb0+n09hCY/9WKechD0ao26Orf/+6FY4499sDHFy0yZRUVgo2J5IfsdngEgtIG5eXl6uWXX/ZuueXPH165cvX955xzjixyz0WAfn1UhxsDP3IMjq45xHuawDqdI5mftHPG7WHVGwa9giA9H5nOfn7fWbWYcfh78X+/veFnF3zhvINE76YzHr7jbuzetdtUjSgVrBU8CUjpBkNcJW6j7O0NSwX0BBVsFEPpGiEcdw63ze4BIvLjsyJygHJA7RQgoeIgtCstrMIpqoYLHwR4lQSwUPJhS3Mq8BN2/jthPmJk7mSl5WQ8IZBISJlMMmIeob1zEOu29Hat3Z5pXbWBb17diecApMZXYIwvsR2d2LgZyBT0T6Jqq6m2Vp535x3aaCP+culp3zrlY2f8eO1Ti7Ci5REzYtwo7hsYkA8u6f7KXcvUb7geRI3YW5Ua1dbWitra2lcb+sw67bTTTjrk4IPnja6unjuyunr8uHHj4fsCuWwO6fQgBvoHkM4MIpcNlNWZ22rYGEOhUX7YVAwbfBHNIQTbWChhE9yl8JLxBGKJeMRdZzJpdHV1Zzu7unb19w08un7thsUPzX9oMYANhbREc3PzG0rJXrhwoTdv3jz1/e9+97rPnH/+fyxsWahivu/ld4DkDJjy1Jjv+Vozy5v//Ofr7nvggS/Uz53rNRapjSJA/ysrVHV8/Cj/gtkT5A27erQSgryweg4lriYyzHe8rwRYGXCG8N//978YyPTgqQfnY/mTz5pYMkaJhE/G6IjPtcBoJ+rynKEoqDg5akyGTSBQOLY9lCOGsyF1aXORX7FFTI6m4KSgoTQKFXbWQyOgwulGR2EUuOvlcTk/fCCihiS7yTb7gQSx5wnEEp5MJTzE4wKByaGjO8072wd2bm9PP7dyPT/58nZ09RqsrfLRPiqFAZbIZTqxZxuQftU1mxczcJMkqtMAKu/47WfvnDv3gHmP3Xar2r5+gxw1psokMSAfXNr34A2PZ//jwgux+5proN6kbbQIBzRe1exKJJPJg2pqamaPHTPmtEmTJo4tSSZnVVRWjUymkomKigpKJJORN7RxagelgiifMrT3NG5S0GiDQGuwtgNImUwG6YH+dGdnT+9Auv+Zbdu2b+7q2rPgqaeWvNTX17cRQC5/vFjU1NSIf5XG+DvUhtfY2Ki++MUvfvq/v/zlm5YvX67T6UHpeV7B9RU2RKOZRlNWUYGHHnxw85VXXnkwM6f/3jRiEaCL63Xx0V+eF791bBXO3b7b6JgPGQW0km3u2JFdhudJGKVQPnoSH1lzulm95Amzac0rxqgcVVakJBOLwnENZrITvhwNlET994IuUgFHwM7UyA2TYOg+3fJ9VDD+DSBManHgLqSAiHTQ7tcKC8TC3Uj5V5Cv4iKXETdwAWeGJCCYpGApCZIYXswDSV/4nqBEjBGLS3geI5sL0DWQ4fbdma7e3txLL29Nr395Exa/3IWXAXQk4ZWVl6jSRBxtrLFrSw96/lEDr74eoqGBmYj4yyeMmnvRj75zzYhkdubdV/1WZ7NZGa8o0xVev3xpY//Cn92XuWbOVDy4bAN68NbEzIi5c+eKiy++mM877zxt/jYaqgxAsrq6etz06VOPmDp1emzMmDEik8kcycbMSsTjnEgkSEo7n69hEOQCTg+mKZPLZVjzWiOwob+3t2/Lli3Brl27XtiyZctWB8TdQ25yQbjkB5d4q1ev5ubm5tfbFH3dvPOZZ5457bvf+e7Krq7OxJYtm5FMJQkmP3oj3PSgsNQZV1ZU6pdeecX7y59vfd/y5Usfra2tLVIbRYD+Ny9CQDTUA5MbUfHpMxMrJJuJnX3GxHwWxvHE1mzLglnMAzJZjQmTpsBketHWthullaXwQPClQTxmG3EmlJSBwCwc/2j1z5Ks0bylKezEoKVSDISwGlYhCdKTVtPq+EsIASLPyrlk3kze0h4S5El4vg8hJKSQec6aBEjYIQg7exF6OVg/bNs4tPdP6KNhjIZEAE8oeEJBCkbOEIxmKJXBwGAOPX2aBwYHB9Lp3Jb2br19847sxvU7edXmNvT1AG0AussRbxs9ItvhJeDn0lCJLqRXF1R7r1Ux2231XG/evMUKMN7v/2feD8/83AVfa3/5eb/11ut1orREwvd1XGTly5t6XrzqocxvK1J4dGsv1uPtyQCj2tpa0d7eTjU1NWhoaDBSSlOoW95r/xARbrvtNrlq1SpqaWlBa2urKaSC9tp9YXcKIKIxjzzy6ONVVWVTn1u6zJSVlwuldaTrjmxZHWeeSCSUMdr7y19u/dm9991bVG0UAXpvXIx2AKLuOP+gOWO85el0IDLaACAyRkRbUEsPGC4rEfTSJt01kNOLq0ck1wQ5pbOKRxiNaWTM+HhMlBHgGw0GYxAebSQhukBcKgSNhOGxnjC+8Cy/HE4VSufJLCXB89x/voQUYBJkSIReEIKkJ0PGhYXzL5JScDzusZTCxTSB2FiXpVjMYyFhhACImbSBQGiyyoCBYmOIlGYRKCIVaJPLWatMNsEuj7KbdvcH1NlrvI4O0x1k0Nreg4m7e6H7gTYDKAK6Sjyve0SZ2lwWR0YSBp7biUH++9fm3/xVbS1kUxMbIuLTK3HI/1z11d8dfvzRx7fc9gesfWaxSY0cJUAwFSVGbNzeu+s39/b/VAq07BzEc463NvvSvVdfX08tLS2ipqYGADBnzhx25vb/cDU3N9OqVasIaEFLC1BTU2OcAgJvwQOInJGR+ev9f7192oypZy9csECVlpZ5WuuCHgXyo6EuY7e8okzcdec9S/540x9PampqCurq6gyK1EYRoN/oCsNhP3WM95+HTKCrdvboQLPwbWc9VFwwpLDFyqoNOre9B88FBo8y0ONJjNQ5jJo2NWUeXz545QCwCjYsKIO/TXWLFzTBXuscCfezVPD5iILvzQHogx3lj8Gmn5QASLjP4+77Avc9yThQ6tltt1DAYGC3yVICMevaC98A6QDocr+/xAcqfGC0AZQC0gR0EzDoSWTiUlLMg/A9ao9LNaAZ/WXl6F25Bd3/4Ib8R9UtLVxYL+fNu0wBBlf/4OT/976zzm3kTH/i0T9eqbMDnSKWqqCMCnRJimXX7v5t1z068NuOLvN4t8YTzHjXG+/sLcxYunSpd9RRR6lrrrnmmg9+8AOfv++++1UykfAKbUxDNVAoD1SB4pHV1XrhwgXBVVf97rAgCNYw87vWiL8I0G/CuvBI+NcsQ3DRCd61k0fi81u7OZBS+BagTcTnpjMagxkbPxU4SIh7AAxh9KgU3nv6rI3b1+4+5VvXbdnI3CTRUBeBkrw0iih83ctcAnHo75HMKggpwNUpqIuPRnDD8/A6gXj3LsSyMl4aGI7FAWjBpQQYraAgOSWIy7VBXIBHASDB1GME+u3nkIYRg0AahtLGo944wSgDnzWnhFS+IChfoiPhoZMzCLrKkCkvh65dDfV3YsDoX6n0mppq5bnn3anZaJw8EUdf9tuv/Oywo+ee+MRdTXj+0Xt16YhyGYv7CFSg43Ehd+7u2/KXBX2XbmrDygzh2SI471VqI9bY2Jj77re/2/ifF3/xkgWPPRbkcoHv+94Q4/284T+gAoWqqiq9bv1a+ac/3nzuCy++0FSkNooA/aYcr/p6yMZGeN88NX5nIs5ntPdqHfNI2kaaTeXOBYycYuSUbbwLMHxJFPMJ6UHmidPHe6fUnrFl8cKN/9H4u8ceZWaqIxLNyIeY/ouL/06VbQoq8UJZmgSAIwFKA9RrK2X2AQ4s20zaiVEAABOBbdvyZvfTAREDeLX9/a9HCfC606lfTWfceafUznR+3N2//uhX55x42te9dKe38OYbVM+edhkrqyQ2CkJqXZoScmdHdtMfHun9+c5O82L397GIbIZqEZz3wgrldF//+tc/+sWLLmp+4YXl2LNnj0wmkxTKNa0hkps6ldaYK5FMqvTgoHftddf+dtGix79cBOciQL+px4wIPIpR+qlT46sTntmvK21M3IcITd6Usf+xsdIoGY1gM3xPorMzZ6r2my5OP+cMrFm67EdfveLJH5AQ+pITjdfYCjUMrqU3KN2CaGhoIied8/7vS0dccPLZn/jR9KnjRi5qvgWvPPWYjpeXSS8eg9Y5AKwTMSM3bO3fevczuRt39/ALHzsY916z7E2T070bK2evsbFRnXHGaR/938t/dPuutjaxefMmlJSWktGmYHLUKYVcTJeQUpeXl8prrr7mhbvvufeIpqYmKvLORYB+U1c4xHL8VO+o9x/kz0/ngoq0YvYEiUDbUNVQ4YFQu+wST7QGWAh0d+dMLDUKn7roHLFlw44nLmq492sKWOI0vXtNCrUXrwN+80EgBOZzNcD41HH46Bf/+1sNBx5z0qHrlrZi6X03qVx2wJMlldCsARj4ntBx38jlL3dtuPvZ4HatsfqKD+PPLhuSikCw98B51qxZ837/u9/Nj8fjYsXKlVxWVia0VpHmPjK+CicHmcyo6pF01513bP/91dccw8w7KYxFL64iQL+pF63TR59/bOK9M8bxosGM4pwioZkp0GTDnjisJjiaBGNDCLQBk4TJBsgEUn3s/HO9WLwsd8Nvmr9/96o9PxVS4AcnvKOr6TcEzJ8+HEd97n/++zszDz7urP6OTZh/y/V6oG2zKB85khSETWkxDOlLXZaEfGljz4IbHhm8JxlD1/T34JbW1qjxVATnN7iamprkueeeq0eMGHHAbbfdtri6etSoJ596UldUVEqjdD4yjfPO4AKEXKB47Nix/Ohj88W11/7h9N7eroeLeuciQL+lK2wannuU96337C//b1e3UjlN0hiQS8wrSAzJO4QaN20nhUDCB/q6An34vFPkUSe8F8898eyNX/zpQ98DsENKgbPOMrK5eVh2uqmpFqK2iQ2RYIBx+mgc++UfXfj1g48+7mxpPLHg5mt4w8qnOVFeJhLJBIg0CEBOMUtPwhcBrVjf88AtrcEDFUl0jj4Ady5bhqBYOe9dcE6lUqPvvffep8ePG7f/E088rlOpEqlc5YzCSVfX3s5lczx6dLVe9vxz8rrrrv/Etm3bbi3yzkWAflsr6S/OTXx/8khctrUzUMwkKcxVDsel4YZTkA8YFUTwfIFUjNDXleHEiHHmA5/4uMwO5tpv/cMtP73xiT2/BEgzG1FHRM3DQJJUD4ia+rnilMsfV8YlTp9/MI791Nc+/5Xph7z33FTSp8fv+gvWLVmkRYykTJZBs4EEQ0g7PZNMSDGQzqjFK/vnL1ihnq0sxfItPbib89d0EZzfKI1XWyvvuOMOXZ1Mjr7zoYfnV4+uPmTx4sd1qiQltVJue5L3YnEu08jlcqioHBHs2L7Vv/K3V37j5TVrfnHkkUf6y5YtC4pHtQjQbytIf+V9qe9XJdRlO7u1IoInXXUhXPqKYeurAKbIFc6aJQExXyLI5LCn2+hDTzxVvufYQ7B21brlN199748facNt1sHOiLo6ouZmvNOaLFQ/d65saGkxRNI4CjJ28Wlln/zIJz53wcwjjzxRBBpPPXQHNi19TEuPZLykCspoaKMju01BxlSWkejsSnfd88zAgy9t5f7yEty7oQsP4F+U7hXXP6Kc6r1LL71UMXP14tbWR8dPmHDIokWtqrSk1AtcAHDoDSIKQgOyuRzKy8qDbC7r//IXv7rx2aXPXnDhhRf611xzTRGciwC9b9AdX3tf7PuVCb5sZ5dWwiMpQC5cw9mRkojE/DZs1TYR8x7NAp27M+wnK82pH/mwnDh5PFY9t+zBq3/x6M+XZPEYAEgpcMtZZ8u6f88a8i0G5YtZyI9rNrZaPhI4+AvfnHvOEfM+UDdl6qQDujq68OSDt2PLqie0FxOytKzSPn1c+gYTwWhmTxKXJbTY3Nb/4u2LMut6MgjKkvj9mj1YABR1znsTnBsbG9XoktFj7nzozvljxow5+MknH1clpaUeGDaJ3aWIh4oNKSWUUojH4srzPe/6665ruvf++891Bv5FxUYRoPetSvrbpye+V57ky7ftVoGQ5AnBFKaxhPakRBZoyaUch26hzAQWAiZQ6OtRZuykKXTymadQsqQUm198+ZG7bnr4V3dsxkMAmISA0bfKhpo6anz7G2NUWwvxpdlzqaahhUl6GiZiZKq//v6Kj7y/tu4jk2Ye9cHq0ePo5aWPY8nC+3XHllcQS/kyUVJuZVlwyeFEMAbQhk1JSgjJGazckL7/r0uyldKmSv3Huk6shtV0FxtPexGcD5g69aAb//yXO0aMGjnz8ccX6YqKShlNBhoNGzDhTrrb3cRjcRVPxL0rr7zyyfvuu+9kZs5RGAVUXEWA3neqRsjGVqhvn5G8rCyuv7+zSwdCwgdCZ4swvJPgOZvRvJ2kiaoSwwRPCphcBgN90GOnzRAnvf9EqqiMY+OarS88/eTKm359/+ZbAOwEAAgBScCj3z/Ru2p1K89uBje+uVWlqK0FzZ49lxoaLmbpfVwbPUQdOOZLp1WeetKp7/vorMMPP2HcxOljB7q68HzLw3hp2ULV19UlEmUpEU+U5CO8hLVQ9YS7sQWhrERQJj3Y9thzfQ8s38gnxCS25Tx8cnMHdhXBee+tq6++2r/ooouCo4466qxf/PwXfxg3fmz5E088rivKK2TeMhQw2kA73XNoKZtMpFRFZYX3y1/+6sU77rh9nhBitzGmuKspAvS+DdJffp//qzEl+MqubqNAsFtELswydGZIxlbXYWJGPuLIfo/vASqTQ38/dMW48XTYsceIqbOmob+3q3f3ju2PPrXoubt+O799IYDt+VchIAWg1A9ES0OLaGlpBWpgYCfrwg+F1U2B+z6oPiqrALRA1NTMBWpqUFPToD3PY4vFQ7AxUVOGQz/0qWOOPeS4Y0+tHrdfzdjx+5WmBwbx0vPLsOaZx3TPrjVgYuklywDywKyd41mhnSnBl2wqy4TwpMLabf1L/vpsbn3/IGqkhwfkHnzJud0VwXkvraVLl/pHHXVUcMFnPnPOf3/ta7fF43GxZMmzurKiQsKl7YgCXw1trMuhNgae5+mqESPk7373u60333xzjRBigzGmeG6KAL1vH1cXmaW/enqifmSCG3buUQqCJBGRLaCtb7Nwxv8GYXQUuQraAEQuD9By1FIIZLJZ9PWx8eMp3v+AA+Xsw+dgVHUZBgd6e3fuatuwa+POx196/pVHb1yWWwtg9WsUvkBo6J93nIZSSgCA9DwzNDT871KI0z5+OEbPOGD/k48+6ahpiZLR79tv8syJI0aPQX9nF9Y8twSrlz+t27ash6CcKC1PkR9PQBuGUiYK4A25HesVTJyMC6osMejqyexZui79/PJ1ZiIRxpGHb7/Ujt8jn6RVrM72wnUautL98NJLzzv3vPNu7urpwQsvvMBVVVXCTr+6qcBQ7+yuTa01POnpiooK+furr95y8803n0JE64qxVUWAfudV0qckvjMyZf53T59RmklKsmV0lMwS0R8hrxduH0OxngVoLoiwMmyQ7g84l4MurSilCftPkpNm7o/xE0ch5gt0dfcqmcuu2b6tfXu8f2DR0yt25ErQ9eCyRcgsQmS4vNN9Wui/XA5gNAA6DMARUxEXo2JnTJs+Oj7nuOO4q4dOnnHQ5DGx1Mj9R40anYpJRrqnDdvWrcOml17B7h3rVF/XblJaC4qnKBZPQAoCGwf0Ln3Fumfb98iG2fcEl5WQCILAbGpLL25dHvRlczjV87FaCZz/chtedFVzsem0F1Z9fb24/PLLjdYal1166ZXnX/DZL720apXZsHEjjagcQSCGJyWElBBC2I9OwBgEOXh+XFeNGCGvvvp3W2666c+nENE6PoclmouVcxGg34Eg/Ymjve/MHC3/t3fQIKPZ+J51lQmjo8IcP9uMoSiEFoXeugidjgjaaao9D4AxCLKK0xlmImlSlRVi5NjxYsLk8Rg9rhqjK2MQiQQ0gJhhDAzmMJDRiKeSm/2Yn47FKFtenujWhmPdnQMT0wPBxKqKMiodUYlEWQIlfjmCbAaKStHX1Y3erk507NiGto1rTFfbFtPb0wlCIBPJBMXicWh4yAU64iqFSzMiFxwahkEZY+NjkgkWvjRo68quXbQi9+KuLj7Qk5goBH66ejd+CECH4/XFS2qvgHMoo0vddlvzNaecMu+TDz38kO7q3CNGjBhJ4Y5GSgHp+TbcwQVFaBXA83xVXlnhXXPt9Vv/dNNNJxPROj7pJA/FQZQiQL8jbwin7vjkexLnHzKJfrenTyUHAhhfsoCx6Gycb4dtyLCLnQpROZ+SzTCuxM5vOYWL7g4rba0NVBBwNsPMDPZjPsfipUiWxr2Kqkoky0YgWZpCRXkJEvEYpO/BExIEA6MJRhvkcllk0mkM9Hahv7tL9fd0IZcdBJkceVKTkIJIxgjSB0lrNUlsi1tlGEZb3TdgE1nC+CzDgNZg3wNXlJDwhcLOPdk9z29QK1/eyqWewJFSYkkmh4vW9mB5npcpUhp7Y4WOdGWxshm33HnLHYcffvjBd991l1JaeeXlZSAieO58Sk/C9zxI6UGQhGaFZCKlksmEd/U1V7988823fpiI1p100knFKcEiQA8PkP6v05JHT6rkB3r6zajuQaNikj1tHK0aeenaAFlHgkTd8nywFkfBsYxQnudSuqPU79BBzwbEEmwMkQ4MlLZeFmD3eLCMLgsCpEeU8En4EoAUMPAAISGlB8+TkJ6A5yr8QJmCSj/MRrQZjYYBY9hRNOy8TpkFCY4nIFJxjXQm6Fi1Ibv+ufUcywQ4UAh0CKB+dSduBIC5gNf6+uxMi+t13Osh33zmmWee2lDf8IdYPD7x3nvvUalU0kvE47Zilp6lNlwyuO/58HwfbAzKKysDz/P8q3/3u7/efOutnxFC7Ck2BIsAPWzWhRfCv+YaBJ862j902lg5n5ir2/u0ikl4zHnlBhFHVXEhX2szqvJ0h82aJdhAUuHq8KHVtAAgpIi4brKRs2Cy+cpC2OBbgoAA4EmCJwmCwtF0Box9HSQASQAEgyBsendkCmXrXJs4zdAQYcwRjGET94UoLwEEBegeUHtWb8wtf3GLyeUCzI1JeBC4alChYUNXFOpabATupVVbWyvvvPNOrbXG5Y2N//Whj3zkN9t3bMfjixbr6upqKT0BQRJSSvi+Dyml+08gHk9Aac3Vo0crrZV/7e+v/uPtd955gRCCi1K6IkAP20p6+tjY7E8eLa/zyBzX1quVJHhhhQxROLccBsdylMKdT9eGLX2N/T6DUAUiXOVq4EkrY7O/mcI61jr5E0MICTYhtUKQ0uYeEoVpWiHHUOArImzZbRx42y/aVwAASgOBgREEpBIkSmKM/oxGd1/upfU7gw0vb4WfzeEw30eVINzUF+BHLtA1rJqL2+W9tJhZEpEGUPbHG274wxFHvefsRYtazYaNG1A9apQQQkJ6El740fNseLDnwfM8GK15/MT9uKenR1x99e9vfOyxxy5gZuGGUIrgXATo4VjRIHSoi33l1PjNEypxdkeX0VnD5EknggvpC4iIRiBXUYf+0uH4eAjWlu6gyOtDENwoORX8vKVDQj12JLUjAQG2aeEydPhlgKUFaMHu64iijQw7aYmTyhHYCA8sBaQUGgTGYEb1tvfqF1Zu0OvXt2FAM1JJH5NiEiuzAr/ftAevAJHHdlGhsbcKgXzqtjnllFOOq//+JX9MlqZmNDc3aTZGlpWVu0agdNSGrZ49z3OqDQ9BoPTU/aeILVu3mmuvvfaSpUuX/q8DZy6epyJAD+8bCBANlqHgH340/p/lKXlVW7dCb8YoT5I3ZPQbgDF5akOI0CC9YKiF8tplDk2aiCFJ2GlFR28AgDYO2IUlPMIHArnBGctZU9SkFO53CAf6YHIcM7EQMJ7HIhkn8qQBjEb/QJBp79Yb1reZNRvb0Nk7iLFCIiY8bCFgAQWYv2EA7QXA/FYHFAzrtbC+3pvX2KgA0M/+72ff/cCHPnDJunXrYg8++KCqKCvz/FjMNgM9D1JKCCkQ82OW3vAkiAS00nrqtKny+eef52uvvfaczZs331n01igC9Lvu+HM9iBphLjguec7BU+gXgxm9364urXwP0qZPWAA2BXN+FGnVXAYcG8cxW+rWuIkv66RHUcUbVdhWeI0w3MJSIm5oBoj4byBUYpBtIEqwLwi+RyCCIGJIAWQCjXROD3T26E07dutVG9sw0JPGOAKmS4k0ERYz8GhfDPM7OtBfBOY3tWomItKjRo2a+ccbb7xm5qxZc++95x6sW7/eVFZWChiT1zU7KZ3n+YjFYvBjMRitkUgm1fQZ070Fjy3Y8Itf/OI/s9nsI0VXuiJAv3tvLMdLHzwJU+uOTv42TnzGtg7FEGBPkrMQsuOGQ8oXZqczBoS09TGrAIlkDIE2UBqGDbFBYepFvgNnQV1ESgspKazQOQR2AXi+J+BJhi8Jxmhkcoy+AZXr6jdtA1nz3OYO7u/ohUkHiIFREfcxxZPoMMADBvjrhi6sLHi7heG1xbWXVgHXjP+9/PIvnvb+03/WN9BX0tzUpIWQoqK8nJTW9nqBiMa3LUB7iMXiyOVyPG78OD1u3Hjvnnvueerqq6/+GIC2otl+EaCLIO1AGgC+cXr80pGl4ju9A9rrTxsV98lzeAwG7JAK54dWiBhCAnHfR8WIamzZsHmwrJQSFSUxkQsMclq4UXIA7MgOB+y2iWjHyKWjMZgZOQXkAsJAlpHJ8cBg1qh01qzvGjDd3YN4tqMffekMMsyYEPcxSQrEJKFPEl6Gh/nlnXhuGRAUXGdhx78IzHtxFSo0Jk0aPfXq3/3xNzNmzfjAPffei6VLlurqUSOl78cgpXAyzHCHZCktKQSEkAhUoGdMnyHjyThuv/3On99xxx3fFkKos88+uzi6XQTo4gIsLz2nFlTXDP3x4+LvP2iCd6WAmbarM1CCLJ1sA2nzAB3aWfg+Acbw5DlHUsX+czbeffP8Vetf3momTfBSHpkRnoD2PEtVhIMjgmzVHCggCIB0wCDidXGPn93dC94zCL97AGv7swiMwTRjIDwPVSQwGJMok4ScFGBhsIoVntuQwdZCAHaKDFOkMd4kesw27DQA/xc/+9nX5tbUfK+3r6+8qblJ9ff2y4rycmIwPM+D7/sg4QDZGVQJsj7ORKQOOPAAb1fbzr6bbvrLf7744ot/EUKgKKMrAnRxvcYKzf/HlqL6Myelrh9Vxh/u6FZIZ42WgiTDqTDcEAtRmMwikEnnMHbKTMyZe3p2zcb2Bf9z+a1fBbDmDQzjlY72MTUew4HCqu3SZLDRAO1bBtGBv5XEyQIKo1gtvwn37MKFC+XJJ5+smBlf+MIX5n76k5/69cjqUYc++OCDeP6553V5eZkU0obrhqoMKe24tufZQRTPk0inM6ayqspMnTrFe+bZZ5f86pe//gKAF4rNwCJAF9c/3bpGUjx88aT450ZViJ8SmxGdfVqTYCGEc8WDk72BwWynBoNcjg0naO6HP4DSUVXdj7cs+e6PblrxO4DAC0/yGhqc9ehrrDmrQavaQS0A0Ap0AKIaMP+gEhbID5UUb+g3cTU1NcnzzjtP28EkjGu69dafHzhn9sdfeuUVPPjAXzWYRVlZOWmjwcY4ZY5A6OcspYQf8wEAbLSaOm2GJwShpWXBr2655bbvEdFgcWy7CNDF9a9sY53KY055fNq8I+gXI8v4zHTOIJMzWkjIMLBTG1tVG8OAEPCI0dsdmMkHzBQnnnYs+roGHrr2x3c0/LUNz4AEmm47W9bVNf87KopweqVYIb+FwFxbW2uc/njU9ddf/5/HHnPsxXu69oxpbmriXbt28YiqEUJKERlsWTVOwakighQS2VzOlJeX08GHHkwb1m/Yeccdd3x9xYoVtxYpjSJAF9e/uQobiB89yPuvGRPE5ZVJruhOG6UUBBMJbSxIE2wTkQDE4wK5wRxng7g5/n0n2HzD5zfe8cOrHv/JHmAJSYFLTjCei8sqgu0+t4uqlU1NTSEw47e//vWnjz3++MsSyeTke+65F8uXP69LSlIyHotBa+PCiR2/LCTCmCoCEORyCAKl9582TVZUVmDFypVXXnv11Q0Adruoq+I1UATo4noDS3A9QI0w42I44H1H+H+YWk3HasPoSRutmQSYyDBHxkWeJPjSRmH1ded01djx4sTTTyES4Efuf/KWX9y3vgHAWiElfnDCCV5ja2vxJt13KmYmIgMA3/za184+65xzvllWXn7sk089hZaWhUqAZGlZGWmlrA6eXgXOTqFBgpAeTJuysjJMnzlD7NmzZ939991/0bPPPrtACIGiSqMI0MW1F9fcufBabTUdO2Wad9GBk73/rkry9IGsRjoHTQIy/F4ZqTWARMwDggD9fVrvf9ih8r3vOwlt2zr65t/72C9/+1jHzwH0FoF6n6Iy8D/f+MbJ7//gh74/YkTVvBeWv4BH5j+iM5kMVVVWCCIBY0w0/h9OmZKjMqTnIZfLsed5ZtYBs6SUHpYsWXLDTTfd9F0AbcWquQjQxfUmVtNEkd1y6cffE/vahEp8qyKBsj0DxmQVs/DI8tNsvThizmMj5gOZ/iyyJqYPPPZEedh7DkfXnt41rfc+ctVPHth0M4AOISVuveUsWVfXXGz8vQX3YH19vbz88suV1raQ/frXv37mGaef/pWRo0advG7dOjz88MO6q7OLysrKPc3SiAAAbchJREFUhJChH4twzeEw0MF5b5OA1oq1NnripP28Sfvthw0bNz537733fWv16tULSBDOObsYS1UE6OJ608/d3LmQixZBMQMHj8bUubNjPxpbKeqUNmjvM0YxEJMkJBGkCF3q4PLlgM49WTayVB9/2vu8Y048HlvWrtrxxIMLfvfDe7dcC6CNhIS59SxZV9eMYprJ3l2FY9nhQ/eHP/xh3QknnPCVqqqqY1etWoWHH3mYe7p7uLKiUgghoLWlMwAChXpm5yMrhYA2GtlMVldWVsqpU/dHV3d31/PPL//B/ffffw2AoGh0VATo4no7KjAXqwUAp86QHzx8mv/VVIJOzeUMegaNFkQi7oNEQVNfG4BJQCmNvu7AlFSNNHPPONU76LA52LFpe8czj86/5nu3bvg9gG3WD8SI5jqiuuainO6NnKumpiZRyC8DGHl7U9NHp8+ceWEumzv6ueefxxNPPG76+/u5vKxcSl/CaBuMAGYbJgw3hi8IvueBGcgFgS4tKaEp+08R2Vwuu3bNmqtvuulPPwOwtcg1FwG6uPYB2iNsIgLARw9JfWj/sbikIoX3sNYYyBrFTEIIEgxjDZWcK52UAj5pqHTAsZIKM+f4efKwow5BV1dP58vLV952zU8W3PQs8DQACCnx2PdP8FrQahobi5Ks11st19TUiFNOOUU5DTPOPP3Mwy/+yn9+YvTYsZ8G8ZjHFz+BxYsX63R6kCoqKkQsFrOSScCCcphcUwDQRASttU4k4jR12jTh+z42bNg4/+677/7Ozp07lxERiinbRYAurn1o1QKyqR7sgFqccaB34bTR4gcTRsjxGgY9aWitDZGACO1MPUnwBCEe8yDJoK97kJUo0TMPP9o7at7xkCaHTWs3zH/0gcf+cuVj3XcC6HNVNbU01MiWxlbTWNTPDt3V1NfTq0EZQOrHP/7xBw477LDPlpaWnjE4OCieefZZvPjiSh1kc1RaUiqICJqdZA5wqTom2rM4UEYuF+h4IkaTJk0SJakUOnZ3PNLauvgnzz333AL3UCg2AYsAXVz7LFDXQt5+O7RrJFafPNX73Mz9vIvGV9H+ghg9aTaBYkhBQjpnMyEMJBGklDDGoKd7kDM5YaYeNEe+9+S5mDhlInZs3blt+RPP3nXLH566dXEfnrRXkQAbLVoaaoQD63cjzxnSF5BS6gJQxs9//POjDzn8oLpkKnW2AaZsWL8BS5ctxa5du1Qs5stkPEGGDZTSkUMhUd6PO/T9VkqzVsqUlKbE/lOmEoOxZ0/nQ0uWLPnFE088MR8AimknRYAurnfQ+a2thSgA6opTp4qPz57sXTB6hHd0XAI9g9rkAmIIEkKCPOHczphsYgoRsuk0chmlq0aPx2HvPUEefPgRyGoPO7dseXb1U4/f/bNrn7trM/ByCNZSEB79/gneVatbuXn4ctZRlVxTU8MFzT4A8BsbGw87/vjjP1RaWnoWMx+0q60Ny5Ytxfp167XRGqVlpcLzfDJGQzuO2RhHZSCv0jDMyOVyTIAeMaLKmzR5EozWaG/f/fDSZ5f9YvGTix9xwEx1dXWiSGcUAbq43vlATcdOwKcPnRr/2pQx3mGpOKEnzRjIGSXAQko7f8ZMLslFQHoSbHII0oPseUk9dvJMechxJ9L+M2air2cgaN+6sfWFpU/d9eurVz6yHlgX/sNCSmh1i2xpuJJaUGMaGxvfqdW1A2SImpoGSCkLqQsAqGhsbKw59tijT6muHjNPa31Qd3cPXnhhOVaufJF7+3t1IuaLZDIlpPTAxtjQ3TBcwQG0m9SGVhpBkNN+zEd19RhZXT0Khk1/V2fnzQsXtv7hueeeezqsmOvq6qgIzEWALq5hcL7nzoVcvAjK9Z/EYaNw+iHT4hdOqJanj6kUcWWAwYwxucAwsS3j2OltpRDwfMtXZ9JZ9PdnTDxZZqYfeKh3yJGHY+yU8RjMqUzHjp0rXnxmeWvrfU88ePN6PAUgE70A64oq0NIiGlpaAMA0NjbuU1vy+vr6UO8iGhoaAECHwyMFS55//vmHnfXRDx9WPXrcGZ7nzZWeN2pPZydeeeUVrHnlFfT29ighpEgkEkIIgp36YwvMhl1ie/4u1NogCAJjtDalpSXe+AnjUVZaju7e3i1bNm/+42233XZjNpvdUATmIkAX1zBftbWQd9wObfKwM+PsQ7yPTBjlfWb8KHlweQrIZhh9g6xzmgBJQgpBQrAzfqcoLDY7OMg6E5hUaTmPn3GQN/s9R2HilP2hgjTad+3aGvR3z1+zdsfzDy5a81Tz41teBJB99eth5nACklpaWtDS0oLVq1dzU1OTscAeXaq8N655ZkZdXZ2YPXs21dTUoKamhgHA8zwdDoy8ao367ne/O2ns+PFzDzvkkFm+558qJE0zxmDzli1Yu2Yttm/fbrLZrInH4yKZSgpBAkZrKK1dhaxtdqRhGMNgGGiloZQ22rCJx+NizOhRoqKyEtlsxvT39z20Zs36m++66677APQCdtpw1apV3NjYWOSYiwBdXMOe+gBEgeoDAORBVXj/IdP8L0wd6506rkqUkiD0DBoM5kgxM3mShBCCbB6ijQ2QUoBYI5ce5MG0YiETZsy4yWL6IbPFzIMPwagx1egaCBCI8nXrt2V2jZgw5/5lK9e0nXLiiS3nfOgUvWr9jq3/6IWGRkBKKS/8WoutwP/hqqmpGfIceHUD77XWlClTJn//+99P9PZ2n3bce08cNdjf/4Gqqsr9tDZjDDM6OzuxY/t2bN68GZ2de7RWGvFYTMQTcSIhogrZGAM2xqownCUswGBtkMkGJqeMEYK8EVXlGFFVASkIfX2DazZt2nRry6MLbtuya9fq8OF02223ybq6umKGYxGgi+tdukT9XIjL8vQHAOx/xgzxwSnjvI+MGSGPryzzUlIQsoqRC1irHEHbCEMilwwOYafb2DBYBVDZrDEaJpEqp3FTJosJ02bQmAmTIUrHYIBGoTdXqnMcH5gy86AlG9a8QiMqSp4dU13xyr33PMC7Ona96HnJdT/5yU/C19OzF95nOQC666676I477njPnEPmjDv9fe/T27fvPC5VkpxRPWp0ReeePUdJTwpBgtKZDAYHBtD9/9t78/i4qvJ//P2cc+6dmex7m7S0tHSBln1XlqYssog7E1BEBBX8uKB+XEAQJgPuO6gouKKgkAFRQEGhJEVAlhYo0BQo0L1psyez3nvPOc/vjzspoTRNiuLX3/c779drmmly17O8z3OedXgYI8PDnM3nLZhZSSmEUsTWUuD7KHgejDEwNjT4jakwrLWwRsNay4aJSTjWjbiqqiKKqnKCzg/Dy+fWbd0+/Pennum+7aFHn+5CsQgCM4vW1laxvJQbpUTQJZTwOqn6qrBWbRGzT9/POW6vJtk2rd5tba53Kh3ByBUYo1lttWYbOh8whcJuWDVaSQEihjUaQcGD7xsLFuyWuSwiZeSW1wu3sjHfOPfwTbZsr7I5i48cSefMguqqKteRChWV5ZnR4QG3UMjnqyorXpk5c1b3pq1b9dDAAPp6+9A/OEiFggdYBrMhKSUi0SgiURdlZRVoampCZUUFNU9vZiKUP//C80tisTLZUN+ATDZdw2xRyOWRzWYxMjKCTCaL0fQo8rkstDYazHCUFJFojGKxGDluGLlnjIExjED7YGMR6ABaa+hAI9AaQaDhB9oGRlgIR1RXlYmmuhgqowGyowMoDPetGu3bfMc/H3vi7397auhpAPmxncIVV1yhkEyWfMtLKBF0CbuXquNxUEcHbDF9xxiaT5zvvGNus2yb0RBZXFOB6VEHsBbIeRZewAaW2TIJIiIpiMaqhAMCxlh4OiQ4BSAWJUQdGUBwTkXEBk9UbNycrWqubd73pU39kdb6GfOGSTgLG5um8bTGRqqprkBFZRXKog64qNcNc1IUK5cXQ6K1NigUCsikM8hnc8jmc/A8D7l8Dvl8HoVCwfh+YIMgJHipJMWiMZSVl4toNAKlFDEzCCAlJYQUEERcvD5x0evCWAtjLFsDsJCWpGJHChWLScSUBypsh5/ePjqybeNLvZs33vPoQ8//edlmPIlifhMSAldecYXq7u7mVKqUoKqEEkGX8AbIeskSiK5WWHHVjkx6AFC/ZCaOmDHdOXl6rTypsVYurK92IhFXwvcZWc+i4BljDFjr0B2EwcVc8hT6XBdrLAJhDutYRMGNCcQiIu1ZJ5AUbF0/UlbT3NTU+dQL+el5VZO2osLLebJeOaox4kbYdd1GKWWT47qspCQpKTKW7G2sSOpYLT6pFCKuC6kchFVILIy1YQ5t5UA54d+V40BKWfRJDnO3ChIASbCQzCSsQOjdIaVVDnngIAOT2Yp07wYM9219eah/+9/SG9bc9atHsboA7NCzCyFwyy3vk6tXpziZLFWnKaFE0CX8G8fNkiWQuyBrVAILj1kgjm1pVK1NdZFDa6vkrMpyVRGToRuZFwB5z8DzGdawDqOYmQSBmIgtM2kmsAWBBEUcQkWMUF7uIqIkrIgiViZ6C4YYkfLt1VVq+/YhQ4jUbioEEZX1I8gFEiNerK6ubhor1wVIAJAYHk7XZ/JmZqyySpdFo3AdB1I5cJSEZQEpx1wJJSJKQSoJAJQeHWphq4U1PruuHDF+zgly/dWOGQXnh+Flh5EdHdZDg8PDXnZo+fYt2ZXPrsP9m/GqlFyMtqT29laJ/3ejLUsoEXQJ/+kxFAfEoiWgnQyMAKAANLTugyUH7ROrk4Lf0VTrTJfAQRURK6IOADAKAcHTgB8QtAa0FWwhIJhNGMph2VhD1gLGsCRBQimJmEuIOIRo1IVSCiwAoSKAkIjE1LaoG8kx+9AQ8NnBcNZ3Kysq1zXVxwYJgJQKkArRWJSJlDWBAVhDkBSRqCJFHoZGM7VrXxk4XvppBPkcRkc95ApBMDxU8I3Pj/el8Xwhh0fXr8fKNaGEPAqIouQOXHHFcao7jKgseWCUUCLoEv7Pq0LicdCi3l0SNgDQNGD2Wxahqa5GLZkzXcSGsnxGY410KmOk8gW7f0VUQBaztUkhoRnwAwNtCNqG2dysZmgDGBN6ShgLK0hYC4YAgyQrJQClBCKOhFQSQhEcYUAcVrwWgop65XAiGAN4voGvBXwjkC4YeNpsy3vo9Ty7QkK8sHazBpnIvY+viwwMYnjLeCGYCLj1zDPl6t4UYTlKUnIJJYIu4b9/fC1ZAtkKYPEnwWef9ZrgmNfhyL1x0EmLVeStB7hm2Sr9tuZaNW1avbBVlQ7Wb9OH5gt6TpkCKymEKwWTICfQXKO1jRGFBGuYYIqVc41FWO3cMHwDMNsha+2I7wMFDc55TF7AwzHXPpzzkN82BASEhymP9d1bwcPAahTd3nYGJyBS3aCf9IJaS4RcQomgS/i/ZMxRIgGgCwKtQHt7qKcVBObJz5VFEqREYgkyLz8fefbJfLPPuXpJsjZSDGPxipTqeeF3z9MoeJTuH9LrB4HtO11XT3hDAqwFpdogVveCugAUyRgllUUJJYIu4f8pJACBBLC4G7S6FzQ+ELC1HUaKYt56/jcM/HGj/8rjoQCgC0BTUygFL0qBS1JxCSWCLqGEf2HMJgDqBgjxCc5IvebrRIRbIuESSiihhBJKKKGEEkoooYQSSiihhBJKKKGEEkoooYQSSiihhBJKKKGEEkoooYQSSiihhBJKKKGEEkoooYQSSiihhBJei2I6+NKz/hdAJBIJwcw7PolEQiQSCfFf+t7/lf0x1mb/P2rH/3fBnBATf3hXH3r1e6LYuRCTDdRdXJvCT0L86wMO4rXPNO76Uxhwu37f8BpSEKSgnY7pkJ2JJSqskjTVdh5rg7H3HmvH4nV3/5w0QX/Q+O9SULFyCIvOzoTq6IjLNzrhxj9n8Zq0i3vTBM809vt/dbJTIpEQnZ2dipl3O06IaOwZZUdHx5Tfe4J32PF5A+32an9ICSnljntMtb1fP0b+9baMx+OSmeVk1xFibPx0qqkQ9iRj4t/RB/RG+26Sz27H6G7GtvhXPsU23eVK/t8u+f035kgQAKIIs6D5u+7IDtnevpqTyaTdw+vaN6ENKxFW9sju/IxEbW+0Bp4ofqZacfrf8m4dHR3y7LPPNta+eqna2tpZ515wbtXJrSejrq4Ovu9jxaoV+Ptf7sZ99y3v3vm+zExE9H9yXMUQZuXL7kHb07iP+Xe04/vPPtuYce04c+bMeWeffXbZySefbCsqKuD7PlatWYW/3PEX3Hfffa9px+LCV5Jk/wME+KrEuWSJSi5frj9xzn4XnHTMnM9HXTmcC5SEAISQIAAWFgJhCSELQEgJIpAQgBSS/cCHIGmqKuvlnb+/96Yf/HHtjzvicdmWSplXB0dctrWlzFc+dfAVxx3WclZgxTCzo6RyIESUK6sj4r6u9Q+0/+C+L3NHXFJbao8GZEccMt4B+4WPHHb6KacccEXe01b7niAWkJKtUCa2rHPLIz/89aOfZE4IoldJNB6Py1QqZd5zyqyPnnfmvhdXVFRm0vkyEUqhBBXWJyViJmMtLJEhAvcOZsktr31q+3b/2VvuL/z50QdSW8a/664WnsrKyvovXzD/3kMOmSHT+YivomWChIQEWSU8oyI6+sxTPX/7wjcevGz8dca+X3jmvte8910HnODDGfXzkNJRUEpBkiCCYLCBZSuUGyWjA2zbPjC43/77/eW+ro0br/zGmr8DK3NjW9vdLSTxOGQqBXPwgqojLjr3sJ/NXzg7yGSZyCknawwkjGXWECSgHEFhGSuwMQywhpQUVka1RkciUbHimZ6OS7925/cnaJsJt9/t7e1cJFbx3e9+95CFCxe+w3XdU6zl/auqqysqK8qhhAADKAQeRodHUVlRuXp73/aM7/kPrF23tutL//ulVXh9utFxOxLG/Pnz3Y989CN/mjVr1vR0erQQcSNERJBKwGhrjeXKB5Yt+9PNN998xe7abmwsfehDH/rMiSef/FFYkwm0L1wnKkgQlFJmaGioYtn9y754++233zN2/NhzEFHFpz/z6duPO/b4pnwuVyBJgk1YqFZJGQipqh5+5KG//eRHP/nCuHP3pB3x6c9++m0nLD3puNqa6pPZ8oFVVVUx13UhCJDKgTEaA4ODcJRa3T8wuM4PvGXLH1r+8LXfu/Z5AOnxQtRYW3zq05/44YEHHnyiFDItBAkhiISQsAQbcyOxp556ets3vvGNdzJzEBYSfnWRKl6DL7jg3MMOPfwt19XX1nAmk2WpQv6BIETciB4cGq7reuCBxG233ZYqvrsFgOrq6pqPXvjROw/c/8CKTC5diDguqWLtSWsZQRCAwSBBkCTBbHewoOM4cJ2IcV1X/v3v9/7gpz+94daOjg7Z1tZmxtr3bW972xlnt8W/wiQssxXRaHTHgh8EHrSxkCK8IAmCkArWhMMjrIkZ5sM1YASeD4BsTV2duO/ev33/uuuu6xi731h7qPGdl1y+3CQSCdF19/fuPGxezb7vPab6i/mCAYQCrAeGgbUMIglmBrMtspUACQJJCQLDeDk07VOBJ2ptAcCP43G8JqNYPJ6ynIBovXPLH2bVyDltxzedn83lwZbALFFV4cIe2XLQr6ojNyDesb5YVG7K0le8I8FESf7TtfWXHjMzc9TQQB6SNHxfo7LaxS3L+h+//7419zOD2in5mnNTqZRNJCC6/jRy2+pnt9edc7L9VkW9B20khJRQyoW1DLYG1viwxoMxBqquDG5Z/iizbzVOPmLa1Vs+87W7f37r6h+0tf3+6V0QETNAqV+eOtx584qrjt+//IalB9ROH80yhAB0oFHXHMPty7Y//vvfrljPzNTe/qrEF4+nbEcc8tpn+39y4F5r9znvPTPf7hUISkUglBMOCstgq2F1AGPTADPkNEC4L79t1slVOPNtp77y1LrT7jnn07+/KplM9u5ugqdSMMygtsWjq15cve0Hxy6u/t2Jh1eh4GlIIcAGsEEQzjIhQNKBEBKMcCdMDLC1ML5GWYuL6vK9VwFAvHERTVXaa2trM8lkEr/85S/bFixYeEldXe2h0WgUmXQamXSGyVpdyOeV4zhgttCB5rJYmRaCFs/fZz5iZbGj5s+b9+WD/nZwemho8G1nn332oztPhiJR0Ne//nX9yCOPfPW4Y4+/fkZL88HZXBbRaAxEhNraGvzt3r/94oWNG28onj/huEylUpaZ6T0nveemwf5+PuGEE66prCiHsRbMDCkEbrv9j19Y09//j52InomIOjo6cnfcfcdXJInfn37a6QdlshlYa+EVCmhsbMSqp5/58wtrXri+qCaxRbKbUjvefPPN79hr9uxLa6ur3lpdXY1CvoBMJmPZ6CCfDRzlKEhtLAlhqiqqQITF+y1oWKwc54xFC/fD4gWLuy+66KKjmDlL4Y05mUxyIpEQDz/88LfnzZ2v3vGOd36yUMgBIARBgOrqavQPDKx+8MF/XM3Melybv8pByaRNJBKiu7v7mZdeXPPtQ848+w+zZu2lMpkMAIaQEo7j4uabb06uXbv2PmYWRDS2C6Sf//zno3/9618vq66s+unS1iUHZzMZRKIxSClhrYXve9Baw1qGlAIRNwLDFmCGIAEGo3l6Myx475/+9AY0NjZScbFFKpVCTU3Np99+xjuPGh0dAQkBKSQsczi+dQBjDIoVkUFCwHVdCCEwtuPj4uy3zAgXW0ZLSwtWPPbEWwB0DA0NifE7JLXzzjyZTBKA/uUr//nlpq8ecd6h+9XXD2c8JgQEk0dFTEjpKjADzOFAAwmQigDsAFKZIG/83q39jlRyZNd6wbFO6Xtp+VN9H2v56lEnHjyvfMbgSIaFFGK4P9ALFjZGznrbAZcQ0ce5Iy6oLTVlQwdR0n7+40v232+GPLxn3UCgDYQ1AVwX3L1dm0u/8cT3RoE7QUDy9cTPySRY0Ojw8lWrvt3sLvrAO5bstf/IcM4KpYRQDirLo1IKhtU+YAqQTNBeDpmRrGdtj6xwuO7whpkfmvHRhWdecO5P337aaf/TtTMZUDGlcduf191lRtN/nPeZwz6ezWUDa6HciMMvrwddlnxw65a03VSUdmh8+yUAfgj9Lz70fP+nF0xzTjxo/yaVHsmTdAyU66KiXEnJDBgN7efBzCh4vvXyfiCEchrrts9936ELP7nwzx99e9fTFad94QsXP787aTDc0XJARDfNqhanLZi+6OzhkbwmIaXVBVREWUZcCYgIiCSIw8EONrDGwhprTaHgme2DqrZmWnoPDFeqra1Nn3XWWfucf/4Fv5w/f94SMDAwOGDTmUwQcZxIZWU5FfIFlc1moLWGkgrRaJSisajjOA4ymTSGh4c9y1Ys3HffyqefWdUMAKtXr6Zd6Ky5o6MDP/zhDx8uj5Z/4+wPnP3bfD4b+AVfllWW0zPPPpt9/wc+8FkA2dUnnCAmUVEwEUEIMfCnZX+69off/+HZp552ypG9fb1BU0Oj88yaZx+75JJLvieEQHL58p3VeQwAf/jtHx53yb1on3nz7gexbwIjlRR2a8/W4KqvXvXlBx98cG1bW9sOCXIycj7nnHMWXXTRRT9saWk5OfADDI8MmVw2p2PRaCQacUXBs8LLZ5EvWMSiZaK8olxEI1EEfoDhoaEg0No0NjVFp0+fPgeAI6UcPzY5mUwCwNb777//czNm7tU2e6+96jLZDEspjVLKufm3N//0xz/+8cPve9/71NKlS3dZKCGZTFpm1kR02z5z9j2wvr7+sqHBQQ0CNTVNk2vXrn3wiiuuaBdCYKdFiQHgN7/5zT8aaho+O2v27L8VCnnjOjkhHYloJCaVkgj7hEAkQqJkwGoLzQba6MJoOi3m7j3XB4DWMCE5nX322QaAW15eMX0kPRIEvo9oWcwBFc8NfBhrIIiQzeXh+56RQpByXI5EIqKqqpIsW1jLMDqANuGioLXW/QMDHIlEc7tqC7WL39nOziWqtbXVXvfJmx4/4sC6M1iwkUIKrSro4Wd7tlbF7BBAYAt42oDBiCgJY1FDMjJj4d5Vsaa6chgbREKRb9Eu8+9y5xIlT3hQ947kH4xEKz9IWaVJCGEZjk734qgjZ5+J1IpLEe8YCWtbTK6va2/vpmQS4qDZKlHtBNGhnNRCkWSCjVYoObotv3UUuEMIMmQnNjQsu/J41drear/+4d/8w0IcJJTDYCvdiIs/3b/xuU2b+gHtkybrV1fHaL+5dfMPP7Cp3JKx6ZECFza+pKsresr2n37kX3/2vU+/t62t7d6ddZ9tqRTiccjNz2X/vn04+ERtlasKeSti5VHa3DO6bbhgrwgEPYfwOV8zAZMAMydEa3vXpu1DA5si5bH5ucBax3XEaMbHb1NPr5OwuULOh281GutiPHev6sVHHlgT8bSy6Ty4sH6N3q++du/oYXvf/9g57zzx6quvemF3JN3eSjIej/Pzrzz88EhGf0BKKXQQCNeV9M9ne4eJzJaII8lYOFaTAlkDWPY8WxUEmDZ3dn3sgKMaMbQuOw0A0LqYp0Aq+vLLLz31tFNPv7WxaXpVT0+PAYgbGuoVs410r1mz8eWXXrrzyVVPvVgWkX9/6aWXbKXbgJY5jTWxWMXJ++276MDZs2efOG/+goZcLmuz2Ywla4Pd3Xf16tWcSCTEunU9jw4ODYn6+rqIDrSpKC+XW7ds3bZo0aJg9erVU9ZjL1u2TLW2ttprf3jtXcz8FkHCJyHk0ODQyo6ODjk0NCQuuuii1z1TW1ub5URCHH3vvc8NDw9va2mZPi3HeVteXuFs296z6cEHH3y+OKbsVBa5W2666Zh999//r/X19VU9W3tMPp/nmppqRURy7UsvbXjlpZfuffLpp1+UUv59aGjIU8D0aEXF8W856ii3pqbmnfvss8/BDU1NDoON1tqbYD5yZ2en6urqMo5S98fKou/P5bJaKRUZHhmBVvqhRCIhurq67O7ncbuIx+P05NNPjhx7/Ful67qWwRSNxeTGjRs3MLO44YYb5M7tlkqlkEgkxN133FE49e2nioaGenieR+XRCnrl5VcGBgeHtgkpilK0HStJDNdxUFNT55SXly2Yv2AhfC/QO6m+GMA0R6l96+vqnRUrVnAhX3jOWEvMDB0EICJksxmePm3a9JkzZzYUCgWOlZeJbCZTeGrV0y+XlZXB933oQAPEcJSDqqqaGUfN3KumqqqCpkrQaO1rYqKkbT93b9JBAGsBwzBVMxrVQ3duSv7k1udvmKBdaxxg7llHVS347Beqv0nCHAqgUsqr0rs0+LW2WsvLyfP9ZsOmqLQRkJEIjQ4OmIP336/+A0vmx0nQz8f045N5RAApGz8/3jC/ZfiM0ZEcM8UkE4OEBAsHFXWC44DtMJYm2xISJe1vv7z4aWstIATYWF1ZG1O1e01PXPj9J/742qNf2edTJzZd/uGz5p8/Y3rUjo6Sky2wqRl9LnbovLl/PGTBnKOFEM/s3A6pFMwh04MhzxgIJcGCmYShwPr9QwGeEyLU5+7qdYF2LE+S/cgXDxhSUsJCs9GGIT26/Y8vvPeJETw9/oR64PCPnd78rQvP2++E8sqo9QPX6d3ao+fOMjPOOrH55tTNfEx7e7tf3EXxBNt2857D69zAMJQwsNo3lQ3lanOa/vSRKx45v3iYBOAUjagMoBbAjLe0yL2u+PLSr2SjkVND6eusYCJDcHHraj71qU+d9p73nPlnx1HOtp4eI4RAc3OT2rhp08aHH37kyiuuuOIOAKMTdOETxZ/TfvCDH1xw6KGHXjZ/3ryKMT1ga2srihLfLqW40979bklgCEFgtjDGgoiy3d3dWinFe2JkJyL78+t/Pszh1hPMFvl8zvnYxz5mOjs7J7yOuOoqy8yjWpssM5G1FkIKaGNEPB4XQgizu+cYW+Q6OjqOPeSQg+9hRkVfX58WUtDMmTPU5s2bN3d2dV3V3t7+BwCZnU5fC+Aft956KwAkTjzxxDPef/b7Lz/jjLcfLaXYLcEmk0m77L5loyQlICVLpeB5BYz0j+R//IMf24m8FnYea2fFz1LMgFRqh1Fy27atLhHZzs5OMdG9583bVyLcvUBrzbFYGa1bv379pz71qSN2I+jJo48++rDLLrvsUq310QB+tNOxpmlao7t69erfXnbZZd9duXLls7vi1F/98pfP7rvfogbfGBuNRmVPT48999xzTwWweRfHz/7rvX9tn7HXDHciy/qEkCRgtIExGmwZRBYzG2Ss6AanwoEbutAIQRCChrWgJ296bPSWv93/9OkbNg43zqpGow0bdheDqJ0BcEWE6q0pKusp1GVrK6hMjPBxb51zKRjV7V1dZrIJ0dW1RBKB33Fg5qMzazji+WwYhsbchCwTKmoqOAUYIaYm/eQLfgzWhOwvwom9deO2w5iZeMWFzrj3f/nHy3ov+O7Pn714JGNEpExZGYnKkeG8XjzTj134ocM/HurtXy+1O65WShSbSBCYAEGsJukfUkowAJEv6OlsLawxZK0G2OBdb2/EmLvimDvgoKAV3/xrz6nX3fjsspjSwui8hRBqaFt/cNR+kcM+ev7bTiYiTiSWyN21iSNtRWhtEGyYYaxGSxPRuHFhhKCCEKSL3/tJ0Kp/bjV3n/7p+9/1+LJnM+e966ByO0H12OLk5QvPvXDWWW1tt5XFypxsJmellNTY1CD/+dijz59zzgePu+KKK24UQowys0wkEmrMZ3fcRzGzJKLtn/vc577xhz/87uSBgcHRhQsXTskwGRMxBhGssdBaw/d8gMi8UW8UZlYAIIWAlBLRaGyqbhBuEPixIPChtYbWoe4/lUrxZOq+s84+y5x//vmL9pk7955CwasYHR21RCSmT58un1r19JZPX3zxie3t7T8XQmR2bsd4PC4TiYQqujPSsmXL7v7oxz7aes8999xDJKqxm1qOAGDYKCkklCyqFUjAcZw98hyLRqIsqFgGp6jpc5zJ281xiMc8TZgtfM+HkMoZm4MTfOyjjz76+Dvf+c4P/PGPf6xHWFneFPsOCxcurFy9uvvp448//iMrV658dmcXQqUUTj755AgJMY2IQACFUjqrpqYmd8zdM+QLAWaWADZ8+5vfvumO2+84CAC2bt1qJpWgX/V9NGBYGAaE0WTYYkPP6D5ExMxsrE3uvM0LC4Iugbj8+o3dh7fg5FnVGNo48npjwPhzmmpcbawFiOEq5sBoksoV+eEh3Xrs3nOPn1PzSUH09Y44ZFtqQhcjam1dbiqamxuaKunzXiZPkEJEJbHPTCCQtWA/702bXYH9NmSwJgFQchK1iQ20RVHpz5bBrDE8mK4lIu5MLOGlh+94f8ErLpR0+A0/Ov6fvWed8+75x2zv8wwLJbL9PXzkfuXHTiQteh7Yal1cn4raaRI8RSIgw1ayNSA2gAkX1OGsj5BsQcaGu4ElgHpIUvDdv/ad/46Th1YtWlhXMzwSsNGgRjPIB85EG4C7Q8ly+W6kQVhmU1w/JEAK1hoQEXPnEthdq44oHgfddhttT9298by3LdyY3ZWRCAC1t7eDiOiev/zl5tl7zy7r7e01rutQTU0trV374vPnfvBDJxBRz/XXX+9cdNFFemwS7ar7ihIy/fWvf3VPP/30R4888q1X53KZYwDcM1nDeggNSkZrBIEPbTSUklkA0FrvsaseEbOUEsp14bjuDov+FBBIKXxrLIzW0EEA3/cnvV17ezslk8nYB8855xflFeUVAwODxnGUaGhowLp16zd8/OLPnNy/ZcvaRCLhJpPJYKJ2HNtlJBIJdfXVV3tfuuCCtvbrfvLISe98Z9X9d96ZmVjAIxZCQAgBQQLaWHjp9B4tam7MhVQS1g8ABowx0Nqf/ESNULgMCZLZWlSUl20qcpeYQC1E8XhcDg8Py+V/W/5JvCpYWgCQUm654447TiAifeaZZ8qd20sIgfvuu48/9MEPBgyG0QaB70NrrXt7e3VxvOwouVZ8BpFOp1c98cQTXym2NU9ZglYEEBPYMLT2wTaADmz57oQEADa5HJoZtGIr7n9oI4YmmIg7zmmsdwyBAMfFtlGQIg2Cge/5YlqDw++KH38uA068g+1EUnRnZ0ISgb928VvfuWimW5/P+VpbFi9vzlBEMWAtMcOWxSKx+XvXzgWA7vjkW9QgsGAQCAS2FmwMjNXOrsig/a4bmBm0aZt37fCIDyEsrNFidGAE8HoXLj2odlGRNMVOY2nH9o0tgy1Ptna+5r5CIA82YKsB1mGvuq/fMS0HtNZnShA2vbg594QriKyx1lqCzgzTPtNQAQCt6Nr9DbWFDjTYGjATWDpgIXceBzt/bOgNwrQ+gwdvWIlg1/3YKYnI3njjje/eZ/78Y7f1bNNCSFlWVoaCV9C3//HuM4mo58orr1RF/eNUSJJPP/10P5FIiDvuuOP2u+66azDcce1eDwovJOjA6DFDJ4SQwRv1abUIt+phoIqC67pT9jlny0IUJUJjDLTZ/Sag2I7m59f//GP7zJv3lv6+vkAIklIqzmazfNttqff3b9my9sILL3SSyaQ/lXZMJpP6iiuuEH1A5u/3/f3m2khkt+2ni94qRBRaxS3D38M2U0rBcUKSBhhaBwiCyTdAOggXVjY2nL2hB/lk851TqZS57777spv6Nr28M291d3dnAAwxM+3OpdEwU9hHATzfRxAETlHlt0u+XLlyZf/atWsf2xVPTqoHsjbcIsBqtr6Pqkp3c6gfatutBZsIHA91kTSxDzYBQIXPqs5AIFYRE89t1k8ErIKIYICUyPVusscd1bzv/vXlZwkheMkS7HL73doKC4AOmet8zOZzHCuPyg2Dpmf5qsHtlTHAGsvWaJRFFObNrtNTHSCyqHqwxkIHAYwJ4BX8hl0d290NJgI/8fLoyEimALIGVhsEgUYEeff4Aytiux6EgCAA/GrMyB4IZ0ZIkWOjwcYUfTzFbtRAvQQG7bdPw5/8QINAzACMsYiRb/aEbdhaWGaABayWU97pF8cFdt2PrRaA0zK9pb1QyLO1lrTWura2VjzzzDM3/uIX161+4oknnGQyqfdwrnMymbR33XXXur/97b7vj+kqJ23cogS9g2jCbem/FHlAIIg9DBEjQSSVLBIVYNjsTkqi1tZWM2/evMZ95u9zWSaTsUQkrTG6tqZKbOnpueaaa67554oVK5wbbrhhjxacYpvRn+/487dSqdS23QlfxhhYY3a0nZQCU1+TivOvGHUpigIAM8NOUcNkuejvrBSUo6CNLptEWJwKN07qrKB1qBJGsfz8FCKLaaL77V4HLYsO1xaAYbDWaKyK9IaW7l6a2Nk/NACkdhNlligGI1U7mD+S4/mGHF1VpiijzbObe/Orqisdtkbb0YEB7N3g4fS3Lf4IM6Ori+3rDSFxCUry5y884YyWsuDo7GgQ1Dc24ZkX03c21Uf+KgUDMNYEAaIRgQMPnmnGfBsn7SVHhD1iDawJYI2BmMS6aAMW2g9grQETgaSAtRq5zOguR1ZESUhJoQRsdTiYJw8m3tGugqCZLcCW2RJI0q7XawCtrU3MDKzrGZ5trAaHumQIKdHfMyABTCI/FxcUQRBCQRABbOFPTpc0pn9PTRAJ19HRIYnIXnLJJW9rnNZwQDqdscZaQURye29vcPff/34tM9O3vvWtfykicSoGqnF64zGChFIKfhBUhfr/PTMShltgJ/QJh4VlwJgpc6OVShrlOJCyKIHvZhFuTyQkEfGSY4/9aMuMlmmFQt5KKQURycGhEdO5bNmvmJnuuuuuNxqRyFMJ17Y29PMd2/47roNIpHKPJWgKdcEI3eoElJzCGukAQoZ9JqWAlApCSjuFMSrGbXh2O+8mJugAzKExt6jGkpNw7YTqTDHZIsKWwwGF0LGalJKdnQl11FEHys7OhNr5A4CLkXm778BE+OOY+WVcUxEDG2aAMWNmdNWa7i3fBhmC9TkIrMj2vcxLWxe8pQFYIELr8WueOx4Pd1DHH1x+QSRIw3Fd6hnI0q13rr3m+MOmP8oMSCEsGwvBFmxs/ZSNFEoQFVdjgBEOy103WxxxJBIJceSB9U4sIhHocBVSEReZtOUH/lF0C0++fhAKKUAwAFtIKTAVhn514kOjKDmTcEDKgetMwNCIgwhcXoZTtNYwlglCwhjLj6/cGOoTu5bv3nimAMdREMUILQagWYrOzoRaj1a1q3EhBPHO/tyve7LigllfX3tuWaw89LS31paXl9Hg4OCK3//mN88CoKlEzE1BCpwqFYXGLeVAOQrWmOhUdp4TyOOhkc8YaKMRmCnvkgRblkQEIcNnETQxSbW3tzMALNh33+Nj0SgDICmVqaquId/3n/zGN77RDYD2MA3BTjvkybd4SokwArkozwgpUVtbK5lZvOMd7xjLAbLLz1FHHSWZWZIMPVdCuwxBSQnXdaYofauQmIWEtQxXuYXOzk4FwOns7FQ7f4iIi3rhfykFBjOKKqhwUZFj2/A3ADW51owhiQAGQTA2bh0qu3RpUk9owU2w+mr6xMvv+MOa76zs6clN9gB7NzqIhLTO2ljkM4XoZ3+55c+HHti4dXZjpGUkyzY3PGIPnB+NvP99R17449sf/0JnYolYmlxugTCsmyhl/veTJy6YVeW/baB3RDdNr3K6ntz66Opt/pqNW7PvnllXCZIW1hiWZLB+Q+9pAG5tnHgXMJ78IgRdjJYUIJKQExiiK45Nq+Rnkt51Xz7qfRUxhZFMqLQoL4/w6gcHxMr+UNxN7uS9oKJREIUaIyFDadZi6jtphhAggnBCciYJIKIEMyiVCg0fixb1UjzeJIja/EsuPunYRfNov3TWt4alLI8gWL+hnx58fOR2gNCe3P3cc1W4u7Lh60ApCRjKL93duABqv/ip0369eWv2i3/444NrsevcHBYAZszYa2+pJEmpCDDsui42b938ODNTV1fXm5GvZJeIRCJQTrg9ZgacqRv1JiCMMLjLGgtiQNKU+5jAHLrYgaAcBamcySauO7Olpd4aJoBICHBlZSVWrly5rfh38Wa3n+tGQ3IKPSdADNxyyy2j3/ve9+wU+jDc5b43HhitYYwBGFCOhJKT90M0qkLvEfFqzpB0JiM/MEFwzBiuv/76K0ZHR6//4he/2Is9zAU0dh9HqaKawwAiJGm8wZxCavd6r9BFRgkCOZKUiuG444886qQzGj5VVVfNrqtYSgNIJmGYn39m04wD5n3oXeu6vcUre3o6SIg1bO0uJ1R7UZBcuE8NxWJO6F5nLTZvGI0SwX9y9dBtC0+ZcfFozlpLZVL5fTj2+Hkf/NHtj1914tX/GB1rvMZPLCGkltOiFnVphfDKRgITDPYP2H883pMAQL2DBZCshVRj4Zwa9bWRcHS3vl6a3RkZz68lshDSgSuicN0olJIykVii8kfFZEdHnBsbe6m1tYmJUl48fuxhR+0feU8mk7PMMSmVsqwh/rKsZzuAdcS8a79mkuH2TUkIpWDN1OePoxwIKSFkKKVIadBYQ/lixKYZi7NPJoGrrvrE4tMXD97o6O2RjHWsK20QjRnnxtvXrnx8AH9jtrQbr4gdqxYhbEspSbBmtMyec+Ddd1zxifKYEmxhI1GJdCZTVl0hci+/1DutLmriVeX+fu85/4HPj22gkju3QBiV5rS0NFcyGI7jkJSCpRSYM3vOciLizs7OPdIqJBKJMQPP61bVRYsW7TaZVVVVFcpiZXAcB5YtKccBkXjDmQAjKgKlHChHIhKNIhJxpnpqpTWmnDncJUkpUfTL3OW0LbZjpbZ2nucXwJZJKGFd18V++y28u2ggfdMWumL0HWKxGJR0IKUEGHBdJ7jyyiu/1jcwsJcbcXNKqVFJ5LsRlTMBu17gVbLhGAhWCGkdpXpjsdjc0L0wkFJJK4SEUGIKBF0BNxIJ7WcA6SDA/Llzq2//058+2VBbC+P7HNgA2jIZwzw6PFw3Y8aMeHl5+cIrr7zymjHCnSxWYtcLkwui4u5ZSLiuWwD22D46OUErJYvJkBjkuCLTO4gjWyrf7Yj8uwVvhdAKZCXIhtEU02em4bLB06OGATQzsCYOUGpCHUcSRxzSrGOuU4xVJ2zr8Qwz0PnYth8ce2jjufV1ZdU5XyI7nDZHHThj2gffefQ7brrz0d8nliyR7V3LDbDcnHfekur5LXjv8FCeqyvhPLEm8/RP7x1cBoDXbxgiti1wnBhgLFwlUD+tZtLVrHVxEwNAzrP1yhFQWkGSgFteBj/vpb+eXP46afELnzv7PaceYn5Zq3or0wXFWvuYPc3lO+5ZGzzQnfsqCRo607LcWQerxhZD14UmGSap2dE1ky/iTiRGylGQwkBJwBcRPP5SdNFJF16ytdb0yy1rHj387ace1DC3KfLeBY2D76zytzujWZjKSrKNTY7zy9RLa65bNvguIahANHneE63DkFWlAOsokRnN4sBmcbSSm48mEwDkAMIBygE2Gvst8OHqITyywTejXgSAt0tisday67pzctncvkZrCCGEFNIGgcGjjz7sFIllT8a3nSgQZSpobGwMSSYMkmAlFSIRN4M3nE1OwnEcOI4L13XgOLsn6Hg8LlKplKmvr58hlaxVUtkw8ZDY3ZAYi3qLEaEy8P0wJQMEtNF4+eV1+E/BkQ6EFJBSEsAItHaWLGn9UDQagSAK1T1BAMs2dMUTYfsIISGIEJgAgR8gk8lAKUcQkSWE7nOToaKiArFYFGCG4yiRzWUwvXn60XvvvffRIILRGn4Q7OAdNYcQjcWwvbe3/4l1T7whabfod82O4yAWjUIHmpVyUFZWPgIgPfb3fxtBOxT6XYYx5gJSABSk4QcaMEG4S3JikMo1RGTy6TSsKLOWnehkrJJaHEo0f1sxsPjC9zaCA0ah4KGQK/QBwJ9XeevPfHnknlNmVn8g50EXCpqa9DY+bUnz+TfdiZvbu7psV1erXLp0ub7xexUfnlkdVPen4ZEjIk++7F1LgGEA6/vyvZlcABVxSSgHZIGWpjI7JkBPPDvC8PRMTu8tpIKQRGy00Kz4gCXH733JXunPH3fc/k90P7NmZsR6S+bOiO2/d51+q+v3YmjU2ojj2MZaK1c8+Yq8/tYXPzFKdEPiChbJ5C7IT6nQlY8EhFQgEuDJhZsx5iYmjjAI1hoy2iNHKlx81sF/iKgtI7B5+K1zGuorsojIEWRHRiCcKFqaHZnOZeX3fr1+xVW/3RgnQVuusCySU5CqrBCwACyPSf4KjimAC1nWfo4IElbGAOFaZgudSxsvyMBSlTMRPScSCSSTSTQ3NwtjrSgUCrDWQkkJyxbD6fSeDGwCwKeccsrCWMyZ+8ILLwSRSHlgrTWsmFzH5UJB877z9uXbb7/1kYlVHMWkNzTmsMRga9+4flKGu48xf14zxblaVRWjWFkZlKMgvFCfujs/6CIHMAnBgdYItA63UsZAa/0fSzFsoXeEVI95r+gggIdQMrXGQGsDY0NfAqLQqKecMMEQdnh/KFDR3KiNQaAnN64qpULOksUIxOK1jbUwRiPwQ992W9QV58EIjDFCCDSgAQMYeKOvXebu8HN3xoybHoA35J65W4K2bJHNFZD3GJGIgm+F3dSneyoivnaFzTGYsl6uruBn6wnkRqXFgbNqEY16LAHenQ1kTP87MpI5vJDLYzRdsOT4KGRHC0VFO33kqK2/OHB+xfshIlQosMiv3YA5DU3HnHzcgXOEoHXWJgC8WFbn5j432ptGZUXUWbdtdMP3bttw81ga0SMXN3YOj+ZsLKKVZanzeYFYDKEvd2vTpDOELWoCX8PLBhCCqfell/CWOdPecuTeFW/xg5cwa0EeIsiCvV74PX5gImWoqog5sQiJezrX8Q0d6y9d0YsbEokJyBlAVAHaD5DJErS1iEYA7HCjmvQRpfaDysDX8AsFaEGQhQwWxoTD2jRoG2DI800uD87CRaSyVg6OjGx+4tmN22+6c+Of73628AMiyvJUyLkVwHKgLCJgAh++BiwYkWgEz744mMl6OVumgoKSIucF+TI/QIW1LI3vRw5eUI6KGGPUG+UJDHehnjCdFun0KLLZLHzfhxQS1UIg5samPKiXLFkily9fbiBw6sknnXr1//zPxZXZXBZCEKy1CLRBTVUV7rv//nsAnD5RfmjXrUTB82CsgTWWlHKQL+SrivNmjydcEAQYGRnBwMAAotEo8tnsVGVRFAo+stksstkswBb5fH4q92OtNbxCAXlmVFRUoqqqSr/ZxDy2y8lksiASGBkZheMoGK2xfv36V8oryj1mEAFsrAEbC8MaRjMYDEe5kEoSs+FMJlexz9y5exUXFwipinECkzWZA9/3IAQh0Jqj0Qht2LCxL5fL9UspqFAosNFB6C4KIBKNckvLjEVSKfeFF154o5GiAFDOAPL5AnL5HEBAPp97wxVpdkvQxgTI5nzkCwzje6ZqRgPd2PHKV2+5f9tvABSKhzUAaKoAamdXABd/YtGpEWO+sncE9LI/eUPOqpd6ZGgI24d84UQZ2je9ALDyhsPUrx5f2XnK8f0P7De//sThtDTGBJhdlYu+/7RZn7zvH898gShpf/bNU06dUZmZNbAl78/aS7gPPzVwEwA/1Z5yAfiDo9qMjmQRuB4sC6FkgE2bcscCqJDytsxkOgQB4nzeQyaji/osiwbrIaIUSFtwIYecF2b0i0ZdR1sfz6weCv65ovfvP7p38FoP+HsiAZFMTnyPaETDy+Uwqn34xgLahZm6xoqMH8h8poBcrgBXGGR9Ns8O2P66CrK+pmhDpVNrmQBybFQRrfLn9Zz9tYfeApCVgmAs75E+MqYsAs9HgQWsCXQsJtQ/V/Xd/bkfPf2l4rhIA6gAUF0cYxVfibccsHi/ml+8//gG+YcH+3dt6wQwODg4nM3mBvO5fF06m2EwI1ZWhiOPPJLG9JuTqS2Whzlb6G/3/O2a/t7+jku/dOkj06ZP2yubzbAxhhvqGmTfQP+93/3Od95RjCrjiYyE6XQatmjYM9bC8/wKAA4z7zFBZzIZDPb3Y3CgD5GIi4JfmNJ5uVwOvb29IALS6VHEYlEUCvnJtto0NDQsPc9HJptBEGiUlcVQFo3W4T9UqCM9mobv+cjlcuw4DoyxuOTSS0995ZVX1k51F/T+97//U5/4xP/8aHBwUPueF+ZWNnYKY1RhZHQUmWwWWmvb1NQk161b98SFF1749onO+eQnP9l60MEH//q73/1u7Atf+EL2Db52mdYa6XQaIyMj8PIF5LI5hT2IPJsyQbNheIUAvmcRsOEKU5D7zS8DLaOCfeB4JU54UAPoZ6A/A2B1hnHRt7sfPvtg55i9Z8rIyy9PriuqiloqFArI5wORNwRo8xIA3HDDSjBAV76Uv7qpMX+CHzhCkMJQ7xDPmtH8sfnz5/9g7dq1W+Y3BF/00ml2HJJrNw1kbvrLluuZQa2t3RYAXt46TG9dqMC+RcAWgjQqIiIaTrIpWJnIIp/NI522MMysIg51P5tZLWCrA23qrfVhLA9KMk+8uD7rD/fl7/7ZQ7knAawGEeJnskwmJ9FZaqCQL8B6hHxgAKNgTGQq7hvhTkf7NDqaxehoAVGledi35uzLXjgth2ANgNq7v3HQ8nkt1fNGc4zenm3m8L2jR/762k986fyLr/vmdR+90LloD4MVlAC0FyCvBYzWqKwgNLfEPBK0qUj4AFAAo58R5iH8amrrynfv33tyc1NFbGIBhAURbfU870U/8I/OZjKWrUV6NI2tPVvfBqCjtbWVpy7QsCKinmwm+20h6LogCDQAgiDx5NNPdwCw7e3tajeeJygUCmG4dxBAKQlr7SgAf0+MR2MSZT6TQSaTRjqTQ3U2C28SKXgs14bneV4mnUYk4opsJm0Dz9+dDzVba4mIBkdGRtb5vjevkMtzYDQNDQ2hUCicAuA7xYCgNxU6CMhYi3yhAN/3oRwHH/jAB8TXv/51GGOE3I1fsjFGSil1c3NzRSadxehImgPfp1i0DFPxTlRKIZvNwloLEwRwHQWtdb0QAsaYMUPq+PsJIuo66aSTfnjMMcfsWOjeCKf6vo/R0RFkMhkErg/fD97wgqh2rzILQ3o9n2F1gILnQQcBmJnau5ZjzIcfAMWLq3IHJ5goecq8ohtPahKDSktjObRvoY2F1hJPvRzSTvNKGDDjaqLl++xT9dze09QBOc/YXMa3s+YGVRece/gHzNbKfzS5wdE9vb7fWOu6L75kf/3yEDYhFZety1N2OYAN2wvw8j5kxEFBA4IKiLoVXJzAU1AbWngFD74PBEabmU1R9egm9/IvfXflMgBVRYNRrig1jokwYHulaKckkqnJDUpRBRg/QJ4J2YIFs0XgqKnyM9hqeHkPBU/D8wB22D3jmBrb8UhfAYyex1b1XjK3yfkjArZ5T4qta7rNwpnq8k98In7vx396w9NTrcYxHp4XIJcPjTyFaoBtALYsfvLTQ+VFF63U46QgMIM64kBbSp8PDFtgl3m4dxy/Zcum52fOnHGUVygwM9PAYD8a6hsWIQy/MXtIjDRz9sy+fL6AQIdBQL7vI5dOu5NJkh48eJ7PnlcgHfgQUiCbyZYDcMclnN8TK5INAh/GaBhrYadIkY7jUKADFAoFLvh+mADotdvq1wyLVColAeR6e3v/kc/n9yn4vmVr5dDgEGKx6OK3v/3ttQCG8SaXlMtks9FoNIrAD0gLAW0M0v39sNaivb0ddjcNMPb3bDZrc7ksPK8AY0J9tpxCjIBSCoHvI1/IwxpN0XQM2VyuxloLpRTvfG8issV5cM3999+PqeoXdzVsCvk8spksCvkcmA2MYf1GDcti9zpoDc/XyBYCpLMBsnkDkmO5FZaMfwmbAkwKMERJS0Dw0gSm+teLOZbzngbZkKQ3FRNHJgEgDCfHhs35GxxhQRwwIGV683reZzo+WxXjn5h8Aa5wxciohz89tP1GANSWetVvZMOGEeRyoTEg8A2yuQACjGMPmEVT6QFtgXxBww80tB/AGh+HzC9TUlJGKbFVCNouBKW5Iy47E0tUYglUglkQJW1yimoDrTXyBR95TyPnBSjkddF4MTUUfI1szofvmXC3EwCsfAKDrr/+MOfqW3r+/NSLg/dVVhiZy3s2U5Cg4fUVJx/W8CtmuJ9YtGhqVaaLDhSe1shmQ5XKaNZDNptDWIgJdsGCitfk3yh+TFsKhgj+7qTVtmJRhi1bNt0yNDBAvueJwGgx0D/A1tojb7vttr3a29sRj8f3JNyat/X1uaOZNHLZLLKZMKl/VVUVT9b9LzzzgkiPjlAhl0cun8foyCgcpcomIMYJsXhxmPd6YHDw5GIAnmAAfX19PIkXBxVVLa7WOiTofAG5bBa+7+1O8gYArN+8/pb+/n4KgoC8wKPR9KhxXXf6BR+7oFUIwW+k+O2uFtTXmSqK0nk6k6n0fR8FrwCvkEfg+6HldQ9QKBSQzWZRKOQRBBqG7ZQlW98PkM/mkM/n4eXzYdRrUWKYoN3MnkSZToC853vI5bIoFAoo5D0UCgUJQL6RGo5iEgMZPN+g4BnkChqBMQgsysIVbrndjWQ3ZZE+VzCO52tIaQHtwxvH69SWssygWx/o+c3Wbdm+qLLSMmHrln6aGUm3LJpdfujGzWldXaHU5l5/+V8eyz3NnKBUCmZMS7lxBDyc9sNkN9bA9zSkYL74oqOCqayRXmCRyYflsqwxMMYgO5p3jGG67/LjlLVM1jJRW8osTS7XyeXQyT30Ly0YIFcwyBc0At/A18WkR1Ncw/MFg0wugOeHVnEBRlm5CwC88oaVEET25r/3fuaVzXkjREAMiOH+Xj2nvP+Qn/34y19amkzqzs7ElElPW4G8Z+D5Br5v4QdTy8A5WU6CVKrNMDP97nd/eKinZ9tmIiITBKyNNlprWVld/elkMmk7OjqmNL7GVAv9fdtjuVwW+XwOmUwGhWwuDHyYAGM67s7Oztz23t60MaHFP51No6KqKvL2t799OjMjkUhM6Tni8TgDkDNmzpyjtQERiUAb1NXV3YspELXjOMjn88jn8/A9D57nw+xG+kylUoaZxb1339u5adPm55QUwit4li1jeGSUHeFc9q8WfB1LCbu7zV06na73gwBeoUBjzz5Fue11xtUgCKVnY83UFkcN+L4P3/cR+AG0GXfebgj+X4mu3EEZvh+Ss1egXC6HXDZbgbBQMPZU/z8BQaeK21iDfCGUPANPC2ZGT0/hCABNRU8rsbsOYn41/8LrVtn2ML/zmnWZ4wu+BhELPeY+8+oZ3NUO2d2HzMatmdui5COX941vIti8ejUP927nwBAKnodHnuz/JQDT3prcEUtfJIQtZVH5lDYG1ho21rAxQcVtqeX7h1Lb7hcpY4CCZ+Fpg0AbsmwxPOpVAeDiOzD+xW2i1kAur1Hwi8llLI9JpFOCMRZewDvCiKWwKC+62DafAXPFlcervz6VWfP0msxXKqJC6KBgSEZl79qVemH98GVXffP7i084IamnKj0IAFozrA1LWhEJOGpKp/I4BTFNsLWVALJbenquj0SjpLW1RCQ3btxote9/7Ktf/dahRKQTicSUjS79vf0NVmt4BS/0aPAm9YCwHR0dcuvWrZsCv/AsEcEEhj3P12VlsfIjjjjiLcXnF1Mhsvb2drz79HcvqK2tXTw4NMAMyNGREfv444+vHy/xTrxdBzwvfHYd+LDWgiZJhdHe3i4ABBte2XC1tSC2bIlIDg0NWinl4ffee+9ZRGRWrFjhvBFyLhLZLsXhMf2utVZqrREEATwv1OVPcMrEY604rpgZ1hpYPdVUSUUXvzB9WLids3s2Td/gDsMxxoSLihcuEAWvEKuqqor+21QcqR1LAaNQ1A9bawlg5LPmKADVPIVOJMJE+RdIhgnzSVueVvACaGbyi3VHx2cF7Cq6pq16Ifu9ngEvHwSB8LRlX0vK5ZjLXCuf3zC86brO9J+YmZLLX9X1pFIQAAJjqd/3DQJtwMaYCIwisosBYFHvRCtaKEUZbREEFtYwAm0RBGaifMf/AkFreIEprvIWkizUVAh6zEhoLXRgQ52eNZAScMqdcVLBcsOcEJf/YcuPVq8d2VReBpnN+xjNWAo2PhY7eNbodcxx2QpMyR3IERZkDciGPwVsscb71Cb3RG5tRQnGMDP98Y9/vH7zlq0DsViZ9H2fg8Dn9evWlx966IE/nTdvXuSqq5K6mFdh8h1GNl9nLUNbDa0D+F6AINi9XXSsXuHmLVtWGmvZMrMgQflcFvP2mXcBEXE8Hp+0vRYvXqySyaRtPan1PNdRanhoyFdSUTabfSKVSq2eLHVlKEHHwkyKgYblonplkl5KJpOamcUvfv2L1IaNGx+sqKhQQeAbJaXYsH6DCbzgVx/96MdPOfzww4OOjg4XU5Ps6LnnnnOTyaS95pprLriq/arvA2GSq12oPYQOgqguhmmPCQ97KkErIVAMywv9oLXGlJT3ShWfJFSzB1rD1wFPdYwWEzTZPVGnFSV0CSJobaCtgdYBjDaqrKzMfSPcsHs3O8vQ1hYNGgyyFo7gWEWFKz9/15dV93UpsWhR447WakUr0Aq0tnYzUdJc8MULKo9szn7zos/t+2khkq/ZmYx9jTlW+75FzDIZY/sBjBTblMeMSdwBSW3ey8cfgd821tiLsllrIg5JIrKuMmrV8yMpAOmudtqlRX5o1FdlrgNtGMQMRQYL51b76OqfgpEwTKvpBwyrGZ7HUI4q3qP932JkUaooIRhbTDNqIazZg1WWwRxK3hBhSSVnZ8NRW1IQIbty9ciFe01374FhbeCo3i1b9azaJ47/9c8P++zSjyW/19mZUMWcGrvY9iD0g44KSGFhmKGNgdEGmpkSiSVq/fq9VSLR+rrTikMDtDSpk8kkfvyD836Xz8ivfPGKX23YibA5lWqT27Zt63vqqac+e9JJJ/4ODAOG7OvdbiKxyJHXXnvN3cnkVR9cunTpdiEEli1bpq677jru6OjYUdk6kUjQ+vXrVWdnJ+655x45ZpSzxWLHdpJJ3t3dzQDwzJrnbpy995xPV5SXA8yir6/fzl+w4IT77rvvffvvv//tzCy7urrouuuuYyAMH+/u7qZ4PI54PE5E5P/kJz/Zb/asWR/rXr3aMrNUjqKNmzb9DIDt6urarRfJmIqDOfQ5D9NtTm3QtbW1ERHZRx55+OLa0097OhKJke97MMYT6za8Unb8cW+5c/bcGe9qa2u7t6jSUV1dXeju7uaOjg7b3t5OY+/S2NhIJ5xwgt5///39T37yk2ccsP8Bv1zz/JoLxi9mrxM8TCC9QqGYdpSLgteeSdAQaofO2VqGsWa36qnxRsJiDgwYY9kv+IC1I4lEQrW3t9NYQqmddOcAgLFittf95LpfP/X0sz8H8MjuanWORyQSUcVqKWGtunEG3X87QSvBJGF3RPEYzdAm2JTJ+APJXUziJJbvSLDwmc9feNSpB2+94flVGwzRrbXMPFhsaB6np+fKCMELLLS1AMnNAAbtTvUC21KhXvtTGwo/OaYMF0oiYazgypiUvcNebvmjmZ8SAUsnCATJ+YatCbPLMRuwYcxoqgl7r3UJsHzi7G2CBDEDgQGCgJH3eSpumHsMtgaGCIJ4vIAwyQLAxX6ykKKYddASrDbAThJiWwqmoyMu29pS986bU97xlsWVbZt7fROJlavtLz6jG+bVffXjn/nM3SeckHxhIq+O1uK+IuoIEWZmI/gBI+9beJ71ksnlGliud7kXKY6LpR+4evYX3rH1WtdsOPgzX39iIAwoeq003daWMsVaejctnD+/Ye4++/xgoL/fxGJR6tm82Uiiky655JInN2/efPnFF1/8+6VLl/pFS/x4CZIBFG688UZcfvnlL4fRbAQh5Wsm7+70uMVnWHnI/of88uijj/rI4MBg4LiO2rBund13v/1+f+utqS8S0bW7M9T99Kc/b507Z68/vPzKy3VBEAQNjY1qNJ1+9pZbbvl9cWHSUyAbIhHOwmKFkLFgDZriO6xadMCiDx960KG/0Towvm8ol8tyLpNx5s+d9+ff/ObGn1133a++s3Tp0s3jvBp2DLCxd2lsbKz4ybXXfoSU/M723u24//7O3XrrW8Mc+B58vwBR9C4wxuzR7pNYkLUWpqhDDhfaySdgNBomuDJGI9ABAu0jm83SN77xDb2bOpQAgE9/+tOLTjrppK9pbY49+eSGj/7iFz97XaWTiVBbWxsLCTp8RiEkhGXsafWdSQmaCHCE1pJUWDTTWhiU4/iTjpYHnzrr3fsfNLfXyw0IRWyVYhLs8FMrXjouqsScptqKcjP80il60xY89njvNxG6oe1s8qJ58+a5jhiSeQMUfGB0lNPhutP+mirWqRQMmOknRM8dPG/6Q801dOxgmvy6CrjLnxz+x1OjeIkZguj1BM0MSsRNqAbQBGtDnXJdnTKJREK0omvCfElEgFTQlkNSDoxAPq/x1IrtbwXw67CmYvJf5WaKRgAam3xFvbcdn71/9xoOjkhmjE1cEHJ5jUHPf91EWN2WYmamI+roC/NnOm9vqpWx4QxzPiCKbH06unTf43/1M8bx8fgiuWgReFeRj4kEhLOWCsZYGCugDVM+T2jYa/68VOqd74rFhATKjYSBDQISjuB1L26aOTycX7pwTpPi/PolswrP13S/sunX3X19mYkkyLa2NpNIJFQymfzh165uD+rqG3+czebgEumenm1mNJNt2WvmzF/ffPPNn+/v70398/HHnvbIe/SOm+4YnT17Nvbff/+FCxYsmHvI4YcvcIV816bNGxlEki0HINKO40w6y9va2jiRSIif//znlzTPaD5679l7L+7v7QuISK1atcqdP3/BNbfffvs5mZHMrU8++cQr3S+80Of7/khzU9Pc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";
const MAX_TRANSACTION = 1000000;
const INITIAL_FLOAT = 500000;
const AGENT_COMMISSION_RATE = 0.35;
const DEMO_PIN = "1234";
const PAST_DAYS = [
  { day: "Lun", volume: 420000 },
  { day: "Mar", volume: 380000 },
  { day: "Mer", volume: 510000 },
  { day: "Jeu", volume: 460000 },
  { day: "Ven", volume: 610000 },
  { day: "Sam", volume: 705000 },
];

const FAQ_ITEMS = [
  {
    q: "Comment envoyer une transaction ?",
    a: "Connecte-toi, choisis le réseau, entre le numéro et le montant, puis confirme. Un ticket est généré automatiquement.",
  },
  {
    q: "Que faire si une transaction échoue ?",
    a: "En production, chaque échec afficherait un motif précis (solde insuffisant, réseau indisponible…) et proposerait une nouvelle tentative sans double débit.",
  },
  {
    q: "Comment sont calculés les frais ?",
    a: "Chaque réseau a un pourcentage de frais affiché avant confirmation — visible dans le récapitulatif du ticket.",
  },
  {
    q: "Mes données sont-elles en sécurité ?",
    a: "Cette maquette ne stocke aucune donnée réelle. En production, l'authentification et le chiffrement seraient conformes aux standards du secteur.",
  },
];

function formatFCFA(n) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";
}

function TicketNumber({ n }) {
  return (
    <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      #{String(n).padStart(5, "0")}
    </span>
  );
}

const NETWORK_ICONS = {
  mtn: Smartphone,
  orange: Smartphone,
  moov: Smartphone,
  wave: Smartphone,
  djamo: Smartphone,
  crypto: Coins,
  cie: Zap,
  sodeci: Droplet,
  peage: Car,
};

function shadeColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(Math.min((num >> 16) + amt, 255), 0);
  const G = Math.max(Math.min(((num >> 8) & 0x00ff) + amt, 255), 0);
  const B = Math.max(Math.min((num & 0x0000ff) + amt, 255), 0);
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function NetworkBadge({ net, size = 40, colors = DARK_COLORS }) {
  const Icon = NETWORK_ICONS[net.id] || Smartphone;
  const chipSize = Math.max(Math.round(size * 0.4), 15);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.28,
          background: `linear-gradient(135deg, ${shadeColor(net.color, 15)} 0%, ${shadeColor(net.color, -12)} 100%)`,
          color: net.fg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: size * 0.3,
          fontFamily: "'Space Grotesk', sans-serif",
          boxShadow: `0 ${Math.max(size * 0.1, 2)}px ${size * 0.35}px -${size * 0.15}px ${net.color}99`,
        }}
      >
        {net.letter}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: -chipSize * 0.22,
          right: -chipSize * 0.22,
          width: chipSize,
          height: chipSize,
          borderRadius: "9999px",
          background: colors.bg,
          border: `2px solid ${colors.surface}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={chipSize * 0.58} style={{ color: colors.goldSoft }} />
      </div>
    </div>
  );
}

export default function GuichetApp() {
  const [theme, setTheme] = useState("light");
  const COLORS = theme === "light" ? LIGHT_COLORS : DARK_COLORS;
  const [introStep, setIntroStep] = useState(0); // 0 = splash logo, 1-3 = carousel, 4 = done
  useEffect(() => {
    if (introStep !== 0) return;
    const t = setTimeout(() => setIntroStep(1), 2400);
    return () => clearTimeout(t);
  }, [introStep]);
  const [tab, setTab] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0].id);
  const [txDirection, setTxDirection] = useState("depot"); // "depot" (envoi) ou "retrait" (réception)
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [txCountryCode, setTxCountryCode] = useState("+225");
  const [ticketCounter, setTicketCounter] = useState(4);
  const [history, setHistory] = useState([]);
  const [pending, setPending] = useState(null);
  const [lastReceipt, setLastReceipt] = useState(null);
  const [formError, setFormError] = useState("");
  // --- Gestion hors-ligne : statut de connexion + file d'attente locale des
  // transactions non encore synchronisées avec Supabase ---
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [offlineQueue, setOfflineQueue] = useState(() => {
    try {
      const raw = localStorage.getItem("eg_offline_queue");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [syncingOffline, setSyncingOffline] = useState(false);
  const demoRef = useRef(null);
  const annonceursRef = useRef(null);
  const annoncesScrollRef = useRef(null);
  const publicitesScrollRef = useRef(null);

  // Connexion à une vraie base de données (Supabase)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [agent, setAgent] = useState(null);
  const [forcedPinInput, setForcedPinInput] = useState("");
  const [forcedPinConfirmInput, setForcedPinConfirmInput] = useState("");
  const [forcedPinError, setForcedPinError] = useState("");
  const [forcedPinLoading, setForcedPinLoading] = useState(false);
  const [loginPhone, setLoginPhone] = useState("");
  const [loginCountryCode, setLoginCountryCode] = useState("+225");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupCountryCode, setSignupCountryCode] = useState("+225");
  const [signupAgency, setSignupAgency] = useState("");
  const [signupAgencyCode, setSignupAgencyCode] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPin, setSignupPin] = useState("");
  const [signupRole, setSignupRole] = useState("agent");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [signupCooldown, setSignupCooldown] = useState(0);
  const [signupUserId, setSignupUserId] = useState(null);
  const [signupEmailCodeStep, setSignupEmailCodeStep] = useState(1);
  const [signupEmailCode, setSignupEmailCode] = useState("");
  const [signupEmailCodeInput, setSignupEmailCodeInput] = useState("");
  const [signupEmailCodeError, setSignupEmailCodeError] = useState("");

  // ===== Abonnement & paiements =====
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [myPayments, setMyPayments] = useState([]);
  const [paymentRefInput, setPaymentRefInput] = useState("");
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentSubmitMsg, setPaymentSubmitMsg] = useState("");
  const [historyRefInput, setHistoryRefInput] = useState("");
  const [historySubmitting, setHistorySubmitting] = useState(false);
  const [historySubmitMsg, setHistorySubmitMsg] = useState("");
  const [myReferralCommissions, setMyReferralCommissions] = useState([]);

  // ===== Backoffice abonnements (propriétaire de la plateforme) =====
  const [pendingSubPayments, setPendingSubPayments] = useState([]);
  const [pendingSubPaymentsLoading, setPendingSubPaymentsLoading] = useState(false);

  // ===== Discussion entre agents =====
  const [agentChatMessages, setAgentChatMessages] = useState([]);
  const [discussionOpen, setDiscussionOpen] = useState(false);
  const [chatShowRealName, setChatShowRealName] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(null); // null = discussion générale
  const [chatTeamList, setChatTeamList] = useState([]); // chef d'agence : ses agents
  const [chatMyManager, setChatMyManager] = useState(null); // agent simple : son chef
  const [agentChatInput, setAgentChatInput] = useState("");
  const [agentChatLoading, setAgentChatLoading] = useState(false);
  const agentChatEndRef = useRef(null);

  // Capture le parrain depuis le lien de parrainage (?parrain=...) dès l'ouverture du site
  const [referredByPhone, setReferredByPhone] = useState("");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const parrain = params.get("parrain");
    if (parrain) setReferredByPhone(decodeURIComponent(parrain));
  }, []);

  useEffect(() => {
    if (signupCooldown <= 0) return;
    const t = setTimeout(() => setSignupCooldown((s) => Math.max(s - 1, 0)), 1000);
    return () => clearTimeout(t);
  }, [signupCooldown]);
  const [newAgencyCode, setNewAgencyCode] = useState("");
  const [agencyCodeCopied, setAgencyCodeCopied] = useState(false);

  function generateAgencyCode(name) {
    const base = (name || "AG").replace(/[^A-Za-z]/g, "").toUpperCase().slice(0, 3) || "AGC";
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `${base}-${rand}`;
  }

  // Un hash bcrypt commence toujours par $2a$, $2b$ ou $2y$. Si pin_hash ne
  // correspond pas à ce format, c'est un ancien PIN stocké en clair (avant la
  // mise en place du hashage) : l'agent devra en recréer un nouveau.
  function isBcryptHash(value) {
    return typeof value === "string" && /^\$2[aby]\$/.test(value);
  }

  async function fetchAgentProfile(userId) {
    const { data, error } = await supabase.from("agents").select("*").eq("id", userId).single();
    if (error || !data) return null;
    return {
      id: data.id,
      name: data.full_name,
      phone: data.phone,
      email: data.email,
      agency: data.agency_name,
      agencyId: data.agency_id,
      pinHash: data.pin_hash,
      pinNeedsReset: !!data.pin_hash && !isBcryptHash(data.pin_hash),
      role: data.role,
      kycEmailVerified: data.kyc_email_verified,
      kycStatus: data.kyc_status || "incomplete",
      firstName: data.first_name,
      lastName: data.last_name,
      country: data.country,
      address: data.address,
      idNumber: data.id_number,
      dob: data.date_of_birth,
      documentType: data.document_type,
      kycRejectedReason: data.kyc_rejected_reason,
      isPlatformOwner: data.is_platform_owner || false,
      agencyCode: null,
    };
  }

  async function fetchAgencyCode(agencyId) {
    if (!agencyId) return null;
    const { data, error } = await supabase.from("agencies").select("code").eq("id", agencyId).single();
    if (error || !data) return null;
    return data.code;
  }

  // ===== Abonnement =====
  // Période de 2 mois pour l'historique payant : Jan-Fév, Mar-Avr, Mai-Juin, Juil-Août, Sep-Oct, Nov-Déc
  function bimonthStart(d = new Date()) {
    const bucketMonth = Math.floor(d.getMonth() / 2) * 2;
    return new Date(d.getFullYear(), bucketMonth, 1).toISOString().slice(0, 10);
  }

  async function fetchSubscription(agentId) {
    setSubscriptionLoading(true);
    const { data, error } = await supabase.from("subscriptions").select("*").eq("agent_id", agentId).maybeSingle();
    setSubscriptionLoading(false);
    if (error || !data) return null;
    return data;
  }

  async function createPendingSubscription(agentId, role) {
    const plan = role === "manager" ? "manager" : "agent";
    const { data, error } = await supabase
      .from("subscriptions")
      .insert({
        agent_id: agentId,
        plan,
        monthly_amount: SUBSCRIPTION_PRICING[plan],
        status: "pending_payment",
      })
      .select()
      .single();
    if (error) {
      // On loggue l'erreur au lieu de l'avaler silencieusement : sans ça,
      // un agent reste bloqué sur "0 FCFA" pour toujours sans qu'on sache
      // pourquoi la création de son abonnement a échoué (souvent une
      // politique RLS ou un id agent qui ne correspond pas à auth.uid()).
      console.error("Échec de création de l'abonnement :", error.message);
      return null;
    }
    setSubscription(data);
    return data;
  }

  async function loadMyPayments() {
    if (!agent) return;
    const { data, error } = await supabase
      .from("subscription_payments")
      .select("*")
      .eq("agent_id", agent.id)
      .order("created_at", { ascending: false });
    if (!error && data) setMyPayments(data);
  }

  async function loadMyReferralCommissions() {
    if (!agent) return;
    const { data, error } = await supabase
      .from("referral_commissions")
      .select("*")
      .eq("referrer_agent_id", agent.id)
      .order("created_at", { ascending: false });
    if (!error && data) setMyReferralCommissions(data);
  }

  // Statuts dérivés de l'abonnement (pas d'essai gratuit : accès uniquement si abonnement actif)
  const isSubscriptionActive =
    subscription?.status === "active" &&
    subscription?.current_period_end &&
    new Date(subscription.current_period_end).getTime() > Date.now();
  // Le propriétaire de la plateforme n'est jamais bloqué
  const hasFullAccess = !!agent?.isPlatformOwner || isSubscriptionActive;

  const currentBimonthKey = bimonthStart();
  const historyUnlockedThisPeriod =
    !!agent?.isPlatformOwner ||
    myPayments.some((p) => p.type === "historique" && p.period_month === currentBimonthKey && p.status === "validated");

  async function handleDeclarePayment(type) {
    if (!agent || !subscription) return;
    const isHistory = type === "historique";
    const refValue = isHistory ? historyRefInput : paymentRefInput;
    if (!refValue.trim()) {
      const msg = "Indique la référence de ton paiement mobile money avant d'envoyer.";
      isHistory ? setHistorySubmitMsg(msg) : setPaymentSubmitMsg(msg);
      return;
    }
    isHistory ? setHistorySubmitting(true) : setPaymentSubmitting(true);
    const amount = isHistory ? HISTORY_UNLOCK_PRICE : subscription.monthly_amount;
    const { error } = await supabase.from("subscription_payments").insert({
      agent_id: agent.id,
      type,
      amount,
      period_month: currentBimonthKey,
      payment_reference: refValue.trim(),
      status: "pending",
    });
    isHistory ? setHistorySubmitting(false) : setPaymentSubmitting(false);
    if (error) {
      const msg = "Erreur : " + error.message;
      isHistory ? setHistorySubmitMsg(msg) : setPaymentSubmitMsg(msg);
      return;
    }
    isHistory ? setHistoryRefInput("") : setPaymentRefInput("");
    const okMsg = "Déclaration envoyée ✔ En attente de validation par l'équipe EmpireGuichet.";
    isHistory ? setHistorySubmitMsg(okMsg) : setPaymentSubmitMsg(okMsg);
    loadMyPayments();
  }

  // ===== Backoffice abonnements (propriétaire) =====
  async function loadPendingSubPayments() {
    setPendingSubPaymentsLoading(true);
    const { data, error } = await supabase
      .from("subscription_payments")
      .select("*, agents:agent_id(full_name, phone, role)")
      .eq("status", "pending")
      .order("created_at", { ascending: true });
    setPendingSubPaymentsLoading(false);
    if (!error && data) setPendingSubPayments(data);
  }

  async function validateSubPayment(payment, approve) {
    if (approve) {
      const { error } = await supabase
        .from("subscription_payments")
        .update({ status: "validated", validated_at: new Date().toISOString() })
        .eq("id", payment.id);
      if (error) return;
      if (payment.type === "abonnement") {
        const periodEnd = new Date();
        periodEnd.setMonth(periodEnd.getMonth() + SUBSCRIPTION_PERIOD_MONTHS);
        await supabase
          .from("subscriptions")
          .update({ status: "active", current_period_end: periodEnd.toISOString(), updated_at: new Date().toISOString() })
          .eq("agent_id", payment.agent_id);
      }
    } else {
      await supabase.from("subscription_payments").update({ status: "rejected" }).eq("id", payment.id);
    }
    loadPendingSubPayments();
  }

  // ===== Discussion entre agents (chat) =====
  // Nom affiché : pseudonyme stable par défaut, vrai nom seulement si l'agent
  // a activé "chatShowRealName".
  function chatDisplayName() {
    if (!agent) return "Agent";
    if (chatShowRealName) return agent.name;
    return "Agent #" + String(agent.id || "").replace(/-/g, "").slice(-4).toUpperCase();
  }

  async function loadChatPrefs() {
    if (!agent) return;
    const { data } = await supabase.from("agents").select("chat_show_real_name").eq("id", agent.id).maybeSingle();
    if (data) setChatShowRealName(!!data.chat_show_real_name);
    if (agent.role === "manager") {
      const { data: team } = await supabase.rpc("get_team_members");
      if (team) setChatTeamList(team);
    } else {
      const { data: mgr } = await supabase.rpc("get_my_manager");
      if (mgr && mgr.length > 0) setChatMyManager(mgr[0]);
    }
  }

  async function toggleChatShowRealName() {
    const next = !chatShowRealName;
    setChatShowRealName(next);
    if (agent) await supabase.from("agents").update({ chat_show_real_name: next }).eq("id", agent.id);
  }

  async function loadChatMessages() {
    setAgentChatLoading(true);
    let query = supabase.from("chat_messages").select("*").order("created_at", { ascending: true }).limit(100);
    if (chatRecipient) {
      query = query.or(
        `and(agent_id.eq.${agent.id},recipient_id.eq.${chatRecipient.id}),and(agent_id.eq.${chatRecipient.id},recipient_id.eq.${agent.id})`
      );
    } else {
      query = query.is("recipient_id", null);
    }
    const { data, error } = await query;
    setAgentChatLoading(false);
    if (!error && data) setAgentChatMessages(data);
  }

  async function handleSendChatMessage() {
    if (!agent || !agentChatInput.trim()) return;
    const content = agentChatInput.trim();
    setAgentChatInput("");
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        agent_id: agent.id,
        agent_name: chatDisplayName(),
        agent_role: agent.role,
        content,
        recipient_id: chatRecipient ? chatRecipient.id : null,
      })
      .select()
      .single();
    if (error) {
      console.error("Échec d'envoi du message :", error.message);
      setAgentChatInput(content); // on remet le texte pour ne pas le perdre
      return;
    }
    // Affichage immédiat : on n'attend pas l'événement temps réel, qui peut
    // être indisponible ou en retard côté Supabase.
    setAgentChatMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, data]));
  }

  useEffect(() => {
    if (discussionOpen && agent) {
      loadChatPrefs();
      loadChatMessages();
      const channel = supabase
        .channel("chat-messages")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (payload) => {
          const m = payload.new;
          // On ne garde que les messages qui appartiennent à la conversation
          // actuellement ouverte (générale, ou privée avec la bonne personne).
          const belongsHere = chatRecipient
            ? (m.agent_id === agent.id && m.recipient_id === chatRecipient.id) ||
              (m.agent_id === chatRecipient.id && m.recipient_id === agent.id)
            : m.recipient_id === null;
          if (!belongsHere) return;
          setAgentChatMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
        })
        .subscribe();
      return () => supabase.removeChannel(channel);
    }
  }, [discussionOpen, agent?.id, chatRecipient?.id]);

  useEffect(() => {
    if (agentChatEndRef.current) agentChatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [agentChatMessages]);

  useEffect(() => {
    if (tab === "abonnement" && agent) loadMyPayments();
    if (tab === "parrainage" && agent) loadMyReferralCommissions();
    if (tab === "backoffice-abonnements" && agent?.isPlatformOwner) loadPendingSubPayments();
  }, [tab, agent?.id]);

  // ===== Équipe réelle (chef d'agence) et filleuls réels (parrainage) =====
  const [realTeam, setRealTeam] = useState([]);
  const [realTeamLoading, setRealTeamLoading] = useState(false);
  const [realReferrals, setRealReferrals] = useState([]);
  const [realReferralsLoading, setRealReferralsLoading] = useState(false);

  async function loadRealTeam() {
    setRealTeamLoading(true);
    const { data, error } = await supabase.rpc("get_team_members");
    setRealTeamLoading(false);
    if (!error && data) setRealTeam(data);
  }

  async function loadRealReferrals() {
    setRealReferralsLoading(true);
    const { data, error } = await supabase.rpc("get_my_referrals");
    setRealReferralsLoading(false);
    if (!error && data) setRealReferrals(data);
  }

  useEffect(() => {
    if (tab === "equipe" && agent?.role === "manager") loadRealTeam();
    if (tab === "parrainage" && agent) loadRealReferrals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // Transactions de l'équipe (chef d'agence) — chargées puis mises à jour en temps réel
  const [teamTransactions, setTeamTransactions] = useState([]);

  async function loadTeamTransactions() {
    if (!agent?.agencyId) return;
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("agency_id", agent.agencyId)
      .order("created_at", { ascending: false })
      .limit(500);
    if (!error && data) setTeamTransactions(data);
  }

  useEffect(() => {
    if (agent?.role !== "manager" || !agent?.agencyId) return;
    loadTeamTransactions();
    // Abonnement temps réel : toute nouvelle transaction d'un agent de l'agence
    // apparaît instantanément, sans avoir à recharger la page.
    const channel = supabase
      .channel(`team-tx-${agent.agencyId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "transactions", filter: `agency_id=eq.${agent.agencyId}` },
        (payload) => {
          setTeamTransactions((list) => [payload.new, ...list]);
          pushNotification(`Nouvelle transaction d'un agent de ton équipe (${formatFCFA(payload.new.amount)})`);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent?.role, agent?.agencyId]);

  // Mot de passe oublié
  const [recoveryStep, setRecoveryStep] = useState(1);
  const [recoveryPhone, setRecoveryPhone] = useState("");
  const [recoveryCountryCode, setRecoveryCountryCode] = useState("+225");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [recoveryNewPassword, setRecoveryNewPassword] = useState("");
  const [recoveryConfirmPassword, setRecoveryConfirmPassword] = useState("");
  const [recoveryError, setRecoveryError] = useState("");
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  function maskEmail(email) {
    const [user, domain] = email.split("@");
    if (!domain) return email;
    const visible = user.slice(0, 2);
    return `${visible}${"*".repeat(Math.max(user.length - 2, 2))}@${domain}`;
  }

  async function handleRecoveryRequestCode(e) {
    e.preventDefault();
    if (!recoveryPhone || !recoveryEmail) {
      setRecoveryError("Renseigne ton numéro et ton adresse Gmail.");
      return;
    }
    if (!recoveryEmail.toLowerCase().endsWith("@gmail.com")) {
      setRecoveryError("Utilise l'adresse Gmail associée à ton compte.");
      return;
    }
    setRecoveryError("");
    setRecoveryLoading(true);
    const fullPhone = `${recoveryCountryCode} ${recoveryPhone}`.trim();
    const { data, error } = await supabase
      .from("agents")
      .select("email")
      .eq("phone", fullPhone)
      .maybeSingle();
    if (error || !data) {
      setRecoveryLoading(false);
      setRecoveryError("Aucun compte trouvé avec ce numéro de téléphone.");
      return;
    }
    if ((data.email || "").trim().toLowerCase() !== recoveryEmail.trim().toLowerCase()) {
      setRecoveryLoading(false);
      setRecoveryError("Cette adresse Gmail ne correspond pas à celle enregistrée pour ce numéro.");
      return;
    }
    // Déclenche le VRAI envoi d'un code de récupération via Supabase Auth (Brevo derrière).
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(recoveryEmail);
    setRecoveryLoading(false);
    if (resetErr) {
      const waitMatch = resetErr.message.match(/after (\d+) seconds?/i);
      setRecoveryError(
        waitMatch
          ? `Merci de patienter ${waitMatch[1]} secondes avant de redemander un code.`
          : "Erreur lors de l'envoi du code : " + resetErr.message
      );
      return;
    }
    setRecoveryStep(2);
  }

  async function handleRecoveryVerifyCode(e) {
    e.preventDefault();
    setRecoveryError("");
    setRecoveryLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email: recoveryEmail,
      token: recoveryCode,
      type: "recovery",
    });
    setRecoveryLoading(false);
    if (error) {
      setRecoveryError("Code incorrect ou expiré. Réessaie.");
      return;
    }
    setRecoveryStep(3);
  }

  async function handleRecoveryReset(e) {
    e.preventDefault();
    if (recoveryNewPassword.length < 6) {
      setRecoveryError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (recoveryNewPassword !== recoveryConfirmPassword) {
      setRecoveryError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setRecoveryError("");
    setRecoveryLoading(true);
    // La vérification du code (étape précédente) a ouvert une session temporaire
    // de récupération : on peut donc mettre à jour le mot de passe directement.
    const { error } = await supabase.auth.updateUser({ password: recoveryNewPassword });
    // On referme cette session temporaire — l'agent devra se reconnecter normalement
    // avec son nouveau mot de passe, comme n'importe quelle connexion.
    await supabase.auth.signOut();
    setRecoveryLoading(false);
    if (error) {
      setRecoveryError("Erreur lors de la mise à jour du mot de passe : " + error.message);
      return;
    }
    setRecoveryError("");
    setRecoveryStep(4);
  }

  function backToLoginFromRecovery() {
    setAuthMode("login");
    setRecoveryStep(1);
    setRecoveryPhone("");
    setRecoveryEmail("");
    setRecoveryCode("");
    setRecoveryNewPassword("");
    setRecoveryConfirmPassword("");
    setRecoveryError("");
  }

  // Vérification KYC (obligatoire avant transaction)
  const DEMO_KYC_CODE = "147852";
  const [kycEmailCode, setKycEmailCode] = useState("");
  const [kycEmailSent, setKycEmailSent] = useState(false);
  const [kycEmailError, setKycEmailError] = useState("");

  // Étape "Compléter votre profil"
  const [kycFirstName, setKycFirstName] = useState("");
  const [kycLastName, setKycLastName] = useState("");
  const [kycCountry, setKycCountry] = useState("Côte d'Ivoire");
  const [kycAddress, setKycAddress] = useState("");
  const [kycIdNumber, setKycIdNumber] = useState("");
  const [kycDob, setKycDob] = useState("");
  const [kycProfileError, setKycProfileError] = useState("");

  // Étape "Vérification d'identité"
  const [kycDocType, setKycDocType] = useState("cni");
  const [kycIdRectoName, setKycIdRectoName] = useState("");
  const [kycIdRectoPreview, setKycIdRectoPreview] = useState("");
  const [kycIdRectoFile, setKycIdRectoFile] = useState(null);
  const [kycIdVersoName, setKycIdVersoName] = useState("");
  const [kycIdVersoPreview, setKycIdVersoPreview] = useState("");
  const [kycIdVersoFile, setKycIdVersoFile] = useState(null);
  const [kycSelfieName, setKycSelfieName] = useState("");
  const [kycSelfiePreview, setKycSelfiePreview] = useState("");
  const [kycSelfieFile, setKycSelfieFile] = useState(null);
  const [kycSelfieIdName, setKycSelfieIdName] = useState("");
  const [kycSelfieIdPreview, setKycSelfieIdPreview] = useState("");
  const [kycSelfieIdFile, setKycSelfieIdFile] = useState(null);
  const [kycIdError, setKycIdError] = useState("");
  const [kycUploading, setKycUploading] = useState(false);

  const kycProfileDone = !!(agent?.firstName && agent?.lastName && agent?.country && agent?.address && agent?.idNumber && agent?.dob);
  const kycStatus = agent?.kycStatus || "incomplete"; // incomplete | pending | validated
  const kycVerified = !!(agent?.kycEmailVerified && kycStatus === "validated");

  function handleKycSendCode(e) {
    e.preventDefault();
    setKycEmailSent(true);
    setKycEmailError("");
  }

  async function handleKycVerifyEmail(e) {
    e.preventDefault();
    if (kycEmailCode !== DEMO_KYC_CODE) {
      setKycEmailError("Code incorrect. Réessaie.");
      return;
    }
    setKycEmailError("");
    await supabase.from("agents").update({ kyc_email_verified: true }).eq("id", agent.id);
    setAgent((a) => ({ ...a, kycEmailVerified: true }));
    pushNotification("Adresse Gmail vérifiée ✅");
  }

  async function handleKycSaveProfile(e) {
    e.preventDefault();
    if (!kycFirstName || !kycLastName || !kycCountry || !kycAddress || !kycIdNumber || !kycDob) {
      setKycProfileError("Merci de remplir tous les champs.");
      return;
    }
    setKycProfileError("");
    const { error } = await supabase
      .from("agents")
      .update({
        first_name: kycFirstName,
        last_name: kycLastName,
        country: kycCountry,
        address: kycAddress,
        id_number: kycIdNumber,
        date_of_birth: kycDob,
      })
      .eq("id", agent.id);
    if (error) {
      setKycProfileError("Erreur : " + error.message);
      return;
    }
    setAgent((a) => ({
      ...a,
      firstName: kycFirstName,
      lastName: kycLastName,
      country: kycCountry,
      address: kycAddress,
      idNumber: kycIdNumber,
      dob: kycDob,
    }));
    pushNotification("Profil complété ✅");
  }

  function handleKycFileUpload(kind, e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : "";
    if (kind === "recto") { setKycIdRectoName(file.name); setKycIdRectoPreview(preview); setKycIdRectoFile(file); }
    if (kind === "verso") { setKycIdVersoName(file.name); setKycIdVersoPreview(preview); setKycIdVersoFile(file); }
    if (kind === "selfie") { setKycSelfieName(file.name); setKycSelfiePreview(preview); setKycSelfieFile(file); }
    if (kind === "selfieId") { setKycSelfieIdName(file.name); setKycSelfieIdPreview(preview); setKycSelfieIdFile(file); }
    setKycIdError("");
  }

  async function uploadKycFile(file, label) {
    const ext = file.name.split(".").pop();
    const path = `${agent.id}/${label}.${ext}`;
    const { error } = await supabase.storage.from("kyc-documents").upload(path, file, { upsert: true });
    if (error) throw error;
    return path;
  }

  async function handleKycSubmitDocuments() {
    const needsVerso = kycDocType !== "passeport";
    if (!kycIdRectoFile || (needsVerso && !kycIdVersoFile) || !kycSelfieFile || !kycSelfieIdFile) {
      setKycIdError("Ajoute tous les documents demandés avant d'envoyer.");
      return;
    }
    setKycIdError("");
    setKycUploading(true);
    try {
      const rectoPath = await uploadKycFile(kycIdRectoFile, "recto");
      const versoPath = needsVerso ? await uploadKycFile(kycIdVersoFile, "verso") : null;
      const selfiePath = await uploadKycFile(kycSelfieFile, "selfie");
      const selfieIdPath = await uploadKycFile(kycSelfieIdFile, "selfie-id");

      // Seul le propriétaire de la plateforme n'a personne au-dessus de lui pour le valider.
      const isPlatformOwner = agent.isPlatformOwner;
      const newStatus = isPlatformOwner ? "validated" : "pending";

      await supabase
        .from("agents")
        .update({
          document_type: kycDocType,
          kyc_status: newStatus,
          kyc_recto_path: rectoPath,
          kyc_verso_path: versoPath,
          kyc_selfie_path: selfiePath,
          kyc_selfie_id_path: selfieIdPath,
        })
        .eq("id", agent.id);

      setAgent((a) => ({ ...a, kycStatus: newStatus }));
      pushNotification(
        isPlatformOwner
          ? "Identité vérifiée — ton compte est validé ✅"
          : agent.role === "manager"
          ? "Documents envoyés — en attente de vérification par le propriétaire de la plateforme ⏳"
          : "Documents envoyés — en attente de vérification par ton chef d'agence ⏳"
      );
    } catch (err) {
      setKycIdError("Erreur lors de l'envoi : " + err.message);
    } finally {
      setKycUploading(false);
    }
  }

  // Vérification KYC — panneau chef d'agence
  const [pendingKycAgents, setPendingKycAgents] = useState([]);
  const [pendingManagers, setPendingManagers] = useState([]);
  const [kycLoadingList, setKycLoadingList] = useState(false);
  const [selectedKycAgent, setSelectedKycAgent] = useState(null);
  const [selectedKycUrls, setSelectedKycUrls] = useState(null);
  const [kycRejectReason, setKycRejectReason] = useState("");

  async function loadPendingKycAgents() {
    setKycLoadingList(true);
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .eq("agency_id", agent.agencyId)
      .neq("id", agent.id)
      .order("kyc_status", { ascending: true });
    setKycLoadingList(false);
    if (!error) setPendingKycAgents(data || []);
  }

  async function loadPendingManagers() {
    setKycLoadingList(true);
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .eq("role", "manager")
      .neq("id", agent.id)
      .order("kyc_status", { ascending: true });
    setKycLoadingList(false);
    if (!error) setPendingManagers(data || []);
  }

  async function openKycReview(kycAgent) {
    setSelectedKycAgent(kycAgent);
    setSelectedKycUrls(null);
    setKycRejectReason("");
    setKycActionError("");
    const paths = [kycAgent.kyc_recto_path, kycAgent.kyc_verso_path, kycAgent.kyc_selfie_path, kycAgent.kyc_selfie_id_path].filter(Boolean);
    const urls = {};
    for (const p of paths) {
      const { data } = await supabase.storage.from("kyc-documents").createSignedUrl(p, 300);
      if (data) urls[p] = data.signedUrl;
    }
    setSelectedKycUrls(urls);
  }

  const [kycActionError, setKycActionError] = useState("");

  async function approveKycAgent() {
    if (!selectedKycAgent) return;
    setKycActionError("");
    const { error } = await supabase.from("agents").update({ kyc_status: "validated" }).eq("id", selectedKycAgent.id);
    if (error) {
      setKycActionError(
        "Échec de la validation : " + error.message + " (vérifie les règles RLS de la table agents dans Supabase)"
      );
      return;
    }
    pushNotification(`Identité de ${selectedKycAgent.full_name} validée ✅`);
    setSelectedKycAgent(null);
    if (selectedKycAgent.role === "manager") loadPendingManagers();
    else loadPendingKycAgents();
  }

  async function rejectKycAgent() {
    if (!selectedKycAgent) return;
    setKycActionError("");
    const { error } = await supabase
      .from("agents")
      .update({ kyc_status: "rejected", kyc_rejected_reason: kycRejectReason || "Documents non conformes" })
      .eq("id", selectedKycAgent.id);
    if (error) {
      setKycActionError(
        "Échec du refus : " + error.message + " (vérifie les règles RLS de la table agents dans Supabase)"
      );
      return;
    }
    pushNotification(`Identité de ${selectedKycAgent.full_name} refusée`);
    setSelectedKycAgent(null);
    if (selectedKycAgent.role === "manager") loadPendingManagers();
    else loadPendingKycAgents();
  }

  useEffect(() => {
    if (tab === "kyc-review" && agent?.role === "manager") {
      loadPendingKycAgents();
    }
    if (tab === "kyc-review-managers" && agent?.isPlatformOwner) {
      loadPendingManagers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // ===== Publicités (annonceurs) =====
  const AD_PRICING = [
    { days: 7, price: 15000, label: "7 jours" },
    { days: 15, price: 25000, label: "15 jours" },
    { days: 30, price: 40000, label: "30 jours" },
  ];
  const [activeAds, setActiveAds] = useState([]);
  const [activePublicites, setActivePublicites] = useState([]);
  const [selectedAdPreview, setSelectedAdPreview] = useState(null);
  const [adsLoading, setAdsLoading] = useState(false);
  const [myAds, setMyAds] = useState([]);
  const [adForm, setAdForm] = useState({ title: "", description: "", contactPhone: "", planIndex: 0, customDays: 7 });
  const [adFormError, setAdFormError] = useState("");
  const [adSubmitting, setAdSubmitting] = useState(false);
  const [adSuccessMsg, setAdSuccessMsg] = useState("");
  const [adImageFile, setAdImageFile] = useState(null);
  const [adImagePreview, setAdImagePreview] = useState("");

  function handleAdImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setAdFormError("Merci de choisir un fichier image (jpg, png…).");
      return;
    }
    setAdFormError("");
    setAdImageFile(file);
    setAdImagePreview(URL.createObjectURL(file));
  }

  async function uploadAdImage(file) {
    const ext = file.name.split(".").pop();
    const path = `${agent.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("ad-images").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("ad-images").getPublicUrl(path);
    return data.publicUrl;
  }

  // Supprime définitivement les annonces/publicités expirées, pour éviter
  // l'accumulation de données obsolètes dans le BackOffice.
  async function cleanupExpiredAds() {
    const { error } = await supabase.from("ads").delete().lt("ends_at", new Date().toISOString());
    if (error) {
      // Ignoré silencieusement — peut être bloqué par les règles RLS selon le compte connecté.
      console.warn("Nettoyage des annonces expirées :", error.message);
    }
  }

  async function loadActiveAds() {
    setAdsLoading(true);
    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .eq("status", "active")
      .eq("kind", "annonce")
      .gt("ends_at", new Date().toISOString())
      .order("created_at", { ascending: false });
    setAdsLoading(false);
    if (!error) setActiveAds(data || []);
  }

  async function loadActivePublicites() {
    setAdsLoading(true);
    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .eq("status", "active")
      .eq("kind", "publicite")
      .gt("ends_at", new Date().toISOString())
      .order("created_at", { ascending: false });
    setAdsLoading(false);
    if (!error) setActivePublicites(data || []);
  }

  async function loadMyAds() {
    if (!agent) return;
    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .eq("created_by", agent.id)
      .order("created_at", { ascending: false });
    if (!error) setMyAds(data || []);
  }

  // Backoffice — toutes les pubs, réservé au propriétaire de la plateforme
  const [allAds, setAllAds] = useState([]);
  const [allAdsLoading, setAllAdsLoading] = useState(false);

  async function loadAllAdsForBackoffice() {
    setAllAdsLoading(true);
    const { data, error } = await supabase.from("ads").select("*").order("created_at", { ascending: false });
    setAllAdsLoading(false);
    if (!error) setAllAds(data || []);
  }

  useEffect(() => {
    // Chargées dès l'ouverture du site, connecté ou non (vitrine publique)
    cleanupExpiredAds().then(() => {
      loadActiveAds();
      loadActivePublicites();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Le pool "publicités" (agents/chefs) est nécessaire dès la connexion,
    // car il est aussi affiché sur le tableau de bord. On en profite pour
    // purger les annonces/publicités expirées de ce compte.
    if (agent) {
      cleanupExpiredAds().then(() => {
        loadActivePublicites();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent?.id]);

  useEffect(() => {
    if (tab === "publicites" || tab === "annonceur") {
      setAdSuccessMsg("");
      setAdFormError("");
    }
    if (tab === "publicites" && agent) {
      cleanupExpiredAds().then(() => {
        loadActivePublicites();
        loadMyAds();
      });
    }
    if (tab === "annonceur" && agent?.isPlatformOwner) {
      cleanupExpiredAds().then(() => loadMyAds());
    }
    if (tab === "backoffice-pub" && agent?.isPlatformOwner) {
      cleanupExpiredAds().then(() => loadAllAdsForBackoffice());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // Le compte principal est crédité automatiquement des revenus publicitaires
  // dès sa connexion (et à chaque retour sur le tableau de bord), pas seulement
  // quand il ouvre le backoffice publicité.
  useEffect(() => {
    if (agent?.isPlatformOwner) loadAllAdsForBackoffice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent?.isPlatformOwner, tab === "dashboard"]);

  const ownerAdRevenue = agent?.isPlatformOwner ? allAds.reduce((s, a) => s + (a.amount_paid || 0), 0) : 0;

  // Valide que le contact est soit un numéro avec indicatif pays (+225...), soit un e-mail
  function isValidAdContact(raw) {
    const trimmed = (raw || "").trim();
    if (!trimmed) return false;
    if (trimmed.includes("@")) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    }
    const compact = trimmed.replace(/[\s-]/g, "");
    return /^\+\d{8,15}$/.test(compact);
  }

  async function handleSubmitAd(e, kind) {
    e.preventDefault();
    setAdFormError("");
    setAdSuccessMsg("");
    if (!adForm.title.trim() || !adForm.description.trim() || !adForm.contactPhone.trim()) {
      setAdFormError("Merci de remplir tous les champs.");
      return;
    }
    if (!isValidAdContact(adForm.contactPhone)) {
      setAdFormError(
        "Numéro de contact invalide. Indique l'indicatif pays (ex. +225 01 02 03 04 05) ou une adresse e-mail valide."
      );
      return;
    }
    const isAnnonce = kind === "annonce";
    let days, price;
    if (isAnnonce) {
      days = Math.min(30, Math.max(1, Math.round(Number(adForm.customDays) || 1)));
      price = 0;
    } else {
      const plan = AD_PRICING[adForm.planIndex];
      days = plan.days;
      price = plan.price;
    }
    const isFree = !!agent?.isPlatformOwner;
    const amountToCharge = isFree ? 0 : price;
    if (!isFree && amountToCharge > floatBalance) {
      setAdFormError(`Solde insuffisant. Solde disponible : ${formatFCFA(floatBalance)}.`);
      return;
    }
    setAdSubmitting(true);
    let imageUrl = null;
    if (adImageFile) {
      try {
        imageUrl = await uploadAdImage(adImageFile);
      } catch (err) {
        setAdSubmitting(false);
        setAdFormError("Erreur lors de l'envoi de l'image : " + err.message);
        return;
      }
    }
    // Paiement simulé — en production, appel réel à l'agrégateur de paiement ici
    const now = new Date();
    const endsAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const { error } = await supabase.from("ads").insert({
      created_by: agent.id,
      agency_id: agent.agencyId,
      agency_name: agent.agency,
      kind: isAnnonce ? "annonce" : "publicite",
      title: adForm.title.trim(),
      description: adForm.description.trim(),
      contact_phone: adForm.contactPhone.trim(),
      image_url: imageUrl,
      duration_days: days,
      amount_paid: amountToCharge,
      status: "active",
      starts_at: now.toISOString(),
      ends_at: endsAt.toISOString(),
      impressions: 0,
      clicks: 0,
    });
    setAdSubmitting(false);
    if (error) {
      setAdFormError("Erreur lors de la publication : " + error.message);
      return;
    }
    setAdSuccessMsg(
      isFree
        ? `${isAnnonce ? "Annonce" : "Publicité"} publiée gratuitement et en ligne pour ${days} jour${days > 1 ? "s" : ""} ✅`
        : `Publicité payée (${formatFCFA(price)}) et en ligne pour ${days} jours ✅`
    );
    if (!isFree) setAdSpend((s) => s + price);
    setAdImageFile(null);
    setAdImagePreview("");
    setAdForm({ title: "", description: "", contactPhone: "", planIndex: 0, customDays: 7 });
    pushNotification(`${isAnnonce ? "Annonce" : "Publicité"} publiée avec succès 📣`);
    if (isAnnonce) {
      loadActiveAds();
    } else {
      loadActivePublicites();
    }
    loadMyAds();
  }

  // PIN confirmation modal state
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [draftEntry, setDraftEntry] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    if (!loginPhone || !loginPassword) {
      setAuthError("Renseigne ton numéro de téléphone et ton mot de passe.");
      return;
    }
    setAuthLoading(true);
    setAuthError("");
    const fullLoginPhone = `${loginCountryCode} ${loginPhone}`.trim();
    const { data: emailResult, error: lookupErr } = await supabase.rpc("get_email_by_phone", { phone_input: fullLoginPhone });
    if (lookupErr || !emailResult) {
      setAuthLoading(false);
      setAuthError("Aucun compte trouvé avec ce numéro de téléphone.");
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailResult,
      password: loginPassword,
    });
    if (error) {
      setAuthLoading(false);
      setAuthError(error.message === "Invalid login credentials" ? "Numéro ou mot de passe incorrect." : error.message);
      return;
    }
    const profile = await fetchAgentProfile(data.user.id);
    setAuthLoading(false);
    if (!profile) {
      setAuthError("Compte introuvable. Réessaie ou crée un compte.");
      return;
    }
    if (profile.role === "manager") {
      profile.agencyCode = await fetchAgencyCode(profile.agencyId);
    }
    setAgent(profile);
    setIsAuthenticated(true);
    let sub = await fetchSubscription(profile.id);
    if (!sub) sub = await createPendingSubscription(profile.id, profile.role);
    setSubscription(sub);
  }

  // Traite la création d'un nouveau PIN pour les agents dont l'ancien PIN
  // était stocké en clair (avant la mise en place du hashage bcrypt).
  async function handleForcedPinReset(e) {
    e.preventDefault();
    setForcedPinError("");
    if (forcedPinInput.length !== 4) {
      setForcedPinError("Le code PIN doit contenir exactement 4 chiffres.");
      return;
    }
    if (forcedPinInput !== forcedPinConfirmInput) {
      setForcedPinError("Les deux codes ne correspondent pas.");
      return;
    }
    setForcedPinLoading(true);
    const newPinHash = bcrypt.hashSync(forcedPinInput, 10);
    const { error } = await supabase.from("agents").update({ pin_hash: newPinHash }).eq("id", agent.id);
    setForcedPinLoading(false);
    if (error) {
      setForcedPinError("Erreur : " + error.message);
      return;
    }
    setAgent((a) => ({ ...a, pinHash: newPinHash, pinNeedsReset: false }));
    setForcedPinInput("");
    setForcedPinConfirmInput("");
  }

  function handleSignupRequestCode(e) {
    e.preventDefault();
    if (!signupName || !signupPhone || !signupEmail || !signupAgency || !signupPassword || signupPin.length !== 4) {
      setAuthError(signupPin.length !== 4 ? "Le code PIN doit contenir exactement 4 chiffres." : "Merci de remplir tous les champs.");
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setAuthError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    if (!signupEmail.toLowerCase().endsWith("@gmail.com")) {
      setAuthError("Merci d'utiliser une adresse Gmail (ex. toncompte@gmail.com).");
      return;
    }
    if (signupRole === "agent" && !signupAgencyCode) {
      setAuthError("Demande le code d'agence à ton chef d'agence pour rejoindre son équipe.");
      return;
    }
    requestSignupOtp();
  }

  // Déclenche le VRAI envoi d'e-mail via Supabase Auth : ceci crée le compte
  // (non confirmé tant que le code n'est pas vérifié) et envoie un e-mail
  // contenant un code à 6 chiffres, à condition que le modèle "Confirm signup"
  // soit configuré pour afficher {{ .Token }} dans le dashboard Supabase.
  async function requestSignupOtp() {
    setAuthLoading(true);
    setAuthError("");
    const { data, error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
    });
    setAuthLoading(false);
    if (error) {
      const waitMatch = error.message.match(/after (\d+) seconds?/i);
      if (waitMatch) {
        setSignupCooldown(parseInt(waitMatch[1], 10));
        setAuthError("");
      } else if (error.message.toLowerCase().includes("already registered")) {
        setAuthError("Un compte existe déjà avec cet e-mail. Essaie de te connecter.");
      } else {
        setAuthError(error.message);
      }
      return;
    }
    setSignupUserId(data.user?.id || null);
    setSignupEmailCodeInput("");
    setSignupEmailCodeError("");
    setSignupEmailCodeStep(2);
  }

  // Redemande l'envoi d'un code via le mécanisme officiel de Supabase
  // (limité à quelques envois par heure pour éviter les abus — c'est normal).
  async function handleResendSignupCode() {
    setSignupEmailCodeError("");
    const { error } = await supabase.auth.resend({ type: "signup", email: signupEmail });
    if (error) {
      const waitMatch = error.message.match(/after (\d+) seconds?/i);
      if (waitMatch) setSignupCooldown(parseInt(waitMatch[1], 10));
      else setSignupEmailCodeError("Impossible de renvoyer le code pour l'instant : " + error.message);
    } else {
      setSignupEmailCodeInput("");
    }
  }

  function backToSignupForm() {
    setSignupEmailCodeStep(1);
    setSignupEmailCodeInput("");
    setSignupEmailCodeError("");
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (signupEmailCodeInput.trim().length !== 6) {
      setSignupEmailCodeError("Entre le code à 6 chiffres reçu par e-mail.");
      return;
    }
    setSignupEmailCodeError("");
    setAuthLoading(true);
    setAuthError("");

    // Vérifie le code auprès de Supabase Auth — c'est le seul endroit où le
    // vrai code existe, jamais côté client.
    const { data: verifyData, error: verifyErr } = await supabase.auth.verifyOtp({
      email: signupEmail,
      token: signupEmailCodeInput.trim(),
      type: "signup",
    });
    if (verifyErr) {
      setAuthLoading(false);
      setSignupEmailCodeError("Code incorrect ou expiré. Vérifie l'e-mail reçu ou redemande un code.");
      return;
    }
    const userId = verifyData.user?.id || signupUserId;
    if (!userId) {
      setAuthLoading(false);
      setSignupEmailCodeError("Une erreur est survenue. Réessaie de demander un code.");
      return;
    }

    let agencyId = null;
    let agencyName = signupAgency;
    let agencyCodeForAgent = null;

    if (signupRole === "manager") {
      const code = generateAgencyCode(signupAgency);
      const { data: agencyRow, error: agencyErr } = await supabase
        .from("agencies")
        .insert({ name: signupAgency, code, manager_id: userId })
        .select()
        .single();
      if (agencyErr) {
        setAuthLoading(false);
        setAuthError("Erreur lors de la création de l'agence : " + agencyErr.message);
        return;
      }
      agencyId = agencyRow.id;
      agencyCodeForAgent = code;
      setNewAgencyCode(code);
    } else {
      const { data: foundAgency, error: findErr } = await supabase
        .from("agencies")
        .select("*")
        .eq("code", signupAgencyCode.trim().toUpperCase())
        .single();
      if (findErr || !foundAgency) {
        setAuthLoading(false);
        setAuthError("Code d'agence introuvable. Vérifie-le auprès de ton chef d'agence.");
        return;
      }
      agencyId = foundAgency.id;
      agencyName = foundAgency.name;
    }

    const fullPhone = `${signupCountryCode} ${signupPhone}`.trim();
    const signupPinHash = bcrypt.hashSync(signupPin, 10);

    const { error: insertErr } = await supabase.from("agents").insert({
      id: userId,
      full_name: signupName,
      phone: fullPhone,
      email: signupEmail,
      agency_id: agencyId,
      agency_name: agencyName,
      role: signupRole,
      pin_hash: signupPinHash,
      kyc_email_verified: true,
      referred_by_phone: referredByPhone || null,
    });
    setAuthLoading(false);
    if (insertErr) {
      setAuthError("Erreur lors de la création du profil : " + insertErr.message);
      return;
    }

    setAgent({
      id: userId,
      name: signupName,
      phone: fullPhone,
      email: signupEmail,
      agency: agencyName,
      agencyId,
      pinHash: signupPinHash,
      role: signupRole,
      kycEmailVerified: true,
      kycStatus: "incomplete",
      agencyCode: agencyCodeForAgent,
    });
    setIsAuthenticated(true);
    setAuthError("");
    await createPendingSubscription(userId, signupRole);
    setSignupPhoneStep(1);
    setSignupPhoneCode("");
    setSignupPhoneCodeInput("");
    setTab("kyc");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setAgent(null);
    setTab("dashboard");
    setLoginPassword("");
  }

  // Déconnexion automatique après inactivité
  const INACTIVITY_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes
  const INACTIVITY_WARNING_MS = 20 * 1000; // avertir 20s avant
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [inactivityCountdown, setInactivityCountdown] = useState(20);
  const warningTimerRef = useRef(null);
  const logoutTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  function clearInactivityTimers() {
    clearTimeout(warningTimerRef.current);
    clearTimeout(logoutTimerRef.current);
    clearInterval(countdownIntervalRef.current);
  }

  function resetInactivityTimers() {
    clearInactivityTimers();
    setShowInactivityWarning(false);
    warningTimerRef.current = setTimeout(() => {
      setShowInactivityWarning(true);
      setInactivityCountdown(Math.round(INACTIVITY_WARNING_MS / 1000));
      countdownIntervalRef.current = setInterval(() => {
        setInactivityCountdown((c) => (c > 0 ? c - 1 : 0));
      }, 1000);
    }, INACTIVITY_TIMEOUT_MS - INACTIVITY_WARNING_MS);
    logoutTimerRef.current = setTimeout(() => {
      clearInactivityTimers();
      setShowInactivityWarning(false);
      handleLogout();
      pushNotification("Déconnecté automatiquement pour inactivité 🔒");
    }, INACTIVITY_TIMEOUT_MS);
  }

  function staySignedIn() {
    resetInactivityTimers();
  }

  useEffect(() => {
    if (!isAuthenticated) {
      clearInactivityTimers();
      setShowInactivityWarning(false);
      return;
    }
    resetInactivityTimers();
    const events = ["mousemove", "keydown", "click", "touchstart", "scroll"];
    const handleActivity = () => {
      if (!showInactivityWarning) resetInactivityTimers();
    };
    events.forEach((ev) => window.addEventListener(ev, handleActivity));
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleActivity));
      clearInactivityTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Historique : recherche et filtres
  const [historySearch, setHistorySearch] = useState("");
  const [historyNetworkFilter, setHistoryNetworkFilter] = useState("all");
  const [historyStatusFilter, setHistoryStatusFilter] = useState("all");

  const filteredHistory = history.filter((h) => {
    const matchSearch = historySearch.trim() === "" || h.phone.toLowerCase().includes(historySearch.trim().toLowerCase());
    const matchNetwork = historyNetworkFilter === "all" || h.net === historyNetworkFilter;
    const matchStatus = historyStatusFilter === "all" || h.status === historyStatusFilter;
    return matchSearch && matchNetwork && matchStatus;
  });

  function exportHistoryExcel() {
    const rows = filteredHistory.map((h) => {
      const n = NETWORKS.find((x) => x.id === h.net);
      return {
        Ticket: "#" + String(h.id).padStart(5, "0"),
        Service: n.name,
        Type: h.direction === "retrait" ? "Retrait" : h.direction === "depot" ? "Dépôt" : "Paiement",
        "Numéro / référence": h.phone,
        "Montant (FCFA)": h.amount,
        Statut: h.status,
      };
    });
    import("xlsx").then((XLSX) => {
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Historique");
      XLSX.writeFile(wb, "empireguichet-historique.xlsx");
    });
  }

  function exportHistoryPDF() {
    Promise.all([import("jspdf"), import("jspdf-autotable")]).then(([{ default: jsPDF }, autoTable]) => {
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text("EmpireGuichet — Historique des transactions", 14, 16);
      doc.setFontSize(9);
      doc.text(`Agent : ${agent?.name || ""}  —  Agence : ${agent?.agency || ""}`, 14, 23);
      const rows = filteredHistory.map((h) => {
        const n = NETWORKS.find((x) => x.id === h.net);
        const typeLabel = h.direction === "retrait" ? "Retrait" : h.direction === "depot" ? "Dépôt" : "Paiement";
        return ["#" + String(h.id).padStart(5, "0"), n.name, typeLabel, h.phone, formatFCFA(h.amount), h.status];
      });
      (autoTable.default || autoTable)(doc, {
        head: [["Ticket", "Service", "Type", "Numéro / référence", "Montant", "Statut"]],
        body: rows,
        startY: 28,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [232, 169, 59] },
      });
      doc.save("empireguichet-historique.pdf");
    });
  }

  // Suivi impressions/clics des publicités actives — s'appuie sur activeAds/activePublicites déjà chargés
  const countedImpressionsRef = useRef(new Set());
  useEffect(() => {
    const pool = [...activeAds, ...activePublicites];
    if (pool.length === 0) return;
    pool.forEach((ad) => {
      if (!countedImpressionsRef.current.has(ad.id)) {
        countedImpressionsRef.current.add(ad.id);
        supabase.rpc("increment_ad_impression", { ad_id_input: ad.id }).then(() => {});
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAds, activePublicites]);

  function handleAdClick(adId) {
    supabase.rpc("increment_ad_click", { ad_id_input: adId }).then(() => {});
  }

  // Ouvre WhatsApp pour un numéro de contact, ou Gmail si c'est une adresse e-mail
  function contactAdOwner(ad) {
    handleAdClick(ad.id);
    const raw = (ad.contact_phone || "").trim();
    if (!raw) return;
    if (raw.includes("@")) {
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(raw)}`,
        "_blank",
        "noopener,noreferrer"
      );
    } else {
      const digits = raw.replace(/[^\d]/g, "");
      if (digits) {
        window.open(`https://wa.me/${digits}`, "_blank", "noopener,noreferrer");
      }
    }
  }

  // Paramètres du compte : changer PIN / mot de passe
  const [currentPinInput, setCurrentPinInput] = useState("");
  const [newPinInput, setNewPinInput] = useState("");
  const [confirmPinInput, setConfirmPinInput] = useState("");
  const [pinChangeMsg, setPinChangeMsg] = useState({ type: "", text: "" });
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [passwordChangeMsg, setPasswordChangeMsg] = useState({ type: "", text: "" });

  // Vérifie un PIN saisi contre le hash stocké (bcrypt). Si l'agent n'a pas encore
  // de hash (compte de démo), on retombe sur DEMO_PIN en clair pour ne pas casser la démo.
  function verifyPin(inputPin) {
    if (agent?.pinHash) return bcrypt.compareSync(inputPin, agent.pinHash);
    return inputPin === DEMO_PIN;
  }

  async function handleChangePin(e) {
    e.preventDefault();
    if (!verifyPin(currentPinInput)) {
      setPinChangeMsg({ type: "error", text: "Code PIN actuel incorrect." });
      return;
    }
    if (newPinInput.length !== 4) {
      setPinChangeMsg({ type: "error", text: "Le nouveau code doit contenir 4 chiffres." });
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinChangeMsg({ type: "error", text: "Les deux codes ne correspondent pas." });
      return;
    }
    const newPinHash = bcrypt.hashSync(newPinInput, 10);
    const { error } = await supabase.from("agents").update({ pin_hash: newPinHash }).eq("id", agent.id);
    if (error) {
      setPinChangeMsg({ type: "error", text: "Erreur : " + error.message });
      return;
    }
    setAgent((a) => ({ ...a, pinHash: newPinHash }));
    setCurrentPinInput("");
    setNewPinInput("");
    setConfirmPinInput("");
    setPinChangeMsg({ type: "success", text: "Code PIN mis à jour." });
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPasswordInput.length < 6) {
      setPasswordChangeMsg({ type: "error", text: "Le mot de passe doit contenir au moins 6 caractères." });
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeMsg({ type: "error", text: "Les deux mots de passe ne correspondent pas." });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPasswordInput });
    if (error) {
      setPasswordChangeMsg({ type: "error", text: "Erreur : " + error.message });
      return;
    }
    setNewPasswordInput("");
    setConfirmPasswordInput("");
    setPasswordChangeMsg({ type: "success", text: "Mot de passe mis à jour." });
  }

  // Notifications
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Bienvenue sur EmpireGuichet 👋", time: "Aujourd'hui", read: true },
  ]);
  const notifCounter = useRef(2);

  function pushNotification(text) {
    setNotifications((list) => [
      { id: notifCounter.current++, text, time: "À l'instant", read: false },
      ...list,
    ]);
  }

  function markAllNotificationsRead() {
    setNotifications((list) => list.map((n) => ({ ...n, read: true })));
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Parrainage state
  const [referralCopied, setReferralCopied] = useState(false);
  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}?parrain=${encodeURIComponent(agent?.phone || "demo")}`
      : "";

  function handleCopyReferral() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(referralLink).then(() => {
        setReferralCopied(true);
        setTimeout(() => setReferralCopied(false), 2000);
      });
    }
  }

  function handleShareReferral() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: "EmpireGuichet",
        text: "Rejoins-moi sur EmpireGuichet — mobile money, factures et crypto au même endroit.",
        url: referralLink,
      }).catch(() => {});
    } else {
      handleCopyReferral();
    }
  }

  // Support widget state
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportTab, setSupportTab] = useState("chat");
  const [openFaq, setOpenFaq] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { from: "agent", text: "Bonjour 👋 Comment puis-je t'aider avec EmpireGuichet ?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [contactForm, setContactForm] = useState({ subject: "", message: "" });
  const [contactSent, setContactSent] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, supportOpen]);

  function handleSendChat(e) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { from: "user", text: chatInput };
    setChatMessages((m) => [...m, userMsg]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((m) => [
        ...m,
        { from: "agent", text: "Merci pour ton message — un conseiller EmpireGuichet te répondra sous peu. Pour une réponse immédiate, utilise WhatsApp." },
      ]);
    }, 1000);
  }

  function handleContactSubmit(e) {
    e.preventDefault();
    if (!contactForm.subject || !contactForm.message) return;
    setContactSent(true);
    setContactForm({ subject: "", message: "" });
  }

  // Charge l'historique réel de l'agent connecté depuis Supabase (persiste entre les sessions)
  async function loadMyHistory() {
    if (!agent?.id) return;
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("agent_id", agent.id)
      .order("created_at", { ascending: false })
      .limit(100);
    if (!error && data) {
      setHistory(
        data.map((t) => ({
          id: t.ticket_id,
          net: t.net,
          amount: t.amount,
          phone: t.phone,
          status: t.status,
          time: new Date(t.created_at).toLocaleString("fr-FR"),
          direction: t.direction,
        }))
      );
    }
  }

  // Écrit la file d'attente hors-ligne à la fois en mémoire et dans
  // localStorage, pour qu'elle survive à une fermeture de l'appli.
  function persistOfflineQueue(queue) {
    setOfflineQueue(queue);
    try {
      localStorage.setItem("eg_offline_queue", JSON.stringify(queue));
    } catch {
      // stockage plein ou indisponible — la file reste au moins en mémoire
    }
  }

  // Tente d'envoyer à Supabase toutes les transactions en attente. Les
  // envois réussis sont retirés de la file ; les échecs y restent pour le
  // prochain essai.
  async function flushOfflineQueue() {
    if (syncingOffline) return;
    setOfflineQueue((current) => {
      if (current.length === 0) return current;
      (async () => {
        setSyncingOffline(true);
        const remaining = [];
        let syncedCount = 0;
        for (const tx of current) {
          const { error } = await supabase.from("transactions").insert(tx);
          if (error) remaining.push(tx);
          else syncedCount++;
        }
        persistOfflineQueue(remaining);
        setSyncingOffline(false);
        if (syncedCount > 0) {
          pushNotification(
            syncedCount === 1
              ? "1 transaction hors-ligne synchronisée."
              : `${syncedCount} transactions hors-ligne synchronisées.`
          );
          if (agent?.id) loadMyHistory();
        }
      })();
      return current;
    });
  }

  // Surveille l'état de la connexion. Dès que le réseau revient, on tente
  // aussitôt de vider la file d'attente hors-ligne.
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      flushOfflineQueue();
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    // Si l'appli s'ouvre déjà connectée avec des éléments en attente
    // (ex. fermée puis rouverte), on tente aussi une synchronisation.
    if (navigator.onLine) flushOfflineQueue();
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (agent?.id) loadMyHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent?.id]);

  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(async () => {
      const completed = { ...pending, status: "Terminé" };
      setHistory((h) => [completed, ...h]);
      setLastReceipt(completed);
      setPending(null);
      // Enregistrement dans Supabase — visible en temps réel par le chef d'agence.
      // Si l'agent est hors-ligne (ou si l'envoi échoue malgré une connexion
      // apparente), la transaction est mise en file d'attente locale et sera
      // envoyée automatiquement dès que le réseau reviendra. Le ticket/reçu
      // reste disponible immédiatement dans les deux cas.
      if (agent?.id) {
        const txPayload = {
          agent_id: agent.id,
          agency_id: agent.agencyId,
          ticket_id: completed.id,
          net: completed.net,
          amount: completed.amount,
          phone: completed.phone,
          direction: completed.direction,
          status: "Terminé",
        };
        if (!navigator.onLine) {
          persistOfflineQueue([...offlineQueue, txPayload]);
          pushNotification(`Ticket #${String(completed.id).padStart(5, "0")} enregistré hors-ligne — sera synchronisé au retour du réseau.`);
        } else {
          const { error } = await supabase.from("transactions").insert(txPayload);
          if (error) {
            persistOfflineQueue([...offlineQueue, txPayload]);
            pushNotification(`Ticket #${String(completed.id).padStart(5, "0")} : échec d'envoi, mis en attente de synchronisation.`);
          } else {
            pushNotification(`Transaction confirmée — Ticket #${String(completed.id).padStart(5, "0")} (${formatFCFA(completed.amount)})`);
          }
        }
      }
    }, 1400);
    return () => clearTimeout(t);
  }, [pending]);

  const net = NETWORKS.find((n) => n.id === selectedNetwork);
  const amtNum = parseFloat(amount) || 0;
  const fee = amtNum * net.fee;
  const total = amtNum + fee;

  // Préfixes officiels des opérateurs télécom, vérifiés pays par pays (sources : régulateurs
  // télécom nationaux / Wikipédia). Un réseau absent de la liste d'un pays (ex. MTN au Sénégal,
  // qui n'y opère pas) n'est volontairement pas vérifié pour ce pays — voir message à l'agent.
  // Ne couvre que MTN, Orange et Moov : ce sont de vrais opérateurs télécom avec des préfixes fixes.
  const NETWORK_PREFIXES_BY_COUNTRY = {
    "+225": { mtn: ["05"], orange: ["07", "08", "09"], moov: ["01"] }, // Côte d'Ivoire
    "+221": { orange: ["77", "78"] }, // Sénégal — pas de MTN ni Moov
    "+223": {
      orange: ["70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "82", "83", "84", "85", "90", "91", "92", "93", "94"],
      moov: ["65", "66", "68", "69", "89", "95", "96", "97", "98", "99"],
    }, // Mali — pas de MTN
    "+226": {
      orange: ["05", "06", "07", "54", "57"],
      moov: ["01", "02", "03", "50", "51", "52", "60", "61", "62", "63", "70", "71", "72", "73"],
    }, // Burkina Faso — pas de MTN
    "+228": { moov: ["78", "79", "96", "97", "98", "99"] }, // Togo — pas de MTN ni Orange
    "+224": { orange: ["62"], mtn: ["66"] }, // Guinée — pas de Moov
    "+237": { mtn: ["67"], orange: ["69"] }, // Cameroun — pas de Moov
    // Niger (+227) et France (+33) : volontairement absents. Les données trouvées pour le Niger
    // étaient trop anciennes/peu fiables pour être garanties, et la France n'a pas de MTN Money,
    // Orange Money ni Moov Money grand public au sens où cette appli l'entend.
  };

  // Wave n'est pas un opérateur télécom (n'importe quelle carte SIM peut y être rattachée) :
  // pas de préfixe à vérifier, seulement sa disponibilité par pays.
  // Sources vérifiées (2025-2026) : marchés confirmés opérationnels uniquement.
  // Togo, Bénin et Niger sont volontairement exclus : Wave y a annoncé son arrivée mais
  // le lancement grand public n'est pas confirmé au moment de cette vérification.
  const WAVE_AVAILABLE_COUNTRIES = ["+225", "+221", "+223", "+226", "+237", "+224"];

  function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!amtNum || !phone) {
      setFormError("Renseigne un montant et un numéro valides.");
      return;
    }
    if (amtNum > MAX_TRANSACTION) {
      setFormError(`Montant au-delà de la limite simulée par transaction (${formatFCFA(MAX_TRANSACTION)}).`);
      return;
    }
    if (net.type === "momo" && phone.replace(/\D/g, "").length < 8) {
      setFormError("Le numéro de téléphone semble incomplet.");
      return;
    }
    const countryName = COUNTRY_CODES.find((c) => c.code === txCountryCode)?.name || txCountryCode;
    if (net.id === "wave") {
      if (!WAVE_AVAILABLE_COUNTRIES.includes(txCountryCode)) {
        setFormError(`Wave n'est pas encore confirmé disponible en ${countryName}. Vérifie le pays ou change de réseau.`);
        return;
      }
    } else if (["mtn", "orange", "moov"].includes(net.id)) {
      const countryPrefixes = NETWORK_PREFIXES_BY_COUNTRY[txCountryCode];
      if (countryPrefixes) {
        if (!countryPrefixes[net.id]) {
          setFormError(`${net.name} n'opère pas en ${countryName}. Vérifie le réseau ou le pays sélectionné.`);
          return;
        }
        const digits = phone.replace(/\D/g, "");
        const prefix = digits.slice(0, 2);
        if (!countryPrefixes[net.id].includes(prefix)) {
          setFormError(
            `Ce numéro ne correspond pas à ${net.name} (préfixe attendu : ${countryPrefixes[net.id].join(", ")}). Vérifie le numéro ou change de réseau.`
          );
          return;
        }
      }
    }
    setDraftEntry({
      id: ticketCounter,
      net: net.id,
      amount: amtNum,
      phone,
      status: "En cours",
      time: "À l'instant",
      direction: net.type === "momo" || net.type === "crypto" ? txDirection : "paiement",
    });
    setPinInput("");
    setPinError("");
    setPinModalOpen(true);
  }

  function handlePinConfirm(e) {
    e.preventDefault();
    if (!verifyPin(pinInput)) {
      setPinError("Code PIN incorrect. Réessaie.");
      setPinInput("");
      return;
    }
    setTicketCounter((c) => c + 1);
    setPending(draftEntry);
    setPinModalOpen(false);
    setDraftEntry(null);
    setAmount("");
    setPhone("");
  }

  function handlePinCancel() {
    setPinModalOpen(false);
    setDraftEntry(null);
    setPinInput("");
    setPinError("");
  }

  function buildReceiptText(receipt) {
    const n = NETWORKS.find((x) => x.id === receipt.net);
    const rFee = receipt.amount * n.fee;
    return [
      "Reçu EmpireGuichet",
      `Ticket #${String(receipt.id).padStart(5, "0")}`,
      `Service : ${n.name}`,
      `Référence : ${receipt.phone}`,
      `Montant : ${formatFCFA(receipt.amount)}`,
      `Frais : ${formatFCFA(rFee)}`,
      `Total : ${formatFCFA(receipt.amount + rFee)}`,
      `Statut : ${receipt.status}`,
    ].join("\n");
  }

  function shareReceiptWhatsApp(receipt) {
    const text = buildReceiptText(receipt);
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  function shareReceiptSMS(receipt) {
    const text = buildReceiptText(receipt);
    window.location.href = `sms:?body=${encodeURIComponent(text)}`;
  }

  function shareReceiptNative(receipt) {
    const text = buildReceiptText(receipt);
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "Reçu EmpireGuichet", text }).catch(() => {});
    } else {
      shareReceiptWhatsApp(receipt);
    }
  }

  const todayVolume = history.reduce((sum, h) => sum + h.amount, 0);
  const todayCommission = history.reduce((sum, h) => {
    const hNet = NETWORKS.find((n) => n.id === h.net);
    return sum + h.amount * hNet.fee * AGENT_COMMISSION_RATE;
  }, 0);
  const [adSpend, setAdSpend] = useState(0); // total dépensé en publicités par cet agent (simulé)
  const floatChange = history.reduce((sum, h) => sum + (h.direction === "retrait" ? h.amount : -h.amount), 0);
  const floatBalance = Math.max(INITIAL_FLOAT + floatChange - adSpend + ownerAdRevenue, 0);

  useEffect(() => {
    if (floatBalance > 0 && floatBalance < 50000) {
      pushNotification("Solde bas — pense à réapprovisionner ton compte agent.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floatBalance < 50000]);

  // Restaure la session si l'agent était déjà connecté (rafraîchissement de page)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchAgentProfile(session.user.id).then(async (profile) => {
          if (profile) {
            if (profile.role === "manager") {
              profile.agencyCode = await fetchAgencyCode(profile.agencyId);
            }
            setAgent(profile);
            setIsAuthenticated(true);
            let sub = await fetchSubscription(profile.id);
            if (!sub) sub = await createPendingSubscription(profile.id, profile.role);
            setSubscription(sub);
          }
        });
      }
    });
  }, []);

  function scrollToDemo() {
    demoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToAnnonceurs() {
    annonceursRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollAdCarousel(ref, direction) {
    ref.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  }

  const INTRO_SLIDES = [
    {
      icon: Wallet3D,
      title: "Tous vos réseaux, un seul endroit",
      text: "MTN, Orange, Moov, Wave, Djamo, crypto, CIE, SODECI et péages réunis dans une seule interface.",
    },
    {
      icon: Shield3D,
      title: "Sécurisé à chaque transaction",
      text: "Un code PIN personnel confirme chaque envoi, pour protéger l'agent et le client.",
    },
    {
      icon: Chart3D,
      title: "Pilote ton activité",
      text: "Suis ton volume, tes commissions et ton équipe en temps réel depuis le tableau de bord.",
    },
  ];

  if (isAuthenticated && agent?.pinNeedsReset) {
    return (
      <div
        style={{
          background: COLORS.bg,
          color: COLORS.text,
          minHeight: "100%",
          fontFamily: "'IBM Plex Sans', sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div style={{ width: "100%", maxWidth: 340 }}>
          <div className="flex flex-col items-center mb-6 text-center">
            <ShieldCheck size={40} style={{ color: COLORS.gold, marginBottom: 12 }} />
            <h2 className="gc-display text-lg font-semibold mb-2">Sécurise ton code PIN</h2>
            <p className="text-sm" style={{ color: COLORS.textMuted }}>
              Pour ta sécurité, nous avons renforcé le stockage des codes PIN. Merci de créer un nouveau code PIN avant de continuer.
            </p>
          </div>
          <form onSubmit={handleForcedPinReset}>
            <label className="text-xs mb-1.5 block" style={{ color: COLORS.textMuted }}>Nouveau code PIN (4 chiffres)</label>
            <input
              value={forcedPinInput}
              type="password"
              inputMode="numeric"
              maxLength={4}
              autoFocus
              onChange={(e) => { setForcedPinInput(e.target.value.replace(/\D/g, "").slice(0, 4)); setForcedPinError(""); }}
              placeholder="••••"
              className="w-full px-3.5 py-3 rounded-lg text-center text-lg mb-3 outline-none gc-mono tracking-[0.5em]"
              style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
            />
            <label className="text-xs mb-1.5 block" style={{ color: COLORS.textMuted }}>Confirme le nouveau code PIN</label>
            <input
              value={forcedPinConfirmInput}
              type="password"
              inputMode="numeric"
              maxLength={4}
              onChange={(e) => { setForcedPinConfirmInput(e.target.value.replace(/\D/g, "").slice(0, 4)); setForcedPinError(""); }}
              placeholder="••••"
              className="w-full px-3.5 py-3 rounded-lg text-center text-lg mb-3 outline-none gc-mono tracking-[0.5em]"
              style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
            />
            {forcedPinError && (
              <p className="text-xs mb-3" style={{ color: COLORS.danger }}>{forcedPinError}</p>
            )}
            <button
              type="submit"
              disabled={forcedPinLoading || forcedPinInput.length !== 4}
              className="gc-btn w-full py-3 rounded-lg text-sm font-medium disabled:opacity-50"
              style={{ background: COLORS.gold, color: "#052E36" }}
            >
              {forcedPinLoading ? "Enregistrement..." : "Enregistrer mon nouveau PIN"}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-3 mt-2 rounded-lg text-sm"
              style={{ color: COLORS.textMuted }}
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (introStep < 4) {
    return (
      <div
        style={{
          background: COLORS.bg,
          color: COLORS.text,
          minHeight: "100%",
          fontFamily: "'IBM Plex Sans', sans-serif",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
          .gc-display { font-family: 'Space Grotesk', sans-serif; }
          @keyframes gcSplashIn { from { opacity:0; } to { opacity:1; } }
          @keyframes gcPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
          @keyframes gcSlideIn { from { opacity:0; transform: translateX(16px); } to { opacity:1; transform: translateX(0); } }
          .gc-splash-wrap { animation: gcSplashIn .5s ease; }
          .gc-splash-logo { animation: gcPulse 1.6s ease-in-out infinite; }
          .gc-slide { animation: gcSlideIn .35s ease; }
          @media (prefers-reduced-motion: reduce) {
            .gc-splash-logo, .gc-slide, .gc-splash-wrap { animation: none !important; }
          }
        `}</style>

        {introStep === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gc-splash-wrap">
            <img
              src={LOGO_DATA_URI}
              alt="EmpireGuichet"
              className="gc-splash-logo"
              style={{ height: 96, width: "auto", objectFit: "contain", marginBottom: 20 }}
            />
            <div className="gc-display text-2xl font-semibold">EmpireGuichet</div>
            <div className="text-xs mt-1" style={{ color: COLORS.textMuted }}>par Empire Digital CI</div>
          </div>
        )}

        {introStep >= 1 && introStep <= 3 && (
          <div className="flex-1 flex flex-col">
            <div className="flex justify-end p-5">
              <button onClick={() => setIntroStep(4)} className="text-sm" style={{ color: COLORS.textMuted }}>
                Passer
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gc-slide" key={introStep}>
              {(() => {
                const slide = INTRO_SLIDES[introStep - 1];
                const Illustration = slide.icon;
                return (
                  <>
                    <div style={{ marginBottom: 24 }}>
                      <Illustration size={128} />
                    </div>
                    <h2 className="gc-display text-xl font-semibold mb-3" style={{ maxWidth: 320 }}>{slide.title}</h2>
                    <p className="text-sm" style={{ color: COLORS.textMuted, maxWidth: 320 }}>{slide.text}</p>
                  </>
                );
              })()}
            </div>
            <div className="flex flex-col items-center gap-6 pb-10 px-8">
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: i === introStep ? 20 : 6,
                      height: 6,
                      borderRadius: 999,
                      background: i === introStep ? COLORS.gold : COLORS.surfaceLine,
                      transition: "width .2s ease",
                    }}
                  />
                ))}
              </div>
              <button
                onClick={() => setIntroStep((s) => (s === 3 ? 4 : s + 1))}
                className="gc-btn w-full max-w-xs py-3 rounded-lg text-sm font-medium"
                style={{ background: COLORS.gold, color: "#052E36" }}
              >
                {introStep === 3 ? "Commencer" : "Suivant"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        background: COLORS.bg,
        color: COLORS.text,
        minHeight: "100%",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        .gc-display { font-family: 'Space Grotesk', sans-serif; }
        .gc-mono { font-family: 'IBM Plex Mono', monospace; }
        .gc-btn { transition: transform .15s ease, box-shadow .15s ease; }
        .gc-btn:hover { transform: translateY(-1px); }
        .gc-card { transition: border-color .15s ease, transform .15s ease; }
        .gc-card:hover { transform: translateY(-2px); }
        .gc-fade-in { animation: gcFadeIn .35s ease; }
        @keyframes gcFadeIn { from { opacity:0; transform: translateY(6px);} to { opacity:1; transform:none; } }
        @media (prefers-reduced-motion: reduce) {
          .gc-btn, .gc-card, .gc-fade-in { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* ===== Bannière de connexion / synchronisation hors-ligne ===== */}
      {(!isOnline || offlineQueue.length > 0) && (
        <div
          className="sticky top-0 z-30 px-4 py-2 text-center text-xs font-medium"
          style={{
            background: !isOnline ? COLORS.danger : COLORS.gold,
            color: !isOnline ? "#FFFFFF" : "#052E36",
          }}
        >
          {!isOnline
            ? `Pas de connexion — les transactions sont enregistrées localement${offlineQueue.length > 0 ? ` (${offlineQueue.length} en attente)` : ""}.`
            : syncingOffline
            ? `Synchronisation de ${offlineQueue.length} transaction${offlineQueue.length > 1 ? "s" : ""} en cours...`
            : `${offlineQueue.length} transaction${offlineQueue.length > 1 ? "s" : ""} en attente de synchronisation.`}
        </div>
      )}

      {/* ===== Header ===== */}
      <header
        style={{ borderBottom: `1px solid ${COLORS.surfaceLine}` }}
        className="sticky top-0 z-20 backdrop-blur"
      >
        <div style={{ background: COLORS.headerBg }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
            <button
              type="button"
              onClick={() => {
                if (isAuthenticated) {
                  setTab("dashboard");
                }
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2.5 gc-btn"
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
              aria-label={isAuthenticated ? "Retour au tableau de bord" : "Retour à l'accueil"}
            >
              <img
                src={LOGO_DATA_URI}
                alt="EmpireGuichet"
                style={{ height: 40, width: "auto", flexShrink: 0, objectFit: "contain" }}
              />
              <div className="leading-tight">
                <div className="gc-display text-lg font-semibold tracking-tight">EmpireGuichet</div>
                <div className="text-[10px]" style={{ color: COLORS.textMuted }}>par Empire Digital CI</div>
              </div>
            </button>
            <nav className="hidden md:flex items-center gap-7 text-sm" style={{ color: COLORS.textMuted }}>
              <a href="#reseaux" className="hover:text-white">Réseaux</a>
              <a href="#demo" className="hover:text-white" onClick={scrollToDemo}>Démo</a>
              <a href="#annonceurs" className="hover:text-white" onClick={(e) => { e.preventDefault(); scrollToAnnonceurs(); }}>Annonceurs</a>
            </nav>
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
                  style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
                >
                  <User size={14} style={{ color: COLORS.goldSoft }} />
                  {agent?.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="gc-btn flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border"
                  style={{ borderColor: COLORS.surfaceLine, color: COLORS.textMuted }}
                >
                  <LogOut size={14} /> Déconnexion
                </button>
              </div>
            ) : (
              <button
                onClick={scrollToDemo}
                className="gc-btn hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: COLORS.gold, color: "#052E36" }}
              >
                Se connecter <ChevronRight size={15} />
              </button>
            )}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setNotifOpen((v) => !v)}
                  aria-label="Notifications"
                  className="gc-btn w-9 h-9 rounded-lg flex items-center justify-center relative"
                  style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.goldSoft }}
                >
                  <Bell size={16} />
                  {unreadCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 flex items-center justify-center text-[9px] font-semibold rounded-full"
                      style={{ width: 15, height: 15, background: COLORS.danger, color: "#fff" }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div
                    className="gc-fade-in absolute right-0 mt-2 rounded-xl overflow-hidden z-30"
                    style={{ width: 300, background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}`, boxShadow: "0 20px 50px -20px rgba(0,0,0,0.6)" }}
                  >
                    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${COLORS.surfaceLine}` }}>
                      <span className="text-sm font-medium">Notifications</span>
                      {unreadCount > 0 && (
                        <button onClick={markAllNotificationsRead} className="text-xs flex items-center gap-1" style={{ color: COLORS.goldSoft }}>
                          <Check size={12} /> Tout marquer lu
                        </button>
                      )}
                    </div>
                    <div style={{ maxHeight: 280, overflowY: "auto" }}>
                      {notifications.length === 0 && (
                        <p className="text-xs px-4 py-6 text-center" style={{ color: COLORS.textMuted }}>Aucune notification.</p>
                      )}
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="px-4 py-3 text-xs"
                          style={{ borderTop: `1px solid ${COLORS.surfaceLine}`, background: n.read ? "transparent" : "rgba(232,169,59,0.06)", color: COLORS.text }}
                        >
                          <div>{n.text}</div>
                          <div style={{ color: COLORS.textMuted }} className="mt-1">{n.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label={theme === "dark" ? "Passer en mode jour" : "Passer en mode nuit"}
              className="gc-btn w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.goldSoft }}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden px-5 pb-4 flex flex-col gap-3 text-sm" style={{ color: COLORS.textMuted }}>
              <a href="#reseaux" onClick={() => setMenuOpen(false)}>Réseaux</a>
              <a href="#demo" onClick={() => { setMenuOpen(false); scrollToDemo(); }}>Démo</a>
              <a href="#annonceurs" onClick={(e) => { e.preventDefault(); setMenuOpen(false); scrollToAnnonceurs(); }}>Annonceurs</a>
              {isAuthenticated ? (
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="flex items-center gap-1.5 text-left">
                  <LogOut size={14} /> Déconnexion ({agent?.name})
                </button>
              ) : (
                <button onClick={() => { setMenuOpen(false); scrollToDemo(); }} className="flex items-center gap-1.5 text-left" style={{ color: COLORS.goldSoft }}>
                  <LogIn size={14} /> Se connecter
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section
        className="max-w-6xl mx-auto px-5 pt-14 pb-16 grid md:grid-cols-2 gap-10 items-center"
        style={{ position: "relative", overflow: "hidden" }}
      >
        {[
          { top: "4%", right: "2%", height: 130, rotate: "-8deg" },
          { top: "38%", right: "22%", height: 90, rotate: "12deg" },
          { top: "62%", right: "-4%", height: 160, rotate: "6deg" },
          { top: "82%", right: "30%", height: 70, rotate: "-14deg" },
          { top: "12%", right: "38%", height: 60, rotate: "20deg" },
          { top: "-6%", right: "16%", height: 100, rotate: "-4deg" },
        ].map((p, i) => (
          <img
            key={i}
            src={LOGO_DATA_URI}
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              top: p.top,
              right: p.right,
              height: p.height,
              width: "auto",
              transform: `rotate(${p.rotate})`,
              opacity: theme === "light" ? 0.05 : 0.07,
              pointerEvents: "none",
              zIndex: 0,
              filter: theme === "light" ? "grayscale(0.2)" : "none",
            }}
          />
        ))}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full mb-5"
            style={{ background: COLORS.surface, color: COLORS.goldSoft, border: `1px solid ${COLORS.surfaceLine}` }}
          >
            <ShieldCheck size={13} /> Prototype — données simulées
          </div>
          <h1 className="gc-display text-4xl md:text-5xl font-semibold leading-tight mb-5">
            Un seul guichet.
            <br />
            Tous les réseaux.
          </h1>
          <p className="text-base leading-relaxed mb-8" style={{ color: COLORS.textMuted, maxWidth: 440 }}>
            MTN, Orange, Moov, Wave, Djamo, crypto, CIE, SODECI et péages — vos agents traitent chaque
            transaction au même endroit, avec un seul ticket, un seul historique.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={scrollToDemo}
              className="gc-btn px-5 py-3 rounded-lg text-sm font-medium"
              style={{ background: COLORS.gold, color: "#052E36" }}
            >
              Lancer une transaction test
            </button>
            <a
              href="#annonceurs"
              onClick={(e) => { e.preventDefault(); scrollToAnnonceurs(); }}
              className="gc-btn px-5 py-3 rounded-lg text-sm font-medium border"
              style={{ borderColor: COLORS.surfaceLine, color: COLORS.text }}
            >
              Voir l'espace annonceurs
            </a>
          </div>
        </div>

        {/* Ticket visual */}
        <div className="gc-fade-in flex justify-center">
          <div
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.surfaceLine}`,
              width: 300,
              borderRadius: 16,
              boxShadow: "0 20px 50px -20px rgba(0,0,0,0.6)",
            }}
            className="p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs" style={{ color: COLORS.textMuted }}>TICKET</span>
              <span className="text-xs gc-mono" style={{ color: COLORS.goldSoft }}><TicketNumber n={12} /></span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <NetworkBadge net={NETWORKS[3]} colors={COLORS} />
              <div>
                <div className="text-sm font-medium">Wave</div>
                <div className="text-xs" style={{ color: COLORS.textMuted }}>07 XX XX 21 09</div>
              </div>
            </div>
            <div style={{ borderTop: `1px dashed ${COLORS.surfaceLine}` }} className="pt-4 mb-4">
              <div className="flex justify-between text-sm mb-1.5">
                <span style={{ color: COLORS.textMuted }}>Montant</span>
                <span className="gc-mono">{formatFCFA(20000)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1.5">
                <span style={{ color: COLORS.textMuted }}>Frais</span>
                <span className="gc-mono">{formatFCFA(160)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Total</span>
                <span className="gc-mono">{formatFCFA(20160)}</span>
              </div>
            </div>
            <div
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md w-fit"
              style={{ background: "rgba(43,191,138,0.12)", color: COLORS.teal }}
            >
              <CheckCircle2 size={13} /> Terminé
            </div>
          </div>
        </div>
      </section>

      {/* ===== Réseaux ===== */}
      <section id="reseaux" className="max-w-6xl mx-auto px-5 py-14" style={{ borderTop: `1px solid ${COLORS.surfaceLine}` }}>
        <h2 className="gc-display text-2xl font-semibold mb-2">Réseaux, factures &amp; péages pris en charge</h2>
        <p className="text-sm mb-8" style={{ color: COLORS.textMuted }}>
          Chaque carte représente une connexion réelle à établir via un agrégateur agréé (CinetPay, PayDunya…) avant mise en production.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {NETWORKS.map((n) => (
            <div
              key={n.id}
              className="gc-card p-4 rounded-xl flex items-center gap-3"
              style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
            >
              <NetworkBadge net={n} colors={COLORS} />
              <div>
                <div className="text-sm font-medium">{n.name}</div>
                <div className="text-xs" style={{ color: COLORS.textMuted }}>Frais simulés {(n.fee * 100).toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Espace annonceurs ===== */}
      <section id="annonceurs" ref={annonceursRef} className="max-w-6xl mx-auto px-5 py-14" style={{ borderTop: `1px solid ${COLORS.surfaceLine}` }}>
        <div className="mb-8">
          <h2 className="gc-display text-2xl font-semibold mb-2">Espace annonceurs</h2>
          <p className="text-sm max-w-xl" style={{ color: COLORS.textMuted }}>
            Les annonces mises en avant par EmpireGuichet, visibles par tous les agents et visiteurs de la plateforme.
          </p>
        </div>

        {adsLoading ? (
          <p className="text-sm" style={{ color: COLORS.textMuted }}>Chargement des annonces…</p>
        ) : activeAds.length === 0 ? (
          <div
            className="p-8 rounded-xl text-center"
            style={{ background: COLORS.surface, border: `1px dashed ${COLORS.surfaceLine}` }}
          >
            <Megaphone size={22} style={{ color: COLORS.textMuted, margin: "0 auto 10px" }} />
            <p className="text-sm" style={{ color: COLORS.textMuted }}>
              Aucune annonce active pour le moment. Sois le premier agent à publier la tienne.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeAds.map((ad) => (
              <div
                key={ad.id}
                onClick={() => setSelectedAdPreview(ad)}
                className="gc-card rounded-xl overflow-hidden cursor-pointer flex flex-col"
                style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
              >
                {ad.image_url ? (
                  <img src={ad.image_url} alt={ad.title} className="w-full object-cover" style={{ height: 140 }} />
                ) : (
                  <div className="w-full flex items-center justify-center" style={{ height: 140, background: COLORS.bgSoft }}>
                    <Megaphone size={22} style={{ color: COLORS.surfaceLine }} />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-sm font-medium mb-1 truncate">{ad.title}</div>
                  <p className="text-xs mb-3 flex-1" style={{ color: COLORS.textMuted, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {ad.description}
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); contactAdOwner(ad); }}
                    className="gc-btn flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium"
                    style={{ background: COLORS.bgSoft, color: COLORS.gold, border: `1px solid ${COLORS.surfaceLine}` }}
                  >
                    <Phone size={12} /> Contacter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== Demo App ===== */}
      <section id="demo" ref={demoRef} className="max-w-6xl mx-auto px-5 py-14" style={{ borderTop: `1px solid ${COLORS.surfaceLine}` }}>
        <h2 className="gc-display text-2xl font-semibold mb-2">Démo interactive</h2>
        <p className="text-sm mb-8" style={{ color: COLORS.textMuted }}>
          Interface fonctionnelle avec données simulées — aucune transaction réelle n'est envoyée.
        </p>

        {!isAuthenticated && activeAds.length > 0 && (
          <div className="mb-8 max-w-2xl">
            <div className="text-xs font-medium mb-3" style={{ color: COLORS.textMuted }}>ANNONCES SUR LA PLATEFORME</div>
            <div className="space-y-2">
              {activeAds.map((ad) => (
                <div
                  key={ad.id}
                  onClick={() => setSelectedAdPreview(ad)}
                  className="rounded-lg overflow-hidden cursor-pointer flex items-center"
                  style={{ height: 88, background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
                >
                  {ad.image_url ? (
                    <img src={ad.image_url} alt={ad.title} className="h-full object-cover flex-shrink-0" style={{ width: 88 }} />
                  ) : (
                    <div className="h-full flex items-center justify-center flex-shrink-0" style={{ width: 88, background: COLORS.bgSoft }}>
                      <Megaphone size={18} style={{ color: COLORS.surfaceLine }} />
                    </div>
                  )}
                  <div className="p-3 min-w-0">
                    <div className="text-sm font-medium truncate">{ad.title}</div>
                    <p className="text-xs truncate" style={{ color: COLORS.textMuted }}>{ad.description}</p>
                    <div className="text-xs mt-1 flex items-center gap-1" style={{ color: COLORS.gold }}>
                      <Phone size={10} /> {ad.contact_phone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isAuthenticated ? (
          <div className="gc-fade-in grid md:grid-cols-2 gap-6 max-w-3xl">
            {/* Auth card */}
            <div
              className="p-6 rounded-xl md:col-span-2"
              style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
            >
              {authMode !== "recovery" ? (
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => { setAuthMode("login"); setAuthError(""); }}
                    className="gc-btn flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium"
                    style={
                      authMode === "login"
                        ? { background: COLORS.gold, color: "#052E36" }
                        : { background: COLORS.bgSoft, color: COLORS.textMuted, border: `1px solid ${COLORS.surfaceLine}` }
                    }
                  >
                    <LogIn size={15} /> Connexion
                  </button>
                  <button
                    onClick={() => { setAuthMode("signup"); setAuthError(""); }}
                    className="gc-btn flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium"
                    style={
                      authMode === "signup"
                        ? { background: COLORS.gold, color: "#052E36" }
                        : { background: COLORS.bgSoft, color: COLORS.textMuted, border: `1px solid ${COLORS.surfaceLine}` }
                    }
                  >
                    <UserPlus size={15} /> Créer un compte agent
                  </button>
                </div>
              ) : (
                <button
                  onClick={backToLoginFromRecovery}
                  className="text-xs mb-6 flex items-center gap-1"
                  style={{ color: COLORS.goldSoft }}
                >
                  ← Retour à la connexion
                </button>
              )}

              {authMode === "login" ? (
                <form onSubmit={handleLogin} className="max-w-sm">
                  <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Numéro de téléphone</label>
                  <div className="flex gap-2 mb-4">
                    <CountryDropdown value={loginCountryCode} onChange={setLoginCountryCode} colors={COLORS} />
                    <input
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(sanitizePhoneDigits(e.target.value, loginCountryCode))}
                      placeholder="07 XX XX XX XX"
                      type="tel"
                      maxLength={COUNTRY_CODES.find((c) => c.code === loginCountryCode)?.phoneLength || 10}
                      className="flex-1 px-3.5 py-2.5 rounded-lg text-sm outline-none"
                      style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                    />
                  </div>
                  <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Mot de passe</label>
                  <div className="mb-2">
                    <PasswordInput
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      colors={COLORS}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => { setAuthMode("recovery"); setRecoveryError(""); }}
                    className="text-xs mb-4 block"
                    style={{ color: COLORS.goldSoft }}
                  >
                    Mot de passe oublié ?
                  </button>
                  {authError && <p className="text-xs mb-4" style={{ color: COLORS.danger }}>{authError}</p>}
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="gc-btn w-full py-3 rounded-lg text-sm font-medium disabled:opacity-50"
                    style={{ background: COLORS.gold, color: "#052E36" }}
                  >
                    {authLoading ? "Connexion…" : "Se connecter"}
                  </button>
                </form>
              ) : authMode === "signup" ? (
                signupEmailCodeStep === 1 ? (
                <form onSubmit={handleSignupRequestCode} className="max-w-sm">
                  <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Nom complet</label>
                  <input
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Ex. Awa Koné"
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm mb-4 outline-none"
                    style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                  />
                  <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Numéro de téléphone</label>
                  <div className="flex gap-2 mb-4">
                    <CountryDropdown value={signupCountryCode} onChange={setSignupCountryCode} colors={COLORS} />
                    <input
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(sanitizePhoneDigits(e.target.value, signupCountryCode))}
                      placeholder="07 XX XX XX XX"
                      type="tel"
                      maxLength={COUNTRY_CODES.find((c) => c.code === signupCountryCode)?.phoneLength || 10}
                      className="flex-1 px-3.5 py-2.5 rounded-lg text-sm outline-none"
                      style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                    />
                  </div>
                  <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Adresse Gmail</label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="toncompte@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm mb-1 outline-none"
                    style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                  />
                  <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>
                    Utilisée pour récupérer ton compte en cas de mot de passe oublié.
                  </p>
                  <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Agence / ville</label>
                  <input
                    value={signupAgency}
                    onChange={(e) => setSignupAgency(e.target.value)}
                    placeholder="Ex. Agence Marcory, Abidjan"
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm mb-4 outline-none"
                    style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                  />
                  <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Mot de passe</label>
                  <div className="mb-4">
                    <PasswordInput
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      colors={COLORS}
                    />
                  </div>
                  <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Confirmer le mot de passe</label>
                  <div className="mb-4">
                    <PasswordInput
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      colors={COLORS}
                    />
                  </div>
                  <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Code PIN de transaction (4 chiffres)</label>
                  <input
                    value={signupPin}
                    type="password"
                    onChange={(e) => setSignupPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="••••"
                    inputMode="numeric"
                    maxLength={4}
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm mb-4 outline-none gc-mono tracking-widest"
                    style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                  />
                  <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>
                    Ce code te sera demandé pour confirmer chaque transaction.
                  </p>
                  <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Type de compte</label>
                  <div className="flex gap-2 mb-4">
                    {[{ id: "agent", label: "Agent terrain" }, { id: "manager", label: "Chef d'agence" }].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSignupRole(r.id)}
                        className="gc-btn flex-1 py-2 rounded-lg text-xs font-medium"
                        style={
                          signupRole === r.id
                            ? { background: COLORS.gold, color: "#052E36" }
                            : { background: COLORS.bgSoft, color: COLORS.textMuted, border: `1px solid ${COLORS.surfaceLine}` }
                        }
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                  {signupRole === "agent" && (
                    <>
                      <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Code d'agence</label>
                      <input
                        value={signupAgencyCode}
                        onChange={(e) => setSignupAgencyCode(e.target.value)}
                        placeholder="Ex. MAR-4F2K (donné par ton chef d'agence)"
                        className="w-full px-3.5 py-2.5 rounded-lg text-sm mb-4 outline-none gc-mono"
                        style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                      />
                    </>
                  )}
                  {authError && <p className="text-xs mb-4" style={{ color: COLORS.danger }}>{authError}</p>}
                  {signupCooldown > 0 && (
                    <p className="text-xs mb-4 flex items-center gap-1.5" style={{ color: COLORS.withdraw }}>
                      <Clock size={13} /> Trop de tentatives — réessaie dans {signupCooldown}s…
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={signupCooldown > 0}
                    className="gc-btn w-full py-3 rounded-lg text-sm font-medium disabled:opacity-50"
                    style={{ background: COLORS.gold, color: "#052E36" }}
                  >
                    {signupCooldown > 0 ? `Réessaie dans ${signupCooldown}s` : "Recevoir mon code par e-mail"}
                  </button>
                </form>
                ) : (
                <form onSubmit={handleSignup} className="max-w-sm">
                  <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>
                    Un code de confirmation à 6 chiffres a été envoyé à{" "}
                    <strong>{maskEmail(signupEmail)}</strong>. Entre-le ci-dessous pour créer ton compte.
                  </p>
                  <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Code de vérification</label>
                  <input
                    value={signupEmailCodeInput}
                    onChange={(e) => setSignupEmailCodeInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="••••••"
                    inputMode="numeric"
                    maxLength={6}
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm mb-4 outline-none gc-mono tracking-widest text-center"
                    style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                  />
                  {signupEmailCodeError && <p className="text-xs mb-4" style={{ color: COLORS.danger }}>{signupEmailCodeError}</p>}
                  {authError && <p className="text-xs mb-4" style={{ color: COLORS.danger }}>{authError}</p>}
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="gc-btn w-full py-3 rounded-lg text-sm font-medium disabled:opacity-50 mb-2.5"
                    style={{ background: COLORS.gold, color: "#052E36" }}
                  >
                    {authLoading ? "Création du compte…" : "Confirmer et créer mon compte"}
                  </button>
                  <div className="flex items-center justify-between text-xs">
                    <button type="button" onClick={backToSignupForm} className="gc-btn" style={{ color: COLORS.textMuted }}>
                      ← Modifier mes informations
                    </button>
                    <button type="button" onClick={handleResendSignupCode} className="gc-btn" style={{ color: COLORS.gold }}>
                      Renvoyer le code
                    </button>
                  </div>
                </form>
                )
              ) : (
                <div className="max-w-sm">
                  {recoveryStep === 1 && (
                    <form onSubmit={handleRecoveryRequestCode}>
                      <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>
                        Confirme ton numéro et l'adresse Gmail associée à ton compte — un code de vérification y sera envoyé.
                      </p>
                      <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Numéro de téléphone</label>
                      <div className="flex gap-2 mb-4">
                        <CountryDropdown value={recoveryCountryCode} onChange={setRecoveryCountryCode} colors={COLORS} />
                        <input
                          value={recoveryPhone}
                          onChange={(e) => setRecoveryPhone(sanitizePhoneDigits(e.target.value, recoveryCountryCode))}
                          placeholder="07 XX XX XX XX"
                          type="tel"
                          maxLength={COUNTRY_CODES.find((c) => c.code === recoveryCountryCode)?.phoneLength || 10}
                          className="flex-1 px-3.5 py-2.5 rounded-lg text-sm outline-none"
                          style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                        />
                      </div>
                      <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Adresse Gmail</label>
                      <input
                        type="email"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="toncompte@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-lg text-sm mb-4 outline-none"
                        style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                      />
                      {recoveryError && <p className="text-xs mb-4" style={{ color: COLORS.danger }}>{recoveryError}</p>}
                      <button
                        type="submit"
                        disabled={recoveryLoading}
                        className="gc-btn w-full py-3 rounded-lg text-sm font-medium disabled:opacity-50"
                        style={{ background: COLORS.gold, color: "#052E36" }}
                      >
                        {recoveryLoading ? "Vérification…" : "Envoyer le code"}
                      </button>
                    </form>
                  )}

                  {recoveryStep === 2 && (
                    <form onSubmit={handleRecoveryVerifyCode}>
                      <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>
                        Un code à 6 chiffres a été envoyé à <strong>{maskEmail(recoveryEmail)}</strong>. Entre-le ci-dessous.
                      </p>
                      <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Code de vérification</label>
                      <input
                        value={recoveryCode}
                        onChange={(e) => setRecoveryCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="••••••"
                        className="w-full px-3.5 py-2.5 rounded-lg text-sm mb-2 outline-none gc-mono tracking-widest text-center"
                        style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                      />
                      <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>Le code expire après un court délai — clique sur "Renvoyer le code" si besoin.</p>
                      {recoveryError && <p className="text-xs mb-4" style={{ color: COLORS.danger }}>{recoveryError}</p>}
                      <button
                        type="submit"
                        disabled={recoveryLoading || recoveryCode.length !== 6}
                        className="gc-btn w-full py-3 rounded-lg text-sm font-medium disabled:opacity-50"
                        style={{ background: COLORS.gold, color: "#052E36" }}
                      >
                        {recoveryLoading ? "Vérification..." : "Vérifier le code"}
                      </button>
                      <button
                        type="button"
                        onClick={handleRecoveryRequestCode}
                        disabled={recoveryLoading}
                        className="w-full py-3 mt-2 rounded-lg text-sm disabled:opacity-50"
                        style={{ color: COLORS.textMuted }}
                      >
                        Renvoyer le code
                      </button>
                    </form>
                  )}

                  {recoveryStep === 3 && (
                    <form onSubmit={handleRecoveryReset}>
                      <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Nouveau mot de passe</label>
                      <div className="mb-4">
                        <PasswordInput
                          value={recoveryNewPassword}
                          onChange={(e) => setRecoveryNewPassword(e.target.value)}
                          placeholder="••••••••"
                          colors={COLORS}
                        />
                      </div>
                      <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Confirmer le mot de passe</label>
                      <div className="mb-4">
                        <PasswordInput
                          value={recoveryConfirmPassword}
                          onChange={(e) => setRecoveryConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          colors={COLORS}
                        />
                      </div>
                      {recoveryError && <p className="text-xs mb-4" style={{ color: COLORS.danger }}>{recoveryError}</p>}
                      <button
                        type="submit"
                        disabled={recoveryLoading}
                        className="gc-btn w-full py-3 rounded-lg text-sm font-medium disabled:opacity-50"
                        style={{ background: COLORS.gold, color: "#052E36" }}
                      >
                        {recoveryLoading ? "Enregistrement..." : "Réinitialiser le mot de passe"}
                      </button>
                    </form>
                  )}

                  {recoveryStep === 4 && (
                    <div>
                      <div
                        className="flex items-center gap-2 p-4 rounded-lg mb-4 text-sm"
                        style={{ background: "rgba(43,191,138,0.1)", color: COLORS.teal }}
                      >
                        <CheckCircle2 size={16} /> Mot de passe réinitialisé avec succès.
                      </div>
                      <button
                        onClick={backToLoginFromRecovery}
                        className="gc-btn w-full py-3 rounded-lg text-sm font-medium"
                        style={{ background: COLORS.gold, color: "#052E36" }}
                      >
                        Retour à la connexion
                      </button>
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs mt-5" style={{ color: COLORS.textMuted }}>
                Simulation — aucune donnée n'est enregistrée ni transmise. En production, ceci serait relié à un vrai système d'authentification sécurisé.
              </p>
            </div>
          </div>
        ) : (
        <>
        {newAgencyCode && (
          <div
            className="flex items-center justify-between gap-3 p-4 rounded-xl mb-4"
            style={{ background: "rgba(232,169,59,0.1)", border: `1px solid ${COLORS.gold}` }}
          >
            <div className="text-sm">
              <span className="font-medium">Ton code d'agence : </span>
              <span className="gc-mono" style={{ color: COLORS.goldSoft }}>{newAgencyCode}</span>
              <div className="text-xs mt-1" style={{ color: COLORS.textMuted }}>
                Donne ce code à tes agents pour qu'ils rejoignent ton équipe à l'inscription.
              </div>
            </div>
            <button onClick={() => setNewAgencyCode("")} aria-label="Fermer" style={{ color: COLORS.textMuted }}>
              <X size={16} />
            </button>
          </div>
        )}
        {/* Agent greeting */}
        <div
          className="flex items-center justify-between p-4 rounded-xl mb-6"
          style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{ background: COLORS.gold, color: "#052E36" }}
              className="w-9 h-9 rounded-full flex items-center justify-center font-semibold gc-display"
            >
              {agent?.name?.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-medium flex items-center gap-2">
                Bonjour, {agent?.name}
                {agent?.role === "manager" && (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(232,169,59,0.15)", color: COLORS.goldSoft }}
                  >
                    <Crown size={10} /> Chef d'agence
                  </span>
                )}
              </div>
              <div className="text-xs" style={{ color: COLORS.textMuted }}>{agent?.agency}</div>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-xs" style={{ color: COLORS.textMuted }}>Solde disponible</div>
            <div className="gc-mono text-sm font-medium" style={{ color: floatBalance < 50000 ? COLORS.danger : COLORS.text }}>
              {formatFCFA(floatBalance)}
            </div>
          </div>
          <button onClick={handleLogout} className="md:hidden gc-btn text-xs flex items-center gap-1" style={{ color: COLORS.textMuted }}>
            <LogOut size={13} /> Déconnexion
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: "dashboard", label: "Tableau de bord", icon: BarChart3 },
            { id: "kyc", label: kycVerified ? "Vérification KYC" : "Vérification KYC ⚠", icon: kycVerified ? FileCheck : AlertTriangle },
            { id: "transaction", label: "Nouvelle transaction", icon: ArrowRightLeft },
            { id: "historique", label: "Historique", icon: Clock },
            ...(agent?.isPlatformOwner ? [{ id: "annonceur", label: "Annonceur", icon: Megaphone }] : []),
            { id: "publicites", label: "Publicités", icon: Megaphone },
            { id: "parrainage", label: "Parrainage", icon: Users },
            {
              id: "abonnement",
              label: hasFullAccess ? "Abonnement" : "Abonnement ⚠",
              icon: hasFullAccess ? CreditCard : Lock,
            },
            ...(agent?.role === "manager" ? [{ id: "equipe", label: "Équipe", icon: Crown }, { id: "kyc-review", label: "Vérifications KYC", icon: Fingerprint }] : []),
            ...(agent?.isPlatformOwner
              ? [
                  { id: "kyc-review-managers", label: "Vérif. chefs d'agence", icon: ShieldCheck },
                  { id: "backoffice-pub", label: "Backoffice publicité", icon: BarChart3 },
                  { id: "backoffice-abonnements", label: "Backoffice abonnements", icon: CreditCard },
                ]
              : []),
            { id: "parametres", label: "Paramètres", icon: Settings },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="gc-btn flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium"
              style={
                tab === t.id
                  ? { background: COLORS.gold, color: "#052E36" }
                  : { background: COLORS.surface, color: COLORS.textMuted, border: `1px solid ${COLORS.surfaceLine}` }
              }
            >
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        {/* Bandeau abonnement à activer */}
        {!hasFullAccess && !agent?.isPlatformOwner && (
          <div
            className="flex items-center justify-between gap-3 p-3.5 rounded-xl mb-4"
            style={{ background: "rgba(232,169,59,0.1)", border: `1px solid ${COLORS.gold}` }}
          >
            <div className="flex items-center gap-2 text-sm">
              <Lock size={15} style={{ color: COLORS.goldSoft }} />
              Ton abonnement de {formatFCFA(getSubscriptionAmount(subscription, agent?.role))} (valable 6 mois) n'est pas encore actif.
            </div>
            <button
              onClick={() => setTab("abonnement")}
              className="gc-btn text-xs font-medium px-3 py-1.5 rounded-lg"
              style={{ background: COLORS.gold, color: "#052E36" }}
            >
              Activer maintenant
            </button>
          </div>
        )}

        {/* Transaction tab */}
        {["dashboard", "transaction", "historique"].includes(tab) && !hasFullAccess ? (
          <div className="gc-fade-in flex flex-col items-center justify-center text-center py-16 px-6 rounded-xl" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(232,169,59,0.15)" }}>
              <Lock size={22} style={{ color: COLORS.goldSoft }} />
            </div>
            <div className="text-base font-semibold mb-2">Abonnement requis</div>
            <p className="text-sm mb-5 max-w-md" style={{ color: COLORS.textMuted }}>
              Pour utiliser EmpireGuichet (transactions, tableau de bord, historique), active ton abonnement de {formatFCFA(getSubscriptionAmount(subscription, agent?.role))}, valable 6 mois.
            </p>
            <button
              onClick={() => setTab("abonnement")}
              className="gc-btn flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium"
              style={{ background: COLORS.gold, color: "#052E36" }}
            >
              <CreditCard size={15} /> Activer mon abonnement
            </button>
          </div>
        ) : tab === "dashboard" && (
          <div className="gc-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Transactions aujourd'hui", value: history.length },
                { label: "Volume traité", value: formatFCFA(todayVolume) },
                { label: "Solde disponible", value: formatFCFA(floatBalance), warn: floatBalance < 50000 },
                { label: "Commissions du jour", value: formatFCFA(todayCommission), teal: true },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-xl" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
                  <div className="text-xs mb-1.5" style={{ color: COLORS.textMuted }}>{s.label}</div>
                  <div
                    className="gc-display gc-mono text-lg md:text-xl font-semibold"
                    style={{ color: s.warn ? COLORS.danger : s.teal ? COLORS.teal : COLORS.text }}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            {activePublicites.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-medium mb-3" style={{ color: COLORS.textMuted }}>PUBLICITÉS SUR LA PLATEFORME</div>
                <div className="space-y-2">
                  {activePublicites.map((ad) => (
                    <div
                      key={ad.id}
                      onClick={() => setSelectedAdPreview(ad)}
                      className="rounded-lg overflow-hidden cursor-pointer flex items-center"
                      style={{ height: 88, background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
                    >
                      {ad.image_url ? (
                        <img src={ad.image_url} alt={ad.title} className="h-full object-cover flex-shrink-0" style={{ width: 88 }} />
                      ) : (
                        <div className="h-full flex items-center justify-center flex-shrink-0" style={{ width: 88, background: COLORS.bgSoft }}>
                          <Megaphone size={18} style={{ color: COLORS.surfaceLine }} />
                        </div>
                      )}
                      <div className="p-3 min-w-0">
                        <div className="text-sm font-medium truncate">{ad.title}</div>
                        <p className="text-xs truncate" style={{ color: COLORS.textMuted }}>{ad.description}</p>
                        <div className="text-xs mt-1 flex items-center gap-1" style={{ color: COLORS.gold }}>
                          <Phone size={10} /> {ad.contact_phone}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="p-5 rounded-xl" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
                <div className="text-sm font-medium mb-4">Tendance sur 7 jours</div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={[...PAST_DAYS, { day: "Aujourd'hui", volume: todayVolume }]}>
                    <defs>
                      <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLORS.gold} stopOpacity={0.45} />
                        <stop offset="100%" stopColor={COLORS.gold} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={COLORS.chartGrid} strokeDasharray="3 4" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.surfaceLine }} tickLine={false} />
                    <YAxis
                      tick={{ fill: COLORS.textMuted, fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                      width={38}
                    />
                    <Tooltip
                      contentStyle={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: COLORS.text }}
                      formatter={(v) => [formatFCFA(v), "Volume"]}
                    />
                    <Area type="monotone" dataKey="volume" stroke={COLORS.gold} strokeWidth={2} fill="url(#volGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="p-5 rounded-xl" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
                <div className="text-sm font-medium mb-4">Volume par service — aujourd'hui</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={NETWORKS.map((n) => ({ name: n.letter, volume: history.filter((h) => h.net === n.id).reduce((s, h) => s + h.amount, 0), color: n.color }))}>
                    <CartesianGrid stroke={COLORS.chartGrid} strokeDasharray="3 4" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: 10 }} axisLine={{ stroke: COLORS.surfaceLine }} tickLine={false} />
                    <YAxis
                      tick={{ fill: COLORS.textMuted, fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                      width={38}
                    />
                    <Tooltip
                      contentStyle={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: COLORS.text }}
                      formatter={(v) => [formatFCFA(v), "Volume"]}
                    />
                    <Bar dataKey="volume" radius={[6, 6, 0, 0]}>
                      {NETWORKS.map((n) => (
                        <Cell key={n.id} fill={n.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <p className="text-xs" style={{ color: COLORS.textMuted }}>
              La tendance sur 7 jours utilise des données simulées pour les 6 jours passés ; seule la colonne "Aujourd'hui" reflète tes transactions réelles de cette session.
            </p>
          </div>
        )}

        {tab === "kyc" && (
          <div className="gc-fade-in max-w-3xl">
            {/* Étape email */}
            <div className="p-6 rounded-xl mb-4" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
              <div className="flex items-center gap-2 mb-1">
                <Mail size={16} style={{ color: COLORS.goldSoft }} />
                <span className="text-sm font-medium">Vérifier ton adresse Gmail</span>
                {agent?.kycEmailVerified && <CheckCircle2 size={15} style={{ color: COLORS.teal }} />}
              </div>
              <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>{agent?.email || "Aucune adresse renseignée"}</p>

              {agent?.kycEmailVerified ? (
                <div className="flex items-center gap-2 p-3 rounded-lg text-xs" style={{ background: "rgba(43,191,138,0.1)", color: COLORS.teal }}>
                  <CheckCircle2 size={14} /> Adresse vérifiée
                </div>
              ) : !kycEmailSent ? (
                <form onSubmit={handleKycSendCode}>
                  <button
                    type="submit"
                    className="gc-btn w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium"
                    style={{ background: COLORS.gold, color: "#052E36" }}
                  >
                    <Send size={14} /> Envoyer le code de vérification
                  </button>
                </form>
              ) : (
                <form onSubmit={handleKycVerifyEmail}>
                  <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Code reçu par Gmail</label>
                  <input
                    value={kycEmailCode}
                    onChange={(e) => setKycEmailCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="••••••"
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm mb-2 outline-none gc-mono tracking-widest text-center"
                    style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                  />
                  <p className="text-xs mb-3" style={{ color: COLORS.textMuted }}>Code démo : {DEMO_KYC_CODE}</p>
                  {kycEmailError && <p className="text-xs mb-3" style={{ color: COLORS.danger }}>{kycEmailError}</p>}
                  <button
                    type="submit"
                    className="gc-btn w-full py-2.5 rounded-lg text-sm font-medium"
                    style={{ background: COLORS.gold, color: "#052E36" }}
                  >
                    Vérifier le code
                  </button>
                </form>
              )}
            </div>

            {/* Étape profil */}
            <div className="p-6 rounded-xl mb-4" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
              <div className="flex items-center gap-2 mb-1">
                <User size={16} style={{ color: COLORS.goldSoft }} />
                <span className="text-sm font-medium">Complétez votre profil</span>
                {kycProfileDone && <CheckCircle2 size={15} style={{ color: COLORS.teal }} />}
              </div>
              <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>Ces informations doivent correspondre à ta pièce d'identité.</p>

              {kycProfileDone ? (
                <div className="flex items-center gap-2 p-3 rounded-lg text-xs" style={{ background: "rgba(43,191,138,0.1)", color: COLORS.teal }}>
                  <CheckCircle2 size={14} /> Profil complété — {agent.firstName} {agent.lastName}
                </div>
              ) : (
                <form onSubmit={handleKycSaveProfile} className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Prénom</label>
                    <input
                      value={kycFirstName}
                      onChange={(e) => setKycFirstName(e.target.value)}
                      placeholder="Ex. Awa"
                      className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                      style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                    />
                  </div>
                  <div>
                    <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Nom</label>
                    <input
                      value={kycLastName}
                      onChange={(e) => setKycLastName(e.target.value)}
                      placeholder="Ex. Koné"
                      className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                      style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                    />
                  </div>
                  <div>
                    <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Pays</label>
                    <CountryDropdown value={kycCountry} onChange={setKycCountry} colors={COLORS} showLabel width="100%" />
                  </div>
                  <div>
                    <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Date de naissance</label>
                    <input
                      type="date"
                      value={kycDob}
                      onChange={(e) => setKycDob(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                      style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Adresse de résidence</label>
                    <input
                      value={kycAddress}
                      onChange={(e) => setKycAddress(e.target.value)}
                      placeholder="Ex. Rue des Jardins, Cocody, Abidjan"
                      className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                      style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Numéro d'identité (CNI, passeport...)</label>
                    <input
                      value={kycIdNumber}
                      onChange={(e) => setKycIdNumber(e.target.value)}
                      placeholder="Ex. CI0012345678"
                      className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none gc-mono"
                      style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                    />
                  </div>
                  {kycProfileError && <p className="md:col-span-2 text-xs" style={{ color: COLORS.danger }}>{kycProfileError}</p>}
                  <button
                    type="submit"
                    className="md:col-span-2 gc-btn py-2.5 rounded-lg text-sm font-medium"
                    style={{ background: COLORS.gold, color: "#052E36" }}
                  >
                    Enregistrer mon profil
                  </button>
                </form>
              )}
            </div>

            {/* Étape vérification d'identité */}
            <div className="p-6 rounded-xl mb-4" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
              <div className="flex items-center gap-2 mb-4">
                <Fingerprint size={16} style={{ color: COLORS.goldSoft }} />
                <span className="text-sm font-medium">Vérification d'identité</span>
              </div>

              {/* Stepper */}
              <div className="flex items-center mb-6">
                {[
                  { n: 1, label: "Documents" },
                  { n: 2, label: "Vérification" },
                  { n: 3, label: "Validé" },
                ].map((s, i) => {
                  const currentStep = kycStatus === "validated" ? 3 : kycStatus === "pending" ? 2 : 1;
                  const done = kycStatus === "validated" ? true : currentStep > s.n;
                  const active = currentStep === s.n && !done;
                  return (
                    <React.Fragment key={s.n}>
                      <div className="flex flex-col items-center" style={{ minWidth: 70 }}>
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold mb-1.5"
                          style={{
                            background: done || active ? COLORS.gold : COLORS.bgSoft,
                            color: done || active ? "#052E36" : COLORS.textMuted,
                            border: `1px solid ${done || active ? COLORS.gold : COLORS.surfaceLine}`,
                          }}
                        >
                          {done ? <Check size={14} /> : s.n}
                        </div>
                        <span className="text-[11px] text-center" style={{ color: active ? COLORS.text : COLORS.textMuted }}>{s.label}</span>
                      </div>
                      {i < 2 && (
                        <div style={{ flex: 1, height: 1, background: currentStep > s.n ? COLORS.gold : COLORS.surfaceLine, marginBottom: 18 }} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {kycStatus === "validated" ? (
                <div className="flex items-center gap-2 p-3 rounded-lg text-xs" style={{ background: "rgba(43,191,138,0.1)", color: COLORS.teal }}>
                  <CheckCircle2 size={14} /> Identité vérifiée et validée.
                </div>
              ) : kycStatus === "pending" ? (
                <div className="flex items-center gap-2 p-3 rounded-lg text-xs" style={{ background: "rgba(232,169,59,0.1)", color: COLORS.goldSoft }}>
                  <Clock size={14} /> En attente de vérification par ton chef d'agence — délai habituel jusqu'à 24h.
                </div>
              ) : !kycProfileDone ? (
                <p className="text-xs" style={{ color: COLORS.textMuted }}>Complète d'abord ton profil ci-dessus pour continuer.</p>
              ) : (
                <>
                  {kycStatus === "rejected" && (
                    <div className="flex items-start gap-2 p-3 rounded-lg text-xs mb-4" style={{ background: "rgba(226,104,94,0.1)", color: COLORS.danger }}>
                      <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span>Documents refusés{agent?.kycRejectedReason ? ` — ${agent.kycRejectedReason}` : ""}. Renvoie des documents plus lisibles ci-dessous.</span>
                    </div>
                  )}
                  <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Type de document</label>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { id: "cni", label: "Pièce d'identité" },
                      { id: "permis", label: "Permis de conduire" },
                      { id: "passeport", label: "Passeport" },
                    ].map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setKycDocType(d.id)}
                        className="gc-btn py-2 rounded-lg text-xs font-medium"
                        style={
                          kycDocType === d.id
                            ? { background: COLORS.gold, color: "#052E36" }
                            : { background: COLORS.bgSoft, color: COLORS.textMuted, border: `1px solid ${COLORS.surfaceLine}` }
                        }
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>

                  <div className={`grid ${kycDocType === "passeport" ? "grid-cols-1" : "grid-cols-2"} gap-2 mb-3`}>
                    <label
                      className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-lg cursor-pointer"
                      style={{ background: COLORS.bgSoft, border: `1px dashed ${COLORS.surfaceLine}` }}
                    >
                      <Upload size={18} style={{ color: COLORS.textMuted }} />
                      <span className="text-[11px] text-center" style={{ color: COLORS.textMuted }}>
                        {kycIdRectoName || (kycDocType === "passeport" ? "Page principale" : "Recto")}
                      </span>
                      <input type="file" accept="image/*,.pdf" onChange={(e) => handleKycFileUpload("recto", e)} className="hidden" />
                    </label>
                    {kycDocType !== "passeport" && (
                      <label
                        className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-lg cursor-pointer"
                        style={{ background: COLORS.bgSoft, border: `1px dashed ${COLORS.surfaceLine}` }}
                      >
                        <Upload size={18} style={{ color: COLORS.textMuted }} />
                        <span className="text-[11px] text-center" style={{ color: COLORS.textMuted }}>
                          {kycIdVersoName || "Verso"}
                        </span>
                        <input type="file" accept="image/*,.pdf" onChange={(e) => handleKycFileUpload("verso", e)} className="hidden" />
                      </label>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <label
                      className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-lg cursor-pointer"
                      style={{ background: COLORS.bgSoft, border: `1px dashed ${COLORS.surfaceLine}` }}
                    >
                      <Camera size={18} style={{ color: COLORS.textMuted }} />
                      <span className="text-[11px] text-center" style={{ color: COLORS.textMuted }}>
                        {kycSelfieName || "Selfie"}
                      </span>
                      <input type="file" accept="image/*" onChange={(e) => handleKycFileUpload("selfie", e)} className="hidden" />
                    </label>
                    <label
                      className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-lg cursor-pointer"
                      style={{ background: COLORS.bgSoft, border: `1px dashed ${COLORS.surfaceLine}` }}
                    >
                      <Camera size={18} style={{ color: COLORS.textMuted }} />
                      <span className="text-[11px] text-center" style={{ color: COLORS.textMuted }}>
                        {kycSelfieIdName || "Selfie avec pièce"}
                      </span>
                      <input type="file" accept="image/*" onChange={(e) => handleKycFileUpload("selfieId", e)} className="hidden" />
                    </label>
                  </div>

                  {(kycIdRectoPreview || kycIdVersoPreview || kycSelfiePreview || kycSelfieIdPreview) && (
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {[kycIdRectoPreview, kycIdVersoPreview, kycSelfiePreview, kycSelfieIdPreview].filter(Boolean).map((src, i) => (
                        <img key={i} src={src} alt="Aperçu document" className="w-full rounded-lg" style={{ height: 70, objectFit: "cover" }} />
                      ))}
                    </div>
                  )}

                  {kycIdError && <p className="text-xs mb-3" style={{ color: COLORS.danger }}>{kycIdError}</p>}
                  <button
                    onClick={handleKycSubmitDocuments}
                    disabled={kycUploading}
                    className="gc-btn w-full py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                    style={{ background: COLORS.gold, color: "#052E36" }}
                  >
                    {kycUploading ? "Envoi en cours…" : "Envoyer pour vérification"}
                  </button>
                </>
              )}
            </div>

            {kycVerified && (
              <div
                className="flex items-center gap-2 p-4 rounded-xl text-sm mb-4"
                style={{ background: "rgba(43,191,138,0.1)", color: COLORS.teal, border: `1px solid ${COLORS.surfaceLine}` }}
              >
                <CheckCircle2 size={16} /> Vérification KYC complète — tu peux maintenant effectuer des transactions.
              </div>
            )}

            <p className="text-xs mb-1" style={{ color: COLORS.textMuted }}>
              <MapPin size={11} className="inline mr-1" />
              Justificatif de domicile : pas d'étape séparée pour l'instant — ton adresse Gmail et ton numéro de téléphone déjà fournis serviront à cette vérification.
            </p>
            <p className="text-xs" style={{ color: COLORS.textMuted }}>
              Simulation — aucun document n'est réellement transmis ou stocké. En production, la vérification serait confiée à un prestataire agréé et prendrait jusqu'à 24h.
            </p>
          </div>
        )}

        {tab === "transaction" && hasFullAccess && !kycVerified && (
          <div className="gc-fade-in p-8 rounded-xl text-center" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
            <AlertTriangle size={28} style={{ color: COLORS.goldSoft, margin: "0 auto 12px" }} />
            <p className="text-sm font-medium mb-2">Vérification KYC requise</p>
            <p className="text-xs mb-5" style={{ color: COLORS.textMuted, maxWidth: 380, margin: "0 auto 20px" }}>
              Pour la sécurité des transactions, tu dois d'abord vérifier ton adresse Gmail et envoyer une pièce d'identité.
            </p>
            <button
              onClick={() => setTab("kyc")}
              className="gc-btn px-5 py-2.5 rounded-lg text-sm font-medium"
              style={{ background: COLORS.gold, color: "#052E36" }}
            >
              Compléter la vérification KYC
            </button>
          </div>
        )}

        {tab === "transaction" && hasFullAccess && kycVerified && (
          <div className="grid md:grid-cols-2 gap-6 gc-fade-in">
            <form
              onSubmit={handleSubmit}
              className="p-6 rounded-xl"
              style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
            >
              <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Réseau</label>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {NETWORKS.map((n) => (
                  <button
                    type="button"
                    key={n.id}
                    onClick={() => setSelectedNetwork(n.id)}
                    className="gc-btn flex flex-col items-center gap-1.5 p-2.5 rounded-lg"
                    style={{
                      background: selectedNetwork === n.id ? COLORS.surfaceLine : "transparent",
                      border: `1px solid ${selectedNetwork === n.id ? COLORS.gold : COLORS.surfaceLine}`,
                    }}
                  >
                    <NetworkBadge net={n} size={30} colors={COLORS} />
                    <span className="text-[11px]" style={{ color: COLORS.text }}>{n.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>

              {(net.type === "momo" || net.type === "crypto") && (
                <>
                  <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Type d'opération</label>
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    <button
                      type="button"
                      onClick={() => setTxDirection("depot")}
                      className="gc-btn flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium"
                      style={
                        txDirection === "depot"
                          ? { background: COLORS.deposit, color: "#ffffff" }
                          : { background: COLORS.bgSoft, color: COLORS.textMuted, border: `1px solid ${COLORS.surfaceLine}` }
                      }
                    >
                      <ArrowUpCircle size={14} /> Dépôt (envoi)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTxDirection("retrait")}
                      className="gc-btn flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium"
                      style={
                        txDirection === "retrait"
                          ? { background: COLORS.withdraw, color: "#ffffff" }
                          : { background: COLORS.bgSoft, color: COLORS.textMuted, border: `1px solid ${COLORS.surfaceLine}` }
                      }
                    >
                      <ArrowDownCircle size={14} /> Retrait (réception)
                    </button>
                  </div>
                  <p className="text-xs mb-5 -mt-3" style={{ color: COLORS.textMuted }}>
                    {txDirection === "depot"
                      ? "Le client te donne du cash, tu lui envoies du mobile money."
                      : "Le client te donne du mobile money, tu lui remets du cash."}
                  </p>
                </>
              )}

              <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>
                {NETWORK_TYPE_LABELS[net.type].field}
              </label>
              {net.type === "momo" && (
                <div className="mb-2">
                  <CountryDropdown value={txCountryCode} onChange={setTxCountryCode} colors={COLORS} width="100%" />
                </div>
              )}
              <input
                value={phone}
                onChange={(e) =>
                  setPhone(net.type === "momo" ? sanitizePhoneDigits(e.target.value, txCountryCode) : e.target.value)
                }
                placeholder={NETWORK_TYPE_LABELS[net.type].placeholder}
                maxLength={net.type === "momo" ? (COUNTRY_CODES.find((c) => c.code === txCountryCode)?.phoneLength || 10) : undefined}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm mb-5 outline-none"
                style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
              />

              <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Montant (FCFA)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="10000"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm mb-5 outline-none gc-mono"
                style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
              />

              {amtNum > 0 && (
                <div style={{ borderTop: `1px dashed ${COLORS.surfaceLine}` }} className="pt-3 mb-5 text-sm">
                  <div className="flex justify-between mb-1" style={{ color: COLORS.textMuted }}>
                    <span>Frais ({(net.fee * 100).toFixed(1)}%)</span>
                    <span className="gc-mono">{formatFCFA(fee)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="gc-mono">{formatFCFA(total)}</span>
                  </div>
                  {net.id === "crypto" && (
                    <div className="flex justify-between mt-1 text-xs" style={{ color: COLORS.textMuted }}>
                      <span>≈ en USDT (taux simulé)</span>
                      <span className="gc-mono">{(amtNum / FCFA_PER_USDT).toFixed(2)} USDT</span>
                    </div>
                  )}
                </div>
              )}

              {formError && (
                <p className="text-xs mb-3" style={{ color: COLORS.danger }}>{formError}</p>
              )}

              <button
                type="submit"
                disabled={!amtNum || !phone || pending}
                className="gc-btn w-full py-3 rounded-lg text-sm font-medium disabled:opacity-40"
                style={{ background: COLORS.gold, color: "#052E36" }}
              >
                {pending ? "Traitement en cours…" : "Continuer — confirmer par PIN"}
              </button>
            </form>

            {/* Ticket preview */}
            <div>
              <div
                className="p-4 rounded-xl mb-4 grid grid-cols-2 gap-3"
                style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
              >
                <div>
                  <div className="text-xs mb-1" style={{ color: COLORS.textMuted }}>Transactions aujourd'hui</div>
                  <div className="gc-display gc-mono text-xl font-semibold">{history.length}</div>
                </div>
                <div>
                  <div className="text-xs mb-1" style={{ color: COLORS.textMuted }}>Volume traité</div>
                  <div className="gc-display gc-mono text-xl font-semibold">
                    {formatFCFA(todayVolume)}
                  </div>
                </div>
                <div style={{ borderTop: `1px dashed ${COLORS.surfaceLine}` }} className="pt-3">
                  <div className="text-xs mb-1" style={{ color: COLORS.textMuted }}>Solde disponible</div>
                  <div className="gc-display gc-mono text-xl font-semibold" style={{ color: floatBalance < 50000 ? COLORS.danger : COLORS.text }}>
                    {formatFCFA(floatBalance)}
                  </div>
                </div>
                <div style={{ borderTop: `1px dashed ${COLORS.surfaceLine}` }} className="pt-3">
                  <div className="text-xs mb-1" style={{ color: COLORS.textMuted }}>Commissions du jour</div>
                  <div className="gc-display gc-mono text-xl font-semibold" style={{ color: COLORS.teal }}>
                    {formatFCFA(todayCommission)}
                  </div>
                </div>
              </div>
              <div
                className="p-5 rounded-xl mb-4"
                style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
              >
                <div className="text-xs mb-3" style={{ color: COLORS.textMuted }}>APERÇU DU TICKET</div>
                <div className="flex items-center gap-3 mb-3">
                  <NetworkBadge net={net} colors={COLORS} />
                  <div>
                    <div className="text-sm font-medium flex items-center gap-2">
                      {net.name}
                      {(net.type === "momo" || net.type === "crypto") && (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full"
                          style={
                            txDirection === "retrait"
                              ? { background: "rgba(232,147,90,0.15)", color: COLORS.withdraw }
                              : { background: "rgba(43,191,138,0.15)", color: COLORS.deposit }
                          }
                        >
                          {txDirection === "retrait" ? "Retrait" : "Dépôt"}
                        </span>
                      )}
                    </div>
                    <div className="text-xs gc-mono" style={{ color: COLORS.textMuted }}>
                      {phone || "—"}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: COLORS.textMuted }}>Montant</span>
                  <span className="gc-mono">{amtNum ? formatFCFA(amtNum) : "—"}</span>
                </div>
              </div>

              {pending && (
                <div
                  className="gc-fade-in flex items-center gap-2 p-4 rounded-xl text-sm"
                  style={{ background: "rgba(59,130,246,0.1)", color: COLORS.transfer, border: `1px solid ${COLORS.transfer}` }}
                >
                  <Clock size={16} className="animate-pulse" /> Transaction <TicketNumber n={pending.id} /> en cours…
                </div>
              )}
            </div>
          </div>
        )}

        {/* Historique tab */}
        {tab === "historique" && hasFullAccess && !historyUnlockedThisPeriod && (
          <div className="gc-fade-in flex flex-col items-center justify-center text-center py-16 px-6 rounded-xl" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(43,191,138,0.12)" }}>
              <Clock size={22} style={{ color: COLORS.teal }} />
            </div>
            <div className="text-base font-semibold mb-2">Historique de cette période</div>
            <p className="text-sm mb-5 max-w-md" style={{ color: COLORS.textMuted }}>
              L'accès à l'historique détaillé de tes transactions est débloqué tous les 2 mois pour {formatFCFA(HISTORY_UNLOCK_PRICE)}.
            </p>
            <button
              onClick={() => setTab("abonnement")}
              className="gc-btn flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium"
              style={{ background: COLORS.teal, color: "#052E36" }}
            >
              <Clock size={15} /> Débloquer l'historique — {formatFCFA(HISTORY_UNLOCK_PRICE)}
            </button>
          </div>
        )}

        {tab === "historique" && hasFullAccess && historyUnlockedThisPeriod && (
          <div className="gc-fade-in">
            <div className="flex flex-col md:flex-row gap-2 mb-4">
              <div className="relative flex-1">
                <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: COLORS.textMuted }} />
                <input
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Rechercher par numéro / référence…"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                />
              </div>
              <select
                value={historyNetworkFilter}
                onChange={(e) => setHistoryNetworkFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
              >
                <option value="all">Tous les services</option>
                {NETWORKS.map((n) => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
              </select>
              <select
                value={historyStatusFilter}
                onChange={(e) => setHistoryStatusFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
              >
                <option value="all">Tous les statuts</option>
                <option value="Terminé">Terminé</option>
                <option value="En cours">En cours</option>
              </select>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={exportHistoryExcel}
                className="gc-btn flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border"
                style={{ borderColor: COLORS.surfaceLine, color: COLORS.text }}
              >
                <Table size={13} /> Exporter en Excel
              </button>
              <button
                onClick={exportHistoryPDF}
                className="gc-btn flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border"
                style={{ borderColor: COLORS.surfaceLine, color: COLORS.text }}
              >
                <FileText size={13} /> Exporter en PDF
              </button>
            </div>

            {(historySearch || historyNetworkFilter !== "all" || historyStatusFilter !== "all") && (
              <div className="flex items-center gap-2 mb-3 text-xs" style={{ color: COLORS.textMuted }}>
                <Filter size={12} />
                {filteredHistory.length} résultat{filteredHistory.length > 1 ? "s" : ""}
                <button
                  onClick={() => { setHistorySearch(""); setHistoryNetworkFilter("all"); setHistoryStatusFilter("all"); }}
                  className="underline"
                  style={{ color: COLORS.goldSoft }}
                >
                  Réinitialiser
                </button>
              </div>
            )}

          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${COLORS.surfaceLine}` }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: COLORS.surface, color: COLORS.textMuted }}>
                  <th className="text-left font-normal px-4 py-3">Ticket</th>
                  <th className="text-left font-normal px-4 py-3">Réseau</th>
                  <th className="text-left font-normal px-4 py-3">Type</th>
                  <th className="text-left font-normal px-4 py-3">Numéro</th>
                  <th className="text-right font-normal px-4 py-3">Montant</th>
                  <th className="text-left font-normal px-4 py-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm" style={{ color: COLORS.textMuted }}>
                      Aucune transaction ne correspond à ces filtres.
                    </td>
                  </tr>
                )}
                {filteredHistory.map((h) => {
                  const n = NETWORKS.find((x) => x.id === h.net);
                  return (
                    <tr key={h.id} style={{ borderTop: `1px solid ${COLORS.surfaceLine}` }}>
                      <td className="px-4 py-3 gc-mono text-xs" style={{ color: COLORS.textMuted }}><TicketNumber n={h.id} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <NetworkBadge net={n} size={24} colors={COLORS} />
                          {n.name}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {h.direction === "paiement" ? (
                          <span className="text-xs" style={{ color: COLORS.textMuted }}>Paiement</span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md"
                            style={
                              h.direction === "retrait"
                                ? { background: "rgba(232,147,90,0.12)", color: COLORS.withdraw }
                                : { background: "rgba(43,191,138,0.12)", color: COLORS.deposit }
                            }
                          >
                            {h.direction === "retrait" ? <ArrowDownCircle size={12} /> : <ArrowUpCircle size={12} />}
                            {h.direction === "retrait" ? "Retrait" : "Dépôt"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 gc-mono text-xs" style={{ color: COLORS.textMuted }}>{h.phone}</td>
                      <td className="px-4 py-3 text-right gc-mono">{formatFCFA(h.amount)}</td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md"
                          style={
                            h.status === "Terminé"
                              ? { background: "rgba(43,191,138,0.12)", color: COLORS.teal }
                              : { background: "rgba(59,130,246,0.14)", color: COLORS.transfer }
                          }
                        >
                          {h.status === "Terminé" ? <CheckCircle2 size={12} /> : <Clock size={12} />} {h.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          </div>
        )}

        {/* Publicités tab — visible à tous les agents et chefs d'agence */}
        {tab === "publicites" && (
          <div className="gc-fade-in">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-1">Publicités sur la plateforme</h2>
              <p className="text-xs" style={{ color: COLORS.textMuted, maxWidth: 620 }}>
                Découvre les annonces en ligne, ou publie la tienne pour la faire apparaître auprès de tous les agents et chefs d'agence.
              </p>
            </div>

            {/* Pubs actives */}
            <div>
              <div className="text-xs font-medium mb-3" style={{ color: COLORS.textMuted }}>ANNONCES EN LIGNE</div>
              {adsLoading ? (
                <div className="text-xs" style={{ color: COLORS.textMuted }}>Chargement…</div>
              ) : activePublicites.length === 0 ? (
                <div className="p-5 rounded-xl text-xs" style={{ background: COLORS.surface, border: `1px dashed ${COLORS.surfaceLine}`, color: COLORS.textMuted }}>
                  Aucune publicité en ligne pour le moment.
                </div>
              ) : (
                <div className="space-y-2">
                  {activePublicites.map((ad) => (
                    <div
                      key={ad.id}
                      onClick={() => setSelectedAdPreview(ad)}
                      className="rounded-lg overflow-hidden cursor-pointer flex items-center"
                      style={{ height: 88, background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
                    >
                      {ad.image_url ? (
                        <img src={ad.image_url} alt={ad.title} className="h-full object-cover flex-shrink-0" style={{ width: 88 }} />
                      ) : (
                        <div className="h-full flex items-center justify-center flex-shrink-0" style={{ width: 88, background: COLORS.bgSoft }}>
                          <Megaphone size={18} style={{ color: COLORS.surfaceLine }} />
                        </div>
                      )}
                      <div className="p-3 min-w-0">
                        <div className="text-sm font-medium truncate">{ad.title}</div>
                        <p className="text-xs truncate" style={{ color: COLORS.textMuted }}>{ad.description}</p>
                        <div className="text-xs mt-1 flex items-center gap-1" style={{ color: COLORS.gold }}>
                          <Phone size={10} /> {ad.contact_phone}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Publier une publicité (payant pour agents/chefs d'agence, gratuit pour le compte principal) */}
            <div className="p-5 rounded-xl my-6" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
              <div className="text-sm font-medium mb-3">Publier ma publicité</div>
              {adSuccessMsg && (
                <div className="text-xs p-3 rounded-lg mb-3 flex items-center gap-2" style={{ background: "rgba(43,191,138,0.12)", color: COLORS.teal }}>
                  <CheckCircle2 size={14} /> {adSuccessMsg}
                </div>
              )}
              {adFormError && (
                <div className="text-xs p-3 rounded-lg mb-3" style={{ background: "rgba(226,104,94,0.12)", color: COLORS.danger }}>
                  {adFormError}
                </div>
              )}
              <form onSubmit={(e) => handleSubmitAd(e, "publicite")} className="flex flex-col gap-3">
                <input
                  value={adForm.title}
                  onChange={(e) => setAdForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Titre de l'annonce"
                  className="px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                />
                <textarea
                  value={adForm.description}
                  onChange={(e) => setAdForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Description courte"
                  rows={3}
                  className="px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
                  style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                />
                <div>
                  <input
                    value={adForm.contactPhone}
                    onChange={(e) => setAdForm((f) => ({ ...f, contactPhone: e.target.value }))}
                    placeholder="+225 01 02 03 04 05 ou email@gmail.com"
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                  />
                  <div className="text-xs mt-1" style={{ color: COLORS.textMuted }}>
                    Numéro avec indicatif pays (ex. +225 01 02 03 04 05) ou une adresse e-mail.
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-2" style={{ color: COLORS.textMuted }}>Image de la publicité (optionnel)</div>
                  {adImagePreview ? (
                    <div className="relative w-full mb-2" style={{ height: 140 }}>
                      <img src={adImagePreview} alt="Aperçu" className="w-full h-full object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => { setAdImageFile(null); setAdImagePreview(""); }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label
                      className="flex flex-col items-center justify-center gap-1.5 py-5 rounded-lg cursor-pointer text-xs"
                      style={{ background: COLORS.bgSoft, border: `1px dashed ${COLORS.surfaceLine}`, color: COLORS.textMuted }}
                    >
                      <ImageIcon size={18} />
                      Ajouter une image (JPG, PNG)
                      <input type="file" accept="image/*" onChange={handleAdImageChange} className="hidden" />
                    </label>
                  )}
                </div>
                <div>
                  <div className="text-xs mb-2" style={{ color: COLORS.textMuted }}>Durée de diffusion</div>
                  <div className="grid grid-cols-3 gap-2">
                    {AD_PRICING.map((plan, i) => (
                      <button
                        type="button"
                        key={plan.days}
                        onClick={() => setAdForm((f) => ({ ...f, planIndex: i }))}
                        className="gc-btn py-2.5 rounded-lg text-xs font-medium"
                        style={
                          adForm.planIndex === i
                            ? { background: COLORS.gold, color: "#052E36" }
                            : { background: COLORS.bgSoft, color: COLORS.textMuted, border: `1px solid ${COLORS.surfaceLine}` }
                        }
                      >
                        {plan.label}<br />{agent?.isPlatformOwner ? "Gratuit" : formatFCFA(plan.price)}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={adSubmitting}
                  className="gc-btn py-3 rounded-lg text-sm font-medium mt-1"
                  style={{ background: COLORS.gold, color: "#052E36", opacity: adSubmitting ? 0.6 : 1 }}
                >
                  {adSubmitting
                    ? "Publication en cours…"
                    : agent?.isPlatformOwner
                    ? "Publier gratuitement"
                    : `Payer ${formatFCFA(AD_PRICING[adForm.planIndex].price)} et publier`}
                </button>
                <p className="text-xs" style={{ color: COLORS.textMuted }}>
                  {agent?.isPlatformOwner
                    ? "En tant que compte principal, tes publicités sont gratuites."
                    : "Paiement simulé pour cette démo — l'annonce passe en ligne immédiatement après confirmation."}
                </p>
              </form>
            </div>

            {/* Mes publicités */}
            {myAds.filter((a) => a.kind === "publicite").length > 0 && (
              <div>
                <div className="text-xs font-medium mb-3" style={{ color: COLORS.textMuted }}>MES PUBLICITÉS</div>
                <div className="flex flex-col gap-2">
                  {myAds.filter((a) => a.kind === "publicite").map((ad) => {
                    const isActive = ad.status === "active" && new Date(ad.ends_at) > new Date();
                    return (
                      <div key={ad.id} className="p-3.5 rounded-lg flex items-center gap-3" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
                        {ad.image_url ? (
                          <img src={ad.image_url} alt={ad.title} className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: COLORS.bgSoft }}>
                            <Megaphone size={16} style={{ color: COLORS.goldSoft }} />
                          </div>
                        )}
                        <div className="min-w-0 flex-1 flex items-center justify-between">
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">{ad.title}</div>
                            <div className="text-xs" style={{ color: COLORS.textMuted }}>
                              {formatFCFA(ad.amount_paid)} · {ad.duration_days} jours · expire le {new Date(ad.ends_at).toLocaleDateString("fr-FR")}
                            </div>
                          </div>
                          <span
                            className="text-xs px-2.5 py-1 rounded-md flex-shrink-0"
                            style={
                              isActive
                                ? { background: "rgba(43,191,138,0.12)", color: COLORS.teal }
                                : { background: COLORS.bgSoft, color: COLORS.textMuted }
                            }
                          >
                            {isActive ? "En ligne" : "Expirée"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Backoffice publicité — réservé au propriétaire de la plateforme */}
        {tab === "annonceur" && agent?.isPlatformOwner && (
          <div className="gc-fade-in">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-1">Annonceur</h2>
              <p className="text-xs" style={{ color: COLORS.textMuted }}>Visible uniquement par toi — seul le compte principal peut publier une annonce.</p>
            </div>

            {/* Publier une annonce */}
            <div className="p-5 rounded-xl mb-6" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
              <div className="text-sm font-medium mb-3">Publier une nouvelle annonce</div>
              {adSuccessMsg && (
                <div className="text-xs p-3 rounded-lg mb-3 flex items-center gap-2" style={{ background: "rgba(43,191,138,0.12)", color: COLORS.teal }}>
                  <CheckCircle2 size={14} /> {adSuccessMsg}
                </div>
              )}
              {adFormError && (
                <div className="text-xs p-3 rounded-lg mb-3" style={{ background: "rgba(226,104,94,0.12)", color: COLORS.danger }}>
                  {adFormError}
                </div>
              )}
              <form onSubmit={(e) => handleSubmitAd(e, "annonce")} className="flex flex-col gap-3">
                <input
                  value={adForm.title}
                  onChange={(e) => setAdForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Titre de l'annonce"
                  className="px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                />
                <textarea
                  value={adForm.description}
                  onChange={(e) => setAdForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Description courte"
                  rows={3}
                  className="px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
                  style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                />
                <div>
                  <input
                    value={adForm.contactPhone}
                    onChange={(e) => setAdForm((f) => ({ ...f, contactPhone: e.target.value }))}
                    placeholder="+225 01 02 03 04 05 ou email@gmail.com"
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                  />
                  <div className="text-xs mt-1" style={{ color: COLORS.textMuted }}>
                    Numéro avec indicatif pays (ex. +225 01 02 03 04 05) ou une adresse e-mail.
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-2" style={{ color: COLORS.textMuted }}>Image de l'annonce (optionnel)</div>
                  {adImagePreview ? (
                    <div className="relative w-full mb-2" style={{ height: 140 }}>
                      <img src={adImagePreview} alt="Aperçu" className="w-full h-full object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => { setAdImageFile(null); setAdImagePreview(""); }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label
                      className="flex flex-col items-center justify-center gap-1.5 py-5 rounded-lg cursor-pointer text-xs"
                      style={{ background: COLORS.bgSoft, border: `1px dashed ${COLORS.surfaceLine}`, color: COLORS.textMuted }}
                    >
                      <ImageIcon size={18} />
                      Ajouter une image (JPG, PNG)
                      <input type="file" accept="image/*" onChange={handleAdImageChange} className="hidden" />
                    </label>
                  )}
                </div>
                <div>
                  <div className="text-xs mb-2" style={{ color: COLORS.textMuted }}>
                    Durée de diffusion — {adForm.customDays} jour{adForm.customDays > 1 ? "s" : ""}
                    {adForm.customDays === 1 && " (24h)"}
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={adForm.customDays}
                    onChange={(e) => setAdForm((f) => ({ ...f, customDays: Number(e.target.value) }))}
                    className="w-full mb-2"
                    style={{ accentColor: COLORS.gold }}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={adForm.customDays}
                      onChange={(e) => {
                        const v = Math.min(30, Math.max(1, Number(e.target.value) || 1));
                        setAdForm((f) => ({ ...f, customDays: v }));
                      }}
                      className="w-20 px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                    />
                    <span className="text-xs" style={{ color: COLORS.textMuted }}>jours (min. 1 — max. 30)</span>
                    <div className="flex items-center gap-1.5 ml-auto">
                      {[1, 7, 15, 30].map((d) => (
                        <button
                          type="button"
                          key={d}
                          onClick={() => setAdForm((f) => ({ ...f, customDays: d }))}
                          className="gc-btn px-2.5 py-1.5 rounded-md text-xs font-medium"
                          style={
                            adForm.customDays === d
                              ? { background: COLORS.gold, color: "#052E36" }
                              : { background: COLORS.bgSoft, color: COLORS.textMuted, border: `1px solid ${COLORS.surfaceLine}` }
                          }
                        >
                          {d === 1 ? "24h" : `${d}j`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={adSubmitting}
                  className="gc-btn py-3 rounded-lg text-sm font-medium mt-1"
                  style={{ background: COLORS.gold, color: "#052E36", opacity: adSubmitting ? 0.6 : 1 }}
                >
                  {adSubmitting ? "Publication en cours…" : "Publier l'annonce"}
                </button>
              </form>
            </div>

            {/* Mes annonces publiées */}
            {myAds.filter((a) => a.kind === "annonce").length > 0 && (
              <div>
                <div className="text-xs font-medium mb-3" style={{ color: COLORS.textMuted }}>MES ANNONCES</div>
                <div className="flex flex-col gap-2">
                  {myAds.filter((a) => a.kind === "annonce").map((ad) => {
                    const isActive = ad.status === "active" && new Date(ad.ends_at) > new Date();
                    return (
                      <div key={ad.id} className="p-3.5 rounded-lg flex items-center gap-3" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
                        {ad.image_url ? (
                          <img src={ad.image_url} alt={ad.title} className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: COLORS.bgSoft }}>
                            <Megaphone size={16} style={{ color: COLORS.goldSoft }} />
                          </div>
                        )}
                        <div className="min-w-0 flex-1 flex items-center justify-between">
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">{ad.title}</div>
                            <div className="text-xs" style={{ color: COLORS.textMuted }}>
                              {ad.duration_days} jours · expire le {new Date(ad.ends_at).toLocaleDateString("fr-FR")}
                            </div>
                          </div>
                          <span
                            className="text-xs px-2.5 py-1 rounded-md flex-shrink-0"
                            style={
                              isActive
                                ? { background: "rgba(43,191,138,0.12)", color: COLORS.teal }
                                : { background: COLORS.bgSoft, color: COLORS.textMuted }
                            }
                          >
                            {isActive ? "En ligne" : "Expirée"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "backoffice-pub" && agent?.isPlatformOwner && (
          <div className="gc-fade-in">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-1">Backoffice publicité</h2>
              <p className="text-xs" style={{ color: COLORS.textMuted }}>Visible uniquement par toi.</p>
            </div>

            {allAdsLoading ? (
              <div className="text-xs" style={{ color: COLORS.textMuted }}>Chargement…</div>
            ) : (
              <>
                {(() => {
                  const pubOnly = allAds.filter((a) => a.kind !== "annonce");
                  const totalImpressions = pubOnly.reduce((s, a) => s + (a.impressions || 0), 0);
                  const totalClicks = pubOnly.reduce((s, a) => s + (a.clicks || 0), 0);
                  const totalRevenue = pubOnly.reduce((s, a) => s + (a.amount_paid || 0), 0);
                  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : "0.0";
                  const stats = [
                    { label: "Impressions ce mois", value: totalImpressions.toLocaleString("fr-FR") },
                    { label: "Taux de clic moyen", value: `${ctr} %` },
                    { label: "Revenu publicitaire", value: formatFCFA(totalRevenue) },
                  ];
                  return (
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      {stats.map((s) => (
                        <div key={s.label} className="p-5 rounded-xl" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
                          <div className="text-xs mb-1.5" style={{ color: COLORS.textMuted }}>{s.label}</div>
                          <div className="gc-display text-2xl font-semibold gc-mono">{s.value}</div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
                <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>
                  Ces statistiques ne comptent que les publicités payantes des agents et chefs d'agence — tes annonces gratuites (onglet « Annonceur ») en sont exclues.
                </p>

                <div className="text-xs font-medium mb-3" style={{ color: COLORS.textMuted }}>TOUTES LES PUBLICITÉS ET ANNONCES ({allAds.length})</div>
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${COLORS.surfaceLine}` }}>
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ background: COLORS.bgSoft, color: COLORS.textMuted }}>
                        <th className="text-left px-3 py-2.5">Titre</th>
                        <th className="text-left px-3 py-2.5">Type</th>
                        <th className="text-left px-3 py-2.5">Agence</th>
                        <th className="text-left px-3 py-2.5">Montant</th>
                        <th className="text-left px-3 py-2.5">Statut</th>
                        <th className="text-left px-3 py-2.5">Expire</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allAds.map((ad) => {
                        const isActive = ad.status === "active" && new Date(ad.ends_at) > new Date();
                        const isAnnonce = ad.kind === "annonce";
                        return (
                          <tr key={ad.id} style={{ borderTop: `1px solid ${COLORS.surfaceLine}` }}>
                            <td className="px-3 py-2.5">{ad.title}</td>
                            <td className="px-3 py-2.5">
                              <span
                                className="px-2 py-0.5 rounded-md"
                                style={
                                  isAnnonce
                                    ? { background: "rgba(34,211,238,0.14)", color: COLORS.gold }
                                    : { background: COLORS.bgSoft, color: COLORS.textMuted, border: `1px solid ${COLORS.surfaceLine}` }
                                }
                              >
                                {isAnnonce ? "Annonce" : "Publicité"}
                              </span>
                            </td>
                            <td className="px-3 py-2.5" style={{ color: COLORS.textMuted }}>{ad.agency_name || "—"}</td>
                            <td className="px-3 py-2.5 gc-mono">{formatFCFA(ad.amount_paid)}</td>
                            <td className="px-3 py-2.5">
                              <span
                                className="px-2 py-0.5 rounded-md"
                                style={
                                  isActive
                                    ? { background: "rgba(43,191,138,0.12)", color: COLORS.teal }
                                    : { background: COLORS.bgSoft, color: COLORS.textMuted }
                                }
                              >
                                {isActive ? "En ligne" : "Expirée"}
                              </span>
                            </td>
                            <td className="px-3 py-2.5" style={{ color: COLORS.textMuted }}>{new Date(ad.ends_at).toLocaleDateString("fr-FR")}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {tab === "parrainage" && (
          <div className="gc-fade-in grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-xl" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
              <div className="flex items-center gap-2 mb-3">
                <Users size={16} style={{ color: COLORS.goldSoft }} />
                <span className="text-sm font-medium">Invite tes connaissances</span>
              </div>
              <p className="text-xs mb-5" style={{ color: COLORS.textMuted }}>
                Partage ton lien ou ton QR code personnel — tes connaissances pourront rejoindre EmpireGuichet en un clic depuis leur téléphone.
              </p>

              <div
                className="px-3 py-2.5 rounded-lg text-xs gc-mono mb-3 break-all"
                style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
              >
                {referralLink}
              </div>

              <div className="flex gap-2 mb-5">
                <button
                  onClick={handleCopyReferral}
                  className="gc-btn flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium border"
                  style={{ borderColor: COLORS.surfaceLine, color: COLORS.text }}
                >
                  <Copy size={14} /> {referralCopied ? "Copié !" : "Copier le lien"}
                </button>
                <button
                  onClick={handleShareReferral}
                  className="gc-btn flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium"
                  style={{ background: COLORS.gold, color: "#052E36" }}
                >
                  <Share2 size={14} /> Partager
                </button>
              </div>

              <div className="p-4 rounded-lg" style={{ background: "rgba(43,191,138,0.1)", border: `1px solid ${COLORS.surfaceLine}` }}>
                <div className="text-xs mb-1" style={{ color: COLORS.textMuted }}>Connaissances invitées</div>
                <div className="gc-display gc-mono text-xl font-semibold" style={{ color: COLORS.teal }}>
                  {realReferralsLoading ? "…" : realReferrals.length}
                </div>
              </div>

              {realReferrals.length > 0 && (
                <div className="mt-4 space-y-2">
                  {realReferrals.map((r) => (
                    <div key={r.id} className="p-3 rounded-lg flex items-center justify-between" style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}` }}>
                      <div>
                        <div className="text-sm font-medium">{r.full_name}</div>
                        <div className="text-xs" style={{ color: COLORS.textMuted }}>{r.phone}</div>
                      </div>
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          background: r.kyc_status === "validated" ? "rgba(43,191,138,0.15)" : "rgba(217,164,65,0.15)",
                          color: r.kyc_status === "validated" ? COLORS.teal : COLORS.goldSoft,
                        }}
                      >
                        {r.kyc_status === "validated" ? "Vérifié" : "En attente"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 rounded-xl flex flex-col items-center justify-center text-center" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
              <div className="flex items-center gap-2 mb-4">
                <QrCode size={16} style={{ color: COLORS.goldSoft }} />
                <span className="text-sm font-medium">Ton QR code personnel</span>
              </div>
              <div className="p-3 rounded-xl mb-3" style={{ background: "#FFFFFF" }}>
                {referralLink && (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(referralLink)}`}
                    alt="QR code de parrainage EmpireGuichet"
                    width={180}
                    height={180}
                  />
                )}
              </div>
              <p className="text-xs" style={{ color: COLORS.textMuted, maxWidth: 260 }}>
                Fais scanner ce code par une connaissance — elle arrivera directement sur la page d'inscription.
              </p>
            </div>

            <div className="p-6 rounded-xl md:col-span-2" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
              <div className="flex items-center gap-2 mb-1">
                <Gift size={16} style={{ color: COLORS.teal }} />
                <span className="text-sm font-medium">Tes commissions de parrainage</span>
              </div>
              <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>
                Tu gagnes {formatFCFA(REFERRAL_COMMISSION_AMOUNT)} dès qu'une personne que tu as invitée active son abonnement (une seule génération — pas de cascade sur les filleuls de tes filleuls).
              </p>
              <div className="p-4 rounded-lg mb-4" style={{ background: "rgba(43,191,138,0.1)", border: `1px solid ${COLORS.surfaceLine}` }}>
                <div className="text-xs mb-1" style={{ color: COLORS.textMuted }}>Total gagné</div>
                <div className="gc-display gc-mono text-xl font-semibold" style={{ color: COLORS.teal }}>
                  {formatFCFA(myReferralCommissions.reduce((sum, c) => sum + c.amount, 0))}
                </div>
              </div>
              {myReferralCommissions.length === 0 ? (
                <p className="text-xs" style={{ color: COLORS.textMuted }}>Aucune commission pour le moment.</p>
              ) : (
                <div className="space-y-2">
                  {myReferralCommissions.map((c) => (
                    <div key={c.id} className="p-3 rounded-lg flex items-center justify-between" style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}` }}>
                      <div className="text-sm gc-mono">{formatFCFA(c.amount)}</div>
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          background: c.status === "paid" ? "rgba(43,191,138,0.15)" : "rgba(217,164,65,0.15)",
                          color: c.status === "paid" ? COLORS.teal : COLORS.goldSoft,
                        }}
                      >
                        {c.status === "paid" ? "Payée" : "En attente"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Onglet Abonnement */}
        {tab === "abonnement" && (
          <div className="gc-fade-in grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-xl" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={16} style={{ color: COLORS.goldSoft }} />
                <span className="text-sm font-medium">Mon abonnement</span>
              </div>

              <div className="p-4 rounded-lg mb-4" style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}` }}>
                <div className="text-xs mb-1" style={{ color: COLORS.textMuted }}>
                  Formule {agent?.role === "manager" ? "Chef d'agence" : "Agent simple"}
                </div>
                <div className="gc-display gc-mono text-xl font-semibold">{formatFCFA(getSubscriptionAmount(subscription, agent?.role))} / 6 mois</div>
              </div>

              <div className="p-4 rounded-lg mb-5" style={{ background: agent?.isPlatformOwner || hasFullAccess ? "rgba(43,191,138,0.1)" : "rgba(200,60,60,0.1)", border: `1px solid ${COLORS.surfaceLine}` }}>
                {agent?.isPlatformOwner ? (
                  <div className="text-sm">Accès illimité — propriétaire de la plateforme.</div>
                ) : isSubscriptionActive ? (
                  <div className="text-sm">
                    Abonnement actif jusqu'au {new Date(subscription.current_period_end).toLocaleDateString("fr-FR")}.
                  </div>
                ) : (
                  <div className="text-sm">Ton accès n'est pas encore actif. Déclare ton paiement ci-dessous pour l'activer.</div>
                )}
              </div>

              <p className="text-xs mb-2" style={{ color: COLORS.textMuted }}>
                Envoie {formatFCFA(getSubscriptionAmount(subscription, agent?.role))} au numéro <span className="gc-mono">{PAYMENT_RECEIVING_NUMBER}</span> (Orange Money, MTN, Moov ou Wave), puis indique la référence de la transaction ci-dessous.
              </p>
              <input
                value={paymentRefInput}
                onChange={(e) => setPaymentRefInput(e.target.value)}
                placeholder="Référence de la transaction"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none mb-2"
                style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
              />
              <button
                onClick={() => handleDeclarePayment("abonnement")}
                disabled={paymentSubmitting}
                className="gc-btn w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium"
                style={{ background: COLORS.gold, color: "#052E36", opacity: paymentSubmitting ? 0.6 : 1 }}
              >
                <Send size={14} /> {paymentSubmitting ? "Envoi…" : "Déclarer mon paiement"}
              </button>
              {paymentSubmitMsg && (
                <p className="text-xs mt-2" style={{ color: COLORS.teal }}>{paymentSubmitMsg}</p>
              )}

              {myPayments.length > 0 && (
                <div className="mt-5 space-y-2">
                  <div className="text-xs font-medium" style={{ color: COLORS.textMuted }}>HISTORIQUE DES DÉCLARATIONS</div>
                  {myPayments.map((p) => (
                    <div key={p.id} className="p-3 rounded-lg flex items-center justify-between" style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}` }}>
                      <div>
                        <div className="text-sm">{p.type === "abonnement" ? "Abonnement" : "Historique"} — {formatFCFA(p.amount)}</div>
                        <div className="text-xs" style={{ color: COLORS.textMuted }}>{new Date(p.created_at).toLocaleDateString("fr-FR")}</div>
                      </div>
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          background: p.status === "validated" ? "rgba(43,191,138,0.15)" : p.status === "rejected" ? "rgba(200,60,60,0.15)" : "rgba(217,164,65,0.15)",
                          color: p.status === "validated" ? COLORS.teal : p.status === "rejected" ? COLORS.danger : COLORS.goldSoft,
                        }}
                      >
                        {p.status === "validated" ? "Validé" : p.status === "rejected" ? "Refusé" : "En attente"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 rounded-xl" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} style={{ color: COLORS.teal }} />
                <span className="text-sm font-medium">Débloquer l'historique (2 mois)</span>
              </div>
              <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>
                L'accès à l'historique détaillé (recherche, filtres, export PDF/Excel) coûte {formatFCFA(HISTORY_UNLOCK_PRICE)} tous les 2 mois, séparément de l'abonnement.
              </p>
              {historyUnlockedThisPeriod ? (
                <div className="p-4 rounded-lg text-sm" style={{ background: "rgba(43,191,138,0.1)", border: `1px solid ${COLORS.surfaceLine}` }}>
                  Historique débloqué pour cette période ✔
                </div>
              ) : (
                <>
                  <input
                    value={historyRefInput}
                    onChange={(e) => setHistoryRefInput(e.target.value)}
                    placeholder="Référence de la transaction"
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none mb-2"
                    style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                  />
                  <button
                    onClick={() => handleDeclarePayment("historique")}
                    disabled={historySubmitting}
                    className="gc-btn w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium"
                    style={{ background: COLORS.teal, color: "#052E36", opacity: historySubmitting ? 0.6 : 1 }}
                  >
                    <Send size={14} /> {historySubmitting ? "Envoi…" : `Déclarer — ${formatFCFA(HISTORY_UNLOCK_PRICE)}`}
                  </button>
                  {historySubmitMsg && (
                    <p className="text-xs mt-2" style={{ color: COLORS.teal }}>{historySubmitMsg}</p>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Discussion entre agents déplacée en bulle flottante (voir plus bas) */}

        {/* Backoffice abonnements (propriétaire) */}
        {tab === "backoffice-abonnements" && agent?.isPlatformOwner && (
          <div className="gc-fade-in">
            <div className="text-sm font-medium mb-3">Paiements en attente de validation</div>
            {pendingSubPaymentsLoading ? (
              <div className="text-xs" style={{ color: COLORS.textMuted }}>Chargement…</div>
            ) : pendingSubPayments.length === 0 ? (
              <div className="text-xs" style={{ color: COLORS.textMuted }}>Aucun paiement en attente.</div>
            ) : (
              <div className="space-y-2">
                {pendingSubPayments.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl flex items-center justify-between gap-3" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
                    <div>
                      <div className="text-sm font-medium">{p.agents?.full_name} — {p.agents?.phone}</div>
                      <div className="text-xs" style={{ color: COLORS.textMuted }}>
                        {p.type === "abonnement" ? "Abonnement" : "Historique"} · {formatFCFA(p.amount)} · réf. {p.payment_reference}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => validateSubPayment(p, true)}
                        className="gc-btn px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{ background: COLORS.teal, color: "#052E36" }}
                      >
                        Valider
                      </button>
                      <button
                        onClick={() => validateSubPayment(p, false)}
                        className="gc-btn px-3 py-1.5 rounded-lg text-xs font-medium border"
                        style={{ borderColor: COLORS.surfaceLine, color: COLORS.textMuted }}
                      >
                        Refuser
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "equipe" && agent?.role === "manager" && (
          <div className="gc-fade-in">
            <div
              className="flex items-center justify-between gap-3 p-4 rounded-xl mb-4"
              style={{ background: COLORS.surface, border: `1px solid ${COLORS.gold}` }}
            >
              <div className="text-sm">
                <span className="font-medium">Code d'agence à donner à tes agents : </span>
                <span className="gc-mono" style={{ color: COLORS.goldSoft }}>{agent?.agencyCode || "—"}</span>
                <div className="text-xs mt-1" style={{ color: COLORS.textMuted }}>
                  Ils l'entrent dans le champ "Code d'agence" à l'inscription pour rejoindre ton équipe.
                </div>
              </div>
              <button
                onClick={() => {
                  if (agent?.agencyCode) {
                    navigator.clipboard.writeText(agent.agencyCode);
                    setAgencyCodeCopied(true);
                    setTimeout(() => setAgencyCodeCopied(false), 2000);
                  }
                }}
                className="gc-btn flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium"
                style={{ background: COLORS.gold, color: "#052E36" }}
              >
                <Copy size={13} /> {agencyCodeCopied ? "Copié !" : "Copier"}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Agents dans l'équipe", value: realTeamLoading ? "…" : realTeam.length },
                { label: "KYC validés", value: realTeamLoading ? "…" : realTeam.filter((a) => a.kyc_status === "validated").length },
                { label: "Transactions équipe", value: teamTransactions.length },
                { label: "Volume équipe", value: formatFCFA(teamTransactions.reduce((s, t) => s + Number(t.amount || 0), 0)) },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-xl" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
                  <div className="text-xs mb-1.5" style={{ color: COLORS.textMuted }}>{s.label}</div>
                  <div className="gc-display gc-mono text-lg md:text-xl font-semibold">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${COLORS.surfaceLine}` }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: COLORS.surface, color: COLORS.textMuted }}>
                    <th className="text-left font-normal px-4 py-3">Agent</th>
                    <th className="text-left font-normal px-4 py-3">Téléphone</th>
                    <th className="text-left font-normal px-4 py-3">Rôle</th>
                    <th className="text-right font-normal px-4 py-3">Transactions</th>
                    <th className="text-right font-normal px-4 py-3">Volume traité</th>
                    <th className="text-left font-normal px-4 py-3">Statut KYC</th>
                  </tr>
                </thead>
                <tbody>
                  {!realTeamLoading && realTeam.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-sm" style={{ color: COLORS.textMuted }}>
                        Aucun agent n'a encore rejoint ton équipe avec ton code d'agence.
                      </td>
                    </tr>
                  )}
                  {realTeam.map((a) => {
                    const agentTx = teamTransactions.filter((t) => t.agent_id === a.id);
                    const agentVolume = agentTx.reduce((s, t) => s + Number(t.amount || 0), 0);
                    return (
                      <tr key={a.id} style={{ borderTop: `1px solid ${COLORS.surfaceLine}` }}>
                        <td className="px-4 py-3">{a.full_name}</td>
                        <td className="px-4 py-3 gc-mono" style={{ color: COLORS.textMuted }}>{a.phone}</td>
                        <td className="px-4 py-3" style={{ color: COLORS.textMuted }}>{a.role === "manager" ? "Chef d'agence" : "Agent"}</td>
                        <td className="px-4 py-3 text-right gc-mono">{agentTx.length}</td>
                        <td className="px-4 py-3 text-right gc-mono">{formatFCFA(agentVolume)}</td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md"
                            style={
                              a.kyc_status === "validated"
                                ? { background: "rgba(43,191,138,0.12)", color: COLORS.teal }
                                : { background: "rgba(217,164,65,0.12)", color: COLORS.goldSoft }
                            }
                          >
                            {a.kyc_status === "validated" ? "Vérifié" : "En attente"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-3" style={{ color: COLORS.textMuted }}>
              Les transactions apparaissent ici en temps réel, dès qu'un agent de ton équipe en effectue une.
            </p>
          </div>
        )}

        {tab === "kyc-review" && agent?.role === "manager" && (
          <div className="gc-fade-in">
            <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>
              Agents de ton équipe ayant envoyé leurs documents et en attente de ta validation.
            </p>

            {kycLoadingList ? (
              <p className="text-sm" style={{ color: COLORS.textMuted }}>Chargement…</p>
            ) : pendingKycAgents.length === 0 ? (
              <div className="p-6 rounded-xl text-center" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
                <CheckCircle2 size={22} style={{ color: COLORS.teal, margin: "0 auto 8px" }} />
                <p className="text-sm" style={{ color: COLORS.textMuted }}>Aucune vérification en attente pour le moment.</p>
              </div>
            ) : (
              <div className="grid gap-2">
                {pendingKycAgents.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => openKycReview(a)}
                    className="gc-btn flex items-center justify-between p-4 rounded-xl text-left"
                    style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
                  >
                    <div>
                      <div className="text-sm font-medium">{a.full_name}</div>
                      <div className="text-xs" style={{ color: COLORS.textMuted }}>{a.phone} · {a.document_type === "passeport" ? "Passeport" : a.document_type === "permis" ? "Permis de conduire" : a.document_type ? "Pièce d'identité" : "Aucun document envoyé"}</div>
                    </div>
                    <KycStatusBadge status={a.kyc_status} colors={COLORS} />
                  </button>
                ))}
              </div>
            )}

            {/* Panneau de révision */}
            {selectedKycAgent && (
              <div
                className="gc-fade-in"
                style={{ position: "fixed", inset: 0, background: "rgba(6,7,20,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 40, padding: 16 }}
              >
                <div
                  className="w-full"
                  style={{ maxWidth: 520, maxHeight: "85vh", overflowY: "auto", background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}`, borderRadius: 16, padding: 24 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm font-medium">{selectedKycAgent.full_name}</div>
                      <div className="text-xs" style={{ color: COLORS.textMuted }}>{selectedKycAgent.phone} · {selectedKycAgent.email}</div>
                    </div>
                    <button onClick={() => setSelectedKycAgent(null)} aria-label="Fermer">
                      <X size={18} style={{ color: COLORS.textMuted }} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs" style={{ color: COLORS.textMuted }}>
                    <div>Pays : <span style={{ color: COLORS.text }}>{selectedKycAgent.country || "—"}</span></div>
                    <div>Naissance : <span style={{ color: COLORS.text }}>{selectedKycAgent.date_of_birth || "—"}</span></div>
                    <div className="col-span-2">Adresse : <span style={{ color: COLORS.text }}>{selectedKycAgent.address || "—"}</span></div>
                    <div className="col-span-2">N° identité : <span className="gc-mono" style={{ color: COLORS.text }}>{selectedKycAgent.id_number || "—"}</span></div>
                  </div>

                  {!selectedKycUrls ? (
                    <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>Chargement des documents…</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {Object.entries(selectedKycUrls).map(([path, url]) => (
                        <a key={path} href={url} target="_blank" rel="noopener noreferrer">
                          <img src={url} alt="Document KYC" className="w-full rounded-lg" style={{ height: 120, objectFit: "cover", border: `1px solid ${COLORS.surfaceLine}` }} />
                        </a>
                      ))}
                    </div>
                  )}

                  {selectedKycAgent.kyc_status === "pending" ? (
                    <>
                      {kycActionError && (
                        <p className="text-xs mb-3 px-3 py-2 rounded-lg" style={{ background: "#FEE2E2", color: "#991B1B" }}>
                          {kycActionError}
                        </p>
                      )}
                      <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Motif en cas de refus (optionnel)</label>
                      <input
                        value={kycRejectReason}
                        onChange={(e) => setKycRejectReason(e.target.value)}
                        placeholder="Ex. photo floue, document illisible…"
                        className="w-full px-3.5 py-2.5 rounded-lg text-sm mb-4 outline-none"
                        style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={rejectKycAgent}
                          className="gc-btn py-2.5 rounded-lg text-sm font-medium"
                          style={{ background: COLORS.withdraw, color: "#fff" }}
                        >
                          Refuser
                        </button>
                        <button
                          onClick={approveKycAgent}
                          className="gc-btn py-2.5 rounded-lg text-sm font-medium"
                          style={{ background: COLORS.deposit, color: "#fff" }}
                        >
                          Approuver
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <KycStatusBadge status={selectedKycAgent.kyc_status} colors={COLORS} />
                      {selectedKycAgent.kyc_status === "rejected" && selectedKycAgent.kyc_rejected_reason && (
                        <span className="text-xs" style={{ color: COLORS.textMuted }}>{selectedKycAgent.kyc_rejected_reason}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "kyc-review-managers" && agent?.isPlatformOwner && (
          <div className="gc-fade-in">
            <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>
              Chefs d'agence ayant envoyé leurs documents et en attente de ta validation, en tant que propriétaire de la plateforme.
            </p>

            {kycLoadingList ? (
              <p className="text-sm" style={{ color: COLORS.textMuted }}>Chargement…</p>
            ) : pendingManagers.length === 0 ? (
              <div className="p-6 rounded-xl text-center" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
                <CheckCircle2 size={22} style={{ color: COLORS.teal, margin: "0 auto 8px" }} />
                <p className="text-sm" style={{ color: COLORS.textMuted }}>Aucun chef d'agence en attente pour le moment.</p>
              </div>
            ) : (
              <div className="grid gap-2">
                {pendingManagers.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => openKycReview(a)}
                    className="gc-btn flex items-center justify-between p-4 rounded-xl text-left"
                    style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
                  >
                    <div>
                      <div className="text-sm font-medium">{a.full_name}</div>
                      <div className="text-xs" style={{ color: COLORS.textMuted }}>{a.phone} · Agence : {a.agency_name}</div>
                    </div>
                    <KycStatusBadge status={a.kyc_status} colors={COLORS} />
                  </button>
                ))}
              </div>
            )}

            {selectedKycAgent && (
              <div
                className="gc-fade-in"
                style={{ position: "fixed", inset: 0, background: "rgba(6,7,20,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 40, padding: 16 }}
              >
                <div
                  className="w-full"
                  style={{ maxWidth: 520, maxHeight: "85vh", overflowY: "auto", background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}`, borderRadius: 16, padding: 24 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm font-medium">{selectedKycAgent.full_name}</div>
                      <div className="text-xs" style={{ color: COLORS.textMuted }}>{selectedKycAgent.phone} · {selectedKycAgent.email}</div>
                    </div>
                    <button onClick={() => setSelectedKycAgent(null)} aria-label="Fermer">
                      <X size={18} style={{ color: COLORS.textMuted }} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs" style={{ color: COLORS.textMuted }}>
                    <div>Agence : <span style={{ color: COLORS.text }}>{selectedKycAgent.agency_name || "—"}</span></div>
                    <div>Pays : <span style={{ color: COLORS.text }}>{selectedKycAgent.country || "—"}</span></div>
                    <div>Naissance : <span style={{ color: COLORS.text }}>{selectedKycAgent.date_of_birth || "—"}</span></div>
                    <div className="col-span-2">Adresse : <span style={{ color: COLORS.text }}>{selectedKycAgent.address || "—"}</span></div>
                    <div className="col-span-2">N° identité : <span className="gc-mono" style={{ color: COLORS.text }}>{selectedKycAgent.id_number || "—"}</span></div>
                  </div>

                  {!selectedKycUrls ? (
                    <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>Chargement des documents…</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {Object.entries(selectedKycUrls).map(([path, url]) => (
                        <a key={path} href={url} target="_blank" rel="noopener noreferrer">
                          <img src={url} alt="Document KYC" className="w-full rounded-lg" style={{ height: 120, objectFit: "cover", border: `1px solid ${COLORS.surfaceLine}` }} />
                        </a>
                      ))}
                    </div>
                  )}

                  {selectedKycAgent.kyc_status === "pending" ? (
                    <>
                      {kycActionError && (
                        <p className="text-xs mb-3 px-3 py-2 rounded-lg" style={{ background: "#FEE2E2", color: "#991B1B" }}>
                          {kycActionError}
                        </p>
                      )}
                      <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Motif en cas de refus (optionnel)</label>
                      <input
                        value={kycRejectReason}
                        onChange={(e) => setKycRejectReason(e.target.value)}
                        placeholder="Ex. photo floue, document illisible…"
                        className="w-full px-3.5 py-2.5 rounded-lg text-sm mb-4 outline-none"
                        style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={rejectKycAgent} className="gc-btn py-2.5 rounded-lg text-sm font-medium" style={{ background: COLORS.withdraw, color: "#fff" }}>
                          Refuser
                        </button>
                        <button onClick={approveKycAgent} className="gc-btn py-2.5 rounded-lg text-sm font-medium" style={{ background: COLORS.deposit, color: "#fff" }}>
                          Approuver
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <KycStatusBadge status={selectedKycAgent.kyc_status} colors={COLORS} />
                      {selectedKycAgent.kyc_status === "rejected" && selectedKycAgent.kyc_rejected_reason && (
                        <span className="text-xs" style={{ color: COLORS.textMuted }}>{selectedKycAgent.kyc_rejected_reason}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "parametres" && (
          <div className="gc-fade-in grid md:grid-cols-2 gap-4 max-w-3xl">
            <form
              onSubmit={handleChangePin}
              className="p-6 rounded-xl"
              style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
            >
              <div className="flex items-center gap-2 mb-4">
                <KeyRound size={16} style={{ color: COLORS.goldSoft }} />
                <span className="text-sm font-medium">Changer le code PIN</span>
              </div>
              <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Code PIN actuel</label>
              <input
                value={currentPinInput}
                type="password"
                onChange={(e) => setCurrentPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                maxLength={4}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm mb-3 outline-none gc-mono tracking-widest"
                style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
              />
              <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Nouveau code PIN</label>
              <input
                value={newPinInput}
                type="password"
                onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                maxLength={4}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm mb-3 outline-none gc-mono tracking-widest"
                style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
              />
              <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Confirmer le nouveau code</label>
              <input
                value={confirmPinInput}
                type="password"
                onChange={(e) => setConfirmPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                maxLength={4}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm mb-4 outline-none gc-mono tracking-widest"
                style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
              />
              {pinChangeMsg.text && (
                <p className="text-xs mb-4" style={{ color: pinChangeMsg.type === "error" ? COLORS.danger : COLORS.teal }}>
                  {pinChangeMsg.text}
                </p>
              )}
              <button
                type="submit"
                className="gc-btn w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium"
                style={{ background: COLORS.gold, color: "#052E36" }}
              >
                <Save size={14} /> Mettre à jour le PIN
              </button>
            </form>

            <form
              onSubmit={handleChangePassword}
              className="p-6 rounded-xl"
              style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
            >
              <div className="flex items-center gap-2 mb-4">
                <LogIn size={16} style={{ color: COLORS.goldSoft }} />
                <span className="text-sm font-medium">Changer le mot de passe</span>
              </div>
              <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Nouveau mot de passe</label>
              <div className="mb-3">
                <PasswordInput
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  colors={COLORS}
                />
              </div>
              <label className="text-xs mb-2 block" style={{ color: COLORS.textMuted }}>Confirmer le mot de passe</label>
              <div className="mb-4">
                <PasswordInput
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  colors={COLORS}
                />
              </div>
              {passwordChangeMsg.text && (
                <p className="text-xs mb-4" style={{ color: passwordChangeMsg.type === "error" ? COLORS.danger : COLORS.teal }}>
                  {passwordChangeMsg.text}
                </p>
              )}
              <button
                type="submit"
                className="gc-btn w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium"
                style={{ background: COLORS.gold, color: "#052E36" }}
              >
                <Save size={14} /> Mettre à jour le mot de passe
              </button>
              <p className="text-xs mt-4" style={{ color: COLORS.textMuted }}>
                Simulation — rien n'est stocké de façon permanente ni transmis à un serveur.
              </p>
            </form>
          </div>
        )}
        </>
        )}
      </section>

      {/* ===== Affiches publicitaires (avant le pied de page) ===== */}
      {(activeAds.length > 0 || activePublicites.length > 0) && (
        <section className="max-w-6xl mx-auto px-5 pb-14 flex flex-col gap-10">
          {activeAds.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold" style={{ color: COLORS.text }}>Annonces</h3>
                {activeAds.length >= 4 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => scrollAdCarousel(annoncesScrollRef, -1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                      aria-label="Précédent"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollAdCarousel(annoncesScrollRef, 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                      aria-label="Suivant"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div
                ref={annoncesScrollRef}
                className="flex gap-4 overflow-x-auto pb-2"
                style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
              >
                {activeAds.map((ad) => (
                  <div
                    key={ad.id}
                    onClick={() => setSelectedAdPreview(ad)}
                    className="rounded-xl overflow-hidden cursor-pointer flex-shrink-0"
                    style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}`, width: 280, scrollSnapAlign: "start" }}
                  >
                    {ad.image_url ? (
                      <div className="w-full" style={{ height: 160, background: COLORS.bgSoft }}>
                        <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-full flex items-center justify-center" style={{ height: 160, background: COLORS.bgSoft }}>
                        <Megaphone size={28} style={{ color: COLORS.surfaceLine }} />
                      </div>
                    )}
                    <div className="p-4">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full mb-2 w-fit"
                        style={{ background: COLORS.bgSoft, color: COLORS.goldSoft, border: `1px solid ${COLORS.surfaceLine}` }}
                      >
                        <Megaphone size={11} /> Annonce
                      </span>
                      <h3 className="text-sm font-semibold mb-1">{ad.title}</h3>
                      <p className="text-xs mb-3" style={{ color: COLORS.textMuted }}>{ad.description}</p>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); contactAdOwner(ad); }}
                        className="gc-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium w-fit"
                        style={{ background: COLORS.gold, color: "#052E36" }}
                      >
                        <Phone size={12} /> {ad.contact_phone}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePublicites.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold" style={{ color: COLORS.text }}>Publicités</h3>
                {activePublicites.length >= 4 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => scrollAdCarousel(publicitesScrollRef, -1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                      aria-label="Précédent"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollAdCarousel(publicitesScrollRef, 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                      aria-label="Suivant"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div
                ref={publicitesScrollRef}
                className="flex gap-4 overflow-x-auto pb-2"
                style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
              >
                {activePublicites.map((ad) => (
                  <div
                    key={ad.id}
                    onClick={() => setSelectedAdPreview(ad)}
                    className="rounded-xl overflow-hidden cursor-pointer flex-shrink-0"
                    style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}`, width: 280, scrollSnapAlign: "start" }}
                  >
                    {ad.image_url ? (
                      <div className="w-full" style={{ height: 160, background: COLORS.bgSoft }}>
                        <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-full flex items-center justify-center" style={{ height: 160, background: COLORS.bgSoft }}>
                        <Megaphone size={28} style={{ color: COLORS.surfaceLine }} />
                      </div>
                    )}
                    <div className="p-4">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full mb-2 w-fit"
                        style={{ background: COLORS.bgSoft, color: COLORS.goldSoft, border: `1px solid ${COLORS.surfaceLine}` }}
                      >
                        <Megaphone size={11} /> Publicité
                      </span>
                      <h3 className="text-sm font-semibold mb-1">{ad.title}</h3>
                      <p className="text-xs mb-3" style={{ color: COLORS.textMuted }}>{ad.description}</p>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); contactAdOwner(ad); }}
                        className="gc-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium w-fit"
                        style={{ background: COLORS.gold, color: "#052E36" }}
                      >
                        <Phone size={12} /> {ad.contact_phone}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ===== Footer ===== */}
      <footer style={{ borderTop: `1px solid ${COLORS.surfaceLine}` }} className="px-5 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-3 text-xs" style={{ color: COLORS.textMuted }}>
          <span>EmpireGuichet (EG) — un produit Empire Digital CI. Maquette de démonstration, aucune donnée réelle n'est traitée.</span>
          <span>Intégration réseaux réelle requiert un agrégateur de paiement agréé (CinetPay, PayDunya…) et conformité réglementaire locale.</span>
        </div>
      </footer>

      {/* ===== Avertissement d'inactivité ===== */}
      {showInactivityWarning && (
        <div
          className="gc-fade-in"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(6,7,20,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 45,
            padding: 16,
          }}
        >
          <div
            className="w-full text-center"
            style={{
              maxWidth: 340,
              background: COLORS.surface,
              border: `1px solid ${COLORS.surfaceLine}`,
              borderRadius: 16,
              padding: 24,
            }}
          >
            <Clock size={28} style={{ color: COLORS.goldSoft, margin: "0 auto 12px" }} />
            <div className="text-sm font-medium mb-2">Toujours là ?</div>
            <p className="text-xs mb-5" style={{ color: COLORS.textMuted }}>
              Par sécurité, tu vas être déconnecté dans <strong className="gc-mono">{inactivityCountdown}s</strong> pour inactivité.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleLogout}
                className="gc-btn flex-1 py-2.5 rounded-lg text-sm font-medium border"
                style={{ borderColor: COLORS.surfaceLine, color: COLORS.textMuted }}
              >
                Se déconnecter
              </button>
              <button
                onClick={staySignedIn}
                className="gc-btn flex-1 py-2.5 rounded-lg text-sm font-medium"
                style={{ background: COLORS.gold, color: "#052E36" }}
              >
                Rester connecté
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal PIN de confirmation ===== */}
      {pinModalOpen && (
        <div
          className="gc-fade-in"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(6,7,20,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 40,
            padding: 16,
          }}
        >
          <form
            onSubmit={handlePinConfirm}
            className="w-full"
            style={{
              maxWidth: 340,
              background: COLORS.surface,
              border: `1px solid ${COLORS.surfaceLine}`,
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div className="text-sm font-medium mb-1">Confirmer la transaction</div>
            <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>
              Entre ton code PIN à 4 chiffres pour envoyer {draftEntry ? formatFCFA(draftEntry.amount) : ""} vers {draftEntry?.phone}.
            </p>
            <input
              value={pinInput}
              type="password"
              onChange={(e) => { setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4)); setPinError(""); }}
              placeholder="••••"
              inputMode="numeric"
              maxLength={4}
              autoFocus
              className="w-full px-3.5 py-3 rounded-lg text-center text-lg mb-2 outline-none gc-mono tracking-[0.5em]"
              style={{ background: COLORS.bgSoft, border: `1px solid ${pinError ? COLORS.danger : COLORS.surfaceLine}`, color: COLORS.text }}
            />
            {pinError ? (
              <p className="text-xs mb-4" style={{ color: COLORS.danger }}>{pinError}</p>
            ) : !agent?.pinHash ? (
              <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>Code démo : {DEMO_PIN}</p>
            ) : (
              <div className="mb-4" />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePinCancel}
                className="gc-btn flex-1 py-2.5 rounded-lg text-sm font-medium border"
                style={{ borderColor: COLORS.surfaceLine, color: COLORS.textMuted }}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={pinInput.length !== 4}
                className="gc-btn flex-1 py-2.5 rounded-lg text-sm font-medium disabled:opacity-40"
                style={{ background: COLORS.gold, color: "#052E36" }}
              >
                Confirmer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== Fenêtre agrandie d'une publicité ===== */}
      {selectedAdPreview && (
        <div
          className="gc-fade-in"
          style={{ position: "fixed", inset: 0, background: "rgba(6,7,20,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }}
          onClick={() => setSelectedAdPreview(null)}
        >
          <div
            className="w-full"
            style={{ maxWidth: 520, maxHeight: "90vh", overflowY: "auto", background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}`, borderRadius: 16, overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: "relative" }}>
              {selectedAdPreview.image_url ? (
                <img src={selectedAdPreview.image_url} alt={selectedAdPreview.title} className="w-full" style={{ maxHeight: "60vh", objectFit: "contain", background: COLORS.bgSoft }} />
              ) : (
                <div className="w-full flex items-center justify-center" style={{ height: 180, background: COLORS.bgSoft }}>
                  <Megaphone size={40} style={{ color: COLORS.goldSoft }} />
                </div>
              )}
              <button
                onClick={() => setSelectedAdPreview(null)}
                aria-label="Fermer"
                className="flex items-center justify-center"
                style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: 999, background: "rgba(0,0,0,0.6)" }}
              >
                <X size={16} color="#fff" />
              </button>
            </div>
            <div className="p-5">
              <div className="text-base font-semibold mb-1">{selectedAdPreview.title}</div>
              <p className="text-sm mb-4" style={{ color: COLORS.textMuted }}>{selectedAdPreview.description}</p>
              <button
                type="button"
                onClick={() => contactAdOwner(selectedAdPreview)}
                className="gc-btn flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium"
                style={{ background: COLORS.gold, color: "#052E36" }}
              >
                <Phone size={14} /> {selectedAdPreview.contact_phone}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Reçu partageable ===== */}
      {lastReceipt && (
        <div
          className="gc-fade-in"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(6,7,20,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 40,
            padding: 16,
          }}
        >
          <div
            className="w-full"
            style={{
              maxWidth: 360,
              background: COLORS.surface,
              border: `1px solid ${COLORS.surfaceLine}`,
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Transaction confirmée</span>
              <button onClick={() => setLastReceipt(null)} aria-label="Fermer le reçu">
                <X size={18} style={{ color: COLORS.textMuted }} />
              </button>
            </div>
            <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>
              Partage le reçu avec le client pour preuve de paiement.
            </p>

            {(() => {
              const n = NETWORKS.find((x) => x.id === lastReceipt.net);
              const rFee = lastReceipt.amount * n.fee;
              return (
                <div className="p-4 rounded-lg mb-4" style={{ background: COLORS.bgSoft, border: `1px dashed ${COLORS.surfaceLine}` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <NetworkBadge net={n} colors={COLORS} />
                    <div>
                      <div className="text-sm font-medium">{n.name}</div>
                      <div className="text-xs gc-mono" style={{ color: COLORS.textMuted }}>{lastReceipt.phone}</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: COLORS.textMuted }}>Ticket</span>
                    <span className="gc-mono"><TicketNumber n={lastReceipt.id} /></span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: COLORS.textMuted }}>Montant</span>
                    <span className="gc-mono">{formatFCFA(lastReceipt.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total</span>
                    <span className="gc-mono">{formatFCFA(lastReceipt.amount + rFee)}</span>
                  </div>
                </div>
              );
            })()}

            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                onClick={() => shareReceiptWhatsApp(lastReceipt)}
                className="gc-btn flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium"
                style={{ background: COLORS.teal, color: "#08221A" }}
              >
                <MessageCircle size={14} /> WhatsApp
              </button>
              <button
                onClick={() => shareReceiptSMS(lastReceipt)}
                className="gc-btn flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium border"
                style={{ borderColor: COLORS.surfaceLine, color: COLORS.text }}
              >
                <Send size={14} /> SMS
              </button>
            </div>
            <button
              onClick={() => shareReceiptNative(lastReceipt)}
              className="gc-btn w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium mb-2"
              style={{ background: COLORS.gold, color: "#052E36" }}
            >
              <Share2 size={14} /> Autre application
            </button>
            <button
              onClick={() => setLastReceipt(null)}
              className="gc-btn w-full py-2 rounded-lg text-xs"
              style={{ color: COLORS.textMuted }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* ===== Bulle flottante — Discussion entre agents (au-dessus de la bulle service client) ===== */}
      {isAuthenticated && (
        <div style={{ position: "fixed", bottom: 92, right: 20, zIndex: 30 }}>
          {discussionOpen && (
            <div
              className="gc-fade-in mb-3 rounded-xl overflow-hidden flex flex-col"
              style={{
                width: 340,
                maxWidth: "88vw",
                height: 460,
                background: COLORS.surface,
                border: `1px solid ${COLORS.surfaceLine}`,
                boxShadow: "0 20px 50px -20px rgba(0,0,0,0.7)",
              }}
            >
              {/* Header */}
              <div className="flex flex-col" style={{ borderBottom: `1px solid ${COLORS.surfaceLine}` }}>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm font-medium">
                    {chatRecipient ? `Privé — ${chatRecipient.full_name}` : "Discussion entre agents"}
                  </span>
                  <button onClick={() => setDiscussionOpen(false)} aria-label="Fermer la discussion entre agents">
                    <X size={18} style={{ color: COLORS.textMuted }} />
                  </button>
                </div>
                {/* Sélecteur de conversation */}
                <div className="flex items-center gap-1.5 px-3 pb-2.5 overflow-x-auto">
                  <button
                    onClick={() => setChatRecipient(null)}
                    className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap"
                    style={{
                      background: !chatRecipient ? COLORS.gold : COLORS.bgSoft,
                      color: !chatRecipient ? "#052E36" : COLORS.textMuted,
                    }}
                  >
                    Générale
                  </button>
                  {agent?.role === "manager" &&
                    chatTeamList.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setChatRecipient({ id: t.id, full_name: t.full_name })}
                        className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap"
                        style={{
                          background: chatRecipient?.id === t.id ? COLORS.gold : COLORS.bgSoft,
                          color: chatRecipient?.id === t.id ? "#052E36" : COLORS.textMuted,
                        }}
                      >
                        {t.full_name}
                      </button>
                    ))}
                  {agent?.role === "agent" && chatMyManager && (
                    <button
                      onClick={() => setChatRecipient({ id: chatMyManager.id, full_name: chatMyManager.full_name })}
                      className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1"
                      style={{
                        background: chatRecipient?.id === chatMyManager.id ? COLORS.gold : COLORS.bgSoft,
                        color: chatRecipient?.id === chatMyManager.id ? "#052E36" : COLORS.textMuted,
                      }}
                    >
                      <Crown size={10} /> {chatMyManager.full_name}
                    </button>
                  )}
                  <button
                    onClick={toggleChatShowRealName}
                    className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap ml-auto flex items-center gap-1 shrink-0"
                    style={{ background: COLORS.bgSoft, color: COLORS.textMuted }}
                    title={chatShowRealName ? "Ton vrai nom est visible" : "Tu es anonyme"}
                  >
                    {chatShowRealName ? <Eye size={11} /> : <EyeOff size={11} />}
                    {chatShowRealName ? "Nom visible" : "Anonyme"}
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {agentChatLoading && agentChatMessages.length === 0 && (
                  <div className="text-xs text-center py-6" style={{ color: COLORS.textMuted }}>Chargement…</div>
                )}
                {!agentChatLoading && agentChatMessages.length === 0 && (
                  <div className="text-xs text-center py-6" style={{ color: COLORS.textMuted }}>
                    {chatRecipient ? "Aucun message privé pour l'instant." : "Sois le premier à écrire !"}
                  </div>
                )}
                {agentChatMessages.map((m) => (
                  <div key={m.id} className={`flex ${m.agent_id === agent?.id ? "justify-end" : "justify-start"}`}>
                    <div
                      className="max-w-[85%] p-3 rounded-xl text-sm"
                      style={{
                        background: m.agent_id === agent?.id ? COLORS.gold : COLORS.bgSoft,
                        color: m.agent_id === agent?.id ? "#052E36" : COLORS.text,
                        border: m.agent_id === agent?.id ? "none" : `1px solid ${COLORS.surfaceLine}`,
                      }}
                    >
                      <div className="text-[10px] font-medium mb-1 flex items-center gap-1" style={{ opacity: 0.75 }}>
                        {m.agent_name}
                        <span
                          className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold"
                          style={{
                            background: m.agent_role === "manager" ? "rgba(232,169,59,0.25)" : "rgba(43,191,138,0.2)",
                            color: m.agent_id === agent?.id ? "#052E36" : m.agent_role === "manager" ? COLORS.goldSoft : COLORS.teal,
                          }}
                        >
                          {m.agent_role === "manager" ? "Chef d'agence" : "Agent"}
                        </span>
                      </div>
                      {m.content}
                    </div>
                  </div>
                ))}
                <div ref={agentChatEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2 p-3" style={{ borderTop: `1px solid ${COLORS.surfaceLine}` }}>
                <input
                  value={agentChatInput}
                  onChange={(e) => setAgentChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                  placeholder={chatRecipient ? `Message privé à ${chatRecipient.full_name}…` : "Écris ton message…"}
                  className="flex-1 px-3.5 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                />
                <button
                  onClick={handleSendChatMessage}
                  className="gc-btn w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: COLORS.gold, color: "#052E36" }}
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setDiscussionOpen((v) => !v)}
            aria-label="Discussion entre agents"
            className="gc-btn w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: "radial-gradient(circle at 32% 28%, #5EEAB8 0%, #2BBF8A 55%, #17805C 100%)",
              boxShadow: "0 10px 30px -10px rgba(43,191,138,0.65), inset -3px -3px 6px rgba(0,0,0,0.25), inset 3px 3px 6px rgba(255,255,255,0.35)",
              color: "#08221A",
            }}
          >
            {discussionOpen ? <X size={22} /> : <Users size={22} />}
          </button>
        </div>
      )}

      {/* ===== Support flottant ===== */}
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 30 }}>
        {supportOpen && (
          <div
            className="gc-fade-in mb-3 rounded-xl overflow-hidden flex flex-col"
            style={{
              width: 340,
              maxWidth: "88vw",
              height: 460,
              background: COLORS.surface,
              border: `1px solid ${COLORS.surfaceLine}`,
              boxShadow: "0 20px 50px -20px rgba(0,0,0,0.7)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${COLORS.surfaceLine}` }}>
              <span className="text-sm font-medium">Service client</span>
              <button onClick={() => setSupportOpen(false)} aria-label="Fermer le service client">
                <X size={18} style={{ color: COLORS.textMuted }} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex" style={{ borderBottom: `1px solid ${COLORS.surfaceLine}` }}>
              {[
                { id: "chat", label: "Chat", icon: MessageCircle },
                { id: "faq", label: "FAQ", icon: HelpCircle },
                { id: "contact", label: "Contact", icon: Mail },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSupportTab(t.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium"
                  style={{
                    color: supportTab === t.id ? COLORS.goldSoft : COLORS.textMuted,
                    borderBottom: supportTab === t.id ? `2px solid ${COLORS.gold}` : "2px solid transparent",
                  }}
                >
                  <t.icon size={13} /> {t.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3">
              {supportTab === "chat" && (
                <div className="flex flex-col gap-2">
                  {chatMessages.map((m, i) => (
                    <div
                      key={i}
                      className="text-xs px-3 py-2 rounded-lg max-w-[85%]"
                      style={
                        m.from === "agent"
                          ? { background: COLORS.bgSoft, color: COLORS.text, alignSelf: "flex-start" }
                          : { background: COLORS.gold, color: "#052E36", alignSelf: "flex-end" }
                      }
                    >
                      {m.text}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              )}

              {supportTab === "faq" && (
                <div className="flex flex-col gap-2">
                  {FAQ_ITEMS.map((item, i) => (
                    <div key={i} className="rounded-lg overflow-hidden" style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}` }}>
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-left"
                      >
                        {item.q}
                        <ChevronDown
                          size={14}
                          style={{ color: COLORS.textMuted, transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform .15s ease", flexShrink: 0 }}
                        />
                      </button>
                      {openFaq === i && (
                        <p className="px-3 pb-2.5 text-xs" style={{ color: COLORS.textMuted }}>{item.a}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {supportTab === "contact" && (
                <div>
                  <a
                    href="https://wa.me/2250000000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gc-btn flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium mb-2"
                    style={{ background: COLORS.teal, color: "#08221A" }}
                  >
                    <Phone size={14} /> Discuter sur WhatsApp (exemple)
                  </a>
                  <div style={{ borderTop: `1px dashed ${COLORS.surfaceLine}` }} className="my-3" />
                  {contactSent ? (
                    <div className="text-xs p-3 rounded-lg flex items-center gap-2" style={{ background: "rgba(43,191,138,0.12)", color: COLORS.teal }}>
                      <CheckCircle2 size={14} /> Message envoyé (simulé). Un conseiller reviendra vers toi.
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="flex flex-col gap-2">
                      <input
                        value={contactForm.subject}
                        onChange={(e) => setContactForm((f) => ({ ...f, subject: e.target.value }))}
                        placeholder="Sujet"
                        className="px-3 py-2 rounded-lg text-xs outline-none"
                        style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                      />
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                        placeholder="Décris ton problème…"
                        rows={4}
                        className="px-3 py-2 rounded-lg text-xs outline-none resize-none"
                        style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                      />
                      <button
                        type="submit"
                        className="gc-btn flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium"
                        style={{ background: COLORS.gold, color: "#052E36" }}
                      >
                        <Send size={13} /> Envoyer
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Chat input */}
            {supportTab === "chat" && (
              <form onSubmit={handleSendChat} className="flex gap-2 p-3" style={{ borderTop: `1px solid ${COLORS.surfaceLine}` }}>
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Écris ton message…"
                  className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
                  style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                />
                <button type="submit" aria-label="Envoyer" className="gc-btn w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: COLORS.gold, color: "#052E36" }}>
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        )}

        <button
          onClick={() => setSupportOpen((v) => !v)}
          aria-label="Service client"
          className="gc-btn w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: "radial-gradient(circle at 32% 28%, #FCE7A6 0%, #E8A93B 55%, #B5791E 100%)",
            boxShadow: "0 10px 30px -10px rgba(232,169,59,0.65), inset -3px -3px 6px rgba(0,0,0,0.25), inset 3px 3px 6px rgba(255,255,255,0.35)",
            color: "#052E36",
          }}
        >
          {supportOpen ? <X size={22} /> : <MessageCircle size={22} />}
        </button>
      </div>
    </div>
  );
}
