import React, { useEffect, useState } from "react";

import { PageLoader } from "neetoui";
import { mergeLeft } from "ramda";
import { useHistory, useParams } from "react-router-dom";

import { articlesApi } from "apis/admin";
import { convertSnakeCaseKeysToCamelCase } from "components/utils";

import Alert from "./Alert";
import DatePicker from "./DatePicker";
import Form from "./Form";
import { findArticleStatusList, convertArticleToFormFormat } from "./utils";
import VersionHistory from "./VersionHistory";

const Edit = () => {
  const [article, setArticle] = useState({});
  const [loading, setLoading] = useState(true);
  const [articleVersions, setArticleVersions] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [articleStatusList, setArticleStatusList] = useState([]);

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    fetchArticleAndVersions();
  }, []);

  const fetchArticleAndVersions = async () => {
    await Promise.all([fetchArticle(), fetchArticleVersions()]);
    setLoading(false);
  };

  const fetchArticleVersions = async () => {
    try {
      setLoading(true);
      const {
        data: { article_versions: articleVersions },
      } = await articlesApi.versions(id);
      const versions = articleVersions
        .map(version => ({
          id: version.id,
          article: version.object,
          category: version.category,
        }))
        .splice(1)
        .reverse();
      setArticleVersions(convertSnakeCaseKeysToCamelCase(versions));
    } catch (error) {
      logger.error(error);
    }
  };

  const fetchArticle = async () => {
    try {
      const { data } = await articlesApi.show(id);
      const article = convertSnakeCaseKeysToCamelCase(data);
      setArticle(article);
      findArticleStatusList(article, setArticleStatusList);
    } catch (error) {
      logger.error(error);
    }
  };

  const handleSubmit = async values => {
    try {
      const articleData = mergeLeft(
        {
          category_id: values.category.value,
          version_status: false,
          restored_at: null,
        },
        values
      );
      const status = values.status;

      if (status !== "Save draft" && status !== "Publish") {
        setFormValues(articleData);
        setShowDatePicker(true);
      } else if (
        (article.scheduledPublish !== null && status === "Publish") ||
        (article.scheduledUnpublish !== null && status === "Save draft")
      ) {
        articleData.status = status === "Publish" ? "Published" : "Draft";
        setFormValues(articleData);
        setShowAlert(true);
      } else {
        articleData.status = status === "Publish" ? "Published" : "Draft";
        await articlesApi.update(article.id, articleData);
        history.push("/");
      }
    } catch (error) {
      logger.error(error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="flex">
      <Form
        isEdit
        articleStatusList={articleStatusList}
        handleSubmit={handleSubmit}
        refetch={fetchArticle}
        selectedArticle={convertArticleToFormFormat(article)}
      />
      <VersionHistory
        article={article}
        articleVersions={articleVersions}
        refetch={fetchArticleAndVersions}
      />
      {showDatePicker && (
        <DatePicker
          isEdit
          formValues={formValues}
          selectedArticle={article}
          setShowDatePicker={setShowDatePicker}
          showDatePicker={showDatePicker}
        />
      )}
      {showAlert && (
        <Alert
          article={article}
          formValues={formValues}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default Edit;
