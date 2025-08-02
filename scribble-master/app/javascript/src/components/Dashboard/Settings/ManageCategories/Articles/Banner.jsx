import React from "react";

import { Typography } from "neetoui";

const Banner = ({ setShowBanner }) => {
  const handleDisplay = () => {
    setShowBanner(false);
    localStorage.setItem("isShowBanner", JSON.stringify(false));
  };

  return (
    <Typography className="mt-4 rounded-sm bg-indigo-100 p-2" style="body3">
      You can reorder categories or articles by drag and drop here. You can also
      multiselect articles and move them together to any category you have
      created.&nbsp;
      <span className="cursor-pointer underline" onClick={handleDisplay}>
        Don't show this info again.
      </span>
    </Typography>
  );
};

export default Banner;
