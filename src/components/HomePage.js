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
import useStoragelocalHook from "../hooks/useStorageSyncHook";

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
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const [counting, setCounting] = useStoragelocalHook("counting", false);
  const [ticking, setTicking] = useStoragelocalHook("ticking", false);
  const [isBreak, setIsBreak] = useStoragelocalHook("isBreak", false);
  const [nOfCycles, setNOfCycles] = useStoragelocalHook("nOfCycles", 0);
  const [focus, setFocus] = useStoragelocalHook("focus", 0);
  const [breakTime, setBreakTime] = useStoragelocalHook("breakTime", 0);
  const [timeNOfCycles, setTimeNOfCycles] = useStoragelocalHook(
    "timeNOfCycles",
    0
  );
  const [timeFocus, setTimeFocus] = useStoragelocalHook("timeFocus", 0);
  const [timeBreakTime, setTimeBreakTime] = useStoragelocalHook(
    "timeBreakTime",
    0
  );

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
      // console.log("GETTING FROM THE storage in the home page");

      // console.log(data);
      setCounting(data.counting);
      setTicking(data.ticking);
      setIsBreak(data.isBreak);
      setNOfCycles(data.nOfCycles);
      setBreakTime(data.breakTime);
      setFocus(data.focus);
      setTimeNOfCycles(data.timeNOfCycles);
      setTimeBreakTime(data.timeBreakTime);
      setTimeFocus(data.timeFocus);
    }

    getFromStorage();
    const id = setInterval(() => {
      // this is run after 1 second
      getFromStorage();
    }, 1000);
    return () => clearInterval(id);
  }, []);

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
            //
            nOfCycles={nOfCycles}
            breakTime={breakTime}
            focus={focus}
            //
            timeNOfCycles={timeNOfCycles}
            timeBreakTime={timeBreakTime}
            timeFocus={timeFocus}
            //
            setNOfCycles={setNOfCycles}
            setFocus={setFocus}
            setBreakTime={setBreakTime}
            //
            setTimeNOfCycles={setTimeNOfCycles}
            setTimeFocus={setTimeFocus}
            setTimeBreakTime={setTimeBreakTime}
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
