import React, { forwardRef } from 'react';
import { themes, renderPattern, ThemeKey } from '@/lib/themes';

interface ShareCardProps {
  content: string;
  currentTheme: ThemeKey;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ content, currentTheme }, ref) => {
  const selectedTheme = themes[currentTheme] || themes.sunset;

  return (
    <div 
      ref={ref} 
      style={{ 
        position: "absolute", 
        left: "-9999px", // Keeps it off-screen
        top: "0",
        width: "600px", 
        height: "600px", 
        background: selectedTheme.gradient, 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "60px",
        overflow: "hidden"
      }}
    >
      {/* 1. Background Pattern */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {renderPattern(selectedTheme.pattern)}
      </div>

      {/* 2. Message Content */}
      <div style={{ 
        position: 'relative',
        zIndex: 10,
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        gap: "20px",
        width: "100%"
      }}>
        <span style={{ fontSize: "50px" }}>{selectedTheme.emoji}</span>
        <div style={{ 
          fontSize: "36px", 
          fontWeight: "800", 
          color: "#ffffff", 
          textAlign: "center", 
          fontFamily: "Inter, sans-serif",
          lineHeight: "1.3",
          textShadow: "0 4px 12px rgba(0,0,0,0.15)",
          wordBreak: "break-word"
        }}>
          "{content}"
        </div>
      </div>

      {/* 3. Branding Footer */}
      <div style={{ 
        position: 'absolute',
        bottom: '40px',
        backgroundColor: "rgba(0,0,0,0.8)", 
        backdropFilter: "blur(10px)",
        color: "#ffffff", 
        padding: "12px 24px", 
        borderRadius: "100px",
        fontSize: "14px",
        fontWeight: "600",
        letterSpacing: "0.5px",
        zIndex: 10,
        border: "1px solid rgba(255,255,255,0.1)"
      }}>
        Sent via Whisper Box
      </div>
    </div>
  );
});

ShareCard.displayName = "ShareCard";