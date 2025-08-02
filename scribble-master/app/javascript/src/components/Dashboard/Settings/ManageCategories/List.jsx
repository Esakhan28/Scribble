import React, { useState } from "react";

import { mergeLeft } from "ramda";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { categoriesApi } from "apis/admin";

import EditCategoryPane from "./Pane/Edit";
import Row from "./Row";

const List = ({
  categories,
  refetch,
  selectedCategory,
  setCategories,
  setSelectedCategory,
}) => {
  const [showEditPane, setShowEditPane] = useState(false);

  const reorderList = (categoryList, startIndex, endIndex) => {
    const shuffledCategories = Array.from(categoryList);
    const [removed] = shuffledCategories.splice(startIndex, 1);
    shuffledCategories.splice(endIndex, 0, removed);

    return shuffledCategories;
  };

  const handleDragEnd = async endPosition => {
    if (!endPosition.destination) return;

    const reorderedCategories = reorderList(
      categories,
      endPosition.source.index,
      endPosition.destination.index
    );
    setCategories(reorderedCategories);

    const categoryId = endPosition.draggableId;
    const newPosition = endPosition.destination.index + 1;
    try {
      await categoriesApi.positionUpdate(categoryId, {
        new_position: newPosition,
      });
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable-categories">
          {provided => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {categories.map((category, idx) => (
                <div
                  key={category.id}
                  onClick={() =>
                    setSelectedCategory(
                      mergeLeft({ isDeleted: false }, category)
                    )
                  }
                >
                  <Row
                    category={category}
                    index={idx}
                    isSelectedCategory={selectedCategory.id === category.id}
                    refetch={refetch}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    setShowEditPane={setShowEditPane}
                  />
                </div>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <EditCategoryPane
        category={selectedCategory}
        refetch={refetch}
        setShowPane={setShowEditPane}
        showPane={showEditPane}
      />
    </>
  );
};

export default List;
