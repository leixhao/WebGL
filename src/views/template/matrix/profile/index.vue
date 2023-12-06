<template>
  <el-drawer
    v-model="open"
    title="I am the title"
    append-to-body
    :with-header="false"
    :size="600"
  >
    <div class="matrix-profile-content">
      <div class="profile-header">
        <div class="profile-left">
          <img src="@/assets/images/profile.jpg" width="70" alt="dark" />
        </div>
        <div class="profile-right">
          <div class="profile-text">
            EACH-WI-PS-0356,RevA0 组合式空调设施自主性维护检查说明
          </div>
          <div>
            <span class="profile-name">San.Zhang</span
            ><span class="profile-time">2023/08/21 15:26:30 CST</span>
          </div>
        </div>
      </div>
      <div class="profile-content">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="Properties" name="first">
            <Form></Form>
          </el-tab-pane>
          <el-tab-pane label="Relations" name="second">
            <Header></Header>
            <div class="table-container">
              <el-table :data="tableData" border style="width: 100%">
                <el-table-column
                  prop="code"
                  show-overflow-tooltip
                  align="center"
                  label="编号"
                >
                </el-table-column>
                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  align="center"
                  label="名称"
                />
                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  align="center"
                  label="版本"
                />
                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  align="center"
                  label="阶段"
                />
                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  align="center"
                  label="状态"
                />
                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  align="center"
                  label="所有者"
                />
                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  align="center"
                  label="创建者"
                />
                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  align="center"
                  width="180"
                  label="创建时间"
                />
                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  align="center"
                  label="修改者"
                />
                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  align="center"
                  width="180"
                  label="修改时间"
                />
              </el-table>
              <div class="page-container">
                <el-pagination
                  small
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="page.currentPage"
                  :page-sizes="[10, 20, 50, 100, 200]"
                  :page-size="page.pageSize"
                  layout="total, sizes, prev, pager, next,jumper"
                  :total="page.total"
                >
                </el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Contents/Attachments" name="third">
            <Associated ref="AssociatedRefs"></Associated>
          </el-tab-pane>
          <el-tab-pane label="Change Logs" name="fourth">
            <Steps ref="stepRefs"></Steps>
          </el-tab-pane>
          <el-tab-pane label="Revision" name="fifth">
            <Header></Header>
            <div class="table-container">
              <el-table :data="tableData" border style="width: 100%">
                <el-table-column
                  prop="code"
                  show-overflow-tooltip
                  align="center"
                  label="编号"
                >
                </el-table-column>
                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  align="center"
                  label="名称"
                />
                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  align="center"
                  label="版本"
                />
                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  align="center"
                  label="状态"
                />
                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  align="center"
                  label="所有者"
                />
                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  align="center"
                  label="创建者"
                />
                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  align="center"
                  width="180"
                  label="创建时间"
                />
                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  align="center"
                  label="修改者"
                />
                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  align="center"
                  width="180"
                  label="修改时间"
                />
                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  align="center"
                  width="200"
                  label="备注"
                />
              </el-table>
              <div class="page-container">
                <el-pagination
                  small
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="page.currentPage"
                  :page-sizes="[10, 20, 50, 100, 200]"
                  :page-size="page.pageSize"
                  layout="total, sizes, prev, pager, next,jumper"
                  :total="page.total"
                >
                </el-pagination>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-drawer>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ComponentInternalInstance, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { Edit, Picture, UploadFilled } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import Form from "./../components/Form.vue";
import Steps from "./../components/Steps.vue";
import Associated from "./../components/Associated.vue";
import Header from "./../components/table-header.vue";
const { t } = useI18n();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const ruleFormRef = ref<FormInstance>();
const queryForm = ref<FormInstance>();
let open = ref(false);
let activeName = ref("first");
function toogleShow() {
  open.value = !open.value;
}
const page = ref({
  currentPage: 1,
  pageSize: 20,
  total: 0,
});
const stepRefs = ref(null);
const tableData = ref([]);
function handleClick(tab: object) {
  console.log(tab);
}
function handleSizeChange(e: number) {}
function handleCurrentChange(e: number) {}
defineExpose({
  toogleShow,
});
</script>
<style scoped lang="scss">
.matrix-profile-content {
  padding: 0 10px;
  height: 100%;

  .profile-header {
    display: flex;

    .profile-left {
      margin-right: 70px;

      img {
        border-radius: 10px;
      }
    }

    .profile-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 25px;

      .profile-text {
        font-weight: 600;
        font-family: system-ui;
        font-size: 15px;
      }

      .profile-name {
        display: inline-block;
        font-weight: 500;
        margin-right: 10px;
      }

      .profile-time {
        opacity: 0.7;
      }
    }
  }
  .profile-content {
    padding: 10px;
    height: calc(100% - 60px);
    .el-tabs {
      height: 100%;
      :deep(.el-tabs__content) {
        height: calc(100% - 50px);
        .el-tab-pane{
          height:100%;
        }
      }
    }
  }
}
</style>
