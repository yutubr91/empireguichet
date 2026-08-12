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
const LOGO_DATA_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAACFCAYAAAAw25a+AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGYktHRAD/AP8A/6C9p5MAAAAHdElNRQfqCAwSMyGmDWRNAAB9uklEQVR42q29d5wlR3Uv/j3V3ffeCTu7s0la7Uq7ykIoIgmEQEggJGFExhiwwdgYbHB4DmDs54QB83gOz49sk4xtkAAJMElEIRCSQAKU06602px3J8+N3V3n90d1dYWuvjP4/e7nM+F2qHDq5HPqFIlIgBgAEQgACABDfYgAZvXX+lSfs/53HvCuMSof3TSzeYTsG+WHq206bai3md2hOyOh8Pu6bfc2OfcJFBq+8ziB8N/92HCw58TMZhm8ETuA8/rmoiF3Cf/74wsuHuurxT8lAP1n7etUjq36LJVtMUHhZbjncD8WirB3i4iKazWtOQC2xssuTrLfsPV9GH7o9wRspPSJqKYptv4Wy+o9QdX/vPkQKSCoqwrZnTWrfMhpz/nL1T4cxCUKNkyB9kJIScX7dWOjYcRWztN9vnyPyIJD4Luelwc8shupGbNuh2gYoQ1lIwFoFQvl9OnDl7wftz+yYEl2m2wohthc1ks4dEyK45VISeSvCIOIK2Mp/5LdnteF32NoqvWvOERJkRBOCy4vqs60lEIF69REYhgteZIqwG0C7QZEpCcUXU5AVBlpOZ66foaNS19zJFlJSD4X4sr/Tl8WXIZLFV7ifvGMrXF4C1khFz0HDhOSq8AQGLwMSTJ8bA50Auu97DYKUaykupF2NuiHtc2sNBFUCMsgaPD9gBan2tIwZ7cdM/LyewhD/HkyAxRFkdPmchCFbMhW1DAXiYLapt3PEuprbevBMYZ60t/IFYfszpWCnQyflwMCZzxBNSE4lxCMKnAK/DVrXyxkAG6lWgmfZpehWtrEXDIQqn1WdWLBmJdLwC4UKgRR4oR5jodQnSYUB7/IqOa6y2Gw1w8ZuFpExt47IYIbQtgUR5G54Ekq63It0TiPWjqhv64lolQ4ov0QO+/XIaH7JSR1Qs+a55w1tG3X6pvOAhg7z4xOa0EhlbJ+MeufC0ruCgdYHvLZNlOdWltBIK+PsvlSt6uflAWV6lCxHCTXYwpiawUGvo3OgTaCyxoguAoRBbhbHWHq5+phacEoKghOq4jOaniT9Zn4MGlYpUEX4RF8Nywdw8QzXAWtArqqGrtz9Q3/AGBLdVa1EELkSidcf7nyd0mit8dSPLdMo92ZrgfUMM0uT0r5zdU+b2HjcCeIzUSGqdyu1BmO6cPhFR47exNTqioP64PdLlytuGAApUrpgDAAWOshRzwP9Ry6M/EdWVwnGey2a7xwFeIM2WRWY1W1yjxVXauQRHGJbTn2F4Ww2yaxAGe0Vdzlm0KmD/YwusoPqmOx1bBq01U7vaJ5kLZnhg2xIvuWmAovS2LY6kqtxHNwyLOJHXs7NEeu0J63ioEJOK+6sDISzl+MOiS14Fc8UMflXakZAiqFbwXbc50jtipod+E0rVXGoLkZkKRLGPzLl0DLs5VKxhXQFmzbQdsSvqoVHq9nbyxLVfYhMQQOFvuuODcC47FxaChh1zIwrplj1SAbTsw+iVR1TA62jyry1PZXNQP8EIghuAKINpCCS+RxgqFODgpwlCU+wxC1brG0PDCGshL/5T0LWYcxFqpSPhxMGjpX1RJbv5f/cZGgHq4W8v1iIvC/8eGhzOf/7b0Aqg55Z0k7lauoDizNQP0B1DMCwOfsQ1VLj1gdluZLuAqxhZhCiCOjyiuHN1L9LE3AHpyp1jJzx8BLt2sY9y9CKMt/3szNRUjyYOQoBCG1wnreDorXw8uCvecEgCdFl/Oxkd83+ysxYbBhhnXtl0MwjI3LuVKw72FSsqqel7eWMBvM+8P78J5bwi517VFA6MZta0p35ujlnsOsDKqiSk7lNNj/p6pC2nA3bnt2rzvfqGyR3EfVIvneqULC1YGktD9QT5Pk/U+B63WfMshrEYoKpNvD0mqDgRWXi8Xqrx1HYrOQIY3dBYdGLG/UZH0fYhbUzceO4pgsDh9uZl5LwZCsda1OyCw0Be8hsO4ubDUBUuhd62tFSvow9VycvAzHkj0FFRbQqqRFrr7mMswb6QyuVpi5NlPIfg0+V/vFFrOmQ9tZUid167hy7RjqbFHHaWMhTBk0DcOsuhJmmTWBhD24pl9DSPXLXR2D/Y6nywS9nUupxhrZCSGFzEVey0HjrYHT/RDnCi8phqsOqcqImLXx4cHBvl/fvo8vSzp2fJUyjuPwYg3REX0krBPfIe9nmQlQUUtdCA1z2FT5ENx3HeeDPZ6lkMeen3+5xq6svaeXdahFHH6vRuJUZu3AvyD4gMoXiu05zwWg6T+/9HjDDpNqu64zgWrVWovxV9TLpezEegeM2w976+s7T8w8NKRrQyjDnFJsNBZhN2r/lA+VkCP3QVvtK9kUVXRbG/RalXLfs1UbLmV0lfyqgPNG7AKJwt99dSYk1dh+shxjjdVQajRanWWDTFqlq7zqXvAZUx1j0GtBumOqPm+rfI7Ed+bIzrO+Zu6MpXIlMH4giIhaloRaIGsslsZcmW/VlnU1DWct7T6ClOGrvuTgdp16aLOmsGo8jCmRIzgcCRdWgzzUJw84ASPcWA0UsGADBnwYzGV/+rKrutZPsiLhlgRKzbsVgFfHF4YdV1Sm5Us4/8NhWC3hNVWPLBGYt56r4ymupmFJJg82fohjKXi592sItsZBY6uCQdU0mMDhjcqZssvkfb3JdRNw7b1hc9S2tyj/K2cVAnl1oBXr1BJpDrpW4O1LjmUsTvBy1Ug2GeKuOrk0VOyHlkJQqr9sSfRyl4L+vtQQhgzNxiFrsku+ShRACUJA+pt191el1vtm3ysTIXwmt5y5a3yoYFpQSzHrq21de3cFWQ8GbSJ3jCEtiFy9ydVy2dmFUAcbV3Ny2xZuz7abRoM0oP7oBfKJLqTekX1/2KdG+SilI8F4/KjylsFt657nmlqG+e9cWRatBuaqPXd+r79YyMEwQXeryfBRUYkwIceLr/65EkQtq8F8R/22x04OWH2uh5Lh1MI2BDpyJGkxAzN3ix+6RMdDWw0SXSmWwyAHVd5wgafVdu9WvfFhKZ+OSmkbj153jtntqEkFoQ3bqGo96wC27CngXlh2fMvlju6ihcE+bHnq+q140yowqz4LeCqYBy59Y+h2mmC/NWqtC0D3eU9lWhomdRLfqIBmTsU2H/I9ia7aF4K3zTCDcyy9fDo+Z1Rb14Cx3+Rlcsqlg/TD1G0NCPbu1z7ODEqSuGpjVV2MpjELmUIN15tqYeKtegdd/lW3QObR6l60Oq+ibW46TyxB3Lr9sEubat+pjtU8b++3Gubu1mph1X6BNxaH2sIfN6q+DDd7YD7evrIQc0GApQaHQVXyDzMW5YiqpKoNyQ75RTNMhgawh4YKgFDKXWi+gPZSOjIbqIoL+48Rj0OtHj/K6MV5gp6fJdQQtn7bgXdn/EHb0JuOHaOjut6sIRXPVE2iKhOpStoq0O1GXPd4/SiCAVu2wawlAoy3d+ia/ELKsq1bVtzqJsBuP0yBl+FYLeZejTniaVvk67BkbDi/zWqQO/RhR0VlqnlmGaDR/fnL5DNKI+HKeYRUCFpSGrhEE5KWy/Hu1YC65KjaUHZ7XRZ3t9t29GOv7xp9wCWIpR0sy1FjK4F3+53iSylFLdewkTZKfSoRxgK1UVKqElV/HzaWus9QaWyBtOqptOHltVEMtn4fnJnT8MGpXzZr9xHeSbgOzgBVSb1k35aaPRSOrGqaBGzoyiDMv1WL05UW3rsUImC/+SriqjWg0oPmOiAsI9TjekuRnGuAU/09WFyrMoeif/ZeqJ+ldZULjmjG72SpeA2w1wcRkEujXpHFyk2dE7PwShXzdWhb8oZUudAMFLsunQNkObGK9mzMqAhkrjZd+uVoGCFXJV/tGheP+tCsYoYvUQ0jKBlTtcEhnzobvvoRXHnSGPmlqISNW2FpQkP/c9UN40lDLdKWCKE5FpGDnOpSPSjdj+240AD0gR22D5eCsxP3qXvMYQqe9GeDyHbfFRWFAEGEXDLWTo7w2EgCGdwA6PZbt/h+snZJRLUNkuExnlpqFysqBbK/mGVzxhDTHuehW6Lc7ivrZM2onJeNwb6FYYdAgvOkMHaX9OCtkQ3PEp/DhiAAmEyTygAqA9UXq65k8xpVkL8egBaieyLW9TB6RAZUCM+HWYVwyHOsVHmYsyDhMgfhjx+mCH68AK4RC2z9aLwMaQBqLCIC2u0+XnnV6XjqGRu42xtAiFCHLve2M0+048OWTG6oh4ZMx8+C0f24hE8Ixd4o8NfXUqqw9QnXZkQVlh9IV7MJL4R7lXhZcDzsGmrBsap7tvJU1b3IIrgQcfnUSmxJORvCw3mPw5scTmfbGmH7zAWbO8YSd5dQ7gkuoHymUGeyL8+vMNyOszmsVgEFAUIQIhEhiiJEUYw4ihAJgSgSAemqGpESEJThpVedhYuf9lTkWQpBolai++87G0DZRQT9nrtvsGZeQ/mLmeyS6n3ZLXuxS8sWKrdHVLtx3HBsMS2fUO2YiA+poNnoeyXJXC9z+er8UmTuW6uh1dzYByBBj931KlqagHpAVEjAPLvEYvixuCo0bOKjoKufbYTRg7afGKISVtau7tnCtvDV2Goh0/C7himKEna5ZKS5RJrmyDLpqqSCEAmBZiNGHFcdRf1BjuNXN3DeWatxSJ4M4CYP+8MuC3VHq1zeLnMPED5T0+/Y869CsYa0yKz00FicDf9yDLbdqcWF8QZVvKLkYhRqNYWlPgo4tuFkHFlqPmzDruAMtgfdasZZGQCIg0Fse6L2VpMKnjk910zAXVb2V1mrou7Ku++XYsxrC4Yx1Ad93aGHAsn1aYn2uOqQ2eur4NSRUEgySHP0ej3kmQQJgbGRBOsnR3n9upVYt3YME6tGkcQx0lQiHfQxP7+IJ3ZM4+h0h4QAmAmARCQIgxy45KwJHosX8IxnXIINayew0MuVWuloHjUKXbm0VGzercI0tH5L6S/Bt0LpXpbkcL15ARUueI9suqwmIteN0KhRIGunivNWeYEraO6Pw8ZGcIjxcM0VQuxKL7s4AJkbVhq1GZflkC5xMYS5LiG70gIuHvsLFJCg8EboALqG8F2U8uxQ01l43B4+VvwU1ti1OtgfZJhfTAEGjls7jkvPP5GfccFJePp5G3D26euwbrKBnBnT0x3s3n8EB/ZPYerQURw8OIcD6GAfesiZERl2gkIxxrWXrEXaWcBJ56zHpZecxV/73n00PtYqN6sGoFJBmBAS1X+MdCFL4obgaExxNg4EW/LYEqKOekNB5hAtBYVJnXSzVeYwbrCWVFxPusNrshj80LV8QoIq9ivVugioic6ocKGYV2mI10HEIRDrXZvIyMdsePgQsLQcGlwCeYYR45DslOHSu5BmESGXEnMLPYAZWzZO8nMuPhHPffomXH7xiTjltLVAInBs9z7cc/99+OL9e7H1sUPYu28es/NAb6CG0JXAYgbkSYI4bkGyhJayvYHEupURrrz0RHTzFkaSJq59/tPwX9/6KYQYgZSeY8YhDns9qowrgDYYToxazVYdaa2l1PpsNatUUIZgst0nGZWulETLILZ68neZZogk2Xutzgu6DHdBNYeUXUjGhYVgPRyyLL21QrgAeCkNPdbv2lXBBp3/zWPsQrTsxtYnbH9sPZIozmOIVu9RHk5PQwgNjCgWSDOJ+cUBVo41cd0Vp/GvXHsmnnvRemw6cQXQTDB7cA7f/PrduO32R3HP/Xtw9CgjY2DAoK4E+izQywmDjJFDqZBJHqEZ6yUmCAF0uwNcfcla3rJxJRblCEhmuPbap2Htu8fQz6QBPRlFu5oQrGFh5AH/IvN2gGXBMmDrubaY2RE+DKLlf0XTjvLjqJC+V9SXmFYKnqa3gD0VHkOdHRbe1R76DINvbCOqWTAbAEr6VABVoTiq/u85UlwhVm9n2dANVjZgN5G1HoxV+5HIsLByMWskpG9WavqPYsIgZSzMdrB+zRje/PKn8etefgHOPXUUDTFANkix/YmD+NFPtuN7tz6GrU/Moz8A9RhYyAiLGdBL9XhlOedICMSR8lS6JRTUSF511UYQ5xAE5IMUW846HVc95zy+8eaf0sqJMeS5NPPEUoi1fJvMt8eMJ5Mr18wSWmUgmCtkav8fVCHLJaHwaIc6ZLRGxaW0LZWqer9G2Sdz+H71+YC9YcUY3U216tmYvM6CqlxIFNSu1hApAw+57UW0FsqWwxZ9OF1UudryiqcaHRumkRp11He0xDFBSsbsbBcb1q3AH/7ahfwbL96CUzck4HyALI2x7eAMvv6tB/G9H2zD1JEUHQlMD4jm+kAvK01tCCEgiECCCi8mld9FEQwmYiXdejmecsoKfsFlW9Du9BGN9sFSgqMJ/OqvvgA3fv0n0DEq7dmsskifMflHcIWM/+K58lUu+zHw9AlNvx/CbAI55oshDN183Rh02+wwRxu5AytPVJgLhopsD23lDWsTdWU8zAEGQcF3TYzT3i2iJGTs2FeeWC4btbyRtg9lKZst+PG4V9UJopuj0mQLtWbTiW6lztA18Ddszlczhn2IgEgQ5tt9jDYT/N5rzuM/fN3ZOH3TCBbn2+gNMhyZl/jWdx/ELd97GDv29bEgQQsZYboHFIIHkRAgISAKIhNCWKljYbU+EgL93gCvf9EpWLt2AkcPTyOJSEnB/gKu/qVn4YJzTuFHnjhAo61Ey8tKsRtXBSzUvII4RRHikdLaYuMvsHaaBYPL/rp4BOIsYg1ulFI5pI4ZcRG02YY5M8p3rCdclDYufRqyg2Ipbl5Jqgh5hqiIww1rsASYa5Tb+7nqfA4Vcz0g2ZyuyHC7pRxoAVwIPuW3V/poUIVHqFhsHAsM0hzz8z1c/cyT+F2//0xcevYE5qanMDM1AJpj+N7tu3HTF3+OXTvn0WHgSJ/oWEexgCRJkOcpkjhC0miUEtbOpaxbPyJCP5U4ceMYXn/dZnQ7KRqNBBSPgBnI0y5GVq7CW990HX77jz6M8bEWZJoPgQeX89RpX3EcYXGxBxBhdKSBPM9hY7bx4lUBba7VOLx8LbB2rSz8YrNQjuOk1HwsFZPDDYelkGYyXCYjuDhgOWsC4/QZWDj31PNJFKaYXStF6Ef1xRJ+Nmciz/kBK2euQmw+1XlbJSoSq07CLvHxk+QqLRYNkvus4Z9USGxymrRzC+NYYHa+i5WjTXzsb1/AX/3nK3HuiTkOHzqG5tgK7Drcx1+/73v4wPtvxfZd89jdI3p0CnSsw4ijCCQiPPXkSf4fr7+UIWJ0On00EpVVohBeuLDxZhFFhPZiD2959Zm8adNqDKRAlDTRHB2DiCJEEUH2F/Brv341LnjqFl5sdyEivzHjhi8FF6kQBoTA9PQczjnzBP69NzyLpSa2gGqhwOildmlk8ZBdI2hF5wlO1PUZ2GloVWRxM5FsfPRtQ7cLV1j47bnZan6fRnei+sWq6d3X3LiaS2nP1X+xhK9fYqkyQO87m4eo/F+LXA68RcGmAzKxOm2qp9tK8nONnSMEAYIwO9vGC599Kt/6yZfwm160DnMzc+gPGK3xUXz521vxzvd+C/f8fB8O9ogenAIdXWREQqDRSJA0ErRGRrF/71F6xglt3PbpV/Dll5zGc/MdpFmKJIlAwu/ZfIQgLLYHOPfs9fy7r7sEg34DcaOJkVUTuP/eR7F/1zGgMYZskGN0cg3e/c7fRJ5lZhdBsGVGRIQ4jjG30AEGXfzZ77+Qb/nan+Pg9h3odAcFwWppY/7YHsKhEZiCwdm4aRNb2DWl8IDZf2KJjaRLJLIPwZLKk+Zt32kQYuzeu1R/z91kR4HkZZsWasnAXCmvle+4fpmS02mby/bMWLGcOug4jguHwRj1yHne8YHUS8HQtAEgiQUGmUS/28d7/+Ay/vI/Pxcbxhaxf/8UxlaMYL4f4Z8+cgc+/ok7sW9qgEfmiHbOMAia0BqI4xiRiCAI4LiJj/znQ1ghj+GWf7kGH/u7X+ETTzieZ+cWQSwtye9zeIDzHH/1O0/DqnUTSCWh0RoBRRH+7N3fxH989JMQ8QgEAdnCNF78qivwmhddxAuLXUQiKmFly3YhCL1BirnZObz4yqfybd/6X/y/P/RX+OqN38WXbt1Jo2OjkLl1JLBlb/swdXZA2Nn/8J9DoQmx1VhldattVj5m17fTi+3EqZFA1YTrEjuDxr+xdu02PCQLIWllyEow2bcdgrMHHozJOUhvViPsRPGm6C8GawAubzt8mTPq0SZ5iBqyzSoAC7UPIEkE5tsDrF3Rwpf/73X8Z68/FTNHDqHTl1i9ZgUefHwGf/Xum/H9HzyJPR2i+w6BFvpQamKSIIriIttEHZ0uwJhPgQOzoC/f/BgG/Wm86QXj+NF/vhZve/MLOcsJWS4LpwUchJMMjLZifOemO3Fs3xQaTYF4rIlP/Nvd+PH2jP7t09+l+275DqIkQ9Ts4cdf+RIe+flDGB0fg5SyMr8oEmh3Bzh5w0q+4eN/yF/5xvtwwXMuwZEnt+LDH/gGpBCQeV5BzkpFLAemVCFGQcHtC5V8Xf8/dyWs/p2xeG0wV1/R4wr0X0k7tbgS+/1Yktodq7EjbajYBot5zpsZM0RV5wx4W9yhu40yLy1DAg9oW6JGe61pwgf6MqXXEHtPf5JYYGa2g4ueso6/+4kX8fOfNoaDh2ZAIsLE5Ep8+44DePf7vo1Hd8zhsXmiXTOMOI7QbCSIYkVsQginH2YGS4kDA+A7P9yHRx47gNnZaTT7j+Mf/+QsfPkjr+ZWI0aAPgBmREmE7941Qzd/834ko00AEg/syZED2DfHOLD/EAgLkJ15fOD/fhnbD3YpFsr9XNqqhb3W7qT4pWedzHfd9SH8ym+9DIPuIpjb+M9P/RfuPdCnKIlL76S295wtJkNsTQBIkgTMjF6/j8g+VbeKdbZ7MfBYlcmHdpAEwxme5HRX3dt3Z3ush0moSq9V149l5cGX2vb7RIBwnRZazDJcketRLizXcfVOANRkYF20be1i8DwmZjwh8KLCWxzYlYRs7i1NlEkSYWa2gxc++2T+2geuxobRDo5OddBoJBgZG8Vnv/IYPvSRH2DfbI6Hp4nmukAjSRDHRqrZ+9J0l5IlBAEDFnjgEOjLX38McSzR7gGLR/ZjnZjDiEzBQlRgRQD6KeNgDjz8xDRYJMi7ffz5H14JihNceeWZfN3Lz4OcmUE6u4jHd89hERE4zyuwZwBxEuPEaBot9JAuziAZGcfcgRl88tPfBxcxQBfSXHF8BFWnQl1MkgTXXnstb96ymWdnZxFHUSm5nfUKqncIhGgMPgzdDF7twXnbpbFqbZhar2mJSKHxEhyVyoPZsHEK9/FyZPYoy++2jVbvk6mBTal+WJMIQcWKmDikS+F+Qnq/U36gNkKnPkkiMDPTwRteejZ/7u+vQNSfxmI3RyMRSEZG8dHP3Id//4+7sGcR9OgxkGRCs5FARFERR7M4WUUKKJUsIkIbwPd/cgQ7d00hoRzMOR7fOYtut++NSKnZOUsIksgZWLGyBaIUnfYAJ22I8Ee/czX//hsvA3cOIZ8/hAY6iMYnrJxQD5bMaDYjHDl4BDOHDyFOBKjZwldvuhXbDnWokSQBZPRGxTX0xgCRwGAwwLatW/GCa16AV77ylTw3P488l3DOkB+CKDzkIX9cLnOikmkP3TkekqC1z9uIufzDPUw/9RxCmFctQcOutKk25um9PpINBafVdmmcV1XZOiXQF9qVdyzmYNfrCG0p1MT2O79yLv/rXz0DvbmjSGWERiLQHF+JT1z/AL761Yewu0O0cwaI4xiNJClc8sLqiy2Hq02AyvUfCeWCf/gI0ze+ux35oIveQhsrN6zH9IAQk1+SnBEJQpoxYgG8+MoTkc3MgWSOdGYBv/GiE3HJGSuA6Vmki9MQ8iiuu+ocMEsksYCbP8JIYoG5+S66rUms3bIFLAXy9jF86t+/DkAF9Ym0OuwzqKrX2dRJUcorETAY9LFz1y763OduoPXr1+F973sfNxoNLLbbSJJkOJJi+Pe6a3p42m53Qgae9AnnYQ4xSkI+jNqPr0aGnEhqEM5hHu7zFteGJUmsQGel+A15ZFOnlwdAWdKdfdmS3JqQA8otNBJUWrYH4Xld4yRSku1lZ/P7//RCzB05DMkxImIkoxP418/8HF//+gPY2SE6uAAkSYw4ji3JVo2hhdQXIgIJgYgIfQDf+ckRHNh7BPNzHTz9zFG86iWX8ezsPCRLRBFBCIIQAr1+jn4vx9//8cV87mmTmJtpI+33EHEPt33/53jswccB7iEb9LF4ZAp/+Csn49lPP5uPTc1CghFHAnGs8jLn2gMg6+PNf/RrEKOrQY0G7r3zfvzkgSMUxUm5lp7F4dkl9Vybi8ydbreLxcVF/Md//Adt27oV13/2ej7jjDN4enoajUZSPl8JGdhLXmdvU817tnODq2NzarY4/ZPTbhUnCUuGJVDjXNT44Eskcg5k9AfsSqJqfEI94xKk5wVh34Ya4rzwgtNmz5R7vfKKNTH1nsXdGfB3BjMzklgR22tecDp/9M+fhoVjx8AiBiFHa2IVPn3jg/ivLz+AxxeIDi8oL6R2ilSCv9aMfK5a3hcqFQtEePRARvc9cgjzc/NYPLwLH/j9c/CHb7yOR0ZGsNDJ0O7l6HYHOGPLWr7hn1/Gb33lU3D0yCLytI9Br4csS/Hlb2/DD+/YCUKGfruDzkIHaB/E5999CX7ntc/hsdYo2t0M09NtdNoDnHPyWv7qv7+JX/qay5HOHQNFOT5/0+3IALQaMUirxuW66fX2vcgmAOzuPlDXGkmCbq8HZsYNn7uB/uWjH8Xnbvgcrr32Wp6amkaSJA5RVxBda1AlYRkc9NGoGr0dZnYYluH2bwimNuMngLFU821pyUwgDYTSRixHZQPFYh+O/9+35IryMVrGw7S1lPMiiMSB8dj3lq4DWJ1+kgjMzvdw7WUn8U3/eAX681OQiMGcY8WqVbjxGzvwiU/chicWiY62gWZDSTWdYByeh6/kWujAALNEnufI8hx5luMtV47zy69Yjbg1jnWrR7Fm3QbsnG7g8QMDiOYETj5pDc7Z1MGI6GJmtg0CI88lRloRHnz0MK57+0/orOMbfNM/Pw8TEyNI0xx5LkF5B+Mr12D37CQe2XEMGRE2bz4Rl110IpJJgawvEI2vQ78ncfHFv4dHds/T2NiINS+Lsdbw2CpH55KxqXlK9Pt9NBsNZFmGq59/Nf/bv38ab3/723HDDTfQ6slJpFlm3rY9gRb4DAQrelnxXvh+eGuMf4adu16mTomuEGctHpauUD28crYd0mJTYsGztQPkWozCIoLgNvqa7A+3YbcDMhB0Ie+5HG2JRlzlYgYA4YnEscBiJ8O5p6zi/3jvFZDdOWRSAMixYuUYbvnxAVz/2R/hyUVYxBaXauESLKMKuDLWq205Ro4cD+zs4uqLM/TmZjE718f+Q/NYORbj4nVNrJxciZOetgHdqRkszHURxwJ5liHPczTiBm66fR7dDHjwQEYP7+nwc86J0e5nIDCyXKBz+ChW4BCuPWcca86/AEglZO8QBodjiNEJoBHh3tsexrbdc9RotoqRe+KDzFqE7CNnclY8GyQQAWg2mxgMBkiSBN//wa30lt95C3/yU59Es9nkT3/60zQ5OYk8z0rJ6MONHXkUQMaw8wAuibmXbRlQ4lCdslUSvCd0QrvRa4itypfUc6Ik5Gr4wHrOizbb8LbpxHf/1rpVA2AiF0hsZlqdjMtgy76rychmoEIQBqnE6rEIn/3Hq7Gq2ccgV5s7R8caeGz3AB/7l1uxbZrpcFt7IjWxeeX/2AZYBbJVIIIsdVTgsUM57T48gMyB6dkupmd6mJ4bYGquh127D2LqwEHErRVojjQLrYMhCOgsdvCmV5+HRnMUV112Al9+/mrMzHWRZykG/T5klkJKxtx8B+1MIJvP0J9PVT0VmUJ2FkH5Ar7znZ8gA9BIlORGRXKHjP+qcuV6LvVpN2oXRKORIE1TkBD49re+RW/7kz/BRz7yEbzhDW/gmZkZxFHs9eciZj3OUPAqat8yUstX/swhmgaxKhqMtaevSs6hEJgnM9hqG0DsqA2MispAAeZSr8aFqd3Z+BmycfSCWdJW22N1Rqk1D9hi3yYyWz8nIgx6Pfzr37+IzztrFaYOTiFJYggRYXYwig99+GvYdjilvfOERqlG6nqGAQovPJ/htCE9NrMJU/Ef5ciY7Us8uLOL556vigf1SII5LyoqS0wfm8LEyglAKIKQMkeepVjMJE5d3cH//vOX8qkr9mJxaga9VIBlBpnJMsMkzXI0R8YAKUHIwUzgTALcR3Z4N2750aMlXCpr7alzJjndXzyza96dc7ENiQiNBqHf76PRbODGG2+kTZs28Qc/8EG0F9v8xS99saJeLi/I5B6+4WMSVeSjktiudKuRhJYH3lSEDOAeFy4l7bDhYCvOLPQT5fYcrvbpRAjKPU7w3rBb9kwZe/9ZHQzrYywhe4FKgIc+hhG4jcaxwOxsB+/4rYv45S/cjIXDc2iNjiIbdNEcX41P/tOtuPuhY7SzLZAkApGWbJbb38ynWNTAgtsoqJkFkR3spzIbZfuBPi57ygjSjCE0QlCKJJLodgdI1q/ByhGC7CYY9JoY9PvIBgOkUuK3r4nRnlmJTnsRYy2AZQyZZ8jTDAyB0dExHHfiBiCSkL0cWSqRpoxWU2DH44fw4LYpisutQnrdqdAy3EU0iF3jOfQ8eTqjXhQXm80G+v0Bms0mPvrRf6Gzn/pU/sQnPoFjU1N82w9/QJOrVyNN0xL3hllL9rba4TE34zkFUNnE7KOl7rhgMUMI2kdUS5urya8sBUfxf2zdq+id1XZKMnQb9n0qTlCPTEOeA2aYS9U3e8vutPHr3TaeQnfMcUSYX+jj8os38rv+5JnoTs8hTmJIzrHyuONx45cewre+uxV7ewKAQBybIHA57ADhG65v92ukn2NvEpXtCBIACew+llF/IHm0pbLr8pyx2B6gEWV49MFd2HWEMD0zi6mZHtJBDjEYoNvpot3PkKUZWDK6gxy5FEiiCCICSDAmx5s4Yf0Ynpx/EiccN4oN60cwMTGOVrOBeKKFu771cyz2MoyPNSrg9o/jsp0NS39sVVq1ozJNIjQaDfT7KsD/7ne9C6eeeio+9rGP4Zdf9Ure9thWGh0bU/vwhiJ5jW/Ad7BUkDbkWbPljmuvlmwzYATqc/yCjjNv7AaE7uZYKoOS2la2nRQWGF3PpMcFnU5sFYoCCMsWwvqIDO+67f3USFEFOrNWRzWbMiUKGAIJZfjhZ17K5562Cr1uBgLQHGlixwGJ//H7n8ZP9/ZoqhdhpBmDRFT1mC4P45b8MDOklBikGZpI8cfXjHCWS/xsRx97joLmOgBJoJcB84EVFRDFjm6VvUIkkEkJVReFUdZHsT4bx4CnnznOTzv3eFz29E341Fe34YbvHqIV46OlvKifH5cMY4mZWZqQ5/krPKxpmkJKCSKBK6+4gj9z/WewbevjeNWrfpk6nQ6SJFae1pp1dog/hNieeOSa8XkLElApK48492pronBY8zJmkXqY3CwAAzBf93RA7vnsyZFg5mnHg+lNJyzc3GeHS0A9XncsNnDjWGBurot//JNL+O2/eRbmpntojI4q1W5sFf7iz2/EF7+3h3b3IrQStWFUFEmRrlCud95USxn4C+UCn5mR5TmETLGuITGVjaIxvgJrVo/xpuPGcdzqFlZPjOKEdQLHr12BjRvWYHw0RmskQWtshdr6IztA1kWeCfS6HczNzqLfz9DOmpheHGB6egGHZoHZfgM7dx3Bwd0HcXD/EaJcQiRAm5poNRLLDqah87KRLbwmdYSpQwYSUjLSdABAFUt6xzvewW9/+9txw+duwB/8wf+gsdFRSJawlIRK3wZvjGhzpFudF9GRhAiO0Z2r177Xbo3uVRlnxVLkQqWsvuieNeb0ZI/JvkAuiVKgvZr5Vtu3YUXuLb8dLnRYYmN/EAARERbbKZ5+zmr+7VeehpmjHYhYYNDrYuX6dfjazQ/gOz/Yg4OpUskUsZE7LapM2Aw1QIPaoVW6IiyV1NwjxJFAt89YvXkVv/HK03DCSsb68RzNaIB8MIU4mcPatSNYvbqHsVUSUZIAQkCKoxBxDGKJfm8WvU4PjSzDREtCxplKQl4dgU7MMDbawoZrXg6MbwG6GaYOH+Q7734Av/nWfyNq5yBBgGTLOTWE6EptjQL3uRYeRr0UEEIiSZRqSUT4+Cc+QZc+81J+7Wtei3vvvY8/8YlP0OTkJLI0tVmng8T1vNc8XUF0ay3Le556SY5TRdsCtuek/mMZSDUYquGnECN2iIrc121u46BcHbZpp4LdZsAz6Ru+vicwKJqrM3C++u9IBiIBvPMt5wLdefQHhEazgWYrwsGDs/j4p27H3h5RxhFaibKrzOBK/5YzYjtmVHegYbmsAXtaO1WEIDDFOL7VBh29Dw8+KdHpATOLjNmeQH9AiAgQkMglQxAhywlpDoAkIgLSDFhMFSdrRGo4gxwkCRgfi3ntuMCa//MQtmw+DuuOX42TN6/GaadMYt2qJs8v9koL250XoD2T1QVzF9HenzhM5SzP4yYBIbgIF2Q4cuQIPvavH8M5Tz0Hf/RHf4Sf//zn/PDDD9HoqLLnfNcBOUjIgTUPOdSq4yJfWmmTxH/XYvQV2htCiwEvR2HiFFVGbZXS3szpSdZgvpkTDLWcIn6czG5Ul/VxHRIFotoLH+7UA1T4XhILzM518boXn84fedt5OHZ4Gq3RJiiKsG7DOvzfj9+Nf/rkQzQNVV8kjpNie0qt/9OEFK3hletChpjMvG2moOtomgZSyTgu6SFLJWZ6ymmiLbCYFLNQThbVjCjmm1v9S6m+a2+yZGXFRQCaBVLkAAYAMgDHJ8BgZAR9GauTOK1l9tKMHKvBJszlHFhfp3Jp9XIwSMHMaCQN/P3f/z2/+jWvxm233YZf//VfpziOy2dLOPq6uqdNOc9i+PBs21J7ne1rlSTnEr71pFw311C/JcHZCcKVFu2WrQcc+6ZaTcgNC/j3EG5r+JnXxiHjANoGhNKUMNIg3Pz+Z/GGUVXpWAhgfGIUx7qjeN1bb8TDRyRJESOOBAYpg4QAF3EwEu6C6hHqnDzfcjbKCsFdcte2LR0KkiGZIbMU/y8fIYwLygaXTotkdk8pigiIGq2yLJ4dp1Sl+0pl2IG5LcU0o2NmVYqdzTP22oa1FIW9UuYY9AeQzLj4oov44x/7ONasW4v3vOc9+PjHP06rVq1ClqVwGJZDdy63dVmH3rlR516tG2vIseJKUtu9H7K2StwI2Iwar2O7bZD1kGMgm46d+Ketd1bc/QgMyf9KoTvL+tSlb0WCsDjfx++95lzevEpiarqLkdERpP0MSWsMn//Mfdh+MKM8aaIRq5jYmaes5iQmCEgIEZUAYqkki8o4MU4PUxqelMwuGYBmh4CU0qr3mBcxUq1aMLIsR5ZlkHlexIzUYuozApgZGTMkqwhoJhmZVPcZjKnZLqTMDSKHoeQgA4sIUXFFVRVTFZ6zNEWvN0CaZh7Ds9VMF0uTOEGSqB8bZir4Ho6XlSo1CcRJjCzLcd9999G3v/Mdft3rXoe3vOUtuOWWW/jAgf3UbDSRl1vh7QKyZFbd4Yshz0jAnvF1Ef1aEIRKTfDNK9/ENxk37HRXsdZgBb7Lvw7zsPQ+qiEML8bmmd7uwOyBMEDkqpilmK9JQLWBHZoWEaE/yLFxwzh+7ZqNmJmaAokIaZZjtJVg+8EBvvTtx9ERAhEBDIFV4zG+8L+fhTNOHEW73YMU46rIqkxBIERxApE0VAqUzAEhFAEK5WghCEUsIlLSkQigWM2KBEioxGgSAoAytkio46JAEUCRIhzOQSyhz+RgKZHLHCyZmRm5ZGSZRJ4OAEjsPhZj39E2CBkW5hewML+ATruPKCaMjia47Y6t+OJ3thOzqe6s1OcYUkostheRZTkaSYx169bzyaecjM2bt2DTpk3YtHEjVq9Zg2ZRECnLc7QX25iaOoYjR4/i4IED2Ld/P/bt24dDhw7R7OysUhEbDYyMjCCKVB+aIVQIgQAhIhDlSNMMn73helz7gmuxft06vPUtb8U7/uwdGGmNqCOVLZtLZ3gw1Wk5xrjS/hwqJIeDS7ZpYCElOUM1tlSZyldDA9WEC/aFcGlOGAlHoQa0mAtxCsdPUj6jVRznOW9wtvTkugFUySnYoF28NRKExV6KX776NJ6kRUwNJBoNgazXR2vdGnzp+m144mhGaDTUplAi5FmG9733K7jwwhPxgis348QNfSzODBDFxd60KC7KJ5BK94oiCBFBxFGZ1KyJHUVsjCIBiFg5YkThkOGovA9SbZCIVLuCyxgoMyvjjGVhmOXqOxhoSLDMQSAcN5ni6WclgBgF5Cgg1wGr1+Do1oP4wMdvw7YH9yCJImSsyuLFcYRBf4D5+XmMjY3h6U9/Bj/nOZfjiiuuwDnnnIsTTjihDIkEP0U4g5kx6A/Q6XYwOzODffv38/bt23Hffffh5/fcg62PPUZzc3NIkgRjY2Ple9pkUEFldQqsIkzGow8/Qj/8wQ/4pS99Ca59wTW48aYb+f7776fR0VHIPC8xwdj7RqlzD8gMYFOBm36J11B8vG7ezjOOLeSaHG5SGTyrvvCi+k6TYbGloNfHu2/GEyIaTw8PGem/kIJp9G514LzE2HgLN73nQl5NC+AohiBCIwIG4yfhNb/3FTx2pE/NZlNt/SeBZsK4cNUi7z4KGlvR4D/97QvwS1dsQa+TIm4mZQCfSCCKo0K6iXIPmb4Hq9wCRUqyKSQp7olIqZ+a0IjUQRMlMpFJpmVZ/rDMtdGkbEyZA1DSQ+Y5pASSpAGQxPVfvA8f+NgdeOJwTq0mMIhGQCJCr9tFluc4/fTT+VWv+mW87GUvx7nnnotWq1VCMs/zQh109QopVdBa/2RZVkgvCUGKmJMkQRRFWGwvYtvWbfjhbbfhlltuwUMPPURpmqLVahZl1F2bTEqlVg8GKS699FL+xCc+jvHxcdxyy/fxlre8hVaMjyOXcontMQYHtI0Vpp8a9Rjm3crzDIu04ZpPNQ6aav4vG+HFJcGx5SX0CMShEnaoXLtMLVIzRGY/4w1q2Ga/ENGFDVXjoSJSlanm5/t4w8vP4L985WpMT7fRGmmA8xxrjl+H//pxB2/7hx8SNRpoxGbTZZ5nmBA9jDeAfMDo94EPvedyvuaZm9DupcV5AIQoitRu78L2MbsIqCA2TYQRWBCI9HOK2CAiMIlCwolCW1HvlvPVUs0hOP2/us/6OhhZmmNkbBRHj0zhL95zM771/f0UjQAzfUInixDHEfr9Ps499xz+rTf+Fl7ykpfihBM2qCB0poLQSvrVb66VUiLLMmRpijTLkKap2i4k1diklOX/Qgi0Wi00m030ej08/Mgj+Pu//wfceecdNNJqGZuMTfwvz3O1q4AIH/3oR/mqq66ClBJveMMb8NOf/pTGxsZKu9DdA2dhgk1wIVMu9AlkmZg0vEJSsZJRbsyRrHddu9JukzzClMWghPPCcj6WJ0tPnbRXqCKiw9nktTBwyMunRGMoG7Zg1Iw8l2iOJLju6RNoz8wrF3qWg6VEO2/hK99+BBmK/D7SyKS4+qFFYPs0Yyol9DLgU59/GKlEWclKSyC9VUbPwxBZYeOSAKzTcFAQV5Ho6MBZPRuDKArA3z3XrfSNEcp2ZU4YWbkCjz+xD6/97evxxe/sp0GDsG8BaGcR8jzDSKuFd77znfz1r38Dv/mbv4lGI8HhI0cwNz+HLMsL76an/gfc35oQ2bapirCHiCIkcYw4UUys1+thenoG7cVFXP7sZ+Oaa65Gv9+HsIsJWTaYEAJxHCHLMnzj618Hs0QjSfCrv/qryLKsxlZzDULXieGfH1+PacE7pZQs7EHncfIa9hI6glt7XIPMKO2267qgKdc+C0+hpDPPo8zwgVQ/YfdV25p14ywa3800uFg0QqeT4qJz1vOZxydY7GZA4QkcGWni0V0d/OyRoxTHsSkHV6QbSamOhCIA833GDAMP7pqnY1MLSGKF6IW5ZwG1QDpBYBKQrFzwuVRtljExycVfFFtvAAmCZIKECjDnuVYPJWTOxZjM2KTedSCoUEUjSMloTrTw07u34jVv+jzu3dqmNCEc7aAgxgwvuPYFfPPN3+C3vvWtSAcDHDlyBLlUVbQISoVMM6UiZsUGV60q6g2veZarv8VudZmrneVcqBVOKKJAfE1AFEVodzrodDoeIptlNiq5+rnzx3fSnj17keU5rrrq+XjqU5/KnU7XMDsHPSysqZgpPpax9Y0t5HYNnzKc4tGQLwn1dVUHxtfs3MQPdmDkp3bZxBX0k7gXbe0vFPaoD6VVQwRO5kLZk6viBuQltDrMDFzzjHVArw0upInMczRWTOKO7x7AYg60WjHc6lSGgzOpikqSVfIwQx0rJbio2eggh1CucMlojcbAyJh6UauIFFnSLTESriAYx93lRP+L1eUUkKlSJQcp8l6vvC0ZaKxaiXvvfhRv+IMv4+CMpB4BaSYAzhHFMf72ne/kN73pt9Dv9zF17BiSRgNRFCnPpzUPCUJGiuDiJMHY6GjQcaL3FaRpim63i067g0E6cFLCHElJBJISjaThxqx95GDNMFWYYGpqGrfeeive/OY3o9lo4BWveCXe8553Y2x0FGlmDq70caua0G7W13gPHR95YExcGZrloLdwtM6JWL3GTrO+l7IIwrnBOhs3Qh4gLS0M9yBfzGpuCMNnwq5VcgzO6lGBVljAXmgQBmmO1WtGccmWGHNzc+AoRparjI0FOYIf3b1TPVsGd60gJ5FBssJOKiUKFWpFKeoN4TEDcauJBx7v4MndezA6WsS1ICBEDEECJBhR3Cg8mQSi2FIRASIupGMElil6A7ULnDgH5ymaTYGzzzwBJ5w4Cbm4gDzPEY+NYvf2g/ijt38Zh2YktVkto5QZ1q9fj4985KP8nMufjaPHjiISamuMDuTLwgOa64yRPMd4YwwrJiaQ5zkOHTqMvXv3YNeuXTh48ADm5xfQ63YhoggrV67ExhNOwOYtW3DiphMxuXoSeZ5jYX5eEWyclPxCAOXhkq4H0beBjI8gEhFSpLjlllvw+te/HkIIvOAF1+Jf//Vf0Gm3IaKo6tiwJG0lF7KKYeW6G/5m44LRXMjrwkP/8oLv5azZL1C2DXIknBcoCQ7ftd1sYnGJx+IQgdYdwrLEpFu41eckrndJtyGEQK+T4dkXruF1jQFmuxKJYHCeozXewrZdHWzdPUtxkiiJ6Rm22rUvint56beQpRub9LPCzJ8lkKyYwJ0P7MDvvfNm2tgsYCqKYDkBsQCSSGmeghQi6uwuG2SpBNIc1E+VdJWs6DwjYHxVgo++7xV83XUXgDqLmJudx9v+9AZsP9CnDggMgTzPcOopp/JnPvMZbDl5Mw4fOYxms4myfIKtsDNjMBhgpNXC2Pg4Dh8+jM9/4Qv4xte/jvvuvw9HjhylwWCAuk+r1cKmTZv4wgsvxDVXX43nP//5WLduHWZmZ5FnElERLlEVqSMrKK6XsyKOSvUyigQeeuhB2r79CT7rrKdgy5YtuPLKK/mmm26iVStXIitDBNa7NlFUcNUn0PC9iheda1so26lcD+UalgRg2Evs3KOwami6d8deqzFWXgs9bYBFzjOupLNbdWIurGMrypt06dkrkQ76yCUjkhLgDGMr1uPuO4+gnatycAY2bt8CAixkqe4a/RyaKot3jCePAXCeo9koyjdEAlJKxIV5IEjlL/YlEFl1SR2HLxtbN2NARlSqjZKVlNg7leKDn7gD1734UkSjwDv/4gu4+WezhIYAU4Q8S3HylpP585//HI477jhMT02j2Wwpe4qMZBNFP0yMyclJ7N+/H//0T/+EL37xJuzZu48AIIoiREKg2WiUXkR/ddPBANu3b6ft27fjpptuwtlnP4Xf+Mbfwmte/WqMjI+h0+1C5UMqZuhIOMM7HYzV8E7iBO12B3fccSfOO+985FmGF7/oRfjyl78ctKNs95lPMK46575l7JZAsrMdaA8Pt/bjhz1ChFRiYamgLa2amolZlpbvRCplVQ0B26dw2i7fcCm6AhBUGQDSjDEx0cAZGyLML3SUnSQBYomUJnDfI1vV4ruuLA9AgJI/sujfjMNJLyQu4mgCyCWIc8Sk0r2melymZf33P+77qiIygDgBrRrDzZ/6Ea7/4nZKI4LMAEE5Nm7cyJ/97Gewdu1azM/PKxVSw7DgoAQgy3MkSYJWawQ33HADPvShD2L79u3UaDQxPj6OrHD5p1mGYXEvJYkiREXNl0cffYze/va346YvfIH/7/vfjwsuvBBTU1OFEyVcv9Kfq76ukwh+/OMf481vehPSLMNFF12EU045hffs2UPNRgOy9JIC5dHJ8PDNwhF797affF2dZXjf25LSrF5KVdZWuF9NR+Ev9jU3PFDnE3IllX3NjLWuG+e65y7SUrA/yHHKCSO8fiRHb6A8aLlU20AOLUR47IlDpE9zCcX/XE+ZCV7rHEnbE2V+F8gcUeEtWwa8/zufwlY87fQNaB84jHf//c0YxAISAgIq4P2pT30Kp556Khbbi6W9pn6EcQgxY6TVQpoO8I53vB1/9o530NGjR2nFigmkaYrFxUX0ej21LYaHMw0dOxsMBuj3+4jjGK1WE3f/7Gd03XXX0U033ojVk6sBAhqNhilzXooNBgcNI8PkHnnkETp46BAIhMnVq3H55ZerfXRCQPsJyMI/rXHYpna1/QKkthPcnZm9uiXyVfQ6bSt562Q/M0xLHHIGp9uHIaMaeT18mZwJgQNSjFzv0rBh2elcMpc4d3MLscyRFy74dJAhbo5i58E+Di+mSBqNivs2+LHsyjIGpw3zMkWrSM4tMkg0TxQFsgj9I0zZcuFcF0N+7HJ6ZgwXnXcKPvj+7+KnewfUhUCr2UAuJd75N3/DF190EaamptBsNEFW+/p/Zkar1cL8wgL++I//BN/69rdpxcQEFhfbmJ2dRVZUzdLESWSNuxi7diCFtI8sy9DvD9BqNjE3P4/f+M3fpK997WvYsGFDoZgEkH6IyZIkCaamprBt21a0RlrI8xzPetazrH61EeyecWBacffzOZpdYC+c2z9hOJpQPWe1kjJD5pz+mLMFyJVQuu9SXLN1o3yo+IetLRHLQWryvlcuBuZRXRuwZFBEeMqmBjo9tZ2DwcizFJyM4ZHtx5TXTAwnNtvjCRROD+sdfUwyaSOMUXJY/VRU5CtGcYQoVqXR46jYb5fE6lqsHAlxHKn7cYS4UM/UT2z9jcFQjoSj+3bh05//qfatodvp4ld+5Vf4TW9+Mw4dOoQ4jksC03Uho0gt7ejoKGZnZ/G7b30r7r//fsRRjMOHD2EwGIBgMYFiDGZsauxRbOYRFecqRAVzMDzJnAvXSBL87u+9lX7yk5+AiJDqLUge2jg6A5mfOFbn1D3yyCNoNBrodjo477zzcNxxx6kxF1LfdzyFtxYVktBSt0qcdh4NW4jVOy7+1V+rO68ACGarkqW+2TKHNQWUxr53hhgZ0jEOAhoyiOW6YuypGwmb5YzJiQZOmEzQ6abKy5irYDKScWzdfrAE+1ICzg74MwwG6BgdpFQ7g0lARJZkK97XROITkkp+jsoUqjiOIERcpopFsU1wBulVulWEJInw+Zt+gkMzKlsjz3OsXbsW73n3u9Hv9UoEBWARQ4RIRGi2mkjTFG97+9vx2Nat1G636fDhwwA0kalMkVj/xLFF9GpscVQdn9BMoagBo0GrC7/Ozs7hTW96E9rtNkbKfE2bxOAJE4M1mvltf2J7kWc5wPHHH49zzz2Xe71e0CxwzSlX4pnDKQvc8aS0N6oKylHN9aUwua5BY8M5aiI7JpPmPvoJRzD73jfnBVsNGCYAl+QpDlVrdWuQShw/mfBEU5bZGYNUqhJycgR7D8wUge7lAsQCBhs1CyBInb6lg9jFHMs6WrYaVjhWqKIm6qB5obaRfib8E0URwMD2Q5IWc4GRVhNSSvzhH/4hb9iwAd1ez8QQ9XgKomMAExMr8Q//+I+46667qNfrYW5uruhXSc64kGRG+hrp6I5PEWZUjCny/tdFcwGg1+uh1Wph69at9KEPfgiTk5M2grkZSL5VUZoVwBPbt2N+fr6UtBdccEFpt5PfDmCpl64JRLU450tESyUsvtuaXuXVEM7UekLMPeOl9BwZ5eQLKaaH54vjUgIux1FTM87hh6mbW1q1ZVYqH0uJk9Y3ECNHlqMoS5Kj0Uww3wWmpxcpbiSOlF56QIXWKIuNoaxK0qkEZUAXMRA6Ibm0Td2jkX4hYAxjoyTQY5Wc3e8PcOEFF/Ab3/hGzMzMIBICgzwzIYyiXykZq9esxk033YTrb7iB8jxHu90uCV8RVBTc5a1UaV+9obJttQYF22WF0EIQ8pzK1LBer4vR0VF87OMfw3nnnQshRFkV2rZvqgxY9RPHMfbv30+HDh7kk085BVmW4bzzzlXZMrZLsmYB620oOyaDQpth5zp7jL0unO0MocJBKpHq8mlhuIpH8TUxjKW8jiFIVhxHZTa2WbilP2HFedPqGP1+hixXme3MEs2RFqZmB1jopEpKLAv3DQfWjEbtxlbB1khYyEZQe95iKy5I1h87lmeHFzyYDadJzWcJIkrQKE6j+d3f+12sXbu23F2tEVlzeGZG0kiwb+9evPe970V7cRHtdruUXkZt1GfckTMm3bftjPMZrCutCxXWUjmZgTQd4NjRo3Tzzd+kRuHOrzopwusQxzEWFhawd98+NJIE/cEAZ555Flav0VWahwCOsaQrwSV421Nh+aEtWFRkIS/FwKlYuep8Rd3gteroDCVAbJWOQi5Zf8Wc61rd9NzFFRFtXi+RRBAmW0CvlxX7qxSXbY6M4MCxDrqsCGV5HzfsIKWEzM0WFFmw1nLLTQF5ATNmI9mWWA6q/m87Duz7QhAajQbSNMVpp57KL/ylF2J+bg5RsRNb5hJ5bpKPsyzF2NgoPvzhD+OJJ54glhKikGhx4fQwB0pqB5DNSOsOt9QMwKClzVCiSBiVVAikaQbJjFazWTqgfAKuQwstEQ8cOAARRRj0+1i/fj22bN7Cg0E/YMcZD3o95F2xWhUJ1dacQVtPVdwzldhinS+CIOqki+v4QOmdq0Ui3Z2tcxYXSqmgCcxTY0quaQ/a9zpZzhoilYmfxMCKJiPNtPOGIbMMLEYxNZ06iBIcc9WpVaojeS6LDZ5Kaippp0soFJKOYeJw8IEOZ+x2bMbmsOZ66bFxArXqAJAIaZril1/1KqyanES321OZ+0Wm/2CQlnvWkiTBtm2P44bPfY4IKsskElHhTBGOk6MEgr8eFcnsMhEn5gWzrqXEi6JiB0enSMfymBAb+JXxeRspC7v0yJEjICJkeY5ms4ktm7eo6szBxIiaNXWWgcM2mTMzlHZi5Y5FCxUztASIRWyBjuI6hLR9KA7ROWtVcMQSXWxDTo+6QMWCIHz7xne21NZuh0vLOTNaCbCiCbWxkYAsF0CWA1GMYzNz5ZxL43dJVcAQgELmCEwxRCQhhCyqenFxWgr5OGRJN7LaY0cqkyZWF5IODByuSoQ8zzE+NoYXXXcdut0OpMzR6/XQ6/eQZ3kZ3M7yHJOTq/G1r30NU1NTiGNdwkFYu9TDmGC69e4xoD0PZWqdva4ekohIO6liEEmj6lp44GSABBZEr/HRI0etmCvhpC0nhdDQgLAAvc/Y9AM69BXGARMnrqRE2lBRXMzpN4xXhUZUSl31UOzUPq94Vmwh6iKSLUWXUtq8eVtXyOH8pl3XkC0nVnzT22jGGkBCOfqphHLoqUKNkgjTM/Ml0EuJ4rXKNYvNgNrhPCBQxIiiCFJEgJAQea48lhAl4hgIVVWJYCikJL5iUUjDgp13tHOo3e7g4osu5tNOOw3tdhv9gapNot3wBKUCR3GMqelj+OpXvwoAReC68DT6jilf6AxxDtuV2sx8NHZbeFDMQxSE7XhnnbcMMiLk4Ci+T09PlbvBZZ5j80mbzVhLxLGMHgt3HKZWjt+Moqr4mxX0L5f1ZlClLK7gvz2mKlCVl7JMYXdfNGOs89PAYo1a/1eI5Oa0oUQsuyyEv6q2KuWoMNZiainKDDRiZbMp/pmr+JjMwaKBdj9D6KOlJFltV56RrDZfZjmICXmUQkQEEoDMtNdSN+Tu4XUcw2SpnMVNf5EdiVMOyhCkEAJ5LvHMy56JVmsEc/PzaC8uoFfskROFRpDnOZJGAw8//DAefuRhKu20Qo0sx1CLCuFPVaWszNKGrEJ9ATBHVhshh5x75JfTajHQxXZbERxURsv6deuK7BnpagKe38DVIKruc6oshiFasuiglPjOUW1QtWjYEC0XD5camKUVuCqWJjiLhVVPP3FQEc5o9GJ4qlSdl9QlNnJa1fMMmrQB6pCK4FgIIMuV+55lATKOkKYZgCjoIg7FgdzqTyjLvDGjzLBQyJuDowwAgfMcwgZswZzsNDJHeyDATqb1P36ZdGbl4o+iCE9/+jPQ6bYLr2MHuZSl11TZORkmognc9ZO7kWc5Wq0WVCaJcCSmluBUIFIoLZCdtXA5o2tzmuvle0Qoa4Nb+OS/YS9znYbU7XSQ50plTtMUqyZXodlqGjvOl7ZBVkLl73omU1GxrDl5zKXQOSu+MU3DPnw8AMcKiEZyVKCPAHbCIb3K/cqCeMyNfD3Fhb/bgfXX2HCqgpXO1M9yVVxVFHEhlfmeeRsgA5+6W6RKEGSZ4qaa2GCpkogADAYgMOJIII4EmMiBSxliCAHNA6s+KZUll8V2FKINsHbtWmzZsgUz0zNot9vIsqxQiY29mxeFZR986EEAOp6mHTzaEYIgAwoxy9Ajtg1dARi0imzWq+KF1L+8nEZ33c2L/X4feTHXNE0x0hpBs9FEr99DLEyGTcXIshibo2WxS3ieHlUBR3VTaw13AsKaWwEE+zyD2KiOIcnG1mRCrk5DxWYxlrLolvOMpY/7NnypsqqTQ1XNDS7jZKqKlLC4Z+hg3OrH2dwqgTzNkKVqg2eU5ciirBybCpdkGOt2sNhuI8slpmfbpn6kL9qXnLvpW8QJxkebyPNcZdMMBti4cSOvnJjA/IKy20xGha62puyldruDHTt2VPrxkxqq6zxsPYwngtimutA87T595g3XcQbbhLCbMZqWLGKNKP6OjY1hxYpx7nY7RBHKlpx0EkvVczTHCiNRUrjiJAkYcTasQqsZxn3LzLKuxuaWhxyekTnUGaApXevmqJGY5fMhRLQnpA1fb5KOPkyIBQOQkKUxwIUDScWCQotfryqbLhThqoMEtbSjNFNxOWawlGARoT09jXPOPh3v/v2VPDoWq+JAxdkEDFL78qDsvEpRtsL2lJIxyBntXopWs4FdOw/hy997mOIkKvqW2LhxI0Qk0Ol0zBhKhU8RXJIkmJmdxrFjx0h7Cv2Ntr/Yx6wBwV8Idp6xvYMueF3J6Tus3COaw8gsWZ33wDmXNTClZFu7QwVvS6bi4ZU9vmA8zhq59Zyr6Nk+C70C1mboWqeJuhbrNuoVRK0GGo9SebJp+aCfRWC5gX3vJqp9VZeIyjZLpmpNoTRSmdWpM5LBrE4DzXNZ9u8Tl1bxQm55J7JChaTMJCCALMuL6l7KW5bFGaJIYKYtccqqEfzxK8YLr1wEkCyD48wKC3URIoNsSiUuuR8RZA6MTzTwxW92cP3XM0w04hJOa1avRr/XR6/XU0cWw6iT2iZL4gSHDx3GwsICGg1znPAvRmghE8LUZiyvO6KJS4bNHCIZF/7OHapqILbXXG8vskMfCq7VgrXD7ThvAK6R6s49qHLb/hXPwxn64rk67I7isn8K9GDMAE8vr3F7lh1RaXBW6h7SMHLzp+cd4lAO3qhUXBxjq+fBzEjiBHFRUqE0fLVBr1vTyOKYAWZwqiRcoZoO0nJLiswloiwvwTvodjCX5cqLqROICSA7wdmSNNq1zLCgWNihkyubOHSsetjw+Ph4GXPjyLU1iFROKRqMqekpMHOxG9tz2Czz4zMk/xANo6tbHH6IxmLWIHDRX25zEwCQNNQxYikzosItH0XCYri1DXi4ZNa1YOVwVD1berCFM9Y4yQq2+Wzcc/EZcyhgA1o1TbiMl9hSxNaDA3Hd4uWiE/9onZLo/I4DizLsjqVC2TMuQspF+QSGlKqVSDBaSaKMMQu45chqmAZbBKhUyhycS8hcICdSpc5ziYxUwrDO2lCpXoUaB0N4Zhe5gZ8t4U0SMEAyV9w7iioo0Wq1CttN1a70za88z9HMc3TaqgakqSWi2SwMEmgABHHU90IyAOHUJqnIwBp7zo0pWszNisnlee60aTtlmLkohETl+QK6LqbBZVsyAqGSCw4MrDcqsrEUMOwJQFvy2ERkqdMBOIYlLfk1TYxJa2uZjtqrg72s4yiGZ3joBLt8um6JakScfcqkr3aG+Rejn+rDhgm5JOhdwNmgh7FmAxplfUeBRpRgleHifymVhMtzhhCKs8pSYhMiQSpHkWC8oQSIQpVUITpRSohShSrYvSqPpxiCLGy5PM+Qy6wYt1HRojgucibVEVi2pAS4KEAry9gc+SKF2EUqxwap+bA65WcwSNHr9aDLVNQ5hYz6r+uEcjkW3xGnQy0jIyMFHlnmB6OsjjY6MmrtNChirkU4xMZam5qY3EPsfRwqGZkNHnJI3gtDuWqio5VSPWlZnTkwjV2AUAWUzrpVXDrWdY9A/NzC0vazEDuk0xe0HHbKeMBLcwUkheRaWqgs//VrV5Sv+gaztknthdHgNrXkSR0PJRkRKzVGsMkvZCZEgDpHgJUjQwgBKRgkC7e8NJ6AkqGQPgnUTFTZohJ5mhvHk6UyMUtz2IaKKjsFi2QulR1X2G4lH7Sg6zqxal0FRX9Kenc6HVx88UX8tre9HXOzsyVBxcXOdXvjqyhOh+Ry7Np1VmgKxbl23W4Xq1atwszMDP7yL//SrTNgOV8AYHJystxgq69JHfSuQXBbeQm5L1yTymbv5NFGwFaz7lVR02+Lq2CmIg7nDNYnwMqB4463JMAnPQ7I4eX1r9lEVjG9LYeNmSghLbzwTEVNESi52u92sHpypbcK1cnb6qYzKFbB9CwrzmtjddqnqiyFYgNnwZMlgTkvJJ0oNqKSUTnLgrKGgSnJBqjDIlSp9DTNkWZU5CKSgxn9/gBZpvbnaS6fS1kQsOL8/X6/LNijHTFuHU7yJ++sEci/ruaZJAlWrZrEaaeehnXr1iFJEnQ6baSDFCIyRZd8MKvmVA0YWSycZEYzSbBjxw7ceuutSLMMSRyZnEpvnSYnJ8FQDiwiQq/fQ6fTpTJzxscjr42Q+mi+uw+79pxVl8SypexMKHd3SwC3KgeDq39i310LW+2yl6pgHUY18dgIuMIFyO7fmmTtscIV+5zd79ZzRIzugJFKgTgqxsaqDMKgvYDJVce7q+BxLNd75PbDpNzxWa5DC1K5+AuiSmKClIQ8l2g1m5iYXKmkQiTKrTBRpAkuKhLJqZDesvRQgqDqrww66PcFpGRkmbKboJ0hADqdDphVjX/BQh3zVFSs1epsv99HUuzadkBGWtvws0o828T3KDKj0Wxg3959eMMbfh0TExM499xz8KxnPRsXXHABjl9/HPppH/2e2S5jl+bT32Vx3BQJgZGREXzg/e/HJz/1Ker3exgbG3ckeekEKr6vW7fOvE+E9mIb3W63DPlYcqbiJV/6E7A9S95jV+a23iDXNnWlZdgJ5OOcFYejygOlWAlqIp4KSX4X5Fwnh9LDKoF+nguCtnPe7HsMFehu9xndFFiVGHVARDF6nXmsnoyRCCol1LAlCEnbPDcHcIjCy6nOGpDISSDPgRXjMe7aleFr/7EVY80YIgIasUCSxIgilPvOBBVniKOI4XEheVii3+thNMlw/hlrcO0z14KRodSri8/i4iIkM7IsK/JFi0JJAJApV3kv76I10kKz2fK8w7UWRt0KFDBgyFyqMucTE+h0u7jllu/Tzd+4GevWr+ernvc8vOa1r8XJW7YUpRtMtTHW+aXFOBiMVStX4l8/9jF8+CMfoWazibGx8RLWTt8MsJSIhMAJGzciy9JSws3Pz6PX6xVhj1Lf9hwObo5mVYJXDBnTjK2SVj62isUlTg/V3gL3rTO+C3sCrk1WpsWR+me4qR1QMD141Kui5nl76GVakjd0QUA/J8x1JdauiJBJIBKAEDE6nQ7WnMBYMTaCnpQQ/gLYI/CzyoupSmbkmQQzIC21EAwMBkryNOImZtMMN/9kb2U6FPixl4sB6BOsBQCB/fi152/gs89cV/avP1NTx8pTbPQubynzIhNDPZdnGVaMr8DExATm5maRJEltzmYVWfU1C2mLKzt37qQ4SdBqNpEkCVasWIH5+Xn6z//8T3zxi1/En/7pn/KrXvUqLCwsmHJ6liMFBDTiBvbv349PfeqTJITAYKAOArEPAzXmijqFaHR0FBuOPx7pQO1rjOMYx44dg33AYx3OhahAazQh/0GpjbmeFQtGZmy2I8X1KgyjDCPx4+ArloroySsPZdztNf72kmrbtnxeYqCWVCtfcGxLBYzZdo5G3MCgX9QfiQXyrI+JUYl1q1fwkwdnaaQRe25kMw8DVy68r0ray1wiJUUSQqoKV4BQEo+U9Fvs5BBFUaBYqETjgClU9ugoMWxtOICyU79860H6yb1HkDQSyFyWlYgPHz6CXrenz/wudqDL0qaTuUSaDrD+uOOxfv16PnbsGDUaTctWhIMcZZIxme9q3SyOo506AAb9Pgb9voKFIDSbLYyNj2F+fgHveve76Pzzz+ctW05Gr98zNVFKFZoRNSIcPXYU09MzRRvCCmRX4ZRlKdZt2MDr1q8vcmKVU2b3nj3WU0XIx5uDL6XDqB/CBZSSwVT+otKnQeS+HWrRuRpKneOyapfJb3OaYB97uOY6ShMuVB/QlpjLC8iGzFz31EnNRQ/O5IgjP/YlMRqn2LJxDbJB5m33sYitAisq/RWZzmCRRdZJLpXXMpOlGz6XWbErnJEVP6lkpHn1Z1D8lNf088X1vgRyAUx18tKjqBft8OHDNDU9bU4jLXZ3Z2mGLM2QZmlR6wM46aSTyuKu5TxR/wnnEepNoyj3tmkzVErlaZybm0ejkSDLctx1111Ikrg4rVV7OtXZdloyCxGVKqe969zV0lTR2TRNsfmkzZiYmECapWU6256S4GwbPKC3FcxieJaNrm/pam22w1BnM4VQcpj2UO9M0dFaPWaLwWmWXLpHbSr0qN0ZUyC2ZY/YuLqtyQVSrdQ4qARMJS8OACCwZyrDIFO2UxwTokjFePLeDM4+5TgAuUXwPiPw6zEXY5RcnI6qMkByCeQ5FwcTSqRFKT5Bstz9a2fjq59wISH3Obf3TgbMDEweKDMjjiPMTE/h8KFDyLO8PGdb12xM01SVg2BGu93Gqaee6iKPqzu56+jD3dOyFXFQUeHL2Gh61GoLVFGDhIt4IJu4oHZ46FANAUUtS3IYiu8bYAZOP/10NJJC0pPaAbJn9x4zL2sKIb5ZbTf8cdR83+wgq9htXcNs4XJwMOZBZnYPZGRCUNNzPXuW19MW395kq8zF0ustddgJRttP64Gw5+VkS6EVhENzOfUGzKOjClHjCJCigcW5aZy1+XTlKQsCwNfDDdCLEvbIcgXEPFeIpzyAinPmYGQZlcQhFHaiNneNGfZm1ept5VCJIr2THEVsL0J/MMDu3btx3HHHqeN7i2BwnmflYfVEAvPz89i4cSPGxsbKLA5/FzpZv0yag5m7ywOoOG5Ku8GlhVwGqlEcQZ85oJs38UqUrn0QFfVOhKvpOLimVuTMs87EIE0BUnmic3Pz2LV7F9mFb4MKni00tHe6xvdXloGswdW6xivaItvMkz1nikuE+nT34l2LeDyJ4iuWruTyHQ/+kT+enLNSi0KcXk+K2W/ddZ3EEWGuyzi2mGO0ISCE4rbNZoLO4hw2rU2wZuUY0kzWgDAUllCz0yqk/yMLl34uGWmeI+t3FSCLs9BU9Sq/WrGAKILFkS60GlnPFteiotpySF95/InHIVkiTVMMCimX57LYt6fUtvn5eaxYMY7TTz+d+7pKsV4PjVhkmJcTOij5hNEu7HiiqsZlqn4Jaye53otnVN0UWZ4hl0XAPs9L9VSQSXkztpYhgDzLsXJiAmeecaayG5nRaDSw/8B+HDlyBI0kAerFiKW1WKGgOlcBm21lIU3Hx5EK3IqGXfz13XsOcCGMSAvhItm0YRGIqxqGPUX2HrkAUhOW0LFrAGr9p0vg7TySYsVoVCQJq1J2/UEfq1sDnHvqeu73Bg4HqgLVHpMuyCOV+pgbNSmXxbVMludfp311eGGJhE4pOo2sVtWsKIIg4VTRMrG7qMp8CkBv3bqVFhYWASKkgwEG6UCd0V2c1d3v95Q9l2Z45jMvQ5plZosSu82RpU1qyeanv1kggT6kpFJduhhrmmXo93pICxU3y7PSvszz4gzxIuOfrDMJtF1Yfie1/2/LlpNZhQSU/d1sNvHoo48qW1AXg13Gx2HWDvNmg59AwFwxThf/bHJHa3R8A+avi2ququnqOB6w/SAfeZKpNOfs/ktXnOFefr13760h4PKwxe+wmMJj+/pIU5XvGIlCLaQInM7isgs2g2VW5OcZg776KcZb2GSDVBGWPv5KFvPIMonBIEeaSqQZIAsQ+iXN9TX/4Hgb6XRiM0E4RGqvmJYMR48ew549e5R9qqVJIVnSNFWZH4Jw5PARnHXWWVi7bh3SLCtDPdaiDmM5AbCU1ACdmO1LuCxT+Zb9fl/ZlYMUaTpAf9BHvz/AYDBAnmeOLW0zTl1qVRAhyzJccsklGB8fV9k0hfS/7777hmJLdSnrnCbmPAxHo7U88nYzThOOh8fyZDojMzRSpndZayDch1HVjx1PMbv96Vd93daTmp7EtdrxFVV7QuF7to7OhVdr++GMDs1mSOIYktXZaY1mA7NTh/DMCzdjtNUoMjNqnDZwu5UMZFLZVHq/ncxV/Ust+QapxCDNrUKzVYeMI49Lrm55pPQVYdRqVxIbrx4APHD//WBmpJkqAJulaelE0U6KdnsRvV4XVz3vedwrzh7wzDIsk9SMqaHVtArzUI9lqXHgDAYDVcLP+emaU3QC2UO6d8kScRzjmZddiixT1briSB0O8uCDD5bxyar7qzobW2o7KqBn/XDgfwdWWgw79/01rIMbKiK0xop3eGI5ePeEGRd+1VlU3CDqN9tjMJyitNkqCreZnO/CJgBJRGinwKN7+0gitS2fBAMUYXZmBiesYpx72ibu9fplFvqw+ap2C2KTKEIDyluZpcpDmWWqOKwq5CNLIFPNj1kHKtVW975PbDZczbUHHniA5ufmAIIJhOd5WR16MBig0WhicXEBY2OjylXvOAVCiFIqVkG4GKHke1vdV0pJm6YYZKmSbP0+BsU1tb0I5Ysmfmy8vL1eH6eecgqfe8656HS6IACt1gi2Pb4N+/bto2ajWc5nqFZpq4g+s6973HFc+H4JrrZV2ymXtmOIKM35cJXlrevYUK+ry3pv8HAuWhHf9kIGxlKRRhbyAsAdW9vo9VOwlEgHObI0RbcvMXtgO6669HTIPIOd9IrKaJQKUOJBYbPlUu1K0DZcnpuTeljyEitv5lbHDeuUa1/iCSEwv7CABx58AHEcl7VNpOTSxmw2m2AwbrvtR7jh+uspiiJkmXRhSlUjP7Ty5TUrc6TyTvEniiLkUtmSpeMky5AV1aHTVNlw9vvGQ2nml6Ypnv3sy7FqchJ5liGXOeIkxh2336EC6HGM5XwceRRg0vahKxWHic3wC2S2db5gkWLXsAshQPlvrB9xkL/s01OJHEeJ26HxhtueTjZ2n0eU7jhKw89t1hmzd3BGIUW5cJI8cSij3Ye6vH4yQTcHkjgHEGHnkztw0ZmXY+WKUQwyldUfMuFMzEpLXJW5khX7r3RMKiqK1zAr1bLIF8GyKM+brQ+LKk8xlag1rO6+6y4656lP5dINT4Rm0gQRY9u2bbj99tvp2NQxxHGMfso4fk0TM/OpZRK4AX97mW3HibG3zKbUSpyqJDxSDpIsLxKurd0SpALZucw90nZxi1mi2Wzguc+9Eu3FxcJRIzA/N4/bbrutGJcf4Am6HlHGrVCht/ItsnDIuWOr3FYubxArK4Dk6uNwhYXQTVANYTq82fIm+UPwgejfrzpOAPfS0uawX8VXf+KIMJDAz5/sIEtTLLQHmJ0fYKEtMTUzj4m4jSsuOZO7nR4iISpz9dNwdGaKst+0pNOn1RQMTVKx+9rlpBUnkj1ucpHMDYDXSEBL7SQiHDl6DI89+ghaIyNojYxgZKSFnbt24Prrr8cXv/QlOnbsqAoXSML/+LWzeePqhHuDrOTsZW4qVRHSgYUd3qkwA3e8zIy+9lCmJkSgM2C0UyfAxwGg2HvXxdOe9jR+ylOegvm5OeR5jlazhQcfegjbt2+nZqMR1iiMLQLbNAmx7op010RSsWtdGzs0Z2+RKjwIgRas1K4qkui5lOzAo/JqxkRAUbPEouMpLf+rcaws8XEYi6Xy3LtrQAvtFINBinYvw0Knj35G2PXEY3jBs85EVIZ+QnzPXgAV7M5yaRUpUp7KPNcxOBQSzuj3Dq8kCkpScxiItzoBGNiZKuYsN+Cen/8UEeXYueNx3HD9Z/D5z3+Bdu/ZS0Qqx/PM0zfxf73/WpZTh3H3I8docuWY8ljClF9wygIyqmO1iIzq5mE1MOj1kBWSTO2Wz5UzpSC4XOpAvG2/m87yPMeLX/xikFBFbfUpObfddps6kCSJa/Hd9ifYhZX0xWp/MN76Wp+DjWxsXrDXyYlpwEdpR5ZQQUex3a6RZJYUsQfLBfT1X6cnl7SpSt8BEFlvLl8jM+pl2bVSX/bOSGw7mGLzWoF+WhSeiWPs2LkHl5x4AS54yma+f9teGm01kGsO7tNe8V3ZRmpbSFTsOZOSIEFAXkhAGcHPttHevOEZjHVFlsx1+3t5FhsxJICZ2Vn62Mf+BYeOzAIA4kggyyXiuIHfeOWl/PsvWYevf+PHeP/XDhIR4Td+4ze50+niox/9CI2PjyubK8+ddSMLlhoYQY3KWQeNO1IF4/NMbQYWAnaZhUyoLUVVT6z6v9/vY/Pmk/iSiy/G1LFj0EdpHTlyBD/84Q/V85I1YsFhbTorx8I0X/WtYmCoEK0VK9CufDuFLNi+u6aaNshuE26Vg4qE09xAq4EWfZs4nhkl3FEGHyjH4+vLZBvP9mPL+GjV0q4xwgDu2THAIFP2lWTGIMvQSwk7tj6AX37++cizrMjCr6/6JAqCUSXUVWa+yqcskpjzHGmWI8tkueGzdARozxsbBhjMWh8SvfWzb0z8TsW+ev0cR47OleeuZbnElc86lz/7vhfzO146iq/81w/wNzccJAC47LLLePXkJDadsAG//wd/wJLNZtWKd9TJlSwmU3JnSwUuEEVPIUmSMjyRZ0VCdek4UWfXaQlXIlkhZdXJrn284uUvR7PZRLer4nmNZgN33X03Dhw4QK1Ws4RLOTIyARaDNwH/peMVYWfcrl5mOUos72kVw6sHNDrYG3BI2RqCqDxfwsM36/1mrPmVOVhcDqjyfAi/bK3E+1sXtAw1oNQ0xRW3HZY0vZCBoOJVaZojjhM88eQOnLy+gXPP2MSd7kCVRHCDiSXfEyUcpNqImitVMs2BXKpx5LnKNolEAcRSRLDlPTW21/B5oH5exTd1emmERhKXB0RKybj4/NP44+99DX/498/Eqc0n8Y3v3o8P3jxLEsDKlRN44QtfiOmZaezdtw9bTjoJf/PXf80bN27k2bk5EIA4ijz72yE3Mwc7pFAEcvVG0ZHRsYKoJLIywdoQYJ7nfk6FgrNQoYCTTjyRr776akxPT0OFPJQD5hvf+EYBB/uc9oK0uIorwd0fQOFAMQzEue19Z69t1+wJkbXvlwidwEOlHBK2/Coj8AGpQ2HidTsrKMvX010V2ZqlLTb9tpZUMY0hrO2bKBLo5cCj+yVaEWMwkMgyRpYpD9nOx+7Br77wEmTpAMI5ithSPRiqPEJRy0XvGNDbdaTeBU4odg6kRXFWNqhZSoJij105VsMjjRRjz4FieUSFCvzGRXJwt9tHrz9A0khw9XPO43//h9fxR//4ApzEW3Fs1wO499HD+F+fP0RTXaWCvubVr+X24gIG/QHGV4xj9549mJ+dxTv+9E/xa7/2axxFEebm58s0MH2CqS3KnJhhiQeEOI4QJ0mZLwnAOo01K2OEea6TrIsDOKzECiEi9Pt9vOzlL8PY2HjhdEnRaDTx2GOP4b577yVVaVkGVt5CIcup6DtM7CrV9jrb/HEYzi3t01uGTmYRYeyqeaZjM3hyiUUXFaq4iuEZZGTZeuQ2HCAuqljmIYq22zPIqjL8CWABQOLePZLOP1FwJAg5AywZI60G9u9+Epef/TRcdsHpfNfDO2ms1Sh2BNj9MZKIWJCSbJFAkZGvvKFq/npnPCGnJjJWW3monF4hMR3Qav2eA4xWzUlaKk+WSaRZWqaajY+P4NILz+BnX3IyLjtnNTav7KE/9Rj2PjaFpBnjnu3z+OCXj9BUngCc4tprruTNJ23CwUOH0WjEkFmOZiNBp9vB9ieewNMvuQTnnXsu//RnP8PPfvYzHDh4gLgoqRDHEaKoSKSG0XYYKuCeDgbI8hxCCGzYsAGrVq7E4uJigR6iXGatzWWZekfbt2BVi6XX62HLls38wl/6JUxPTyFJGsjzDHEc4aYv3oQszzHSMOUOywM6qA43LK3AzpUskcxFLUdK1TF4h+Lq6sJoPHYbKfsmc6BHbAx3ywPjq8Kl7A44GZb5KefrEV3FFKwQm3WD3Gtm3MYGiSPCwoDx852M55xJWOxzkV+pdoM/8eCdeOPLrsLPHtpe1EOUxXlfsmR96iCJoiSbNAcv5gwQ67J2Sr1sjIyi1RBoxgAgSgkgmQr7zyx7uRtDq+yk1RdFaJFQ9VBarQSrV47xxuPXYMsJK3HaSRM468RxrBsDqHsI00fuxbZdXTSaTRy3fhw3/2g//umrM5SRADjFJRecxJc+7TQcOjKFRiMxpjsDSdKAEAI7nnwSzVYTV15xBa666nnYvWs3b922DTt27MDRo0ep02kXKWN5UQ9TSdrVqyf5+OM3YPPmzTjrrLOwZcsWtNttLMzNodFIILk4BZX0/AFOVcZ/melDhCiK0G538MuvfCWSJMHCwgKiKEJrZAS79+zF7bffQXaJPNsxaBi6SZA3vJ5LXl+hlxL+ps2QhLSR1pCGkY6WkhkmsEpb5o2Yal62J8BUYQlBeiOPYDz6t1DOft94clDhXp73c0isyjAMASKJe/bmdNYG4lVjRXlIkogaDezdfQCbTzmEVzz/Qv7Cd+6liRXjpctcdylISbU0Y8SRVPmSxarK4hw6yYRjM3085dTjccM/nM3gHqI4BkGUUlhVq4qUF5VQSEZRSjHJOQChDgHJMyQxoQFCnORY0YrRihh5dwbt+UOYPTCDJ9s9iFggbjQwOjaKLEvxqf/ahZvuXCSOIiDPcfrJ6/m1L3s29s5NQFAOlooANKcVhcNoZKQFkMCePXtApMqpX/W85+IF116LXErWeZD9Xg+qaJMihvHxcbSaTUhmzM3OYffOnYjiGM1GA3kulWJNBCFM7HLNmlXY++ijSNMMjUYDURSh0+ngwgvO5+c993k4cuQIms0msizDiiTBl770JQwGg7JQrO3pczGqpAuHV7thIy9EUOK1wT/PsrAkk4t21fiejaqe59MhDuPBjG2faiUgDIQ0wBqkt4eqJZBPJLZ0cxytCDlbluezNBMgIjARIhGhn+e4a0eOF58v0M1U0dY8y9EcaeCnP74dr37Ra3DnfU/iyFwPSayqcNl2oSx2CSRR4ZGWan+pRioiIBICj99zN8ZHYow01I5z1lsMQYhjgajYuFoWwSXlxqeCAG3Vq58zunkOIRjTMldqWxyrYqgUI2q2wBIYbwocmV7AB79yGD/fnVKrESEf5NiyZSP/9stPxb997k485/kvwbo1qzA3Nw9IVbxV27tKEiviU8WGVNXmgwcPlZIsjmKISKDZbJT5rYN+Hwfn58ttM0mSIGkkoCKORoIAScXm2BwjI6NYtXoVfnT77bjxC18gURK8cgK99a2/q9hwkY0yMjKCrVu34Xvf+54l3TwHUoFTbkil/rxwP9xV3XBKjhuxJOrAJjq7Rmto82rVODN4r8dhnYBqEKCcWEk7bud+fMYlNhsI1mEc1h9ya5rb5Fg4GqgGOHDG4Cb46mA8lYVhtx5mOn8afMIkoZcqyRUJQj/rYcfDd+NP3nAt/8k/3kit5rg6qpgZRKxsNRSOE2jJxk4oKBLqh0hVDOtleRGfy9W7QiAqSpMLYQ70AKG8hkI9FYKKgsoqWB6BQNQAJcVzApCZRBwJiAS4/f5j+OJtU7RtGohjgd4gx0mbT+IP/ekz8P6PfAMPb+vSzn2fwtVXX8NPPfvskgC059TeXqNPpInjpDzOV+1ISMEDd08jA4gTxQB0HC8vThXSKUtpmiJJEoyvWIFjx47hs9d/Fg888AAJIdBoKHV2fn4er3/96/i0007DwYMH0Gg0kBW5rtdff31RmatlrbVtJ1nIZOFN3cepJQljPlUzZ6zWPFvMLnZk8M6t2hVA58oAGQAlseU3CaRN+XYVuW2Ya76OXIyuKuWqABn+3QDazfHzJ6XVtKKEXK5Sso5fAbzm6TFnuWk7jiN0Fnt43rUvxs33TOM/v34nrRgfA7PEYruL11+zns9e2cdcJ0UjFuVpopKVlNMbXeNI/QghwCAVIiCojZoEp1yCJjqdcaB3PpcLgaK0A9S5jtpTKSWh1RSYnBDYc6iHz//gGG5/rEc5AVESYzDIcNaZp/MH/vgifOXGr+Ffbu1QHAtkmfLsnXTSSfy85z4Xp51+OsCMTrcDZkYcxcV5AVxIu6hARL8IjgnGS+ayZDmKxAC9AyCOIoyMjmJkZATT09O4447bcfsdd5DepydEhEaSoD8YYMvmk/ijH/0XFQaAUjtXrlyJu+/+Kd7zd39HSRIjElFh81XDKnWSpC626R+oGPCJO7hr/7UZOwFlzrBv69k0YfpwnTEMgOI4dmPSVuS+RHgv4FGxsnz8L8fvqgPukAyB1QjIkmCdpFq4HdrD03U3pGRVUq4Ifj/rlIgvP4Ow0FPEUiYhZxJXXPd6/NVHv4eHn9xHAHDB+SfxW64awe5HdgBJQ0mzyGy+tNPZlNteSTnYRCUIsVDvqURnFKollXChQgrb8xOFZFXVlxmtRoRmAswu9nHPtnn84IEO7ZgunLFEyHPG5Zeew3/160/BIz/+Lv78s3M0sBBC1z4hAKeedho/+1nPxllnnYlWq4X+oI9upwt9pHK5eRYa7mQ4uWZmRdUwKfPS2RDHcXGeOHD4yGHce++9uOeee6nT6Zj1JSgCL3Y5vP+f/5k3btpYOkoAdWDJn/3Zn2P37t2kT82x45AuklXNEY34xiPpElCY4DRx+Vobl/8HacGScr6mV5sYX7RrCM4Z1TCJ5BGM8zXEP9xsEgOLgG7uap+OE2aodPMITiOHLAqnRgS89pKI168E+qlAHKlKyIM0x+jYKpx9yTX48w9+k55y9kZ+8SXjOPjoQ2gkKDxtigiUCmnGrAiNABKlqkpC/Q8SiAjF+QPqnUgYgnJtXJRtRkKgmURoNoDuIMPeoz08tGMRdz3ao4PzACJAkkBaSK/f+pVn8RuuWouf334r/s9XFmj/YnUFtK2mY2XHrV+PCy64gM899zyccMIGjI2NQQiBLEuRDvpIs6yEn+H2BbJYepUgVYdzdm4OO3fswAMPPoDHH3+CdD8lsRf9NxoNdLtd/M5v/za/5CUvxoH9B9AaaSGXEqtWrsIXbrwRn/vc56jRSFQam5ZuQKUuU2mXeeLH1TbZJSCDrWUjtapoKDPIQfNCTeXhCXw+boILgrMR3kisGhdGQLxXHuXqDbI4TslFrQaCNGsxMbbaCA6MYalD+vinvJR4a8eAX39mwmmOwjYDICJ0231cdMnTMXHSGdj54E8wdWAvKIrQiEkV4ZKFQ78IDSgJWUQQCtVRq5g6WE3FM6IooWAkH8oULS0dRaTOKiAB9DPGkbk+ntzfxSNPdvH4gZzm+grhcgAgUZx13cKf/fYV/IxNfRzYdh8++M1F3LcvJ0HG51bh7EViQKYPkyTCcccdh5O3bOFTTjkZ69evx+SqVVgxMYHWSKsodsPFQSMput0uut0u2u02Dh8+jH379mHf/v04ePCgqrUCLflFGajWCQmK2Hp4zuWX81/8xf/Evr170Wy2IMEYGxvD7t178Jd/8Zc0SAdIkrjUJnxNBkHGDU/qBBA9TAJlO94LhgY8AVDXNg15xh9DSXBmYXxMRuB+2M4KxgkKyPghMyPh3PbqCXhpj6Vtf5RViXW1YmZccFLELz5PYLZT7GNjRrMRg0bWYWbqKIQcYOV4gkYs0MsIIiI04yKOV8TYkkSgkahCQRAx4rgoXkQRkkYDcRyBSCCK4kLCycJYZ2Q5kOcpSA7QzyTa3QxzCymm5gbYdXiAvYf7ODjDNN8v5iOArAiV6NLeTzvvZP6fb7oc8bGHcXDfDnzt7g6+/ciANByd8nQ1XFircVK6KVeNRoLR0VG0mi2ISLA+3jhNU+oPBuj3eugPBpXMD38Hgp2dkiQxer0+TjnlFP7A+9+P2dkZSObShm00Gvjrv/lbbNu2lZIkcepfDotzhfAuiPTLkGTsv+359OqJKVRMOOQNNGNwVcqQGz9ADI5IL8W9dcNXDYtfJr9QcwYKU5j21Hr2XHUylpZt6dJ68Q3RSaAIwr7o3IjP2wRMd0iVZJAS9zyRY7YPTI4JyKSBh57sUdxQ0mtEcLGtRztCUJQ2R5mTpcCgpZuaQFycX6iPiGNmZAxwzsiznLqpRLcPDAZQVZdRnDVQqEaSjZ2Y5RJJEuH3fuNqfvEla7DnoTvR7szjBw/08KWfdwikyq+p4kSihI1LdByUAPZJrgzDqEIf20XvO1dsrYXKVDvlzVwxPo4PffhDHAkVf0sSdX3lypX45Kf+Dd/85jfJhC3cQkz1eZKmX+eWFQfQW6CcvRslyrDnCbew1fdS+nhX6cN92iUdqw/WhWAtr0XoXO5hH+PhtyzPoIy1RjiUsFm5y4u/BughxyuZv6THYrhsiVBF5geB8a2Hc1rRinnDKqCfSWSScfpGlY7UFIx1m9dhbN0o3/qTbQQACyhSrmAfBMHlsIaNatjHDqwyFcRWhGGIlLs/yySynPHcZ5/Dv/PLF2Citw8P3nYzRscjfP+BHr7y806pkJOHqEraFWlorHI6ufB02Am2dgHXJcfsefDK+ToEooktKtfiXe/6Wx5pjWB6agrNVhN5nmPNmjX4/vdvrRCb8FTJci4ISypDLIbh++lXhth83PPaLEJg1X7I77BsDrXPWphha3pJHFfttkpI3XNsWB5NwKWvYdplyKZzEk5tG9gSu1RtyEECMxxykML8qG012qEy1iD8xmUxj7ckFnuAZFEEshntdo4TTz0Dx/KV+M+vP0ALnX5xzC/Xctn/Pz7Ga0nFxlbg7DNO5De/+tk4/wTGk/f/GNOzc1ixcgRfvf0Yvv9YRpl+r6gRKSw3un0Cp1NawSI4Z0eI574eikKVYLTt3TTj6fV6+Lv3vJsvuuhiHDhwAK1mE2mWYsXESuzcuRN//dd/Tb1ezwnKl7vbPYRbyhZT86zDQXYFDxknXL3dF/aEVqQ6bKLH0u8olbIUD6VaECYYuy3LCUJGPQyqLe4vZ7FKj11tZ6G2XG+KJ72LO+w4Ukp7riCc41YQfv2ZMfdSiTRXnktmlR+Z9jOcesomNNadiRtvfQI/fXgPASj23DG0xlU3yopPrKIam48gZQPlUpZ22lNO28ive8VluPS0cex77KfYu3snVk2OoZ8BX7ljBj950hCb8ugZ6VYG/2v24NnEVyFEewbeWEMM07Yb9TNCqO0+3V4Pf/VXf8nPvfK52LVrJ5qtFrIsRzNJMDs3i79559/S0aNHEcdx4VCyzy5QUs47cX440bk8w8XhJb2JfgDAxWOfHqrjCHn5tF3khhAcp4mz6bFmOO5JNGEkCiKiJzGDAW4rHuDzCacb+4snEt3SAez+FPVJ9AJsWiXwigsF54WhRaRyJJNYAPkAzeYIjt9yDvYvJvjaj7bhiT1TBJiS3fo8a3+xK9O2OLWOvZFQJ5xqF3+SRHjmRWfxi597Lp56YgPz+x7Gnu3bMYDA5MoRTM108OU75/HgQSZZmL76wMe6snwhxDLJ0ijhYM4bhzUXF4mqBOeuIwFFVWRGr9fD//zz/8kveMG12L17V5GZIqG32rzzne/EE9u3kyvZRBX/LFPHXmr7C/vU4MG+JLUha2TDx7e5gsy/oroGwg6wPPL2E8MIzucYFqQdl2iI4MJDgMc1vQX0CC6o2liGLgUGadnCFY6uYkuyDAZLBk5aTfjlp0WcS4lMUumoEIKQyxzdbo7jjzsOx285FTuP5bjlZ3vx8BOHKdN2DwmVbeJ41oqFI4vncVFqL5PlkJNY4MxTN/GzLjkDl59/IlbQAg48+RAOH9wLEhFWrhxDnDAe3bGAb/2sQ3vmisQxS20L/VRjlmzTk3Ut5BqvV51tNd9eDyLl+UxTVTzoXX/7t3zFFVfgwEGlRqrzxxtoNJp459++E/fccw/FRVl3fS46eUw4nIJlEH44g7PmVPss+02Gn2J22lzKieNb9RV71yU4oEoinqfSA4Qr+YYtkrtYqHkn3I4Zw9ITdglOI5ZWyyWbo5QEKaLbvIbwigsjznJGmhMasWpE5xmmaYqIGWvWr8Oq405CW47gif3z2LZnCrv2z9PUTAfpMhwPY6MNbDhukk/ZtAbnnXkizj/jBIzHfXSm9uDInsdx9Ng0KG5gZHQUYyOEdJDiJ48u4o6tGU33obYHaeeCZa/5NtRwt40vkdlm7C5wfWVGeyE9wkuSGN1uF61mC+973/v4vPPPx6GDBzA+No4sV8eFJY0G3vt3/wt33HkHRcUucxEZpgGtSiLYtTuDitOmDh9CjMbML2SK/Pf6sWDp+EFoKYKrOkHqPuRJE3eda1RMn0OGVESj+g615WzAVZ4rJ2DbKuFwgSa6E1YSXnFhzEkEDHK1S6C0BwtPZ5YOkGXA6GgL69avxejKVeC4hW4aYbYt0Ukl2r3ivAFiNCOBlROjWDUxgvHREayeGMF4Q0K2j6AzdwxHDx/G0WPTEATEzZba5hKrs+m2Hxjg7q097JoCLeZqOtrWEYVEQOHOL4msCM6XotXyfYUFBdcyMMfQ9xfQajsu9rJt3nwSv+td78Lq1asxPTWFiRUrQCJCo5EgiiL83f96H+64/XaKo0jNRaeT2WoAsAyGYWlXw6RgMamAdeY4UICl8H25zrKqTheyOU2miftrWQ06DQXf12onuSsfIMywtBs2HgugNYSuJx2y6+wDAzXRrRsnvPqSmMcajMWe3g2AIqyAAqeFOjZqkIGlOjBxdLSFFeMjGBkdRdIcQbOZqGTdSCAiiXani26nA5l10el00U9zFXwWCRgR4ojRShgSEkem+/jZtj62HQTNpkBxnHhp5zievFKNrJ+/YYwhR4qPjpb9UlkHOIxRE/1iu41LL30Gv+1P3obFxUV0ux1MrFyJiAgTK1eBiPCud78bd999N0WR4mLqBCGqSOSQeRJAGtecKUdfDdCEnSxcERB1jr7S8VaD+xVCtu64fVsamk1wVafIEhImtDC+cWV5PsOhN+NadgdOgQUI+aHsvwHwmsznUsTbRKdTvzRirmgCr3xawhtWAvNdRlLUptbBB5U+ZQLTACEiCSIua1hqJGomqiYJSJUtiGMBhjrgMBKqpqUQjP5AYt+xFI/vHWDHUaaZHtDJzSxVCplwsuddYlt6nepVcV7W+3YvcRyj1+8jTVO8+tWv5ute+ELsP7AfgggrVqwAkcDq1ashmfHe974XDz30EEWFQyUSovRI2s4x3UGo6re9liVmuW7IIIp4Vlr5x3fEDbXHuJ6gQ8+6jid7FOpGmWkScDbCUW6XUO9cJhsm2iocjWrpBgdsm811AiwnMF8+U2Mw+zE6WexM1qOOBPCy82M+b5PAbFdtONV1TCLicrzMAJNARCpVSYJKNZtI5UhqTt6IgWasCYaR5TmOzqbYdSjDjiMS+2ZAnVxJNINz5Ln8AZvgzLJUNYWgOgOgFreWeEAF19W8FhcXccIJG/gtb3kr1q1dix07nsT4+AqMjI4gjmOsW7ce01PT+Kd/+kfs3bevJDazK8HMw4zbR5mqF7o+d5ErhBZSIxl1UwwJmJBDySJQtlR3g1hLOmhcG8755Qc2fGLwnClARbgNjacF7TnX4Kx/b7hUC03YtjdVF56kK0rP2cN/xskRP+cMAZZA4b0vJBsQR+q8apn3kSQJ8qIEuoqrqa04qpaKKE/hafcljs7lODovcWRWYmoRtNAHuhLI4PI2VfhVq13VTA4Dj8D/IbUQPsJV4VddO0vbIIKUOfr9Aa655hp+yUtegumpaRw7dhSjo6OIoghJEuOEEzZix84d+MiHP0Jz8/Mq44SldU64aW/4mlqenGU4yn6R7H93/nXaXDWc4OhgHo769nDIUcNANXk5tEAVYgulatcuWrXdkJRTjy9TtVmmGlUBMet0JwMkvcNZlzO3T71kqFjdSy+MeTSRGGSK4BiEiHKs37QFe6eAx7fuQhQrfSgSQEwEKYFexljoAd0+oz9gaveBbmGXZayILLdWxXgajWTTcDEOLcNVq0hrFtxfx+V+fDVef2dmjI6O4Ld+6028ZcsW3HfvfYjiCBMTKxRjYGDV5CQefuRhfPaz15OWaIBrf1aILYgnHjPwUpG0K8RG8KUy96v3NSVRDSq5TLrOsPHe8M73tt4orv9/ysaG+ChjcNgAAAAASUVORK5CYII=";
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
