import {
  StatusListForDraftedOrUnpublishScheduledArticle,
  StatusListForPublishedOrPublishScheduledArticle,
  StatusListForUnpublishAndPublishScheduledArticle,
} from "./constants";

export const findArticleStatusList = (article, setArticleStatusList) => {
  if (
    article.scheduledUnpublish !== null &&
    article.scheduledPublish !== null
  ) {
    setArticleStatusList(StatusListForUnpublishAndPublishScheduledArticle);
  } else if (
    article.scheduledPublish !== null &&
    article.status !== "Published"
  ) {
    setArticleStatusList(StatusListForPublishedOrPublishScheduledArticle);
  } else if (
    article.scheduledUnpublish !== null &&
    article.status === "Published"
  ) {
    setArticleStatusList(StatusListForDraftedOrUnpublishScheduledArticle);
  } else if (article.status === "Published") {
    setArticleStatusList(StatusListForPublishedOrPublishScheduledArticle);
  } else {
    setArticleStatusList(StatusListForDraftedOrUnpublishScheduledArticle);
  }
};

export const convertArticleToFormFormat = article => ({
  id: article.id,
  title: article.title,
  body: article.body,
  category: { label: article.category.name, value: article.category.id },
  status: article.status,
  scheduledPublish: article.scheduledPublish,
  scheduledUnpublish: article.scheduledUnpublish,
});
