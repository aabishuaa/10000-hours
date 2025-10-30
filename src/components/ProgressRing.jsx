import { useEffect, useState } from 'react';

const ProgressRing = ({ hours, goal = 10000 }) => {
  const [progress, setProgress] = useState(0);
  const percentage = Math.min((hours / goal) * 100, 100);

  // SVG circle parameters
  const radius = 110;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  useEffect(() => {
    // Animate progress on mount and when hours change
    const timer = setTimeout(() => {
      setProgress(percentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage]);

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="progress-ring-container">
      <div className="progress-ring">
        <svg width={radius * 2} height={radius * 2}>
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6EE7FF" />
              <stop offset="100%" stopColor="#6A5CFF" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            className="progress-ring-bg"
            cx={radius}
            cy={radius}
            r={normalizedRadius}
          />

          {/* Progress circle */}
          <circle
            className="progress-ring-fill"
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        <div className="progress-ring-text">
          <div className="progress-hours">
            {hours.toFixed(1)}h
          </div>
          <div className="progress-percentage">
            {percentage.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="progress-goal">
        of {goal.toLocaleString()} hours
      </div>
    </div>
  );
};

export default ProgressRing;
