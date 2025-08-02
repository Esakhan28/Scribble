import React, { useEffect, useState } from "react";

import "lib/dayjs"; // eslint-disable-line
import { PageLoader } from "neetoui";
import { either, isEmpty, isNil } from "ramda";
import { QueryClient, QueryClientProvider } from "react-query";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { organizationsApi, usersApi } from "apis/admin";
import { setAuthHeaders, registerIntercepts } from "apis/axios";
import { initializeLogger } from "common/logger";
import { PrivateRoute, Dashboard, Eui, SiteLogin } from "components/index";
import { convertSnakeCaseKeysToCamelCase } from "components/utils";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);

  const authToken = JSON.parse(localStorage.getItem("authToken"));
  const isLoggedIn = !either(isNil, isEmpty)(authToken);

  useEffect(() => {
    initializeLogger();
    registerIntercepts();
    setAuthHeaders(setLoading);
    fetchOrganizationAndUserDetails();
  }, []);

  const fetchOrganizationAndUserDetails = async () => {
    await Promise.all([fetchOrganizationDetails(), fetchUserDetails()]);
    setLoading(false);
  };

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const {
        data: { id },
      } = await usersApi.login();
      localStorage.setItem("authUserId", id);
    } catch (error) {
      logger.error(error);
    }
  };

  const fetchOrganizationDetails = async () => {
    try {
      setLoading(true);
      const { data } = await organizationsApi.fetch();
      const organization = convertSnakeCaseKeysToCamelCase(data);
      setIsAuthorized(!organization.isPasswordProtected || isLoggedIn);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
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
    <QueryClientProvider client={queryClient}>
      <Router>
        <ToastContainer />
        <Switch>
          <PrivateRoute
            component={() => <SiteLogin setIsAuthorized={setIsAuthorized} />}
            condition={!isAuthorized}
            path="/public/login"
            redirectRoute="/public"
          />
          <PrivateRoute
            component={() => <Eui />}
            condition={isAuthorized}
            path="/public"
            redirectRoute="/public/login"
          />
          <Route component={Dashboard} path="/" />
        </Switch>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
