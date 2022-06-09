/*global chrome*/
import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
// import CommentIcon from "@mui/icons-material/Comment";
import { Divider, TextField, Button } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import useStorageSyncHook from "../hooks/useStorageSyncHook";

function Stopwatch(props) {
  console.log("RERENDERING");
  const { timeData, setTimeData, setTicking, ticking } = props;
  const [isBreak, setIsBreak] = useState(false);
  const [countingTimeData, setCountingTimeData] = useState({
    ...timeData,
    nOfCycles: timeData.nOfCycles + 1,
  });

  const timerIdRef = useRef(0);
  const startHandler = () => {
    if (isBreak) {
      timerIdRef.current = setInterval(() => {
        setCountingTimeData((c) => ({ ...c, breakTime: c.breakTime - 1 }));
      }, 1000);
    } else {
      timerIdRef.current = setInterval(
        () => setCountingTimeData((c) => ({ ...c, focus: c.focus - 1 })),
        1000
      );
    }
    setTicking(true);
  };
  const stopHandler = () => {
    // cancle the setinterval loop
    clearInterval(timerIdRef.current);
    setTicking(false);
  };
  // stop the focus and start the break
  useEffect(() => {
    if (countingTimeData.focus <= 0 || countingTimeData.breakTime <= 0) {
      setIsBreak(!isBreak);
      setTicking(false);
      return () => {
        clearInterval(timerIdRef.current);
      };
    }
  }, [countingTimeData]);
  useEffect(() => {
    if (isBreak === true)
      setCountingTimeData((c) => ({
        nOfCycles: c.nOfCycles - 1,
        focus: timeData.focus,
        breakTime: timeData.breakTime,
      }));
  }, [isBreak]);
  useEffect(() => {
    return () => clearInterval(timerIdRef.current);
  }, []);
  return (
    <div>
      <div>
        <div>n of cycle: {countingTimeData.nOfCycles} left</div>
      </div>
      {isBreak ? (
        <div>running BREAK time: {countingTimeData.breakTime}</div>
      ) : (
        <div>running FOCUS time: {countingTimeData.focus}</div>
      )}

      <div>
        <button onClick={startHandler} disabled={ticking}>
          Start
        </button>
        <button onClick={stopHandler} disabled={!ticking}>
          Stop
        </button>
      </div>
    </div>
  );
}

