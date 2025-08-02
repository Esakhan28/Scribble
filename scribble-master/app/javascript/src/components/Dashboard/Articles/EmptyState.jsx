import React from "react";

import { Button } from "neetoui";

import Tooltip from "components/Common/Tooltip";
import { ARTICLE_CREATE_PATH } from "components/routeConstants";

const EmptyState = ({ disabled }) => (
  <div className="flex h-full w-full flex-row items-start justify-start">
    <div className="m-auto w-3/5">
      <h2 className="mb-4 text-center text-2xl font-medium">
        Add some articles
      </h2>
      <p className="mb-8 text-center text-base font-normal leading-relaxed text-gray-600">
        Looks like you don't have any articles!
      </p>
      <div className="flex flex-row items-center justify-center">
        <Tooltip
          content="Add category to create an article"
          disabled={disabled}
          followCursor="horizontal"
          position="bottom"
        >
          <Button
            disabled={disabled}
            label="Add new article"
            to={disabled ? "/" : ARTICLE_CREATE_PATH}
            type="primary"
          />
        </Tooltip>
      </div>
    </div>
  </div>
);

export default EmptyState;
