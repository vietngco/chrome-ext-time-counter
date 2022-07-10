import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import CyclesStepper from "./CyclesStepper";

export default function CountDownCircleTime(props) {
  const { timeData, countingTimeData, isBreak, ticking } = props;
  const duration = isBreak ? timeData.breakTime : timeData.focus;
  const runTime = isBreak
    ? countingTimeData.timeBreakTime
    : countingTimeData.timeFocus;

  console.log("isbreak", isBreak);
  console.log("duration", duration);
  console.log("runtime", runTime);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
      }}
    >
      <CyclesStepper />
      <br />
      <CountdownCircleTimer
        isPlaying={ticking}
        strokeWidth={20}
        trailStrokeWidth={20}
        initialRemainingTime={runTime}
        size={220}
        duration={duration}
        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
        colorsTime={[
          timeData.focus,
          Math.floor(duration * 0.6),
          Math.floor(duration * 0.2),
          0,
        ]}
        onComplete={() => {
          console.log("clock is done");
          return {
            newInitialRemainingTime: runTime,
            shouldRepeat: false,
          };
        }}
      >
        {({ remainingTime }) => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="text.secondary" align="center">
              {isBreak ? "BREAK" : "FOCUS"}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
              <Box
                sx={{
                  p: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5">{get_minute(runTime)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  mm
                </Typography>
              </Box>
              <Box sx={{ p: 1 }}>:</Box>
              <Box
                sx={{
                  p: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5">{get_second(runTime)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ss
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </CountdownCircleTimer>
    </Box>
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
