<template>
  <el-form ref="dataForm" :model="user" :rules="rules" label-width="100px" label-position="left" style="width: 500px">
    <el-form-item label="用户昵称" prop="name">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="手机号码" prop="phone">
      <el-input v-model.trim="user.phone" />
    </el-form-item>
    <el-form-item label="用户邮箱" prop="email">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
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
  data(){
    return {
      rules: {
        name: [{required: true, trigger: 'change', message: '请输入用户昵称'}],
        phone: [{required: true, trigger: 'change', message: '请输入手机号码'}],
        email: [{required: true, trigger: 'change', message: '请输入用户邮箱'}],
      }
    }
  },
  methods: {
    submit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.user)
        }
      })
    }
  }
}
</script>
