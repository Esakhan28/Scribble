import React from "react";

import { Switch, Route } from "react-router-dom";

import { DASHBOARD_ROUTES } from "components/routeConstants";

import Settings from "./Settings";

import NavBar from "../Common/NavBar";

export const Dashboard = () => (
  <>
    <NavBar />
    <Switch>
      {DASHBOARD_ROUTES.map(({ path, component }) => (
        <Route exact component={component} key={path} path={path} />
      ))}
      <Route component={Settings} path="/settings" />
    </Switch>
  </>
);

export default Dashboard;
