import axios from "axios";

const fetch = () => axios.get("/api/public/categories");

const categoriesApi = {
  fetch,
};

export default categoriesApi;
