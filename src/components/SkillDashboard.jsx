import { useMemo } from 'react';
import ProgressRing from './ProgressRing';
import LogPanel from './LogPanel';
import Roadmap from './Roadmap';
import WeeklyTracker from './WeeklyTracker';
import {
  TargetIcon,
  EditIcon,
  TrashIcon,
  ClockIcon,
  FlameIcon,
  CalendarIcon,
} from './Icons';

const formatRemaining = (goal, hours) => {
  const remaining = Math.max(goal - hours, 0);
  if (remaining === 0) return 'Goal reached!';
  return `${remaining.toFixed(1)}h to goal`;
};

const SkillDashboard = ({
  skill,
  onLogHours,
  onRemoveLog,
  onToggleMilestone,
  onEditSkill,
  onDeleteSkill,
  sectionRef,
}) => {
  const timelineLogs = useMemo(() => {
    return [...skill.logs]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [skill.logs]);

  return (
    <section ref={sectionRef} className="card skill-dashboard-card" id={skill.id}>
      <header className="skill-dashboard-header">
        <div className="skill-dashboard-title">
          <TargetIcon />
          <div>
            <h2>{skill.name}</h2>
            <p>
              Goal: {skill.goal.toLocaleString()} hours · {formatRemaining(skill.goal, skill.hours)}
            </p>
          </div>
        </div>

        <div className="skill-dashboard-actions">
          <button
            className="skill-action-btn"
            type="button"
            onClick={() => onEditSkill(skill)}
            aria-label={`Edit ${skill.name}`}
          >
            <EditIcon />
          </button>
          <button
            className="skill-action-btn skill-action-danger"
            type="button"
            onClick={() => onDeleteSkill(skill)}
            aria-label={`Delete ${skill.name}`}
          >
            <TrashIcon />
          </button>
        </div>
      </header>

      <div className="skill-dashboard-grid">
        <div className="skill-overview">
          <ProgressRing hours={skill.hours} goal={skill.goal} />

          <div className="skill-overview-stats">
            <div className="skill-stat">
              <ClockIcon />
              <div>
                <span className="skill-stat-label">Hours logged</span>
                <span className="skill-stat-value">{skill.hours.toFixed(1)}h</span>
              </div>
            </div>

            <div className="skill-stat">
              <FlameIcon />
              <div>
                <span className="skill-stat-label">Daily streak</span>
                <span className="skill-stat-value">{skill.streak} days</span>
              </div>
            </div>

            <div className="skill-stat">
              <TargetIcon />
              <div>
                <span className="skill-stat-label">Milestones</span>
                <span className="skill-stat-value">
                  {skill.milestones.filter((m) => m.completed).length} / {skill.milestones.length}
                </span>
              </div>
            </div>

            <div className="skill-stat">
              <CalendarIcon />
              <div>
                <span className="skill-stat-label">Last session</span>
                <span className="skill-stat-value">
                  {skill.lastLogDate ? skill.lastLogDate : 'Not logged yet'}
                </span>
              </div>
            </div>
          </div>

          <LogPanel
            onLogHours={onLogHours}
            logs={timelineLogs}
            onRemoveLog={onRemoveLog}
          />
        </div>

        <div className="skill-roadmap-column">
          <Roadmap
            milestones={skill.milestones}
            currentHours={skill.hours}
            onToggleMilestone={onToggleMilestone}
          />

          <WeeklyTracker weeklyData={skill.weeklyData} />
        </div>
      </div>
    </section>
  );
};

export default SkillDashboard;
