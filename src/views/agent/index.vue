<template>
  <div class="app-container" id="agent-list">
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
        v-model="listQuery.login_id"
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
<!--      <el-table-column label="用户昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="登录账号">
        <template slot-scope="scope">
          <span>{{ scope.row.login_id }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="登录密码">
        <template slot-scope="scope">
          <span>{{ scope.row.login_password }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="余额" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.balance.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单数" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.order_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.level_nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上级代理" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.creator_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.status ? '启用' : '禁用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="360" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleRecharge(row)">
            账户充值
          </el-button>
          <el-button
            size="mini"
            type="warning"
            @click="handleChange(row)"
          >
            调整等级
          </el-button>
          <el-button size="mini" type="danger" @click="handleReset(row)">
            重置密码
          </el-button>
          <el-button size="mini" type="primary" @click="handleUpdate(row)">
            编辑价格
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="650px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="width: 600px;"
      >
        <div v-show="dialogStatus === 'create'">
        <el-form-item label="用户名称：" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
<!--        <el-form-item label="用户昵称：" prop="nickname">
          <el-input v-model="temp.nickname"/>
        </el-form-item>-->
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
          <el-input :disabled="dialogStatus==='create'" v-model="temp.login_password"/>
        </el-form-item>
        <el-form-item label="充值金额：" prop="balance">
          <el-input-number v-model.number="temp.balance" controls-position="right" :precision="2" :min="0"/>
        </el-form-item>
        <el-form-item label="用户等级：" prop="level_id">
          <el-select v-model="temp.level_id" style="width: 120px" @change="handleChangeLevel($event)">
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
        </div>
        <el-form-item label="平台价格：">
          <el-card :body-style="{padding:'5px'}">
            <div slot="header">
              <el-row type="flex" justify="center" align="center" :gutter="10">
                <el-col :span="8">平台名称</el-col>
                <el-col :span="8">整本价格</el-col>
                <el-col :span="8">单元价格</el-col>
              </el-row>
            </div>
            <el-row type="flex" justify="center" align="center" :gutter="10" v-for="(item,index) in temp.price" :key="item.course_platform_id">
              <el-col :span="8">
                {{temp.price[index].name}}
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="0" :prop="'price.' + index + '.course_price'" :rules="{
      required: true, message: '请输入整本价格', trigger: 'blur'
    }">
                  <el-input-number style="width: 100%" v-model.number="item.course_price" controls-position="right" :precision="2"
                                   :min="item.course_min"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="0" :prop="'price.' + index + '.unit_price'" :rules="{
      required: true, message: '请输入单元价格', trigger: 'blur'
    }">
                  <el-input-number style="width: 100%" v-model.number="item.unit_price" controls-position="right" :precision="2" :min="item.unit_min"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
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
    <el-dialog title="账户充值" :visible.sync="dialogRecharge" width="500px">
      <el-form
        ref="chargeForm"
        :rules="rules"
        :model="chargeForm"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="充值金额：" prop="balance">
          <el-input-number v-model.number="chargeForm.balance" controls-position="right" :precision="2" :min="0"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateRecharge()">
          确定
        </el-button>
        <el-button @click="dialogRecharge = false">
          取消
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="调整等级" :visible.sync="dialogChange" width="500px">
      <el-form
        ref="levelForm"
        :rules="rules"
        :model="levelForm"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="用户等级：" prop="level_id">
          <el-select v-model="levelForm.level_id" style="width: 120px">
            <el-option v-for="level in levelList" :key="level.level_id" :label="level.name"
                       :value="level.level_id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateLevel()">
          确定
        </el-button>
        <el-button @click="dialogChange = false">
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
<!--        <el-form-item label="用户昵称：">
          {{temp.nickname}}
        </el-form-item>-->
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
  import {resetPass} from '@/api/user'
  import {fetchPlatformList} from '@/api/platform'
  import waves from '@/directive/waves' // waves directive
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import _ from 'lodash'

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
          login_id: '',
          login_password: '123456',
          recharge_amount: '',
          level_id: undefined,
          creator_id: undefined,
          status: true,
          remarks: '',
          price: []
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
        levelList: [],
        dialogRecharge: false,
        dialogChange: false,
        chargeForm: {
          recharge_amount: '',
        },
        levelForm: {
          level_id: undefined,
        },
        platformList: []
      }
    },
    created() {
      this.getList();
      this.getLevelList();
      this.getPlatformList()
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
      getPlatformList() {
        fetchPlatformList({
          page: 1,
          pageSize: 100
        }).then(response => {
          let list = response.data.list;
          this.platformList = list;
          this.temp.price = list.map(o => ({
            course_platform_id: o.course_platform_id,
            name: o.name,
            course_price: o.course_price,
            course_min: o.course_price || 0,
            unit_price: o.unit_price,
            unit_min: o.unit_price || 0,
          }));
        })
      },
      handleChangeLevel(id) {
        this.temp.price = this.platformList.map(o => {
          let prices = o.price || [];
          let index = prices.findIndex(p => p.level_id === id);
          if (index !== -1) {
            return {
              course_platform_id: o.course_platform_id,
              name: o.name,
              course_price: prices[index].course_price,
              course_min: prices[index].course_price || 0,
              unit_price: prices[index].unit_price,
              unit_min: prices[index].unit_price || 0,
            }
          }
          return {
            course_platform_id: o.course_platform_id,
            name: o.name,
            course_price: undefined,
            course_min: 0,
            unit_price: undefined,
            unit_min: 0,
          }
        });
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
          login_id: '',
          login_password: '123456',
          balance: '',
          level_id: undefined,
          creator_id: undefined,
          status: true,
          price: this.platformList,
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
            let data = _.cloneDeep(this.temp);
            data.price = data.price.map(o => ({
              course_platform_id: o.course_platform_id,
              course_price: o.course_price,
              unit_price: o.unit_price
            }));
            createAgent(data).then(() => {
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
        this.temp.price = this.temp.price.map(o => {
          return {
            course_platform_id: o.course_platform_id,
            course_platform_price_id: o.course_platform_price_id,
            agent_id: o.agent_id,
            name: o.course_platform_name,
            course_price: o.course_price,
            course_min: o.course_price || 0,
            unit_price: o.unit_price,
            unit_min: o.unit_price || 0
          }
        });
        console.log(this.temp)
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        let price = _.cloneDeep(this.temp.price);
        price = price.map(o => ({
          course_platform_id: o.course_platform_id,
          course_platform_price_id: o.course_platform_price_id,
          agent_id: o.agent_id,
          course_price: o.course_price,
          unit_price: o.unit_price
        }));
        updateAgent({
          agent_id: this.temp.agent_id,
          price
        }).then(() => {
          this.dialogFormVisible = false;
          this.$message({
            message: '更新成功',
            type: 'success'
          });
          this.getList();
        })
      },
      handleRecharge(row) {
        this.chargeForm = Object.assign({}, row); // copy obj
        this.dialogRecharge = true;
        this.$nextTick(() => {
          this.$refs['chargeForm'].clearValidate()
        })
      },
      updateRecharge() {
        this.$refs['chargeForm'].validate((valid) => {
          if (valid) {
            updateAgent({
              agent_id: this.chargeForm.agent_id,
              balance: this.chargeForm.balance
            }).then(() => {
              this.dialogRecharge = false;
              this.$message({
                message: '更新成功',
                type: 'success'
              });
              this.getList();
            })
          }
        })
      },
      handleChange(row) {
        this.levelForm = Object.assign({}, row); // copy obj
        this.dialogChange = true;
        this.$nextTick(() => {
          this.$refs['levelForm'].clearValidate()
        })
      },
      updateLevel() {
        this.$refs['levelForm'].validate((valid) => {
          if (valid) {
            updateAgent({
              agent_id: this.levelForm.agent_id,
              level_id: this.levelForm.level_id
            }).then(() => {
              this.dialogChange = false;
              this.$message({
                message: '更新成功',
                type: 'success'
              });
              this.getList();
            })
          }
        })
      },
      handleReset(row) {
        resetPass({
          agent_id: row.agent_id,
          old_password: row.login_password,
          new_password: '123456'
        }).then(() => {
          this.$message({
            message: '重置密码成功',
            type: 'success'
          });
          this.getList();
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
  /deep/ .el-card__header {
    padding: 5px;
    font-weight: 500;
    font-size: 14px;
  }
  /deep/ .el-form-item .el-form-item {
    margin-bottom: 20px;
  }
</style>
