import React, { useState } from "react";

import { MenuVertical } from "neetoicons";
import { Typography, Dropdown } from "neetoui";
import { Draggable } from "react-beautiful-dnd";

import DeleteAlert from "./DeleteAlert";

const { Menu, MenuItem } = Dropdown;

const Row = ({
  category,
  index,
  isSelectedCategory,
  refetch,
  selectedCategory,
  setSelectedCategory,
  setShowEditPane,
}) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  return (
    <>
      <Draggable
        draggableId={category.id.toString()}
        index={index}
        key={category.id}
      >
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div
              className={`flex h-16 justify-between p-2 ${
                isSelectedCategory && "rounded-lg bg-indigo-200"
              }`}
            >
              <div className="my-auto ml-1 text-gray-700">
                <Typography style="h4">{category.name}</Typography>
                <Typography className="ml-1 pt-2" style="body2">
                  {category.count}
                  {category.count > 1 ? " articles" : " article"}
                </Typography>
              </div>
              <div className="my-auto flex items-end">
                <Dropdown buttonStyle="text" icon={MenuVertical}>
                  <Menu>
                    <MenuItem.Button onClick={() => setShowEditPane(true)}>
                      Edit
                    </MenuItem.Button>
                    <MenuItem.Button
                      style="danger"
                      onClick={() =>
                        setShowDeleteAlert(prevState => !prevState)
                      }
                    >
                      Delete
                    </MenuItem.Button>
                  </Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        )}
      </Draggable>
      {showDeleteAlert && (
        <DeleteAlert
          refetch={refetch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onClose={() => setShowDeleteAlert(false)}
        />
      )}
    </>
  );
};

export default Row;
