<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>

</template>

<script>
//加载vue3.0依赖
import { reactive,ref,computed } from '@vue/composition-api'
export default {
    name: "svgIcon",
    //子组件获取父组件的值
    // props: ["iconClass","className"],
    props: {
        iconClass: {
            type: String,
            default: "",
        },
        className: {
            type: String,
            default: ""
        }
    },
    setup(props){       
        const msg = ref("haha");
        //计算属性，得出最终结果，并返回，computed监听属性变化
        const iconName = computed(() => `#icon-${props.iconClass}`)
        const svgClass = computed(() => {
            //检查有没有样式，有就添加
            if(props.className){
                return `svg-icon ${props.className}`
            }else{
                return `svg-icon`
            }
        })
        return {
            msg,
            iconName,
            svgClass
        }
    }
}

</script>
<style lang="scss" scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
}
</style>