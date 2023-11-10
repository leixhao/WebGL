<template>
  <div class="app-container type">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <!-- <el-form-item :label="t('aescapp.appName')" prop="appName">
        <el-input
          v-model="queryParams.appName"
          :placeholder="t('public.enterAction')"
          clearable
          size="small"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="Search" size="small" @click="handleQuery">{{ t("button.search")
        }}</el-button>
        <el-button icon="Refresh" size="small" @click="resetQuery">{{
          t("button.reset")
        }}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <!-- <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:aescapp:add']"
          >{{ t("button.new") }}</el-button
        > -->

        <el-button type="primary" plain icon="Plus" size="small" @click="handleAdd">{{ t("button.new")
        }}</el-button>
      </el-col>

      <el-col :span="1.5">
        <!-- <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:aescapp:remove']"
          >{{ t("button.delete") }}</el-button
        > -->

        <el-button type="danger" plain icon="el-icon-delete" size="small" :disabled="multiple" v-if="false"
          @click="handleDelete">{{ t("button.delete") }}</el-button>
      </el-col>

      <right-toolbar v-model:showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="aescappList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="45" align="left" /> -->
      <!-- <el-table-column :label="t('aescapp.index')" type="index" width="80" /> -->

      <el-table-column :label="t('aescapp.appName')" align="left" prop="appName" width="150"
        :show-overflow-tooltip="true" />
      <el-table-column :label="t('aescapp.appAbbr')" align="left" prop="appAbbr" width="150"
        :show-overflow-tooltip="true" />

      <el-table-column :label="t('aescapp.appDesc')" align="left" prop="appDesc" width="250"
        :show-overflow-tooltip="true">
        <template #default="scope">
          <p v-html="scope.row.appDesc"></p>
        </template>
      </el-table-column>

      <el-table-column :label="t('aescapp.enable')" align="left" prop="enable" width="120" :show-overflow-tooltip="true">
        <template #default="scope">
          <span>{{ scope.row.enable ? "是" : "否" }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="t('public.createTime')" prop="createTime" width="150">
        <template #default="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('public.createBy')" prop="createBy" width="150" />
      <el-table-column :label="$t('user.status')" align="center" key="status" width="150">
        <template #default="scope">
          <el-switch v-model="scope.row.status" active-value="0" inactive-value="1"
            @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="t('public.action')" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button size="small" type="primary" link icon="Edit" @click="handleUpdate(scope.row)">{{ t("button.edit")
          }}</el-button>
          <el-button size="small" type="primary" link @click="getSecretInfo(scope.row)">{{ t("button.sendSecret")
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->

    <!-- 维护任务信息 -->
    <aescAppForm ref="aescForm" :aescapp="form" :visible="aescAppFormBox" @cancel="aescAppFormBox = false"
      @saveclose="closeAescAppForm" :key="'aescAppForm' + new Date()">
    </aescAppForm>
  </div>
</template>




<script setup lang="ts">
import { remove, getAppList, getSecret } from "@/api/system/aescapp";
import aescAppForm from "@/views/system/aescapp/aescAppForm.vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCurrentInstance, ComponentInternalInstance, ref, reactive, toRefs, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from "vue-i18n";
const { t } = useI18n()

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dateRange = ref(null)
//datalist:[],//当前列表数据暂存
// 遮罩层
const loading = ref(true)
const loadingButton = ref(false)
// 选中数组
const ids = ref<number[]>([])
// 非单个禁用
const single = ref(true)
// 非多个禁用
const multiple = ref(true)
// 显示搜索条件
const showSearch = ref(false)
// 总条数
const total = ref(0)
// 任务分类表格数据
const aescappList = ref<any>([])
// 弹出层标题
const title = ref('')
// 是否显示弹出层
const aescAppFormBox = ref(false)
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  appName: "",
})
// 表单参数
const form = ref({})
// 表单校验
const rules = ref({})
/** 查询任务分类列表 */
function getList() {
  loading.value = true;
  getAppList(queryParams).then((response) => {
    aescappList.value = response.data;
    // this.total = response.total;
    loading.value = false;
  });
}
getList();
// 用户状态修改
function handleStatusChange(row: object) {
  // let text = row.status === "0" ? "启用" : "停用";
  // this.$confirm(
  //   '确认要"' + text + '""' + row.userName + '"用户吗?',
  //   "警告",
  //   {
  //     confirmButtonText: "确定",
  //     cancelButtonText: "取消",
  //     type: "warning",
  //   }
  // )
  //   .then(function () {
  //     return changeUserStatus(row.userId, row.status);
  //   })
  //   .then(() => {
  //     this.msgSuccess(text + "成功");
  //   })
  //   .catch(function () {
  //     row.status = row.status === "0" ? "1" : "0";
  //   });
}
// 获取secret
function getSecretInfo(row: any) {
  getSecret(row.appId).then((response) => {
    ElMessage({
      type: "success",
      message: "发送成功成功，请前往企业微信查收!",
    });
  });
}
// 取消按钮
function cancel() {
  // open = false;
  reset();
}
// 表单重置
function reset() {
  form.value = {
    id: null,
    appName: "",
    appDesc: "",
    enable: true,
  };
  proxy!.resetForm("form");
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = null;
  proxy!.resetForm("queryForm");
  handleQuery();
}
// 多选框选中数据
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  aescAppFormBox.value = true;
}
/** 修改按钮操作 */
function handleUpdate(row: any) {
  console.log(row)
  form.value = row;
  aescAppFormBox.value = true;
}
/** 删除按钮操作 */
function handleDelete() {
  if (ids.value.length == 0) {
    ElMessage({
      type: "warning",
      message: "请勾选需要删除的应用!",
    });
    return;
  }

  ElMessageBox.confirm("是否确认删除应用？", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    remove(ids).then((response) => {
      ElMessage({
        type: "success",
        message: "操作成功!",
      });
      getList();
    });
  });
}
function closeAescAppForm() {
  aescAppFormBox.value = false;
  getList();
}
</script>
<style lang="scss" >
.el-drawer__body {
  .el-form {
    padding-right: 25px !important;
  }
}

.el-drawer {
  width: 800px !important;
}

.room-drawer__footer {
  // position: absolute;
  // bottom: 12px;
  // border-top: 1px solid
  padding: 12px 28px;
  position: absolute;
  width: 100%;
  bottom: 0;
  box-shadow: 0px -8px 20px 0px rgba(92, 112, 153, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.felixForm {
  .el-form-item__label {
    min-width: 100px !important;
  }
}
</style>
