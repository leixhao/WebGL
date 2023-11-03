<template>
    <div class="login">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
            <h3 class="title">
                {{ $t("login.title") }}
                <el-tooltip content="语言选择" effect="dark" placement="bottom">
                    <lang-select class="right-menu-item hover-effect" />
                </el-tooltip>
            </h3>
            <!-- <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            type="text"
            auto-complete="off"
            :placeholder="$t('login.username')"
          >
            <svg-icon
              slot="prefix"
              icon-class="user"
              class="el-input__icon input-icon"
            />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            :placeholder="$t('login.password')"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon
              slot="prefix"
              icon-class="password"
              class="el-input__icon input-icon"
            />
          </el-input>
        </el-form-item> -->
            <!-- <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            :placeholder="$t('login.captcha')"
            style="width: 63%"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img"/>
          </div>
        </el-form-item> -->
            <!--      <el-form-item class="login-way">-->
            <!--        <span>{{ $t("login.way") }}：</span>-->
            <!--        <el-radio v-model="loginWay" label="1">{{ $t("login.ad") }}</el-radio>-->
            <!--        <el-radio v-model="loginWay" label="2">{{-->
            <!--          $t("login.common")-->
            <!--        }}</el-radio>-->
            <!--      </el-form-item>-->
            <!-- <el-checkbox
          v-model="loginForm.rememberMe"
          style="margin: 0px 0px 25px 0px"
          >{{ $t("login.remember") }}</el-checkbox
        > -->
            <!-- 选择登录方式 -->
            <!-- <el-tabs type="card" class="ta-c"> -->
            <!-- <el-tab-pane :label="$t('login.QR_Code')"> -->
            <!-- 二维码登录  -->
            <!-- <div
              style="width: 300px; height: 400px; margin: auto"
              id="weChat_div"
            ></div>
          </el-tab-pane> -->
            <!-- <el-tab-pane :label="$t('login.Account_Assword')"> -->
            <div>
                <!-- 账号密码登录 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="输入账号">
                        <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="输入密码"
                        @keyup.enter.native="sendCode">
                        <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                    </el-input>
                </el-form-item>
                <!-- <el-form-item prop="code">
                <el-input
                  v-model="loginForm.code"
                  auto-complete="off"
                  :placeholder="$t('login.captcha')"
                  style="width: 63%"
                  @keyup.enter.native="handleLogin"
                >
                  <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
                </el-input>
                <div class="login-code">
                  <img :src="codeUrl" @click="getCode" class="login-code-img"/>
                </div>
              </el-form-item> -->
                <!--      <el-form-item class="login-way">-->
                <!--        <span>{{ $t("login.way") }}：</span>-->
                <!--        <el-radio v-model="loginWay" label="1">{{ $t("login.ad") }}</el-radio>-->
                <!--        <el-radio v-model="loginWay" label="2">{{-->
                <!--          $t("login.common")-->
                <!--        }}</el-radio>-->
                <!--      </el-form-item>-->
                <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">{{ $t("login.remember")
                }}</el-checkbox>
                <el-form-item style="width: 100%">
                    <el-button :loading="loading" size="medium" type="primary" style="width: 100%"
                        @click.native.prevent="sendCode">
                        <span v-if="!loading">{{ $t("login.logIn") }}</span>
                        <span v-else>{{ $t("login.logining") }}</span>
                    </el-button>
                </el-form-item>
            </div>
            <!-- </el-tab-pane> -->
            <!-- </el-tabs> -->
        </el-form>

        <!--  底部  -->
        <div class="el-login-footer">
            <!-- <span>Copyright © 2018-2021 AESC All Rights Reserved.</span> -->
        </div>
    </div>
</template>

<script setup lang="ts">

import Cookies from 'js-cookie';
import { encrypt, decrypt } from '@/utils/jsencrypt';
import useUserStore from '@/store/modules/user';
import { useRouter } from 'vue-router';
import { FormInstance } from 'element-plus';
import { ref } from 'vue';
import { type } from 'os';
// const {t,locale} = useI18n()
const userStore = useUserStore();
const router = useRouter();
interface LoginForm {
    username: string
    password: string
    rememberMe: boolean
    appId:string
    appType:string
    code:string
    uuid:string
}
const loginForm = ref<LoginForm>({
    username: '',
    password: '',
    rememberMe: false,
    appId: "73eb92cb757143a7850ed24d19f47f76",
    appType: "",
    code: '',
    uuid: '',
});

const loginRules = {
    username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
    password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
    code: [{ required: true, trigger: 'change', message: '请输入验证码' }],
};

const codeUrl = ref('');
const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(true);
// 注册开关
const register = ref(false);
const redirect = ref(undefined);
const loginRef = ref<FormInstance>();

//输入密码
function sendCode() {
    loginRef.value?.validate((valid) => {
        if (valid) {
            loading.value = true;
            if (loginForm.value.rememberMe) {
                Cookies.set("username", loginForm.value.username, {
                    expires: 30,
                });
                Cookies.set("password", encrypt(loginForm.value.password), {
                    expires: 30,
                });
                Cookies.set("rememberMe", this.loginForm.rememberMe, {
                    expires: 30,
                });
            } else {
                Cookies.remove("username");
                Cookies.remove("password");
                Cookies.remove("rememberMe");
            }
            this.$store
                .dispatch("ADLogin", this.loginForm)
                .then(() => {
                    console.log(1);
                    this.$router.push({ path: this.redirect || "/" }).catch(() => { });
                })
                .catch(() => {
                    this.loading = false;
                    // this.getCode();
                });
        }
    });
}

function handleLogin() {
    loginRef.value?.validate(valid => {
        if (valid) {
            loading.value = true;
            // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
            if (loginForm.value.rememberMe) {
                Cookies.set('username', loginForm.value.username, { expires: 30 });
                const enPwd = encrypt(loginForm.value.password);
                if (enPwd) {
                    Cookies.set('password', enPwd, { expires: 30 });
                }
                if (loginForm.value.rememberMe) {
                    Cookies.set('rememberMe', String(loginForm.value.rememberMe), { expires: 30 });
                }
            } else {
                // 否则移除
                Cookies.remove('username');
                Cookies.remove('password');
                Cookies.remove('rememberMe');
            }
            // 调用action的登录方法
            userStore
                .login(loginForm.value)
                .then(() => {
                    router.push({ path: redirect.value || '/' });
                })
                .catch(() => {
                    loading.value = false;
                    // 重新获取验证码
                    
                });
        }
    });
}


function getCookie() {
    const username = Cookies.get('username');
    const password = Cookies.get('password');
    const rememberMe = Cookies.get('rememberMe');
    loginForm.value = {
        username: username === undefined ? loginForm.value.username : username,
        password: password === undefined ? loginForm.value.password : decrypt(password) || '',
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
    };
}

getCode();
getCookie();
</script>

<style lang="scss" scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url('../assets/images/login-background.jpg');
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
