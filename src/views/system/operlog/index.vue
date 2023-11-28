<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item :label="$t('operlog.module')" prop="title">
                <el-input v-model="queryParams.title" :placeholder="$t('operlog.moduleIpt')" clearable
                    style="width: 240px;" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item :label="$t('operlog.name')" prop="operName">
                <el-input v-model="queryParams.operName" :placeholder="$t('operlog.nameIpt')" clearable
                    style="width: 240px;" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item :label="$t('operlog.type')" prop="businessType">
                <el-select v-model="queryParams.businessType" :placeholder="$t('operlog.type')" clearable
                    style="width: 240px">
                    <el-option v-for="dict in sys_oper_type" :key="dict.dictValue" :label="dict.dictLabel"
                        :value="dict.dictValue" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('operlog.status')" prop="status">
                <el-select v-model="queryParams.status" :placeholder="$t('operlog.status')" clearable
                    style="width: 240px">
                    <el-option v-for="dict in sys_common_status" :key="dict.dictValue" :label="dict.dictLabel"
                        :value="dict.dictValue" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('operlog.time')">
                <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
                    range-separator="-" :start-placeholder="$t('operlog.startDate')"
                    :end-placeholder="$t('operlog.endDate')"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">{{ $t("button.search")
        }}</el-button>
                <el-button icon="Refresh" @click="resetQuery">{{ $t("button.reset") }}</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" size="small"
                    v-hasPermi="['system:operlog:remove']">{{ $t("button.delete") }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="Delete" @click="handleClean" size="small"
                    v-hasPermi="['system:operlog:remove']">{{ $t("button.remove") }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="Download" @click="handleExport" size="small"
                    v-hasPermi="['system:operlog:export']">{{ $t("button.export") }}</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table ref="tables" v-loading="loading" :data="dataList" @selection-change="handleSelectionChange"
            :default-sort="defaultSort" @sort-change="handleSortChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column :label="$t('operlog.log')" align="center" prop="operId" />
            <el-table-column :label="$t('operlog.module')" align="center" prop="title" />
            <el-table-column :label="$t('operlog.type')" align="center" prop="businessType" :formatter="typeFormat" />
            <el-table-column :label="$t('operlog.req')" align="center" prop="requestMethod" />
            <el-table-column :label="$t('operlog.name')" align="center" prop="operName" :show-overflow-tooltip="true"
                sortable="custom" :sort-orders="['descending', 'ascending']" width="100" />
            <el-table-column :label="$t('operlog.engine')" align="center" prop="operIp" width="130"
                :show-overflow-tooltip="true" />
            <el-table-column :label="$t('operlog.status')" align="center" prop="status" :formatter="statusFormat" />
            <el-table-column :label="$t('operlog.time')" align="center" prop="operTime" sortable="custom"
                :sort-orders="['descending', 'ascending']" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.operTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('operlog.action')" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-button link type="primary" icon="View" @click="handleView(scope.row)"
                        v-hasPermi="['system:operlog:query']">详细</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 操作日志详细 -->
        <el-dialog title="操作日志详细" v-model="open" width="700px" append-to-body>
            <el-form ref="form" :model="rulesForm" label-width="100px">
                <el-row>
                    <el-col :span="12" v-if="rulesForm.title">
                        <el-form-item :label="$t('operlog.module') + ':'">{{ rulesForm.title }} / {{ typeFormat(rulesForm)
            }}</el-form-item>

                    </el-col>
                    <el-col :span="12" v-if="rulesForm.operUrl">
                        <el-form-item :label="$t('operlog.adress') + ':'">{{ rulesForm.operUrl }}</el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="rulesForm.operIp">
                        <el-form-item :label="$t('operlog.info') + ':'">{{ rulesForm.operName }} / {{ rulesForm.operIp
            }}</el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="rulesForm.requestMethod">
                        <el-form-item :label="$t('operlog.req') + ':'">{{ rulesForm.requestMethod }}</el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="rulesForm.method">
                        <el-form-item :label="$t('operlog.method') + ':'">{{ rulesForm.method }}</el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="rulesForm.operParam">
                        <el-form-item :label="$t('operlog.actParam') + ':'">{{ rulesForm.operParam }}</el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="rulesForm.jsonResult">
                        <el-form-item :label="$t('operlog.nextParam') + ':'">{{ rulesForm.jsonResult }}</el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="rulesForm.status !== null">
                        <el-form-item :label="$t('operlog.status') + ':'">
                            <div v-if="rulesForm.status === 0">正常</div>
                            <div v-else-if="rulesForm.status === 1">失败</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="rulesForm.operTime">
                        <el-form-item
                            :label="$t('operlog.time') + ':'">{{ parseTime(rulesForm.operTime) }}</el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="rulesForm.status === 1">
                        <el-form-item :label="$t('operlog.abnormal') + ':'">{{ rulesForm.errorMsg }}</el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="open = false">{{ $t("button.off") }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
    import { list, delOperlog, cleanOperlog } from "@/api/system/operlog";
    import { getCurrentInstance, ComponentInternalInstance, ref } from 'vue';
    import type { FormInstance, FormRules, TableColumnCtx } from 'element-plus'
    import { ElMessage, ElMessageBox, Sort } from 'element-plus'
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const { sys_common_status, sys_oper_type } = proxy!.useDict('sys_common_status', 'sys_oper_type');
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
    const open = ref(false);
    // const statusOptions = ref([]);
    const dateRange = ref<any>([])
    const dataList = ref([])
    const defaultSort = ref<Sort>({ prop: 'loginTime', order: 'descending' })
    const rulesForm = ref({
        title: undefined,
        operUrl: undefined,
        operIp: undefined,
        operName: undefined,
        requestMethod: undefined,
        method: undefined,
        operParam: undefined,
        jsonResult: undefined,
        status: undefined,
        operTime: undefined,
        errorMsg: undefined,
    });
    const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        operName: undefined,
        businessType: undefined,
        status: undefined,
        orderByColumn: undefined,
        isAsc: undefined
    })
    getList()
    /** 查询登录日志 */
    function getList() {
        loading.value = true;
        list(proxy?.addDateRange(queryParams.value, dateRange.value)).then((response : any) => {
            dataList.value = response.rows;
            total.value = response.total;
            loading.value = false;
        }
        );
    }
    interface User {
        // date: string
        // name: string
        // address: string
        title : undefined,
        operUrl : undefined,
        operIp : undefined,
        operName : undefined,
        requestMethod : undefined,
        method : undefined,
        operParam : undefined,
        jsonResult : undefined,
        status : undefined,
        operTime : undefined,
        errorMsg : undefined,
    }
    // 操作日志状态字典翻译
    function statusFormat(row : any, column : TableColumnCtx<User>) {
        return proxy?.selectDictLabel(sys_common_status.value, row.status);
    }
    // 操作日志类型字典翻译
    function typeFormat(row : any, column : TableColumnCtx<User>) {
        return proxy?.selectDictLabel(sys_oper_type.value, row.businessType);
    }
    /** 搜索按钮操作 */
    function handleQuery() {
        queryParams.value.pageNum = 1;
        getList();
    }
    /** 重置按钮操作 */
    function resetQuery() {
        dateRange.value = [];
        proxy?.resetForm("queryForm");
        (proxy?.$refs.tables as any).sort(defaultSort.value.prop, defaultSort.value.order)
        handleQuery();
    }
    /** 多选框选中数据 */
    function handleSelectionChange(selection : any) {
        ids.value = selection.map((item : any) => item.operId)
        multiple.value = !selection.length
    }
    /** 排序触发事件 */
    function handleSortChange(column : any, prop : any, order : any) {
        queryParams.value.orderByColumn = column.prop;
        queryParams.value.isAsc = column.order;
        getList();
    }
    /** 详细按钮操作 */
    function handleView(row : any) {
        open.value = true;
        rulesForm.value = row;
    }
    /** 删除按钮操作 */
    function handleDelete(row : any) {
        const operIds = row.operId || ids.value;
        ElMessageBox.confirm('是否确认删除日志编号为"' + operIds + '"的数据项?', "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(function () {
            return delOperlog(operIds);
        }).then(() => {
            getList();
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
        }).catch(() => { });
    }
    /** 清空按钮操作 */
    function handleClean() {
        ElMessageBox.confirm('是否确认清空所有操作日志数据项?', "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(function () {
            return cleanOperlog();
        }).then(() => {
            getList();
            ElMessage({
                type: 'success',
                message: '清空成功',
            })
        }).catch(() => { });
    }
    /** 导出按钮操作 */
    function handleExport() {
        proxy?.download('system/operlog/export', {
            ...queryParams.value
        }, `operlog_${new Date().getTime()}.xlsx`)
    }
</script>