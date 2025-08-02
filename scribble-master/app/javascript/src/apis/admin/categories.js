import axios from "axios";

const fetch = () => axios.get("/api/admin/categories");

const create = async payload => {
  await axios.post("/api/admin/categories", payload);
};

const update = async (id, payload) => {
  await axios.put(`/api/admin/categories/${id}`, payload);
};

const destroy = async payload => {
  await axios.delete(
    `/api/admin/categories/${payload.id}?new_category_id=${payload.newCategoryId}`
  );
};

const show = id => axios.get(`/api/admin/categories/${id}`);

const positionUpdate = async (id, payload) => {
  await axios.put(`/api/admin/categories/${id}/position_update`, payload);
};

const categoriesApi = {
  fetch,
  create,
  update,
  destroy,
  show,
  positionUpdate,
};

export default categoriesApi;
