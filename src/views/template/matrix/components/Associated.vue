<template>
  <!-- 关联文档组件 -->
  <div class="Associated-Page">
    <ul>
      <li v-for="v in list">
        <div class="row name">
          <span>{{ v.name }}</span>
          <el-tooltip content="上传" placement="bottom" effect="dark">
            <el-icon @click="handleUpload(v, '')">
              <Upload />
            </el-icon>
          </el-tooltip>
        </div>
        <div v-for="item in v.items">
          <div class="row subtitle" v-if="item.fileName">
            <span>{{ item.fileName }}</span>
            <div class="icon-list">
              <el-tooltip content="查阅" placement="bottom" effect="dark">
                <el-icon>
                  <View />
                </el-icon>
              </el-tooltip>
              <el-tooltip content="下载" placement="bottom" effect="dark">
                <el-icon>
                  <Download />
                </el-icon>
              </el-tooltip>
              <el-tooltip content="替换" placement="bottom" effect="dark">
                <el-icon @click="handleUpload(v, item)">
                  <Switch />
                </el-icon> </el-tooltip><el-tooltip content="删除" v-if="v.name != 'Content'" placement="bottom"
                effect="dark">
                <el-icon @click="handleDelete(v, item)">
                  <Delete />
                </el-icon>
              </el-tooltip>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <UploadFile url="/ecm/matrix/uploadContentFile" @update="show = false" :open="show"></UploadFile>
  </div>
</template>
<script lang="ts" setup>
import UploadFile from "./Upload-File.vue";
import { deleteMatrixAttach, deleteMatrixContent } from "@/api/template/matrix";
import { ref, getCurrentInstance, ComponentInternalInstance } from "vue";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const list = ref();
const show = ref(false);
function handleUpload(row: object, item: any) {
  console.log(row);
  show.value = true;
}
const ItemId = ref();
const emit = defineEmits(["update:modelValue"]);
function handleDelete(row: any, item: any) {
  proxy?.$modal
    .confirm(`是否确认删除名称为【${item?.fileName}】的数据项?`)
    .then(function () {
      console.log(row);
      let params = {
        id: ItemId.value,
        uniqueName: item.uniqueName,
      };
      let Promise;
      if (row.name == "Content") {
        Promise = deleteMatrixContent(params);
      } else if (row.name == "Attachments") {
        Promise = deleteMatrixAttach(params);
      }
      Promise?.then((res) => {
        proxy!.$modal.msgSuccess("删除成功");
        emit("update:modelValue");
      });
    });
}
function init(data: any) {
  let Attachments = [];
  let Contents: any = [];
  if (data.matrixAttachments) {
    let arr = JSON.parse(data.matrixAttachments).map((item: any) => {
      return JSON.parse(item)
    })
    console.log(arr)
    Attachments = arr;
    console.log(Attachments)
  }
  if (data.matrixContents) {
    Contents = [JSON.parse(data.matrixContents)];
  }
  ItemId.value = data.id;
  list.value = [
    {
      name: "Content",
      items: Contents,
    },
    {
      name: "Attachments",
      items: Attachments,
    },
  ];
  console.log(list.value);
}
defineExpose({
  init,
});
</script>
<style lang="scss" scoped>
.Associated-Page {
  ul {
    max-height: 600px;
    overflow: auto;

    li {
      margin-bottom: 10px;
      padding: 10px 15px;
      line-height: 35px;
      width: 100%;
      border: 1px solid #d5d5d5;
      border-radius: 4px;

      .row {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;

        &.name {
          span {
            text-decoration: underline;
            font-size: 16px;
            color: #656565;
            cursor: pointer;

            &:hover {
              opacity: 0.8;
            }
          }
        }

        &.subtitle {
          margin: 5px 0;
          border-bottom: 1px solid transparent;

          &>span {
            color: #959595;
            font-size: 13px;
          }

          &:hover {
            border-bottom: 1px solid #e5e5e5;

            &>span {
              color: #656565;
            }
          }
        }

        .icon-list {
          display: none;

          .el-icon {
            margin-left: 8px;
          }
        }

        &:hover .icon-list {
          display: inline-block;
        }
      }

      .el-icon {
        cursor: pointer;
        color: #959595;
        font-size: 19px;

        &:hover {
          color: #409eff;
        }
      }
    }
  }
}
</style>
