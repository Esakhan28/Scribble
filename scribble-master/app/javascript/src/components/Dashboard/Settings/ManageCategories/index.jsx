import React, { useEffect, useState } from "react";

import { Plus } from "neetoicons";
import { Typography, PageLoader, Button } from "neetoui";
import { mergeLeft } from "ramda";

import { categoriesApi } from "apis/admin";
import NotFound from "components/Common/NotFound";
import { convertSnakeCaseKeysToCamelCase } from "components/utils";
import EmptyList from "images/EmptyList";

import Articles from "./Articles";
import List from "./List";
import NewCategoryPane from "./Pane/Create";

const Manage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPane, setShowAddPane] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({ isDeleted: true });
  const [articles, setArticles] = useState([]);

  const fetchCategoriesAndArticles = async () => {
    await Promise.all([fetchCategories(), fetchArticlesThroughCategory()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategoriesAndArticles();
  }, [selectedCategory]);

  const fetchArticlesThroughCategory = async () => {
    if (selectedCategory.isDeleted === false) {
      try {
        const {
          data: { articles },
        } = await categoriesApi.show(selectedCategory.id);
        setArticles(convertSnakeCaseKeysToCamelCase(articles));
      } catch (error) {
        logger.error(error);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await categoriesApi.fetch();
      setCategories(data);
      if (data.length > 0 && selectedCategory.isDeleted === true) {
        setSelectedCategory(mergeLeft({ isDeleted: false }, data[0]));
      }
    } catch (error) {
      logger.error(error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="flex w-3/4">
      <div className="border-r h-screen w-1/3 overflow-y-auto bg-white">
        <div className="fixed top-0 z-40 ml-8 flex w-1/5 bg-white pt-24">
          <Typography className="h-10" style="h2">
            Manage categories
          </Typography>
          <div className="my-auto w-1/5 pl-12">
            <Button
              icon={Plus}
              size={15}
              onClick={() => setShowAddPane(true)}
            />
          </div>
        </div>
        <NewCategoryPane
          refetch={fetchCategories}
          setShowPane={setShowAddPane}
          showPane={showAddPane}
        />
        <div className="mt-24 mb-4 p-10">
          {categories.length > 0 ? (
            <List
              categories={categories}
              refetch={fetchCategories}
              selectedCategory={selectedCategory}
              setCategories={setCategories}
              setSelectedCategory={setSelectedCategory}
            />
          ) : (
            <NotFound message="No category is available. Add a category to manage articles." />
          )}
        </div>
      </div>
      <div className="w-2/3">
        {articles.length > 0 ? (
          <Articles
            articles={articles}
            categories={categories}
            refetch={fetchCategoriesAndArticles}
            selectedCategory={selectedCategory}
            setArticles={setArticles}
          />
        ) : (
          <div className="justify-center">
            <NotFound message="No article available." />
            <img className="mx-auto w-3/4 " src={EmptyList} />
          </div>
        )}
      </div>
    </div>
  );
};
export default Manage;
