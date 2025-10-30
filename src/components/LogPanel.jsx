import { useState } from 'react';

const LogPanel = ({ onLogHours }) => {
  const [manualHours, setManualHours] = useState('');

  const handleQuickLog = (hours) => {
    onLogHours(hours);
  };

  const handleManualLog = () => {
    const hours = parseFloat(manualHours);
    if (hours && hours > 0) {
      onLogHours(hours);
      setManualHours('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleManualLog();
    }
  };

  return (
    <div className="log-panel">
      <div className="quick-log-buttons">
        <button className="quick-log-btn" onClick={() => handleQuickLog(0.25)}>
          +15 min
        </button>
        <button className="quick-log-btn" onClick={() => handleQuickLog(0.5)}>
          +30 min
        </button>
        <button className="quick-log-btn" onClick={() => handleQuickLog(1)}>
          +1 hour
        </button>
      </div>

      <div className="manual-log">
        <input
          type="number"
          placeholder="Enter hours (e.g., 2.5)"
          value={manualHours}
          onChange={(e) => setManualHours(e.target.value)}
          onKeyPress={handleKeyPress}
          min="0"
          step="0.25"
        />
        <button onClick={handleManualLog}>Log</button>
      </div>
    </div>
  );
};

export default LogPanel;
