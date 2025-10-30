import { TargetIcon, TrophyIcon, ClockIcon } from './Icons';

export default function Dashboard({ skills, activeSkillId, onSelectSkill }) {
  const getTotalHours = () => skills.reduce((sum, skill) => sum + skill.hours, 0);
  const getTotalGoalHours = () => skills.reduce((sum, skill) => sum + skill.goal, 0);
  const getCompletedMilestones = () =>
    skills.reduce((sum, skill) =>
      sum + skill.milestones.filter(m => m.completed).length, 0
    );
  const getTotalMilestones = () => skills.reduce((sum, skill) => sum + skill.milestones.length, 0);

  if (skills.length === 0) {
    return (
      <div className="dashboard-empty">
        <TargetIcon />
        <h2>Ready to start your mastery journey?</h2>
        <p>Add your first skill to begin tracking your path to 10,000 hours</p>
      </div>
    );
  }

  const totalHours = getTotalHours();
  const totalGoal = getTotalGoalHours();
  const completedMilestones = getCompletedMilestones();
  const totalMilestones = getTotalMilestones();
  const overallProgress = totalGoal > 0 ? (totalHours / totalGoal) * 100 : 0;

  return (
    <div className="dashboard-view">
      {/* Stats Overview */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon clock">
            <ClockIcon />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalHours.toFixed(1)}</div>
            <div className="stat-label">Total Hours Logged</div>
            <div className="stat-sub">of {totalGoal.toLocaleString()} goal hours</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon trophy">
            <TrophyIcon />
          </div>
          <div className="stat-content">
            <div className="stat-value">{completedMilestones}</div>
            <div className="stat-label">Milestones Achieved</div>
            <div className="stat-sub">of {totalMilestones} total</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon target">
            <TargetIcon />
          </div>
          <div className="stat-content">
            <div className="stat-value">{overallProgress.toFixed(1)}%</div>
            <div className="stat-label">Overall Progress</div>
            <div className="stat-sub">{skills.length} {skills.length === 1 ? 'skill' : 'skills'} tracked</div>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="dashboard-skills-grid">
        {skills.map((skill) => {
          const progress = (skill.hours / skill.goal) * 100;
          const isActive = skill.id === activeSkillId;
          const completedCount = skill.milestones.filter(m => m.completed).length;

          return (
            <div
              key={skill.id}
              className={`dashboard-skill-card ${isActive ? 'active' : ''}`}
              onClick={() => onSelectSkill(skill.id)}
            >
              <div className="skill-card-header">
                <h3>{skill.name}</h3>
                <div className="skill-card-milestone-count">
                  <TrophyIcon />
                  <span>{completedCount}/{skill.milestones.length}</span>
                </div>
              </div>

              <div className="skill-card-progress">
                <div className="skill-card-hours">
                  <span className="hours-current">{skill.hours.toFixed(1)}</span>
                  <span className="hours-divider">/</span>
                  <span className="hours-goal">{skill.goal.toLocaleString()}</span>
                  <span className="hours-label">hrs</span>
                </div>
                <div className="skill-card-percentage">{progress.toFixed(1)}%</div>
              </div>

              {/* Liquid Fill Visualization */}
              <div className="skill-card-visual">
                <svg viewBox="0 0 120 160" className="liquid-container">
                  <defs>
                    <linearGradient id={`liquid-gradient-${skill.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(251, 191, 36, 0.8)" />
                      <stop offset="50%" stopColor="rgba(251, 146, 60, 0.9)" />
                      <stop offset="100%" stopColor="rgba(249, 115, 22, 1)" />
                    </linearGradient>

                    <clipPath id={`beaker-clip-${skill.id}`}>
                      <path d="M 30 10 L 30 140 Q 30 150 40 150 L 80 150 Q 90 150 90 140 L 90 10 Z" />
                    </clipPath>
                  </defs>

                  {/* Beaker outline */}
                  <path
                    d="M 30 10 L 30 140 Q 30 150 40 150 L 80 150 Q 90 150 90 140 L 90 10 Z"
                    fill="none"
                    stroke="rgba(251, 191, 36, 0.3)"
                    strokeWidth="2"
                  />

                  {/* Liquid fill */}
                  <g clipPath={`url(#beaker-clip-${skill.id})`}>
                    <rect
                      x="30"
                      y={150 - (progress / 100) * 140}
                      width="60"
                      height={(progress / 100) * 140}
                      fill={`url(#liquid-gradient-${skill.id})`}
                      className="liquid-fill"
                    >
                      <animate
                        attributeName="y"
                        from="150"
                        to={150 - (progress / 100) * 140}
                        dur="1.5s"
                        fill="freeze"
                      />
                      <animate
                        attributeName="height"
                        from="0"
                        to={(progress / 100) * 140}
                        dur="1.5s"
                        fill="freeze"
                      />
                    </rect>

                    {/* Wave effect */}
                    {progress > 0 && (
                      <path
                        d={`M 30 ${150 - (progress / 100) * 140} Q 45 ${150 - (progress / 100) * 140 - 5} 60 ${150 - (progress / 100) * 140} T 90 ${150 - (progress / 100) * 140}`}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.4)"
                        strokeWidth="1"
                        className="liquid-wave"
                      />
                    )}
                  </g>

                  {/* Measurement lines */}
                  {[25, 50, 75].map((mark) => (
                    <g key={mark} opacity={progress >= mark ? "0.3" : "0.15"}>
                      <line
                        x1="32"
                        y1={150 - (mark / 100) * 140}
                        x2="40"
                        y2={150 - (mark / 100) * 140}
                        stroke="rgba(251, 191, 36, 0.5)"
                        strokeWidth="1"
                      />
                      <line
                        x1="80"
                        y1={150 - (mark / 100) * 140}
                        x2="88"
                        y2={150 - (mark / 100) * 140}
                        stroke="rgba(251, 191, 36, 0.5)"
                        strokeWidth="1"
                      />
                    </g>
                  ))}
                </svg>
              </div>

              <div className="skill-card-stats">
                <div className="skill-stat">
                  <ClockIcon />
                  <span>{skill.streak} day streak</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
