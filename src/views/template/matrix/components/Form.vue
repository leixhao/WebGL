<template>
  <div class="Form-Page">
    <el-form :model="queryParams" class="matrix-form" ref="queryForm" label-width="80px">
      <el-form-item label="编号" prop="code">
        <span>{{ queryParams.code }}</span>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <span>{{ queryParams.name }}</span>
      </el-form-item>
      <el-form-item label="版本" prop="version">
        <span>{{ queryParams.version }}</span>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <span>{{ queryParams.status }}</span>
      </el-form-item>
      <el-form-item label="所有者" prop="name">
        <span>{{ queryParams.name }}</span>
      </el-form-item>
      <el-form-item label="创建者" prop="name">
        <span>{{ queryParams.name }}</span>
      </el-form-item>
      <el-form-item label="创建时间" prop="name">
        <span>{{ queryParams.name }}</span>
      </el-form-item>
      <el-form-item label="修改者" prop="name">
        <span>{{ queryParams.name }}</span>
      </el-form-item>
      <el-form-item label="修改时间" prop="name">
        <span>{{ queryParams.name }}</span>
      </el-form-item>
      <el-form-item label="备注" prop="name">
        <span>{{ queryParams.name }}</span>
      </el-form-item>
      <el-form-item label="维护规范" prop="name">
        <div v-html="queryParams.appDesc" v-show="!isEdit"></div>
        <editor ref="editorRefs" v-show="isEdit" v-model="queryParams.appDesc" style="height: 130px" />
      </el-form-item>
    </el-form>
    <div class="row">
      <el-button
        type="primary"
        :icon="isEdit ? 'FolderChecked' : 'Edit'"
        @click="handleClick"
        >{{ isEdit ? "保存" : "修改" }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const queryForm = ref(null);
const queryParams = ref({
  code: "100001",
  name: "测试变更矩阵",
  version: "2.0",
  status: "正在工作",
  appDesc:`<p><strong>这是一个标题</strong></p><p><br></p>`,
});
const isEdit = ref(false);
const editorRefs = ref();
function handleClick() {
  isEdit.value = !isEdit.value;
  console.log(queryParams.value);
  editorRefs.value?.getContent();
}
</script>
<style lang="scss" scoped>
.Form-Page {
  height: 100%;
  .matrix-form {
    overflow: auto;
    margin-bottom: 10px;
    padding: 0 10px;
    height: calc(100% - 50px);
  }
  .el-form-item--default {
    margin-bottom: 8px;
    .el-form-item__label {
      font-weight: 700;
    }
  }
  .row {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
