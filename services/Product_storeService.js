const { default: httpAxios } = require("./httpAxios");
const Product_storeService = {
  getList: async (data) => {
    return await httpAxios.get("product_store", { params: data });
  },
  getById: async (id) => {
    return await httpAxios.get(`product_store/${id}`);
  },
  update: async (id, data) => {
    return await httpAxios.put(`product_store/${id}`, data);
  },
  create: async (data) => {
    return await httpAxios.post("product_store", data);
  },
  delete: async (id) => {
    return await httpAxios.delete(`product_store/${id}`);
  },
};
export default Product_storeService;
