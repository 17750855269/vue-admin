//默认指向运行时（runtime）
import Vue from 'vue';
//相当于import Vue from 'vue/dist/vue.runtime.common.js';
//如果要改成模板模式，需要在vue.config.js中更改vue的alias别名
import App from './App.vue';
import router from './router';
//引入路由守卫
import permit from './router/premit';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//引入vue3.0包
import VueCompositionApi from '@vue/composition-api';

//自定义全局组件
import './icons';
//使用vue3.0api
Vue.use(VueCompositionApi);
Vue.config.productionTip = false
Vue.use(ElementUI);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
