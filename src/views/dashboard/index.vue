<template>
  <div class="app-container" v-loading="fullLoading">
    <el-row type="flex" justify="center" align="center" :gutter="20" style="margin-bottom: 40px">
      <el-col :span="6">
        <el-card header="我的订单" :body-style="{padding:'15px'}">
          <span class="card-info">{{orderNum}}</span>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card header="我的余额" :body-style="{padding:'15px'}">
          <span class="card-info">{{userInfo.balance}}</span>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card header="我的等级" :body-style="{padding:'15px'}">
          <span class="card-info">{{userInfo.level_name}}</span>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card header="我的代理" :body-style="{padding:'15px'}">
          <span class="card-info">{{agent}}</span>
        </el-card>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" align="center" :gutter="20">
      <el-col :span="12">
        <el-card header="首页公告" :body-style="{padding:'15px'}">
          <span class="card-info" v-html="homeNotice"></span>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="等级公告" :body-style="{padding:'15px'}">
          <span class="card-info" v-html="userInfo.level_announcement"></span>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {fetchNoticeList} from '@/api/notice'

  export default {
    name: 'Dashboard',
    data() {
      return {
        fullLoading: false,
        orderNum: 0,
        balance: 0,
        level: '',
        agent: 0,
        homeNotice: '',
        levelNotice: ''
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    created() {
      this.getNotice()
    },
    methods: {
      getNotice() {
        fetchNoticeList({type:'1'}).then(response => {
          this.homeNotice = response.data && response.data.list.length > 0  ? response.data.list[0].content : '';
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .card-info {
    font-size: 14px;
    font-weight: 500;
  }

  .course-notice {
    font-size: 14px;
    font-weight: 600;
    color: #ff0000;
    display: inline-block;
    margin: 5px;
  }

  .app-container {
    /deep/ .el-card__header {
      padding: 12px 15px;
      font-weight: 600;
      font-size: 14px;
    }
  }

</style>
