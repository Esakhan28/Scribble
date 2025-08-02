import React, { useState } from "react";

import { DatePicker as ANTDDatePicker } from "antd";
import dayjs from "dayjs";
import { Info } from "neetoicons";
import { Typography, Modal, Button, Callout } from "neetoui";
import { useHistory } from "react-router-dom";

import { articlesApi } from "apis/admin";
import Tooltip from "components/Common/Tooltip";

const DatePicker = ({
  isEdit,
  formValues,
  selectedArticle,
  setShowDatePicker,
  showDatePicker,
}) => {
  const [dateAndTime, setDateAndTime] = useState(null);

  const history = useHistory();

  const handleChange = (_, dateAndTime) => {
    setDateAndTime(dateAndTime.concat(":00 +0530"));
  };

  const handleSubmit = async () => {
    try {
      setShowDatePicker(false);
      if (isEdit) {
        formValues.status === "Publish later"
          ? (formValues.scheduled_publish = dateAndTime)
          : (formValues.scheduled_unpublish = dateAndTime);
        formValues.status = selectedArticle.status;
        await articlesApi.update(selectedArticle.id, formValues);
      } else {
        formValues.status = "Draft";
        formValues.scheduled_publish = dateAndTime;
        await articlesApi.create(formValues);
      }
      history.push("/");
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <Modal
      closeButton={false}
      isOpen={showDatePicker}
      onClose={() => setShowDatePicker(false)}
    >
      <div className="w-full p-2">
        <Typography className="mb-2" style="h4">
          Date and time
        </Typography>
        <ANTDDatePicker
          showTime
          className="w-full"
          format="YYYY-MM-DD HH:mm"
          placeholder="Select date and time"
          disabledDate={currentDate =>
            currentDate && currentDate < dayjs().startOf("day")
          }
          onChange={handleChange}
        />
        {!isEdit && (
          <Callout className="my-2" icon={Info} style="info">
            After proceeding with this, the article will be created with status
            Draft.
          </Callout>
        )}
        {isEdit && (
          <Callout className="my-2" icon={Info} style="info">
            After proceeding with this, the article will be of status&nbsp;
            {selectedArticle.status}.
          </Callout>
        )}
        <div className="mt-2 flex space-x-2">
          <Tooltip
            content="Select date and time."
            disabled={!dateAndTime}
            followCursor="horizontal"
            position="bottom"
          >
            <Button
              disabled={!dateAndTime}
              label="Proceed"
              style="primary"
              onClick={handleSubmit}
            />
          </Tooltip>
          <Button
            label="Cancel"
            style="text"
            onClick={() => setShowDatePicker(false)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DatePicker;
