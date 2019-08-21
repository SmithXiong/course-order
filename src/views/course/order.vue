<template>
  <div class="app-container" v-loading="fullLoading">
    <el-row type="flex" justify="start" align="center">
      <el-card style="width: 100%; margin-bottom: 20px" :body-style="{padding:'10px'}">
        <span class="course-title">{{`【${courseDetail.name}】`}}</span>
        <p class="course-notice">{{courseDetail.announcement}}</p>
      </el-card>
    </el-row>
    <el-row :gutter="20">

      <el-col :span="10" :xs="24">
        <el-card header="下单信息">

        </el-card>
      </el-col>

      <el-col :span="14" :xs="24">
        <el-card header="课程信息">

        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {fetchCourse} from '../../api/course'
  import waves from '../../directive/waves' // waves directive

  export default {
    name: 'CourseOrder',
    directives: {waves},
    data() {
      return {
        fullLoading: false,
        treeLoading: false,
        courseDetail: {
          name: '',
          announcement: ''
        }
      }
    },
    created() {
      this.getCourseDetail()
    },
    mounted() {

    },
    methods: {
      getCourseDetail() {
        this.fullLoading = true;
        fetchCourse(this.$route.params.id).then(response => {
          this.courseDetail = {...response.data,name: '优学院',announcement:'图片容器，在保留原生img的特性下，支持懒加载，自定义占位、加载失败等。'};
          // Just to simulate the time of the request
          setTimeout(() => {
            this.fullLoading = false
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
          title: undefined
        };
        this.getList()
      },
      //立即下单
      handleOrder() {

      },
    }
  }
</script>

<style lang="scss" scoped>
  .course-title {
    font-size: 14px;
    font-weight: 600;
  }

  .course-notice {
    font-size: 14px;
    font-weight: 600;
    color: #ff0000;
    display: inline-block;
    margin: 5px;
  }

  .app-container {
    /deep/.el-card__header {
      padding: 12px 15px;
      font-weight: 600;
      font-size: 14px;
    }
  }

</style>
