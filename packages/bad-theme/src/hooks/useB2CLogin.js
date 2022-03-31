import { useState, useEffect } from "react";

export const useB2CLogin = ({ state }) => {
  // await for window object to be available
  const [isWindow, setWindow] = useState(null);
  const [hash, setHash] = useState(null);

  // await to get window object & setWindow to true
  useEffect(() => {
    if (window) {
      console.log("🐞  B2C Login Hook. Have window object 🐞"); // debug
      setWindow(window);
    }
  }, []);

  // await to get hash from url
  useEffect(() => {
    if (isWindow) {
      const hash = isWindow.location.hash;
      setHash(hash);
    }
  }, [isWindow]);

  // --------------------------------------------------------------------------
  // This useEffect is triggered whenever the hash changes.  This happens when
  // B2C redirects after a successful signup or signon and even a forgotten
  // password flow.  We need to extract the id_token and then break out the
  // header (first part) and then the claims (second part)
  // --------------------------------------------------------------------------
  useEffect(() => {
    // Decode the token
    if (!hash) return;
    let items = hash.replace("#id_token=", "");
    items = items ? items.split(".") : null;
    if (!items) return;
    try {
      items[0] = JSON.parse(atob(items[0]));
      items[1] = JSON.parse(atob(items[1]));
      if (Array.isArray(items[1].emails)) {
        // setContactEmail(items[1].emails[0]);
        console.log("🐞 ", items[1].emails[0]);
      }
    } catch (error) {
      console.log(error);
    }
    console.log(items);
  }, [hash]);
};
