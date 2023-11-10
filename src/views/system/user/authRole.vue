<template>
    <div class="app-container">
        <h4 class="form-header h4">{{ $t("tips.basicInformation") }}</h4>
        <el-form ref="form" :model="form" label-width="120px">
            <el-row>
                <el-col :span="8" :offset="2">
                    <el-form-item :label="$t('user.userNickName')" prop="nickName">
                        <el-input v-model="form.nickName" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="8" :offset="2">
                    <el-form-item :label="$t('login.username')" prop="phonenumber">
                        <el-input v-model="form.userName" disabled />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <h4 class="form-header h4">{{ $t("tips.roleInformation") }}</h4>
        <el-table v-loading="loading" :row-key="getRowKey" @row-click="clickRow" ref="table"
            @selection-change="handleSelectionChange" :data="roles.slice((pageNum - 1) * pageSize, pageNum * pageSize)">
            <el-table-column :label="$t('role.index')" type="index" align="center" width="55">
                <template #default="scope">
                    <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
                </template>
            </el-table-column>
            <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
            <el-table-column :label="$t('role.id')" align="center" prop="roleId" />
            <el-table-column :label="$t('role.name')" align="center" prop="roleName" />
            <el-table-column :label="$t('role.key')" align="center" prop="roleKey" />
            <el-table-column :label="$t('public.createTime')" align="center" prop="createTime" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" v-model:page="pageNum" v-model:limit="pageSize" :total="total" />

        <el-form label-width="100px">
            <div style="text-align: center; margin-left: -120px; margin-top: 30px">
                <el-button type="primary" @click="submitForm()">{{ $t("button.submit") }}</el-button>
                <el-button @click="close()">{{ $t("button.back") }}</el-button>
            </div>
        </el-form>
    </div>
</template>

<script setup name="AuthRole" lang="ts">
import { getAuthRole, updateAuthRole } from '@/api/system/user';
import { parseTime } from '@/utils/ruoyi';
import { getCurrentInstance, ComponentInternalInstance, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const loading = ref(true);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(10);
const roleIds = ref<any[]>([]);
const roles = ref<any[]>([]);
const form = ref({
    nickName: undefined,
    userName: undefined,
    userId: undefined,
});

/** 单击选中行数据 */
function clickRow(row: any) {
    (proxy?.$refs['roleRef'] as any).toggleRowSelection(row);
}
/** 多选框选中数据 */
function handleSelectionChange(selection: any[]) {
    roleIds.value = selection.map(item => item.roleId);
}
/** 保存选中的数据编号 */
function getRowKey(row: any) {
    return row.roleId;
}
/** 关闭按钮 */
function close() {
    const obj = { path: '/system/user' };
    proxy!.$tab.closeOpenPage(obj);
}
/** 提交按钮 */
function submitForm() {
    const userId = form.value.userId;
    const rIds = roleIds.value.join(',');
    updateAuthRole({ userId: userId, roleIds: rIds }).then(response => {
        proxy!.$modal.msgSuccess('授权成功');
        close();
    });
}

(() => {
    const userId = route.params && route.params.userId;
    console.log(userId)
    if (userId) {
        loading.value = true;
        getAuthRole(userId).then((response: any) => {
            form.value = response.user;
            roles.value = response.roles;
            total.value = roles.value.length;
            nextTick(() => {
                roles.value.forEach(row => {
                    if (row.flag) {
                        (proxy?.$refs['roleRef'] as any).toggleRowSelection(row);
                    }
                });
            });
            loading.value = false;
        });
    }
})();
</script>
