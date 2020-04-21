
import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
  axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1/'

  axios.interceptors.request.use(function (config) {

    if(config.url != 'login' ){
      const token = localStorage.getItem('token')
      config.headers['Authorization']=token
    }
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });

  Vue.prototype.$http = axios
}

export default MyHttpServer
