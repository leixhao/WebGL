<template>
  <div>
    <el-dropdown trigger="click" class="international" @command="handleSelect">
      <span class="sidebar-title" :style="{
        color: variables.sidebarTitle,
      }">
        {{ title }}
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item in appList" :key="item.id" :command="item.appId">
            {{ item.appAbbr }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-icon color="#606266" :size="15" style="vertical-align: middle;">
      <CaretBottom />
    </el-icon>
  </div>
</template>

<script setup>
import { getAppList } from "@/api/system/aescapp";
import { regenerate } from "@/api/login";
import variables from "@/assets/styles/variables.module.scss";
import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'

const settingsStore = useSettingsStore()
const title = ref('');
const appList = ref([])
const from = ref({
  appId: null
})
const sideTheme = computed(() => settingsStore.sideTheme);
function handleSelect(value) {
  console.log(value)
  regenerate(value).then((response) => {
    appList.value.forEach((el) => {
      if (el.appId == value) {
        title.value = el.appAbbr;
        sessionStorage.setItem('title', el.appAbbr)
      }
    });
    window.location.href = window.location.origin + "/aesc/index";
  });
}
function queryAppList() {
  appList.value = []; //任务大类字典
  getAppList().then((response) => {
    console.log(response)
    appList.value = response.data;
    let val = sessionStorage.getItem('appId');
    title.value = sessionStorage.getItem('title') || appList.value.find(item => item.appId == val).appAbbr
  });
}
queryAppList();
</script>

<style lang="scss" scoped>
.international {
  height: 50px;
  line-height: 50px;
  color: #fff;
}
</style>
