<template>
  <div class="app-container" v-loading="fullLoading">
    <el-card header="用户手册" :body-style="{padding:'15px'}">
      <span class="card-info" v-html="notice"></span>
    </el-card>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {fetchNoticeList} from '@/api/notice'

  export default {
    name: 'User',
    data() {
      return {
        fullLoading: false,
        notice: ''
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
        this.fullLoading = true;
        fetchNoticeList({type:'2'}).then(response => {
          this.notice = response.data && response.data.list.length > 0  ? response.data.list[0].content : '';
          this.fullLoading = false;
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
