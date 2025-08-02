import React, { useState, useEffect } from "react";

import { Formik, Form as FormikForm } from "formik";
import { Typography, Button, PageLoader } from "neetoui";
import { Input } from "neetoui/formik";
import { useHistory } from "react-router-dom";

import { organizationsApi } from "apis/admin";
import { setAuthHeaders } from "apis/axios";
import EUILoginImg from "images/EUILoginImg";

import { LOGIN_FORM_VALIDATION_SCHEMA } from "./constants";
import Header from "./Header";

const Login = ({ setIsAuthorized }) => {
  const [organizationData, setOrganizationData] = useState({});
  const [loading, setLoading] = useState({});

  const history = useHistory();

  useEffect(() => {
    fetchOrganizationDetails();
  }, []);

  const fetchOrganizationDetails = async () => {
    try {
      setLoading(true);
      const { data } = await organizationsApi.fetch();
      setOrganizationData(data);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async values => {
    try {
      const { data } = await organizationsApi.login({
        password: values.password,
      });
      localStorage.setItem(
        "authToken",
        JSON.stringify(data.authentication_token)
      );
      setIsAuthorized(true);
      setAuthHeaders();
      history.push("/public");
    } catch (error) {
      logger.error(error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <>
      <Header isEUI={false} />
      <div className="mt-16 grid justify-center p-8">
        <img className="mx-auto justify-center" src={EUILoginImg} />
        <Typography className="mt-6" style="h2">
          {organizationData.name} is password protected!
        </Typography>
        <Typography className="text-gray-600" style="body1">
          Enter the password to gain access to {organizationData.name}.
        </Typography>
        <Formik
          initialValues={{ password: "" }}
          validationSchema={LOGIN_FORM_VALIDATION_SCHEMA}
          onSubmit={handleSubmit}
        >
          <FormikForm className="mt-8">
            <Input required label="Password" name="password" type="password" />
            <Button className="mt-6" label="Continue" type="submit" />
          </FormikForm>
        </Formik>
      </div>
    </>
  );
};
export default Login;
