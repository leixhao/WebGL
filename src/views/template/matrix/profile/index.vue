<template>
  <el-dialog v-model="open" append-to-body>
    <div class="matrix-profile-content">
      <div class="profile-header">
        <div class="profile-left">
          <img src="@/assets/images/profile.jpg" width="70" alt="dark" />
        </div>
        <div class="profile-right">
          <div class="profile-text">
            EACH-WI-PS-0356,RevA0 组合式空调设施自主性维护检查说明
          </div>
          <div>
            <span class="profile-name">San.Zhang</span
            ><span class="profile-time">2023/08/21 15:26:30 CST</span>
          </div>
        </div>
      </div>
      <div class="profile-content">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="Properties" name="first">对象属性</el-tab-pane>
          <el-tab-pane label="Relations" name="second">相关变更</el-tab-pane>
          <el-tab-pane label="Contents/Attachments" name="third">关联文档</el-tab-pane>
          <el-tab-pane label="Change Logs" name="fourth">
            <div class="sort">
              <el-tooltip content="按时间排序" placement="bottom" effect="light">
                <el-icon @click="handleSort"><Sort /></el-icon>
              </el-tooltip>
            </div>
            <el-steps direction="vertical" class="profile-steps">
              <el-step v-for="(v, i) in stepsList" :key="i">
                <template #icon>
                  <div class="icon-content">
                    <el-icon class="type-icon"><DocumentAdd /></el-icon>
                    <img src="@/assets/images/profile.jpg" alt="" />
                  </div>
                </template>
                <template #title>
                  <span class="name">{{ v.CreateUser }}</span>
                  {{ v.title }}
                </template>
                <template #description>
                  <div class="row">
                    <div class="subTitle">{{ v.subTitle }}</div>
                    <div class="createTime">{{ v.createTime }}</div>
                  </div>
                </template>
              </el-step>
            </el-steps>
          </el-tab-pane>
          <el-tab-pane label="Revision" name="fifth">所有版本</el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ComponentInternalInstance, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { Edit, Picture, UploadFilled } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const ruleFormRef = ref<FormInstance>();
const queryForm = ref<FormInstance>();
let open = ref(false);
let activeName = ref("first");
const stepsList = ref([
  {
    icon: "",
    avatar: "",
    CreateUser: "san.zhang",
    title: "创建 文档",
    subTitle: "创建【AESCGL-6.7.1-FR-01,文档名称】",
    createTime: "2023/08/21 15:26:10",
  },
  {
    icon: "",
    avatar: "",
    CreateUser: "si.li",
    title: "编辑 文档",
    subTitle:
      '编辑【AESCGL-6.7.1-FR-01,文档名称】 from "文档名称" to "Change Feasibility Assessement List"',
    createTime: "2023/09/11 08:23:53",
  },
  {
    icon: "",
    avatar: "",
    CreateUser: "wu.wang",
    title: "编辑 文档",
    subTitle:
      '编辑【AESCGL-6.7.1-FR-01,文档名称】 from "文档名称" to "Change Feasibility Assessement List"',
    createTime: "2023/11/09 12:43:23",
  },

  {
    icon: "",
    avatar: "",
    CreateUser: "wu.wang",
    title: "编辑 文档",
    subTitle:
      '编辑【AESCGL-6.7.1-FR-01,文档名称】 from "文档名称" to "Change Feasibility Assessement List"',
    createTime: "2023/11/09 12:43:23",
  },
]);
function toogleShow() {
  open.value = !open.value;
}
function handleSort(){
  stepsList.value=stepsList.value.reverse();
}
function handleClick() {}
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
        opacity: 0.7;
      }
    }
  }
  .sort {
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-end;
    .el-icon {
      font-size: 18px;
      color: #656565;
      cursor: pointer;
    }
  }
  .profile-content {
    padding: 10px;

    .profile-steps {
      padding: 0 30px;
      :deep(.el-step__icon) {
        height: 28px;
      }
      .icon-content {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        .type-icon {
          // margin-right: 10px;
          position: absolute;
          left:-25px;
          top:4px;
          z-index: 2;
          font-size: 20px;
          color: #999;
        }
        img {
          height: 30px;
          border-radius: 50%;
          max-width: none;
        }
        // .type-icon {
        //   position: absolute;
        //   font-size: 18px;
        //   top:3px;
        //   left: -20px
        // }
      }
    }
    :deep(.el-step__description) {
      padding-right: 0%;
    }
    .name {
      color: #3eacef;
    }
    .row {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      font-size: 13px;
      margin: 15px 0;
      .subTitle {
        flex: 1;
      }
      .createTime {
        width: 120px;
      }
    }
  }
}
</style>
