import { useState, useMemo } from 'react';

const formatLogDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const formatHours = (hours) =>
  Number.isInteger(hours) ? hours : parseFloat(hours.toFixed(2));

const LogPanel = ({ onLogHours, logs = [], onRemoveLog }) => {
  const [manualHours, setManualHours] = useState('');
  const [note, setNote] = useState('');

  const handleQuickLog = (hours) => {
    onLogHours(hours, { type: 'quick' });
  };

  const handleManualLog = () => {
    const hours = parseFloat(manualHours);
    if (hours && hours > 0) {
      onLogHours(hours, {
        type: 'manual',
        note: note.trim() || null,
      });
      setManualHours('');
      setNote('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleManualLog();
    }
  };

  const recentLogs = useMemo(() => logs.slice(0, 5), [logs]);

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
        <input
          type="text"
          placeholder="Optional note (e.g., Focused drills)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyPress={handleKeyPress}
          maxLength={60}
        />
        <button onClick={handleManualLog}>Log</button>
      </div>

      <div className="log-history">
        <div className="log-history-header">
          <h4>Recent sessions</h4>
          <span>{logs.length} total</span>
        </div>

        {logs.length === 0 ? (
          <div className="log-history-empty">
            Start logging to build momentum. Every minute counts!
          </div>
        ) : (
          <div className="log-history-list">
            {recentLogs.map((log) => (
              <div className="log-history-item" key={log.id}>
                <div className="log-history-details">
                  <span className="log-history-hours">+{formatHours(log.hours)}h</span>
                  <span className="log-history-date">{formatLogDate(log.date)}</span>
                  {log.type === 'milestone' && (
                    <span className="log-history-tag">Milestone sync</span>
                  )}
                  {log.note && <span className="log-history-note">{log.note}</span>}
                </div>
                {onRemoveLog && (
                  <button
                    className="log-history-undo"
                    onClick={() => onRemoveLog(log.id)}
                  >
                    Undo
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogPanel;
