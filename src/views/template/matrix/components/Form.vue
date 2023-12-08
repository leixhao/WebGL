<template>
  <div class="Form-Page">
    <el-form :model="queryParams" class="matrix-form" ref="queryForm" label-width="80px">
      <el-form-item label="编号" prop="matrixNo">
        <!-- <el-input v-if="isEdit" v-model="queryParams.matrixNo" placeholder="编号" clearable></el-input> -->
        <span>{{ queryParams.matrixNo }}</span>
      </el-form-item>
      <el-form-item label="名称" prop="matrixName">
        <el-input
          v-if="isEdit"
          v-model="queryParams.matrixName"
          placeholder="名称"
          clearable
        ></el-input>
        <span v-else>{{ queryParams.matrixName }}</span>
      </el-form-item>
      <el-form-item label="版本" prop="matrixRevision">
        <span>{{ queryParams.matrixRevision }}</span>
      </el-form-item>
      <el-form-item label="状态" prop="matrixStatus">
        <span>{{ queryParams.matrixStatus }}</span>
      </el-form-item>
      <el-form-item label="所有者" prop="matrixOwner">
        <span>{{ queryParams.matrixOwner }}</span>
      </el-form-item>
      <el-form-item label="创建者" prop="createByName">
        <span>{{ queryParams.createByName }}</span>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <span>{{ queryParams.createTime }}</span>
      </el-form-item>
      <el-form-item label="修改者" prop="updateByName">
        <span>{{ queryParams.updateByName }}</span>
      </el-form-item>
      <el-form-item label="修改时间" prop="updateTime">
        <span>{{ queryParams.updateTime }}</span>
      </el-form-item>
      <el-form-item label="备注" prop="matrixRemarks">
        <el-input
          v-if="isEdit"
          type="textarea"
          :rows="1"
          v-model="queryParams.matrixRemarks"
          clearable
        ></el-input>
        <span v-else>{{ queryParams.matrixRemarks }}</span>
      </el-form-item>
      <el-form-item label="维护规范" prop="name">
        <div v-html="queryParams.matrixRule" v-show="!isEdit"></div>
        <editor
          ref="editorRefs"
          v-show="isEdit"
          v-model="queryParams.matrixRule"
          style="height: 130px"
        />
      </el-form-item>
    </el-form>
    <div class="row">
      <el-button plain @click="cancle" v-if="isEdit">取消</el-button>
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
import { ref, getCurrentInstance, ComponentInternalInstance } from "vue";
import {updateMatrix} from "@/api/template/matrix";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const queryForm = ref(null);
const queryParams = ref({
  matrixNo: null,
  matrixName: null,
  matrixRevision: null,
  matrixStatus: null,
  matrixRemarks: null,
  updateByName: null,
  updateTime: null,
  createTime: null,
  createByName: null,
  matrixOwner: null,
  matrixRule: "",
  id:''
});
const isEdit = ref(false);
const editorRefs = ref();
const emit=defineEmits(['update'])
function handleClick() {
  if (isEdit.value) {
    let item=queryParams.value;
    let Content = editorRefs.value?.getContent();
    item.matrixRule = Content;
    console.log(item);
    updateMatrix({
      id:item.id,
      matrixName:item.matrixName,
      matrixRemarks:item.matrixRemarks,
      matrixRule:item.matrixRule
    }).then(res=>{
      proxy!.$modal.msgSuccess("修改成功");
      emit('update')
    })
  }
  isEdit.value = !isEdit.value;
}
const RowItem = ref();
function cancle() {
  queryParams.value = RowItem.value;
  isEdit.value = !isEdit.value;
}
function init(row: any) {
  RowItem.value = row;
  queryParams.value = row;
}
defineExpose({
  init,
});
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
    :deep(.el-form-item__label) {
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
