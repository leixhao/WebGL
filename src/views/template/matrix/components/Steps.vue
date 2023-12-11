<template>
  <div class="Steps-Page">
    <div class="sort">
      <el-tooltip content="按时间排序" placement="bottom" effect="light"  v-if="stepsList.length!=0">
        <el-icon @click="handleSort"><Sort /></el-icon>
      </el-tooltip>
    </div>
    <el-steps direction="vertical" class="profile-steps">
      <el-step v-for="(v, i) in stepsList" :key="i">
        <template #icon>
          <div class="icon-content" @click="handleUser(v)">
            <el-icon class="type-icon">
              <DocumentAdd v-if="v.changeType == '2'" />
              <Paperclip v-else />
            </el-icon>
            <img src="@/assets/images/profile.jpg" alt="" />
          </div>
        </template>
        <template #title>
          <span class="name">{{ v.createByName }}</span>
          {{ v.changeType == "2" ? "创建了文档" : "编辑了文档" }}
        </template>
        <template #description>
          <div class="row">
            <div class="subTitle">{{ v.changeContent }}</div>
            <div class="createTime">
              {{ moment(v.updateTime).format("YYYY-MM-DD HH:ss:mm") }}
            </div>
          </div>
        </template>
      </el-step>
    </el-steps>
    <div class="notData" v-if="stepsList.length==0">暂无数据</div>
  </div>
</template>

<script lang="ts" setup>
import { getStep } from "@/api/template/matrix";
import { ref ,getCurrentInstance, ComponentInternalInstance} from "vue";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const stepsList = ref([]);
function handleUser(row: {}) {
  console.log(row);
}
function handleSort() {
  stepsList.value = stepsList.value.reverse();
}
function init(matrixId: number) {
  console.log(matrixId);
  getStep({
    matrixId,
  }).then((res) => {
    stepsList.value = res?.rows;
  });
}
defineExpose({
  init,
});
</script>
<style lang="scss" scoped>
.Steps-Page {
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
  .profile-steps {
    padding-left: 30px;
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
        left: -25px;
        top: 4px;
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
      margin: 15px 0 20px;
      .subTitle {
        flex: 1;
      }
      .createTime {
        width: 125px;
      }
    }
  }
  .notData{
    height:300px;
    display:flex;
    align-items:center;
    justify-content:center;
    color: #b4b0b0;
  }
  :deep(.is-process),:deep(.is-wait) {
    color: #999 !important;
  }
}
</style>
