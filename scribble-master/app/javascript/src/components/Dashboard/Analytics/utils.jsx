import React from "react";

import { Typography } from "neetoui";
import { Link } from "react-router-dom";

import { formatTimeStampToDate } from "components/utils";

export const ArticleColumnsData = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    width: "35%",
    render: (title, { slug }) => (
      <Link target="_blank" to={`/public/${slug}`}>
        <Typography className="text-indigo-500" lineHeight="loose" style="h5">
          {title}
        </Typography>
      </Link>
    ),
  },
  {
    title: "Date",
    dataIndex: "updatedAt",
    key: "updatedAt",
    width: "25%",
    render: updatedAt => (
      <Typography className="text-gray-700" style="h5">
        {formatTimeStampToDate(updatedAt)}
      </Typography>
    ),
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    width: "25%",
    render: category => (
      <Typography className="text-gray-600" style="h5">
        {category.name}
      </Typography>
    ),
  },
  {
    title: "Visits",
    dataIndex: "visits",
    key: "visits",
    width: "15%",
    sorter: (a, b) => a.visits - b.visits,
    render: visits => (
      <Typography className="text-gray-600" style="h5">
        {visits}
      </Typography>
    ),
  },
];

export const ArticleVisitsColumnData = [
  {
    title: "DATE",
    dataIndex: "date",
    key: "date",
    width: "5%",
    render: date => (
      <Typography className="text-gray-700" lineHeight="loose" style="h5">
        {date}
      </Typography>
    ),
  },
  {
    title: "Visits",
    dataIndex: "visits",
    key: "visits",
    width: "5%",
    render: visits => (
      <Typography className="text-gray-700" style="h5">
        {visits}
      </Typography>
    ),
  },
];

export const buildRowData = datesAndVisits => {
  const allKeysOfDatesAndVisits = Object.keys(datesAndVisits);
  const rowData = allKeysOfDatesAndVisits.map((date, idx) => ({
    id: idx + 1,
    date,
    visits: datesAndVisits[date],
  }));

  return rowData;
};
