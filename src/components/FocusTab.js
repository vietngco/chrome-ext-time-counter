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
import {
  Divider,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import TimerLinearProgress from "./timer/TimerLinearProgress";
import CountDownCircleTime from "./timer/CountDownCircleTime";
import CyclesStepper from "./timer/CyclesStepper";
import { Box } from "@mui/material";
import useStoragelocalHook from "../hooks/useStorageSyncHook";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
function Stopwatch(props) {
  const {
    setTicking,
    ticking,
    countingTimeData,
    isBreak,
    setIsBreak,
    setCounting,
    setCountingTimeData,
    nOfCycles,
    focus,
    breakTime,
  } = props;
  const timeData = { nOfCycles, breakTime, focus };
  const [block_domains, setBlock_domains] = useStoragelocalHook(
    "block_domains",
    []
  );
  function stopSession() {
    setTicking(false);
    setCountingTimeData({
      timeNOfCycles: 0,
      timeBreakTime: 0,
      timeFocus: 0,
    });
    setCounting(false);
    chrome.runtime.sendMessage({
      type: "press-halt-ticking",
      payload: null,
    });
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
    setTicking(false);
  }
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CountDownCircleTime
        timeData={timeData}
        countingTimeData={countingTimeData}
        isBreak={isBreak}
        ticking={ticking}
      />
      <br />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant align="center">
          There are {block_domains.length} sites blocked!
        </Typography>
        <br />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <IconButton onClick={ticking ? stopHandler : startHandler}>
            {ticking ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton onClick={timerNext} disabled={ticking}>
            <KeyboardTabIcon />
          </IconButton>
        </Box>
      </Box>
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

    nOfCycles,
    focus,
    breakTime,
    timeNOfCycles,
    timeFocus,
    timeBreakTime,
    setNOfCycles,
    setFocus,
    setBreakTime,
    //
    setTimeNOfCycles,
    setTimeFocus,
    setTimeBreakTime,

    //
  } = props;

  const startSession = () => {
    setCounting(true);
    setIsBreak(false);
    setTimeNOfCycles(parseInt(timeData.nOfCycles));
    setTimeFocus(parseInt(timeData.focus));
    setTimeBreakTime(parseInt(timeData.breakTime));
  };

  const countingTimeData = {
    timeNOfCycles,
    timeFocus,
    timeBreakTime,
  };
  function setCountingTimeData({ timeNOfCycles, timeFocus, timeBreakTime }) {
    setTimeNOfCycles(timeNOfCycles);
    setTimeFocus(timeFocus);
    setTimeBreakTime(timeBreakTime);
  }
  const timeData = { nOfCycles, focus, breakTime };

  return (
    <>
      {counting ? (
        <Stopwatch
          // timeData={timeData}
          setTicking={setTicking}
          ticking={ticking}
          countingTimeData={countingTimeData}
          setCountingTimeData={setCountingTimeData}
          isBreak={isBreak}
          setCounting={setCounting}
          setIsBreak={setIsBreak}
          nOfCycles={nOfCycles}
          breakTime={breakTime}
          focus={focus}
        />
      ) : (
        <ConfigurationMode
          startSession={startSession}
          setNOfCycles={setNOfCycles}
          setFocus={setFocus}
          setBreakTime={setBreakTime}
          // timeData={timeData}
          nOfCycles={nOfCycles}
          breakTime={breakTime}
          focus={focus}
        />
      )}
    </>
  );
}

function ConfigurationMode(props) {
  const {
    startSession,
    setNOfCycles,
    setBreakTime,
    setFocus,
    nOfCycles,
    breakTime,
    focus,
  } = props;
  const timeData = { nOfCycles, breakTime, focus };
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
                  onChange={(e) => setNOfCycles(parseInt(e.target.value))}
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
                    setFocus(minute_to_number_print(e.target.value))
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
                  onChange={(e) => {
                    setBreakTime(minute_to_number_print(e.target.value));
                  }}
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

function get_minute(time) {
  const minute = Math.floor(time / 60);

  return str_pad_left(minute, "0", 2);
}
function get_second(time) {
  const minute = Math.floor(time / 60);
  const second = time - minute * 60;
  return str_pad_left(second, "0", 2);
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
