import React, { useState, useEffect } from "react";

import { Typography, Select, Alert } from "neetoui";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { articlesApi } from "apis/admin";
import Tooltip from "components/Common/Tooltip";

import Article from "./Article";
import Banner from "./Banner";

const Articles = ({
  articles,
  categories,
  refetch,
  selectedCategory,
  setArticles,
}) => {
  const [selectedArticleIds, setSelectedArticleIds] = useState([]);
  const [moveToCategory, setMoveToCategory] = useState({});
  const [isMoveToCategory, setIsMoveToCategory] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const getIsShowBannerFromLocalStorage = () => {
    const isShowBanner = JSON.parse(localStorage.getItem("isShowBanner"));
    if (isShowBanner === false) {
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
  };

  useEffect(() => {
    getIsShowBannerFromLocalStorage();
  }, []);

  useEffect(() => {
    setSelectedArticleIds([]);
  }, [selectedCategory]);

  const CATEGORY_OPTIONS = categories
    .filter(category => category.id !== selectedCategory.id)
    .map(category => ({
      label: category.name,
      value: category.id,
    }));

  const handleSelect = category => {
    setIsMoveToCategory(true);
    setMoveToCategory(category);
  };

  const handleSubmit = async () => {
    try {
      setIsMoveToCategory(false);
      await articlesApi.move({
        article_ids: selectedArticleIds,
        category_id: moveToCategory.value,
      });
      setSelectedArticleIds([]);
      refetch();
    } catch (error) {
      logger.error(error);
    }
  };

  const reorderList = (articleList, startIndex, endIndex) => {
    const shuffledArticles = Array.from(articleList);
    const [removed] = shuffledArticles.splice(startIndex, 1);
    shuffledArticles.splice(endIndex, 0, removed);

    return shuffledArticles;
  };

  const handleDragEnd = async endPosition => {
    if (!endPosition.destination) return;

    const reorderedArticles = reorderList(
      articles,
      endPosition.source.index,
      endPosition.destination.index
    );
    setArticles(reorderedArticles);

    const articleId = endPosition.draggableId;
    const newPosition = endPosition.destination.index + 1;
    try {
      await articlesApi.positionUpdate(articleId, {
        new_position: newPosition,
      });
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <div className="h-screen w-full overflow-y-auto bg-white p-4">
      <div className="fixed top-0 z-40 flex w-1/2 justify-between bg-white pr-8 pt-24">
        <Typography className="mr-48 mt-2 h-10" style="h2">
          Manage articles
        </Typography>
        <Tooltip
          disabled={selectedArticleIds.length === 0 || categories.length === 1}
          followCursor="horizontal"
          position="top"
          content={
            categories.length === 1
              ? "Add a category first to move article."
              : "Select an article to move into category"
          }
        >
          <Select
            isSearchable
            label="Move to category:"
            options={CATEGORY_OPTIONS}
            placeholder="Search or select a category here"
            size="large"
            isDisabled={
              selectedArticleIds.length === 0 || categories.length === 1
            }
            onChange={category => handleSelect(category)}
          />
        </Tooltip>
      </div>
      <div className="mt-16 mb-4 p-2">
        {showBanner && <Banner setShowBanner={setShowBanner} />}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable-articles">
            {provided => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {articles.map((article, index) => (
                  <Article
                    article={article}
                    index={index}
                    key={article.id}
                    selectedArticleIds={selectedArticleIds}
                    setSelectedArticleIds={setSelectedArticleIds}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      {isMoveToCategory && (
        <Alert
          isOpen={open}
          message={`Are you sure you want to continue moving these articles to category "${moveToCategory.label}"? This cannot be undone.`}
          title={`Moving ${selectedArticleIds.length} articles to "${moveToCategory.label}"`}
          onClose={() => setIsMoveToCategory(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Articles;
