export const StatusListForDraftedOrUnpublishScheduledArticle = [
  "Save draft",
  "Publish",
  "Publish later",
];

export const StatusListForPublishedOrPublishScheduledArticle = [
  "Save draft",
  "Publish",
  "Unpublish later",
];

export const StatusListForUnpublishAndPublishScheduledArticle = [
  "Save draft",
  "Publish",
];

export const ARTICLES_FORM_INITIAL_VALUES = {
  title: "",
  body: "",
  category: null,
  status: "Draft",
  scheduledPublish: null,
  scheduledUnpublish: null,
};
