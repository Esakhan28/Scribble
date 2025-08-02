import React from "react";

import { Pane, Typography } from "neetoui";

import Form from "./Form";

import { CATEGORY_FORM_INITIAL_VALUE } from "../constants";

const Create = ({ showPane, setShowPane, refetch }) => (
  <Pane isOpen={showPane} onClose={() => setShowPane(false)}>
    <Pane.Header>
      <Typography style="h2" weight="semibold">
        Add Category
      </Typography>
    </Pane.Header>
    <Form
      category={CATEGORY_FORM_INITIAL_VALUE}
      isEdit={false}
      refetch={refetch}
      setShowPane={setShowPane}
    />
  </Pane>
);

export default Create;
