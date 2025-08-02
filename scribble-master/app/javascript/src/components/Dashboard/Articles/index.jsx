import React, { useState, useEffect } from "react";

import { PageLoader } from "neetoui";
import { Container } from "neetoui/layouts";

import { articlesApi, categoriesApi } from "apis/admin";
import { convertSnakeCaseKeysToCamelCase } from "components/utils";

import {
  ColumnListItems,
  FilterOptionItems,
  StatusCountItems,
} from "./constants";
import EmptyState from "./EmptyState";
import Header from "./Header";
import MenuBar from "./Menu";
import Table from "./Table";

const Articles = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [columnList, setColumnList] = useState(ColumnListItems);
  const [articles, setArticles] = useState([]);
  const [filterOptions, setFilterOptions] = useState(FilterOptionItems);
  const [articlesStatusCount, setArticlesStatusCount] =
    useState(StatusCountItems);
  const [articlesCount, setArticlesCount] = useState(0);

  const handleCheckedColumns = selectedIdx => {
    const items = ColumnListItems;
    const selectedItem = items[selectedIdx];
    selectedItem.checked = !selectedItem.checked;
    setColumnList([...items]);
  };

  const fetchArticlesStatusCount = async () => {
    try {
      const { data } = await articlesApi.count({
        categoryIds: filterOptions.categoryIds,
      });
      setArticlesStatusCount(data);
    } catch (error) {
      logger.error(error);
    }
  };

  const fetchArticles = async () => {
    const payload = {
      status: filterOptions.activeStatus,
      categoryIds: filterOptions.categoryIds,
      searchTerm: filterOptions.searchTerm,
      pageNumber: filterOptions.pageNumber,
    };
    try {
      const {
        data: { articles, count },
      } = await articlesApi.fetch(payload);
      setArticles(convertSnakeCaseKeysToCamelCase(articles));
      setArticlesCount(count);
    } catch (error) {
      logger.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await categoriesApi.fetch();
      setCategories(data);
    } catch (error) {
      logger.error(error);
    }
  };

  const fetchArticlesCategoriesAndStatusCount = async () => {
    await Promise.all([
      fetchArticles(),
      fetchCategories(),
      fetchArticlesStatusCount(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchArticlesCategoriesAndStatusCount();
  }, [filterOptions]);

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="flex">
      <MenuBar
        articlesStatusCount={articlesStatusCount}
        categories={categories}
        filterOptions={filterOptions}
        refetch={fetchArticlesCategoriesAndStatusCount}
        setFilterOptions={setFilterOptions}
      />
      <Container>
        <Header
          columnList={columnList}
          disabled={categories.length === 0}
          filterOptions={filterOptions}
          handleCheckedColumns={handleCheckedColumns}
          setFilterOptions={setFilterOptions}
        />
        {articlesCount > 0 ? (
          <div className="flex w-full flex-col">
            <Table
              articles={articles}
              articlesCount={articlesCount}
              pageNumber={filterOptions.pageNumber}
              refetch={fetchArticlesCategoriesAndStatusCount}
              setFilterOptions={setFilterOptions}
            />
          </div>
        ) : (
          <EmptyState disabled={categories.length === 0} />
        )}
      </Container>
    </div>
  );
};

export default Articles;
