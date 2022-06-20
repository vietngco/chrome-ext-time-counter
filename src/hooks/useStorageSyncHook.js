/*global chrome*/
import { useEffect, useRef, useState } from "react";

export default function useStoragelocalHook(key, initValue) {
  const didMount = useRef(false);
  const [value, setValue] = useState(() => {
    if (typeof initValue === "function") {
      return initValue();
    }
    return initValue;
  });

  useEffect(() => {
    async function getValue() {
      const stored_value = await chrome.storage.local.get(key);
      if (stored_value[key] !== undefined) {
        // console.log("THIS IS LOL:", key, ":", stored_value[key]);
        setValue(stored_value[key]);
      }
    }
    getValue();
  }, []);

  useEffect(() => {
    // console.log("value of useref is:", didMount.current);
    if (didMount.current === false) {
      didMount.current = true;
      return;
    }
    // console.log("react is setting vlaue for ", key, ":", value);
    chrome.storage.local.set({ [key]: value });
  }, [value]);
  return [value, setValue];
}
