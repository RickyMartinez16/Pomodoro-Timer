import React, { useState } from "react";
import { minutesToDuration, secondsToDuration } from "../utils/duration";
import useInterval from "../utils/useInterval";
import FocusTimer from "../FocusTimer";
import BreakTimer from "../BreakTimer";
import PlayStopButton from "../PlayStopButton";
import TimerBar from "../TimerBar";

// These functions are defined outside of the component to ensure they do not have access to state
// and are, therefore, more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

/**
 * Higher-order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // The current session - null where there is no session running
  const [session, setSession] = useState(null);

  // ToDo: Allow the user to adjust the focus and break duration.
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  const [progressBarCalc, setProgressBarCalc] = useState(0);

  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You won't need to make changes to the callback function
   */
   useInterval(() => {
    if (session.timeRemaining === 0) {
      new Audio("https://bigsoundbank.com/UPLOAD/mp3/2386.mp3").play();
      setSession(nextSession(focusDuration, breakDuration));
    }
    setSession(nextTick);
  
  if(session.label === "Focusing"){
    setProgressBarCalc(((focusDuration*60) - session.timeRemaining) / (focusDuration*60) * 100);
    
  } else{
    setProgressBarCalc(((breakDuration*60) - session.timeRemaining) / (breakDuration*60) * 100);
    
  }
},
  isTimerRunning ? 1000 : null
);

  /**
   * Called whenever the play/pause button is clicked.
   */
  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }


  const handleDecreaseFocus = () => {
    // console.log(focusDuration);
    setFocusDuration((lastFocusDuration) => Math.max(5, lastFocusDuration - 5));
  };

  const handleIncreaseFocus = () => {
    setFocusDuration((lastFocusDuration) => Math.min(60, lastFocusDuration +5));
  }

  const handleDecreaseBreak = () => {
    setBreakDuration((lastBreakDuration) => Math.max(1, lastBreakDuration - 1));
  }

  const handleIncreaseBreak = () => {
    setBreakDuration((lastBreakDuration) => Math.min(15, lastBreakDuration +1));
  }

  const handleStopButton = () => {
    setSession(null);
    setIsTimerRunning(false);
  };

  const displayPaused = () => {
    if(!isTimerRunning){
      return "PAUSED"
    }
  };

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
            <FocusTimer 
              focusDuration={focusDuration}
              minutesToDuration={minutesToDuration}
              isTimerRunning={isTimerRunning}
              handleDecreaseFocus={handleDecreaseFocus}
              handleIncreaseFocus={handleIncreaseFocus}
            />
        </div>
        <div className="col">
          <div className="float-right">
            <BreakTimer 
              breakDuration={breakDuration}
              minutesToDuration={minutesToDuration}
              isTimerRunning={isTimerRunning}
              handleDecreaseBreak={handleDecreaseBreak}
              handleIncreaseBreak={handleIncreaseBreak}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <PlayStopButton 
            playPause={playPause}
            isTimerRunning={isTimerRunning}
            handleStopButton={handleStopButton}
          />
        </div>
      </div>
      <TimerBar 
        session={session}
        focusDuration={focusDuration}
        breakDuration={breakDuration}
        secondsToDuration={secondsToDuration}
        displayPaused={displayPaused}
        minutesToDuration={minutesToDuration}
        isTimerRunning={isTimerRunning}
        progressBarCalc={progressBarCalc}
      />

    </div>
  );
}

export default Pomodoro;

