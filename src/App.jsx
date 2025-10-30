import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ProgressRing from './components/ProgressRing';
import LogPanel from './components/LogPanel';
import StreakCounter from './components/StreakCounter';
import WeeklyTracker from './components/WeeklyTracker';
import Roadmap from './components/Roadmap';
import AddSkillModal from './components/AddSkillModal';
import Confetti from './components/Confetti';
import { TargetIcon, CalendarIcon } from './components/Icons';

const STORAGE_KEY = 'tenk.skills.v1';

// Default roadmap template
const createDefaultRoadmap = (goal) => {
  const milestones = [
    { title: 'Foundations', targetHours: goal * 0.1 },
    { title: 'Building Skills', targetHours: goal * 0.25 },
    { title: 'Intermediate Mastery', targetHours: goal * 0.5 },
    { title: 'Advanced Proficiency', targetHours: goal * 0.75 },
    { title: 'Expert Level', targetHours: goal },
  ];

  return milestones.map((m, index) => ({
    id: `milestone-${index}`,
    title: m.title,
    targetHours: m.targetHours,
    completed: false,
  }));
};

function App() {
  const [skills, setSkills] = useState([]);
  const [activeSkillId, setActiveSkillId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSkills(data.skills || []);
        if (data.skills.length > 0) {
          setActiveSkillId(data.activeSkillId || data.skills[0].id);
        }
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (skills.length > 0) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ skills, activeSkillId })
      );
    }
  }, [skills, activeSkillId]);

  const activeSkill = skills.find((s) => s.id === activeSkillId);

  // Add new skill
  const handleAddSkill = (name, goal) => {
    const newSkill = {
      id: `skill-${Date.now()}`,
      name,
      goal,
      hours: 0,
      milestones: createDefaultRoadmap(goal),
      logs: [],
      weeklyData: [0, 0, 0, 0, 0, 0, 0],
      streak: 0,
      lastLogDate: null,
    };

    setSkills([...skills, newSkill]);
    setActiveSkillId(newSkill.id);
  };

  // Log hours for active skill
  const handleLogHours = (hours) => {
    if (!activeSkill) return;

    const today = new Date().toDateString();
    const dayOfWeek = new Date().getDay();

    setSkills(
      skills.map((skill) => {
        if (skill.id !== activeSkillId) return skill;

        const newHours = skill.hours + hours;
        const newWeeklyData = [...skill.weeklyData];
        newWeeklyData[dayOfWeek] += hours;

        // Update streak
        let newStreak = skill.streak;
        if (skill.lastLogDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const wasYesterday = skill.lastLogDate === yesterday.toDateString();

          newStreak = wasYesterday || skill.lastLogDate === null ? skill.streak + 1 : 1;
        }

        // Check for milestone completion
        const updatedMilestones = skill.milestones.map((m) => {
          if (!m.completed && newHours >= m.targetHours) {
            setConfettiTrigger((prev) => prev + 1);
            return { ...m, completed: true };
          }
          return m;
        });

        return {
          ...skill,
          hours: newHours,
          weeklyData: newWeeklyData,
          streak: newStreak,
          lastLogDate: today,
          milestones: updatedMilestones,
          logs: [
            ...skill.logs,
            {
              id: Date.now(),
              hours,
              date: new Date().toISOString(),
            },
          ],
        };
      })
    );
  };

  // Toggle milestone completion
  const handleToggleMilestone = (milestoneId) => {
    if (!activeSkill) return;

    setSkills(
      skills.map((skill) => {
        if (skill.id !== activeSkillId) return skill;

        return {
          ...skill,
          milestones: skill.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          ),
        };
      })
    );

    // Trigger confetti if marking as complete
    const milestone = activeSkill.milestones.find((m) => m.id === milestoneId);
    if (milestone && !milestone.completed) {
      setConfettiTrigger((prev) => prev + 1);
    }
  };

  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="app">
      <Sidebar
        skills={skills}
        activeSkillId={activeSkillId}
        onSelectSkill={setActiveSkillId}
        onAddSkill={() => setShowAddModal(true)}
      />

      <main className="main-content">
        <div className="main-header">
          <h1 style={{ fontSize: '28px', fontWeight: '600' }}>
            {activeSkill ? activeSkill.name : 'Select a skill to get started'}
          </h1>
          <div className="current-date">
            <CalendarIcon />
            {currentDate}
          </div>
        </div>

        {activeSkill ? (
          <div className="dashboard-grid">
            <div className="progress-section">
              <div className="card">
                <div className="card-title">
                  <TargetIcon />
                  Progress Overview
                </div>

                <ProgressRing hours={activeSkill.hours} goal={activeSkill.goal} />

                <LogPanel onLogHours={handleLogHours} />

                <StreakCounter streak={activeSkill.streak} />
              </div>
            </div>

            <Roadmap
              milestones={activeSkill.milestones}
              currentHours={activeSkill.hours}
              onToggleMilestone={handleToggleMilestone}
            />

            <WeeklyTracker weeklyData={activeSkill.weeklyData} />
          </div>
        ) : (
          <div className="card">
            <div className="empty-state" style={{ padding: '80px 20px' }}>
              <TargetIcon />
              <h3>Ready to master a new skill?</h3>
              <p>
                Add your first skill to start tracking your journey toward 10,000 hours of
                mastery
              </p>
            </div>
          </div>
        )}
      </main>

      {showAddModal && (
        <AddSkillModal onAdd={handleAddSkill} onClose={() => setShowAddModal(false)} />
      )}

      <Confetti trigger={confettiTrigger} />
    </div>
  );
}

export default App;
