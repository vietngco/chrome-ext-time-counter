/* global chrome*/
import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function Blocksite() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [block_domains, setBlock_domains] = useState([]);
  console.log("rerednered blocksite");
  function get_link_file() {
    const link = chrome.runtime.getURL("block.html");
    window.location.href(link);
  }
  async function get_domain() {
    const tabs = await chrome.tabs.query({ currentWindow: true, active: true });
    console.log(tabs);
    let domain = domain_from_url(tabs[0].url);
    return domain;
  }
  async function add_domain_to_block() {
    const domain = await get_domain();
    if (!block_domains.includes(domain)) {
      setBlock_domains([...block_domains, domain]);
    }
  }
  function remove_domain_from_block(domain) {
    const filtered_domains = block_domains.filter((site) => site !== domain);
    setBlock_domains(filtered_domains);
  }
  useEffect(() => {
    async function get_all_block_domains() {
      const data = await chrome.storage.local.get("block_domains");
      setBlock_domains(data.block_domains);
      let domain = await get_domain();
      setCurrentUrl(domain);
    }
    get_all_block_domains();
  }, []);
  useEffect(() => {
    chrome.storage.local.set({
      block_domains: block_domains,
    });
  }, [block_domains]);
  return (
    <>
      <div>Blocksite</div>
      <button onClick={add_domain_to_block}>block this domain</button>
      <div>URL: {currentUrl}</div>
      <Divider />
      <div>list of block domains</div>
      <button onClick={get_link_file}>get link file</button>
      {block_domains.map((domain) => {
        return (
          <>
            <div>{domain}</div>
            <button onClick={() => remove_domain_from_block(domain)}>
              remove
            </button>
          </>
        );
      })}
    </>
  );
}

function domain_from_url(url) {
  var result;
  var match;
  if (
    (match = url.match(
      /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/
    ))
  ) {
    result = match[1];
  }
  return result;
}
