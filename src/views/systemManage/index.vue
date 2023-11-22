<template>
    <el-row class="containe">
        <el-row type="flex" justify="center" class="T-1">请选择您要进入的后台应用</el-row>
        <el-row v-if="isSecond" type="flex" justify="center" class="T-2">{{ appAbbr }}</el-row>
        <sub-app v-if="isSecond" />
        <main-app v-if="!isSecond" @select="handleSelect" />
    </el-row>
</template>
<script lang="ts" setup>
import mainApp from './mainApp.vue';
import subApp from './subApp.vue';
import { regenerate } from "@/api/login";
import { ref } from 'vue';
const isSecond = ref(false);
const appAbbr = ref('')
function handleSelect(item:any) {
    appAbbr.value = item.appAbbr;
    regenerate(item.appId).then(() => {
        //this.isSecond = true
        sessionStorage.setItem('title', item.appAbbr)
        sessionStorage.setItem('appId', item.appId)
        window.location.href = window.location.origin + "/aesc/index";
    });
}

</script>
<style scoped lang="scss">
html,
body,
#app {
    height: 100%;
}

.containe {
    width: 100%;
    height: 100%;
    background: #F5F9FA;
    background-image: url(../../assets/images/systemManageBg.png);
    background-size: 688px 516px;
    background-position: right bottom;
    background-repeat: no-repeat;
    overflow: auto;
    text-align: center;

    .T-1 {
        font-size: 32px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.9);
        margin-top: 79px;
        width: 100%;
    }

    .T-2 {
        font-size: 26px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.9);
        margin-top: 16px;
    }

}
</style>