import React from "react";
import classNames from "./utils/class-names";

function StopButton({isTimerRunning, handleStopButton}){
    return (
        <div>
            <button
            type="button"
            className="btn btn-secondary"
            data-testid="stop"
            title="Stop the session"
            disabled={!isTimerRunning}
            onClick={handleStopButton}
        >
            <span className="oi oi-media-stop" />
        </button>
        </div>

    )
}

export default StopButton;