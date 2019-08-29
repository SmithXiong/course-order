<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="filter-label">账号：</span>
      <el-input
        v-model="listQuery.name"
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
      <el-table-column label="登录账号">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览器">
        <template slot-scope="scope">
          <span>{{ scope.row.browser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
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
    <el-dialog title="详情" :visible.sync="dialogVisible" :footer="null" width="600px">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 500px; margin-left:50px;"
      >
        <el-form-item label="登录账号：">
          {{temp.name || ''}}
        </el-form-item>
        <el-form-item label="用户昵称：">
          {{temp.nickName || ''}}
        </el-form-item>
        <el-form-item label="浏览器：">
          {{temp.browser || ''}}
        </el-form-item>
        <el-form-item label="登录IP：">
          {{temp.address || ''}}
        </el-form-item>
        <el-form-item label="历史登录：">
          {{temp.loginHistory | parseTime}}
        </el-form-item>
        <el-form-item label="最后登录：">
          {{temp.lastLogin | parseTime}}
        </el-form-item>
        <el-form-item label="账户余额：">
          {{temp.balance || ''}}
        </el-form-item>
        <el-form-item label="订单数：">
          {{temp.orderNum || ''}}
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchList, fetchOnlineUser} from '@/api/online'
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
          name: undefined,
        },
        dialogVisible: false,
        temp: {}
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
          name: undefined
        };
        this.getList()
      },
      //详情
      handleDetail(row) {
        fetchOnlineUser(row.id).then(response => {
          this.temp = Object.assign({}, response.data);
          this.dialogVisible = true;
        })
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
