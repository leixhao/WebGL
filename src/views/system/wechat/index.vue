<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <!-- <el-form-item label="应用ID" prop="appId">
        <el-input
          v-model="queryParams.appId"
          placeholder="应用ID"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="企业微信ID" prop="corpId">
        <el-input v-model="queryParams.corpId" placeholder="应用ID" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">{{ $t('button.search')
        }}</el-button>
        <el-button icon="Refresh" @click="resetQuery">{{ $t('button.reset') }}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb20">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" size="small" @click="handleAdd">{{ $t('button.new')
        }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" size="small" :disabled="multiple" @click="handleDelete">{{
          $t('button.delete') }}</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          >修改</el-button
        >
      </el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table class="table_divClass" v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <!-- <el-table-column label="ID" prop="id" min-width="100" /> -->
      <el-table-column label="配置CODE" prop="wcNo" />
      <el-table-column label="应用ID" prop="appId" />
      <el-table-column label="应用名称" prop="appName" />
      <el-table-column label="企业微信ID" prop="agentId" />
      <el-table-column label="企业微信应用ID" prop="corpId" />
      <!-- <el-table-column label="应用密钥" prop="corpSecret" min-width="400"/> -->
      <!-- <el-table-column label="enable" align="center" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column> -->
      <el-table-column fixed="right" min-width="100" label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button size="small" type="text" icon="Edit" @click="handleUpdate(scope.row)">{{ $t('button.edit')
          }}</el-button>
          <el-button size="small" type="text" icon="Delete" @click="handleDelete(scope.row)">{{
            $t('button.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 企业微信配置 -->
    <el-dialog :title="title" v-model="open" center append-to-body>
      <div class="demo-drawer__content">
        <el-form class="m20" ref="ruleFormRef" :model="rulesForm" :rules="rules" label-width="150px">
          <el-form-item label="应用ID" prop="appId">
            <el-input v-model="rulesForm.appId" placeholder="应用ID" :disabled="!!rulesForm.id" />
          </el-form-item>
          <el-form-item label="应用名称" prop="appName">
            <el-input v-model="rulesForm.appName" placeholder="应用名称" />
          </el-form-item>
          <el-form-item label="CODE" prop="wcNo" v-if="rulesForm.id != null">
            <el-input v-model="rulesForm.wcNo" placeholder="CODE" disabled />
          </el-form-item>
          <el-form-item label="agentId" prop="agentId">
            <el-input v-model="rulesForm.agentId" placeholder="agentId" />
          </el-form-item>
          <el-form-item label="企业微信应用ID" prop="corpId">
            <el-input v-model="rulesForm.corpId" placeholder="企业微信应用ID" />
          </el-form-item>
          <el-form-item label="应用密钥" prop="corpSecret">
            <el-input v-model="rulesForm.corpSecret" placeholder="应用密钥" />
          </el-form-item>
          <!-- <el-form-item label="是否禁用">
            <el-radio-group v-model="form.enable">
              <el-switch v-model="form.enable"></el-switch>
            </el-radio-group>
          </el-form-item> -->
        </el-form>
        <div class="demo-drawer__footer">
          <el-button class="pull-right" size="small" type="primary" @click="submitForm(ruleFormRef)">确 定</el-button>
          <el-button class="pull-right mr20" size="small" @click="cancel">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  list,
  getRole,
  delRole,
  addRole,
  updateWechat,
  dataScope,
  changeRoleStatus,
} from "@/api/system/wechat";
import { getCurrentInstance, ComponentInternalInstance, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_common_status } = proxy!.useDict('sys_common_status');
const ruleFormRef = ref<FormInstance>()
// 遮罩层
const loading = ref(true);
// 选中数组
const ids = ref<number[]>([]);
// 非单个禁用
const single = ref(true);
// 非多个禁用
const multiple = ref(true);
// 显示搜索条件
const showSearch = ref(true);
// 总条数
const total = ref(0);
// 角色表格数据
const dataList = ref<any[]>([]);
// 弹出层标题
const title = ref<any>('');
// 是否显示弹出层
const open = ref(false);
// 是否显示弹出层（数据权限）
const openDataScope = ref(false);
const menuExpand = ref(false);
const menuNodeAll = ref(false);
const deptExpand = ref(true);
const deptNodeAll = ref(false);
const stateOption = ref([
  {
    value: true,
    label: "是",
  },
  {
    value: false,
    label: "否",
  },
])
// 日期范围
const dateRange = ref<any[]>([]);
// 数据范围选项
const dataScopeOptions = ref([
  {
    value: "1",
    label: "全部数据权限",
  },
  {
    value: "2",
    label: "自定数据权限",
  },
  {
    value: "3",
    label: "本部门数据权限",
  },
  {
    value: "4",
    label: "本部门及以下数据权限",
  },
  {
    value: "5",
    label: "仅本人数据权限",
  },
])
// 菜单列表
const menuOptions = ref<any[]>([])
// 部门列表
const deptOptions = ref<any[]>([])
// 查询参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  corpId: undefined,
  appId: undefined,
})
// 表单参数
const rulesForm = ref({
  id: null,
  appId: null,
  appName: null,
  wcNo: null,
  agentId: null,
  corpId: null,
  corpSecret: null,
  enable: null
})
const defaultProps = ref({
  children: "children",
  label: "label",
})
// 表单校验
const rules = ref({
  appId: [{ required: true, message: "应用ID不能为空", trigger: "blur" }],
  appName: [
    { required: true, message: "应用名称不能为空", trigger: "blur" },
  ],
  agentId: [
    { required: true, message: "agentId不能为空", trigger: "blur" },
  ],
  corpId: [
    { required: true, message: "corpId不能为空", trigger: "blur" },
  ],
  corpSecret: [
    {
      required: true,
      message: "企业微信应用密钥不能为空",
      trigger: "blur",
    },
  ]
})
getList();
/** 查询角色列表 */
function getList() {
  loading.value = true;
  list(queryParams.value).then((response: any) => {
    dataList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}
// /** 邮箱信息ID查询菜单树结构 */
// getRoleMenuTreeselect(roleId) {
//   return roleMenuTreeselect(roleId).then((response) => {
//     this.menuOptions = response.menus;
//     return response;
//   });
// },
// 角色状态修改
function handleStatusChange(row: any) {
  let text = row.enable === "0" ? "启用" : "停用";
  proxy!.$modal
    .confirm('确认要"' + text + '""' + row.wcNo)
    .then(function () {
      return changeRoleStatus(row.wcNo, row.enable);
    })
    .then(() => {
      proxy!.$modal.msgSuccess(text + "成功");
    })
    .catch(function () {
      row.enable = !row.enable;
    });
}
// 取消按钮
function cancel() {
  open.value = false;
  reset();
}
// 取消按钮（数据权限）
function cancelDataScope() {
  openDataScope.value = false;
  reset();
}
// 表单重置
function reset() {
  if (proxy?.$refs.menu != undefined) {
    (proxy?.$refs.menu as any).setCheckedKeys([]);
  }
  (menuExpand.value = false),
    (menuNodeAll.value = false),
    (deptExpand.value = true),
    (deptNodeAll.value = false),
    (rulesForm.value = {
      id: null,
      appId: null,
      appName: null,
      wcNo: null,
      agentId: null,
      corpId: null,
      corpSecret: null,
      enable: null
    });
  proxy?.resetForm("ruleFormRef");
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  queryParams.value.appId = !!queryParams.value.appId
    ? queryParams.value.appId
    : undefined;
  queryParams.value.corpId = !!queryParams.value.corpId
    ? queryParams.value.corpId
    : undefined;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy?.resetForm("queryForm");
  handleQuery();
}
// 多选框选中数据
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加角色";
}
/** 修改按钮操作 */
function handleUpdate(row: any) {
  reset();
  let obj = JSON.parse(JSON.stringify(row));
  // this.response.data=row;
  rulesForm.value = obj;
  open.value = true;
  title.value = "修改配置";
}
/** 提交按钮 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (rulesForm.value.id != undefined) {
        updateWechat(rulesForm.value).then((response) => {
          proxy?.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        console.log(rulesForm);
        let param = {
          agentId: rulesForm.value.agentId,
          appId: rulesForm.value.appId,
          appName: rulesForm.value.appName,
          corpId: rulesForm.value.corpId,
          corpSecret: rulesForm.value.corpSecret,
          enable: rulesForm.value.enable,
          // "id": 0,
          // "waNo": ""
        };
        // this.form.menuIds = this.getMenuAllCheckedKeys();
        addRole(rulesForm.value).then((response) => {
          proxy?.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 删除按钮操作 */
function handleDelete(row: any) {
  const roleIds = row.id || ids.value;
  proxy?.$modal
    .confirm('是否确认删除角色编号为"' + roleIds + '"的数据项？')
    .then(function () {
      return delRole(roleIds);
    })
    .then(() => {
      getList();
      proxy?.$modal.msgSuccess("删除成功");
    })
    .catch(() => { });
}
</script>
<style lang="scss" scoped>
.table_divClass {
  // max-height: calc(100vh - 280px);
  overflow: auto !important;
}

.el-form-item {
  margin-right: 20px;
  margin-bottom: 20px;
}

.demo-drawer__footer {
  padding: 0 20px;
  background-color: white;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
