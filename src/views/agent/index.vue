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
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item filter-right"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出
      </el-button>
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
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录账号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="余额" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.level }}</span>
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
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
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
        <el-form-item label="用户昵称：" prop="nickName">
          <el-input v-model="temp.nickName"/>
        </el-form-item>
        <el-form-item label="登录账号：" prop="id">
          <el-input v-model="temp.id"/>
        </el-form-item>
        <el-form-item label="登录密码：" prop="password">
          <el-input :key="passwordType"
                    ref="password"
                    :type="passwordType"
                    v-model="temp.password"/>
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </span>
        </el-form-item>
        <el-form-item label="账户余额：" prop="balance">
          <el-input-number v-model.number="temp.balance" controls-position="right" :precision="2" :min="0"/>
        </el-form-item>
        <el-form-item label="用户等级：" prop="level">
          <el-input-number v-model.number="temp.level" controls-position="right" :precision="0" :min="1" :max="100"/>
        </el-form-item>
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
          {{temp.nickName}}
        </el-form-item>
        <el-form-item label="登录账号：">
          {{temp.id}}
        </el-form-item>
        <el-form-item label="登录密码：">
          {{temp.password}}
        </el-form-item>
        <el-form-item label="balance：">
          {{temp.balance}}
        </el-form-item>
        <el-form-item label="用户等级：">
          {{temp.level}}
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchList, fetchAgent, createAgent, updateAgent} from '../../api/agent'
  import waves from '../../directive/waves' // waves directive
  import {parseTime} from '../../utils'
  import Pagination from '../../components/Pagination' // secondary package based on el-pagination

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
          address: '',
          platformId: '',
          pushInterval: undefined,
          coursePrice: undefined,
          unitPrice: undefined,
          unitQuery: true,
          allowinput: true,
          DelayPush: true,
          announcement: ''
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
          nickName: [{required: true, message: '请输入用户昵称', trigger: 'blur'}],
          id: [{required: true, message: '请输入登录账号', trigger: 'blur'}],
          password: [{required: true, message: '请输入登录密码', trigger: 'blur'}],
          balance: [{required: true, message: '请输入账户余额', trigger: 'blur'}],
          level: [{required: true, message: '请输入用户等级', trigger: 'blur'}]
        },
        downloadLoading: false,
        dialogReadVisible: false,
      }
    },
    created() {
      this.getList()
    },
    mounted() {

    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.list = response.data.list;
          this.total = response.data.pageInfo.total;

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
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
          nickName: '',
          id: '',
          password: '',
          balance: undefined,
          level: undefined,
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
              this.list.unshift(this.temp);
              this.dialogFormVisible = false;
              this.$message({
                message: '新增成功',
                type: 'success'
              })
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
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v);
                  this.list.splice(index, 1, this.temp);
                  break
                }
              }
              this.dialogFormVisible = false;
              this.$message({
                message: '更新成功',
                type: 'success'
              })
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
