const {default: httpAxios} = require('./httpAxios');
const ContactService = {
    getList: async (data) => {
        return await httpAxios.get('contact', {params: data});
    },
    create: async (data) => {
        return await httpAxios.post('contact', data);
    },
    update: async (id, data) => {
        return await httpAxios.put(`contact/${id}`, data);
    },
    getById: (id) => {
        return httpAxios.get(`contact/${id}`);
    },
    delete: async (id) => {
        return await httpAxios.delete(`contact/${id}`);
    },
};
export default ContactService;