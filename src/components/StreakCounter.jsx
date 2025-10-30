import { FlameIcon } from './Icons';

const StreakCounter = ({ streak }) => {
  return (
    <div className="streak-container">
      <FlameIcon />
      <div className="streak-text">
        <span className="streak-number">{streak}</span> day streak
      </div>
    </div>
  );
};

export default StreakCounter;
