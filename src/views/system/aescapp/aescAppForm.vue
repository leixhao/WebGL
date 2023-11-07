<template>
  <el-drawer
    class="felixDraw"
    style="font-weight: bold"
    :title="title"
    :visible.sync="visible"
    append-to-body
    :before-close="handleClose"
  >
    <div style="font-weight: normal; margin-left: 10px; margin-right: 15px">
      <el-form label-width="150px" ref="form" :model="form" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('aescapp.appName') + '：'" prop="appName">
              <el-input
                v-model="form.appName"
                :placeholder="$t('aescapp.appName')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item
              :label="$t('aescapp.appAbbr') + '：'"
              prop="appAbbr"
            >
              <el-input
                v-model="form.appAbbr"
                :placeholder="$t('aescapp.appAbbr')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('aescapp.enable') + '：'" prop="enable">
              <el-select
                v-model="form.enable"
                :placeholder="$t('user.msg.select')"
                clearable
                size="small"
                style="width: 240px"
              >
                <el-option
                  v-for="item in [
                    { dictLabel: '是', dictValue: true },
                    { dictLabel: '否', dictValue: false },
                  ]"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('aescapp.appDesc') + '：'" prop="appDesc">
              <div class="rich" style="height: 130px">
                <quill-editor
                  ref="text"
                  :placeholder="$t('aescapp.appDesc')"
                  v-model="form.appDesc"
                  style="height: 130px"
                />
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
          <el-button
            @click="handleSaveaescapp"
            :loading="loadingHandleSaveaescapp"
          >
            <i class="el-icon-s-promotion"></i>{{ $t("button.save") }}</el-button
          >
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { addApp, editApp } from "@/api/system/aescapp";

export default {
  props: {
    aescapp: { type: Object },
    visible: {
      type: Boolean,
      default: false,
    },
    dictionary: { type: Object },
  },
  data() {
    return {
      title: "",
      form: {
        id: null,
        appName: "",
        appAbbr: "",
        appDesc: "",
        enable: true,
      },
      loading: true,
      // 状态数据字典
      statusOptions: [],
      // 表单校验
      rules: {
        appName: [
          { required: true, message: "应用名称不能为空", trigger: "blur" },
        ],
        appAbbr: [
          { required: true, message: "应用简称不能为空", trigger: "blur" },
        ],
        appDesc: [
          { required: true, message: "应用描述不能为空", trigger: "blur" },
        ],
      },
      loadingHandleSaveaescapp: false,
    };
  },
  mounted() {
    this.initclick(); //需要触发的函数
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    saveclose() {
      this.$emit("saveclose");
    },
    handleClose() {
      this.saveclose();
    },
    initclick() {
      if (this.visible) {
        this.title = this.$t("button.new") + this.$t("aescapp.router.app");
        this.reset();
        if (this.aescapp.id != undefined) {
          this.title = this.$t("button.edit") + this.$t("aescapp.router.app");
          this.form = this.aescapp;
        }
      }
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        appName: "",
        appAbbr:"",
        appDesc: "",
        enable: true,
      };
      this.resetForm("form");
    },
    handleSaveaescapp() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loadingHandleSaveaescapp = true;

          //新增
          if (this.aescapp.id == undefined) {
            addApp(this.form).then(
              (res) => {
                this.$message({
                  type: "success",
                  message: this.$t("public.msg.operationsuccess"),
                });
                this.loadingHandleSaveaescapp = false;
                this.form = res.data;
                this.aescapp = this.form;
                this.handleClose();
              },
              (error) => {
                this.loadingHandleSaveaescapp = false;
                window.console.log(error);
              }
            );

            return;
          }

          //修改
          editApp(this.form).then(
            (res) => {
              this.$message({
                type: "success",
                message: this.$t("public.msg.operationsuccess"),
              });
              this.loadingHandleSaveaescapp = false;
              this.form = res.data;
              this.aescapp = this.form;
              this.handleClose();
            },
            (error) => {
              this.loadingHandleSaveaescapp = false;
              window.console.log(error);
            }
          );
        }
      });
    },
  },
};
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
