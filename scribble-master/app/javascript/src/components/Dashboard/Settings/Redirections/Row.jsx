import React, { useState } from "react";

import { Delete, Edit } from "neetoicons";
import { Typography, Button } from "neetoui";

import DeleteAlert from "./DeleteAlert";

const Row = ({
  redirection,
  setSelectedRedirectionId,
  refetch,
  setShowAdd,
}) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  return (
    <>
      <Typography className="w-2/5 overflow-x-auto text-gray-500" style="h5">
        {window.location.origin}
        {redirection.from}
      </Typography>
      <Typography className="w-2/5 overflow-x-auto text-gray-700" style="h5">
        {window.location.origin}
        {redirection.to}
      </Typography>
      <div className="flex items-end">
        <Button
          icon={Delete}
          size={13}
          style="text"
          onClick={() => setShowDeleteAlert(prevState => !prevState)}
        />
        <Button
          icon={Edit}
          size={13}
          style="text"
          onClick={() => {
            setSelectedRedirectionId(redirection.id);
            setShowAdd(false);
          }}
        />
      </div>
      {showDeleteAlert && (
        <DeleteAlert
          refetch={refetch}
          selectedDeleteRedirection={redirection}
          onClose={() => {
            setShowDeleteAlert(false);
            setShowAdd(false);
          }}
        />
      )}
    </>
  );
};

export default Row;
