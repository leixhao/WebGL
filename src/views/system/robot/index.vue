<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
            <!-- <el-form-item label="应用ID" prop="appId">
        <el-input v-model="queryParams.appId" placeholder="应用ID" clearable size="small" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
            <el-form-item label="webHookKey" prop="webHookKey">
                <el-input v-model="queryParams.webHookKey" placeholder="webHookKey" clearable style="width: 240px"
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
            <el-col :span="1.5">
                <el-button type="success" plain icon="Edit" size="small" :disabled="single"
                    v-hasPermi="['system:role:edit']">{{ $t('button.edit') }}</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table class="table_divClass" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
            <!-- <el-table-column type="selection" width="50" align="center" /> -->
            <!-- <el-table-column label="应用ID" prop="appId" min-width="280" /> -->
            <el-table-column label="机器人名称" prop="botName" />
            <el-table-column label="CODE" prop="wrcNo" />
            <el-table-column label="webHookKey" prop="webHookKey" />
            <el-table-column label="是否禁用" align="center" min-width="80">
                <template #default="scope">
                    <el-switch v-model="scope.row.enable" @change="handleStatusChange(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="100">
                <template #default="scope">
                    <el-button size="small" link type="primary" icon="el-icon-edit" @click="handleUpdate(scope.row)">{{ $t('button.edit')
          }}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改角色配置对话框 -->
        <el-dialog :title="title" v-model="open" center append-to-body>
            <div class="demo-drawer__content">
                <el-form class="m20" ref="ruleFormRef" :model="rulesForm" :rules="rules" label-width="120px">
                    <el-form-item label="应用ID" prop="appId">
                        <el-input v-model="rulesForm.appId" placeholder="应用ID" :disabled="!!rulesForm.id" />
                    </el-form-item>
                    <el-form-item label="机器人名称" prop="botName">
                        <el-input v-model="rulesForm.botName" placeholder="机器人名称" />
                    </el-form-item>
                    <el-form-item label="CODE" prop="wrcNo" v-if="!!rulesForm.id">
                        <el-input v-model="rulesForm.wrcNo" placeholder="配置CODE" disabled />
                    </el-form-item>
                    <el-form-item label="webHookKey" prop="webHookKey">
                        <el-input v-model="rulesForm.webHookKey" placeholder="key配置" />
                    </el-form-item>
                    <el-form-item label="是否禁用" prop="enable">
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
        listRobot,
        getRole,
        delRole,
        addRobotConfig,
        updateRobotConfig,
        changeRobotConfig,
    } from "@/api/system/robot";
    import { Sort } from 'element-plus';
    import { getCurrentInstance, ComponentInternalInstance, ref } from 'vue';
    import type { FormInstance, FormRules } from 'element-plus'

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const { sys_common_status } = proxy!.useDict('sys_common_status');
    const ruleFormRef = ref<FormInstance>()
    const loading = ref(true);
    const title = ref('');
    const ids = ref([]);
    const single = ref(true);
    const multiple = ref(true);
    const showSearch = ref(true);
    const total = ref(0);
    const list = ref([]);
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
        agentId: undefined,
        appId: undefined,
        corpId: undefined,
        webHookKey: undefined,
        enable: undefined,
        waNo: undefined,
    })
    // 表单参数
    const rulesForm = ref({
        id: null,
        appId: undefined,
        botName: undefined,
        wrcNo: undefined,
        webHookKey: undefined,
        enable: true,
    })
    const defaultProps = ref({
        children: "children",
        label: "label",
    })
    // 表单校验
    const rules = ref({
        webHookKey: [
            { required: true, message: "webHookKey不能为空", trigger: "blur" },
        ],
        appId: [{ required: true, message: "应用ID不能为空", trigger: "blur" }],
        botName: [
            { required: true, message: "机器人名称不能为空", trigger: "blur" },
        ],
    })
    getList();
    /** 查询列表 */
    function getList() {
        loading.value = true;
        listRobot(queryParams.value).then((response : any) => {
            list.value = response.rows;
            total.value = response.total;
            loading.value = false;
        });
    }
    // 配置状态修改
    function handleStatusChange(row : any) {
        let text = row.enable ? "启用" : "停用";
        proxy?.$modal
            .confirm("确认要" + text + "配置吗？")
            .then(function () {
                return changeRobotConfig(row);
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
                appId: undefined,
                botName: undefined,
                wrcNo: undefined,
                webHookKey: undefined,
                enable: null,
            });
        proxy?.resetForm("ruleFormRef");
    }
    /** 搜索按钮操作 */
    function handleQuery() {
        queryParams.value.appId = !!queryParams.value.appId
            ? queryParams.value.appId
            : undefined;
        queryParams.value.webHookKey = !!queryParams.value.webHookKey
            ? queryParams.value.webHookKey
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
        ids.value = selection.map((item : any) => item.roleId);
        single.value = selection.length != 1;
        multiple.value = !selection.length;
    }
    /** 新增按钮操作 */
    function handleAdd() {
        reset();
        open.value = true;
        title.value = "添加配置";
    }
    /** 修改按钮操作 */
    function handleUpdate(row : any) {
        reset();
        let obj = JSON.parse(JSON.stringify(row));
        rulesForm.value = obj;
        open.value = true;
        title.value = "修改配置";
    }
    /** 提交按钮 */
    const submitForm = async (formEl : FormInstance | undefined) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (rulesForm.value.id != undefined) {
                updateRobotConfig(rulesForm.value).then((response : any) => {
                    proxy?.$modal.msgSuccess("修改成功");
                    open.value = false;
                    getList();
                });
            } else {
                addRobotConfig(rulesForm).then((response : any) => {
                    proxy?.$modal.msgSuccess("新增成功");
                    open.value = false;
                    getList();
                });
            }
        });
    }
    /** 删除按钮操作 */
    // handleDelete(row) {
    //   const roleIds = row.roleId || this.ids;
    //   this.$modal
    //     .confirm('是否确认删除配置编号为"' + roleIds + '"的数据项？')
    //     .then(function () {
    //       return delRole(roleIds);
    //     })
    //     .then(() => {
    //       this.getList();
    //       this.$modal.msgSuccess("删除成功");
    //     })
    //     .catch(() => {});
    // },
    /** 导出按钮操作 */
    function handleExport() {
        proxy!.download(
            "system/role/export",
            {
                ...queryParams.value,
            },
            `role_${new Date().getTime()}.xlsx`
        );
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