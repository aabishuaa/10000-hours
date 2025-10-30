# 10,000 Hour Tracker

An interactive web app for tracking time invested toward mastering any skill — helping users visualize progress toward 10,000 hours, maintain streaks, and follow a roadmap of learning milestones.

![10000 Hour Tracker](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)

## Features

- **Progress Tracking**: Visualize your journey with an animated circular progress ring
- **Multiple Skills**: Track progress across different skills simultaneously
- **Quick Logging**: Fast-entry buttons for common time intervals (15min, 30min, 1hr)
- **Learning Roadmap**: Break down your journey into milestones with progress tracking
- **Streak Counter**: Stay motivated with a daily practice streak tracker
- **Weekly Overview**: See your weekly time distribution at a glance
- **Confetti Celebrations**: Get rewarded when you complete milestones
- **Persistent Storage**: All your data is saved locally in your browser
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18 with functional components and hooks
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Pure CSS3 with custom properties and animations
- **State Management**: React useState/useEffect hooks
- **Data Persistence**: Browser localStorage API

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (version 16 or higher).

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd 10000-hours
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Build for Production

To create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory. You can preview the production build with:

```bash
npm run preview
```

## Usage

### Adding a New Skill

1. Click the **"Add Skill"** button in the sidebar
2. Enter the skill name (e.g., "Piano", "Programming", "Spanish")
3. Set your goal in hours (default: 10,000)
4. Click **"Add Skill"** to create

The app will automatically generate a 5-stage learning roadmap for your skill.

### Logging Practice Time

There are two ways to log time:

1. **Quick Log**: Click one of the preset buttons (+15 min, +30 min, +1 hour)
2. **Manual Entry**: Type any duration in hours (e.g., 2.5) and click "Log"

### Tracking Milestones

Each skill comes with 5 default milestones:
- Foundations (10% of goal)
- Building Skills (25% of goal)
- Intermediate Mastery (50% of goal)
- Advanced Proficiency (75% of goal)
- Expert Level (100% of goal)

Milestones automatically complete when you reach the target hours, or you can manually check them off.

### Understanding the Dashboard

- **Progress Ring**: Shows total hours and percentage toward your goal
- **Streak Counter**: Tracks consecutive days of practice
- **Weekly Bars**: Displays hours practiced each day of the current week
- **Roadmap**: Shows your milestone progress and targets

## Design System

### Color Palette

| Element         | Color                                       | Usage                        |
| --------------- | ------------------------------------------- | ---------------------------- |
| Background      | `#0B0E13`                                   | Main background              |
| Panel/Container | `#11161F`                                   | Card backgrounds             |
| Accent Gradient | `linear-gradient(135deg, #6EE7FF, #6A5CFF)` | Primary actions & highlights |
| Success         | `#39FF88`                                   | Milestone completion         |
| Warning         | `#FFC34D`                                   | Streak warnings              |
| Text Primary    | `#E9EDF4`                                   | Main text                    |
| Text Muted      | `#AAB6C5`                                   | Secondary text               |

### Typography

- **Font Family**: Poppins (from Google Fonts)
- **Fallbacks**: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif

## Project Structure

```
10000-hours/
├── public/
│   └── favicon.svg          # Browser icon
├── src/
│   ├── components/
│   │   ├── AddSkillModal.jsx
│   │   ├── Confetti.jsx
│   │   ├── Icons.jsx
│   │   ├── LogPanel.jsx
│   │   ├── ProgressRing.jsx
│   │   ├── Roadmap.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StreakCounter.jsx
│   │   └── WeeklyTracker.jsx
│   ├── App.jsx              # Main app component
│   ├── App.css              # Global styles
│   └── main.jsx             # React entry point
├── index.html               # HTML entry point
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

## Data Storage

All data is stored locally in your browser using `localStorage` under the key `tenk.skills.v1`.

The data structure includes:
- Skill name and goal
- Total hours logged
- Individual log entries with timestamps
- Milestone completion status
- Weekly practice data
- Current streak count
- Last log date

**Note**: Clearing your browser data will delete all tracked progress. Consider exporting your data periodically if you want to back it up.

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Future Enhancements

Potential features for future versions:
- Data export/import (JSON/CSV)
- Cloud sync with user accounts
- Custom milestone creation
- Detailed analytics and charts
- Practice session notes
- Multiple goal types (time-based, repetition-based)
- Social features (share progress)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by Malcolm Gladwell's "10,000 Hour Rule" from *Outliers*
- Icons based on the Lucide icon set
- Design philosophy influenced by modern productivity apps

---

**Built with dedication to lifelong learning and mastery** 🎯
