<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="filter-label">账号：</span>
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
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;"
    >
      <el-table-column label="登录账号" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.login_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账户余额" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单数" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.order_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览器">
        <template slot-scope="scope">
          <span>{{ scope.row.browser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" style="width: auto;" @click="handleDetail(row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>
    <el-dialog title="历史登录记录" :visible.sync="dialogVisible" :footer="null" width="1000px">
      <el-table
        v-loading="historyLoading"
        :data="historyList"
        border
        fit
        style="width: 100%;"
      >
        <el-table-column label="登录账号" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.login_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账户余额" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.balance }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单数" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.order_count }}</span>
          </template>
        </el-table-column>
        <el-table-column label="IP" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.ip }}</span>
          </template>
        </el-table-column>
        <el-table-column label="浏览器">
          <template slot-scope="scope">
            <span>{{ scope.row.browser }}</span>
          </template>
        </el-table-column>
        <el-table-column label="登录时间" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at | parseTime }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="historyTotal>0" :total="historyTotal" :page.sync="historyQuery.page" :limit.sync="historyQuery.pageSize" @pagination="getHistory"/>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchOnlineList, fetchOnlineUser} from '@/api/online'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'Online',
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
          login_id: undefined,
        },
        dialogVisible: false,
        temp: {},
        historyLoading: false,
        historyList: [],
        historyTotal: 0,
        historyQuery: {
          page: 1,
          pageSize: 10
        },
        currentAgent: ''
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
        fetchOnlineList(this.listQuery).then(response => {
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
          login_id: undefined
        };
        this.getList()
      },
      //详情
      handleDetail(row) {
        this.dialogVisible = true;
        this.historyQuery.page = 1;
        this.historyQuery.pageSize = 10;
        this.currentAgent = row.agent_id;
        this.getHistory();
      },
      getHistory() {
        this.historyLoading = true;
        let params = {
          ...this.historyQuery,
          id: this.currentAgent
        };
        fetchOnlineUser(params).then(response => {
          this.historyList = response.data.list;
          this.historyTotal = response.data.total;
          this.historyLoading = false;
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
