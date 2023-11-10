<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="主题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入主题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模块" prop="moduleName">
        <el-input
          v-model="queryParams.moduleName"
          placeholder="请输入模块"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="责任人" prop="user">
         <el-select v-model="queryParams.user" placeholder="请选择责任人" clearable size="small">
          <el-option
              v-for="item in userOptions"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
        </el-select>
        <!-- <el-input
          v-model="queryParams.user"
          placeholder="请输入责任人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        /> -->
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="item in statusOptions"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="乐观锁" prop="revision">
        <el-input
          v-model="queryParams.revision"
          placeholder="请输入乐观锁"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:backlog:add']"
        >新增</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:backlog:edit']"
        >修改</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:backlog:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:backlog:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="backlogList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="ID" align="center" prop="id" /> -->
      <el-table-column label="主题" align="center" prop="title" >
        <template slot-scope="scope">
          <router-link :to="scope.row.url" class="link-type" v-if="scope.row.url!=undefined">
            <span>{{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="模块" align="center" prop="moduleName" />
      <el-table-column label="责任人" align="center" prop="user" :formatter="userformatter" />
      <!-- <el-table-column label="URL" align="center" prop="url" :show-overflow-tooltip="true" >
         <template slot-scope="scope">
          <router-link :to="scope.row.url" class="link-type" v-if="scope.row.url!=undefined">
            <span>{{ scope.row.url }}</span>
          </router-link>
        </template>
      </el-table-column> -->
      <el-table-column label="内容" align="center" prop="content" />
      <el-table-column label="状态" align="center" prop="status" />
      <!-- <el-table-column label="乐观锁" align="center" prop="revision" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:backlog:edit']"
          >修改</el-button> -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:backlog:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改待办对话框 -->
    <!-- <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="主题" prop="title">
          <el-input v-model="form.title" placeholder="请输入主题" />
        </el-form-item>
        <el-form-item label="模块" prop="moduleName">
          <el-input v-model="form.moduleName" placeholder="请输入模块" />
        </el-form-item>
        <el-form-item label="责任人" prop="user">
          <el-input v-model="form.user" placeholder="请输入责任人" />
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model="form.url" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="乐观锁" prop="revision">
          <el-input v-model="form.revision" placeholder="请输入乐观锁" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { listBacklog, getBacklog, delBacklog, addBacklog, updateBacklog } from "@/api/system/backlog";
import { listUser,  } from "@/api/system/user";
import Editor from '@/components/Editor';

export default {
  name: "Backlog",
  components: {
    Editor,
  },
  data() {
    return {
      statusOptions:[],
      userOptions:[],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 待办表格数据
      backlogList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        moduleName: null,
        user: null,
        url: null,
        content: null,
        status: null,
        revision: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getOptions();
  },
  methods: {

    getOptions(){
      this.statusOptions=[];
      this.getDicts("backlog_status").then(response => {
        this.statusOptions = response.data;
      });
      this.userOptions=[];
      listUser().then(response => {
          this.userOptions=response.rows;
      });
    },

    userformatter(row, column){
      for(var i=0;i<this.userOptions.length;i++){
        if(row.user==(this.userOptions[i].userId+"")){
          return this.userOptions[i].userName;
        }
      }
    },
    /** 查询待办列表 */
    getList() {
      this.loading = true;
      listBacklog(this.queryParams).then(response => {
        this.backlogList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        title: null,
        moduleName: null,
        user: null,
        url: null,
        content: null,
        status: "0",
        revision: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加待办";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBacklog(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改待办";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBacklog(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBacklog(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除待办编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBacklog(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/backlog/export', {
        ...this.queryParams
      }, `system_backlog.xlsx`)
    }
  }
};
</script>