/*global chrome*/
import { ChromeReaderMode } from "@mui/icons-material";
import { useEffect, useState } from "react";

// NOTE: value, initvalue must be json object
export default function useStorageSyncHook(initValue) {
  // key: string, initValue: any
  const [value, setValue] = useState(() => {
    if (typeof initValue === "function") {
      return initValue();
    }
    return initValue;
  });

  useEffect(() => {
    chrome.storage.sync.set(value);
  }, value); // if the value or new key changed =>>> create/update data in chrome sync storage
  return [value, setValue];
}
