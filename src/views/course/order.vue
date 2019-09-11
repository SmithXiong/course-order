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
              <el-input v-model="temp.accounts" :autosize="{ minRows: 10, maxRows: 10}" type="textarea"/>
            </el-form-item>
            <el-form-item>
              <i class="el-icon-s-promotion"></i>
              <p class="course-notice">请注意：下单格式为===账号 空格 密码，批量下单目前开放个数为10个账号；</p>
            </el-form-item>
<!--            <el-form-item label-width="95px" label="下单类型：" prop="orderType">
              <el-select v-model="temp.orderType" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item v-if="courseDetail.unit_query" label-width="95px" label="课程单元：" prop="unit">
              <el-switch
                v-model="temp.unit"
                active-text="ON"
                inactive-text="OFF">
              </el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-circle-check" @click="onLoadCourse">加载课程</el-button>
              <el-button type="primary" icon="el-icon-circle-plus-outline" @click="onSubmit">确认下单</el-button>
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
  import {fetchCourse, createOrder} from '@/api/course'
  import {fetchPlatform} from '@/api/platform'
  import waves from '@/directive/waves' // waves directive
  import {uuid} from '@/utils/index'
  import { mapGetters } from 'vuex'

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
        } else if (list.length > 10) {
          callback(new Error('批量下单最多支持10个账号'));
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
                account: arr[0],
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
        courseTree: [],
        treeLoading: false,
        treeProps: {
          children: 'children',
          label: 'label'
        },
        courseDetail: {
          platform_id: '',
          name: '',
          announcement: '',
          unit_query: false
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
          //orderType: '1',
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
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    created() {
      this.getPlatformDetail()
    },
    mounted() {

    },
    methods: {
      getPlatformDetail() {
        this.fullLoading = true;
        fetchPlatform(this.$route.params.id).then(response => {
          this.courseDetail = {...response.data};
          this.fullLoading = false;
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
            this.treeLoading = true;
            let data = {
              course_platform_id: this.$route.params.id,
              type: this.temp.unit ? '2' : '1',
              data: this.temp.accountList
            };
            console.log(data)
            fetchCourse(data).then(response => {
              let data = response.data || [];
              //data = data.filter(o => o.code == 1);
              data = data.map(o => {
                return {
                  id: uuid(),
                  label: o.account + '   ' + o.password + '   ' + (o.code != 1 ? o.msg : ''),
                  type: 'parent',
                  children: o.course && o.course.map(m => {
                    let id = uuid();
                    return {
                      id: id,
                      course_id: m.id,
                      label: m.name,
                      type: 'course',
                      account: o.account,
                      password: o.password,
                      children: m.unit && m.unit.map(n => {
                        return {
                          id: uuid(),
                          unit_id: n.id,
                          label: n.name,
                          type: 'unit',
                          parent: id
                        }
                      })
                    }
                  })
                }
              });
              this.courseTree = data;
              this.treeLoading = false;
            })
          }
        })
      },
      //确认下单
      onSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let treeData = this.$refs.courseTree.getCheckedNodes().concat(this.$refs.courseTree.getHalfCheckedNodes());
            console.log(treeData);
            let courses = treeData.filter(o => o.type === 'course');
            if (courses.length === 0) {
              return this.$message({
                message: '请选择课程',
                type: 'warning'
              });
            }
            let units = treeData.filter(o => o.type === 'unit');
            courses = courses.map(o => {
              let unit = units.filter(m => m.parent === o.id).map(n => ({
                unit_id: n.unit_id,
                unit_name: n.label
              }));
              return {
                user_name: o.account,
                password: o.password,
                course_name: o.label,
                course_id: o.course_id,
                type: unit.length === o.children.length ? '1' : '2',
                unit_info: unit.length === o.children.length ? [] : unit
              }
            });
            let data = {
              course_platform_id: this.$route.params.id,
              agent_id: this.userInfo.agent_id,
              order_list: courses,
            };
            createOrder(data).then(res => {
              this.$message({
                message: '下单成功',
                type: 'success'
              });
              this.$router.replace({name: 'Orders'})
            })
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
