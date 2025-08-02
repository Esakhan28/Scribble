import React from "react";

import Form from "./Form";

const Edit = ({ redirection, setSelectedRedirectionId, refetch }) => (
  <Form
    isEdit
    initialValues={redirection}
    refetch={refetch}
    setShowRedirection={setSelectedRedirectionId}
  />
);

export default Edit;
