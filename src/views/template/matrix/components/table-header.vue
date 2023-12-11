<template>
  <div class="main">
    <header>
      <div class="left-upload">
        <el-tooltip content="上传" placement="bottom" effect="dark">
          <el-button @click="handleUpload" type="primary" plain circle icon="DocumentAdd" />
        </el-tooltip>
      </div>
    </header>
    <div class="right-form">
      <!-- <el-input
        v-model="Search"
        @keyup.enter="handleSearch"
        placeholder="输入搜索关键字"
        clearable
        maxlength="20"
      ></el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button> -->
    </div>
  </div>
  <UploadFile url="http://www.baidu.com" @update="show = false" :open="show"></UploadFile>
</template>

<script setup lang="ts">
import UploadFile from "./Upload-File.vue";
import { ref } from "vue";
const show = ref(false);
const Search = ref("");
const emit = defineEmits(["search"]);
function handleSearch() {
  console.log(Search.value);
  emit("search", Search.value);
}
function handleUpload(){
  show.value = true;
}
</script>
<style lang="scss" scoped>
.main {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  .left-upload {
    font-size: 20px;
  }
  .right-form {
    display: flex;
    align-items: center;
    .el-input {
      width: 180px;
      margin-right: 10px;
    }
  }
}
</style>
