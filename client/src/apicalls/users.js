const { axiosInstance } = require('.');

export const RegisterUser = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/users/register', payload); // fixed
        return response.data;
    } catch (error) {
        return error.response;
    }
};

export const LoginUser = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/users/login', payload);
        return response.data;
    } catch (error) {
        return error.response;
    }
};
export const GetCurrentUser=async()=>{
    try {
        const response=await axiosInstance.get('/api/users/current')
        return response.data
    } catch (error) {
        return error.response
    }
}
