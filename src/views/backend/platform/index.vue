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
      <span class="filter-label">平台状态：</span>
      <el-select v-model="listQuery.status" placeholder="所有" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in statusList" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="warning" icon="el-icon-refresh" @click="resetFilter">
        重置
      </el-button>
      <el-button
        class="filter-item filter-right"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        新增
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
      <el-table-column label="平台ID" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.platform_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台名称" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台接口地址" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推送间隔" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.push_interval }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单元查询" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.unit_query ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="输入信息" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.allow_input ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="延迟推送" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.delay_push ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.status ? '启用' : '禁用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台公告" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.announcement }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            size="mini"
            type="warning"
            @click="handleDetail(row)"
          >
            详情
          </el-button>
          <!--<el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="750px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 650px; margin-left:30px;"
      >
        <el-form-item label="平台名称：" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="平台接口地址：" prop="address">
          <el-input v-model="temp.address"/>
        </el-form-item>
        <el-form-item label="平台ID：" prop="platform_id">
          <el-input v-model="temp.platform_id"/>
        </el-form-item>
        <el-form-item label="推送间隔(秒)：" prop="push_interval">
          <el-input-number v-model.number="temp.push_interval" controls-position="right" :precision="0" :min="1"/>
        </el-form-item>
        <el-form-item label="开启单元查询：" prop="unit_query">
          <el-radio-group v-model="temp.unit_query">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开启输入信息：" prop="allow_input">
          <el-radio-group v-model="temp.allow_input">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开启延迟推送：" prop="delay_push">
          <el-radio-group v-model="temp.delay_push">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="等级价格：">
          <el-card :body-style="{padding:'5px'}">
            <div slot="header">
              <el-row type="flex" justify="center" align="center" :gutter="10">
                <el-col :span="7">代理等级</el-col>
                <el-col :span="7">整本价格</el-col>
                <el-col :span="7">单元价格</el-col>
                <el-col :span="3">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="handleAddPrice()"
                  >
                    添加
                  </el-button>
                </el-col>
              </el-row>
            </div>
            <el-row type="flex" justify="center" align="center" :gutter="10" v-for="(item,index) in temp.price" :key="item.key">
              <el-col :span="7">
                <el-form-item label-width="0" :prop="'price.' + index + '.level_id'" :rules="{
      required: true, message: '请选择代理等级', trigger: 'blur'
    }">
                  <el-select v-model="item.level_id" style="width: 100%" @change="handleChangeLevel">
                    <el-option v-for="level in item.levelList" :key="level.level_id" :label="level.name"
                               :value="level.level_id"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label-width="0" :prop="'price.' + index + '.course_price'" :rules="{
      required: true, message: '请输入整本价格', trigger: 'blur'
    }">
                  <el-input-number style="width: 100%" v-model.number="item.course_price" controls-position="right" :precision="2"
                                   :min="0.01"/>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label-width="0" :prop="'price.' + index + '.unit_price'" :rules="{
      required: true, message: '请输入单元价格', trigger: 'blur'
    }">
                  <el-input-number style="width: 100%" v-model.number="item.unit_price" controls-position="right" :precision="2" :min="0.01"/>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelPrice(index)"
                >
                  删除
                </el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-form-item>
        <el-form-item label="是否启用：" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="平台公告：" prop="announcement">
          <el-input v-model="temp.announcement" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="详情" :visible.sync="dialogReadVisible" :footer="null" width="740px">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 620px; margin-left:30px;"
      >
        <el-form-item label="平台名称：">
          {{temp.name}}
        </el-form-item>
        <el-form-item label="平台接口地址：">
          {{temp.address}}
        </el-form-item>
        <el-form-item label="平台ID：">
          {{temp.platform_id}}
        </el-form-item>
        <el-form-item label="推送间隔(秒)：">
          {{temp.push_interval}}
        </el-form-item>
        <el-form-item label="开启单元查询：">
          {{temp.unit_query ? '是' : '否'}}
        </el-form-item>
        <el-form-item label="开启输入信息：">
          {{temp.allow_input ? '是' : '否'}}
        </el-form-item>
        <el-form-item label="开启延迟推送：">
          {{temp.delay_push ? '是' : '否'}}
        </el-form-item>
        <el-form-item label="等级价格：">
          <el-card :body-style="{padding:'5px'}">
            <div slot="header">
              <el-row type="flex" justify="center" align="center" :gutter="10">
                <el-col :span="8">代理等级</el-col>
                <el-col :span="8">整本价格</el-col>
                <el-col :span="8">单元价格</el-col>
              </el-row>
            </div>
            <el-row type="flex" justify="center" align="center" :gutter="10" v-for="(item,index) in temp.price" :key="item.level_id">
              <el-col :span="8">
                {{item.level_id}}
              </el-col>
              <el-col :span="8">
                {{item.course_price}}
              </el-col>
              <el-col :span="8">
                {{item.unit_price}}
              </el-col>
            </el-row>
          </el-card>
        </el-form-item>
        <el-form-item label="是否启用：">
          {{temp.status ? '是' : '否'}}
        </el-form-item>
        <el-form-item label="平台公告：">
          {{temp.announcement}}
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchPlatformList, fetchPlatform, createPlatform, updatePlatform} from '@/api/platform'
  import {fetchLevelList} from '@/api/level'
  import waves from '@/directive/waves' // waves directive
  import {parseTime, uuid} from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import _ from 'lodash'

  export default {
    name: 'Platform',
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
          status: undefined
        },
        statusList: ['正常', '异常'],
        temp: {
          name: '',
          address: '',
          platform_id: '',
          push_interval: undefined,
          price: [],
          unit_query: true,
          allow_input: true,
          delay_push: true,
          status: true,
          announcement: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        rules: {
          name: [{required: true, message: '请输入平台名称', trigger: 'blur'}],
          address: [{required: true, message: '请输入平台接口地址', trigger: 'blur'}],
          platform_id: [{required: true, message: '请输入平台ID', trigger: 'blur'}],
          push_interval: [{required: true, message: '请输入推送间隔时间', trigger: 'blur'}],
          unit_query: [{required: true, message: '请选择是否开启单元查询', trigger: 'blur'}],
          allow_input: [{required: true, message: '请选择是否开启输入信息', trigger: 'blur'}],
          delay_push: [{required: true, message: '请选择是否开启延迟推送', trigger: 'blur'}],
          status: [{required: true, message: '请选择是否启用', trigger: 'blur'}],
          announcement: [{required: true, message: '请输入平台公告', trigger: 'blur'}]
        },
        downloadLoading: false,
        dialogReadVisible: false,
        levelList: []
      }
    },
    created() {
      this.getList();
      this.getLevelList()
    },
    mounted() {

    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchPlatformList(this.listQuery).then(response => {
          this.list = response.data.list;
          this.total = response.data.total;
          this.listLoading = false;
        })
      },
      getLevelList() {
        fetchLevelList({
          page: 1,
          pageSize: 100,
          status: true
        }).then(response => {
          this.levelList = response.data.list;
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
          name: undefined,
          status: '所有'
        };
        this.getList()
      },
      handleAddPrice() {
        let levels = this.temp.price.map(o => o.level_id);
        let levelList = _.cloneDeep(this.levelList);
        if (levels.length !== 0) {
          levels.forEach(o => {
            let index = levelList.findIndex(l => l.level_id === o);
            index !== -1 && levelList.splice(index, 1);
          })
        }
        this.temp.price.push({
          levelList: levelList,
          level_id: undefined,
          course_price: undefined,
          unit_price: undefined,
          key: Date.now()
        })
      },
      handleDelPrice(index) {
        this.temp.price.splice(index, 1);
        this.handleChangeLevel()
      },
      handleChangeLevel() {
        let levels = this.temp.price.map(o => o.level_id);
        if (levels.length !== 0) {
          levels.forEach((o, i) => {
            let other = levels, levelList = _.cloneDeep(this.levelList);
            if (!!o) {
              other = _.cloneDeep(levels.filter(m => m !== o));
            }
            levelList = levelList.reduce((prev, cur) => {
              !other.includes(cur.level_id) && prev.push(cur);
              return prev
            }, []);
            this.temp.price[i].levelList = levelList;
          })
        }
      },
      resetTemp() {
        this.temp = {
          name: '',
          address: '',
          platform_id: '',
          push_interval: undefined,
          price: [],
          unit_query: true,
          allow_input: true,
          delay_push: true,
          status: true,
          announcement: ''
        }
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.price = this.temp.price.map(o => ({
              level_id: o.level_id,
              course_price: o.course_price,
              unit_price: o.unit_price,
            }));
            createPlatform(this.temp).then(() => {
              this.dialogFormVisible = false;
              this.$message({
                message: '新增成功',
                type: 'success'
              });
              this.getList();
            })
          }
        })
      },
      handleUpdate(row) {
        const {
          course_platform_id,
          name,
          address,
          platform_id,
          push_interval,
          price,
          unit_query,
          allow_input,
          delay_push,
          status,
          announcement
        } = row;
        this.temp = {
          course_platform_id,
          name,
          address,
          platform_id,
          push_interval,
          price: price.map(o => {
            return {...o,key:uuid()}
          }),
          unit_query,
          allow_input,
          delay_push,
          status,
          announcement
        }; // copy obj
        this.handleChangeLevel();
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let params = _.cloneDeep(this.temp);
            params.price = params.price.map(o => ({
              level_id: o.level_id,
              course_price: o.course_price,
              unit_price: o.unit_price,
            }));
            updatePlatform(params).then(() => {
              this.dialogFormVisible = false;
              this.$message({
                message: '更新成功',
                type: 'success'
              });
              this.getList();
            })
          }
        })
      },
      handleDetail(row) {
        /*fetchPlatform(row.id).then(response => {
          this.temp = response.data.pvData
        })*/
        this.temp = Object.assign({}, row);
        this.dialogReadVisible = true;
      },
      handleDelete(row) {

      },
      handleDownload() {
        this.downloadLoading = true;
        import('../../../vendor/Export2Excel').then(excel => {
          const tHeader = ['平台名称', '平台接口地址', '平台Id', '推送间隔', '课程单价', '单元价格'];
          const filterVal = ['name', 'address', 'platformId', 'pushInterval', 'coursePrice', 'unitPrice'];
          const data = this.formatJson(filterVal, this.list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '平台列表'
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
  /deep/ .el-card__header {
    padding: 5px;
    font-weight: 500;
    font-size: 14px;
  }
  /deep/ .el-form-item .el-form-item {
    margin-bottom: 20px;
  }
</style>
