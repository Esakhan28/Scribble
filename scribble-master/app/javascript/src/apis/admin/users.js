import axios from "axios";

const login = () => axios.get("/api/admin/user");

const usersApi = {
  login,
};

export default usersApi;
