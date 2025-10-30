import { useState } from 'react';

const AddSkillModal = ({ onAdd, onClose }) => {
  const [skillName, setSkillName] = useState('');
  const [goalHours, setGoalHours] = useState('10000');

  const handleSubmit = () => {
    const name = skillName.trim();
    const goal = parseInt(goalHours);

    if (name && goal > 0) {
      onAdd(name, goal);
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add New Skill</h2>

        <label htmlFor="skill-name">Skill Name</label>
        <input
          id="skill-name"
          type="text"
          placeholder="e.g., Piano, Programming, Spanish"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          onKeyDown={handleKeyPress}
          autoFocus
        />

        <label htmlFor="goal-hours">Goal (hours)</label>
        <input
          id="goal-hours"
          type="number"
          placeholder="10000"
          value={goalHours}
          onChange={(e) => setGoalHours(e.target.value)}
          onKeyDown={handleKeyPress}
          min="1"
        />

        <div className="modal-buttons">
          <button className="modal-btn modal-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn modal-btn-primary" onClick={handleSubmit}>
            Add Skill
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSkillModal;
