import React, { useEffect, useState } from "react";

import { Table, PageLoader, Pagination, Typography } from "neetoui";

import { articlesApi } from "apis/admin";
import { convertSnakeCaseKeysToCamelCase } from "components/utils";

import {
  ArticleColumnsData,
  ArticleVisitsColumnData,
  buildRowData,
} from "./utils";

const Analytics = () => {
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const fetchArticles = async () => {
    try {
      const {
        data: { articles, count },
      } = await articlesApi.fetchPublished({ pageNumber: currentPageNumber });
      setArticles(convertSnakeCaseKeysToCamelCase(articles));
      setTotalCount(count);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [currentPageNumber]);

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="mx-64 mt-8">
      <Table
        allowRowClick={false}
        columnData={ArticleColumnsData}
        rowData={articles}
        expandable={{
          expandedRowRender: article => (
            <div className="m-0 w-64 pl-8">
              <Table
                allowRowClick={false}
                columnData={ArticleVisitsColumnData}
                rowData={buildRowData(article.datesAndVisits)}
              />
            </div>
          ),
        }}
      />
      <div className="flex justify-between pt-4">
        {totalCount > 0 && (
          <Typography className="ml-4" style="h4">
            {(currentPageNumber - 1) * 10 + 1} -&nbsp;
            {currentPageNumber * 10 < totalCount
              ? currentPageNumber * 10
              : totalCount}
            &nbsp;of {totalCount}
          </Typography>
        )}
        <Pagination
          count={totalCount}
          navigate={pageNumber => setCurrentPageNumber(pageNumber)}
          pageNo={currentPageNumber}
          pageSize={10}
        />
      </div>
    </div>
  );
};

export default Analytics;
