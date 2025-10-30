import { BarChartIcon } from './Icons';

const WeeklyTracker = ({ weeklyData }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const maxHours = Math.max(...weeklyData, 1); // Min 1 to avoid division by zero

  return (
    <div className="card weekly-tracker">
      <div className="card-title">
        <BarChartIcon />
        Weekly Progress
      </div>

      <div className="weekly-bars">
        {weeklyData.map((hours, index) => {
          const heightPercentage = (hours / maxHours) * 100;

          return (
            <div key={days[index]} className="day-bar">
              <div className="bar-container">
                <div
                  className="bar-fill"
                  style={{ height: `${heightPercentage}%` }}
                  title={`${hours}h`}
                />
              </div>
              <div className="day-label">{days[index]}</div>
              {hours > 0 && <div className="day-hours">{hours}h</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyTracker;
