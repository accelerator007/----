// Lucide-style stroked icons. 18px default, currentColor.
const Icon = ({ d, size = 18, fill, stroke = "currentColor", sw = 1.6, children, ...p }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
       fill={fill || "none"} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" {...p}>
    {d ? <path d={d} /> : children}
  </svg>
);

const I = {
  Home:    (p) => <Icon {...p}><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></Icon>,
  Grid:    (p) => <Icon {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></Icon>,
  Trap:    (p) => <Icon {...p}><path d="M4 5h16l-2 14H6L4 5z"/><path d="M9 9v6"/><path d="M15 9v6"/><path d="M4 5l-1-2"/><path d="M20 5l1-2"/></Icon>,
  Bug:     (p) => <Icon {...p}><path d="M8 3l1 2M16 3l-1 2"/><rect x="6" y="7" width="12" height="11" rx="6"/><path d="M3 11h3M18 11h3M3 17h3M18 17h3M12 7v11"/></Icon>,
  Tree:    (p) => <Icon {...p}><path d="M12 2c-3 4-3 8 0 12 3-4 3-8 0-12z"/><path d="M12 14v8"/><path d="M9 22h6"/></Icon>,
  Reports: (p) => <Icon {...p}><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></Icon>,
  Bell:    (p) => <Icon {...p}><path d="M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8z"/><path d="M10 21a2 2 0 004 0"/></Icon>,
  Settings:(p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 01-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z"/></Icon>,
  User:    (p) => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></Icon>,
  Users:   (p) => <Icon {...p}><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0114 0"/><circle cx="17" cy="6" r="3"/><path d="M22 19a5 5 0 00-5-5"/></Icon>,
  Search:  (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></Icon>,
  Plus:    (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>,
  Filter:  (p) => <Icon {...p}><path d="M3 4h18l-7 9v6l-4 2v-8L3 4z"/></Icon>,
  Sort:    (p) => <Icon {...p}><path d="M3 6h18M6 12h12M9 18h6"/></Icon>,
  More:    (p) => <Icon {...p}><circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/></Icon>,
  Chevron: (p) => <Icon {...p}><path d="M9 6l6 6-6 6"/></Icon>,
  Check:   (p) => <Icon {...p}><path d="M5 12l4 4 10-10"/></Icon>,
  X:       (p) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18"/></Icon>,
  ArrowUp: (p) => <Icon {...p}><path d="M12 19V5M5 12l7-7 7 7"/></Icon>,
  ArrowDn: (p) => <Icon {...p}><path d="M12 5v14M5 12l7 7 7-7"/></Icon>,
  Arrow:   (p) => <Icon {...p}><path d="M5 12h14M13 5l7 7-7 7"/></Icon>,
  Calendar:(p) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></Icon>,
  Map:     (p) => <Icon {...p}><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z"/><path d="M9 4v16M15 6v16"/></Icon>,
  Pin:     (p) => <Icon {...p}><path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></Icon>,
  Wifi:    (p) => <Icon {...p}><path d="M2 9a16 16 0 0120 0"/><path d="M5 13a11 11 0 0114 0"/><path d="M8.5 16.5a6 6 0 017 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></Icon>,
  Battery: (p) => <Icon {...p}><rect x="2" y="7" width="18" height="10" rx="2"/><rect x="22" y="10" width="2" height="4" rx="1" fill="currentColor"/></Icon>,
  Zap:     (p) => <Icon {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></Icon>,
  Logout:  (p) => <Icon {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></Icon>,
  Shield:  (p) => <Icon {...p}><path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6l9-4z"/></Icon>,
  Card:    (p) => <Icon {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></Icon>,
  Plug:    (p) => <Icon {...p}><path d="M9 7V3M15 7V3M6 11h12v3a6 6 0 11-12 0v-3z"/><path d="M12 20v3"/></Icon>,
  Mail:    (p) => <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></Icon>,
  Eye:     (p) => <Icon {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></Icon>,
  EyeOff:  (p) => <Icon {...p}><path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0112 5c6 0 10 7 10 7a18 18 0 01-3.2 4.2"/><path d="M6.6 6.6A18 18 0 002 12s4 7 10 7c1.5 0 2.8-.3 4-.8"/><path d="M9.9 9.9a3 3 0 004.2 4.2"/></Icon>,
  Spark:   (p) => <Icon {...p}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2 2M16.4 16.4l2 2M5.6 18.4l2-2M16.4 7.6l2-2"/></Icon>,
  Check2:  (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></Icon>,
  Alert:   (p) => <Icon {...p}><path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18v.01"/></Icon>,
  Info:    (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/></Icon>,
  Download:(p) => <Icon {...p}><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></Icon>,
  Upload:  (p) => <Icon {...p}><path d="M12 17V5M7 10l5-5 5 5M5 21h14"/></Icon>,
  Edit:    (p) => <Icon {...p}><path d="M4 20h4l11-11-4-4L4 16v4z"/></Icon>,
  Trash:   (p) => <Icon {...p}><path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14"/></Icon>,
  Save:    (p) => <Icon {...p}><path d="M5 3h11l3 3v15H5V3z"/><path d="M7 3v6h9V3M9 14h6v7H9z"/></Icon>,
  Refresh: (p) => <Icon {...p}><path d="M21 12a9 9 0 01-15 6.7L3 16M3 12a9 9 0 0115-6.7L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/></Icon>,
  Sun:     (p) => <Icon {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></Icon>,
  Cloud:   (p) => <Icon {...p}><path d="M17 18a4 4 0 00.5-8 6 6 0 00-11.5 1A4 4 0 007 18h10z"/></Icon>,
  Drop:    (p) => <Icon {...p}><path d="M12 3s7 8 7 13a7 7 0 11-14 0c0-5 7-13 7-13z"/></Icon>,
  Help:    (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 4M12 17v.01"/></Icon>,
  Globe:   (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></Icon>,
  Send:    (p) => <Icon {...p}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></Icon>,
  Lock:    (p) => <Icon {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></Icon>,
  Star:    (p) => <Icon {...p}><path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></Icon>,
};

window.I = I;
window.Icon = Icon;
