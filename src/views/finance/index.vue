<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="filter-label">流水类型：</span>
      <el-select v-model="listQuery.flowType" placeholder="所有" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in Object.keys(orderTypes)" :key="item" :label="orderTypes[item]" :value="item"/>
      </el-select>
      <span class="filter-label">流水用户：</span>
      <el-input
        v-model="listQuery.id"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <span class="filter-label">流水时间：</span>
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
      <el-table-column label="订单号">
        <template slot-scope="scope">
          <span>{{ scope.row.order_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流水类型">
        <template slot-scope="scope">
          <span>{{ orderTypes[scope.row.transaction_type] }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="流水信息">
        <template slot-scope="scope">
          <span>{{ scope.row.flowInfo }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="流水时间" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="用户昵称" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.transaction_object_login_nickname }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="用户账号" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.transaction_object_login_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作前余额" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.pre_operation_balance }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作后余额" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.after_operation_balance }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>
  </div>
</template>

<script>
  import {fetchFinaList} from '@/api/finance'
  import waves from '@/directive/waves' // waves directive
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'Finance',
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
          flowType: undefined,
          date: [],
          start: undefined,
          end: undefined
        },
        typeList: ['支出', '收入'],
        orderTypes: {
          '1': '订单⽀付',
          '2': '上级充值',
          '3': '管理员充值',
          '4': '下级佣⾦',
          '5': '开户⽀出',
          '6': '充值折扣',
          '7': '下级充值',
        },
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
        fetchFinaList(params).then(response => {
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
          id: undefined,
          flowType: undefined,
          date: [],
          start: undefined,
          end: undefined
        };
        this.getList()
      },
      handleDownload() {
        this.downloadLoading = true;
        import('../../vendor/Export2Excel').then(excel => {
          const tHeader = ['订单号', '流水信息', '流水类型', '用户昵称', '登录账号','操作前余额','操作后余额','创建时间'];
          const filterVal = ['orderNumber', 'flowInfo', 'flowType', 'nickName', 'id','balanceBefore','balanceAfter','createAt'];
          const data = this.formatJson(filterVal, this.list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '流水列表'
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
