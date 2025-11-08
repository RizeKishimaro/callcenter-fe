
import React, { useState, useEffect } from 'react';

const SecondCounter = ({ inCall }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval;

    if (inCall) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      // Reset the counter when the call ends
      setSeconds(0);
    }

    // Cleanup the interval when `inCall` becomes false or on unmount
    return () => clearInterval(interval);
  }, [inCall]); // Depend on `inCall`

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div>
      <p>{formatTime(seconds)}</p>
    </div>
  );
};

export default SecondCounter;

