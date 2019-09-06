<template>
  <el-card style="margin-bottom:20px;" header="个人资料">
    <div class="user-profile">
      <div class="box-center">
        <!--<pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
        </pan-thumb>-->
        <svg-icon icon-class="profile" style="width: 100px;height: 100px;" />
      </div>
<!--      <div class="box-center">
        <el-button type="primary" class="text-center" @click="imagecropperShow=true">修改头像</el-button>
      </div>
      <image-cropper
        v-show="imagecropperShow"
        :key="imagecropperKey"
        url="https://httpbin.org/post"
        lang-type="zh"
        @close="close"
        @crop-upload-success="cropSuccess"
      />-->
    </div>

    <div class="user-info">
      <el-divider></el-divider>
      <el-row type="flex" justify="space-between" align="center">
        <el-col :span="8">
          <i class="el-icon-user-solid"></i>
          <span class="user-info-title">登录名称：</span>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <span class="user-info-content">{{user.name}}</span>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row type="flex" justify="space-between" align="center">
        <el-col :span="8">
          <i class="el-icon-user-solid"></i>
          <span class="user-info-title">用户等级：</span>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <span class="user-info-content">{{user.level}}</span>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row type="flex" justify="space-between" align="center">
        <el-col :span="8">
          <i class="el-icon-user-solid"></i>
          <span class="user-info-title">上级名称：</span>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <span class="user-info-content">{{user.creator}}</span>
        </el-col>
      </el-row>
      <el-divider></el-divider>
<!--      <el-row type="flex" justify="space-between" align="center">
        <el-col :span="8">
          <i class="el-icon-user-solid"></i>
          <span class="user-info-title">用户角色：</span>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <span class="user-info-content">{{user.role}}</span>
        </el-col>
      </el-row>
      <el-divider></el-divider>-->
    </div>
  </el-card>
</template>

<script>
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  export default {
    components: {ImageCropper, PanThumb},
    props: {
      user: {
        type: Object,
        default: () => {
          return {
            name: '',
            email: '',
            avatar: '',
            roles: ''
          }
        }
      }
    },
    data() {
      return {
        imagecropperShow: false,
        imagecropperKey: 0,
      }
    },
    methods: {
      cropSuccess(resData) {
        this.imagecropperShow = false;
        this.imagecropperKey = this.imagecropperKey + 1;
        this.user.avatar = resData
      },
      close() {
        this.imagecropperShow = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .box-center {
    margin: 0 auto;
    display: table;
  }

  .text-muted {
    color: #777;
  }

  .user-profile {
    .user-name {
      font-weight: bold;
    }

    .box-center {
      padding-top: 10px;
    }

    .user-role {
      padding-top: 10px;
      font-weight: 400;
      font-size: 14px;
    }

    .box-social {
      padding-top: 30px;

      .el-table {
        border-top: 1px solid #dfe6ec;
      }
    }

    .user-follow {
      padding-top: 20px;
    }
  }

  .user-info {
    margin-top: 20px;
    font-size: 14px;
    color: #606266;

    /deep/ .el-divider--horizontal {
      margin: 14px 0;
    }

    &-title {
      font-size: 14px;
    }

    &-content {
      font-size: 14px;
    }
  }

</style>
