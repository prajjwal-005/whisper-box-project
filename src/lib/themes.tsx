import React from 'react';


export type Theme = {
  name: string;
  gradient: string;
  emoji: string;
  pattern: string;
};


export const themes: Record<string, Theme> = {
  sunset: {
    name: "Sunset Vibes",
    gradient: "linear-gradient(135deg, #FF6B6B 0%, #FFE66D 50%, #4ECDC4 100%)",
    emoji: "🌅",
    pattern: "dots"
  },
  ocean: {
    name: "Ocean Depth",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    emoji: "✨",
    pattern: "circles"
  },
  forest: {
    name: "Forest Dreams",
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    emoji: "🌿",
    pattern: "waves"
  },
  midnight: {
    name: "Midnight Sky",
    gradient: "linear-gradient(135deg, #2C3E50 0%, #4CA1AF 50%, #C471ED 100%)",
    emoji: "🌙",
    pattern: "stars"
  },
  fire: {
    name: "Fire & Ice",
    gradient: "linear-gradient(135deg, #FF512F 0%, #F09819 50%, #DD2476 100%)",
    emoji: "🔥",
    pattern: "geometric"
  },
  cherry: {
    name: "Cherry Blossom",
    gradient: "linear-gradient(135deg, #FFB6C1 0%, #FF69B4 50%, #DDA0DD 100%)",
    emoji: "🌸",
    pattern: "petals"
  },
  galaxy: {
    name: "Galaxy Burst",
    gradient: "linear-gradient(135deg, #0F2027 0%, #203A43 30%, #2C5364 60%, #8E44AD 100%)",
    emoji: "🌌",
    pattern: "nebula"
  },
  lemon: {
    name: "Lemon Zest",
    gradient: "linear-gradient(135deg, #FFF200 0%, #FFD700 50%, #FF8C00 100%)",
    emoji: "🍋",
    pattern: "rays"
  },
  aurora: {
    name: "Aurora Lights",
    gradient: "linear-gradient(135deg, #00C9FF 0%, #92FE9D 50%, #FF6BCB 100%)",
    emoji: "🌈",
    pattern: "flowing"
  },
  lavender: {
    name: "Lavender Dream",
    gradient: "linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)",
    emoji: "💜",
    pattern: "bubbles"
  },
  coral: {
    name: "Coral Reef",
    gradient: "linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 50%, #FAD0C4 100%)",
    emoji: "🪸",
    pattern: "organic"
  },
  neon: {
    name: "Neon Nights",
    gradient: "linear-gradient(135deg, #FF006E 0%, #8338EC 50%, #3A86FF 100%)",
    emoji: "⚡",
    pattern: "grid"
  },
  mint: {
    name: "Mint Fresh",
    gradient: "linear-gradient(135deg, #A8E6CF 0%, #56CCF2 100%)",
    emoji: "🌿",
    pattern: "leaves"
  },
  peachy: {
    name: "Peachy Keen",
    gradient: "linear-gradient(135deg, #FFEAA7 0%, #FDCB6E 50%, #FD79A8 100%)",
    emoji: "🍑",
    pattern: "soft-dots"
  },
  electric: {
    name: "Electric Blue",
    gradient: "linear-gradient(135deg, #00F5FF 0%, #0080FF 50%, #8000FF 100%)",
    emoji: "⚡",
    pattern: "lightning"
  }
};

// Helper Type for Keys (e.g., 'ocean' | 'sunset')
export type ThemeKey = keyof typeof themes;

