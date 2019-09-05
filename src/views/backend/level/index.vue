<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="filter-label">等级名称：</span>
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
      <el-table-column label="等级名称" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级昵称" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级序号" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.level_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="首次充值金额" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.first_recharge }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值折扣率" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.refill_discount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下级返佣" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.commission}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.status ? '启用' : '禁用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级公告" min-width="200px">
        <template slot-scope="scope">
          <span v-html="scope.row.announcement">{{ scope.row.announcement }}</span>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="850px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 750px; margin-left:30px;"
      >
        <el-form-item label="等级名称：" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="等级昵称：" prop="nickname">
          <el-input v-model="temp.nickname"/>
        </el-form-item>
        <el-form-item label="等级序号：" prop="level_number">
          <el-input-number v-model.number="temp.level_number" controls-position="right" :precision="0" :min="0"/>
        </el-form-item>
        <el-form-item label="⾸次充值⾦额：" prop="first_recharge">
          <el-input-number v-model.number="temp.first_recharge" controls-position="right" :precision="2" :min="0"/>
        </el-form-item>
        <el-form-item label="充值折扣率：" prop="refill_discount">
          <el-input-number v-model.number="temp.refill_discount" controls-position="right" :precision="2" :min="0"/>
        </el-form-item>
        <el-form-item label="下级返佣：" prop="commission">
          <el-input-number v-model.number="temp.commission" controls-position="right" :precision="2" :min="0"/>
        </el-form-item>
        <el-form-item label="是否启用：" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="等级公告：" prop="announcement">
          <!--<el-input v-model="temp.announcement" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"/>-->
          <Tinymce ref="editor" v-model="temp.announcement" :value="temp.announcement" :height="400" />
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
    <el-dialog title="详情" :visible.sync="dialogReadVisible" :footer="null" width="600px">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 500px; margin-left:50px;"
      >
        <el-form-item label="等级名称：">
          {{temp.name}}
        </el-form-item>
        <el-form-item label="等级昵称：">
          {{temp.nickname}}
        </el-form-item>
        <el-form-item label="⾸次充值⾦额：">
          {{temp.first_recharge}}
        </el-form-item>
        <el-form-item label="充值折扣率：">
          {{temp.refill_discount}}
        </el-form-item>
        <el-form-item label="下级返佣：">
          {{temp.commission}}
        </el-form-item>
        <el-form-item label="是否启用：">
          {{temp.unit_query ? '是' : '否'}}
        </el-form-item>
        <el-form-item label="等级公告：">
          <span v-html="temp.announcement">{{temp.announcement}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchLevelList, fetchLevel, createLevel, updateLevel} from '@/api/level'
  import waves from '@/directive/waves' // waves directive
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import Tinymce from '@/components/Tinymce'

  export default {
    name: 'Level',
    components: {Pagination,Tinymce},
    directives: {waves},
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          pageSize: 10,
          name: undefined
        },
        temp: {
          name: '',
          nickname: '',
          level_number: undefined,
          first_recharge: undefined,
          refill_discount: undefined,
          commission: undefined,
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
          name: [{required: true, message: '请输入等级名称', trigger: 'blur'}],
          nickname: [{required: true, message: '请输入等级昵称', trigger: 'blur'}],
          level_number: [{required: true, message: '请输入等级序号', trigger: 'blur'}],
          first_recharge: [{required: true, message: '请输入⾸次充值⾦额', trigger: 'blur'}],
          refill_discount: [{required: true, message: '请输入充值折扣率', trigger: 'blur'}],
          commission: [{required: true, message: '请输入下级返佣', trigger: 'blur'}],
          status: [{required: true, message: '请选择是否启用', trigger: 'blur'}],
          announcement: [{required: true, message: '请输入等级公告', trigger: 'blur'}]
        },
        downloadLoading: false,
        dialogReadVisible: false
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
        fetchLevelList(this.listQuery).then(response => {
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
          name: undefined
        };
        this.getList()
      },
      resetTemp() {
        this.temp = {
          name: '',
          nickname: '',
          level_number: undefined,
          first_recharge: undefined,
          refill_discount: undefined,
          commission: undefined,
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
            createLevel(this.temp).then(() => {
              this.dialogFormVisible = false;
              this.$message({
                message: '新增成功',
                type: 'success'
              });
              this.getList()
            })
          }
        })
      },
      handleUpdate(row) {
        const {
          level_id,
          name,
          nickname,
          level_number,
          first_recharge,
          refill_discount,
          commission,
          status,
          announcement
        } = row;
        this.temp = {
          level_id,
          name,
          nickname,
          level_number,
          first_recharge,
          refill_discount,
          commission,
          status,
          announcement
        }; // copy obj
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            updateLevel(this.temp).then(() => {
              this.dialogFormVisible = false;
              this.$message({
                message: '更新成功',
                type: 'success'
              });
              this.getList()
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

</style>
