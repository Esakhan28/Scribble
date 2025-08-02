import React from "react";

import { Warning } from "neetoicons";
import {
  Modal as NeetoUIModal,
  Typography,
  Button,
  Input,
  Textarea,
  Callout,
} from "neetoui";

import { articlesApi } from "apis/admin";
import Tooltip from "components/Common/Tooltip";

const Modal = ({ article, version, showModal, setShowModal, refetch }) => {
  const categoryValue = version.category
    ? version.category.name
    : "Category doesn't exists.";
  const isRestored = version.article.versionStatus;

  const handleRestore = async () => {
    try {
      const articleData = {
        title: version.article.title,
        body: version.article.body,
        status: "Draft",
        category_id: version.article.categoryId,
        version_status: true,
        restored_at: version.article.updatedAt,
        scheduled_publish: null,
        scheduled_unpublish: null,
      };
      await articlesApi.update(version.article.id, articleData);
      setShowModal(false);
      refetch();
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <NeetoUIModal
      isOpen={showModal}
      size="large"
      onClose={() => setShowModal(false)}
    >
      <NeetoUIModal.Header description="Version history of Setting up an account in Scribble.">
        <Typography style="h2">Version History</Typography>
      </NeetoUIModal.Header>
      <NeetoUIModal.Body className="space-y-2">
        {(article.scheduledPublish || article.scheduledUnpublish) && (
          <Callout className="mb-4" icon={Warning} style="warning">
            This article is scheduled to be published or unpublished, If you
            restore this article version the scheduled status will be removed
            from this article.
          </Callout>
        )}
        <div className="my-5 flex gap-x-4">
          <Input
            disabled
            className="bg-slate-700 mr-3 w-5/12"
            label="Article Title"
            value={version.article.title}
          />
          <Input
            disabled
            className="w-56"
            label="Category"
            value={categoryValue}
          />
        </div>
        <Textarea
          disabled
          label="Article Body"
          rows={30}
          value={version.article.body}
        />
      </NeetoUIModal.Body>
      <NeetoUIModal.Footer>
        <div className="flex space-x-2">
          <Tooltip
            disabled={!version.category || isRestored}
            followCursor="horizontal"
            position="top"
            content={
              isRestored
                ? "Already restored article can't be restore."
                : "Category doesn't exists, unable to restore."
            }
          >
            <Button
              disabled={!version.category || isRestored}
              label="Restore version"
              onClick={handleRestore}
            />
          </Tooltip>
          <Button
            label="Cancel"
            style="text"
            onClick={() => setShowModal(false)}
          />
        </div>
        {version.category && !isRestored && (
          <Typography className="mt-2" style="body3">
            Note: After restoring, the article will be drafted by default.
          </Typography>
        )}
      </NeetoUIModal.Footer>
    </NeetoUIModal>
  );
};

export default Modal;
