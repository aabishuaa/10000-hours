import { useState } from 'react';

const EditSkillModal = ({ skill, onClose, onSave }) => {
  const [name, setName] = useState(skill.name);
  const [goal, setGoal] = useState(skill.goal.toString());

  const handleSubmit = () => {
    const trimmedName = name.trim();
    const parsedGoal = parseInt(goal, 10);

    if (!trimmedName || Number.isNaN(parsedGoal) || parsedGoal <= 0) {
      return;
    }

    onSave({ name: trimmedName, goal: parsedGoal });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }

    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <h2>Edit Skill</h2>

        <label htmlFor="skill-name">Skill Name</label>
        <input
          id="skill-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Skill name"
          autoFocus
        />

        <label htmlFor="goal-hours">Goal (hours)</label>
        <input
          id="goal-hours"
          type="number"
          min="1"
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          onKeyDown={handleKeyDown}
        />

        <p className="modal-helper-text">
          Updating the goal will intelligently rescale your roadmap milestones while keeping
          your existing progress intact.
        </p>

        <div className="modal-buttons">
          <button className="modal-btn modal-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn modal-btn-primary" onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSkillModal;
