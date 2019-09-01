<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="filter-label">公告类型：</span>
      <el-select v-model="listQuery.type" placeholder="所有" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
<!--      <el-button v-waves class="filter-item" type="warning" icon="el-icon-refresh" @click="resetFilter">
        重置
      </el-button>-->
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
      <el-table-column label="公告类型" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.announcement_type === '1' ? '首页公告' : '用户手册' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公告内容">
        <template slot-scope="scope">
          <span v-html="scope.row.content">{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
<!--          <el-button
            size="mini"
            type="warning"
            @click="handleDetail(row)"
          >
            详情
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>
    <el-dialog destroy-on-close :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="900px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 800px; margin-left:30px;"
      >
        <el-form-item label="公告类型：" prop="announcement_type">
          <el-select v-model="temp.announcement_type" placeholder="所有" style="width: 120px" class="filter-item">
            <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="公告内容：" prop="content">
          <Tinymce ref="editor" v-model="temp.content" :value="temp.content" :height="400" />
          <!--<el-input v-model="temp.content" :autosize="{ minRows: 4, maxRows: 7}" type="textarea"/>-->
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
          {{temp.announcement}}
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchNoticeList, fetchNotice, createNotice, updateNotice} from '@/api/notice'
  import waves from '@/directive/waves' // waves directive
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import Tinymce from '@/components/Tinymce'

  export default {
    name: 'Notice',
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
          type: undefined
        },
        typeList: [
          {name:'首页公告',value:'1'},
          {name:'用户手册',value:'2'},
        ],
        temp: {
          announcement_type: '1',
          content: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        rules: {
          announcement_type: [{required: true, message: '请选择公告类型', trigger: 'blur'}],
          content: [{required: true, message: '请输入公告内容', trigger: 'blur'}]
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
        fetchNoticeList(this.listQuery).then(response => {
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
          type: undefined
        };
        this.getList()
      },
      resetTemp() {
        this.temp = {
          announcement_type: '1',
          content: ''
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
            createNotice(this.temp).then(() => {
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
          announcement_type,
          content
        } = row;
        this.temp = {
          announcement_type,
          content
        }; // copy obj
        console.log(this.temp)
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createNotice(this.temp).then(() => {
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
