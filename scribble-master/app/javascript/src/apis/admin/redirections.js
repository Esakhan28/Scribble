import axios from "axios";

const fetch = () => axios.get("/api/admin/redirections");

const create = async payload => {
  await axios.post("/api/admin/redirections", payload);
};

const update = async (id, payload) => {
  await axios.put(`/api/admin/redirections/${id}`, payload);
};

const destroy = async (id, payload) => {
  await axios.delete(`/api/admin/redirections/${id}`, payload);
};

const redirectionsApi = {
  fetch,
  create,
  update,
  destroy,
};

export default redirectionsApi;
