<template>
  <div id="header-wrap">
    <div class="pull-left header-icon" @click="navMenuState"><svg-icon iconClass="menu" className="menu" /></div>
    <div class="pull-right">
      <div class="user-info pull-left">
        <img src="../../../assets/main.png" alt="">
        {{ username }}
      </div>
      <div class="header-icon pull-left" @click="exit">
        <svg-icon iconClass="exit" className="exit" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref,reactive,computed } from '@vue/composition-api'
export default {
  name: 'navHeader',
  setup(props,{ root }){
    const navMenuState = () => {
      // return root.$store.dispatch("setMenuStatus")
     return root.$store.commit('app/SET_COLLAPSE')

    }
    const username = computed(() => root.$store.state.app.username);
    //退出
    const exit = () => {
      //删除状态在状态管理，路由跳转到组件中判断
      root.$store.dispatch("app/exit")
        .then(response => {
          root.$router.push({
            name: "Login"
          });
        })
    }
    return {
      navMenuState,
      username,
      exit
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#header-wrap {
  position: fixed;
  top: 0;
  left: $navMenu;
  right: 0;
  height: 75px;
  line-height: 75px;
  background-color: #fff;
  //水平 垂直 模糊距离 阴影大小 颜色 阴影方向
  @include webkit( box-shadow,0 3px 16px 0 rgba(0, 0, 0, 0.1));
  @include webkit(transition,all .3s ease 0s);
}
.open {
  #header-wrap { left: $navMenu; }
}
.close {
  #header-wrap { left: $navMenuMin; }
}
.header-icon {
  padding: 0 32px;
  svg {
    margin-bottom: -8px;
    font-size: 25px;
    cursor: pointer;
  }
}
.user-info {
  height: 100%;
  padding: 0 32px;
  border-right: 1px solid #ededed;
  +.header-icon {
    padding: 0 28px;
  }
  img {
  }
}
</style>