<template>
  <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="100px" label-position="left"
           style="width: 500px">
    <el-form-item label="旧密码：" prop="oldPass">
      <el-input type="password" v-model.trim="dataForm.oldPass" autocomplete="off"/>
    </el-form-item>
    <el-form-item label="新密码：" prop="pass">
      <el-input type="password" v-model.trim="dataForm.pass" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认密码：" prop="checkPass">
      <el-input type="password" v-model.trim="dataForm.checkPass" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {resetPass} from '@/api/user'

  export default {
    props: {
      user: {
        type: Object,
        default: () => {
          return {
            name: '',
            email: ''
          }
        }
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    data() {
      const validateOldPass = (rule, value, callback) => {
        if (!value || value === '') {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      };
      const validatePassword = (rule, value, callback) => {
        if (!value || value === '') {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      };
      const validateCheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.dataForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        dataForm: {
          oldPass: '',
          pass: '',
          checkPass: ''
        },
        rules: {
          oldPass: [{required: true, trigger: 'change', validator: validateOldPass}],
          pass: [{required: true, trigger: 'change', validator: validatePassword}],
          checkPass: [{required: true, trigger: 'change', validator: validateCheckPass}],
        }
      }
    },
    methods: {
      submit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let data = {
              agent_id: this.userInfo.agent_id,
              old_password: this.dataForm.oldPass,
              new_password: this.dataForm.checkPass
            };
            resetPass(data).then(res => {
              this.$message({
                message: '修改密码成功',
                type: 'success'
              });
              this.$router.push({path: '/login'})
            })
          }
        })
      }
    }
  }
</script>
