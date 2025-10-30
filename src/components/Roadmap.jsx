import { MapIcon, CheckIcon, BookIcon, TrendingUpIcon, AwardIcon } from './Icons';

const milestoneIcons = [BookIcon, TrendingUpIcon, TrendingUpIcon, AwardIcon, AwardIcon];

const Roadmap = ({ milestones, currentHours, onToggleMilestone }) => {
  return (
    <div className="card roadmap-section">
      <div className="card-title">
        <MapIcon />
        Learning Roadmap
      </div>
      <p className="roadmap-hint">
        💡 Click the checkbox to sync your hours to that milestone's target
      </p>

      <div className="milestone-list">
        {milestones.map((milestone, index) => {
          const Icon = milestoneIcons[index] || BookIcon;
          const progress = Math.min((currentHours / milestone.targetHours) * 100, 100);
          const remaining = Math.max(0, milestone.targetHours - currentHours);

          return (
            <div
              key={milestone.id}
              className={`milestone ${milestone.completed ? 'completed' : ''}`}
            >
              <div className="milestone-header">
                <div className="milestone-info">
                  <h3>
                    <Icon />
                    {milestone.title}
                  </h3>
                  <div className="milestone-hours">
                    Target: {milestone.targetHours.toLocaleString()} hours
                  </div>
                  {!milestone.completed && remaining > 0 && (
                    <div className="milestone-remaining">
                      <span className="milestone-remaining-hours">{remaining.toFixed(1)}h</span>
                      <span className="milestone-remaining-text">remaining to reach this milestone</span>
                    </div>
                  )}
                </div>

                <div
                  className={`milestone-checkbox ${milestone.completed ? 'checked' : ''}`}
                  onClick={() => onToggleMilestone(milestone.id)}
                  role="checkbox"
                  aria-checked={milestone.completed}
                  tabIndex={0}
                  title={
                    milestone.completed
                      ? 'Click to unmark this milestone'
                      : remaining > 0
                      ? `Click to add ${remaining.toFixed(1)} hours and complete this milestone`
                      : 'Click to mark this milestone as complete'
                  }
                >
                  {milestone.completed && <CheckIcon />}
                  {!milestone.completed && remaining > 0 && (
                    <span className="milestone-checkbox-hint">+{remaining.toFixed(0)}h</span>
                  )}
                </div>
              </div>

              {!milestone.completed && (
                <div className="milestone-progress-bar">
                  <div
                    className="milestone-progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                  <span className="milestone-progress-text">{progress.toFixed(0)}%</span>
                </div>
              )}

              {milestone.completed && (
                <div className="milestone-celebration">
                  <CheckIcon /> Milestone achieved! Keep up the great work!
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;
