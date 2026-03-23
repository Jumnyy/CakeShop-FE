const {default: httpAxios} = require('./httpAxios');
const OrderService = {
    getList: async (data) => {
        return await httpAxios.get('order', {params: data});
    },
    getById: async (id) => {
        return await httpAxios.get(`order/${id}`);
    },
    update: async (id, data) => {
        return await httpAxios.put(`order/${id}`, data);
    },
    create: async (data) => {
        return await httpAxios.post('order', data);
    },
    delete: async (id) => {
        return await httpAxios.delete(`order/${id}`);
    }, 
};
export default OrderService;