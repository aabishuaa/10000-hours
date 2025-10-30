import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import AddSkillModal from './components/AddSkillModal';
import EditSkillModal from './components/EditSkillModal';
import ConfirmModal from './components/ConfirmModal';
import Confetti from './components/Confetti';
import SkillDashboard from './components/SkillDashboard';
import { CalendarIcon, TargetIcon } from './components/Icons';

const STORAGE_KEY = 'tenk.skills.v1';

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [skillBeingEdited, setSkillBeingEdited] = useState(null);
  const [skillPendingDelete, setSkillPendingDelete] = useState(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      if (Array.isArray(data.skills)) {
        setSkills(
          data.skills.map((skill) =>
            recalculateSkill({
              ...skill,
              milestones: skill.milestones || createDefaultRoadmap(skill.goal),
              logs: skill.logs || [],
            })
          )
        );
      }
    } catch (error) {
      console.error('Failed to load saved data:', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ skills })
    );
  }, [skills]);

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

    setSkills((prev) => [...prev, recalculateSkill(newSkill)]);
  };

  const handleLogHours = (skillId, hours, metadata = {}) => {
    const enhancedHours = Number(hours);
    if (!enhancedHours || enhancedHours <= 0) return;

    let shouldCelebrate = false;

    setSkills((prevSkills) =>
      prevSkills.map((skill) => {
        if (skill.id !== skillId) return skill;

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
          shouldCelebrate = true;
        }

        return recalculated;
      })
    );

    if (shouldCelebrate) {
      setConfettiTrigger((prev) => prev + 1);
    }
  };

  const handleToggleMilestone = (skillId, milestoneId) => {
    let shouldCelebrate = false;

    setSkills((prevSkills) =>
      prevSkills.map((skill) => {
        if (skill.id !== skillId) return skill;

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
            shouldCelebrate = true;
          }

          return recalculated;
        }

        const remainingLogs = skill.logs.filter((log) => log.milestoneId !== milestoneId);

        return recalculateSkill({
          ...skill,
          logs: remainingLogs,
          milestones: skill.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: false } : m
          ),
        });
      })
    );

    if (shouldCelebrate) {
      setConfettiTrigger((prev) => prev + 1);
    }
  };

  const handleRemoveLog = (skillId, logId) => {
    setSkills((prevSkills) =>
      prevSkills.map((skill) => {
        if (skill.id !== skillId) return skill;
        const updatedLogs = skill.logs.filter((log) => log.id !== logId);
        return recalculateSkill({
          ...skill,
          logs: updatedLogs,
        });
      })
    );
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
    setSkills((prevSkills) =>
      prevSkills.filter((skill) => skill.id !== skillId)
    );
  };

  const handleFocusSkill = (skillId) => {
    const node = sectionRefs.current[skillId];
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      node.classList.add('skill-dashboard-card--highlight');
      window.setTimeout(() => {
        node.classList.remove('skill-dashboard-card--highlight');
      }, 1200);
    }
  };

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
        onAddSkill={() => setShowAddModal(true)}
        onEditSkill={(skill) => setSkillBeingEdited(skill)}
        onDeleteSkill={(skill) => setSkillPendingDelete(skill)}
        onFocusSkill={handleFocusSkill}
      />

      <main className="main-content">
        <div className="main-header">
          <h1 style={{ fontSize: '28px', fontWeight: '600' }}>All skills dashboard</h1>
          <div className="current-date">
            <CalendarIcon />
            {currentDate}
          </div>
        </div>

        {skills.length > 0 ? (
          <div className="dashboard-collection">
            {skills.map((skill) => (
              <SkillDashboard
                key={skill.id}
                skill={skill}
                onLogHours={(hours, metadata) =>
                  handleLogHours(skill.id, hours, metadata)
                }
                onRemoveLog={(logId) => handleRemoveLog(skill.id, logId)}
                onToggleMilestone={(milestoneId) =>
                  handleToggleMilestone(skill.id, milestoneId)
                }
                onEditSkill={setSkillBeingEdited}
                onDeleteSkill={setSkillPendingDelete}
                sectionRef={(element) => {
                  if (element) {
                    sectionRefs.current[skill.id] = element;
                  } else {
                    delete sectionRefs.current[skill.id];
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="card">
            <div className="empty-state" style={{ padding: '80px 20px' }}>
              <TargetIcon />
              <h3>Ready to master a new skill?</h3>
              <p>
                Add your first skill to start tracking your journey toward 10,000 hours of mastery
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
            handleDeleteSkill(skillPendingDelete.id);
            setSkillPendingDelete(null);
          }}
        />
      )}

      <Confetti trigger={confettiTrigger} />
    </div>
  );
}

export default App;
