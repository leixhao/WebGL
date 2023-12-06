<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb20">
      <el-col :span="20" :xs="24">
        <el-form v-show="showSearch" @submit.prevent ref="queryRef" :model="queryParams" :inline="true">
          <el-form-item :label="''" prop="search">
            <el-input v-model="queryParams.search" placeholder="请输入搜索关键字" clearable style="width: 240px"
              @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">{{ $t("button.search") }}</el-button>
            <el-button icon="Refresh" @click="resetQuery">{{ $t("button.reset") }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <left-toolbar v-model:showSearch="showSearch" :show-export="false" :delDis="multiple" :editDis="single"
        v-model:toogle="toogle" @docAdd="handleAdd" @docDelete="handleDelete" @docEdit="handleEdit"
        @queryTable="getList"></left-toolbar>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table class="table_divClass" v-loading="loading" :data="templateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="80" />
      <!-- <el-table-column label="ID"  prop="id" min-width="100" /> -->
      <el-table-column :label="t('table.number')" prop="matrixNo" min-width="150" />
      <!-- <el-table-column label="应用ID"  prop="appId" min-width="280" /> -->
      <el-table-column :label="t('table.name')" prop="matrixName" :show-overflow-tooltip="true" min-width="100" />
      <el-table-column :label="t('table.version')" prop="matrixRevision" :show-overflow-tooltip="true" min-width="100" />
      <el-table-column :label="t('table.status')" prop="matrixStatus" :show-overflow-tooltip="true" min-width="100">
        <!-- <template #default="scope">
          <span v-if="scope.row.type == '1'">邮件模板</span>
          <span v-else>企业微信模板</span>
        </template> -->
      </el-table-column>
      <el-table-column :label="t('table.creator')" prop="createByName" :show-overflow-tooltip="true" min-width="100" />
      <el-table-column :label="t('table.creatime')" prop="createTime" :show-overflow-tooltip="true" min-width="100" />
      <el-table-column :label="t('table.modifiedBy')" prop="updateByName" :show-overflow-tooltip="true" min-width="100" />
      <el-table-column :label="t('table.modifiedTime')" prop="updateTime" :show-overflow-tooltip="true" min-width="120" />
      <el-table-column :label="t('table.remarks')" prop="matrixRemarks" :show-overflow-tooltip="true" min-width="100" />
      <el-table-column :label="t('table.action')" min-width="150" fixed="right" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button size="small" link type="primary" icon="Edit" @click="handleUpdate(scope.row)">{{ $t('button.edit')
          }}</el-button>
          <el-button size="small" link type="primary" icon="Delete" @click="handleDelete(scope.row)">{{
            $t('button.delete')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" v-model="open" center append-to-body>
      <div class="demo-drawer__content">
        <el-form class="m20" ref="ruleFormRef" :model="rulesForm" :rules="rules" label-width="120px">
          <el-form-item label="对应类型" prop="typeValue">
            <el-tree-select v-model="rulesForm.typeValue" :data="typeData" :render-after-expand="false" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="rulesForm.name" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="rulesForm.remarks" placeholder="备注" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item>
            <template #label>
              <span style="font-weight: 600;"><span
                  style="color: red;display: inline-block;margin-right: 5px;">*</span>主内容</span>
            </template>
            <el-upload class="upload-demo" drag :action="APLOAD_RUL" :auto-upload="false" multiple>
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                将文件拖到此处，或者<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  限一份，且仅支持上传XLSX文件
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <template #label>
              <span style="font-weight: 600;">附件</span>
            </template>
            <el-upload class="upload-demo" drag :action="APLOAD_RUL" :auto-upload="false" multiple>
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                将文件拖到此处，或者<em>点击上传</em>
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div class="demo-drawer__footer">
        <el-button class="pull-right" size="small" type="primary" @click="submitForm(ruleFormRef)">确
          定</el-button>
        <el-button class="pull-right mr20" size="small" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <profile ref="profileRef"></profile>
  </div>
</template>

<script lang="ts" setup>
import {
  getSelectList
} from "@/api/template/matrix";
import { getCurrentInstance, ComponentInternalInstance, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import profile from './profile/index.vue'
import { useI18n } from "vue-i18n";
const { t } = useI18n()

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_common_status } = proxy!.useDict('sys_common_status');
const ruleFormRef = ref<FormInstance>()
const queryForm = ref<FormInstance>()
const toogle = ref(false)
const APLOAD_RUL = '/ecm/'
const typeOptions = ref([
  {
    value: 1,
    label: "邮件模板",
  },
  {
    value: 2,
    label: "企业微信模板",
  },
])
const typeValue = ref();
const typeData = [
  {
    value: '1',
    label: 'Level one 1',
    children: [
      {
        value: '1-1',
        label: 'Level two 1-1',
        children: [
          {
            value: '1-1-1',
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    value: '2',
    label: 'Level one 2',
    children: [
      {
        value: '2-1',
        label: 'Level two 2-1',
        children: [
          {
            value: '2-1-1',
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        value: '2-2',
        label: 'Level two 2-2',
        children: [
          {
            value: '2-2-1',
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    value: '3',
    label: 'Level one 3',
    children: [
      {
        value: '3-1',
        label: 'Level two 3-1',
        children: [
          {
            value: '3-1-1',
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        value: '3-2',
        label: 'Level two 3-2',
        children: [
          {
            value: '3-2-1',
            label: 'Level three 3-2-1',
          },
        ],
      },
    ]
  }]
const templateList = ref([]);
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
// 日期范围
const dateRange = ref([])
// 查询参数
const queryParams = ref({
  search: undefined,
  pageNum: 1,
  pageSize: 10,
})
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
const rulesForm = ref({
  id: undefined,
  typeValue: undefined,
  name: undefined,
  remarks: undefined
})
const rules = ref({
  type: [
    { required: true, message: "模板类型不能为空", trigger: "blur" },
  ],
  name: [
    { required: true, message: "模板名称不能为空", trigger: "blur" },
  ],
  title: [
    { required: true, message: "模板标题不能为空", trigger: "blur" },
  ],
  content: [
    { required: true, message: "模板内容不能为空", trigger: "blur" },
  ],
})
getList()

interface NObject {
  [key: string]: string | number | undefined | null | void
}
/** 查询角色列表 */
function getList() {
  loading.value = true;
  const obj = queryParams.value as NObject;
  Object.keys(obj).forEach(key => {
    if (!obj[key]) {
      delete obj[key]
    }
  })
  getSelectList({}).then(
    (response: any) => {
      templateList.value = response.rows;
      total.value = response.total;
      loading.value = false;
    }
  );
}
// 角色状态修改
function handleStatusChange(row: any) {
  let text = row.enable ? "启用" : "停用";
  proxy?.$modal
    .confirm('确认要"' + text + '"模板吗？')
    .then(function () {
      return changeTemplateStatus(row);
    })
    .then(() => {
      proxy?.$modal.msgSuccess(text + "成功");
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
// 表单重置
function reset() {
  rulesForm.value = {
    id: undefined,
    name: undefined,
    typeValue: undefined,
    remarks: undefined
  };
  console.log(234)
  proxy?.resetForm("ruleFormRef");
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.search = !!queryParams.value.search
    ? queryParams.value.search
    : undefined;
  queryParams.value.pageNum = 1;
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
  title.value = "创建文档";
}
/** 修改按钮操作 */
function handleUpdate(row: any) {
  (proxy?.$refs['profileRef'] as any)?.toogleShow();
}
function handleEdit() {

}
/** 提交按钮 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (rulesForm.value.id != undefined) {
      updatTemplate(rulesForm).then((response: any) => {
        proxy?.$modal.msgSuccess("修改成功");
        open.value = false;
        getList();
      });
    } else {
      addTemplate(rulesForm).then((response: any) => {
        console.log(rulesForm);
        proxy?.$modal.msgSuccess("新增成功");
        open.value = false;
        getList();
      });
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