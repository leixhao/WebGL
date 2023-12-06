<template>
  <div class="login">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">
        {{ t("login.title") }}

        <el-tooltip content="语言选择" effect="dark" placement="bottom">
          <lang-select class="right-menu-item hover-effect" />
        </el-tooltip>
      </h3>
      <div>
        <!-- 账号密码登录 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" auto-complete="off" :placeholder="t('login.username')">
            <template #prefix>
              <svg-icon icon-class="user" class="el-input__icon input-icon" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" auto-complete="off" :placeholder="t('login.password')"
            @keyup.enter="handleLogin">
            <template #prefix>
              <svg-icon icon-class="password" class="el-input__icon input-icon" />
            </template>
          </el-input>
        </el-form-item>
        <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">{{ t("login.remember")
        }}</el-checkbox>
        <el-form-item style="width: 100%">
          <el-button :loading="loading" size="default" type="primary" style="width: 100%" @click.prevent="handleLogin">
            <span v-if="!loading">{{ t("login.logIn") }}</span>
            <span v-else>{{ t("login.logining") }}</span>
          </el-button>
        </el-form-item>
      </div>
    </el-form>

    <!--  底部  -->
    <div class="el-login-footer">
      <!-- <span>Copyright © 2018-2021 AESC All Rights Reserved.</span> -->
    </div>
  </div>
</template>
<script setup>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import useUserStore from '@/store/modules/user'
import useAppStore from '@/store/modules/app'
// import LangSelect from "@/components/LangSelect";
import { toRaw, ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router';
// import { FormInstance } from 'element-plus';
import { useI18n } from "vue-i18n";
const { t } = useI18n()

const userStore = useUserStore()
const router = useRouter();
const { proxy } = getCurrentInstance();

const loginForm = ref({
  username: "guang.tan",
  password: "13584149705Tg@",
  appId: '2f64e1face5049d787a4bc9a45d0957c',
  rememberMe: false,
  code: "",
  uuid: ""
});

const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }]
};

const codeUrl = ref("");
const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(true);
// 注册开关
const register = ref(false);
const redirect = ref(undefined);

function handleLogin() {
  proxy.$refs.loginRef.validate(valid => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set("username", loginForm.value.username, { expires: 30 });
        Cookies.set("password", encrypt(loginForm.value.password), { expires: 30 });
        Cookies.set("rememberMe", loginForm.value.rememberMe, { expires: 30 });
      } else {
        // 否则移除
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      // 调用action的登录方法
      console.log(toRaw(loginForm.value))
      // debugger
      userStore.ADlogin(loginForm.value).then(() => {
        router.push({ path: redirect.value || "/ecm/index" });
      }).catch(() => {
        loading.value = false;
        // 重新获取验证码
        if (captchaEnabled.value) {
          getCode();
        }
      });
    }
  });
}

function showWXQRCode() {
  // console.log(this.$store.getters.language)
  var wwLogin = new WwLogin({
    //注意：从wwLogin-1.2.5.js开始需要使用new WwLogin进行实例化
    id: "weChat_div",
    appid: "ww05bd1e6d1a6acb58", //"企业微信的CorpID，在企业微信管理端查看",
    agentid: "1000010", //"授权方的网页应用ID，在具体的网页应用中查看",
    redirect_uri: encodeURIComponent(
      window.location.origin + "/aesc/login"
    ), //重定向地址，需要进行UrlEncode
    href: "", //自定义样式链接，企业可根据实际需求覆盖默认样式。
    lang: useAppStore().language,
  });
}
function getCode() {
  getCodeImg().then(res => {
    captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled;
    if (captchaEnabled.value) {
      codeUrl.value = "data:image/gif;base64," + res.img;
      loginForm.value.uuid = res.uuid;
    }
  });
}

function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
    appId: "2f64e1face5049d787a4bc9a45d0957c"// 不同应用的appID不同
  };
  sessionStorage.setItem('appId', loginForm.value.appId)
}

// getCode();
getCookie();
</script>

<style lang='scss' scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 40px;

    input {
      height: 40px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
