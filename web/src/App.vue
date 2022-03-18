<template>
  <div id="app">
    <el-container class="el-container">
      <el-header>
        <el-col :span="5" style="background-color: #ffffff" :offset="1">
          <el-image :src="imgPath" fit="contain" style="width: 100%;height: auto"></el-image>
        </el-col>
        <el-col :span="17" :offset="1">
          <el-menu
            default-active="0"
            class="el-menu-demo"
            mode="horizontal"
            background-color="#FFFFFF"
            text-color="#303133"
            active-text-color="#409EFF">
            <el-menu-item index="0">
              <router-link :to="{name:'homeindex'}" style="text-decoration:none">
                <a href="#" style="text-decoration:none">主页</a>
              </router-link>
            </el-menu-item>
            <el-menu-item index="1">
              <router-link :to="{name:'BlogEdit'}" style="text-decoration:none">
                <a href="#" style="text-decoration:none">我的空间</a>
              </router-link>
            </el-menu-item>
            <el-menu-item index="2">
              <router-link :to="{name:'BlogView'}" style="text-decoration:none">
                <a href="#" style="text-decoration:none">博客论坛</a>
              </router-link>
            </el-menu-item>
            <el-menu-item index="3">
              <router-link :to="{name:'DataBase'}" style="text-decoration:none">
                <a href="#" style="text-decoration:none">数据获取</a>
              </router-link>
            </el-menu-item>
            <el-menu-item index="8">
              <router-link :to="{name:'CcDatabase'}" style="text-decoration:none">
                <a href="#" style="text-decoration:none">定标系数获取</a>
              </router-link>
            </el-menu-item>
            <el-menu-item index="4">
              <router-link :to="{name:'Download'}" style="text-decoration:none">
                <a href="#" style="text-decoration:none">下载中心</a>
              </router-link>
            </el-menu-item>
            <el-menu-item index="5">
              <router-link :to="{name:'Login'}" style="text-decoration:none">
                <a href="#" style="text-decoration:none">登录</a>
              </router-link>
            </el-menu-item>
            <el-menu-item index="6">
              <router-link :to="{name:'Register'}" style="text-decoration:none">
                <a href="#" style="text-decoration:none">注册</a>
              </router-link>
            </el-menu-item>
            <el-menu-item index="7">
              <a href="#" @click="logout" style="text-decoration:none">登出</a>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-header>
      <el-main style="min-height: calc(100vh - 150px);">
        <router-view></router-view>
      </el-main>
      <el-divider></el-divider>
      <el-footer>
        <el-row>
            <el-col :span="8">
              <h4>联系我们</h4>
              <a href="https://github.com/qxcnwu" style="text-decoration: None">作者主页</a>
              <br>
              <br>
              <div>联系电话：xxxxxxxx</div>
              <br>
              <div>地址：xxxxxxxxx</div>
              <br>
              <div></div>
            </el-col>
            <el-col :offset="1" :span="7">
              <h4>友情链接</h4>
              <a href="https://github.com/qxcnwu" style="text-decoration: None">sssa</a>
              <br>
              <br>
              <a href="https://github.com/qxcnwu" style="text-decoration: None">a主页</a>
              <br>
              <br>
              <a href="https://github.com/qxcnwu" style="text-decoration: None">b主页</a>
              <br>
              <div></div>
            </el-col>
            <el-col :offset="1" :span="7">
              <h4>加入我们</h4>
              <a href="https://github.com/qxcnwu" style="text-decoration: None">作者主页</a>
              <br>
              <br>
              <div>联系电话：xxxxxxxx</div>
              <br>
              <div>地址：xxxxxxxxx</div>
              <br>
              <div></div>
            </el-col>
          </el-row>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import img from '@/image/glad_logo8.png'
export default {
  name: 'App',
  data(){
    return {
      imgPath:img,
    }
  },
  methods: {
    logout() {
      this.$http.get('/api/user/logout').then((res) => {
        const temp = res.data.finish;
        //未登陆成功则刷新页面重新登录
        if (temp) {
          this.$router.push({name: 'homeindex'});
        } else {
          this.$notify({
            title: '提示',
            message: '登出失败'
          })
          this.$router.push({name: 'Login'});
        }
      });
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.el-container {
  min-height: 100vh;
}
</style>
