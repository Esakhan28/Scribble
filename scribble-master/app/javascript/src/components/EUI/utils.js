export const setIndexOfSelectedCategory = (
  categories,
  setSelectedCategory,
  setPreviewPath
) => {
  const currentPathSplitBySlash = window.location.pathname.split("/");
  const lastIndex = currentPathSplitBySlash.length - 1;
  const currentSlug = currentPathSplitBySlash[lastIndex];
  let isSlugFound = false;

  if (currentSlug !== "") {
    categories.forEach((category, idx) =>
      category.articles.filter(article => {
        const isSlugMatched = article.slug === currentSlug;
        if (isSlugMatched) {
          isSlugFound = true;
          setSelectedCategory(idx);
          setPreviewPath(currentSlug);
        }

        return isSlugMatched;
      })
    );
  }

  if (!isSlugFound && window.location.pathname !== "/public") {
    setSelectedCategory(-1);
  }
};

export const findPreviewPath = (
  categories,
  setPreviewPath,
  setSelectedCategory
) => {
  const category = categories.find(category => category.articles.length !== 0);

  if (category !== undefined) {
    setPreviewPath(category.articles[0].slug);
    setSelectedCategory(categories.indexOf(category));
  }
};
