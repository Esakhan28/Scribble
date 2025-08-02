import React from "react";

import { Typography } from "neetoui";

import { formatTimeStampToTimeAndDate } from "components/utils";

const Versions = ({ articleVersions, setVersion, setShowModal }) =>
  articleVersions.map(version => (
    <div className="border mx-4 mb-2 rounded-md p-4" key={version.id}>
      <div className="flex justify-between">
        <div>
          <Typography className="mr-4 text-gray-500" style="body2">
            {formatTimeStampToTimeAndDate(version.article.updatedAt)}
          </Typography>
          {version.article.versionStatus && (
            <Typography className="mr-4 text-gray-500" style="body2">
              Restored from (
              {formatTimeStampToTimeAndDate(version.article.restoredAt)})
            </Typography>
          )}
        </div>
        <Typography
          className="my-auto cursor-pointer text-indigo-500"
          style="h4"
          onClick={() => {
            setVersion(version);
            setShowModal(true);
          }}
        >
          Article&nbsp;
          {version.article.status}
        </Typography>
      </div>
    </div>
  ));

export default Versions;
