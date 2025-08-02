import React, { useState } from "react";

import { Formik, Form as FormikForm } from "formik";
import { Typography, Button, Alert } from "neetoui";
import { Input, Checkbox } from "neetoui/formik";

import { organizationsApi } from "apis/admin";
import Tooltip from "components/Common/Tooltip";

import { GENERAL_SETTINGS_FORM_VALIDATION_SCHEMA } from "../constants";

const Form = ({ organizationData, refetch }) => {
  const [showPassword, setShowPassword] = useState(
    organizationData.isPasswordProtected
  );
  const [changePassword, setChangePassword] = useState(
    !organizationData.isPasswordProtected
  );
  const [showAlert, setShowAlert] = useState(false);
  const [organizationFormValues, setOrganizationFormValues] = useState({});

  const updateOrganizationDetails = async values => {
    try {
      const isPasswordNotChanged = values.isChecked && !changePassword;
      let payload = {
        name: values.name,
        password: values.isChecked ? values.password : null,
        is_password_protected: values.isChecked,
      };
      if (isPasswordNotChanged) {
        payload = { name: values.name };
      }
      await organizationsApi.update(payload);
      localStorage.setItem("authToken", null);
      refetch();
    } catch (error) {
      logger.error(error);
    }
  };

  const handleSubmit = values => {
    if (organizationData.isPasswordProtected && !values.isChecked) {
      setOrganizationFormValues(values);
      setShowAlert(true);
    } else {
      updateOrganizationDetails(values);
    }
  };

  const handleAlert = () => {
    setShowAlert(false);
    updateOrganizationDetails(organizationFormValues);
  };

  return (
    <>
      <Formik
        initialValues={{
          name: organizationData.name,
          isChecked: organizationData.isPasswordProtected,
        }}
        validationSchema={GENERAL_SETTINGS_FORM_VALIDATION_SCHEMA(
          showPassword,
          changePassword
        )}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, dirty }) => (
          <FormikForm className="space-y-2">
            <div className="border-b-2 pb-4">
              <Input
                required
                className="mt-6 mb-px"
                id="name"
                label="Site Name"
                name="name"
                type="text"
              />
              <Typography className="neeto-ui-text-gray-500" style="body3">
                Customize the site name which is used to show the site name in
              </Typography>
              <Typography className="neeto-ui-text-gray-500" style="h6">
                Open Graph Tags.
              </Typography>
            </div>
            <Checkbox
              checked={showPassword}
              className="mt-3"
              id="isChecked"
              name="isChecked"
              label={
                <Typography className="neeto-ui-text-black ml-2" style="h4">
                  Password Protect Knowledge Base
                </Typography>
              }
              onChange={() => {
                setFieldValue("isChecked", !showPassword);
                setShowPassword(prevState => !prevState);
              }}
            />
            {showPassword && (
              <div className="flex gap-x-2">
                <Input
                  required
                  className="mt-4 mb-px"
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  disabled={
                    !changePassword && organizationData.isPasswordProtected
                  }
                  placeholder={`${
                    changePassword ? "Enter new password." : "******"
                  }`}
                />
                {organizationData.isPasswordProtected && (
                  <Button
                    className="h-7 mt-10 mb-2"
                    disabled={changePassword}
                    label="Change password"
                    size="small"
                    onClick={() => setChangePassword(true)}
                  />
                )}
              </div>
            )}
            <div className="flex gap-x-1 pt-2">
              <Tooltip
                content="Please make any change to save."
                disabled={isSubmitting || !dirty}
                followCursor="horizontal"
                position="bottom"
              >
                <Button
                  disabled={isSubmitting || !dirty}
                  label="Save changes"
                  type="submit"
                />
              </Tooltip>
              <Button
                label="Cancel"
                style="text"
                type="reset"
                onClick={() => {
                  setShowPassword(organizationData.isPasswordProtected);
                  setChangePassword(!organizationData.isPasswordProtected);
                }}
              />
            </div>
          </FormikForm>
        )}
      </Formik>
      {showAlert && (
        <Alert
          isOpen
          message="Are you sure you want to continue?"
          title="This will disable password protection in Organization."
          onClose={() => refetch()}
          onSubmit={handleAlert}
        />
      )}
    </>
  );
};

export default Form;
