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
          <span class="card-info">{{balance}}</span>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card header="我的等级" :body-style="{padding:'15px'}">
          <span class="card-info">{{level}}</span>
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
        <el-card header="公告一" :body-style="{padding:'15px'}">
          <span class="card-info">{{20}}</span>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="公告二" :body-style="{padding:'15px'}">
          <span class="card-info">{{20}}</span>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'Dashboard',
    data() {
      return {
        fullLoading: false,
        orderNum: 20,
        balance: 9.9,
        level: 10,
        agent: 5
      }
    },
    computed: {
      ...mapGetters([
        'roles'
      ])
    },
    created() {
      if (!this.roles.includes('admin')) {
        this.currentRole = 'editorDashboard'
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
