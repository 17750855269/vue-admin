<template>
  <div id="nav-wrap">
    <h1 class="logo"><img src="../../../assets/logo.png" alt=""></h1>
     <el-menu
      :collapse="isCollapse"
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#fff"
      :router="indexPath">
      <!-- v-for和v-if不要写在一起，因为v-for优先级高 -->
      <template v-for="(item,index) in routers">
      <!-- index要为string类型 -->
      <el-submenu  v-if="!item.hidden" :key="index" :index="index+''">
        <!-- 一级菜单 -->
        <template slot="title">
          <!-- 引入全局小图标组件 -->
          <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon"></svg-icon>
          <span>{{ item.meta.name }}</span>
        </template>
          <!-- 子级菜单 -->
          <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="subItem.path">{{ subItem.meta.name }}</el-menu-item>
      </el-submenu>
      </template>
    </el-menu>
    
  </div>
</template>

<script>
//导入vue3.0的语法库
import { reactive,ref,isRef,toRef, computed } from "@vue/composition-api"
export default {
  // name: "navMenu",
  setup(props ,{ root }){
    //是否是索引值代替路径
    const indexPath = ref(true)
    //导航栏是否折叠
    // const isCollapse = ref(false)
    /**
     * computed 监听
     */
    const isCollapse = computed(() => {
      //花括号可省略，return也不要
      return root.$store.state.app.isCollapse
    })
    //获取路由
    var routers = root.$router.options.routes

    //表单的默认方法
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath);
    }
    const handleClose = (key, keyPath) => {
        console.log(key, keyPath);
      }
    return {
      handleOpen,
      handleClose,
      routers,
      indexPath,
      isCollapse
    }
  }
 
}

</script>
<style lang="scss" scoped>
// 导入样式
@import "../../../styles/config.scss";
  #nav-wrap {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    background-color: #344a5f;
    //引入定义的样式函数
    @include webkit(transition,all .3s ease 0s);
    //属性 时长 线性 延迟
    // transition: all 1s ease 0s;
    svg {
      font-size: 20px;
      margin-right: 10px;
    }
  }
  .logo {
    width: 84px;
    height: 78px;
    margin: 30px auto 0;
    @include webkit(transition,all .3s ease 0s);
  }
  .open {
    #nav-wrap { width: $navMenu; }
  }
  .close {
    #nav-wrap { 
      width: $navMenuMin; 
      .logo img {
        width: 70%;
      }
    }
    
  }
</style>