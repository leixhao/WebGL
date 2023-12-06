<template>
  <div class="Steps-Page">
    <div class="sort">
      <el-tooltip content="按时间排序" placement="bottom" effect="light">
        <el-icon @click="handleSort"><Sort /></el-icon>
      </el-tooltip>
    </div>
    <el-steps direction="vertical" class="profile-steps">
      <el-step v-for="(v, i) in stepsList" :key="i">
        <template #icon>
          <div class="icon-content" @click="handleUser(v)">
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
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
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
function handleUser(row: {}) {
  console.log(row);
}
function handleSort() {
  stepsList.value = stepsList.value.reverse();
}
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
    padding-left:30px;
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
      margin:10px 0 15px;
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
