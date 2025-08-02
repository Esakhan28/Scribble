import React, { useEffect, useState } from "react";

import { ExternalLink } from "neetoicons";
import { Button, Typography, PageLoader } from "neetoui";
import { NavLink, useLocation } from "react-router-dom";

import { articlesApi } from "apis/admin";

const NavBar = () => {
  const [loading, setLoading] = useState(false);
  const [articleStatus, setArticleStatus] = useState("");

  const { pathname } = useLocation();
  const isEditArticlePath = pathname.includes("edit");

  useEffect(() => {
    fetchArticle();
  }, [isEditArticlePath]);

  const fetchArticle = async () => {
    if (isEditArticlePath) {
      try {
        setLoading(true);
        const id = pathname.split("/")[2];
        const { data: article } = await articlesApi.show(id);
        setArticleStatus(article.status);
      } catch (error) {
        logger.error(error);
      } finally {
        setLoading(false);
      }
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
    <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b-2 bg-white px-6">
      <div className="flex">
        <Typography style="h4">Scribble</Typography>
        <NavLink
          exact
          activeClassName="neeto-ui-text-primary-500 mx-6"
          className="neeto-ui-text-gray-500 mx-6"
          to="/"
        >
          <Typography style="h4">Articles</Typography>
        </NavLink>
        <NavLink
          exact
          activeClassName="neeto-ui-text-primary-500"
          className="neeto-ui-text-gray-500"
          to="/settings?tab=general"
        >
          <Typography style="h4">Settings</Typography>
        </NavLink>
        <NavLink
          exact
          activeClassName="neeto-ui-text-primary-500"
          className="neeto-ui-text-gray-500 ml-6"
          to="/analytics"
        >
          <Typography style="h4">Analytics</Typography>
        </NavLink>
        <NavLink
          exact
          activeClassName="neeto-ui-text-primary-500"
          className="neeto-ui-text-gray-500 ml-6"
          to="/analytics/report"
        >
          <Typography style="h4">Download Report</Typography>
        </NavLink>
      </div>
      <div className="flex">
        {isEditArticlePath && (
          <Typography
            style="h5"
            className={`${
              articleStatus === "Draft"
                ? "neeto-ui-bg-warning-100 neeto-ui-text-warning-500"
                : " neeto-ui-bg-success-500 neeto-ui-text-white"
            } neeto-ui-rounded m-1 mr-4 py-1 px-3`}
          >
            {articleStatus}
          </Typography>
        )}
        <Button
          icon={ExternalLink}
          label="Preview"
          style="secondary"
          target="_blank"
          to="/public"
        />
      </div>
    </nav>
  );
};

export default NavBar;
