import React, { useState, useEffect } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";

const EUI = () => {
  const [showSearchBar, setShowSearchBar] = useState(false);

  const keysPressed = {};

  const showSearchOnButtonPressed = () => {
    window.addEventListener("keydown", event => {
      keysPressed[event.key] = true;
      if (
        (keysPressed["Meta"] || keysPressed["Control"]) &&
        event.key === "k"
      ) {
        setShowSearchBar(true);
      } else if (event.key === "Escape") {
        setShowSearchBar(false);
      }
    });
  };

  useEffect(() => {
    showSearchOnButtonPressed();
  }, []);

  return (
    <>
      <Header isEUI setShowSearchBar={setShowSearchBar} />
      <Sidebar
        setShowSearchBar={setShowSearchBar}
        showSearchBar={showSearchBar}
      />
    </>
  );
};

export default EUI;
