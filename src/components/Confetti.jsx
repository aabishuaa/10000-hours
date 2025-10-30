import { useEffect, useState } from 'react';

const Confetti = ({ trigger }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (!trigger) return;

    // Generate confetti pieces
    const pieces = [];
    const colors = ['#6EE7FF', '#6A5CFF', '#39FF88', '#FFC34D'];

    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: Math.random(),
        left: Math.random() * 100,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        animationDelay: Math.random() * 0.5,
        animationDuration: 2 + Math.random() * 1,
      });
    }

    setConfetti(pieces);

    // Clear confetti after animation
    const timer = setTimeout(() => {
      setConfetti([]);
    }, 3500);

    return () => clearTimeout(timer);
  }, [trigger]);

  if (confetti.length === 0) return null;

  return (
    <div className="confetti-container">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.backgroundColor,
            animationDelay: `${piece.animationDelay}s`,
            animationDuration: `${piece.animationDuration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
