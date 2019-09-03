<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card header="基本资料">
            <el-tabs v-model="activeTab">
              <!--<el-tab-pane label="基本资料" name="profile">
                <account :user="user" />
              </el-tab-pane>-->
              <el-tab-pane label="修改密码" name="password">
                <password :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Password from './components/Password'
import Account from './components/Account'

export default {
  name: 'Profile',
  components: { UserCard, Password, Account },
  data() {
    return {
      user: {},
      activeTab: 'password'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'userInfo'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        level: this.userInfo.level_name,
        creator: this.userInfo.creator_name
      }
    }
  }
}
</script>
