<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="filter-label">用户名称：</span>
      <el-input
        v-model="listQuery.name"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <span class="filter-label">登录账号：</span>
      <el-input
        v-model="listQuery.id"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="warning" icon="el-icon-refresh" @click="resetFilter">
        重置
      </el-button>
      <el-button
        class="filter-item filter-right"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        新增
      </el-button>
<!--      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item filter-right"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出
      </el-button>-->
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;"
    >
      <el-table-column label="用户名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录账号">
        <template slot-scope="scope">
          <span>{{ scope.row.login_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="余额" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>-->
<!--      <el-table-column label="等级" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.level_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上级代理" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.creator_id }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="状态" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.status ? '启用' : '禁用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            size="mini"
            type="warning"
            @click="handleDetail(row)"
          >
            详情
          </el-button>
<!--          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="用户名称：" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="用户昵称：" prop="nickname">
          <el-input v-model="temp.nickname"/>
        </el-form-item>
        <el-form-item label="登录账号：" prop="login_id">
          <el-input v-model="temp.login_id" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="登录密码：" prop="login_password">
          <!--<el-input :key="passwordType"
                    ref="password"
                    :type="passwordType"
                    autocomplete="off"
                    v-model="temp.login_password"/>
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </span>-->
          <el-input v-model="temp.login_password"/>
        </el-form-item>
        <el-form-item label="充值金额：" prop="balance">
          <el-input-number v-model.number="temp.balance" controls-position="right" :precision="2" :min="0"/>
        </el-form-item>
        <el-form-item label="用户等级：" prop="level_id">
          <el-select v-model="temp.level_id" style="width: 120px">
            <el-option v-for="level in levelList" :key="level.level_id" :label="level.name"
                       :value="level.level_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用：" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
<!--        <el-form-item label="备注：">
          <el-input v-model="temp.remarks" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"/>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="详情" :visible.sync="dialogReadVisible" :footer="null" width="500px">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="用户名称：">
          {{temp.name}}
        </el-form-item>
        <el-form-item label="用户昵称：">
          {{temp.nickname}}
        </el-form-item>
        <el-form-item label="登录账号：">
          {{temp.login_id}}
        </el-form-item>
        <el-form-item label="登录密码：">
          {{temp.password}}
        </el-form-item>
        <el-form-item label="充值金额：">
          {{temp.balance}}
        </el-form-item>
        <el-form-item label="用户等级：">
          {{temp.level_id}}
        </el-form-item>
        <el-form-item label="上级代理：">
          {{temp.creator_id}}
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchAgentList, fetchAgent, createAgent, updateAgent} from '@/api/agent'
  import {fetchLevelList} from '@/api/level'
  import waves from '@/directive/waves' // waves directive
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'Agent',
    components: {Pagination},
    directives: {waves},
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          pageSize: 10,
          name: undefined,
          id: undefined
        },
        temp: {
          name: '',
          nickname: '',
          login_id: '',
          login_password: '',
          recharge_amount: '',
          level_id: undefined,
          creator_id: undefined,
          status: true,
          remarks: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        passwordType: 'password',
        rules: {
          name: [{required: true, message: '请输入用户名称', trigger: 'blur'}],
          nickname: [{required: true, message: '请输入用户昵称', trigger: 'blur'}],
          login_id: [{required: true, message: '请输入登录账号', trigger: 'blur'}],
          login_password: [{required: true, message: '请输入登录密码', trigger: 'blur'}],
          balance: [{required: true, message: '请输入充值金额', trigger: 'blur'}],
          level_id: [{required: true, message: '请输入用户等级', trigger: 'blur'}],
          status: [{required: true, message: '请选择是否启用', trigger: 'blur'}]
        },
        downloadLoading: false,
        dialogReadVisible: false,
        levelList: []
      }
    },
    created() {
      this.getList();
      this.getLevelList()
    },
    mounted() {

    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchAgentList(this.listQuery).then(response => {
          this.list = response.data.list;
          this.total = response.data.total;
          this.listLoading = false;
        })
      },
      getLevelList() {
        fetchLevelList({
          page: 1,
          pageSize: 100,
          status: true
        }).then(response => {
          this.levelList = response.data.list;
        })
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      resetFilter() {
        this.listQuery = {
          page: 1,
          pageSize: 10,
          name: undefined,
          id: undefined
        };
        this.getList()
      },
      resetTemp() {
        this.temp = {
          name: '',
          nickname: '',
          login_id: '',
          login_password: '',
          balance: '',
          level_id: undefined,
          creator_id: undefined,
          status: true,
          remarks: ''
        }
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createAgent(this.temp).then(() => {
              this.dialogFormVisible = false;
              this.$message({
                message: '新增成功',
                type: 'success'
              });
              this.getList()
            })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row); // copy obj
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            updateAgent(this.temp).then(() => {
              this.dialogFormVisible = false;
              this.$message({
                message: '更新成功',
                type: 'success'
              });
              this.getList();
            })
          }
        })
      },
      handleDetail(row) {
        /*fetchAgent(row.id).then(response => {
          this.temp = response.data.pvData
        })*/
        this.temp = Object.assign({}, row);
        this.dialogReadVisible = true;
      },
      handleDelete(row) {

      },
      handleDownload() {
        this.downloadLoading = true;
        import('../../vendor/Export2Excel').then(excel => {
          const tHeader = ['用户名称', '用户昵称', '登录账号', 'balance', '等级'];
          const filterVal = ['name', 'nickName', 'id', 'balance', 'level'];
          const data = this.formatJson(filterVal, this.list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '代理列表'
          });
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>

<style lang="scss" scoped>
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 0;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
</style>
