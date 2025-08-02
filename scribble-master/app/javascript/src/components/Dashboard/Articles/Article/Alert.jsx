import React from "react";

import { Alert as NeetoUIAlert } from "neetoui";
import { useHistory } from "react-router-dom";

import { articlesApi } from "apis/admin";
import { formatTimeStampToTimeAndDate } from "components/utils";

const Alert = ({ article, formValues, onClose }) => {
  const history = useHistory();

  const scheduledStatus =
    formValues.status === "Published" && article.scheduledPublish !== null
      ? "Publish"
      : "Unpublish";
  const scheduledTime =
    scheduledStatus === "Publish"
      ? formatTimeStampToTimeAndDate(article.scheduledPublish)
      : formatTimeStampToTimeAndDate(article.scheduledUnpublish);

  const handleSubmit = async () => {
    try {
      if (
        formValues.status === "Draft" &&
        article.scheduledUnpublish !== null
      ) {
        formValues.scheduled_unpublish = null;
      } else if (
        formValues.status === "Published" &&
        article.scheduledPublish !== null
      ) {
        formValues.scheduled_publish = null;
      }
      await articlesApi.update(article.id, formValues);
      history.push("/");
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <NeetoUIAlert
      isOpen
      title="Confirm removal of article scheduled status"
      message={`This article is scheduled to be ${scheduledStatus} at "${scheduledTime}".
      Are you sure you want to continue? This will remove the scheduled ${scheduledStatus}.`}
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  );
};

export default Alert;
