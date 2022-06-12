/*global chrome*/
import * as React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FocusTab from "./FocusTab";
import Blocksite from "./Blocksite";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function HomePage() {
  const [counting, setCounting] = React.useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [ticking, setTicking] = React.useState(false);
  const [isBreak, setIsBreak] = React.useState(false);
  const [timeData, setTimeData] = React.useState({
    nOfCycles: 0,
    focus: 0,
    breakTime: 0,
  });
  const [countingTimeData, setCountingTimeData] = React.useState({
    timeNOfCycles: 0,
    timeFocus: 0,
    timeBreakTime: 0,
  });

  React.useEffect(() => {
    async function getFromStorage() {
      const data = await chrome.storage.local.get([
        "counting",
        "ticking",
        "isBreak",
        "breakTime",
        "focus",
        "nOfCycles",
        "timeNOfCycles",
        "timeFocus",
        "timeBreakTime",
      ]);
      setCounting(data.counting);
      setTicking(data.ticking);
      setIsBreak(data.isBreak);
      setTimeData({
        nOfCycles: data.nOfCycles,
        focus: data.focus,
        breakTime: data.breakTime,
      });
      setCountingTimeData({
        timeNOfCycles: parseInt(data.timeNOfCycles),
        timeBreakTime: parseInt(data.timeBreakTime),
        timeFocus: parseInt(data.timeFocus),
      });
    }

    getFromStorage();
    const id = setInterval(() => {
      getFromStorage();
    }, 1000);
    return () => clearInterval(id);
  }, []);
  React.useEffect(() => {
    if (countingTimeData.nOfCycles <= 0) {
      // end of session
      chrome.notifications.create("end the session", {
        type: "basic",
        iconUrl: "./logo512.png",
        title: "Congras! The current session ends!",
        message: "You work awesomely!",
        priority: 1,
        silent: false,
      });
      setCounting(false);
    }
  }, [countingTimeData]);
  React.useEffect(() => {
    chrome.storage.local.set({
      timeNOfCycles: countingTimeData.timeNOfCycles,
      timeBreakTime: countingTimeData.timeBreakTime,
      timeFocus: countingTimeData.timeFocus,
    });
  }, [countingTimeData]);

  React.useEffect(() => {
    chrome.storage.local.set({
      counting: counting,
    });
  }, [counting]);
  React.useEffect(() => {
    chrome.storage.local.set({
      ticking: ticking,
    });
  }, [ticking]);
  React.useEffect(() => {
    chrome.storage.local.set({
      isBreak: isBreak,
    });
  }, [isBreak]);
  React.useEffect(() => {
    chrome.storage.local.set({
      nOfCycles: timeData.nOfCycles,
      focus: timeData.focus,
      breakTime: timeData.breakTime,
    });
  }, [timeData]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Box sx={{ bgcolor: "background.paper", width: 450 }}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Focus Mode" {...a11yProps(0)} />
          <Tab label="Block Sites" {...a11yProps(1)} />
          <Tab label="Insights" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <FocusTab
            counting={counting}
            setCounting={setCounting}
            setTicking={setTicking}
            ticking={ticking}
            isBreak={isBreak}
            setIsBreak={setIsBreak}
            timeData={timeData}
            setTimeData={setTimeData}
            countingTimeData={countingTimeData}
            setCountingTimeData={setCountingTimeData}
          />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Blocksite />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          Item Three
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
