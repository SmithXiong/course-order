<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="filter-label">平台名称：</span>
      <el-input
        v-model="listQuery.title"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <span class="filter-label">平台状态：</span>
      <el-select v-model="listQuery.status" placeholder="所有" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in statusList" :key="item" :label="item" :value="item" />
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
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item filter-right"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="平台ID" prop="id" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.platformId }}</span>
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
          <span>{{ scope.row.pushInterval }}</span>
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
      <el-table-column label="单元查询" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.unitQuery ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="输入信息" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.allowinput ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="延迟推送" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.DelayPush ? '是' : '否' }}</span>
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
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 500px; margin-left:50px;"
      >
        <el-form-item label="平台名称：" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="平台接口地址：" prop="address">
          <el-input v-model="temp.address" />
        </el-form-item>
        <el-form-item label="平台ID：" prop="platformId">
          <el-input v-model="temp.platformId" />
        </el-form-item>
        <el-form-item label="推送间隔(秒)：" prop="platformId">
          <el-input-number v-model.number="temp.pushInterval" controls-position="right" :precision="0" step-strictly :min="1" />
        </el-form-item>
        <el-form-item label="课程单价：" prop="coursePrice">
          <el-input-number v-model.number="temp.coursePrice" controls-position="right" :precision="1" :min="0.1" />
        </el-form-item>
        <el-form-item label="单元价格：" prop="unitPrice">
          <el-input-number v-model.number="temp.unitPrice" controls-position="right" :precision="1" :min="0.1" />
        </el-form-item>
        <el-form-item label="开启单元查询：" prop="unitQuery">
          <el-radio-group v-model="temp.unitQuery">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开启输入信息：" prop="unitQuery">
          <el-radio-group v-model="temp.allowinput">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开启延迟推送：" prop="unitQuery">
          <el-radio-group v-model="temp.DelayPush">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="平台公告：" prop="announcement">
          <el-input v-model="temp.announcement" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" />
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
  </div>
</template>

<script>
import { fetchList, fetchPlatform, createPlatform, updatePlatform } from '../../../api/platform'
import waves from '../../../directive/waves' // waves directive
import { parseTime } from '../../../utils'
import Pagination from '../../../components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Platform',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        title: undefined,
        status: '所有'
      },
      statusList: ['所有', '正常', '异常'],
      temp: {
        name: '',
        address: '',
        platformId: '',
        pushInterval: undefined,
        coursePrice: undefined,
        unitPrice: undefined,
        unitQuery: true,
        allowinput: true,
        DelayPush: true,
        announcement: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        name: [{ required: true, message: '请输入平台名称', trigger: 'change' }],
        address: [{ required: true, message: '请输入平台接口地址', trigger: 'change' }],
        platformId: [{ required: true, message: '请输入平台ID', trigger: 'blur' }],
        pushInterval: [{ required: true, message: '请输入推送间隔时间', trigger: 'blur' }],
        coursePrice: [{ required: true, message: '请输入课程单价', trigger: 'blur' }],
        unitPrice: [{ required: true, message: '请输入单元价格', trigger: 'blur' }],
        unitQuery: [{ required: true, message: '请选择是否开启单元查询', trigger: 'blur' }],
        allowinput: [{ required: true, message: '请选择是否开启输入信息', trigger: 'blur' }],
        DelayPush: [{ required: true, message: '请选择是否开启延迟推送', trigger: 'blur' }],
        announcement: [{ required: true, message: '请输入平台公告', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  mounted() {

  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.pageInfo.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetFilter() {
      this.listQuery = {
        page: 1,
        pageSize: 10,
        title: undefined,
        status: '所有'
      }
    },
    resetTemp() {
      this.temp = {
        name: '',
        address: '',
        platformId: '',
        pushInterval: 1,
        coursePrice: undefined,
        unitPrice: undefined,
        unitQuery: true,
        allowinput: true,
        DelayPush: true,
        announcement: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createPlatform(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$message({
              message: '新增成功',
              type: 'success'
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updatePlatform(this.temp).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$message({
              message: '更新成功',
              type: 'success'
            })
          })
        }
      })
    },
    handleDetail(row) {
      fetchPlatform(row.id).then(response => {
        this.temp = response.data.pvData
      })
    },
    handleDelete(row) {

    },
    handleDownload() {
      this.downloadLoading = true
        import('../../../vendor/Export2Excel').then(excel => {
          const tHeader = ['平台名称', '平台接口地址', '平台Id', '推送间隔', '课程单价', '单元价格']
          const filterVal = ['name', 'address', 'platformId', 'pushInterval', 'coursePrice', 'unitPrice']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '平台列表'
          })
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
