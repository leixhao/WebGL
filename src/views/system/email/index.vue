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
            <el-form-item label="邮件账号CODE" prop="maNo">
                <el-input v-model="queryParams.maNo" placeholder="邮件账号CODE" clearable style="width: 240px"
                    @keyup.enter="handleQuery" />
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

        <el-table class="table_divClass" v-loading="loading" :data="emailList"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <!-- <el-table-column label="ID"  prop="id" min-width="100" /> -->
            <!-- <el-table-column label="应用ID"  prop="appId" min-width="280"/> -->
            <el-table-column label="账号CODE" prop="maNo" min-width="150" />
            <el-table-column label="邮件名称" prop="fromsName" min-width="200" />
            <!-- <el-table-column label="服务器"   prop="host"  min-width="150"/> -->
            <!-- <el-table-column label="端口号"  prop="port" min-width="80" /> -->
            <el-table-column label="发件箱" prop="froms" min-width="240" />
            <el-table-column label="是否禁用" align="center" min-width="80">
                <template #default="scope">
                    <el-switch v-model="scope.row.enable" @change="handleStatusChange(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column fixed="right" min-width="100" label="操作" align="center"
                class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-button size="small" link type="primary" icon="Edit" @click="handleUpdate(scope.row)">{{ $t('button.edit')
          }}</el-button>
                    <el-button size="small" link type="primary" icon="Delete" @click="handleDelete(scope.row)">{{
            $t('button.delete')
          }}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改email -->
        <el-dialog :title="title" v-model="open" center append-to-body>
            <div class="demo-drawer__content">
                <el-form class="m20" ref="ruleFormRef" :model="rulesForm" :rules="rules" label-width="100px">
                    <el-form-item label="应用ID" prop="appId">
                        <el-input v-model="rulesForm.appId" placeholder="应用ID" :disabled="!!rulesForm.id" />
                    </el-form-item>
                    <el-form-item label="账号CODE" prop="maNo" v-if="rulesForm.maNo != null">
                        <el-input v-model="rulesForm.maNo" />
                    </el-form-item>
                    <el-form-item label="发件箱名称" prop="fromsName">
                        <el-input v-model="rulesForm.fromsName" />
                    </el-form-item>
                    <el-form-item prop="host">
                        <span slot="label">服务器地址 </span>
                        <el-input v-model="rulesForm.host" placeholder="服务器地址" />
                    </el-form-item>
                    <el-form-item label="端口号" prop="port">
                        <el-input v-model="rulesForm.port" placeholder="端口号" />
                    </el-form-item>
                    <el-form-item label="发件箱" prop="froms">
                        <el-input v-model="rulesForm.froms" placeholder="发件箱" />
                    </el-form-item>
                    <el-form-item label="用户名" prop="user">
                        <el-input v-model="rulesForm.user" placeholder="用户名" />
                    </el-form-item>
                    <el-form-item label="密码" prop="pass">
                        <el-input v-model="rulesForm.pass" show-password placeholder="密码" />
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

<script setup lang="ts" name="Role">
    import {
        listEmail,
        getEmaliDetail,
        delRole,
        addEmailAccount,
        updateEmail,
        changeEmalAccountStatus,
    } from "@/api/system/email";
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
    const emailList = ref<any[]>([]);
    // 弹出层标题
    const title = ref<any>('');
    // 是否显示弹出层
    const open = ref(false);
    // 是否显示弹出层（数据权限）
    const openDataScope = ref(false);
    const menuExpand = ref(false);
    const menuNodeAll = ref(false);
    const deptExpand = ref(false);
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
        appId: '',
        maNo: '',
        enable: '',
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined,
    })
    // 表单参数
    const rulesForm = ref({
        id: null,
        appId: null,
        maNo: null,
        fromsName: undefined,
        host: '',
        port: '',
        froms: '',
        user: undefined,
        pass: undefined,
        enable: ''
    })
    const defaultProps = ref({
        children: "children",
        label: "label",
    })
    // 表单校验
    const rules = ref({
        host: [
            { required: true, message: "服务地址不能为空", trigger: "blur" },
        ],
        fromsName: [
            { required: true, message: "发件箱名称不能为空", trigger: "blur" },
        ],
        port: [{ required: true, message: "端口号不能为空", trigger: "blur" }],
        froms: [{ required: true, message: "发件箱不能为空", trigger: "blur" }],
        user: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        pass: [{ required: true, message: "密码不能为空", trigger: "blur" }],
        enable: [
            { required: true, message: "启用停用状态不能为空", trigger: "blur" },
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
        Object.keys(obj).forEach((key) => {
            if (!obj[key]) {
                delete obj[key]
            }
        })
        listEmail(queryParams.value).then((response : any) => {
            emailList.value = response.rows;
            total.value = response.total;
            loading.value = false;
        });
    }
    /** 邮箱信息ID查询菜单树结构 */
    // getRoleMenuTreeselect(roleId) {
    //   return roleMenuTreeselect(roleId).then((response) => {
    //     this.menuOptions = response.menus;
    //     return response;
    //   });
    // },
    // 邮箱信息修改
    function handleStatusChange(row : any) {
        let text = row.enable ? "启用" : "停用";
        proxy!.$modal
            .confirm('确认要"' + text + '"账号吗？')
            .then(function () {
                return changeEmalAccountStatus(row);
            })
            .then(() => {
                proxy!.$modal.msgSuccess(text + "成功");
            })
            .catch(function () {
                // 正常来说应该在确认修改后再改按钮样式
                // 但是这样代码改动量最小
                row.enable = !row.enable;
            });
    }
    // // 取消按钮
    function cancel() {
        open.value = false;
        reset();
    }
    // 表单重置
    function reset() {
        // if (proxy!.$refs.menu != undefined) {
        //   proxy!.$refs.menu.setCheckedKeys([]);
        // }
        (menuExpand.value = false),
            (menuNodeAll.value = false),
            (deptExpand.value = true),
            (deptNodeAll.value = false),
            (rulesForm.value = {
                id: null,
                appId: null,
                maNo: null,
                fromsName: undefined,
                host: '',
                port: '',
                froms: '',
                user: undefined,
                pass: undefined,
                enable: ''
            });
        proxy!.resetForm("form");
    }
    /** 搜索按钮操作 */
    function handleQuery() {
        queryParams.value.pageNum = 1;
        // this.queryParams.appId = !!this.queryParams.appId
        //   ? this.queryParams.appId
        //   : undefined;
        // this.queryParams.maNo = !!this.queryParams.maNo
        //   ? this.queryParams.maNo
        //   : undefined;
        getList();
    }
    /** 重置按钮操作 */
    function resetQuery() {
        dateRange.value = [];
        proxy!.resetForm("queryForm");
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
        getEmaliDetail(id).then((response) => {
            rulesForm.value = response.data;
            open.value = true;
            title.value = "修改邮箱配置";
        });
    }
    /** 提交按钮 */
    const submitForm = async (formEl : FormInstance | undefined) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                if (rulesForm.value.id != undefined) {
                    updateEmail(rulesForm).then((response) => {
                        proxy?.$modal.msgSuccess("修改成功");
                        open.value = false;
                        getList();
                    });
                } else {
                    addEmailAccount(rulesForm).then((response) => {
                        proxy?.$modal.msgSuccess("新增成功");
                        open.value = false;
                        getList();
                    });
                }
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