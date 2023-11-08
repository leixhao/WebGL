<template>
  <el-drawer class="felixDraw" style="font-weight: bold" :title="title" v-model="a" append-to-body
    :before-close="handleClose">
    <div style="font-weight: normal; margin-left: 10px; margin-right: 15px">
      <el-form label-width="150px" ref="ruleFormRef" :model="ruleForm" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('aescapp.appName') + '：'" prop="appName">
              <el-input v-model="ruleForm.appName" :placeholder="$t('aescapp.appName')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('aescapp.appAbbr') + '：'" prop="appAbbr">
              <el-input v-model="ruleForm.appAbbr" :placeholder="$t('aescapp.appAbbr')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('aescapp.enable') + '：'" prop="enable">
              <el-select v-model="ruleForm.enable" :placeholder="$t('user.msg.select')" clearable size="small"
                style="width: 240px">
                <el-option v-for="item in [
                  { dictLabel: '是', dictValue: true },
                  { dictLabel: '否', dictValue: false },
                ]" :key="item.dictLabel + item" :label="item.dictLabel" :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('aescapp.appDesc') + '：'" prop="appDesc">
              <div class="rich" style="height: 130px">
                <editor ref="text" :placeholder="$t('aescapp.appDesc')" v-model="ruleForm.appDesc"
                  style="height: 130px" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="room-drawer__footer">
        <div>
          <el-button @click="cancel">{{ $t("button.cancel") }}</el-button>
        </div>
        <div>
          <el-button @click="handleSaveaescapp(ruleFormRef)" :loading="loadingHandleSaveaescapp">
            <i class="el-icon-s-promotion"></i>{{ $t("button.save") }}</el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts" name="aescAppForm">
import { addApp, editApp } from "@/api/system/aescapp";
import { getCurrentInstance, ComponentInternalInstance, ref, reactive, toRefs, defineExpose, defineEmits, watch } from 'vue';
import { useI18n } from "vue-i18n";
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
const { t } = useI18n()
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  aescapp: {
    type: Object
  },
})
const a = ref(false)
watch(() => props.visible, (newVal, oldVal) => {
  console.log(newVal)
  a.value = props.visible;
}, { immediate: true })
const title = ref('')
const ruleForm = ref<{
  id: any;
  appName: string;
  appAbbr: string;
  appDesc: string;
  enable: boolean;
}>({
  id: null,
  appName: "",
  appAbbr: "",
  appDesc: "",
  enable: true,
})
const ruleFormRef = ref<FormInstance>()
const loading = ref(true)
// 状态数据字典
const statusOptions = ref([])
const rules = ref({
  appName: [
    { required: true, message: "应用名称不能为空", trigger: "blur" },
  ],
  appAbbr: [
    { required: true, message: "应用简称不能为空", trigger: "blur" },
  ],
  appDesc: [
    { required: true, message: "应用描述不能为空", trigger: "blur" },
  ],
})
const loadingHandleSaveaescapp = ref(false)
const emit = defineEmits(['cancel', 'saveclose']);
function cancel() {
  emit("cancel");
}
function saveclose() {
  emit("saveclose");
}
function handleClose() {
  saveclose();
}
initclick()
function initclick() {
  if (props.visible) {
    title.value = t("button.new") + t("aescapp.router.app");
    reset();
    if (props.aescapp?.id != undefined) {
      title.value = t("button.edit") + t("aescapp.router.app");
      console.log(props.aescapp)
      ruleForm.value = {
        id: props.aescapp.id,
        appName: props.aescapp.appName,
        appAbbr: props.aescapp.appAbbr,
        appDesc: props.aescapp.appDesc,
        enable: props.aescapp.enable,
      }
      console.log(ruleForm)
    }
  }
}
// 表单重置
function reset() {
  ruleForm.value = {
    id: null,
    appName: "",
    appAbbr: "",
    appDesc: "",
    enable: true,
  };
  proxy!.resetForm("form");
}
const handleSaveaescapp = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      loadingHandleSaveaescapp.value = true;
      // 新增
      if (props.aescapp?.id == undefined) {
        addApp(ruleForm.value).then(res => {
          ElMessage({
            type: "success",
            message: t("public.msg.operationsuccess"),
          })
          loadingHandleSaveaescapp.value = false;
          ruleForm.value = res.data;
          // aescapp = form.value;
          handleClose();
        },
          error => {
            loadingHandleSaveaescapp.value = false;
            window.console.log(error);
          })
        return
      }
      //修改
      editApp(ruleForm.value).then(
        (res) => {
          ElMessage({
            type: "success",
            message: t("public.msg.operationsuccess"),
          });
          loadingHandleSaveaescapp.value = false;
          ruleForm.value = res.data;
          // aescapp = form;
          handleClose();
        },
        (error) => {
          loadingHandleSaveaescapp.value = false;
          window.console.log(error);
        }
      );
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang="scss">
.felixDraw {
  .row-line {
    display: inline-block !important;
    width: 100px !important;
    box-sizing: border-box !important;
    text-align: right !important;
    padding: 0 12px 0 0 !important;
  }

  .el-drawer {
    width: 50% !important;

    .el-drawer__body {
      padding-bottom: 80px !important;
    }
  }

  .el-form-item__label {
    min-width: 100px !important;
  }

  .ql-toolbar.ql-snow {
    border: 1px solid #dcdfe6;
    border-radius: 4px 4px 0 0;
  }

  .ql-container.ql-snow {
    border: 1px solid #dcdfe6;
    border-radius: 0 0 4px 4px;
  }

  .room-drawer__footer {
    padding: 12px 28px;
    position: absolute;
    width: 100%;
    bottom: 0;
    box-shadow: 0px -8px 20px 0px rgba(134, 158, 206, 0.06);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.pull-right {
  float: right !important;
}

.el-icon-circle-plus {
  color: #1890ff;
}
</style>
