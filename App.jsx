import React, { useState, useEffect, useRef } from "react";
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
  { code: "+225", iso: "ci", flag: "🇨🇮", name: "Côte d'Ivoire" },
  { code: "+221", iso: "sn", flag: "🇸🇳", name: "Sénégal" },
  { code: "+223", iso: "ml", flag: "🇲🇱", name: "Mali" },
  { code: "+226", iso: "bf", flag: "🇧🇫", name: "Burkina Faso" },
  { code: "+229", iso: "bj", flag: "🇧🇯", name: "Bénin" },
  { code: "+228", iso: "tg", flag: "🇹🇬", name: "Togo" },
  { code: "+224", iso: "gn", flag: "🇬🇳", name: "Guinée" },
  { code: "+227", iso: "ne", flag: "🇳🇪", name: "Niger" },
  { code: "+237", iso: "cm", flag: "🇨🇲", name: "Cameroun" },
  { code: "+33", iso: "fr", flag: "🇫🇷", name: "France" },
];

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
const LOGO_DATA_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADsCAYAAABKQStyAADlaUlEQVR42ux9d3wd1dH2M+fs3qZeLfcKGBsDoXfZtBAIECASJHnf0BIIpLxphJQPJFFDSSEECJ2QkIBECb3YYMumY1NsbHDvVu+6bfecM98fu3vvlWMIzcYmPr+fLFnllt0zZ2aeeeYZYOfauXaunWvn2i4X1dXViZ2XYefauXaunWvn2rm2lecFgNOP/tLuv/jOcV8HgJoayJ2X5Yu3doZXX8DVWFMjAOCko6qmTD9kxJkA0NjYuPPC7DTgnWtHWDW+rRZR8riJ40YdAsAS4nS988rsNOCda8fwwQaALM6ng0ZPmFbyszNP2IuZsRPQ2mnAO9d2vurqIIiIz6mZNqmkmHaNVg6ngw+aeBQAqp++837vNOCda7te01EtANBxB1ZWV5VHQrBjGDOhshoAY3q92XmFvljL2nkJtuqiujpQPeowB3MEpk/HdACYPpWBmg83pjn1EgCaOpZwbW3TR85fp9dPN2ho5tKYOD5sEbTDXFo5dp9JQKEQsh8eQs07b83OtXP9u7GK2XXVFnOjZGYi8aEBDm2NCIgI2HdCSdFbfzuqtfOpoznZNdNN9szi6y44/AQA1NhYs7Oc9EXadDsvwafINwGBumpRXz+HpSW10f/mVCNfnmhPPP1rR8TWpq0Zk3cZZ++5aymva9/0pbQy4wtKC00kEhOWXQBDEU7GB8IwynWcAT1+OOZpw53NL65cfsFvnnmQmYmIPtRznnce7Ntug7rqe1NPOOuEqse165jyQ35kIsNGySfuuPvvJ373tm8zsySinYj0zhD6v9Ro6yCmT68W06fP0UTCoKHZNDQQAIROmBrb/aAjDjtir71G7Rotih0yamRZkWXRxKpCRn5hBMgrBCyBKWYCVCqBRCKF3p4+DPa1o7dtA6RJdqxZ2lHR2eXghe7E/p39jO5+dROAB2trSQD4UMObGp4kgBW828jQaUVRm7tSSQMTFwDR6F12nw6gFEDPzru40wP/FxptnTj66MuVzvGyuwHjvvfDY4/cba9JR1WMKD2gvDRv0ugR+ZB2GlBxQGuAAZVU6OlPmPb2HtPW3u+uX90q1q9vNW0dAxvXre8uTsRNKjmIkqTChngKlSmDmMNIEMEyAje2JvGbasBqBtSH3UtmgAhFL9962NI9JpZW9vb0cuWh51C4fCwPdPXSL8/9+VdufmrlMx/Fm+9cOz3wFyCnrZb19XMMEZmGhgYDAN8/aPg+B3x52lfHTRh99IjRFfuMG1OSZ0U0kOoH4q2Mbq1dECVdlp29cazb0IEVKzel16xqMRvW9lud3cme3n5T6LgQDIxkQjhskQjFgDBht7wCIOECgw66DaMDJNzWpEblfwCeGmtqBFGT/vW3Jhy6y4SSyqSxjRWKCCFDgE7rgqph8oRTjjvy5qdvegaYI/Hhh8HOtdOAd1xvW1/fSEKeoRsamlVDA+GsaXnTZpx+fO3kyZUnjR5ZuOfwqjzAJKF6e5FsbdNSWGxHCoQSMdHaE7fee3+p+96iZQMrl23o2tDiRvoHEHMVbAbCDIyAEBBhBhnAZZikxvsJzf1k8KohbEposU6RWZBMo4cKdBwAmv5D+FzT6MVTB+83/GulpUXc0a2NtCMCwoYxLAQ0VY0f/XUwLgWmp7ETjd5pwF+k1VhTI2saG9nztrUAUPKHHxxee0j1Pl8fMSI2fVRV1IIzgPRgNw9ubNfGgEQoIqyCYbIvbrBy8VosWPCuefud1Wb9ukRv7yAcZlRIiwotCZAAXM1Ia7QY8FJmngchlqSMPX9lR3otADf7anLAsMGPmgo1GQCFFcXyxLTDJMgIEhZIhEBCCrj9ZpepE8dfdOpeBxPR7MaaGlnb1LQTzNppwDt2mNxYUyNqGhsNEWkQ4VsHVB506v9+5du7T6k6ZdLowipbDCDZ0Ya+tSllIIQdjlAov8DSFEZLZy/eeum19EsvLXbeX9Ie6uuDVAaGiSqEAIxhpBT3a5feYPAsaLwwqLF8XR/3ZA017Xl+QCwBqB2gSoCbPO8YeMgPD58bvfD5qu+Omz5pdOGwRMI1YCOIACIBEgJGaVNQNYoOPerAM697+J3ZNY2NXs1p59ppwDuq4X7j4Yd0bVOTBhEaztj7mEOO3ffnu+4+4dgxYyLg7vUYbFumB1wFAyksGbJC0TwoGcbSde147ZV3zSuvrEgsXznY2ZdCiRAUDlsACYbjcq9r0OwqPJS2MXNtB7du9vyi2q8BN3tWzA1D3O7HWzU13ucvTa38TllhhDt6tCEB4Zk9AQSwIQko2m3vKScPB8qFlJ07w+gvwEb+bwyVv/HwQ9pHk+3La6Z9/ahTvvSDybtVHFJSSEh2dnM6lTIsooKlRYCGbUukXOC95Zvw+quL+xe8sc7d1KYKHQMmS4S0YaQcVtpgtiY0DRo8taEbGzN5NSDmACIw1s/SaOoAUQ/wl/ct2+1Pv9rnnVEVxXYirUEAkVYoPuBciII8QGuQiGilIP9cd83ZP73+qXteqKuzZjQ07ASzdhrwjgJOMYjIALB+derUM7982qE/3Hdq4V55VgJ97e1stDZkF0giGyQAK5qHtDZ4f+k6bp79zsArr63tWN+JqCVQFrUpTGAkXKxLKTygNO59vwfvZrwiINsBavbAp63m5Xh2tUUzmlXTdYfXn3bU2LrebkcxjGW0AqkUig88F7KwBEYDxpC2YmVy7uOPvVR90qWH++WknfzonSH09n1IMTcKolrd0EC4vGbXI6effMjV++w75oCYSGCgpUV3OQ5JOyTYgoRyEM4LwZH5WLJsI16c+zbmvrw6vbZFuQo0OmojJMBIOLzEJdw5mMadq3rQlxsaNwP6P6HGn9kBPL1ZAygeN6r0Am0kIKUQDIClfzwbP4omWMQCbpx3m7bHIT8640vTAFpUU1Mjm3aCWTsNeLsMlxtr5OlnPKSJavVpUyOHXHjhCfV7HjDumPL8NAba3tXdLpEIRaQVjsAoB+GQBOcVYvnGAbzw3Fz14rwVclOXMQDCBRGKJBUjpTGTGX9e1I6n4SPHPsnCADDNnyKX/bhrdl21JGpWf7j4kG9Mm1xamRhwtRRCMpNnu2wB5FOfyYBBxG5aDRs3zjrmuC9fTPTWt5gbQTvBrJ0GvF2Fy4CoZ4bP+S365zVfv/KAg3e5cEKVob6Na0xHVwrCjkiyJLTSsKXhUHEZtfQkMfu5d9PPP/dO55q18QJI5EcjJI1mpFyeldL47aJ2PJ8bJk+pq+OpU5dwc23TNg9F/c4j69B9hv0oLAynmEkQACIISJAVAsgCmAE2YCaAlTTuAE/50tTaYyaXXA1gcV0dREMDtunrr6urE/X1AFHDzhB+Zw6ckxM21kiqfVADjD+etf83v3z6gQ2Tdy2eNNiyAanBAU12VBIZsDFgrRCORZGSBXh1/lp++snXkovf79SOi1A0TGE2jJTG7JTG1W+3YGZwzWoAsXmIzMxeoErbBtWdXVdtHXlZs/pzw5FfO/urIx/RCaWZpaScF0BaITrtm5B5EbBR3u1mBsMoES227rn+3r+ffdGt/7uNGxwyKU2QdgDYacSfcH1hGvrrAMHMgmqbdM0I3m3OXWc9cc6Pj7xvfMXgpM5l76p0MgkRiUoSABtAECOUn4817WnccefznX+64cm2txd1SlugID9M4bTi1/tdnPjqBhz5dgtmsnfYSXg1Wh205V37y69dee9tPz+LiJgIPHt23baIamh6fSUzQx60V1l9NGwxwwYJAQiCEBIkLDCRd1CBfBjNI0szs4RJmerjDjzjuClVUwCYbaFa2dhYI0kIJqrVPzl/xl43/e682y+8sCbmh/A74/j/VgOuq6u2GogMEZk7fnbURb+9/5I3qw+vOsFtX2r6OvoMQlGLSYC153XtSBhuuICfmr3cufraJ1sffWqpclwalh+hcJppTZz52y+vx4FvbsITvseVvglkvNTixe0EEF5/dt74/Sr77l70QsPdJxx55MgZMxqUlAKNNVuv75Z94sbvLjn8gmmTy/dKDZCRdkgKaYOEBZLeh7AtWJEIe3YrMjYihEVIJ8z4PXazLrz4fy8hIr7wwtlbzYBqaiCZWdTWNmk2pvThO77/+4t+ftIbqnuVc/PNTYPmga9L7KxH/1eG0BSUQg4Hxl95x1k3HTR94lfcrtWId3VpEYpJb18QjNEg1rDzS7CxM4l/PfIKZs1dNeg4sAujFHYVm4TCn9cxGjZsQPcHhcrBqq6G1dwMNa0ED355n9ipV1z1derQw9cvXKqvOeHs628H4DCzqK8nNDR8prVfYmYqLi4umvfQ6cunjY2WJHtdELFgGBADTICUEl2dXeix98eUI6qhk93wEmT22BvGQIRiurujXzRc9LtjbvxH8/MPPPB1+XHUPz5uuHzj9w4688hvfu2SKYcfPPGRG6833/rR49elSPyS2ewMo//bDLimBvKhh4U22uB3Zx949klnHn3tpBG6vGPlYmVYSBmKEWBARGBtQFIA4QK89uZ63H//y+lVa/tlQQyWJCDp4uW0wc9eWotXA3DqP5WBgva+Q0bbN0ntXvDt2snO2V/fM6yjI7G0s+SNV15tufj8ultmA4CUAj5x5FMzn7wcv0nfd/MZd3zz5F3PTbf3awhIGJ+PwQZauYiV5PNDjS/yk89uGLzjuUcKmNMgTnmxKsHLhY3QIq9ULpgzb8l+M36yDzM7fjj7qQ8bZiYhLWaj8YODrEPPvvj7l045dJ9jIxWj0PHuvPhJJzQ0beqyWtfF3V99lOu9c32BQujGxhrZ9CBpo03hQ1d+5Z7zf3H8XaMLuspblyzUTBFLWDaBFcCA0QYyEkOcC3D/g/Pxpz/P5FXr+kVRPlkMxOMGF7+wGoe/tBav1ng5Ln2czeRq3sQgevjpVfLNFf082LZMTS5avX/NyRNfaH74d/ceOrJiL61NcSOzFOLT9eA2+sb7z7+cedTxR449V/V0G0hLEgEkhZ8DC4SiIR3v6aHnZy/727zXWu6Z++DdJCMFxmjlG68BYEBCS5PoVPtW7zfl+Yfrf0tEaOTGT7Un6uogZvNsi4iIjR792HWn/PHXd/55zj5fO/HYSDTfRarX3POXR5ctWscdJflYttME/8sMmGdXW7W1TfqEYt6j+Y5vvHLqGV86021brHo3bWIrr0ASMdg3XK1c2IXFWNuawh//8AQeePAtw1pTaR7ZKcUvdCVx0JwVuBYA12XD5Y9kZD7Digyrv0mLOjq7HPHMc++yXVxqdfYMGNH1ijli7/j//vXhy1+68bIf/baW6EBjOI+Zqa7u01x3wroX5/xyYFMbKFLExC5ICK9pQUqALbYKi8RDj8wfuHtW392DIrTmzj//raNnzWJphaPM2gXYBYwL1ikwJyRSg6Z98fzvx4CqWnG65k8WmRFzo2xogJlBM6xfnjL1R4teuHLeiT/7yf8N32Wy5Xb3auSXyddnvkS33vlW3shiOdotc+/7uAfmzrXjGjAxN0qa0awuPWm3muv+duFrhx5cNaX1vXe0kzKWjMYIbDLIK4FhFZbj5ZdX4LfXPIqX32xRsSgJIqT60nzxCytx1PwNeLe6GhY+WTMB1wBiQQvWudr8tCSfxII3W3jl2i7kF+cJB1HRvWqRHiPfzPvBd750/vxZt/3t/G8efx4RWQ0NMJ9EZL2ptgkA48nn1qZuuPJhdPXEIUOWx3MmgI1CuLjQrFu6kR5oWvzXVF7e+6GKqnteeiNxwQO33gnIELNOASbpfagBSFvg3quuE1de84RTOa6sEMx++8PHqwCAiIlq9Xlfihzx4n3/90T97Vf+YY8ZM8aaxIBCqpdFKF/qZAJ/+WMjadCE4uLwb5csgYOd0sZffAOuq4MQUjJRrb7lp4f99geXnvLAuGEq1rbifS2tqCRBYNaAIIAN7JAFEy3FI48twO9vnM0b2pO6opCstOLF3S6OnLsG19Z57100N39yZYomQFcD1ssb8XcNPD3Yr+Ws5xYpQQrQLmCFZX9PH/e9+5DZd8yKCddfccbvX3zypjurp3xpUkNDg/Fqxx99TfGjAzvPzpuzoN889PfnSMZs772DISWZZDwu//zHZ5bNXGHdNa3MctavX9ezWvPDjX+f8/hrjz8mZJ6ltZuAcRMQURvvvTSPfnfTCy2cb4cqaOCThPjUADIFzGWP3njODfX/uOX5Q7/5zaPC+ZbR/ZuMgGtpNiTzw5j35DPihRc3tETy5UWvr0m8Ay9l2ebe14uCvhhTKrb7N1FTA3nZ5cIYrYc9/vvTHvzO92ZcbMVXc29rK1vRAsmZiFeANcMOxzBgCnHHPc18x70LtKOZCiKQcYf/0j6Ig95Yi1eqq2H5HvdTI58+dZL6HD5fAT0vNG8QS97fyOGQgUonAGLiUIHo2bCGqWUWHzql93/vvPtbb//m/OnfEkLwx5F5XeJ7RmW4n0Mknnp+RaKvoxd22AaDYJg5lBfDhIOPXO7C7R6756T0d7+7r11dPV1WTdrtgZETRgGJPgjjwiiHIQRmPbNg+YoeeiEkudcx0faPA7TV1UEwM07eO3zIy3N/u+CkH5z5o+GTRlom3qpZKSGkLRgaJIzRiW786/5nnlrr4P/e6/jNn/zn+VxCZyLihoYG09jYKLGDV2K2awOuq6u2mh4kXWLMyCduOaP5qydPPa175SKVHnTJCkcJhn1IlWC0gp2Xj5YBG9fd8Kx54unluiRGMiwRH3Bx1uzVuGBJBwZrAPlpvO4WlqkG5PxNWK8grmrrZvHQE8s0kwujHBhjoI0GWWFylaDkhrfTFaGWvFWvL6pmZqCp6eN4fANADDrqR8KiJSvWOdEVyzs0RWJgY6BZSCR7uebr+xxb96vvFTz55JuJW2+9npubm83PflXzo1G7D4OODxKxgSACD8bx6qsrOCo5aYXEYe+s7QuaMj6SAU9dAiKSHEqkakXH8rGASKl4LxNJCUgQCEYbFvn59NbcN/r/+tCya0mIJp8+ydt+P3le98c/vmi/iy666Gu1tbWaiNg35J0G/Fmu2XXVVkNDszqhkCc82/jdF044euxure/Od40RlpCSDGuvRASCUQrhvEKs3RTHtb97cvCNN9Y75cVkaebFXWkc89Ia/NXPdbcKYNIM6BpAtsXMjWTR+6++1iqXr+kx4bCEVgpGM7RSUKkBWEUjrPmvtfPq97smgplqmj5WFMAAsKAF6xCL/I+jsLGrN+7AssEQICI4KW3K8vvsk4+dcAkzQ4gj1T03fPvUvfYafoBu22gEK8HKgQTBjae4t6N3dErjhjdWu8v8/fCRDev0B6GB79hsi4Neevp5Y+IDIWFJAlyAGBAC0o4ZuBIP3/fkm73ABqPv/9y83pIlSwgAFi16c+TIkSOvnDnz+WuYOVxbW6uZeYf0xmJ7Nd4ZDc3qlGnRk676249e2Xv3/F03Lnlbw47YHivQJ2eAwEohVFCChcu6+IprnuZl77eFhxVTZCDJM5dpHPbWJrxSDY90sRVPfQaAFSuQDtl0WV+foRfmrmY7JMBag42G0QrGTYMkY/XKVhTEUAFLsvj4r8nUAHL+itRbyQR+lBeVERgDZo/EQcKWqqvDTBquT33kkRunMTMO2G/cJZbsYU4PAO4g4CQAFde2LWj/vcddFgferavZPfQxQ1piBlWMfmRMzBbDV63rFImeVhIy4GQwtNZAtEIsef0danxk0ZrS0kkdORzobb7a29sJAFauWTnm+uuuSy+Y//pRzc3Nb9/7z38eQkSamfFxcYmdBrzZuvXW8+wZDc3qB9VVNVdef86jk8eism3le9oKF0jyRJ68/lYSYK0QKSrGwvfbUtf87rnO9RsHuLSQ7LjD1zevxZfXrkVvDSCbt4GEahOg6wARajFNRmLRK69ukq3tvVpaBK00tFKeN2aXE2lQSqEVDFz6SUpKNUAdjJgxDfHxI4sIqYSG0WBtADZwleCC/LQ1abj42U9+csZxkyYU7Wm6+wzplGAnDjiDMAPtIKmx/zEHWXV1daL+wppPhAeMiDlaac5POhoEN9u+6JHPDKAx9+ln3loZxy/6+lZ9rrOZKisrPRBQ2CgoLPjSb6++mpoeeOC9XcaNf37WCy9cSt5i3xvvNOCP7cZmV1vnn3+b+/9OHF37s/rTHxg3TJuO1ctMKJovAQMhCCQIBM+zRYvL8ebi9uS1v3+uo78vVVyYT6Irzb95YTUuqvNnD23LGuMST4FDSUs2rNygMHfeGiJoOKk0tONCG8M6kRajJ47qWdOH61hramj4+GHbhRdWUwOR2f+AEScNH5GPVHyAWSsYpby2QZLS9PYgpNpqp3+p8D7bDLByIVg5ME4KJj0IlRokJDagpCT/xIaGBuMNXPt4t6umBuKdpf1rNnbq+8eMKkReeYU22h/5xBoyEuXuVW/QrCeabwGo4/8dZix8jpxnX7hAOI5zu1L6F1VVVXl33HXX+vpLL7nKFuI3773/3gsnnHDCHr43ljsN+GN53n1tmtGsGk7frea8X9Y+UJ4f5+6168mOFghmwNNo84zXaM2x0kq8sagTv7/hBZVKOCML88kedPmcV9fiKh9lZmxjfm0AMk2arv8VdzH72XmbVFdnD2snDTftQMNCqq9f7LbPLjqxW9mrHwcwygAxgJg+fY4B8/ADD9r1LGOInWRaslJg7cIoBVYKJpUCUq1RHuwq5GSSWLvEyoFxU9BuGlop6Xa2mykTK/a96pcXHihErf7Yg8+agJqaB2RzC27Z86C9gUilNEaDSILZGFi2fOmFea0PvePez2yooXm7IGyYtWvXppYvX35d2nV/MHr0yLxXXnuFa2prz+lsbR9+8003v/rnP9/8v74Ri+293LRdvLhbz9vXPv/8Be4Pjhtfc+YPTmgsC/WYvo2bKBSNEYxPUvD3udGKo8Wl9PrCjfqPf3w65SaTBdEIpRMuf/WVtbg7aDL4nE56rgGoqQmabPmn99enk+++1wHtpjmdToMNU3ygX48rSZdffe63fuWHa+KjgieeUEGdICLzxHX7XnHw/qMLBntThphJaz9Md1246SQIDrra2uPvvLl0IZk4VDrOyk1DKxdau2CjkHKBYtkqj5sx/BZm2DU1jabmY3RR1dVNkU1NZ+jLvl500CGnfRMm7bD01T2EFTOc7MDbL73eCGAATbUC21fHkVy9evWsdHrwyvLSchJC7HHkl4+97o033lh13nnfufdfj/3r5mAix/aMUn/uBjy7rto6/7YF7jcPrqj5wc+Of2BYrM/0tbQgFIsRGw0SfoO6l/NytKiCFq/o7b3hhpkrlZOwwyGKD6T4hDmr8GSO8X5uy/fCKKsoeqFnEPPfWNTJiUSKnFQarqOgEZbx9W+bE46efPG3TppxEREpy7KYvZM+15Ap+Kirg5g9u866TAhD1KDuvvK43x195JRzursGtVKuVEpBuS6UUlDKhes4TARs2tC5Yuas9xcOdPbBgmuM60JrBeO6UK4DrY3obWvVe1V1fGnxi3/+AxFRU1OT9hr8PwS8qqsTzCz3aFjinFdhJtb84DvXx6rGM9w+QEgY1oAdkotfXYjHH177N5BAbW3T9rb3NQC5bl3bakepm6LRqDOiatgxZ59z9l9vv/3Od0/+6kkXvPvuoqcOPPDAXWpra/Xs2bOtnQb8byd4tTWjYa46ZVq05lf/7+TGcaVJ7t3YCjuSJzw6ZHYvs1YIF1XivbV9iWuuf3ptoj8xxrbJ6Vf81blrMXvffWF/3sab44Xl6yu6+xXjuSWrB532jj4MDAyym05DK42BgRTFul+kK/7fWdf+9jc/+IVSqowaGgwJzyMzs5RSMDNDSMkNDTAzZjSoYcaMfeZvP/jnGafs+dN4V792HZKeMSpopWGUC+26IIJJplx+4/Xl7W+sUfe/+U4LwhGbVNqFcbzfV+k0dCoBpUl2bVipd4mt+P6rT1zXXHPEEdO88BH44Q0/DHuvp1Hy7DqLmYUQgqmhwRCRvvrk0tN++a+L50w+YkaR7tsEQSzALtgYDenSm68seOeN/ro32ejtle+sAYgNGzZ0Dw4OXidA75WVlOzxs5/95LeXXXbZwsm77f6Vf/zj/plXX331vjNmzFCzZ/N2Z8SfG2ReVw2rYS6pY0fycVf/4eynpu1mcefq9QjFCoSXRwkwGAwCaw2ZV4r17SlcduWj8c62wVhBPqX7NX/lpZWYs+++sBcsyB1Nsl0cjGZ4PiZXxPD3H9cO33dkeYQj0SiVlpcgEssDVIqLiovYHnOcmL88MW/e86/deNktDz6N7DCVEAAHQOgbe5RNOOP7J500efKoH+8yBsM7l7+rtSGZ6fwjkcF2mRnR/AK9cUOLvPDi585rXofHfnVK1br6/3e8PdCbgBAgow201mBmwBgYBjjdp8tHTpCr4uPSCxb13X7vPQ/Nee6t1esAvImhxlfyo2N3O/KUM6q/vfdhU04qHlMG3d/HMlRELCMAMyhkq+TAgLz0vF/99PpHNv6xzq/pb+eppAEQGjdmzJlaKXf9pk0LLr3k0vt+85vfTNu4aWP63nvvvaC+vv7u+fPn2/vtt5/7X23ANTWQDz4k9FEhM+bqv31n/j5T8spbVy3lUCRfeK1ulNmUrFzIvFJ0J2x95VWPdK9c3l5RkE/JvjQf/9La7dJ4M9eWCFwVwu++dVTR94/evzicTBsuKoxRUXEBItEYyCgQOzxswt6UCo9Ee59Z395H78di9vLeASc/Fi20Zbr7wNGj5Oixla6d6mlFX3e3llZYMrMnl8NZnI5hYDRxSVkB33jr3Piv7l0/AdXVvfu/1zz71muPPmy3XSr1QF9CgggwDMMezmcMwxgDN9ln8vKionD0/tg0WIqW1oHVg276FdW7sVcquFQ0asLIkSV7jx0/bHThsAjQt46V68KKFRNbEUCGoZnYKiyl15+ZjeOOv3ZaD4l369iIhu2/YT9T3ho3btwRrus6Gzdu7L7yiqsaf/qzn+w1OBjHW2+9+d1jjz32Dl9D7HNhk33uBhwoRkaJRs2676yZhx5QuWvLkoXGjhUIGOM1JHjicGCjIMJ5JilK6Y+/f2zDa6+uySssFNFBZY5vXok520PO+0EraPgvt3H6AZOsW8//2vAipZhJEEUiIeTlRRGNhiGkAKcGNYgor7BERIurkF9UBjtkoWjkRCDfhtqwEP2dHdrVEMIKkUc4MDDGE+cDAGYDZiAcFrqjtVdecMm8P85dxz9hZgoRTfv5KVUv/eyCg/KctIKnCOa1XTIbsGEYo3xDZibjmkg0T+aVjQSxQeHoEUBhmbddlQMkB412XRbSlmxFQKEIYEcBKwKlQ2yXjqC/XPrbTRdc/uzeUsoOrfWOMsIl8zrHjBmzr9a6YGNbW+IP1113+3e/e96e6XQKCxcu/OGMGTP+7CvB4PN+X9saXaM5ntwr3/fbE579ygm77dW5dJGywnkSbDykmeGRNVjDkA2OltONNz7FL7+8OlpaTPlp5i+/sNzzvK+8sv3OuF3rO8XKwshgOumcO3lMOK8w30bK0eS4jFRKI+0quIqhKSwMbEokUqavo8X0d64zfa2rjJvqNgWFMTipNKRlCSEEsfHUeZj9awXjy8YCYGMikZi4++FV7/51XudZzHXO+fvNsOa3okVIgcP3G3l0SQzacY1g4z0GGwYbjcCjAyCSIeE4Cv0dG81AxzpdWFpoKNVnVH87czIO1hA+5Qpg43FrhAWQDRnO025iQPz1hr/+df7KwQcfeODrsqlpyY4kl0MAqK+vb1NxcfHoWCQy6ZlnZs6NRaPH77PPPnZZednxEydOHL///vs/xszU0NDwub7YbZqUz55dJ4lI3/6LA++srd37wL7l7ykZjlns78Hg8hEMDIMj5cPx4AOvrJ89e2Xp2CrKb0vwRbOXe4DVdho25y5TB4iG3tTaMVHMWbkxWTNmWMQMKJYgA9dRSLsa4bBCLGwjFJKwQySsSBjStgECkvEEwIBlh6CNgpEKZBikje8q2Pe+2b1ntKaa7/wPxh45MgWchVvnTzW3US2uuPIbe40t7UFfe68ACRhjvJwZnhF74bT3tXZTYC9PFtHCMmHHCmEUQ8iY76MYrFwwCZAwXt1XKBh2IPNt8f4bb+LJF1oXgpmadjzR+MxOXL9+/bzx48dHmLnkjzf84Zf5BXnXfuMb35C1tbVnWsKKEtHpzCw+T0+8zVDoW8/b154xo0H96tRJl3zr7OpzEq1rXC0syxt/CZCUHsuKCFq5nFc1luY2v5+4+97X41WllN+b5itmL8f1O4jxAgAa/BQlpfHP99amEE8zGQZcxXCVhusYxOMuBuNpJJNppFMOXMeFk07DdRz093TDSfR7ipJCQAgLUgoIIQJGKTwEyvgyOUIM9vboCZHl04ZHl/3By9NqzN9uO/3wScV9p/e3dRkmIbTRmS4p7XoUT9YGAbillPY+Ow7CsQhI2L4UXhYoM/5zsjEwrgMoF3CTBhwXyxa/t3SdiybOKavtgIsB0OrVq2dFIpFBJ5FYfP311//sheef53A4nDr166fV3nXXPf+kQKb3c8KTtokBN9ZAnn/7W+7/7Bc97fs/P+mSkI676ZSypGX53GbPcElKGJXmcPFwWru2Z/DW2+esKs3H7oMKjc+8j0uqq2HtKMYbeGEA1O5g5qp2NX9TZ1qAiZXSUMZAac9Q0mkXyaSLZFIhlVZIOy5SDqO/P4XkQA+8YUcEsiSElJ72FQmwl8nCwMAYDRgFYUdk94aVes+x8vx7b73qQCLiaSPF79CziVMOPLKHZijfUF2tobWB0sr/mfGN28BRBpFYzIvSATA0OLBHNp5YvFYwbgomNQBpEgbJHrzzxvuvAujdDskbn8iQ165d+1xeUVG0pWX9W9dcf/2f33nn7YgxKnX88cedcfvtt99CROrzol5u9SetA8T/LRVmsjFjr/r9N5/cfXJ5bLCtlaxQWMCXviEiCCHArEDRAqRNvrrs8oe6e7sGxoZCNP/VTq796lehnnpqhzzNBYA0uRgzokwcNroyRKm0AYGJmYPzC4YZhj3SimHAGEIy5aCwpBAl5aUwSvvYAAfTFfwSkPH+IMP7AIwmrigUQpRMG7/XVHvYoWPVWV2bephsW3iP7XtOPw8e+n8PDAsQ6qox42CFQmCjQSD/ufzw2wDMGmwUjHJgxSK8YVOLuP6qZ/60rt+8M6d9iVi7doeXiyUApqCgYH1hYfHoJYsXL+7t7Sn40t577yWF5UzZfcoBxxx9TPcuu+7yKjNbDQ3bdlTM1vbAVM+NpLUR9dd99cEDZ+xaEm/dYOxYnjc9Xko/dJbe9rPCJlI0ku666/nVy1d02naY3FUJ/mZ3N/qbmj7bubrbGhQZdPHG2pZU2jCTMQxlPO+pjfG9sYHjaCST3kcqreC4jN6eAW/4GAEkyPPAUkAKCSIBkRlkpn1j0oAdle0b16MUS4+q3mPYtd0bNhnIiAgIH0obaM0wmv2w2UAr43tiDkYpIRSNIZJfmGmSgPEen7U/msZosNbeQeKkGFLKBfPXpF7c4L5MQnBz8xdC65kB0IYNG5LM/PqECRPw8MOP3Hn7HXe+C0GhVCrp7rX3nn+6/777v+N7YusLY8C3nrevRVSrr/7e3ld//fQD90uvX+4Ky5YEhrAsfzN6G1JrxYWVo8WLsxetevTxxbHyIqrs13z8onVY5cu97si5FDPwTmuXTg7GPZq21gZG+0iwBowGlGakHQPHMXAcBWaDvt5BKLYgpA0hJEDMkgxbZNi2iO2wZaxwiC07BCklhCUhJTNFClgOLuZCtZYRLhB2WMKyyQjJxpbQli20tISWkrQg1mCt2SijlWJlwNp1EYrmgUTIa5DQ2vfUOmO4bLSvL80gZoYl8O6ijesArBcE4IszbYEB0Nq1a1OO46wZPXp06O6776771yOP9Ofn58tEMqX2P/CA2y/++cXfJiK1LWmXW82A66qrre/d8ZZ71hHlx3/7nCN/hoGNSitYGYIvAUJKCMsGWCOvYiS9v3hd8vobnqGRpTQqrfmSF1eguboa1g4uO2oAUApY1xPn5R29DsIhwV746XlBVxs4LsNVzMZoY6C1IDbRiGDiNCOviO3SYdoqKGCZn09utIhSkRJKh0vJDZcKHSomtvO0C6GTjtID/QmK9/dSX1cvuju7uX9g0HR193NHZ5/o7OgXnZ0Dsqc7Kfv7kjKRcKSTdqTSjjTGFZbNlJ9vUX6+MMPHVxlRma9DpWEVymcVsh0lkDasUmyU69ePvdPJCoVMsqeH167Y1Agg8c9/nvZFG5cSeOKNzLwmP5qP2+6460/zXnpRxGJRZjbmf878n7/88Y837zFjxgy1rRogtspJUQeI+jlzzPVEw877/rG3jhgek4lN3UaGQsTGo0cGyCppFyKvjJNu2Nx088yVSuk9XJtmPbsMV/hEjR1eM7jaFxWIJ/FMV697wMThERNnQwxiAhkQCAQJYtIG5DgKwrhIJQw62wew5k//QNKFHEik0D+YUv0DLqcdnYDmlIRWbloXs2vylNKIu4ykw5oNkyAIAZA2gGMAx8UmIrSGJfrCNrmWkNq2kNICpAzlM8nR+VG7tKLEihVEKK/0NRcVY1swrCKKYRUFqByWj6K8MEQsCpsY5BLYdaBcDSnIWrpqE159e/2/AKCpqQlfwBUY8aIxY8ZUrF656qVbb/lL05jRY2qKi4pVfkFBdHr1IU8dvN/Bx59xxhnv+mQP3uEMePrsOkFE6q911TcdXD15VHLdai1DUQmjPH6hj7kQAYYsjpSMpH/85fGNCxZ2VJSV0MCmBJ9ZB4iGZpgvwine7L+HfhfzNrQrOmJvorwIkTZMA0klevoUegcVBhKmrT+pUzC8PJU2YxJJDE+5sBKp7m7XYLFrsDBlsG4wjTUAKBIWpUJCSEjYxMUkKc4k21OgHuWIuAWQkK4tAcsQ3LgjW/rS4T5UjHLQEVfAAS7wYM4BOTYMbKgqwMBRMcKRkrsrAcwPE3RZpTVmz92idl5e9LDx40sqxo4rtUeOq+Ty8gJRlJdn7FjYWr++dcWiFrznb9wvqlg7A0AoFHpp1Kjhezw3c+Z1Y8eMmfKr3/y/qclEwqkaMXz0FddccedRRx11GLID8XiHMeDGmho548jL1M9PGPntr339S6elN65UYGFBq0zsHMywZdfhSPloWjT//d6/3/eyGlYkxnQr86231mPTpM9JM3hrhdFEQJzxVl/crN/UOjB6U7tyWrpNS5/DT7GLZzYNUGeooGjRy/GowgZXAG0jgcwBtnJLDzqQNjlR+haXDSAceA5A2UDaoGOJ3zCxdrNfX5EGsHYAuGuAcZf/t2kwsLpNY37bIICB8WPt9ouHF+H04SVUXDmqGFXlUbHr5DKzZFXbAICELxX6RV60YsWK9JgxY1aN32N86N6///3nu0+d8si3v32m3d7W7uy1514H3P+P+28hou8ws0VEW40x+Jle6IDnPIao6qF/nrJw/73Li/tau4QdzSchJCCkb8ACMA4QKeGkI/iXP7tz4ZrVPXuRpNueWcnf2545zp/m2jQAZv8qvAKNPTviomFNwsyC1+3zb2vXb/y0/NZbf4fejan852//8fRJ4ysjlZVlCFvh6OoVy6uLCqL5pflhjoQtiuVHEY2FEY7EoA3C8cHBQp2ORxLxvnLlDBZKIRkUgmYBSSJRWZ73ruvEE8lECum04YQruSehKaVlyy5T9ni5vX2D6Wrv4bWdYk3lId95f+afL7Wbn31gAECX//IKAVSPJByWH8W4kEW7FeVhL2Hx/XPX45s1NRBNTV/4cSkEgCdPnlzW0tJSMH782F/+8Q83nD9x0iTd29ODouIi+eys57/73XPOuWNrDlD/TA2YuUYSNenbLtr/oe9+7/BTe9du0NKWkkAQlpUtGQkBrQ3HqsbSfbf9a/mf/7KgtLyMBhb08dTzWpBqwA5bMvrAFUzg270Cv1jTgblJ4NWausb8I/euKO9cNvvAieNGlfe3v39EZWG4PBySsXjP+n2joShZWlmlJRoxK4kQKVSUFSIaC8OSAlIoEDEgJWBJwIoAMuLdVnYApQAnDnbS0JqgPXgZWjtw02koJw3DBiS8ZgSmMDRJuFrBQKJv0Eaawk6obALijuyCsBa3t/WKhGtm9fZ0b1jdPvji7668oxtAXwQ4c2Qe5q+MYzGy7Xn4LzBiGj9+/KTVq1fHvn7qqX//7TXXTk07aW1ZklKpNN99990H3HDDDW8aY4TfwbR9GrDXIkj6Wwfkn3jNdTWPFYe0SiccS0qPtRswiIRlgY1BuGwM1qxYFv/Od+9fFQ3RtEHmo+atwgtf5FGTdVwnGqiBfnnBjG+PGLnrWaycyQVWsjTPdixb94OdAShnECadgJtOYTCeMqGIxaNGlCjLthHLC4mKymIqLq8gYYXJCkfYkoAUgLQJwpIQluUVjEkCDDJOHCo1COW6pFwNoxQzs9GaYZSGchVYMxsYMMOwVuy6LqcHB6FdVzrplNz1sONROK1aQDFg5wOugJNKY/2mLvT1dfbHUwPzlyxZN/d7PfdezvXeeCr8F61Ro0ZFI5HIiE3r1u3+/+obms4552y7vb2NK8or5ftL3182Y8aMvZnZ9VKpzxbU+qwMmJjriKhBPvanIxd/5Yixk7o29rAVDQvpExBISAhJIBjALuRQYRFd9v/unf/C3Jb9YgX011kr+KwvYug8NELx0v+fnVS2bHR5aJeO7jhH7ZTJD0sdCQnYliWkZVm2LUBCglkiEg0hPz8MKQnRiACkZLItI2XIEAkBsoSGgGaQNoaN1yoEIQiCDFg5cNMuu66GUoZYayJj2PJHnRptCGAygEcOEQKhkIVo1EYkLBASGpW7TEPp7vsDVgFgl3iNx6wMOEUwCYGooGVvLsWpp12z9+KNeKeuDqKh4b9mYDcB4IkTJ47u7e3tHTly9CU33XzjRePHjdP9vf1cXlFhNc+de2tNzde/N3v2bGvGjBmf6f7+TECsxsYaQdSgL/vObnUzDh25S8eaTUqEI5ZxXUAKCBYQILAgaNfhosoSeuGZeS1PvNBSVlpI3W0O/yQHdf7CL9vEE3ASKIwS5UdCUgiSjsvo6XfBnNowmEayL87SIn6LITa29erSREpXJFM81VUYlXYxIAT6oJHvauQ5GiFX+30N3nkJSZnGISQV3JSD2cZgviAM2jbyQxIjhUABGEYQNoYlXiuNoRWEiLIwLT8mR1UUydCYqpCCeb9YhB/dZ9IuVZxfWDIyWlwSzS8qCQ+vjCGvsAAVI4ZBuykIsg12KKr6Z4ZK08qVK9dPmjRp1MKFb99639/vO6Wu7tKJJIg7OzvVPvt86fwrGq6YOWPGjIcaGxtlbe1nJ27/qQ24rg6ipqbRHFBKo7761b1/6vYljKNYhqQGiSARIoAYxnFhRQvR39Xm3Pm3N1/Li9LX0kTfWrSOeyZ/sVDnDz+xDQ9s6nDfH0iZl1MKva0d3CsIry/biLzlg3gFQBuAMnjWUGQDB5aG6EhbkrYk2gWhiASKLIItJSL+XG8QCJrhMjihCQSGIYKUAoNhC0IbsKupJU1w0wZrWEOCkXCZNnSlo4vQE+/09+Qz3q3QB9pw9hKAHUOi00JvAYCCojDShVG8VlmKsjGjUFxZVnRQ+fCiSbvuWkKLNrTjv3AxAMRisZ5hw8ZWPProozcceuihNx591FGmta1NhCMhnnH0jJv2fWzfN2pqajZ8lvXhTx1C+/2Q5tbfVDeeefrUmk1LlmsrbEvAQEqPLiltC9KyoIwxlaNGiccffem1i654vbyygrrnreIDvsh575au+ZQSeqhtgF/qUvjj5odWbgHm67sj9FYrKtNpFLFEHhmEDaGAGGEwIoKgiJBPAhYzpAAGFKMfBikmpP2HM5qgLBekDTp0CL3WIAYLAe0AtAJwCF634KWXQixZAmpvB1V2QLy2EdOExn4kUA6mAgYYlrXKUdTaO1A4P4GuFn/vnjg2hh/n5eHkJR0YxOc4fWF7CKVXrlxZcPzxx//h2muuOda2wyaVSnBVVZWcPWdO0xlnnFH7WaLSn8oDN9ZACin0mQeUHjSjelxN59r1moQlA9UIDQ0mBmmAjeFISSV1dvQMXnPzm50FBXQgCz4JO/h4x4+5BACT1vRGfoh79hgJe/o4EKbD1Nd7RkTB4CcATd4A7A3+x2eznA9wHwxsIW9d4H+ER4GFBHgt3DQAJnSirg5i6hLQxc/LpAQ/tqTDDP4XIdBbDKVHjRrVwszFs2bN+tPjjz9+2P/+z7ej6XSKunt61D777FNz+eVXHUtEz31WofSnMp7A+z76p2PmVO9bXt26fKMO58UkwIDwJ2hLAcuWMCzMiN2nib/d/dSshj++tU9FKT346jo+fwveV9QhOwv348PhOV83fYTf+bDVlPP7nyEzsAkwo0YhcvCGLZmTt6YAvKVrMAXgBgBbukbtAFUC3PQBNvoBXpH/k1f5D/uG/0s97gder912223EunUrRxx+6JHfveLKy84rLS3X8cQgFRYW0erVq1ceeeSRBzJz32chjPeJDbixsUaefvqD+sITx5zx64uO+OfgqpUaMiS9sDlo0geEkCB2UTh8HLriJv710+9qtWJiuKvMuJNb0eUrCplP/DI/cOvQ53Dr/sMW/5R3gnLCbG/MDA/5CX2AXc6adYnV0bFkyFXKpSpPmdLEvrQTf4RXyx/3TnzMK0h1dXUEeONAa2qyp21NTQ03NTVRU1MTpkyZwgCwrftvP+r7GDt27OQNGzZU1V966cNnn3NOUXd3NzFghg2rlA8+/Mjvf3DhhT8LHODnYcB+MzpZT99x8uL9xslJLSs3cCgWFUQCliU81QhfXdIohTH7HojfXHxf4snn18UKSsSvX11rrg6UGzd77JF5sMuicK2ILzhg+x/AUIwz+Dr4WQyAbQFQ2Z+5/s/dnN+zPyifsPwXoz4YS3VznitYiVyEObvLSQFsARQC2PV/b/PHVZt9z/Z+j5X3I2kBIgkkXS/4jQNIAuj3Q1X1WYartIVDh7eOX6W6ujqqr69n/32wZVkmEBf4WDmJ8OYiA4BSKhie5qvzfX5aVTU1NaGmpqb8ww87/NJrr73m/yoqKnUymRCxWIyTqVTyD3/4w9533HHHyvr6evo0h9AnMuBgfm/dDw4/60dn73F3y1tvapK2JCIIKSCl9DScSMCoNIqGj8amdCz9rdrbTF6R6BAwk1/dgHRw4gd1w32nTBjTcNGMhVXloSLWGjY5INKQVj6EHQPYb4QwyhNjY69NWBJBkOX1wtp5mcZ2TzeZQUICEP4GtTwVEAEwPCkjZo/eScSAN5jLU2j0hd48UgR5EjLGi3pIhrzH9Wf/BlkAkfTHwHhSNVIAJASYNbR2YSB8FQwGMXtidWBf8YIhCX6Tv7cBBQyUYYDIlZZISlskw5HwoGEIKS1lYIyrmFkDKcfAVQas02DNUK6DtNL6ndXWM25+1ZPhSH5SwYUwaV6y8D28t2Q1+gcGuKt1cLC7Ww0AmzoApPxzJAagD8yipnZqrKkp4E9/4gPf02ywLG38+7LZCqoQu+y6666jd911V2fUqFGquKKYC6OFMMaQ1poUlFmycDlaN6y2l7z7bl9PPP7uB8ZgvtKLUsqaM2cObr75Zm5qatpmDTLnnXeefdttt5VedtkVr517ztljent7GCCuqKiQ816c99Rpp512wqf1wp8ExKLp9XM0Gig0/fDRv1JdLaw0kSW9w84YBhFDELxGfcUoGDkCjZc/1p5UGF1giateXWOSW/K+JQWJvF3Leop2GVuMwe64cdIJkBCwwg5YxkkI/4Bl5XXA+wwvISzPmIgA0eUZo5eke8wJ4c0TJiE8FQtfU8rXQ/Ue05js/0l4xhs0LpPwedwiUJLznB/544wChbngbynYj77mVyBUL/wzU9oAWdnzk7X3mIFIO+dGsQL+6WGD2Qa4EOBhGdkMznGdgbid0f5BA8Cycbw9YWp/PP4zryFfwbAL59j9Ee/bHal0HOmUY6QQ8ZBNPax12hgto3nRsIzAXXzHic6/konfA7i1pqZG+iM6/+Oqq6sT06dPF9OnTzdCiM0ZSFWnnXb65Im7jN9z0oQJE0aPHl2QTCSPGD16FIcjkYpIOFKcl5cHaUlY0oL0Npen1aU10qk0HCeNvr4+JxQKr+nu7KKO7s54cWlx87sL30VLe8s77727fN2jjz60Rmu9noicXKM2xgRzqMzWbvcD0Pbcc8/cfuwxR11RUVlhEomkbGtr1Xvsscfx11193RFCiLmfBtD62B44GJPx6/MP+PYPvjnhrx3vr9bCDkmCyXQaSeFxn2EYkZIyHgwXu6d97Y6FMioKTIXZc8mSzPRABrJE/yN2Ce0+tcpefMhhE/ClvUZRVVkEynHZSWsIyybPMP0DlLwR8RAEIS2IjDgee80S5NVFPQE4XzRPBEbszRkGfEVMUNYj+L8LphwD9r9HQbjm/33m/94YGO95pZ8FkYfA+wdH0AMdvB6AfB3sQOeZcm4GZ0NXX3OXAyFoZhAMB/Oz2VeJ9A6hQC2SM1kxgyGFNhJagBhENhhetCHYuw0MS0CGoJWBFZZANITW5a3416Ovt9zz6IpEe49zwep+zMR/rtVTY2OjqKmp2dwwyr///e8fvvfee88YMWLEQSNHjhwzrHLYsIrKCi9a+4igW6CY6el3GQAs5BADZxitMZiIY6C/H729vZ1tbW2djnKal72/bOmiRYsW3HvvvQsB9GbcvpRQSsn6+nreGvl0XV2daGhoGHn55VcsOvusMws7Ozth2JiSkhK5bu26OdXTpx/lp6Nmmxgwc50gahBP3Hny63sUxffubh8wVti7C8Qe6iwEQdo23GTajD3wYHH7PXNfvOb3r48aPty+5K2N7t+34H0FAHPghNAuJeQsi8eRHjYi2nrIASNihx84tmLihHKkkw6zC08NX2TDIxBn8iASIuu9yLs5npdE1vt6MW1GTI8D4wRlYBTK9ai+UQsSntGy/zdCeIPGyTe8wNi9R84+pv+8IK9rH4Iyj8u+QF3wALRZWcfTafYPrECYh/xoIRC3ywlFg9CfAwMmn5rF3uQF731Jb94UGKxVMJmBSdgcKRmGrrZO8cS/5q37W9Ob/5y9UreMLcIPbQu/X9GFmz+oXl9XVyfq6+tJCKGD13PEEUfsfuqppx47ebfdqquGDz9k7Jgxw4pLSnL/zABgow176mAsBPkXkXmoW2T20gxtfDVNBa0VlNLMhtmw8XS62BjDDG8mnIBlWcK2Q7AsCa01evp60dHR0dLe1v7mkveXvPr8nLnPPffkk2/6WAKklJg1a5Y1ffp0/Vl55sC7nnTSiddddlnDz2PRPJVIJiyjjS4qLpJ33/u3717R0HDHJ/XC9PFeTI2srW3SDT+dftQZR1XM6l+90lihsBAU7F2C8Dc7YBDOK2Q5aldz2tf+9GiPA7PvMXyGL05ntlQfnTQpPHFqWL2XShrRPsipvjhWjKuSydrjd9ntqyftXRIibdLxlLAsy/emBCEoK/rmP5TnLIOfi6ynpBzvy/5rFiJjOlmj28ygRY73zDFQr6/Zf+4h3hiZQwO5+XdguERbhKeDPmkKDDMwUvLy5WAzB1pUGcMOPHZGnN3kBDieZ/ZmKGWVFLyUlKFdF1Y4zFashF6a945z9+3Pvvv4K4P/6jR4YXyp2M1oM12QbFzdq5/Y3AMHhptDShh/af2lJx1+6OEnjxs77tAxY8eEQqGQB/45jjGekJAQQpIQIhhN4h82W1KgZe/A9CdRaN94jdbQxpPSNdqLOjLKmj4QZjwNL9bGMIENgSClFNFYVMRiedDGYNOmTaq9vf2dNWvWPDvnpZceu/u2217LMbxQTU2N+gw6iKiuro6uvvrqXa+77to3Tjv1tLyurk4wwEVFRbRixco1xxxzzB7MnPwkoBt9PO/rJdxP3fs/T+2e335c+4YOE4qEJQWOxc89SVrQyX4zdv8jxLw321785nkPrJkwyn767Q3uPz7gFPd203DEvlYs1ySSuqIzBSRdSqUcXgkXbaceXTn2wvNnTCyMKOOmlJCW5XlT4f1pEPaKwCh9D53xuJTNVQVETnjsh9p+UYZENkxGjnGygHcwBR49x1hJCAgiGD/XzWxI/7EY/iFB2XfLuf9nyiCpmXA4x2AR+ExfhjfXuJE7ncE3fGbtv5ush854Zv8gYwMYpREtiJm2jj7x+L9eWnnXPxYubo9jH2HRYNrle9w0XlKMlg5PAWRzw82EfWd+48zJx5103P/tuuuup0/ebXJJLC8G13GQdhztRQMkpCVJCA9/CNKdIO4gQVsst2WiCwYMe/mvzhinzgxl00r5YvOcCa+ZgyzDBEmJN3XCaE/GCIBlWTIvPx+WlGhta0VnZ9dbq9asabrjtttmzZ07dxmAvs+E4eHbzSknn3zPZVdccWYoFFaOk7YA6NLSUnnfffdd+Itf/OKWT8LQ+siidjU1NZKI+Nsn7HvAqDL+SufGdhaWJVnrLJDi6xuz0aBwDG64GPfd9dyK/Bgiu4xyHwHwQXNiuQ4QaEEi4fBvXENvEQDDTJYFy4qI8Xc90f6PP9w8++00QsKyKZgQ5O9fypxbQUhMlLWWTN6ae1wQshsIfsorhs7YpiC0CMJf/3kI/+55mQSIpPdcQvrkZD/P9usx7A9D4RxvH4TXARqeeU05xh4YLdFmxzNlw+1MFkDeY5NHo/EePwOiBQAdAQyOFubzG/PfE1fU/fWVK25cuLg7RV/JC9EoaE64Gi+3pPBSRxorc4yXZs+ebTV484HNueeeeejTTz9136/rfv3OKaec+r1dd5lUkkoldXdXt04kEgywlEJIKT1vmzmksnfGfw+8hdo5Zw/dXFQ5E/2InPtJ2QNsc88QpFc+HmJZFklLSiGl1MZwb0+P6ejoUGE7hN0nT/7S10466apbb7117hNPPNl48cUXnwYgzMGN+cTlOe9If3727JvnvTjPhGxLGmP8YIt5//0P+DmAIj8ypa1iwI2NNQDANadN+nYpd8NNKa+B1AQhi/eZhICTTnHxqEliw/qO5TNf7UmV5FsvNr2KZPWHCMn74yfpuZXm9tnreF8wDrIIN3uAthlTUiim/e3p9r82Pf5eOlpUQsxByYayBuXTGzJFTcqGX8E2oQA8AmVP5pzvM5vMmeBF037uC4IJLIUCwxAZMAtEPigtcsJ5ypgsC87dVVlgLHPAeOg9+Z4neCdeGhvk1sj5HKT7hCHbi3Jy+BxQzvN+EmwAIaSRsSg99shMfdWVj/6h6cXEu+EYHWYMdw06/Ick4aSWQczzbU0EuRwAnjFjhjrjjDMO/Ne/Hn7m17++5MXp02d8s6CwMNTa0qL7evtYKSWZWTIzmWD8aU50kOtdM6NReQuwlS9iTwFgOSTtyPmUAR/9+U45Rky5xi9E9p74sIMQgrw82bIYQG9vr+lob9f5eXmRQw895NiLf/GLB//4pz/9gIi4rq7u09COTV1dnezv739jwfwFz7quS5aURhCJvt4+s+uuu0y45JJLvkVE/HEPi49kwAyQEKfrvSdVVZTmq//tXNsClpb0xnB4RqyNCQBTaMeYvPLheLSpeXGa4JaXhx4AQM3/uWGBa2ogAfCCNry2uAs/BePLbOhuAZ5iCRF+duZ78zt74hSORkyA4noIsBc6c65nzXhOZDwYiLIOmAgC/gkdeC/hhXQiJ+wOPKbwD4xc5gMHYbOf6wbhscn1MplL7XtpCB91FlnPG+iEUbYsxLn5MmXccTYEHeKStyBi4h8y/vApGM0IR8JaEUTj3x/ZcNUf3riyebnVmhdFnqv40ZSL2lW9+OmGbmwM9kZdXR2YWdTW1uoooiMebHzwlssuv/ylLx/3lS9HQlFubWnVynXYsi1JUlIwN8k71A20f8BncvRcQ/aNlDk3NsmFB2iIYQdeXPgHHg9JM7IenjYLwYko+/dDY7HMIeqH90JKKdPpNLe1tqYBmMrKykIAmD59+qcKo5csWcIA+JVXXvnL+0vfR15+XmYyBgCePn36t/8D0+1TeODGGsHM+MEFB3xteNQtHOxLaSGI2AQ3y6s7MjNU2uFwcalo6e4fuO/hJc3Fxdbi5iWJ1qCg+Z+eytdSIgCiGrCW9WH18n7+rsv8YztC77y3On3zokXrEQ5Lb9xIDkJLPvrqGd7QIz1zc3NCMyG8HJrIz2U56+kymFCOt878m8mF/RAYyAGnhm4SDipSlFt7zgHAgsfNOpKM5wVn44QcaPrf6i3+FswCaZQzIN1/BqMVwtGI7ulPyr/8qXFDwx/ee2pNv5TFEWUnXTQm+vHD9Z7XzdRIGxsbZRAu//aq35796tuvvH7Ml4/5ni0tuX7tep120iRlUIDnzOsJZisFQJNmb5Ba8H3OAek4x8CY/z2czn3bhM3LejTUiHmzODwozRENZZkNOSQ3n/CY8cxSaS1c7X4mDfhNTU2amWnJkiXPvvHGGyttOyRJkBFSyP6+fh4/bvyB11xzTbUQgj+OpvRHM+CaRgMAo0cUXOD09DBbApl5vpmN5F1QlUqYyrHjafG7a99c1geuGlY8O9gQHyfvB2D8UpMAINYO4On2lHlmbQpN7d3JDZKMEMTGu4+cGT0y9BTmrMekwEdxptLkbR6RFdrLgCxZT845NWBsHsbRZjlYboKd+RsJkJXVwiaRRbFzQasgjM/I7gqfLcaep87WqjL7dEiKSFlgLbdsJQXAykUoZquWjj55918aZ/3unrX3JiBNSOjOZAoPtwzi0TaPppnpJGJmWVtbq485/PDxM2fOfOzMs799V2lpycgN69apdDoNz3BzqI+8WQ3MN1JtPPTYZAw6QIyznpeDmDaIkjhbB8+mRDlG7f88+FbmQBjixT1OQMY6c0DLzavNnD0pwcwQQkKQ9Eui4jMj1dfX10sA6ddff+3Bzs5O5OXlGSKCYcMFBQWYMmXKJcwsampq+DMzYB+8wv+dd8yBw4vknl1t3RC2LYeeddkwVdghQqwKTz/+5vJyGyNff69j+ackuhv/IziVtOuaNFMW4BkSMueEmENAK5Dn1XJuYmbGrl/XFWKoh8yE4JQFtIYCZMjmw7msLCF9QEv6XnEogUMQ+eoZQS061zlQDpgWoNecA07lRBM5niiT7/rPI/yvjdaw8yOqpbXPuuOm+5+58s6W20SEygh6aVzhwVYH7+WYh6mrqxNCCCYifd1vrzv7ljvvevnAAw44sa+3T/f1D7AdCltSiozRZQ9F9pFu488c9/+fGZyWNVwdjDb10y4wctDy7KziLEYxtGljCFqdk07wEBAzGx4HBu/Zqci5jt7hKIZELn6YLglSSoSl/ZmROvxoBs8/P/vBN954w4RCIam1ZiGE7O3r5YkTJx11zjnn7EVEpq6uTnwmBnzhhVMIAB+4T9n/xNKdUjlaU26IGVgSBJSTRn7lCLGhrb9vZnPr8NLSyHy/IP5ZnGIm61eJhD/cCz41Uoic0JWCEqKPWmbqvP7/MiBUQNhnfyKft4G84V1+WYIZrD2GT7AZtT/RHj4Qk5kZlDPx3rDxf6YzBAtjlEdl1Aqsvc/GHxaWCTlzgUH/Q/tjSI0OHpcyAF7mPQRxeAbEEmDDsPILdVt73Gq8+5HHfntf16/DeaLKGH590MLd3clMrutz0uushoYGY4yJPfTQQ3d/+6xv3xUOh6rWr1urBZEM2XYOZkx+SptroIFXNTlGw5kSTpAfDzFo3vx9Zr5mYwwbn4LGzKy19j6MZq0UK619Y8+W7SkXBMsyc3J47bzZwcdZo6UcQFEIEAN9fX34DJcxxpBSatHbb789VxsDj2YKOI6jKysrcOKJJ57je+uPZDP/CVmj6dPrNdAQG17EJ/VsaoURtjA68FrkXUDvhUA5jikeNUG8MHP50rhCZOKYgrnL2lLAZ9zg7XEiZE7phDJZmLenvdm5ApQBhURQ86WhTCgLgFVYYCAj7PP1RLZATDkbQWRAqoBhBZJZzysAj3Sdw7Emyjkj2U+GA/ZVDlkkk3b6TCsI3yVpZCafebJ1niUYBZN0ZSa5C3jRQdhIBG0MZCxf9w2k5AN3P/rCVXe33VVUKA612axeN4BZftNCJrUJBNe+8pWv7PrLX/7y4f323Xfq2nVrtdZahEIhmY1CaWgominf+Vx4j6vhVcjJD22NBEvvfRt/rwSdR1prjoTDxrLt3IN+iwOzLSu7XY3WUMZox3GgXJdTqRRprYV3TmepqpyT4HJu2TATnmd/5kVtQwExpT5bjcXa2loBIP3yyy83rVmzZvqokSORSqZAgBgYGEBVVdU3pk2bdqkQouejRK7Wh2NXNYKI9DWXnHRgqZ0c09E5aGQ4IpQ2EFKATBYQ0pohQlGocD6/MPPNlcLC283zO1qxFRQagjzJ5135xpgLVOSUk4bUf7OhNfv54aAbwxtzO0Qsqrxs05aQUjLIIiYDhmQBIkGSpbTYA7rZ+GEuwQp7BAUybIxnUCRsFpAg4RmVYQKzAZGERYYNG3JN0JJpsQAB7LJy00i7KVIKFrEgz4C9GbwwmkCEgvwQRgwvRVlZKWDixiSTAiT9chP7/GgGyTA7muTfb/pn5433rTX5+fQbx5hb8gfwHLzWxMzmCKYHnHfueaf+9Oc/vamisqJq5cqVyrYty7ZD2fNms6g1OE0NGLnppjEMCIZgAw2CJINsqswgTRyLxXQkEhEABDPLvr5etLa1oa2tDZs2boDjuC0D/QMYjMcxMDAArRSIBPLy86iwsJCj0WjFiBEjrGGVlaiqqkJBYSFCIRtKaZNOp00ymRRaKZEtHyFbD/aDQg7eGFHAZs94Acopv32Wq6mpyfiaWE+/uWBB76SJE4sTiQRbliWSiaQeO3Zs2bnnnnv6j3/84780NjaK/0SvtD4cu6oBqAlTxtBpVrybDbOxyAj4A6Apw4AC3FSaS0eMFF2dAx1vvN5WWF6W90ZXWxzYCp31RhmAjB86kkczzKUz5oZJGe+AIScvkQVm10Qqx4oXnn1i1tK3lt06ogxOewK7GsYEKeAywL7elBEWbEtAag2LgUICJAMhwygiQFgSfcqgUDBUOIxBrRG1LQwohTwNwLKQlkSwLU4qhVgyTcNIckJI6gfDJbDruhCpNFJSYCMYvWAkHQd2Mo0qBmwi9FaWoWzUmNLykoqxXznrO8fnVw0rYJ0YpIABxmzAWjFF8vDU3xpb7mlcuSIcFUc7rvmXO4DGJZ7x5oJVFhGpG2644ZyTTjzpzlDYxvr163Q0ErWweT118/wfGGrczDCGkGUf+mw1o8GsEI1GdXFhMUiQbGlpsRa+sxCL31vc1trSumDt2rUbBgYGZq5fvXpg8dKlnQAWf0gAxgAmjBo+avSEXSaEKsvLvzxx0qTRlcOq9ttl0sQRk3ffXVRUVICZTTweZ9dxhGVJosw1GvpAwf+Ez43P5JdSfuYGnFNbX71o0TsLTj3llKNs2zbMLH3qL+8+Zcp3ANz2UcAs68Mj1RozfDhiBVbqxN6OPiJpiYCsAc7BD4SActKmePgY+dLbbYs7XKypmVz+1lLPgLeeYkJQ6IcHXHGmjJQbBfuorshl/wTsK8tEYlIcc/yU5t/ev+JBDD8+ltfyVGGezeMA2CREkSBTRIQQM6QklJBAsQAKLIlyX3gE0s9BhR8h0xZKILllKEbAACVoAK4BjCFohqMMVroGacelXm0Q12R1ScEdpKF7Dd7FSvUmXu9GCN27rlqx4ZFr//SjKcWxfGPSCcECYO1AFhbxc4/Nwu9umf9uHOIYsFnS5+J77VtAmolI3XvvvT/48nHH3eik07qnp4ei0ZgM6uaUyzjLQbuz1NAAHESGxx1QN5UBjHERiUR0YWGhTCaTctYLs9A8u7l1wYL5j8178cWHE4nEK/AECv6NvUQfMmKJmZdsaNmwZEPLBgB43P92tKqqav+99trrK1OnTDl+33333fOwww5DWXk5UsmUTqVTQgSE42D/IkumyQCF/l4SgraGAaO2tpYA4I03Fvx17fp1R40ZNQaJZAJEJPv7+3nsmDH7nHfeefsQ0QK/m8l8bAMOwue6nx18UIHNY9r7UsYKW8Ljyft5DPnEeWFgWTaZSBE/8eQT7RB47d6563rxmUvFchZ6YwxBfjMloSGBc3BzcrqMkAP2GAbcNLq7e2ONNUbes/iFwsUJ8y5rrDZAJQk9TAoMI0aZ17iIAkkoBFBIRCMBziOBAiIqCvjgIgPx+B6L2e9MpCHkggAEFAAkKAnB7TBoFYI6JXN32OIUM7pIOqvI44X0TiT07jsBNvYFbr/TWnb7zI6vHfn4i2+d8d2vxXSnw4IdknkF5r23l4l//nP2H95rI5QVmLSj8YP2ONpyjXf+/Pk2Ebm33HTTpSeeeGJDd1eXSaZSIhQKU+Y1Zho5cmrgnJs15nRi8VDmk9IaoVBIFxYUyo6OdvnA/f9A89x5s1577ZV/btrU9i8A3X7NFVprUV9fL3yyA6ZMmcINDQ3MHy4HQjU1NeT/PtXX1xspZbK1tXVua2vr3GefffY34XD42GOPOebcY4899mtfPfFEq6K8An19vdpxHCktK1PHzyDWuVUHEkMIH59xGM1EhIULF7604I35auKEiZaJG9iWBaO0rhhWaR1x2GFn33bbbfPr6+tFg6939LEMuOLCdkITsOuYwuMtnWRtjBFsRAACGDYg9gzGuGkuLKsU/UnqffW1jZGqssjqVR2preZ4M8aRmxNnAiKRoUX+G+OGhiqwkQc7w5ZCfa0JuqY6b7B8SWJxEqCuMEZAYJgQKGSDAksgahi2YMSERAEx57PHy8+XxFWCKcTEIQJCglDAgCRiCYb2USkCk2CC8jrJkYRBnAGXmbuNQZcBeg1zDzN6DdCuXWwKRbFxQ5+32dcAWODrRPLs31jiyMuW9/S5r0LQUSQsLUNRGhwYEI33PvfkPXPd28ZV2OFlHe572Cxsnj9/vr3ffvu5999///nHHH10Q1dnp0ql0tKyLQrI/0RDjsAs2YJy6A+MIa2QnOmcIi4tKeX+gX55z7338BOPP/av55+ffS2AVwOjveSSS6wlS5ZwU1OT8ZsiPm6kxrkziP1NTjU1NWLKlCl0+eWXq3Q6/czjTzzxzONPPDHtoQcf/OHJJ3/trNrTT7cLi4p0f3+/sCyLAu5A4I2ztNoMbLw1trDxZyWtXbxkcbNW6igphGZAQkCkUymMmzDhJAC/AjDwYWDWBxrw9OnTDdAsyqJiRndbL0GCTABegTzWEhswLJh0mourRtP7G/vXtw+i/cBpI5at6li1FcLnLN+ZIHKMFxm1C6Ic1nOgjpFT58t4QmO84EBIdHQmRwDAhfVTUjNmNHuwo9eBs+ZjRwef+nc2i7jdzYug/v+nT2VmpkgsxiAGCcsgmm8/cUdT2w0PtD4+uszKX9Phzs+5Ohm0eb/99nPvuPWuc6qrq//S2dmlHCctQ+GQ73lpC3XmIHbO6ZIKBiDlJJRaa8Ty8nQkHJYzZz5H9z/wwDMPPfTQVQDmBUoYtbW11NTUZBoaGrbGCB3OVQypqamRNTU1OP300xfNmTv3vDlz5/75xXkv1p93/ndPOeSwwzA4OGCYIbyU0GAIF8cMJSp91qt++nQBQC1a8u7zrW2tR5WXlXPacSBIiIHBQTNq5MhRV11++UFENPPDwKwtBvh1dRBEDeb735w2Var+vXu6B5lZCMO59MKA4EJQ2sAuHoHZzy90BTA469U17R+VOvmJQuigQJBLetqss4X80vGQ8Ci3zkcGzExgjb7eRGX20Npu1ubk5i1NbOTR4ys1VBoyv5CWvPSK+6dbX28rKqRfC6X05sZbV1dnzZgxQ/3mN785+ysnfPnOZCKh005a2rZNYGQIDeRjCkJkGzmyLRVDaanBS1NKobCwUHd3dcmrr7563U9++tOLHnroofpx48atq6urs/x82/gGtk00qZqamnRtba1mZtHY2CiFEAsf+tfDp37n7HMv+MvNN6fzCwpEJBrVRmtkGAN+6CzII3gIy9oqr62hudkQEea/Nn/WO+8s5FA4LI32VG2MMSa/IJ/32nufUwFwrjLnRzLg6agWALD/HsOqC4USSmlt/EzOK7ojI9vCxsAO55GyC1OvvPSOG7OxkNmg+mN0On0iT5wT9gSeV+QW7zcrOw3hNgcdRcJjTVmW5cf7S3YUkXkCahiAXVZSWM4yhHRvm3XPnU8vaBnA7nlhLF7bh7drPAzCAF43UUNDg/r+979/8Flnn32XlMIk4nERDoco2/+MrLJJbr9uhjdMQ8BBD+BhaKW4sLAAr776ivzlL3758PXXX/8tx3GeHTlyJOLxuOWHt5/n5A1TW1urjTGisbFRrm/d9JeLLr74iF9e/MvFA339MhaLKVe5GYEIT8vc9j7EVtvGTERQSr29fPnyVVJKEoJ8jSSIZDxJ5ZXlJ4waNar0wyLZLRtwveeJiiJmRmowASEkEQddJR4N0PPGBO04XFg5irr6Ul3L1g7OzK8sXgAAzVsFfaacOjCGbLrcNjGvJzeHu2w260AZ0ocLKM0CO9YiEsJUAqWaMY1CEcx6+Nn1dz7RcX84KpYrw9+BJ/DOvucV3/jGN/TUqVMnnvfd7z4wrKLC9PT0IByNUEakQ2QbPDKiBjlpR6ZBhLJeykP9hSkoLKQnn3g8eVl9w2WzXph16+jRo1NEFNNaD1iW1bcdXTdTW1urq6urLSHE6zfddNMRF3zv/Kc3bdhoFRYWK2M8IMmyLFi29UF6XZ+ZAd9///0SgLt+7fq5iXgclu1J6wohRDKVNMOGVY0666yzDvLbDMVHNWASosFMG1NUEjHJ6v6eJEBE7Nd+M4IRxhNiU+mkKRw+Fhs2dLW2uXj71g2PLMlSH7fOEn4HUcChZZ+JlJWtEZuhpuw5gGwdJBMiAgxW7MdJU3aI6QI1Nd5p9ZV9MGrSbhOw6Z1l3Pjgqz/vNpFHHJhTlnZhUw7Liurr60lrbdXX1f1t/IQJozds2MC2bYsscuxdJzGkD8ND6AJxgSDCCXyxYQ0hpS4oKhSNjU1tV115deOm9nYxfNjwLzHzDMuySi3Lam1paekEtq+Rsc3NzcoYY0kpu5965pmv/d+P/++F7u4uq7S0VDEIlmVBSv8Q24pHewDCLV2+dM6mlhbYlk2BYKJhNgUFBTx5ypQTNsNAPtyAa2ogmIFvnjR+TEGIyxIpxQi4EoSMtpKBR0pPOorswuF49aWFVhQYc6Q8StV8SOP+Z+N+cvp3Kdugn8VXvBA5oE8y5aiUB3+TSegYyZTrq63V7xAGPGVKNQFA2e7TvlRcUR564akXn7n3DdPInNywuhPLcvOI2bNnSyLSv7/+97896qijDt6wfr1rWZY0PkhDmcOMsuoVlNuGl+N1A1FAwyCQjkYj8h/3/W3pdddd9wgTTcuLRk8WITEjFAotmTRp0swNGzZ0b8eXUWmtpZTSmfX886dd9POfvROPx638vDydEfnUWzfqb2pqYgBYsGDB6ytWrDB2KCQ5Z56n6zo0csSIQ5GTCv1HA77wwmoCQFUl8is20uwqowNNtSCHDFrytDZgESGHInrhO8s2RIF1bAzat/JcE0kfPMUkR6oho1iRkY1l7y37Ok1g4xVFHNdEd6T4OWguP/Xrx+DdeS/iyj+9+OSYovD4LJHae6eNjY3yyCOPVD/54U9mnFZz2k/7+/s1tjCYYkjnFXJBLM9whc97D8QApWXpWDQi777rrsVXXnn1HeFw+DDbtidZlrU6Go7+ZNWqVU82NzcrbP+D67TWWkgpeh986KFjr7ji8pUgSCIySmloo7GVcyvjK3Cs3bBu3WrbsjwBTt824/E4lxQX73HKKafs7quCiP9owNOnVzIALskPHdHfnyJlQDojEOaZizEeoOE6DueXlNFAIpV4d2nbfHtYUZD/btWjS8ihjfS5PcBBPTJow8tkvRlpHOMbdAZKgNEc3rEM2CM8bHhv9jFzZ85+cXkvxhflcYho6LlWU1PDzFzwP2f9z+0VFeWUTCbJDoV8QM/rixga0WS7dMjvixZSQEiZo7pJpqCwUP7z/vvfu7Su/sqCwoJjLcuqEEJc+/7775+8ePHi9zCkg2O7X+awww63hBDtN99847dvu/XWdH5+Hhs2hj8YJvqsgZ3kxpaWpUprj4fviU6Qcl09YvhwedSxR00HQNO90tOHGjABTWZKRUV+NCKn9vSmID2Oooc+M0ObjNY4VNrhkqrR6Ontb2kZYHXMMQd0bIsbx4HuVK66IWWVNJDRWwoa3H1wxvcmm9f3lMv5AEJSCt4BvAbq673Q69Enl/K9j6x4pSoKs3CTswxDaZLCL9v8ep999pnY3tauotFoTlFos8FovpcNrlNW2dPjA0spYQybwsIC8eCDTa2XXFp3+ejRo0+zLXuSFbb+77333rsSmZatHWu8aHNzszr88MOtVEq9fPOfb7lgzuw5sqSkxAjaOlTKzYyXAVBra+v7AwMDsC2LA1xHa0NCSkwYO2EGPNkd/lADrqnx9veXjykdD+2MSaZctqzsuc7GV7/3p3ewdpFXPgLL3l8/AAD/+Ofz8W1hAMpkw+VcsgEFGkvILRvRkJEnnMOHYL/9xGgdxdB5Zdv1amjw7si8dxLvrmxxZ5ON31LupAsv1DLnn33+lP333/9HnZ3tmjwxrozQX5ZF5atb5AjsSSF8mWBfaVsKGGO4pKSE5704z7n88isuKykrq7YtezKACxYvXPzAvvvuayMrvrDDrebmZlVXV2ctWbrk7ptuvOn5zs6OiBByqz+v3y8fevfdd1e3bGqBkFIGPc5CECUSSRQXFx8AoABbUK0UWwJHJgyP7ReCYWatBRkCeUarfHkUNyOsTYgWVWDtuk0bJdDLhlGzDWIOAV//inOEGXLFCimnTpwDdsHXvsqOWpEAM5TShQAKPwzt284WA0AogpWdDp7b0I/u3O/7Yut80tdPvra8vCw20D8IIQTlduHk8paFoCEyP5QR+/OEEow2KCgo1Js2bpK33PSX6wcHB91oODwVhPOWLl36bHV1tbVgwQIXO/hqaGgwzEwPPvLgD+684860EIJNEElvxftYV1fnLl++/L1Vq1c5tm17HeJeBETJRIILC4tGfe+H35tERFxTUyM+0IAD4b2q8sguOp2kIFcMlCcz87T8GTQyHKU022bBq0vGRyU2MW+blId8r2EyIufw6ZIYor6RKy/KyBW9yxV7B4wxYQCRHWxCNcEghc3k0H3Gkf7VL3516pe+tNfxXV3dWlr+qe6nFsE8JcpRw8ycXAGbLQCtvIkGGmDr1ttunfvMc88sLC8vPwvAr5cuXfpydXW15QNWX4RlfCWM9//xj3/8cfWqVTRy5MitHlH4z7m+ra1ttWVZvkqHAAkiY7QuKS3mPXff8xAPZL6QPsSAKxkAwhbvl0q4ICHI+K1ugTyK8T+0UgjnFxKEiHe0d6dK8mNrAaBpWwAXvtohAkkXZDWGs3lctmY5ZHCZkFnxO9+AtTZiB/G8Q07vVd14zA+rOJsG1TAzh4459qiriouKyGhNwp+2yDkSrpSrG5bpPgqo/MKvC3t1w6KiIvrnP/7R+sc//vGSiRMnHiuB3y1fvnzeF8x4Ay9s1dXViYWLFl3+u99d37Z85XJ7ax/E3gGJeEdHx0LlupBSGvY1yQFQyLaprLT0SL8CMcS+rM0BrDFFKAGrXQYG0wATae313AbpgBCAEBI6nUR++TBeuzYR6+/i0KiDd1m5svmdbYc8ZsIBHzOhLGBFfmOuCLpKfHFxDri+wWfp58fGZAf87lhLD70k3miOa666puaAgw7abWBgUIfCIY9jy8jRoeIhqpgZ7EAMBY+VUigsLjaLFi2y7rjtzh8OHz48SkTPv798+SMAvnDGG7z5hoYGJqL4PX+9Zc/Jr01IA8CMGTPU1tvKDADOunXr1sQTCUjpDWNjD0QjpRTGjhszCUAYXmfZv3tgn6jBPz3zwBDS6dGJhOupMBkvpDLBjQ6aBozivKISau9sdZSDrnkvvtuLT6c++dGPrGBSQq6Qmk9MCOJJQZvpT2XyO/+fXJVY8Bdm8wEIH3ToQb+JRqNsYEj6EUdWOZJzpLSzNX3m7FC1HIFWrZVrPfDAAw8seHvBg0VFRbxixYr74RELvojGCwCud2kY8TjaFyxYtdWpoL4Bm1WrVq3v6u4GEclgwDwJQem0g3AkOuW4446r2Hx6Q8aAa2u9r9v643vCVey42hhm8jXrvI8cQX1AI5RfhLWrNnEfsICZtzoAFJiZ8Do2wMYDsthk+1OJOZPjBRMPskh0Dpc684gGgiGRO1ZwB1x1dXUWEZkf/ej7X522xx679/b2GEtYYqiWcjYFyhx4/uRCwyar8AhAKZcLCgpo7pzmtt/97nffnzJlSpVS6tUdGWn+mMvyP7ZJajVixAi0tLQMdnd2sWVZZExmzjMppXVFeYXcb7/9DgGApqYm8W8GfKGPQO8yzB4NYyzNZIL8MTCOwNt5XUiMvOIq9A0k1ySBZcy8lTuQslfSZGRfAc06Y4vG1xo2PlAD/PuArGwnROCGDISA3tE3ZX29RwM97pivnFtQUMDpVNoH+AiBhpnS2h9P6knjKl/WNpB39SRxvXsspWWSyYR4btZzVwHo2n///XtXrFjR/0ULWT5olZaWxiZNmiS3wXtlANhnn32SfX19BR2dHQOWZSG3c1crl2N5eXTggYeMAICKigraIogFAMnB+MRUIuUVhP2GBeahQk+sDZgENBWibfXaGIDVAFC5jW6s8Y01CAdNQNzgLCDrpbW8mfRsIBjNOa3FIneayo7qfQUR6aOPPnra+Anjv9LT2wsGZG7Oyznzc9l4A7GNzs7VDTwxs4HjOByLxeTLL7/c+uc/33w3M9Nf//rX9A4I9H3i1d3d3b9ixYr0tnq+Y445Rsfj8bXGmPV+F1Sm894YQ969cmdsDmRlDHj6VA+Bdhz3IG0YDC98zoh0+y7d0/I1YBLkcITbWgbGhYB14G2EQMMjQ3qlLe15Y19KFT5gFQzAZhOoZ2KzubNeK2RAlWPesQ04EAE/7bTT/nfCpElIp1LaO8T82UTa97Z+9UApDaUNlPLupcoRWjfGwJJSp9NpzJnT/BeABubMmSOBHfsabeeLfvSjHzkA+jdu3BjNZX8Fk0O0Vhg+fHjh5jhT5jeb4LU2jSgJpZRWyBlc4DUuGM5OHzQadiQGYWl3MDGwpiDk1x22eqzhPYckhlE66zUCvXPtJ+qZGdl+Ap+lZQ0VZcv1xDvwzffD/8gee+xxmjYahll4c4kMlFJwXQdKKSjX9QzYKGitwKyhtPanCBooreG4LofDEblo0aLkvffeew8RMGPGDLPTxrbuPZRSMgDV39+/UWsNIUTu1DWRdhwMxuP75lfllwshMoyswIDp9NOhAZR09qb3c1wDZhaZ8aE+8KGMgTae9lEoEkVPb58c6I+/G8lD6zbNjZhhtPK8ijZQWmVGchj/lMmM/QiGaxuDzYkmHqGDAWaJbcAg2xqrxlMP5XPOOeeI8ePHTxjo7TeCSLA/0d51XaQdB07agVKufw/9MSZKZfLhYHyLNkZLy6K33357dm9v71pjjPwvAa0+1+XvTXdwYGCjJ2I/VIvbSacxvKoqfMH5F9icM6J1SBlptzJEBbvFjht4W8+recO7vUlzyvd0oVjU9Pf1ymScY6v7RB+2UQkJ8CRLtTbQSnn1Mp1D7PBzO2RKJt6sIpggDfB5D5QTXmS7g3e41djYCAA47JBDTiopKWbHdQyAzPVxHAepZAqO40ApncEOjDFeGK01XOVCuS5c1wUx08aNGzB79uzb/XyLdprXNgguvbWqs7PTclzH19UzWQVko3U4HA5xnA/ORaJF7l+fccQwFbJYucrzZNowdM4IyMDqHVdxKJonhB3tctLop219i7Xxho0xMqMr2RhvaJifDxujPMplMFwMWSphxlrZl95h7KgGnAmfKyoqv5pOO6SNEd7713AcB8lkEo4fQhvt4xc5YnTBtfO9tQlHwnLJksUbn3766WeFEGhubtY77Wub3EcA4O6eLiflVRAyw9IBwCjNeXl5OOCggwpykWgBAPV13gOsHeBhaUdHtMkarDGbhZ/M0K7LoUgM4ajVlmYszZ0PtW3sN5h4pzOT7tgHbLyvVYZuaTIGrrOMrCBPDurCYigdcUcLn4898sg9R48ZPTaVSjGYhdYaynWRTqfhuI4XpQSbwU8nTGZqoMnkwFopI6WFNWvWPE1Eyeeff97aCVxtuxA6HA4XxgfiyXQqzUQkcqeOG2ZIIVBWUlKQ+3cCAObM8T739ad3E0IIw6yzYvwZwRq/sExg1rBDeRjoGwwpoM0fcLLNPJhhgH0PHFAqc8d/svYHTxuvgYG1N+HPq4vqrGy3Xx7zAYMdbqMGxPYjpk8/asSIEeykHW184CqVSsNJp/w8N2e0Zw6Rw/jeOAi3iYg62tt5wYI3m5gZN998807j3YYrEolwMp1OKa0UiazuOQMwbEgbg/Xr13/ZT204Y8DT/QcoiqBQCiDL1uDssGbOTjJnBpEMoXVTZxUBigHUbkMQKDNjyN+UweR3bYIyl8qUUIJuJeMVj/2eZs/QYfzRnYQdsZkhuIk0YsSIL1u2TWknTa5ykU6nfO/rZsg32uTMPDYmO97TaL/UpDgcDsuNmzZ2PfTQQ68QEZqamnaCV9swB+7r62t1Uqm+ZCKRGaLOAXYDD5QdOXL4kH06RLW6MEw66E7z6ImUSZINAMGZOclEQurEwGC+BVhg3uo6WJuB0JmNx1r4eS0BWoOFgAEB2nhNC0b73GjACIJgAzICLDwjlp5yhzeiaMdaggRpAGXFJSX7plIpuK4rmA1SSc+AtfZyf+OPgfWCFQMBgqEso85rvTQ6HA5bvd098wEMGGMkEe3Mf7ctiJVWSjlO2iEEI2khMy2gSmkMHz7S/bcQOliStMiUjUA+VTHoA/bbCH00miTYTadhtiCStvVD6JzwL8jhlJfv6pxQ2mgNrXTma6MNjFJg45VQtNIErSEIO5wB19TUEBj4yjHH7DV8+Ii8eDxutFLkpB0/71WZhoVAgJ9hsj3BuSwtNlCuN3+3o6vrJS+tmrMTfd729xSplFPoKpURUQ0GvDAzKdfFxo0bpwHI98FLGuKBu/p1ldIeaqsUZ5QJc2eoZoAtEIxrQJ9D7qhdv36pDQAFKaT3boyA0Qae4+Ah2ldCWmC4gLT8qXs+TUs5ZMAqBOj0pZeK6Q0NYvo2fj8NW2Y5fWhZbsqUKQQAk6dM2aOsrIScdEorrYTrulCugjYmM+QNJhNX/dsTZUdpSpFIxM3q9atfAYCOjo6d+e/nYMAvvfRSnjbGEJHIYDzeXSOtNZRyRwHIJ6LBjAFPrfTuadwxu3AOO8kLm/1B3sLruyUhoRlgtryJ88GzVwNo3naIXeB5fVknSP9wYV/2h4PvCZ+hxQoCEpq91l+SNlgphJUDFjLpFIzooMuvMIAwzVvF99C/R00+N1uAoLUaqrQgxIeO15w6daonvhCNVodCYQzG4xQQN7TWGeG63MfwQulA3xuZU56ZORqJiP6BgcSsl157BwBqa2t35r+fDxodIkADLIIQ2pfXh1IKwyqHuceccoyZ+chMMPNm0wmZh/nsZ5KU61uDUyDQV/bkh6UQsD6Xd+nL/DAgmDL9rD4FDYKlj656YaSQ5KX7CgB5hxCMC+2mwdqFSsT7rIGuCZOBkf2ALRgWAawBnQZkBHAFYGlAK696HOSGxIAIcggHEMaTrTa5PwcAF2DLqzorF0ASYNcbPQoXWEpEyc3epQ2Q+0FOOBh4NWHChBIAcF3l0SS1yiDN2cvFGYtlNllJXoJ/eBjYIRttHR3xZQsWuEKIrTVWc+f6cA9sfvrjHxcZo62MHx0i0siwbYv23HNPzHxk5r+DWFJ63d3s57qCMMRoOUcjCzAQgrZt4pgzeSHT+kYMJoJhA8HCz+sAI4wnzmYAyV5JTZIBC4IQBhACRruUiLu44KJfjPzWhYnXo7bxZyoJEAuv6wkaQjBAEgB5hsHB4G4B4deTveYIzoTu3vyg4P8EY3Rmmp9hkx0SB4FYYWyNDIX6iV0ikhyJFeiOTW0FDT+79qKnlw3+q6YGsqlpiPoGSSE1gHKt9F6ucuGkHRE0Lnh6z5wzSTIYgeRdGyGMB08ahvFK4Nq2bCsWjb4CoE9rvRPA+jxQSSF4eFVVAiAKaMHeGF9/OJAxkJaFvSZO3DIKTfB6bQ1nu9sDJ+4NUmUYnW2YDxppt9nys0JBPKRBHcZACJH1wgSwZpAgSGEAtrz3JTyhcgMFIgltDPo3rsaw/EEaUeiANTNJgpAyO9GBdGa0CEhmpjIaHwMUmVannDm6MJnf9UzI93xsMjpcuTpdUtrjCACMC2bAAiES0eC+wTIAaG8fGn/X1dVRQ0MDA4jEYtHCZCIJVzneoeAbMBN8hqjPPhOUO5HCR6E9lRKlFcCMlStX7rSizzV8BghQQgporZkNU3ZQg58KEjBs2LAtG7CH7HqbnyVgCJB+vy38kaLS8jaFMQzLEttUV4VyQgn4IJan50TQpCHAYEMwwudG+m+ADYOkF/JrHShXuplG9oH4MhjDEMTkQdLCJ2l53h3wAL3smE2vbJyhkOZOdw++5qwXzLxmzhVVF35dnb243j8QmBmRCKmOgWIr4eJDpVpHjBhB+QUFnEqnPRTeGGjWICZ4Z4XJXDU22dfqbRT/tRFDK89zl5QUzt6JQH+uJgxpWWxJmeUqiOwUEWO8qHfYsA/wwNov7mcG22cps5mNaIzxWVkC0Wg0O4qpeVu8vexn7Xsb8tQLPIKC0pC+1jMTZ4axMQkIQ2DpjQvxEFpkphmSCIFgfDE8ZPSjs5PqeWh3iF99Y8rV3yL/enFWVyAzmDg4aJBpoMiKygFgFpmxgJ63FK6GSLoQWwKjlyzx5hgX5xdPjUQitpNOG2OMCGSGghsXkG8oE8hTjogdwZvY6EUHymiQZbX4BrzTlj6nZVuWa1lWZrAa+7WDzKigzRoPrC0hpexHgMJXdwym1nHOYGc2jFhe3jZ9c5TTy0sZhpUBCYFgujmzgjASEOxPnAcgvLnGxICGzoSWntZ7tmvJcDDhgbP+nghCABpZRQ+C8T2zZ3TGl+7xwKKc0S25QxGJh3jizE0J0HM23sHBDMOCjGEkDRJbArHa29u96YQVZWNDoRDSjmMMG5GZHGl8hULOEjhAXu5NJPxc3I8D/OdUjot33nzT2mlCn+8KRUKDoXAYxhgKKi4ZINLg38YCDSFyMAWJHPtehzMCciYzpgSQEtAqhWgsBGtbMrByy0jayw4yfaxKgzVDK48LbJRP8NDaU6BQHsFfuQHpwwvBvd/T0Jzt1MlVp4Dx2ikDSpsJOrT8KedB6SpQyMyoZHKWJJGZlGiyYx4zwns+WKGZg8YLVhqSQrZTYuENAJjePLQfN5hOWDWsQgkhvNPa/w0THBCGhzZ5+HpYATii/CaPgHbKYLR1dsqdJvT5rCDCKyooagvZNnQw2tSXOTIZ2SNGPB7fsge2pVzHEBDCczAZxJkEhPHn7LLn8dKpAYQKJsHehnrKmWDS9yYeGGP8EStekwWC0Jil79XgI8ImN0SFFOSh1zDZ5gbhSfVk0G7hGwQ4M8GefK/seS8GTPDXQYjMObSM4Cc54oAZBU3OXGTOCb0NM1gr2JJVVQUG0QfUA9ywheuRl59PQgi46TQYOQeQ/3zEHmUymIUUvFJDuc8PGGZKpx3E++M9foi+vZI4dpixN59wa8tYfr5lWRaU1swAeZUKn8MvPGwDg5uF0It9lLM8Jt4whr9H/hAwb7v6fyQ8qMUzaIl0oheR4ihsYNg2E+LICRuMJx0DCQGjfXUCP1QkQRkpHW8KA7IbmBjC08HyUgMEs4Dgk8aD1mANNr46vl+2opwchLIkiCEnKOVeCkFZIMvntmbfi2dgQZ7KOXV2rTUMOxR3P7xKJ4XthcDIen74xJshaqLs4wG+jGx2ZrLxKxQklVKpcePGvQUAjY2Nhoi2Ry/F24OX3DKCzEM+f9JKUiQUyrcsC2nHyU7R8CMrAQKxQevg4JY9sGJoD3H1NmjQwOC9bgP2xoqBhEBqIEGVBWEUFOJA9APTAdO8Lc7fDJJLfmeRn9tBQGsDKchjXJGH2Hk243tmeNPoNXs/g4/qCWLooHbLgXC816RkKGeIGuUQWTLCY9myUIa6mIkCjJ8TZ5HATFmevQiAt+Cd2XiVAPkflKplCFnjDaRhefNNFeTclJ0HjOyh4TljgpDSSqhEPpARydvevHCYmfPhCa9bAPL8rxPIIdZk63gIbrzYzAfwJ9h1vg1x7vdEzvMK//VEAXQASH7C9xiNRCJ7RiIRpB3HkDd9z3MsGXVkQltb21ADDjDHQUcTBTbN3mYPNoIg8uqrHm8W8XgCRSV5KCkRYfQboA5Aw7ZxwUQSzJSR+YGvnkkkfHIEZ9DeDFIsPI+jc8aRSvJDZhEAY8YDtph86ih7pSjyt7rhjEQtm0CyNmsgufTIXCG97Om8hbdkstMRgvDdw6Q/QnemRs68o4Bgkz3oghnJntc1PnjnHXjZsEQQgyGEsOI98aJclHt7WHV1dVZDQ4O69tprzzrkkEPqHcdRYLaIiIQUGd1gYh9sFV65MFeAAvCAV2lJH/2nITTTAPcIwEVkjvtc0o2HrQgIQHjdcMr18AMiwA6FVDgUpqeeeur7V1111aPB6/443p2ZeeTo0alwOARjDKSQm/HWBdgYtLWt3LIH7ksYJgLIsD/IwEcyhchkcwSCIYFkfBDhSAwFxSWMtV2or2duaNg2950DyVjDIJP1OpLYH5XkI9LemwH8zioKwDlBIBbQMJlwOqiiZwgZ/mMEdTiPCBFQH3xz3YxuysSA8ZDvgEiRaakw2ZJOzhvJbiAdGLGBkAQRsvGfQH5HB5KxOjsbJwOSccaIs4wek0kBMqJowsAYVpZlWclkciyA1wKUe3tY9fX13NDQAACH73/AgVWrV60KchcIy4IlZQZDEFJk7s+QQz8zajZHOSlH65yZc4sOyFJcTLYXnnMiK5AnpKgUHNcFgZBfkI+ysjK8+eabJZ/i7ephFRVOpvyIILLyHIWUEgOJOL/88stDDXh6sxf+FkRC84lIGbAlPFIlCb9eKfx6oTGed0rHB4VxXUQK8ycCXWVCiC5sI2G7QCHTMIP8sadCkEf/BKApm+ch44F9CSwOYiyPvWVgMr7Oiy7gkzp8AocR2TiK/EkHgoa+0xySR+CtiXPAqgBEEr5Rc1aDKNA8CiZNeOQS4f80D0D8A69DOpGGclXWYOF73ZxJkrkTCYPQPWcnQikD13UhhEBhSUkoQLmbm5u3B/slIYQuKCgoe+WVVw7da++9MWxYFcKhEIxhpBMJpZQLNiy8zE5ka3fBvc94VRoSxhHlYkciE0llZmcFpcYcUBDI3melFFzHMbFYTIZCIbz22qsDGzZsvGXBggWz6+rqRENDw8cBd4MXsnsqnT7YAzM1EWdLgYYZQhB6e3vtl19+mQKvbQFZlLMiTO2G4BAJK3MoUXbeUFaOQ0ClUmR0GqUV5RXA2nIA28yAAfalUTlgJvpJPmCY/Lm3XljthU++UQr4tVYDBLOe/DA68zja92TSA7hYZEkYUhAMfG41/Fw5qDVTdoMQea8jty5LROCso/R/TtnT3QQglj95guQHGm9AtBhM9nEqnfbDZ53dnn6Ewgikdj0AxAQSDeQDgWw8UoxfSqooLd3e8l5iZq6srKx6f+n70R/98IdP77LLLpEJEyeOnDhu/Jg99tgjMnb8WITsMJLppI4PxskoQ1IKElIMAZ6yc6SDkyEnegoYNTz0MA5SG/KxksDyGYBFpIuLiuTCRQvjc+fN/dsNN9z4FwDvfMr3a5WVl4eCkqTH6KVgf7AUkqSQG+PxeJyZKWPAwdb7x4JB+8dVRXbMJqjc9D/HpRv/5jNrpAb7UFY5EsACN9ujti1C6OxkBS8HEaCA38uUbQXKvUmZQ9bPC33U2bYE8vLChoRkj+Hln7TCTxkEZYAoIgHhh+DCb3oAvJPR4037fxPUeD1tEAjmoXUQ8holWGmwSTMrjbQykiH9SJfB2iAe//Dr0NnZI13XgW1bPtCRPRAYwWQKv3PLb+YHea9Xc3CoCU/0XbnYY689tsvyUWVlsU6n2e7p6Sl8/fXXF77wwqynyIAn7777Hvvsd8DoKVN2P2DPPfcoGDlyFASARDKpXccRdsjOSLsx5+ASIrdfjDJDLHNU/zO5cFB79WVoPDqxlDovP182NTWtve6G60/rbOlcAAA//OEPwzfeeKPzSZyYH0HFSkpKwkopL3jwHY2vS8dCCowcMWKRX0iSAHSQA3NdHURDA7ojEbHIJtrH1cx+OTjjXTJQNhEkAYNd68zw4eVCAhM1aFUNQE3b4IYqExAVvIsqAqSVkIMDB8wzAzbSNzDKsqH8vGggyVjbFxaFJcUQZAHCgm0JSBCERZBCQEobwpKw/BNREMEICxnOKUwOqynIsbR3WBiGMeSPeDFeeYp9wonpgqU0InYMhYUWXDelB/pSMMpI5abxH+wXfX19PY7jIBwKkfEPJA6AtkxurX1yRxBSaT8V9k7nYMiZcl2MGz0mHITQft75eQNYaGhoQEFpVZ7b2uoIovFFRQWx/Pz8CgC9LW1tLbfffuvDAFLTpk3be5999j1tv333PfDggw+WpeVlSCZTOp1OC5lxn74xBmVRDE1nAuAqyHvha67lemQApqiwUN56222rrrzyymMArLr11lvt888/X994443pT/M+hw8bdmRpSWmZ4ziGwSKoGiBwVCBsaN00pLSYAbGmTgUBSAHUalkAO2ASlPUgweDsgE8rbQx0t5lRo3YTVcAeGxkzt5UuVnbkaZDH+qF9jscN6p6C4TU3ZIBY8hsTGDrt6FFTd5HPPrC48ZWnX7ivoAgSBjoWBkJhICyBWAyIRoFw2PuQ8M4+AylJSAKx5ShtgSCisZCyLdLKZUsrbWwLDFhGGLD2BlZBGM0wWiWTDvr7gdVd9vQRwwpHlpUWTN97alXl5IlFGOzrNUo5H/j+m5ubDQBs3LjxjXQ67ebn5dnGDx0yM4AzG9Fke3tzatFC5HQmKYN0Oo1Fi949EsDdm0+B/7xWgIanBwcLQEJbtlVBEOVGO2GlzVtSyv6xY8fmaa1XL1q06MVFixZdd999f9//yBlH/vywww875aQTT7KLi4vR3dXFGSOmbMrCOSExBUPxcmmwQ6gjBGPYlJaUonne3M4rr7zyeCnlqsMOO8w6//zz3c8CqCspK9u1rLwMruNkAcmcTS+kxOrVq8UWDThY7T2uO3FYyDMIpiwRIoC6AwO2bPS0bcTYUQegKobQxgRvM1WOQIwtmB7Bxnje12TG4Qb9Qh4q7fNIlZ+LSkmwhQCx4aKiEA44euLCq/664jF0/Kc0IBcM0TllQEQBhIGUAJAGEAIw4Jm6a/x65Qcs9zGgCxJd0yeE10z/39Mn/O+3vjp+goKdERz5EA/s9vX1oby8LFMGyYBifsiog7Gh4CFlEu0/eNCSmUymMHb8uNj2FDo3NTVp/8CaM2XKlMlEYg/btnczbA7VxpEeFVQnHMcJDRs2pmrs2Kqu119//Y3nZj53+nMzn9vz+Zkzzz/7nHPPOOTQQ0r7enrYsizKdPYEVQl/R+UKMAlkga8MuxiAFIIT8UE5Z/acXwBYeu6559q33Xab+2m3sy9rbFdWVtgF+flwHJdFjmxK0JYvhcDI4SNn+TgIDTHgxTd5v1ecZz1NxCdTTktLoFEbKDgwGJYdQk9HO+1VbKNsROQQrEhh+nSYbQFeSsoSGIw2OeX2bJnEwCNoBKhrwEISGb1dA9aA6wr0dadj1dVsnXrqRPnwwyv09P8AoE2tBKMm+53Fi+EuWQJdNQBa3QEZtZGa8mWg+zWg9EBwfX3OELkm0OLFIMzxpIwWt4OmVoJvWlwxv3lJ55xL7111c0EYjx9avds++cVRibXJoedG4Eu9E9rp7u5M7rrrLrY22ivxBZMagxJSkMMRMmIHgXvJ8qaNSCWTYFfv5h9GKWzDUTkf0RsPAnjV//jrqFGjolLKKqVUUSgUirpucvi6deuio0aNWn3uueemL7v88oXN8+Z9v3nevDtvu+WWP8845piD+nt7DQnhNX0YzhBpslWGwNlRDpBNQarB0UhELl26zPnnnXc+8wmQ5v9UA86bOHFSUX5BAdra2nzeQo7LIgGlFdrbW7o97sacLXvgZS2uKi+wYVnZN5EB5tmjZnlezEJqsAchmzB2XFUJVqxBfX3dNsmdjE9a0MZkOmkJlGn7Ez5aDK+dMtNFRZTNb/5/e98dXkd1bb/2OTNzm5pV3BtgY2yDwZiOQTIl8AIhIUEC0vMLJYG89EKSRyRBygsJPEJLcAKEDhKYGqqNLdMM7k3uvcjq9eqWOefs3x8zc+81oZhgE5t4vs+fi+SrW2afvffaa6+lFJBKGygNOJY0DQ1QNTXD8L3vrVd7dAZ9ULM/z2vX8QKwZ29Ja1/lBDiPr6aWv9Rt/OOTL219BKFwCvinDTIPWzFGEFErmJYQcDozG2aWmj1l4GD5m83uo6SM6RtnFzEAUCKVBIQ89Gtf+1qIiBIByrk/IdIARHl5OTU0NPD27dsT8H2pAWDkyJEDXNfNT6VS0hc7kNXV1fK6665b9MMf/vCmex94sH7SpKO4q7PT26bL5N6cOT5TzohJZHtmH7+1nZC0QvbifqDZL3v35gEnR40cOZgAGKVJ2JY/Cs0oi8q+vrjauHHLKm8UAQPk0sz8jZe+ntQ8o+F6OI5HIvSsgSkzW5X+SiHBhU71Ytzho2PeY9V8rPYqgVdZxsSMkdkKQmZLKGceikA7y2NwuWkDwxpi//AlpPpGKGOYNImy7Z2qb/PaPvU+5SV5ffC2VDrtettYXg3tv2bPxFsbb9MqIxcciOBr7W1teZtIlEgmTSwWtceMGTMJAKqqqvY3t0YGoBsaGpTfu1DOL2zdurWzqalpa2trazz43traWvfRRx+VfYnEky+99OJyMAQb1hyMi4JH5azsUBY7yDU18LymhBCIRqJpP4fQXjyYAKB0+PARpa5yvXF0TvAaY9iyLOru7javLXltY9A37xbANX65tLTZbenqNypkCX8tljKNfjAsJfJmokIY0dPZjuGjDxkDoERaFuNjALIC2mHg8RNoVRmfxBCU1trnSueu1gUc4OD7ef8Rb8ssIRObJhJoTw5679555cqVBAAtre3zE8kkDBv2ghi+BrZnmeJpYesc3yidWbMMVg3BDOUqo7WxJhw14TAga9uyH1+M3bnN9C5lP99+++1ERGr9+vX1zS3NsGyL2bfC2p0YzTkItB+0GXP7LCrNmTHD3kPajTEoKSmZMmjwoIGJRJKF9DSxclZb2bEd9Pb1tbz2wmsu5cyqRc4xwFwNsX4XOpXiJY4jAIKR5PWcQlBGRcID9AxCoTB1Nm3gkYeMKBgIHGYYqPwYLFa01pktm+BFBoJ7gTqHZk+1IyB8GA0voLXxZ7cGgrS376v2myD2yiILM1mjJj//vRWLgpW/zZs3z+/s7ASYKe26UCrXKzmwTfF3f13va4HwXeD7HByG8XgfoqHoqcEo6QC73nNRgZlRUFCwQmvtYye5MkdZoQXzDifODIrv/9oNnd5LV01NDQBg/PjxRw4dMhTpVIppN/FIgjHMTjgEx7ZXA+jyPZt3z8AAUN/oaZw1daR3afZUJ4QgCOlREQUhw0gRAJxwCJ07N+thQ8tQPiY0GUZjQvm+z8DBzZmxb2L4Hsa+8ZmfgXk3l0V/gd9jf4B8kb6Mb8z+cxNiTTt6N/TivvXrkcJ73Db19fUMACtWrFjS1tZqmCGV67JHsNeZdcsAxHKVm5n5Zk/3wCdYAUSirbUNtu2c4GMjnyhVSsuybNu2/XvCr7x4d3HErAdYdmacyynIAIJ7eaACQB454ciRRQOKoLU2wbJNtgdn2LaNjo6O1e98gN0CONgL7u5Xc7UGLCIm8sgMtiRICVgWQQbBLB3097QhZAFHTT7kKO/kLt/3zaLHnfTlWr2g1T7C6mWfrIlTRkXDIGMRow2gmXw6o9gf7zfCB1u9sF/ONXV2dK2R0oLRmo3R0L4nciB0F5h6B+J1xq9MgOxNKaWkXS272LAZ973vXTmciLi6ulp8UgJYCMHBBCJjXM9ZXCCrqhKYwJndOeY+AKqU2tsHCwMoHDiodDKzgavczCzUk3zynrvRGn19fQtzR0j/FMCNvkPDtla1MJUCOxaJgCooBMGSXvBK6ffCQiKdTIhEvA1DDhk9DUCoomaO3td9sBRZMCroYz1HBpMBqExGiE8EIKIfvF4W1oExobDQ25Mq3h8Bmw/6Ht+lPdXS0jwfxNDMJpAXUlr7rzWoPLI3p9Y5fTCCJSWiZCKp2Wjn+ONPOQ0AVVRUfGICGNA+/ZUyWfidvtIms1OtMx7SmabaTwhm75Zr5B8Qo8aMHTMomUh69AvOwcgZLKWU3d09ZsGCBcv8ADbvGsD19d5zXbQJq3r63XjYIeFtx/p65/4OrfT1lYkYwpK0a/N6DB4x4nAAw0nueyCLfC6xJyFDGYRV+2Wy1r7VqOaMTlXusC9AsA084kNvdzzfqx4GHlB+QLfffjsBwM7t219PJZM+PuDvrvq7qpleV2e1lXTmRs1qcimlwFqjpaUFZWVDzgHAB2Af/N7hm9ZZo/OghdBZ0zuttW8/my2rdQ4+YAzv9aF4AGAdMnLklOHDRxbH43GWQlBGSw0Z42/q6u7qeeGFFzYREXLHV+88YQ1XQ/QBHb0pXhFxBCzJRghksnAwlBQECDIIRSLUtnWNPmzMKHHaABwHY1Bevm+BrCBAM6doxmolACK8UlmZ7NezO50eUKE9MXNy0/3obOvO8x55wgEVwAGlcvnixXN2Ne9SlmVZ2mg2GfBOw1V+TxyMknyhPqX0biMl13UhpJBbtmwBET41derUAUIIhQPQN/ndrmB3OgCyAi/pzD1iNDTnYAfI+irnyhWJvXhrX3fddQYAjZsw4fNlZWXkui57+m27QewmGo0inU4u27p1a6cxRuRiIv/0bGrmeJtmTe2peSAgbAu2JOXsT2blVaUg2I6DzuZtXFQYwtRTRp0BMGr2cR8cAFXMBG0MXOXZlLDOBq/OBLSvdeWrZmidHSdpZhjXhU6ZA1WN0TAztfX2rm9q2rXCcRwYZg7KZaVURn0zg8gbTwGT4fVzwWK6VhpEkrq7u5UQouzyb33rfGbG7NmzPxFKlel02nu9vvmbVspbo9SBLa3JVmzBPeJjCZyjyrEXp47CHwUNPuKIcWMi4bC3LCQ93XHKcMCYLcvC1q3bl/rls3hPEAvIyutsb0ktiCcNwmGLKLPDTjli5/5KHAR0Oin6ezowYfKRZ3wcfXDGWZ79UthkMy9yjb3YW3vUzFDKyzpBr+yNoQS00SDipA/DH3DZpqamRgIwu3Y1P620BoFMYORtjIZSrn+Tqow0bq4/sPEVPbxeWcO2Hdq1qxnDhgz5qj9O+mTYjPrYQNpNQ/n+yd6v3V9/JqCVhyEELYYxwf2zd0CsyspKYmY4Up54+Nhxh6Rd11+Qo4xsk7f5JiiRTPKOHTvm+AGM9w3gBp+RtXIn5m1rSemwJSQxMZGAFBk1oRy/QsAJ26JlyxoeM2HsmGHAZBIW78t5sDGekoTys0sgnr4beJWjQ2WM9zWtGcofN3l/9xobIWTqQL0va2trDQAsXrz40fb2dhZCSE9TOIvEZ8zN/TJa5xiiK98AXfusLMdx5Lp1a9m27NOvuuqqMURkPglodFpraOM7OKqMwXumL2YD5LYexvhBrLP64h7Cv/dSMDNj7NjDLzjyyCOtZCKhpZQZpQ0/UXIoFJId7e3uzJkz3wpu//cNYP9xqTWFLVubkys5EORhr4wWUnjreJ7Go+flE4mic8dafciYMfzpY8JTwWYfz4M9DrPSWTG4YHvEGCB3dzuXiaW1F/TeAeCX2ZCg/VFD9cOV0WLr1q2ruzo73ohEIlBKaW2yLCKvWvFF8AMmlgn+nAPu+MBWV2en7unucc6/4IJvAOCampoDH432y+SgfHZdlXk/XNf1zeE8eqky3sHm/buCG7QaWu+trER1dXUGQHTiUUdNHTR4EJKpFAkhfR237Gebl5eHvnjf8nnz5jUzswgO7PcN4JoKSACqpct9pTuu2Lal8Sw8sz0w5WhNCdtBb1cTCVJ08rlTPw1mqpnDZt/dsQLaV58M1uR0gDbzO/tgZNBE4zs6KGX8bOwZJSjD+V5dM+GALBf9cY/ZubPpYQCklGKTywMHAteHDHEjQOyzJiseSy2dTsF2HLlgwXyOhEKXT5gwYTCy3OMDOX6hXD/rGg3D/qjNz8LKDYJawXVdr9TWLpRfciuf5Wb2DhYdrBAePvnYyWO9BSkjkCtI6KdS23G4aWfTqwDUO/vf9wpgNDZ4z3JTq35+R3uKHFsIb7GWfEQu6/eTo7Yjdm1ZjQmTTzglQhgmpGWwj8polVmJy8L9MFnd5QxZI8MH5t3GBzoHffXJH76SYM0BGcANDQ2Gmenll19+orW5uTscClnKdXk3YkLQ3xmd3aHOvCdZdhsMYFsWNTfv0j09PWXf//4Pv0ZEzPsp4+VDBbHyDy7DmTm5UlllT9d14abdjFWPVn5GznyPyo4kP8JVXl4umBmHHDLy1GMnT+ZUKqmF9LXKMps1DBKC+uNxWrZ8+Wvv1v++ZwDXA4YIWNmKN7a1pJotScLkWLZ77KysMqNWGlYoSk3r3laHjT8i9OUT8j/FxqB6H42TJAUjkew2UtbNhPxMm0UVtcmWzmx2EzonbTRY69gBfm+a+vp60d7evnP7jm3P5+XlwVVKZ/WiPfKKYZOhmO6mWGl2/90Yg3AkLObNm+cOGTL4h1/96leHCSE0Pgae+766pCP9/l9nPJSDAy1grwWBrFwFV7l+4GbbDS9bf3QQKyBinHTSyecfcughFI/HSQgZ0L08B02tORQJy+bmlo66urq5/vxX71EAA+CLLoIE0LelOfVwPKFhWcLsRlH0+6Wgr2Rho237RmI3jlOmnX4hiFEzp26fZDQR3IgZGjNlsoj2x0vZRQffCM0gM4w3wfMPoGoc+G709fXegvKy5cumJ5IJ2LYjgjGSyZisIcNCCrZv4IvvBe+N9ioUE43GyE2n7GefeTrd29s7gJmpurr6gH1/HEf6Gt+cCVRtdKYSM9rsxg0PZsaZ8VGwIKI+8q1CQggDYOjkyVPKLcuGUkrkjE0CQQYTi8bQ2tb6xq5du1rfOf/9oADOLKwvWK//vnpLr5ECUmvNHsdWZUkA/ovTSsNNG7Fp6as46vjjpkUZQ4S8VPM+6p28244zsqnBzDdb4vNunkGcu3nDmTF5sIpiPgEBrJmZ3n574ZzNmzctKSjIo3Q6rYN1QfiZOFjqR661qWEwayhXsRCkCgsLRUdHBy1atPiWO6dPn/TEE0+syEW8D8gMLB1P2xxBJaIz1VkG0DPK45Fn7GZ3D95ghv4Ry2fJzJg4ceKZJ514YqSvr09LaVHQ/hl/1RWCWLku1qxZ8zwAvBeQKN4nfjVXQ7S6WLZ1V/8iYk3MbLQBtCGk0xpKeaeW0hppV4GcfFq78FU18pDBsWsuHHE2G0011eVyn4RvwBf11wp9glGmv+Gc7RGTEVfPKh8FGZvBmYn6gX75S/i8euWqWxP9CRK+03vQ9wYjhuzKnG9Hw4a1NjoajZIlhLV8+bKVTz/99FmvzJ79PSLq9JcmuK6uUh6o75TjOBBS7LaFZTLWqzmjthzKKecEcdAHf9SXP2fOHCYinHryqZ8dPnwEJ/rjLH3/7UxOMZpty7Y2b95snnz+yZfebXwUXO9r6FzhsbLUthb3iZ6+9HGWFJxKc7Dj77kDiqxUC4SN3vZ2atu+Hid86swv4Ym/31dTM8fsbcuVwH0vI9buB6lHNEFWYjaDlge2hcj6+RJBaybfkTT0SQjg+vp640vhPDx23Nj/GTFi1Oju7m4jBInAlTCjGeatcTGITDQalVJKuWXL5v41q9b99o233vg/AP3l5eVWQ0ODJiLmukpJVfUHbKshpfRZVjqr0unPy8mX08ka2AUm9sanzwu/zFYfFYMmKaVm5uIpx005M+2mKZ12ZSgkMs2cL05hwpGI3LR54+LF8xZv8j9T86EysIduelG/cJN5eP32RAowVjLlctrVSKUNEimF/pRGMm2QThu4roIVcsSKt1/nkWPGVZTn4QgS0lTvNfAja4sRCLcF2Td7WmZL5ewSA2WybtZ3zGScDQ2zjU/GxfX1VQJAormp6ffCM1tkYzzfJoYJTN7YaKOlZVEsGpEtrS2pN15/7YF7/n7vlDfeeuM3RNRfWVkpGxoaVHU1iJmJqur1n379X5f95qdnXwQABwq5Y+BAb0HFIiKPxKF2y74e2mwyxueZcllrsH7H1OIj7gOXl5dLYwydfcYZnzru+OOK2lpbjSCi4GcGrSGB2HVdrF69dgYA7bPt8KEDGICprITsBjbtaE/PUtqwMVqn0xpppZFMaSSSColEEMQaZIdp58YVurgo3/na1Wd9jWBQUV2+Vz/sHBOTzO5mMNrytpKCmfA7lxmyvtuBrYnngyTMJySAUVVVb6qrq8XCJc/d17yraXN+Xp5UyjXCX6NTSutIJEbFJQNkX7yX33rrjcfvvHP6SS/NnPUVAKsrKyslM1N9fb2eXV1t1dbCEJFY+OL/q42qnv8LqY45QtCeKvXtPzC9RYLBPkDlc6BVDoHFZNcuA4KH8plqJgC1lEI6nf6o6DOfedZZlxcWFiKZTDKADJjmyx2x7djWhg0b3Oeee+7R9yuf9ySA0eIv+W9udu/r6HEJYHL9F5ZWGknXIOVqJNMayZSCUkAylZKrli7ChBNP/Qoz8vcFNzrIsMGSfmZtLjvr8pSPgnVDkwVutPEZW741JAmk8Mm5uLGxkbZvR6K1pfnH4bADzTBCSJVfUGRKSoplZ2dr37x5b971wAMPnvjiy69cBGCJn1FFfX299rOumFZbqz5z0oQxWxb+/BnR0/2rG/739Zk/vmlh27XXsphYV0d7Wx9qX14RJwIignJdGB2QWXJYajnMNZMRgQgAriwBxvyLVMrq6mohhDAjRw6ecNzxx0/t6uxgKYXQPsiY2Wk32oTDEd6xY+fM9evXb3g39tWHCuCGBm+xfOU289KW5lSHIEilDKddBaUZrqvhKgNXMdLKIJlKw47EaPGrL+nhI0YN++V5w84VJLi6HHsPzKKsM4MJOBzIBnJWywjZjaSMrA5nfIU9x08DSwr1CQrgAJEWD9fNeDwaotnjxx1uhUIhq61lu5j18nMzb7/9L1P/8Y/nL+vp6ZkfBK5/k5icrGse/PP3rrzlpgvfMJvf+q/vfG9GclsSNwCgxsZKqqqq0j7BY78O4gkTPHadLWwy7O1JBxmYfcTZ207z2iodrF7qLM3UE0hQH8n6q6amhpiBL136tcsPOfRQp7unR0vLIu9e9A4GVykwM1KpFK1cueKp90Of9ziAAbBfRnfubNcPuorhCT9wZi/X1ezzRb1srGGho2k7dm5Zi9M//ekfM9jam9RKDkZGDH8QHwjbZcVBMz1ygDQGSDUHpuAMo0GeKiVLfMKuqqoqqqyslDu3rbmhZefalpeef/q2B+6efvorc944G8DSuro6mRu41dUQQdatnFw25s1na58oPzryF7VlTukvf/cmlu6k7yWJ3qwuL5f19fX6kbq6P1977bVTiIhnz55t7fcgliOhXeWL/mUXE7KqJR5pA8jhzhuPDBSMlj5C/+upQIILJx199Je6u7tgtJZewGazfTqdZsd25OZNm3qeeOKJp9+LvLHHKHTuTAkAGje594waZH2nrFDItDK+Z3BWeFwxQ0qBRMIFOWH56rNPmc984+rjv3xMdKIQYmllJWR9/d4QS6OM9rFgfzTgrVb4dmyBRKjxVe89WmVgsB0Iv2s/UyuPiUWWFPwJiV+qr6/XhYWFRSYd7+xNqKMAtPgHGxERVVVVBZ8D8exqSdNqVW0t4fFbvnvVlBNG1SR2LCrb9tqbZsacDvHi0uR1fYTp1Rdd5NTW16fvuuu+E0eNGPGtI8aNO+3ss8+edvrpp7fOnj3bmjZt2n5XyQS+Q46Ugv1AlWT5Y0gNEgKas/vuAb02463lqUpletR/pdyorq6WgoT60qWXfumII8aVNe9q1rZjS9YGmjxTPM8yV+tQKGRtXL/xyba2tiZmlkTvTzISexi/uroaYn0/Fu/qVDP9gNAqIAb4BsQMb0Mo7WrAjmDj6lWmr6OFvnrFl3/IzLjqquq9Um5JCiRlA+nNHHZYzkphrvqiJy2bnQEG5bb3yQkbgOTdMbIDug8GgO7u7u6iogE2kWgpLy+3AEjy1L4NAJo9u9oCEdO0WvX9C4869q2na1+fevLg29fMfqhs06LXzNxl/V33v9h1Ubvi6kpmWXHVVQaAPXhwye2P1deb2bNmTSwtLZv9+5tvHjtt2jTFzPttJg7HYt7MO6OLFkwtdM5+dI4gYEC3zEgQcYZW+WEP05qaGs3g2Gmnn/5T11WcTCZJKZWzGeb9PEtasr2jQy9etuRWAFRVVfWBD77H6HBjo6+A32Zu6+pXBICUylH1Q1aH2dUGblrBiVrylWeeMmPGT7rkK2MxvqKiRu+NkVLgG5MNSGTEtwNfXK2zv2fE7+DrPwVrhVoDJGFJEp+QwP2nQBZOdMFFFxmZ62jAdZWShOBp02pVOXPRG8/dcP13f3zJvDKsOWXeE9NVyEq7Wzvg3vvMrspdmh4vZ1h1zJg2bZp69NFHr+nu7p6SSCS4ceVy/dQTT0ycevwJb9/+l798hogUM1v7YV9M+fn5ZFmWt7wf8KGZczjOOiOfk225skJ3Jkee6UNnXyH4M+ed943jjpsyqrl5l5G2FEqr7Fqnt66oCwoLsXPHjkWPPPLIAmbOmLvtlQCur4dmBr21TT/f3KlW2xaTp5PuZzg2OTNZwFUaVjhKq1csNYl0yrnkyqqfExFXzP7o80Mp3+Hvw4FAHXK8fzyDs0DEGxnDL1+GVnsZmEiAiOQetxMH2LVly5ZkfT00+xmXhGCqqtdszIDH7/jZL+5d/NflY0s6/mfH64/ai197XZcMGcwtbX323U9tubmxm16pnMDOwMo6FkLom2+4eVJ+fv4vFixYoMLhsMgvLJJbtm7Ws15+qeiUE058/Mknn6wmIuWDW/sDrkBSSgYgC/LypLQsKOVSrhZYhq3ny+56CiUmhyqsdxO6+7AnU01NjWbm8Ln/dc6PhCBO9vdThrufuYeDMZamNWvX3uFn7T16/z5UMFV4e8JuRx/dwsaQALMvn5vJhFp7njyBygNZQj73eL05fMrJF59TgnEVFTW6uvqjZWHpO5aReOdYyZOKDZzptfYcGjxNAuEbFQaBHFQPGiSNwAG8afP+GQBi9uxqi0A8bVqtYmOK7v3jZf+9eNZNyypOLftN79JHhy9+5kHdm3C5dMhAbNvebN/+6KbH396J33E1i/pGqLq6SjCzOGLSEX9btnRJWCuXhBQEBgoKCmRnVxc//MjD9qCBA2uWLFv20JEnnjiIiDQzi/2E8OE44bBt27vzdYx/mgfyOp5+ttltS4lzKJWBy+OHyL6WEILPP//8S0866eTR27fvNJZjiyxt03t8VymORKNy8+bNrb/97W+fICLeU+fDD/XmNjT4WXiVeqijl5sjDgs2zNr4vGi9uy2FMQbRWIRWzp9nUinXuepnlb8kIq6o+GgfqiQvywofc/Z62pzs6nOi2Rc9Zj/AgxRNXm72gl650EpbAD4xSHQ1IGZXl1veDBFm2rRaNRI8YMaf//vnS+bcsuJTp4+6JbXxxeFzH7pVbd+4hSmvSBYX26qttUXeM2PT7Q2bUSUEuqkWATVTP17/xG+2b9t6/Ib167Vt25J9r2VtGE4oRFprvuvuv6lVK1Zc+uD06fOfevbZLxORqa2tNcws/82BrGOxmKHA48sHQWE4p2zOirsHMkScs6EU3M8fJoJramoMMzvnnHP2T6RlcSKRIBIykzyC3hqGdX5ePjZv3nw/gO5c65S9GsAAuL4KohPoburkv9oCJATrwGw7IzBnsnq6xAaxmLBeeKzOTDp1WtXnD8XYM8+8XtVVfviACfqPkO39xTO19k3HgZzhe64tBiGrdICMvxOBoAwh7bpgwykA6QM4Zqm6OidoIcy02gZFROarkzHphft+cOPst/+y4oyph/4Wm2YNe+2R6XrdylUMJ99KUwjREOudO9rsWx7Y8vZL63CtIBhjIOrq6iQR6Ycfrv+U1ulr3n7rbZVfUCC08jW3fO9ZrTyJ3sKCQmvWzJfVs08/M2LooEH3v/Hmm7OefP7JcUSk/UAW/vjqY+2RKysrVVFxsc7sAiPHF8pXnQw8tYLlBY9PT1mDMb9f3dNRUl1dpRRCmE+fe27VSSeePH7b1m0mHA6JXCovG4ZyFdu2Lbdt26aefvrpv/rl8x532h+676uq91qBQ/P0bUOL6eoBeVQYT4JBRD6PM0OgIAACGgWFEaxbuoBbWz4buvIHl98847//el5lXR1AVf/SBxJyCH1J33WBg5/KGXpkMNYiz6gxcI/MqoeAgt1pkBVCJBrpBZD0bGlofx8lkV8aE1AuaioqIM/6taqtNVyLBoNawkRgxM9rzjt37JTjK8vKIuVRkXS2LX0Cazat1opJhAsKpXBdJPoTXFIcpo0b2+RdTzY/99Y23HvFFeibPh1UXV2Nqqoq/dRTMwelki318+cvMtFYTDAzBf5YIG94l0syLykttdrbW839992LE0444YyxY8ctWrRo0QNr1qy5kYjWZg9jFvCNyrH3jcSpsq5SnNV5lrjiiisUEenzzjsvkZ9fgFQ6DcdxMuUwkcjdwc0swYAAYn8syVne9J4ysSor67iqipzPfu5z/2NZkuPxOEUiEW/ESeR7bQOu65rivBK5fOXyv7/55pur92R09JECGICpqoLcFEfzjjZzc0m+VUtgBZCV2S/1NW3Jd3PQSiNWaMmnH7lfX/XTaz999Yn1Fwh5ydN1lZWyqv7Db7jYUsKwztltzWborDaHyPjZkAiWGTjH7F5AELNlhRGOReOVgASqUFmZfbwJ9e9/YzX6DzVhD27A2neMePDufycAVO3XwQBQA6AG5aKmZiADdWxZljEM1NYaBhpMbW0DANDVR+HI8kvPP23omMkXlg0edGJRXjq/Y9tGrH3lbXS37VShsC1DkXxpw+Pego0pzCfRuHaX++Qr7d9t2Ia/X3EF9PTpcAGImpqJ9Mgj4/Ld+MonVq1tLUin08ZxnCz1j9nz7CCT8Y2Gn7HC4YggIsybN08vWLAwOuXYyVccNmbslxYsXNiQSibvOPXUU98iorYsKCkxc+ZMq7W1lVeuXPlextn83tVHNQUufwBYCMH1VfW6HvX6yiuvRPUvfzl1/PgjLt62dTvSyRTpSNifZohgouYd5vBATa8/9hShApH1QILX6A++Xf3eV132jW984dRTTxm3fv16FQqFLGYNIuHdoURgNgg5jmhtbVUvvvjyH5j5Q2XfjzLzJGagmFBw0an26uI8DEqkPTNDn0IB4T9Rgrfy54RsdLXFzSX//QsK6WTjyV+96XhmTvkZj/fwuTIAcf93Bq3b2a4PVa5rABLGH8Qz4CtmepnXyxS+txNl3dfZF6WPd/frqeefKOev6pn9k5sWnQEhvD55r+XJ9/86vVebkKP59S5XBED+xRMx5vjTjplwwtRjJkZiAz9VXFI2IT8WQV/bVuxcuxidO9bpZCoJCuUJYYVIEPvukgxLkg6HWL4+f0f6mTk9n53XihfYSww+YO9lgacf+t7flq/o++aOzrCKxUJW0AIGRuIZd23hK5QCkEJm1jaJCEZrjsf7dCQasY466mgccuihcGx7S388PnPNunXP33jjjW9v2LChCdjdSjWQVg1WtZVSmbfLsizOxVre5YrefPPNx04+evLZ0VjkvEQyOaW9vQONK1fCKAVpCQgp/XaKIKQIfmhWTh2c0UFnAFopXVRYJJnNa1d++9unMbN4jxU/qqurE1VVVdbDDz+0ZPSoUeO2b91q7FBYsmdC5fWtRNDa6EGDB8s333zjiR//+Cef/7DZ91/NwEEvLDuB7u3t/JuSmLgVZDSDRDYecyB3IihXobAoJJ65f7r62f/ePPEPl0y4ioS8cXZ1uTWttuFDMXg8TaxsRuWc/thvy0C+fYa31+lBVBw4sTOgQUgqpnSaIRO94SngYwcO0KKzB8YFABdIe66SjgYsA28UI5CxGtYuwK7384UC2PaqIkt7GJqlACSBhAsoF0j6N2kKgPKLhx7vJ+2GSYwYAwwZVgwMHw37UyePSOxIl5wwauSwkaPHjytkEz5t8LDBhYT08FjEhurvRMf2zVj3+lzubGnSRqcoEgkLOxyR4XDU08HWGhoMDUY0IlUswtbsN7a3PviP3q+sSdGLV0xhm8gLoAUL7rSJyH3k7qt/17Kr4+vrtwu3dFDU1m4a8EZu3o0tKJuJAzFyXzWcMvN4hhBEBYVFlhDEK5YvN0uWLKHSsrJRhx126DcPHzvmm/fcc8+u3p6enU44/FIykXhzw9atTY/cf/+GefPm9TDzAP/9cYko/m73QuGowqLvfvW7h40de+ihRUUlJ+bl5U2KRCKHu8od1R9PYGVjI3Zs3wZltI5Fo1LKQJzRX60k79AWQmTb+uBwAGcdSbzTyoRCYf6guW9VVZW6+ttX/uDQQ0YfsXHjJh0O+8HrH8zG74Ftx6Hu7m6eM6fhD0SEPSFu7K0MHAAnVFsL8eXjreVDB9C4fhdsCYggA1ImzVBwcqK7Lc6nnXcRH3/y0e2nn3PtkbuY22qIUPvBLr2ZDPzIdwetW9/kHppWykgi4Z32XrkjJfzs77/5/r8HdjDeyMk7VHp6+zHppMk45awLubc/RbbUYCgQGTCkH/UmmxaF9Gl1XhlpQICQPl3TS09CkE+Ot32iAMCG2ZIiJYTQli3TQmjFRnAsFu21Q07aQ8bT7CrYHe1dQwVEzBI2BAmEQkA4IsCuBRigv6sJnbt2oK1pI8c7W0wy0ccAhAiFBYkQBAmQMBA+K9QzNgPSijkSlixMWry2oGnxn19MXCcKCuaec05Pd329d0/deeed9pVXXum++nxtZby7ue7+x3duGX34kaMSiTgDTGyQ8ccKvJmDFpaEhBAyQ2HNGuuSbw4vYFkWwIxEImH6E/0GIFFSUiyGDhuGQYMGIRqJIRQOwbKtppAT6urp6ZEdnZ2cTCRSBfn5uyzbduPxeL7WqjQWi6GkpBRKqyKt9FApLSSTSXR0tKOpqQmtra2cTqW0JaQIR8JCWlZW4IFEtlwmb3lfEIGEyGCeAXBCwkOs06lk+rAxY53urq753/r2t054jwwsmJkHDiw89M933LU0Fo1GOjrbKRQKk/f4QalOcLWrBw8eIt6Y9+aca356zRnvk9H3SQYGAG5s9BQ7Nraqa0ryrSdtAWMMgyTlxG0gO+XJ8MSKovTK0zP0ieWnlv31+s/8gYi+Nnt2tVU7bc/0lqrhmap5zgoACT+4yOM9GwNAMIh8lQUyu4FbHgXT242NRCJYt3wdOnbdT/mxEHsWMgTHFrCk9LK3n1lAXnUtSYAEg4TwS3OJ4MPxqkkB46sHS9/SURAREcI+ThIDPCkbQTSQiTJzcwbDaAXjajbpNNxUHGmVAuuUYZ1gKBcGLCzLggiFhbRCMlxQ5Ls0sm+Lqb3nbCjjo2wMTCQixa7mXnr97Z03PrCYfz+0EMNLwz2pgJt+551X2FdeeaX7y19+/6xQounv9z+1eufQw04dpdyUEkJY3vPzCDKChH84eje6T4bxARrh9XkmUG7xAwOejxWMgW1bYkB4gCCvNOYNGzbwurXrDAkhQo5DkWhkSCwWGxKNxiAEQQqJjo72SfAPynQqjbbWVqxZsxbJRAJ98TinkkkmImPbNjmOQ+FwWEQiYSvwwtJaQ0rpPX9h/HYrywnQYAidDVrvVCRorZmI9CGHHuas37Bh7SuzZn7fH629W/YVRKR+XXv9zWPHjo0tWbJYR6NRAcMwwoMLgv465ITR0txMjz786J1ElNH2/jgDGPX10P6CwlNDC83MsUPFWf0JaDAkU5b9RL4aoGfaQwhFyHrgzr/pq3/6o6/+YtacujPOvP4fHwbQIiFyhutZkfkAbfbKI+8mCyRnA3Q8OGKzRosuOndtQq8AWQKwLc/IXGSAL9qtTA+WIbzghe9fg4yfjfc93qfF8AJeiKB4ClxfAxjN1/wTlCntDREZBgkISEvAtiWkJaWwYmCHICFgyFsk0cxgozLElUz28AiTABghW+i8sJHzljclXn27+0svb8ETgoCd3Wjd2e29n17wTne/8o1vlF9wYvilBc8+8dCsxYfdVHWI+7f8ggGTO9rbjTYGUngCSsGryBxc/iEX4AwM8ky6fEDIA4sC2SUC+RNEEgKOZVEoFCYiEsLPdm46ze2JJLeYFmjleToZMLP/uQoikpYFKS0QASHHEY5jU/DoAMMo5YEygH+4kt+XZ/yQfUUhn9Dh1RhegLP33JPppC4pLpaFRUXW4sWL6/7whz9cDaDNj17zTuDquuuuV+ecc84F5/zXOedv27ZNRyIRCXjIdtBuCCGgtNbFxfmivr5u9eLFi5/xDwS1L6CWD4bLAVnHMFPKcOwpR1rzozZMQkMKiJwTmvz+0wsqaVvoao6bL3zrezRqYP7OiRf++ghm7vdPNfN+JfQpJci/6pLBa9btTA5RWhvLq36ym1F+mSKDUQD5yh2cBbm8wAtmSwICXhllW14AEwW1YXbw7/V3BoKE9/8F+X7JgSB38MM4A5pS8L0BgCay0j6eBpN3A3n/168MkOV2C/K2uyiY1ASaX0SQ5Bmt7yahy9mDTGs2+XkWLJMUcxe2rnnwlf7/3pbCy3WVkFX1mfeYgy2in/zk29O+fP4hT2+YeZv5/PVbDwfQDCD6/e9//zelJaXfd5WL7q4uBSJpSUFEAiSEX2V4WUy8w5iLIPxJhP89JuiZ/RbLz8xZN5Gsoug7mXa5onwB4p0Fm7J+WMwmo23lPQ+ROWCyxnyUfV45qksBdqi1MVIIDB8xXMT7+3vmzJnzy/r6+tuEEPjCF74g34WjTH4JHLrn7nsWHzXpqLFrV6/mcCQsjDYZN4fg+cWiebq1rVX+uva6Szdt3frIRRddJOvr/zW9sY/MjqkHdH0VxKI2LGzu4r/aNqRhzzxBG8Cwx9ZhfyWSwdBKoagsIp6++y+mcMghw5687nO/JyIz+3140tX+Z1wwzB6T0DQondZsSfYOfd/PNbgBCMhsnOgc7+Agy70TTmdiEHnf72pvrzlDcA92R7XrD/Vz3NxzJEmzguEmo+hgjIYbaBBz1nzc24DRmccKdlG1r5DIOUQUzz3Ad5rwSSpGaU990+TYzPm/KWUYRDovZoltOzrFQ89vvf//nu+/WUu0VWaDlwHwgjvvtKdNm6aur/7RGRefe/TTfSseznvoya3TQdRcXTnBIaL+m2+++QeLFi86z3XdTcNGDLccy6JkMqXYGEg/CMk/AP28jIwNrSC/3KYMiSboh4X/yzPMo3/G3Ilz3sfsuDA4HLzle5ND2MnO/3M10UwOUs258D/7WEXGxYSg0tqkkmk1YMAAMXDwQLFh48bHfv7znx9bX19/GzMLYwy9W6DNnj1bEpG+5pprfnXyKScfvmrVKmM5trewgCxaTwDYsA6FQvKlF196feOWLY8YY8S/GrwfuYTOJXdUV0NMv1H/siAmLxgQo4EJF4bAIpMGTbbAIT/QLMeV995yo/rWT6696qdzFrw67YzrH3nPUrocoroCiG0pHRmNWSKV1NqxhQy8keADU8TYreT1MpmfMb0nkSWZUHZWHYAxxlBW0dJ/041X04KNl4ENAcIHsTLi6JR9HPL1pwJCgAF741J/iI/ALy64ewxDCpkzw84K93n9u/F67uD/EHkcb8VgwZnpl9Yw4UhIpN2UfHtp07yZb/X9/K1mNI4cgDFlYazx+10K0ObjjrvSrbv7pjMOGymf6Zp/S/TpV1ZvfGx53l3MfUTUqHJGIs8BOObyyy+/evCgQT8eUFJS3NXVhbRyVUgIKYQgZuMbc7Ef1MgEZu5Egvw3KWhxkINNBHk4aLmCZsPDIURmBEjwevxA49aw97lk9K4DEoY3wAXntjhEfonsA5DeiMgwM+cXFsj8/DzR2dk1/815r1378MN1Lwbl8XuVuJWVlfLMM89UU6dOnfK5z372h5s3b1IESM4QPjhTwhujUVhYiKVLl+D5F164lohQRVUfqQrea5S2YFn/rMNRdcxo+9G0YmUMWSIHhebAEI28MlXaNno74uZTF19B48aO7T75Mz85t4f5bR/l5N1PuXJr2rQG9cj1k+q7trdetGZjp4pFpBX02OT3WkEPFAyy/IozC7L4BwqRtxQhBPz5qMhYswRlqoDJAFHs3xRB30eUPcm93QrOujYKygYrsqV79gbOQurZV+m9J97/9z/6oLf1bwIRtApB+eS/bkuSicQsEbIYK9d2dC5Y0f7HBxfhBngaC5TzX/yiY7YkmqbemvvwmcWh3qfXPP/H6MpVm1r+PCtUuaW9b+47q5TKykr52GOPaWZGUVHRqK98+YvVQ4eO+Fo4EhYdHR1IJhJKWpa0LYuCsUsQqLlBGsyGg9KW/JbDeOJGmTFUbsmcm72znyxlZ8A+5oHcTBxs+gSHiP9zhRDePeIDkFobY1kWFxQUyGgkgl3NzetXrV31xwfve/Au771j8UFt3ezZs+W0adPw4H33zZ941JHHLFmyxMRieUIplXnhwXOXlqUdx5F/+tMtM2bNmvWFf5XItFdL6FxAq7oc1sy1qNvRgcfywsICs/Y2bTnnDsqZ3WqF4rKYmPnodBbhcNHDN11+MwXwcc7hcucVU+xp0xrUNVcfcfLQkQMu2Lyp08Qi0tImWyJne6AcneqM+UJ2pheImmdgpd2EzpEjCOBla+3zuzO1uc+8pkzZ6luXmKyQfFCa+ZK1WflbzhET4Gyp4PWv/mobTHZVkrIUpMBJwPg7zspluGmjbYu4tIhFvKdTvTB386s317f/8sFFeIgZutKDAjKprdobc4BomvrrTT+8plB2/mPF0zeEWnftMnPXRa/d3NY317fUecdn67k+VFdXW11dXVtuve2O//fA3+85acf2HdMLCwp6Dz3sMKuwsJC01loppQFmKS3ITHlNvp+Wh+xLkUXuvcpCZIIrCDDLsiClhBQS0pLeY4ggc/u/iyyvPVMxUU4FxciYvQcujK5S7LquBsMMKCoUBYUFsqe7e1XD3Lnf/Z//+Z+jH7zvwTuFEKqyslL6Y533RIb94FW//PnPf3Hc8ccfs2zZMhWJRoXyta0yelvGQCnFeXn5NGdOQ2LWrFnXMDNV1dd/ZNbQ3iaVi+pq4L4/o+zcCaEVBSE9oN8zHhdBhSTgz+GED+CQhISB1nn6JzfeIZ+Zfuf1l93+yq9mz662pk2rVcHvV1WW5X3zW59/4+3HXjxq87qdJhS1hDaEYD8kyLLCL98CzikCZlYWl8pkYSn8akD4mVR45bUQlB2BBOe4Nw7yMrZABqQJJG3JL9M9QCynXAzyPmW52eRn2xwFr+x4RiB7IwabVpwloWjDLIQw4ZCUsbBBV08/Nm3peuXJee6Wpl4MCNticUiYhzb0YEMuBbGyslI+9vjjmo0Rbz/z698UF9rXNDzyJ1WSn7KeeD01/97X+r5QXY0dvlrs+40zRF1dXUaSZ+DAgYdeeskl3x41ctRXSkpLBiUS/Wjv6ECiP6HIx5YtKSlTMlMOEu8fir47RuY1Cn/KkEvOgX8gUg5phxE4L5rsweyn/OAAN2AYbZiZjZSSwyHHys/LQyKRREtb81vr12/60zPPPPM4gDQR4dFHH5U5ckPvtyAhH3vsMX32tGnTrv/tb59v2rlTdnd3S8uxM0BLUD0YoxGJRlVvX5/15ztu+9nbby+8obKyUtbXf3Sh/L2+FRKU0p8aZ39p8iF4IOUaZZisoH72yBaUKYVAgBQW+nv7edChx5hvXv3f8s5f/fxT17/U+jKzkUSkf3j1fx1++VePu+vVJ5+fuuy1RaakJCoCb1tkxkO56GdQFlPmTQSyjhJZaiVl3wQ/QAkMIb0cKwgZ0kIQUAKAFEHZ7n2f14NRZqQUUDjJJ5Swf9+KnB4vQ4TIgvXZ/jCHZ8lsoBTYGGYpBaIxKUKWRkdXr1q7ue/l15a59725EzuGRujcWJg7OIT71u9Caw7xBTlst6LZdT9/atQgcfqz99yZKs7n0NodquE3M7r/+M0r8OL06VB7ulhQXV0tJk6cmKutVfqlSy/93BHjx11SUlpWUVpaKvv64mhvb0N/f79SSkGSELbjkG1ZFCDyhOxiu3e+CWRHkD624KPz2YNs9zI7V9jQl8BhZhgCWFoWYrGYFYlEoLVGW1trf1tb6+OrVq154NVXX30pGHM98sgjsqqqyuzh6/crGSp+rL5+/sBBA0evamw00WhU5NxQWS8mbXRRUZF88smnlt19z93HVlZWor6+fk9/1scbwABQXQ6rtgHq0mPlfWOH4isdfdBSeCRZgsk5iX3tZsOA7aCzJc7nXnghTzlhauLT5/3oKxs1nnrl6ZpKuG13Ln7l1cKV85frkrKolNCQkjKDX69SFpkNJBIewOH9CIaHpQVjHR/U8iuBAPfwgoYzPS84GO/4/atf8Voym52DHjbItF7w5mQZ/znk0g1z58CUA3xlqIgcHDjERDCWJRAOCSmFRk8ijea2+I6m5vizr63QryxqxnYH6BxWCq1dtG7tRuc7WGvEXC2JatX5UwZM/d8//vTuiNs29qWH7kpHC6LOhh19W3//eM8Z08Zg+wvr/2VtbFFdXS2uu+46FQTU8OHDj/zc5z73X0OGDLuweEDRlNKyEgcMJBIJ9MX7kUz2a6UUa79PZA/eJCEkhBQeGyfnPczlPCutPTFgf7VPK8Wa2QRftyxbREIhEY1F4YRDSCVS6Ojs7G9vb3+jqanpiYaXXnqxtadnQxC4/ljoQwVTMHq78cY/1p999lkXvfbqayoWi1leFeUTQci7B7U2nF9QYFatauQH732ovHFt4xsfZWz0sQQwAOJqENUi+p1ya0F+BOO6+snYlsdxCW5Yr4UMHOMItmOjp7nPfOnbVwkuKtnW3N62qVD0nz7nmX+gq6PTFBbFBBsFWwZZNDtjNoZ8lDtYpqB/KlmDwJMZZEVkAS5/yB7c+l6P5QV2UGIHixHZ7CEymV3kEDqypHiTpR1mAtoXFiDabcnGGDARGWlJWJYU0Ygg29ZwlYum1kR8zeb4+pWb0rMaNuJxANsLbZQWRWFiDtY3tqIvB9Ng+FLAM2ZIrbXGzd899Yv/VXX2Xzs3rooueOEf7sAhA6wdbX2JB2Z2nrdoB+aYfwa6/rUVvspKUVdXZ96xknl45Re+MPXQQw89u6Ss7NiBZWWjCgvzQ47teD1pOo1EMumZa7ueJ68xWruu66ml5MiVeU+SQSAJALZtw3ZshB0HQkqkXRfxvj709vV2xXv6Vre0ty9vbW17+YknnngDwI7gCdXV1cn6+nr8K0EU0E1//MMff/urX/vKHQsXLlBgtjwqaYBue542RIBtO0ppYz300IO/e/bZZ39RV1e3RyX6vzuAUQnIxwj6vLHOEZPGiiWJpLFcAyEFE+XQKzmH1QMykDIPk6Ycbw4/7ijx5osvYO3SRh2OhoQTssgYDZFBOeFTH32pVL+cpWy0ZFFdHyEWlPlSJiMGq63SD7ygvwrYVjLDq87pi4Os7GdtkcnA2WDNLFaQJ//DbDKvFiwMhNeDSynJDkkRCQk4Ia/n7U0oNHX0t7W2J97asD017+1VWN2aBttA2+B87CqKoaPNQt/27Ui843PMKZnnKoCd5/5+9a+PmjjsJ2//4wmsX7VaDxkygDjVi0caem57vlHXVlejq7YWjL27kyuqq6vFr3/9a6V3X7+zAYw6a9q0ScOGDz28uLhkwpAhQ/KZcPSAoqKCSDQGAkqckONjCbSbYKLrKrjpNOL9CaON7kkm4jqZTHZKIZfv2L4j2d3b9+rq1as3LV68eD6A9t23vFhUVFSIhoYG869QFoPAr6qq0hdeWHX8L3/507nbtm6xOzraheOEaHeEnXy2IExBYaF48YUXlt12221TKisreW+Vzvs8gHNL6ctPC1152GD6y4427UoBO0Cls+Uiw7EEkkmFyadMRW9PAiveno9IzEZBfgiWZAjyXFs9pNYf5Ph6upJyHKt9hY4s7dLLoh61j0AMH06izPJBAFCBAq0t8oj5QpDwgKmM9aHPYfY42Jk2njOjsSBu/YQK2yKyBMFxLAgpYFkMywa0EYBxkVZp9CW029GVaG7rcVev3Rrftnkbb2rchdUJYCGA+MBQKJaXn5LhNNobe9DtkyVzS+WA7CJqvBvJVI7FMb/66x9uLcvH1BfuuUN1dXTLyIACI1S3nLO4954H31b3VJfjzVrPeWNfihiI8vJyUVNTgTPPvF69x0J8CIADwBo1atQRRUVFgwpiMY5GIpChECSAtE6htzeBnp4e1dLSua2lZccOeCoq76qmIoTAtddea82ZMwcfJWhze/6amhoaNGhQ6dNPPz07megfv37dehOJRYW3IxxsaGXovFw8YIBpXLVa3Xvvvac1NjbO35ul88cSwLlB/NPzIvcUhczXmzuVlhakZpHxK/JmmQZCSvT2i16VTrRF8qJaa5ZkTKEtURgJkSR4jpDKEBSonyQZQRQJW5CONBDSpyuSyGReSwpIKWA7AtKSfg8rQFJCCAvSkpAyIAEI7/8KCSdkQ1pWhkkEFhCW9H6RgCCdERAgDpYnNDT7z9E1cFUa7CYBk+oXSLd3xRU6e7R0U8m18d50+8YmHevqVqu3taOzqQtbeoFdAHY5cFLDB9kd502Od6daYYYshP6gba3Z1eXWtOteVWCDP//o9Ks+dUnlDYldm2IzH7pbWZGQFYmGlC2S1ssLOl+4/w33r5Un4fn6eUi88xDYxxcBoPLyclFRUQHAE173LTd3A6b26MH8bKe1ljU1NQQAjY2Nez3L+VRJIiLz5IwnZ48aPbJi/vy3VCyaZ2lfQ4tyto3YGEQiETeZTNoPPvDwNS+89MLvq6urrdraWrUv3tB9/qH5/XDkmnPtBRHLHNEWhxaCpDEZXhYsi5kAenW52tESp/tcxW9BICoZY0sK5eCmJv1qNIR2S8KJp9HVpLAdgIoBRUUhlIYkIpCA5XPLpPRoZhIA2whZDFtKsCCEXEaeT46CFEg7NtKGIQ1DsoEDA0d4C0mWx0uGNhqWkHCEhYjRkCRhCIj7dCyLAaE1pBBIaIMEM2R/EpG0iwHJFHoTKbSlvd1gnQKaANgSMDbQHY1YyQJLdQ0fgJbXt6HzPe7h3ZvmHNS/ro4NEfEU4LCbn/j5n8aOO/S8+c/NwNr5c3Uor0gaSbow7MpFq3tevfOlxJ3HjsPTb6xB78ccvHt0H1ZXV1NjYyO1tLS86705cOBAnjBhwjtVO/bpa2Bmi4jUE48/ceuEIyd8Z/Yrr6hYLGZprTPtWBC8Hu4hVCwWs+rq6p979NFHz9tXwftxBTCqAXEdwZx/VOiQSUNNY0KZcEIRSx9nZ1+1oy+u0RMHEi4jrQmWZEgGiovC6szzxs66rHb5uUr71igfTTkj6sV2GQMVCaBeAxMcYFcYSOQBOgZAWDD5Dki7gAqBC4XkPCG4VArEjIueFFG7pUEs4QjANkAKmjqToB4bsB2LC0I2FzgWiCxqt5RoEbZMRO1EGgCiNnrf3IbkO5lSe3JjegowdYLoYg0w/nrttCvKP1f1e9HXUfTifXdqN9Uj8goKKK2Vtm0jV27ofuGO5xN3jByMee8cMx28Phi0+vWvf/2bSy+99BevvDJLCZKWtLITIw8CEYF8lBlQPEC8MmvW1j/detuJzNz8bttLB1QA586HL57sfP7woXiks9/AMLzFFvJsK9IuI+WCXW8uT5IYYUdQOsl86PhhdOKnz1r4bN3yb9z+1MLlPLvaomm1HuK6B69jQrV3s9bUgEVOm2wMqKrKY6S1tID6+kCJBKisDGbzZo8rPkSD2vphuxpCCrAyWQZbQPmUApwIwx0lwf0uhC3AzRJ82Ha4De+Qi/mAz+GDgoq4rlLQxY9rsMF3puLUr1/7q+qhwwadvXzmc1j5xmxtRfOlsCRsS+lwiOSSdfEX//Jc311DYmjYGEfLweD9cOOi3//2txecf8EFTyxevMgk+vulE8qCVsE2lZACRhseMKBYL1++zPztzumf3rRt26x90ff+WwIYAK6YAnv6QrhfP8X54SEldGNzr1KWBYt8pqJrvP4xsDuS0hsVOZZEZ0daDx47Xp5y1unxZa8v/OGv7l0wXUiBL3ze/CuGaR8mYPb1e72nP5+qq8vl9b9+TRmtUQwM+/tdV1cfPWXy5T0712Nu3QM60d8tokWFpJQLKYwhcsWiNf1zZ7yRfiwaxfPbe7DeHzWZg+H5gaCVVVtbqy6prLzgpz/72YwtW7eK1tZWRCJhD07N4FXkCwUwCgoK3M6uDvv22//8y7fffvu3U6ZMsRcuXOj+O26qfR7EPzg7+ueyPPWt5h6lLCkspRnaCJ+HHIx+/E0Vw2AS6OxI68LSYfIzl56DdWt2PPb9P7z4YwBbfKbRvkZT/9X36iPPV+vqKsUll87QviJi6M5rzvlp+Wc++72II0reePzvvHPtYmPlFUqWFoxRHAlZ0DpFryzofHnmcjNnwADM2NKO1QeD98MF74mnnjj197/+3zlaa7Fh4wbkRWOkfVP44IP1tqAYkUjUJUH23Xfffd+zzz77tSuuuMKePn26u6+f67/DhCoAtcxPznWeL43yuS09xjUgO638WRAThM+VDlBJV3maVCqRZsiIueBLlTKVFs333Fr/lec3xV8WUuCRz5vcfdcD/aLZ1eXyTD/jAnDurTn10hPPueQnBbG8iW+9OAONr7+sY7GQtKN5UK6Cq9mEQ5LArnltWc+dT81PLx9ejIZ1HVh1MHj37ApmvZMmTTr8tltvnes4zqCly5aa/Px8YXz/4ECcIEcGRhcWFsoHHnxgSV1dfTl7+5j8cdyH/y4XOcHVwMA/YODl5fYrIQvjm3uNIpDFnKVABrwbT0jOC2ZpSYQtRn+Pq46ddo512JET3NWLV/3fVTe+8HsAHVIKfP5fK6v3k9MfoqamjkhequFZWYbu+P7xl5x6/iU/Hjx04JFr5r+Jt/7xqE6kEiKvsJCk8MQItIFxQkL09CXSsxb1/H3eal44rAQNa9qx5mDw7nnwXnzxxfq4444bfPP/3fxqOBwes3jJIh2NRKXSCrk6WOQrWyqldGlpiXzmmWca//q3u8qFEG3GmI/t/f632UBWA+I6wEw9Ijrk9DFmluuq8V1xVrYky5dOysiceD1xsPgAWBYhYgv0dCY5OnA4nXHB5xDv6tn20lMzf3Vnw86HAaSYWVRVER0ggUx1dZWisrKOiUQg6Tj43tqzPjfltE9dXTxw6JGbl76FRS89ruPdHeTkFwjPWs54sjsCpjCPxI6W/m31c+Nzt3TwsuFleGj5Dmw/GLwfIvNefLGeMHLk4HseeWRWKByesGjRIh2NRaVy3SDt+tQ/L2xSqRQPHDiIZs2a2X/zn/50IhGt2Neg1X4TwIBHt6wH9IVTokOOGOzOctNmfE8CyrHIgi++bnynB8Pemp5H+vCWBmxLIplIc1e3MUeeeIo89oTj0NK06826h5761YzlqZmAR7OsqaiQtQ37vEf+8EFbWSkq6yoh5KWafePos4fimMt/9JWvjjnmqK+VFg8tXrf4VSxueEanu9soUlgkhLShlAsQoDXYtkB5YY112+JLHns1uSGusXJIPm5b4o2KDgbvh+h5J0yYMHj6nX99pbAwb/zChQt1fl6+dJWLgGnljTu9neVEMsWDBw4yS5ct1bfefNtndzTveOHjDt5/ewAD2fHSl07DkMMK7Vlpl8d39rMK2V4Qs09eDkprb0nc5AieCTAIPZ1JdiIFZuqnzpLDDhmM5q1NLz7z8Au3P7As8QzgKSAa/YisqqpC/b+pT/ZsVctFTc0cI6RlOOv2PviWbx991qTTzrt80IgxU20kxNI3ZqHxrQadTnZRXmGRcBwHhrXvCAhowyYvKgSZVOrNxvirc5ali6XAs6OL8buGLUgeDN49u4JR0fGTJh3+57/d9aTlWOOXLlmi8gsKLAAZm9yMFqcQUEpxSUmJWb1qlbz9zjsvWbtq1aPl5eWWb6KO/6gAzg3iq8+KDC2N8NxkSh3Wl2RlWbCMLzbFxls6s8TuI0yDQP9ZAkYh0atMfnEpTjyzQgwbUYb25l2vvjVn1QO/fXJ1PeCt23nBrEVNTYVobGzgfRTQVFkJMWFCOdVUVMA669dK691+TNlPLxxZfvp/nXX+kEPGf2Zg6cDi5o0bsKDhOWxZtViRIBktLCApLTBrWALwXQXYgFCYT5RI9G965o3eJWt38NEhC3ev68Jvcj7Xg3PeD7gCkkb51Knn/uGPN90TijiDFy9erIsKC2XmPvE9kQJZE6UNhgweotatX2fdeOONP2psbLzp3xW8+00A5wbx549xxo4fxjO15pE9CdZSQBrO7s8GahnByihnZGu9x7GkBFQK/X2sowNKaOLxx4jRYw5HSqWbulpbnp03e+Ezt76887UgmIMPShCg1BfknJoWam1s4Prgi/VA/btkskpAoDLzZ5RNKCdUABUVV7NlXaq9zYvdq6nyGI787DdPm3rUicefXTpkxNQBhUUDezs7sWr+69iy/DXd3d4MckLSDsWyqh4iK4dqEUxRvhAkFDbsiM/7x1upnr4kxjkWfrGmHQ8hZ53wYHi+/7VgwQL7uOOOc6+87LLPXn7llTNICtG4YoUuLCyUwWppAKNq7Y2O3HQapaUD3aZdTfZNN910w4IFC362L2mSB1QA5wbxZyaFDjl6FJ5TaXNEZ9wo2xaWMZ6SPvlCdPD1kAPxOJNRMQzW9AS066KnV2thOxg5Zqw8YtIEFBUXIu3Gm9rb2lfu2NT05qqFq2bet1itgaeD/C5vD+32m9dXB3/A+1WpJRcegbHHnTpx8tEnTJqYVzBwWnHx8PEDikuop30X1ixegDVLFpju9p0cCrGI5OcRyILWvu9xRimTYCA44hAVxoCevmTz643961dsMkMFoTMSxf9bsgNL4dG+9cHQ/OB73her0zfccMMXPnvBBY+2trWKdWvX8YABAwTg3TvC19YKNMvSaRfFxcXuzqYm+8Ybb7xp0aJFP/KD99+KrdD+9u4GQXzhlOiQw0v1TElmQkccyrbYCnQLPRma7CpisDRvOCfe/FcW6Csl+tOcTkFH86Ni2OgRYvihIzFwSCmkZKRT6Y54T3+bo1JzN25s6bYd99W+zU2tr8/vpfWtUKuArfDokD3wVtdKhwOjxw+Ac9Qx4BFjhhX2JvLOGjfhEC4cPr4UWp885JCRRY4IDww5QKJzB3Zu2ICt6zago3mT7u3shEskQpEYOY4DIMeQPKMywtCa2JJAQR5R2lXu5ubE63MWu5ZycbQVwv2hEfj+woVwywFrD+iaB8Eqb0fZaK3xxxv++MfPff6zP1q5ciU372pGYWEhETEsy4IQElJKr/phIJlMcGnZINW0a5d988033TRv3ts/8ufF/3bOAe2Pb3QQxMePwuCpY5zniyJ0zK4erWybLG9EzMjRRMsoNXjhnC23c1+mYYKQgGCDdEpxKsmGhORIQYEoHlgmBg0fjsGlURQUF0GEbOSHQnC1QMoQbCfSZTukw1E77tiWm+h3i9ykKsmLRhHOi8FyCEgR4vE44gmD7pYmdLa3oHXLRtPZtpPjfT0sBItIJEzScUgZAdcTb/RFB4CMhENGCooQDRkSwmBXp7v+teWpDc1dPMmy0CEFfrSyFS9mULyDYNUeIc2+7E/smWeeufnoY465bNbMl01/fz8VFRWRt1cuYNk2pPR2t6UQSKVSXFpSYnbs3Clvue22m+a9OW+/yLz7dQDnBjGAgtrPRe+ySV+0s8soKdjjTueYMiMj0O6h1eCsxShn4ByfFpLx6/GztjFQaZfTaWZBMJJsWCFJoUiUnEg+QpEQ5cfCZNsWhLS8xX1fXc24KU6nU+jv60N/os+4qSQEFBybhGVLImkTCxskfC8gX6tY60Bi1huHSeFlXqW9pz8gnyhqazS1JZvfXutuWLMDpbbEIEvgvl2EX7S2os8fwX1SWGcfC1gVjUYHP/74jOfGjDls8nP/+IcSgqy8vDxPxlYKCGHBtiQsy4awLCjl8sCyQVi/fh3ddvvt1y1cuLB6f8m8+30AA9k1RGbg+s+H/2wTf2tnh1EglgQiNj6/I8ObFjkuI5zRuspNxwxP91m8Q3Rd+Ai39FWR2SBjq8LM/jlADBAsKShkEzmWp39kYAEQ3qktCdL3ztXaeKkxo4pJvt2HL4vF5DvBwzg2iWgIEFKjJ662rNmS2rhssxmeVjhUCMyEwY9WdWKl/zIO9rt73u9KIlKXVlWd85OfXXNHMpU8dNbMWSq/IM9ybBtSSli27elQC+HpbNkOmNkMGTpUNK5sTP/pltu+vnz5kof3tp7VJz6AgxKxrhJUVQ/9nTOcW4YUiv9u7dGsDbP0aEsZSZuMOx9EpqTOtU0B/MWIHLX+wCtWEENIgd2cJALX+VxvVyJYwlOnFMLP+MHDBweJ8B+DkXFE9AzTvNNFaYYyxETgkE0i4gCaNff2pXY0blNbl28yDhhH2hYaSeA3K1sxAwD8Xnd/I6Tsl1ddXZ285JJLtDEGt9x8y3dOPOnE/9u4eaO1ZNEiXVY2UEpLQgoBKS3Ytud06Cm2WBBC6OEjRsj58+en77jlls9u2LLlhX832nwgBzAAUF0lRFU99A8/Ff5SnsP3usrIviQrS5KV2Q4hZLjTWZsUzgjXZRwbgIwmVyBSJ4l9plcu+kiBpVNm99PL1h5LLKOB5K8HWzIrcheAap4LoW/s5sGfbMgIxwYcaZB2dW9Tu161bLPbuKEZhoDjQzaStsCfGtvx4O5w+MFed0+ugJwBoPiFfzz/p+LSki/PfPkl7ujs4OLiYkEUyCtJ2LYnnST99khIqQ4ZPdpqmDu3+dZbb/1qR0fHSx/HWuAnPYC9U9Vz19MXn2CdduIo629pxYfv7NKuZcEOZsGBUF6uY4Og7IvNsQjOsLw82qanTOl93SvFtW/ZInIewNv/9HyVaDdxeAHhG40JkG+lIpgZbEvAsSEcm2ELjd5+5Xb0qs07283Kxq3stvRAsoAbcrDCBuau68LcnJd9sFzeY9ykUgaytpdddtkZl19++R2JRGLck08+qWzLktFolIQQsGxP68xxHNiODcu2YDTDsR01YsRw6+WZM5fcdNNN5wHYubccFA4GsH8F+8QXTI4MPWk0HrAtnratXbEgsJQkPL/cnFktZc0rRWDjJzjHVYGZ4Dmui9165UAwPpvBs7KhyDgxwMu0TIFnr2BjW4J8JxGyLM85IK1NqqdXbdvZptevb+J4czfKjEGhlNgpLLwpBB5f34HGg4H7kbOu/dADD1SPnzDx58tXLBfz5s1TBfn5lvQ9l6QUnueSZSHkhBAKheC6LheXlHDRgAHiyRkzXvr7vfd+kYjaTz/99H8bw+oTG8DvQKjxs/MivysK8087e5RIKCjbIgskPGMpwCd7ZN3ZyTfGFmCwUghHHLjKQGnShoiZc3pkIOMWGPgkBUwwEfCyiUgQpC0FbMvL5K4yiCc1+uKmuSel1+xo4/amTladcUAZFERsDJcSKyTjpV6Dp3b27qZhfHAs9C9m3a9/6evHXv7ty263HeekGTNmcHdXNw8oHiCM1hnpYM84LQhgB0ppPXL0KEkgzJgx46bHH3/8R8KjUB4QnwMdqB9cNSBqqgGqhflWuXP+sFJ5q3LN6PZerRxJMpj2GHhG48GL9focg0gkjGheKXZs3txVkEdFsYiDlMvQTBkPHs+y1AOxpC9ZKwkZE8yUCyRdIJHiZFqjJ96v+/vTvKmt22xrjWNrdwJx10WpLTDctsGS0GUJLJI2Gla3Ye07ghYHA/dDI8yCiDQA+eD9918z4cgjr125sjH04osvqPy8PCsai2UMxb3P0rf5lFaAg6jxE8Zbra2tibq6+i+//vrrM3zUmg+Uz4IO9E/xiitgT58Ot3xCdHDFOPpL1DKfbelUUIa1lJDaUAZ5hg9IWRYgQTx84hTkjThixSP3vbBj56amrYcNkVEpEbIsaOHvHvtOGSACUmkglTZIKnTlh/jV1j6kWnrhtHZhq8so0YzRlkDUWzxAyrYAm9BPhDUusDTHuyhznuDgLPejlMv42Y9+VvGZz53/RynllKefeQZbtmw2RYVFQggBaVmwLctz2JAyAKmQTqU5HImYQw87VK5du2bhDb/53dddYMX+OCb6xAfwO0vq754V/kVpAX6VTplQZ1wrIWAFL9VDhDkDQqWTLg85ZByNO/mM+LaW7vu+/6uHvuMF1Idb5ikrQ16oH6MFMNgiJJjQ6jhoWtOO3nd5v4OFg4PZ9sOCmHV18tJLL9W+XcvwZ599tnrokCGXLVm6DHPnNmjbtkUoFCKtlBewQkBIjxbp2DaEEHBdVw8cPEgWFhbg9Tden/73u+/9ERH1HQj97ic2gIMylP2S+rNH28ccPsi6I+KYk7sTmpUBWwIi49gOBhtvjptOpdmyonTKOWciUhjbunTh6h9X37WkHgBWVE9wausbMaHsn4Ntjv/7wAZw/fsHpMjgYgcz7Ufpc9k33Lbq6uq+PnLkyP/t6GgveebZf3BvVxcPKC4WxjdXD8DGwGTOcWwYY9hxHHP4EUfI9ra27pdeeunbM2fOfNi3YBG1tbUH5IFKn7QPO7ByASC+cYrz87J8qo3YRvYkjWKQJCLS2uuL2ZsRQUCjv1frUePGymNOnoxEX/Kpv9703O9ntag3QQL86BckVX2gXQfhn+VqDwbsR/ksPT8i+IGL315//cXTzjrrWgJNfP6F59G4YrkuKCyUntgBskCV7zrpoQqMZCqtBw4eJEeOHIFNmzY9/fvf//5HANbvb7TIgwGcC3AxmAh86ijrpMmjxZ2DB/Ck/hSjLwVtAMnGtyX1pXvCjkCqP22UCeHE8pNE2fDR2Lhmw+PX/Om13/UDC0kI/Ora06za2oaDTKiPJ3DJB6jwsx/+cOpFl1zyMyGt8996+y28OneullKKaDRKRisQvBGRt2rqrQJKKZFMJlmQ0IeNHWORoO1vv/X2T+rq6h4hIvw75G8OBvC/no3zLzxK1oweaH0rL4JoV1xz2oCFZ/CLALCyJMERhP7etM4rHiimnjuNFGx38etL/1b90PLrATSRFPjV/xwM5I+hVMbXvva1Y774xS9em5+X//k1a9dg1qxZJp1KobCoyPPuNMZ3hPQdJoWEZVkwxkBrrYYNG2aVlJZi/fr1z958883fBrD9QEOZ/6MDGMj6FDMDRw3EoSeMcX5Rmk/ftKVBZ79RhiGEpIw3ty0JIVuCdBrxuNHDxo2Xx06div64blnTuPKGn9zx1t8BtJMQeOXa0z4OQflP+kV1dXWisrIyE7jf/OpXT/jKN75xVSgc+eLmzZvsl1+eyZ0dHSa/MF/aUvqcdOHbMzOYGMKHGpRSurCoSI4Zcxi6e3o2v/nmvF89++yz9xMRDlSg6j86gDM3ic+lBoDzxlunjR8ubijOo5N6EgZdCdZEELYQJAUgBftEdyDel+LefqHHHHOcdfpZZyCVSOxaMKfhrp/9fckdAHZ6pJFHZE1NFdfWHkSWP8xnMnv2bHnmmWdmPINra2tPO/20039gO/bntm7dSq/MfgWd7Z06vyBfCiIorT2gwVeGzGXGJZNJ41g2DjlktGBAb9u+7Q/Tp//tjwDa/XnxJxKToP+wmyaz2QTA+tqJoW8MKaXvhyxM6O03SLqsHYuEbYGChQjjEzt6ulMMIc2UqafLk049Dl3dyfbVCxfc9YNb3/xzCtgMeBK29VVVomrv+9N+Yu63yspKUVdXh6C/BRC6++7p5x5//Ilfa2/vunDd+nV48/XX0dXdpfPy8oVtW6SVAcN4UkN+uWxZAlJYSLtpY1kWDx82TIYjUTTv2vX4jLq6321talr4Sep1Dwbwbr0W5OOPQfsOpZHLTov8v6IoX1MYwfBU2gtkJhJETMFGEfw1Qk6lWFq2Hn3k8dbkk06AS+jesX7r44/8bcY9T27EawBAQsLoh/+tErb7GyhVUVEhcrPt8ccfP7jm2mu/OKC09DJjzPhly5bh1bmvcl9frykoLJShUAjGGE9qiL23kH1aLABobYy0JA8ZMkSWlpaivb1t4Vtvzb9u9uzZT/s/c79RzTgYwPvotZeXQ86dC+UvPpRWTbb/Z3ixvGxgIWJ9CkgkjTZe+UXeHjDBtgUcKZCMx7k/KfXQMROsKeWnoLAghva2jtnrFy26++o/L30OQAcASCmhHv68rFlZ/59UYlN1dTVVVFSIiooK7ZevACB+U1tbfsIpp1waCYc/3xePlyxcvBgrly83yUSSY7GYFEQwMP4oiPwAzoozpNNpI6Xk0rJSWVxSjGQiubCxcdVNTz311KMAtD8a+o8hyvwnB3D2ZiuH9NFqhIDDzjva/taIUvHNQUU0IK0Jff1aaYZwLCmE9OmY0uPX9vYmOB43evDIkfLYU06mQydMQF9fX9Om1duff/ap5+5/8K3u1+ALzjEzzZlTIe+4Y59pUe8PYBRJKTOZFgBuvvnmIycfffTnIOiieLz/6J07m7B8+TLs2rVLSykpEokI9nyGcm7MQAaUoI1mpZRxHEcMHTKYBgwYgM6OzoUbNm26qb6+/lEAWgiBL3zhC5/ocvlgAH8IoAvA0C8ea31xcIn8/tBia5gxjO5+1mkNWBYLWwoCAwYEQQJu2kU6mdThaD7GT54sjzzuJDixIvR2dq3e1Lh6xgsPP/3I39dgeaYZlxJaPSzr6+ux8sDMzlRXVyfKysqooqLCBAhy8PJuuummY6ZMmfLpWCx2fk9PzwmtbW20dOlSbFy/nrXWOpaXJx3HIW00jPZVOY0Gw3gbYCSQdtNGa2Ni0ag1YsQwhCMR9Pb2vN7YuOb2J598su4dgfsf2aocDOD3B7oAoOSCidb/O3SQfdmgEnm4bQP9KYN0mjUDJEDCV6eGtCQkGahUgnXa6PzSoeLwY44X4488BoYZ8f6ORU2bNr84+4WXXvjT7OQCAP2ZHyoEtNZyzpwaam2dyJWVlSan9NwvwKerrrqKKioqYFmW8vnImWvIkCGlN/z2tycOHTHiU6Fw+FNgPqKntxeNjauwdu0a9PT0KNu2RDgUEghKY+MFbnAXGsPQWrNyXUNEKC4ZIAcPHop0Op2Ix3ufXr167e3/+Mc/Xg3er//kwD0YwHtYWl+X7ZEjpw6X5x5zmHVxcaE4tyRfFjIbxBNsUmmwISIhhZCCIC0BKSRSqTSS8X4jSJiygcOtsUcfjUMnToITiSIe793ctH3L3E1LVr848/mFi2Zswep/egJEMMbIOQBhzhy0trZyfX09gv1X7B0LleAxqLKyUlRWenYTfmZlKaXOLYd3C9gbbhhTWlp6Vl5etMKy7KOSidTA1vZWbNywCdu3b+NEMqltyyLHcQQRSGsNrTUIDG0MjK+8YAyz0toYwxyLRa3S0hJEYxEkE8nNLS0dj82a9fLd69atWxW0IVVVVaL+INJ/MID3PPtA5KDWiADDzz/a+tKwMuvrI0rFEVGHEE8TehJsDGAsASFICCLyJWUZxk3DTSSMgTD5xUPEyDGHizETxqJ08DAYYauufr2OQ2WvNm7sXxMtHfv6vMXzN91YW9vynk8qMwMlKKWs4N/nzJnzgS+ooqIi+CNblqUDtPe9rrKysrzv/OAHEycdeeThg8vKJvf3xyss2xkB5lLXdbFt2zZs3LQRrS0txmhjQiFHhMJhIaX0lDm1RnAIeCUyoJXiZFobVyk4jiNLBhSiqKgASqn+7u6e5zdt3FxX//jjzwHoA7xNpPr6evyn9bgHA3hvBjIgKiuBnPI6PGUwzph8qHXRwGL7rAH5YoRjCygNpNNsXEXMDGJiIciTnAUBbtqFm0gaGJhwNJ9KBw+To8eNweDRYxEpGIxuU4Q+U9iWUJG2vOLBSxPJVFNvW/PGY44Zu+zee/+uFza8suaF15a07sV7gMeNG5c/ftL4I7/6la8iYkdGpFX6+JHDhw9oaWk9LRqNRtPp9HDbdqCVQld3F1qaW9DV3cXKdTUHa5LGkNYarp9p4SPIRhtoo8CGjWbBJC2EQo7MjzkIWy5UMu7Gk+qt7Tuan3zupYYZzc3Nm4JD6tFHH/2PQpUPBvDHCHhdkpOVARRNG4VTxo4KnVVcZH1uYFHokLwQkHYZ3XENpYxi42vfCSIpJWwpAVZw0yl2Eyk2EMYJhRGOxYSMlYpw0WCEy8b2FQ2b1F0y4oiEpkiJ0WZAJBztieVFunq72imV7O89/PAj5qfcdEfTjh1oaWnjtvZ27k8kwJqJSVPYCSMUCSHshKmkrAylxaUoG1QGo1TRmjVrTisuKeFoJBLt6GwfSiC46TSSySQSiSR6envQ19uLRKLfKNdl23Y4FAqJcCRMlmWR8fWv0+kUtKuQdtNQSnmgnqtYKWNcLZikZRUVxlBSaCEkk+jrau/T8bbZzTs3P/Xm66++8upabAreyJxse7BMPhjAH09Wvvgxj2/tX3knDZdTjxhlV40oc46PhnFkQdiTo02kGW6ajV9ZEgkSlhQQPqrtKoOUq8HasCMZEUcoYYlUKGZtTYv85i4MLIgWH9bRmiicFC0cJCKx4oKSkoFUWJDn5OfnIy8W9uzQJPmaXZ6cLpjhKo10Ko14PI7+eD8SiQRS6RQSiQQSyQSSiaRKJpNwXZelEMZ2HIrFYiISjcC2PFcbKYT3fIW/V+31sB5rzTAbQ4ZJMkkJS7AVcQCJfqjenUCqY1NX05aVrTu2P/lc/doXlgI7MrU8s6ipqQn2cg9m24MBvN8EszWpEEcdMdoqH15mnVNYSMeXFIRKoiEBbQj9KY1UyiCVJu0FABMTyBJEvpwtMTypeseRsByCbYuktKzuvqRCuGDg+mRCtK3vCOXLcEFrR78dJhktIOGwtEIDheUU2XaIhUCMjSkWVmAj4om7ObYN27ERCoVh2542su8WAcuyYNs2QqEQLMtzMQAJGBCT5xXJENIQgcmkJbGmkEzCpHqR6N6JnpZtyVR38/zW5l0vtq/e8MK9q7EaQDy49ZgflTUVtxMaGkztwaA9GMD7YzC/o8wGgNJTR+DkiaPDE4uKrGnRsDyqICJKYw5sSxKUMkilDJJpRloxM3v/3zCxAWBYEJiskG0QiwiEHQFp2SApFRMZGYr0FOSL1u4kcTSWvynhOkjqEDoTUuaXjIiHQ2GkGUhriR1NPYMURUNFJcWJSDgMS4Rgh0IQUjIgYQnAsW0TClmwbOLuzrZB3a07j4BOSDLpFHTK6ER7hBPd6O3tRn9Pb5+b6lvY1tq5qn0Xvzl7F+bAc3YE4AnhG/2IrKm4nWobGg5m2oMBfGC8x9UAoRxi4kDwO7IzABROG42ioYPs0waXWIfnOzg+bPPokI3RloWwJYUnVm8ArQnayMCaBa7WUEpDG05rAwkQWQLCE5K3YFsCwpKwbQckAdsWCUEaQgqwdOAym/yovTPqmBTAZFk2WyFJgqWlFAujFZSiCEuyWLvoiqcHxHsToURfItnekWI3rVZ09WJHKoGXtzdjxeo2rG0Fdnkvy1MCZKNETU2FQG2DqT2oUnIwgD8p2XlCOWji1eCLL/6ngAaAUPkoDCgqwdhBhfaYo0ZJs6PdnDGogEoHxAS39fIJ0bAdkzazMWQzG0f6tXawPcXGQBvPCTGtDJhNxiDd17P292k1lPYM1zQLuJqRSjNSLnNPwkAQrdBatrX3qa6IzS9va0NrIh2Zt2IHqX4kdr3ziXP1r0R9Yy3d3gJqaMDBLHswgP8zMvSccogKAO8T1LlXSeVJCJ9zWgn39nHh4sb+KUOKIQbm2ygqkGCmaHOnGt3Xp4a6motcxVBM0NoT80sbQLmAMmiPhmiZBLf2JIF4UqOjF0ZpWtyectrW7+oDgNZ/vl28JycIeOQiyJUtoEZP3O8ganwwgA9eAXBVVQkxocX7jCZeDUa998WcOfS+fyIEPHoRJACsbAHNAVDRgIPl8MEAPnh91AAPwqemwgswVAAV7/LNcz7wH3b/55wAxcEg3b+v/w8g1dl40V2n+wAAAABJRU5ErkJggg==";
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
  const demoRef = useRef(null);

  // Connexion à une vraie base de données (Supabase)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [agent, setAgent] = useState(null);
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
      pin: data.pin_hash,
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
  const DEMO_RECOVERY_CODE = "852741";

  function maskEmail(email) {
    const [user, domain] = email.split("@");
    if (!domain) return email;
    const visible = user.slice(0, 2);
    return `${visible}${"*".repeat(Math.max(user.length - 2, 2))}@${domain}`;
  }

  function handleRecoveryRequestCode(e) {
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
    setRecoveryStep(2);
  }

  function handleRecoveryVerifyCode(e) {
    e.preventDefault();
    if (recoveryCode !== DEMO_RECOVERY_CODE) {
      setRecoveryError("Code incorrect. Réessaie.");
      return;
    }
    setRecoveryError("");
    setRecoveryStep(3);
  }

  function handleRecoveryReset(e) {
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
  const [selectedAdPreview, setSelectedAdPreview] = useState(null);
  const [adsLoading, setAdsLoading] = useState(false);
  const [myAds, setMyAds] = useState([]);
  const [adForm, setAdForm] = useState({ title: "", description: "", contactPhone: "", planIndex: 0 });
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

  async function loadActiveAds() {
    setAdsLoading(true);
    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .eq("status", "active")
      .gt("ends_at", new Date().toISOString())
      .order("created_at", { ascending: false });
    setAdsLoading(false);
    if (!error) setActiveAds(data || []);
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
    loadActiveAds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab === "publicites" && agent) {
      loadActiveAds();
      loadMyAds();
    }
    if (tab === "backoffice-pub" && agent?.isPlatformOwner) {
      loadAllAdsForBackoffice();
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

  async function handleSubmitAd(e) {
    e.preventDefault();
    setAdFormError("");
    setAdSuccessMsg("");
    if (!adForm.title.trim() || !adForm.description.trim() || !adForm.contactPhone.trim()) {
      setAdFormError("Merci de remplir tous les champs.");
      return;
    }
    const plan = AD_PRICING[adForm.planIndex];
    const isFree = !!agent?.isPlatformOwner;
    const amountToCharge = isFree ? 0 : plan.price;
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
    const endsAt = new Date(now.getTime() + plan.days * 24 * 60 * 60 * 1000);
    const { error } = await supabase.from("ads").insert({
      created_by: agent.id,
      agency_id: agent.agencyId,
      agency_name: agent.agency,
      title: adForm.title.trim(),
      description: adForm.description.trim(),
      contact_phone: adForm.contactPhone.trim(),
      image_url: imageUrl,
      duration_days: plan.days,
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
        ? `Publicité publiée gratuitement et en ligne pour ${plan.days} jours ✅`
        : `Publicité payée (${formatFCFA(plan.price)}) et en ligne pour ${plan.days} jours ✅`
    );
    if (!isFree) setAdSpend((s) => s + plan.price);
    setAdImageFile(null);
    setAdImagePreview("");
    setAdForm({ title: "", description: "", contactPhone: "", planIndex: 0 });
    pushNotification("Publicité publiée avec succès 📣");
    loadActiveAds();
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
  }

  async function handleSignup(e) {
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

    setAuthLoading(true);
    setAuthError("");

    const { data, error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
    });
    if (error) {
      setAuthLoading(false);
      const waitMatch = error.message.match(/after (\d+) seconds?/i);
      if (waitMatch) {
        setSignupCooldown(parseInt(waitMatch[1], 10));
        setAuthError("");
      } else {
        setAuthError(error.message);
      }
      return;
    }
    const userId = data.user?.id;
    if (!userId) {
      setAuthLoading(false);
      setAuthError("Compte créé — vérifie ta boîte Gmail pour confirmer ton adresse, puis connecte-toi.");
      setAuthMode("login");
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

    const { error: insertErr } = await supabase.from("agents").insert({
      id: userId,
      full_name: signupName,
      phone: fullPhone,
      email: signupEmail,
      agency_id: agencyId,
      agency_name: agencyName,
      role: signupRole,
      pin_hash: signupPin,
      kyc_email_verified: false,
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
      pin: signupPin,
      role: signupRole,
      kycEmailVerified: false,
      kycStatus: "incomplete",
      agencyCode: agencyCodeForAgent,
    });
    setIsAuthenticated(true);
    setAuthError("");
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

  // Suivi impressions/clics des publicités actives — s'appuie sur activeAds déjà chargé par loadActiveAds()
  const countedImpressionsRef = useRef(new Set());
  useEffect(() => {
    if (activeAds.length === 0) return;
    activeAds.forEach((ad) => {
      if (!countedImpressionsRef.current.has(ad.id)) {
        countedImpressionsRef.current.add(ad.id);
        supabase.rpc("increment_ad_impression", { ad_id_input: ad.id }).then(() => {});
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAds]);

  function handleAdClick(adId) {
    supabase.rpc("increment_ad_click", { ad_id_input: adId }).then(() => {});
  }

  // Paramètres du compte : changer PIN / mot de passe
  const [currentPinInput, setCurrentPinInput] = useState("");
  const [newPinInput, setNewPinInput] = useState("");
  const [confirmPinInput, setConfirmPinInput] = useState("");
  const [pinChangeMsg, setPinChangeMsg] = useState({ type: "", text: "" });
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [passwordChangeMsg, setPasswordChangeMsg] = useState({ type: "", text: "" });

  async function handleChangePin(e) {
    e.preventDefault();
    if (currentPinInput !== (agent?.pin || DEMO_PIN)) {
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
    const { error } = await supabase.from("agents").update({ pin_hash: newPinInput }).eq("id", agent.id);
    if (error) {
      setPinChangeMsg({ type: "error", text: "Erreur : " + error.message });
      return;
    }
    setAgent((a) => ({ ...a, pin: newPinInput }));
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
      pushNotification(`Transaction confirmée — Ticket #${String(completed.id).padStart(5, "0")} (${formatFCFA(completed.amount)})`);
      // Enregistrement réel dans Supabase — visible en temps réel par le chef d'agence
      if (agent?.id) {
        await supabase.from("transactions").insert({
          agent_id: agent.id,
          agency_id: agent.agencyId,
          ticket_id: completed.id,
          net: completed.net,
          amount: completed.amount,
          phone: completed.phone,
          direction: completed.direction,
          status: "Terminé",
        });
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
    if (pinInput !== (agent?.pin || DEMO_PIN)) {
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
          }
        });
      }
    });
  }, []);

  function scrollToDemo() {
    demoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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

      {/* ===== Header ===== */}
      <header
        style={{ borderBottom: `1px solid ${COLORS.surfaceLine}` }}
        className="sticky top-0 z-20 backdrop-blur"
      >
        <div style={{ background: COLORS.headerBg }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2.5">
              <img
                src={LOGO_DATA_URI}
                alt="EmpireGuichet"
                style={{ height: 40, width: "auto", flexShrink: 0, objectFit: "contain" }}
              />
              <div className="leading-tight">
                <div className="gc-display text-lg font-semibold tracking-tight">EmpireGuichet</div>
                <div className="text-[10px]" style={{ color: COLORS.textMuted }}>par Empire Digital CI</div>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-7 text-sm" style={{ color: COLORS.textMuted }}>
              <a href="#reseaux" className="hover:text-white">Réseaux</a>
              <a href="#demo" className="hover:text-white" onClick={scrollToDemo}>Démo</a>
              <a href="#annonceurs" className="hover:text-white">Annonceurs</a>
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
              <a href="#annonceurs" onClick={() => setMenuOpen(false)}>Annonceurs</a>
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
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder="07 XX XX XX XX"
                      type="tel"
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
                <form onSubmit={handleSignup} className="max-w-sm">
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
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="07 XX XX XX XX"
                      type="tel"
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
                    disabled={authLoading || signupCooldown > 0}
                    className="gc-btn w-full py-3 rounded-lg text-sm font-medium disabled:opacity-50"
                    style={{ background: COLORS.gold, color: "#052E36" }}
                  >
                    {signupCooldown > 0
                      ? `Réessaie dans ${signupCooldown}s`
                      : authLoading
                      ? "Création du compte…"
                      : "Créer mon compte agent"}
                  </button>
                </form>
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
                          onChange={(e) => setRecoveryPhone(e.target.value)}
                          placeholder="07 XX XX XX XX"
                          type="tel"
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
                        className="gc-btn w-full py-3 rounded-lg text-sm font-medium"
                        style={{ background: COLORS.gold, color: "#052E36" }}
                      >
                        Envoyer le code
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
                      <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>Code démo : {DEMO_RECOVERY_CODE}</p>
                      {recoveryError && <p className="text-xs mb-4" style={{ color: COLORS.danger }}>{recoveryError}</p>}
                      <button
                        type="submit"
                        className="gc-btn w-full py-3 rounded-lg text-sm font-medium"
                        style={{ background: COLORS.gold, color: "#052E36" }}
                      >
                        Vérifier le code
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
                        className="gc-btn w-full py-3 rounded-lg text-sm font-medium"
                        style={{ background: COLORS.gold, color: "#052E36" }}
                      >
                        Réinitialiser le mot de passe
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
            { id: "publicites", label: "Publicités", icon: Megaphone },
            { id: "parrainage", label: "Parrainage", icon: Users },
            ...(agent?.role === "manager" ? [{ id: "equipe", label: "Équipe", icon: Crown }, { id: "kyc-review", label: "Vérifications KYC", icon: Fingerprint }] : []),
            ...(agent?.isPlatformOwner ? [{ id: "kyc-review-managers", label: "Vérif. chefs d'agence", icon: ShieldCheck }, { id: "backoffice-pub", label: "Backoffice publicité", icon: BarChart3 }] : []),
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

        {/* Transaction tab */}
        {tab === "dashboard" && (
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

            {activeAds.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-medium mb-3" style={{ color: COLORS.textMuted }}>PUBLICITÉS SUR LA PLATEFORME</div>
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

        {tab === "transaction" && !kycVerified && (
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

        {tab === "transaction" && kycVerified && (
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
                onChange={(e) => setPhone(e.target.value)}
                placeholder={NETWORK_TYPE_LABELS[net.type].placeholder}
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
        {tab === "historique" && (
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
            <div className="mb-8">
              <div className="text-xs font-medium mb-3" style={{ color: COLORS.textMuted }}>ANNONCES EN LIGNE</div>
              {adsLoading ? (
                <div className="text-xs" style={{ color: COLORS.textMuted }}>Chargement…</div>
              ) : activeAds.length === 0 ? (
                <div className="p-5 rounded-xl text-xs" style={{ background: COLORS.surface, border: `1px dashed ${COLORS.surfaceLine}`, color: COLORS.textMuted }}>
                  Aucune publicité en ligne pour le moment.
                </div>
              ) : (
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
              )}
            </div>

            {/* Publier une pub */}
            <div className="p-5 rounded-xl mb-6" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
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
              <form onSubmit={handleSubmitAd} className="flex flex-col gap-3">
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
                <input
                  value={adForm.contactPhone}
                  onChange={(e) => setAdForm((f) => ({ ...f, contactPhone: e.target.value }))}
                  placeholder="Numéro de contact"
                  className="px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: COLORS.bgSoft, border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.text }}
                />
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
            {myAds.length > 0 && (
              <div>
                <div className="text-xs font-medium mb-3" style={{ color: COLORS.textMuted }}>MES PUBLICITÉS</div>
                <div className="flex flex-col gap-2">
                  {myAds.map((ad) => {
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
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {(() => {
                    const totalImpressions = allAds.reduce((s, a) => s + (a.impressions || 0), 0);
                    const totalClicks = allAds.reduce((s, a) => s + (a.clicks || 0), 0);
                    const totalRevenue = allAds.reduce((s, a) => s + (a.amount_paid || 0), 0);
                    const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : "0.0";
                    return [
                      { label: "Impressions ce mois", value: totalImpressions.toLocaleString("fr-FR") },
                      { label: "Taux de clic moyen", value: `${ctr} %` },
                      { label: "Revenu publicitaire", value: formatFCFA(totalRevenue) },
                    ];
                  })().map((s) => (
                    <div key={s.label} className="p-5 rounded-xl" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
                      <div className="text-xs mb-1.5" style={{ color: COLORS.textMuted }}>{s.label}</div>
                      <div className="gc-display text-2xl font-semibold gc-mono">{s.value}</div>
                    </div>
                  ))}
                </div>

                <div className="text-xs font-medium mb-3" style={{ color: COLORS.textMuted }}>TOUTES LES PUBLICITÉS ({allAds.length})</div>
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${COLORS.surfaceLine}` }}>
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ background: COLORS.bgSoft, color: COLORS.textMuted }}>
                        <th className="text-left px-3 py-2.5">Titre</th>
                        <th className="text-left px-3 py-2.5">Agence</th>
                        <th className="text-left px-3 py-2.5">Montant</th>
                        <th className="text-left px-3 py-2.5">Statut</th>
                        <th className="text-left px-3 py-2.5">Expire</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allAds.map((ad) => {
                        const isActive = ad.status === "active" && new Date(ad.ends_at) > new Date();
                        return (
                          <tr key={ad.id} style={{ borderTop: `1px solid ${COLORS.surfaceLine}` }}>
                            <td className="px-3 py-2.5">{ad.title}</td>
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
      {activeAds.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 pb-14">
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
          {activeAds.map((ad) => (
            <div
              key={ad.id}
              onClick={() => setSelectedAdPreview(ad)}
              className="rounded-xl overflow-hidden cursor-pointer"
              style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
            >
              {ad.image_url ? (
                <div className="w-full flex items-center justify-center" style={{ height: 160, background: COLORS.bgSoft }}>
                  <img src={ad.image_url} alt={ad.title} className="w-full h-full object-contain" />
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
                  onClick={(e) => { e.stopPropagation(); handleAdClick(ad.id); }}
                  className="gc-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium w-fit"
                  style={{ background: COLORS.gold, color: "#052E36" }}
                >
                  <Phone size={12} /> {ad.contact_phone}
                </button>
              </div>
            </div>
          ))}
          </div>
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
            ) : (
              <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>Code démo : {agent?.pin || DEMO_PIN}</p>
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
                onClick={() => handleAdClick(selectedAdPreview.id)}
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
          style={{ background: COLORS.gold, color: "#052E36", boxShadow: "0 10px 30px -10px rgba(232,169,59,0.6)" }}
        >
          {supportOpen ? <X size={22} /> : <MessageCircle size={22} />}
        </button>
      </div>
    </div>
  );
}
