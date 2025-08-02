import React, { useEffect, useState } from "react";

import { Typography, PageLoader } from "neetoui";

import { articlesApi } from "apis/public";
import { formatTimeStampToDate } from "components/utils";

const Article = ({ slug }) => {
  const [article, setArticle] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const { data: article } = await articlesApi.show(slug);
      setArticle({
        title: article.title,
        category: article.category.name,
        date: article.updated_at,
        paragraphs: article.body.split("\n"),
      });
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="m-8 w-3/4">
      <Typography className="text-gray-800" style="h1">
        {article.title}
      </Typography>
      <div className="mt-2 flex">
        <Typography
          className="neeto-ui-rounded neeto-ui-bg-primary-100 neeto-ui-text-primary-800 mr-4 py-1 px-3"
          style="h5"
        >
          {article.category}
        </Typography>
        <Typography className="neeto-ui-text-gray-400 p-1" style="h5">
          {formatTimeStampToDate(article.date)}
        </Typography>
      </div>
      <div className="mt-6">
        {article.paragraphs.map((paragraph, idx) => (
          <Typography key={idx} style="body2">
            {paragraph}
            <br />
          </Typography>
        ))}
      </div>
    </div>
  );
};

export default Article;
