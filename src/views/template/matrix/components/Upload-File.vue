<template>
  <el-dialog
    v-model="show"
    title="上传文件"
    width="35%"
    :before-close="handleClose"
    :close-on-click-modal="false"
    append-to-body
    draggable
  >
    <el-upload
      class="upload-demo"
      drag
      :action="props.url"
      multiple
      :accept="accept"
      :limit="1"
      ref="FileUpload"
      name="file"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">可以拖拽到这里 <em>或者点击我</em></div>
      <template #tip>
        <div class="row">
          <div class="el-upload__tip">
            只允许{{ accept }}文件 最大不能超过{{ props.fileSize }}M
          </div>
        </div>
      </template>
    </el-upload>
    <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="show = false">取消</el-button>
        </span>
      </template> -->
  </el-dialog>
</template>

<script setup lang="ts">
import { getToken } from "@/utils/auth";
import { getCurrentInstance, ComponentInternalInstance, ref, computed } from "vue";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const APLOAD_RUL =import.meta.env.VITE_APP_BASE_API;
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  open: {
    type: Boolean,
    default: false,
  },
  fileType: {
    type: Array,
    default: () => ["xls", "xlsx"],
  },
  fileSize: {
    type: Number,
    default: 20,
  },
});
const accept = computed({
  get() {
    let arr = props.fileType.map((v) => "." + v);
    return arr.join(",");
  },
  set() {},
});
const emit = defineEmits(["update"]);
const show = computed({
  get() {
    return props.open;
  },
  set(val) {
    emit("update", val);
  },
});
function handleClose() {
  emit("update", false);
}
function handleBeforeUpload(file:any) {
  console.log(APLOAD_RUL);
  // 检验类型 和大小
  console.log(file, 111);
  if (props.fileType.length) {
    const fileName = file.name.split(".");
    const fileExt = fileName[fileName.length - 1];
    const isTypeOk = props.fileType.indexOf(fileExt) >= 0;
    if (!isTypeOk) {
      proxy?.$modal.msgError(
        `文件格式不正确, 请上传${props.fileType.join("/")}格式文件!`
      );
      return false;
    }
  }
  // 校检文件大小
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize;
    if (!isLt) {
      proxy?.$modal.msgError(`上传文件大小不能超过 ${props.fileSize} MB!`);
      return false;
    }
  }
  // proxy?.$modal.loading("正在上传文件，请稍候...");
  return true;
}
const FileUpload = ref(null);
function handleUploadSuccess(res:any, file:any) {
  // 上传成功的回调 通知父组件
  if (res.result) {
    proxy?.$modal.msgSuccess("上传成功");
    handleClose();
  } else {
    proxy?.$modal.msgError("上传失败,请重试");
  }
  proxy?.$modal.closeLoading();
}
</script>
<style lang="scss" scoped>
.upload-demo {
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-icon-document {
      margin-top: 10px;
      font-size: 13px;
    }
  }
}
</style>
