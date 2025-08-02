import Analytics from "./Dashboard/Analytics";
import Articles from "./Dashboard/Articles";
import Create from "./Dashboard/Articles/Article/Create";
import Edit from "./Dashboard/Articles/Article/Edit";
import DownloadReport from "./Dashboard/DownloadReport";

export const DASHBOARD_PATH = "/";
export const ARTICLE_CREATE_PATH = "/article/create";
export const ARTICLE_EDIT_PATH = "/article/:id/edit";
export const ANALYTICS_PATH = "/analytics";
export const ANALYTICS_REPORT_PATH = "/analytics/report";

export const DASHBOARD_ROUTES = [
  {
    path: DASHBOARD_PATH,
    component: Articles,
  },
  {
    path: ARTICLE_CREATE_PATH,
    component: Create,
  },
  {
    path: ARTICLE_EDIT_PATH,
    component: Edit,
  },
  {
    path: ANALYTICS_PATH,
    component: Analytics,
  },
  {
    path: ANALYTICS_REPORT_PATH,
    component: DownloadReport,
  },
];
