import React, { useState, useEffect } from "react";

import { Formik, Form } from "formik";
import { Plus, Search, Close, Check } from "neetoicons";
import { Typography, Button } from "neetoui";
import { Input as FormikInput } from "neetoui/formik";
import { MenuBar } from "neetoui/layouts";
import { assoc, evolve } from "ramda";

import { categoriesApi } from "apis/admin";
import Tooltip from "components/Common/Tooltip";

import { filterArticlesAccordingToCategories } from "./utils";

import { ADD_CATEGORY_FORM_VALIDATION_SCHEMA } from "../constants";

const Menu = ({
  categories,
  refetch,
  filterOptions,
  setFilterOptions,
  articlesStatusCount,
}) => {
  const [isCollapsed, setIsCollapsed] = useState({ add: true, search: true });
  const [searchValue, setSearchValue] = useState("");

  const MenuBarBlocks = [
    {
      label: "All",
      count: articlesStatusCount.all,
      active: true,
    },
    {
      label: "Draft",
      count: articlesStatusCount.draft,
      active: false,
    },
    {
      label: "Published",
      count: articlesStatusCount.published,
      active: false,
    },
  ];

  const closeOnEscape = () => {
    window.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        setIsCollapsed({ add: true, search: true });
        setSearchValue("");
      }
    });
  };

  useEffect(() => {
    closeOnEscape();
  }, []);

  const handleSubmit = async values => {
    try {
      setIsCollapsed(assoc("add", !isCollapsed.add));
      await categoriesApi.create({ name: values.name });
      refetch();
    } catch (error) {
      logger.error(error);
    }
  };

  const handleActiveCategories = category => {
    filterArticlesAccordingToCategories(
      filterOptions,
      setFilterOptions,
      category
    );
  };

  return (
    <MenuBar showMenu title="Articles">
      {MenuBarBlocks.map(menuBarBlock => (
        <MenuBar.Block
          active={menuBarBlock.label === filterOptions.activeStatus}
          count={menuBarBlock.count}
          key={menuBarBlock.label}
          label={menuBarBlock.label}
          onClick={() =>
            setFilterOptions(
              evolve({
                activeStatus: () => menuBarBlock.label,
                pageNumber: () => 1,
              })
            )
          }
        />
      ))}
      <MenuBar.SubTitle
        iconProps={[
          {
            icon: Search,
            onClick: () => {
              setIsCollapsed({ add: true, search: !isCollapsed.search });
              setSearchValue("");
            },
          },
          {
            icon: isCollapsed.add ? Plus : Close,
            onClick: () => {
              setIsCollapsed({ search: true, add: !isCollapsed.add });
              setSearchValue("");
            },
          },
        ]}
      >
        <Typography
          component="h4"
          style="h5"
          textTransform="uppercase"
          weight="bold"
        >
          CATEGORIES
        </Typography>
      </MenuBar.SubTitle>
      <MenuBar.Search
        collapse={isCollapsed.search}
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        onCollapse={() => {
          setIsCollapsed(assoc("search", true));
          setSearchValue("");
        }}
      />
      {!isCollapsed.add && (
        <div>
          <Formik
            initialValues={{ name: "" }}
            validationSchema={ADD_CATEGORY_FORM_VALIDATION_SCHEMA}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, dirty }) => (
              <Form>
                <FormikInput
                  className="mb-5"
                  name="name"
                  suffix={
                    <Tooltip
                      content="Enter category name to add."
                      disabled={isSubmitting || !dirty}
                      followCursor="horizontal"
                      position="bottom"
                    >
                      <Button
                        disabled={isSubmitting || !dirty}
                        icon={Check}
                        style="text"
                        type="submit"
                      />
                    </Tooltip>
                  }
                />
              </Form>
            )}
          </Formik>
        </div>
      )}
      {categories
        .filter(category =>
          category.name
            .toLowerCase()
            .replaceAll(" ", "")
            .includes(searchValue.toLowerCase().replaceAll(" ", ""))
        )
        .map(category => (
          <MenuBar.Block
            active={filterOptions.categoryIds.includes(category.id)}
            count={category.count}
            key={category.id}
            label={category.name}
            onClick={() => handleActiveCategories(category)}
          />
        ))}
    </MenuBar>
  );
};

export default Menu;
