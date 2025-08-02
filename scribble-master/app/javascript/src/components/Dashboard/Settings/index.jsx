import React from "react";

import { useLocation } from "react-router-dom";

import NotFound from "components/Common/NotFound";

import General from "./General";
import ManageCategories from "./ManageCategories";
import Redirection from "./Redirections";
import Sidebar from "./Sidebar";

const Settings = () => {
  const { search } = useLocation();
  const currentTab = new URLSearchParams(search).get("tab");

  const renderCurrentTab = () => {
    if (currentTab === "general") return <General />;
    else if (currentTab === "redirections") return <Redirection />;
    else if (currentTab === "managecategories") return <ManageCategories />;

    return <NotFound message="Tab not found" />;
  };

  return (
    <div className="flex">
      <Sidebar currentActiveTab={currentTab} />
      <div className="w-1/4" />
      {renderCurrentTab()}
    </div>
  );
};

export default Settings;
