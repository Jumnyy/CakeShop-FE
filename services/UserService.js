const { default: httpAxios } = require("./httpAxios");
const UserService = {
  getList: async (data) => {
    return await httpAxios.get("users", { params: data });
  },
  create: async (data) => {
    return await httpAxios.post("users", data);
  },
  update: async (id, data) => {
    return await httpAxios.put(`users/${id}`, data);
  },
  getById: (id) => {
    return httpAxios.get(`users/${id}`);
  },
  delete: async (id) => {
    return await httpAxios.delete(`users/${id}`);
  },
};
export default UserService;
