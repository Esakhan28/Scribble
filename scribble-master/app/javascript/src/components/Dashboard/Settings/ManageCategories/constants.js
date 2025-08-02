import * as yup from "yup";

export const CATEGORY_FORM_VALIDATION_SCHEMA = yup.object().shape({
  name: yup
    .string()
    .matches(/\w*[aA-zZ]\w*/, "Must contain at least one letter.")
    .required("Category name cannot be empty."),
});

export const CATEGORY_FORM_INITIAL_VALUE = {
  name: "",
};
