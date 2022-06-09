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
// import useStorageSyncHook from "../hooks/useStorageSyncHook";

function Stopwatch(props) {
  const {
    timeData,
    setTimeData,
    setTicking,
    ticking,
    countingTimeData,
    setCountingTimeData,
    isBreak,
    setIsBreak,
  } = props;
  const [text, setText] = useState("");
  console.log("RERENDERING1", countingTimeData);
  console.log("RERENDERING2", timeData);
  const timerIdRef = useRef(0);

  const startHandler = () => {
    if (isBreak) {
      timerIdRef.current = setInterval(() => {
        setCountingTimeData((c) => ({
          ...c,
          timeBreakTime: c.timeBreakTime - 1,
        }));
      }, 1000);
    } else {
      timerIdRef.current = setInterval(() => {
        setCountingTimeData((c) => ({
          ...c,
          timeFocus: c.timeFocus - 1,
        }));
      }, 1000);
    }
    setTicking(true);
  };
  const stopHandler = () => {
    clearInterval(timerIdRef.current);
    setTicking(false);
  };
  useEffect(() => {
    if (countingTimeData.timeFocus <= 0) {
      setIsBreak(true);
      setTicking(false);
      if (ticking) {
        if (countingTimeData.nOfCycles - 1 === 0) {
          setText("this is the end of the session");
        }
        setCountingTimeData((c) => ({
          timeNOfCycles: c.timeNOfCycles - 1,
          timeFocus: timeData.focus,
          timeBreakTime: timeData.breakTime,
        }));
      }
      clearInterval(timerIdRef.current);
    }
    if (countingTimeData.timeBreakTime <= 0) {
      setIsBreak(false);
      setTicking(false);
      if (ticking) {
        setCountingTimeData((c) => ({
          ...c,
          timeFocus: timeData.focus,
          timeBreakTime: timeData.breakTime,
        }));
      }
      clearInterval(timerIdRef.current);
    }
  }, [countingTimeData]);

  useEffect(() => {
    return () => {
      clearInterval(timerIdRef.current);
    };
  }, []);
  return (
    <div>
      <div>
        <div>n of cycle: {countingTimeData.timeNOfCycles} left</div>
      </div>
      {isBreak ? (
        <div>running BREAK time: {countingTimeData.timeBreakTime}</div>
      ) : (
        <div>running FOCUS time: {countingTimeData.timeFocus}</div>
      )}

      <div>
        <button onClick={startHandler} disabled={ticking}>
          Start
        </button>
        <button onClick={stopHandler} disabled={!ticking}>
          Stop
        </button>
      </div>
      <div color="red">{text}</div>
    </div>
  );
}

export default function FocusTab(props) {
  const {
    counting,
    setCounting,
    setTicking,
    ticking,
    isBreak,
    setIsBreak,
    timeData,
    setTimeData,
    countingTimeData,
    setCountingTimeData,
  } = props;

  // const [countingTimeData, setCountingTimeData] = React.useState({
  //   timeNOfCycles: 0,
  //   timeFocus: 0,
  //   timeBreakTime: 0,
  // });
  const startSession = () => {
    setCounting(true);
    const data = {
      timeNOfCycles: timeData.nOfCycles,
      timeFocus: timeData.focus,
      timeBreakTime: timeData.breakTime,
    };
    setCountingTimeData(data);
    chrome.storage.sync.set(data);
  };
  const stopSession = () => {
    setCounting(false);
    setTicking(false);
  };
  // console.log({ timeData });
  // useEffect(() => {
  //   async function getDataFromSyncStorage() {
  //     const storageCountingTimeData = await chrome.storage.sync.get([
  //       "timeNOfCycles",
  //       "timeFocus",
  //       "timeBreakTime",
  //     ]);

  //     setCountingTimeData({
  //       timeNOfCycles: parseInt(storageCountingTimeData.timeNOfCycles),
  //       timeFocus: parseInt(storageCountingTimeData.timeFocus),
  //       timeBreakTime: parseInt(storageCountingTimeData.timeBreakTime),
  //     });
  //   }
  //   getDataFromSyncStorage();
  // }, []);

  return (
    <>
      {counting ? (
        <>
          {console.log("counting appear")}
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
            countingTimeData={countingTimeData}
            setCountingTimeData={setCountingTimeData}
            isBreak={isBreak}
            setIsBreak={setIsBreak}
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

  return (
    <>
      <h4>Meta Data</h4>
      <div>cycle: {timeData.nOfCycles}</div>
      <div>current time: {timeData.focus} left</div>
      <div>break time: {timeData.breakTime} left</div>
      <Button onClick={stopSession}>stop your sesssion</Button>
    </>
  );
}
function ConfigurationMode(props) {
  const { startSession, setTimeData, timeData } = props;
  console.log({ timeData });
  const cycleRef = React.useRef();
  const focusRef = React.useRef();
  const breakRef = React.useRef();

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
                  value={timeData ? timeData.nOfCycles : 1}
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
                  value={timeData ? timeData.focus : 1}
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
                  value={timeData ? timeData.breakTime : 1}
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
        onClick={startSession}
      >
        Start your session
      </Button>
      <Button variant="outlined" fullWidth color="warning">
        Reset your session
      </Button>
    </div>
  );
}
