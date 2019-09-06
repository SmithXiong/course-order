<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="filter-label">订单账户：</span>
      <el-input
        v-model="listQuery.user_name"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <span class="filter-label">平台名称：</span>
      <el-input
        v-model="listQuery.course_platform_name"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <span class="filter-label">课程名：</span>
      <el-input
        v-model="listQuery.course_name"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <span class="filter-label">下单用户名：</span>
      <el-input
        v-model="listQuery.creator_login_id"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <br>
      <span class="filter-label">订单类型：</span>
      <el-select v-model="listQuery.order_type" placeholder="所有" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in Object.keys(typeList)" :key="item" :label="typeList[item]" :value="item"/>
      </el-select>
      <span class="filter-label">订单时间：</span>
      <el-date-picker
        class="filter-item"
        v-model="listQuery.date"
        type="daterange"
        unlink-panels
        clearable
        range-separator="-"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="warning" icon="el-icon-refresh" @click="resetFilter">
        重置
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item filter-right"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        批量导出
      </el-button>
      <el-button
        v-waves
        v-if="userInfo.role==='admin'"
        :loading="statusLoading"
        class="filter-item filter-right"
        type="primary"
        icon="el-icon-edit"
        @click="handleChangeStatus"
      >
        修改状态
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      ref="orderTable"
      :data="list"
      border
      fit
      @selection-change="handleSelectionChange"
      style="width: 100%;"
    >
      <el-table-column
        type="selection"
        width="40px">
      </el-table-column>
      <el-table-column label="订单号" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.order_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单人" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.creator_login_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台名称" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.course_platform_name }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="用户昵称" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="课程名">
        <template slot-scope="scope">
          <span>{{ scope.row.course_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单类型" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.order_type === '1' ? '整本' : scope.row.order_type === '2' ? '单元' : '考试' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="花费" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.price.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120px">
        <template slot-scope="scope">
          <span>{{ statusList[scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="userInfo.role==='admin'" label="操作" align="center" width="160px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button
            size="mini"
            type="warning"
            @click="handleReset(row)"
          >
            重做
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList"/>
    <el-dialog title="修改状态" :visible.sync="dialogFormVisible" width="400px">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 300px; margin-left:30px;"
      >
        <el-form-item label="状态：" label-width="100" :rules="{
      required: true, message: '请选择订单状态', trigger: 'blur'
    }">
          <el-select v-model="temp.status" style="width: 150px" >
            <el-option v-for="item in Object.keys(statusList)" :key="item" :label="statusList[item]"
                       :value="item"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateStatus()">
          确定
        </el-button>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchOrderList,fetchOrder,createOrder,updateOrder} from '@/api/orders'
  import waves from '@/directive/waves' // waves directive
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import {mapGetters} from 'vuex'

  export default {
    name: 'Orders',
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
          user_name: undefined,
          course_platform_name: undefined,
          course_name: undefined,
          creator_login_id: undefined,
          order_type: undefined,
          date: [],
          start: undefined,
          end: undefined
        },
        typeList: {
          '1': '整本',
          '2': '单元',
          '3': '考试'
        },
        statusList: {
          '1': '已完成',
          '2': '排队中',
          '3': '执⾏中',
          '4': '待考试',
          '5': '密码错误'
        },
        tableSelection: [],
        statusLoading: false,
        downloadLoading: false,
        temp: {
          status: undefined
        },
        dialogFormVisible: false
      }
    },
    created() {
      this.getList()
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    methods: {
      getList() {
        this.listLoading = true;
        let params = {...this.listQuery};
        if (this.listQuery.date && this.listQuery.date.length === 2) {
          params.start = params.date[0];
          params.end = params.date[1];
        }
        delete params.date;
        fetchOrderList(params).then(response => {
          this.list = response.data.list;
          this.total = response.data.total;
          this.listLoading = false;
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
          user_name: undefined,
          course_platform_name: undefined,
          course_name: undefined,
          creator_login_id: undefined,
          order_type: undefined,
          date: [],
          start: undefined,
          end: undefined
        };
        this.getList()
      },
      handleSelectionChange(val) {
        console.log(val);
        this.tableSelection = val;
      },
      handleChangeStatus() {
        if(this.tableSelection.length === 0) {
          return this.$message({
            message: '请选择订单',
            type: 'warning'
          })
        }
        this.temp.status = undefined;
        this.dialogFormVisible = true;
      },
      updateStatus() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let data = {
              update: {
                key: 'status',
                value: this.temp.status,
                order_id: this.tableSelection.map(o => o.order_id)
              }
            };
            updateOrder(data).then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.dialogFormVisible = false;
              this.$refs.orderTable.clearSelection();
              this.getList()
            })
          }
        })
      },
      handleUpdate(row) {
        this.temp.status = undefined;
        this.dialogFormVisible = true;
        this.$refs.orderTable.toggleRowSelection(row);
      },
      handleReset(row) {
        this.temp.status = undefined;
        this.dialogFormVisible = true;
        this.$refs.orderTable.toggleRowSelection(row);
      },
      handleDownload() {
        if(this.tableSelection.length === 0) {
          return this.$message({
            message: '请选择订单',
            type: 'warning'
          })
        }
        this.downloadLoading = true;
        import('../../vendor/Export2Excel').then(excel => {
          const tHeader = ['订单号', '登录账号', '登录密码', '下单类型', '课程名', '费用', '创建时间', '状态'];
          const filterVal = ['order_id', 'user_name', 'password', 'order_type', 'course_name', 'price', 'created_at', 'status'];
          const data = this.formatJson(filterVal, this.tableSelection);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '订单列表'
          });
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'created_at') {
            return parseTime(v[j])
          } else if (j === 'status') {
            return this.statusList[v[j]]
          } else if (j === 'order_type') {
            return v[j] === '1' ? '整本' : v[j] === '2' ? '单元' : '考试'
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
