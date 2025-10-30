import { MapIcon, CheckIcon, BookIcon, TrendingUpIcon, AwardIcon } from './Icons';

const milestoneIcons = [BookIcon, TrendingUpIcon, TrendingUpIcon, AwardIcon, AwardIcon];

const Roadmap = ({ milestones, currentHours, onToggleMilestone }) => {
  return (
    <div className="card roadmap-section">
      <div className="card-title">
        <MapIcon />
        Learning Roadmap
      </div>

      <div className="milestone-list">
        {milestones.map((milestone, index) => {
          const Icon = milestoneIcons[index] || BookIcon;
          const progress = Math.min((currentHours / milestone.targetHours) * 100, 100);

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
                </div>

                <div
                  className={`milestone-checkbox ${milestone.completed ? 'checked' : ''}`}
                  onClick={() => onToggleMilestone(milestone.id)}
                  role="checkbox"
                  aria-checked={milestone.completed}
                  tabIndex={0}
                >
                  {milestone.completed && <CheckIcon />}
                </div>
              </div>

              {!milestone.completed && (
                <div className="milestone-progress-bar">
                  <div
                    className="milestone-progress-fill"
                    style={{ width: `${progress}%` }}
                  />
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
