import { Settings, Repeat, Seo } from "neetoicons";
import * as yup from "yup";

import General from "./General";
import Manage from "./ManageCategories";
import Redirection from "./Redirections";

export const SETTINGS_OPTIONS = [
  {
    label: "General",
    description: "Page Title, Brand Name & Meta Description",
    tab: "general",
    icon: Settings,
    component: General,
  },
  {
    label: "Redirections",
    description: "Create & configure redirection rules",
    tab: "redirections",
    icon: Repeat,
    component: Redirection,
  },
  {
    label: "Manage Categories",
    description: "Edit and Reorder KB Structure",
    tab: "managecategories",
    icon: Seo,
    component: Manage,
  },
];

export const GENERAL_SETTINGS_FORM_VALIDATION_SCHEMA = (
  showPassword,
  changePassword
) =>
  yup.object().shape({
    name: yup
      .string()
      .matches(/\w*[aA-zZ]\w*/, "Must contain at least one letter.")
      .required("SiteName cannot be empty."),
    password:
      showPassword && changePassword
        ? yup
            .string()
            .required("Password is required")
            .min(6, "Password must be at least 6 characters")
            .matches(
              /[^wd]*(([0-9]+.*[A-Za-z]+.*)|[A-Za-z]+.*([0-9]+.*))/,
              "Password must have one letter and one number"
            )
        : yup.string().notRequired(),
  });
