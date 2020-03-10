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
          <label>邮箱</label>
          <el-input type="email" name="email" v-model="ruleForm.userName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <label>密码</label>
          <el-input type="password" name="password" v-model="ruleForm.password" autocomplete="off"
          minlength="6" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item prop="passwords" v-show="model==='register'">
          <label>重复密码</label>
          <el-input type="text" name="passwords" v-model="ruleForm.password" autocomplete="off"
          minlength="6" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item prop="code">
          <label>验证码</label>
          <el-row :gutter="11">
            <el-col :span="15">
              <el-input type="text" v-model="ruleForm.code" autocomplete="off"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button type="success" class="block">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button type="danger" @click="submitForm('ruleForm')" class="block">提交</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import { stripscript,validateE,validateP,validateC } from '@/utils/validate.js'
export default {
  name: "login",
  data() {
      //验证用户名
    var validateUserName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if(validateE(value)){
          callback(new Error('用户名格式有误'))
      }else {
        callback();
      }
    };
    //验证密码
    var validatePassword = (rule, value, callback) => {
        //调用过滤字符串的方法，过滤特殊字符
        this.ruleForm.password = stripscript(value);//清除文本框中的特殊字符
        value = this.ruleForm.password;//设置值进行判断
        
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validateP(value)) {
        callback(new Error("密码不能为纯数字或字母"));
      } else {
        callback();
      }
    };
    //验证重复密码
    var validatePasswords = (rule, value, callback) => {
        //如果是登录模式提交数据的时候就不验证这一栏
        if(this.model==="login"){ callback();}
        //调用过滤字符串的方法，过滤特殊字符
        this.ruleForm.password = stripscript(value);//清除文本框中的特殊字符
        value = this.ruleForm.password;//设置值进行判断
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != this.ruleForm.password) {
        callback(new Error("重复密码不正确"));
      } else {
        callback();
      }
    };
    //验证验证码
    var validateCode = (rule, value, callback) => {
        //调用过滤字符串的方法，过滤特殊字符
        this.ruleForm.code = stripscript(value);//清除文本框中的特殊字符
        value = this.ruleForm.code;//设置值进行判断
        
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (validateC(value)) {
        callback(new Error("验证码只能为6位的字母或数字"));
      } else {
        callback();
      }
    };
    return {
      menuTab: [
        { txt: "登录", current: true ,type: "login"},
        { txt: "注册", current: false,type: "register"}
      ],
      //登录和注册状态切换，重复密码的显示隐藏,模块值
      model: "login",
      //表单数据模板
      ruleForm: {
        userName: "",
        password: "",
        code: "",
        passwords: ""
      },
      rules: {
        userName: [{ validator: validateUserName, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        passwords: [{ validator: validatePasswords, trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "blur" }]
      }
    };
  },
  methods: {
    toggleCurrent(item) {
      this.menuTab.forEach(ele => {
        ele.current = false;
      });
      item.current = true;
      //更改模块值
      this.model = item.type;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
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