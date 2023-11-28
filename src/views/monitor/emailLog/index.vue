<template>
    <div class="app-container">
        <!-- <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="应用ID" prop="appId">
        <el-input v-model="queryParams.appId" placeholder="应用ID" clearable size="small" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('button.search')
        }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('button.reset') }}</el-button>
      </el-form-item>
    </el-form> -->

        <el-row :gutter="10" class="mb20">
            <el-col :span="1.5">
                <el-button type="danger" plain icon="Delete" size="small" :disabled="multiple" @click="handleDelete">{{
          $t('button.delete') }}</el-button>
            </el-col>
            <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="handleClean"
          >清空</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          >导出</el-button
        >
      </el-col> -->
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <div class="table_divClass">
            <el-table class="table_class" ref="tables" v-loading="loading" :data="dataList"
                @selection-change="handleSelectionChange" :default-sort="defaultSort" @sort-change="handleSortChange">
                <el-table-column type="selection" align="center" width="50" fixed="left" />
                <!-- <el-table-column label="应用ID" align="center" prop="appId" min-width="280"/> -->
                <el-table-column label="标题" align="center" prop="title" min-width="200" />
                <el-table-column label="邮箱CODE" align="center" prop="maNo" min-width="120" />
                <el-table-column label="模版CODE" align="center" prop="mtNo" min-width="120" />
                <!-- <el-table-column label="服务器" align="center" prop="host" min-width="120"/> -->
                <el-table-column label="发件箱" align="center" prop="froms" min-width="250" />
                <!-- <el-table-column label="客户端IP" align="center" prop="clientIp" min-width="120"/> -->
                <!-- <el-table-column label="端口号" align="center" prop="port" min-width="80"/> -->
                <el-table-column label="发送状态" align="center" prop="sendState" min-width="80">
                    <template #default="scope">
                        <span v-if="scope.row.sendState == '1'">发送中</span>
                        <span v-if="scope.row.sendState == '2'">成功</span>
                        <span v-if="scope.row.sendState == '3'">失败</span>
                    </template>
                </el-table-column>
                <el-table-column label="发送时间" align="center" prop="sendTime" min-width="160">
                    <template #default="scope">
                        <span>{{ scope.row.sendTime.split('T')[0] }}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="时长（秒）" align="center" prop="sometimes" min-width="100"/> -->
                <el-table-column label="创建人" align="center" prop="createBy" min-width="100" />
                <el-table-column label="创建时间" align="center" prop="createTime" min-width="100" />
                <el-table-column fixed="right" min-width="100" label="操作" align="center"
                    class-name="small-padding fixed-width">
                    <template #default="scope">
                        <el-button size="small" link type="primary" icon="View" @click="handleView(scope.row)">{{
              $t('button.detail') }}</el-button>
                        <el-button size="small" link type="primary" icon="Delete" @click="handleDelete(scope.row)">{{
              $t('button.delete') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>


        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 操作日志详细 -->

        <el-dialog title="操作日志详细" v-model="open" center append-to-body>
            <div class="demo-drawer__content ">
                <el-form class="m20" ref="ruleFormRef" :model="rulesForm" label-width="100px" size="small"
                    label-position="left">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item left label="模板名称:" v-if="rulesForm.tpName">{{
                rulesForm.tpName
              }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item left label="标题:" v-if="rulesForm.title">{{ rulesForm.title }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="邮箱模板编码:" label-width="130" v-if="rulesForm.mtNo">{{
                rulesForm.mtNo
              }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="应用ID:" v-if="rulesForm.appId">{{ rulesForm.appId }}</el-form-item>

                        </el-col>
                        <el-col :span="12">

                            <el-form-item label="邮箱配置编码:" label-width="130" v-if="rulesForm.maNo">{{
                rulesForm.maNo
              }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发件人:" v-if="rulesForm.froms">{{ rulesForm.froms }}</el-form-item>
                        </el-col>
                        <el-col :span="12">

                            <el-form-item label="抄送人:" v-if="rulesForm.ccs">{{ rulesForm.ccs }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="收件人:" v-if="rulesForm.tos">{{ rulesForm.tos }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="密送人:" v-if="rulesForm.bccs">{{ rulesForm.bccs }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="客户端:" v-if="rulesForm.clientIp">{{ rulesForm.clientIp }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发送时间:"
                                v-if="rulesForm.sendTime">{{ rulesForm.sendTime }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="时长:"
                                v-if="rulesForm.sometimes">{{ rulesForm.sometimes }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发送状态:" v-if="rulesForm.sendState && rulesForm.sendState != ''">
                                <span v-if="rulesForm.sendState == '1'">发送中</span>
                                <span v-if="rulesForm.sendState == '2'">成功</span>
                                <span v-if="rulesForm.sendState == '3'">失败</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="内容：" v-if="rulesForm.content">{{ rulesForm.content }}</el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="错误信息:"
                                v-if="rulesForm.errorLog">{{ rulesForm.errorLog }}</el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="附件:" v-if="rulesForm.fileUrlsFm">
                                <a style="color:#409EFF;display: block;" v-for="(item, index) in rulesForm.fileUrlsFm"
                                    :href="item.fileUrl" :key="index">
                                    {{ item.fileName }}
                                </a>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="demo-drawer__footer">
                    <el-button class="pull-right" size="small" @click="handleClose">关 闭</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
    import moment from "moment";
    import {
        list,
        delOperlog,
        cleanOperlog,
        emailLogDetail,
    } from "@/api/monitor/emailLog";
    import { parseTime } from '@/utils/ruoyi';
    import { Sort } from 'element-plus';
    import { getCurrentInstance, ComponentInternalInstance, ref } from 'vue';
    import type { FormInstance, FormRules } from 'element-plus'

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const { sys_oper_type, sys_common_status } = proxy!.useDict('sys_oper_type', 'sys_common_status');

    const ruleFormRef = ref<FormInstance>();
    const dataList = ref([]);
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
    // 日期范围
    const dateRange = ref<any[]>([]);
    // 查询参数
    const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        orderByColumn: undefined,
        isAsc: undefined,
        appId: undefined,
    })
    // 表单参数
    const rulesForm = ref({
        id: null,
        tpName: undefined,
        title: undefined,
        mtNo: undefined,
        appId: undefined,
        maNo: undefined,
        froms: undefined,
        ccs: undefined,
        tos: undefined,
        bccs: undefined,
        clientIp: undefined,
        sometimes: undefined,
        sendState: undefined,
        content: undefined,
        errorLog: undefined,
        fileUrlsFm: undefined,
        sendTime: '',
        enable: ''
    })
    const defaultSort = ref<Sort>({ prop: 'operTime', order: 'descending' });
    getList();
    function handleClose() {
        open.value = false;
    }
    /** 查询登录日志 */
    function getList() {
        loading.value = true;
        list(proxy?.addDateRange(queryParams.value, dateRange.value)).then(
            (response : any) => {
                dataList.value = response.rows;
                console.log(dataList);
                total.value = response.total;
                loading.value = false;
            }
        );
    }
    // 操作日志类型字典翻译
    function typeFormat(row : any, column : any) {
        return proxy?.selectDictLabel(
            sys_oper_type,
            row.businessType
        );
    }
    /** 搜索按钮操作 */
    function handleQuery() {
        queryParams.value.pageNum = 1;
        queryParams.value.appId = !!queryParams.value.appId
            ? queryParams.value.appId
            : undefined;
        getList();
    }
    /** 重置按钮操作 */
    function resetQuery() {
        dateRange.value = [];
        proxy?.resetForm("queryForm");
        (proxy?.$refs.tables as any).sort(defaultSort.value.prop, defaultSort.value.order);
        handleQuery();
    }
    /** 多选框选中数据 */
    function handleSelectionChange(selection : any) {
        ids.value = selection.map((item : any) => item.id);
        multiple.value = !selection.length;
    }
    /** 排序触发事件 */
    function handleSortChange(column : any, prop : any, order : any) {
        queryParams.value.orderByColumn = column.prop;
        queryParams.value.isAsc = column.order;
        getList();
    }
    /** 详细按钮操作 */
    function handleView(row : any) {
        emailLogDetail(row).then((response : any) => {
            console.log(response.data);
            rulesForm.value = response.data;
            rulesForm.value.sendTime = moment(response.data.sendTime).format("YYYY-MM-DD");
        });
        open.value = true;
    }
    /** 删除按钮操作 */
    function handleDelete(row : any) {
        const operIds = row.id || ids.value;
        proxy?.$modal
            .confirm('是否确认删除日志编号为"' + operIds + '"的数据项？')
            .then(function () {
                return delOperlog(operIds);
            })
            .then(() => {
                getList();
                proxy?.$modal.msgSuccess("删除成功");
            })
            .catch(() => { });
    }
    /** 清空按钮操作 */
    function handleClean() {
        proxy?.$modal
            .confirm("是否确认清空所有操作日志数据项？")
            .then(function () {
                return cleanOperlog();
            })
            .then(() => {
                getList();
                proxy?.$modal.msgSuccess("清空成功");
            })
            .catch(() => { });
    }
    /** 导出按钮操作 */
    function handleExport() {
        proxy?.download(
            "monitor/operlog/export",
            {
                ...queryParams.value,
            },
            `operlog_${new Date().getTime()}.xlsx`
        );
    }
</script>
<style lang="scss" scoped>
    .table_divClass {

        width: 100%;
        overflow-x: auto !important;
    }

    .table_class {
        // max-height: calc(100vh - 250px);
        overflow-y: auto !important;
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