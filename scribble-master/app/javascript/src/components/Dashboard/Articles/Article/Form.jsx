import React, { useEffect, useState } from "react";

import { Formik, Form as FormikForm } from "formik";
import { Info } from "neetoicons";
import { Dropdown, Button, PageLoader, Callout, Alert } from "neetoui";
import { Select, Input, Textarea } from "neetoui/formik";
import { useHistory } from "react-router-dom";

import { categoriesApi, articlesApi } from "apis/admin";
import Tooltip from "components/Common/Tooltip";
import { formatTimeStampToTimeAndDate } from "components/utils";

import { ARTICLES_FORM_VALIDATION_SCHEMA } from "../constants";

const Form = ({
  isEdit,
  refetch,
  selectedArticle,
  handleSubmit,
  articleStatusList,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(
    selectedArticle.status === "Published" ? "Publish" : "Save draft"
  );
  const [categories, setCategories] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const history = useHistory();
  const { Menu, MenuItem } = Dropdown;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await categoriesApi.fetch();
      setCategories(data);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelScheduled = async scheduledStatus => {
    try {
      if (
        scheduledStatus === "Publish later" &&
        (selectedArticle.status === "Published" ||
          selectedArticle.scheduledUnpublish === null)
      ) {
        await articlesApi.update(selectedArticle.id, {
          scheduled_publish: null,
        });
        refetch();
      } else if (
        scheduledStatus === "Unpublish later" &&
        (selectedArticle.status === "Draft" ||
          selectedArticle.scheduledPublish === null)
      ) {
        await articlesApi.update(selectedArticle.id, {
          scheduled_unpublish: null,
        });
        refetch();
      } else {
        setShowAlert(true);
      }
    } catch (error) {
      logger.error(error);
    }
  };

  const handleCancelScheduledSubmit = async () => {
    try {
      await articlesApi.update(selectedArticle.id, {
        scheduled_publish: null,
        scheduled_unpublish: null,
      });
      setShowAlert(false);
      refetch();
    } catch (error) {
      logger.error(error);
    }
  };

  const CATEGORY_OPTIONS = categories.map(category => ({
    label: category.name,
    value: category.id,
  }));

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <>
      <Formik
        initialValues={selectedArticle}
        validateOnBlur={submitted}
        validateOnChange={submitted}
        validationSchema={ARTICLES_FORM_VALIDATION_SCHEMA(CATEGORY_OPTIONS)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, dirty }) => (
          <FormikForm className="mx-auto mt-8 w-6/12">
            {selectedArticle.scheduledPublish !== null && (
              <Callout className="my-2" icon={Info} style="info">
                <div>
                  This article is scheduled to be published at "
                  {formatTimeStampToTimeAndDate(
                    selectedArticle.scheduledPublish
                  )}
                  ".&nbsp;
                  <span
                    className="cursor-pointer text-indigo-500"
                    onClick={() => handleCancelScheduled("Publish later")}
                  >
                    Click here&nbsp;
                  </span>
                  to cancel publish scheduled.
                </div>
              </Callout>
            )}
            {selectedArticle.scheduledUnpublish !== null && (
              <Callout className="my-2" icon={Info} style="warning">
                <div>
                  This article is scheduled to be Unpublished at "
                  {formatTimeStampToTimeAndDate(
                    selectedArticle.scheduledUnpublish
                  )}
                  ".&nbsp;
                  <span
                    className="cursor-pointer text-indigo-500"
                    onClick={() => handleCancelScheduled("Unpublish later")}
                  >
                    Click here&nbsp;
                  </span>
                  to cancel unpublish scheduled.
                </div>
              </Callout>
            )}
            <div className="my-5 flex gap-x-4">
              <Input
                required
                className="mr-3 w-5/12"
                label="Article Title"
                name="title"
                placeholder="Enter Title"
              />
              <Select
                isSearchable
                required
                className="w-56"
                label="Select Category"
                name="category"
                options={CATEGORY_OPTIONS}
                placeholder="Select Category"
              />
            </div>
            <Textarea
              required
              label="Article Body"
              name="body"
              placeholder="Enter text"
              rows={30}
            />
            <div className="mt-4 flex gap-2">
              <div className="flex">
                <Tooltip
                  content="Please make any change to save."
                  disabled={isSubmitting || (isEdit && !dirty)}
                  followCursor="horizontal"
                  position="bottom"
                >
                  <Button
                    className="mr-px"
                    disabled={isSubmitting || (isEdit && !dirty)}
                    label={status}
                    loading={isSubmitting}
                    name="status"
                    size="medium"
                    style="primary"
                    type="submit"
                    onClick={() => {
                      setFieldValue("status", status);
                      setSubmitted(true);
                    }}
                  />
                </Tooltip>
                <Dropdown>
                  <Menu>
                    {articleStatusList.map((status, idx) => (
                      <MenuItem.Button
                        key={idx}
                        onClick={() => {
                          setFieldValue("status", status);
                          setStatus(status);
                        }}
                      >
                        {status}
                      </MenuItem.Button>
                    ))}
                  </Menu>
                </Dropdown>
              </div>
              <Button
                label="Cancel"
                style="text"
                type="reset"
                onClick={() => history.push("/")}
              />
            </div>
          </FormikForm>
        )}
      </Formik>
      {showAlert && (
        <Alert
          isOpen
          title="Confirm removal of article scheduled status"
          message="This will remove both the scheduled status as the Drafted article
          cannot be unpublish later without publish later and the Published article
          cannot be publish later without Unpublish later."
          onClose={() => setShowAlert(false)}
          onSubmit={handleCancelScheduledSubmit}
        />
      )}
    </>
  );
};

export default Form;
