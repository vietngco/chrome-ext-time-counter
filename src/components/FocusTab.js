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
import { Divider, TextField, Button } from "@mui/material";
import { useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

function Stopwatch(props) {
  const {
    setTicking,
    ticking,
    countingTimeData,
    isBreak,
    setIsBreak,
    timeData,
    setCounting,
    setCountingTimeData,
  } = props;
  function stopSession() {
    setTicking(false);
    setCountingTimeData({
      timeNOfCycles: 0,
      timeBreakTime: 0,
      timeFocus: 0,
    });
    setCounting(false);
  }
  const startHandler = async () => {
    const data = await chrome.runtime.sendMessage({
      type: "start-ticking",
      payload: {
        time: isBreak
          ? countingTimeData.timeBreakTime
          : countingTimeData.timeFocus,
        isBreak: isBreak,
      },
    });
    setTicking(true);
  };
  const stopHandler = async () => {
    const data = await chrome.runtime.sendMessage({
      type: "press-halt-ticking",
      payload: null,
    });
    setTicking(false);
  };
  function timerNext() {
    setIsBreak((c) => !c);
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
      <div>
        <div>n of cycle: {countingTimeData.timeNOfCycles} left</div>
      </div>
      {isBreak ? (
        <div>
          running BREAK time: {second_to_minute(countingTimeData.timeBreakTime)}
          <CountdownCircleTimer
            isPlaying={false}
            duration={timeData.breakTime}
            colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={[
              timeData.breakTime,
              Math.floor(timeData.breakTime * 0.5),
              Math.floor(timeData.breakTime * 0.2),
              0,
            ]}
          >
            {({ remainingTime }) =>
              second_to_minute(countingTimeData.timeBreakTime)
            }
          </CountdownCircleTimer>
        </div>
      ) : (
        <div>
          running FOCUS time: {second_to_minute(countingTimeData.timeFocus)}
          <CountdownCircleTimer
            isPlaying={false}
            duration={timeData.focus}
            colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
            initialRemainingTime={countingTimeData.timeFocus}
            colorsTime={[
              timeData.focus,
              Math.floor(timeData.focus * 0.5),
              Math.floor(timeData.focus * 0.2),
              0,
            ]}
          >
            {({ remainingTime }) =>
              second_to_minute(countingTimeData.timeFocus)
            }
          </CountdownCircleTimer>
        </div>
      )}

      <div>
        <button onClick={startHandler} disabled={ticking}>
          {countingTimeData.timeFocus < timeData.focus ||
          countingTimeData.timeBreakTime < timeData.breakTime
            ? "continue"
            : "start"}
        </button>
        <button onClick={stopHandler} disabled={!ticking}>
          Stop
        </button>
        <button onClick={timerNext} disabled={ticking}>
          Next
        </button>
      </div>
      <br />
      <Button variant="outlined" onClick={stopSession}>
        Stop current session
      </Button>
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

  const startSession = () => {
    setCounting(true);
    const data = {
      timeNOfCycles: parseInt(timeData.nOfCycles),
      timeFocus: parseInt(timeData.focus),
      timeBreakTime: parseInt(timeData.breakTime),
    };
    setIsBreak(false);
    setCountingTimeData(data);
  };
  const stopSession = () => {
    setCounting(false);
    setTicking(false);
    chrome.storage.local.get("intervalID", function ({ intervalID }) {
      clearInterval(intervalID);
    });
    setCountingTimeData({
      timeNOfCycles: 0,
      timeBreakTime: 0,
      timeFocus: 0,
    });
  };

  return (
    <>
      {counting ? (
        <Stopwatch
          timeData={timeData}
          setTimeData={setTimeData}
          setTicking={setTicking}
          ticking={ticking}
          countingTimeData={countingTimeData}
          setCountingTimeData={setCountingTimeData}
          isBreak={isBreak}
          setCounting={setCounting}
          setIsBreak={setIsBreak}
        />
      ) : (
        <>
          {console.log("counting has not appear yet ")}
          <ConfigurationMode
            startSession={startSession}
            setTimeData={setTimeData}
            timeData={timeData}
          />
        </>
      )}
    </>
  );
}

function ConfigurationMode(props) {
  const { startSession, setTimeData, timeData } = props;

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
                  id="outlined-number-cyle"
                  label="Cycles"
                  type="number"
                  size="small"
                  value={timeData ? timeData.nOfCycles : 1}
                  onChange={(e) =>
                    setTimeData((c) => ({
                      ...c,
                      nOfCycles: parseInt(e.target.value),
                    }))
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
                  id="outlined-number-focus"
                  label="Focus"
                  type="number"
                  size="small"
                  value={timeData ? second_to_number_print(timeData.focus) : 0}
                  onChange={(e) =>
                    setTimeData((c) => ({
                      ...c,
                      focus: minute_to_number_print(e.target.value),
                    }))
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
                  id="outlined-number-break-time"
                  label="Break Time"
                  type="number"
                  size="small"
                  value={
                    timeData ? second_to_number_print(timeData.breakTime) : 0
                  }
                  onChange={(e) =>
                    setTimeData((c) => ({
                      ...c,
                      breakTime: minute_to_number_print(e.target.value),
                    }))
                  }
                  defaultValue={timeData ? timeData.breakTime : 0}
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

function second_to_minute(time) {
  const minute = Math.floor(time / 60);
  const second = time - minute * 60;
  const final_time =
    str_pad_left(minute, "0", 2) + ":" + str_pad_left(second, "0", 2);
  return final_time;
}

function minute_to_second(time) {
  const second = parseInt(time) * 60;
  const final_time = str_pad_left(second, "0", 2);
  return final_time;
}

function str_pad_left(string, pad, length) {
  return (new Array(length + 1).join(pad) + string).slice(-length);
}

function second_to_number_print(time) {
  const number = Math.floor(parseInt(time) / 60);
  return number;
}

function minute_to_number_print(time) {
  const number = parseInt(time) * 60;
  return number;
}
