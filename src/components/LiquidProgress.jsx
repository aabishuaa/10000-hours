import { useState, useEffect } from 'react';

export default function LiquidProgress({ hours, goal }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const progress = Math.min((hours / goal) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const getColorFromProgress = (prog) => {
    if (prog < 25) return { start: '#f97316', mid: '#fb923c', end: '#fdba74' }; // Orange
    if (prog < 50) return { start: '#fb923c', mid: '#fbbf24', end: '#fcd34d' }; // Orange-Yellow
    if (prog < 75) return { start: '#fbbf24', mid: '#facc15', end: '#fde047' }; // Yellow
    return { start: '#facc15', mid: '#fde047', end: '#fef08a' }; // Bright Yellow
  };

  const colors = getColorFromProgress(progress);

  return (
    <div className="liquid-progress-container">
      <svg viewBox="0 0 300 400" className="liquid-svg">
        <defs>
          {/* Liquid gradient */}
          <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.start} stopOpacity="0.9" />
            <stop offset="50%" stopColor={colors.mid} stopOpacity="0.95" />
            <stop offset="100%" stopColor={colors.end} stopOpacity="1" />
          </linearGradient>

          {/* Glow effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Beaker clip path */}
          <clipPath id="beakerClip">
            <path d="
              M 80 40
              L 80 320
              Q 80 360 120 360
              L 180 360
              Q 220 360 220 320
              L 220 40
              Z
            " />
          </clipPath>

          {/* Shine effect */}
          <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* Beaker container outline */}
        <path
          d="M 80 40 L 80 320 Q 80 360 120 360 L 180 360 Q 220 360 220 320 L 220 40 Z"
          fill="none"
          stroke="rgba(251, 191, 36, 0.4)"
          strokeWidth="3"
          filter="url(#glow)"
        />

        {/* Beaker rim */}
        <rect
          x="70"
          y="30"
          width="160"
          height="15"
          rx="4"
          fill="rgba(251, 191, 36, 0.15)"
          stroke="rgba(251, 191, 36, 0.5)"
          strokeWidth="2"
        />

        {/* Liquid fill with clip path */}
        <g clipPath="url(#beakerClip)">
          <rect
            x="80"
            y={360 - (animatedProgress / 100) * 320}
            width="140"
            height={(animatedProgress / 100) * 320}
            fill="url(#liquidGradient)"
            style={{
              transition: 'y 1.5s cubic-bezier(0.4, 0.0, 0.2, 1), height 1.5s cubic-bezier(0.4, 0.0, 0.2, 1)'
            }}
          />

          {/* Animated wave on top of liquid */}
          {progress > 0 && (
            <>
              <path
                d={`
                  M 80 ${360 - (animatedProgress / 100) * 320}
                  Q 110 ${360 - (animatedProgress / 100) * 320 - 8}
                    140 ${360 - (animatedProgress / 100) * 320}
                  T 200 ${360 - (animatedProgress / 100) * 320}
                  T 260 ${360 - (animatedProgress / 100) * 320}
                  L 220 ${360 - (animatedProgress / 100) * 320 + 10}
                  Q 190 ${360 - (animatedProgress / 100) * 320 + 8}
                    160 ${360 - (animatedProgress / 100) * 320 + 10}
                  T 100 ${360 - (animatedProgress / 100) * 320 + 10}
                  T 80 ${360 - (animatedProgress / 100) * 320}
                  Z
                `}
                fill="rgba(255, 255, 255, 0.3)"
                className="liquid-wave-top"
              />

              <path
                d={`
                  M 80 ${360 - (animatedProgress / 100) * 320 + 15}
                  Q 100 ${360 - (animatedProgress / 100) * 320 + 10}
                    120 ${360 - (animatedProgress / 100) * 320 + 15}
                  T 160 ${360 - (animatedProgress / 100) * 320 + 15}
                  T 200 ${360 - (animatedProgress / 100) * 320 + 15}
                  T 220 ${360 - (animatedProgress / 100) * 320 + 15}
                  L 220 ${360 - (animatedProgress / 100) * 320 + 25}
                  Q 200 ${360 - (animatedProgress / 100) * 320 + 22}
                    180 ${360 - (animatedProgress / 100) * 320 + 25}
                  T 140 ${360 - (animatedProgress / 100) * 320 + 25}
                  T 100 ${360 - (animatedProgress / 100) * 320 + 25}
                  T 80 ${360 - (animatedProgress / 100) * 320 + 25}
                  Z
                `}
                fill="rgba(255, 255, 255, 0.15)"
                className="liquid-wave-mid"
              />
            </>
          )}

          {/* Bubbles */}
          {progress > 5 && [1, 2, 3, 4].map((i) => (
            <circle
              key={i}
              cx={80 + (140 / 5) * i}
              cy={360 - 20}
              r="3"
              fill="rgba(255, 255, 255, 0.5)"
              className="liquid-bubble"
              style={{
                animationDelay: `${i * 0.7}s`
              }}
            />
          ))}
        </g>

        {/* Measurement lines */}
        {[20, 40, 60, 80, 100].map((mark) => (
          <g key={mark} opacity={progress >= mark ? "0.5" : "0.2"}>
            <line
              x1="75"
              y1={360 - (mark / 100) * 320}
              x2="85"
              y2={360 - (mark / 100) * 320}
              stroke="rgba(251, 191, 36, 0.6)"
              strokeWidth="2"
            />
            <line
              x1="215"
              y1={360 - (mark / 100) * 320}
              x2="225"
              y2={360 - (mark / 100) * 320}
              stroke="rgba(251, 191, 36, 0.6)"
              strokeWidth="2"
            />
            <text
              x="235"
              y={360 - (mark / 100) * 320 + 5}
              fontSize="12"
              fill="rgba(251, 191, 36, 0.7)"
              fontWeight="500"
            >
              {mark}%
            </text>
          </g>
        ))}

        {/* Shine effect on beaker */}
        <ellipse
          cx="120"
          cy="150"
          rx="20"
          ry="80"
          fill="url(#shineGradient)"
          opacity="0.4"
          transform="rotate(-20 120 150)"
        />
      </svg>

      {/* Stats below */}
      <div className="liquid-stats">
        <div className="liquid-stat-main">
          <span className="liquid-hours">{hours.toFixed(1)}</span>
          <span className="liquid-divider">/</span>
          <span className="liquid-goal">{goal.toLocaleString()}</span>
        </div>
        <div className="liquid-stat-sub">
          <span className="liquid-percentage">{progress.toFixed(1)}%</span>
          <span className="liquid-label">Complete</span>
        </div>
      </div>
    </div>
  );
}
