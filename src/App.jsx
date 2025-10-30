import { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProgressRing from './components/ProgressRing';
import LiquidProgress from './components/LiquidProgress';
import ParticleProgress from './components/ParticleProgress';
import LogPanel from './components/LogPanel';
import StreakCounter from './components/StreakCounter';
import WeeklyTracker from './components/WeeklyTracker';
import Roadmap from './components/Roadmap';
import AddSkillModal from './components/AddSkillModal';
import EditSkillModal from './components/EditSkillModal';
import ConfirmModal from './components/ConfirmModal';
import Confetti from './components/Confetti';
import { ToastContainer, useToast } from './components/Toast';
import { TargetIcon, CalendarIcon, GridIcon, EyeIcon } from './components/Icons';

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
  const [skillBeingEdited, setSkillBeingEdited] = useState(null);
  const [skillPendingDelete, setSkillPendingDelete] = useState(null);
  const [viewMode, setViewMode] = useState('skill'); // 'dashboard' or 'skill'
  const [progressView, setProgressView] = useState('liquid'); // 'ring', 'liquid', 'particle'
  const { toasts, addToast, removeToast } = useToast();

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
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ skills, activeSkillId })
    );
  }, [skills, activeSkillId]);

  const activeSkill = skills.find((s) => s.id === activeSkillId);

  const sortLogsChronologically = (logs) =>
    [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));

  const calculateWeeklyData = (logs) => {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const data = new Array(7).fill(0);

    logs.forEach((log) => {
      const logDate = new Date(log.date);
      const startOfLogDay = new Date(
        logDate.getFullYear(),
        logDate.getMonth(),
        logDate.getDate()
      );

      const diffInDays = Math.floor(
        (startOfToday - startOfLogDay) / (1000 * 60 * 60 * 24)
      );

      if (diffInDays >= 0 && diffInDays < 7) {
        data[logDate.getDay()] += log.hours;
      }
    });

    return data;
  };

  const calculateStreak = (logs) => {
    if (logs.length === 0) return 0;

    const logDates = new Set(
      sortLogsChronologically(logs).map((log) =>
        new Date(log.date).toDateString()
      )
    );

    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    while (logDates.has(cursor.toDateString())) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
  };

  const recalculateSkill = (skill) => {
    const orderedLogs = sortLogsChronologically(skill.logs);
    const totalHours = orderedLogs.reduce((sum, log) => sum + log.hours, 0);

    const weeklyData = calculateWeeklyData(orderedLogs);
    const streak = calculateStreak(orderedLogs);
    const lastLogDate = orderedLogs.length
      ? new Date(orderedLogs[orderedLogs.length - 1].date).toDateString()
      : null;

    const updatedMilestones = skill.milestones.map((milestone) => ({
      ...milestone,
      completed: totalHours >= milestone.targetHours,
    }));

    return {
      ...skill,
      hours: totalHours,
      weeklyData,
      streak,
      lastLogDate,
      milestones: updatedMilestones,
    };
  };

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

    setSkills([...skills, recalculateSkill(newSkill)]);
    setActiveSkillId(newSkill.id);
  };

  // Log hours for active skill
  const handleLogHours = (hours, metadata = {}) => {
    if (!activeSkill) return;

    const enhancedHours = Number(hours);
    if (!enhancedHours || enhancedHours <= 0) return;

    setSkills(
      skills.map((skill) => {
        if (skill.id !== activeSkillId) return skill;

        const previousCompleted = skill.milestones.filter((m) => m.completed).length;
        const newLog = {
          id: Date.now(),
          hours: enhancedHours,
          date: new Date().toISOString(),
          type: metadata.type || 'manual',
          note: metadata.note || null,
          milestoneId: metadata.milestoneId || null,
        };

        const recalculated = recalculateSkill({
          ...skill,
          logs: [...skill.logs, newLog],
        });

        const newCompleted = recalculated.milestones.filter((m) => m.completed).length;
        if (newCompleted > previousCompleted) {
          setConfettiTrigger((prev) => prev + 1);
          const nextMilestone = recalculated.milestones.find((m, idx) =>
            idx === previousCompleted
          );
          addToast(
            `🎉 Milestone achieved: ${nextMilestone?.title || 'New milestone'}!`,
            'milestone',
            4000
          );
        } else {
          addToast(`✨ Logged ${enhancedHours} hours successfully!`, 'success', 2000);
        }

        return recalculated;
      })
    );
  };

  // Toggle milestone completion
  const handleToggleMilestone = (milestoneId) => {
    if (!activeSkill) return;

    setSkills(
      skills.map((skill) => {
        if (skill.id !== activeSkillId) return skill;

        const milestone = skill.milestones.find((m) => m.id === milestoneId);
        if (!milestone) return skill;

        if (!milestone.completed) {
          const difference = Math.max(0, milestone.targetHours - skill.hours);
          const previousCompleted = skill.milestones.filter((m) => m.completed).length;

          const recalculated = recalculateSkill({
            ...skill,
            logs:
              difference > 0
                ? [
                    ...skill.logs,
                    {
                      id: Date.now(),
                      hours: difference,
                      date: new Date().toISOString(),
                      type: 'milestone',
                      milestoneId,
                      note: `Synced to ${milestone.title}`,
                    },
                  ]
                : [...skill.logs],
            milestones: skill.milestones.map((m) =>
              m.id === milestoneId ? { ...m, completed: true } : m
            ),
          });

          const newCompleted = recalculated.milestones.filter((m) => m.completed).length;
          if (newCompleted > previousCompleted) {
            setConfettiTrigger((prev) => prev + 1);
          }

          return recalculated;
        }

        const remainingLogs = skill.logs.filter(
          (log) => log.milestoneId !== milestoneId
        );

        return recalculateSkill({
          ...skill,
          logs: remainingLogs,
          milestones: skill.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: false } : m
          ),
        });
      })
    );

    // Trigger confetti if marking as complete
    const milestone = activeSkill.milestones.find((m) => m.id === milestoneId);
    if (milestone && !milestone.completed) {
      setConfettiTrigger((prev) => prev + 1);
    }
  };

  const handleRemoveLog = (logId) => {
    if (!activeSkill) return;

    const logToRemove = activeSkill.logs.find(log => log.id === logId);
    setSkills(
      skills.map((skill) => {
        if (skill.id !== activeSkillId) return skill;
        const updatedLogs = skill.logs.filter((log) => log.id !== logId);
        return recalculateSkill({
          ...skill,
          logs: updatedLogs,
        });
      })
    );
    if (logToRemove) {
      addToast(`Removed ${logToRemove.hours} hours`, 'success', 2000);
    }
  };

  const handleUpdateSkill = (skillId, updates) => {
    setSkills((prevSkills) =>
      prevSkills.map((skill) => {
        if (skill.id !== skillId) return skill;

        const nextGoal = updates.goal || skill.goal;

        let nextMilestones = skill.milestones;
        if (updates.goal && updates.goal !== skill.goal) {
          const template = createDefaultRoadmap(nextGoal);
          nextMilestones = template.map((templateMilestone, index) => ({
            ...templateMilestone,
            id: skill.milestones[index]?.id || templateMilestone.id,
          }));
        }

        return recalculateSkill({
          ...skill,
          ...updates,
          goal: nextGoal,
          milestones: nextMilestones,
        });
      })
    );
  };

  const handleDeleteSkill = (skillId) => {
    setSkills((prevSkills) => {
      const remaining = prevSkills.filter((skill) => skill.id !== skillId);
      if (skillId === activeSkillId) {
        setActiveSkillId(remaining[0]?.id || null);
      }
      return remaining;
    });
  };

  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timelineLogs = useMemo(() => {
    if (!activeSkill) return [];
    return sortLogsChronologically(activeSkill.logs).reverse();
  }, [activeSkill]);

  return (
    <div className="app">
      <Sidebar
        skills={skills}
        activeSkillId={activeSkillId}
        onSelectSkill={(id) => {
          setActiveSkillId(id);
          setViewMode('skill');
        }}
        onAddSkill={() => setShowAddModal(true)}
        onEditSkill={(skill) => setSkillBeingEdited(skill)}
        onDeleteSkill={(skill) => setSkillPendingDelete(skill)}
      />

      <main className="main-content">
        <div className="main-header">
          <div className="main-header-left">
            <h1 style={{ fontSize: '28px', fontWeight: '600' }}>
              {viewMode === 'dashboard'
                ? 'Dashboard'
                : activeSkill
                ? activeSkill.name
                : 'Select a skill to get started'}
            </h1>
          </div>
          <div className="main-header-right">
            {skills.length > 0 && (
              <div className="view-toggle-group">
                <button
                  className={`view-toggle-btn ${viewMode === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setViewMode('dashboard')}
                  title="Dashboard View"
                >
                  <GridIcon />
                </button>
                <button
                  className={`view-toggle-btn ${viewMode === 'skill' ? 'active' : ''}`}
                  onClick={() => setViewMode('skill')}
                  title="Skill View"
                  disabled={!activeSkillId}
                >
                  <EyeIcon />
                </button>
              </div>
            )}
            <div className="current-date">
              <CalendarIcon />
              {currentDate}
            </div>
          </div>
        </div>

        {viewMode === 'dashboard' ? (
          <Dashboard
            skills={skills}
            activeSkillId={activeSkillId}
            onSelectSkill={(id) => {
              setActiveSkillId(id);
              setViewMode('skill');
            }}
          />
        ) : activeSkill ? (
          <div className="dashboard-grid">
            <div className="progress-section">
              <div className="card">
                <div className="card-header-with-actions">
                  <div className="card-title">
                    <TargetIcon />
                    Progress Overview
                  </div>
                  <div className="progress-view-selector">
                    <button
                      className={`progress-view-btn ${progressView === 'liquid' ? 'active' : ''}`}
                      onClick={() => setProgressView('liquid')}
                      title="Liquid View"
                    >
                      Liquid
                    </button>
                    <button
                      className={`progress-view-btn ${progressView === 'particle' ? 'active' : ''}`}
                      onClick={() => setProgressView('particle')}
                      title="Particle View"
                    >
                      Particle
                    </button>
                    <button
                      className={`progress-view-btn ${progressView === 'ring' ? 'active' : ''}`}
                      onClick={() => setProgressView('ring')}
                      title="Ring View"
                    >
                      Ring
                    </button>
                  </div>
                </div>

                {progressView === 'liquid' && (
                  <LiquidProgress hours={activeSkill.hours} goal={activeSkill.goal} />
                )}
                {progressView === 'particle' && (
                  <ParticleProgress hours={activeSkill.hours} goal={activeSkill.goal} />
                )}
                {progressView === 'ring' && (
                  <ProgressRing hours={activeSkill.hours} goal={activeSkill.goal} />
                )}

                <LogPanel
                  onLogHours={handleLogHours}
                  logs={timelineLogs}
                  onRemoveLog={handleRemoveLog}
                />

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

      {skillBeingEdited && (
        <EditSkillModal
          skill={skillBeingEdited}
          onClose={() => setSkillBeingEdited(null)}
          onSave={(updates) => {
            handleUpdateSkill(skillBeingEdited.id, updates);
            setSkillBeingEdited(null);
          }}
        />
      )}

      {skillPendingDelete && (
        <ConfirmModal
          title="Delete skill"
          message={`Are you sure you want to delete ${skillPendingDelete.name}? This action cannot be undone.`}
          confirmLabel="Delete"
          confirmTone="danger"
          onCancel={() => setSkillPendingDelete(null)}
          onConfirm={() => {
            if (skillBeingEdited?.id === skillPendingDelete.id) {
              setSkillBeingEdited(null);
            }
            handleDeleteSkill(skillPendingDelete.id);
            setSkillPendingDelete(null);
          }}
        />
      )}

      <Confetti trigger={confettiTrigger} />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
