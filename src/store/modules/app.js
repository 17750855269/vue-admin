
import { Login } from "@/api/login"
import { setToken, removeToKen, setUserName, getUserName, removeUserName } from "@/utils/app"
import { removeToken } from "../../utils/app"

const state = {
    isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
    to_Ken: '',
    username: getUserName() || ""
}

const getters = {//类似于computed是计算后的属性
    isCollapse: state => state.isCollapse,
    username: state => state.username
}

const mutations = {
    SET_COLLAPSE(state) {
        state.isCollapse = !state.isCollapse,
            //h5临时存储，长期存储用localStorage
            sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse))
    },
    SET_TOKEN(state, value) {
        state.to_Ken = value
    },
    SET_USERNAME(state, value) {
        state.username = value
    }
}

const actions = {
    //异步
    login(content, requestData) {
        return new Promise((resolve, reject) => {
            //使用接口
            Login(requestData).then(response => {
                console.log(response)
                //获取响应的参数
                let data = response.data.data
                //调用mutations中的方法
                content.commit('SET_TOKEN', data.token);
                content.commit('SET_USERNAME', data.username);
                //将数据存到缓存中
                setToken(data.token);
                setUserName(data.username);
                resolve(response);
            }).catch(error => {
                reject(error);
            })
        })
    },
    //退出
    exit({ commit }) {
        return new Promise((resolve, reject) => {
            removeToken();
            removeUserName();
            commit('SET_TOKEN', '');
            commit('SET_USERNAME', '');
            resolve();
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};