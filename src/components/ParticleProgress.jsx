import { useState, useEffect, useMemo } from 'react';

export default function ParticleProgress({ hours, goal }) {
  const progress = Math.min((hours / goal) * 100, 100);
  const [hovering, setHovering] = useState(false);

  // Generate particles based on progress
  const particles = useMemo(() => {
    const count = Math.floor((progress / 100) * 50) + 10;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const distance = 60 + (Math.random() * 40);
      const size = 3 + Math.random() * 4;
      const delay = Math.random() * 2;
      const duration = 2 + Math.random() * 2;

      return {
        id: i,
        x: 150 + Math.cos(angle) * distance,
        y: 150 + Math.sin(angle) * distance,
        size,
        delay,
        duration,
        opacity: 0.4 + Math.random() * 0.6,
      };
    });
  }, [progress]);

  const orbitalParticles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      angle: (i / 8) * 360,
      radius: 90 + (i % 3) * 15,
      size: 4 + (i % 2) * 2,
      duration: 6 + (i % 3) * 2,
    }));
  }, []);

  return (
    <div
      className="particle-progress-container"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <svg viewBox="0 0 300 300" className="particle-svg">
        <defs>
          {/* Radial gradient for center glow */}
          <radialGradient id="centerGlow">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
            <stop offset="50%" stopColor="#fb923c" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.2" />
          </radialGradient>

          {/* Glow filter */}
          <filter id="particleGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Particle gradient */}
          <radialGradient id="particleGradient">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
            <stop offset="70%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.3" />
          </radialGradient>
        </defs>

        {/* Orbital rings */}
        {[1, 2, 3, 4].map((ring) => (
          <circle
            key={`ring-${ring}`}
            cx="150"
            cy="150"
            r={40 + ring * 20}
            fill="none"
            stroke="rgba(251, 191, 36, 0.1)"
            strokeWidth="1"
            strokeDasharray="4 4"
            className="particle-ring"
            style={{
              animationDelay: `${ring * 0.3}s`,
              opacity: progress > (ring * 20) ? 0.3 : 0.1
            }}
          />
        ))}

        {/* Orbital particles */}
        {orbitalParticles.map((particle) => (
          <circle
            key={`orbital-${particle.id}`}
            cx="150"
            cy="150"
            r={particle.size}
            fill="url(#particleGradient)"
            filter="url(#particleGlow)"
            className="orbital-particle"
            style={{
              '--orbit-radius': `${particle.radius}px`,
              '--orbit-duration': `${particle.duration}s`,
              '--orbit-delay': `${particle.id * 0.5}s`
            }}
            transform={`rotate(${particle.angle} 150 150) translate(${particle.radius} 0)`}
          />
        ))}

        {/* Static particles representing progress */}
        {particles.map((particle) => (
          <circle
            key={particle.id}
            cx={particle.x}
            cy={particle.y}
            r={particle.size}
            fill="url(#particleGradient)"
            opacity={particle.opacity}
            filter="url(#particleGlow)"
            className="static-particle"
            style={{
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}

        {/* Center core */}
        <circle
          cx="150"
          cy="150"
          r="50"
          fill="url(#centerGlow)"
          filter="url(#particleGlow)"
          className={`particle-core ${hovering ? 'hovering' : ''}`}
        />

        {/* Progress ring around core */}
        <circle
          cx="150"
          cy="150"
          r="55"
          fill="none"
          stroke="rgba(251, 191, 36, 0.3)"
          strokeWidth="8"
          strokeLinecap="round"
          style={{
            strokeDasharray: `${(progress / 100) * 345} 345`,
            transform: 'rotate(-90deg)',
            transformOrigin: '150px 150px',
            transition: 'stroke-dasharray 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />

        {/* Inner rotating triangle */}
        <polygon
          points="150,130 165,155 135,155"
          fill="rgba(254, 240, 138, 0.6)"
          className="particle-triangle"
        />

        {/* Percentage text */}
        <text
          x="150"
          y="155"
          textAnchor="middle"
          fontSize="32"
          fontWeight="700"
          fill="#ffffff"
          style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.8)' }}
        >
          {progress.toFixed(0)}%
        </text>
      </svg>

      <div className="particle-stats">
        <div className="particle-stat-row">
          <span className="particle-label">Hours Logged</span>
          <span className="particle-value">{hours.toFixed(1)}</span>
        </div>
        <div className="particle-stat-row">
          <span className="particle-label">Goal</span>
          <span className="particle-value">{goal.toLocaleString()}</span>
        </div>
        <div className="particle-stat-row">
          <span className="particle-label">Remaining</span>
          <span className="particle-value highlight">{(goal - hours).toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
