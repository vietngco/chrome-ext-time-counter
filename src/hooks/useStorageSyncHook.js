/*global chrome*/
import { useEffect, useState } from "react";

// NOTE: value, initvalue must be json object
export default function useStoragelocalHook(key, initValue) {
  // key: string, initValue: any
  const [value, setValue] = useState();

  // useEffect(() => {
  //   chrome.storage.local.set(value);
  // }, [value]); // if the value or new key changed =>>> create/update data in chrome local storage
  return [value, setValue];
}
