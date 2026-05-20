'use client';

export function BrandPattern() {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10"
      aria-hidden="true"
    >
      {/* Layer 1 — gradient base matching card front */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #0F1B2D 0%, #14223a 55%, #1A2D4D 100%)',
        }}
      />

      {/* Layer 2 — full PCB circuit board SVG illustration */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="bgSceneFade" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#1A2D4D" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0F1B2D" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="bgChipHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C9A961" stopOpacity="0.15" />
              <stop offset="60%" stopColor="#C9A961" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#C9A961" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="bgChipHalo2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C9A961" stopOpacity="0.08" />
              <stop offset="70%" stopColor="#C9A961" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#C9A961" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient halos */}
          <ellipse cx="960" cy="540" rx="800" ry="500" fill="url(#bgSceneFade)" />
          <ellipse cx="960" cy="540" rx="500" ry="350" fill="url(#bgChipHalo)" />
          <ellipse cx="300" cy="200" rx="400" ry="300" fill="url(#bgChipHalo2)" />
          <ellipse cx="1620" cy="880" rx="400" ry="300" fill="url(#bgChipHalo2)" />

          {/* ===== PRIMARY PCB TRACES — radiating from center ===== */}
          <g
            fill="none"
            stroke="#C9A961"
            strokeOpacity="0.28"
            strokeWidth="1.2"
            strokeLinecap="square"
            strokeLinejoin="miter"
          >
            {/* Top-left routes */}
            <path d="M760 380 L660 380 L630 350 L480 350 L450 320 L250 320 L220 290 L0 290" />
            <path d="M800 380 L720 380 L690 350 L560 350 L530 320 L380 320 L350 290 L150 290 L120 260 L0 260" />
            <path d="M860 380 L860 250 L830 220 L830 0" />
            <path d="M920 380 L920 200 L950 170 L950 0" />
            <path d="M960 380 L960 230 L990 200 L990 0" />
            {/* Top-right routes */}
            <path d="M1100 380 L1200 380 L1230 350 L1380 350 L1410 320 L1600 320 L1630 290 L1920 290" />
            <path d="M1140 380 L1220 380 L1250 350 L1380 350 L1410 320 L1540 320 L1570 290 L1700 290 L1730 260 L1920 260" />
            <path d="M1060 380 L1060 250 L1090 220 L1090 0" />
            {/* Bottom-left routes */}
            <path d="M760 700 L660 700 L630 730 L480 730 L450 760 L250 760 L220 790 L0 790" />
            <path d="M800 700 L720 700 L690 730 L560 730 L530 760 L380 760 L350 790 L150 790 L120 820 L0 820" />
            <path d="M860 700 L860 830 L830 860 L830 1080" />
            <path d="M920 700 L920 880 L950 910 L950 1080" />
            <path d="M960 700 L960 850 L990 880 L990 1080" />
            {/* Bottom-right routes */}
            <path d="M1100 700 L1200 700 L1230 730 L1380 730 L1410 760 L1600 760 L1630 790 L1920 790" />
            <path d="M1140 700 L1220 700 L1250 730 L1380 730 L1410 760 L1540 760 L1570 790 L1700 790 L1730 820 L1920 820" />
            <path d="M1060 700 L1060 830 L1090 860 L1090 1080" />
            {/* Horizontal center routes — left */}
            <path d="M760 500 L600 500 L570 470 L400 470 L370 500 L200 500 L170 470 L0 470" />
            <path d="M760 540 L500 540 L0 540" />
            <path d="M760 580 L600 580 L570 610 L400 610 L370 580 L200 580 L170 610 L0 610" />
            {/* Horizontal center routes — right */}
            <path d="M1160 500 L1320 500 L1350 470 L1520 470 L1550 500 L1720 500 L1750 470 L1920 470" />
            <path d="M1160 540 L1420 540 L1920 540" />
            <path d="M1160 580 L1320 580 L1350 610 L1520 610 L1550 580 L1720 580 L1750 610 L1920 610" />
          </g>

          {/* ===== SECONDARY THINNER TRACES ===== */}
          <g fill="none" stroke="#C9A961" strokeOpacity="0.18" strokeWidth="0.8">
            <path d="M0 150 L780 150 L810 120 L810 0" />
            <path d="M1920 150 L1140 150 L1110 120 L1110 0" />
            <path d="M0 930 L780 930 L810 960 L810 1080" />
            <path d="M1920 930 L1140 930 L1110 960 L1110 1080" />
            <path d="M0 360 L600 360" />
            <path d="M1920 360 L1320 360" />
            <path d="M0 720 L600 720" />
            <path d="M1920 720 L1320 720" />
            <path d="M120 0 L120 300" />
            <path d="M1800 0 L1800 300" />
            <path d="M120 1080 L120 780" />
            <path d="M1800 1080 L1800 780" />
            {/* Additional subtle cross traces */}
            <path d="M400 0 L400 200 L430 230 L430 380" />
            <path d="M1520 0 L1520 200 L1490 230 L1490 380" />
            <path d="M400 1080 L400 880 L430 850 L430 700" />
            <path d="M1520 1080 L1520 880 L1490 850 L1490 700" />
          </g>

          {/* ===== INTERSECTION PADS ===== */}
          <g fill="#C9A961" fillOpacity="0.40">
            {/* Top routes */}
            <circle cx="630" cy="350" r="3" />
            <circle cx="450" cy="320" r="3" />
            <circle cx="220" cy="290" r="3" />
            <circle cx="1230" cy="350" r="3" />
            <circle cx="1410" cy="320" r="3" />
            <circle cx="1630" cy="290" r="3" />
            {/* Bottom routes */}
            <circle cx="630" cy="730" r="3" />
            <circle cx="450" cy="760" r="3" />
            <circle cx="220" cy="790" r="3" />
            <circle cx="1230" cy="730" r="3" />
            <circle cx="1410" cy="760" r="3" />
            <circle cx="1630" cy="790" r="3" />
            {/* Center horizontal */}
            <circle cx="570" cy="470" r="2.5" />
            <circle cx="370" cy="500" r="2.5" />
            <circle cx="170" cy="470" r="2.5" />
            <circle cx="1350" cy="470" r="2.5" />
            <circle cx="1550" cy="500" r="2.5" />
            <circle cx="1750" cy="470" r="2.5" />
            <circle cx="570" cy="610" r="2.5" />
            <circle cx="370" cy="580" r="2.5" />
            <circle cx="170" cy="610" r="2.5" />
            <circle cx="1350" cy="610" r="2.5" />
            <circle cx="1550" cy="580" r="2.5" />
            <circle cx="1750" cy="610" r="2.5" />
            {/* Secondary pads */}
            <circle cx="810" cy="120" r="2.2" />
            <circle cx="1110" cy="120" r="2.2" />
            <circle cx="810" cy="960" r="2.2" />
            <circle cx="1110" cy="960" r="2.2" />
          </g>

          {/* ===== SMD COMPONENTS ===== */}
          <g fill="#C9A961" fillOpacity="0.35">
            <rect x="300" y="258" width="18" height="5" />
            <rect x="1602" y="258" width="18" height="5" />
            <rect x="300" y="814" width="18" height="5" />
            <rect x="1602" y="814" width="18" height="5" />
            <rect x="58" y="528" width="5" height="18" />
            <rect x="1857" y="528" width="5" height="18" />
            <rect x="498" y="528" width="5" height="18" />
            <rect x="1417" y="528" width="5" height="18" />
            {/* Extra SMDs */}
            <rect x="178" y="148" width="16" height="4.5" />
            <rect x="1726" y="148" width="16" height="4.5" />
            <rect x="178" y="926" width="16" height="4.5" />
            <rect x="1726" y="926" width="16" height="4.5" />
          </g>
          {/* Outlined SMD */}
          <g fill="none" stroke="#2D5F7C" strokeOpacity="0.50" strokeWidth="0.8">
            <rect x="438" y="316" width="16" height="9" />
            <rect x="1466" y="753" width="16" height="9" />
            <rect x="438" y="753" width="16" height="9" />
            <rect x="1466" y="316" width="16" height="9" />
          </g>

          {/* ===== CENTRAL CHIP ===== */}
          <g transform="translate(960 540)" opacity="0.55">
            {/* Chip pins — top */}
            <g fill="#C9A961">
              {[-80,-65,-50,-35,-20,-5,10,25,40,55,70].map((x, i) => (
                <rect key={`pt${i}`} x={x} y={-110} width="5" height="14" />
              ))}
              {/* bottom */}
              {[-80,-65,-50,-35,-20,-5,10,25,40,55,70].map((x, i) => (
                <rect key={`pb${i}`} x={x} y={96} width="5" height="14" />
              ))}
              {/* left */}
              {[-80,-65,-50,-35,-20,-5,10,25,40,55,70].map((y, i) => (
                <rect key={`pl${i}`} x={-110} y={y} width="14" height="5" />
              ))}
              {/* right */}
              {[-80,-65,-50,-35,-20,-5,10,25,40,55,70].map((y, i) => (
                <rect key={`pr${i}`} x={96} y={y} width="14" height="5" />
              ))}
            </g>
            {/* Chip body */}
            <rect x={-95} y={-95} width={190} height={190} rx={4}
              fill="#14223a" stroke="#D4AF37" strokeWidth="1.5" />
            {/* Inner bevel */}
            <rect x={-78} y={-78} width={156} height={156} rx={3}
              fill="none" stroke="#C9A961" strokeOpacity="0.55" strokeWidth="0.7" />
            {/* Die */}
            <rect x={-40} y={-40} width={80} height={80} rx={2}
              fill="#0F1B2D" stroke="#C9A961" strokeOpacity="0.55" strokeWidth="0.7" />
            {/* Orientation notch */}
            <circle cx={-68} cy={-68} r={4}
              fill="#C9A961" fillOpacity="0.18" stroke="#C9A961" strokeOpacity="0.8" strokeWidth="0.7" />
            {/* Micro routing */}
            <g fill="none" stroke="#C9A961" strokeOpacity="0.40" strokeWidth="0.7">
              <path d="M-70 -58 L-46 -58 L-46 -42" />
              <path d="M70 -58 L46 -58 L46 -42" />
              <path d="M-70 58 L-46 58 L-46 42" />
              <path d="M70 58 L46 58 L46 42" />
              <path d="M-70 0 L-48 0" />
              <path d="M70 0 L48 0" />
              <path d="M0 -70 L0 -48" />
              <path d="M0 70 L0 48" />
            </g>
            {/* AI lettering */}
            <text x="0" y="8" textAnchor="middle" fontFamily="Playfair Display, Georgia, serif"
              fontStyle="italic" fontWeight="500" fontSize="32" fill="#D4AF37" letterSpacing="3">AI</text>
          </g>

          {/* ===== CORNER CHIP WATERMARKS ===== */}
          <g transform="translate(160 160)" opacity="0.30">
            <g fill="#C9A961">
              {[-12,-6,0,6,12].map((x, i) => (
                <rect key={`cpt${i}`} x={x} y={-20} width="3" height="6" />
              ))}
              {[-12,-6,0,6,12].map((x, i) => (
                <rect key={`cpb${i}`} x={x} y={14} width="3" height="6" />
              ))}
              {[-12,-6,0,6,12].map((y, i) => (
                <rect key={`cpl${i}`} x={-20} y={y} width="6" height="3" />
              ))}
              {[-12,-6,0,6,12].map((y, i) => (
                <rect key={`cpr${i}`} x={14} y={y} width="6" height="3" />
              ))}
            </g>
            <rect x={-16} y={-16} width={32} height={32} rx={1}
              fill="none" stroke="#C9A961" strokeWidth="0.8" />
            <rect x={-10} y={-10} width={20} height={20} rx={0.6}
              fill="none" stroke="#C9A961" strokeOpacity="0.6" strokeWidth="0.5" />
            <text x="0" y="3" textAnchor="middle" fontFamily="Playfair Display, Georgia, serif"
              fontStyle="italic" fontWeight="500" fontSize="8" fill="#C9A961" letterSpacing="0.5">AI</text>
          </g>

          <g transform="translate(1760 920)" opacity="0.30">
            <g fill="#C9A961">
              {[-12,-6,0,6,12].map((x, i) => (
                <rect key={`cpt2${i}`} x={x} y={-20} width="3" height="6" />
              ))}
              {[-12,-6,0,6,12].map((x, i) => (
                <rect key={`cpb2${i}`} x={x} y={14} width="3" height="6" />
              ))}
              {[-12,-6,0,6,12].map((y, i) => (
                <rect key={`cpl2${i}`} x={-20} y={y} width="6" height="3" />
              ))}
              {[-12,-6,0,6,12].map((y, i) => (
                <rect key={`cpr2${i}`} x={14} y={y} width="6" height="3" />
              ))}
            </g>
            <rect x={-16} y={-16} width={32} height={32} rx={1}
              fill="none" stroke="#C9A961" strokeWidth="0.8" />
            <rect x={-10} y={-10} width={20} height={20} rx={0.6}
              fill="none" stroke="#C9A961" strokeOpacity="0.6" strokeWidth="0.5" />
            <text x="0" y="3" textAnchor="middle" fontFamily="Playfair Display, Georgia, serif"
              fontStyle="italic" fontWeight="500" fontSize="8" fill="#C9A961" letterSpacing="0.5">AI</text>
          </g>

          {/* Top-left corner chip */}
          <g transform="translate(1760 160)" opacity="0.22">
            <g fill="#C9A961">
              {[-12,-6,0,6,12].map((x, i) => (
                <rect key={`cpt3${i}`} x={x} y={-20} width="3" height="6" />
              ))}
              {[-12,-6,0,6,12].map((x, i) => (
                <rect key={`cpb3${i}`} x={x} y={14} width="3" height="6" />
              ))}
              {[-12,-6,0,6,12].map((y, i) => (
                <rect key={`cpl3${i}`} x={-20} y={y} width="6" height="3" />
              ))}
              {[-12,-6,0,6,12].map((y, i) => (
                <rect key={`cpr3${i}`} x={14} y={y} width="6" height="3" />
              ))}
            </g>
            <rect x={-16} y={-16} width={32} height={32} rx={1}
              fill="none" stroke="#C9A961" strokeWidth="0.8" />
          </g>

          <g transform="translate(160 920)" opacity="0.22">
            <g fill="#C9A961">
              {[-12,-6,0,6,12].map((x, i) => (
                <rect key={`cpt4${i}`} x={x} y={-20} width="3" height="6" />
              ))}
              {[-12,-6,0,6,12].map((x, i) => (
                <rect key={`cpb4${i}`} x={x} y={14} width="3" height="6" />
              ))}
              {[-12,-6,0,6,12].map((y, i) => (
                <rect key={`cpl4${i}`} x={-20} y={y} width="6" height="3" />
              ))}
              {[-12,-6,0,6,12].map((y, i) => (
                <rect key={`cpr4${i}`} x={14} y={y} width="6" height="3" />
              ))}
            </g>
            <rect x={-16} y={-16} width={32} height={32} rx={1}
              fill="none" stroke="#C9A961" strokeWidth="0.8" />
          </g>
        </svg>
      </div>

      {/* Layer 3 — soft gold glow at top */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(201, 169, 97, 0.05) 0%, transparent 50%)',
        }}
      />

      {/* Layer 4 — subtle edge vignette (lighter to not cover traces) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.30) 100%)',
        }}
      />
    </div>
  );
}
