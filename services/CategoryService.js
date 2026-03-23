const { default: httpAxios } = require("./httpAxios");
const CategoryService = {
  getList: async (data) => {
    return await httpAxios.get("categories", { params: data });
  },
  getById: (id) => {
    return httpAxios.get(`/categories/${id}`);
  },
  create: async (data) => {
    return await httpAxios.post("categories", data);
  },
  update: async (id, data) => {
    return await httpAxios.post(`categories/${id}`, data);
  },
  delete: async (id) => {
    return await httpAxios.delete(`categories/${id}`);
  },
  getProductsBySlug: (slug) => {
    return httpAxios.get(`/categories/${slug}/products`);
  },
};
export default CategoryService;
