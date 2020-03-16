import router from "./index"
import store from "../store/index"

import { getToken, removeToken, removeUserName } from "../utils/app"

const whiteRouter = ["/login"]

//路由守卫
router.beforeEach((to,from,next) => {
    //判断缓存是否存在
    if(getToken()){
        //路由动态添加，分配菜单，每个角色分配不同的菜单
        console.log('存在');
        //用户退出或返回登录页的时候，就要清空缓存，防止页面来回切换
        if(to.path === '/login'){
            //清掉缓存内容
            removeToken();
            removeUserName();
            //清掉状态管理器中内容,也就是store中的内容
            store.commit("app/SET_TOKEN","");
            store.commit("app/SET_USERNAME","");
            next();
        }else{
            next();
        }
    }else{
        console.log('不存在');
        console.log(whiteRouter.indexOf(to.path));
        if(whiteRouter.indexOf(to.path) !== -1){
            next();
        }else{
            next("/login");
        }
    }
})