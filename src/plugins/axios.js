import axios from "axios";
import API_URL from "../config";
import store from "./store"

axios.defaults.baseURL = API_URL;
axios.interceptors.request.use(function (request) {
    //delete axios.defaults.headers.common['Authorization']
    axios.defaults.headers.common['Content-Type'] = 'application/json'
    const state = store.getState()
    const token = state.data.token
    // console.log(token)
    if (token)
        request.headers.common['Authorization'] = 'Bearer ' + token

    return request;
}, function (error) {
    return Promise.reject(error);
});