export default function FocusTab(props) {
  const { counting, setCounting, setTicking, ticking } = props;
  const [timeData, setTimeData] = React.useState({
    nOfCycles: 0,
    focus: 0,
    breakTime: 0,
  });
  const startSession = () => {
    setCounting(true);
  };
  const stopSession = () => {
    setCounting(false);
    setTicking(false);
  };

  useEffect(() => {
    async function getDataFromSyncStorage() {
      console.log("this is happening");
      const storageTimeData = await chrome.storage.sync.get([
        "nOfCycles",
        "focus",
        "breakTime",
      ]);
      console.log({ storageTimeData });
      setTimeData(storageTimeData);
    }

    getDataFromSyncStorage();
  }, [counting]);
  useEffect(() => {
    chrome.storage.sync.set(timeData);
  }, [timeData]);
  return (
    <>
      {counting ? (
        <>
          <TimeClock
            stopSession={stopSession}
            timeData={timeData}
            setTimeData={setTimeData}
          />
          <Divider />
          <Stopwatch
            timeData={timeData}
            setTimeData={setTimeData}
            setTicking={setTicking}
            ticking={ticking}
          />
        </>
      ) : (
        <ConfigurationMode
          startSession={startSession}
          setTimeData={setTimeData}
          timeData={timeData}
        />
      )}
    </>
  );
}
function TimeClock(props) {
  const { stopSession, setTimeData, timeData } = props;
  function stopTimer() {
    stopSession();
    setTimeData({
      nOfCycles: 0,
      focus: 0,
      breakTime: 0,
    });
  }
  return (
    <>
      <h4>Meta Data</h4>
      <div>cycle: {timeData.nOfCycles}</div>
      <div>current time: {timeData.focus} left</div>
      <div>break time: {timeData.breakTime} left</div>
      <Button onClick={stopTimer}>stop your sesssion</Button>
    </>
  );
}
function ConfigurationMode(props) {
  const { startSession, setTimeData, timeData } = props;
  console.log({ timeData });
  const cycleRef = React.useRef();
  const focusRef = React.useRef();
  const breakRef = React.useRef();
  function startTimer() {
    // setTimeData({
    //   nOfCycles: cycleRef.current.value,
    //   focus: focusRef.current.value,
    //   breakTime: breakRef.current.value,
    // });
    // console.log("get in the function");
    // chrome.storage.sync.set(
    //   {
    //     nOfCycles: cycleRef.current.value,
    //     focus: focusRef.current.value,
    //     breakTime: breakRef.current.value,
    //   },
    //   function () {
    //     console.log("value is set to ... for the timer");
    //   }
    // );
    startSession();
  }
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h3>Focus Mode Timer</h3>
      <div>focus on a task & be more productive</div>
      <div style={{ width: "100%" }}>
        <List sx={{ width: "100%", bgcolor: "background.paper", margin: "2" }}>
          <ListItem
            sx={{
              padding: "0px",
              margin: 1,
              display: "flex",
            }}
            secondaryAction={
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  minWidth: "150px",
                }}
              >
                <TextField
                  inputRef={cycleRef}
                  id="outlined-number-cyle"
                  label="Cycles"
                  type="number"
                  size="small"
                  value={timeData ? timeData.nOfCycles : 0}
                  onChange={(e) =>
                    setTimeData((c) => ({ ...c, nOfCycles: e.target.value }))
                  }
                  defaultValue={timeData ? timeData.nOfCycles : 0}
                  inputProps={{ style: { width: 70 } }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <span>&nbsp;cyl</span>
              </div>
            }
          >
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Number of cycles " />
          </ListItem>
          <Divider />
          <ListItem
            sx={{
              padding: "0px",
              margin: 1,
              display: "flex",
              justifyContent: "space-between",
            }}
            secondaryAction={
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  minWidth: "150px",
                }}
              >
                <TextField
                  inputRef={focusRef}
                  id="outlined-number-focus"
                  label="Focus"
                  type="number"
                  size="small"
                  value={timeData ? timeData.focus : 0}
                  onChange={(e) =>
                    setTimeData((c) => ({ ...c, focus: e.target.value }))
                  }
                  defaultValue={timeData ? timeData.focus : 0}
                  inputProps={{ style: { width: 70 } }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <span>&nbsp;min</span>
              </div>
            }
          >
            <ListItemAvatar>
              <Avatar>
                <WorkIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Focus Time" />
          </ListItem>
          <Divider />
          <ListItem
            sx={{
              padding: "0px",
              margin: 1,
              display: "flex",
              justifyContent: "space-between",
            }}
            secondaryAction={
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  minWidth: "150px",
                }}
              >
                <TextField
                  inputRef={breakRef}
                  id="outlined-number-break"
                  label="Break"
                  type="number"
                  size="small"
                  value={timeData ? timeData.breakTime : 0}
                  defaultValue={timeData ? timeData.breakTime : 0}
                  onChange={(e) =>
                    setTimeData((c) => ({ ...c, breakTime: e.target.value }))
                  }
                  inputProps={{ style: { width: 70 } }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <span>&nbsp;min</span>
              </div>
            }
          >
            <ListItemAvatar>
              <Avatar>
                <BeachAccessIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Break Time" />
          </ListItem>
        </List>
      </div>
      <Button
        variant="outlined"
        fullWidth
        sx={{ margin: 1 }}
        onClick={startTimer}
      >
        Start your session
      </Button>
      <Button variant="outlined" fullWidth color="warning">
        Reset your session
      </Button>
    </div>
  );
}
