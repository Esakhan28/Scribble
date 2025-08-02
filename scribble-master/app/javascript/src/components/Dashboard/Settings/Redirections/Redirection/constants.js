import * as yup from "yup";

export const REDIRECTION_FORM_VALIDATION_SCHEMA = yup.object().shape({
  from: yup
    .string()
    .matches(/^\//, "From Should start with '/'")
    .notOneOf([yup.ref("to"), null], "From & To path can't be same.")
    .required("From Path is required"),
  to: yup
    .string()
    .matches(/^\//, "To Should start with '/'")
    .required("To Path is required"),
});
