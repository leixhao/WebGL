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
            <el-form-item label="模板CODE" prop="mtNo">
                <el-input v-model="queryParams.mtNo" placeholder="模板CODE" clearable style="width: 240px"
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="是否禁用" prop="enable">
                <el-select v-model="queryParams.enable" placeholder="是否禁用" clearable style="width: 240px">
                    <el-option v-for="dict in stateOption" :key="dict.value + dict.label" :label="dict.label"
                        :value="dict.value" />
                </el-select>
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
            <el-col :span="1.5">
                <el-button type="danger" plain icon="Delete" size="small" :disabled="multiple" @click="handleDelete">{{
          $t('button.delete') }}</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table class="table_divClass" v-loading="loading" :data="templateList"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="80" />
            <!-- <el-table-column label="ID"  prop="id" min-width="100" /> -->
            <el-table-column label="模板CODE" prop="mtNo" min-width="150" />
            <!-- <el-table-column label="应用ID"  prop="appId" min-width="280" /> -->
            <el-table-column label="模板类型" prop="type" :show-overflow-tooltip="true" min-width="100">
                <template #default="scope">
                    <span v-if="scope.row.type == '1'">邮件模板</span>
                    <span v-else>企业微信模板</span>
                </template>
            </el-table-column>
            <el-table-column label="模板名称" prop="name" />
            <el-table-column label="模板标题" prop="title" />
            <el-table-column label="是否禁用" align="center" min-width="80">
                <template #default="scope">
                    <el-switch v-model="scope.row.enable" @change="handleStatusChange(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="100" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-button size="small" link type="primary" icon="Edit" @click="handleUpdate(scope.row)">{{ $t('button.edit')
          }}</el-button>
                    <el-button size="small" link type="primary" icon="Delete" @click="handleDelete(scope.row)">{{ $t('button.delete')
          }}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改角色配置对话框 -->
        <el-dialog :title="title" v-model="open" center append-to-body>
            <div class="demo-drawer__content">
                <el-form class="m20" ref="ruleFormRef" :model="rulesForm" :rules="rules" label-width="100px">
                    <el-form-item label="应用ID" prop="appId">
                        <el-input v-model="rulesForm.appId" placeholder="请输入应用ID" :disabled="!!rulesForm.id" />
                    </el-form-item>
                    <el-form-item label="模板CODE" prop="mtNo" v-if="!!rulesForm.id">
                        <el-input v-model="rulesForm.mtNo" />
                    </el-form-item>
                    <el-form-item label="模板类型" prop="type">
                        <el-select v-model="rulesForm.type" placeholder="请选择">
                            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="模板名称" prop="name">
                        <el-input v-model="rulesForm.name" placeholder="模板名称" />
                    </el-form-item>
                    <el-form-item label="模板标题" prop="title">
                        <el-input v-model="rulesForm.title" placeholder="模板标题" />
                    </el-form-item>
                    <el-form-item label="模板描述" prop="describes">
                        <el-input v-model="rulesForm.describes" placeholder="模板描述" />
                    </el-form-item>
                    <el-form-item label="模板内容" prop="content">
                        <el-input v-model="rulesForm.content" placeholder="模板内容" type="textarea" :rows="3" />
                    </el-form-item>
                    <el-form-item label="是否禁用">
                        <el-switch v-model="rulesForm.enable"></el-switch>
                    </el-form-item>
                </el-form>
                <div class="demo-drawer__footer">
                    <el-button class="pull-right" size="small" type="primary" @click="submitForm(ruleFormRef)">确
                        定</el-button>
                    <el-button class="pull-right mr20" size="small" @click="cancel">取 消</el-button>

                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
    import {
        listTemplate,
        getTemplateDetail,
        delRole,
        addTemplate,
        updatTemplate,
        changeTemplateStatus,
    } from "@/api/system/template";
    import { getCurrentInstance, ComponentInternalInstance, ref } from 'vue';
    import type { FormInstance, FormRules } from 'element-plus'

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const { sys_common_status } = proxy!.useDict('sys_common_status');
    const ruleFormRef = ref<FormInstance>()
    const queryForm = ref<FormInstance>()
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
        mtNo: undefined,
        pageNum: 1,
        pageSize: 10,
        appId: undefined,
        enable: undefined,
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
        appId: undefined,
        mtNo: undefined,
        type: undefined,
        name: undefined,
        title: undefined,
        describes: undefined,
        content: undefined,
        enable: undefined,
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
        [key : string] : string | number | undefined | null | void
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
        listTemplate(proxy!.addDateRange(queryParams.value, dateRange.value)).then(
            (response : any) => {
                templateList.value = response.rows;
                console.log(templateList.value);
                total.value = response.total;
                loading.value = false;
            }
        );
    }
    // 角色状态修改
    function handleStatusChange(row : any) {
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
            appId: undefined,
            mtNo: undefined,
            type: undefined,
            name: undefined,
            title: undefined,
            describes: undefined,
            content: undefined,
            enable: undefined,
        };
        proxy?.resetForm("ruleFormRef");
    }
    /** 搜索按钮操作 */
    function handleQuery() {
        queryParams.value.appId = !!queryParams.value.appId
            ? queryParams.value.appId
            : undefined;
        queryParams.value.mtNo = !!queryParams.value.mtNo
            ? queryParams.value.mtNo
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
    function handleSelectionChange(selection : any) {
        ids.value = selection.map((item : any) => item.id);
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
    function handleUpdate(row : any) {
        reset();
        const id = row.id || ids.value;
        console.log(row);
        getTemplateDetail(id).then((response : any) => {
            rulesForm.value = response.data;
            open.value = true;
            title.value = "修改模板";
        });
    }
    /** 提交按钮 */
    const submitForm = async (formEl : FormInstance | undefined) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (rulesForm.value.id != undefined) {
                updatTemplate(rulesForm).then((response : any) => {
                    proxy?.$modal.msgSuccess("修改成功");
                    open.value = false;
                    getList();
                });
            } else {
                addTemplate(rulesForm).then((response : any) => {
                    console.log(rulesForm);
                    proxy?.$modal.msgSuccess("新增成功");
                    open.value = false;
                    getList();
                });
            }
        });
    }
    /** 删除按钮操作 */
    function handleDelete(row : any) {
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