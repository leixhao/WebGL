<template>
  <div>
    <el-tooltip class="box-item" effect="dark" placement="bottom-start">
      <div alt style="
                  cursor: pointer;
                  height: 50px;
                  line-height: 50px;
                  color: rgb(255, 255, 255);
                  text-align: center;
                  font-size: 20px;">
        ECM
      </div>
    </el-tooltip>
    <!-- <el-dropdown trigger="click" class="international" @command="handleSelect">
      <span class="sidebar-title" :style="{
        color: variables.sidebarTitle,
      }">
        {{ title }}
        <el-icon color="#606266" :size="15">
          <CaretBottom />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item in appList" :key="item.id" :command="item.appId">
            {{ item.appAbbr }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown> -->
  </div>
</template>

<script setup>
import { getAppList } from "@/api/system/aescapp";
import { regenerate } from "@/api/login";
import variables from "@/assets/styles/variables.module.scss";
import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings';
import { ref, computed } from 'vue'

const settingsStore = useSettingsStore()
const title = ref('');
const appList = ref([])
const from = ref({
  appId: null
})
</script>

<style lang="scss" scoped>
.international {
  height: 50px;
  line-height: 50px;
  color: #fff;
}
</style>
