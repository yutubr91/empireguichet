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
const LOGO_DATA_URI = "data:image/png;base64,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";
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

const TEAM_ROSTER = [
  { name: "Awa Koné", agency: "Agence Marcory", transactions: 18, volume: 612000, status: "actif" },
  { name: "Ibrahim Traoré", agency: "Agence Yopougon", transactions: 12, volume: 398000, status: "actif" },
  { name: "Fatou Diabaté", agency: "Agence Cocody", transactions: 21, volume: 745000, status: "actif" },
  { name: "Yao Kouassi", agency: "Agence Adjamé", transactions: 6, volume: 154000, status: "inactif" },
  { name: "Mariam Sylla", agency: "Agence Treichville", transactions: 15, volume: 501000, status: "actif" },
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
  const [ticketCounter, setTicketCounter] = useState(4);
  const [history, setHistory] = useState([
    { id: 3, net: "wave", amount: 15000, phone: "07 XX XX 12 34", status: "Terminé", time: "Hier, 18:42", direction: "retrait" },
    { id: 2, net: "mtn", amount: 32000, phone: "05 XX XX 88 10", status: "Terminé", time: "Hier, 14:05", direction: "depot" },
    { id: 1, net: "orange", amount: 8000, phone: "07 XX XX 40 21", status: "Terminé", time: "Lun, 09:12", direction: "depot" },
  ]);
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

  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => {
      const completed = { ...pending, status: "Terminé" };
      setHistory((h) => [completed, ...h]);
      setLastReceipt(completed);
      setPending(null);
      pushNotification(`Transaction confirmée — Ticket #${String(completed.id).padStart(5, "0")} (${formatFCFA(completed.amount)})`);
    }, 1400);
    return () => clearTimeout(t);
  }, [pending]);

  const net = NETWORKS.find((n) => n.id === selectedNetwork);
  const amtNum = parseFloat(amount) || 0;
  const fee = amtNum * net.fee;
  const total = amtNum + fee;

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
          <div className="mb-8 max-w-3xl">
            <div className="text-xs font-medium mb-3" style={{ color: COLORS.textMuted }}>ANNONCES SUR LA PLATEFORME</div>
            <div className="grid md:grid-cols-2 gap-3">
              {activeAds.map((ad) => (
                <div
                  key={ad.id}
                  onClick={() => setSelectedAdPreview(ad)}
                  className="rounded-xl overflow-hidden cursor-pointer"
                  style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
                >
                  {ad.image_url && (
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="w-full object-cover"
                      style={{ height: 140, objectPosition: "center" }}
                    />
                  )}
                  <div className="p-4 flex items-start gap-3">
                    {!ad.image_url && (
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: COLORS.surfaceLine }}>
                        <Megaphone size={18} style={{ color: COLORS.goldSoft }} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{ad.title}</div>
                      <p className="text-xs mt-0.5" style={{ color: COLORS.textMuted }}>{ad.description}</p>
                      <div className="text-xs mt-2 flex items-center gap-1" style={{ color: COLORS.gold }}>
                        <Phone size={11} /> {ad.contact_phone}
                      </div>
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
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {activeAds.map((ad) => (
                    <div
                      key={ad.id}
                      onClick={() => setSelectedAdPreview(ad)}
                      className="rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                      style={{ width: 240, background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
                    >
                      {ad.image_url && (
                        <img src={ad.image_url} alt={ad.title} className="w-full object-cover" style={{ height: 100, objectPosition: "center" }} />
                      )}
                      <div className="p-3">
                        <div className="text-sm font-medium">{ad.title}</div>
                        <p className="text-xs mt-0.5 line-clamp-2" style={{ color: COLORS.textMuted }}>{ad.description}</p>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleAdClick(ad.id); }}
                          className="text-xs mt-2 flex items-center gap-1"
                          style={{ color: COLORS.gold }}
                        >
                          <Phone size={11} /> {ad.contact_phone}
                        </button>
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
                <>
                  {/* Grande bannière — la publicité mise en avant */}
                  <div
                    onClick={() => setSelectedAdPreview(activeAds[0])}
                    className="rounded-xl overflow-hidden cursor-pointer mb-3"
                    style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
                  >
                    {activeAds[0].image_url && (
                      <img
                        src={activeAds[0].image_url}
                        alt={activeAds[0].title}
                        className="w-full"
                        style={{ display: "block", maxHeight: 380, objectFit: "contain", background: COLORS.bgSoft }}
                      />
                    )}
                    <div className="p-5">
                      <div className="text-base font-semibold mb-1">{activeAds[0].title}</div>
                      <p className="text-sm mb-2" style={{ color: COLORS.textMuted }}>{activeAds[0].description}</p>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleAdClick(activeAds[0].id); }}
                        className="text-sm flex items-center gap-1.5"
                        style={{ color: COLORS.gold }}
                      >
                        <Phone size={13} /> {activeAds[0].contact_phone}
                      </button>
                    </div>
                  </div>

                  {/* Liste compacte des autres publicités */}
                  {activeAds.length > 1 && (
                    <div className="grid gap-2">
                      {activeAds.slice(1).map((ad) => (
                        <div
                          key={ad.id}
                          onClick={() => setSelectedAdPreview(ad)}
                          className="rounded-lg overflow-hidden cursor-pointer flex items-center gap-3 p-2.5"
                          style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
                        >
                          {ad.image_url ? (
                            <img
                              src={ad.image_url}
                              alt={ad.title}
                              className="rounded-md flex-shrink-0"
                              style={{ width: 56, height: 56, objectFit: "cover" }}
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: COLORS.surfaceLine }}>
                              <Megaphone size={16} style={{ color: COLORS.goldSoft }} />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium truncate">{ad.title}</div>
                            <p className="text-xs truncate" style={{ color: COLORS.textMuted }}>{ad.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleAdClick(ad.id); }}
                            className="text-xs flex items-center gap-1 flex-shrink-0"
                            style={{ color: COLORS.gold }}
                          >
                            <Phone size={11} /> {ad.contact_phone}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
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
                <div className="text-xs mb-1" style={{ color: COLORS.textMuted }}>Connaissances invitées (simulé)</div>
                <div className="gc-display gc-mono text-xl font-semibold" style={{ color: COLORS.teal }}>4</div>
              </div>
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
                { label: "Agents dans l'équipe", value: TEAM_ROSTER.length },
                { label: "Agents actifs", value: TEAM_ROSTER.filter((a) => a.status === "actif").length },
                { label: "Transactions équipe (jour)", value: TEAM_ROSTER.reduce((s, a) => s + a.transactions, 0) },
                { label: "Volume équipe (jour)", value: formatFCFA(TEAM_ROSTER.reduce((s, a) => s + a.volume, 0)) },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-xl" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
                  <div className="text-xs mb-1.5" style={{ color: COLORS.textMuted }}>{s.label}</div>
                  <div className="gc-display gc-mono text-lg md:text-xl font-semibold">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-xl mb-4" style={{ background: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
              <div className="text-sm font-medium mb-4">Volume par agent — aujourd'hui</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={TEAM_ROSTER.map((a) => ({ name: a.name.split(" ")[0], volume: a.volume }))}>
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
                  <Bar dataKey="volume" radius={[6, 6, 0, 0]} fill={COLORS.gold} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${COLORS.surfaceLine}` }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: COLORS.surface, color: COLORS.textMuted }}>
                    <th className="text-left font-normal px-4 py-3">Agent</th>
                    <th className="text-left font-normal px-4 py-3">Agence</th>
                    <th className="text-right font-normal px-4 py-3">Transactions</th>
                    <th className="text-right font-normal px-4 py-3">Volume</th>
                    <th className="text-left font-normal px-4 py-3">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {TEAM_ROSTER.map((a) => (
                    <tr key={a.name} style={{ borderTop: `1px solid ${COLORS.surfaceLine}` }}>
                      <td className="px-4 py-3">{a.name}</td>
                      <td className="px-4 py-3" style={{ color: COLORS.textMuted }}>{a.agency}</td>
                      <td className="px-4 py-3 text-right gc-mono">{a.transactions}</td>
                      <td className="px-4 py-3 text-right gc-mono">{formatFCFA(a.volume)}</td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md"
                          style={
                            a.status === "actif"
                              ? { background: "rgba(43,191,138,0.12)", color: COLORS.teal }
                              : { background: "rgba(226,104,94,0.12)", color: COLORS.danger }
                          }
                        >
                          {a.status === "actif" ? "Actif" : "Inactif"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs mt-3" style={{ color: COLORS.textMuted }}>
              Données d'équipe simulées à titre de démonstration.
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
