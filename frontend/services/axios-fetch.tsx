import axios, { AxiosError } from 'axios'
import Toast from 'react-native-toast-message';

export let Axios = axios.create({
    baseURL: "http://localhost:8000/",
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
    },
    proxy: false,
    validateStatus: (status) => {
        return status >= 200 && status < 220;
    }
});

Axios.interceptors.request.use((config) => {
    if (config.url?.includes('?')){
        return config
    }
    // @ts-ignore
    if (config.url[config.url.length-1] !== '/') {
      config.url += '/';
    }
    return config;
});

Axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response
}, err => {
    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                err.message = 'Request Error (400)';
                break
            case 401:
                err.message = 'Unauthorized, please log in again (401)';
                break
            case 403:
                err.message = 'Access denied (403)'
                break
            case 404:
                err.message = 'Request error (404)';
                break
            case 408:
                err.message = 'Request timeout (408)'
                break
            case 500:
                err.message = 'Server error (500)'
                break
            case 501:
                err.message = 'Service not implemented (501)';
                break
            case 502:
                err.message = 'Network error (502)'
                break
            case 503:
                err.message = 'Service unavailable (503)';
                break
            case 504:
                err.message = 'Network timeout (504)'
                break
            case 505:
                err.message = 'HTTP version is not supported (505)';
                break
            default:
                err.message = `Connection error (${err.response.status})...`;
        }
        if (err.response.data['detail']) err.message = err.response.data['detail'];
        else if (err.response.data['error']) err.message = err.response.data['error'];
    } else {
        err.message = 'Connection failure...';
    }
    return Promise.reject(err)
});


export async function axiosPost(url: string, data: any) {
    try {
        const resp = await Axios.post(url, data);
        return resp;
    } catch (error) {
        Toast.show({
            type: 'error',
            text1: (error as any).message,
        });
        return undefined;
    }
}