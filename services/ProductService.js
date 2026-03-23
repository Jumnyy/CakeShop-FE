const { default: httpAxios } = require("./httpAxios");
const ProductService = {
  getList: async (params) => {
    try {
      // params sẽ chứa { category_id: ..., limit: ... }
      const res = await httpAxios.get("products", { params });
      return res; // Trả về data đã qua interceptor
    } catch (err) {
      console.error("ProductService getList error:", err);
      throw err;
    }
  },
  getById: (id) => {
    return httpAxios.get(`/products/${id}`);
  },
  getNew: async () => {
    return await httpAxios.get("products-new");
  },
  create: async (data) => {
    return await httpAxios.post("products", data);
  },
  update: async (id, data) => {
    return await httpAxios.post(`products/${id}`, data);
  },
  delete: async (id) => {
    return await httpAxios.delete(`products/${id}`);
  },
  deleteImage: (id) => httpAxios.delete(`product-images/${id}`),
  getRelated: async (categoryId, excludeId, limit = 4) => {
    return await httpAxios.get("products", {
      params: {
        category_id: categoryId,
        exclude_id: excludeId,
        limit: limit,
      },
    });
  },
  getSaleProducts: () => httpAxios.get("/product-sale"),
  getSale: async () => {
    return await httpAxios.get("product_sale_current");
    // "product_sale_current" là route bạn đặt trong routes/api.php cho hàm get_current_sale()
  },
};
export default ProductService;
