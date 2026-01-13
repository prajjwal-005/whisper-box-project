'use client';

import React, { useState } from 'react';
import { themes, renderPattern, ThemeKey } from '@/lib/themes'; 

export default function ViralCardThemes() {
  const [selected, setSelected] = useState<ThemeKey>("ocean");
  const theme = themes[selected];
  const sampleMessage = "What's something you never tell people?";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Viral Card Theme Options
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a theme for your share cards
          </p>
        </div>

        {/* Theme Selector Grid */}
        <div className="flex flex-wrap gap-3 justify-center">
          {Object.entries(themes).map(([key, t]) => (
            <button
              key={key}
              onClick={() => setSelected(key as ThemeKey)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selected === key
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-102'
              }`}
            >
              {t.emoji} {t.name}
            </button>
          ))}
        </div>

        {/* Live Preview Card */}
        <div className="flex justify-center">
          <div className="relative" style={{ width: '600px', height: '600px' }}>
            <div
              style={{
                width: "100%",
                height: "100%",
                background: theme.gradient,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "60px",
                boxSizing: "border-box",
                position: "relative",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
              }}
            >
              {/* Pattern overlay - Now imported! */}
              {renderPattern(theme.pattern)}

              {/* Decorative border */}
              <div
                style={{
                  position: "absolute",
                  top: "30px", left: "30px", right: "30px", bottom: "30px",
                  border: "1.5px solid rgba(255, 255, 255, 0.25)",
                  borderRadius: "30px",
                  pointerEvents: "none",
                  zIndex: 10
                }}
              />

              {/* Emoji Header */}
              <div style={{ zIndex: 20 }}>
                <div style={{ fontSize: "36px", opacity: "0.9" }}>
                  {theme.emoji}
                </div>
              </div>

              {/* Quote Section */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  zIndex: 20
                }}
              >
                <div
                  style={{
                    fontSize: "48px",
                    fontWeight: "700",
                    color: "#ffffff",
                    textAlign: "center",
                    lineHeight: "1.25",
                    textShadow: "0 4px 20px rgba(0,0,0,0.25)",
                    maxWidth: "75%",
                    fontFamily: "Arial, sans-serif"
                  }}
                >
                  "{sampleMessage}"
                </div>
              </div>

              {/* Bottom CTA */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", zIndex: 20 }}>
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "14px 36px",
                    borderRadius: "50px",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.18)",
                  }}
                >
                  <span
                    style={{
                      background: theme.gradient,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: "16px",
                      fontWeight: "700",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    Send me an anonymous message
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "rgba(255, 255, 255, 0.85)",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  mystery-message.app
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
          <p className="text-blue-800 dark:text-blue-400 text-sm">
            Themes are loaded from <code>src/lib/themes.tsx</code>
          </p>
        </div>
      </div>
    </div>
  );
}