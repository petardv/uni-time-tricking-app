import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
// import "./helpers.js";

function TimersDashboard() {
  const [timers, setTimers] = useState([
    {
      title: "title 1",
      project: "project 1",
      id: 1,
      elapsed: "60000",
      runningSince: Date.now(),
    },
    {
      title: "title 2",
      project: "project 2",
      id: 2,
      elapsed: "30000",
      runningSince: null,
    },
  ]);

  function deleteTimer(timerId) {
    setTimers(timers.filter((t) => t.id !== timerId));
  }

  function startTimer(timerId) {
    const now = Date.now();

    setTimers(
      timers.map((timer) => {
        if (timer.id === timerId) {
          return Object.assign({}, timer, {
            runningSince: now,
          });
        } else {
          return timer;
        }
      })
    );
  }

  function stopTimer(timerId) {
    const now = Date.now();

    setTimers(
      timers.map((timer) => {
        if (timer.id === timerId) {
          const lastElapsed = now - timer.runningSince;
          return Object.assign({}, timer, {
            elapsed: timer.elapsed + lastElapsed,
            timerIsRunnining: null,
          });
        } else {
          return timer;
        }
      })
    );
  }

  return (
    <div>
      <EditableTimerList
        timers={timers}
        onTrashClick={deleteTimer}
        onStartClick={startTimer}
        onStopClick={stopTimer}
      ></EditableTimerList>
      <ToggleableTimerForm isOpen={false}></ToggleableTimerForm>
    </div>
  );
}

function ToggleableTimerForm({ isOpen }) {
  if (isOpen) {
    return <TimerForm></TimerForm>;
  } else {
    return (
      <div className="ui basic content center aligned segment">
        <button className="ui basic button icon">
          <i className="plus icon" />
        </button>
      </div>
    );
  }
}
function EditableTimerList({
  timers,
  onTrashClick,
  onStartClick,
  onStopClick,
}) {
  const timersJSX = timers.map((timer) => (
    <EditableTimer
      key={timer.id}
      id={timer.id}
      editFormOpen={false}
      title={timer.title}
      project={timer.project}
      elapsed={timer.elapsed}
      runningSince={timer.runningSince}
      onTrashClick={onTrashClick}
      onStartClick={onStartClick}
      onStopClick={onStopClick}
    ></EditableTimer>
  ));
  return <div id="timers">{timersJSX}</div>;
}

function EditableTimer({
  id,
  runningSince,
  elapsed,
  title,
  project,
  onTrashClick,
  onStartClick,
  onStopClick,
}) {
  const [editFormOpen, seteditFormOpen] = useState(false);

  function handleEditClick() {
    seteditFormOpen(true);
  }

  if (editFormOpen) {
    return <TimerForm title={title} project={project}></TimerForm>;
  } else {
    return (
      <Timer
        id={id}
        title={title}
        project={project}
        elapsed={elapsed}
        runningSince={runningSince}
        onEditClick={handleEditClick}
        onTrashClick={onTrashClick}
        onStartClick={onStartClick}
        onStopClick={onStopClick}
      ></Timer>
    );
  }
}

function Timer({
  id,
  elapsed,
  runningSince,
  title,
  project,
  onEditClick,
  onTrashClick,
  onStartClick,
  onStopClick,
}) {
  function renderElapsedString(elapsed, runningSince) {
    let totalElapsed = elapsed;
    if (runningSince) {
      totalElapsed += Date.now() - runningSince;
    }
    return millisecondsToHuman(totalElapsed);
  }

  function millisecondsToHuman(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor(ms / 1000 / 60 / 60);

    const humanized = [
      pad(hours.toString(), 2),
      pad(minutes.toString(), 2),
      pad(seconds.toString(), 2),
    ].join(":");

    return humanized;
  }

  function pad(numberString, size) {
    let padded = numberString;
    while (padded.length < size) padded = `0${padded}`;
    return padded;
  }

  function handleEditClick() {
    onEditClick(id);
  }

  function handleTrashClick() {
    onTrashClick(id);
  }

  function handleStartClick() {
    onStartClick(id);
  }

  function handleStopClick() {
    onStopClick(id);
  }

  const elapsedString = renderElapsedString(elapsed);
  return (
    <div className="ui centered card">
      <div className="content">
        <div className="header">{title}</div>
        <div className="meta">{project}</div>
        <div className="center aligned description">
          <h2>{elapsedString}</h2>
        </div>
        <div className="extra content">
          <span className="right floated edit icon" onClick={handleEditClick}>
            <i className="edit icon"></i>
          </span>
        </div>
        <div className="extra content">
          <span className="right floated trash icon" onClick={handleTrashClick}>
            <i className="trash icon"></i>
          </span>
        </div>
      </div>
      <TimerActionButton
        timerIsRunnining={!!runningSince}
        onStartClick={handleStartClick}
        onStopClick={handleStopClick}
      ></TimerActionButton>
    </div>
  );
}

function TimerActionButton({ timerIsRunnining, onStartClick, onStopClick }) {
  if (timerIsRunnining) {
    return (
      <div
        className="ui button attached blue basic button"
        onClick={onStopClick}
      >
        Stop
      </div>
    );
  } else {
    return (
      <div
        className="ui button attached blue basic button"
        onClick={onStartClick}
      >
        Start
      </div>
    );
  }
}

function TimerForm({ title, project }) {
  const [titleState, setTitleState] = useState(title || "");
  const [projectState, setProjectState] = useState(project || "");
  const subtimText = title ? "Update" : "Create";
  return (
    <div className="ui centered card">
      <div className="content">
        <div className="ui form">
          <div className="field">
            <label>Title</label>
            <input type="text" defaultValue={titleState}></input>
          </div>
          <div className="field">
            <label>Project</label>
            <input type="text" defaultValue={projectState}></input>
          </div>
          <div className="ui two bottom attached buttons">
            <button className="ui basic blue button">{subtimText}</button>
            <button className="ui basic red button">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimersDashboard;
