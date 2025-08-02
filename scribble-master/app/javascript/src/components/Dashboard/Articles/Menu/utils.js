import { evolve, without, append } from "ramda";

export const filterArticlesAccordingToCategories = (
  filterOptions,
  setFilterOptions,
  category
) => {
  const filteredCategoryIds = filterOptions.categoryIds.includes(category.id)
    ? without([category.id], filterOptions.categoryIds)
    : append(category.id, filterOptions.categoryIds);

  setFilterOptions(
    evolve({
      categoryIds: () => filteredCategoryIds,
      pageNumber: () => 1,
    })
  );
};
