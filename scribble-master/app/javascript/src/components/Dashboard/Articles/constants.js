import * as yup from "yup";

export const ARTICLES_FORM_VALIDATION_SCHEMA = CATEGORY_OPTIONS =>
  yup.object().shape({
    title: yup
      .string()
      .matches(
        /\w*[aA-zZ0-9]\w*/,
        "Must contain at least one letter or number."
      )
      .required("Title is required. Please Enter the Title."),
    body: yup
      .string()
      .required("Body is required. Please Enter the Body of the Article."),
    category: yup
      .object()
      .nullable()
      .shape({
        label: yup
          .string()
          .oneOf(CATEGORY_OPTIONS.map(category => category.label)),
        value: yup
          .string()
          .oneOf(CATEGORY_OPTIONS.map(category => category.value)),
      })
      .required("Category is required."),
  });

export const ColumnListItems = [
  {
    name: "Title",
    dataIndex: "title",
    checked: true,
    value: 0,
  },
  {
    name: "Date",
    dataIndex: "updatedAt",
    checked: true,
    value: 1,
  },
  {
    name: "Author",
    dataIndex: "author",
    checked: true,
    value: 2,
  },
  {
    name: "Category",
    dataIndex: "category",
    checked: true,
    value: 3,
  },
  {
    name: "Status",
    dataIndex: "status",
    checked: true,
    value: 4,
  },
];

export const ADD_CATEGORY_FORM_VALIDATION_SCHEMA = yup.object().shape({
  name: yup
    .string()
    .matches(/\w*[aA-zZ]\w*/, "Must contain at least one letter.")
    .required("Name is required. Please enter the name."),
});

export const FilterOptionItems = {
  searchTerm: "",
  categoryIds: [],
  activeStatus: "All",
  pageNumber: 1,
};

export const StatusCountItems = {
  all: 0,
  draft: 0,
  published: 0,
};
