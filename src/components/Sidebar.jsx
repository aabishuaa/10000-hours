import { ClockIcon, PlusIcon, TargetIcon, EditIcon, TrashIcon } from './Icons';

const Sidebar = ({
  skills,
  activeSkillId,
  onSelectSkill,
  onAddSkill,
  onEditSkill,
  onDeleteSkill,
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="brand">
          <ClockIcon />
          10,000 Hour Tracker
        </div>

        <button className="add-skill-btn" onClick={onAddSkill}>
          <PlusIcon />
          Add Skill
        </button>
      </div>

      <div className="skill-list">
        {skills.length === 0 ? (
          <div className="empty-state">
            <TargetIcon />
            <h3>No skills yet</h3>
            <p>Click "Add Skill" to start tracking your journey to mastery</p>
          </div>
        ) : (
          skills.map((skill) => {
            const percentage = ((skill.hours / skill.goal) * 100).toFixed(1);

            return (
              <div
                key={skill.id}
                className={`skill-item ${activeSkillId === skill.id ? 'active' : ''}`}
                onClick={() => onSelectSkill(skill.id)}
              >
                <div className="skill-item-header">
                  <div className="skill-item-name">
                    <TargetIcon />
                    {skill.name}
                  </div>
                  <div className="skill-item-actions">
                    <button
                      className="skill-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditSkill?.(skill);
                      }}
                      aria-label={`Edit ${skill.name}`}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="skill-action-btn skill-action-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSkill?.(skill);
                      }}
                      aria-label={`Delete ${skill.name}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
                <div className="skill-item-progress">
                  <span>{skill.hours.toFixed(1)}h</span>
                  <span>{percentage}%</span>
                </div>
                <div className="skill-item-bar">
                  <div
                    className="skill-item-bar-fill"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Sidebar;
