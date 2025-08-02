import React, { useState, useEffect } from "react";

import { PageLoader, Accordion, Typography } from "neetoui";
import { useRouteMatch, NavLink, Redirect } from "react-router-dom";

import { categoriesApi, articlesApi } from "apis/public";
import NotFound from "components/Common/NotFound";

import Article from "./Article";
import SearchBar from "./SearchBar";
import { setIndexOfSelectedCategory, findPreviewPath } from "./utils";

const Sidebar = ({ showSearchBar, setShowSearchBar }) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(-1);
  const [previewPath, setPreviewPath] = useState("");

  const { url } = useRouteMatch();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await categoriesApi.fetch();
      setCategories(data);
      findPreviewPath(data, setPreviewPath, setSelectedCategory);
      setIndexOfSelectedCategory(data, setSelectedCategory, setPreviewPath);
    } catch (error) {
      logger.error(error);
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const {
        data: { articles },
      } = await articlesApi.fetch();
      setArticles(
        articles.map(article => ({
          label: article.title,
          value: article.slug,
        }))
      );
    } catch (error) {
      logger.error(error);
    }
  };

  const fetchArticlesAndCategories = async () => {
    await Promise.all([fetchArticles(), fetchCategories()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchArticlesAndCategories();
  }, []);

  useEffect(() => {
    setIndexOfSelectedCategory(categories, setSelectedCategory, setPreviewPath);
  }, [previewPath]);

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="flex">
      <Accordion
        className="border-r h-screen w-1/4 px-5"
        defaultActiveKey={selectedCategory}
      >
        {categories.map((category, idx) => (
          <Accordion.Item key={category.id} title={category.name}>
            {category.articles.length > 0 ? (
              category.articles.map(article => (
                <NavLink
                  exact
                  activeClassName="neeto-ui-text-primary-500 mx-6"
                  className="neeto-ui-text-gray-400 mx-6"
                  key={article.slug}
                  to={`${url}/${article.slug}`}
                  onClick={() => {
                    setSelectedCategory(idx);
                    setPreviewPath(article.slug);
                  }}
                >
                  <Typography style="h5">{article.title}</Typography>
                </NavLink>
              ))
            ) : (
              <Typography style="h5">No articles exists.</Typography>
            )}
          </Accordion.Item>
        ))}
      </Accordion>
      {selectedCategory !== -1 ? (
        <>
          <Article slug={previewPath} />
          <Redirect exact from="/public" to={`/public/${previewPath}`} />
        </>
      ) : (
        <NotFound message="No Article Found" />
      )}
      {showSearchBar && (
        <SearchBar
          articles={articles}
          setPreviewPath={setPreviewPath}
          setShowSearchBar={setShowSearchBar}
          showSearchBar={showSearchBar}
        />
      )}
    </div>
  );
};

export default Sidebar;
