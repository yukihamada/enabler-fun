import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ time }: { time: number }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(time);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return (
    <span>
      残り時間: {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </span>
  );
};

export default CountdownTimer;
