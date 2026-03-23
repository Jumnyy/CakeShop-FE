const {default: httpAxios} = require('./httpAxios');
const BannerService = {
    getList: async (data) => {
        return await httpAxios.get('banner', {params: data});
    },
    create: async (data) => {
        return await httpAxios.post('banner', data);
    },
    update: async (id, data) => {
        return await httpAxios.post(`banner/${id}`, data);
    },
    getById: (id) => {
        return httpAxios.get(`banner/${id}`);
    },
    delete: async (id) => {
        return await httpAxios.delete(`banner/${id}`);
    },
    
};
export default BannerService;