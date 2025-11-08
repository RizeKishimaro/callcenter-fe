
import React, { useState, useEffect } from "react";

const LoggedCounter = ({ loggedInTime }) => {
  const [timeDiff, setTimeDiff] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const startTime = new Date(loggedInTime).getTime(); // Convert loggedInTime to milliseconds

    const updateTimeDiff = () => {
      const now = new Date().getTime();
      const diffInSeconds = Math.floor((now - startTime) / 1000); // Difference in seconds

      const days = Math.floor(diffInSeconds / (3600 * 24));
      const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;

      setTimeDiff({ days, hours, minutes, seconds });
    };

    // Update the time difference every second
    const interval = setInterval(updateTimeDiff, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [loggedInTime]);

  return (
    <div>
      <p>
        {timeDiff.days} days, {timeDiff.hours} hours, {timeDiff.minutes} minutes,{" "}
        {timeDiff.seconds} seconds
      </p>
    </div>
  );
};

export default LoggedCounter;