// The Pattern Renderer
export const renderPattern = (patternType: string) => {
  const style: React.CSSProperties = { 
    position: "absolute", 
    top: 0, 
    left: 0, 
    width: "100%", 
    height: "100%", 
    pointerEvents: "none" 
  };

  const svgProps = {
    width: "100%",
    height: "100%",
    viewBox: "0 0 600 600",
    preserveAspectRatio: "xMidYMid slice",
    style: style
  };

  switch(patternType) {
    case "dots":
      return (
        <svg {...svgProps} style={{...style, opacity: 0.1}}>
          {Array.from({ length: 100 }).map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 600}
              cy={Math.random() * 600}
              r={Math.random() * 3 + 1}
              fill="white"
            />
          ))}
        </svg>
      );
    case "circles":
      return (
        <svg {...svgProps} style={{...style, opacity: 0.08}}>
          <circle cx="100" cy="100" r="150" fill="none" stroke="white" strokeWidth="1" />
          <circle cx="500" cy="500" r="200" fill="none" stroke="white" strokeWidth="1" />
          <circle cx="300" cy="400" r="100" fill="none" stroke="white" strokeWidth="1" />
        </svg>
      );
    case "waves":
      return (
        <svg {...svgProps} style={{...style, opacity: 0.12}}>
          <path d="M0,400 Q150,350 300,400 T600,400 L600,600 L0,600 Z" fill="white" />
          <path d="M0,450 Q150,420 300,450 T600,450 L600,600 L0,600 Z" fill="white" opacity="0.5" />
        </svg>
      );
    case "stars":
      return (
        <svg {...svgProps} style={{...style, opacity: 0.15}}>
          {Array.from({ length: 50 }).map((_, i) => {
            const x = Math.random() * 600;
            const y = Math.random() * 600;
            const size = Math.random() * 2 + 1;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={size} fill="white" />
                <line x1={x-3} y1={y} x2={x+3} y2={y} stroke="white" strokeWidth="0.5" />
                <line x1={x} y1={y-3} x2={x} y2={y+3} stroke="white" strokeWidth="0.5" />
              </g>
            );
          })}
        </svg>
      );
    case "geometric":
      return (
        <svg {...svgProps} style={{...style, opacity: 0.1}}>
          <polygon points="100,50 50,150 150,150" fill="white" />
          <polygon points="500,100 450,200 550,200" fill="white" />
          <rect x="50" y="400" width="80" height="80" fill="white" transform="rotate(45 90 440)" />
          <rect x="450" y="450" width="60" height="60" fill="white" transform="rotate(30 480 480)" />
        </svg>
      );
    case "petals":
      return (
        <svg {...svgProps} style={{...style, opacity: 0.12}}>
          {Array.from({ length: 30 }).map((_, i) => (
            <ellipse
              key={i}
              cx={Math.random() * 600}
              cy={Math.random() * 600}
              rx="8"
              ry="20"
              fill="white"
              transform={`rotate(${Math.random() * 360} ${Math.random() * 600} ${Math.random() * 600})`}
            />
          ))}
        </svg>
      );
    case "nebula":
      return (
        <svg {...svgProps} style={{...style, opacity: 0.2}}>
          <defs>
            <radialGradient id="nebula1">
              <stop offset="0%" stopColor="white" stopOpacity="0.3" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="150" cy="200" r="120" fill="url(#nebula1)" />
          <circle cx="450" cy="400" r="150" fill="url(#nebula1)" />
          <circle cx="300" cy="100" r="80" fill="url(#nebula1)" />
        </svg>
      );
    case "rays":
      return (
        <svg {...svgProps} style={{...style, opacity: 0.1}}>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            return (
              <line
                key={i}
                x1={300} y1={300}
                x2={300 + Math.cos(angle) * 400}
                y2={300 + Math.sin(angle) * 400}
                stroke="white" strokeWidth="2"
              />
            );
          })}
        </svg>
      );
    case "flowing":
      return (
        <svg {...svgProps} style={{...style, opacity: 0.15}}>
          <path d="M0,200 Q150,150 300,200 T600,200" fill="none" stroke="white" strokeWidth="3" />
          <path d="M0,300 Q150,250 300,300 T600,300" fill="none" stroke="white" strokeWidth="3" />
          <path d="M0,400 Q150,350 300,400 T600,400" fill="none" stroke="white" strokeWidth="3" />
        </svg>
      );
    case "bubbles":
      return (
        <svg {...svgProps} style={{...style, opacity: 0.1}}>
          {Array.from({ length: 40 }).map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 600}
              cy={Math.random() * 600}
              r={Math.random() * 25 + 10}
              fill="white"
              opacity="0.3"
            />
          ))}
        </svg>
      );
    case "organic":
      return (
        <svg {...svgProps} style={{...style, opacity: 0.12}}>
          <path d="M100,300 Q200,200 300,300 T500,300" fill="none" stroke="white" strokeWidth="30" strokeLinecap="round" opacity="0.3" />
          <path d="M150,450 Q250,380 350,450 T550,450" fill="none" stroke="white" strokeWidth="25" strokeLinecap="round" opacity="0.3" />
        </svg>
      );
    case "grid":
      return (
        <svg {...svgProps} style={{...style, opacity: 0.08}}>
          {Array.from({ length: 10 }).map((_, i) => (
            <g key={i}>
              <line x1={i * 60} y1="0" x2={i * 60} y2="600" stroke="white" strokeWidth="1" />
              <line x1="0" y1={i * 60} x2="600" y2={i * 60} stroke="white" strokeWidth="1" />
            </g>
          ))}
        </svg>
      );
    case "leaves":
      return (
        <svg {...svgProps} style={{...style, opacity: 0.1}}>
          {Array.from({ length: 25 }).map((_, i) => (
            <path
              key={i}
              d="M0,0 Q5,-10 10,0 Q5,5 0,0"
              fill="white"
              transform={`translate(${Math.random() * 600} ${Math.random() * 600}) rotate(${Math.random() * 360}) scale(2)`}
            />
          ))}
        </svg>
      );
    case "soft-dots":
      return (
        <svg {...svgProps} style={{...style, opacity: 0.15}}>
          {Array.from({ length: 60 }).map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 600}
              cy={Math.random() * 600}
              r={Math.random() * 8 + 3}
              fill="white"
              opacity="0.5"
            />
          ))}
        </svg>
      );
    case "lightning":
      return (
        <svg {...svgProps} style={{...style, opacity: 0.12}}>
          <path d="M100,50 L120,150 L80,150 L100,250" stroke="white" strokeWidth="3" fill="none" />
          <path d="M500,100 L480,200 L520,200 L500,300" stroke="white" strokeWidth="3" fill="none" />
          <path d="M300,400 L320,480 L280,480 L300,560" stroke="white" strokeWidth="3" fill="none" />
        </svg>
      );
    default:
      return null;
  }
};