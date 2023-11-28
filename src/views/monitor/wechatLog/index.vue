<template>
    <div class="app-container">

        <!-- <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="应用ID" prop="appId">
        <el-input
          v-model="queryParams.appId"
          placeholder="应用ID"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >{{ $t('button.search') }}</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >{{ $t('button.reset') }}</el-button
        >
      </el-form-item>
    </el-form> -->

        <!-- <el-row :gutter="10" class="mb20">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['monitor:operlog:remove']"
          >{{ $t('button.delete') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="handleClean"
          v-hasPermi="['monitor:operlog:remove']"
          >{{ $t('button.remove') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['monitor:operlog:export']"
          >{{ $t('button.export') }}</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row> -->

        <el-table class="table_divClass" ref="tables" v-loading="loading" :data="dataList"
            @selection-change="handleSelectionChange" :default-sort="defaultSort" @sort-change="handleSortChange">
            <!-- <el-table-column type="selection" align="center" fixed="left" width="50"/> -->
            <!-- <el-table-column label="ID" align="center" prop="id" min-width="100"/> -->
            <!-- <el-table-column label="应用APPID" align="center" prop="appId" min-width="150"/> -->
            <el-table-column label="配置CODE" align="center" prop="configNo" min-width="150" />
            <!-- <el-table-column label="key配置" align="center" prop="webHookKey" min-width="150"/> -->
            <el-table-column label="企业微信ID" align="center" prop="agentId" min-width="150" />
            <el-table-column label="企业微信应用ID" align="center" prop="corpId" min-width="180" />
            <!-- <el-table-column label="企业微信应用密钥" align="center" prop="corpSecret"  min-width="350"/> -->
            <!-- <el-table-column label="客户端ip" align="center" prop="clientIp" min-width="100"/> -->
            <!-- <el-table-column label="时长（秒）" align="center" prop="sometimes" min-width="100"/> -->
            <el-table-column label="收件人/@人员" align="center" prop="tos" min-width="120" />
            <!-- <el-table-column label="参数" align="center" prop="params"  :show-overflow-tooltip='true' min-width="100"/> -->
            <!-- <el-table-column label="内容" align="center" prop="content"  :show-overflow-tooltip='true' min-width="200"/> -->
            <el-table-column label="发送状态" align="center" prop="sendState" min-width="80">
                <template #default="scope">
                    <span v-if="scope.row.sendState == '1'">发送中</span>
                    <span v-if="scope.row.sendState == '2'">成功</span>
                    <span v-if="scope.row.sendState == '3'">失败</span>
                </template>
            </el-table-column>
            <el-table-column label="发送时间" align="center" prop="sendTime" min-width="160">
                <!-- <template slot-scope="scope">
          <span>{{scope.row.sendTime.split('T')}}</span>
        </template> -->
            </el-table-column>
            <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width"
                min-width="100">
                <template #default="scope">
                    <el-button size="small" link type="primary" icon="View" @click="handleView(scope.row)">{{
            $t('button.detail') }}</el-button>
                    <!-- <el-button size="mini" link type="primary" icon="el-icon-delete" @click="handleDelete(scope.row)">{{
              $t('button.withdraw') }}</el-button> -->
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 操作日志详细 -->
        <el-dialog title="操作日志详细" v-model="open" center append-to-body>
            <div class="demo-drawer__content">
                <el-form class="m20" ref="form" :model="rulesForm" label-width="100px" size="small"
                    label-position="left">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="应用ID:" v-if="rulesForm.appId">{{ rulesForm.appId }}</el-form-item>

                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="key配置:"
                                v-if="rulesForm.webHookKey">{{ rulesForm.webHookKey }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="配置CODE:"
                                v-if="rulesForm.configNo">{{ rulesForm.configNo }}</el-form-item>

                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="企业微信ID:"
                                v-if="rulesForm.agentId">{{ rulesForm.agentId }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="企业微信应用ID:" label-width="130" v-if="rulesForm.corpId">{{
                rulesForm.corpId
              }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="客户端IP:"
                                v-if="rulesForm.clientIp">{{ rulesForm.clientIp }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="企业微信应用密钥:" label-width="120" v-if="rulesForm.corpSecret">
                                <el-tooltip class="item" effect="dark" :content="rulesForm.corpSecret" placement="top">
                                    <div
                                        style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;word-break: break-all;">
                                        {{ rulesForm.corpSecret }}
                                    </div>
                                </el-tooltip>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="时长:"
                                v-if="rulesForm.sometimes">{{ rulesForm.sometimes }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="收件人/@人员:" label-width="120" v-if="rulesForm.tos">{{
                rulesForm.tos
              }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发送状态:" v-if="rulesForm.sendState != ''">
                                <span v-if="rulesForm.sendState == '1'">发送中</span>
                                <span v-if="rulesForm.sendState == '2'">成功</span>
                                <span v-if="rulesForm.sendState == '3'">失败</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="发送时间:" v-if="rulesForm.sendTime">{{ rulesForm.sendTime }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="参数:" label-width="120" v-if="rulesForm.params">{{
                rulesForm.params
              }}</el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="消息内容:" label-width="120" v-if="rulesForm.content">{{
                rulesForm.content
              }}</el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="demo-drawer__footer">
                    <el-button class="pull-right" size="small" @click="open = false">关 闭</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
    import { list, delOperlog, cleanOperlog } from "@/api/monitor/wechatLog";
    import moment from "moment";

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
        title: undefined,
        operName: undefined,
        businessType: undefined,
        status: undefined,
        appId: undefined,
        orderByColumn: undefined,
        isAsc: undefined
    })
    // 表单参数
    const rulesForm = ref({
        id: null,
        tpName: undefined,
        title: undefined,
        mtNo: undefined,
        appId: undefined,
        webHookKey: undefined,
        configNo: undefined,
        agentId: undefined,
        corpId: undefined,
        clientIp: undefined,
        corpSecret: undefined,
        sometimes: undefined,
        tos: undefined,
        sendState: undefined,
        sendTime: undefined,
        params: undefined,
        content: undefined
    })
    const defaultSort = ref<Sort>({ prop: 'operTime', order: 'descending' });
    getList();
    /** 查询登录日志 */
    function getList() {
        loading.value = true;
        list(queryParams.value).then((response : any) => {
            dataList.value = response.rows.map((item : any) => {
                item.sendTime = moment(item.sendTime).format("YYYY-MM-DD");
                return item;
            });
            console.log(dataList.value);
            total.value = response.total;
            loading.value = false;
        });
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
        open.value = true;
        rulesForm.value = row;
    }
    /** 撤回按钮操作 */
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