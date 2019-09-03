<template>
  <div class="app-container">
    <el-button type="primary" @click="uploadImg">更换图片</el-button>
    <input v-show="false" ref="fileinput" type="file" @change="handleChange">
    <el-image
      style="width: 100%; height: 800px"
      :src="url"
      fit="contain"></el-image>
  </div>
</template>

<script>
  import {uploadFile} from "@/api/qiniu";

  export default {
    name: 'Banner',
    data() {
      return {
        url: process.env.VUE_APP_BACKEND + '/media/home.jpg',
      }
    },
    created() {

    },
    methods: {
      uploadImg() {
        this.$refs.fileinput.click()
      },
      handleChange(e) {
        e.preventDefault();
        const files = e.target.files || e.dataTransfer.files;
        if (this.checkFile(files[0])) {
          let file = files[0];
          //file.name = 'home.jpg';
          let formData = new FormData();
          formData.append('file', file, 'home.jpg');
          uploadFile(formData).then((res) => {
            if (res && res.data && res.data.attachment_uri) {
              //let url = process.env.VUE_APP_BACKEND + res.data.attachment_uri;
              this.url = process.env.VUE_APP_BACKEND + res.data.attachment_uri;
            } else {
              this.$message({
                message: '上传图片出错',
                type: 'error'
              })
            }
          }).catch(err => {
            this.$message({
              message: '上传图片出错',
              type: 'error'
            })
          });
        }
      },
      // 检测选择的文件是否合适
      checkFile(file) {
        if (file.type.indexOf('image') === -1) {
          this.$message({
            message: '请上传图片格式文件',
            type: 'warning'
          });
          return false
        }
        // 超出大小
        if (file.size / 1024 > 3096) {
          this.$message({
            message: '图片文件大小不能超过3MB',
            type: 'warning'
          });
          return false
        }
        return true
      },
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
