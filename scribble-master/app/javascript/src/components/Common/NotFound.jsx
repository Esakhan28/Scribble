import React from "react";

import { Typography } from "neetoui";

const NotFound = ({ message }) => (
  <div className="container mx-auto my-8 flex w-3/4 flex-col items-center">
    <div className="max-w-md text-center">
      <Typography className="text-xl text-gray-700" style="h2">
        {message}
      </Typography>
    </div>
  </div>
);

export default NotFound;
