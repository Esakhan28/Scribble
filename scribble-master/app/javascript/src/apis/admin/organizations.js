import axios from "axios";

const fetch = () => axios.get("/api/admin/organization");

const update = async payload => {
  await axios.put("/api/admin/organization", { organization: payload });
};

const login = payload => axios.post("/api/admin/organization", payload);

const organizationsApi = {
  fetch,
  update,
  login,
};

export default organizationsApi;
