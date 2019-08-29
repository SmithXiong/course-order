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
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="temp"
            label-position="left"
          >
            <el-form-item prop="accounts">
              <el-input v-model="temp.accounts" :autosize="{ minRows: 5, maxRows: 8}" type="textarea"/>
            </el-form-item>
            <el-form-item>
              <i class="el-icon-s-promotion"></i>
              <p class="course-notice">请注意：下单格式修改为《账号 空格 密码》，多个请换行；</p>
            </el-form-item>
            <el-form-item label-width="95px" label="下单类型：" prop="orderType">
              <el-select v-model="temp.orderType" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="95px" label="课程单元：" prop="unit">
              <el-switch
                v-model="temp.unit"
                active-text="ON"
                inactive-text="OFF">
              </el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-circle-check" @click="onLoadCourse">加载课程</el-button>
              <el-button type="primary" icon="el-icon-circle-plus-outline" @cancel="onSubmit">确认下单</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="14" :xs="24">
        <el-card header="课程信息">
          <el-tree
            v-loading="treeLoading"
            :data="courseTree"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="courseTree"
            highlight-current
            :props="treeProps">
          </el-tree>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {fetchCourse} from '@/api/course'
  import waves from '@/directive/waves' // waves directive

  export default {
    name: 'CourseOrder',
    directives: {waves},
    data() {
      let validateAccount = (rule, value, callback) => {
        if (!value.trim()) {
          return callback(new Error('请输入账号密码'));
        }
        let list = value.trim().split(/[\r\n]/),isError = false;
        if (list.length === 0) {
          callback(new Error('请输入账号密码'));
        } else {
          for(let item of list) {
            let length = item.trim().split(/\s+/).length;
            if (length !== 2) {
              isError = true;
              break;
            }
          }
          if (!isError) {
            this.temp.accountList = list.map(o => {
              let arr = o.trim().split(/\s+/);
              return {
                name: arr[0],
                password: arr[1]
              }
            });
            callback()
          } else {
            callback(new Error('账号密码格式不正确'));
          }
        }
      };
      return {
        fullLoading: false,
        courseTree: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        treeLoading: false,
        treeProps: {
          children: 'children',
          label: 'label'
        },
        courseDetail: {
          name: '',
          announcement: ''
        },
        options: [
          {
            value: '1',
            label: '电脑端'
          }, {
            value: '2',
            label: '手机端'
          }
        ],
        temp: {
          accounts: '',
          orderType: '1',
          unit: false,
          accountList: []
        },
        rules: {
          accounts: [{required: true, trigger: 'blur', validator: validateAccount}],
          orderType: [{required: true, message: '请选择下单类型', trigger: 'blur'}],
          unit: [{required: true, message: '请选择是否课程单元', trigger: 'blur'}],
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
          this.courseDetail = {...response.data, name: '优学院', announcement: '图片容器，在保留原生img的特性下，支持懒加载，自定义占位、加载失败等。'};
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
      //加载课程
      onLoadCourse() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            console.log(this.temp.accountList)
          }
        })
      },
      //确认下单
      onSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            console.log(this.temp.accountList);
            console.log(this.$refs.courseTree.getCheckedNodes())
          }
        })
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
    /deep/ .el-card__header {
      padding: 12px 15px;
      font-weight: 600;
      font-size: 14px;
    }
  }

</style>
