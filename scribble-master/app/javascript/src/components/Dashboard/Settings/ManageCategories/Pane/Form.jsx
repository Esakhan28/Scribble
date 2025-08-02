import React from "react";

import { Formik, Form as FormikForm } from "formik";
import { Pane, Button } from "neetoui";
import { Input } from "neetoui/formik";

import { categoriesApi } from "apis/admin";
import Tooltip from "components/Common/Tooltip";

import { CATEGORY_FORM_VALIDATION_SCHEMA } from "../constants";
import { convertCategoryToFormFormat } from "../utils";

const Form = ({ isEdit, refetch, category, setShowPane }) => {
  const handleSubmit = async values => {
    try {
      const { name } = values;
      if (isEdit) {
        await categoriesApi.update(category.id, { name });
      } else {
        await categoriesApi.create({ name });
      }
      setShowPane(prevState => !prevState);
      refetch();
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <Formik
      initialValues={convertCategoryToFormFormat(category)}
      validationSchema={CATEGORY_FORM_VALIDATION_SCHEMA}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, dirty }) => (
        <FormikForm>
          <Pane.Body>
            <Input className="mb-2 w-full" name="name" />
          </Pane.Body>
          <Pane.Footer className="flex items-center space-x-2">
            <Tooltip
              disabled={isSubmitting || !dirty}
              followCursor="horizontal"
              position="bottom"
              content={
                isEdit ? "Make changes to update name." : "Enter name to add."
              }
            >
              <Button
                disabled={isSubmitting || !dirty}
                label="Save changes"
                size={13}
                style="primary"
                type="submit"
              />
            </Tooltip>
            <Button
              label="Cancel"
              style="text"
              type="reset"
              onClick={() => setShowPane(false)}
            />
          </Pane.Footer>
        </FormikForm>
      )}
    </Formik>
  );
};

export default Form;
