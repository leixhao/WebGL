<template>
  <el-dialog v-model="open" append-to-body>
    <div class="matrix-profile-content">
      <div class="profile-header">
        <div class="profile-left">
          <img src="@/assets/images/profile.jpg" width="70" alt="dark" />
        </div>
        <div class="profile-right">
          <div class="profile-text">EACH-WI-PS-0356,RevA0 组合式空调设施自主性维护检查说明</div>
          <div><span class="profile-name">San.Zhang</span><span class="profile-time">2023/08/21 15:26:30 CST</span></div>
        </div>
      </div>
      <div class="profile-content">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="Properties" name="first">对象属性</el-tab-pane>
          <el-tab-pane label="Relations" name="second">相关变更</el-tab-pane>
          <el-tab-pane label="Contents/Attachments" name="third">关联文档</el-tab-pane>
          <el-tab-pane label="Change Logs" name="fourth">
            <el-steps :space="200" :active="1" direction="vertical" class="profile-steps">
              <el-step title="Step 1" :icon="Edit">
                <template #icon>
                  <div class="icon-content">
                    <img src="@/assets/images/profile.jpg" width="70" alt="dark" />
                    <img src="@/assets/images/profile.jpg" width="70" alt="" class="type-icon">
                  </div>
                </template>
                <template #title>
                  这是内容
                </template>
                <template #description>
                  文案
                </template>
              </el-step>
              <el-step title="Step 2" :icon="UploadFilled" />
              <el-step title="Step 3" :icon="Picture" />
            </el-steps>
          </el-tab-pane>
          <el-tab-pane label="Revision" name="fifth">所有版本</el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ComponentInternalInstance, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { Edit, Picture, UploadFilled } from '@element-plus/icons-vue'
import { useI18n } from "vue-i18n";
const { t } = useI18n()

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const ruleFormRef = ref<FormInstance>()
const queryForm = ref<FormInstance>()
let open = ref(false)
let activeName = ref('first')


function toogleShow() {
  open.value = !open.value
}
function handleClick() {

}
defineExpose({
  toogleShow,
});
</script>
<style scoped lang="scss">
.matrix-profile-content {
  padding: 0 10px;

  .profile-header {
    display: flex;

    .profile-left {
      margin-right: 70px;

      img {
        border-radius: 10px;
      }
    }

    .profile-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 25px;

      .profile-text {
        font-weight: 600;
        font-family: system-ui;
        font-size: 15px;
      }

      .profile-name {
        display: inline-block;
        font-weight: 500;
        margin-right: 10px;
      }

      .profile-time {
        opacity: .7;
      }
    }
  }

  .profile-content {
    padding: 10px;

    .profile-steps {
      padding: 0 20px;

      .icon-content {
        position: relative;

        .type-icon {
          position: absolute;
          top: 0;
          left: -20px
        }

      }
    }
  }
}
</style>