import axios from "axios";

const show = slug => axios.get(`/api/public/articles/${slug}`);

const fetch = () => axios.get("api/public/articles");

const articlesApi = {
  show,
  fetch,
};

export default articlesApi;
