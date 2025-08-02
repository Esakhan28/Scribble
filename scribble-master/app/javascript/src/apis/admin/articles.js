import axios from "axios";

const fetch = payload =>
  axios.get("/api/admin/articles", {
    params: {
      search_term: payload.searchTerm,
      category_ids: payload.categoryIds,
      status: payload.status,
      page_number: payload.pageNumber,
    },
  });

const show = async id => await axios.get(`/api/admin/articles/${id}`);

const create = async payload => {
  await axios.post("/api/admin/articles", payload);
};

const destroy = async id => {
  await axios.delete(`/api/admin/articles/${id}`);
};

const update = async (id, payload) => {
  await axios.put(`/api/admin/articles/${id}`, payload);
};

const versions = id => axios.get(`/api/admin/articles/${id}/versions`);

const fetchPublished = payload =>
  axios.get("/api/admin/articles/published_list", {
    params: { page_number: payload.pageNumber },
  });

const count = payload =>
  axios.get("/api/admin/articles/count", {
    params: { category_ids: payload.categoryIds },
  });

const positionUpdate = async (id, payload) => {
  await axios.put(`/api/admin/articles/${id}/position_update`, payload);
};

const move = async payload => {
  await axios.put("api/admin/articles/move", payload);
};

const generatePdf = () => axios.post("api/admin/articles/report", {});

const download = () =>
  axios.get("api/admin/articles/report/download", { responseType: "blob" });

const articlesApi = {
  fetch,
  show,
  create,
  destroy,
  update,
  versions,
  fetchPublished,
  count,
  positionUpdate,
  move,
  generatePdf,
  download,
};

export default articlesApi;
