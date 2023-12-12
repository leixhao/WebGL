<template>
  <el-drawer v-model="open" title="I am the title" append-to-body :with-header="false" @close="handleColse" :size="600">
    <div class="matrix-profile-content">
      <div class="profile-header">
        <div class="profile-left">
          <img src="@/assets/images/profile.jpg" width="70" alt="dark" />
        </div>
        <div class="profile-right">
          <div class="profile-text">
            {{ Info.matrixName }}
          </div>
          <div>
            <span class="profile-name">{{ Info.createByName }}</span>
            <span class="profile-time">{{ Info.createTime }}</span>
          </div>
        </div>
      </div>
      <div class="profile-content">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="对象属性" name="first">
            <Form ref="form" @update="update"></Form>
          </el-tab-pane>
          <!-- <el-tab-pane label="相关对象" name="second">
            <div class="left-button">
              <el-tooltip content="导出" placement="bottom" effect="dark">
                <el-button
                  @click="handleUpload(1)"
                  type="primary"
                  plain
                  circle
                  icon="Download"
                />
              </el-tooltip>
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
                  prop="current"
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
                  prop="createByName"
                  show-overflow-tooltip
                  align="center"
                  label="创建者"
                />
                <el-table-column
                  prop="createTime"
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
            </div>
            </div>
          </el-tab-pane> -->
          <el-tab-pane label="相关文档" name="third">
            <Associated ref="AssociatedRefs" @update:modelValue="getList"></Associated>
          </el-tab-pane>
          <el-tab-pane label="修改记录" name="fourth">
            <Steps ref="stepRefs"></Steps>
          </el-tab-pane>
          <el-tab-pane label="历史记录" name="fifth">
            <div class="left-button">
              <!-- <el-tooltip content="上传" placement="bottom" effect="dark">
                <el-button @click="handleUpload(2)" type="primary" plain circle icon="DocumentAdd" />
              </el-tooltip> -->
            </div>
            <div class="table-container">
              <el-table :data="fifthTable" border style="width: 100%">
                <!-- <el-table-column prop="code" show-overflow-tooltip align="center" label="编号">
                </el-table-column> -->
                <!-- <el-table-column prop="name" show-overflow-tooltip align="center" label="名称" /> -->
                <el-table-column prop="current" show-overflow-tooltip align="center" label="新版本" />
                <el-table-column prop="old" show-overflow-tooltip align="center" label="旧版本" />
                <!-- <el-table-column prop="name" show-overflow-tooltip align="center" label="状态" />
                <el-table-column prop="name" show-overflow-tooltip align="center" label="所有者" /> -->
                <el-table-column prop="createByName" show-overflow-tooltip align="center" label="创建者" />
                <el-table-column prop="createTime" show-overflow-tooltip align="center" width="180" label="创建时间" />
                <!-- <el-table-column prop="name" show-overflow-tooltip align="center" label="修改者" />
                <el-table-column prop="name" show-overflow-tooltip align="center" width="180" label="修改时间" />
                <el-table-column prop="name" show-overflow-tooltip align="center" width="200" label="备注" /> -->
              </el-table>
              <!-- <div class="page-container">
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
              </div> -->
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <UploadFile url="http://www.baidu.com" @update="show = false" :open="show"></UploadFile>
    </div>
  </el-drawer>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ComponentInternalInstance, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { Edit, Picture, UploadFilled } from "@element-plus/icons-vue";
import { getMatrixDetail, getUpVersionLog } from "@/api/template/matrix";
import { useI18n } from "vue-i18n";
import Form from "./../components/Form.vue";
import Steps from "./../components/Steps.vue";
import Associated from "./../components/Associated.vue";
import Header from "./../components/table-header.vue";
import UploadFile from "./../components/Upload-File.vue";
const { t } = useI18n();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
let open = ref(false);
let activeName = ref("first");
const Info = ref({
  matrixName: undefined,
  createByName: undefined,
  createTime: undefined
});
const name = ref()
const form = ref();
const AssociatedRefs = ref();
const stepRefs = ref();
const Row = ref({
  id: null,
});
const emit = defineEmits(["update"]);
function update() {
  emit("update");
  (proxy?.$refs['stepRefs'] as any)?.init(Row.value.id);
}
function toogleShow(row: any) {
  Row.value = row;
  getList();
  getUpVersionLogList();
  open.value = true;
}
function handleColse() {
  activeName.value = "first";
}
// 获取详情
function getList() {
  getMatrixDetail({
    matrixId: Row.value?.id,
  }).then((res) => {
    name.value = res.data.matrixName;
    Info.value = JSON.parse(JSON.stringify(res.data));
    form.value?.init(res.data);
    AssociatedRefs.value?.init({
      id: Info.value?.id,
      matrixContents: Info.value?.matrixContents,
      matrixAttachments: Info.value?.matrixAttachments,
    });
    stepRefs.value?.init(Info.value.id);
  });
}
const fifthTable = ref([]);
function getUpVersionLogList() {
  console.log(Row.value)
  getUpVersionLog({
    id: Row.value?.parentId,
  }).then((res) => {
    console.log(res)
    fifthTable.value = res!.rows;
  });
}
const show = ref(false);
function handleUpload(type: number) {
  if (type == 1) {
  } else {
    show.value = true;
  }
}
const tableData = ref([]);
function handleClick(tab: object) { }
defineExpose({
  toogleShow,
});
</script>
<style scoped lang="scss">
.matrix-profile-content {
  padding: 0 10px;
  height: 100%;

  .left-button {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .profile-header {
    display: flex;

    .profile-left {
      margin-right: 25px;

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
    padding: 10px 0;
    height: calc(100% - 60px);

    .el-tabs {
      height: 100%;

      :deep(.el-tabs__content) {
        height: calc(100% - 50px);

        .el-tab-pane {
          height: 100%;
        }
      }
    }
  }
}
</style>
