import React from "react";

import { Delete, Edit } from "neetoicons";
import { Typography, Button, Kbd } from "neetoui";
import { Link } from "react-router-dom";

import Tooltip from "components/Common/Tooltip";
import {
  formatTimeStampToDate,
  formatTimeStampToTimeAndDate,
} from "components/utils";

import { ColumnListItems } from "../constants";

export const buildArticleTableColumnData = handleDelete => {
  const ArticleColumnsData = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "25%",
      render: (title, { slug, status }) =>
        status === "Published" ? (
          <Link target="_blank" to={`/public/${slug}`}>
            <Typography
              className="text-indigo-500"
              lineHeight="loose"
              style="h5"
            >
              {title}
            </Typography>
          </Link>
        ) : (
          <Typography className="text-gray-500" lineHeight="loose" style="h5">
            {title}
          </Typography>
        ),
    },
    {
      title: "Last Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: "20%",
      render: (updatedAt, { status }) =>
        status === "Draft" ? (
          <Typography className="text-gray-500" style="h5">
            -
          </Typography>
        ) : (
          <Typography className="text-gray-800" style="h5">
            {formatTimeStampToDate(updatedAt)}
          </Typography>
        ),
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      width: "15%",
      render: author => (
        <Typography className="text-gray-600" style="h5">
          {author.name}
        </Typography>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "20%",
      render: category => (
        <Typography className="text-gray-600" style="h5">
          {category.name}
        </Typography>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "20%",
      render: (status, { scheduledPublish, scheduledUnpublish }) => (
        <div className="flex space-x-2">
          <Typography className="mt-1 text-gray-600" style="h5">
            {status}
          </Typography>
          {scheduledPublish !== null && (
            <Tooltip
              disabled
              followCursor="horizontal"
              position="top"
              content={`Publish scheduled at ${formatTimeStampToTimeAndDate(
                scheduledPublish
              )}`}
            >
              <Kbd className="h-4" keyName="P" />
            </Tooltip>
          )}
          {scheduledUnpublish !== null && (
            <Tooltip
              disabled
              followCursor="horizontal"
              position="top"
              content={`Unpublish scheduled at ${formatTimeStampToTimeAndDate(
                scheduledUnpublish
              )}`}
            >
              <Kbd className="h-4" keyName="UP" />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const optionColumn = {
    title: "",
    dataIndex: "id",
    key: "option",
    width: "10%",
    render: (_, { id, title, scheduledPublish, scheduledUnpublish }) => (
      <div className="flex items-end">
        <Button
          icon={Delete}
          size={13}
          style="text"
          onClick={() =>
            handleDelete({
              title,
              id,
              scheduledPublish,
              scheduledUnpublish,
            })
          }
        />
        <Button icon={Edit} size={13} style="text" to={`/article/${id}/edit`} />
      </div>
    ),
  };

  const checkedColumnList = ColumnListItems.filter(
    ele => ele.checked === true
  ).map(ele => ele.dataIndex);

  const filteredColumnData = ArticleColumnsData.filter(ele =>
    checkedColumnList.includes(ele.dataIndex)
  );

  if (filteredColumnData.length > 0) {
    filteredColumnData.push(optionColumn);
  }

  return filteredColumnData;
};
