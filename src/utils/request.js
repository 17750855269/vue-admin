import axios from 'axios'
//全局引用只针对于vue文件，js文件要使用ui插件的话只能单独引用
import { Message } from 'element-ui';

//定义一个常规的地址
const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/devApi';
//创建axios，赋值给变量
const service = axios.create({
  //别人的地址访问不到,因为跨域了
  baseURL: BASEURL,
  //设定多少秒算请求超时
  timeout: 15000
})

// 添加请求拦截器
service.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  //在请求头添加参数，拿给后端使用,Tokey.userId,sui
  
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  console.log(response);
  let data = response.data;

  //如果data.resCode不为0就说明请求有问题
  if(data.resCode !== 0){
    // UI插件，错误提示
    Message.error(data.message);
    return Promise.reject(data);
  }else {
    return response;
  }

  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default service;