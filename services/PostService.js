const { default: httpAxios } = require("./httpAxios");
const PostService = {
  getList: async (data) => {
    return await httpAxios.get("post", { params: data });
  },
  create: async (data) => {
    return await httpAxios.post("post", data);
  },
  update: async (id, data) => {
    return await httpAxios.post(`post/${id}`, data);
  },
  getById: (id) => {
    return httpAxios.get(`post/${id}`);
  },
  delete: async (id) => {
    return await httpAxios.delete(`post/${id}`);
  },
};

export default PostService;
