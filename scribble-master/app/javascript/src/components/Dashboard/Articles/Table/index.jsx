import React, { useState } from "react";

import { Table as NeetoUITable, Typography, Pagination } from "neetoui";
import { assoc } from "ramda";

import { buildArticleTableColumnData } from "./utils";

import DeleteAlert from "../DeleteAlert";

const Table = ({
  articles,
  articlesCount,
  pageNumber,
  refetch,
  setFilterOptions,
}) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedDeleteArticle, setSelectedDeleteArticle] = useState({});

  if (articlesCount > 0 && articlesCount === (pageNumber - 1) * 10) {
    setFilterOptions(assoc("pageNumber", pageNumber - 1));
  }

  const handleDelete = selectedArticle => {
    setSelectedDeleteArticle(selectedArticle);
    setShowDeleteAlert(prevState => !prevState);
  };

  return (
    <>
      <Typography className="pb-6" style="h4">
        {articlesCount}
        {articlesCount > 1 ? " Articles" : " Article"}
      </Typography>
      <div className="w-full">
        <NeetoUITable
          allowRowClick={false}
          columnData={buildArticleTableColumnData(handleDelete)}
          rowData={articles}
        />
        <div className="flex justify-between pt-4">
          <Typography className="ml-4" style="h4">
            {(pageNumber - 1) * 10 + 1} -&nbsp;
            {pageNumber * 10 < articlesCount ? pageNumber * 10 : articlesCount}
            &nbsp;of {articlesCount}
          </Typography>
          <Pagination
            count={articlesCount}
            pageNo={pageNumber}
            pageSize={10}
            navigate={currentPageNumber =>
              setFilterOptions(assoc("pageNumber", currentPageNumber))
            }
          />
        </div>
        {showDeleteAlert && (
          <DeleteAlert
            refetch={refetch}
            selectedDeleteArticle={selectedDeleteArticle}
            setSelectedDeleteArticle={setSelectedDeleteArticle}
            onClose={() => setShowDeleteAlert(false)}
          />
        )}
      </div>
    </>
  );
};

export default Table;
