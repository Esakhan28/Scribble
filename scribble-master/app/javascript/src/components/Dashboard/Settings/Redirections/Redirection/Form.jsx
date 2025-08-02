import React, { useEffect } from "react";

import { Formik, Form as FormikForm } from "formik";
import { Check, Close } from "neetoicons";
import { Button } from "neetoui";
import { Input } from "neetoui/formik";

import { redirectionsApi } from "apis/admin";
import Tooltip from "components/Common/Tooltip";

import { REDIRECTION_FORM_VALIDATION_SCHEMA } from "./constants";

const Form = ({ setShowRedirection, initialValues, isEdit, refetch }) => {
  const closeOnEscape = () => {
    window.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        if (isEdit) {
          setShowRedirection(null);
        } else {
          setShowRedirection(false);
        }
      }
    });
  };

  useEffect(() => {
    closeOnEscape();
  }, []);

  const handleSubmit = async values => {
    try {
      if (isEdit) {
        await redirectionsApi.update(initialValues.id, {
          from: values.from,
          to: values.to,
        });
        setShowRedirection(null);
      } else {
        setShowRedirection(false);
        await redirectionsApi.create(values);
      }
      refetch();
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <Formik
      validateOnChange
      initialValues={initialValues}
      validationSchema={REDIRECTION_FORM_VALIDATION_SCHEMA}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, dirty }) => (
        <FormikForm className="my-2 flex w-full">
          <Input
            required
            className="mx-2 w-2/5"
            name="from"
            placeholder="Should start with /"
            type="text"
          />
          <Input
            required
            className="w-2/5"
            name="to"
            placeholder="Should start with /"
            type="text"
          />
          <Button
            icon={Close}
            size={13}
            style="text"
            onClick={() => {
              isEdit ? setShowRedirection(null) : setShowRedirection(false);
            }}
          />
          <Tooltip
            content="Please make any change to save."
            disabled={isSubmitting || (isEdit && !dirty)}
            followCursor="horizontal"
            position="bottom"
          >
            <Button
              disabled={isSubmitting || (isEdit && !dirty)}
              icon={Check}
              size={13}
              style="text"
              type="submit"
            />
          </Tooltip>
        </FormikForm>
      )}
    </Formik>
  );
};

export default Form;
