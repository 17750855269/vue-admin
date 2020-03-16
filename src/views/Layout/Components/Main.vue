<template>
  <div id="main-wrap">
    <div class="main-content">
      <div class="content">
        <!-- 放子路由控制台的内容随着导航栏的改变而改变，所以不能直接添加内容 -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api"
export default {
  name: "layoutMain",
  setup(props,{ root }){
    
  }
};
</script>
<style lang="scss" scoped>
// 不写lang$就报错
@import "../../../styles/config.scss";
#main-wrap {
  height: 100vh;
  // position: fixed;
  // left: $navMenu;
  // top: 75px;
  // right: 0;
  // bottom: 0;
  // border: 30px solid #f6f6f6;
  // border-bottom: none;
  // border-right: none;
  // background-color: #fff;
}
.main-content {
  width: 100%;
  height: 100%;
  padding-top: $layoutHeader + 30;
  padding-left: $navMenu + 30;
  padding-right: 30px;
  @include webkit(box-sizing, border-box);
  @include webkit(transition,all .3s ease 0s);
}
.content {
  width: 100%;
  height: 100%;
  padding-top: 30px;
  padding-left: 30px;
  @include webkit(box-sizing, border-box);
  background-color: #fff;
}
.open {
  .main-content {
    padding-left: $navMenu + 30;
  }
}
.close {
  .main-content {
    padding-left: $navMenuMin + 30;
  }
}
</style>