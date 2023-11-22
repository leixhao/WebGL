<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item :label="$t('logininfor.address')" prop="ipaddr">
                <el-input v-model="queryParams.ipaddr" :placeholder="$t('logininfor.addressIpt')" clearable
                    style="width: 240px;" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item :label="$t('logininfor.name')" prop="userName">
                <el-input v-model="queryParams.userName" :placeholder="$t('logininfor.nameIpt')" clearable
                    style="width: 240px;" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item :label="$t('logininfor.status')" prop="status">
                <el-select v-model="queryParams.status" :placeholder="$t('logininfor.status')" clearable
                    style="width: 240px">
                    <el-option v-for="dict in sys_common_status" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('logininfor.time')">
                <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
                    range-separator="-" :start-placeholder="$t('logininfor.startDate')"
                    :end-placeholder="$t('logininfor.endDate')"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">{{ $t("button.search")
                }}</el-button>
                <el-button icon="Refresh" @click="resetQuery">{{ $t("button.reset") }}</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="danger" plain icon="Delete" size="small" :disabled="multiple" @click="handleDelete"
                    v-hasPermi="['system:logininfor:remove']">{{ $t("button.delete") }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="Delete" size="small" @click="handleClean"
                    v-hasPermi="['system:logininfor:remove']">{{ $t("button.remove") }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="Download" size="small" @click="handleExport"
                    v-hasPermi="['system:logininfor:export']">{{ $t("button.export") }}</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table ref="tables" v-loading="loading" :data="dataList" @selection-change="handleSelectionChange"
            :default-sort="defaultSort" @sort-change="handleSortChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column :label="$t('logininfor.num')" align="center" prop="infoId" />
            <el-table-column :label="$t('logininfor.name')" align="center" prop="userName" :show-overflow-tooltip="true"
                sortable="custom" :sort-orders="['descending', 'ascending']" />
            <el-table-column :label="$t('logininfor.address')" align="center" prop="ipaddr" width="130"
                :show-overflow-tooltip="true" />
            <el-table-column :label="$t('logininfor.status')" align="center" prop="status" :formatter="statusFormat" />
            <el-table-column :label="$t('logininfor.remarks')" align="center" prop="msg" />
            <el-table-column :label="$t('logininfor.visit')" align="center" prop="accessTime" sortable="custom"
                :sort-orders="['descending', 'ascending']" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.accessTime) }}</span>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
            @pagination="getList" />
    </div>
</template>
  
<script lang="ts" setup>
import { list, delLogininfor, cleanLogininfor } from "@/api/system/logininfor";
import { getCurrentInstance, ComponentInternalInstance, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox, Sort } from 'element-plus'

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_common_status } = proxy!.useDict('sys_common_status');
console.log(sys_common_status)
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
// const statusOptions = ref([]);
const dateRange = ref<any>([])
const dataList = ref([])
const defaultSort = ref<Sort>({ prop: 'loginTime', order: 'descending' })
const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
    ipaddr: undefined,
    userName: undefined,
    status: undefined,
    orderByColumn: undefined,
    isAsc: undefined
})
getList();
/** 查询登录日志列表 */
function getList() {
    loading.value = true;
    list(proxy?.addDateRange(queryParams.value, dateRange.value)).then((response: any) => {
        dataList.value = response.rows;
        total.value = response.total;
        loading.value = false;
    }
    );
}
// 登录状态字典翻译
function statusFormat(row: any) {
    return proxy?.selectDictLabel(sys_common_status.value, row.status);
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
function handleSelectionChange(selection: any) {
    ids.value = selection.map((item: any) => item.infoId)
    multiple.value = !selection.length
}
/** 排序触发事件 */
function handleSortChange(column: any, prop: any, order: any) {
    queryParams.value.orderByColumn = column.prop;
    queryParams.value.isAsc = column.order;
    getList();
}
/** 删除按钮操作 */
function handleDelete(row: any) {
    const infoIds = row.infoId || ids.value;
    ElMessageBox.confirm('是否确认删除访问编号为"' + infoIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).then(function () {
        return delLogininfor(infoIds);
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
    ElMessageBox.confirm('是否确认清空所有登录日志数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).then(function () {
        return cleanLogininfor();
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
    proxy?.download('system/logininfor/export', {
        ...queryParams.value
    }, `logininfor_${new Date().getTime()}.xlsx`)
}
</script>
  
  