import React from "react";

import { Typography } from "neetoui";
import { useRouteMatch, NavLink } from "react-router-dom";

import { SETTINGS_OPTIONS } from "./constants";

const Sidebar = ({ currentActiveTab }) => {
  const { url } = useRouteMatch();

  return (
    <div className="border-r fixed flex h-screen w-1/4 flex-col bg-white p-5">
      {SETTINGS_OPTIONS.map((SettingsOption, idx) => (
        <NavLink
          key={idx}
          to={`${url}?tab=${SettingsOption.tab}`}
          className={`h-18 mx-2 my-2 px-2 py-3 ${
            currentActiveTab === SettingsOption.tab && "rounded-lg bg-gray-200"
          }`}
        >
          <div className="w-96 flex" key={idx}>
            <SettingsOption.icon className="my-auto mx-2" />
            <div>
              <Typography style="h4">{SettingsOption.label}</Typography>
              <Typography style="body3">
                {SettingsOption.description}
              </Typography>
            </div>
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
