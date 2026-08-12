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
