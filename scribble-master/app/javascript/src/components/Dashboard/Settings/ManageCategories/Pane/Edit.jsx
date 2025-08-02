import React from "react";

import { Pane, Typography } from "neetoui";

import Form from "./Form";

const Edit = ({ showPane, category, setShowPane, refetch }) => (
  <Pane isOpen={showPane} onClose={() => setShowPane(false)}>
    <Pane.Header>
      <Typography style="h2" weight="semibold">
        Edit Category
      </Typography>
    </Pane.Header>
    <Form
      isEdit
      category={category}
      refetch={refetch}
      setShowPane={setShowPane}
    />
  </Pane>
);

export default Edit;
