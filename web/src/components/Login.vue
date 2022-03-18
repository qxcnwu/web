<template>
  <div>
    <el-main>
      <el-row>'
        <el-col offset="6" :span="12">
          <el-form :model="formData" ref="vForm" :rules="rules" label-position="left" label-width="80px"
                   size="default" @submit.native.prevent>
            <el-form-item label="用户名" prop="用户名" class="required label-center-align">
              <el-input v-model="formData.用户名" type="text" clearable :minlength="6" :maxlength="12"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="密码" class="required label-center-align">
              <el-input v-model="formData.密码" type="text" clearable :minlength="6" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="人机验证" prop="人机验证" class="required label-center-align">
              <el-col>
                <Verify :bar-size="{width:'100%',height:'40px'}" @success="alertok(true)" @error="alertok(false)" :type="3" :showButton="false"></Verify>
              </el-col>
            </el-form-item>
          </el-form>
          <el-button style="width:50%;margin-bottom:15px;" type="primary" size="medium" @click="send">登录</el-button>
          <br>
          <router-link :to="{name:'Register'}" style="text-decoration:none">
            <a href="#" style="text-decoration:none">没有账号 立即注册</a>
          </router-link>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import Verify from "vue2-verify";

export default {
  name: "Login",
  data() {
    return {
      wrongmessage:'',
      formData: {
        用户名: "",
        密码: "",
      },
      rules: {
        用户名: [{
          required: true,
          message: '字段值不可为空',
        }],
        密码: [{
          required: true,
          message: '字段值不可为空',
        }],
      },
      human:false,
    }
  },
  methods:{
    send(){
      if(this.human){
        this.$http.get('/api/user/login',{
          params: {
            username: this.formData.用户名,
            password: this.formData.密码,
          }
        }).then((res)=>{
          const temp = res.data.data;
          //未登陆成功则刷新页面重新登录
          if(!temp && typeof(temp)!='undefined' && temp!==0){
            this.$notify({
              title: '提示',
              message: '用户名密码错误'
            })
          } else{
            this.$notify({
              title: '提示',
              message: '登陆成功'
            })
            this.$router.push({name:"homeindex"});
          }
        });
      }else{
        this.$notify({
          title: '提示',
          message: '请先进行人机验证'
        })
      }
    },
    alertok(text) {
      this.human=text;
    },
  },
  components: {
    Verify
  }
}
</script>

<style scoped>

</style>
