import React from "react";

import Form from "./Form";

const Add = ({ setShowAdd, refetch }) => (
  <Form
    initialValues={{ from: "/", to: "/" }}
    isEdit={false}
    refetch={refetch}
    setShowRedirection={setShowAdd}
  />
);

export default Add;
