import React, { useState } from "react";

import { Typography } from "neetoui";

import { formatTimeStampToTimeAndDate } from "components/utils";

import Modal from "./Modal";
import Versions from "./Versions";

const VersionHistory = ({ article, articleVersions, refetch }) => {
  const [showModal, setShowModal] = useState(false);
  const [version, setVersion] = useState({});

  return (
    <div className="border-l h-screen w-1/4 overflow-y-auto">
      <div className="sticky top-0 z-40 ml-4 mt-8 bg-white">
        <Typography style="h3">Version History</Typography>
        <Typography className="mt-1 mb-4 text-gray-600" style="body1">
          Version history of {article.title} in Scribble.
        </Typography>
        <div className="border mr-4 mb-2 flex justify-between rounded-md bg-indigo-100 p-4">
          <div className="mr-4">
            <Typography className="text-gray-500" style="body2">
              {formatTimeStampToTimeAndDate(article.updatedAt)}
            </Typography>
            <Typography className="text-gray-500" style="body2">
              Current Version <br />
              {article.versionStatus &&
                `Restored from (${formatTimeStampToTimeAndDate(
                  article.restoredAt
                )})`}
            </Typography>
          </div>
          <Typography className="my-auto" style="h4">
            Article {article.status}
          </Typography>
        </div>
      </div>
      <Versions
        articleVersions={articleVersions}
        setShowModal={setShowModal}
        setVersion={setVersion}
      />
      {showModal && (
        <Modal
          article={article}
          refetch={refetch}
          setShowModal={setShowModal}
          showModal={showModal}
          version={version}
        />
      )}
    </div>
  );
};

export default VersionHistory;
