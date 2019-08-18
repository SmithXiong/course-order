<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="filter-label">登录账号：</span>
      <el-input
        v-model="listQuery.id"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <span class="filter-label">平台名：</span>
      <el-input
        v-model="listQuery.platformName"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <span class="filter-label">课程名：</span>
      <el-input
        v-model="listQuery.courseName"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <span class="filter-label">下单用户名：</span>
      <el-input
        v-model="listQuery.nickName"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <br>
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
      <el-table-column label="订单号" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户账号" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户密码" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台名" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.platformName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.courseName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单内容">
        <template slot-scope="scope">
          <span>{{ scope.row.orderContent }}</span>
        </template>
      </el-table-column>
      <el-table-column label="花费" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.cost }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.createAt | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160px" class-name="small-padding fixed-width">
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
  </div>
</template>

<script>
  import {fetchList} from '../../api/orders'
  import waves from '../../directive/waves' // waves directive
  import {parseTime} from '../../utils'
  import Pagination from '../../components/Pagination' // secondary package based on el-pagination

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
          id: undefined,
          platformName: undefined,
          courseName: undefined,
          nickName: undefined,
          date: [],
          start: undefined,
          end: undefined
        },
        tableSelection: [],
        statusLoading: false,
        downloadLoading: false
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
        let params = {...this.listQuery};
        if (this.listQuery.date && this.listQuery.date.length === 2) {
          params.start = params.date[0];
          params.end = params.date[1];
        }
        delete params.date;
        fetchList(params).then(response => {
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
          id: undefined,
          platformName: undefined,
          courseName: undefined,
          nickName: undefined,
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
        this.statusLoading = true;
        setTimeout(() => {
          this.statusLoading = false
        }, 1.5 * 1000)
      },
      handleUpdate(row) {

      },
      handleReset(row) {

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
          const tHeader = ['订单号', '登录账号', '用户昵称', '登录密码', '平台名', '课程名', '费用', '创建时间'];
          const filterVal = ['orderNumber', 'id', 'nickName', 'password', 'platformName', 'courseName', 'cost', 'createAt'];
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

</style>
