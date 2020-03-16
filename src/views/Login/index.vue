<template>
  <div class="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="item in menuTab"
          :key="item.id"
          :class="{'current': item.current}"
          @click="toggleCurrent(item)"
        >{{ item.txt }}</li>
      </ul>
      <!-- 表单模板 -->
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="login-form">
        <el-form-item prop="userName">
          <label for="userName">邮箱</label>
          <el-input type="email" id="userName" v-model="ruleForm.userName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <label for="password">密码</label>
          <el-input
            type="password"
            id="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="passwords" v-show="model==='register'">
          <label for="passwords">重复密码</label>
          <el-input
            type="password"
            id="passwords"
            v-model="ruleForm.passwords"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code">
          <label for="code">验证码</label>
          <el-row :gutter="11">
            <el-col :span="15">
              <el-input id="code" type="text" v-model="ruleForm.code" autocomplete="off"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                class="block"
                @click="getSms()"
                :disabled="codeButton.status"
              >{{ codeButton.context }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('ruleForm')"
            class="block"
            :disabled="loginButtonStatus"
          >{{ model === "login" ? "登录" : "注册"}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import sha1 from "js-sha1";
import { GetSms, Register, Login } from "@/api/login";
import { reactive, ref, onMounted } from "@vue/composition-api";
import {
  stripscript,
  validateE,
  validateP,
  validateC
} from "@/utils/validate.js";
export default {
  name: "login",

  //两个参数，一个是属性，一个相当于$this
  setup(props, { refs, root }) {
    //验证用户名
    let validateUserName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateE(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback();
      }
    };
    //验证密码
    let validatePassword = (rule, value, callback) => {
      //调用过滤字符串的方法，过滤特殊字符
      ruleForm.password = stripscript(value); //清除文本框中的特殊字符
      value = ruleForm.password; //设置值进行判断

      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validateP(value)) {
        callback(new Error("密码不能为纯数字或字母"));
      } else {
        callback();
      }
    };
    //验证重复密码
    let validatePasswords = (rule, value, callback) => {
      //如果是登录模式提交数据的时候就不验证这一栏
      if (model.value === "login") {
        callback();
      }
      //调用过滤字符串的方法，过滤特殊字符
      ruleForm.passwords = stripscript(value); //清除文本框中的特殊字符
      value = ruleForm.passwords; //设置值进行判断
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != ruleForm.password) {
        callback(new Error("重复密码不正确"));
      } else {
        callback();
      }
    };
    //验证验证码
    let validateCode = (rule, value, callback) => {
      //调用过滤字符串的方法，过滤特殊字符
      ruleForm.code = stripscript(value); //清除文本框中的特殊字符
      value = ruleForm.code; //设置值进行判断

      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (validateC(value)) {
        callback(new Error("验证码只能为6位的字母或数字"));
      } else {
        callback();
      }
    };
    //这里放置data数据，生命周期，自定义函数
    //声明数据
    //reactive定义对象
    const menuTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" }
    ]);
    //显示按钮禁用状态
    const loginButtonStatus = ref(true);

    //获取验证码禁用状态
    // const codeButtonStatus = ref(false);
    //定义验证码按钮的文本内容
    // const codeButtonContext = ref("获取验证码");
    //上面两个都是处理按钮所以可以提取出来作为对象，vue3.0声明对象的方式
    const codeButton = reactive({
      status: false,
      context: "获取验证码"
    });

    //定时器的ID
    const timer = ref();
    //登录和注册状态切换，重复密码的显示隐藏,模块值
    const model = ref("login");
    //ref数据需要通过value才能获取值设置值
    // console.log(model.value)
    // console.log(isRef(model)? '是基础数据' : '是对象类型')

    //表单数据模板
    const ruleForm = reactive({
      userName: "",
      password: "",
      code: "",
      passwords: ""
    });

    //验证表单的规则
    const rules = reactive({
      userName: [{ validator: validateUserName, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      passwords: [{ validator: validatePasswords, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }]
    });

    //声明函数
    const toggleCurrent = item => {
      menuTab.forEach(ele => {
        ele.current = false;
      });
      item.current = true;
      //更改模块值
      model.value = item.type;
      //重置表单
      resetFormData();
      //重置验证码
      clearCountDown();
    };
    /**
     * 把重置表单的方法提取出来
     */
    const resetFormData = () => {
      refs.ruleForm.resetFields();
    };
    /**
     * 更新按钮的状态，传两个参数不如传一个对象
     */
    const updateButtonStatus = params => {
      codeButton.status = params.status;
      codeButton.context = params.context;
    };
    /**
     * 登录
     */
    const login = () => {
      let requestData = {
        username: ruleForm.userName,
        password: ruleForm.password,
        code: ruleForm.code
      };
      root.$store.dispatch("app/login",requestData)
        .then(response => {
          //登录成功
          console.log("登录成功");
          console.log(response);
          //页面跳转
          root.$router.push({name: 'Console'})
        })
        .catch(error => {
          //登录失败
          console.log(error);
        });
      
      // Login(requestData)
      //   .then(response => {
      //     //登录成功
      //     console.log("登录成功");
      //     console.log(response);
      //     //页面跳转
      //     root.$router.push({name: 'Console'})
      //   })
      //   .catch(error => {
      //     //登录失败
      //     console.log(requestData);
      //   });
    };
    /**
     * 注册
     */
    const register = () => {
      let requestData = {
        username: ruleForm.userName,
        password: ruleForm.password,
        code: ruleForm.code,
        module: "register"
      };
      //注册接口
      Register(requestData)
        .then(response => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          //注册成功，返回登录界面
          toggleCurrent(menuTab[0]);
          clearCountDown();
        })
        .catch(error => {
          //注册失败后的代码
        });
    };

    //提交表单
    const submitForm = formName => {
      //context.refs使用解构直接将refs提取出来
      refs[formName].validate(valid => {
        //表单验证通过
        if (valid) {
          //如果是登录就直接登录，如果是注册就提交注册信息
          if (model.value === "login") {
            login();
          } else {
            register();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };

    //获取验证码
    const getSms = () => {
      //判断用户名密码是否输入,前端做这一步就不会请求接口，节省资源
      if (ruleForm.userName == "") {
        root.$message.error("邮箱不能为空");
        return false;
      }
      //校验邮箱合法性
      if (validateE(ruleForm.userName)) {
        root.$message.error("邮箱格式有误，请重新输入");
        return false;
      }

      //禁用获取验证码
      // codeButtonStatus.value = true;
      //更改获取验证码的内容
      // codeButtonContext.value = "发送中";
      updateButtonStatus({
        status: true,
        context: "发送中"
      });
      // codeButton.status = true;
      // codeButton.context = "发送中";
      //请求参数
      let requestData = {
        username: ruleForm.userName,
        module: model.value
      };

      //模拟服务端请求，验证码延迟
      setTimeout(
        GetSms(requestData)
          .then(response => {
            let data = response.data;
            //弹出成功提示框
            root.$message({
              message: data.message,
              type: "success"
            });
            //当发送完验证码后，显示提交按钮
            loginButtonStatus.value = false;
            //进行验证码倒计时
            countDown(60);
          })
          .catch(error => {
            console.log(error);
          }),
        3000
      );
      //调用请求获取验证码的接口的方法
    };

    /**
     * 倒计时
     */
    const countDown = number => {
      //判断定时器是否存在，存在则清除
      if (timer.value) {
        clearInterval(timer.value);
      }
      //bug60和0看不见
      let time = number;
      timer.value = setInterval(() => {
        time--;
        if (time === 0) {
          // codeButton.status = false;
          // codeButton.context = `再次获取`;
          updateButtonStatus({
            status: false,
            context: "再次获取"
          });
          //清除计时器
          clearInterval(timer.value);
        } else {
          codeButton.context = `倒计时${time}秒`; //es5 '倒计时'+ time + '秒'
        }
      }, 1000);
    };
    /**
     * 点击注册后清除计时器
     */
    const clearCountDown = () => {
      // codeButton.status = false;
      // codeButton.context = "获取验证码";
      updateButtonStatus({
        status: false,
        context: "获取验证码"
        });
      clearInterval(timer.value);
    };
    //挂载完成后调用
    onMounted(() => {});

    return {
      menuTab,
      model,
      ruleForm,
      rules,
      loginButtonStatus,
      // codeButtonStatus,
      // codeButtonContext,
      codeButton,
      toggleCurrent,
      submitForm,
      getSms
    };
  }
};
</script>
<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100vh;
  background-color: #344a5f;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  width: 220px;
  margin: 0 auto;
  list-style: none;
  li {
    display: inline-block;
    width: 90px;
    height: 30px;
    line-height: 30px;
    margin-right: 15px;
    font-size: 14px;
    border-radius: 2px;
    color: #fff;
    text-align: center;
    cursor: pointer;
  }
  .current {
    background-color: #2f4255;
  }
}
.login-form {
  label {
    display: block;
    font-size: 14px;
    color: #fff;
  }
  .block {
    display: block;
    width: 100%;
  }
}
</style>