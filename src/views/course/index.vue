<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="filter-label">平台名称：</span>
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
<!--      <el-table-column label="平台ID" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" style="width: auto;" @click="handleOrder(row)">
            立即下单
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="平台名称" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程单价" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.coursePrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单元价格" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.unitPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台公告">
        <template slot-scope="scope">
          <span v-html="scope.row.announcement">{{ scope.row.announcement }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>
  </div>
</template>

<script>
  import {fetchPlatformList} from '@/api/platform'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import { mapGetters } from 'vuex'

  export default {
    name: 'Course',
    components: {Pagination},
    directives: {waves},
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          pageSize: 30,
          name: undefined,
        }
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    created() {
      this.getList()
    },
    mounted() {

    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchPlatformList(this.listQuery).then(response => {
          let list = response.data.list;
          list = list.map(o => {
            let index = o.price.findIndex(m => m.level_id === this.userInfo.level_id);
            if (index !== -1) {
              return {
                ...o,
                coursePrice: o.price[index].course_price || '无',
                unitPrice: o.price[index].unit_price || '无'
              }
            } else {
              return {
                ...o,
                coursePrice: '无',
                unitPrice: '无'
              }
            }
          });
          this.list = list;
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
          pageSize: 30,
          name: undefined
        };
        this.getList()
      },
      //立即下单
      handleOrder(row) {
        this.$router.push({name: 'CourseOrder', params: {id: row.course_platform_id, courseName: row.name}});
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
