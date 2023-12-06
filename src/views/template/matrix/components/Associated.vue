<template>
  <!-- 关联文档组件 -->
  <div class="Associated-Page">
    <ul>
      <li v-for="v in list" :key="v.id">
        <div class="left-name">
          <span>{{ v.name }}</span>
          <p>{{ v.subTitle }}</p>
        </div>
        <div class="right-controller">
          <div class="block">
            <div class="upload-icon">
              <el-tooltip content="上传" placement="bottom" effect="dark">
                <el-icon @click="handleUpload(v)"><Upload /></el-icon>
              </el-tooltip>
            </div>
            <div class="icon-list">
              <el-tooltip content="查阅" placement="bottom" effect="dark">
                <el-icon><View /></el-icon>
              </el-tooltip>
              <el-tooltip content="下载" placement="bottom" effect="dark">
                <el-icon><Download /></el-icon>
              </el-tooltip>
              <el-tooltip content="替换" placement="bottom" effect="dark">
                <el-icon  @click="handleUpload(v)"><Switch /></el-icon> </el-tooltip
              ><el-tooltip content="删除" placement="bottom"  effect="dark">
                <el-icon @click="handleDelete(v)"><Delete /></el-icon>
              </el-tooltip>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <UploadFile url="http://www.baidu.com" @update="show=false" :open="show"></UploadFile>
  </div>
</template>

<script lang="ts" setup>
import UploadFile from "./Upload-File.vue"
import { ref,getCurrentInstance, ComponentInternalInstance, } from "vue";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const list = ref([
  {
    id: 1,
    name: "Content",
    subTitle: "相关文档变更矩阵.xlsx",
  },
  {
    id: 2,
    name: "Attachments",
    subTitle: "客户要求.xlsx",
  },
  {
    id: 3,
    name: "Attachments",
    subTitle: "客户要求.ppt",
  },
  {
    id: 4,
    name: "Attachments",
    subTitle: "客户要求.doc",
  },
  {
    id: 5,
    name: "Attachments",
    subTitle: "客户要求.pdf",
  },
]);
const show=ref(false)
function handleUpload(row:object){
  console.log(row);
  show.value=true;
}
function handleDelete(row:any){
  proxy?.$modal
        .confirm('是否确认删除定时名称为"' + row?.name + '"的数据项?')
        .then(function () {
            return ;
        })
        .then(() => {
            proxy!.$modal.msgSuccess('删除成功');
        });
}
</script>
<style lang="scss" scoped>
.Associated-Page {
  ul {
    max-height:600px;
    overflow: auto;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding:10px 15px;
      line-height: 35px;
      width: 100%;
      border: 1px solid #c5c5c5;
      border-radius: 4px;
      .left-name {
        span {
          text-decoration: underline;
          font-size: 16px;
          color: #656565;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
        }
        p {
          color: #959595;
          font-size: 13px;
        }
      }
      .right-controller {
        font-size:20px;
        text-align: right;
        .el-icon {
          cursor: pointer;
          color: #959595;
          &:hover {
            color: #409eff;
          }
        }
        .icon-list {
          .el-icon {
            margin-left:10px;
          }
        }
      }
      .block {
        display: none;
      }
      &:hover {
        .block {
          display: inline-block;
        }
      }
    }
  }
}
</style>
