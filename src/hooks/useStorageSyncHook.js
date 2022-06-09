/*global chrome*/
import { useEffect, useState } from "react";

// NOTE: value, initvalue must be json object
export default function useStorageSyncHook(initValue) {
  // key: string, initValue: any
  const [value, setValue] = useState(initValue);

  // useEffect(() => {
  //   chrome.storage.sync.set(value);
  // }, [value]); // if the value or new key changed =>>> create/update data in chrome sync storage
  return [value, setValue];
}
