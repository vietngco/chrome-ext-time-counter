/*global chrome*/
import { useEffect, useState } from "react";

export default function useStoragelocalHook(key, initValue) {
  const [value, setValue] = useState(() => {
    if (typeof initValue === "function") {
      return initValue();
    }
    return initValue;
  });

  useEffect(() => {
    async function getValue() {
      const stored_value = await chrome.storage.local.get(key);
      console.log("THIS IS LOL:", stored_value, stored_value[key]);
      if (stored_value[key] !== undefined) {
        setValue(stored_value[key]);
      }
    }
    getValue();
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ [key]: value });
  }, [value, key]);

  return [value, setValue];
}
